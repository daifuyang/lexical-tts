import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// 获取管理员的token
export async function getUmsToken({ where }: { where: Prisma.umsTokenWhereInput }) {
  const userToken = await prisma.umsToken.findFirst({
    where
  });
  return userToken
}

// 创建管理员token映射

export function createUmsToken({
  data
}: {
  data: Prisma.XOR<Prisma.umsTokenCreateInput, Prisma.umsTokenUncheckedCreateInput>;
}) {
  const umsToken = prisma.umsToken.create({
    data
  });
  return umsToken;
}
