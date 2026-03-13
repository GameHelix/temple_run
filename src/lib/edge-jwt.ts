// src/lib/edge-jwt.ts
// JWT functions compatible with Edge Runtime using Web Crypto API

interface JwtPayload {
  id: string;
  email: string;
  role?: 'doctor' | 'patient' | 'admin';
  exp?: number;
}

/**
 * Verify HMAC-SHA256 JWT signature using Web Crypto API (Edge-compatible)
 */
async function verifyHmacSignature(token: string, secret: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const data = encoder.encode(`${parts[0]}.${parts[1]}`);
  const signatureBase64 = parts[2].replace(/-/g, '+').replace(/_/g, '/');
  const padding = (4 - (signatureBase64.length % 4)) % 4;
  const paddedSignature = signatureBase64 + '='.repeat(padding);
  const signature = Uint8Array.from(atob(paddedSignature), c => c.charCodeAt(0));

  return crypto.subtle.verify('HMAC', key, signature, data);
}

/**
 * Parse JWT payload without signature verification
 */
function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const padding = (4 - (payload.length % 4)) % 4;
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padding));
    const parsedPayload = JSON.parse(decoded) as JwtPayload;

    if (parsedPayload.exp && parsedPayload.exp * 1000 < Date.now()) {
      return null;
    }

    return parsedPayload;
  } catch {
    return null;
  }
}

/**
 * Verify token for middleware — validates signature + expiry
 */
export async function verifyTokenForEdge(token: string): Promise<JwtPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const valid = await verifyHmacSignature(token, secret);
    if (!valid) return null;
    return parseJwtPayload(token);
  } catch {
    return null;
  }
}

/**
 * Verify token — returns userId and role for use in API routes
 */
export async function verifyToken(token: string): Promise<{ userId: string; role: string } | null> {
  const payload = await verifyTokenForEdge(token);
  if (!payload) return null;

  return {
    userId: payload.id,
    role: payload.role || 'patient',
  };
}
