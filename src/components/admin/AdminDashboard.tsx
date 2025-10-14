'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { User } from '@/types/user';
import {
  UserCheck,
  Settings,
  Users,
  Grid,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [doctors, setDoctors] = useState<User[]>([]);

  // Check if user is admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Fetch doctors for verification
  useEffect(() => {
    const fetchDoctors = async () => {
      if (user?.role === 'admin') {
        try {
          const response = await axios.get('/api/admin/doctors');
          if (response.data.success) {
            setDoctors(response.data.doctors || []);
          }
        } catch (error) {
          console.error('Error fetching doctors:', error);
        }
      }
    };

    fetchDoctors();
  }, [user]);

  if (loading) {
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

  // Don't render the dashboard for non-admins
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800/60 backdrop-blur-sm shadow overflow-hidden rounded-lg border border-gray-700 mb-8">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-indigo-100">Admin Dashboard</h2>
              <p className="mt-1 max-w-2xl text-sm text-indigo-300">
                Manage Randevu appointment system
              </p>
            </div>
            <div className="rounded-full bg-purple-100 px-3 py-1">
              <span className="text-sm font-medium text-purple-800">Administrator</span>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Doctor Verification Card */}
          <Link href="/admin/doctors" className="bg-gray-800/60 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-700 hover:bg-gray-700/60 transition-colors">
            <div className="flex flex-col items-center text-center">
              <UserCheck className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-lg font-medium text-indigo-100 mb-2">Doctor Verification</h3>
              <p className="text-sm text-indigo-300">
                Verify healthcare provider accounts
              </p>
              {doctors.length > 0 && (
                <span className="mt-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {doctors.length} pending
                </span>
              )}
            </div>
          </Link>

          {/* User Management Card */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <Users className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-lg font-medium text-indigo-100 mb-2">User Management</h3>
              <p className="text-sm text-indigo-300">
                Manage user accounts and permissions
              </p>
              <span className="mt-4 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Coming Soon</span>
            </div>
          </div>

          {/* System Settings Card */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <Settings className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-lg font-medium text-indigo-100 mb-2">System Settings</h3>
              <p className="text-sm text-indigo-300">
                Configure application settings and preferences
              </p>
              <span className="mt-4 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Coming Soon</span>
            </div>
          </div>

          {/* Analytics Card */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <Grid className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-lg font-medium text-indigo-100 mb-2">Analytics</h3>
              <p className="text-sm text-indigo-300">
                View usage statistics and performance metrics
              </p>
              <span className="mt-4 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Coming Soon</span>
            </div>
          </div>

          {/* System Alerts Card */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-lg font-medium text-indigo-100 mb-2">System Alerts</h3>
              <p className="text-sm text-indigo-300">
                Monitor system health and security alerts
              </p>
              <span className="mt-4 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800/60 backdrop-blur-sm shadow overflow-hidden rounded-lg border border-gray-700">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-medium text-indigo-100">Quick Actions</h2>
          </div>
          <div className="border-t border-gray-700 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/doctors"
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-center transition"
              >
                Verify Doctor Accounts
              </Link>
              <button
                onClick={() => router.push('/doctors')}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center transition"
              >
                Browse All Doctors
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}