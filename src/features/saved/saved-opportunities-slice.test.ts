import { describe, expect, it } from "vitest";
import savedOpportunitiesReducer, {
  clearSavedOpportunities,
  hydrateSavedOpportunities,
  parsePersistedSavedOpportunityIds,
  removeOpportunity,
  saveOpportunity,
  toggleOpportunity,
  validateSavedOpportunityIds,
} from "@/features/saved/saved-opportunities-slice";

describe("saved opportunities slice", () => {
  it("starts with an empty non-hydrated state", () => {
    expect(savedOpportunitiesReducer(undefined, { type: "unknown" })).toEqual({
      ids: [],
      hydrated: false,
    });
  });

  it("saves an opportunity ID", () => {
    expect(
      savedOpportunitiesReducer(undefined, saveOpportunity("opp-1")),
    ).toMatchObject({
      ids: ["opp-1"],
    });
  });

  it("prevents duplicate saved IDs", () => {
    const state = savedOpportunitiesReducer(undefined, saveOpportunity("opp-1"));

    expect(savedOpportunitiesReducer(state, saveOpportunity("opp-1")).ids).toEqual([
      "opp-1",
    ]);
  });

  it("toggles saved IDs on and off", () => {
    const savedState = savedOpportunitiesReducer(
      undefined,
      toggleOpportunity("opp-1"),
    );
    const unsavedState = savedOpportunitiesReducer(
      savedState,
      toggleOpportunity("opp-1"),
    );

    expect(savedState.ids).toEqual(["opp-1"]);
    expect(unsavedState.ids).toEqual([]);
  });

  it("removes one saved ID", () => {
    const state = savedOpportunitiesReducer(
      { ids: ["opp-1", "opp-2"], hydrated: true },
      removeOpportunity("opp-1"),
    );

    expect(state.ids).toEqual(["opp-2"]);
  });

  it("clears all saved IDs", () => {
    const state = savedOpportunitiesReducer(
      { ids: ["opp-1", "opp-2"], hydrated: true },
      clearSavedOpportunities(),
    );

    expect(state.ids).toEqual([]);
  });

  it("hydrates with unique valid IDs", () => {
    const state = savedOpportunitiesReducer(
      undefined,
      hydrateSavedOpportunities(["opp-1", "opp-1", " opp-2 "]),
    );

    expect(state).toEqual({
      ids: ["opp-1", "opp-2"],
      hydrated: true,
    });
  });

  it("validates restored persisted IDs", () => {
    expect(
      validateSavedOpportunityIds(
        ["opp-1", "missing", 123, null, "opp-2", "opp-1"],
        ["opp-1", "opp-2"],
      ),
    ).toEqual(["opp-1", "opp-2"]);
  });

  it("ignores malformed persisted storage values", () => {
    expect(parsePersistedSavedOpportunityIds("not json", ["opp-1"])).toEqual([]);
    expect(parsePersistedSavedOpportunityIds("{}", ["opp-1"])).toEqual([]);
  });

  it("parses valid persisted storage values safely", () => {
    expect(
      parsePersistedSavedOpportunityIds(
        JSON.stringify(["opp-1", "missing", "opp-2"]),
        ["opp-1", "opp-2"],
      ),
    ).toEqual(["opp-1", "opp-2"]);
  });
});
