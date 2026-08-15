import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ExternalLink,
  Globe2,
  MapPin,
  Pencil,
  Star,
} from "lucide-react";
import { Badge, PageContainer } from "@/components/ui";
import { getCurrentUserRole, isAdminRole } from "@/features/auth/authorization";
import { DeadlineStatusBadge } from "@/features/opportunities/components/deadline-status-badge";
import { OpportunityList } from "@/features/opportunities/components/opportunity-list";
import {
  getAllOpportunities,
  getOpportunityById,
  getOpportunityTranslation,
  getOpportunityTranslations,
  isOpportunityDataAccessError,
} from "@/features/opportunities/data";
import {
  localizeDemoOpportunities,
  localizeDemoOpportunity,
} from "@/features/opportunities/demo-localization";
import { SaveOpportunityButton } from "@/features/saved/save-opportunity-button";
import {
  getOpportunityDeadlineStatus,
  getRelatedOpportunities,
} from "@/features/opportunities/utils";
import { formatLocalizedDate } from "@/i18n/format";
import {
  CATEGORY_MESSAGE_KEYS,
  EMPLOYMENT_TYPE_MESSAGE_KEYS,
  WORK_MODE_MESSAGE_KEYS,
} from "@/i18n/options";
import { getI18n } from "@/i18n/server";

type OpportunityDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: OpportunityDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { locale } = await getI18n();
  const opportunity = await getOpportunityMetadataById(id);

  if (!opportunity) {
    return {
      title: "KaarYab Afghanistan",
      description: "KaarYab Afghanistan",
    };
  }

  const storedTranslation =
    locale === "en" ? null : await getOpportunityTranslation(opportunity.id, locale);
  const localizedOpportunity = localizeDemoOpportunity(
    opportunity,
    locale,
    storedTranslation,
  );

  return {
    title: `${localizedOpportunity.title} | KaarYab Afghanistan`,
    description: localizedOpportunity.description,
  };
}

