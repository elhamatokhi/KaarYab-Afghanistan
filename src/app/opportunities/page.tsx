import Link from "next/link";
import { FilterX } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/ui";
import { OpportunityFilterControls } from "@/app/opportunities/opportunity-filter-controls";
import {
  getAllOpportunities,
  getOpportunityTranslations,
} from "@/features/opportunities/data";
import { localizeDemoOpportunities } from "@/features/opportunities/demo-localization";
import { OpportunityList } from "@/features/opportunities/components/opportunity-list";
import type { OpportunitySearchParams } from "@/features/opportunities/types";
import {
  DEFAULT_OPPORTUNITY_SORT,
  getFilteredAndSortedOpportunities,
  hasActiveOpportunityFilters,
  parseOpportunitySearchParams,
} from "@/features/opportunities/utils";
import { formatLocalizedNumber } from "@/i18n/format";
import { getI18n } from "@/i18n/server";

type OpportunitiesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OpportunitiesPage({
  searchParams,
}: OpportunitiesPageProps) {
  const parsedSearchParams = parseOpportunitySearchParams(await searchParams);
  const opportunities = await getOpportunitiesForPage();
  const { locale, t } = await getI18n();

  if (!opportunities) {
    return (
      <OpportunityDataErrorPage
        title={t("opportunities.unavailableTitle")}
        description={t("opportunities.unavailableDescription")}
      />
    );
  }

  const storedTranslations =
    locale === "en" ? {} : await getOpportunityTranslations(locale);
  const localizedOpportunities = localizeDemoOpportunities(
    opportunities,
    locale,
    storedTranslations,
  );
  const filteredOpportunities = getFilteredAndSortedOpportunities(
    localizedOpportunities,
    parsedSearchParams,
  );
  const hasActiveFilters = hasActiveOpportunityFilters(
    parsedSearchParams.filters,
  ) || parsedSearchParams.sort !== DEFAULT_OPPORTUNITY_SORT;

  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="space-y-4">
          <PageHeader
            title={t("opportunities.title")}
            description={t("opportunities.description")}
          />
          <p className="max-w-3xl text-sm leading-6 text-muted">
            {t("opportunities.available", {
              count: formatLocalizedNumber(opportunities.length, locale),
            })}
          </p>
        </div>

        <OpportunityFiltersForm
          params={parsedSearchParams}
          hasActiveFilters={hasActiveFilters}
          labels={{
            clear: t("common.clearAllFilters"),
            description: t("opportunities.filtersDescription"),
            title: t("opportunities.filtersTitle"),
          }}
        />

        <OpportunityList
          opportunities={filteredOpportunities}
          heading={t("opportunities.resultsHeading")}
          countLabel={t("opportunities.resultCount", {
            shown: formatLocalizedNumber(filteredOpportunities.length, locale),
            total: formatLocalizedNumber(opportunities.length, locale),
          })}
          emptyTitle={t("opportunities.emptyTitle")}
          emptyDescription={t("opportunities.emptyDescription")}
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

function OpportunityDataErrorPage({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <PageContainer>
      <section className="rounded-lg border border-border bg-card px-5 py-10 text-center">
        <h1 className="text-2xl font-semibold text-primary">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          {description}
        </p>
      </section>
    </PageContainer>
  );
}

function OpportunityFiltersForm({
  hasActiveFilters,
  labels,
  params,
}: {
  hasActiveFilters: boolean;
  labels: {
    clear: string;
    description: string;
    title: string;
  };
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
            {labels.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {labels.description}
          </p>
        </div>
        {hasActiveFilters ? (
          <Link
            href="/opportunities"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary transition hover:bg-surface-elevated"
          >
            <FilterX aria-hidden="true" className="size-4" />
            {labels.clear}
          </Link>
        ) : null}
      </div>

      <OpportunityFilterControls params={params} />
    </section>
  );
}
