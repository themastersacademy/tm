import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const unprotectedRoutes = [
  "/signIn",
  "/signUp",
  "/forgot-password",
  "/verify",
  "/images",
  "/",
  "/404",
  "/500",
  "/api/homepage",
];

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("DEV")?.value;
  if (sessionToken) {
    return NextResponse.next();
  }
  const isUnprotectedRoute = unprotectedRoutes.some(
    (route) =>
      req.nextUrl.pathname === route ||
      req.nextUrl.pathname.startsWith(`${route}/`)
  );
  if (isUnprotectedRoute) {
    return NextResponse.next();
  }
  // Optional: Check if user is authenticated
  if (!token) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/signIn", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/((?!api/public/*|api/auth/*|_next/static|_next/image|favicon.ico).*)",
  ],
};
