import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

export interface Response<T = any> {
  code?: number;
  data?: T;
  msg?: string;
  [key: string]: any; // Allow additional properties
}

declare module "axios" {
  interface AxiosInstance {
    request<T = any>(config: AxiosRequestConfig): Promise<Response<T>>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<Response<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<Response<T>>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<Response<T>>;
    options<T = any>(url: string, config?: AxiosRequestConfig): Promise<Response<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Response<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Response<T>>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Response<T>>;
  }
}

let baseURL = "/";
if (typeof window === "undefined") {
  baseURL = `http://localhost:${process.env.PORT}`;
}

// 创建 Axios 实例
const request: AxiosInstance = axios.create({
  baseURL,
  timeout: 0 // 设置超时时间为 5 秒
});

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理
    if (typeof window !== "undefined") {
      // 从token
    }

    return config;
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 确保返回Response<T>结构
    return response.data;
  },
  (error: AxiosError) => {
    // 统一错误处理
    if (error.response) {
      return Promise.reject({
        code: error.response.status,
        data: error.response.data,
        msg: error.message
      });
    }
    return Promise.reject({
      code: 0,
      data: null,
      msg: error.message
    });
  }
);

export default request;
