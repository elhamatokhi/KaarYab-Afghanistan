import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE_NAME,
  LOCALE_DIRECTIONS,
  createLocaleCookieValue,
  isSupportedLocale,
} from "@/i18n/config";
import {
  formatLocalizedDate,
  formatLocalizedNumber,
} from "@/i18n/format";
import { en, messages } from "@/i18n/messages";
import { translateValidationMessage } from "@/i18n/validation";
import { getPublicNavItemsForRole } from "@/components/site-navigation";
import { getRoleInterfacePermissions } from "@/features/auth/access-control";
import { demoOpportunities } from "@/features/opportunities/demo-data";
import { localizeDemoOpportunity } from "@/features/opportunities/demo-localization";

describe("i18n configuration", () => {
  it("uses English as the default locale", () => {
    expect(DEFAULT_LOCALE).toBe("en");
  });

  it("recognizes every supported locale", () => {
    expect(LOCALES).toEqual(["en", "fa-AF", "ps", "de"]);
    expect(LOCALES.every((locale) => isSupportedLocale(locale))).toBe(true);
    expect(isSupportedLocale("fr")).toBe(false);
  });

  it("sets correct text direction for LTR and RTL locales", () => {
    expect(LOCALE_DIRECTIONS.en).toBe("ltr");
    expect(LOCALE_DIRECTIONS.de).toBe("ltr");
    expect(LOCALE_DIRECTIONS["fa-AF"]).toBe("rtl");
    expect(LOCALE_DIRECTIONS.ps).toBe("rtl");
  });

  it("creates a persistent locale cookie without touching auth cookies", () => {
    expect(createLocaleCookieValue("fa-AF", 31536000)).toBe(
      `${LOCALE_COOKIE_NAME}=fa-AF; path=/; max-age=31536000; samesite=lax`,
    );
  });
});

describe("translation coverage", () => {
  it("keeps translation keys complete across all locales", () => {
    const englishKeys = Object.keys(en).sort();

    for (const locale of LOCALES) {
      expect(Object.keys(messages[locale]).sort()).toEqual(englishKeys);
    }
  });

  it("includes role-specific navigation labels in every locale", () => {
    for (const locale of LOCALES) {
      expect(messages[locale]["common.saved"]).toBeTruthy();
      expect(messages[locale]["common.dashboard"]).toBeTruthy();
      expect(messages[locale]["common.addOpportunity"]).toBeTruthy();
    }
  });

  it("keeps footer copy localized in every non-English locale", () => {
    const footerKeys = [
      "app.name",
      "footer.navigate",
      "footer.opportunities",
      "footer.project",
      "footer.browse",
      "footer.description",
      "footer.copyright",
      "footer.tagline",
    ] as const;

    for (const locale of ["fa-AF", "ps"] as const) {
      for (const key of footerKeys) {
        expect(messages[locale][key]).not.toBe(en[key]);
      }
    }

    for (const key of footerKeys.filter((key) => key !== "app.name" && key !== "footer.copyright")) {
      expect(messages.de[key]).not.toBe(en[key]);
    }
  });

  it("does not leave previously visible UI labels in English for non-English locales", () => {
    const checkedKeys = [
      "theme.system",
      "theme.dark",
      "theme.light",
      "common.search",
      "footer.browse",
      "dashboard.eyebrow",
      "dashboard.managementDescription",
      "dashboard.recordsCaption",
      "dashboard.deleteTitle",
      "dashboard.deleteDescription",
      "dashboard.deleteOpportunity",
      "common.cancel",
      "common.view",
      "common.edit",
      "common.delete",
      "opportunityForm.editTitle",
      "opportunityForm.opportunityType",
      "opportunityForm.requirementsHint",
      "contact.badge",
      "contact.status",
      "about.badge",
      "about.categoriesTitle",
      "about.demoTitle",
      "common.no",
      "common.featured",
    ] as const;

    for (const locale of ["fa-AF", "ps", "de"] as const) {
      for (const key of checkedKeys) {
        expect(messages[locale][key]).not.toBe(en[key]);
      }
    }
  });
});

