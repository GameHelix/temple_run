// src/app/doctors/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DoctorWithProfile } from '@/types/user';
import {
  Star,
  MapPin,
  DollarSign,
  GraduationCap,
  Briefcase,
  Building,
  Calendar,
  Clock,
} from 'lucide-react';
import { DoctorSchema, BreadcrumbSchema } from '@/components/StructuredData';

export default function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const [doctor, setDoctor] = useState<DoctorWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [patientNotes, setPatientNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctors/${resolvedParams.id}`);
        const data = await response.json();

        if (data.success) {
          setDoctor(data.doctor);
        } else {
          setError(data.message || 'Doctor not found');
        }
      } catch (err) {
        setError('Failed to load doctor profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [resolvedParams.id]);

  // Fetch available slots when date is selected
  useEffect(() => {
    if (!selectedDate || !doctor) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedTime('');

      try {
        const response = await fetch(
          `/api/availability?doctorId=${doctor.id}&date=${selectedDate}`
        );
        const data = await response.json();

        if (data.success) {
          setAvailableSlots(data.timeSlots || []);
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, doctor]);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/auth/signin');
      return;
    }

    if (user.role !== 'patient') {
      setError('Only patients can book appointments');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError('Please select date and time');
      return;
    }

    setBooking(true);
    setError('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor?.id,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          patientNotes: patientNotes || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          router.push('/appointments');
        }, 2000);
      } else {
        setError(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      setError('Failed to book appointment');
      console.error(err);
    } finally {
      setBooking(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Get maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/doctors')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Doctors
          </button>
        </div>
      </div>
    );
  }

  const profile = doctor?.profile;

  return (
    <>
      {doctor && profile && (
        <>
          <DoctorSchema
            name={doctor.name}
            specialization={profile.specialization}
            bio={profile.bio || undefined}
            city={profile.city || undefined}
            education={profile.education || undefined}
            experienceYears={profile.experienceYears || undefined}
            rating={profile.totalReviews > 0 ? profile.rating : undefined}
            totalReviews={profile.totalReviews > 0 ? profile.totalReviews : undefined}
            url={`${baseUrl}/doctors/${doctor.id}`}
          />
          <BreadcrumbSchema
            items={[
              { name: 'Home', url: baseUrl },
              { name: 'Find Doctors', url: `${baseUrl}/doctors` },
              { name: doctor.name, url: `${baseUrl}/doctors/${doctor.id}` },
            ]}
          />
        </>
      )}
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Success Message */}
        {bookingSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Appointment booked successfully! Redirecting to your appointments...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Profile (Left Column) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Header */}
              <div className="border-b pb-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor?.name}</h1>
                <div className="flex items-center text-blue-600 mb-3">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  <span className="text-lg font-medium">{profile?.specialization}</span>
                </div>

                {profile && profile.totalReviews > 0 && (
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                    <span className="text-lg font-semibold text-gray-900">
                      {profile.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-500 ml-2">({profile.totalReviews} reviews)</span>
                  </div>
                )}
              </div>

              {/* About */}
              {profile?.bio && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                  <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Details</h2>

                {profile?.education && (
                  <div className="flex items-start">
                    <GraduationCap className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Education</p>
                      <p className="text-gray-600">{profile.education}</p>
                    </div>
                  </div>
                )}

                {profile?.experienceYears && (
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Experience</p>
                      <p className="text-gray-600">{profile.experienceYears} years</p>
                    </div>
                  </div>
                )}

                {profile?.clinicName && (
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Clinic</p>
                      <p className="text-gray-600">{profile.clinicName}</p>
                      {profile.clinicAddress && (
                        <p className="text-sm text-gray-500">{profile.clinicAddress}</p>
                      )}
                    </div>
                  </div>
                )}

                {profile?.city && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-gray-600">{profile.city}</p>
                    </div>
                  </div>
                )}

                {profile?.consultationFee && (
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Consultation Fee</p>
                      <p className="text-gray-600">${profile.consultationFee}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Form (Right Column) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Book Appointment</h2>

              <form onSubmit={handleBookAppointment} className="space-y-4">
                {/* Date Selection */}
                <div>
                  <label htmlFor="date" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    min={today}
                    max={maxDateStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <label htmlFor="time" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Clock className="h-4 w-4 mr-2" />
                      Select Time
                    </label>
                    {loadingSlots ? (
                      <div className="text-center py-4 text-gray-500">Loading slots...</div>
                    ) : availableSlots.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No available slots for this date
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                              selectedTime === slot
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                            }`}
                          >
                            {slot.substring(0, 5)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={patientNotes}
                    onChange={(e) => setPatientNotes(e.target.value)}
                    rows={3}
                    placeholder="Describe your symptoms or reason for visit..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={booking || !selectedDate || !selectedTime || bookingSuccess}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {booking ? 'Booking...' : bookingSuccess ? 'Booked!' : 'Book Appointment'}
                </button>

                {!user && (
                  <p className="text-sm text-gray-500 text-center">
                    You need to sign in to book an appointment
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
