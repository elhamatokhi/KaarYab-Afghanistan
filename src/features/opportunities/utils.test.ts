import { describe, expect, it } from "vitest";
import { CATEGORY_LABELS } from "@/features/opportunities/constants";
import { demoOpportunities } from "@/features/opportunities/demo-data";
import type { Opportunity } from "@/features/opportunities/types";
import {
  calculateCategoryDistribution,
  calculateDashboardStats,
  filterOpportunities,
  filterOpportunitiesBySearchQuery,
  findOpportunityById,
  getDaysUntilDeadline,
  getFeaturedOpportunities,
  isOpportunityExpired,
  isOpportunityExpiringSoon,
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

  it("matches search queries across important opportunity fields", () => {
    const results = filterOpportunitiesBySearchQuery(
      demoOpportunities,
      "spreadsheet",
    );

    expect(results.map((opportunity) => opportunity.id)).toEqual([
      "opp-remote-junior-data-assistant",
    ]);
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

  it("sorts by newest and closest deadline", () => {
    expect(sortOpportunities(demoOpportunities, "newest")[0]?.id).toBe(
      "opp-climate-storytelling-micro-grant",
    );
    expect(sortOpportunities(demoOpportunities, "closest-deadline")[0]?.id).toBe(
      "opp-junior-communications-officer",
    );
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
});
