import type { Metadata } from "next";
import { Badge, PageContainer, PageHeader } from "@/components/ui";
import { demoOpportunities } from "@/features/opportunities/demo-data";
import { SavedOpportunitiesPage } from "@/features/saved/saved-opportunities-page";

export const metadata: Metadata = {
  title: "Saved opportunities | KaarYab Afghanistan",
  description:
    "Review opportunities you saved while using KaarYab Afghanistan.",
};

export default function SavedPage() {
  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="space-y-4">
          <Badge tone="accent">Saved list</Badge>
          <PageHeader
            eyebrow="Saved opportunities"
            title="Review opportunities you saved."
            description="Keep track of opportunities you want to revisit while browsing KaarYab."
          />
        </div>

        <SavedOpportunitiesPage opportunities={demoOpportunities} />
      </div>
    </PageContainer>
  );
}
