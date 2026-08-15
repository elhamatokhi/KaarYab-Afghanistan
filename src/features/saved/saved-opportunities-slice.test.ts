import { describe, expect, it } from "vitest";
import savedOpportunitiesReducer, {
  beginSavedOpportunitiesLoad,
  clearSavedOpportunities,
  markSavedOpportunitiesError,
  removeOpportunity,
  saveOpportunity,
  setSavedOpportunities,
} from "@/features/saved/saved-opportunities-slice";

describe("saved opportunities slice", () => {
  it("starts with empty idle state", () => {
    expect(savedOpportunitiesReducer(undefined, { type: "unknown" })).toEqual({
      ids: [],
      status: "idle",
      accountKey: null,
    });
  });

  it("marks a user-owned saved state as loading and clears another account", () => {
    const previousState = {
      ids: ["opp-1"],
      status: "ready" as const,
      accountKey: "user-a",
    };

    expect(
      savedOpportunitiesReducer(
        previousState,
        beginSavedOpportunitiesLoad({ accountKey: "user-b" }),
      ),
    ).toEqual({
      ids: [],
      status: "loading",
      accountKey: "user-b",
    });
  });

  it("sets unique saved IDs for the active account", () => {
    expect(
      savedOpportunitiesReducer(
        undefined,
        setSavedOpportunities({
          ids: ["opp-1", "opp-1", " opp-2 "],
          accountKey: "user-a",
        }),
      ),
    ).toEqual({
      ids: ["opp-1", "opp-2"],
      status: "ready",
      accountKey: "user-a",
    });
  });

  it("saves an opportunity ID without duplicates", () => {
    const state = savedOpportunitiesReducer(undefined, saveOpportunity("opp-1"));

    expect(savedOpportunitiesReducer(state, saveOpportunity("opp-1")).ids).toEqual([
      "opp-1",
    ]);
  });

  it("removes one saved ID", () => {
    const state = savedOpportunitiesReducer(
      { ids: ["opp-1", "opp-2"], status: "ready", accountKey: "user-a" },
      removeOpportunity("opp-1"),
    );

    expect(state.ids).toEqual(["opp-2"]);
  });

  it("clears saved IDs on logout or account change", () => {
    const state = savedOpportunitiesReducer(
      { ids: ["opp-1", "opp-2"], status: "ready", accountKey: "user-a" },
      clearSavedOpportunities(),
    );

    expect(state).toEqual({
      ids: [],
      status: "idle",
      accountKey: null,
    });
  });

  it("clears client-visible state when saved loading fails", () => {
    const state = savedOpportunitiesReducer(
      { ids: ["opp-1"], status: "loading", accountKey: "user-a" },
      markSavedOpportunitiesError(),
    );

    expect(state).toEqual({
      ids: [],
      status: "error",
      accountKey: "user-a",
    });
  });
});
