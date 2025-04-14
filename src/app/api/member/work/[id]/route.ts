import response from "@/lib/response";
import { deleteTtsWork, getTtsWorkById } from "@/model/ttsWork";
import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/user";
import { Save } from "../save";

// 获取作品详情
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  if (!id) {
    return response.error("id不能为空");
  }

  const user = await getCurrentUser();

  const work = await getTtsWorkById(Number(id));
  if (work?.creatorId != Number(user?.userId)) {
    return response.error("非法访问！");
  }

  return response.success("获取成功！", work);
}

// 更新作品集
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  if (!id) {
    return response.error("id不能为空");
  }

  // 判定id的内容存不存在
  const work = await getTtsWorkById(Number(id));
  if (!work) {
    return response.error("作品集不存在！");
  }

  return Save(request, id);
}

// 删除单个作品集
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  if (!id) {
    return response.error("id不能为空");
  }
  const res = await deleteTtsWork(Number(id));
  return response.success("删除成功！", res);
}
