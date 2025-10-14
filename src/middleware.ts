// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenForEdge } from './lib/edge-jwt';

// Add routes that should be protected here
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if the path is a doctor-only route
  const isDoctorRoute = DOCTOR_ONLY_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if the path is an admin-only route
  const isAdminRoute = ADMIN_ONLY_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isProtectedRoute || isDoctorRoute || isAdminRoute) {
    // Get the token from cookies
    const cookieToken = request.cookies.get('token')?.value;
    
    // Get token from Authorization header as fallback
    const authHeader = request.headers.get('Authorization');
    let headerToken = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      headerToken = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
    
    // Use cookie token first, then header token
    const token = cookieToken || headerToken;
    
    // If no token, redirect to sign-in page
    if (!token) {
      console.log('No token found, redirecting to sign-in');
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(signInUrl);
    }
    
    try {
      // Using edge-compatible token verification
      const decoded = verifyTokenForEdge(token);
      
      if (!decoded) {
        console.log('Invalid token, redirecting to sign-in');
        const signInUrl = new URL('/auth/signin', request.url);
        signInUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(signInUrl);
      }
      
      // For doctor-only routes, check the user's role
      if (isDoctorRoute && decoded.role !== 'doctor' && decoded.role !== 'admin') {
        // Allow admins to access doctor routes, but redirect non-doctors/non-admins to home
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // For admin-only routes, check if the user is an admin
      if (isAdminRoute && decoded.role !== 'admin') {
        // Redirect non-admins to home
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Create a new response
      const response = NextResponse.next();
      
      // Ensure the auth token is present in cookies
      if (!cookieToken && headerToken) {
        // Set the cookie for future requests if it's missing but we have a header token
        response.cookies.set({
          name: 'token',
          value: headerToken,
          httpOnly: true,
          path: '/',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });
      }
      
      // Pass the token in headers to API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('Authorization', `Bearer ${token}`);
      
      // Return the modified request
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Token verification error:', error);
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except those starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    // - auth routes (allow unauthenticated access)
    '/((?!_next/static|_next/image|favicon.ico|public|auth).*)',
    '/api/appointments/:path*',
    '/api/availability/:path*',
    '/api/admin/:path*',
  ],
};