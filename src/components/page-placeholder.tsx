import { PageContainer, PageHeader } from "@/components/ui";

type PagePlaceholderProps = {
  title: string;
  description: string;
};

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Phase 1 placeholder"
        title={title}
        description={description}
      />
    </PageContainer>
  );
}
