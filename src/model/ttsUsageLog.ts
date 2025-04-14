import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { Prisma, TtsUsageLog } from "@prisma/client";

const usageLogIdKey = `tts:usageLog:id:`;

// 获取日志总数
export async function getUsageLogTotal(where: Prisma.TtsUsageLogWhereInput, tx = prisma) {
  return await tx.ttsUsageLog.count({
    where
  });
}

// 获取日志列表
export async function getUsageLogList(
  current: number,
  pageSize: number,
  where: Prisma.TtsUsageLogWhereInput,
  orderBy?:
    | Prisma.TtsUsageLogOrderByWithRelationInput
    | Prisma.TtsUsageLogOrderByWithRelationInput[],
  tx = prisma
) {
  if (pageSize === 0) {
    return await tx.ttsUsageLog.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            userId: true,
            nickname: true
          }
        },
        work: {
          select: {
            id: true,
            title: true
          }
        },
        sample: {
          select: {
            id: true,
            voiceName: true
          }
        }
      }
    });
  }
  return await tx.ttsUsageLog.findMany({
    skip: (current - 1) * pageSize,
    take: pageSize,
    where,
    orderBy,
    include: {
      user: {
        select: {
          userId: true,
          nickname: true
        }
      },
      work: {
        select: {
          id: true,
          title: true
        }
      },
      sample: {
        select: {
          id: true,
          voiceName: true
        }
      }
    }
  });
}

// 根据ID获取日志
export async function getUsageLogById(id: string, tx = prisma) {
  const key = `${usageLogIdKey}${id}`;
  const cache = await redis.get(key);
  let log: TtsUsageLog | null = null;
  if (cache) {
    log = JSON.parse(cache);
  } else {
    log = await tx.ttsUsageLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            userId: true,
            nickname: true
          }
        },
        work: {
          select: {
            id: true,
            title: true
          }
        },
        sample: {
          select: {
            id: true,
            voiceName: true
          }
        }
      }
    });
    if (log) {
      redis.set(key, JSON.stringify(log));
    }
  }
  return log;
}

// 创建日志
export async function createUsageLog(data: Prisma.TtsUsageLogCreateInput, tx = prisma) {
  return await tx.ttsUsageLog.create({ data });
}

// 更新日志
export async function updateUsageLog(id: string, data: Prisma.TtsUsageLogUpdateInput, tx = prisma) {
  const log = await tx.ttsUsageLog.update({
    where: { id },
    data
  });
  const key = `${usageLogIdKey}${id}`;
  redis.del(key);
  return log;
}

// 根据条件查询日志
export async function getUsageLogFirst(where: Prisma.TtsUsageLogWhereInput, tx = prisma) {
  return await tx.ttsUsageLog.findFirst({
    where,
    include: {
      user: {
        select: {
          userId: true,
          nickname: true
        }
      },
      work: {
        select: {
          id: true,
          title: true
        }
      },
      sample: {
        select: {
          id: true,
          voiceName: true
        }
      }
    }
  });
}

// 删除日志
export async function deleteUsageLog(id: string, tx = prisma) {
  const log = await tx.ttsUsageLog.delete({
    where: { id }
  });
  const key = `${usageLogIdKey}${id}`;
  redis.del(key);
  return log;
}
