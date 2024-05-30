import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/campaign(.*)",
  "/join-campaign(.*)",
  "/whitelist(.*)",
  "/buy(.*)",
  "/swap(.*)",
  "/tokens(.*)",
  "/widgets(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api)(.*)"],
};
