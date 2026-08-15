"use client";

import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { OpportunityList } from "@/features/opportunities/components/opportunity-list";
import type { Opportunity } from "@/features/opportunities/types";
import {
  removeOpportunity,
  selectSavedOpportunitiesStatus,
  selectSavedOpportunityIds,
  setSavedOpportunities,
} from "@/features/saved/saved-opportunities-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type SavedOpportunitiesPageProps = {
  accountKey: string;
  opportunities: Opportunity[];
};

export function SavedOpportunitiesPage({
  accountKey,
  opportunities,
}: SavedOpportunitiesPageProps) {
  const dispatch = useAppDispatch();
  const savedOpportunityIds = useAppSelector(selectSavedOpportunityIds);
  const savedStatus = useAppSelector(selectSavedOpportunitiesStatus);
  const [isClearing, setIsClearing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const initialIds = useMemo(
    () => opportunities.map((opportunity) => opportunity.id),
    [opportunities],
  );

  useEffect(() => {
    dispatch(setSavedOpportunities({ ids: initialIds, accountKey }));
  }, [accountKey, dispatch, initialIds]);

  const opportunitiesById = new Map(
    opportunities.map((opportunity) => [opportunity.id, opportunity]),
  );
  const activeSavedIds =
    savedStatus === "idle" ? initialIds : savedOpportunityIds;
  const savedOpportunities = activeSavedIds
    .map((id) => opportunitiesById.get(id))
    .filter((opportunity): opportunity is Opportunity => Boolean(opportunity));

  async function clearAllSavedOpportunities() {
    if (
      !window.confirm("Remove all saved opportunities?") ||
      isClearing ||
      activeSavedIds.length === 0
    ) {
      return;
    }

    setIsClearing(true);
    setErrorMessage("");

    try {
      await Promise.all(
        activeSavedIds.map(async (id) => {
          const response = await fetch(`/api/saved/${encodeURIComponent(id)}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Unable to clear saved opportunities.");
          }

          dispatch(removeOpportunity(id));
        }),
      );
    } catch {
      setErrorMessage("Saved opportunities could not be cleared right now.");
    } finally {
      setIsClearing(false);
    }
  }

  if (savedOpportunities.length === 0) {
    return (
      <section
        aria-label="Saved opportunities"
        className="rounded-lg border border-border bg-card px-5 py-10 text-center"
      >
        <Bookmark aria-hidden="true" className="mx-auto size-8 text-muted" />
        <h2 className="mt-4 text-xl font-semibold text-primary">
          No saved opportunities yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          Bookmark jobs, scholarships, internships, courses, and other
          opportunities to review them here later.
        </p>
        <Link
          href="/opportunities"
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-action px-4 py-2 text-sm font-semibold text-action-foreground transition hover:bg-action-hover"
        >
          Browse opportunities
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <OpportunityList
        opportunities={savedOpportunities}
        heading="Saved listings"
        countLabel={`Showing ${savedOpportunities.length} saved listings`}
      />

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary">
            {savedOpportunities.length} saved{" "}
            {savedOpportunities.length === 1 ? "opportunity" : "opportunities"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Manage the opportunities you want to revisit.
          </p>
          {errorMessage ? (
            <p className="mt-2 text-sm font-medium text-danger" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={clearAllSavedOpportunities}
          disabled={isClearing}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-danger/30 bg-danger-soft px-4 py-2 text-sm font-semibold text-danger transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 aria-hidden="true" className="size-4" />
          {isClearing ? "Clearing..." : "Clear all"}
        </button>
      </div>
    </div>
  );
}
