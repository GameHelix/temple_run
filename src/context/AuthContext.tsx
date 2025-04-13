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

// Function to set a cookie (client-side)
const setCookie = (name: string, value: string, days: number = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict; Secure=" + (process.env.NODE_ENV === 'production');
};

// Function to get a cookie (client-side)
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Function to delete a cookie (client-side)
const deleteCookie = (name: string) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict;';
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
        
        // Try to get token from localStorage or cookie
        const localToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const cookieToken = getCookie('auth_token');
        const token = localToken || cookieToken;
        
        if (token) {
          // Set default Authorization header for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Make sure tokens are synced between localStorage and cookies
          if (typeof window !== 'undefined') {
            if (!localToken && cookieToken) {
              localStorage.setItem('auth_token', cookieToken);
            } else if (localToken && !cookieToken) {
              setCookie('auth_token', localToken);
            }
          }
          
          const response = await axios.get('/api/auth/me');
          
          if (response.data.user) {
            setUser(response.data.user);
            console.log("User authenticated:", response.data.user);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // Clear auth data on error
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        deleteCookie('auth_token');
        axios.defaults.headers.common['Authorization'] = '';
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Setup axios interceptors for auth handling
  useEffect(() => {
    // Add request interceptor to include token in all axios requests
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // Try to get token from localStorage or cookie
        const localToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const cookieToken = getCookie('auth_token');
        const token = localToken || cookieToken;
        
        if (token && config.headers) {
          // Add token to request header
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 (Unauthorized) errors
        if (error.response && error.response.status === 401) {
          // Clear auth data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
          }
          deleteCookie('auth_token');
          setUser(null);
          
          // Redirect to login if not already there
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/')) {
            window.location.href = '/auth/signin';
          }
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const signIn = async (data: SignInData): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/signin', data);
      const result = response.data;
      
      if (result.success && result.token) {
        // Store token in both localStorage and as a cookie
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', result.token);
        }
        setCookie('auth_token', result.token);
        
        // Set default Authorization header for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
        
        setUser(result.user);
        console.log("User signed in:", result.user);
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
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', result.token);
        }
        setCookie('auth_token', result.token);
        
        // Set default Authorization header for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
        
        setUser(result.user);
        console.log("User signed up:", result.user);
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
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