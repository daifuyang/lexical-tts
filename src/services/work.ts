import { memberRequest } from "@/utils/request";

// 新建作品
export function addWork(data: any) {
  return memberRequest.post("/api/member/work", data);
}

// 获取作品
export function getWorkDetail(id: number) { 
    return memberRequest.get(`/api/member/work/${id}`); 
}