import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/ui";
import { OpportunityForm } from "@/features/opportunities/components/opportunity-form";
import { getOpportunityById } from "@/features/opportunities/data";
import { opportunityToFormValues } from "@/features/opportunities/form-utils";

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
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Opportunity management"
          title="Edit opportunity"
          description="Update the listing details, requirements, deadline, and application path."
        />
        <OpportunityForm
          mode="edit"
          opportunityId={opportunity.id}
          cancelHref={`/opportunities/${opportunity.id}`}
          defaultValues={opportunityToFormValues(opportunity)}
        />
      </div>
    </PageContainer>
  );
}
