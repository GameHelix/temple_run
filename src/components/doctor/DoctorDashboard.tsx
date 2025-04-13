// src/components/doctor/DoctorDashboard.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DoctorDashboard() {
  const { user, loading, isDoctor } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This helps avoid hydration mismatch
    setIsClient(true);
  }, []);

  // After component mounts, check if user is a doctor
  useEffect(() => {
    if (!loading && isClient) {
      if (!user) {
        router.push('/auth/signin?redirectTo=/doctor/dashboard');
      } else if (!isDoctor()) {
        // Redirect non-doctors to home page
        router.push('/');
      }
    }
  }, [loading, user, isClient, isDoctor, router]);

  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex justify-center items-center">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
          <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
          <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not a doctor (will redirect)
  if (!user || !isDoctor()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800/60 backdrop-blur-sm shadow overflow-hidden rounded-lg border border-gray-700 mb-8">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-indigo-100">Healthcare Provider Dashboard</h2>
              <p className="mt-1 max-w-2xl text-sm text-indigo-300">
                Manage your patients and healthcare services
              </p>
            </div>
            <div className="rounded-full bg-green-100 px-3 py-1">
              <span className="text-sm font-medium text-green-800">Doctor</span>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Statistics Card */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-indigo-200 mb-4">Patient Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/60 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-indigo-100">0</p>
                <p className="text-sm text-indigo-300 mt-1">Total Patients</p>
              </div>
              <div className="bg-gray-900/60 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-indigo-100">0</p>
                <p className="text-sm text-indigo-300 mt-1">New Today</p>
              </div>
              <div className="bg-gray-900/60 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-indigo-100">0</p>
                <p className="text-sm text-indigo-300 mt-1">Active Chats</p>
              </div>
              <div className="bg-gray-900/60 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-indigo-100">0</p>
                <p className="text-sm text-indigo-300 mt-1">Pending</p>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-indigo-200 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition">
                New Patient
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition">
                Schedule Appointment
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition">
                Send Health Reminder
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition">
                Generate Report
              </button>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-indigo-200 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <p className="text-center text-indigo-300 py-8">
                No recent activity to display
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mt-8 bg-gray-800/60 backdrop-blur-sm shadow overflow-hidden rounded-lg border border-gray-700">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-medium text-indigo-100">Coming Soon</h2>
            <p className="mt-1 max-w-2xl text-sm text-indigo-300">
              New features being developed for healthcare providers
            </p>
          </div>
          <div className="border-t border-gray-700 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-700/40">
                <h3 className="text-md font-medium text-indigo-200">Patient Health Records</h3>
                <p className="mt-2 text-sm text-indigo-300">
                  Securely access and manage patient health records
                </p>
              </div>
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-700/40">
                <h3 className="text-md font-medium text-indigo-200">Telehealth Consultations</h3>
                <p className="mt-2 text-sm text-indigo-300">
                  Schedule and conduct virtual consultations with patients
                </p>
              </div>
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-700/40">
                <h3 className="text-md font-medium text-indigo-200">AI-Assisted Diagnostics</h3>
                <p className="mt-2 text-sm text-indigo-300">
                  Get AI-powered insights to support your diagnoses
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}