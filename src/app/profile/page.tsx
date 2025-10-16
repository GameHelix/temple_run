'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Edit } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, isDoctor } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    // This helps avoid hydration mismatch
    setIsClient(true);
  }, []);

  // Fetch doctor profile if user is a doctor
  useEffect(() => {
    if (user && user.role === 'doctor') {
      setLoadingProfile(true);
      fetch('/api/doctors/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.profile) {
            setDoctorProfile(data.profile);
          }
        })
        .catch((err) => {
          console.error('Error fetching doctor profile:', err);
        })
        .finally(() => {
          setLoadingProfile(false);
        });
    }
  }, [user]);

  if (!isClient) {
    return null; // Prevent rendering until client-side
  }

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

  if (!user) {
    // This should never happen due to middleware redirecting to sign in,
    // but it's good to have a fallback
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -inset-[10%] opacity-20">
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="b" gradientTransform="rotate(45 0.5 0.5)">
                <stop offset="0%" stopColor="#4338ca" />
                <stop offset="100%" stopColor="#5b21b6" />
              </linearGradient>
              <clipPath id="a">
                <path fill="currentColor" d="M744.5 750Q625 1000 375 750T124.5 250Q250 0 500 250T744.5 750Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#a)">
              <path fill="url(#b)" d="M744.5 750Q625 1000 375 750T124.5 250Q250 0 500 250T744.5 750Z" />
            </g>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="px-4 py-6 sm:px-0">
          {/* Doctor Profile Status Banner */}
          {user?.role === 'doctor' && !loadingProfile && (
            <div className="mb-8">
              {!doctorProfile ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <AlertCircle className="h-6 w-6 text-yellow-400 mt-0.5 mr-4 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Complete Your Doctor Profile</h3>
                        <p className="text-sm text-yellow-700 mb-4">
                          Your doctor profile is incomplete. Complete your professional information to:
                        </p>
                        <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1 mb-4">
                          <li>Appear in the doctors directory</li>
                          <li>Receive patient appointments</li>
                          <li>Manage your schedule</li>
                        </ul>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/doctor/profile-setup')}
                      className="ml-4 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <Edit className="h-4 w-4" />
                      Complete Profile
                    </button>
                  </div>
                </div>
              ) : !doctorProfile.isVerified ? (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <AlertCircle className="h-6 w-6 text-blue-400 mt-0.5 mr-4 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Profile Pending Verification</h3>
                        <p className="text-sm text-blue-700 mb-2">
                          Your doctor profile has been submitted and is under review by our admin team.
                        </p>
                        <p className="text-sm text-blue-700">
                          You'll receive a notification once your profile is verified. After verification, you'll appear in the doctors directory and can start accepting appointments.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/doctor/profile-setup')}
                      className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 mr-4 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Profile Verified</h3>
                        <p className="text-sm text-green-700">
                          Your doctor profile is verified and visible to patients. You can now accept appointments and manage your schedule.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/doctor/profile-setup')}
                      className="ml-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions - Moved to top */}
          <div className="mb-8 bg-gray-800/60 backdrop-blur-sm shadow overflow-hidden rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl font-medium text-indigo-100">Quick Actions</h2>
              <p className="mt-1 max-w-2xl text-sm text-indigo-300">
                {user.role === 'admin' ? 'Manage the Randevu platform' : 'Access your features'}
              </p>
            </div>
            <div className="border-t border-gray-700 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.role === 'admin' ? (
                  <>
                    <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/40 transition cursor-pointer"
                         onClick={() => router.push('/admin')}>
                      <h3 className="text-lg font-medium text-indigo-200">Admin Dashboard</h3>
                      <p className="mt-2 text-sm text-indigo-300">
                        Manage the Randevu system and users
                      </p>
                    </div>
                    <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/40 transition cursor-pointer"
                         onClick={() => router.push('/admin/doctors')}>
                      <h3 className="text-lg font-medium text-indigo-200">Verify Doctors</h3>
                      <p className="mt-2 text-sm text-indigo-300">
                        Review and verify doctor accounts
                      </p>
                    </div>
                    <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/40 transition cursor-pointer"
                         onClick={() => router.push('/admin/users')}>
                      <h3 className="text-lg font-medium text-indigo-200">User Management</h3>
                      <p className="mt-2 text-sm text-indigo-300">
                        View and manage all users
                      </p>
                    </div>
                    <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/40 transition cursor-pointer"
                         onClick={() => router.push('/doctors')}>
                      <h3 className="text-lg font-medium text-indigo-200">Browse Doctors</h3>
                      <p className="mt-2 text-sm text-indigo-300">
                        View all doctors on the platform
                      </p>
                    </div>
                  </>
                ) : isDoctor() ? (
                  <>
                    <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/40 transition cursor-pointer"
                         onClick={() => router.push('/doctor/onboarding')}>
                      <h3 className="text-lg font-medium text-indigo-200">Getting Started Guide</h3>
                      <p className="mt-2 text-sm text-indigo-300">
                        View your onboarding checklist and setup progress
                      </p>
                    </div>
                    <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/40 transition cursor-pointer"
                         onClick={() => router.push('/doctor/appointments')}>
                      <h3 className="text-lg font-medium text-indigo-200">Manage Appointments</h3>
                      <p className="mt-2 text-sm text-indigo-300">
                        View and manage your patient appointments
                      </p>
                    </div>
                    <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/40 transition cursor-pointer"
                         onClick={() => router.push('/doctor/schedule')}>
                      <h3 className="text-lg font-medium text-indigo-200">Set Availability</h3>
                      <p className="mt-2 text-sm text-indigo-300">
                        Configure your weekly availability schedule
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/40 transition cursor-pointer"
                         onClick={() => router.push('/doctors')}>
                      <h3 className="text-lg font-medium text-indigo-200">Find Doctors</h3>
                      <p className="mt-2 text-sm text-indigo-300">
                        Browse verified doctors and book appointments
                      </p>
                    </div>
                    <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/40 transition cursor-pointer"
                         onClick={() => router.push('/appointments')}>
                      <h3 className="text-lg font-medium text-indigo-200">My Appointments</h3>
                      <p className="mt-2 text-sm text-indigo-300">
                        View and manage your upcoming appointments
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* User Profile Info */}
          <div className="bg-gray-800/60 backdrop-blur-sm shadow overflow-hidden rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-2xl font-bold text-indigo-100">User Profile</h2>
              <p className="mt-1 max-w-2xl text-sm text-indigo-300">
                Personal details and account information
              </p>
            </div>
            <div className="border-t border-gray-700">
              <dl>
                <div className="bg-gray-800/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-indigo-300">Full name</dt>
                  <dd className="mt-1 text-sm text-indigo-100 sm:mt-0 sm:col-span-2">
                    {user.name}
                  </dd>
                </div>
                <div className="bg-gray-900/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-indigo-300">Email address</dt>
                  <dd className="mt-1 text-sm text-indigo-100 sm:mt-0 sm:col-span-2">
                    {user.email}
                  </dd>
                </div>
                <div className="bg-gray-800/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-indigo-300">Account type</dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'doctor'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Administrator' : user.role === 'doctor' ? 'Doctor' : 'Patient'}
                    </span>
                  </dd>
                </div>
                <div className="bg-gray-900/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-indigo-300">Account created</dt>
                  <dd className="mt-1 text-sm text-indigo-100 sm:mt-0 sm:col-span-2">
                    {new Date(user.createdAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}