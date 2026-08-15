import Link from "next/link";
import { FilterX } from "lucide-react";
import { Badge, PageContainer, PageHeader } from "@/components/ui";
import { OpportunityFilterControls } from "@/app/opportunities/opportunity-filter-controls";
import { getAllOpportunities } from "@/features/opportunities/data";
import { OpportunityList } from "@/features/opportunities/components/opportunity-list";
import type { OpportunitySearchParams } from "@/features/opportunities/types";
import {
  DEFAULT_OPPORTUNITY_SORT,
  getFilteredAndSortedOpportunities,
  hasActiveOpportunityFilters,
  parseOpportunitySearchParams,
} from "@/features/opportunities/utils";

type OpportunitiesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OpportunitiesPage({
  searchParams,
}: OpportunitiesPageProps) {
  const parsedSearchParams = parseOpportunitySearchParams(await searchParams);
  const opportunities = await getOpportunitiesForPage();

  if (!opportunities) {
    return <OpportunityDataErrorPage />;
  }

  const filteredOpportunities = getFilteredAndSortedOpportunities(
    opportunities,
    parsedSearchParams,
  );
  const hasActiveFilters = hasActiveOpportunityFilters(
    parsedSearchParams.filters,
  ) || parsedSearchParams.sort !== DEFAULT_OPPORTUNITY_SORT;

  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="space-y-4">
          <Badge tone="accent">Opportunity discovery</Badge>
          <PageHeader
            eyebrow="Opportunity discovery"
            title="Explore opportunities"
            description="Browse jobs, internships, scholarships, courses, remote roles, training programs, and volunteer opportunities."
          />
          <p className="max-w-3xl text-sm leading-6 text-muted">
            {opportunities.length} opportunities are available.
          </p>
        </div>

        <OpportunityFiltersForm
          params={parsedSearchParams}
          hasActiveFilters={hasActiveFilters}
        />

        <OpportunityList
          opportunities={filteredOpportunities}
          heading="Opportunity results"
          countLabel={`Showing ${filteredOpportunities.length} of ${opportunities.length} listings`}
          emptyTitle="No matching opportunities"
          emptyDescription="No opportunities match the selected search, filters, and sorting options. Clear the filters or try a broader search."
        />
      </div>
    </PageContainer>
  );
}

async function getOpportunitiesForPage() {
  try {
    return await getAllOpportunities();
  } catch {
    return null;
  }
}

function OpportunityDataErrorPage() {
  return (
    <PageContainer>
      <section className="rounded-lg border border-border bg-card px-5 py-10 text-center">
        <h1 className="text-2xl font-semibold text-primary">
          Opportunities are temporarily unavailable
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          KaarYab could not load opportunity listings right now. Please try
          again later.
        </p>
      </section>
    </PageContainer>
  );
}

function OpportunityFiltersForm({
  hasActiveFilters,
  params,
}: {
  hasActiveFilters: boolean;
  params: OpportunitySearchParams;
}) {
  return (
    <section
      aria-labelledby="opportunity-filters-heading"
      className="rounded-lg border border-border bg-card p-5 sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="opportunity-filters-heading"
            className="text-xl font-semibold text-primary"
          >
            Search and filter
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Narrow the list by keyword, category, location, work mode, type, and
            deadline.
          </p>
        </div>
        {hasActiveFilters ? (
          <Link
            href="/opportunities"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary transition hover:bg-surface-elevated"
          >
            <FilterX aria-hidden="true" className="size-4" />
            Clear all filters
          </Link>
        ) : null}
      </div>

      <OpportunityFilterControls params={params} />
    </section>
  );
}
