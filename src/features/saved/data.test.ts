import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getSavedOpportunityIdsForUser,
  removeSavedOpportunityForUser,
  saveOpportunityForUser,
} from "@/features/saved/data";

const mockPrisma = vi.hoisted(() => ({
  opportunity: {
    findUnique: vi.fn(),
  },
  savedOpportunity: {
    deleteMany: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

vi.mock("server-only", () => ({}));

describe("saved opportunities data access", () => {
  beforeEach(() => {
    mockPrisma.opportunity.findUnique.mockReset();
    mockPrisma.savedOpportunity.deleteMany.mockReset();
    mockPrisma.savedOpportunity.findMany.mockReset();
    mockPrisma.savedOpportunity.upsert.mockReset();
  });

  it("loads saved IDs only for the authenticated user", async () => {
    mockPrisma.savedOpportunity.findMany.mockResolvedValue([
      { opportunityId: "opp-1" },
    ]);

    await expect(getSavedOpportunityIdsForUser("user-a")).resolves.toEqual([
      "opp-1",
    ]);

    expect(mockPrisma.savedOpportunity.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-a" },
      }),
    );
  });

  it("saves for one user idempotently with a compound key", async () => {
    mockPrisma.opportunity.findUnique.mockResolvedValue({ id: "opp-1" });
    mockPrisma.savedOpportunity.upsert.mockResolvedValue({});
    mockPrisma.savedOpportunity.findMany.mockResolvedValue([
      { opportunityId: "opp-1" },
    ]);

    await expect(saveOpportunityForUser("user-a", "opp-1")).resolves.toEqual({
      status: "saved",
      savedOpportunityIds: ["opp-1"],
    });

    expect(mockPrisma.savedOpportunity.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_opportunityId: {
            userId: "user-a",
            opportunityId: "opp-1",
          },
        },
        create: {
          userId: "user-a",
          opportunityId: "opp-1",
        },
      }),
    );
  });

  it("does not save a missing opportunity", async () => {
    mockPrisma.opportunity.findUnique.mockResolvedValue(null);

    await expect(saveOpportunityForUser("user-a", "missing")).resolves.toEqual({
      status: "missing-opportunity",
    });

    expect(mockPrisma.savedOpportunity.upsert).not.toHaveBeenCalled();
  });

  it("unsaves only the authenticated user's relation", async () => {
    mockPrisma.opportunity.findUnique.mockResolvedValue({ id: "opp-1" });
    mockPrisma.savedOpportunity.deleteMany.mockResolvedValue({ count: 1 });
    mockPrisma.savedOpportunity.findMany.mockResolvedValue([]);

    await expect(
      removeSavedOpportunityForUser("user-a", "opp-1"),
    ).resolves.toEqual({
      status: "removed",
      savedOpportunityIds: [],
    });

    expect(mockPrisma.savedOpportunity.deleteMany).toHaveBeenCalledWith({
      where: {
        userId: "user-a",
        opportunityId: "opp-1",
      },
    });
  });
});
