import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPrisma = {
  opportunity: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  opportunityTranslation: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

describe("opportunity translation data access", () => {
  beforeEach(() => {
    mockPrisma.opportunity.findUnique.mockReset();
    mockPrisma.opportunity.update.mockReset();
    mockPrisma.opportunityTranslation.findMany.mockReset();
    mockPrisma.opportunityTranslation.findUnique.mockReset();
    mockPrisma.opportunityTranslation.upsert.mockReset();
  });

  it("persists locale-specific text without updating canonical text fields", async () => {
    const {
      updateOpportunityCanonicalSharedFields,
      upsertOpportunityTranslation,
    } = await import("@/features/opportunities/data");

    mockPrisma.opportunity.findUnique.mockResolvedValue({ id: "opp-demo" });
    mockPrisma.opportunity.update.mockResolvedValue({
      id: "opp-demo",
      title: "Canonical English title",
      organization: "Canonical English organization",
      category: "job",
      location: "Kabul",
      country: "Afghanistan",
      workMode: "REMOTE",
      employmentType: "full-time",
      deadline: new Date("2027-01-01T00:00:00.000Z"),
      description: "Canonical English description that should not be replaced.",
      requirements: ["Canonical requirement"],
      applyLink: "https://example.test/apply",
      tags: ["canonical"],
      featured: false,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    mockPrisma.opportunityTranslation.upsert.mockResolvedValue({
      opportunityId: "opp-demo",
      locale: "fa-AF",
      title: "عنوان ویرایش‌شده",
      organization: "نهاد ویرایش‌شده",
      location: "کابل",
      country: "افغانستان",
      description: "توضیحات ویرایش‌شده برای همین زبان.",
      requirements: ["شرط ویرایش‌شده"],
      tags: ["ویرایش‌شده"],
    });

    await updateOpportunityCanonicalSharedFields("opp-demo", {
      applyLink: "https://example.test/apply",
      category: "job",
      deadline: new Date("2027-01-01T00:00:00.000Z"),
      employmentType: "full-time",
      featured: false,
      workMode: "remote",
    });
    await upsertOpportunityTranslation({
      opportunityId: "opp-demo",
      locale: "fa-AF",
      input: {
        title: "عنوان ویرایش‌شده",
        organization: "نهاد ویرایش‌شده",
        location: "کابل",
        country: "افغانستان",
        description: "توضیحات ویرایش‌شده برای همین زبان.",
        requirements: ["شرط ویرایش‌شده"],
        tags: ["ویرایش‌شده"],
      },
    });

    expect(mockPrisma.opportunity.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({
          title: expect.anything(),
          description: expect.anything(),
          requirements: expect.anything(),
          tags: expect.anything(),
        }),
      }),
    );
    expect(mockPrisma.opportunityTranslation.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          opportunityId_locale: {
            locale: "fa-AF",
            opportunityId: "opp-demo",
          },
        },
        update: expect.objectContaining({
          title: "عنوان ویرایش‌شده",
        }),
      }),
    );
  });

  it("loads persisted translations by opportunity ID", async () => {
    const { getOpportunityTranslations } = await import(
      "@/features/opportunities/data"
    );

    mockPrisma.opportunityTranslation.findMany.mockResolvedValue([
      {
        opportunityId: "opp-demo",
        locale: "de",
        title: "Deutscher Titel",
        organization: "Deutsche Organisation",
        location: "Kabul",
        country: "Afghanistan",
        description: "Deutsche Beschreibung.",
        requirements: ["Deutsche Anforderung"],
        tags: ["deutsch"],
      },
    ]);

    await expect(getOpportunityTranslations("de")).resolves.toEqual({
      "opp-demo": {
        title: "Deutscher Titel",
        organization: "Deutsche Organisation",
        location: "Kabul",
        country: "Afghanistan",
        description: "Deutsche Beschreibung.",
        requirements: ["Deutsche Anforderung"],
        tags: ["deutsch"],
      },
    });
  });
});
