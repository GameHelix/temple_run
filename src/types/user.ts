// src/types/user.ts

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'doctor' | 'patient';
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'doctor' | 'patient' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Doctor Profile interfaces
export interface DoctorProfile {
  id: string;
  userId: string;
  specialization: string;
  licenseNumber?: string;
  bio?: string;
  education?: string;
  experienceYears?: number;
  consultationFee?: number;
  clinicName?: string;
  clinicAddress?: string;
  city?: string;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorProfileInput {
  specialization: string;
  licenseNumber?: string;
  bio?: string;
  education?: string;
  experienceYears?: number;
  consultationFee?: number;
  clinicName?: string;
  clinicAddress?: string;
  city?: string;
}

export interface DoctorWithProfile extends User {
  profile?: DoctorProfile;
}

// Appointment interfaces
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  appointmentDate: string; // ISO date string (YYYY-MM-DD)
  appointmentTime: string; // Time string (HH:MM:SS)
  durationMinutes: number;
  status: AppointmentStatus;
  patientNotes?: string;
  doctorNotes?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentWithDetails extends Appointment {
  doctorName: string;
  doctorSpecialization: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
}

export interface CreateAppointmentInput {
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  patientNotes?: string;
}

export interface UpdateAppointmentInput {
  status?: AppointmentStatus;
  doctorNotes?: string;
  cancellationReason?: string;
}

// Availability Schedule interfaces
export interface AvailabilitySchedule {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: string; // Time string (HH:MM:SS)
  endTime: string; // Time string (HH:MM:SS)
  isAvailable: boolean;
  createdAt: Date;
}

export interface AvailabilityScheduleInput {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DayAvailability {
  date: string;
  slots: TimeSlot[];
}
