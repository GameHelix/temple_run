// src/app/screenshots/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Users, Stethoscope, Shield, ChevronDown, ChevronUp } from 'lucide-react';

interface Screenshot {
  title: string;
  description: string;
  path: string;
  category: 'patient' | 'doctor' | 'admin';
}

const screenshots: Screenshot[] = [
  // Patient Screenshots
  {
    title: 'Patient Dashboard',
    description: 'Overview of patient appointments, upcoming visits, and health summary',
    path: '/screenshots/patient/dashboard.png',
    category: 'patient',
  },
  {
    title: 'Find Doctors',
    description: 'Search and filter verified doctors by specialization, city, and rating',
    path: '/screenshots/patient/doctors-list.png',
    category: 'patient',
  },
  {
    title: 'Doctor Profile',
    description: 'View doctor details, ratings, availability, and book appointments',
    path: '/screenshots/patient/doctor-profile.png',
    category: 'patient',
  },
  {
    title: 'Book Appointment',
    description: 'Select date, time slot, and add notes for your appointment',
    path: '/screenshots/patient/book-appointment.png',
    category: 'patient',
  },
  {
    title: 'My Appointments',
    description: 'View all appointments with filters by status and date',
    path: '/screenshots/patient/appointments.png',
    category: 'patient',
  },
  {
    title: 'Patient Profile',
    description: 'Manage personal information and contact details',
    path: '/screenshots/patient/profile.png',
    category: 'patient',
  },

  // Doctor Screenshots
  {
    title: 'Doctor Dashboard',
    description: 'View appointment statistics, upcoming visits, and patient overview',
    path: '/screenshots/doctor/dashboard.png',
    category: 'doctor',
  },
  {
    title: 'Profile Setup',
    description: 'Complete professional profile with specialization, education, and fees',
    path: '/screenshots/doctor/profile-setup.png',
    category: 'doctor',
  },
  {
    title: 'Doctor Profile - Pending Verification',
    description: 'Profile status showing pending admin verification',
    path: '/screenshots/doctor/profile-pending.png',
    category: 'doctor',
  },
  {
    title: 'Doctor Profile - Verified',
    description: 'Verified doctor profile with complete information',
    path: '/screenshots/doctor/profile-verified.png',
    category: 'doctor',
  },
  {
    title: 'Appointment Management',
    description: 'Manage appointments with filters for today, upcoming, and past visits',
    path: '/screenshots/doctor/appointments.png',
    category: 'doctor',
  },
  {
    title: 'Schedule Management',
    description: 'Set weekly availability with custom time slots for each day',
    path: '/screenshots/doctor/schedule.png',
    category: 'doctor',
  },
  {
    title: 'Patients List',
    description: 'View all patients with appointment history and contact information',
    path: '/screenshots/doctor/patients.png',
    category: 'doctor',
  },

  // Admin Screenshots
  {
    title: 'Admin Dashboard',
    description: 'System overview with statistics for users, doctors, and appointments',
    path: '/screenshots/admin/dashboard.png',
    category: 'admin',
  },
  {
    title: 'Doctors Management',
    description: 'Review doctor profiles, verify accounts, and manage doctor listings',
    path: '/screenshots/admin/doctors.png',
    category: 'admin',
  },
  {
    title: 'Doctor Verification',
    description: 'Verify doctor credentials and approve profile for public listing',
    path: '/screenshots/admin/doctor-verify.png',
    category: 'admin',
  },
  {
    title: 'Users Management',
    description: 'View and manage all system users (patients, doctors, admins)',
    path: '/screenshots/admin/users.png',
    category: 'admin',
  },
  {
    title: 'Appointments Overview',
    description: 'Monitor all appointments across the system with filtering options',
    path: '/screenshots/admin/appointments.png',
    category: 'admin',
  },
];

export default function ScreenshotsPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('patient');

  const categories = [
    {
      id: 'patient',
      name: 'Patient Portal',
      icon: Users,
      color: 'blue',
      description: 'Features available to patients for booking appointments and managing health',
    },
    {
      id: 'doctor',
      name: 'Doctor Portal',
      icon: Stethoscope,
      color: 'green',
      description: 'Tools for doctors to manage appointments, schedules, and patient care',
    },
    {
      id: 'admin',
      name: 'Admin Panel',
      icon: Shield,
      color: 'purple',
      description: 'Administrative controls for user management and system oversight',
    },
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Application Screenshots
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore all features and interfaces of the Randevu healthcare appointment system.
            Screenshots are organized by user role: Patient, Doctor, and Admin.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const isExpanded = expandedCategory === category.id;
            const categoryScreenshots = screenshots.filter((s) => s.category === category.id);
            const colorClasses = {
              blue: 'bg-blue-50 border-blue-200 text-blue-700',
              green: 'bg-green-50 border-green-200 text-green-700',
              purple: 'bg-purple-50 border-purple-200 text-purple-700',
            }[category.color];

            return (
              <div key={category.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full px-6 py-5 flex items-center justify-between transition-colors hover:bg-gray-50 ${
                    isExpanded ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg border-2 ${colorClasses}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {categoryScreenshots.length} screenshots
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-6 w-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Screenshots Grid */}
                {isExpanded && (
                  <div className="px-6 py-8 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {categoryScreenshots.map((screenshot, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                        >
                          {/* Screenshot Image */}
                          <div className="relative w-full h-80 bg-gray-100 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-6xl mb-4">📸</div>
                                <p className="text-gray-500 text-sm">
                                  Screenshot placeholder
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                  {screenshot.path}
                                </p>
                              </div>
                            </div>
                            {/* Uncomment when screenshots are added:
                            <Image
                              src={screenshot.path}
                              alt={screenshot.title}
                              fill
                              className="object-cover"
                            />
                            */}
                          </div>

                          {/* Screenshot Info */}
                          <div className="p-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {screenshot.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {screenshot.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📝 Adding Screenshots
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>To add actual screenshots to this page:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Take screenshots of each page in the application</li>
              <li>Save them in the appropriate directory:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li><code className="bg-blue-100 px-2 py-1 rounded">public/screenshots/patient/</code></li>
                  <li><code className="bg-blue-100 px-2 py-1 rounded">public/screenshots/doctor/</code></li>
                  <li><code className="bg-blue-100 px-2 py-1 rounded">public/screenshots/admin/</code></li>
                </ul>
              </li>
              <li>Name the files according to the paths specified above (e.g., <code className="bg-blue-100 px-2 py-1 rounded">dashboard.png</code>)</li>
              <li>Uncomment the Image component in <code className="bg-blue-100 px-2 py-1 rounded">src/app/screenshots/page.tsx</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
