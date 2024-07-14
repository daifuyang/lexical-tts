import { memberRequest } from "@/utils/request";
// 新建作品
export function addWork(data) {
    return memberRequest.post("/api/member/work", data);
}