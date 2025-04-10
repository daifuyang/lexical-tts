import { NextRequest } from "next/server";
import response from "@/lib/response";
import { getCurrentUser } from "@/lib/user";
import { MembershipType, PaymentType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { wechatPay } from "@/lib/pay";
import QRCode from "qrcode";

// Generate QR code as base64 image
async function generateQRCodeBase64(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
    });
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  const json = await request.json();
  const { planId, paymentMethod } = json;

  if (!planId) {
    return response.error("会员类型不能为空！");
  }

  // Map Chinese plan names to enum values
  const membershipTypeMap: Record<string, MembershipType> = {
    月度会员: "MONTHLY",
    季度会员: "QUARTERLY",
    年度会员: "YEARLY"
  };

  const membershipType = membershipTypeMap[planId];
  const paymentType = paymentMethod?.toUpperCase() as PaymentType;

  if (!membershipType) {
    return response.error("会员类型不能为空！");
  }

  if (!paymentType) {
    return response.error("支付方式不能为空！");
  }

  const user = await getCurrentUser();
  if (!user) {
    return response.error("未登录", 401);
  }

  // Validate membership type
  if (!Object.values(MembershipType).includes(membershipType)) {
    return response.error("无效的会员类型");
  }

  // Validate payment type
  if (!Object.values(PaymentType).includes(paymentType)) {
    return response.error("无效的支付方式");
  }

  // Calculate price and duration
  const { amount } = calculateMembershipDetails(membershipType);
  const now = Math.floor(Date.now() / 1000);

  try {
    // Check for existing order
    const existingOrder = await prisma.paymentOrder.findFirst({
      where: {
        userId: user.userId,
        productType: "MEMBERSHIP",
        status: "pending"
      },
      orderBy: { createdAt: "desc" }
    });

    // If order exists and has not expired, reuse it
    if (existingOrder && existingOrder.expiresAt && existingOrder.expiresAt > now) {
      // Use type assertion to access the new fields

      
      // If it's a WeChat payment, we need to ensure we have the QR code data
      if (existingOrder.paymentType === "WECHAT") {
        return response.success("使用现有订单", {
          orderId: existingOrder.id,
          amount: existingOrder.amount,
          paymentType: existingOrder.paymentType,
          membershipType,
          paymentInfo: {
            codeUrl: existingOrder.codeUrl,
            qrcodeCodeUrl: existingOrder.qrcodeCodeUrl,
            expiresAt: existingOrder.expiresAt
          }
        });
      }
      
      return response.success("使用现有订单", {
        orderId: existingOrder.id,
        amount: existingOrder.amount,
        paymentType: existingOrder.paymentType,
        membershipType
      });
    }

    // Generate order number and timestamps
    const orderNo = `M${now}${Math.floor(Math.random() * 1000)}`;
    const expiresAt = now + 15 * 60;

    // Initiate WeChat Pay for native payment
    if (paymentType === "WECHAT") {
      const paymentOrder = {
        description: `${membershipType}会员订阅`,
        out_trade_no: orderNo,
        amount: {
          total: amount
        },
        time_expire: new Date(expiresAt * 1000).toISOString()
      };

      const paymentResult = await wechatPay.native.createOrder(paymentOrder);
      const codeUrl = paymentResult.code_url;
      
      // Generate QR code as a base64 data URL
      const qrcodeCodeUrl = await generateQRCodeBase64(codeUrl);

      // Only create order after WeChat payment is successfully created
      // Use type assertion to include the new fields
      const orderData = {
        orderNo,
        userId: user.userId,
        amount,
        paymentType,
        productType: "MEMBERSHIP",
        status: "pending",
        createdAt: now,
        updatedAt: now,
        expiresAt,
        codeUrl,
        qrcodeCodeUrl // Store the QR code image URL
      };

      const order = await prisma.paymentOrder.create({
        data: orderData
      });

      return response.success("订单创建成功", {
        orderId: order.id,
        amount,
        paymentType,
        membershipType,
        paymentInfo: {
          codeUrl: codeUrl,
          qrcodeCodeUrl: qrcodeCodeUrl,
          expiresAt
        }
      });
    }

    // For non-WeChat payments, create order first
    const order = await prisma.paymentOrder.create({
      data: {
        orderNo,
        userId: user.userId,
        amount,
        paymentType,
        productType: "MEMBERSHIP",
        status: "pending",
        createdAt: now,
        updatedAt: now,
        expiresAt
      }
    });

    return response.success("订单创建成功", {
      orderId: order.id,
      amount,
      paymentType,
      membershipType
    });
  } catch (error) {
    console.error("[MEMBERSHIP_SUBSCRIBE_ERROR]", error);
    return response.error("订单创建失败");
  }
}

function calculateMembershipDetails(type: MembershipType) {
  switch (type) {
    case "MONTHLY":
      return {
        amount: 1000, // ¥10 in cents
        durationDays: 30,
        chars: 50000
      };
    case "QUARTERLY":
      return {
        amount: 2700, // ¥27 in cents
        durationDays: 90,
        chars: 180000
      };
    case "YEARLY":
      return {
        amount: 9600, // ¥96 in cents
        durationDays: 365,
        chars: 800000
      };
    default:
      throw new Error("无效的会员类型");
  }
}
