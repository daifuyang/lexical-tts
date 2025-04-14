import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUserInfo } from "./services/member";
const publicRoutes = ["/", "/login", "/signup", "/api/member/current"];
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.includes(pathname);
  const session = request.cookies.get("session")?.value;

  if (!isPublicRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const res = await getCurrentUserInfo(true, {
        Cookie: "session=" + session
      });

      if (res.code !== 1) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("session");
        return response;
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      // Clear invalid session on error
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("session");
      return response;
    }
  }
  const response = NextResponse.next();
  return response;
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!favicon.ico|_next/static|_next/image|assets|fonts|.*\\.png$).*)"]
};
