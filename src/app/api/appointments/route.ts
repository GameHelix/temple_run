// src/app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/edge-jwt';
import {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
} from '@/lib/appointment-db';
import { CreateAppointmentInput } from '@/types/user';

/**
 * GET /api/appointments - Get appointments for current user
 * For patients: returns their appointments
 * For doctors: returns appointments with them
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status')?.split(',') || undefined;
    const fromDate = searchParams.get('fromDate') || undefined;
    const toDate = searchParams.get('toDate') || undefined;

    let appointments;

    if (decoded.role === 'doctor') {
      appointments = await getDoctorAppointments(decoded.userId, {
        status: status as any,
        fromDate,
        toDate,
      });
    } else if (decoded.role === 'patient') {
      appointments = await getPatientAppointments(decoded.userId, {
        status: status as any,
        fromDate,
      });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid role' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments - Create a new appointment (patient only)
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded || decoded.role !== 'patient') {
      return NextResponse.json(
        { success: false, message: 'Only patients can book appointments' },
        { status: 403 }
      );
    }

    const body: CreateAppointmentInput = await request.json();

    // Validate required fields
    if (!body.doctorId || !body.appointmentDate || !body.appointmentTime) {
      return NextResponse.json(
        { success: false, message: 'Doctor, date, and time are required' },
        { status: 400 }
      );
    }

    const appointment = await createAppointment(decoded.userId, body);

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
