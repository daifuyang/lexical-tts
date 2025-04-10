import request from "@/lib/request"

interface WorkListResponse {
  code: number;
  msg: string;
  data: {
    data: Array<{
      id: number;
      title: string;
      voiceName: string;
      audioUrl: string;
      duration: number;
      status: number;
      createdAt: number;
      version: number;
    }>;
  };
  total: number;
}

// 获取作品列表
export function getWorkList(
  current: number = 1, 
  pageSize: number = 10, 
  params: { status?: number } = {}
): Promise<WorkListResponse> {
  return request.get("/api/member/work", { 
    params: {
      current,
      pageSize,
      ...params
    }
  });
}

// 新建作品
export function addWork(data: any) {
  return request.post("/api/member/work", data);
}

// 更新作品
export function updateWork(id:number,data: any) {
  return request.post(`/api/member/work/${id}`, data);
}

// 获取作品
export function getWorkDetail(id: number) { 
    return request.get(`/api/member/work/${id}`); 
}

// 删除作品
export function deleteWork(id: number) {
  return request.delete(`/api/member/work/${id}`);
}
