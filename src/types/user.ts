// src/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'doctor' | 'patient';
  createdAt: Date;
  updatedAt: Date;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: 'doctor' | 'patient';
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}