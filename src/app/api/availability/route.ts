// src/app/api/availability/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/edge-jwt';
import {
  getDoctorAvailability,
  setDoctorDayAvailability,
  createAvailabilitySchedule,
} from '@/lib/availability-db';
import { getAvailableTimeSlots } from '@/lib/appointment-db';
import { AvailabilityScheduleInput } from '@/types/user';

/**
 * GET /api/availability - Get doctor's availability schedule
 * Query params:
 * - doctorId: doctor's user ID (required)
 * - date: specific date to get available time slots (optional)
 * - dayOfWeek: filter by day of week (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');
    const dayOfWeek = searchParams.get('dayOfWeek');

    if (!doctorId) {
      return NextResponse.json(
        { success: false, message: 'Doctor ID is required' },
        { status: 400 }
      );
    }

    // If date is provided, return available time slots for that date
    if (date) {
      const timeSlots = await getAvailableTimeSlots(doctorId, date);
      return NextResponse.json({
        success: true,
        date,
        timeSlots,
      });
    }

    // Otherwise return weekly schedule
    const schedule = await getDoctorAvailability(
      doctorId,
      dayOfWeek ? parseInt(dayOfWeek) : undefined
    );

    return NextResponse.json({
      success: true,
      schedule,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/availability - Create or update availability schedule (doctor only)
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded || decoded.role !== 'doctor') {
      return NextResponse.json(
        { success: false, message: 'Only doctors can set availability' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Support both single schedule and bulk day update
    if (body.dayOfWeek !== undefined && Array.isArray(body.timeSlots)) {
      // Bulk update for a specific day
      const schedule = await setDoctorDayAvailability(
        decoded.userId,
        body.dayOfWeek,
        body.timeSlots
      );

      return NextResponse.json({
        success: true,
        message: 'Availability updated successfully',
        schedule,
      });
    } else {
      // Single schedule creation
      const scheduleData: AvailabilityScheduleInput = body;

      if (
        scheduleData.dayOfWeek === undefined ||
        !scheduleData.startTime ||
        !scheduleData.endTime
      ) {
        return NextResponse.json(
          { success: false, message: 'Day of week, start time, and end time are required' },
          { status: 400 }
        );
      }

      const schedule = await createAvailabilitySchedule(decoded.userId, scheduleData);

      return NextResponse.json({
        success: true,
        message: 'Availability created successfully',
        schedule,
      });
    }
  } catch (error) {
    console.error('Error creating availability:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create availability' },
      { status: 500 }
    );
  }
}
