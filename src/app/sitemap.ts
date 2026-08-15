import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const publicRoutes = [
  "",
  "/opportunities",
  "/about",
  "/contact",
  "/login",
  "/register",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" || route === "/opportunities" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
