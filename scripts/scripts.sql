-- 1. Create or modify the users table with the role column
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'patient' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. In case the table already exists but is missing the role column
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'patient' NOT NULL;

-- 3. Create the chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  role VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- 4. Update any existing users to have the patient role
UPDATE users
SET role = 'patient'
WHERE role IS NULL OR role = '';





-- Update users table to allow admin role
ALTER TABLE users 
  DROP CONSTRAINT IF EXISTS check_role;

ALTER TABLE users
  ADD CONSTRAINT check_role CHECK (role IN ('patient', 'doctor', 'admin'));

-- Create blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  slug VARCHAR(255) UNIQUE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  CONSTRAINT fk_author
    FOREIGN KEY(author_id) 
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- SQL script to create an admin user
-- Replace the values here with your desired admin credentials
-- Note: In a real scenario, you would use a secure method to generate the password hash
-- rather than storing it in plaintext in a SQL file

-- Variables (these would be replaced with actual values)
-- Admin UUID - should be a real UUID in production

-- Simpler version without PL/pgSQL (if your database doesn't support it)
-- This checks if the user exists, and if not, creates it
INSERT INTO users (
  id, 
  name, 
  email, 
  password, 
  role, 
  created_at, 
  updated_at
) 
SELECT 
  '33333333-3333-3333-3333-333333333333', -- admin UUID
  'System Administrator', -- name
  'example@example.com', -- email (will be converted to lowercase)
  '$2a$10$XJ9Sdl4WgAwNFPD6kQ5QSu8h4mZxF1KNMrjuv.MAIm80TA5wrR7U6', -- hasched password
  'admin', -- role
  CURRENT_TIMESTAMP, -- created_at
  CURRENT_TIMESTAMP -- updated_at
WHERE 
  NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@admin.com'
  )
ON CONFLICT (email) DO 
  UPDATE SET role = 'admin';