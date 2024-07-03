import prisma from "@/lib/prisma";
import { Pagination } from "@/lib/response";
import { Prisma, PrismaClient, sysDictType } from "@prisma/client";
import { formatFields } from "@/lib/date";

// 获取总数
export async function getSystemDictTypeCount({
  where = {},
  tx = prisma
}: {
  where?: Prisma.sysDictTypeWhereInput;
  tx?: PrismaClient;
} = {}) {
  return await tx.sysDictType.count({
    where
  });
}

// 获取列表
export async function getSystemDictTypeList({
  current,
  pageSize,
  where = {},
  orderBy,
  tx = prisma
}: {
  current: number;
  pageSize: number;
  where?: Prisma.sysDictTypeWhereInput;
  orderBy?:
    | Prisma.ttsVoiceOrderByWithRelationInput
    | Prisma.ttsVoiceOrderByWithRelationInput[]
    | undefined;
  tx?: PrismaClient;
}) {
  let data: sysDictType[] | Pagination<sysDictType> | null;
  if (pageSize === 0) {
    data = await tx.sysDictType.findMany({
      where,
      orderBy
    });

    formatFields(data, [{ fromField: 'createdAt', toField: 'createTime', format: 'YYYY-MM-DD HH:mm:ss' }]);
  } else {
    const total = await getSystemDictTypeCount();
    const dictTypeList = await tx.sysDictType.findMany({
      skip: (current - 1) * pageSize,
      take: pageSize,
      where,
      orderBy
    });
    formatFields(dictTypeList, [{ fromField: 'createdAt', toField: 'createTime', format: 'YYYY-MM-DD HH:mm:ss' }]);
    data = {
      total,
      current,
      pageSize,
      data: dictTypeList
    };
  }
  return data;
}

// 根据id获取系统字典
export async function getSystemDictTypeById(id: number) {
  const systemDict = prisma.sysDictType.findUnique({
    where: {
      id
    }
  });
  return systemDict;
}

// 根据type获取系统自动
export async function getSystemDictTypeByType(type: string) {
  const systemDict = prisma.sysDictType.findUnique({
    where: {
      type
    }
  });
  return systemDict;
}

// 创建系统字典
export function createSystemDictType({
  data
}: {
  data: Prisma.XOR<Prisma.sysDictTypeCreateInput, Prisma.sysDictTypeUncheckedCreateInput>;
}) {
  const systemDict = prisma.sysDictType.create({
    data
  });
  return systemDict;
}
