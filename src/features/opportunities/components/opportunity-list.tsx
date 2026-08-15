"use client";

import { Search } from "lucide-react";
import { OpportunityCard } from "@/features/opportunities/components/opportunity-card";
import type { Opportunity } from "@/features/opportunities/types";
import { useI18n } from "@/i18n/client";

type OpportunityListProps = {
  opportunities: Opportunity[];
  heading?: string;
  countLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function OpportunityList({
  opportunities,
  heading,
  countLabel,
  emptyTitle,
  emptyDescription,
}: OpportunityListProps) {
  const { formatNumber, t } = useI18n();

  if (opportunities.length === 0) {
    return (
      <section
        aria-label={t("list.aria")}
        className="rounded-lg border border-border bg-card px-5 py-10 text-center"
      >
        <Search aria-hidden="true" className="mx-auto size-8 text-muted" />
        <h2 className="mt-4 text-xl font-semibold text-primary">
          {emptyTitle ?? t("list.emptyTitle")}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          {emptyDescription ?? t("list.emptyDescription")}
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="opportunity-results-heading">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id="opportunity-results-heading"
          className="text-2xl font-semibold text-primary"
        >
          {heading ?? t("list.defaultHeading")}
        </h2>
        <p className="text-sm text-muted">
          {countLabel ??
            t("list.showing", { count: formatNumber(opportunities.length) })}
        </p>
      </div>
      <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </section>
  );
}
