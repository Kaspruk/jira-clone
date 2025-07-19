import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { getIsClient } from './utils';

// Створюємо екземпляр axios з базовою конфігурацією
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Серверний клієнт для API запитів на server-side
const serverAxiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const tokens = {
  _accessToken: '',
  _refreshToken: '',

  get accessToken() {
    if (getIsClient()) {
      return localStorage.getItem('accessToken') || this._accessToken;
    }

    return this._accessToken;
  },
  get refreshToken() {
    if (getIsClient()) {
      return localStorage.getItem('refreshToken') || this._refreshToken;
    }

    return this._refreshToken;
  },

  set accessToken(value: string) {
    if (getIsClient()) {
      localStorage.setItem('accessToken', value);
    }

    this._accessToken = value;
  },
  set refreshToken(value: string) {
    if (getIsClient()) {
      localStorage.setItem('refreshToken', value);
    }

    this._refreshToken = value;
  },
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  tokens.accessToken = accessToken;
  tokens.refreshToken = refreshToken;
};

const publicPaths = ['/auth/login', '/auth/logout', '/auth/register'];

// Серверний interceptor
serverAxiosClient.interceptors.request.use(
  async (config) => {
    const url = config.url || '';
    const isPublicPath = publicPaths.some(path => url.indexOf(path) !== -1);

    if (!isPublicPath) {
      try {
        const session = await getServerSession(authOptions);
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      } catch (error) {
        console.log('Failed to get server session:', error);
        // Під час помилки - відхиляємо запит
        return Promise.reject(error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Клієнтський interceptor
axiosClient.interceptors.request.use(
  async (config) => {
    const url = config.url || '';
    const isPublicPath = publicPaths.some(path => url.indexOf(path) !== -1);

    if (!tokens.accessToken && getIsClient()) {
      const session = await getSession();

      if (session) {
        setTokens(session?.accessToken || '', session?.refreshToken || '');
      }
    }

    if (!isPublicPath && tokens.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - обробляє відповіді та помилки
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401) {
      const errorData = error.response?.data;
     
      if (errorData?.code === 5 && !originalRequest._retry && tokens.refreshToken) {
        originalRequest._retry = true;
        
        try {
          const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refresh_token: tokens.refreshToken
            }),
          });
          
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            setTokens(refreshData.access_token, refreshData.refresh_token);
            
            originalRequest.headers.Authorization = `Bearer ${refreshData.access_token}`;
            return axiosClient(originalRequest);
          } else {
            console.log('Token refresh failed:', refreshResponse.status);
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
        }
      }
      
      console.log('Logging out user due to auth failure');
      
      setTokens('', '');

      if (getIsClient()) {
        try {
          await signOut({ 
            callbackUrl: '/login',
            redirect: true 
          });
        } catch (logoutError) {
          console.log('logoutError', logoutError);
          window.location.href = '/login';
        }
      }

      return Promise.resolve(null);
    }
    
    return Promise.reject(error);
  }
);

// Функція для отримання правильного клієнта залежно від середовища
export const getAxiosClient = () => {
  return getIsClient() ? axiosClient : serverAxiosClient;
};

export default axiosClient;
export { serverAxiosClient };
