import { now } from "@/lib/date";
import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { serializeData } from "@/lib/utils";
import { SysUser, Prisma } from "@prisma/client";

const userIdKey = "user:id:";
// 根据id获取用户
export const getUserById = async (userId: number, tx = prisma) => {
  const cache = await redis.get(`${userIdKey}${userId}`);
  let user: SysUser | null = null;
  if (cache) {
    user = JSON.parse(cache);
  }

  if (!user) {
    user = await tx.sysUser.findUnique({
      where: {
        userId,
        deletedAt: 0
      }
    });

    if (user) {
      redis.set(`${userIdKey}${{ userId }}`, serializeData(user));
    }
  }

  return user;
};

// 获取用户总数
export const getUserCount = async (where: Prisma.SysUserWhereInput = {}, tx = prisma) => {
  return await tx.sysUser.count({
    where: {
      ...where,
      deletedAt: 0
    }
  });
};

// 获取用户列表
export const getUserList = async (
  where: Prisma.SysUserWhereInput = {},
  page: number = 1,
  pageSize: number = 10,
  tx = prisma
) => {
  const args: {
    skip?: number;
    take?: number;
    where?: Prisma.SysUserWhereInput;
    orderBy?: Prisma.SysUserOrderByWithRelationInput;
  } =
    pageSize === 0
      ? {}
      : {
          skip: (page - 1) * pageSize,
          take: pageSize
        };

  args.where = {
    ...where,
    deletedAt: 0,
  };

  args.orderBy = {
    userId: "desc"
  };

  const users = await tx.sysUser.findMany(args);

  return users;
};

// 根据条件获取单个用户
export const getUser = (where: Prisma.SysUserWhereUniqueInput, tx = prisma) => {
  return tx.sysUser.findUnique({
    where
  });
};

// 创建用户
export const createUser = async (data: Prisma.SysUserCreateInput, tx = prisma) => {
  const user = await tx.sysUser.create({
    data
  });
  return user;
};

// 更新用户
export const updateUser = async (userId: number, data: Prisma.SysUserCreateInput, tx = prisma) => {
  const user = await tx.sysUser.update({
    where: {
      userId
    },
    data
  });
  if (user) {
    redis.del(`${userIdKey}:${userId}`);
  }
  return user;
};

// 删除用户
export const deleteUser = async (userId: number, tx = prisma) => {
  const user = await tx.sysUser.update({
    where: {
      userId
    },
    data: {
      deletedAt: now()
    }
  });
  if (user) {
    redis.del(`${userIdKey}:${userId}`);
  }
  return user;
};
