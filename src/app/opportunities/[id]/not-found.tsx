import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/ui";
import { getI18n } from "@/i18n/server";

export default async function OpportunityNotFound() {
  const { t } = await getI18n();

  return (
    <PageContainer>
      <section className="max-w-2xl rounded-lg border border-border bg-card p-6">
        <h1 className="text-3xl font-semibold text-primary">
          {t("details.notFoundTitle")}
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          {t("details.notFoundDescription")}
        </p>
        <Link
          href="/opportunities"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-action px-4 py-2 text-sm font-semibold text-action-foreground transition hover:bg-action-hover"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {t("details.back")}
        </Link>
      </section>
    </PageContainer>
  );
}
