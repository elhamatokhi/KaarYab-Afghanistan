import type { MessageKey } from "@/i18n/messages";

export const CATEGORY_MESSAGE_KEYS = {
  job: "option.category.job",
  internship: "option.category.internship",
  scholarship: "option.category.scholarship",
  "online-course": "option.category.online-course",
  "remote-work": "option.category.remote-work",
  "training-program": "option.category.training-program",
  "volunteer-work": "option.category.volunteer-work",
} as const satisfies Record<string, MessageKey>;

export const WORK_MODE_MESSAGE_KEYS = {
  remote: "option.workMode.remote",
  onsite: "option.workMode.onsite",
  hybrid: "option.workMode.hybrid",
} as const satisfies Record<string, MessageKey>;

export const EMPLOYMENT_TYPE_MESSAGE_KEYS = {
  "full-time": "option.employment.full-time",
  "part-time": "option.employment.part-time",
  contract: "option.employment.contract",
  temporary: "option.employment.temporary",
  fellowship: "option.employment.fellowship",
  "not-applicable": "option.employment.not-applicable",
} as const satisfies Record<string, MessageKey>;

export const DEADLINE_STATUS_MESSAGE_KEYS = {
  active: "option.deadline.active",
  "expiring-soon": "option.deadline.expiring-soon",
  expired: "option.deadline.expired",
} as const satisfies Record<string, MessageKey>;

export const SORT_MESSAGE_KEYS = {
  "closest-deadline": "option.sort.closest-deadline",
  newest: "option.sort.newest",
} as const satisfies Record<string, MessageKey>;
