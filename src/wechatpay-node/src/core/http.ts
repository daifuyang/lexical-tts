import axios, { AxiosRequestConfig, AxiosHeaders } from 'axios';
import { Config } from './config';
import { Signer } from './sign';
import { IHttpClient } from './interfaces';

interface RequestConfig extends AxiosRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  retries?: number;
}

export class HttpClient implements IHttpClient {
  private instance = axios.create({
    baseURL: 'https://api.mch.weixin.qq.com',
    timeout: 10000,
  });
  private signer: Signer;

  constructor(private config: Config) {
    this.signer = new Signer(config);
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(async (config) => {
      const { authorization, serialNo } = await this.signer.sign(
        config.method?.toUpperCase() as 'GET' | 'POST' | 'PUT' | 'DELETE',
        config.url || '',
        config.data || ''
      );
      
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.set('Authorization', authorization);
      config.headers.set('Wechatpay-Serial', serialNo);
      config.headers.set('Accept', 'application/json');
      config.headers.set('Content-Type', 'application/json');
      
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => {
        // console.log(`Response ${response.status} from ${response.config.url}`);
        return response;
      },
      async (error) => {
        if (!error.config) {
          return Promise.reject(error);
        }

        const config = error.config as RequestConfig & { __retryCount?: number };
        const retryCount = config.__retryCount || 0;
        const maxRetries = config.retries ?? 3;
        
        if (error.response?.status >= 500 && retryCount < maxRetries) {
          console.log(`Retrying (${retryCount + 1}/${maxRetries}) ${config.url}`);
          config.__retryCount = retryCount + 1;
          await new Promise(res => setTimeout(res, 1000 * (retryCount + 1)));
          return this.instance.request(config);
        }

        if (error.response) {
          const errMsg = `WeChatPay API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}\n` +
                         `Request: ${error.config.method} ${error.config.url}\n` +
                         `Request Data: ${JSON.stringify(error.config.data)}`;
          return Promise.reject(new Error(errMsg));
        }
        return Promise.reject(error);
      }
    );
  }

  getConfig() {
    return this.config.getConfig();
  }

  async request<T = any>(config: RequestConfig): Promise<T> {
    try {
      const response = await this.instance.request<T>({
        ...config,
        timeout: config.timeout ?? 10000
      });
      if (response.data === undefined) {
        throw new Error('WeChatPay API returned no data');
      }
      return response.data;
    } catch (error) {
      console.error('HTTP Request Failed:', error);
      throw error;
    }
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      data
    });
  }

  async get<T = any>(url: string, config?: { params?: any }): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      params: config?.params
    });
  }
}
