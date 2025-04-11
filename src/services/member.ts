import request from "@/lib/request";

export function getCurrentMember() {
  return request.get("/api/member/current");
}

export interface SubscribeRequest {
  planId: string;
  paymentMethod: 'wechat' | 'alipay';
  forceRefresh?: boolean; // 强制刷新参数，不使用缓存订单
  planType?: string; // 套餐类型(MEMBERSHIP/TOPUP)
}

export interface SubscribeResponse {
  qrCodeUrl: string;
  orderId: string;
  expiresAt: string;
}

export function subscribe(data: SubscribeRequest): Promise<SubscribeResponse> {
  return request.post("/api/member/subscribe", data);
}

export function checkSubscribeStatus(orderId: string) {
  return request.get(`/api/member/subscribe/${orderId}`);
}
