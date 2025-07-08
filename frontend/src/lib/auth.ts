import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getServerSession, NextAuthOptions, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getSession } from 'next-auth/react';
import { isServer } from '@tanstack/react-query';

import { setTokens } from './axios';
import { ResponseError } from './utils';

export interface AuthMiddlewareConfig {
    publicPaths: string[];
    loginPath: string;
    homePath: string;
    enableLogging?: boolean;
}

export const defaultConfig: AuthMiddlewareConfig = {
    publicPaths: ['/login', '/register', '/restore-password', '/not-found'],
    loginPath: '/login',
    homePath: '/',
};

export async function getAuthStatus(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Отримуємо NextAuth JWT токен
    const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
    });
    
    const isAuthenticated = Boolean(token);
    
    return {
        token,
        isAuthenticated,
        user: token ? {
            id: token.id as string,
            email: token.email,
            name: token.name,
        } : null,
        pathname,
    };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Запит до вашого FastAPI backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new ResponseError(JSON.stringify(data), data.code)
          }
          
          // Повертаємо user об'єкт який буде збережений в сесії
          if (data.access_token) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.username,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            }
          }

          return null
        } catch (error) {
          if (error instanceof ResponseError) {
            throw error;
          }

          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 днів
  },
  callbacks: {
    async signIn(data) {
      console.log('signIn data', data);

      if (data.user instanceof ResponseError) {
        throw data.user
      }
      
      return true
    },
    async jwt({ token, user }) {
      // Зберігаємо токени в JWT
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Додаємо токени до сесії
      if (token && session.user) {
        session.user.id = token.id as string
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        setTokens(session.accessToken, session.refreshToken)
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
