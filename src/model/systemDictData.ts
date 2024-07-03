import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// 获取字典列表
export function getSystemDictDataList({
  where,
  orderBy
}: {
  where: Prisma.sysDictDataWhereInput;
  orderBy?:
    | Prisma.sysDictDataOrderByWithRelationInput
    | Prisma.sysDictDataOrderByWithRelationInput[]
    | undefined;
}) {
  const systemDict = prisma.sysDictData.findMany({
    where,
    orderBy
  });
  return systemDict;
}

// 创建系统字典数据
export function createSystemDictData({
  data
}: {
  data: Prisma.XOR<Prisma.sysDictDataCreateInput, Prisma.sysDictDataUncheckedCreateInput>;
}) {
  const systemDict = prisma.sysDictData.create({
    data
  });
  return systemDict;
}
