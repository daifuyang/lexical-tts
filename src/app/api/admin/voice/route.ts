import api from "@/lib/response";
import _ from "lodash";
import prisma from "@/lib/prisma";

async function create(request: Request) {
  const json = await request.json();
  const { name, shortName, locale, gender, source, style } = json;

  if(!_.trim(name)) {
    return api.error("主播名称不能为空！")
  } else if(!_.trim(shortName)) {
    return api.error("主播标识不能为空！")
  }

  try {
    
  } catch (error) {
    
  }
  const res = await prisma.ttsVoice.create({
      data: {
        name,
        shortName,
        gender,
        locale,
        voiceType: "",
      }
  })

  if(!res) {
    return api.error("新增失败！");
  }

  return api.success("新增成功！", res);
}

module.exports = {
  POST: create
};
