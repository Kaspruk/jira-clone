import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthStatus, defaultConfig } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    const authStatus = await getAuthStatus(request);

    const isPublic = defaultConfig.publicPaths.some(path => pathname.startsWith(path));
    
    if (!authStatus.isAuthenticated && !isPublic) {
        return NextResponse.redirect(new URL(defaultConfig.loginPath, request.url));
    }
    
    if (authStatus.isAuthenticated && isPublic) {
        return NextResponse.redirect(new URL(defaultConfig.homePath, request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api/auth|api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}; 