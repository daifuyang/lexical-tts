import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// 新增作品
export async function createTtsWork(data: Prisma.TtsWorkCreateInput,tx = prisma) {
    return await tx.ttsWork.create({ data });
}