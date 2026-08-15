"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui";
import {
  CATEGORY_LABELS,
} from "@/features/opportunities/constants";
import type { Opportunity } from "@/features/opportunities/types";
import { formatOpportunityDate } from "@/features/opportunities/utils";

type DashboardOpportunityManagerProps = {
  initialOpportunities: Opportunity[];
};

type DeleteState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function DashboardOpportunityManager({
  initialOpportunities,
}: DashboardOpportunityManagerProps) {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [deleteTarget, setDeleteTarget] = useState<Opportunity | null>(null);
  const [deleteState, setDeleteState] = useState<DeleteState>({ status: "idle" });
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sortedOpportunities = useMemo(
    () =>
      [...opportunities].sort(
        (firstOpportunity, secondOpportunity) =>
          new Date(firstOpportunity.deadline).getTime() -
          new Date(secondOpportunity.deadline).getTime(),
      ),
    [opportunities],
  );

  function handleDeleteConfirmed() {
    if (!deleteTarget) {
      return;
    }

    const opportunity = deleteTarget;
    setPendingDeleteId(opportunity.id);
    setDeleteState({ status: "idle" });

    startTransition(async () => {
      try {
        const response = await fetch(`/api/opportunities/${opportunity.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          setDeleteState({
            status: "error",
            message: "The opportunity could not be deleted. Please try again.",
          });
          return;
        }

        setOpportunities((currentOpportunities) =>
          currentOpportunities.filter((item) => item.id !== opportunity.id),
        );
        setDeleteTarget(null);
        setDeleteState({
          status: "success",
          message: `${opportunity.title} was deleted.`,
        });
      } catch {
        setDeleteState({
          status: "error",
          message: "The opportunity could not be deleted. Please try again.",
        });
      } finally {
        setPendingDeleteId(null);
      }
    });
  }

  const isDeleting = Boolean(pendingDeleteId) || isPending;

  return (
    <section
      aria-labelledby="opportunity-management-heading"
      className="rounded-lg border border-border bg-card p-5 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="opportunity-management-heading"
            className="text-xl font-semibold text-primary"
          >
            Opportunity management
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Review listings and manage individual records.
          </p>
        </div>
        <Link
          href="/add-opportunity"
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary transition hover:bg-surface-elevated"
        >
          Add Opportunity
        </Link>
      </div>

      {deleteState.status === "success" ? (
        <div
          role="status"
          className="mt-5 rounded-md border border-success/30 bg-success-soft px-4 py-3 text-sm leading-6 text-success"
        >
          {deleteState.message}
        </div>
      ) : null}

      {deleteState.status === "error" ? (
        <div
          role="alert"
          className="mt-5 rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm leading-6 text-danger"
        >
          {deleteState.message}
        </div>
      ) : null}

      {sortedOpportunities.length > 0 ? (
        <>
          <div className="mt-6 hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                Opportunity management records
              </caption>
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Title
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Organization
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Deadline
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Featured
                  </th>
                  <th scope="col" className="py-3 pl-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedOpportunities.map((opportunity) => (
                  <tr key={opportunity.id} className="align-top">
                    <td className="max-w-xs py-4 pr-4 font-medium text-primary">
                      {opportunity.title}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {opportunity.organization}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {CATEGORY_LABELS[opportunity.category]}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      <time dateTime={opportunity.deadline}>
                        {formatOpportunityDate(opportunity.deadline)}
                      </time>
                    </td>
                    <td className="px-4 py-4">
                      <FeaturedBadge featured={opportunity.featured} />
                    </td>
                    <td className="py-4 pl-4">
                      <ActionGroup
                        opportunity={opportunity}
                        isDeleting={pendingDeleteId === opportunity.id}
                        onDelete={() => setDeleteTarget(opportunity)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-6 grid gap-4 lg:hidden">
            {sortedOpportunities.map((opportunity) => (
              <li
                key={opportunity.id}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-primary">
                      {opportunity.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {opportunity.organization}
                    </p>
                  </div>
                  <FeaturedBadge featured={opportunity.featured} />
                </div>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-primary">Category</dt>
                    <dd className="mt-1 text-muted">
                      {CATEGORY_LABELS[opportunity.category]}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-primary">Deadline</dt>
                    <dd className="mt-1 text-muted">
                      <time dateTime={opportunity.deadline}>
                        {formatOpportunityDate(opportunity.deadline)}
                      </time>
                    </dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <ActionGroup
                    opportunity={opportunity}
                    isDeleting={pendingDeleteId === opportunity.id}
                    onDelete={() => setDeleteTarget(opportunity)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-6 rounded-lg border border-border bg-surface p-6 text-center">
          <h3 className="text-lg font-semibold text-primary">
            No opportunities to manage
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            Add the first opportunity to start building the dashboard record
            list.
          </p>
          <Link
            href="/add-opportunity"
            className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-action px-4 py-2 text-sm font-semibold text-action-foreground transition hover:bg-action-hover"
          >
            Add opportunity
          </Link>
        </div>
      )}

      {deleteTarget ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-opportunity-title"
            aria-describedby="delete-opportunity-description"
            className="w-full max-w-md rounded-lg border border-border bg-card p-5 shadow-lg"
          >
            <h2
              id="delete-opportunity-title"
              className="text-xl font-semibold text-primary"
            >
              Delete opportunity?
            </h2>
            <p
              id="delete-opportunity-description"
              className="mt-3 text-sm leading-6 text-muted"
            >
              This will remove {deleteTarget.title} from KaarYab.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary transition hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirmed}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-action-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                {isDeleting ? "Deleting..." : "Delete opportunity"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ActionGroup({
  isDeleting,
  onDelete,
  opportunity,
}: {
  isDeleting: boolean;
  onDelete: () => void;
  opportunity: Opportunity;
}) {
  return (
    <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
      <ActionLink href={`/opportunities/${opportunity.id}`} label="View">
        <Eye aria-hidden="true" className="size-4" />
      </ActionLink>
      <ActionLink href={`/opportunities/${opportunity.id}/edit`} label="Edit">
        <Pencil aria-hidden="true" className="size-4" />
      </ActionLink>
      <button
        type="button"
        disabled={isDeleting}
        onClick={onDelete}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-sm font-semibold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Trash2 aria-hidden="true" className="size-4" />
        {isDeleting ? "Deleting" : "Delete"}
      </button>
    </div>
  );
}

function ActionLink({
  children,
  href,
  label,
}: {
  children: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-primary transition hover:bg-surface-elevated"
    >
      {children}
      {label}
    </Link>
  );
}

function FeaturedBadge({ featured }: { featured: boolean }) {
  return featured ? <Badge tone="warning">Featured</Badge> : <Badge>No</Badge>;
}
