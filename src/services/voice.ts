import { memberRequest } from "@/utils/request";

export function getDefaultVoice() {
  return memberRequest.get("/api/voice/default");
}

export function getVoiceDetail(id: string) {
  return memberRequest.get(`/api/voice/${id}`);
}

export function getVoiceList(params: any = {}) {
  return memberRequest.get("/api/voice", { params });
}

export function getVoiceStyleList() {
  return memberRequest.get("/api/voice/style");
}

// 获取主播分类列表
export function getVoiceCategoryList(params: any = {}) {
  return memberRequest.get("/api/voice/category", { params });
}