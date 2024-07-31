import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// 根据条件查询试听
export async function getSampleFirst(where: Prisma.ttsSampleWhereInput) {
  const sample = await prisma.ttsSample.findFirst({
    where
  });
  return sample;
}

// 创建试听
export async function createSample(data: Prisma.ttsSampleCreateInput, tx = prisma) {
  const sample = await tx.ttsSample.create({
    data
  });
  return sample;
}
