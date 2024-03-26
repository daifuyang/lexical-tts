import request from "@/utils/request";

export function tts(data: { ssml: string; name?: string }) {
  return request.post("/api/tts", data);
}
