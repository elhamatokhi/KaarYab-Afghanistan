import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export const SAVED_OPPORTUNITIES_STORAGE_KEY = "kaaryab:saved-opportunity-ids";

type SavedOpportunitiesState = {
  ids: string[];
  hydrated: boolean;
};

const initialState: SavedOpportunitiesState = {
  ids: [],
  hydrated: false,
};

const savedOpportunitiesSlice = createSlice({
  name: "savedOpportunities",
  initialState,
  reducers: {
    saveOpportunity(state, action: PayloadAction<string>) {
      const id = action.payload.trim();

      if (id && !state.ids.includes(id)) {
        state.ids.push(id);
      }
    },
    removeOpportunity(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
    toggleOpportunity(state, action: PayloadAction<string>) {
      const id = action.payload.trim();

      if (!id) {
        return;
      }

      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((savedId) => savedId !== id);
      } else {
        state.ids.push(id);
      }
    },
    clearSavedOpportunities(state) {
      state.ids = [];
    },
    hydrateSavedOpportunities(state, action: PayloadAction<string[]>) {
      state.ids = uniqueIds(action.payload);
      state.hydrated = true;
    },
  },
});

export const {
  clearSavedOpportunities,
  hydrateSavedOpportunities,
  removeOpportunity,
  saveOpportunity,
  toggleOpportunity,
} = savedOpportunitiesSlice.actions;

export const selectSavedOpportunityIds = (state: RootState) =>
  state.savedOpportunities.ids;

export const selectSavedOpportunityCount = (state: RootState) =>
  state.savedOpportunities.ids.length;

export const selectSavedOpportunitiesHydrated = (state: RootState) =>
  state.savedOpportunities.hydrated;

export function selectIsOpportunitySaved(state: RootState, id: string) {
  return state.savedOpportunities.ids.includes(id);
}

export function parsePersistedSavedOpportunityIds(
  storedValue: string | null,
  validOpportunityIds: readonly string[],
) {
  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return validateSavedOpportunityIds(parsedValue, validOpportunityIds);
  } catch {
    return [];
  }
}

export function validateSavedOpportunityIds(
  values: unknown[],
  validOpportunityIds: readonly string[],
) {
  const validIds = new Set(validOpportunityIds);

  return uniqueIds(
    values.filter(
      (value): value is string =>
        typeof value === "string" && validIds.has(value),
    ),
  );
}

function uniqueIds(ids: readonly string[]) {
  return Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean)));
}

export default savedOpportunitiesSlice.reducer;
