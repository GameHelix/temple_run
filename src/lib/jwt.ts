// src/lib/jwt.ts
import jwt from 'jsonwebtoken';
import { User } from '@/types/user';

// In a real application, store this in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'healthcare-app-secret-key';

interface JwtPayload {
  id: string;
  email: string;
  role?: 'doctor' | 'patient'; // Add role to the payload
}

export function generateToken(user: User): string {
  // Create a token that expires in 7 days
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role }, // Include role in the token
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    // Ignore the error and return null for invalid tokens
    console.error('JWT verification error:', error);
    return null;
  }
}

// Note: This file is used for server components and API routes,
// but not in middleware (which uses edge-jwt.ts instead)