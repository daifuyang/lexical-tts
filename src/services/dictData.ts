import request from "@/lib/request";

// 根据类型获取字典数据
export async function getDictData(type: string) {
    return await request(`/api/dict/data/${type}`);
}