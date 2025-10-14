// src/app/doctor/schedule/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AvailabilitySchedule } from '@/types/user';
import { Clock, Plus, Trash2, Save } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface TimeSlot {
  startTime: string;
  endTime: string;
}

export default function DoctorSchedulePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [schedule, setSchedule] = useState<AvailabilitySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // Editing state - organized by day
  const [daySchedules, setDaySchedules] = useState<Record<number, TimeSlot[]>>({});
  const [editingDay, setEditingDay] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'doctor')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'doctor') return;

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/availability?doctorId=${user.id}`);
        const data = await response.json();

        if (data.success) {
          setSchedule(data.schedule || []);

          // Organize schedule by day
          const organized: Record<number, TimeSlot[]> = {};
          data.schedule.forEach((slot: AvailabilitySchedule) => {
            if (!organized[slot.dayOfWeek]) {
              organized[slot.dayOfWeek] = [];
            }
            organized[slot.dayOfWeek].push({
              startTime: slot.startTime.substring(0, 5),
              endTime: slot.endTime.substring(0, 5),
            });
          });
          setDaySchedules(organized);
        } else {
          setError(data.message || 'Failed to fetch schedule');
        }
      } catch (err) {
        setError('Failed to load schedule');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user]);

  const handleAddSlot = (dayOfWeek: number) => {
    setDaySchedules((prev) => ({
      ...prev,
      [dayOfWeek]: [
        ...(prev[dayOfWeek] || []),
        { startTime: '09:00', endTime: '17:00' },
      ],
    }));
    setEditingDay(dayOfWeek);
  };

  const handleRemoveSlot = (dayOfWeek: number, index: number) => {
    setDaySchedules((prev) => ({
      ...prev,
      [dayOfWeek]: prev[dayOfWeek].filter((_, i) => i !== index),
    }));
  };

  const handleUpdateSlot = (
    dayOfWeek: number,
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setDaySchedules((prev) => ({
      ...prev,
      [dayOfWeek]: prev[dayOfWeek].map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const handleSaveDay = async (dayOfWeek: number) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const timeSlots = daySchedules[dayOfWeek] || [];

      // Validate times
      for (const slot of timeSlots) {
        if (slot.startTime >= slot.endTime) {
          setError('Start time must be before end time');
          setSaving(false);
          return;
        }
      }

      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek,
          timeSlots: timeSlots.map((slot) => ({
            startTime: `${slot.startTime}:00`,
            endTime: `${slot.endTime}:00`,
          })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Schedule saved for ${DAYS[dayOfWeek]}`);
        setEditingDay(null);
        setTimeout(() => setSuccess(''), 3000);

        // Refresh schedule
        const refreshResponse = await fetch(`/api/availability?doctorId=${user?.id}`);
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setSchedule(refreshData.schedule || []);
        }
      } else {
        setError(data.message || 'Failed to save schedule');
      }
    } catch (err) {
      setError('Failed to save schedule');
      console.error(err);
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability Schedule</h1>
          <p className="text-gray-600">Set your weekly availability for appointments</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading schedule...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {DAYS.map((day, dayIndex) => {
              const daySlots = daySchedules[dayIndex] || [];
              const isEditing = editingDay === dayIndex;

              return (
                <div key={dayIndex} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{day}</h3>
                    {!isEditing && (
                      <button
                        onClick={() => {
                          setEditingDay(dayIndex);
                          if (daySlots.length === 0) {
                            handleAddSlot(dayIndex);
                          }
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {daySlots.length === 0 ? 'Add Hours' : 'Edit'}
                      </button>
                    )}
                  </div>

                  {daySlots.length === 0 && !isEditing ? (
                    <p className="text-gray-500 text-sm">No availability set</p>
                  ) : (
                    <div className="space-y-3">
                      {daySlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />

                          {isEditing ? (
                            <>
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) =>
                                  handleUpdateSlot(dayIndex, slotIndex, 'startTime', e.target.value)
                                }
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <span className="text-gray-500">to</span>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) =>
                                  handleUpdateSlot(dayIndex, slotIndex, 'endTime', e.target.value)
                                }
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                onClick={() => handleRemoveSlot(dayIndex, slotIndex)}
                                className="text-red-600 hover:text-red-700 p-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-700">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          )}
                        </div>
                      ))}

                      {isEditing && (
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleAddSlot(dayIndex)}
                            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Time Slot
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {isEditing && (
                    <div className="flex gap-2 mt-6 pt-4 border-t">
                      <button
                        onClick={() => handleSaveDay(dayIndex)}
                        disabled={saving}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingDay(null);
                          // Restore original schedule
                          const organized: Record<number, TimeSlot[]> = {};
                          schedule.forEach((slot) => {
                            if (!organized[slot.dayOfWeek]) {
                              organized[slot.dayOfWeek] = [];
                            }
                            organized[slot.dayOfWeek].push({
                              startTime: slot.startTime.substring(0, 5),
                              endTime: slot.endTime.substring(0, 5),
                            });
                          });
                          setDaySchedules(organized);
                        }}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">How it works</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Set your available hours for each day of the week</li>
            <li>Patients will see 30-minute time slots within your availability</li>
            <li>Already booked slots won't be shown to patients</li>
            <li>You can add multiple time slots per day</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
