import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface JwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  exp?: number;
}

function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr) as JwtPayload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authToken = request.cookies.get('authToken')?.value;
  const payload = authToken ? parseJwtPayload(authToken) : null;
  const isTokenExpired = payload?.exp ? payload.exp * 1000 < Date.now() : false;
  const isValidAuth = !!payload && !isTokenExpired;
  const isAdmin = isValidAuth && payload.role?.toUpperCase() === 'ADMIN';

  // 1. Bảo vệ các tuyến đường Quản trị viên (/admin và /admin/*)
  if (pathname.startsWith('/admin')) {
    if (!isValidAuth || !isAdmin) {
      const loginUrl = new URL('/login', request.url);
      const search = request.nextUrl.search;
      loginUrl.searchParams.set('redirect', `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Tự động chuyển hướng Admin từ trang chủ '/' sang trang quản trị '/admin'
  if (pathname === '/' && isValidAuth && isAdmin) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Khai báo matcher bao phủ trang chủ và toàn bộ tuyến đường quản trị
export const config = {
  matcher: ['/', '/admin/:path*'],
}; 