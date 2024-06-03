import api from "@/lib/response";
import _ from "lodash";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getVoiceLst, getVoiceTotal } from "@/model/ttsVoice";

export async function GET(request: NextRequest) {
  // 查询条件
  const { searchParams } = request.nextUrl;

  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const where: any = {};

  // 主播名称
  const name = searchParams.get("name") || '';
  if(_.trim(name)) {
    where["name"] = { contains: name };
  }

  // 主播标识
  const shortName = searchParams.get("shortName") || '';
  if(_.trim(shortName)) {
    where["shortName"] = { contains: shortName };
  }

  // 状态
  const status = searchParams.get("status") || '';
  if(_.trim(status)) {
    where["status"] = parseInt(status);
  }

  const total = await getVoiceTotal()

  const res = await getVoiceLst(current, pageSize, where);

  return api.success("获取成功！", {
    total,
    data: res,
    current,
    pageSize
  });
}

export async function POST(request: Request) {
  const json = await request.json();
  const { name, shortName, locale, gender, source, style } = json;

  if (!_.trim(name)) {
    return api.error("主播名称不能为空！");
  } else if (!_.trim(shortName)) {
    return api.error("主播标识不能为空！");
  } else if (!_.trim(locale)) {
    return api.error("语言环境不能为空！");
  }

  const res = await prisma.ttsVoice.create({
    data: {
      name,
      shortName,
      gender,
      locale,
      voiceType: ""
    }
  });

  if (!res) {
    return api.error("新增失败！");
  }

  return api.success("新增成功！", res);
}
