import {memberRequest} from "@/utils/request";

export function tts(data: { ssml: string; name?: string }) {
  return memberRequest.post("/api/tts", data);
}
