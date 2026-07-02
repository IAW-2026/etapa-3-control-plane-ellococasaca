import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { hasAdminRole } from "@/lib/admin-role";

const CLERK_COOKIE_NAMES = ["__session", "__client_uat", "__clerk_db_jwt"];
const PUBLIC_PATHS = ["/sign-in", "/unauthorized"];

const clerk = clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  const authState = await auth();

  if (!authState.userId) {
    return authState.redirectToSignIn({ returnBackUrl: req.url });
  }

  if (!hasAdminRole(authState.sessionClaims)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  const hasHandshake = req.nextUrl.searchParams.has("__clerk_handshake");
  const hasExistingSession = CLERK_COOKIE_NAMES.some((name) => req.cookies.has(name));

  // When the Buyer App redirects here with a handshake token, existing Clerk
  // cookies for this domain conflict with the new session being established.
  // Clear them first so Clerk processes the handshake against a clean state.
  if (hasHandshake && hasExistingSession) {
    const response = NextResponse.redirect(req.url);
    for (const name of CLERK_COOKIE_NAMES) {
      response.cookies.delete(name);
    }
    return response;
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
