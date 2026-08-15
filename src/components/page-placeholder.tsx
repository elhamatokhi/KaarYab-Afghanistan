import { PageContainer, PageHeader } from "@/components/ui";

type PagePlaceholderProps = {
  title: string;
  description: string;
};

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <PageContainer>
      <PageHeader
        title={title}
        description={description}
      />
    </PageContainer>
  );
}
