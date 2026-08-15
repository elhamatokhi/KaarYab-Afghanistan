"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FieldErrors, Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  EMPLOYMENT_TYPES,
  OPPORTUNITY_CATEGORIES,
  WORK_MODES,
} from "@/features/opportunities/constants";
import {
  createBlankOpportunityFormValues,
  parseCommaSeparatedList,
  parseMultilineList,
  type OpportunityFormValues,
} from "@/features/opportunities/form-utils";
import {
  opportunityCreateInputSchema,
  opportunityUpdateInputSchema,
} from "@/features/opportunities/validation";
import { cn } from "@/lib/utils";

type OpportunityFormMode = "create" | "edit";

type OpportunityFormProps = {
  mode: OpportunityFormMode;
  defaultValues?: OpportunityFormValues;
  opportunityId?: string;
  cancelHref: string;
};

const formSchema = z.object({
  title: z.string(),
  organization: z.string(),
  category: z.string(),
  location: z.string(),
  country: z.string(),
  workMode: z.string(),
  employmentType: z.string(),
  deadline: z.string(),
  description: z.string(),
  requirements: z.string(),
  applyLink: z.string(),
  tags: z.string(),
  featured: z.boolean(),
});

const opportunityFormResolver: Resolver<OpportunityFormValues> = async (
  values,
) => {
  const formResult = formSchema.safeParse(values);

  if (!formResult.success) {
    return {
      values: {},
      errors: zodToHookFormErrors(formResult.error),
    };
  }

  const payloadResult = opportunityCreateInputSchema.safeParse(
    formValuesToPayload(formResult.data),
  );

  if (payloadResult.success) {
    return {
      values: formResult.data,
      errors: {},
    };
  }

  return {
    values: {},
    errors: zodToHookFormErrors(payloadResult.error),
  };
};

