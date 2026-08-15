import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

type SavedOpportunitiesStatus = "idle" | "loading" | "ready" | "error";

type SavedOpportunitiesState = {
  ids: string[];
  status: SavedOpportunitiesStatus;
  accountKey: string | null;
};

const initialState: SavedOpportunitiesState = {
  ids: [],
  status: "idle",
  accountKey: null,
};

const savedOpportunitiesSlice = createSlice({
  name: "savedOpportunities",
  initialState,
  reducers: {
    beginSavedOpportunitiesLoad(
      state,
      action: PayloadAction<{ accountKey: string }>,
    ) {
      if (state.accountKey !== action.payload.accountKey) {
        state.ids = [];
      }

      state.accountKey = action.payload.accountKey;
      state.status = "loading";
    },
    setSavedOpportunities(
      state,
      action: PayloadAction<{ ids: string[]; accountKey: string }>,
    ) {
      state.ids = uniqueIds(action.payload.ids);
      state.accountKey = action.payload.accountKey;
      state.status = "ready";
    },
    markSavedOpportunitiesError(state) {
      state.ids = [];
      state.status = "error";
    },
    saveOpportunity(state, action: PayloadAction<string>) {
      const id = action.payload.trim();

      if (id && !state.ids.includes(id)) {
        state.ids.push(id);
      }
    },
    removeOpportunity(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
    clearSavedOpportunities(state) {
      state.ids = [];
      state.status = "idle";
      state.accountKey = null;
    },
  },
});

export const {
  beginSavedOpportunitiesLoad,
  clearSavedOpportunities,
  markSavedOpportunitiesError,
  removeOpportunity,
  saveOpportunity,
  setSavedOpportunities,
} = savedOpportunitiesSlice.actions;

export const selectSavedOpportunityIds = (state: RootState) =>
  state.savedOpportunities.ids;

export const selectSavedOpportunityCount = (state: RootState) =>
  state.savedOpportunities.ids.length;

export const selectSavedOpportunitiesStatus = (state: RootState) =>
  state.savedOpportunities.status;

export const selectSavedOpportunitiesAccountKey = (state: RootState) =>
  state.savedOpportunities.accountKey;

export function selectIsOpportunitySaved(state: RootState, id: string) {
  return state.savedOpportunities.ids.includes(id);
}

function uniqueIds(ids: readonly string[]) {
  return Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean)));
}

export default savedOpportunitiesSlice.reducer;
