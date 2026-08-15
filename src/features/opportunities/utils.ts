import {
  DEADLINE_STATUSES,
  EMPLOYMENT_TYPES,
  EXPIRING_SOON_DAYS,
  OPPORTUNITY_CATEGORIES,
  OPPORTUNITY_SORT_OPTIONS,
  WORK_MODES,
} from "@/features/opportunities/constants";
import type {
  CategoryDistributionItem,
  DeadlineStatus,
  EmploymentType,
  Opportunity,
  OpportunityCategory,
  OpportunityDashboardStats,
  OpportunityFilters,
  OpportunitySearchParams,
  OpportunitySort,
  WorkMode,
} from "@/features/opportunities/types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
export const DEFAULT_OPPORTUNITY_SORT: OpportunitySort = "closest-deadline";

type RawSearchParams = Record<string, string | string[] | undefined>;

export function findOpportunityById(
  opportunities: Opportunity[],
  id: string,
): Opportunity | undefined {
  return opportunities.find((opportunity) => opportunity.id === id);
}

export function getFeaturedOpportunities(
  opportunities: Opportunity[],
): Opportunity[] {
  return opportunities.filter((opportunity) => opportunity.featured);
}

export function isOpportunityExpired(
  opportunity: Opportunity,
  referenceDate = new Date(),
): boolean {
  return parseIsoDate(opportunity.deadline).getTime() < referenceDate.getTime();
}

export function getDaysUntilDeadline(
  opportunity: Opportunity,
  referenceDate = new Date(),
): number {
  const differenceMs =
    parseIsoDate(opportunity.deadline).getTime() - referenceDate.getTime();

  return Math.ceil(differenceMs / MS_PER_DAY);
}

export function isOpportunityExpiringSoon(
  opportunity: Opportunity,
  referenceDate = new Date(),
  thresholdDays = EXPIRING_SOON_DAYS,
): boolean {
  const daysUntilDeadline = getDaysUntilDeadline(opportunity, referenceDate);

  return daysUntilDeadline >= 0 && daysUntilDeadline <= thresholdDays;
}

export function filterOpportunitiesBySearchQuery(
  opportunities: Opportunity[],
  query?: string,
): Opportunity[] {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return opportunities;
  }

  return opportunities.filter((opportunity) =>
    [opportunity.title, opportunity.organization]
      .map(normalizeSearchValue)
      .some((value) => value.includes(normalizedQuery)),
  );
}

export function filterOpportunitiesByCategory(
  opportunities: Opportunity[],
  category?: OpportunityFilters["category"],
): Opportunity[] {
  if (!category || category === "all") {
    return opportunities;
  }

  return opportunities.filter((opportunity) => opportunity.category === category);
}

export function filterOpportunitiesByCountryOrLocation(
  opportunities: Opportunity[],
  countryOrLocation?: string,
): Opportunity[] {
  const normalizedValue = normalizeSearchValue(countryOrLocation);

  if (!normalizedValue) {
    return opportunities;
  }

  return opportunities.filter((opportunity) =>
    [opportunity.country, opportunity.location]
      .map(normalizeSearchValue)
      .some((value) => value.includes(normalizedValue)),
  );
}

export function filterOpportunitiesByWorkMode(
  opportunities: Opportunity[],
  workMode?: OpportunityFilters["workMode"],
): Opportunity[] {
  if (!workMode || workMode === "all") {
    return opportunities;
  }

  return opportunities.filter((opportunity) => opportunity.workMode === workMode);
}

export function filterOpportunitiesByEmploymentType(
  opportunities: Opportunity[],
  employmentType?: OpportunityFilters["employmentType"],
): Opportunity[] {
  if (!employmentType || employmentType === "all") {
    return opportunities;
  }

  return opportunities.filter(
    (opportunity) => opportunity.employmentType === employmentType,
  );
}

