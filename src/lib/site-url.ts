const LOCAL_DEVELOPMENT_URL = "http://localhost:3000";

type SiteUrlEnv = Partial<
  Pick<
    NodeJS.ProcessEnv,
    | "NEXT_PUBLIC_SITE_URL"
    | "AUTH_URL"
    | "VERCEL_PROJECT_PRODUCTION_URL"
    | "VERCEL_URL"
    | "NODE_ENV"
  >
>;

const SITE_URL_VARIABLES = [
  "NEXT_PUBLIC_SITE_URL",
  "AUTH_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "VERCEL_URL",
] as const;

export function getSiteUrl() {
  return resolveSiteUrl(process.env);
}

export function resolveSiteUrl(env: SiteUrlEnv) {
  for (const variableName of SITE_URL_VARIABLES) {
    const normalizedUrl = normalizeSiteUrlCandidate(env[variableName]);

    if (normalizedUrl) {
      return normalizedUrl;
    }
  }

  if (env.NODE_ENV !== "production") {
    return LOCAL_DEVELOPMENT_URL;
  }

  throw new Error(
    "Missing valid site URL configuration. Set NEXT_PUBLIC_SITE_URL or AUTH_URL to the deployed application URL, or provide a valid Vercel URL environment variable.",
  );
}

function normalizeSiteUrlCandidate(value: string | undefined) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  const protocolValue = addProtocol(trimmedValue);

  try {
    return new URL(protocolValue).origin;
  } catch {
    return null;
  }
}

function addProtocol(value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (/^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/i.test(value)) {
    return `http://${value}`;
  }

  return `https://${value}`;
}
