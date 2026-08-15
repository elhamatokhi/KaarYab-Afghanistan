import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { WORK_MODE_TO_PRISMA } from "../src/features/opportunities/constants";
import { demoOpportunities } from "../src/features/opportunities/demo-data";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.opportunity.deleteMany();
  await prisma.opportunity.createMany({
    data: demoOpportunities.map((opportunity) => ({
      id: opportunity.id,
      title: opportunity.title,
      organization: opportunity.organization,
      category: opportunity.category,
      location: opportunity.location,
      country: opportunity.country,
      workMode: WORK_MODE_TO_PRISMA[opportunity.workMode],
      employmentType: opportunity.employmentType,
      deadline: new Date(opportunity.deadline),
      description: opportunity.description,
      requirements: opportunity.requirements,
      applyLink: opportunity.applyLink,
      tags: opportunity.tags,
      featured: opportunity.featured,
      createdAt: new Date(opportunity.createdAt),
      updatedAt: new Date(opportunity.updatedAt),
    })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
