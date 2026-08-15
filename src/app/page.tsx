import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe2, Search, UsersRound } from "lucide-react";
import { LinkButton, PageContainer, SectionHeading } from "@/components/ui";
import { OPPORTUNITY_CATEGORIES } from "@/features/opportunities/constants";
import {
  getAllOpportunities,
  getFeaturedOpportunities,
  getOpportunityTranslations,
} from "@/features/opportunities/data";
import { localizeDemoOpportunities } from "@/features/opportunities/demo-localization";
import { OpportunityList } from "@/features/opportunities/components/opportunity-list";
import { calculateDashboardStats } from "@/features/opportunities/utils";
import { formatLocalizedNumber } from "@/i18n/format";
import { getI18n } from "@/i18n/server";
import { CATEGORY_MESSAGE_KEYS } from "@/i18n/options";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "KaarYab Afghanistan | Opportunity finder for Afghan youth",
  description:
    "Discover jobs, internships, scholarships, courses, remote work, training, and volunteer opportunities in KaarYab Afghanistan.",
};

export const dynamic = "force-dynamic";

const targetUserKeys = [
  "home.user.students",
  "home.user.graduates",
  "home.user.jobSeekers",
  "home.user.remoteWomen",
  "home.user.scholarship",
  "home.user.internship",
] as const;

const howItWorksSteps = [
  {
    id: "discover",
    titleKey: "home.step.discover.title",
    descriptionKey: "home.step.discover.description",
  },
  {
    id: "review",
    titleKey: "home.step.review.title",
    descriptionKey: "home.step.review.description",
  },
  {
    id: "act",
    titleKey: "home.step.act.title",
    descriptionKey: "home.step.act.description",
  },
] as const;

