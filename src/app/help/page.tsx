'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen,
  Users,
  Stethoscope,
  Shield,
  Calendar,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Home,
} from 'lucide-react';

export default function HelpPage() {
  const { user } = useAuth();
  const [openSection, setOpenSection] = useState<string | null>('how-it-works');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & User Guide</h1>
          <p className="text-xl text-gray-600">
            Learn how to use Randevu to book and manage doctor appointments
          </p>
          <Link
            href="/"
            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => toggleSection('patients')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
            >
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <span className="font-medium text-gray-900">For Patients</span>
            </button>
            <button
              onClick={() => toggleSection('doctors')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
            >
              <Stethoscope className="h-6 w-6 text-blue-600 mr-3" />
              <span className="font-medium text-gray-900">For Doctors</span>
            </button>
            <button
              onClick={() => toggleSection('admins')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
            >
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <span className="font-medium text-gray-900">For Admins</span>
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <button
            onClick={() => toggleSection('how-it-works')}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">How Randevu Works</h2>
            </div>
            {openSection === 'how-it-works' ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {openSection === 'how-it-works' && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="space-y-6 mt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Doctor Registration</h3>
                    <p className="text-gray-600 text-sm">
                      Doctors sign up, complete their professional profile with specialization,
                      education, and credentials.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Admin Verification</h3>
                    <p className="text-gray-600 text-sm">
                      Admins review and verify doctor profiles to ensure quality and
                      authenticity.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Doctor Listing</h3>
                    <p className="text-gray-600 text-sm">
                      Verified doctors appear in the public directory where patients can browse
                      and search.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Patient Booking</h3>
                    <p className="text-gray-600 text-sm">
                      Patients search for doctors, view profiles, and book appointments with
                      their preferred time slots.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Appointment Management</h3>
                    <p className="text-gray-600 text-sm">
                      Doctors confirm appointments, add consultation notes, and patients can
                      track their appointments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* For Patients */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <button
            onClick={() => toggleSection('patients')}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Patient Guide</h2>
            </div>
            {openSection === 'patients' ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {openSection === 'patients' && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 1: Create Account</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Visit <Link href="/auth/signup" className="text-blue-600 hover:underline">/auth/signup</Link> and select "Patient" as your role.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 2: Find a Doctor</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Go to <Link href="/doctors" className="text-blue-600 hover:underline">/doctors</Link> to browse verified doctors.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                    <li>Filter by specialization (Cardiology, Pediatrics, etc.)</li>
                    <li>Filter by city to find doctors near you</li>
                    <li>View ratings and reviews</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 3: Book Appointment</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Click on a doctor card to view their profile and booking form:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                    <li>Select your preferred date</li>
                    <li>Choose available time slot</li>
                    <li>Add any relevant notes (optional)</li>
                    <li>Click "Book Appointment"</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 4: Manage Appointments</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Visit <Link href="/appointments" className="text-blue-600 hover:underline">/appointments</Link> to view all your bookings:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                    <li>View upcoming and past appointments</li>
                    <li>See appointment status (pending, confirmed, completed)</li>
                    <li>Cancel appointments with reason if needed</li>
                    <li>View doctor notes after consultation</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* For Doctors */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <button
            onClick={() => toggleSection('doctors')}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Stethoscope className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Doctor Guide</h2>
            </div>
            {openSection === 'doctors' ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {openSection === 'doctors' && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="space-y-6 mt-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Important</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        You must complete your profile AND get admin verification before appearing
                        in the public doctors directory.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 1: Register Account</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Visit <Link href="/auth/signup" className="text-blue-600 hover:underline">/auth/signup</Link> and select "Healthcare Provider" as your role.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 2: Complete Profile</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    After logging in, visit <Link href="/doctor/profile-setup" className="text-blue-600 hover:underline">/doctor/profile-setup</Link> to add:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                    <li>Specialization (required)</li>
                    <li>Medical license number</li>
                    <li>Professional bio</li>
                    <li>Education and credentials</li>
                    <li>Years of experience</li>
                    <li>Consultation fee</li>
                    <li>Clinic name and address</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 3: Wait for Verification</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    After submitting your profile:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                    <li>Admin will review your credentials</li>
                    <li>Verification usually takes 24-48 hours</li>
                    <li>Check your profile page for status updates</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Step 4: Manage Appointments</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Once verified, visit <Link href="/doctor/appointments" className="text-blue-600 hover:underline">/doctor/appointments</Link> to:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                    <li>View today's and upcoming appointments</li>
                    <li>Confirm pending appointments</li>
                    <li>Add consultation notes</li>
                    <li>Mark appointments as complete or no-show</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* For Admins */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <button
            onClick={() => toggleSection('admins')}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Admin Guide</h2>
            </div>
            {openSection === 'admins' ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {openSection === 'admins' && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Doctor Verification</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Visit <Link href="/admin/doctors" className="text-blue-600 hover:underline">/admin/doctors</Link> to review pending doctors:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                    <li>Check profile completion status</li>
                    <li>Review specialization and credentials</li>
                    <li>Verify button is enabled only for complete profiles</li>
                    <li>Click "Verify" to approve doctor</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Profile Status Indicators</p>
                      <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li>✅ <strong>Profile Complete:</strong> Doctor can be verified</li>
                        <li>⚠️ <strong>No Profile:</strong> Doctor must complete profile first</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Indicators */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <button
            onClick={() => toggleSection('status')}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Understanding Status Indicators</h2>
            </div>
            {openSection === 'status' ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {openSection === 'status' && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="space-y-4 mt-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Doctor Profile Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-400 rounded mr-3"></div>
                      <span className="text-sm text-gray-900 font-medium mr-2">Yellow Banner:</span>
                      <span className="text-sm text-gray-600">Profile incomplete</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-400 rounded mr-3"></div>
                      <span className="text-sm text-gray-900 font-medium mr-2">Blue Banner:</span>
                      <span className="text-sm text-gray-600">Pending verification</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-400 rounded mr-3"></div>
                      <span className="text-sm text-gray-900 font-medium mr-2">Green Banner:</span>
                      <span className="text-sm text-gray-600">Verified and visible</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Appointment Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded mr-3">PENDING</span>
                      <span className="text-sm text-gray-600">Waiting for doctor confirmation</span>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded mr-3">CONFIRMED</span>
                      <span className="text-sm text-gray-600">Doctor confirmed appointment</span>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mr-3">COMPLETED</span>
                      <span className="text-sm text-gray-600">Consultation finished</span>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded mr-3">CANCELLED</span>
                      <span className="text-sm text-gray-600">Appointment cancelled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Need More Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need More Help?</h3>
          <p className="text-gray-600 mb-4">
            Check out our complete workflow documentation for detailed technical information
          </p>
          <a
            href="/WORKFLOW.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            View Complete Documentation
          </a>
        </div>
      </div>
    </div>
  );
}
