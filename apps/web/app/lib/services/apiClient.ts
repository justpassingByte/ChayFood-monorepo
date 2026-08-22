import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * 🌟 Centralized API Client (Axios Instance)
 * - Tự động đính kèm Bearer Token từ Cookies (`authToken` hoặc `auth_token`) hoặc localStorage
 * - Chuẩn hóa base URL và xử lý request/response cho toàn bộ ứng dụng Next.js
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('authToken') ||
        localStorage.getItem('auth_token') ||
        Cookies.get('authToken') ||
        Cookies.get('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
);

export default api;
