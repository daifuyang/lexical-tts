import { NextRequest } from "next/server";
import api from "@/lib/response";
import prisma from "@/lib/prisma";
import { getCategories, updateCategory } from "@/model/ttsVoiceCategory";

// 获取列表
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const cagetories = await getCategories(current, pageSize);
  return api.success("获取成功！", cagetories);
}
