'use client';

import SignInForm from '@/components/auth/SignInForm';
import { Suspense } from 'react';

// Component for the sign-in form with suspense loading state
function SignInFormWithSuspense() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading sign in form...</div>}>
      <SignInForm />
    </Suspense>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Healthcare Assistant
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your personalized healthcare assistance
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignInFormWithSuspense />
      </div>
    </div>
  );
}