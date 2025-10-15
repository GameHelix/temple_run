// src/components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Calendar, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user, signOut, isDoctor } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't show navbar on auth pages
  if (!isClient || (pathname && pathname.startsWith('/auth/'))) {
    return null;
  }

  const handleSignOut = () => {
    signOut();
    router.push('/auth/signin');
    setIsMenuOpen(false);
  };

  const handleNavigate = (href: string) => {
    setIsMenuOpen(false);
    router.push(href);
  };

  // Build navigation items based on user role
  let navItems: { label: string; href: string }[] = [];

  if (!user) {
    // Guest users
    navItems = [
      { label: 'Home', href: '/' },
      { label: 'Find Doctors', href: '/doctors' },
    ];
  } else if (user.role === 'patient') {
    // Patient navigation
    navItems = [
      { label: 'Home', href: '/' },
      { label: 'Find Doctors', href: '/doctors' },
      { label: 'My Appointments', href: '/appointments' },
    ];
  } else if (user.role === 'doctor') {
    // Doctor navigation (no "Find Doctors")
    navItems = [
      { label: 'Home', href: '/' },
      { label: 'Appointments', href: '/doctor/appointments' },
      { label: 'Schedule', href: '/doctor/schedule' },
    ];
  } else if (user.role === 'admin') {
    // Admin navigation
    navItems = [
      { label: 'Home', href: '/' },
      { label: 'Find Doctors', href: '/doctors' },
      { label: 'Admin', href: '/admin' },
    ];
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => handleNavigate('/')}
              className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-lg"
              aria-label="Go to homepage"
            >
              <Calendar className="h-8 w-8 text-blue-600" aria-hidden="true" />
              <span className="ml-2 text-xl font-bold text-gray-900">Randevu</span>
            </button>
            <div className="hidden md:ml-8 md:flex md:space-x-6" role="menubar">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigate(item.href)}
                  className={`${
                    pathname === item.href
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded`}
                  role="menuitem"
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'doctor' && (
                  <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-3 py-1 font-medium" role="status" aria-label="User role: Doctor">
                    Doctor
                  </span>
                )}
                {user.role === 'admin' && (
                  <span className="bg-purple-100 text-purple-800 text-xs rounded-full px-3 py-1 font-medium" role="status" aria-label="User role: Admin">
                    Admin
                  </span>
                )}
                <button
                  onClick={() => handleNavigate('/profile')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 flex items-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-lg"
                  aria-label="Go to profile"
                >
                  <User className="h-4 w-4 mr-1" aria-hidden="true" />
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2"
                  aria-label="Sign out of your account"
                >
                  <LogOut className="h-4 w-4 mr-1" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleNavigate('/auth/signin')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigate('/auth/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2"
                  aria-label="Create a new account"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              <span className="sr-only">{isMenuOpen ? 'Close' : 'Open'} main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200" id="mobile-menu" role="menu">
          <nav className="pt-2 pb-3 space-y-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className={`${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } block w-full text-left px-4 py-2 text-base font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600`}
                role="menuitem"
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="border-t border-gray-200 pt-4 pb-3">
            {user ? (
              <div className="space-y-1">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-900" id="user-name">{user.name}</p>
                  <p className="text-xs text-gray-500" id="user-email">{user.email}</p>
                  <div className="mt-2">
                    {user.role === 'doctor' && (
                      <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-3 py-1 font-medium" role="status" aria-label="User role: Doctor">
                        Doctor
                      </span>
                    )}
                    {user.role === 'admin' && (
                      <span className="bg-purple-100 text-purple-800 text-xs rounded-full px-3 py-1 font-medium" role="status" aria-label="User role: Admin">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleNavigate('/profile')}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  aria-label="Go to profile"
                >
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  aria-label="Sign out of your account"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 px-4">
                <button
                  onClick={() => handleNavigate('/auth/signin')}
                  className="block w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-base font-medium text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigate('/auth/signup')}
                  className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-base font-medium text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-800"
                  aria-label="Create a new account"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
