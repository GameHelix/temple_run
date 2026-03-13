// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenForEdge } from './lib/edge-jwt';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/profile',
  '/appointments',
  '/api/appointments',
  '/api/availability',
  '/api/auth/me'
];

// Routes that only admins can access
const ADMIN_ONLY_ROUTES = [
  '/admin',
  '/admin/doctors',
  '/admin/users'
];

// Routes that only doctors can access
const DOCTOR_ONLY_ROUTES = [
  '/doctor/appointments',
  '/doctor/schedule',
  '/api/doctors/profile'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
  const isDoctorRoute = DOCTOR_ONLY_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAdminRoute = ADMIN_ONLY_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute || isDoctorRoute || isAdminRoute) {
    const cookieToken = request.cookies.get('token')?.value;

    const authHeader = request.headers.get('Authorization');
    let headerToken: string | null = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      headerToken = authHeader.substring(7);
    }

    const token = cookieToken || headerToken;

    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(signInUrl);
    }

    try {
      const decoded = await verifyTokenForEdge(token);

      if (!decoded) {
        const signInUrl = new URL('/auth/signin', request.url);
        signInUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(signInUrl);
      }

      if (isDoctorRoute && decoded.role !== 'doctor' && decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      if (isAdminRoute && decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('Authorization', `Bearer ${token}`);

      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });

      if (!cookieToken && headerToken) {
        response.cookies.set({
          name: 'token',
          value: headerToken,
          httpOnly: true,
          path: '/',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7
        });
      }

      return response;
    } catch {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|auth).*)',
    '/api/appointments/:path*',
    '/api/availability/:path*',
    '/api/admin/:path*',
  ],
};
