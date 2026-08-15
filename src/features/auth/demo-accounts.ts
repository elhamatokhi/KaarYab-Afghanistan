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
      email: env.DEMO_USER_EMAIL,
      password: env.DEMO_USER_PASSWORD,
    },
    {
      kind: "admin" as const,
      role: "ADMIN" as const,
      name: env.DEMO_ADMIN_NAME ?? "Demo Admin",
      email: env.DEMO_ADMIN_EMAIL,
      password: env.DEMO_ADMIN_PASSWORD,
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
