import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const CLERK_COOKIE_NAMES = ["__session", "__client_uat", "__clerk_db_jwt"];

const clerk = clerkMiddleware();

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

  return clerk(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
