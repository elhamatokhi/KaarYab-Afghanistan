"use client";

import { Bookmark } from "lucide-react";
import type { MouseEvent } from "react";
import {
  selectIsOpportunitySaved,
  selectSavedOpportunitiesHydrated,
  toggleOpportunity,
} from "@/features/saved/saved-opportunities-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
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
  const hydrated = useAppSelector(selectSavedOpportunitiesHydrated);
  const isSaved = useAppSelector((state) =>
    selectIsOpportunitySaved(state, opportunityId),
  );
  const label = isSaved
    ? "Remove from saved opportunities"
    : "Save opportunity";

  function toggleSaved(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    dispatch(toggleOpportunity(opportunityId));
  }

  return (
    <button
      type="button"
      aria-pressed={hydrated ? isSaved : undefined}
      aria-label={`${label}: ${opportunityTitle}`}
      title={label}
      disabled={!hydrated}
      onClick={toggleSaved}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-60",
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
