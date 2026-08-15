import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/ui";
import { RegisterForm } from "@/app/register/register-form";

export const metadata: Metadata = {
  title: "Register | KaarYab Afghanistan",
  description: "Create a KaarYab Afghanistan account with email and password.",
};

export default function RegisterPage() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-xl space-y-8">
        <PageHeader
          eyebrow="Create account"
          title="Register"
          description="Create a KaarYab account for normal public access. Admin access is provisioned separately."
        />
        <RegisterForm />
      </div>
    </PageContainer>
  );
}
