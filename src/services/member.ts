import { memberRequest } from "@/utils/request";

export function getCurrentMember() {
  return memberRequest.get("/api/member/current");
}

export function getMemberByAuthorization(Authorization: string) {
  return memberRequest.get("/api/member/current", {
    headers: {
      Authorization,
    },
  });
}

export function login(data: any) {
    return memberRequest.post("/api/member/login", data);
}
