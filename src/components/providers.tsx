"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { SavedOpportunitiesReduxProvider } from "@/features/saved/saved-opportunities-provider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SavedOpportunitiesReduxProvider>
          {children}
        </SavedOpportunitiesReduxProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
