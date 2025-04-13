// src/app/api/auth/update-role/route.ts
import { NextResponse } from 'next/server';
import { updateUserRole } from '@/lib/user-db';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    // Extract the token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication token is missing' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Get the request body
    const body = await request.json();
    const { userId, role } = body;
    
    // Validate role
    if (role !== 'doctor' && role !== 'patient') {
      return NextResponse.json(
        { success: false, message: 'Invalid role. Role must be either "doctor" or "patient".' },
        { status: 400 }
      );
    }
    
    // Update the user's role
    const updatedUser = await updateUserRole(userId, role);
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found or role update failed' },
        { status: 404 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: `User role updated to ${role} successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update role error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user role' },
      { status: 500 }
    );
  }
}