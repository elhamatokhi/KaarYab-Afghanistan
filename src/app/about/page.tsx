import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/ui";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();

  return {
    title: `${t("about.title")} | KaarYab Afghanistan`,
    description: t("about.description"),
  };
}

const providedKeys = [
  "about.provides.centralized",
  "about.provides.search",
  "about.provides.deadlines",
  "about.provides.saved",
  "about.provides.multilingual",
] as const;

const supportKeys = [
  "about.supports.students",
  "about.supports.graduates",
  "about.supports.jobSeekers",
  "about.supports.scholarshipApplicants",
  "about.supports.internshipSeekers",
  "about.supports.remoteSkillBuilders",
] as const;

export default async function AboutPage() {
  const { t } = await getI18n();

  return (
    <PageContainer>
      <div className="space-y-12">
        <PageHeader
          title={t("about.title")}
          description={t("about.description")}
        />

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
              {t("about.providesTitle")}
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
              {providedKeys.map((itemKey) => (
                <li key={itemKey} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-action"
                  />
                  <span>{t(itemKey)}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 sm:p-6">
          <h2 className="text-2xl font-semibold text-primary">
            {t("about.supportsTitle")}
          </h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted sm:grid-cols-2 lg:grid-cols-3">
            {supportKeys.map((itemKey) => (
              <li key={itemKey} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                />
                <span>{t(itemKey)}</span>
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
      </div>
    </PageContainer>
  );
}
