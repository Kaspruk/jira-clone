import axios, { AxiosInstance } from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';
import { getIsClient } from './utils';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';
const TIMEOUT = 10000;
const publicPaths = ['/auth/login', '/auth/logout', '/auth/register'];

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


function createAxiosClient(): AxiosInstance {
  return axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: { 'Content-Type': 'application/json' },
  });
}

const axiosClient = createAxiosClient();

axiosClient.interceptors.request.use(
  async (config) => {
    const url = config.url || '';
    const isPublicPath = publicPaths.some(path => url.indexOf(path) !== -1);

    if (!tokens.accessToken) {
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
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      const errorData = error.response?.data;
      if (errorData?.code === 5 && !originalRequest._retry && tokens.refreshToken) {
        originalRequest._retry = true;

        try {
          const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: tokens.refreshToken }),
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

      setTokens('', '');

      try {
        await signOut({ callbackUrl: '/login', redirect: true });
      } catch (error) {
        console.error('Error signing out:', error);
        window.location.href = '/login';
      }

      return Promise.reject(null);
    }
    return Promise.reject(error);
  }
);


const serverAxiosClient = createAxiosClient();

serverAxiosClient.interceptors.request.use(
  async (config) => {
    const url = config.url || '';
    const isPublicPath = publicPaths.some(path => url.indexOf(path) !== -1);
    try {
      const session = await getServerSession(authOptions);
      setTokens(session?.accessToken || '', session?.refreshToken || '');

      if (!isPublicPath && tokens.accessToken) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
    } catch (error) {
      console.log('Failed to get server session:', error);
      return Promise.reject(error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAxiosClient = () => {
  return getIsClient() ? axiosClient : serverAxiosClient;
};

export default axiosClient;
export { serverAxiosClient };
