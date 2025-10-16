// src/app/api/doctors/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDoctorWithProfile } from '@/lib/doctor-db';
import { verifyToken } from '@/lib/edge-jwt';

/**
 * GET /api/doctors/[id] - Get doctor details with profile
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctor = await getDoctorWithProfile(id);

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Check if requester is an admin
    const token = request.cookies.get('token')?.value;
    let isAdmin = false;

    if (token) {
      try {
        const decoded = await verifyToken(token);
        isAdmin = decoded?.role === 'admin';
      } catch {
        // Token is invalid or expired, continue as non-admin
      }
    }

    // Only enforce verification check for non-admin users
    if (!isAdmin && !doctor.profile?.isVerified) {
      return NextResponse.json(
        { success: false, message: 'Doctor is not verified' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch doctor details' },
      { status: 500 }
    );
  }
}
