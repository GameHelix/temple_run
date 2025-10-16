'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, Circle, AlertCircle, ArrowRight, Calendar, FileText, Clock, Users } from 'lucide-react';
import Link from 'next/link';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action: string;
  actionUrl: string;
  icon: React.ReactNode;
}

export default function DoctorOnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(true);
  const [profileStatus, setProfileStatus] = useState({ hasProfile: false, isVerified: false });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'doctor')) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Fetch doctor profile status
  useEffect(() => {
    const fetchProfileStatus = async () => {
      if (user && user.role === 'doctor') {
        try {
          const response = await fetch('/api/doctors/profile');
          const data = await response.json();

          if (data.success && data.profile) {
            setProfileStatus({
              hasProfile: true,
              isVerified: data.profile.isVerified || false,
            });
          } else {
            setProfileStatus({ hasProfile: false, isVerified: false });
          }
        } catch (error) {
          console.error('Error fetching profile status:', error);
        } finally {
          setLoadingSteps(false);
        }
      }
    };

    fetchProfileStatus();
  }, [user]);

  // Update steps based on profile status
  useEffect(() => {
    if (!loadingSteps) {
      const onboardingSteps: OnboardingStep[] = [
        {
          id: 'complete-profile',
          title: 'Complete Your Professional Profile',
          description: 'Add your specialization, credentials, experience, and clinic information.',
          completed: profileStatus.hasProfile,
          action: profileStatus.hasProfile ? 'Update Profile' : 'Complete Profile',
          actionUrl: '/doctor/profile-setup',
          icon: <FileText className="h-6 w-6" />,
        },
        {
          id: 'wait-verification',
          title: 'Wait for Admin Verification',
          description: 'Our team will review your profile to ensure quality and authenticity.',
          completed: profileStatus.isVerified,
          action: 'Check Status',
          actionUrl: '/profile',
          icon: <AlertCircle className="h-6 w-6" />,
        },
        {
          id: 'set-schedule',
          title: 'Set Your Availability',
          description: 'Configure your weekly schedule and available time slots for appointments.',
          completed: false, // Could be enhanced to check if schedule is set
          action: 'Set Schedule',
          actionUrl: '/doctor/schedule',
          icon: <Clock className="h-6 w-6" />,
        },
        {
          id: 'manage-appointments',
          title: 'Start Managing Appointments',
          description: 'Review and confirm patient appointments, add consultation notes.',
          completed: false,
          action: 'View Appointments',
          actionUrl: '/doctor/appointments',
          icon: <Calendar className="h-6 w-6" />,
        },
      ];

      setSteps(onboardingSteps);
    }
  }, [profileStatus, loadingSteps]);

  if (loading || loadingSteps) {
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

  if (!user || user.role !== 'doctor') {
    return null;
  }

  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-12 w-12 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Randevu, Dr. {user.name}!
          </h1>
          <p className="text-xl text-indigo-300 mb-6">
            Let's get you set up to start accepting patient appointments
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-indigo-300">Your Progress</span>
              <span className="text-sm font-medium text-indigo-200">
                {completedSteps} of {totalSteps} completed
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Status Alert */}
        {!profileStatus.hasProfile && (
          <div className="mb-8 bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-6 animate-fade-in">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-200 mb-1">Action Required</h3>
                <p className="text-sm text-yellow-100">
                  You need to complete your professional profile before you can appear in the doctors directory and accept appointments.
                </p>
              </div>
            </div>
          </div>
        )}

        {profileStatus.hasProfile && !profileStatus.isVerified && (
          <div className="mb-8 bg-blue-900/30 border border-blue-500/50 rounded-lg p-6 animate-fade-in">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-200 mb-1">Pending Verification</h3>
                <p className="text-sm text-blue-100">
                  Your profile is under review by our admin team. This usually takes 24-48 hours. You'll be notified once verified.
                </p>
              </div>
            </div>
          </div>
        )}

        {profileStatus.hasProfile && profileStatus.isVerified && (
          <div className="mb-8 bg-green-900/30 border border-green-500/50 rounded-lg p-6 animate-fade-in">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-200 mb-1">Profile Verified!</h3>
                <p className="text-sm text-green-100">
                  Congratulations! Your profile is verified and you're now visible to patients in the doctors directory.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Onboarding Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-gray-800/60 backdrop-blur-sm border rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in-up animate-stagger-${index + 1}`}
              style={{ borderColor: step.completed ? 'rgb(34, 197, 94)' : 'rgb(75, 85, 99)' }}
            >
              <div className="flex items-start">
                {/* Step Icon & Number */}
                <div className="flex-shrink-0 mr-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.completed
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                        {step.icon}
                        {step.title}
                      </h3>
                      <p className="text-sm text-indigo-300">{step.description}</p>
                    </div>
                    {step.completed && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-4">
                    <Link
                      href={step.actionUrl}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        step.completed
                          ? 'bg-gray-700 text-indigo-300 hover:bg-gray-600'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {step.action}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gray-800/40 border border-gray-700 rounded-lg p-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-white mb-3">Need Help?</h3>
          <p className="text-sm text-indigo-300 mb-4">
            Check out our comprehensive guides and documentation for detailed information about using Randevu.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/help"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-indigo-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FileText className="h-4 w-4" />
              View Help Center
            </Link>
            <a
              href="/WORKFLOW.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-indigo-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Read Documentation
            </a>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-indigo-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go to Profile
            </Link>
          </div>
        </div>

        {/* All Set Message */}
        {completedSteps === totalSteps && (
          <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-center animate-scale-in">
            <CheckCircle className="h-16 w-16 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">You're All Set!</h2>
            <p className="text-indigo-100 mb-6">
              You've completed all the onboarding steps. You can now start managing your appointments and helping patients.
            </p>
            <Link
              href="/doctor/appointments"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Go to Appointments
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
