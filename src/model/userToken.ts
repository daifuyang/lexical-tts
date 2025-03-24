import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const createUserToken = (data: Prisma.sysUserTokenCreateInput, tx = prisma) => {
  return tx.sysUserToken.create({
    data
  });
};
