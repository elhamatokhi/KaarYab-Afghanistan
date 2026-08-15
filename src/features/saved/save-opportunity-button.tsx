"use client";

import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type MouseEvent } from "react";
import {
  removeOpportunity,
  saveOpportunity,
  selectIsOpportunitySaved,
  setSavedOpportunities,
} from "@/features/saved/saved-opportunities-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";

type SaveOpportunityButtonProps = {
  opportunityId: string;
  opportunityTitle: string;
  variant?: "compact" | "full";
};

export function SaveOpportunityButton({
  opportunityId,
  opportunityTitle,
  variant = "compact",
}: SaveOpportunityButtonProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { t } = useI18n();
  const [isPending, setIsPending] = useState(false);
  const isSaved = useAppSelector((state) =>
    selectIsOpportunitySaved(state, opportunityId),
  );
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  if (status === "loading" || (status === "authenticated" && userRole === "ADMIN")) {
    return null;
  }

  const label = isSaved
    ? t("bookmark.remove")
    : t("bookmark.save");

  async function toggleSaved(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (isPending) {
      return;
    }

    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(getReturnUrl())}`);
      return;
    }

    if (userRole !== "USER" || !userId) {
      return;
    }

    setIsPending(true);

    if (isSaved) {
      dispatch(removeOpportunity(opportunityId));
    } else {
      dispatch(saveOpportunity(opportunityId));
    }

    try {
      const response = await fetch(`/api/saved/${encodeURIComponent(opportunityId)}`, {
        method: isSaved ? "DELETE" : "POST",
      });

      if (!response.ok) {
        throw new Error("Saved opportunity request failed.");
      }

      const payload = (await response.json()) as {
        data?: { savedOpportunityIds?: unknown };
      };
      const ids = Array.isArray(payload.data?.savedOpportunityIds)
        ? payload.data.savedOpportunityIds.filter(
            (id): id is string => typeof id === "string",
          )
        : [];

      dispatch(setSavedOpportunities({ ids, accountKey: userId }));
    } catch {
      if (isSaved) {
        dispatch(saveOpportunity(opportunityId));
      } else {
        dispatch(removeOpportunity(opportunityId));
      }
    } finally {
      setIsPending(false);
    }
  }

  function getReturnUrl() {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <button
      type="button"
      aria-pressed={status === "authenticated" ? isSaved : false}
      aria-label={`${label}: ${opportunityTitle}`}
      title={label}
      disabled={isPending}
      onClick={toggleSaved}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-md border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action disabled:cursor-not-allowed disabled:opacity-60",
        isSaved
          ? "border-action bg-secondary-action text-secondary-action-foreground hover:bg-surface-elevated"
          : "border-border bg-surface text-primary hover:bg-surface-elevated",
        variant === "full" ? "sm:size-11" : "",
      )}
    >
      <Bookmark
        aria-hidden="true"
        className={cn("size-5", isSaved ? "fill-current" : "")}
      />
    </button>
  );
}
