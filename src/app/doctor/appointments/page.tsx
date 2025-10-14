// src/app/doctor/appointments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AppointmentWithDetails, AppointmentStatus } from '@/types/user';
import { Calendar, Clock, User, Phone, Mail, FileText, Check, X, AlertCircle } from 'lucide-react';

export default function DoctorAppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('today');

  // Update states
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'doctor')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'doctor') return;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const params = new URLSearchParams();

        if (filter === 'today') {
          params.append('fromDate', today);
          params.append('toDate', today);
          params.append('status', 'pending,confirmed');
        } else if (filter === 'upcoming') {
          params.append('fromDate', today);
          params.append('status', 'pending,confirmed');
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

  const handleUpdateStatus = async (appointmentId: string, status: AppointmentStatus, notes?: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          doctorNotes: notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId
              ? { ...apt, status, doctorNotes: notes || apt.doctorNotes }
              : apt
          )
        );
        setUpdatingId(null);
        setDoctorNotes('');
      } else {
        alert(data.message || 'Failed to update appointment');
      }
    } catch (err) {
      alert('Failed to update appointment');
      console.error(err);
    }
  };

  if (authLoading || !user) {
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
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your patient appointments</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('today')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'today'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
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
            <p className="text-gray-600">No appointments scheduled for this period</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {appointment.patientName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {appointment.patientEmail && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {appointment.patientEmail}
                            </div>
                          )}
                          {appointment.patientPhone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {appointment.patientPhone}
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mt-4">
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
                      <div className="mt-4 bg-blue-50 rounded-lg p-3">
                        <div className="flex items-start text-sm">
                          <FileText className="h-4 w-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-blue-700 mb-1">Patient Notes:</p>
                            <p className="text-blue-600">{appointment.patientNotes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {appointment.doctorNotes && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start text-sm">
                          <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700 mb-1">Your Notes:</p>
                            <p className="text-gray-600">{appointment.doctorNotes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                  <div className="mt-6 pt-4 border-t">
                    {updatingId === appointment.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={doctorNotes}
                          onChange={(e) => setDoctorNotes(e.target.value)}
                          placeholder="Add consultation notes (optional)..."
                          rows={3}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex flex-wrap gap-2">
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(appointment.id, 'confirmed', doctorNotes)
                              }
                              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Confirm
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleUpdateStatus(appointment.id, 'completed', doctorNotes)
                            }
                            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark Complete
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(appointment.id, 'no_show', doctorNotes)
                            }
                            className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
                          >
                            <AlertCircle className="h-4 w-4 mr-1" />
                            No Show
                          </button>
                          <button
                            onClick={() => {
                              setUpdatingId(null);
                              setDoctorNotes('');
                            }}
                            className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {appointment.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Confirm
                          </button>
                        )}
                        <button
                          onClick={() => setUpdatingId(appointment.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                        >
                          Update & Add Notes
                        </button>
                      </div>
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
