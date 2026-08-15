import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/ui";
import { getI18n } from "@/i18n/server";
import { RegisterForm } from "@/app/register/register-form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();

  return {
    title: `${t("auth.registerTitle")} | KaarYab Afghanistan`,
    description: t("auth.registerDescription"),
  };
}

export default async function RegisterPage() {
  const { t } = await getI18n();

  return (
    <PageContainer>
      <div className="mx-auto max-w-xl space-y-8">
        <PageHeader
          title={t("auth.registerTitle")}
          description={t("auth.registerDescription")}
        />
        <RegisterForm />
      </div>
    </PageContainer>
  );
}
