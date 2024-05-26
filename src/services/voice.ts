import { memberRequest } from "@/utils/request";

export function voiceStyleList() {
  return memberRequest.get("/api/voice/style");
}

// 获取主播分类列表
export function voiceCategoryList(params: any) {
  return memberRequest.get("/api/admin/voice/category", { params });
}