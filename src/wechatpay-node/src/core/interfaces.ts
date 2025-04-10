import { WeChatPayV3Config } from "../types/common";

export interface IHttpClient {
  request<T = any>(config: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    data?: any;
  }): Promise<T>;
  post<T = any>(url: string, data?: any): Promise<T>;
  getConfig(): WeChatPayV3Config;
}
