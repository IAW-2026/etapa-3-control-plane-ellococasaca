import { auth } from "@clerk/nextjs/server";
import { hasAdminRole } from "@/lib/admin-role";

export async function requireAdmin() {
  const authState = await auth();

  if (!authState.userId || !hasAdminRole(authState.sessionClaims)) {
    throw new Error("No autorizado");
  }

  return authState;
}
