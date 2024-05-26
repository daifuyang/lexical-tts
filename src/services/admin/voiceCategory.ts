import { adminRequest } from "@/utils/request";

// 创建单个主播分类
export function createVoiceCategory(data: any) {
    return adminRequest.post("/api/admin/voice/category", data);
  }
  