import { formatFields } from "@/lib/date";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// 获取字典数据总数
export async function getSystemDictDataCount(type: string, tx = prisma) {
  const count = await tx.sysDictData.count({
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
  where: Prisma.SysDictDataWhereInput;
  orderBy?:
    | Prisma.SysDictDataOrderByWithRelationInput
    | Prisma.SysDictDataOrderByWithRelationInput[]
    | undefined;
}, tx = prisma) {
  const systemDict = await tx.sysDictData.findMany({
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
  data: Prisma.XOR<Prisma.SysDictDataCreateInput, Prisma.SysDictDataUncheckedCreateInput>;
}, tx = prisma) {
  const systemDict = await tx.sysDictData.create({
    data
  });
  return systemDict;
}

// 根据字典数据id获取数据
export async function getSystemDictDataById(id: number, tx = prisma) {
  const systemDict = await tx.sysDictData.findUnique({
    where: {
      id
    }
  });
  return systemDict;
}

// 更新系统字典数据
export async function updateSystemDictData(
  id: number,
  data:  Prisma.XOR<Prisma.SysDictDataUpdateInput, Prisma.SysDictDataUncheckedUpdateInput>,
  tx = prisma
) {
  const systemDict = await tx.sysDictData.update({
    where: {
      id
    },
    data
  });
  return systemDict;
}

// 根据字典数据id删除删除
export async function deleteSystemDictDataById(id: number, tx = prisma) {
  const systemDict = await tx.sysDictData.delete({
    where: {
      id
    }
  });
  return systemDict;
}
