import { describe, expect, it } from "vitest";
import { demoOpportunities } from "@/features/opportunities/demo-data";
import {
  localizeDemoOpportunity,
  localizeOpportunityForEdit,
} from "@/features/opportunities/demo-localization";

describe("demo opportunity localization", () => {
  it("loads localized seeded values for the Edit form", () => {
    const opportunity = demoOpportunities[0];
    const localizedOpportunity = localizeOpportunityForEdit(opportunity, "fa-AF");

    expect(localizedOpportunity.id).toBe(opportunity.id);
    expect(localizedOpportunity.applyLink).toBe(opportunity.applyLink);
    expect(localizedOpportunity.deadline).toBe(opportunity.deadline);
    expect(localizedOpportunity.category).toBe(opportunity.category);
    expect(localizedOpportunity.workMode).toBe(opportunity.workMode);
    expect(localizedOpportunity.employmentType).toBe(opportunity.employmentType);
    expect(localizedOpportunity.title).not.toBe(opportunity.title);
    expect(localizedOpportunity.description).not.toBe(opportunity.description);
    expect(localizedOpportunity.requirements).not.toEqual(opportunity.requirements);
    expect(localizedOpportunity.tags).not.toEqual(opportunity.tags);
  });

  it("uses persisted locale-specific edits before seeded fallback text", () => {
    const opportunity = demoOpportunities[0];
    const localizedOpportunity = localizeDemoOpportunity(opportunity, "de", {
      country: "Afghanistan",
      description: "Persistierte deutsche Beschreibung für diese Chance.",
      location: "Kabul",
      organization: "Persistierte Organisation",
      requirements: ["Persistierte Anforderung"],
      tags: ["persistiert"],
      title: "Persistierter deutscher Titel",
    });

    expect(localizedOpportunity.title).toBe("Persistierter deutscher Titel");
    expect(localizedOpportunity.description).toBe(
      "Persistierte deutsche Beschreibung für diese Chance.",
    );
  });

  it("keeps user-created content unchanged without explicit locale content", () => {
    const userCreatedOpportunity = {
      ...demoOpportunities[0],
      id: "opp-user-created",
      title: "User-created opportunity title",
      description:
        "This was entered by a user and should remain exactly as entered.",
    };

    expect(localizeOpportunityForEdit(userCreatedOpportunity, "ps")).toEqual(
      userCreatedOpportunity,
    );
  });
});
