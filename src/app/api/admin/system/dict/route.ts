import { trim } from "lodash";
import { NextRequest } from "next/server";
import api from "@/lib/response";
import { createSystemDictType, getSystemDictTypeList } from "@/model/systemDictType";
import { now } from "@/lib/date";

// 获取字典列表
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const dictData = await getSystemDictTypeList({ current, pageSize });
  return api.success("获取成功！", dictData);
}

// 新增一条字典
export async function POST(request: NextRequest) {
  const json = await request.json();
  const { name, type, status = 1, remark } = json;
  if (!trim(name)) {
    return api.error("字典名称不能为空！");
  }

  if (!trim(type)) {
    return api.error("字典类型不能为空！");
  }

  const systemDictType = await createSystemDictType({
    data: {
      name,
      type,
      status,
      remark,
      createdAt: now(),
      createdId: 1,
      updatedAt: now()
    }
  });

  return api.success("新增成功！", systemDictType);
}
