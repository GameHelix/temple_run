// src/app/page.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Clock, Users, Shield, Search, CheckCircle } from 'lucide-react';
import { OrganizationSchema, WebsiteSchema } from '@/components/StructuredData';

export default function Home() {
  const { user } = useAuth();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <>
      <OrganizationSchema
        name="Randevu"
        url={baseUrl}
        description="Book doctor appointments online. Find verified doctors, view availability, and schedule appointments instantly."
      />
      <WebsiteSchema
        name="Randevu - Doctor Appointment Booking"
        url={baseUrl}
        description="Book doctor appointments online. Find verified doctors, view availability, and schedule appointments instantly."
      />
      <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -inset-[10%]">
            <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="b" gradientTransform="rotate(45 0.5 0.5)">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#93c5fd" />
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

        <div className="container relative mx-auto px-6 py-24 md:py-32">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="flex items-center mb-6 animate-fade-in-down">
              <Calendar className="h-16 w-16 text-blue-200" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white animate-fade-in-up text-balance">
              Book Doctor Appointments Online
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl animate-fade-in-up animate-stagger-1">
              Find verified doctors, view real-time availability, and book appointments instantly. Healthcare made simple.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-stagger-2">
              <Link
                href="/doctors"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Browse Doctors
              </Link>
              {!user && (
                <Link
                  href="/auth/signup"
                  className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-400 transition-colors border-2 border-white"
                >
                  Sign Up Free
                </Link>
              )}
              {user && user.role === 'patient' && (
                <Link
                  href="/appointments"
                  className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-400 transition-colors border-2 border-white"
                >
                  My Appointments
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            How Randevu Works
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Book appointments with verified doctors in three simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center animate-fade-in-up animate-stagger-1">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110 duration-300">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Find a Doctor</h3>
              <p className="text-gray-600">
                Search for verified doctors by specialization, location, and availability
              </p>
            </div>

            <div className="text-center animate-fade-in-up animate-stagger-2">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110 duration-300">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Pick a Time</h3>
              <p className="text-gray-600">
                View real-time availability and choose a convenient time slot
              </p>
            </div>

            <div className="text-center animate-fade-in-up animate-stagger-3">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110 duration-300">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Confirm Booking</h3>
              <p className="text-gray-600">
                Receive instant confirmation and manage your appointment online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Why Choose Randevu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up animate-stagger-1">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Doctors</h3>
              <p className="text-gray-600 text-sm">
                All doctors are verified by our admin team before appearing in search
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up animate-stagger-2">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Availability</h3>
              <p className="text-gray-600 text-sm">
                See available time slots instantly and book without phone calls
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up animate-stagger-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Management</h3>
              <p className="text-gray-600 text-sm">
                View, reschedule, or cancel appointments from your dashboard
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up animate-stagger-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Specializations</h3>
              <p className="text-gray-600 text-sm">
                Find specialists across all medical fields in one platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {user && user.role === 'patient'
              ? 'Browse our network of verified doctors and book your appointment today'
              : user && user.role === 'doctor'
              ? 'Manage your appointments and availability from your dashboard'
              : 'Join thousands of patients finding healthcare providers online'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link
                  href="/auth/signup"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Sign Up as Patient
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-400 transition-colors border-2 border-white"
                >
                  Join as Doctor
                </Link>
              </>
            ) : user.role === 'patient' ? (
              <Link
                href="/doctors"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Find a Doctor
              </Link>
            ) : (
              <Link
                href="/doctor/appointments"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                View Appointments
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-lg font-semibold text-white">Randevu</span>
              </div>
              <p className="text-sm">
                Making healthcare accessible through easy online appointment booking.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/doctors" className="hover:text-blue-400 transition-colors">Find Doctors</Link></li>
                <li><Link href="/auth/signin" className="hover:text-blue-400 transition-colors">Sign In</Link></li>
                <li><Link href="/auth/signup" className="hover:text-blue-400 transition-colors">Sign Up</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Randevu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}
