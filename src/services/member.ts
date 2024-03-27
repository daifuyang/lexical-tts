import { memberRequest } from "@/utils/request";

export function getCurrentMember() {
  return memberRequest.get("/api/member/current");
}

export function login(data: any) {
    return memberRequest.post("/api/member/login", data);
}
