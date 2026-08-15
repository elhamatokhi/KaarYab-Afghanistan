import { describe, expect, it } from "vitest";
import { normalizeDatabaseUrlForPg } from "@/lib/database-url";

describe("database URL normalization", () => {
  it("upgrades Neon pg-adapter URLs to verify-full SSL mode", () => {
    const normalizedUrl = normalizeDatabaseUrlForPg(
      "postgresql://user:password@ep-example-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require",
    );

    expect(new URL(normalizedUrl).searchParams.get("sslmode")).toBe(
      "verify-full",
    );
  });

  it("leaves non-Neon URLs unchanged", () => {
    const url = "postgresql://user:password@localhost:5432/neondb?sslmode=require";

    expect(normalizeDatabaseUrlForPg(url)).toBe(url);
  });
});