export default async function OpportunityDetailPage({
  params,
}: OpportunityDetailPageProps) {
  const { id } = await params;
  const data = await getOpportunityDetailData(id);
  const { locale, t } = await getI18n();

  if (data.status === "error") {
    return (
      <OpportunityDataErrorPage
        title={t("details.unavailableTitle")}
        description={t("details.unavailableDescription")}
      />
    );
  }

  if (!data.opportunity) {
    notFound();
  }

  const storedTranslations =
    locale === "en" ? {} : await getOpportunityTranslations(locale);
  const opportunity = localizeDemoOpportunity(
    data.opportunity,
    locale,
    storedTranslations[data.opportunity.id],
  );
  const opportunities = localizeDemoOpportunities(
    data.opportunities,
    locale,
    storedTranslations,
  );

  const relatedOpportunities = getRelatedOpportunities(
    opportunities,
    opportunity,
  );
  const isExpired = getOpportunityDeadlineStatus(opportunity) === "expired";
  const userRole = await getCurrentUserRole();
  const canManageOpportunities = isAdminRole(userRole);

  return (
    <PageContainer>
      <div className="space-y-8">
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-action hover:text-action-hover"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {t("details.back")}
        </Link>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <article className="min-w-0 space-y-8">
            <header className="rounded-lg border border-border bg-card p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="accent">
                  {t(CATEGORY_MESSAGE_KEYS[opportunity.category])}
                </Badge>
                {opportunity.featured ? (
                  <Badge tone="warning">
                    <span className="inline-flex items-center gap-1.5">
                      <Star aria-hidden="true" className="size-3.5" />
                      {t("common.featured")}
                    </span>
                  </Badge>
                ) : null}
              </div>

              <div className="mt-5 min-w-0">
                <h1 className="text-3xl font-semibold leading-tight text-primary sm:text-4xl">
                  {opportunity.title}
                </h1>
                <p className="mt-3 flex min-w-0 items-start gap-2 text-base text-muted">
                  <Building2
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0"
                  />
                  <span className="break-words">{opportunity.organization}</span>
                </p>
              </div>

              <dl className="mt-6 grid gap-4 border-t border-border pt-6 text-sm text-muted sm:grid-cols-2">
                <SummaryItem
                  icon={<MapPin aria-hidden="true" className="size-4" />}
                  label={t("details.summary.location")}
                  value={`${opportunity.location}, ${opportunity.country}`}
                />
                <SummaryItem
                  icon={<Globe2 aria-hidden="true" className="size-4" />}
                  label={t("details.summary.workMode")}
                  value={t(WORK_MODE_MESSAGE_KEYS[opportunity.workMode])}
                />
                <SummaryItem
                  icon={
                    <BriefcaseBusiness aria-hidden="true" className="size-4" />
                  }
                  label={t("details.summary.type")}
                  value={t(EMPLOYMENT_TYPE_MESSAGE_KEYS[opportunity.employmentType])}
                />
                <SummaryItem
                  icon={<CalendarDays aria-hidden="true" className="size-4" />}
                  label={t("details.summary.published")}
                  value={formatLocalizedDate(opportunity.createdAt, locale)}
                />
              </dl>
            </header>

            <section className="rounded-lg border border-border bg-card p-5 sm:p-6">
              <h2 className="text-2xl font-semibold text-primary">
                {t("details.overview")}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                {t("details.overviewHelp")}
              </p>
              <p className="mt-5 text-base leading-8 text-primary">
                {opportunity.description}
              </p>
              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted">
                {t("common.tags")}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label={t("card.tags")}>
                {opportunity.tags.map((tag) => (
                  <li
                    key={tag}
                    className="max-w-full rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-muted"
                  >
                    <span className="break-words">{tag}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-labelledby="requirements-heading"
              className="rounded-lg border border-border bg-card p-5 sm:p-6"
            >
              <h2
                id="requirements-heading"
                className="text-2xl font-semibold text-primary"
              >
                {t("details.requirements")}
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
                {opportunity.requirements.map((requirement) => (
                  <li key={requirement} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-action"
                    />
                    <span className="break-words">{requirement}</span>
                  </li>
                ))}
              </ul>
            </section>
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24">
            {!canManageOpportunities ? (
              <section
                aria-labelledby="save-opportunity-heading"
                className="rounded-lg border border-border bg-card p-5"
              >
                <h2
                  id="save-opportunity-heading"
                  className="text-xl font-semibold text-primary"
                >
                  {t("details.bookmark")}
                </h2>
                <div className="mt-4">
                  <SaveOpportunityButton
                    opportunityId={opportunity.id}
                    opportunityTitle={opportunity.title}
                    variant="full"
                  />
                </div>
              </section>
            ) : null}

            {canManageOpportunities ? (
              <section
                aria-labelledby="manage-opportunity-heading"
                className="rounded-lg border border-border bg-card p-5"
              >
                <h2
                  id="manage-opportunity-heading"
                  className="text-xl font-semibold text-primary"
                >
                  {t("details.manage")}
                </h2>
                <Link
                  href={`/opportunities/${opportunity.id}/edit`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-surface-elevated"
                >
                  <Pencil aria-hidden="true" className="size-4" />
                  {t("details.edit")}
                </Link>
              </section>
            ) : null}

            <section
              aria-labelledby="application-heading"
              className="rounded-lg border border-border bg-card p-5"
            >
              <h2 id="application-heading" className="text-xl font-semibold text-primary">
                {t("details.applyHeading")}
              </h2>
              <div className="mt-4">
                <DeadlineStatusBadge opportunity={opportunity} />
              </div>
              {isExpired ? (
                <p className="mt-4 rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
                  {t("details.expiredApply")}
                </p>
              ) : (
                <>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-action px-4 py-2.5 text-sm font-semibold text-action-foreground opacity-60"
                  >
                    {t("details.applyButton")}
                    <ExternalLink aria-hidden="true" className="size-4" />
                  </button>
                  <p className="mt-3 text-xs leading-5 text-muted">
                    {t("details.demoDisabled")}
                  </p>
                </>
              )}
            </section>
          </aside>
        </div>

        {relatedOpportunities.length > 0 ? (
          <section aria-labelledby="related-opportunities-heading" className="space-y-4">
            <div>
              <h2
                id="related-opportunities-heading"
                className="text-2xl font-semibold text-primary"
              >
                {t("details.related")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {t("details.relatedDescription")}
              </p>
            </div>
            <OpportunityList
              opportunities={relatedOpportunities}
              heading={t("details.relatedHeading")}
              countLabel={t("details.relatedCount", {
                count: relatedOpportunities.length,
              })}
            />
          </section>
        ) : null}
      </div>
    </PageContainer>
  );
}

async function getOpportunityMetadataById(id: string) {
  try {
    return await getOpportunityById(id);
  } catch (error) {
    if (isOpportunityDataAccessError(error)) {
      return null;
    }

    return null;
  }
}

async function getOpportunityDetailData(id: string) {
  try {
    const [opportunity, opportunities] = await Promise.all([
      getOpportunityById(id),
      getAllOpportunities(),
    ]);

    return { opportunity, opportunities, status: "success" as const };
  } catch {
    return { opportunity: null, opportunities: [], status: "error" as const };
  }
}

function OpportunityDataErrorPage({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <PageContainer>
      <section className="rounded-lg border border-border bg-card px-5 py-10 text-center">
        <h1 className="text-2xl font-semibold text-primary">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          {description}
        </p>
      </section>
    </PageContainer>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 gap-2">
      <span className="mt-0.5 shrink-0 text-muted">{icon}</span>
      <div className="min-w-0">
        <dt className="font-medium text-primary">{label}</dt>
        <dd className="mt-1 break-words">{value}</dd>
      </div>
    </div>
  );
}
