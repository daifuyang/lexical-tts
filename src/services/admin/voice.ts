import request from "@/lib/request";

// 获取主播列表
export function voiceList(params: any) {
  return request.get("/api/admin/voice", { params });
}

// 获取主播风格

export function voiceStyleList() {
  return request.get("/api/admin/voice/style");
}


// 创建单个主播
export function createVoice(data: any) {
  return request.post("/api/admin/voice", data);
}

// 更新单个主播
export function updateVoice(id: number, data: any) {
  return request.put(`/api/admin/voice/${id}`, data);
}
