// src/lib/user-db.ts - Fixed typing issues
import { User, SignUpData } from '@/types/user';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from './db';

/**
 * Creates a new user in the PostgreSQL database
 */
export async function createUser(userData: SignUpData): Promise<User | null> {
  try {
    console.log('Creating user with email:', userData.email);
    
    // Check if email already exists
    const emailCheckResult = await query(
      'SELECT * FROM users WHERE email = $1',
      [userData.email.toLowerCase()]
    );
    
    if (emailCheckResult.rows.length > 0) {
      console.log('Email already exists:', userData.email);
      return null; // Email already exists
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Generate UUID for the new user
    const userId = uuidv4();
    const now = new Date();
    
    // Ensure role is either 'doctor' or 'patient', default to 'patient'
    const role = userData.role === 'doctor' ? 'doctor' : 'patient';
    
    console.log('Inserting new user with ID:', userId, 'and role:', role);
    
    // Insert the new user with role field
    const result = await query(
      `INSERT INTO users (id, name, email, password, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, name, email, role, created_at, updated_at`,
      [
        userId,
        userData.name,
        userData.email.toLowerCase(),
        hashedPassword,
        role,
        now,
        now
      ]
    );
    
    if (result.rows.length > 0) {
      console.log('User created successfully:', result.rows[0].email, 'with role:', result.rows[0].role);
      // Convert the returned row to a User object
      return {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        role: result.rows[0].role,
        createdAt: new Date(result.rows[0].created_at),
        updatedAt: new Date(result.rows[0].updated_at)
      };
    }
    
    console.log('User creation failed, no rows returned');
    return null;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Finds a user by their email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      role: result.rows[0].role,
      createdAt: new Date(result.rows[0].created_at),
      updatedAt: new Date(result.rows[0].updated_at)
    };
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

/**
 * Finds a user by their ID
 */
export async function findUserById(id: string): Promise<User | null> {
  try {
    const result = await query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      role: result.rows[0].role,
      createdAt: new Date(result.rows[0].created_at),
      updatedAt: new Date(result.rows[0].updated_at)
    };
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
}

/**
 * Validates a user's password
 */
export async function validatePassword(userId: string, password: string): Promise<boolean> {
  try {
    const result = await query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return false;
    }
    
    const hashedPassword = result.rows[0].password;
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error validating password:', error);
    throw error;
  }
}

/**
 * Update user profile information
 */
export async function updateUserProfile(userId: string, name: string): Promise<User | null> {
  try {
    const now = new Date();
    const result = await query(
      `UPDATE users 
       SET name = $1, updated_at = $2 
       WHERE id = $3 
       RETURNING id, name, email, role, created_at, updated_at`,
      [name, now, userId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      role: result.rows[0].role,
      createdAt: new Date(result.rows[0].created_at),
      updatedAt: new Date(result.rows[0].updated_at)
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, role: 'doctor' | 'patient'): Promise<User | null> {
  try {
    const now = new Date();
    const result = await query(
      `UPDATE users 
       SET role = $1, updated_at = $2 
       WHERE id = $3 
       RETURNING id, name, email, role, created_at, updated_at`,
      [role, now, userId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      role: result.rows[0].role,
      createdAt: new Date(result.rows[0].created_at),
      updatedAt: new Date(result.rows[0].updated_at)
    };
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

/**
 * Mark all existing users without a role as patients
 */
export async function markExistingUsersAsPatients(): Promise<boolean> {
  try {
    await query(
      `UPDATE users 
       SET role = 'patient' 
       WHERE role IS NULL OR role = ''`
    );
    
    return true;
  } catch (error) {
    console.error('Error marking existing users as patients:', error);
    return false;
  }
}

/**
 * Save a chat message to the database
 */
export async function saveChatMessage(userId: string, message: string, role: 'user' | 'system'): Promise<boolean> {
  try {
    const messageId = uuidv4();
    await query(
      `INSERT INTO chat_history (id, user_id, message, role) 
       VALUES ($1, $2, $3, $4)`,
      [messageId, userId, message, role]
    );
    
    return true;
  } catch (error) {
    console.error('Error saving chat message:', error);
    return false;
  }
}

/**
 * Get a user's chat history
 */
export async function getChatHistory(userId: string, limit: number = 20): Promise<any[]> {
  try {
    const result = await query(
      `SELECT id, message, role, timestamp 
       FROM chat_history 
       WHERE user_id = $1 
       ORDER BY timestamp DESC 
       LIMIT $2`,
      [userId, limit]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      content: row.message,
      role: row.role,
      timestamp: new Date(row.timestamp)
    }));
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    return [];
  }
}


/**
 * Creates an admin user (should only be used in a controlled environment)
 */
export async function createAdminUser(userData: SignUpData): Promise<User | null> {
  try {
    console.log('Creating admin user with email:', userData.email);
    
    // Check if email already exists
    const emailCheckResult = await query(
      'SELECT * FROM users WHERE email = $1',
      [userData.email.toLowerCase()]
    );
    
    if (emailCheckResult.rows.length > 0) {
      console.log('Email already exists:', userData.email);
      return null; // Email already exists
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Generate UUID for the new user
    const userId = uuidv4();
    const now = new Date();
    
    // Force role to be admin
    const role = 'admin';
    
    console.log('Inserting new admin user with ID:', userId);
    
    // Insert the new admin user
    const result = await query(
      `INSERT INTO users (id, name, email, password, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, name, email, role, created_at, updated_at`,
      [
        userId,
        userData.name,
        userData.email.toLowerCase(),
        hashedPassword,
        role,
        now,
        now
      ]
    );
    
    if (result.rows.length > 0) {
      console.log('Admin user created successfully:', result.rows[0].email);
      // Convert the returned row to a User object
      return {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        role: result.rows[0].role,
        createdAt: new Date(result.rows[0].created_at),
        updatedAt: new Date(result.rows[0].updated_at)
      };
    }
    
    console.log('Admin user creation failed, no rows returned');
    return null;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

/**
 * Check if a user is an admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const result = await query(
      'SELECT role FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return false;
    }
    
    return result.rows[0].role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Verify a doctor's account (admin only)
 */
export async function verifyDoctorAccount(doctorId: string, adminId: string): Promise<boolean> {
  try {
    // First check if the requester is an admin
    const adminCheck = await isAdmin(adminId);
    
    if (!adminCheck) {
      console.error('Non-admin user attempted to verify doctor account');
      return false;
    }
    
    // Update the doctor's account (for now just making sure they have the doctor role)
    const result = await query(
      `UPDATE users 
       SET role = 'doctor', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 AND role = 'doctor'
       RETURNING id`,
      [doctorId]
    );
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error verifying doctor account:', error);
    return false;
  }
}

/**
 * Get all users with doctor role (for admin verification)
 */
export async function getAllDoctors(): Promise<User[]> {
  try {
    const result = await query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE role = $1',
      ['doctor']
    );
    
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }));
  } catch (error) {
    console.error('Error getting all doctors:', error);
    return [];
  }
}