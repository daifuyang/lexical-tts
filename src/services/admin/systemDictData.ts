import request from "@/lib/request";

// 获取系统字典数据列表
export async function getSystemDictDataList(params: any) {
    return request.get("/api/admin/system/dict/data", { params });
}

// 添加系统字典数据
export async function addSystemDictData(data: any) {
    return request.post("/api/admin/system/dict/data", data);   
}

// 获取系统字典数据详情
export async function getSystemDictDataDetail(id: number) {
    return request.get(`/api/admin/system/dict/data/${id}`);
}

// 修改系统字典数据
export async function updateSystemDictData(id:number, data: any) {
    return request.put(`/api/admin/system/dict/data/${id}`, data);
}

// 删除系统字典数据
export async function deleteSystemDictData(id: number) {
    return request.delete(`/api/admin/system/dict/data/${id}`)
}