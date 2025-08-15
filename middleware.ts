import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if user has access to the requested route
    if (
      path.startsWith("/dashboard") ||
      path.startsWith("/students") ||
      path.startsWith("/lessons") ||
      path.startsWith("/settings") ||
      path.startsWith("/newsletters")
    ) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    if (
      path.startsWith("/instructor") &&
      !path.startsWith("/instructor/login")
    ) {
      if (token?.role !== "INSTRUCTOR") {
        return NextResponse.redirect(new URL("/instructor/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (
          req.nextUrl.pathname === "/" ||
          req.nextUrl.pathname === "/portal" ||
          req.nextUrl.pathname === "/login" ||
          req.nextUrl.pathname === "/instructor/login"
        ) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/students/:path*",
    "/lessons/:path*",
    "/settings/:path*",
    "/newsletters/:path*",
    "/instructor/:path*",
  ],
};
