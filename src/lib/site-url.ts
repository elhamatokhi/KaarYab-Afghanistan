export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL;
  const fallbackUrl =
    process.env.NODE_ENV === "production"
      ? "https://kaaryab-afghanistan.vercel.app"
      : "http://localhost:3000";

  return normalizeSiteUrl(configuredUrl ?? fallbackUrl);
}

function normalizeSiteUrl(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}
