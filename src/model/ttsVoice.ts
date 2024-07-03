import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// 获取总数
export async function getVoiceTotal(tx = prisma) {
  return await tx.ttsVoice.count();
}

// 获取列表
export async function getVoiceLst(
  current: number,
  pageSize: number,
  where: Prisma.ttsVoiceWhereInput,
  orderBy?: Prisma.ttsVoiceOrderByWithRelationInput | Prisma.ttsVoiceOrderByWithRelationInput[],
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
