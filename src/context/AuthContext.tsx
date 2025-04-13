'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SignInData, SignUpData, AuthResponse } from '@/types/user';
import axios, { AxiosError } from 'axios';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (data: SignInData) => Promise<AuthResponse>;
  signUp: (data: SignUpData) => Promise<AuthResponse>;
  signOut: () => void;
  isDoctor: () => boolean;
  isPatient: () => boolean;
}

// Define the structure of the error response from the API
interface ErrorResponse {
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to set a cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

// Function to delete a cookie
const deleteCookie = (name: string) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // Set default Authorization header for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await axios.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data.user) {
            setUser(response.data.user);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('auth_token');
        deleteCookie('auth_token');
        axios.defaults.headers.common['Authorization'] = '';
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signIn = async (data: SignInData): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/signin', data);
      const result = response.data;
      
      if (result.success && result.token) {
        // Store token in both localStorage and as a cookie
        localStorage.setItem('auth_token', result.token);
        setCookie('auth_token', result.token);
        
        // Set default Authorization header for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
        
        setUser(result.user);
      } else {
        setError(result.message || 'Sign in failed');
      }
      
      return result;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const message = axiosError.response?.data?.message || 'Sign in failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/signup', data);
      const result = response.data;
      
      if (result.success && result.token) {
        // Store token in both localStorage and as a cookie
        localStorage.setItem('auth_token', result.token);
        setCookie('auth_token', result.token);
        
        // Set default Authorization header for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
        
        setUser(result.user);
      } else {
        setError(result.message || 'Sign up failed');
      }
      
      return result;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const message = axiosError.response?.data?.message || 'Sign up failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('auth_token');
    deleteCookie('auth_token');
    axios.defaults.headers.common['Authorization'] = '';
    setUser(null);
  };

  // Helper functions to check user role
  const isDoctor = () => {
    return user?.role === 'doctor';
  };

  const isPatient = () => {
    return user?.role === 'patient';
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut, isDoctor, isPatient }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}