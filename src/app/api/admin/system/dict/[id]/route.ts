import { NextRequest } from "next/server";
import api from "@/lib/response";
import { deleteSystemDictTypeById, getSystemDictTypeById, updateSystemDictTypeById } from "@/model/systemDictType";
import { getSystemDictDataCount } from "@/model/systemDictData";
import { trim } from "lodash";
import { now } from "@/lib/date";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await getSystemDictTypeById(Number(id));
  if (!data) {
    return api.error("该文章不存在或已被删除");
  }
  return api.success("获取成功！", data);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await getSystemDictTypeById(Number(id));
  if (!data) {
    return api.error("该文章不存在或已被删除");
  }
  const json = await request.json();
  const { name, type, status = 1, remark } = json;
  if (!trim(name)) {
    return api.error("字典名称不能为空！");
  }

  if (!trim(type)) {
    return api.error("字典类型不能为空！");
  }
  const res = await updateSystemDictTypeById(Number(id),{
    name,
    type,
    status,
    remark,
    updatedAt: now()
  })

  return api.success("更新成功！", res);

}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // 查询
  const dictType = await getSystemDictTypeById(Number(id));
  if (!dictType) {
    return api.error("该文章不存在或已被删除");
  }

  // 查询是否存在字数据
  const dictDataCount = await getSystemDictDataCount(dictType.type);
  if (dictDataCount > 0) {
    return api.error("该字典类型下存在数据，请先删除配置选项");
  }

  const data = await deleteSystemDictTypeById(Number(id));
  return api.success("删除成功！", data);
}
