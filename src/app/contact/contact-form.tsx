"use client";

import { useState } from "react";
import type { FieldErrors, Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name using at least 2 characters.")
    .max(80, "Name must be 80 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .email("Enter a valid email address.")
    .max(120, "Email must be 120 characters or fewer."),
  subject: z
    .string()
    .trim()
    .min(4, "Enter a subject using at least 4 characters.")
    .max(120, "Subject must be 120 characters or fewer."),
  message: z
    .string()
    .trim()
    .min(20, "Enter a message using at least 20 characters.")
    .max(1000, "Message must be 1,000 characters or fewer."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;
type SubmissionState = "idle" | "success" | "error";

const contactFormResolver: Resolver<ContactFormValues> = async (values) => {
  const result = contactFormSchema.safeParse(values);

  if (result.success) {
    return {
      values: result.data,
      errors: {},
    };
  }

  const fieldErrors = result.error.flatten().fieldErrors;

  return {
    values: {},
    errors: Object.entries(fieldErrors).reduce<FieldErrors<ContactFormValues>>(
      (errors, [fieldName, messages]) => {
        const message = messages?.[0];

        if (message) {
          errors[fieldName as keyof ContactFormValues] = {
            type: "validation",
            message,
          };
        }

        return errors;
      },
      {},
    ),
  };
};

export function ContactForm() {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "onTouched",
    resolver: contactFormResolver,
  });

  async function onSubmit() {
    setSubmissionState("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      reset();
      setSubmissionState("success");
    } catch {
      setSubmissionState("error");
    }
  }

  return (
    <form
      noValidate
      aria-busy={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-lg border border-border bg-card p-5 sm:p-6"
    >
      <div>
        <h2 className="text-2xl font-semibold text-primary">
          Send a message
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          This demo form validates your message in the browser. No real message
          is sent yet.
        </p>
      </div>

      {submissionState === "success" ? (
        <div
          role="status"
          className="rounded-md border border-success/30 bg-success-soft px-4 py-3 text-sm leading-6 text-success"
        >
          Message checked successfully. This is a demo contact form, so no real
          message was sent.
        </div>
      ) : null}

      {submissionState === "error" ? (
        <div
          role="alert"
          className="rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm leading-6 text-danger"
        >
          The demo form could not finish the local submission simulation. Please
          try again.
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="contact-name"
          label="Name"
          error={errors.name?.message}
        >
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={fieldDescriptionId("contact-name", errors.name?.message)}
            className={fieldClassName(errors.name?.message)}
            {...register("name")}
          />
        </FormField>

        <FormField
          id="contact-email"
          label="Email"
          error={errors.email?.message}
        >
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            required
            maxLength={120}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={fieldDescriptionId(
              "contact-email",
              errors.email?.message,
            )}
            className={fieldClassName(errors.email?.message)}
            {...register("email")}
          />
        </FormField>
      </div>

      <FormField
        id="contact-subject"
        label="Subject"
        error={errors.subject?.message}
      >
        <input
          id="contact-subject"
          type="text"
          required
          maxLength={120}
          aria-invalid={errors.subject ? "true" : "false"}
          aria-describedby={fieldDescriptionId(
            "contact-subject",
            errors.subject?.message,
          )}
          className={fieldClassName(errors.subject?.message)}
          {...register("subject")}
        />
      </FormField>

      <FormField
        id="contact-message"
        label="Message"
        error={errors.message?.message}
      >
        <textarea
          id="contact-message"
          rows={7}
          required
          maxLength={1000}
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={fieldDescriptionId(
            "contact-message",
            errors.message?.message,
          )}
          className={cn(fieldClassName(errors.message?.message), "resize-y")}
          {...register("message")}
        />
      </FormField>

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted">
          Required fields are checked locally with Zod. No data is stored.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-action px-5 py-2 text-sm font-semibold text-action-foreground transition hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}

type FormFieldProps = {
  children: React.ReactNode;
  error?: string;
  id: string;
  label: string;
};

function FormField({ children, error, id, label }: FormFieldProps) {
  const errorId = `${id}-error`;

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
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function fieldDescriptionId(id: string, error?: string) {
  return error ? `${id}-error` : undefined;
}

function fieldClassName(error?: string) {
  return cn(
    "min-h-11 w-full rounded-md border bg-surface px-3 py-2 text-sm text-primary placeholder:text-muted",
    error ? "border-danger" : "border-border",
  );
}
