// src/lib/availability-db.ts
import { query } from './db';
import { AvailabilitySchedule, AvailabilityScheduleInput } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create availability schedule for a doctor
 */
export async function createAvailabilitySchedule(
  doctorId: string,
  scheduleData: AvailabilityScheduleInput
): Promise<AvailabilitySchedule> {
  const { dayOfWeek, startTime, endTime, isAvailable = true } = scheduleData;

  const result = await query(
    `INSERT INTO randevu.availability_schedule (
      id, doctor_id, day_of_week, start_time, end_time, is_available
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [uuidv4(), doctorId, dayOfWeek, startTime, endTime, isAvailable]
  );

  return mapAvailabilityFromDb(result.rows[0]);
}

/**
 * Get doctor's availability schedule
 */
export async function getDoctorAvailability(
  doctorId: string,
  dayOfWeek?: number
): Promise<AvailabilitySchedule[]> {
  let queryText = 'SELECT * FROM randevu.availability_schedule WHERE doctor_id = $1';
  const params: any[] = [doctorId];

  if (dayOfWeek !== undefined) {
    queryText += ' AND day_of_week = $2';
    params.push(dayOfWeek);
  }

  queryText += ' ORDER BY day_of_week, start_time';

  const result = await query(queryText, params);

  return result.rows.map(mapAvailabilityFromDb);
}

/**
 * Update availability schedule
 */
export async function updateAvailabilitySchedule(
  scheduleId: string,
  updates: Partial<AvailabilityScheduleInput>
): Promise<AvailabilitySchedule> {
  const { dayOfWeek, startTime, endTime, isAvailable } = updates;

  const setClauses: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (dayOfWeek !== undefined) {
    setClauses.push(`day_of_week = $${paramIndex}`);
    params.push(dayOfWeek);
    paramIndex++;
  }

  if (startTime !== undefined) {
    setClauses.push(`start_time = $${paramIndex}`);
    params.push(startTime);
    paramIndex++;
  }

  if (endTime !== undefined) {
    setClauses.push(`end_time = $${paramIndex}`);
    params.push(endTime);
    paramIndex++;
  }

  if (isAvailable !== undefined) {
    setClauses.push(`is_available = $${paramIndex}`);
    params.push(isAvailable);
    paramIndex++;
  }

  if (setClauses.length === 0) {
    throw new Error('No fields to update');
  }

  params.push(scheduleId);

  const result = await query(
    `UPDATE randevu.availability_schedule
     SET ${setClauses.join(', ')}
     WHERE id = $${paramIndex}
     RETURNING *`,
    params
  );

  if (result.rows.length === 0) {
    throw new Error('Availability schedule not found');
  }

  return mapAvailabilityFromDb(result.rows[0]);
}

/**
 * Delete availability schedule
 */
export async function deleteAvailabilitySchedule(scheduleId: string): Promise<void> {
  await query('DELETE FROM randevu.availability_schedule WHERE id = $1', [scheduleId]);
}

/**
 * Delete all availability schedules for a doctor on a specific day
 */
export async function deleteDoctorDayAvailability(
  doctorId: string,
  dayOfWeek: number
): Promise<void> {
  await query('DELETE FROM randevu.availability_schedule WHERE doctor_id = $1 AND day_of_week = $2', [
    doctorId,
    dayOfWeek,
  ]);
}

/**
 * Set doctor's availability for a specific day
 * Replaces all existing schedules for that day
 */
export async function setDoctorDayAvailability(
  doctorId: string,
  dayOfWeek: number,
  timeSlots: Array<{ startTime: string; endTime: string }>
): Promise<AvailabilitySchedule[]> {
  // Delete existing schedules for this day
  await deleteDoctorDayAvailability(doctorId, dayOfWeek);

  // Insert new schedules
  const schedules: AvailabilitySchedule[] = [];

  for (const slot of timeSlots) {
    const schedule = await createAvailabilitySchedule(doctorId, {
      dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: true,
    });
    schedules.push(schedule);
  }

  return schedules;
}

/**
 * Check if doctor is available on a specific day and time
 */
export async function isDoctorAvailable(
  doctorId: string,
  date: string,
  time: string
): Promise<boolean> {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();

  const result = await query(
    `SELECT id FROM randevu.availability_schedule
     WHERE doctor_id = $1
     AND day_of_week = $2
     AND start_time <= $3
     AND end_time > $3
     AND is_available = true`,
    [doctorId, dayOfWeek, time]
  );

  if (result.rows.length === 0) {
    return false;
  }

  // Check if there's already an appointment at this time
  const appointmentResult = await query(
    `SELECT id FROM randevu.appointments
     WHERE doctor_id = $1
     AND appointment_date = $2
     AND appointment_time = $3
     AND status NOT IN ('cancelled')`,
    [doctorId, date, time]
  );

  return appointmentResult.rows.length === 0;
}

/**
 * Helper function to map database row to AvailabilitySchedule
 */
function mapAvailabilityFromDb(row: any): AvailabilitySchedule {
  return {
    id: row.id,
    doctorId: row.doctor_id,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
    isAvailable: row.is_available,
    createdAt: row.created_at,
  };
}
