import { Clock } from "lucide-react";
import { Badge } from "@/components/ui";
import type { Opportunity } from "@/features/opportunities/types";
import {
  getDaysUntilDeadline,
  getOpportunityDeadlineStatus,
} from "@/features/opportunities/utils";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

type DeadlineStatusBadgeProps = {
  opportunity: Opportunity;
  referenceDate?: Date;
};

export function DeadlineStatusBadge({
  opportunity,
  referenceDate = new Date(),
}: DeadlineStatusBadgeProps) {
  const deadlineStatus = getOpportunityDeadlineStatus(opportunity, referenceDate);
  const daysUntilDeadline = getDaysUntilDeadline(opportunity, referenceDate);
  const formattedDeadline = dateFormatter.format(new Date(opportunity.deadline));
  const statusDetails = getStatusDetails(deadlineStatus, daysUntilDeadline);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
      <Badge tone={statusDetails.tone}>
        <span className="inline-flex items-center gap-1.5">
          <Clock aria-hidden="true" className="size-3.5" />
          {statusDetails.label}
        </span>
      </Badge>
      <span>
        Deadline:{" "}
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
) {
  if (deadlineStatus === "expired") {
    return {
      label: "Expired",
      tone: "danger" as const,
    };
  }

  if (deadlineStatus === "expiring-soon") {
    return {
      label:
        daysUntilDeadline === 0
          ? "Expiring today"
          : `Expiring soon: ${daysUntilDeadline} days left`,
      tone: "warning" as const,
    };
  }

  return {
    label: "Active",
    tone: "success" as const,
  };
}
