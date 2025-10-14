// src/app/api/doctors/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/edge-jwt';
import { upsertDoctorProfile, getDoctorProfileByUserId } from '@/lib/doctor-db';
import { DoctorProfileInput } from '@/types/user';

/**
 * GET /api/doctors/profile - Get current doctor's profile
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded || decoded.role !== 'doctor') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
    }

    const profile = await getDoctorProfileByUserId(decoded.userId);

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/doctors/profile - Create or update doctor profile
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded || decoded.role !== 'doctor') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
    }

    const body: DoctorProfileInput = await request.json();

    // Validate required fields
    if (!body.specialization) {
      return NextResponse.json(
        { success: false, message: 'Specialization is required' },
        { status: 400 }
      );
    }

    const profile = await upsertDoctorProfile(decoded.userId, body);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
