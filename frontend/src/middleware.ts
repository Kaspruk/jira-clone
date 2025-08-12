import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface AuthMiddlewareConfig {
    publicPaths: string[];
    loginPath: string;
    homePath: string;
}

export const defaultConfig: AuthMiddlewareConfig = {
    publicPaths: ['/login', '/register', '/restore-password', '/not-found'],
    loginPath: '/login',
    homePath: '/',
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Перевіряємо наявність next-auth session token в cookies
    const sessionToken = request.cookies.get('next-auth.session-token') || 
                        request.cookies.get('__Secure-next-auth.session-token');
    
    const isAuthenticated = Boolean(sessionToken);
    const isPublic = defaultConfig.publicPaths.some(path => pathname.startsWith(path));
    
    // Якщо користувач не автентифікований і намагається зайти на приватну сторінку
    if (!isAuthenticated && !isPublic) {
        return NextResponse.redirect(new URL(defaultConfig.loginPath, request.url));
    }
    
    // Якщо користувач автентифікований і намагається зайти на публічну сторінку
    if (isAuthenticated && isPublic) {
        return NextResponse.redirect(new URL(defaultConfig.homePath, request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api/auth|api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json|webmanifest)$).*)',
    ],
}; 