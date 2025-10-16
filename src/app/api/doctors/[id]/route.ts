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
    console.log('[Doctor Profile] Fetching doctor with ID:', id);

    const doctor = await getDoctorWithProfile(id);
    console.log('[Doctor Profile] Doctor found:', doctor ? 'YES' : 'NO');

    if (doctor) {
      console.log('[Doctor Profile] Has profile:', doctor.profile ? 'YES' : 'NO');
      if (doctor.profile) {
        console.log('[Doctor Profile] Is verified:', doctor.profile.isVerified);
      }
    }

    if (!doctor) {
      console.log('[Doctor Profile] Doctor not found in database');
      return NextResponse.json(
        { success: false, message: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Check if doctor has a profile
    if (!doctor.profile) {
      console.log('[Doctor Profile] Doctor has no profile');
      return NextResponse.json(
        { success: false, message: 'Doctor profile not found' },
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
        console.log('[Doctor Profile] Request from admin:', isAdmin);
      } catch (error) {
        console.log('[Doctor Profile] Token verification failed:', error);
        // Token is invalid or expired, continue as non-admin
      }
    } else {
      console.log('[Doctor Profile] No token found - public request');
    }

    // Only enforce verification check for non-admin users
    if (!isAdmin && !doctor.profile.isVerified) {
      console.log('[Doctor Profile] BLOCKED: Doctor not verified, requester is not admin');
      return NextResponse.json(
        { success: false, message: 'Doctor is not verified' },
        { status: 403 }
      );
    }

    console.log('[Doctor Profile] SUCCESS: Returning doctor profile');
    return NextResponse.json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error('[Doctor Profile] ERROR:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch doctor details' },
      { status: 500 }
    );
  }
}
