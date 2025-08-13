export { default } from "next-auth/middleware";

export const config = {
  // Make landing '/', '/portal', '/login' public; protect only admin areas
  matcher: [
    "/dashboard/:path*",
    "/students/:path*",
    "/settings/:path*",
    "/newsletters/:path*",
  ],
};
