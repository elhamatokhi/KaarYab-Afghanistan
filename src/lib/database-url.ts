const NEON_HOST_SUFFIX = ".neon.tech";

export function getRequiredDatabaseUrl(variableName: "DATABASE_URL" | "DIRECT_URL") {
  const value = process.env[variableName];

  if (!value) {
    throw new Error(`${variableName} is required.`);
  }

  return normalizeDatabaseUrlForPg(value);
}

export function normalizeDatabaseUrlForPg(connectionString: string) {
  const url = new URL(connectionString);

  if (url.hostname.endsWith(NEON_HOST_SUFFIX)) {
    const sslMode = url.searchParams.get("sslmode");

    if (!sslMode || ["prefer", "require", "verify-ca"].includes(sslMode)) {
      url.searchParams.set("sslmode", "verify-full");
    }
  }

  return url.toString();
}
