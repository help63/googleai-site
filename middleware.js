import { NextResponse } from "next/server";

export function middleware(req) {

  const session = req.cookies.get("admin_session");

  if (
    req.nextUrl.pathname.startsWith("/admin/news") &&
    !session
  ) {
    return NextResponse.redirect(
      new URL("/admin/login", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/news/:path*"
  ]
};
