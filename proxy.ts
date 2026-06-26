import { clerkMiddleware } from "@clerk/nextjs/server";

<<<<<<< HEAD:middleware.ts
export default clerkMiddleware();
=======
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
>>>>>>> parent of a30971a (correcciones redireccion y boton para acceder al dashboard):proxy.ts

export const config = {
  matcher: [
    // Saltea estáticos e internos de Next
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};