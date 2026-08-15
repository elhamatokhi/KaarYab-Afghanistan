import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/features/auth/password";
import { registerInputSchema } from "../src/features/auth/validation";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to provision the admin user.");
}

const adminInput = registerInputSchema.parse({
  name: process.env.INITIAL_ADMIN_NAME ?? "KaarYab Admin",
  email: process.env.INITIAL_ADMIN_EMAIL,
  password: process.env.INITIAL_ADMIN_PASSWORD,
});

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await hashPassword(adminInput.password);

  await prisma.user.upsert({
    where: { email: adminInput.email },
    update: {
      name: adminInput.name,
      passwordHash,
      role: "ADMIN",
    },
    create: {
      name: adminInput.name,
      email: adminInput.email,
      passwordHash,
      role: "ADMIN",
    },
    select: { id: true },
  });

  console.log("Initial admin account is provisioned.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Admin provisioning failed.");
    if (process.env.NODE_ENV !== "production") {
      console.error(error instanceof Error ? error.message : error);
    }
    await prisma.$disconnect();
    process.exit(1);
  });
