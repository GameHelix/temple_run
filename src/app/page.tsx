'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Heart } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Dark Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10%] opacity-30">
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
        
        {/* Hero content */}
        <div className="container relative mx-auto px-6 py-24 md:py-32">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="flex items-center mb-6 animate-pulse">
              <Heart className="h-12 w-12 text-purple-400" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-300 to-blue-200">
              Intelligent Healthcare Assistant
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-indigo-100 max-w-3xl">
              Your personal AI-powered healthcare companion providing reliable information and guidance when you need it most.
            </p>
            
            <div className="mt-4">
              <p className="text-indigo-200 text-xl">
                The intelligent healthcare companion for the modern age
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-900 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-indigo-100">How Our Healthcare Assistant Helps You</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-indigo-500/10 hover:translate-y-[-5px]">
              <div className="w-14 h-14 rounded-lg bg-indigo-900/70 flex items-center justify-center mb-6">
                <svg className="h-7 w-7 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-indigo-100 mb-3">Reliable Information</h3>
              <p className="text-gray-300">
                Access evidence-based health information on common conditions, symptoms, and treatments from trusted medical sources.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-indigo-500/10 hover:translate-y-[-5px]">
              <div className="w-14 h-14 rounded-lg bg-indigo-900/70 flex items-center justify-center mb-6">
                <svg className="h-7 w-7 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-indigo-100 mb-3">Personalized Guidance</h3>
              <p className="text-gray-300">
                Receive tailored health recommendations and answers to your specific questions with our AI-powered chat assistant.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-indigo-500/10 hover:translate-y-[-5px]">
              <div className="w-14 h-14 rounded-lg bg-indigo-900/70 flex items-center justify-center mb-6">
                <svg className="h-7 w-7 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-indigo-100 mb-3">Privacy Focused</h3>
              <p className="text-gray-300">
                Your health information is protected with secure, private conversations and industry-standard encryption.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Section - Replacing CTA */}
      <div className="bg-gradient-to-b from-gray-900 to-indigo-950 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">What Healthcare Means To Us</h2>
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-xl italic text-indigo-100 mb-6">
              "The goal of our healthcare assistant is to make reliable health information accessible to everyone, 
              empowering you to make informed decisions about your wellbeing."
            </blockquote>
            <p className="text-indigo-200">
              Powered by advanced AI technology to provide evidence-based guidance
            </p>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-indigo-400 mr-2" />
            <span className="text-lg font-semibold text-indigo-100">Healthcare Assistant</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Healthcare Assistant. All rights reserved.
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/terms" className="text-sm text-indigo-300 hover:text-indigo-200">Terms</Link>
            <Link href="/privacy" className="text-sm text-indigo-300 hover:text-indigo-200">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}