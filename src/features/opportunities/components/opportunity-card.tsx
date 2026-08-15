"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Globe2,
  MapPin,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui";
import { DeadlineStatusBadge } from "@/features/opportunities/components/deadline-status-badge";
import type { Opportunity } from "@/features/opportunities/types";
import { SaveOpportunityButton } from "@/features/saved/save-opportunity-button";
import { useI18n } from "@/i18n/client";
import {
  CATEGORY_MESSAGE_KEYS,
  EMPLOYMENT_TYPE_MESSAGE_KEYS,
  WORK_MODE_MESSAGE_KEYS,
} from "@/i18n/options";

type OpportunityCardProps = {
  opportunity: Opportunity;
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const { formatNumber, t } = useI18n();
  const detailHref = `/opportunities/${opportunity.id}`;
  const visibleTags = opportunity.tags.slice(0, 3);
  const hiddenTagCount = Math.max(opportunity.tags.length - visibleTags.length, 0);

  return (
    <article className="flex h-full min-w-0 flex-col rounded-lg border border-border bg-card p-5 transition hover:border-action/50 hover:bg-surface">
      <div className="flex min-h-10 items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
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
        <div className="shrink-0">
          <SaveOpportunityButton
            opportunityId={opportunity.id}
            opportunityTitle={opportunity.title}
          />
        </div>
      </div>

      <div className="mt-4 min-w-0">
        <h2 className="text-xl font-semibold leading-snug text-primary">
          <Link
            href={detailHref}
            className="rounded-sm hover:text-action"
            aria-label={t("card.viewDetailsFor", { title: opportunity.title })}
          >
            {opportunity.title}
          </Link>
        </h2>
        <p className="mt-2 flex min-w-0 items-start gap-2 text-sm text-muted">
          <Building2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span className="break-words">{opportunity.organization}</span>
        </p>
      </div>

      <dl className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
        <div className="flex min-w-0 gap-2">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <div className="min-w-0">
            <dt className="sr-only">{t("card.location")}</dt>
            <dd className="break-words">
              {opportunity.location}
              {opportunity.country !== opportunity.location
                ? `, ${opportunity.country}`
                : ""}
            </dd>
          </div>
        </div>
        <div className="flex min-w-0 gap-2">
          <Globe2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <div>
            <dt className="sr-only">{t("card.workMode")}</dt>
            <dd>{t(WORK_MODE_MESSAGE_KEYS[opportunity.workMode])}</dd>
          </div>
        </div>
        <div className="flex min-w-0 gap-2 sm:col-span-2">
          <BriefcaseBusiness
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />
          <div>
            <dt className="sr-only">{t("card.type")}</dt>
            <dd>{t(EMPLOYMENT_TYPE_MESSAGE_KEYS[opportunity.employmentType])}</dd>
          </div>
        </div>
      </dl>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">
        {opportunity.description}
      </p>

      <div className="mt-4">
        <DeadlineStatusBadge opportunity={opportunity} />
      </div>

      {visibleTags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={t("card.tags")}>
          {visibleTags.map((tag) => (
            <li
              key={tag}
              className="max-w-full rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted"
            >
              <span className="break-words">{tag}</span>
            </li>
          ))}
          {hiddenTagCount > 0 ? (
            <li className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted">
              {t("card.moreTags", { count: formatNumber(hiddenTagCount) })}
            </li>
          ) : null}
        </ul>
      ) : null}

      <div className="mt-5 border-t border-border pt-4">
        <Link
          href={detailHref}
          className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-action hover:text-action-hover"
        >
          {t("card.viewOpportunity")}
          <ArrowRight aria-hidden="true" className="size-4 rtl-flip" />
        </Link>
      </div>
    </article>
  );
}
