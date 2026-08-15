import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/ui";
import { requireAdminPage } from "@/features/auth/authorization";
import { OpportunityForm } from "@/features/opportunities/components/opportunity-form";
import {
  getOpportunityById,
  getOpportunityTranslation,
} from "@/features/opportunities/data";
import { localizeOpportunityForEdit } from "@/features/opportunities/demo-localization";
import { opportunityToFormValues } from "@/features/opportunities/form-utils";
import { getI18n } from "@/i18n/server";

type EditOpportunityPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditOpportunityPageProps): Promise<Metadata> {
  const { id } = await params;
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    return {
      title: "Edit opportunity | KaarYab Afghanistan",
      description: "Edit an opportunity in KaarYab Afghanistan.",
    };
  }

  return {
    title: `Edit ${opportunity.title} | KaarYab Afghanistan`,
    description: `Update listing details for ${opportunity.title}.`,
  };
}

export default async function EditOpportunityPage({
  params,
}: EditOpportunityPageProps) {
  const { id } = await params;
  await requireAdminPage(`/opportunities/${id}/edit`);
  const { locale, t } = await getI18n();
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  const translation =
    locale === "en" ? null : await getOpportunityTranslation(opportunity.id, locale);
  const localizedOpportunity =
    locale === "en" ? opportunity : localizeOpportunityForEdit(opportunity, locale);
  const formOpportunity = translation
    ? { ...opportunity, ...translation }
    : localizedOpportunity;

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title={t("opportunityForm.editTitle")}
          description={t("opportunityForm.editDescription")}
        />
        <OpportunityForm
          mode="edit"
          locale={locale}
          opportunityId={opportunity.id}
          cancelHref={`/opportunities/${opportunity.id}`}
          defaultValues={opportunityToFormValues(formOpportunity)}
        />
      </div>
    </PageContainer>
  );
}
