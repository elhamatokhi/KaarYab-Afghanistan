export function isAdminRole(role: string | undefined) {
  return role === "ADMIN";
}

export function isUserRole(role: string | undefined) {
  return role === "USER";
}

export function getAdminAuthorizationStatus(
  session: { user?: { role?: string } } | null,
) {
  if (!session?.user) {
    return "unauthenticated";
  }

  if (!isAdminRole(session.user.role)) {
    return "forbidden";
  }

  return "authorized";
}

export function getUserSavedAuthorizationStatus(
  session: { user?: { role?: string } } | null,
) {
  if (!session?.user) {
    return "unauthenticated";
  }

  if (!isUserRole(session.user.role)) {
    return "forbidden";
  }

  return "authorized";
}

export function getRoleInterfacePermissions(role: string | undefined) {
  return {
    canUseSavedOpportunities: isUserRole(role),
    canManageOpportunities: isAdminRole(role),
  };
}
