import { adminRequest } from "@/utils/request";

// 获取主播列表
export function voiceList(params: any) {
  return adminRequest.get("/api/admin/voice", { params });
}

// 获取主播风格

export function voiceStyleList() {
  return adminRequest.get("/api/admin/voice/style");
}


// 创建单个主播
export function createVoice(data: any) {
  return adminRequest.post("/api/admin/voice", data);
}

// 更新单个主播
export function updateVoice(id: number, data: any) {
  return adminRequest.put(`/api/admin/voice/${id}`, data);
}