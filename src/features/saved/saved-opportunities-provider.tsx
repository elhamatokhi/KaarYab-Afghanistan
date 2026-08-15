"use client";

import { Provider } from "react-redux";
import { useEffect, useState, type ReactNode } from "react";
import {
  hydrateSavedOpportunities,
  parsePersistedSavedOpportunityIds,
  SAVED_OPPORTUNITIES_STORAGE_KEY,
  selectSavedOpportunitiesHydrated,
  selectSavedOpportunityIds,
} from "@/features/saved/saved-opportunities-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { makeStore } from "@/store/store";

type SavedOpportunitiesReduxProviderProps = {
  children: ReactNode;
  validOpportunityIds: string[];
};

export function SavedOpportunitiesReduxProvider({
  children,
  validOpportunityIds,
}: SavedOpportunitiesReduxProviderProps) {
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <SavedOpportunitiesStorageBridge validOpportunityIds={validOpportunityIds}>
        {children}
      </SavedOpportunitiesStorageBridge>
    </Provider>
  );
}

function SavedOpportunitiesStorageBridge({
  children,
  validOpportunityIds,
}: SavedOpportunitiesReduxProviderProps) {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(selectSavedOpportunitiesHydrated);
  const savedOpportunityIds = useAppSelector(selectSavedOpportunityIds);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(
      SAVED_OPPORTUNITIES_STORAGE_KEY,
    );
    const parsedIds = parsePersistedSavedOpportunityIds(
      storedValue,
      validOpportunityIds,
    );

    dispatch(hydrateSavedOpportunities(parsedIds));
  }, [dispatch, validOpportunityIds]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(
      SAVED_OPPORTUNITIES_STORAGE_KEY,
      JSON.stringify(savedOpportunityIds),
    );
  }, [hydrated, savedOpportunityIds]);

  return children;
}
