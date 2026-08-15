import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Plus, Star, Tags, Trophy } from "lucide-react";
import { Badge, PageContainer, PageHeader } from "@/components/ui";
import { DashboardOpportunityManager } from "@/features/dashboard/dashboard-opportunity-manager";
import { requireAdminPage } from "@/features/auth/authorization";
import {
  getAllOpportunities,
  getOpportunityTranslations,
} from "@/features/opportunities/data";
import { localizeDemoOpportunities } from "@/features/opportunities/demo-localization";
import type {
  CategoryDistributionItem,
  Opportunity,
} from "@/features/opportunities/types";
import {
  calculateCategoryDistribution,
  calculateDashboardStats,
  getOpportunityDeadlineStatus,
} from "@/features/opportunities/utils";
import { formatLocalizedDate, formatLocalizedNumber } from "@/i18n/format";
import type { Locale } from "@/i18n/config";
import { createTranslator } from "@/i18n/format";
import { messages } from "@/i18n/messages";
import { CATEGORY_MESSAGE_KEYS } from "@/i18n/options";
import { getI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Dashboard | KaarYab Afghanistan",
  description:
    "Review KaarYab Afghanistan opportunity statistics and manage opportunity records.",
};

export default async function DashboardPage() {
  await requireAdminPage("/dashboard");
  const { locale, t } = await getI18n();
  const opportunities = await getDashboardOpportunities();

  if (!opportunities) {
    return (
      <DashboardDataErrorPage
        title={t("dashboard.unavailableTitle")}
        description={t("dashboard.unavailableDescription")}
      />
    );
  }

  const storedTranslations =
    locale === "en" ? {} : await getOpportunityTranslations(locale);
  const localizedOpportunities = localizeDemoOpportunities(
    opportunities,
    locale,
    storedTranslations,
  );
  const stats = calculateDashboardStats(localizedOpportunities);
  const categoryDistribution = calculateCategoryDistribution(localizedOpportunities);
  const upcomingDeadlines = getUpcomingDeadlines(localizedOpportunities);

  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <PageHeader
            title={t("dashboard.title")}
            description={t("dashboard.description")}
          />
          <Link
            href="/add-opportunity"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-action px-5 py-2 text-sm font-semibold text-action-foreground transition hover:bg-action-hover"
          >
            <Plus aria-hidden="true" className="size-4" />
            {t("common.addOpportunity")}
          </Link>
        </div>

        <section aria-labelledby="dashboard-stats-heading" className="space-y-4">
          <h2 id="dashboard-stats-heading" className="sr-only">
            {t("dashboard.stats")}
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={<Trophy aria-hidden="true" className="size-5" />}
              label={t("dashboard.total")}
              value={stats.total}
              locale={locale}
            />
            <MetricCard
              icon={<Star aria-hidden="true" className="size-5" />}
              label={t("dashboard.featured")}
              value={stats.featured}
              locale={locale}
            />
            <MetricCard
              icon={<CalendarDays aria-hidden="true" className="size-5" />}
              label={t("dashboard.upcoming")}
              value={upcomingDeadlines.length}
              locale={locale}
            />
            <MetricCard
              icon={<Tags aria-hidden="true" className="size-5" />}
              label={t("dashboard.categoriesUsed")}
              value={categoryDistribution.filter((item) => item.count > 0).length}
              locale={locale}
            />
          </dl>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <CategoryChart distribution={categoryDistribution} locale={locale} />
          <UpcomingDeadlines opportunities={upcomingDeadlines} locale={locale} />
        </div>

        <DashboardOpportunityManager initialOpportunities={localizedOpportunities} />
      </div>
    </PageContainer>
  );
}

async function getDashboardOpportunities() {
  try {
    return await getAllOpportunities();
  } catch {
    return null;
  }
}

function getUpcomingDeadlines(opportunities: Opportunity[]) {
  return opportunities
    .filter(
      (opportunity) => getOpportunityDeadlineStatus(opportunity) !== "expired",
    )
    .sort(
      (firstOpportunity, secondOpportunity) =>
        new Date(firstOpportunity.deadline).getTime() -
        new Date(secondOpportunity.deadline).getTime(),
    )
    .slice(0, 5);
}

function DashboardDataErrorPage({
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

function MetricCard({
  icon,
  label,
  locale,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  locale: Locale;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-3 text-muted">
        <span className="inline-flex size-9 items-center justify-center rounded-md bg-surface">
          {icon}
        </span>
        <dt className="text-sm font-medium">{label}</dt>
      </div>
      <dd className="mt-4 text-3xl font-semibold text-primary">
        {formatLocalizedNumber(value, locale)}
      </dd>
    </div>
  );
}

function CategoryChart({
  distribution,
  locale,
}: {
  distribution: CategoryDistributionItem[];
  locale: Locale;
}) {
  const maxCount = Math.max(...distribution.map((item) => item.count), 1);
  const countLabel = formatLocalizedNumber(distribution.length, locale);
  const t = createTranslator(messages[locale]);

  return (
    <section
      aria-labelledby="category-chart-heading"
      className="rounded-lg border border-border bg-card p-5 sm:p-6"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="category-chart-heading"
            className="text-xl font-semibold text-primary"
          >
            {t("dashboard.byCategory")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {t("dashboard.byCategoryDescription")}
          </p>
        </div>
        <Badge tone="accent">
          {t("dashboard.categoriesCount", { count: countLabel })}
        </Badge>
      </div>

      <dl className="mt-6 space-y-4">
        {distribution.map((item) => (
          <div key={item.category} className="grid gap-2 sm:grid-cols-[11rem_1fr_3rem] sm:items-center">
            <dt className="text-sm font-medium text-primary">
              {t(CATEGORY_MESSAGE_KEYS[item.category])}
            </dt>
            <dd className="min-w-0">
              <div
                className="h-3 overflow-hidden rounded-full bg-surface"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-full bg-action"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </dd>
            <dd className="text-sm font-semibold text-primary sm:text-right">
              {formatLocalizedNumber(item.count, locale)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function UpcomingDeadlines({
  locale,
  opportunities,
}: {
  locale: Locale;
  opportunities: Opportunity[];
}) {
  const t = createTranslator(messages[locale]);

  return (
    <section className="rounded-lg border border-border bg-card p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-primary">
        {t("dashboard.upcoming")}
      </h2>
      {opportunities.length > 0 ? (
        <ul className="mt-5 space-y-4">
          {opportunities.map((opportunity) => (
            <li
              key={opportunity.id}
              className="rounded-md border border-border bg-surface p-4"
            >
              <Link
                href={`/opportunities/${opportunity.id}`}
                className="font-semibold text-primary transition hover:text-action"
              >
                {opportunity.title}
              </Link>
              <p className="mt-1 text-sm text-muted">
                {t(CATEGORY_MESSAGE_KEYS[opportunity.category])}
              </p>
              <p className="mt-3 text-sm text-muted">
                {t("deadline.label")}{" "}
                <time
                  dateTime={opportunity.deadline}
                  className="font-medium text-primary"
                >
                  {formatLocalizedDate(opportunity.deadline, locale)}
                </time>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-md border border-border bg-surface p-4 text-sm leading-6 text-muted">
          {t("dashboard.deadlineEmpty")}
        </p>
      )}
    </section>
  );
}
