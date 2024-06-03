import { memberRequest } from "@/utils/request";

export function voiceList(params: any = {}) {
  return memberRequest.get("/api/voice", { params });
}

export function voiceStyleList() {
  return memberRequest.get("/api/voice/style");
}

// 获取主播分类列表
export function voiceCategoryList(params: any = {}) {
  return memberRequest.get("/api/voice/category", { params });
}