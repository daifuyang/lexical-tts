import { trim } from "lodash";
import { NextRequest } from "next/server";
import api from "@/lib/response";
import { getSystemDictTypeByType } from "@/model/systemDictType";
import { now } from "@/lib/date";
import { createSystemDictData, getSystemDictDataList } from "@/model/systemDictData";
import { Prisma } from "@prisma/client";

// 获取字典列表
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "";
  if (!trim(type)) {
    return api.error("字典类型不能为空！");
  }

  const where: Prisma.sysDictDataWhereInput = {
    type
  };

  const label = searchParams.get("label") || "";
  if (trim(label)) {
    where.label = label;
  }
  const value = searchParams.get("value") || "";
  if (trim(value)) {
    where.value = value;
  }

  const status = searchParams.get("status") || "";
  if (trim(status)) {
    where.status = Number(status);
  }

  const list = await getSystemDictDataList({
    where
  });
  return api.success("获取成功！", list);
}

// 新增一条字典
export async function POST(request: NextRequest) {
  const json = await request.json();
  const { type, label, value, status = 1, remark } = json;

  if (!trim(type)) {
    return api.error("字典类型不能为空！");
  }

  const dictType = await getSystemDictTypeByType(type);
  if (!dictType) {
    return api.error("字典类型不存在！");
  }

  if (!trim(label)) {
    return api.error("数据标签不能为空！");
  }

  if (!trim(value)) {
    return api.error("数据键值不能为空！");
  }

  const dictData = await createSystemDictData({
    data: {
      type,
      label,
      value,
      status,
      remark,
      createdAt: now(),
      createdId: 1,
      updatedAt: now()
    }
  });

  return api.success("新增成功！", dictData);
}
