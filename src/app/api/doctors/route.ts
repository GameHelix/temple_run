// src/app/api/doctors/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getVerifiedDoctors, getAllSpecializations, getAllCities } from '@/lib/doctor-db';

/**
 * GET /api/doctors - Get all verified doctors with optional filters
 * Query params:
 * - specialization: filter by specialization
 * - city: filter by city
 * - limit: number of results to return
 * - offset: pagination offset
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const specialization = searchParams.get('specialization') || undefined;
    const city = searchParams.get('city') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    // If requesting specializations list
    if (searchParams.get('list') === 'specializations') {
      const specializations = await getAllSpecializations();
      return NextResponse.json({ success: true, specializations });
    }

    // If requesting cities list
    if (searchParams.get('list') === 'cities') {
      const cities = await getAllCities();
      return NextResponse.json({ success: true, cities });
    }

    // Get doctors with filters
    const doctors = await getVerifiedDoctors({
      specialization,
      city,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      doctors,
      count: doctors.length,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
