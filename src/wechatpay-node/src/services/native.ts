import { IHttpClient } from "../core/interfaces";
import { INativeService, NativePaymentRequest, NativePaymentResponse, QueryOrderRequest } from "../types/common";


export class NativeService implements INativeService {
  constructor(private http: IHttpClient) {}

  async createOrder(request: NativePaymentRequest): Promise<NativePaymentResponse> {
    return this.http.request({
      method: 'POST',
      url: '/v3/pay/transactions/native',
      data: {
        appid: this.http.getConfig().appId,
        mchid: this.http.getConfig().mchId,
        description: request.description,
        out_trade_no: request.out_trade_no,
        notify_url: request.notify_url || this.http.getConfig().notifyUrl,
        amount: {
          total: request.amount.total,
          currency: request.amount.currency || 'CNY'
        },
        ...(request.time_expire && { time_expire: request.time_expire }),
        ...(request.attach && { attach: request.attach }),
        ...(request.goods_tag && { goods_tag: request.goods_tag }),
        ...(request.support_fapiao && { support_fapiao: request.support_fapiao })
      }
    });
  }

  async queryOrder(request: QueryOrderRequest): Promise<any> {
    return this.http.request({
      method: 'GET',
      url: `/v3/pay/transactions/id/${request.transaction_id}?mchid=${request.mchid}`
    });
  }

  async closeOrder(outTradeNo: string): Promise<void> {
    return this.http.request({
      method: 'POST',
      url: `/v3/pay/transactions/out-trade-no/${outTradeNo}/close`
    });
  }
}
