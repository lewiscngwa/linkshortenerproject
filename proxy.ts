import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Redirect signed-in users away from `/` to `/dashboard`
  if (isPublicRoute(req) && pathname === "/" && userId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect dashboard path: forward unauthenticated users to `/` and flag modal
  if (isProtectedRoute(req) && !userId) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("clerk_modal", "sign-in");
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
