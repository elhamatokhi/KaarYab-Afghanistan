import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/ui";
import { OpportunityForm } from "@/features/opportunities/components/opportunity-form";
import { createBlankOpportunityFormValues } from "@/features/opportunities/form-utils";

export const metadata: Metadata = {
  title: "Add opportunity | KaarYab Afghanistan",
  description:
    "Create a new job, internship, scholarship, course, training, remote work, or volunteer opportunity in KaarYab Afghanistan.",
};

export default function AddOpportunityPage() {
  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Opportunity management"
          title="Add opportunity"
          description="Share the core listing details so visitors can understand the opportunity, deadline, requirements, and application path."
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
