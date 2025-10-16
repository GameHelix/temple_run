// src/app/api/admin/doctors/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/edge-jwt';
import { verifyDoctor } from '@/lib/doctor-db';

export async function POST(request: NextRequest) {
  try {
    // Authenticate using cookie (like other admin endpoints)
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { doctorId } = body;

    if (!doctorId) {
      return NextResponse.json(
        { success: false, message: 'Doctor ID is required' },
        { status: 400 }
      );
    }

    // Verify the doctor's account
    await verifyDoctor(doctorId);

    return NextResponse.json({
      success: true,
      message: 'Doctor account verified successfully'
    });
  } catch (error) {
    console.error('Error verifying doctor account:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify doctor account' },
      { status: 500 }
    );
  }
}