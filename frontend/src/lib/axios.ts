import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

// Створюємо екземпляр axios з базовою конфігурацією
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getIsClient = () => typeof window !== 'undefined';

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

const getIsServer = () => typeof window === 'undefined';

const publicPaths = ['/auth/login', '/auth/logout', '/auth/register'];

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
    // Обробка помилок авторизації
    if (error.response?.status === 401) {
      console.error('Unauthorized access - logging out user');
      
      try {
        // Викликаємо logout з NextAuth
        await signOut({ 
          callbackUrl: '/login',
          redirect: true 
        });
      } catch (logoutError) {
        console.error('Error during logout:', logoutError);
        // Якщо logout не спрацював, перенаправляємо вручну
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
