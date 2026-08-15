"use client";

import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";
import { OpportunityList } from "@/features/opportunities/components/opportunity-list";
import type { Opportunity } from "@/features/opportunities/types";
import {
  clearSavedOpportunities,
  selectSavedOpportunitiesHydrated,
  selectSavedOpportunityIds,
} from "@/features/saved/saved-opportunities-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type SavedOpportunitiesPageProps = {
  opportunities: Opportunity[];
};

export function SavedOpportunitiesPage({
  opportunities,
}: SavedOpportunitiesPageProps) {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(selectSavedOpportunitiesHydrated);
  const savedOpportunityIds = useAppSelector(selectSavedOpportunityIds);
  const opportunitiesById = new Map(
    opportunities.map((opportunity) => [opportunity.id, opportunity]),
  );
  const savedOpportunities = savedOpportunityIds
    .map((id) => opportunitiesById.get(id))
    .filter((opportunity): opportunity is Opportunity => Boolean(opportunity));
  const missingSavedCount = savedOpportunityIds.length - savedOpportunities.length;

  function clearAllSavedOpportunities() {
    if (
      window.confirm(
        "Remove all saved opportunities?",
      )
    ) {
      dispatch(clearSavedOpportunities());
    }
  }

  if (!hydrated) {
    return (
      <section
        aria-label="Saved opportunities loading"
        className="rounded-lg border border-border bg-card px-5 py-10 text-center"
      >
        <Bookmark aria-hidden="true" className="mx-auto size-8 text-muted" />
        <h2 className="mt-4 text-xl font-semibold text-primary">
          Loading saved opportunities
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          KaarYab is checking your saved opportunities.
        </p>
      </section>
    );
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
            {missingSavedCount > 0
              ? `${missingSavedCount} saved item no longer matches an available listing and is hidden.`
              : "Manage the opportunities you want to revisit."}
          </p>
        </div>
        <button
          type="button"
          onClick={clearAllSavedOpportunities}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-danger/30 bg-danger-soft px-4 py-2 text-sm font-semibold text-danger transition hover:bg-surface"
        >
          <Trash2 aria-hidden="true" className="size-4" />
          Clear all
        </button>
      </div>
    </div>
  );
}
