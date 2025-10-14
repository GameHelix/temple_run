// src/app/api/doctors/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDoctorWithProfile } from '@/lib/doctor-db';

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

    if (!doctor.profile?.isVerified) {
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
