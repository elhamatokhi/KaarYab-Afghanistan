import { describe, expect, it } from "vitest";
import {
  isoDateToDateTimeLocal,
  parseCommaSeparatedList,
  parseMultilineList,
} from "@/features/opportunities/form-utils";

describe("opportunity form helpers", () => {
  it("normalizes multiline requirements", () => {
    expect(
      parseMultilineList("  First requirement  \n\nSecond requirement\nFirst requirement"),
    ).toEqual(["First requirement", "Second requirement"]);
  });

  it("normalizes comma-separated tags", () => {
    expect(parseCommaSeparatedList(" youth, remote, youth,  leadership ")).toEqual([
      "youth",
      "remote",
      "leadership",
    ]);
  });

  it("converts an ISO date to a datetime-local value", () => {
    expect(isoDateToDateTimeLocal("2099-02-01T23:59:00.000Z")).toBe(
      "2099-02-01T23:59",
    );
  });
});
