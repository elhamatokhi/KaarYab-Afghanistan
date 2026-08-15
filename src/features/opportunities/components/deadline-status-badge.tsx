"use client";

import { Clock } from "lucide-react";
import { Badge } from "@/components/ui";
import type { Opportunity } from "@/features/opportunities/types";
import {
  getDaysUntilDeadline,
  getOpportunityDeadlineStatus,
} from "@/features/opportunities/utils";
import { useI18n } from "@/i18n/client";

type DeadlineStatusBadgeProps = {
  opportunity: Opportunity;
  referenceDate?: Date;
};

export function DeadlineStatusBadge({
  opportunity,
  referenceDate = new Date(),
}: DeadlineStatusBadgeProps) {
  const { formatDate, formatNumber, t } = useI18n();
  const deadlineStatus = getOpportunityDeadlineStatus(opportunity, referenceDate);
  const daysUntilDeadline = getDaysUntilDeadline(opportunity, referenceDate);
  const formattedDeadline = formatDate(opportunity.deadline);
  const statusDetails = getStatusDetails(
    deadlineStatus,
    daysUntilDeadline,
    t,
    formatNumber,
  );

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
      <Badge tone={statusDetails.tone}>
        <span className="inline-flex items-center gap-1.5">
          <Clock aria-hidden="true" className="size-3.5" />
          {statusDetails.label}
        </span>
      </Badge>
      <span>
        {t("deadline.label")}{" "}
        <time dateTime={opportunity.deadline} className="font-medium text-primary">
          {formattedDeadline}
        </time>
      </span>
    </div>
  );
}

function getStatusDetails(
  deadlineStatus: ReturnType<typeof getOpportunityDeadlineStatus>,
  daysUntilDeadline: number,
  t: ReturnType<typeof useI18n>["t"],
  formatNumber: (value: number) => string,
) {
  if (deadlineStatus === "expired") {
    return {
      label: t("deadline.expired"),
      tone: "danger" as const,
    };
  }

  if (deadlineStatus === "expiring-soon") {
    return {
      label:
        daysUntilDeadline === 0
          ? t("deadline.expiringToday")
          : t("deadline.expiringSoon", {
              days: formatNumber(daysUntilDeadline),
            }),
      tone: "warning" as const,
    };
  }

  return {
    label: t("common.active"),
    tone: "success" as const,
  };
}
