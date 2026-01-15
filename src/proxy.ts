import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authPath = ["/login", "/register"];

export default function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const accessToken = request.cookies.get("accessToken")?.value;

  const isAuthPage = authPath.includes(url.pathname);
  const isHomePage = url.pathname === "/";

  if (isHomePage && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register"],
};
