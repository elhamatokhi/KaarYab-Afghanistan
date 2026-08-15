"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { SavedOpportunitiesProvider } from "@/context/saved-opportunities-context";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SavedOpportunitiesProvider>{children}</SavedOpportunitiesProvider>
    </ThemeProvider>
  );
}
