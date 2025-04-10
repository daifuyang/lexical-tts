import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/session";

const publicRoutes = ["/", "/login", "/signup","/h5/pay"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isPublicRoute = publicRoutes.includes(pathname);
  const session = await getSession();

  if (!isPublicRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  const response = NextResponse.next();
  return response;
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!favicon.ico|_next/static|_next/image|assets|fonts|.*\\.png$).*)"]
};
