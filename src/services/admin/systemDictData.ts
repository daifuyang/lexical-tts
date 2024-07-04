import { adminRequest } from "@/utils/request";

// 获取系统字典数据列表
export async function getSystemDictDataList(params: any) {
    return adminRequest.get("/api/admin/system/dict/data", { params });
}

// 添加系统字典数据
export async function addSystemDictData(data: any) {
    return adminRequest.post("/api/admin/system/dict/data", data);   
}

// 获取系统字典数据详情
export async function getSystemDictDataDetail(id: number) {
    return adminRequest.get(`/api/admin/system/dict/data/${id}`);
}

// 修改系统字典数据
export async function updateSystemDictData(id:number, data: any) {
    return adminRequest.put(`/api/admin/system/dict/data/${id}`, data);
}

// 删除系统字典数据
export async function deleteSystemDictData(id: number) {
    return adminRequest.delete(`/api/admin/system/dict/data/${id}`)
}