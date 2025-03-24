import prisma from "@/lib/prisma";
import { Pagination } from "@/lib/response";
import { Prisma, ttsVoiceCategory } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";

// 获取列表
export const getCategories = async (
  current: number = 1,
  pageSize: number = 0,
  where: Prisma.ttsVoiceCategoryWhereInput = {},
  tx = prisma
) => {
  const args: {
    where: any;
    skip?: number;
    take?: number;
  } = {
    where
  };

  if (pageSize > 0) {
    const skip = (current - 1) * pageSize;
    args.skip = skip;
    args.take = pageSize;
  }

  const categories = await tx.ttsVoiceCategory.findMany(args);
  let result: ttsVoiceCategory[] | Pagination<ttsVoiceCategory> = categories;
  if (pageSize > 0) {
    const total = await tx.ttsVoiceCategory.count({ where });
    result = {
      total,
      data: categories,
      current,
      pageSize
    };
  }
  return result;
};

// 更新分类
export async function updateCategory(id: number, data: Prisma.ttsVoiceCategoryUpdateInput, tx: PrismaClient = prisma) {
  return tx.ttsVoiceCategory.update({
    where: { id },
    data
  });
}
