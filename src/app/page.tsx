import { Badge, LinkButton, PageContainer, PageHeader } from "@/components/ui";

export default function Home() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <Badge tone="accent">Capstone foundation</Badge>
        <PageHeader
          title="KaarYab Afghanistan"
          description="A first-phase foundation for an opportunity finder that will help Afghan youth discover jobs, internships, scholarships, online courses, remote work, training programs, and volunteer opportunities."
        />
        <div className="flex flex-wrap gap-3">
          <LinkButton href="/opportunities">
            View placeholder
          </LinkButton>
          <LinkButton href="/about" variant="secondary">
            About project
          </LinkButton>
        </div>
      </div>
    </PageContainer>
  );
}
