import { HttpClient } from "../core/http";
import { JsapiRequest, JsapiResponse } from "../types/jsapi";

export class JsapiService {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async createTransaction(params: JsapiRequest): Promise<JsapiResponse> {
    return this.http.post("/v3/pay/transactions/jsapi", params);
  }

  async queryOrder(request: { transaction_id: string; mchid: string }): Promise<any> {
    return this.http.get(`/v3/pay/transactions/out-trade-no/${request.transaction_id}`, {
      params: {
        mchid: request.mchid
      }
    });
  }
}
