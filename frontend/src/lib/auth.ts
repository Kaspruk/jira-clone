import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
  
            if (!response.ok) {
              return null
            }
  
            const data = await response.json()
            
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
        }
        return session
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
 