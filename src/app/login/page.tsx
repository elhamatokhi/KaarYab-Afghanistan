import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer, PageHeader } from "@/components/ui";
import { LoginForm } from "@/app/login/login-form";

export const metadata: Metadata = {
  title: "Login | KaarYab Afghanistan",
  description: "Login to KaarYab Afghanistan with email and password.",
};

export default function LoginPage() {
  const demoAccounts = getDemoAccounts();

  return (
    <PageContainer>
      <div className="mx-auto max-w-xl space-y-8">
        <PageHeader
          eyebrow="Account access"
          title="Login"
          description="Use your email and password to access your KaarYab account."
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
