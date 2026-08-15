import type { Opportunity } from "@/features/opportunities/types";

export type OpportunityFormValues = {
  title: string;
  organization: string;
  category: string;
  location: string;
  country: string;
  workMode: string;
  employmentType: string;
  deadline: string;
  description: string;
  requirements: string;
  applyLink: string;
  tags: string;
  featured: boolean;
};

export function parseMultilineList(value: string) {
  return normalizeStringList(value.split(/\r?\n/));
}

export function parseCommaSeparatedList(value: string) {
  return normalizeStringList(value.split(","));
}

export function opportunityToFormValues(
  opportunity: Opportunity,
): OpportunityFormValues {
  return {
    title: opportunity.title,
    organization: opportunity.organization,
    category: opportunity.category,
    location: opportunity.location,
    country: opportunity.country,
    workMode: opportunity.workMode,
    employmentType: opportunity.employmentType,
    deadline: isoDateToDateTimeLocal(opportunity.deadline),
    description: opportunity.description,
    requirements: opportunity.requirements.join("\n"),
    applyLink: opportunity.applyLink,
    tags: opportunity.tags.join(", "),
    featured: opportunity.featured,
  };
}

export function createBlankOpportunityFormValues(): OpportunityFormValues {
  return {
    title: "",
    organization: "",
    category: "",
    location: "",
    country: "",
    workMode: "",
    employmentType: "",
    deadline: "",
    description: "",
    requirements: "",
    applyLink: "",
    tags: "",
    featured: false,
  };
}

export function isoDateToDateTimeLocal(value: string) {
  return value.slice(0, 16);
}

function normalizeStringList(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}
