export const LOCALES = ["en", "fa-AF", "ps", "de"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_NAME = "kaaryab-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  "fa-AF": "دری",
  ps: "پښتو",
  de: "Deutsch",
};

export const LOCALE_DIRECTIONS: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  "fa-AF": "rtl",
  ps: "rtl",
  de: "ltr",
};

export function isSupportedLocale(value: string | undefined): value is Locale {
  return LOCALES.some((locale) => locale === value);
}

export function createLocaleCookieValue(locale: Locale, maxAgeSeconds: number) {
  return `${LOCALE_COOKIE_NAME}=${encodeURIComponent(
    locale,
  )}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}
