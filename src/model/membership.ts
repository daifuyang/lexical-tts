import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { Prisma, Membership } from "@prisma/client";

const membershipIdKey = `membership:memberId:`;

// 获取会员总数
export async function getMembershipTotal(where: Prisma.MembershipWhereInput, tx = prisma) {
  return await tx.membership.count({
    where
  });
}

// 获取会员列表
export async function getMembershipList(
  current: number,
  pageSize: number,
  where: Prisma.MembershipWhereInput,
  orderBy?: Prisma.MembershipOrderByWithRelationInput | Prisma.MembershipOrderByWithRelationInput[],
  tx = prisma
) {
  if (pageSize === 0) {
    return await tx.membership.findMany({
      where,
      orderBy
    });
  }
  return await tx.membership.findMany({
    skip: (current - 1) * pageSize,
    take: pageSize,
    where,
    orderBy
  });
}

// 根据id获取会员
export async function getMembershipById(memberId: string, tx = prisma) {
  const key = `${membershipIdKey}${memberId}`;
  const cache = await redis.get(key);
  let membership: Membership | null = null;
  if (cache) {
    membership = JSON.parse(cache);
  } else {
    membership = await tx.membership.findUnique({
      where: {
        memberId
      }
    });
    if (membership) {
      redis.set(key, JSON.stringify(membership));
    }
  }
  return membership;
}

// 新增会员
export async function createMembership(data: Prisma.MembershipCreateInput, tx = prisma) {
  return await tx.membership.create({ data });
}

// 更新会员
export async function updateMembership(memberId: string, data: Prisma.MembershipUpdateInput, tx = prisma) {
  const membership = await tx.membership.update({
    where: {
      memberId
    },
    data
  });
  const key = `${membershipIdKey}${memberId}`;
  redis.del(key);
  return membership;
}

// 根据条件查询会员
export async function getMembershipFirst(where: Prisma.MembershipWhereInput) {
  return await prisma.membership.findFirst({
    where
  });
}

// 删除会员
export async function deleteMembership(memberId: string, tx = prisma) {
  const membership = await tx.membership.delete({
    where: {
      memberId
    }
  });
  const key = `${membershipIdKey}${memberId}`;
  redis.del(key);
  return membership;
}
