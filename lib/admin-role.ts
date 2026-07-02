type RoleClaims = {
  metadata?: {
    roles?: unknown;
  };
  publicMetadata?: {
    roles?: unknown;
  };
};

export function hasAdminRole(sessionClaims: unknown): boolean {
  const claims = sessionClaims as RoleClaims | null | undefined;
  const roles = claims?.metadata?.roles ?? claims?.publicMetadata?.roles;

  if (Array.isArray(roles)) {
    return roles.includes("admin");
  }

  return roles === "admin";
}
