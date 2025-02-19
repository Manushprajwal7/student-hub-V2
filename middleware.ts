import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/resources/new",
  "/issues/new",
  "/events/new",
  "/announcements/new",
  "/jobs/new",
  "/study-groups/new",
  "/scholarships/new",
  "/profile",
  "/settings",
];

const publicRoutes = ["/login", "/signup", "/auth/callback"];

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    const pathname = req.nextUrl.pathname;

    // Refresh session if exists
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Check if the current path is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Check if the current path is public
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Handle protected routes
    if (isProtectedRoute) {
      if (!session) {
        // Redirect to login if there's no session
        const redirectUrl = new URL("/login", req.url);
        redirectUrl.searchParams.set("redirectedFrom", pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Verify token expiration
      const tokenExpiration = session.expires_at;
      const now = Math.floor(Date.now() / 1000);

      if (tokenExpiration && tokenExpiration < now) {
        // Token is expired, try to refresh
        const {
          data: { session: newSession },
          error: refreshError,
        } = await supabase.auth.refreshSession();

        if (refreshError || !newSession) {
          // If refresh fails, redirect to login
          const redirectUrl = new URL("/login", req.url);
          redirectUrl.searchParams.set("redirectedFrom", pathname);
          redirectUrl.searchParams.set("sessionExpired", "true");
          return NextResponse.redirect(redirectUrl);
        }
      }
    }

    // Handle public routes for authenticated users
    if (isPublicRoute && session) {
      const redirectedFrom = req.nextUrl.searchParams.get("redirectedFrom");
      const redirectUrl = new URL(redirectedFrom || "/", req.url);
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  } catch (error) {
    console.error("Middleware error:", error);
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
    redirectUrl.searchParams.set("error", "middleware_error");
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
