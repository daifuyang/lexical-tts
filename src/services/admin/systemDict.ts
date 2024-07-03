import { adminRequest } from "@/utils/request";

// 获取系统字典类型列表
export function getSystemDictList(params: any = {}) {
  return adminRequest.get("/api/admin/system/dict", { params });
}
