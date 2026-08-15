export const EXPIRING_SOON_DAYS = 14;

export const OPPORTUNITY_CATEGORIES = [
  { value: "job", label: "Job" },
  { value: "internship", label: "Internship" },
  { value: "scholarship", label: "Scholarship" },
  { value: "online-course", label: "Online Course" },
  { value: "remote-work", label: "Remote Work" },
  { value: "training-program", label: "Training Program" },
  { value: "volunteer-work", label: "Volunteer Work" },
] as const;

export const WORK_MODES = [
  { value: "remote", label: "Remote", prismaValue: "REMOTE" },
  { value: "onsite", label: "On-site", prismaValue: "ONSITE" },
  { value: "hybrid", label: "Hybrid", prismaValue: "HYBRID" },
] as const;

export const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "fellowship", label: "Fellowship" },
  { value: "not-applicable", label: "Not applicable" },
] as const;

export const DEADLINE_STATUSES = [
  { value: "active", label: "Active" },
  { value: "expiring-soon", label: "Expiring soon" },
  { value: "expired", label: "Expired" },
] as const;

export const OPPORTUNITY_SORT_OPTIONS = [
  { value: "closest-deadline", label: "Closest deadline" },
  { value: "newest", label: "Newest" },
] as const;

export type OpportunityCategory = (typeof OPPORTUNITY_CATEGORIES)[number]["value"];
export type WorkMode = (typeof WORK_MODES)[number]["value"];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]["value"];
export type DeadlineStatus = (typeof DEADLINE_STATUSES)[number]["value"];
export type OpportunitySortOption =
  (typeof OPPORTUNITY_SORT_OPTIONS)[number]["value"];

export const CATEGORY_LABELS = Object.fromEntries(
  OPPORTUNITY_CATEGORIES.map((category) => [category.value, category.label]),
) as Record<OpportunityCategory, string>;

export const WORK_MODE_LABELS = Object.fromEntries(
  WORK_MODES.map((workMode) => [workMode.value, workMode.label]),
) as Record<WorkMode, string>;

export const EMPLOYMENT_TYPE_LABELS = Object.fromEntries(
  EMPLOYMENT_TYPES.map((employmentType) => [
    employmentType.value,
    employmentType.label,
  ]),
) as Record<EmploymentType, string>;

export const WORK_MODE_TO_PRISMA = Object.fromEntries(
  WORK_MODES.map((workMode) => [workMode.value, workMode.prismaValue]),
) as Record<WorkMode, "REMOTE" | "ONSITE" | "HYBRID">;
