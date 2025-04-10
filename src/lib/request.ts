import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

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
    // 对响应数据做些什么
    return response.data;
  },
  (error: AxiosError) => {
    // 对响应错误做些什么
    return Promise.reject(error);
  }
);

export default request;
