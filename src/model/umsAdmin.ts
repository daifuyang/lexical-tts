import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// 获取管理员
export async function getUmsAdmin({ where = {} }: { where: Prisma.umsAdminWhereInput }) {
  const user = await prisma.umsAdmin.findFirst({
    where
  });
  return user;
}
