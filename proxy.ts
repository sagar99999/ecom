import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Matchers
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isProtectedPageRoute = createRouteMatcher(["/orders(.*)", "/checkout(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();

    // 1. Protect orders & checkout pages – require signed‑in user
    if (isProtectedPageRoute(req) && !userId) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // 2. Admin routes – require admin role
    if (isAdminRoute(req)) {
        const { sessionClaims } = await auth();
        const role = (sessionClaims?.metadata as { role?: string })?.role;

        if (role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Allow all other routes
    return NextResponse.next();
});

export const config = {
    matcher: [
        // Match all request paths except:
        // - _next (Next.js internals)
        // - static files (images, fonts, etc.)
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)", // also match API routes
    ],
};