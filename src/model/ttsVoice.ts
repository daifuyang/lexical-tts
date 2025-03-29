import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { Prisma } from "@prisma/client";

const voiceIdKey = `tts:voice:id:`;

// 获取总数
export async function getVoiceTotal(tx = prisma) {
  return await tx.ttsVoice.count();
}

// 获取列表
export async function getVoiceLst(
  current: number,
  pageSize: number,
  where: Prisma.TtsVoiceWhereInput,
  orderBy?: Prisma.TtsVoiceOrderByWithRelationInput | Prisma.TtsVoiceOrderByWithRelationInput[],
  tx = prisma
) {
  if (pageSize === 0) {
    return await tx.ttsVoice.findMany({
      where,
      orderBy
    });
  }

  return await tx.ttsVoice.findMany({
    skip: (current - 1) * pageSize,
    take: pageSize,
    where,
    orderBy
  });
}

// 根据id获取主播
export async function getVoiceById(id: number, tx = prisma) {
  const key = `${voiceIdKey}${id}`;
  const cache = await redis.get(key);
  let voice = null;
  if (cache) {
    voice = JSON.parse(cache);
  } else {
    voice = await tx.ttsVoice.findUnique({
      where: {
        id
      }
    });
    if (voice) {
      redis.set(key, JSON.stringify(voice));
    }
  }
  return voice;
}
