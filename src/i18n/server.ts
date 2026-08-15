import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_DIRECTIONS,
  type Locale,
  isSupportedLocale,
} from "@/i18n/config";
import { createTranslator } from "@/i18n/format";
import { messages } from "@/i18n/messages";

export async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;

  return isSupportedLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
}

export async function getI18n() {
  const locale = await getCurrentLocale();
  const dictionary = messages[locale];

  return {
    locale,
    dir: LOCALE_DIRECTIONS[locale],
    messages: dictionary,
    t: createTranslator(dictionary),
  };
}
