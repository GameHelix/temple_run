'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Heart, Menu, X, User, Users, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user, signOut, isDoctor } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Handle hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't show navbar on auth pages
  if (!isClient || (pathname && (pathname.startsWith('/auth/')))) {
    return null;
  }

  const handleSignOut = () => {
    signOut();
    router.push('/auth/signin');
    setIsMenuOpen(false);
  };

  // Handle navigation without page refresh
  const handleNavigate = (href: string) => {
    setIsMenuOpen(false); // Close mobile menu
    router.push(href);
  };

  // Base nav items for all users - added Blog link that's visible to all users
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' }
  ];

  // Add role-specific nav items
  if (user) {
    navItems.push({ label: 'Chat', href: '/chat' });

    // Add doctor-specific nav items
    if (isDoctor()) {
      navItems.push({ label: 'Provider Dashboard', href: '/doctor/dashboard' });
    }
  }

  return (
    <nav className="bg-gray-950 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              onClick={() => handleNavigate('/')}
              className="flex-shrink-0 flex items-center cursor-pointer"
            >
              <Heart className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-white">Healthcare Assistant</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navItems.map((item) => (
                <div
                  key={item.href}
                  onClick={() => handleNavigate(item.href)}
                  className={`${
                    pathname === item.href
                      ? 'border-b-2 border-indigo-500 text-white'
                      : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-white'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center gap-2">
                {isDoctor() && (
                  <span className="bg-green-100 text-green-800 text-xs rounded-full px-2 py-0.5">
                    Doctor
                  </span>
                )}
                <div 
                  onClick={() => handleNavigate('/profile')}
                  className="text-gray-300 hover:text-white px-3 py-2 flex items-center cursor-pointer"
                >
                  <User className="h-4 w-4 mr-1" />
                  Profile
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <div 
                  onClick={() => handleNavigate('/auth/signin')}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                >
                  Sign In
                </div>
                <div 
                  onClick={() => handleNavigate('/auth/signup')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <div
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className={`${
                  pathname === item.href
                    ? 'bg-indigo-900 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                } block px-3 py-2 text-base font-medium cursor-pointer`}
              >
                {item.label}
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 pt-4 pb-3">
            {user ? (
              <div className="space-y-1">
                {isDoctor() && (
                  <div className="px-3 py-2">
                    <span className="bg-green-100 text-green-800 text-xs rounded-full px-2 py-0.5">
                      Doctor
                    </span>
                  </div>
                )}
                <div 
                  onClick={() => handleNavigate('/profile')}
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                >
                  Profile
                </div>
                <div 
                  onClick={() => handleNavigate('/chat')}
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                >
                  Chat
                </div>
                {isDoctor() && (
                  <div 
                    onClick={() => handleNavigate('/doctor/dashboard')}
                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer"
                  >
                    Provider Dashboard
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-1 px-3">
                <div 
                  onClick={() => handleNavigate('/auth/signin')}
                  className="block bg-gray-800 text-white px-3 py-2 rounded-md text-base font-medium mb-2 cursor-pointer"
                >
                  Sign In
                </div>
                <div 
                  onClick={() => handleNavigate('/auth/signup')}
                  className="block bg-indigo-600 text-white px-3 py-2 rounded-md text-base font-medium cursor-pointer"
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