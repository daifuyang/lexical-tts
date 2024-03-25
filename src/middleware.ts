import api from "@/lib/rest";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    const { origin } = request.nextUrl;
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader && authHeader.split(" ")[1];
    const headers: any = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    };
    const res = await fetch(`${origin}/api/currentUser`, { headers });
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      return api.error("Failed to fetch data");
    }
    const user = await res.json();
    if (user.code !== 1) {
      return api.error(user.msg, user.data);
    }
    response.cookies.set("user", JSON.stringify(user.data));
  }

  return response;
}
