"use client";

import { Provider } from "react-redux";
import { useSession } from "next-auth/react";
import { useEffect, useState, type ReactNode } from "react";
import {
  beginSavedOpportunitiesLoad,
  clearSavedOpportunities,
  markSavedOpportunitiesError,
  setSavedOpportunities,
} from "@/features/saved/saved-opportunities-slice";
import { useAppDispatch } from "@/store/hooks";
import { makeStore } from "@/store/store";

type SavedOpportunitiesReduxProviderProps = {
  children: ReactNode;
};

export function SavedOpportunitiesReduxProvider({
  children,
}: SavedOpportunitiesReduxProviderProps) {
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <SavedOpportunitiesSessionBridge>{children}</SavedOpportunitiesSessionBridge>
    </Provider>
  );
}

function SavedOpportunitiesSessionBridge({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const canUseSavedOpportunities = status === "authenticated" && userRole === "USER";

  useEffect(() => {
    if (!canUseSavedOpportunities || !userId) {
      dispatch(clearSavedOpportunities());
      return;
    }

    const accountKey = userId;
    const abortController = new AbortController();
    dispatch(beginSavedOpportunitiesLoad({ accountKey }));

    async function loadSavedOpportunities() {
      try {
        const response = await fetch("/api/saved", {
          cache: "no-store",
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load saved opportunities.");
        }

        const payload = (await response.json()) as {
          data?: { savedOpportunityIds?: unknown };
        };
        const ids = Array.isArray(payload.data?.savedOpportunityIds)
          ? payload.data.savedOpportunityIds.filter(
              (id): id is string => typeof id === "string",
            )
          : [];

        dispatch(setSavedOpportunities({ ids, accountKey }));
      } catch {
        if (abortController.signal.aborted) {
          return;
        }

        console.error("Saved opportunities sync failed.");
        dispatch(markSavedOpportunitiesError());
      }
    }

    void loadSavedOpportunities();

    return () => {
      abortController.abort();
    };
  }, [canUseSavedOpportunities, dispatch, userId]);

  return children;
}
