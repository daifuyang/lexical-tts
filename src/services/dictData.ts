import { memberRequest } from "@/utils/request";

// 根据类型获取字典数据
export async function getDictData(type: string) {
    return await memberRequest(`/api/dict/data/${type}`);
}