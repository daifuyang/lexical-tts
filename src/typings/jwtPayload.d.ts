// 自定义JWT载荷类型
export interface SessionJWTPayload {
    userId: string;
    expiresAt: Date | string | number;
    [key: string]: any; // 允许添加其他属性
  }