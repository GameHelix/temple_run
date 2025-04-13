// src/app/doctor/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Clipboard, Activity, Calendar, Users } from 'lucide-react';

export default function DoctorIndexPage() {
  const { user, loading, isDoctor } = useAuth();
  const router = useRouter();

  // Redirect non-doctors when component mounts
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/signin?redirectTo=/doctor');
      } else if (!isDoctor()) {
        router.push('/');
      }
    }
  }, [loading, user, isDoctor, router]);

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

  // Don't render anything if user is not a doctor (will redirect)
  if (!user || !isDoctor()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800/60 backdrop-blur-sm shadow overflow-hidden rounded-lg border border-gray-700 mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-indigo-100">Healthcare Provider Portal</h2>
            <p className="mt-1 max-w-2xl text-sm text-indigo-300">
              Welcome, Dr. {user.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/doctor/dashboard" 
                className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:bg-gray-700/60 transition-colors">
            <div className="flex flex-col items-center text-center">
              <Clipboard className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-lg font-medium text-indigo-100 mb-2">Dashboard</h3>
              <p className="text-sm text-indigo-300">
                View your provider statistics and recent activity
              </p>
            </div>
          </Link>
          
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <Users className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-lg font-medium text-indigo-100 mb-2">Patients</h3>
              <p className="text-sm text-indigo-300">
                Manage patient records and communications
              </p>
              <span className="mt-4 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Coming Soon</span>
            </div>
          </div>
          
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <Calendar className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-lg font-medium text-indigo-100 mb-2">Appointments</h3>
              <p className="text-sm text-indigo-300">
                Schedule and manage patient appointments
              </p>
              <span className="mt-4 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Coming Soon</span>
            </div>
          </div>
          
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <Activity className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-lg font-medium text-indigo-100 mb-2">Analytics</h3>
              <p className="text-sm text-indigo-300">
                View detailed healthcare analytics and reports
              </p>
              <span className="mt-4 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Coming Soon</span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-800/60 backdrop-blur-sm shadow overflow-hidden rounded-lg border border-gray-700">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-medium text-indigo-100">Healthcare Provider Resources</h2>
            <p className="mt-1 max-w-2xl text-sm text-indigo-300">
              Access professional resources and tools
            </p>
          </div>
          <div className="border-t border-gray-700 px-4 py-5 sm:px-6">
            <ul className="space-y-3">
              <li className="bg-gray-900/40 p-3 rounded-lg">
                <h4 className="text-md font-medium text-indigo-200">Medical Knowledge Base</h4>
                <p className="text-sm text-indigo-300 mt-1">
                  Access the latest medical research and clinical guidelines
                </p>
              </li>
              <li className="bg-gray-900/40 p-3 rounded-lg">
                <h4 className="text-md font-medium text-indigo-200">Professional Development</h4>
                <p className="text-sm text-indigo-300 mt-1">
                  Continuing medical education and professional certifications
                </p>
              </li>
              <li className="bg-gray-900/40 p-3 rounded-lg">
                <h4 className="text-md font-medium text-indigo-200">Clinical Decision Support</h4>
                <p className="text-sm text-indigo-300 mt-1">
                  AI-powered clinical decision support tools and resources
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}