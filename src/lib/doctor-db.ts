// src/lib/doctor-db.ts
import { query } from './db';
import { DoctorProfile, DoctorProfileInput, DoctorWithProfile } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create or update a doctor profile
 */
export async function upsertDoctorProfile(
  userId: string,
  profileData: DoctorProfileInput
): Promise<DoctorProfile> {
  const {
    specialization,
    licenseNumber,
    bio,
    education,
    experienceYears,
    consultationFee,
    clinicName,
    clinicAddress,
    city,
  } = profileData;

  const result = await query(
    `INSERT INTO randevu.doctor_profiles (
      id, user_id, specialization, license_number, bio, education,
      experience_years, consultation_fee, clinic_name, clinic_address, city
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT (user_id)
    DO UPDATE SET
      specialization = EXCLUDED.specialization,
      license_number = EXCLUDED.license_number,
      bio = EXCLUDED.bio,
      education = EXCLUDED.education,
      experience_years = EXCLUDED.experience_years,
      consultation_fee = EXCLUDED.consultation_fee,
      clinic_name = EXCLUDED.clinic_name,
      clinic_address = EXCLUDED.clinic_address,
      city = EXCLUDED.city,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *`,
    [
      uuidv4(),
      userId,
      specialization,
      licenseNumber,
      bio,
      education,
      experienceYears,
      consultationFee,
      clinicName,
      clinicAddress,
      city,
    ]
  );

  return mapDoctorProfileFromDb(result.rows[0]);
}

/**
 * Get doctor profile by user ID
 */
export async function getDoctorProfileByUserId(userId: string): Promise<DoctorProfile | null> {
  const result = await query('SELECT * FROM randevu.doctor_profiles WHERE user_id = $1', [userId]);

  if (result.rows.length === 0) {
    return null;
  }

  return mapDoctorProfileFromDb(result.rows[0]);
}

/**
 * Get all verified doctors with their profiles
 */
export async function getVerifiedDoctors(filters?: {
  specialization?: string;
  city?: string;
  limit?: number;
  offset?: number;
}): Promise<DoctorWithProfile[]> {
  let queryText = `
    SELECT
      u.id, u.name, u.email, u.phone, u.role, u.created_at, u.updated_at,
      dp.*
    FROM randevu.users u
    INNER JOIN randevu.doctor_profiles dp ON u.id = dp.user_id
    WHERE u.role = 'doctor' AND dp.is_verified = true
  `;

  const params: any[] = [];
  let paramIndex = 1;

  if (filters?.specialization) {
    queryText += ` AND dp.specialization ILIKE $${paramIndex}`;
    params.push(`%${filters.specialization}%`);
    paramIndex++;
  }

  if (filters?.city) {
    queryText += ` AND dp.city ILIKE $${paramIndex}`;
    params.push(`%${filters.city}%`);
    paramIndex++;
  }

  queryText += ` ORDER BY dp.rating DESC, dp.total_reviews DESC`;

  if (filters?.limit) {
    queryText += ` LIMIT $${paramIndex}`;
    params.push(filters.limit);
    paramIndex++;
  }

  if (filters?.offset) {
    queryText += ` OFFSET $${paramIndex}`;
    params.push(filters.offset);
  }

  const result = await query(queryText, params);

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    profile: {
      id: row.id,
      userId: row.user_id,
      specialization: row.specialization,
      licenseNumber: row.license_number,
      bio: row.bio,
      education: row.education,
      experienceYears: row.experience_years,
      consultationFee: parseFloat(row.consultation_fee),
      clinicName: row.clinic_name,
      clinicAddress: row.clinic_address,
      city: row.city,
      isVerified: row.is_verified,
      rating: parseFloat(row.rating),
      totalReviews: row.total_reviews,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
  }));
}

/**
 * Get doctor with profile by user ID
 */
export async function getDoctorWithProfile(userId: string): Promise<DoctorWithProfile | null> {
  const result = await query(
    `SELECT
      u.id, u.name, u.email, u.phone, u.role, u.created_at, u.updated_at,
      dp.id as profile_id, dp.user_id, dp.specialization, dp.license_number,
      dp.bio, dp.education, dp.experience_years, dp.consultation_fee,
      dp.clinic_name, dp.clinic_address, dp.city, dp.is_verified,
      dp.rating, dp.total_reviews, dp.created_at as profile_created_at,
      dp.updated_at as profile_updated_at
    FROM randevu.users u
    LEFT JOIN randevu.doctor_profiles dp ON u.id = dp.user_id
    WHERE u.id = $1 AND u.role = 'doctor'`,
    [userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  const doctor: DoctorWithProfile = {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (row.profile_id) {
    doctor.profile = {
      id: row.profile_id,
      userId: row.user_id,
      specialization: row.specialization,
      licenseNumber: row.license_number,
      bio: row.bio,
      education: row.education,
      experienceYears: row.experience_years,
      consultationFee: row.consultation_fee ? parseFloat(row.consultation_fee) : undefined,
      clinicName: row.clinic_name,
      clinicAddress: row.clinic_address,
      city: row.city,
      isVerified: row.is_verified,
      rating: parseFloat(row.rating),
      totalReviews: row.total_reviews,
      createdAt: row.profile_created_at,
      updatedAt: row.profile_updated_at,
    };
  }

  return doctor;
}

/**
 * Verify a doctor (admin only)
 */
export async function verifyDoctor(userId: string): Promise<void> {
  await query(
    'UPDATE randevu.doctor_profiles SET is_verified = true, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1',
    [userId]
  );
}

/**
 * Unverify a doctor (admin only)
 */
export async function unverifyDoctor(userId: string): Promise<void> {
  await query(
    'UPDATE randevu.doctor_profiles SET is_verified = false, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1',
    [userId]
  );
}

/**
 * Get all specializations
 */
export async function getAllSpecializations(): Promise<string[]> {
  const result = await query(
    'SELECT DISTINCT specialization FROM randevu.doctor_profiles WHERE is_verified = true ORDER BY specialization'
  );

  return result.rows.map((row) => row.specialization);
}

/**
 * Get all cities where doctors are available
 */
export async function getAllCities(): Promise<string[]> {
  const result = await query(
    'SELECT DISTINCT city FROM randevu.doctor_profiles WHERE is_verified = true AND city IS NOT NULL ORDER BY city'
  );

  return result.rows.map((row) => row.city);
}

/**
 * Helper function to map database row to DoctorProfile
 */
function mapDoctorProfileFromDb(row: any): DoctorProfile {
  return {
    id: row.id,
    userId: row.user_id,
    specialization: row.specialization,
    licenseNumber: row.license_number,
    bio: row.bio,
    education: row.education,
    experienceYears: row.experience_years,
    consultationFee: row.consultation_fee ? parseFloat(row.consultation_fee) : undefined,
    clinicName: row.clinic_name,
    clinicAddress: row.clinic_address,
    city: row.city,
    isVerified: row.is_verified,
    rating: parseFloat(row.rating),
    totalReviews: row.total_reviews,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
