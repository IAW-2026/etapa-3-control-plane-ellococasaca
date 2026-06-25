import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rutas protegidas: todo lo que sea una "sección" del panel
const isProtectedRoute = createRouteMatcher([
  "/",
  "/shipping(.*)",
  "/buyer(.*)",
  "/seller(.*)",
  "/payments(.*)",
  "/feedback(.*)",
  "/usuarios(.*)",
  "/configuracion(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Saltea estáticos e internos de Next
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};