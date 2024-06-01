import prisma from "@/lib/prisma";
import { Pagination } from "@/lib/response";
import { Prisma, ttsVoiceCategory } from "@prisma/client";

// 获取列表
export const getCategories = async (
  current: number = 1,
  pageSize: number = 0,
  where: Prisma.ttsVoiceCategoryWhereInput = {}
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

  const categories = await prisma.ttsVoiceCategory.findMany(args);
  let result: ttsVoiceCategory[] | Pagination<ttsVoiceCategory> = categories;
  if (pageSize > 0) {
    const total = await prisma.ttsVoiceCategory.count({ where });
    result = {
      total,
      data: categories,
      current,
      pageSize
    };
  }
  return result;
};
