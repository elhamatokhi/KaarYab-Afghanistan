import type {
  DeadlineStatus,
  EmploymentType,
  OpportunityCategory,
  WorkMode,
} from "@/features/opportunities/constants";

export type { DeadlineStatus, EmploymentType, OpportunityCategory, WorkMode };

export type IsoDateString = `${number}-${number}-${number}T${string}Z`;

export type Opportunity = {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  location: string;
  country: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  deadline: IsoDateString;
  description: string;
  requirements: string[];
  applyLink: string;
  tags: string[];
  featured: boolean;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
};

export type OpportunitySort = "newest" | "closest-deadline";

export type OpportunityFilters = {
  query?: string;
  category?: OpportunityCategory | "all";
  countryOrLocation?: string;
  workMode?: WorkMode | "all";
  employmentType?: EmploymentType | "all";
  deadlineStatus?: DeadlineStatus | "all";
};

export type OpportunityDashboardStats = {
  total: number;
  featured: number;
  active: number;
  expired: number;
  expiringSoon: number;
  remote: number;
  countries: number;
};

export type CategoryDistributionItem = {
  category: OpportunityCategory;
  label: string;
  count: number;
};
