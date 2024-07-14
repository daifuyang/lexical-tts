import { memberRequest } from "@/utils/request";
// 新建作品
export function getSample(data) {
    return memberRequest.post("/api/member/sample", data);
}