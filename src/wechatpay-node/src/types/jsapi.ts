import { QueryOrderRequest } from "./common";

export interface JsapiRequest {
  appid: string;
  mchid: string;
  description: string;
  out_trade_no: string;
  amount: {
    total: number;
    currency?: string;
  };
  notify_url?: string;
  payer: {
    openid: string;
  };
  time_expire?: string;
  attach?: string;
  goods_tag?: string;
  support_fapiao?: boolean;
  detail?: {
    cost_price?: number;
    invoice_id?: string;
    goods_detail?: Array<{
      merchant_goods_id: string;
      wechatpay_goods_id?: string;
      goods_name: string;
      quantity: number;
      unit_price: number;
    }>;
  };
  scene_info?: {
    payer_client_ip?: string;
    device_id?: string;
    store_info?: {
      id: string;
      name?: string;
      area_code?: string;
      address?: string;
    };
  };
  settle_info?: {
    profit_sharing?: boolean;
  };
}

export interface JsapiResponse {
  prepay_id: string;
}
