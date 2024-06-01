import { NextRequest } from "next/server";
import api from "@/lib/response";
import prisma from "@/lib/prisma";
import { getCategories } from "@/model/ttsVoiceCategory";

// 获取列表
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const cagetories = await getCategories(current, pageSize);
  return api.success("获取成功！", cagetories);
}

// 新增一条
export async function POST(request: NextRequest) {
  const json = await request.json();

  let status = 1;
  if (json.status) {
    status = Number(json.status);
  }

  const voiceCategory = await prisma.ttsVoiceCategory.create({
    data: {
      name: json.name,
      desc: json.desc,
      status
    }
  });

  return api.success("新增成功", voiceCategory);
}
