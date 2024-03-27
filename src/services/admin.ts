import { adminRequest } from "@/utils/request";

export function getCurrentAdmin() {
  return adminRequest.get("/api/admin/current");
}

export function login(data: any) {
  return adminRequest.post("/api/admin/login", data);
}
