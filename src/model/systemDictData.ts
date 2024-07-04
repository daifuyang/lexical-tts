import { formatFields } from "@/lib/date";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// 获取字典数据总数
export async function getSystemDictDataCount(type: string) {
  const count = await prisma.sysDictData.count({
    where: {
      type
    }
  });
  return count;
}

// 获取字典数据列表
export async function getSystemDictDataList({
  where,
  orderBy
}: {
  where: Prisma.sysDictDataWhereInput;
  orderBy?:
    | Prisma.sysDictDataOrderByWithRelationInput
    | Prisma.sysDictDataOrderByWithRelationInput[]
    | undefined;
}) {
  const systemDict = await prisma.sysDictData.findMany({
    where,
    orderBy
  });
  formatFields(systemDict, [
    { fromField: "createdAt", toField: "createTime", format: "YYYY-MM-DD HH:mm:ss" }
  ]);
  return systemDict;
}

// 创建系统字典数据
export async function createSystemDictData({
  data
}: {
  data: Prisma.XOR<Prisma.sysDictDataCreateInput, Prisma.sysDictDataUncheckedCreateInput>;
}) {
  const systemDict = await prisma.sysDictData.create({
    data
  });
  return systemDict;
}

// 根据字典数据id获取数据
export async function getSystemDictDataById(id: number) {
  const systemDict = await prisma.sysDictData.findUnique({
    where: {
      id
    }
  });
  return systemDict;
}

// 更新系统字典数据
export async function updateSystemDictData(
  id: number,
  data:  Prisma.XOR<Prisma.sysDictDataUpdateInput, Prisma.sysDictDataUncheckedUpdateInput>
) {
  const systemDict = await prisma.sysDictData.update({
    where: {
      id
    },
    data
  });
  return systemDict;
}

// 根据字典数据id删除删除
export async function deleteSystemDictDataById(id: number) {
  const systemDict = await prisma.sysDictData.delete({
    where: {
      id
    }
  });
  return systemDict;
}
