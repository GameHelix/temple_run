// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { createUser } from '@/lib/user-db';
import { generateToken } from '@/lib/jwt';
import { SignUpData } from '@/types/user';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role }: SignUpData = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide name, email, and password' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate role — only 'doctor' or 'patient' are allowed; default to 'patient'
    const finalRole = (role === 'doctor' || role === 'patient') ? role : 'patient';

    const user = await createUser({ name, email, password, role: finalRole });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email already in use or user creation failed' },
        { status: 400 }
      );
    }

    const token = generateToken(user);

    return NextResponse.json({
      success: true,
      message: `User registered successfully as ${user.role}`,
      user,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register user. Please try again later.' },
      { status: 500 }
    );
  }
}