export function filterOpportunitiesByDeadlineStatus(
  opportunities: Opportunity[],
  deadlineStatus?: OpportunityFilters["deadlineStatus"],
  referenceDate = new Date(),
): Opportunity[] {
  if (!deadlineStatus || deadlineStatus === "all") {
    return opportunities;
  }

  return opportunities.filter(
    (opportunity) =>
      getOpportunityDeadlineStatus(opportunity, referenceDate) === deadlineStatus,
  );
}

export function filterOpportunities(
  opportunities: Opportunity[],
  filters: OpportunityFilters,
  referenceDate = new Date(),
): Opportunity[] {
  return filterOpportunitiesByDeadlineStatus(
    filterOpportunitiesByEmploymentType(
      filterOpportunitiesByWorkMode(
        filterOpportunitiesByCountryOrLocation(
          filterOpportunitiesByCategory(
            filterOpportunitiesBySearchQuery(opportunities, filters.query),
            filters.category,
          ),
          filters.countryOrLocation,
        ),
        filters.workMode,
      ),
      filters.employmentType,
    ),
    filters.deadlineStatus,
    referenceDate,
  );
}

export function sortOpportunities(
  opportunities: Opportunity[],
  sort: OpportunitySort = DEFAULT_OPPORTUNITY_SORT,
): Opportunity[] {
  return [...opportunities].sort((firstOpportunity, secondOpportunity) => {
    if (sort === "closest-deadline") {
      return (
        parseIsoDate(firstOpportunity.deadline).getTime() -
        parseIsoDate(secondOpportunity.deadline).getTime()
      );
    }

    return (
      parseIsoDate(secondOpportunity.createdAt).getTime() -
      parseIsoDate(firstOpportunity.createdAt).getTime()
    );
  });
}

export function getFilteredAndSortedOpportunities(
  opportunities: Opportunity[],
  params: OpportunitySearchParams,
  referenceDate = new Date(),
): Opportunity[] {
  return sortOpportunities(
    filterOpportunities(opportunities, params.filters, referenceDate),
    params.sort,
  );
}

export function parseOpportunitySearchParams(
  searchParams: RawSearchParams,
): OpportunitySearchParams {
  return {
    filters: {
      query: getSingleSearchParam(searchParams.search),
      category: parseOption<OpportunityCategory>(
        getSingleSearchParam(searchParams.category),
        OPPORTUNITY_CATEGORIES.map((category) => category.value),
        "all",
      ),
      countryOrLocation:
        getSingleSearchParam(searchParams.location) ||
        getSingleSearchParam(searchParams.countryOrLocation),
      workMode: parseOption<WorkMode>(
        getSingleSearchParam(searchParams.workMode),
        WORK_MODES.map((workMode) => workMode.value),
        "all",
      ),
      employmentType: parseOption<EmploymentType>(
        getSingleSearchParam(searchParams.employmentType),
        EMPLOYMENT_TYPES.map((employmentType) => employmentType.value),
        "all",
      ),
      deadlineStatus: parseOption<DeadlineStatus>(
        getSingleSearchParam(searchParams.deadlineStatus),
        DEADLINE_STATUSES.map((status) => status.value),
        "all",
      ),
    },
    sort: parseRequiredOption<OpportunitySort>(
      getSingleSearchParam(searchParams.sort),
      OPPORTUNITY_SORT_OPTIONS.map((sortOption) => sortOption.value),
      DEFAULT_OPPORTUNITY_SORT,
    ),
  };
}

export function hasActiveOpportunityFilters(
  filters: OpportunitySearchParams["filters"],
): boolean {
  return Boolean(
    filters.query ||
      filters.countryOrLocation ||
      filters.category !== "all" ||
      filters.workMode !== "all" ||
      filters.employmentType !== "all" ||
      filters.deadlineStatus !== "all",
  );
}

