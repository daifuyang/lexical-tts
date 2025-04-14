import { NextRequest } from "next/server";
import response from "@/lib/response";
import {
  getWorkList,
  getWorkTotal,
} from "@/model/ttsWork";
import { getCurrentUser } from "@/lib/user";
import { Save } from "./save";

// 货期作品列表
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const { userId } = await getCurrentUser();
  const list = await getWorkList(current, pageSize, { creatorId: Number(userId), deletedAt: null });
  if (pageSize > 0) {
    const total = await getWorkTotal({ creatorId: Number(userId), deletedAt: null });

    return response.success("获取成功！", {
      current,
      pageSize,
      total,
      data: list
    });
  }
  return response.success("获取成功！", list);
}

// 新增作品
export async function POST(request: NextRequest) {
  return Save(request);
}