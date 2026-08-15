import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe2, Search, UsersRound } from "lucide-react";
import { Badge, LinkButton, PageContainer, SectionHeading } from "@/components/ui";
import { OPPORTUNITY_CATEGORIES } from "@/features/opportunities/constants";
import {
  getAllOpportunities,
  getFeaturedOpportunities,
} from "@/features/opportunities/data";
import { OpportunityList } from "@/features/opportunities/components/opportunity-list";
import { calculateDashboardStats } from "@/features/opportunities/utils";

export const metadata: Metadata = {
  title: "KaarYab Afghanistan | Opportunity finder for Afghan youth",
  description:
    "Discover jobs, internships, scholarships, courses, remote work, training, and volunteer opportunities in KaarYab Afghanistan.",
};

const targetUsers = [
  "Students",
  "Fresh graduates",
  "Job seekers",
  "Women seeking remote opportunities",
  "Scholarship applicants",
  "Internship seekers",
];

const howItWorksSteps = [
  {
    title: "Discover",
    description:
      "Browse opportunities by category, location, work mode, and deadline as the listing experience grows.",
  },
  {
    title: "Review",
    description:
      "Open a detail page to understand the organization, requirements, deadline, and application path.",
  },
  {
    title: "Act",
    description:
      "Use KaarYab as a focused starting point before applying through trusted external channels.",
  },
];

export default async function Home() {
  const data = await getHomeOpportunities();

  if (!data) {
    return <OpportunityDataErrorPage />;
  }

  const { featuredOpportunities, opportunities } = data;
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
            <Badge tone="accent">Opportunity finder for Afghan youth</Badge>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              Find jobs, scholarships, training, and remote opportunities in one
              focused place.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              KaarYab Afghanistan helps young people find practical paths for
              learning, work, service, and career growth.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <LinkButton href="/opportunities">Browse opportunities</LinkButton>
              <LinkButton href="/add-opportunity" variant="secondary">
                Add opportunity
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
              Search opportunities
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <input
                id="home-search"
                name="search"
                type="search"
                placeholder="Try scholarship, remote, Kabul"
                className="min-h-11 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-muted"
              />
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-action px-4 py-2 text-sm font-semibold text-action-foreground transition hover:bg-action-hover"
              >
                <Search aria-hidden="true" className="size-4" />
                Search
              </button>
            </div>
          </form>
        </section>

        <section aria-labelledby="audience-heading" className="space-y-5">
          <SectionHeading
            title="Built for practical opportunity discovery"
            description="The platform is designed for Afghan youth and organizations that need a clear place to share and find learning, work, and service opportunities."
          />
          <h2 id="audience-heading" className="sr-only">
            Target users
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {targetUsers.map((userGroup) => (
              <li
                key={userGroup}
                className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-primary"
              >
                {userGroup}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="stats-heading" className="space-y-5">
          <SectionHeading
            title="Current opportunity coverage"
            description="A quick snapshot of the opportunities available to browse."
          />
          <h2 id="stats-heading" className="sr-only">
            Demo statistics
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatItem label="Demo opportunities" value={stats.total} />
            <StatItem label="Featured listings" value={stats.featured} />
            <StatItem label="Remote work mode" value={stats.remote} />
            <StatItem label="Countries and regions" value={stats.countries} />
          </dl>
        </section>

        <section aria-labelledby="featured-heading">
          <OpportunityList
            opportunities={featuredOpportunities}
            heading="Featured opportunities"
            countLabel={`Showing ${featuredOpportunities.length} featured listings`}
          />
        </section>

        <section aria-labelledby="categories-heading" className="space-y-5">
          <SectionHeading
            title="Explore by category"
            description="Jump directly into the type of opportunity that matches your goal."
          />
          <h2 id="categories-heading" className="sr-only">
            Opportunity categories
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {OPPORTUNITY_CATEGORIES.map((category) => (
              <Link
                key={category.value}
                href={`/opportunities?category=${category.value}`}
                className="group rounded-lg border border-border bg-card p-4 transition hover:border-action/50 hover:bg-surface"
              >
                <span className="font-semibold text-primary">{category.label}</span>
                <span className="mt-2 flex items-center gap-2 text-sm text-muted group-hover:text-action">
                  View category
                  <ArrowRight aria-hidden="true" className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {howItWorksSteps.map((step, index) => (
            <article key={step.title} className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm font-semibold text-accent">
                Step {index + 1}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-primary">
                {step.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                {step.description}
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
                Afghanistan-focused, online-aware, and internationally useful
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Listings include Afghan locations, online opportunities, remote
                work, and international programs available to Afghan applicants.
                The goal is to support local discovery while acknowledging that
                many opportunities now happen across borders.
              </p>
            </div>
            <dl className="grid gap-3 sm:grid-cols-3 lg:w-80 lg:grid-cols-1">
              <StatItem label="Online listings" value={onlineCount} />
              <StatItem label="Remote mode" value={stats.remote} />
              <StatItem label="International listings" value={internationalCount} />
            </dl>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface-elevated p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                <UsersRound aria-hidden="true" className="size-4" />
                Project input
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-primary">
                Help shape KaarYab
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Share feedback on the kinds of opportunities, categories, and
                details that would make KaarYab more useful.
              </p>
            </div>
            <LinkButton href="/contact" variant="secondary">
              Contact project team
            </LinkButton>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <dt className="text-sm font-medium text-muted">{label}</dt>
      <dd className="mt-2 text-3xl font-semibold text-primary">{value}</dd>
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

function OpportunityDataErrorPage() {
  return (
    <PageContainer>
      <section className="rounded-lg border border-border bg-card px-5 py-10 text-center">
        <h1 className="text-2xl font-semibold text-primary">
          Opportunities are temporarily unavailable
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          KaarYab could not load opportunity listings right now. Please try
          again later.
        </p>
      </section>
    </PageContainer>
  );
}
