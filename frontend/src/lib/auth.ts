import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { setTokens } from './axios';
import { ResponseError } from './utils';

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
          const response = await loginRequest(credentials)
          
          if (response.access_token) {
            return {
              id: response.user.id,
              name: response.user.username,
              email: response.user.email,
              accessToken: response.access_token,
              refreshToken: response.refresh_token,
              accessTokenExpiresAt: response.access_token_expires_at,
              refreshTokenExpiresAt: response.refresh_token_expires_at,
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
      if (data.user instanceof ResponseError) {
        throw data.user
      }
      
      return true
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.isExpired = false;
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpiresAt = user.accessTokenExpiresAt
        token.refreshTokenExpiresAt = user.refreshTokenExpiresAt
        token.id = user.id
      }

      if (trigger) {
        return token
      }

      if (!token.accessTokenExpiresAt || !token.refreshTokenExpiresAt) {
        return resetTokenData(token)
      }

      const now = new Date();
      const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      const accessTokenExpiresAt = new Date(token.accessTokenExpiresAt as string)
      const refreshTokenExpiresAt = new Date(token.refreshTokenExpiresAt as string)

      if (refreshTokenExpiresAt < utcNow) {
        return resetTokenData(token)
      }

      if (accessTokenExpiresAt < utcNow) {
        try {
          const response = await refreshToken(token.refreshToken as string)
          token.accessToken = response.access_token
          token.refreshToken = response.refresh_token
          token.accessTokenExpiresAt = response.access_token_expires_at
          token.refreshTokenExpiresAt = response.refresh_token_expires_at
        } catch (error) {
          console.log('refreshToken error', error)
          return resetTokenData(token)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token.isExpired) {
        return null
      }

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

async function loginRequest(credentials: { email: string, password: string }) {
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

  return data;
}

async function refreshToken(refreshToken: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ResponseError(JSON.stringify(data), data.code)
  }

  return data;
}

function resetTokenData(token: any) {
  token.isExpired = true
  token.accessToken = ''
  token.refreshToken = ''
  token.accessTokenExpiresAt = ''
  token.refreshTokenExpiresAt = ''
  return token
}