import { describe, expect, it } from "vitest";
import { CATEGORY_LABELS } from "@/features/opportunities/constants";
import { demoOpportunities } from "@/features/opportunities/demo-data";
import type { Opportunity } from "@/features/opportunities/types";
import {
  calculateCategoryDistribution,
  calculateDashboardStats,
  filterOpportunities,
  filterOpportunitiesByCategory,
  filterOpportunitiesByCountryOrLocation,
  filterOpportunitiesByDeadlineStatus,
  filterOpportunitiesByEmploymentType,
  filterOpportunitiesBySearchQuery,
  filterOpportunitiesByWorkMode,
  findOpportunityById,
  formatOpportunityDate,
  getDaysUntilDeadline,
  getFilteredAndSortedOpportunities,
  getFeaturedOpportunities,
  getRelatedOpportunities,
  isDemoApplyLink,
  isOpportunityExpired,
  isOpportunityExpiringSoon,
  parseOpportunitySearchParams,
  sortOpportunities,
} from "@/features/opportunities/utils";

const referenceDate = new Date("2026-08-15T12:00:00Z");

describe("opportunity utilities", () => {
  it("finds an opportunity by ID", () => {
    expect(
      findOpportunityById(
        demoOpportunities,
        "opp-frontend-web-development-internship",
      )?.title,
    ).toBe("Frontend Web Development Internship");

    expect(findOpportunityById(demoOpportunities, "missing-id")).toBeUndefined();
  });

  it("returns only featured opportunities", () => {
    const featuredOpportunities = getFeaturedOpportunities(demoOpportunities);

    expect(featuredOpportunities).toHaveLength(5);
    expect(featuredOpportunities.every((opportunity) => opportunity.featured)).toBe(
      true,
    );
  });

  it("matches search queries by title or organization", () => {
    const results = filterOpportunitiesBySearchQuery(
      demoOpportunities,
      "CodeBridge",
    );

    expect(results.map((opportunity) => opportunity.id)).toEqual([
      "opp-frontend-web-development-internship",
    ]);

    expect(
      filterOpportunitiesBySearchQuery(demoOpportunities, "spreadsheet"),
    ).toHaveLength(0);
  });

  it("applies individual category, location, work mode, and type filters", () => {
    expect(
      filterOpportunitiesByCategory(demoOpportunities, "scholarship").map(
        (opportunity) => opportunity.id,
      ),
    ).toEqual([
      "opp-women-in-stem-scholarship",
      "opp-undergraduate-access-grant",
    ]);

    expect(
      filterOpportunitiesByCountryOrLocation(demoOpportunities, "online").map(
        (opportunity) => opportunity.id,
      ),
    ).toEqual([
      "opp-remote-junior-data-assistant",
      "opp-frontend-web-development-internship",
      "opp-english-career-readiness-course",
      "opp-climate-storytelling-micro-grant",
    ]);

    expect(
      filterOpportunitiesByWorkMode(demoOpportunities, "hybrid").map(
        (opportunity) => opportunity.id,
      ),
    ).toEqual([
      "opp-youth-digital-skills-fellowship",
      "opp-junior-communications-officer",
      "opp-undergraduate-access-grant",
    ]);

    expect(
      filterOpportunitiesByEmploymentType(demoOpportunities, "contract").map(
        (opportunity) => opportunity.id,
      ),
    ).toEqual(["opp-remote-junior-data-assistant"]);
  });

  it("applies combined filters without mutating the original list", () => {
    const originalIds = demoOpportunities.map((opportunity) => opportunity.id);
    const results = filterOpportunities(
      demoOpportunities,
      {
        query: "data",
        category: "remote-work",
        countryOrLocation: "online",
        workMode: "remote",
        employmentType: "contract",
        deadlineStatus: "expiring-soon",
      },
      referenceDate,
    );

    expect(results.map((opportunity) => opportunity.id)).toEqual([
      "opp-remote-junior-data-assistant",
    ]);
    expect(demoOpportunities.map((opportunity) => opportunity.id)).toEqual(
      originalIds,
    );
  });

  it("calculates expired, expiring-soon, and days-until-deadline values", () => {
    const expiringSoonOpportunity = findOpportunityById(
      demoOpportunities,
      "opp-youth-digital-skills-fellowship",
    );
    const laterOpportunity = findOpportunityById(
      demoOpportunities,
      "opp-english-career-readiness-course",
    );
    const expiredOpportunity = {
      ...demoOpportunities[0],
      id: "expired-fixture",
      deadline: "2026-08-01T23:59:00Z",
    } satisfies Opportunity;

    expect(expiringSoonOpportunity).toBeDefined();
    expect(laterOpportunity).toBeDefined();

    expect(
      getDaysUntilDeadline(expiringSoonOpportunity!, referenceDate),
    ).toBe(8);
    expect(
      isOpportunityExpiringSoon(expiringSoonOpportunity!, referenceDate),
    ).toBe(true);
    expect(isOpportunityExpiringSoon(laterOpportunity!, referenceDate)).toBe(
      false,
    );
    expect(isOpportunityExpired(expiredOpportunity, referenceDate)).toBe(true);
  });

  it("filters by deadline status", () => {
    expect(
      filterOpportunitiesByDeadlineStatus(
        demoOpportunities,
        "expiring-soon",
        referenceDate,
      ).map((opportunity) => opportunity.id),
    ).toEqual([
      "opp-youth-digital-skills-fellowship",
      "opp-remote-junior-data-assistant",
      "opp-junior-communications-officer",
    ]);
  });

  it("sorts by newest and closest deadline", () => {
    expect(sortOpportunities(demoOpportunities, "newest")[0]?.id).toBe(
      "opp-climate-storytelling-micro-grant",
    );
    expect(sortOpportunities(demoOpportunities, "closest-deadline")[0]?.id).toBe(
      "opp-junior-communications-officer",
    );
  });

  it("parses valid query parameters and applies filtered sorting", () => {
    const params = parseOpportunitySearchParams({
      search: "Grant",
      category: "scholarship",
      location: "Pakistan",
      workMode: "hybrid",
      employmentType: "not-applicable",
      deadlineStatus: "active",
      sort: "newest",
    });

    expect(params).toEqual({
      filters: {
        query: "Grant",
        category: "scholarship",
        countryOrLocation: "Pakistan",
        workMode: "hybrid",
        employmentType: "not-applicable",
        deadlineStatus: "active",
      },
      sort: "newest",
    });
    expect(
      getFilteredAndSortedOpportunities(
        demoOpportunities,
        params,
        referenceDate,
      ).map((opportunity) => opportunity.id),
    ).toEqual(["opp-undergraduate-access-grant"]);
  });

  it("falls back safely for invalid query parameters", () => {
    expect(
      parseOpportunitySearchParams({
        search: [" communications ", "ignored"],
        category: "missing",
        location: " Kabul ",
        workMode: "virtual",
        employmentType: "permanent",
        deadlineStatus: "soon",
        sort: "oldest",
      }),
    ).toEqual({
      filters: {
        query: "communications",
        category: "all",
        countryOrLocation: "Kabul",
        workMode: "all",
        employmentType: "all",
        deadlineStatus: "all",
      },
      sort: "closest-deadline",
    });
  });

  it("calculates dashboard totals", () => {
    expect(calculateDashboardStats(demoOpportunities, referenceDate)).toEqual({
      total: 12,
      featured: 5,
      active: 12,
      expired: 0,
      expiringSoon: 3,
      remote: 4,
      countries: 4,
    });
  });

  it("calculates category distribution for every category", () => {
    expect(calculateCategoryDistribution(demoOpportunities)).toEqual([
      { category: "job", label: CATEGORY_LABELS.job, count: 2 },
      { category: "internship", label: CATEGORY_LABELS.internship, count: 1 },
      { category: "scholarship", label: CATEGORY_LABELS.scholarship, count: 2 },
      {
        category: "online-course",
        label: CATEGORY_LABELS["online-course"],
        count: 1,
      },
      { category: "remote-work", label: CATEGORY_LABELS["remote-work"], count: 1 },
      {
        category: "training-program",
        label: CATEGORY_LABELS["training-program"],
        count: 3,
      },
      {
        category: "volunteer-work",
        label: CATEGORY_LABELS["volunteer-work"],
        count: 2,
      },
    ]);
  });

  it("selects related opportunities deterministically", () => {
    const currentOpportunity = findOpportunityById(
      demoOpportunities,
      "opp-youth-digital-skills-fellowship",
    );

    expect(currentOpportunity).toBeDefined();
    expect(
      getRelatedOpportunities(demoOpportunities, currentOpportunity!).map(
        (opportunity) => opportunity.id,
      ),
    ).toEqual([
      "opp-agriculture-innovation-trainee",
      "opp-regional-peacebuilding-workshop",
      "opp-junior-communications-officer",
    ]);
  });

  it("formats opportunity dates in UTC", () => {
    expect(formatOpportunityDate("2026-08-22T23:59:00Z")).toBe("Aug 22, 2026");
  });

  it("detects reserved demo apply links", () => {
    expect(isDemoApplyLink("https://example.test/apply/demo")).toBe(true);
    expect(isDemoApplyLink("https://apply.example.org/listing")).toBe(false);
    expect(isDemoApplyLink("not a url")).toBe(false);
  });
});
