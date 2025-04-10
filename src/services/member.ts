import request from "@/lib/request";

export function getCurrentMember() {
  return request.get("/api/member/current");
}

export function getMemberByAuthorization(Authorization: string) {
  return request.get("/api/member/current", {
    headers: {
      Authorization,
    },
  });
}

export function login(data: any) {
    return request.post("/api/member/login", data);
}

export interface SubscribeRequest {
  planId: string;
  paymentMethod: 'wechat' | 'alipay';
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
