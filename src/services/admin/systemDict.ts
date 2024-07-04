import { adminRequest } from "@/utils/request";

// 获取系统字典类型列表
export function getSystemDictList(params: any = {}) {
  return adminRequest.get("/api/admin/system/dict", { params });
}

// 获取系统字典类型详情
export function getSystemDictDetail(id: number) {
  return adminRequest.get(`/api/admin/system/dict/${id}`);
}

// 添加系统字典类型
export function addSystemDict(data: any = {}) {
  return adminRequest.post("/api/admin/system/dict", data);
}

// 修改系统字典类型
export function updateSystemDict(id: number, data: any = {}) {
  return adminRequest.put(`/api/admin/system/dict/${id}`, data);
}

// 删除系统字典类型
export function deleteSystemDict(id: number) {
  return adminRequest.delete(`/api/admin/system/dict/${id}`);
}