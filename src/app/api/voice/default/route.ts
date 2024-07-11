import { getVoiceById } from "@/model/ttsVoice";
import { NextRequest } from "next/server";
import response from "@/lib/response";
import { getVocieStylesByVoiceId } from "@/model/ttsVoiceStyleRelation";

export async function GET(request: NextRequest) {
  const voice = await getVoiceById(1);
  if (!voice) {
    return response.error("默认主播不存在，请联系管理员");
  }

  const voiceStyle = await getVocieStylesByVoiceId(voice.id);
  voice.voiceStyle = voiceStyle;
  return response.success("获取成功！", voice);
}
