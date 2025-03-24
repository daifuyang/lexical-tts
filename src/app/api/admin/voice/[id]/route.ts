import _ from "lodash";
import api from "@/lib/response";
import prisma from "@/lib/prisma";
import { getVoiceById } from "@/model/ttsVoice";
import { getVocieStylesByVoiceId } from "@/model/ttsVoiceStyleRelation";

// 根据id获取主播详情
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

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const json = await request.json();
  const { name, shortName, locale, gender, source, style } = json;

  if (!_.trim(name)) {
    return api.error("主播名称不能为空！");
  } else if (!_.trim(shortName)) {
    return api.error("主播标识不能为空！");
  }

  const voice = await prisma.ttsVoice.update({
    where: {
      id: Number(id)
    },
    data: {
      name,
      shortName,
      gender,
      locale,
      voiceType: ""
    }
  });

  return api.success("更新成功！", voice);
}
