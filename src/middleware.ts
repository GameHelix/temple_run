// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

// Add routes that should be protected here
const PROTECTED_ROUTES = [
  '/dashboard',
  '/chat',
  '/profile',
  '/api/chat',
  '/api/auth/me'
];

// Routes that only doctors can access
const DOCTOR_ONLY_ROUTES = [
  '/doctor',
  '/doctor/dashboard'
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
  
  if (isProtectedRoute || isDoctorRoute) {
    // Get the token from cookies
    const cookieToken = request.cookies.get('auth_token')?.value;
    
    // Get token from Authorization header as fallback
    const authHeader = request.headers.get('Authorization');
    let headerToken = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      headerToken = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
    
    // Use cookie token first, then header token
    const token = cookieToken || headerToken;
    
    // If no token or invalid token, redirect to sign-in page
    if (!token) {
      console.log('No token found, redirecting to sign-in');
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(signInUrl);
    }
    
    try {
      // Verify the token
      const decoded = verifyToken(token);
      if (!decoded) {
        console.log('Invalid token, redirecting to sign-in');
        const signInUrl = new URL('/auth/signin', request.url);
        signInUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(signInUrl);
      }
      
      // For doctor-only routes, check the user's role
      if (isDoctorRoute) {
        // Assuming your token contains a role field
        if (decoded.role !== 'doctor') {
          // Redirect non-doctors to home
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
      
      // Create a new response
      const response = NextResponse.next();
      
      // Ensure the auth token is present in cookies
      if (!cookieToken && headerToken) {
        // Set the cookie for future requests if it's missing but we have a header token
        response.cookies.set({
          name: 'auth_token',
          value: headerToken,
          httpOnly: true,
          path: '/',
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });
      }
      
      // Clone the request headers and set the Authorization header
      // This ensures the token is available to API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('Authorization', `Bearer ${token}`);
      
      // Return the modified request with headers
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
    '/api/chat/:path*',
  ],
};