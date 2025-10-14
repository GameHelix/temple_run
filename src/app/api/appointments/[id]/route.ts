// src/app/api/appointments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/edge-jwt';
import { getAppointmentWithDetails, updateAppointment, cancelAppointment } from '@/lib/appointment-db';
import { UpdateAppointmentInput } from '@/types/user';

/**
 * GET /api/appointments/[id] - Get appointment details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    const appointment = await getAppointmentWithDetails(id);

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this appointment
    if (appointment.doctorId !== decoded.userId && appointment.patientId !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to view this appointment' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/appointments/[id] - Update appointment
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    const body: UpdateAppointmentInput = await request.json();

    // Get appointment to check permissions
    const appointment = await getAppointmentWithDetails(id);

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check permissions based on role
    if (decoded.role === 'doctor' && appointment.doctorId !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 403 }
      );
    }

    if (decoded.role === 'patient' && appointment.patientId !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 403 }
      );
    }

    // Patients can only cancel, doctors can update status and add notes
    if (decoded.role === 'patient' && body.status && body.status !== 'cancelled') {
      return NextResponse.json(
        { success: false, message: 'Patients can only cancel appointments' },
        { status: 403 }
      );
    }

    const updatedAppointment = await updateAppointment(id, body);

    return NextResponse.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/appointments/[id] - Cancel appointment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const cancellationReason = body.cancellationReason;

    // Get appointment to check permissions
    const appointment = await getAppointmentWithDetails(id);

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check if user has access to cancel this appointment
    if (appointment.doctorId !== decoded.userId && appointment.patientId !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to cancel this appointment' },
        { status: 403 }
      );
    }

    const cancelledAppointment = await cancelAppointment(id, cancellationReason);

    return NextResponse.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment: cancelledAppointment,
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
}
