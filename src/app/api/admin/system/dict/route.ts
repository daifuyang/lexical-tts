import { trim } from "lodash";
import { NextRequest } from "next/server";
import api from "@/lib/response";
import { createSystemDictType, getSystemDictTypeList } from "@/model/systemDictType";
import { now } from "@/lib/date";
import { Prisma } from "@prisma/client";

// 获取字典列表
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const where: Prisma.sysDictTypeWhereInput = {};

  const name = searchParams.get("name") || "";
  if (trim(name)) {
    where.name = { contains: name };
  }

  const type = searchParams.get("type") || "";
  if (trim(type)) {
    where.type = { contains: type };
  }

  const status = searchParams.get("status") || "";
  if (trim(status)) {
    where.status = parseInt(status);
  }

  const createdStartAt = searchParams.get("createdStartAt") || "";
  const createdEndAt = searchParams.get("createdEndAt") || "";
  if (trim(createdStartAt) && trim(createdEndAt)) {
    where.createdAt = { gte: Number(createdStartAt), lte: Number(createdEndAt) };
  }

  const dictData = await getSystemDictTypeList({ current, pageSize, where });
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
    name,
    type,
    status,
    remark,
    createdAt: now(),
    createdId: 1,
    updatedAt: now()
  });

  return api.success("新增成功！", systemDictType);
}
