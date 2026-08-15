import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/add-opportunity",
        "/dashboard",
        "/saved",
        "/api/",
        "/opportunities/*/edit",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
