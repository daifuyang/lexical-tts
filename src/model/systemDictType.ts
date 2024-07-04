import prisma from "@/lib/prisma";
import { Pagination } from "@/lib/response";
import { Prisma, PrismaClient, sysDictType } from "@prisma/client";
import { formatFields } from "@/lib/date";
import redis from "@/lib/redis";

const dictTypeIdKey = `tts:system_dict_type:id:`;

// 获取总数
export async function getSystemDictTypeCount(tx = prisma) {
  return await tx.sysDictType.count();
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

    formatFields(data, [
      { fromField: "createdAt", toField: "createTime", format: "YYYY-MM-DD HH:mm:ss" }
    ]);
  } else {
    const total = await getSystemDictTypeCount();
    const dictTypeList = await tx.sysDictType.findMany({
      skip: (current - 1) * pageSize,
      take: pageSize,
      where,
      orderBy
    });
    formatFields(dictTypeList, [
      { fromField: "createdAt", toField: "createTime", format: "YYYY-MM-DD HH:mm:ss" }
    ]);
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
export async function getSystemDictTypeById(id: number, tx = prisma) {
  const key = `${dictTypeIdKey}${id}`;
  const cache = await redis.get(key);
  let systemDict = null;
  if (cache) {
    systemDict = JSON.parse(cache);
  } else {
    systemDict = await tx.sysDictType.findUnique({
      where: {
        id
      }
    });
    if (systemDict) {
      redis.set(key, JSON.stringify(systemDict));
    }
  }
  return systemDict;
}

// 根据type获取系统自动
export async function getSystemDictTypeByType(type: string, tx = prisma) {
  const systemDict = tx.sysDictType.findUnique({
    where: {
      type
    }
  });
  return systemDict;
}

// 创建系统字典
export async function createSystemDictType(
  data: Prisma.XOR<Prisma.sysDictTypeCreateInput, Prisma.sysDictTypeUncheckedCreateInput>,
  tx = prisma
) {
  const systemDict = await tx.sysDictType.create({
    data
  });
  return systemDict;
}

// 更新修改系统字典
export async function updateSystemDictTypeById(
  id: number,
  data: Prisma.XOR<Prisma.sysDictTypeUpdateInput, Prisma.sysDictTypeUncheckedUpdateInput>,
  tx: PrismaClient = prisma
) {
  const systemDict = await tx.sysDictType.update({
    where: {
      id
    },
    data
  });

  if (!!systemDict) {
    const key = `${dictTypeIdKey}${id}`;
    redis.del(key);
  }

  return systemDict;
}

// 根据id删除系统字典
export async function deleteSystemDictTypeById(id: number, tx = prisma) {
  const systemDict = await tx.sysDictType.delete({
    where: {
      id
    }
  });
  if (systemDict.id) {
    const key = `${dictTypeIdKey}${id}`;
    redis.del(key);
  }
  return systemDict;
}
