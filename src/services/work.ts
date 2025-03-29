import { memberRequest } from "@/utils/request";

// 获取作品列表
export function getWorkList(params: any = {}) {
  return memberRequest.get("/api/member/work", { params });
}

// 新建作品
export function addWork(data: any) {
  return memberRequest.post("/api/member/work", data);
}

// 更新作品
export function updateWork(id:number,data: any) {
  return memberRequest.post(`/api/member/work/${id}`, data);
}

// 获取作品
export function getWorkDetail(id: number) { 
    return memberRequest.get(`/api/member/work/${id}`); 
}

// 删除作品
export function deleteWork(id: number) {
  return memberRequest.delete(`/api/member/work/${id}`);
}