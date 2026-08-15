import "server-only";

import { prisma } from "@/lib/prisma";
import { mapPrismaOpportunityToOpportunity } from "@/features/opportunities/data";
import type { Opportunity } from "@/features/opportunities/types";

export class SavedOpportunitiesDataAccessError extends Error {
  constructor() {
    super("Unable to load saved opportunities.");
    this.name = "SavedOpportunitiesDataAccessError";
  }
}

export async function getSavedOpportunityIdsForUser(userId: string) {
  return runSavedOpportunityQuery(async () => {
    const savedOpportunities = await prisma.savedOpportunity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { opportunityId: true },
    });

    return savedOpportunities.map((saved) => saved.opportunityId);
  });
}

export async function getSavedOpportunitiesForUser(
  userId: string,
): Promise<Opportunity[]> {
  return runSavedOpportunityQuery(async () => {
    const savedOpportunities = await prisma.savedOpportunity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { opportunity: true },
    });

    return savedOpportunities.map((saved) =>
      mapPrismaOpportunityToOpportunity(saved.opportunity),
    );
  });
}

export async function saveOpportunityForUser(
  userId: string,
  opportunityId: string,
) {
  return runSavedOpportunityQuery(async () => {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      select: { id: true },
    });

    if (!opportunity) {
      return { status: "missing-opportunity" as const };
    }

    await prisma.savedOpportunity.upsert({
      where: {
        userId_opportunityId: {
          userId,
          opportunityId,
        },
      },
      update: {},
      create: {
        userId,
        opportunityId,
      },
    });

    return {
      status: "saved" as const,
      savedOpportunityIds: await getSavedOpportunityIdsForUser(userId),
    };
  });
}

export async function removeSavedOpportunityForUser(
  userId: string,
  opportunityId: string,
) {
  return runSavedOpportunityQuery(async () => {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      select: { id: true },
    });

    if (!opportunity) {
      return { status: "missing-opportunity" as const };
    }

    await prisma.savedOpportunity.deleteMany({
      where: {
        userId,
        opportunityId,
      },
    });

    return {
      status: "removed" as const,
      savedOpportunityIds: await getSavedOpportunityIdsForUser(userId),
    };
  });
}

export function isSavedOpportunitiesDataAccessError(error: unknown) {
  return error instanceof SavedOpportunitiesDataAccessError;
}

async function runSavedOpportunityQuery<TResult>(
  query: () => Promise<TResult>,
): Promise<TResult> {
  try {
    return await query();
  } catch {
    console.error("Saved opportunities database query failed.");
    throw new SavedOpportunitiesDataAccessError();
  }
}
