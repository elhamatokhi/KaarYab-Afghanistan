"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { SavedOpportunitiesReduxProvider } from "@/features/saved/saved-opportunities-provider";
import { I18nProvider } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";

type ProvidersProps = {
  children: ReactNode;
  locale: Locale;
  messages: Messages;
};

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <SessionProvider>
      <I18nProvider locale={locale} messages={messages}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SavedOpportunitiesReduxProvider>
            {children}
          </SavedOpportunitiesReduxProvider>
        </ThemeProvider>
      </I18nProvider>
    </SessionProvider>
  );
}
