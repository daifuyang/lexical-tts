import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { Prisma, TtsWork } from "@prisma/client";
import { getVoiceById, getVoiceByShortName } from "./ttsVoice";
import { now } from "@/lib/date";

const workIdKey = `tts:work:id:`;

// 获取总数
export async function getWorkTotal(where: Prisma.TtsWorkWhereInput, tx = prisma) {
  return await tx.ttsWork.count({
    where
  });
}

// 获取作品列表
export async function getWorkList(
  current: number,
  pageSize: number,
  where: Prisma.TtsWorkWhereInput,
  orderBy?: Prisma.TtsWorkOrderByWithRelationInput | Prisma.TtsWorkOrderByWithRelationInput[],
  tx = prisma
) {
  let works = [];
  if (pageSize === 0) {
    works = await tx.ttsWork.findMany({
      where,
      orderBy
    });
  } else {
    works = await tx.ttsWork.findMany({
      skip: (current - 1) * pageSize,
      take: pageSize,
      where,
      orderBy
    });
  }

  const newWorks = []
  for (const work of works) {
    const voice = await getVoiceByShortName(work.voiceName);
    newWorks.push({
      id: work.id,
      title: work.title,
      voiceName: voice?.name,
      duration: work.duration,
      status: work.status,
      audioUrl: `https://cdn.vlog-v.com${work.audioUrl}`,
      createdAt: work.createdAt,
    })
  }

  return newWorks;
}

// 根据id获取作品集
export async function getTtsWorkById(id: number, tx = prisma) {
  const key = `${workIdKey}${id}`;
  const cache = await redis.get(key);
  let work: TtsWork | null = null;
  if (cache) {
    work = JSON.parse(cache);
  } else {
    work = await tx.ttsWork.findUnique({
      where: {
        id
      }
    });
    if (work) {
      redis.set(key, JSON.stringify(work));
    }
  }
  return work;
}

// 新增作品
export async function createTtsWork(data: Prisma.TtsWorkCreateInput, tx = prisma) {
  return await tx.ttsWork.create({ data });
}

// 更新作品
export async function updateTtsWork(id: number, data: Prisma.TtsWorkUpdateInput, tx = prisma) {
  const work = await tx.ttsWork.update({
    where: {
      id
    },
    data
  });
  const key = `${workIdKey}${id}`;
  redis.del(key);
  return work;
}

// 根据条件查询作品
export async function getTtsWorkFirst(where: Prisma.TtsWorkWhereInput) {
  const sample = await prisma.ttsWork.findFirst({
    where
  });
  return sample;
}

// 删除作品
export async function deleteTtsWork(id: number, tx = prisma) {
  const work = await tx.ttsWork.update({
    where: {
      id
    },
    data: {
      deletedAt: now()
    }
  });
  const key = `${workIdKey}${id}`;
  redis.del(key);
  return work;
}
