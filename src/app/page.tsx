import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Globe2,
  Laptop,
  UsersRound,
  Wifi,
} from "lucide-react";
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

          <OpportunityPathwayVisual
            labels={{
              job: t("option.category.job"),
              scholarship: t("option.category.scholarship"),
              onlineLearning: t("option.category.online-course"),
              remoteWork: t("option.category.remote-work"),
            }}
          />
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

function OpportunityPathwayVisual({
  labels,
}: {
  labels: {
    job: string;
    onlineLearning: string;
    remoteWork: string;
    scholarship: string;
  };
}) {
  const nodes = [
    {
      className: "left-3 top-5 sm:left-5",
      icon: BriefcaseBusiness,
      label: labels.job,
      motionClass: "pathway-float-a",
    },
    {
      className: "right-3 top-5 sm:right-5",
      icon: GraduationCap,
      label: labels.scholarship,
      motionClass: "pathway-float-b",
    },
    {
      className: "bottom-5 left-3 sm:left-5",
      icon: Laptop,
      label: labels.onlineLearning,
      motionClass: "pathway-float-c",
    },
    {
      className: "bottom-5 right-3 sm:right-5",
      icon: Wifi,
      label: labels.remoteWork,
      motionClass: "pathway-float-d",
    },
  ] as const;

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-72 w-full max-w-sm overflow-hidden rounded-lg border border-border bg-card sm:h-80 lg:mx-0"
    >
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 360 320"
        role="presentation"
        focusable="false"
      >
        <defs>
          <pattern
            id="pathway-pattern"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M18 4 32 18 18 32 4 18Z"
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
              opacity="0.38"
            />
          </pattern>
          <path id="pathway-job" d="M82 68 C122 78 146 116 180 160" />
          <path id="pathway-scholarship" d="M278 68 C238 78 214 116 180 160" />
          <path id="pathway-learning" d="M72 250 C116 238 142 194 180 160" />
          <path id="pathway-remote" d="M288 250 C244 238 218 194 180 160" />
        </defs>

        <rect width="360" height="320" fill="url(#pathway-pattern)" opacity="0.5" />
        <g fill="none" stroke="var(--border)" strokeLinecap="round" strokeWidth="2">
          <use href="#pathway-job" />
          <use href="#pathway-scholarship" />
          <use href="#pathway-learning" />
          <use href="#pathway-remote" />
        </g>
        <g className="pathway-pulses">
          <circle className="pathway-pulse" r="4">
            <animateMotion dur="5.2s" repeatCount="indefinite">
              <mpath href="#pathway-job" />
            </animateMotion>
          </circle>
          <circle className="pathway-pulse" r="4">
            <animateMotion begin="1.2s" dur="5.4s" repeatCount="indefinite">
              <mpath href="#pathway-scholarship" />
            </animateMotion>
          </circle>
          <circle className="pathway-pulse" r="4">
            <animateMotion begin="0.8s" dur="5.8s" repeatCount="indefinite">
              <mpath href="#pathway-learning" />
            </animateMotion>
          </circle>
          <circle className="pathway-pulse" r="4">
            <animateMotion begin="1.8s" dur="5.6s" repeatCount="indefinite">
              <mpath href="#pathway-remote" />
            </animateMotion>
          </circle>
        </g>
      </svg>

      <div className="absolute left-1/2 top-1/2 z-10 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-action/30 bg-secondary-action text-secondary-action-foreground shadow-sm">
        <BriefcaseBusiness className="size-9" strokeWidth={1.8} />
      </div>

      {nodes.map((node) => {
        const Icon = node.icon;

        return (
          <div
            key={node.label}
            className={`${node.className} ${node.motionClass} absolute z-10 flex w-28 flex-col items-center gap-2 rounded-lg border border-border bg-surface px-3 py-3 text-center shadow-sm sm:w-32`}
          >
            <span className="flex size-9 items-center justify-center rounded-md bg-accent-soft text-accent-foreground">
              <Icon className="size-5" strokeWidth={1.8} />
            </span>
            <span className="text-xs font-semibold leading-4 text-primary">
              {node.label}
            </span>
          </div>
        );
      })}
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
