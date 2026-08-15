"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "kaaryab:saved-opportunity-ids";

type SavedOpportunitiesContextValue = {
  savedOpportunityIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  clearSaved: () => void;
};

const SavedOpportunitiesContext =
  createContext<SavedOpportunitiesContextValue | null>(null);

export function SavedOpportunitiesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) {
      return [];
    }

    try {
      const parsedValue = JSON.parse(storedValue);

      if (Array.isArray(parsedValue)) {
        return parsedValue.filter(
          (value): value is string => typeof value === "string",
        );
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    return [];
  });

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(savedOpportunityIds),
    );
  }, [savedOpportunityIds]);

  const isSaved = useCallback(
    (id: string) => savedOpportunityIds.includes(id),
    [savedOpportunityIds],
  );

  const toggleSaved = useCallback((id: string) => {
    setSavedOpportunityIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    );
  }, []);

  const clearSaved = useCallback(() => {
    setSavedOpportunityIds([]);
  }, []);

  const value = useMemo(
    () => ({
      savedOpportunityIds,
      isSaved,
      toggleSaved,
      clearSaved,
    }),
    [clearSaved, isSaved, savedOpportunityIds, toggleSaved],
  );

  return (
    <SavedOpportunitiesContext.Provider value={value}>
      {children}
    </SavedOpportunitiesContext.Provider>
  );
}

export function useSavedOpportunities() {
  const context = useContext(SavedOpportunitiesContext);

  if (!context) {
    throw new Error(
      "useSavedOpportunities must be used within SavedOpportunitiesProvider",
    );
  }

  return context;
}
