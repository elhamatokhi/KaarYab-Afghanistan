import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Plus, Star, Tags, Trophy } from "lucide-react";
import { Badge, PageContainer, PageHeader } from "@/components/ui";
import { DashboardOpportunityManager } from "@/features/dashboard/dashboard-opportunity-manager";
import { CATEGORY_LABELS } from "@/features/opportunities/constants";
import { getAllOpportunities } from "@/features/opportunities/data";
import type {
  CategoryDistributionItem,
  Opportunity,
} from "@/features/opportunities/types";
import {
  calculateCategoryDistribution,
  calculateDashboardStats,
  formatOpportunityDate,
  getOpportunityDeadlineStatus,
} from "@/features/opportunities/utils";

export const metadata: Metadata = {
  title: "Dashboard | KaarYab Afghanistan",
  description:
    "Review KaarYab Afghanistan opportunity statistics and manage opportunity records.",
};

export default async function DashboardPage() {
  const opportunities = await getDashboardOpportunities();

  if (!opportunities) {
    return <DashboardDataErrorPage />;
  }

  const stats = calculateDashboardStats(opportunities);
  const categoryDistribution = calculateCategoryDistribution(opportunities);
  const upcomingDeadlines = getUpcomingDeadlines(opportunities);

  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <PageHeader
            eyebrow="Opportunity management"
            title="Dashboard"
            description="Review the current opportunity set, track categories and deadlines, and manage listings."
          />
          <Link
            href="/add-opportunity"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-action px-5 py-2 text-sm font-semibold text-action-foreground transition hover:bg-action-hover"
          >
            <Plus aria-hidden="true" className="size-4" />
            Add opportunity
          </Link>
        </div>

        <section aria-labelledby="dashboard-stats-heading" className="space-y-4">
          <h2 id="dashboard-stats-heading" className="sr-only">
            Opportunity statistics
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={<Trophy aria-hidden="true" className="size-5" />}
              label="Total opportunities"
              value={stats.total}
            />
            <MetricCard
              icon={<Star aria-hidden="true" className="size-5" />}
              label="Featured"
              value={stats.featured}
            />
            <MetricCard
              icon={<CalendarDays aria-hidden="true" className="size-5" />}
              label="Upcoming deadlines"
              value={upcomingDeadlines.length}
            />
            <MetricCard
              icon={<Tags aria-hidden="true" className="size-5" />}
              label="Categories used"
              value={categoryDistribution.filter((item) => item.count > 0).length}
            />
          </dl>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <CategoryChart distribution={categoryDistribution} />
          <UpcomingDeadlines opportunities={upcomingDeadlines} />
        </div>

        <DashboardOpportunityManager initialOpportunities={opportunities} />
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

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
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
      <dd className="mt-4 text-3xl font-semibold text-primary">{value}</dd>
    </div>
  );
}

function CategoryChart({
  distribution,
}: {
  distribution: CategoryDistributionItem[];
}) {
  const maxCount = Math.max(...distribution.map((item) => item.count), 1);

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
            Opportunities by category
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Distribution across the supported opportunity categories.
          </p>
        </div>
        <Badge tone="accent">{distribution.length} categories</Badge>
      </div>

      <dl className="mt-6 space-y-4">
        {distribution.map((item) => (
          <div key={item.category} className="grid gap-2 sm:grid-cols-[11rem_1fr_3rem] sm:items-center">
            <dt className="text-sm font-medium text-primary">{item.label}</dt>
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
              {item.count}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function UpcomingDeadlines({ opportunities }: { opportunities: Opportunity[] }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 sm:p-6">
      <h2 className="text-xl font-semibold text-primary">
        Upcoming deadlines
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
                {CATEGORY_LABELS[opportunity.category]}
              </p>
              <p className="mt-3 text-sm text-muted">
                Deadline:{" "}
                <time
                  dateTime={opportunity.deadline}
                  className="font-medium text-primary"
                >
                  {formatOpportunityDate(opportunity.deadline)}
                </time>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-md border border-border bg-surface p-4 text-sm leading-6 text-muted">
          No upcoming deadlines are available.
        </p>
      )}
    </section>
  );
}

function DashboardDataErrorPage() {
  return (
    <PageContainer>
      <section className="rounded-lg border border-border bg-card px-5 py-10 text-center">
        <h1 className="text-2xl font-semibold text-primary">
          Dashboard is temporarily unavailable
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          KaarYab could not load opportunity records right now. Please try again
          later.
        </p>
      </section>
    </PageContainer>
  );
}
