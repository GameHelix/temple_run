'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';

export default function DoctorProfileSetup() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    specialization: '',
    licenseNumber: '',
    bio: '',
    education: '',
    experienceYears: '',
    consultationFee: '',
    clinicName: '',
    clinicAddress: '',
    city: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<{
    hasProfile: boolean;
    isVerified: boolean;
  } | null>(null);

  // Check if user is a doctor and if they already have a profile
  useEffect(() => {
    if (!loading && user) {
      if (user.role !== 'doctor') {
        router.push('/');
        return;
      }

      // Check if doctor has a profile
      fetch('/api/doctors/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.profile) {
            setHasProfile(true);
            setProfileStatus({
              hasProfile: true,
              isVerified: data.profile.isVerified,
            });
            // Pre-fill the form with existing data
            setFormData({
              specialization: data.profile.specialization || '',
              licenseNumber: data.profile.licenseNumber || '',
              bio: data.profile.bio || '',
              education: data.profile.education || '',
              experienceYears: data.profile.experienceYears?.toString() || '',
              consultationFee: data.profile.consultationFee?.toString() || '',
              clinicName: data.profile.clinicName || '',
              clinicAddress: data.profile.clinicAddress || '',
              city: data.profile.city || '',
            });
          } else {
            setProfileStatus({
              hasProfile: false,
              isVerified: false,
            });
          }
        })
        .catch((err) => {
          console.error('Error checking profile:', err);
        });
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/doctors/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : undefined,
          consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        setError(data.message || 'Failed to save profile');
      }
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'doctor') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Stethoscope className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hasProfile ? 'Update Your Profile' : 'Complete Your Doctor Profile'}
          </h1>
          <p className="text-gray-600">
            {hasProfile
              ? 'Update your professional information'
              : 'Fill in your professional information to appear in the doctors directory'}
          </p>
        </div>

        {/* Status Banner */}
        {profileStatus && (
          <div className="mb-6">
            {!profileStatus.hasProfile && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Profile Incomplete</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Complete your profile to be listed in the doctors directory. After submission, an admin will verify your account.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {profileStatus.hasProfile && !profileStatus.isVerified && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Pending Verification</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Your profile is under review. An admin will verify your account soon. You'll appear in the doctors directory once verified.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {profileStatus.hasProfile && profileStatus.isVerified && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Profile Verified</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Your profile is verified and visible to patients. You can update your information anytime.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Profile saved successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-6">
          {/* Specialization - Required */}
          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
              Specialization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="specialization"
              required
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Cardiology, Dermatology, Pediatrics"
            />
          </div>

          {/* License Number */}
          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Medical License Number
            </label>
            <input
              type="text"
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your medical license number"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Professional Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell patients about yourself and your practice"
            />
          </div>

          {/* Education */}
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
              Education
            </label>
            <input
              type="text"
              id="education"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., MD from Harvard Medical School"
            />
          </div>

          {/* Experience & Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                id="experienceYears"
                min="0"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 10"
              />
            </div>

            <div>
              <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Fee ($)
              </label>
              <input
                type="number"
                id="consultationFee"
                min="0"
                step="0.01"
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 150"
              />
            </div>
          </div>

          {/* Clinic Info */}
          <div>
            <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-2">
              Clinic/Hospital Name
            </label>
            <input
              type="text"
              id="clinicName"
              value={formData.clinicName}
              onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Where you practice"
            />
          </div>

          <div>
            <label htmlFor="clinicAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Clinic Address
            </label>
            <input
              type="text"
              id="clinicAddress"
              value={formData.clinicAddress}
              onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Full address"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="City where you practice"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : hasProfile ? 'Update Profile' : 'Save Profile'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
