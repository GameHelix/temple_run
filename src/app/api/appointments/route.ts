// src/app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/edge-jwt';
import {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
} from '@/lib/appointment-db';
import { AppointmentStatus, CreateAppointmentInput } from '@/types/user';

const VALID_STATUSES: AppointmentStatus[] = ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'];

function parseStatuses(raw: string | null): AppointmentStatus[] | undefined {
  if (!raw) return undefined;
  const statuses = raw.split(',').filter((s): s is AppointmentStatus =>
    VALID_STATUSES.includes(s as AppointmentStatus)
  );
  return statuses.length > 0 ? statuses : undefined;
}

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
    const status = parseStatuses(searchParams.get('status'));
    const fromDate = searchParams.get('fromDate') || undefined;
    const toDate = searchParams.get('toDate') || undefined;

    let appointments;

    if (decoded.role === 'doctor') {
      appointments = await getDoctorAppointments(decoded.userId, { status, fromDate, toDate });
    } else if (decoded.role === 'patient') {
      appointments = await getPatientAppointments(decoded.userId, { status, fromDate });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid role' }, { status: 403 });
    }

    return NextResponse.json({ success: true, appointments });
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

    if (!body.doctorId || !body.appointmentDate || !body.appointmentTime) {
      return NextResponse.json(
        { success: false, message: 'Doctor, date, and time are required' },
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const appointmentDate = new Date(body.appointmentDate);
    if (isNaN(appointmentDate.getTime()) || appointmentDate < new Date(new Date().toDateString())) {
      return NextResponse.json(
        { success: false, message: 'Appointment date must be today or in the future' },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM or HH:MM:SS)
    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(body.appointmentTime)) {
      return NextResponse.json(
        { success: false, message: 'Invalid time format' },
        { status: 400 }
      );
    }

    const appointment = await createAppointment(decoded.userId, body);

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error: unknown) {
    console.error('Error creating appointment:', error);
    const message = error instanceof Error ? error.message : 'Failed to create appointment';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
