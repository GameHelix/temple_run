// src/app/appointments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AppointmentWithDetails } from '@/types/user';
import { Calendar, Clock, User, Stethoscope, MapPin, FileText, X } from 'lucide-react';

export default function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'patient') return;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const params = new URLSearchParams();

        if (filter === 'upcoming') {
          params.append('status', 'pending,confirmed');
          params.append('fromDate', today);
        } else if (filter === 'past') {
          params.append('status', 'completed,cancelled,no_show');
        }

        const response = await fetch(`/api/appointments?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setAppointments(data.appointments);
        } else {
          setError(data.message || 'Failed to fetch appointments');
        }
      } catch (err) {
        setError('Failed to load appointments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, filter]);

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!cancelReason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancellationReason: cancelReason }),
      });

      const data = await response.json();

      if (data.success) {
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
          )
        );
        setCancellingId(null);
        setCancelReason('');
      } else {
        alert(data.message || 'Failed to cancel appointment');
      }
    } catch (err) {
      alert('Failed to cancel appointment');
      console.error(err);
    }
  };

  if (authLoading || (user && user.role !== 'patient' && !loading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">View and manage your appointments</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Past
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-6">Book your first appointment with a doctor</p>
            <button
              onClick={() => router.push('/doctors')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Browse Doctors
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Dr. {appointment.doctorName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center text-blue-600 mb-4">
                      <Stethoscope className="h-4 w-4 mr-2" />
                      <span className="text-sm">{appointment.doctorSpecialization}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(appointment.appointmentDate)}
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {formatTime(appointment.appointmentTime)} ({appointment.durationMinutes}{' '}
                        min)
                      </div>
                    </div>

                    {appointment.patientNotes && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start text-sm">
                          <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700 mb-1">Your Notes:</p>
                            <p className="text-gray-600">{appointment.patientNotes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {appointment.doctorNotes && (
                      <div className="mt-4 bg-blue-50 rounded-lg p-3">
                        <div className="flex items-start text-sm">
                          <FileText className="h-4 w-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-blue-700 mb-1">Doctor's Notes:</p>
                            <p className="text-blue-600">{appointment.doctorNotes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {appointment.cancellationReason && (
                      <div className="mt-4 bg-red-50 rounded-lg p-3">
                        <div className="flex items-start text-sm">
                          <X className="h-4 w-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-red-700 mb-1">Cancellation Reason:</p>
                            <p className="text-red-600">{appointment.cancellationReason}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                  <div className="mt-4 pt-4 border-t">
                    {cancellingId === appointment.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          placeholder="Please provide a reason for cancellation..."
                          rows={2}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
                          >
                            Confirm Cancellation
                          </button>
                          <button
                            onClick={() => {
                              setCancellingId(null);
                              setCancelReason('');
                            }}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCancellingId(appointment.id)}
                        className="text-red-600 text-sm hover:text-red-700 font-medium"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