export function getRelatedOpportunities(
  opportunities: Opportunity[],
  currentOpportunity: Opportunity,
  limit = 3,
): Opportunity[] {
  return opportunities
    .filter((opportunity) => opportunity.id !== currentOpportunity.id)
    .map((opportunity) => ({
      opportunity,
      score: getRelatedOpportunityScore(opportunity, currentOpportunity),
    }))
    .filter((result) => result.score > 0)
    .sort((firstResult, secondResult) => {
      if (secondResult.score !== firstResult.score) {
        return secondResult.score - firstResult.score;
      }

      return (
        parseIsoDate(secondResult.opportunity.createdAt).getTime() -
        parseIsoDate(firstResult.opportunity.createdAt).getTime()
      );
    })
    .slice(0, limit)
    .map((result) => result.opportunity);
}

export function calculateDashboardStats(
  opportunities: Opportunity[],
  referenceDate = new Date(),
): OpportunityDashboardStats {
  const countryCount = new Set(
    opportunities.map((opportunity) => opportunity.country),
  ).size;

  return {
    total: opportunities.length,
    featured: getFeaturedOpportunities(opportunities).length,
    active: opportunities.filter(
      (opportunity) => !isOpportunityExpired(opportunity, referenceDate),
    ).length,
    expired: opportunities.filter((opportunity) =>
      isOpportunityExpired(opportunity, referenceDate),
    ).length,
    expiringSoon: opportunities.filter((opportunity) =>
      isOpportunityExpiringSoon(opportunity, referenceDate),
    ).length,
    remote: opportunities.filter(
      (opportunity) => opportunity.workMode === "remote",
    ).length,
    countries: countryCount,
  };
}

export function calculateCategoryDistribution(
  opportunities: Opportunity[],
): CategoryDistributionItem[] {
  return OPPORTUNITY_CATEGORIES.map((category) => ({
    category: category.value,
    label: category.label,
    count: opportunities.filter(
      (opportunity) => opportunity.category === category.value,
    ).length,
  }));
}

export function getOpportunityDeadlineStatus(
  opportunity: Opportunity,
  referenceDate = new Date(),
): DeadlineStatus {
  if (isOpportunityExpired(opportunity, referenceDate)) {
    return "expired";
  }

  if (isOpportunityExpiringSoon(opportunity, referenceDate)) {
    return "expiring-soon";
  }

  return "active";
}

export function formatOpportunityDate(
  value: Opportunity["deadline"] | Opportunity["createdAt"],
) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseIsoDate(value));
}

export function isDemoApplyLink(applyLink: Opportunity["applyLink"]) {
  try {
    return new URL(applyLink).hostname.endsWith(".test");
  } catch {
    return false;
  }
}

function normalizeSearchValue(value = "") {
  return value.trim().toLowerCase();
}

function getSingleSearchParam(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;

  return rawValue?.trim() ?? "";
}

function parseOption<TOption extends string>(
  value: string,
  allowedValues: readonly TOption[],
  fallback: TOption | "all",
) {
  if (!value || value === "all") {
    return fallback;
  }

  return allowedValues.includes(value as TOption) ? (value as TOption) : fallback;
}

function parseRequiredOption<TOption extends string>(
  value: string,
  allowedValues: readonly TOption[],
  fallback: TOption,
) {
  return allowedValues.includes(value as TOption) ? (value as TOption) : fallback;
}

function getRelatedOpportunityScore(
  opportunity: Opportunity,
  currentOpportunity: Opportunity,
) {
  const sharedTagCount = opportunity.tags.filter((tag) =>
    currentOpportunity.tags.includes(tag),
  ).length;

  return (
    (opportunity.category === currentOpportunity.category ? 3 : 0) +
    (opportunity.workMode === currentOpportunity.workMode ? 1 : 0) +
    sharedTagCount
  );
}

function parseIsoDate(value: Opportunity["deadline"] | Opportunity["createdAt"]) {
  return new Date(value);
}
