// middleware.ts (RAÍZ del proyecto)

import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/login', '/signup', '/api/auth',
  '/favicon.ico', '/site.webmanifest', '/robots.txt',
  '/apple-touch-icon.png', '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png', '/favicon.svg', '/images', '/assets'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 🔥 Solo loguea el token, no bloquea en DEV
  const token = request.cookies.get('firebaseIdToken');
  if (!token) {
    console.warn(`[AUTH] No token found for path: ${pathname} (skipping redirect in DEV)`);
    return NextResponse.next();
  }

  if ((pathname === '/login' || pathname === '/signup') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image).*)',
    '/dashboard/:path*',
    '/login',
    '/signup'
  ],
};
