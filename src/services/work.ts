import request from "@/lib/request";

export function createWork(data: any) {
  return request.post("/api/member/work", data);
}

export function updateWork(id: string, data: any) {
  return request.put(`/api/member/work/${id}`, data);
}

export function deleteWork(id: string) {
  return request.delete(`/api/member/work/${id}`);
}

export function getWorkList(params: any) {
  return request.get("/api/member/work", { params });
}

export function getWorkDetail(id: string) {
  return request.get(`/api/member/work/${id}`);
}

export function getWorkCount() {
  return request.get("/api/member/work/count");
}
