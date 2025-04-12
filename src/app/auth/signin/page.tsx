'use client';

import SignInForm from '@/components/auth/SignInForm';
import { Suspense } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';

// Component for the sign-in form with suspense loading state
function SignInFormWithSuspense() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-indigo-200">Loading sign in form...</div>}>
      <SignInForm />
    </Suspense>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
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

      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <Link href="/" className="flex items-center justify-center">
          <Heart className="h-12 w-12 text-indigo-400" />
        </Link>
        <h1 className="mt-6 text-center text-3xl font-bold text-white">
          Healthcare Assistant
        </h1>
        <p className="mt-2 text-center text-lg text-indigo-200">
          Sign in to access your healthcare assistance
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800/60 backdrop-blur-sm py-8 px-6 shadow-xl rounded-lg sm:px-10 border border-gray-700">
          <SignInFormWithSuspense />
        </div>
      </div>
    </div>
  );
}