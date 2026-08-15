import { Badge, PageContainer, PageHeader } from "@/components/ui";
import { OpportunityList } from "@/features/opportunities/components/opportunity-list";
import { demoOpportunities } from "@/features/opportunities/demo-data";

export default function OpportunitiesPage() {
  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="space-y-4">
          <Badge tone="warning">Fictional demonstration data</Badge>
          <PageHeader
            eyebrow="Opportunity discovery"
            title="Explore opportunities"
            description="Browse the current set of demo jobs, internships, scholarships, courses, remote roles, training programs, and volunteer opportunities prepared for the next listing phase."
          />
          <p className="max-w-3xl text-sm leading-6 text-muted">
            {demoOpportunities.length} demo opportunities are available. These
            listings are fictional and are included only to design and test the
            KaarYab Afghanistan experience.
          </p>
        </div>

        <OpportunityList opportunities={demoOpportunities} />
      </div>
    </PageContainer>
  );
}
