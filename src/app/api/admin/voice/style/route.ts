import { getVoiceStyleList } from "@/model/ttsVoiceStyle";
import api from "@/lib/response";

export async function GET(request: Request) {
  const data = await getVoiceStyleList()
  return api.success("获取成功！", data);
}