describe("localized formatting", () => {
  it("formats dates using the selected locale", () => {
    const value = "2027-03-05T00:00:00.000Z";

    expect(formatLocalizedDate(value, "en")).toContain("2027");
    expect(formatLocalizedDate(value, "de")).toContain("2027");
    expect(formatLocalizedDate(value, "fa-AF")).not.toBe(
      formatLocalizedDate(value, "en"),
    );
  });

  it("formats numbers using the selected locale", () => {
    expect(formatLocalizedNumber(1234, "en")).toBe("1,234");
    expect(formatLocalizedNumber(1234, "de")).toBe("1.234");
    expect(formatLocalizedNumber(1234, "fa-AF")).not.toBe("1,234");
  });
});

describe("localized validation messages", () => {
  it("translates shared schema messages in non-English locales", () => {
    expect(
      translateValidationMessage("Enter a valid email address.", "fa-AF"),
    ).not.toBe("Enter a valid email address.");
    expect(
      translateValidationMessage("Deadline must be in the future.", "ps"),
    ).not.toBe("Deadline must be in the future.");
    expect(translateValidationMessage("Password is required.", "de")).not.toBe(
      "Password is required.",
    );
  });

  it("keeps unknown messages unchanged for safe fallback", () => {
    expect(
      translateValidationMessage("Custom user-created message", "fa-AF"),
    ).toBe("Custom user-created message");
  });
});

describe("role-specific UI permissions", () => {
  it("keeps saved and management controls mutually exclusive", () => {
    expect(getRoleInterfacePermissions(undefined)).toEqual({
      canUseSavedOpportunities: false,
      canManageOpportunities: false,
    });
    expect(getRoleInterfacePermissions("USER")).toEqual({
      canUseSavedOpportunities: true,
      canManageOpportunities: false,
    });
    expect(getRoleInterfacePermissions("ADMIN")).toEqual({
      canUseSavedOpportunities: false,
      canManageOpportunities: true,
    });
  });

  it("keeps Home navigation for anonymous and USER accounts but removes it for ADMIN", () => {
    expect(getPublicNavItemsForRole(undefined).map((item) => item.href)).toEqual([
      "/",
      "/opportunities",
      "/about",
      "/contact",
    ]);
    expect(getPublicNavItemsForRole("USER").map((item) => item.href)).toEqual([
      "/",
      "/opportunities",
      "/about",
      "/contact",
    ]);
    expect(getPublicNavItemsForRole("ADMIN").map((item) => item.href)).toEqual([
      "/opportunities",
      "/about",
      "/contact",
    ]);
  });
});

describe("seeded opportunity localization", () => {
  it("localizes seeded demo content without changing stable IDs", () => {
    const opportunity = demoOpportunities[0];

    for (const locale of ["fa-AF", "ps", "de"] as const) {
      const localizedOpportunity = localizeDemoOpportunity(opportunity, locale);

      expect(localizedOpportunity.id).toBe(opportunity.id);
      expect(localizedOpportunity.applyLink).toBe(opportunity.applyLink);
      expect(localizedOpportunity.deadline).toBe(opportunity.deadline);
      expect(localizedOpportunity.title).not.toBe(opportunity.title);
      expect(localizedOpportunity.description).not.toBe(opportunity.description);
    }
  });

  it("leaves user-created content unchanged when no seeded localization exists", () => {
    const userCreatedOpportunity = {
      ...demoOpportunities[0],
      id: "user-created-opportunity",
      title: "User Written Listing",
      description: "A user entered this listing in English and it must remain exact.",
    };

    expect(localizeDemoOpportunity(userCreatedOpportunity, "fa-AF")).toEqual(
      userCreatedOpportunity,
    );
  });
});
