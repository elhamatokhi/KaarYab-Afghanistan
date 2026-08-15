import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer, PageHeader } from "@/components/ui";
import { getI18n } from "@/i18n/server";
import { LoginForm } from "@/app/login/login-form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();

  return {
    title: `${t("auth.loginTitle")} | KaarYab Afghanistan`,
    description: t("auth.loginDescription"),
  };
}

export default async function LoginPage() {
  const demoAccounts = getDemoAccounts();
  const { t } = await getI18n();

  return (
    <PageContainer>
      <div className="mx-auto max-w-xl space-y-8">
        <PageHeader
          title={t("auth.loginTitle")}
          description={t("auth.loginDescription")}
        />
        <Suspense fallback={null}>
          <LoginForm demoAccounts={demoAccounts} />
        </Suspense>
      </div>
    </PageContainer>
  );
}

function getDemoAccounts() {
  return {
    user: {
      email: process.env.DEMO_USER_EMAIL ?? "demo.user@example.com",
      password:
        process.env.DEMO_USER_PASSWORD ??
        "DemoUserPassword123",
    },
    admin: {
      email: process.env.DEMO_ADMIN_EMAIL ?? "demo.admin@example.com",
      password:
        process.env.DEMO_ADMIN_PASSWORD ??
        "DemoAdminPassword123",
    },
  };
}
