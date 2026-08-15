"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { getDemoLoginFormValues } from "@/features/auth/demo-accounts";
import { loginInputSchema, type LoginInput } from "@/features/auth/validation";
import { zodToHookFormErrors } from "@/features/auth/auth-form-utils";
import { useI18n } from "@/i18n/client";
import { translateValidationMessage } from "@/i18n/validation";
import { cn } from "@/lib/utils";

type DemoLoginAccount = {
  email: string;
  password: string;
};

type LoginFormProps = {
  demoAccounts: {
    user: DemoLoginAccount;
    admin: DemoLoginAccount;
  };
};

const loginResolver: Resolver<LoginInput> = async (values) => {
  const result = loginInputSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  return {
    values: {},
    errors: zodToHookFormErrors<LoginInput>(result.error, isLoginField),
  };
};

export function LoginForm({ demoAccounts }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<LoginInput>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
    resolver: loginResolver,
  });

  async function onSubmit(values: LoginInput) {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setError("root", {
        type: "auth",
        message: t("auth.invalidCredentials"),
      });
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  function fillDemoAccount(account: DemoLoginAccount) {
    const values = getDemoLoginFormValues(account);

    setValue("email", values.email, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("password", values.password, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
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

      <section
        aria-labelledby="demo-accounts-heading"
        className="rounded-md border border-border bg-surface p-4"
      >
        <h2 id="demo-accounts-heading" className="text-base font-semibold text-primary">
          {t("auth.demoAccounts")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {t("auth.demoWarning")}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <DemoAccountCard
            title={t("auth.demoUser")}
            account={demoAccounts.user}
            onFill={() => fillDemoAccount(demoAccounts.user)}
            useLabel={t("auth.useAccount", { title: t("auth.demoUser") })}
            emailLabel={t("common.email")}
            passwordLabel={t("common.password")}
          />
          <DemoAccountCard
            title={t("auth.demoAdmin")}
            account={demoAccounts.admin}
            onFill={() => fillDemoAccount(demoAccounts.admin)}
            useLabel={t("auth.useAccount", { title: t("auth.demoAdmin") })}
            emailLabel={t("common.email")}
            passwordLabel={t("common.password")}
          />
        </div>
      </section>

      <FormField id="login-email" label={t("common.email")} error={errors.email?.message}>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          className={fieldClassName(errors.email?.message)}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={fieldDescriptionId("login-email", errors.email?.message)}
          {...register("email")}
        />
      </FormField>

      <FormField
        id="login-password"
        label={t("common.password")}
        error={errors.password?.message}
      >
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          className={fieldClassName(errors.password?.message)}
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={fieldDescriptionId(
            "login-password",
            errors.password?.message,
          )}
          {...register("password")}
        />
      </FormField>

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {t("auth.needAccount")}{" "}
          <Link href="/register" className="font-semibold text-action">
            {t("common.register")}
          </Link>
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-action px-5 py-2 text-sm font-semibold text-action-foreground transition hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? t("auth.loggingIn") : t("common.login")}
        </button>
      </div>
    </form>
  );
}

function DemoAccountCard({
  account,
  emailLabel,
  onFill,
  passwordLabel,
  title,
  useLabel,
}: {
  account: DemoLoginAccount;
  emailLabel: string;
  onFill: () => void;
  passwordLabel: string;
  title: string;
  useLabel: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <h3 className="text-sm font-semibold text-primary">{title}</h3>
      <dl className="mt-2 space-y-1 text-xs leading-5 text-muted">
        <div>
          <dt className="font-medium text-primary">{emailLabel}</dt>
          <dd className="break-all">{account.email}</dd>
        </div>
        <div>
          <dt className="font-medium text-primary">{passwordLabel}</dt>
          <dd className="break-all">{account.password}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onFill}
        className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-primary transition hover:bg-surface-elevated"
      >
        {useLabel}
      </button>
    </div>
  );
}

function getSafeCallbackUrl(value: string | null) {
  if (value?.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return "/";
}

function isLoginField(fieldName: string): fieldName is keyof LoginInput {
  return fieldName === "email" || fieldName === "password";
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
