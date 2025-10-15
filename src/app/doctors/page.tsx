// src/app/doctors/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DoctorWithProfile } from '@/types/user';
import { Star, MapPin, DollarSign, GraduationCap, Stethoscope } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/StructuredData';
import { DoctorCardSkeletonGrid, PageHeaderSkeleton, FiltersSkeleton } from '@/components/LoadingSkeleton';

export default function DoctorsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const [doctors, setDoctors] = useState<DoctorWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Fetch filter options
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [specsRes, citiesRes] = await Promise.all([
          fetch('/api/doctors?list=specializations'),
          fetch('/api/doctors?list=cities'),
        ]);

        if (specsRes.ok) {
          const specsData = await specsRes.json();
          setSpecializations(specsData.specializations || []);
        }

        if (citiesRes.ok) {
          const citiesData = await citiesRes.json();
          setCities(citiesData.cities || []);
        }
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };

    fetchFilters();
  }, []);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedSpecialization) params.append('specialization', selectedSpecialization);
        if (selectedCity) params.append('city', selectedCity);

        const response = await fetch(`/api/doctors?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setDoctors(data.doctors);
        } else {
          setError(data.message || 'Failed to fetch doctors');
        }
      } catch (err) {
        setError('Failed to load doctors');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedSpecialization, selectedCity]);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Find Doctors', url: `${baseUrl}/doctors` },
        ]}
      />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {loading && specializations.length === 0 ? (
          <PageHeaderSkeleton />
        ) : (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Doctor</h1>
            <p className="text-xl text-gray-600">
              Browse verified doctors and book appointments instantly
            </p>
          </div>
        )}

        {/* Filters */}
        {loading && specializations.length === 0 ? (
          <FiltersSkeleton />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <select
                id="specialization"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <DoctorCardSkeletonGrid count={6} />
        ) : doctors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Stethoscope className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

function DoctorCard({ doctor }: { doctor: DoctorWithProfile }) {
  const profile = doctor.profile;

  return (
    <Link
      href={`/doctors/${doctor.id}`}
      className="group block h-full animate-fade-in-up"
      aria-label={`View profile of ${doctor.name}, ${profile?.specialization}`}
    >
      <article className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 h-full cursor-pointer border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
        {/* Doctor Info */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {doctor.name}
          </h3>
          <div className="flex items-center text-blue-600 mb-3">
            <Stethoscope className="h-4 w-4 mr-2" aria-hidden="true" />
            <span className="text-sm font-medium">{profile?.specialization}</span>
          </div>

          {/* Rating */}
          {profile && profile.totalReviews > 0 && (
            <div className="flex items-center mb-2" aria-label={`Rating: ${profile.rating.toFixed(1)} out of 5 stars based on ${profile.totalReviews} reviews`}>
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" aria-hidden="true" />
              <span className="text-sm font-semibold text-gray-900">{profile.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500 ml-1">
                ({profile.totalReviews} {profile.totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>

        {/* Bio */}
        {profile?.bio && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{profile.bio}</p>
        )}

        {/* Details */}
        <div className="space-y-2.5 border-t border-gray-100 pt-4">
          {profile?.education && (
            <div className="flex items-start text-sm">
              <GraduationCap className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span className="text-gray-600 line-clamp-1" title={profile.education}>{profile.education}</span>
            </div>
          )}

          {profile?.city && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" aria-hidden="true" />
              <span className="text-gray-600">{profile.city}</span>
            </div>
          )}

          {profile?.consultationFee && (
            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" aria-hidden="true" />
              <span className="text-gray-600">
                ${profile.consultationFee} consultation fee
              </span>
            </div>
          )}

          {profile?.experienceYears && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{profile.experienceYears} {profile.experienceYears === 1 ? 'year' : 'years'} of experience</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-6">
          <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2.5 rounded-lg group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-300 font-medium shadow-sm group-hover:shadow-md">
            View Profile & Book
          </div>
        </div>
      </article>
    </Link>
  );
}
