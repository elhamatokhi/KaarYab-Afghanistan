import { z } from "zod";
import {
  EMPLOYMENT_TYPES,
  OPPORTUNITY_CATEGORIES,
  WORK_MODES,
} from "@/features/opportunities/constants";
import type {
  EmploymentType,
  OpportunityCategory,
  WorkMode,
} from "@/features/opportunities/types";

const CATEGORY_VALUES = OPPORTUNITY_CATEGORIES.map(
  (category) => category.value,
) as [OpportunityCategory, ...OpportunityCategory[]];
const WORK_MODE_VALUES = WORK_MODES.map((workMode) => workMode.value) as [
  WorkMode,
  ...WorkMode[],
];
const EMPLOYMENT_TYPE_VALUES = EMPLOYMENT_TYPES.map(
  (employmentType) => employmentType.value,
) as [EmploymentType, ...EmploymentType[]];

const trimmedText = (fieldName: string, minLength: number, maxLength: number) =>
  z
    .string({ error: `${fieldName} is required.` })
    .trim()
    .min(minLength, `${fieldName} is required.`)
    .max(maxLength, `${fieldName} must be ${maxLength} characters or fewer.`);

const normalizedStringList = (
  fieldName: string,
  minItems: number,
  maxItems: number,
  itemMaxLength: number,
) =>
  z
    .array(
      z
        .string({ error: `${fieldName} must contain text values.` })
        .trim()
        .min(1, `${fieldName} entries cannot be empty.`)
        .max(
          itemMaxLength,
          `${fieldName} entries must be ${itemMaxLength} characters or fewer.`,
        ),
    )
    .min(minItems, `${fieldName} must include at least ${minItems} item.`)
    .max(maxItems, `${fieldName} must include ${maxItems} items or fewer.`)
    .transform((items) => [...new Set(items)]);

const futureDeadline = z
  .string({ error: "Deadline is required." })
  .trim()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Deadline must be a valid date.",
  })
  .transform((value) => new Date(value))
  .refine((value) => value.getTime() > Date.now(), {
    message: "Deadline must be in the future.",
  });

const httpUrl = z
  .string({ error: "Apply link is required." })
  .trim()
  .url("Apply link must be a valid URL.")
  .refine(
    (value) => {
      try {
        const protocol = new URL(value).protocol;
        return protocol === "http:" || protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Apply link must use HTTP or HTTPS." },
  );

const opportunityInputSchema = z.object({
  title: trimmedText("Title", 3, 120),
  organization: trimmedText("Organization", 2, 120),
  category: z.enum(CATEGORY_VALUES, {
    error: "Category must be a supported opportunity category.",
  }),
  location: trimmedText("Location", 2, 120),
  country: trimmedText("Country", 2, 120),
  workMode: z.enum(WORK_MODE_VALUES, {
    error: "Work mode must be remote, onsite, or hybrid.",
  }),
  employmentType: z.enum(EMPLOYMENT_TYPE_VALUES, {
    error: "Employment type must be supported.",
  }),
  deadline: futureDeadline,
  description: trimmedText("Description", 40, 3000),
  requirements: normalizedStringList("Requirements", 1, 12, 240),
  applyLink: httpUrl,
  tags: normalizedStringList("Tags", 1, 12, 40),
  featured: z.boolean().optional(),
});

export const opportunityCreateInputSchema = opportunityInputSchema.extend({
  featured: z.boolean().optional().default(false),
});

export const opportunityUpdateInputSchema = opportunityInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided.",
  });

export type OpportunityCreateInput = z.infer<typeof opportunityCreateInputSchema>;
export type OpportunityUpdateInput = z.infer<typeof opportunityUpdateInputSchema>;
