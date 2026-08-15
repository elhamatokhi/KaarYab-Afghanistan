import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge, LinkButton, PageContainer, PageHeader } from "@/components/ui";
import { OPPORTUNITY_CATEGORIES } from "@/features/opportunities/constants";

export const metadata: Metadata = {
  title: "About KaarYab Afghanistan | Opportunity finder purpose",
  description:
    "Learn how KaarYab Afghanistan supports opportunity discovery for Afghan youth.",
};

const principles = [
  "Keep opportunity information clear and scannable.",
  "Design for mobile, tablet, desktop, light mode, and dark mode from the start.",
  "Show clear deadlines, requirements, and application paths.",
  "Keep the architecture understandable for a student capstone project.",
];

const futureVision = [
  "Database-backed opportunity browsing and detail pages.",
  "URL-based search, filters, and sorting.",
  "Account-based saved opportunities for authenticated users.",
  "Validated create and edit workflows for opportunity records.",
  "Dashboard statistics for reviewing opportunity coverage.",
];

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="space-y-12">
        <div className="space-y-4">
          <Badge tone="accent">About the platform</Badge>
          <PageHeader
            title="KaarYab Afghanistan is a focused opportunity finder for Afghan youth."
            description="The platform is being built to help students, graduates, job seekers, scholarship applicants, internship seekers, women seeking remote opportunities, and organizations connect around practical opportunities."
          />
        </div>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-lg border border-border bg-card p-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-primary">
              The problem
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Opportunity information is often scattered across websites, social
              posts, documents, and informal networks. That makes it harder for
              young people to compare deadlines, requirements, work modes, and
              application paths in one place.
            </p>
          </article>
          <article className="rounded-lg border border-border bg-card p-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-primary">
              The intended solution
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              KaarYab will provide a structured directory for jobs, internships,
              scholarships, online courses, remote work, training programs, and
              volunteer opportunities.
            </p>
          </article>
        </section>

        <section aria-labelledby="supported-categories-heading" className="space-y-5">
          <div className="max-w-2xl">
            <h2
              id="supported-categories-heading"
              className="text-2xl font-semibold text-primary"
            >
              Supported categories
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Browse the types of opportunities KaarYab is designed to organize.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {OPPORTUNITY_CATEGORIES.map((category) => (
              <li key={category.value}>
                <Link
                  href={`/opportunities?category=${category.value}`}
                  className="flex min-h-16 items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-primary transition hover:border-action/50 hover:bg-surface"
                >
                  {category.label}
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-warning/30 bg-warning-soft p-5 sm:p-6">
          <h2 className="text-2xl font-semibold text-warning">
            Demo data notice
          </h2>
          <p className="mt-3 text-sm leading-6 text-warning">
            Current opportunities are fictional demonstration records. They are
            included to test the experience and do not represent real
            applications or endorsements.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article>
            <h2 className="text-2xl font-semibold text-primary">
              Platform principles
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
              {principles.map((principle) => (
                <li key={principle} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-action"
                  />
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </article>
          <article>
            <h2 className="text-2xl font-semibold text-primary">
              Future vision
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
              {futureVision.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 sm:p-6">
          <h2 className="text-2xl font-semibold text-primary">
            Explore the current foundation
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Browse opportunities, ask a question, or suggest the kind of listing
            that would help Afghan youth most.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/opportunities">View opportunities</LinkButton>
            <LinkButton href="/contact" variant="secondary">
              Contact
            </LinkButton>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
