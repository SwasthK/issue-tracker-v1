import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const publicAuthPages = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
])
const signedInRedirectPages = new Set(["/login", "/register"])

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const { pathname } = request.nextUrl

  if (!sessionCookie && !publicAuthPages.has(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (sessionCookie && signedInRedirectPages.has(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/issues/:path*",
    "/members/:path*",
    "/onboarding",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
}
