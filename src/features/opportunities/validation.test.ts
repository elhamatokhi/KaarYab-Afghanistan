import { describe, expect, it } from "vitest";
import {
  opportunityCreateInputSchema,
  opportunityUpdateInputSchema,
} from "@/features/opportunities/validation";

const futureDeadline = "2099-01-15T23:59:00.000Z";

const validCreateInput = {
  title: "  Test Youth Program  ",
  organization: "  Test Learning Center  ",
  category: "training-program",
  location: "  Kabul  ",
  country: "  Afghanistan  ",
  workMode: "hybrid",
  employmentType: "fellowship",
  deadline: futureDeadline,
  description:
    "  A clearly fictional opportunity used to verify API validation behavior.  ",
  requirements: ["  Afghan youth applicant  ", "Basic English", "Basic English"],
  applyLink: " https://example.test/apply ",
  tags: ["  youth  ", "training", "training"],
  featured: true,
};

describe("opportunity validation", () => {
  it("validates and normalizes create input", () => {
    const result = opportunityCreateInputSchema.safeParse(validCreateInput);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toMatchObject({
        title: "Test Youth Program",
        organization: "Test Learning Center",
        category: "training-program",
        location: "Kabul",
        country: "Afghanistan",
        workMode: "hybrid",
        employmentType: "fellowship",
        description:
          "A clearly fictional opportunity used to verify API validation behavior.",
        requirements: ["Afghan youth applicant", "Basic English"],
        applyLink: "https://example.test/apply",
        tags: ["youth", "training"],
        featured: true,
      });
      expect(result.data.deadline.toISOString()).toBe(futureDeadline);
    }
  });

  it("defaults featured to false for create input", () => {
    const inputWithoutFeatured = {
      ...validCreateInput,
      featured: undefined,
    };
    delete inputWithoutFeatured.featured;
    const result = opportunityCreateInputSchema.safeParse(inputWithoutFeatured);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.featured).toBe(false);
    }
  });

  it("rejects missing required create fields", () => {
    const result = opportunityCreateInputSchema.safeParse({
      ...validCreateInput,
      title: " ",
      requirements: [],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path.join(".") === "title"),
      ).toBe(true);
      expect(
        result.error.issues.some(
          (issue) => issue.path.join(".") === "requirements",
        ),
      ).toBe(true);
    }
  });

  it("supports partial update validation", () => {
    const result = opportunityUpdateInputSchema.safeParse({
      title: "  Updated title  ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({ title: "Updated title" });
    }
  });

  it("rejects an empty update body", () => {
    const result = opportunityUpdateInputSchema.safeParse({});

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "At least one field must be provided.",
      );
    }
  });

  it("rejects invalid enum values", () => {
    const result = opportunityCreateInputSchema.safeParse({
      ...validCreateInput,
      category: "conference",
      workMode: "virtual",
      employmentType: "permanent",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path.join("."))).toEqual(
        expect.arrayContaining(["category", "workMode", "employmentType"]),
      );
    }
  });

  it("rejects non-http apply URLs", () => {
    const result = opportunityCreateInputSchema.safeParse({
      ...validCreateInput,
      applyLink: "mailto:apply@example.test",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["applyLink"]);
    }
  });

  it("rejects past deadlines", () => {
    const result = opportunityCreateInputSchema.safeParse({
      ...validCreateInput,
      deadline: "2020-01-01T00:00:00.000Z",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Deadline must be in the future.",
      );
    }
  });
});
