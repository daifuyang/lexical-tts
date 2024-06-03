import { updateCategory } from "@/model/ttsVoiceCategory";
import { NextRequest } from "next/server";
import api from "@/lib/response";

// 更新一条
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const json = await request.json();
  let status = 1;
  if (json.status) {
    status = Number(json.status);
  }
  const category = await updateCategory(json.id, {
    name: json.name,
    desc: json.desc,
    status
  });

  return api.success("更新成功", category);
}
