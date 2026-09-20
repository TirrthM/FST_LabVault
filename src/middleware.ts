import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "labvault_session";
const AUTH_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "labvault-super-secure-production-auth-secret-change-in-prod"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files, Next.js internal chunks, and public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/og") ||
    pathname.startsWith("/api/webhooks") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  let userRole = "STUDENT";
  let userId = "usr_student_01";

  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, AUTH_SECRET);
      if (payload && typeof payload.role === "string") {
        userRole = payload.role;
        userId = (payload.userId as string) || userId;
      }
    } catch (e) {
      // Token invalid or expired
    }
  }

  // Pass user info downstream via headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-role", userRole);
  requestHeaders.set("x-user-id", userId);

  // Role-Based Route Protection
  // 1. Calibration Management: Restricted to TECHNICIAN, LAB_MANAGER, ADMIN
  if (pathname.startsWith("/calibration")) {
    if (userRole === "STUDENT") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.searchParams.set("error", "unauthorized_calibration_access");
      return NextResponse.redirect(url);
    }
  }

  // 2. Activity / Chain-of-Custody Audit Stream: Restricted to TECHNICIAN, LAB_MANAGER, ADMIN
  if (pathname.startsWith("/activity")) {
    if (userRole === "STUDENT") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.searchParams.set("error", "unauthorized_audit_access");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/equipment/:path*",
    "/borrow-requests/:path*",
    "/maintenance/:path*",
    "/calibration/:path*",
    "/labs/:path*",
    "/activity/:path*",
    "/settings/:path*",
    "/api/:path*",
  ],
};
