'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { user, loading, signOut, isDoctor } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This helps avoid hydration mismatch
    setIsClient(true);
  }, []);

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
                      isDoctor() 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'doctor' ? 'Healthcare Provider' : 'Patient'}
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

          <div className="mt-8 bg-gray-800/60 backdrop-blur-sm shadow overflow-hidden rounded-lg border border-gray-700">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl font-medium text-indigo-100">Healthcare Services</h2>
              <p className="mt-1 max-w-2xl text-sm text-indigo-300">
                Your healthcare assistant features
              </p>
            </div>
            <div className="border-t border-gray-700 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/40 transition cursor-pointer" 
                     onClick={() => router.push('/chat')}>
                  <h3 className="text-lg font-medium text-indigo-200">Chat with Assistant</h3>
                  <p className="mt-2 text-sm text-indigo-300">
                    Get answers to your health questions from our AI assistant
                  </p>
                </div>
                
                {isDoctor() ? (
                  <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/40 transition cursor-pointer"
                       onClick={() => router.push('/doctor/dashboard')}>
                    <h3 className="text-lg font-medium text-indigo-200">Provider Dashboard</h3>
                    <p className="mt-2 text-sm text-indigo-300">
                      Access your provider dashboard and patient information
                    </p>
                  </div>
                ) : (
                  <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-700/40 transition cursor-pointer">
                    <h3 className="text-lg font-medium text-indigo-200">Health Records</h3>
                    <p className="mt-2 text-sm text-indigo-300">
                      View and manage your health information (Coming soon)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}