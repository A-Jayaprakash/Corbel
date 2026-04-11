import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];
const TENANT_PATHS = ["/tenant"];
const OWNER_PATHS = ["/dashboard", "/properties"];

export function proxy(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const role = req.cookies.get("user_role")?.value;
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (token && isPublic) {
    const dest = role === "tenant" ? "/tenant" : "/dashboard";
    return NextResponse.redirect(new URL(dest, req.url));
  }
  // Tenants blocked from owner paths
  if (token && role === "tenant" && OWNER_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/tenant", req.url));
  }
  // Owners/admins blocked from tenant paths
  if (token && role !== "tenant" && TENANT_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
