import request from "@/lib/request"

export function getDefaultVoice() {
  return request.get("/api/voice/default");
}

export function getVoiceDetail(id: string) {
  return request.get(`/api/voice/${id}`);
}

export function getVoiceList(params: any = {}) {
  return request.get("/api/voice", { params });
}

export function getVoiceStyleList() {
  return request.get("/api/voice/style");
}

// 获取主播分类列表
export function getVoiceCategoryList(params: any = {}) {
  return request.get("/api/voice/category", { params });
}