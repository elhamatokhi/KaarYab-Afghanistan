import "dotenv/config";
import { getDemoAccountsFromEnv } from "../src/features/auth/demo-accounts";
import { provisionUser } from "../src/features/auth/users";

async function main() {
  const demoAccounts = getDemoAccountsFromEnv(process.env);

  for (const account of demoAccounts) {
    await provisionUser({
      name: account.name,
      email: account.email,
      password: account.password,
      role: account.role,
    });
  }

  console.log("Demo accounts are provisioned.");
}

main().catch((error) => {
  console.error("Demo account provisioning failed.");
  if (process.env.NODE_ENV !== "production") {
    console.error(error instanceof Error ? error.message : error);
  }
  process.exit(1);
});
