import _ from "lodash";
import api from "@/lib/response";
import { getVoiceById } from "@/model/ttsVoice";
import { getVocieStylesByVoiceId } from "@/model/ttsVoiceStyleRelation";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const voice = await getVoiceById(Number(id));
  if(!voice) {
    return api.error("主播不存在！");
  }
  const voiceStyle = await getVocieStylesByVoiceId(voice.id);
  voice.voiceStyle = voiceStyle;
  return api.success("获取成功！", voice);
}