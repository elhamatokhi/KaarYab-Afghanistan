"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import {
  registerInputSchema,
  type RegisterInput,
} from "@/features/auth/validation";
import { zodToHookFormErrors } from "@/features/auth/auth-form-utils";
import { useI18n } from "@/i18n/client";
import { translateValidationMessage } from "@/i18n/validation";
import { cn } from "@/lib/utils";

const registerResolver: Resolver<RegisterInput> = async (values) => {
  const result = registerInputSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  return {
    values: {},
    errors: zodToHookFormErrors<RegisterInput>(result.error, isRegisterField),
  };
};

export function RegisterForm() {
  const router = useRouter();
  const { t } = useI18n();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<RegisterInput>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
    resolver: registerResolver,
  });

  async function onSubmit(values: RegisterInput) {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      setError("root", {
        type: "server",
        message: t("auth.registrationFailed"),
      });
      return;
    }

    router.push("/login?registered=1");
  }

  return (
    <form
      noValidate
      aria-busy={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-lg border border-border bg-card p-5 sm:p-6"
    >
      {errors.root?.message ? (
        <div
          role="alert"
          className="rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm leading-6 text-danger"
        >
          {errors.root.message}
        </div>
      ) : null}

      <FormField id="register-name" label={t("common.name")} error={errors.name?.message}>
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          required
          className={fieldClassName(errors.name?.message)}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={fieldDescriptionId(
            "register-name",
            errors.name?.message,
          )}
          {...register("name")}
        />
      </FormField>

      <FormField id="register-email" label={t("common.email")} error={errors.email?.message}>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          required
          className={fieldClassName(errors.email?.message)}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={fieldDescriptionId(
            "register-email",
            errors.email?.message,
          )}
          {...register("email")}
        />
      </FormField>

      <FormField
        id="register-password"
        label={t("common.password")}
        error={errors.password?.message}
      >
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          required
          className={fieldClassName(errors.password?.message)}
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={fieldDescriptionId(
            "register-password",
            errors.password?.message,
          )}
          {...register("password")}
        />
      </FormField>

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {t("auth.haveAccount")}{" "}
          <Link href="/login" className="font-semibold text-action">
            {t("common.login")}
          </Link>
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-action px-5 py-2 text-sm font-semibold text-action-foreground transition hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? t("auth.creatingAccount") : t("auth.createAccount")}
        </button>
      </div>
    </form>
  );
}

function isRegisterField(fieldName: string): fieldName is keyof RegisterInput {
  return fieldName === "name" || fieldName === "email" || fieldName === "password";
}

function FormField({
  children,
  error,
  id,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  id: string;
  label: string;
}) {
  const { locale } = useI18n();
  const translatedError = error
    ? translateValidationMessage(error, locale)
    : undefined;

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-primary">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {translatedError ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-danger">
          {translatedError}
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
    "min-h-11 w-full rounded-md border bg-surface px-3 py-2 text-sm text-primary",
    error ? "border-danger" : "border-border",
  );
}
