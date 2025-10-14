// src/lib/edge-jwt.ts
// This file contains JWT functions compatible with Edge Runtime

interface JwtPayload {
  id: string;
  email: string;
  role?: 'doctor' | 'patient' | 'admin';
  exp?: number;
}

/**
 * A simple JWT token verifier that works in Edge Runtime
 * This does not perform cryptographic validation - use only for basic token parsing
 */
export function parseJwt(token: string): JwtPayload | null {
  try {
    // Split the token into header, payload, and signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const parsedPayload = JSON.parse(decoded) as JwtPayload;
    
    // Check if token is expired
    if (parsedPayload.exp && parsedPayload.exp * 1000 < Date.now()) {
      return null; // Token has expired
    }
    
    return parsedPayload;
  } catch (error) {
    console.error('JWT parsing error:', error);
    return null;
  }
}

/**
 * For middleware - simplified token verification that works in Edge Runtime
 */
export function verifyTokenForEdge(token: string): JwtPayload | null {
  return parseJwt(token);
}

/**
 * Verify token - returns payload with userId and role
 */
export async function verifyToken(token: string): Promise<{ userId: string; role: string } | null> {
  const payload = parseJwt(token);
  if (!payload) return null;

  return {
    userId: payload.id,
    role: payload.role || 'patient',
  };
}