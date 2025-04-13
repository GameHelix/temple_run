// src/middleware.ts
export const runtime = 'nodejs'; // Use Node.js runtime for middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';
import { testConnection } from './lib/db';
import initializeDatabase from './lib/initDB';

// Initialize the database when the server starts
// This is executed only once when the server initializes
try {
  console.log('Starting database initialization from middleware...');
  Promise.all([
    initializeDatabase(),
    testConnection()
  ]).catch(err => {
    console.error('Database initialization error:', err);
  });
} catch (error) {
  console.error('Error during database initialization in middleware:', error);
}

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
    // Get the token from cookies or authorization header
    const authHeader = request.headers.get('Authorization');
    const cookieToken = request.cookies.get('auth_token')?.value;
    
    // Initially, look for "Authorization: Bearer <token>" in request headers
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else if (cookieToken) {
      // Fallback to check cookies
      token = cookieToken;
    } else {
      // No token found - try to get from a custom header for client-side auth
      const clientAuthHeader = request.headers.get('X-Auth-Token');
      if (clientAuthHeader) {
        token = clientAuthHeader;
      }
    }
    
    // If no token or invalid token, redirect to sign-in page
    if (!token || !verifyToken(token)) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(signInUrl);
    }
    
    // For doctor-only routes, we should check the user's role
    // This would typically be done in the component itself,
    // but for added security we could enhance this middleware
    // by decoding the token and checking the role
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