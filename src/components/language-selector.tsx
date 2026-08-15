"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  LOCALES,
  LOCALE_LABELS,
  createLocaleCookieValue,
  type Locale,
} from "@/i18n/config";
import { useI18n } from "@/i18n/client";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function LanguageSelector() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { locale, t } = useI18n();

  function changeLocale(nextLocale: Locale) {
    document.cookie = createLocaleCookieValue(nextLocale, ONE_YEAR_SECONDS);

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <label className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-primary">
      <Languages aria-hidden="true" className="size-4" />
      <span className="sr-only">{t("locale.selectorLabel")}</span>
      <select
        value={locale}
        disabled={isPending}
        aria-label={t("locale.selectorLabel")}
        onChange={(event) => changeLocale(event.currentTarget.value as Locale)}
        className="bg-transparent text-sm font-semibold text-primary outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {LOCALES.map((availableLocale) => (
          <option key={availableLocale} value={availableLocale}>
            {LOCALE_LABELS[availableLocale]}
          </option>
        ))}
      </select>
    </label>
  );
}
