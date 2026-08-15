"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_DIRECTIONS,
  type Locale,
} from "@/i18n/config";
import {
  createTranslator,
  formatLocalizedDate,
  formatLocalizedNumber,
} from "@/i18n/format";
import { en, type Messages } from "@/i18n/messages";

type I18nContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  messages: Messages;
  t: ReturnType<typeof createTranslator>;
  formatDate: (value: string | Date) => string;
  formatNumber: (value: number) => string;
};

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  dir: LOCALE_DIRECTIONS[DEFAULT_LOCALE],
  messages: en,
  t: createTranslator(en),
  formatDate: (value) => formatLocalizedDate(value, DEFAULT_LOCALE),
  formatNumber: (value) => formatLocalizedNumber(value, DEFAULT_LOCALE),
});

export function I18nProvider({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: Locale;
  messages: Messages;
}) {
  const value = useMemo<I18nContextValue>(() => {
    const t = createTranslator(messages);

    return {
      locale,
      dir: LOCALE_DIRECTIONS[locale],
      messages,
      t,
      formatDate: (dateValue) => formatLocalizedDate(dateValue, locale),
      formatNumber: (numberValue) => formatLocalizedNumber(numberValue, locale),
    };
  }, [locale, messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
