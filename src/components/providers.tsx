"use client";

import { ThemeProvider } from "next-themes";
import { useMemo, type ReactNode } from "react";
import { demoOpportunities } from "@/features/opportunities/demo-data";
import { SavedOpportunitiesReduxProvider } from "@/features/saved/saved-opportunities-provider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const validOpportunityIds = useMemo(
    () => demoOpportunities.map((opportunity) => opportunity.id),
    [],
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SavedOpportunitiesReduxProvider validOpportunityIds={validOpportunityIds}>
        {children}
      </SavedOpportunitiesReduxProvider>
    </ThemeProvider>
  );
}
