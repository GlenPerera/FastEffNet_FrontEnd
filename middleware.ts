import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define which routes require authentication
const isPublicRoute = createRouteMatcher(["/", "/login(.*)"]);

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(
  async (auth, req) => {
    const { userId, sessionClaims } = await auth();

    // 1. Not signed in → redirect to sign-in for protected routes
    if (!userId && !isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (userId) {
      // Read role from Clerk publicMetadata
      // Set this in Clerk Dashboard → Users → [user] → Metadata → Public
      // { "role": "clinical_engineer" }  OR  { "role": "trainee_clinician" }
      const role = (sessionClaims?.metadata as { role?: string })?.role;

      // 2. Clinical Engineer trying to access /dashboard → redirect to /admin
      if (isDashboardRoute(req) && role === "clinical_engineer") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }

      // 3. Trainee Clinician trying to access /admin → redirect to /dashboard
      if (isAdminRoute(req) && role !== "clinical_engineer") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // 4. All good — continue
    return NextResponse.next();
  },
  { signInUrl: "/login" },
);

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
