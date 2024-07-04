import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { getToken } from "@/lib/token";

// 创建 Axios 实例
const memberRequest: AxiosInstance = axios.create({
  baseURL: "/",
  timeout: 0 // 设置超时时间为 5 秒
});

// 添加请求拦截器
memberRequest.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理
    const accessToken = getToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
memberRequest.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);



// 创建 Axios 实例
const adminRequest: AxiosInstance = axios.create({
  baseURL: "/",
  timeout: 0 // 设置超时时间为 5 秒
});

// 添加请求拦截器
adminRequest.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理
    const accessToken = getToken('admin');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
adminRequest.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export { memberRequest, adminRequest };
