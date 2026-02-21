import { NextRequest, NextResponse } from "next/server";


const PUBLIC_PAGES = new Set([
  "/",
  "/sign-in",
  "/sign-up",
]);

const PUBLIC_API_PREFIXES = [
  "/api/signup",
  "/api/signin",
];


function isPublicApi(pathname: string) {
  return PUBLIC_API_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
}


function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images") ||
    pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|css|js|map)$/)
  );
}

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }


  if (PUBLIC_PAGES.has(pathname)) {
    return NextResponse.next();
  }


  if (isPublicApi(pathname)) {
    return NextResponse.next();
  }


  if (req.method === "OPTIONS") {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth_token")?.value;

  if (!token) {

    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    const loginUrl = new URL("/sign-in", req.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

 
  if (pathname === "/sign-in" || pathname === "/sign-up") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
