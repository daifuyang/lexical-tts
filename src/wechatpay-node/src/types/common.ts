import { JsapiRequest, JsapiResponse } from "./jsapi";

export interface QueryOrderRequest {
  transaction_id: string;
  mchid: string;
}

export interface IJsapiService {
  createTransaction(params: JsapiRequest): Promise<JsapiResponse>;
}

export interface INativeService {
  createOrder(request: NativePaymentRequest): Promise<NativePaymentResponse>;
  queryOrder(request: QueryOrderRequest): Promise<any>;
  closeOrder(outTradeNo: string): Promise<void>;
}

export interface WeChatPayV3Config {
  appId: string;
  mchId: string;
  privateKey?: string;
  privateKeyPath: string;
  serialNo: string;
  apiV3Key: string;
  notifyUrl?: string;
}

export interface NativePaymentRequest {
  description: string;
  out_trade_no: string;
  amount: {
    total: number;
    currency?: string;
  };
  notify_url?: string;
  time_expire?: string;
  attach?: string;
  goods_tag?: string;
  support_fapiao?: boolean;
}

export interface NativePaymentResponse {
  code_url: string;
}
