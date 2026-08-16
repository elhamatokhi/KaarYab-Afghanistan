import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "@/lib/site-url";

describe("site URL resolution", () => {
  it("uses localhost only outside production when no URL is configured", () => {
    expect(resolveSiteUrl({ NODE_ENV: "development" })).toBe(
      "http://localhost:3000",
    );
  });

  it("ignores empty and whitespace-only values", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: " ",
        AUTH_URL: "\n\t",
        VERCEL_PROJECT_PRODUCTION_URL: "",
        VERCEL_URL: "preview.example.vercel.app",
        NODE_ENV: "production",
      }),
    ).toBe("https://preview.example.vercel.app");
  });

  it("normalizes protocol-less production hosts to https", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "kaaryab.example.com",
        NODE_ENV: "production",
      }),
    ).toBe("https://kaaryab.example.com");
  });

  it("normalizes protocol-less localhost to http", () => {
    expect(
      resolveSiteUrl({
        AUTH_URL: "localhost:3000",
        NODE_ENV: "development",
      }),
    ).toBe("http://localhost:3000");
  });

  it("accepts valid configured URLs and removes paths and trailing slashes", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: " https://kaaryab.example.com/about/ ",
        NODE_ENV: "production",
      }),
    ).toBe("https://kaaryab.example.com");
  });

  it("falls through malformed candidates to the next valid candidate", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://",
        AUTH_URL: "::::",
        VERCEL_PROJECT_PRODUCTION_URL: "kaaryab.example.com",
        NODE_ENV: "production",
      }),
    ).toBe("https://kaaryab.example.com");
  });

  it("throws a safe actionable error in production when no valid URL exists", () => {
    expect(() =>
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://",
        AUTH_URL: " ",
        VERCEL_URL: "::::",
        NODE_ENV: "production",
      }),
    ).toThrow(
      "Missing valid site URL configuration. Set NEXT_PUBLIC_SITE_URL or AUTH_URL to the deployed application URL, or provide a valid Vercel URL environment variable.",
    );
  });
});
