import { registerInputSchema } from "@/features/auth/validation";

export type DemoAccountKind = "user" | "admin";

export type DemoAccount = {
  kind: DemoAccountKind;
  role: "USER" | "ADMIN";
  name: string;
  email: string;
  password: string;
};

export function getDemoAccountsFromEnv(
  env: Record<string, string | undefined>,
): DemoAccount[] {
  return [
    {
      kind: "user" as const,
      role: "USER" as const,
      name: env.DEMO_USER_NAME ?? "Demo User",
      email: env.DEMO_USER_EMAIL ?? "demo.user@example.com",
      password: env.DEMO_USER_PASSWORD ?? "DemoUserPassword123",
    },
    {
      kind: "admin" as const,
      role: "ADMIN" as const,
      name: env.DEMO_ADMIN_NAME ?? "Demo Admin",
      email: env.DEMO_ADMIN_EMAIL ?? "demo.admin@example.com",
      password: env.DEMO_ADMIN_PASSWORD ?? "DemoAdminPassword123",
    },
  ].map((account) => {
    const input = registerInputSchema.parse(account);

    return {
      ...account,
      ...input,
    };
  });
}

export function getDemoLoginFormValues(account: Pick<DemoAccount, "email" | "password">) {
  return {
    email: account.email,
    password: account.password,
  };
}
