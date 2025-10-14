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
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Find Doctors', href: '/doctors' },
  ];

  // Add role-specific nav items
  if (user) {
    if (user.role === 'patient') {
      navItems.push({ label: 'My Appointments', href: '/appointments' });
    } else if (user.role === 'doctor') {
      navItems.push(
        { label: 'Appointments', href: '/doctor/appointments' },
        { label: 'Schedule', href: '/doctor/schedule' }
      );
    } else if (user.role === 'admin') {
      navItems.push({ label: 'Admin', href: '/admin' });
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div
              onClick={() => handleNavigate('/')}
              className="flex-shrink-0 flex items-center cursor-pointer"
            >
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Randevu</span>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {navItems.map((item) => (
                <div
                  key={item.href}
                  onClick={() => handleNavigate(item.href)}
                  className={`${
                    pathname === item.href
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-colors`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'doctor' && (
                  <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-3 py-1 font-medium">
                    Doctor
                  </span>
                )}
                {user.role === 'admin' && (
                  <span className="bg-purple-100 text-purple-800 text-xs rounded-full px-3 py-1 font-medium">
                    Admin
                  </span>
                )}
                <div
                  onClick={() => handleNavigate('/profile')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 flex items-center cursor-pointer transition-colors"
                >
                  <User className="h-4 w-4 mr-1" />
                  Profile
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <div
                  onClick={() => handleNavigate('/auth/signin')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors"
                >
                  Sign In
                </div>
                <div
                  onClick={() => handleNavigate('/auth/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors"
                >
                  Sign Up
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
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
        <div className="md:hidden border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <div
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className={`${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } block px-4 py-2 text-base font-medium cursor-pointer transition-colors`}
              >
                {item.label}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 pb-3">
            {user ? (
              <div className="space-y-1">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <div className="mt-2">
                    {user.role === 'doctor' && (
                      <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-3 py-1 font-medium">
                        Doctor
                      </span>
                    )}
                    {user.role === 'admin' && (
                      <span className="bg-purple-100 text-purple-800 text-xs rounded-full px-3 py-1 font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <div
                  onClick={() => handleNavigate('/profile')}
                  className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
                >
                  Profile
                </div>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 px-4">
                <div
                  onClick={() => handleNavigate('/auth/signin')}
                  className="block bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-base font-medium text-center cursor-pointer"
                >
                  Sign In
                </div>
                <div
                  onClick={() => handleNavigate('/auth/signup')}
                  className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-base font-medium text-center cursor-pointer"
                >
                  Sign Up
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
