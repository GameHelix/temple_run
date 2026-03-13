-- Randevu - Doctor Appointment System
-- Database Schema

-- Create randevu schema
CREATE SCHEMA IF NOT EXISTS randevu;

-- Set search path
SET search_path TO randevu, public;

-- 1. Users table (patients, doctors, admins)
CREATE TABLE IF NOT EXISTS randevu.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'patient' NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_role CHECK (role IN ('patient', 'doctor', 'admin'))
);

-- 2. Doctor profiles
CREATE TABLE IF NOT EXISTS randevu.doctor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES randevu.users(id) ON DELETE CASCADE,
  specialization VARCHAR(255) NOT NULL,
  license_number VARCHAR(100),
  bio TEXT,
  education TEXT,
  experience_years INTEGER,
  consultation_fee DECIMAL(10, 2),
  clinic_name VARCHAR(255),
  clinic_address TEXT,
  city VARCHAR(100),
  is_verified BOOLEAN DEFAULT false,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Doctor availability (recurring weekly schedule)
CREATE TABLE IF NOT EXISTS randevu.availability_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES randevu.users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_day_of_week CHECK (day_of_week >= 0 AND day_of_week <= 6),
  CONSTRAINT check_time_order CHECK (start_time < end_time)
);

-- 4. Appointments
CREATE TABLE IF NOT EXISTS randevu.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES randevu.users(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES randevu.users(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status VARCHAR(50) DEFAULT 'pending' NOT NULL,
  patient_notes TEXT,
  doctor_notes TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  CONSTRAINT check_different_users CHECK (doctor_id != patient_id)
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_user_id ON randevu.doctor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_specialization ON randevu.doctor_profiles(specialization);
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_city ON randevu.doctor_profiles(city);
CREATE INDEX IF NOT EXISTS idx_doctor_profiles_verified ON randevu.doctor_profiles(is_verified);

CREATE INDEX IF NOT EXISTS idx_availability_doctor_id ON randevu.availability_schedule(doctor_id);
CREATE INDEX IF NOT EXISTS idx_availability_day ON randevu.availability_schedule(day_of_week);

CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON randevu.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON randevu.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON randevu.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON randevu.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON randevu.appointments(doctor_id, appointment_date);

-- 6. Default admin account
-- IMPORTANT: Change this password immediately after first login!
-- Use the Admin panel or API to update it.
-- The hash below corresponds to a placeholder password — see docs/DATABASE.md for setup instructions.
INSERT INTO randevu.users (id, name, email, password, role, created_at, updated_at)
SELECT
  '11111111-1111-1111-1111-111111111111',
  'System Administrator',
  'admin@randevu.com',
  '$2a$10$XJ9Sdl4WgAwNFPD6kQ5QSu8h4mZxF1KNMrjuv.MAIm80TA5wrR7U6',
  'admin',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM randevu.users WHERE email = 'admin@randevu.com'
)
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- 7. Sample doctor data (OPTIONAL — comment out for a clean production deployment)
-- These accounts use the same default password as the admin. Change them before going live.
/*
INSERT INTO randevu.users (id, name, email, password, role, phone) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Dr. Sarah Johnson', 'sarah.johnson@randevu.com', '$2a$10$XJ9Sdl4WgAwNFPD6kQ5QSu8h4mZxF1KNMrjuv.MAIm80TA5wrR7U6', 'doctor', '+1234567890'),
  ('33333333-3333-3333-3333-333333333333', 'Dr. Michael Chen', 'michael.chen@randevu.com', '$2a$10$XJ9Sdl4WgAwNFPD6kQ5QSu8h4mZxF1KNMrjuv.MAIm80TA5wrR7U6', 'doctor', '+1234567891')
ON CONFLICT (email) DO NOTHING;

INSERT INTO randevu.doctor_profiles (user_id, specialization, bio, education, experience_years, consultation_fee, clinic_name, clinic_address, city, is_verified) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Cardiology', 'Experienced cardiologist specializing in heart disease prevention and treatment.', 'MD from Harvard Medical School', 15, 150.00, 'Heart Care Clinic', '123 Medical Plaza, Suite 200', 'Boston', true),
  ('33333333-3333-3333-3333-333333333333', 'Pediatrics', 'Board-certified pediatrician dedicated to children''s health and wellness.', 'MD from Johns Hopkins University', 10, 100.00, 'Children''s Health Center', '456 Kids Avenue', 'Baltimore', true)
ON CONFLICT (user_id) DO NOTHING;
*/
