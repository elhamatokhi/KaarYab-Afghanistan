import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/ui";
import { requireAdminPage } from "@/features/auth/authorization";
import { OpportunityForm } from "@/features/opportunities/components/opportunity-form";
import { createBlankOpportunityFormValues } from "@/features/opportunities/form-utils";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Add opportunity | KaarYab Afghanistan",
  description:
    "Create a new job, internship, scholarship, course, training, remote work, or volunteer opportunity in KaarYab Afghanistan.",
};

export default async function AddOpportunityPage() {
  await requireAdminPage("/add-opportunity");
  const { t } = await getI18n();

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title={t("opportunityForm.addTitle")}
          description={t("opportunityForm.addDescription")}
        />
        <OpportunityForm
          mode="create"
          cancelHref="/opportunities"
          defaultValues={createBlankOpportunityFormValues()}
        />
      </div>
    </PageContainer>
  );
}
