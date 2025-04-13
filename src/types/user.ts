// src/types/user.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: 'doctor' | 'patient' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Blog post interfaces
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  authorId: string;
  authorName: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostInput {
  title: string;
  content: string;
  summary: string;
  tags: string[];
  isPublished: boolean;
}