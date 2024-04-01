import { memberRequest } from "@/utils/request";

export function voiceStyleList() {
  return memberRequest.get("/api/voice/style");
}

// 获取主笔列表
export function voiceList(params: any) {
 return memberRequest.get("/api/admin/voice", { params });
}

// 创建单个主播
export function createVoice(data: any) {
  return memberRequest.post("/api/admin/voice", data);
}
