// src/lib/appointment-db.ts
import { query } from './db';
import {
  Appointment,
  AppointmentWithDetails,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentStatus,
} from '@/types/user';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new appointment
 */
export async function createAppointment(
  patientId: string,
  appointmentData: CreateAppointmentInput
): Promise<Appointment> {
  const { doctorId, appointmentDate, appointmentTime, patientNotes } = appointmentData;

  // Check if the time slot is already booked
  const existingAppointment = await query(
    `SELECT id FROM appointments
     WHERE doctor_id = $1
     AND appointment_date = $2
     AND appointment_time = $3
     AND status NOT IN ('cancelled')`,
    [doctorId, appointmentDate, appointmentTime]
  );

  if (existingAppointment.rows.length > 0) {
    throw new Error('This time slot is already booked');
  }

  const result = await query(
    `INSERT INTO appointments (
      id, doctor_id, patient_id, appointment_date, appointment_time,
      status, patient_notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [uuidv4(), doctorId, patientId, appointmentDate, appointmentTime, 'pending', patientNotes]
  );

  return mapAppointmentFromDb(result.rows[0]);
}

/**
 * Get appointment by ID
 */
export async function getAppointmentById(appointmentId: string): Promise<Appointment | null> {
  const result = await query('SELECT * FROM appointments WHERE id = $1', [appointmentId]);

  if (result.rows.length === 0) {
    return null;
  }

  return mapAppointmentFromDb(result.rows[0]);
}

/**
 * Get appointment with full details (doctor and patient info)
 */
export async function getAppointmentWithDetails(
  appointmentId: string
): Promise<AppointmentWithDetails | null> {
  const result = await query(
    `SELECT
      a.*,
      d.name as doctor_name,
      dp.specialization as doctor_specialization,
      p.name as patient_name,
      p.email as patient_email,
      p.phone as patient_phone
    FROM appointments a
    INNER JOIN users d ON a.doctor_id = d.id
    LEFT JOIN doctor_profiles dp ON d.id = dp.user_id
    INNER JOIN users p ON a.patient_id = p.id
    WHERE a.id = $1`,
    [appointmentId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    ...mapAppointmentFromDb(row),
    doctorName: row.doctor_name,
    doctorSpecialization: row.doctor_specialization,
    patientName: row.patient_name,
    patientEmail: row.patient_email,
    patientPhone: row.patient_phone,
  };
}

/**
 * Get all appointments for a patient
 */
export async function getPatientAppointments(
  patientId: string,
  filters?: {
    status?: AppointmentStatus[];
    fromDate?: string;
    limit?: number;
  }
): Promise<AppointmentWithDetails[]> {
  let queryText = `
    SELECT
      a.*,
      d.name as doctor_name,
      dp.specialization as doctor_specialization,
      p.name as patient_name,
      p.email as patient_email,
      p.phone as patient_phone
    FROM appointments a
    INNER JOIN users d ON a.doctor_id = d.id
    LEFT JOIN doctor_profiles dp ON d.id = dp.user_id
    INNER JOIN users p ON a.patient_id = p.id
    WHERE a.patient_id = $1
  `;

  const params: any[] = [patientId];
  let paramIndex = 2;

  if (filters?.status && filters.status.length > 0) {
    queryText += ` AND a.status = ANY($${paramIndex})`;
    params.push(filters.status);
    paramIndex++;
  }

  if (filters?.fromDate) {
    queryText += ` AND a.appointment_date >= $${paramIndex}`;
    params.push(filters.fromDate);
    paramIndex++;
  }

  queryText += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC`;

  if (filters?.limit) {
    queryText += ` LIMIT $${paramIndex}`;
    params.push(filters.limit);
  }

  const result = await query(queryText, params);

  return result.rows.map((row) => ({
    ...mapAppointmentFromDb(row),
    doctorName: row.doctor_name,
    doctorSpecialization: row.doctor_specialization,
    patientName: row.patient_name,
    patientEmail: row.patient_email,
    patientPhone: row.patient_phone,
  }));
}

/**
 * Get all appointments for a doctor
 */
export async function getDoctorAppointments(
  doctorId: string,
  filters?: {
    status?: AppointmentStatus[];
    fromDate?: string;
    toDate?: string;
    limit?: number;
  }
): Promise<AppointmentWithDetails[]> {
  let queryText = `
    SELECT
      a.*,
      d.name as doctor_name,
      dp.specialization as doctor_specialization,
      p.name as patient_name,
      p.email as patient_email,
      p.phone as patient_phone
    FROM appointments a
    INNER JOIN users d ON a.doctor_id = d.id
    LEFT JOIN doctor_profiles dp ON d.id = dp.user_id
    INNER JOIN users p ON a.patient_id = p.id
    WHERE a.doctor_id = $1
  `;

  const params: any[] = [doctorId];
  let paramIndex = 2;

  if (filters?.status && filters.status.length > 0) {
    queryText += ` AND a.status = ANY($${paramIndex})`;
    params.push(filters.status);
    paramIndex++;
  }

  if (filters?.fromDate) {
    queryText += ` AND a.appointment_date >= $${paramIndex}`;
    params.push(filters.fromDate);
    paramIndex++;
  }

  if (filters?.toDate) {
    queryText += ` AND a.appointment_date <= $${paramIndex}`;
    params.push(filters.toDate);
    paramIndex++;
  }

  queryText += ` ORDER BY a.appointment_date ASC, a.appointment_time ASC`;

  if (filters?.limit) {
    queryText += ` LIMIT $${paramIndex}`;
    params.push(filters.limit);
  }

  const result = await query(queryText, params);

  return result.rows.map((row) => ({
    ...mapAppointmentFromDb(row),
    doctorName: row.doctor_name,
    doctorSpecialization: row.doctor_specialization,
    patientName: row.patient_name,
    patientEmail: row.patient_email,
    patientPhone: row.patient_phone,
  }));
}

/**
 * Update appointment
 */
export async function updateAppointment(
  appointmentId: string,
  updates: UpdateAppointmentInput
): Promise<Appointment> {
  const { status, doctorNotes, cancellationReason } = updates;

  const setClauses: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (status) {
    setClauses.push(`status = $${paramIndex}`);
    params.push(status);
    paramIndex++;
  }

  if (doctorNotes !== undefined) {
    setClauses.push(`doctor_notes = $${paramIndex}`);
    params.push(doctorNotes);
    paramIndex++;
  }

  if (cancellationReason !== undefined) {
    setClauses.push(`cancellation_reason = $${paramIndex}`);
    params.push(cancellationReason);
    paramIndex++;
  }

  setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

  params.push(appointmentId);

  const result = await query(
    `UPDATE appointments
     SET ${setClauses.join(', ')}
     WHERE id = $${paramIndex}
     RETURNING *`,
    params
  );

  if (result.rows.length === 0) {
    throw new Error('Appointment not found');
  }

  return mapAppointmentFromDb(result.rows[0]);
}

/**
 * Cancel appointment
 */
export async function cancelAppointment(
  appointmentId: string,
  cancellationReason?: string
): Promise<Appointment> {
  return updateAppointment(appointmentId, {
    status: 'cancelled',
    cancellationReason,
  });
}

/**
 * Get available time slots for a doctor on a specific date
 */
export async function getAvailableTimeSlots(
  doctorId: string,
  date: string
): Promise<string[]> {
  // Get the day of week for the date (0 = Sunday, 6 = Saturday)
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();

  // Get doctor's availability for this day
  const availabilityResult = await query(
    `SELECT start_time, end_time
     FROM availability_schedule
     WHERE doctor_id = $1 AND day_of_week = $2 AND is_available = true`,
    [doctorId, dayOfWeek]
  );

  if (availabilityResult.rows.length === 0) {
    return [];
  }

  // Get all booked appointments for this date
  const bookedResult = await query(
    `SELECT appointment_time
     FROM appointments
     WHERE doctor_id = $1 AND appointment_date = $2 AND status NOT IN ('cancelled')`,
    [doctorId, date]
  );

  const bookedTimes = new Set(bookedResult.rows.map((row) => row.appointment_time));

  // Generate time slots based on availability
  const slots: string[] = [];
  for (const availability of availabilityResult.rows) {
    const startTime = availability.start_time;
    const endTime = availability.end_time;

    // Generate 30-minute slots
    let currentTime = startTime;
    while (currentTime < endTime) {
      if (!bookedTimes.has(currentTime)) {
        slots.push(currentTime);
      }

      // Add 30 minutes
      const [hours, minutes] = currentTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + 30;
      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = totalMinutes % 60;
      currentTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:00`;
    }
  }

  return slots.sort();
}

/**
 * Helper function to map database row to Appointment
 */
function mapAppointmentFromDb(row: any): Appointment {
  return {
    id: row.id,
    doctorId: row.doctor_id,
    patientId: row.patient_id,
    appointmentDate: row.appointment_date,
    appointmentTime: row.appointment_time,
    durationMinutes: row.duration_minutes,
    status: row.status,
    patientNotes: row.patient_notes,
    doctorNotes: row.doctor_notes,
    cancellationReason: row.cancellation_reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
