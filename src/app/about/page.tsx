import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LinkButton, PageContainer, PageHeader } from "@/components/ui";
import { OPPORTUNITY_CATEGORIES } from "@/features/opportunities/constants";
import { CATEGORY_MESSAGE_KEYS } from "@/i18n/options";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();

  return {
    title: `${t("about.badge")} | KaarYab Afghanistan`,
    description: t("about.description"),
  };
}

const principleKeys = [
  "about.principle.clear",
  "about.principle.responsive",
  "about.principle.deadlines",
  "about.principle.simple",
] as const;

const futureVisionKeys = [
  "about.future.database",
  "about.future.filters",
  "about.future.saved",
  "about.future.forms",
  "about.future.dashboard",
] as const;

export default async function AboutPage() {
  const { t } = await getI18n();

  return (
    <PageContainer>
      <div className="space-y-12">
        <div className="space-y-4">
          <PageHeader
            title={t("about.title")}
            description={t("about.description")}
          />
        </div>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-lg border border-border bg-card p-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-primary">
              {t("about.problemTitle")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              {t("about.problemDescription")}
            </p>
          </article>
          <article className="rounded-lg border border-border bg-card p-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-primary">
              {t("about.solutionTitle")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              {t("about.solutionDescription")}
            </p>
          </article>
        </section>

        <section aria-labelledby="supported-categories-heading" className="space-y-5">
          <div className="max-w-2xl">
            <h2
              id="supported-categories-heading"
              className="text-2xl font-semibold text-primary"
            >
              {t("about.categoriesTitle")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {t("about.categoriesDescription")}
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {OPPORTUNITY_CATEGORIES.map((category) => (
              <li key={category.value}>
                <Link
                  href={`/opportunities?category=${category.value}`}
                  className="flex min-h-16 items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-primary transition hover:border-action/50 hover:bg-surface"
                >
                  {t(CATEGORY_MESSAGE_KEYS[category.value])}
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted rtl-flip" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-warning/30 bg-warning-soft p-5 sm:p-6">
          <h2 className="text-2xl font-semibold text-warning-foreground">
            {t("about.demoTitle")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-warning-foreground">
            {t("about.demoDescription")}
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article>
            <h2 className="text-2xl font-semibold text-primary">
              {t("about.principles")}
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
              {principleKeys.map((principleKey) => (
                <li key={principleKey} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-action"
                  />
                  <span>{t(principleKey)}</span>
                </li>
              ))}
            </ul>
          </article>
          <article>
            <h2 className="text-2xl font-semibold text-primary">
              {t("about.future")}
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
              {futureVisionKeys.map((itemKey) => (
                <li key={itemKey} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <span>{t(itemKey)}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 sm:p-6">
          <h2 className="text-2xl font-semibold text-primary">
            {t("about.exploreTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            {t("about.exploreDescription")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/opportunities">{t("about.viewOpportunities")}</LinkButton>
            <LinkButton href="/contact" variant="secondary">
              {t("common.contact")}
            </LinkButton>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
