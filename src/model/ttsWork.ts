import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { Prisma } from "@prisma/client";

const workIdKey = `tts:work:id:`;

// 根据id获取作品集
export async function getTtsWorkById(id: number, tx = prisma) {
    const key = `${workIdKey}${id}`;
    const cache = await redis.get(key);
    let work = null;
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
export async function createTtsWork(data: Prisma.TtsWorkCreateInput,tx = prisma) {
    return await tx.ttsWork.create({ data });
}