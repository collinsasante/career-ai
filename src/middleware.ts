import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth/session";

const PROTECTED_PATHS = [
  "/dashboard",
  "/onboarding",
  "/careers",
  "/profile",
  "/roadmap",
  "/chat",
];

const AUTH_PATHS = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));

  const token = request.cookies.get("pathwise_session")?.value;
  const session = token ? await verifySession(token) : null;

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages (but not landing page)
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Never redirect away from landing page — logged-in users can still view it
  if (pathname === "/" && session) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
