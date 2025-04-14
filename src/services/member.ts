import request from "@/lib/request";
import type { Response } from "@/lib/request";
import { RawAxiosRequestHeaders } from "axios";

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

export function subscribe(data: SubscribeRequest): Promise<Response<SubscribeResponse>> {
  return request.post("/api/member/subscribe", data);
}

export function checkSubscribeStatus(orderId: string): Promise<Response<any>> {
  return request.get(`/api/member/subscribe/${orderId}`);
}

export interface UsageStats {
  totalUsed: number;
  remaining: number;
  totalChars: number;
  usedChars: number;
}

/**
 * 获取用户使用统计信息
 * @param workId 可选的作品ID，指定时获取该作品的用量统计
 * @returns Promise<UsageStats> 包含使用统计信息
 * 
 * 返回值结构:
 * {
 *   totalUsed: number;  // 已用字符数
 *   remaining: number;  // 剩余字符数
 * }
 */
export function getUsageStats(workId?: number): Promise<Response<UsageStats>> {
  const params = workId ? { workId } : {};
  return request.get("/api/member/usage", { params });
}

export interface CurrentUserInfo {
  userType: string;
  nickname: string;
  avatar: string;
  createdAt: string;
  membership?: {
    type: string;
    status: 'ACTIVE' | 'EXPIRED';
    expiresAt: string;
    totalChars: number;
    usedChars: number;
  };
}

/**
 * 获取当前用户信息
 * @param simple 是否只获取基本信息 (不包含会员信息)
 * @returns Promise<CurrentUserInfo> 包含用户信息
 */
export function getCurrentUserInfo(simple = false, headers: RawAxiosRequestHeaders = {}): Promise<Response<CurrentUserInfo>> {
  const params = simple ? { simple: 'true' } : {};
  return request.get("/api/member/current", { params, headers });
}
