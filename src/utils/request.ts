import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { getMockResponse } from '@/mock';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

// 开发模式 Mock 拦截器（VITE_USE_MOCK=false 时走真实后端）
if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK !== 'false') {
  request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const mockResult = getMockResponse(
      config.url || '',
      config.method?.toUpperCase() || 'GET',
      config.data,
    );
    if (mockResult !== null) {
      config.adapter = async (cfg) => {
        try {
          const data = mockResult instanceof Promise ? await mockResult : mockResult;
          return {
            data,
            status: 200,
            statusText: 'OK',
            headers: {} as Record<string, string>,
            config: cfg,
            request: {},
          } as AxiosResponse;
        } catch (err) {
          // 将 mock 抛出的错误转为 axios 标准 reject，由下方响应拦截器统一处理
          return Promise.reject(err);
        }
      };
    }
    return config;
  });
}

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

request.interceptors.response.use(
  (response) => {
    const body = response.data;
    // 后端统一返回 Result { code, message, data }，自动解包
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code !== 200) {
        message.error(body.message || '请求失败');
        if (body.code === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(new Error(body.message));
      }
      return body.data;
    }
    return body;
  },
  (error: AxiosError<{ message: string }>) => {
    const msg = error.response?.data?.message || error.message || '请求失败';
    message.error(msg);

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export default request;
