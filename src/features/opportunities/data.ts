import type { Opportunity as PrismaOpportunity } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  EMPLOYMENT_TYPES,
  OPPORTUNITY_CATEGORIES,
} from "@/features/opportunities/constants";
import type {
  EmploymentType,
  IsoDateString,
  Opportunity,
  OpportunityCategory,
  WorkMode,
} from "@/features/opportunities/types";

const WORK_MODE_FROM_PRISMA = {
  REMOTE: "remote",
  ONSITE: "onsite",
  HYBRID: "hybrid",
} as const satisfies Record<PrismaOpportunity["workMode"], WorkMode>;

export class OpportunityDataAccessError extends Error {
  constructor() {
    super("Unable to load opportunities.");
    this.name = "OpportunityDataAccessError";
  }
}

export async function getAllOpportunities() {
  return runOpportunityQuery(async () => {
    const opportunities = await prisma.opportunity.findMany({
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
    });

    return opportunities.map(mapPrismaOpportunityToOpportunity);
  });
}

export async function getOpportunityById(id: string) {
  return runOpportunityQuery(async () => {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
    });

    return opportunity ? mapPrismaOpportunityToOpportunity(opportunity) : null;
  });
}

export async function getFeaturedOpportunities(limit?: number) {
  return runOpportunityQuery(async () => {
    const opportunities = await prisma.opportunity.findMany({
      where: { featured: true },
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
      take: limit,
    });

    return opportunities.map(mapPrismaOpportunityToOpportunity);
  });
}

export function isOpportunityDataAccessError(error: unknown) {
  return error instanceof OpportunityDataAccessError;
}

function mapPrismaOpportunityToOpportunity(
  opportunity: PrismaOpportunity,
): Opportunity {
  return {
    id: opportunity.id,
    title: opportunity.title,
    organization: opportunity.organization,
    category: parseCategory(opportunity.category),
    location: opportunity.location,
    country: opportunity.country,
    workMode: WORK_MODE_FROM_PRISMA[opportunity.workMode],
    employmentType: parseEmploymentType(opportunity.employmentType),
    deadline: toIsoDateString(opportunity.deadline),
    description: opportunity.description,
    requirements: opportunity.requirements,
    applyLink: opportunity.applyLink,
    tags: opportunity.tags,
    featured: opportunity.featured,
    createdAt: toIsoDateString(opportunity.createdAt),
    updatedAt: toIsoDateString(opportunity.updatedAt),
  };
}

async function runOpportunityQuery<TResult>(
  query: () => Promise<TResult>,
): Promise<TResult> {
  try {
    return await query();
  } catch {
    console.error("Opportunity database query failed.");
    throw new OpportunityDataAccessError();
  }
}

function parseCategory(value: string): OpportunityCategory {
  if (
    OPPORTUNITY_CATEGORIES.some((category) => category.value === value)
  ) {
    return value as OpportunityCategory;
  }

  throw new Error("Invalid opportunity category in database record.");
}

function parseEmploymentType(value: string): EmploymentType {
  if (
    EMPLOYMENT_TYPES.some((employmentType) => employmentType.value === value)
  ) {
    return value as EmploymentType;
  }

  throw new Error("Invalid employment type in database record.");
}

function toIsoDateString(value: Date): IsoDateString {
  return value.toISOString() as IsoDateString;
}
