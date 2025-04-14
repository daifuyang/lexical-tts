import { NextRequest } from "next/server";
import response from "@/lib/response";
import { getCurrentUser } from "@/lib/user";
import { PaymentType, MembershipType } from "@prisma/client";
import { wechatPay } from "@/lib/pay";
import { getPaymentPlan, membershipPlans, topUpPacks } from "@/model/paymentConfig";
import { createPaymentOrder, findPendingOrder, updatePaymentOrder } from "@/model/paymentOrder";
import { createMembership, getMembershipFirst, updateMembership } from "@/model/membership";
import { updateUser } from "@/model/user";

export async function POST(request: NextRequest) {
  const json = await request.json();
  const { planId, paymentMethod, forceRefresh } = json;

  if (!planId) {
    return response.error("会员类型不能为空！");
  }

  // Get payment type
  const paymentType = paymentMethod?.toUpperCase() as PaymentType;
  if (!paymentType) {
    return response.error("支付方式不能为空！");
  }

  // Get payment plan
  const paymentPlan = getPaymentPlan(planId);
  if (!paymentPlan) {
    return response.error("无效的套餐类型");
  }

  // Determine product type
  const isMembership = membershipPlans.some(p => p.type === planId);
  const productType = isMembership ? "MEMBERSHIP" : "TOPUP";

  if (!paymentType) {
    return response.error("支付方式不能为空！");
  }

  const user = await getCurrentUser();
  if (!user) {
    return response.error("未登录", 401);
  }

  // Get amount from payment plan
  const amount = paymentPlan.amount;
  const now = Math.floor(Date.now() / 1000);

  try {
    // Check for existing order with the same planId, unless forceRefresh is true
    let existingOrder = null;
    if (!forceRefresh) {
      existingOrder = await findPendingOrder({
        userId: user.userId,
        productType,
        productId: planId,
        status: "pending"
      });
    }

    // If order exists and has not expired, reuse it
    if (!forceRefresh && existingOrder && existingOrder.expiresAt && existingOrder.expiresAt > now) {
      // Use type assertion to access the new fields

      
      // If it's a WeChat payment, we need to ensure we have the QR code data
      if (existingOrder.paymentType === "WECHAT") {
        return response.success("使用现有订单", {
          orderId: existingOrder.id,
          amount: existingOrder.amount,
          paymentType: existingOrder.paymentType,
          planType: planId,
          paymentInfo: {
            codeUrl: existingOrder.codeUrl,
            // qrcodeCodeUrl: existingOrder.qrcodeCodeUrl,
            expiresAt: existingOrder.expiresAt
          }
        });
      }
      
      return response.success("使用现有订单", {
        orderId: existingOrder.id,
        amount: existingOrder.amount,
        paymentType: existingOrder.paymentType,
          planType: planId
      });
    }

    // Generate order number and timestamps
    const orderNo = `M${now}${Math.floor(Math.random() * 1000)}`;
    const expiresAt = now + 15 * 60;

    // Initiate WeChat Pay for native payment
    if (paymentType === "WECHAT") {
      // Get Chinese display name for the membership type
      const displayName = paymentPlan.display || 
        (isMembership ? "会员" : "补充包");
      
      const paymentOrder = {
        description: `${displayName}${isMembership ? "订阅" : "充值"}`,
        out_trade_no: orderNo,
        amount: {
          total: amount
        },
        time_expire: new Date(expiresAt * 1000).toISOString()
      };

      const paymentResult = await wechatPay.native.createOrder(paymentOrder);
      const codeUrl = paymentResult.code_url;
      
      // Generate QR code as a base64 data URL
      // const qrcodeCodeUrl = await generateQRCodeBase64(codeUrl);

      // Only create order after WeChat payment is successfully created
      // Use type assertion to include the new fields
      const orderData = {
        orderNo,
        userId: user.userId,
        amount,
        paymentType,
        productType,
        productId: planId, // Store planId in productId field
        status: "pending",
        createdAt: now,
        updatedAt: now,
        expiresAt,
        codeUrl,
        // qrcodeCodeUrl // Store the QR code image URL
      };

      const order = await createPaymentOrder(orderData);

      return response.success("订单创建成功", {
        orderId: order.id,
        amount,
        paymentType,
          planType: planId,
        paymentInfo: {
          codeUrl: codeUrl,
          // qrcodeCodeUrl: qrcodeCodeUrl,
          expiresAt
        }
      });
    }

    // For other payment methods, create order first
    const order = await createPaymentOrder({
      orderNo,
      userId: user.userId,
      amount,
      paymentType,
      productType,
      productId: planId,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      expiresAt
    });

    return response.success("订单创建成功", {
      orderId: order.id,
      amount,
      paymentType,
      planType: planId
    });
  } catch (error) {
    console.error("[MEMBERSHIP_SUBSCRIBE_ERROR]", error);
    return response.error("订单创建失败");
  }
}

// 支付回调处理
export async function PUT(request: NextRequest) {
  const json = await request.json();
  const { orderId, transactionId, paymentStatus } = json;

  if (!orderId || !transactionId || !paymentStatus) {
    return response.error("缺少必要参数");
  }

  try {
    // 更新订单状态
    const updatedOrder = await updatePaymentOrder(orderId, {
      status: paymentStatus === 'SUCCESS' ? 'completed' : 'failed',
      transactionId,
      updatedAt: Math.floor(Date.now() / 1000),
      payTime: paymentStatus === 'SUCCESS' ? Math.floor(Date.now() / 1000) : undefined
    });

    // 如果是会员套餐且支付成功，创建会员记录
    if (paymentStatus === 'SUCCESS' && updatedOrder.productType === 'MEMBERSHIP') {
      const paymentPlan = getPaymentPlan(updatedOrder.productId!);
      if (paymentPlan) {
        const now = Math.floor(Date.now() / 1000);
        const durationDays = paymentPlan.durationDays || 30;
        const endDate = now + durationDays * 24 * 60 * 60;

        await createMembership({
          user: { connect: { userId: updatedOrder.userId } },
          type: updatedOrder.productId as MembershipType,
          startDate: now,
          endDate,
          totalChars: parseInt(paymentPlan.chars.replace(/,/g, '')),
          usedChars: 0,
          orderId: updatedOrder.id,
          createdAt: now,
          updatedAt: now
        });
      }
    }

    // 如果是补充包且支付成功，增加用户字符数
    if (paymentStatus === 'SUCCESS' && updatedOrder.productType === 'TOPUP') {
      const paymentPlan = getPaymentPlan(updatedOrder.productId!);
      if (paymentPlan) {
        const chars = parseInt(paymentPlan.chars.replace(/,/g, ''));
        const now = Math.floor(Date.now() / 1000);
        
        // 查找用户现有的会员记录
        const membership = await getMembershipFirst({
          userId: updatedOrder.userId
        });

        if (membership) {
          // 更新现有会员记录的字符数
          await updateMembership(membership.memberId, {
            totalChars: { increment: chars },
            totalRemaining: { increment: chars },
            updatedAt: now
          });
        }
      }
    }

    return response.success("订单状态更新成功");
  } catch (error) {
    console.error("[PAYMENT_CALLBACK_ERROR]", error);
    return response.error("订单状态更新失败");
  }
}