export default async function Home() {
  const data = await getHomeOpportunities();
  const { locale, t } = await getI18n();

  if (!data) {
    return <OpportunityDataErrorPage title={t("opportunities.unavailableTitle")} description={t("opportunities.unavailableDescription")} />;
  }

  const storedTranslations =
    locale === "en" ? {} : await getOpportunityTranslations(locale);
  const opportunities = localizeDemoOpportunities(
    data.opportunities,
    locale,
    storedTranslations,
  );
  const featuredOpportunities = localizeDemoOpportunities(
    data.featuredOpportunities,
    locale,
    storedTranslations,
  );
  const stats = calculateDashboardStats(opportunities);
  const onlineCount = opportunities.filter(
    (opportunity) => opportunity.location === "Online",
  ).length;
  const internationalCount = opportunities.filter(
    (opportunity) =>
      opportunity.country !== "Afghanistan" && opportunity.country !== "Remote",
  ).length;

  return (
    <PageContainer>
      <div className="space-y-14">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center">
          <div className="min-w-0">
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              {t("home.title")}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              {t("home.description")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <LinkButton href="/opportunities">{t("footer.browse")}</LinkButton>
              <LinkButton href="/contact" variant="secondary">
                {t("home.contactCta")}
              </LinkButton>
            </div>
          </div>

          <form
            action="/opportunities"
            method="get"
            className="rounded-lg border border-border bg-card p-5"
            role="search"
          >
            <label htmlFor="home-search" className="text-sm font-semibold text-primary">
              {t("home.searchLabel")}
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <input
                id="home-search"
                name="search"
                type="search"
                placeholder={t("home.searchPlaceholder")}
                className="min-h-11 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-muted"
              />
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-action px-4 py-2 text-sm font-semibold text-action-foreground transition hover:bg-action-hover"
              >
                <Search aria-hidden="true" className="size-4" />
                {t("common.search")}
              </button>
            </div>
          </form>
        </section>

        <section aria-labelledby="audience-heading" className="space-y-5">
          <SectionHeading
            title={t("home.audienceTitle")}
            description={t("home.audienceDescription")}
          />
          <h2 id="audience-heading" className="sr-only">
            {t("home.targetUsers")}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {targetUserKeys.map((userGroupKey) => (
              <li
                key={userGroupKey}
                className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-primary"
              >
                {t(userGroupKey)}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="stats-heading" className="space-y-5">
          <SectionHeading
            title={t("home.statsTitle")}
            description={t("home.statsDescription")}
          />
          <h2 id="stats-heading" className="sr-only">
            {t("home.demoStats")}
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatItem label={t("home.statDemo")} value={stats.total} locale={locale} />
            <StatItem label={t("home.statFeatured")} value={stats.featured} locale={locale} />
            <StatItem label={t("home.statRemote")} value={stats.remote} locale={locale} />
            <StatItem label={t("home.statCountries")} value={stats.countries} locale={locale} />
          </dl>
        </section>

        <section aria-labelledby="featured-heading">
          <OpportunityList
            opportunities={featuredOpportunities}
            heading={t("home.featuredHeading")}
            countLabel={t("home.featuredCount", {
              count: formatLocalizedNumber(featuredOpportunities.length, locale),
            })}
          />
        </section>

        <section aria-labelledby="categories-heading" className="space-y-5">
          <SectionHeading
            title={t("home.categoriesTitle")}
            description={t("home.categoriesDescription")}
          />
          <h2 id="categories-heading" className="sr-only">
            {t("home.categoriesSr")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {OPPORTUNITY_CATEGORIES.map((category) => (
              <Link
                key={category.value}
                href={`/opportunities?category=${category.value}`}
                className="group rounded-lg border border-border bg-card p-4 transition hover:border-action/50 hover:bg-surface"
              >
                <span className="font-semibold text-primary">
                  {t(CATEGORY_MESSAGE_KEYS[category.value])}
                </span>
                <span className="mt-2 flex items-center gap-2 text-sm text-muted group-hover:text-action">
                  {t("home.viewCategory")}
                  <ArrowRight aria-hidden="true" className="size-4 rtl-flip" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {howItWorksSteps.map((step, index) => (
            <article key={step.id} className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm font-semibold text-accent-foreground">
                {t("home.step", {
                  number: formatLocalizedNumber(index + 1, locale),
                })}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-primary">
                {t(step.titleKey)}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                {t(step.descriptionKey)}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-lg border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex size-10 items-center justify-center rounded-md bg-secondary-action text-secondary-action-foreground">
                <Globe2 aria-hidden="true" className="size-5" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-primary">
                {t("home.internationalTitle")}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                {t("home.internationalDescription")}
              </p>
            </div>
            <dl className="grid gap-3 sm:grid-cols-3 lg:w-80 lg:grid-cols-1">
              <StatItem label={t("home.onlineListings")} value={onlineCount} locale={locale} />
              <StatItem label={t("home.remoteMode")} value={stats.remote} locale={locale} />
              <StatItem label={t("home.internationalListings")} value={internationalCount} locale={locale} />
            </dl>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface-elevated p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-accent-foreground">
                <UsersRound aria-hidden="true" className="size-4" />
                {t("home.projectInput")}
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-primary">
                {t("home.shapeTitle")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {t("home.shapeDescription")}
              </p>
            </div>
            <LinkButton href="/contact" variant="secondary">
              {t("home.contactTeam")}
            </LinkButton>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

function StatItem({
  label,
  locale,
  value,
}: {
  label: string;
  locale: Locale;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <dt className="text-sm font-medium text-muted">{label}</dt>
      <dd className="mt-2 text-3xl font-semibold text-primary">
        {formatLocalizedNumber(value, locale)}
      </dd>
    </div>
  );
}

async function getHomeOpportunities() {
  try {
    const [opportunities, featuredOpportunities] = await Promise.all([
      getAllOpportunities(),
      getFeaturedOpportunities(3),
    ]);

    return { featuredOpportunities, opportunities };
  } catch {
    return null;
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