export function OpportunityForm({
  cancelHref,
  defaultValues = createBlankOpportunityFormValues(),
  mode,
  opportunityId,
}: OpportunityFormProps) {
  const router = useRouter();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<OpportunityFormValues>({
    defaultValues,
    mode: "onTouched",
    resolver: opportunityFormResolver,
  });

  async function onSubmit(values: OpportunityFormValues) {
    const payload = formValuesToPayload(values);
    const validationResult =
      mode === "create"
        ? opportunityCreateInputSchema.safeParse(payload)
        : opportunityUpdateInputSchema.safeParse(payload);

    if (!validationResult.success) {
      applyZodErrors(validationResult.error, setError);
      return;
    }

    const response = await fetch(
      mode === "create"
        ? "/api/opportunities"
        : `/api/opportunities/${opportunityId}`,
      {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validationResult.data),
      },
    );

    if (!response.ok) {
      await applyApiError(response, setError);
      return;
    }

    const body = (await response.json()) as { data?: { id?: string } };
    const redirectId = body.data?.id ?? opportunityId;

    if (!redirectId) {
      setError("root", {
        type: "server",
        message: "The saved opportunity could not be opened.",
      });
      return;
    }

    router.push(`/opportunities/${redirectId}`);
    router.refresh();
  }

  return (
    <form
      noValidate
      aria-busy={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-lg border border-border bg-card p-5 sm:p-6"
    >
      {errors.root?.message ? (
        <div
          role="alert"
          className="rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm leading-6 text-danger"
        >
          {errors.root.message}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="opportunity-title" label="Title" error={errors.title?.message}>
          <input
            id="opportunity-title"
            type="text"
            required
            maxLength={120}
            className={fieldClassName(errors.title?.message)}
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby={fieldDescriptionId(
              "opportunity-title",
              errors.title?.message,
            )}
            {...register("title")}
          />
        </FormField>

        <FormField
          id="opportunity-organization"
          label="Organization"
          error={errors.organization?.message}
        >
          <input
            id="opportunity-organization"
            type="text"
            required
            maxLength={120}
            className={fieldClassName(errors.organization?.message)}
            aria-invalid={errors.organization ? "true" : "false"}
            aria-describedby={fieldDescriptionId(
              "opportunity-organization",
              errors.organization?.message,
            )}
            {...register("organization")}
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <FormField
          id="opportunity-category"
          label="Category"
          error={errors.category?.message}
        >
          <select
            id="opportunity-category"
            required
            className={fieldClassName(errors.category?.message)}
            aria-invalid={errors.category ? "true" : "false"}
            aria-describedby={fieldDescriptionId(
              "opportunity-category",
              errors.category?.message,
            )}
            {...register("category")}
          >
            <option value="">Select category</option>
            {OPPORTUNITY_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="opportunity-work-mode"
          label="Work mode"
          error={errors.workMode?.message}
        >
          <select
            id="opportunity-work-mode"
            required
            className={fieldClassName(errors.workMode?.message)}
            aria-invalid={errors.workMode ? "true" : "false"}
            aria-describedby={fieldDescriptionId(
              "opportunity-work-mode",
              errors.workMode?.message,
            )}
            {...register("workMode")}
          >
            <option value="">Select mode</option>
            {WORK_MODES.map((workMode) => (
              <option key={workMode.value} value={workMode.value}>
                {workMode.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="opportunity-employment-type"
          label="Opportunity type"
          error={errors.employmentType?.message}
        >
          <select
            id="opportunity-employment-type"
            required
            className={fieldClassName(errors.employmentType?.message)}
            aria-invalid={errors.employmentType ? "true" : "false"}
            aria-describedby={fieldDescriptionId(
              "opportunity-employment-type",
              errors.employmentType?.message,
            )}
            {...register("employmentType")}
          >
            <option value="">Select type</option>
            {EMPLOYMENT_TYPES.map((employmentType) => (
              <option key={employmentType.value} value={employmentType.value}>
                {employmentType.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          id="opportunity-deadline"
          label="Deadline"
          error={errors.deadline?.message}
        >
          <input
            id="opportunity-deadline"
            type="datetime-local"
            required
            className={fieldClassName(errors.deadline?.message)}
            aria-invalid={errors.deadline ? "true" : "false"}
            aria-describedby={fieldDescriptionId(
              "opportunity-deadline",
              errors.deadline?.message,
            )}
            {...register("deadline")}
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="opportunity-location"
          label="Location"
          error={errors.location?.message}
        >
          <input
            id="opportunity-location"
            type="text"
            required
            maxLength={120}
            className={fieldClassName(errors.location?.message)}
            aria-invalid={errors.location ? "true" : "false"}
            aria-describedby={fieldDescriptionId(
              "opportunity-location",
              errors.location?.message,
            )}
            {...register("location")}
          />
        </FormField>

        <FormField
          id="opportunity-country"
          label="Country"
          error={errors.country?.message}
        >
          <input
            id="opportunity-country"
            type="text"
            required
            maxLength={120}
            className={fieldClassName(errors.country?.message)}
            aria-invalid={errors.country ? "true" : "false"}
            aria-describedby={fieldDescriptionId(
              "opportunity-country",
              errors.country?.message,
            )}
            {...register("country")}
          />
        </FormField>
      </div>

      <FormField
        id="opportunity-description"
        label="Description"
        error={errors.description?.message}
      >
        <textarea
          id="opportunity-description"
          rows={7}
          required
          maxLength={3000}
          className={cn(fieldClassName(errors.description?.message), "resize-y")}
          aria-invalid={errors.description ? "true" : "false"}
          aria-describedby={fieldDescriptionId(
            "opportunity-description",
            errors.description?.message,
          )}
          {...register("description")}
        />
      </FormField>

      <div className="grid gap-5 lg:grid-cols-2">
        <FormField
          id="opportunity-requirements"
          label="Requirements"
          error={errors.requirements?.message}
          hint="Enter one requirement per line."
        >
          <textarea
            id="opportunity-requirements"
            rows={6}
            required
            className={cn(fieldClassName(errors.requirements?.message), "resize-y")}
            aria-invalid={errors.requirements ? "true" : "false"}
            aria-describedby={fieldDescriptionId(
              "opportunity-requirements",
              errors.requirements?.message,
              true,
            )}
            {...register("requirements")}
          />
        </FormField>

        <FormField
          id="opportunity-tags"
          label="Tags"
          error={errors.tags?.message}
          hint="Separate tags with commas."
        >
          <textarea
            id="opportunity-tags"
            rows={6}
            required
            className={cn(fieldClassName(errors.tags?.message), "resize-y")}
            aria-invalid={errors.tags ? "true" : "false"}
            aria-describedby={fieldDescriptionId(
              "opportunity-tags",
              errors.tags?.message,
              true,
            )}
            {...register("tags")}
          />
        </FormField>
      </div>

      <FormField
        id="opportunity-apply-link"
        label="Apply link"
        error={errors.applyLink?.message}
      >
        <input
          id="opportunity-apply-link"
          type="url"
          required
          className={fieldClassName(errors.applyLink?.message)}
          aria-invalid={errors.applyLink ? "true" : "false"}
          aria-describedby={fieldDescriptionId(
            "opportunity-apply-link",
            errors.applyLink?.message,
          )}
          {...register("applyLink")}
        />
      </FormField>

      <div className="rounded-md border border-border bg-surface px-4 py-3">
        <label className="flex items-start gap-3 text-sm text-primary">
          <input
            type="checkbox"
            className="mt-1 size-4 rounded border-border accent-current"
            {...register("featured")}
          />
          <span>
            <span className="font-semibold">Featured opportunity</span>
            <span className="block text-muted">
              Highlight this listing in featured sections.
            </span>
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted">
          All fields except featured status are required.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={cancelHref}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface px-5 py-2 text-sm font-semibold text-primary transition hover:bg-surface-elevated"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-action px-5 py-2 text-sm font-semibold text-action-foreground transition hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
                ? "Create opportunity"
                : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

function formValuesToPayload(values: OpportunityFormValues) {
  return {
    ...values,
    deadline: values.deadline ? new Date(values.deadline).toISOString() : "",
    requirements: parseMultilineList(values.requirements),
    tags: parseCommaSeparatedList(values.tags),
  };
}

async function applyApiError(
  response: Response,
  setError: ReturnType<typeof useForm<OpportunityFormValues>>["setError"],
) {
  const body = await readJsonSafely(response);
  const fields = body?.error?.fields;

  if (fields && typeof fields === "object") {
    for (const [fieldName, messages] of Object.entries(fields)) {
      const message = Array.isArray(messages) ? messages[0] : undefined;
      const formFieldName = getTopLevelFieldName(fieldName);

      if (message && isOpportunityFormField(formFieldName)) {
        setError(formFieldName, { type: "server", message });
      }
    }
    return;
  }

  setError("root", {
    type: "server",
    message:
      body?.error?.message ??
      "The opportunity could not be saved. Please try again.",
  });
}

async function readJsonSafely(response: Response) {
  try {
    return (await response.json()) as {
      error?: {
        message?: string;
        fields?: Record<string, string[]>;
      };
    };
  } catch {
    return null;
  }
}

function applyZodErrors(
  error: z.ZodError,
  setError: ReturnType<typeof useForm<OpportunityFormValues>>["setError"],
) {
  for (const issue of error.issues) {
    const fieldName = getTopLevelFieldName(issue.path.join("."));

    if (isOpportunityFormField(fieldName)) {
      setError(fieldName, { type: "validation", message: issue.message });
    }
  }
}

function zodToHookFormErrors(error: z.ZodError) {
  const fieldErrors = error.flatten().fieldErrors;

  return Object.entries(fieldErrors).reduce<FieldErrors<OpportunityFormValues>>(
    (errors, [fieldName, messages]) => {
      const message = Array.isArray(messages) ? messages[0] : undefined;

      if (message && isOpportunityFormField(fieldName)) {
        errors[fieldName] = {
          type: "validation",
          message,
        };
      }

      return errors;
    },
    {},
  );
}

function isOpportunityFormField(
  fieldName: string,
): fieldName is keyof OpportunityFormValues {
  return fieldName in createBlankOpportunityFormValues();
}

function getTopLevelFieldName(fieldName: string) {
  return fieldName.split(".")[0] ?? fieldName;
}

type FormFieldProps = {
  children: React.ReactNode;
  error?: string;
  hint?: string;
  id: string;
  label: string;
};

function FormField({ children, error, hint, id, label }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-primary">
        {label}
        <span className="text-danger" aria-hidden="true">
          {" "}
          *
        </span>
      </label>
      <div className="mt-2">{children}</div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-2 text-xs leading-5 text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function fieldDescriptionId(id: string, error?: string, hasHint = false) {
  return [
    hasHint ? `${id}-hint` : undefined,
    error ? `${id}-error` : undefined,
  ]
    .filter(Boolean)
    .join(" ") || undefined;
}

function fieldClassName(error?: string) {
  return cn(
    "min-h-11 w-full rounded-md border bg-surface px-3 py-2 text-sm text-primary placeholder:text-muted",
    error ? "border-danger" : "border-border",
  );
}
