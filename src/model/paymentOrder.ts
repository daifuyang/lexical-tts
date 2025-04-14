import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { Prisma, PaymentOrder } from "@prisma/client";

const paymentOrderIdKey = `payment:order:id:`;

// Create payment order
export async function createPaymentOrder(
  data: Prisma.PaymentOrderCreateInput,
  tx = prisma
) {
  const order = await tx.paymentOrder.create({ data });
  return order;
}

// Get payment order by ID
export async function getPaymentOrderById(id: string, tx = prisma) {
  const key = `${paymentOrderIdKey}${id}`;
  const cache = await redis.get(key);
  let order: PaymentOrder | null = null;
  if (cache) {
    order = JSON.parse(cache);
  } else {
    order = await tx.paymentOrder.findUnique({
      where: { id }
    });
    if (order) {
      redis.set(key, JSON.stringify(order));
    }
  }
  return order;
}

// Update payment order
export async function updatePaymentOrder(
  id: string, 
  data: Prisma.PaymentOrderUpdateInput,
  tx = prisma
) {
  const order = await tx.paymentOrder.update({
    where: { id },
    data
  });
  const key = `${paymentOrderIdKey}${id}`;
  redis.del(key);
  return order;
}

// Find first pending order
export async function findPendingOrder(
  where: Prisma.PaymentOrderWhereInput,
  tx = prisma
) {
  return await tx.paymentOrder.findFirst({
    where,
    orderBy: { createdAt: "desc" }
  });
}
