import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/ui";

export default function OpportunityNotFound() {
  return (
    <PageContainer>
      <section className="max-w-2xl rounded-lg border border-border bg-card p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">
          Opportunity not found
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-primary">
          This opportunity could not be found.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          The listing may not exist in the current fictional demo data, or the
          link may be incorrect.
        </p>
        <Link
          href="/opportunities"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-action px-4 py-2 text-sm font-semibold text-action-foreground transition hover:bg-action-hover"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to opportunities
        </Link>
      </section>
    </PageContainer>
  );
}
