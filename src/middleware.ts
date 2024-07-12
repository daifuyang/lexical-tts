import api from "@/lib/response";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminByAuthorization } from "./services/admin";
import { getMemberByAuthorization } from "./services/member";

export async function middleware(request: NextRequest) {
  // 后台鉴权

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    const authorization = request.headers.get("Authorization");
    if (authorization) {
      const res: any = await getAdminByAuthorization(authorization);
      if (res.code === 1) {
        const user = res.data;
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-userId", user.id);
        const response = NextResponse.next({
          request: {
            headers: requestHeaders
          }
        });
        return response;
      }
    }
    return api.error("身份验证已过期", null);
  }else if (pathname.startsWith("/api/member")) {
    const authorization = request.headers.get("Authorization");
    if (authorization) {
      const res: any = await getMemberByAuthorization(authorization);
      if (res.code === 1) {
        const user = res.data;
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-userId", user.id);
        const response = NextResponse.next({
          request: {
            headers: requestHeaders
          }
        });
        return response;
      }
    }
    return api.error("身份验证已过期", null);
  }
  const response = NextResponse.next();
  return response;
}
