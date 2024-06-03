import _ from "lodash";
import api from "@/lib/response";
import prisma from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
