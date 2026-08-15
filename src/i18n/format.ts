import type { Locale } from "@/i18n/config";
import type { MessageKey, Messages } from "@/i18n/messages";

export function createTranslator(messages: Messages) {
  return function t(
    key: MessageKey,
    values: Record<string, string | number> = {},
  ) {
    return formatMessage(messages[key], values);
  };
}

export function formatMessage(
  message: string,
  values: Record<string, string | number> = {},
) {
  return message.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(values, name)
      ? String(values[name])
      : match,
  );
}

export function formatLocalizedDate(value: string | Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function formatLocalizedNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale).format(value);
}
