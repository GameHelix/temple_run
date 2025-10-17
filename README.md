# Randevu - Doctor Appointment System

A modern, full-stack doctor appointment booking platform built with Next.js, TypeScript, and PostgreSQL. Randevu connects patients with verified doctors, making healthcare more accessible through easy online appointment scheduling.

## Core Problem Solved

**Randevu solves the challenge of finding and booking doctor appointments online.** Patients can browse verified doctors by specialization and location, view available time slots, and book appointments instantly. Doctors can manage their availability and appointments through a simple dashboard.

## Screenshots

### Login Page
![Login Page](./screenshots/login%20page.png)
*User authentication interface for patients, doctors, and administrators*

### Signup Page
![Signup Page](./screenshots/signup%20page.png)
*Registration interface for new users to create accounts*

### Patient Interface
![Patient Page](./screenshots/patient%20page.png)
*Patient dashboard for browsing doctors and managing appointments*

### Doctor Dashboard
![Doctor Page](./screenshots/doctor%20page.png)
*Doctor interface for managing availability and appointments*

### Admin Panel
![Admin Page](./screenshots/admin%20page.png)
*Administrator dashboard for verifying doctors and overseeing the platform*

## Features

### For Patients
- Browse verified doctors by specialization and city
- View doctor profiles with experience, education, and consultation fees
- See real-time available time slots
- Book appointments online
- View and manage upcoming/past appointments
- Cancel appointments with reason

### For Doctors
- Create and manage professional profile
- Set weekly availability schedule
- View and manage appointments
- Confirm, complete, or cancel appointments
- Add consultation notes
- Require admin verification before appearing in search

### For Administrators
- Verify/unverify doctor accounts
- Oversee platform operations
- Manage user roles

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT with HTTP-only cookies
- **Styling**: Tailwind CSS v4
- **UI Components**: Headless UI, Lucide Icons
- **State Management**: React Context API

## Database Schema

### Tables

1. **users** - User accounts (patients, doctors, admins)
2. **doctor_profiles** - Doctor professional information
3. **availability_schedule** - Doctor weekly availability
4. **appointments** - Appointment bookings

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd randevu
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and fill in your values:
   ```env
   # PostgreSQL Database Connection String
   DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

   # JWT Secret (generate a strong random string)
   JWT_SECRET="your_jwt_secret_key_here"

   # Application URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Admin Creation Key (for creating admin accounts)
   ADMIN_CREATION_KEY="your_secure_admin_key_here"
   ```

4. Initialize the database:
   ```bash
   # Run the setup script to create schema and tables
   node scripts/setup-db.js
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
randevu/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes
│   │   │   ├── appointments/   # Appointment endpoints
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── availability/   # Availability endpoints
│   │   │   ├── doctors/        # Doctor endpoints
│   │   │   └── admin/          # Admin endpoints
│   │   ├── admin/              # Admin pages
│   │   ├── auth/               # Auth pages (signin/signup)
│   │   ├── doctor/             # Doctor dashboard pages
│   │   ├── appointments/       # Patient appointment pages
│   │   ├── doctors/            # Doctor listing and profiles
│   │   └── profile/            # User profile page
│   ├── components/             # React components
│   │   ├── admin/              # Admin components
│   │   ├── auth/               # Auth forms
│   │   └── doctor/             # Doctor components
│   ├── context/                # React Context
│   │   └── AuthContext.tsx     # Authentication state
│   ├── lib/                    # Core logic
│   │   ├── db.ts               # Database connection
│   │   ├── doctor-db.ts        # Doctor operations
│   │   ├── appointment-db.ts   # Appointment operations
│   │   ├── availability-db.ts  # Availability operations
│   │   ├── user-db.ts          # User operations
│   │   ├── jwt.ts              # JWT utilities
│   │   └── edge-jwt.ts         # Edge-compatible JWT
│   ├── types/                  # TypeScript types
│   │   └── user.ts             # Type definitions
│   └── middleware.ts           # Route protection
├── scripts/
│   └── scripts.sql             # Database schema
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in
- `GET /api/auth/me` - Get current user info

### Doctors
- `GET /api/doctors` - List verified doctors (with filters)
- `GET /api/doctors/[id]` - Get doctor details
- `GET /api/doctors/profile` - Get own profile (doctor only)
- `POST /api/doctors/profile` - Create/update profile (doctor only)

### Appointments
- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Book appointment (patient only)
- `GET /api/appointments/[id]` - Get appointment details
- `PATCH /api/appointments/[id]` - Update appointment
- `DELETE /api/appointments/[id]` - Cancel appointment

### Availability
- `GET /api/availability?doctorId=X` - Get doctor availability
- `GET /api/availability?doctorId=X&date=YYYY-MM-DD` - Get available time slots
- `POST /api/availability` - Set availability (doctor only)

### Admin
- `GET /api/admin/doctors` - Get all doctors (admin only)
- `POST /api/admin/doctors/verify` - Verify doctor (admin only)
- `POST /api/admin/create-admin` - Create admin account

## User Roles

### Patient
- Default role for new signups
- Can browse doctors and book appointments
- Can view and manage their appointments

### Doctor
- Must complete profile after signup
- Requires admin verification to appear in search
- Can set availability and manage appointments

### Admin
- Created via `/api/admin/create-admin` with ADMIN_CREATION_KEY
- Can verify/unverify doctors
- Full platform oversight
- Default admin: `admin@randevu.com` / `admin123`

## Key Features Detail

### Appointment Booking Flow
1. Patient browses verified doctors
2. Selects doctor and views profile
3. Picks date and sees available time slots
4. Books appointment with optional notes
5. Appointment created with "pending" status

### Doctor Verification
1. Doctor signs up and completes profile
2. Admin reviews doctor credentials
3. Admin verifies doctor account
4. Doctor appears in patient search results

### Availability Management
- Doctors set recurring weekly schedules
- Define day of week, start time, and end time
- System generates 30-minute time slots
- Automatically excludes booked slots

### Appointment States
- **pending**: Initial state after booking
- **confirmed**: Doctor confirmed the appointment
- **completed**: Appointment finished
- **cancelled**: Cancelled by patient or doctor
- **no_show**: Patient didn't attend

## Customization

### Adding Specializations
Specializations are free-text fields. Popular ones will appear in filters automatically as doctors use them.

### Changing Appointment Duration
Default is 30 minutes. Modify in `src/lib/appointment-db.ts` in the `getAvailableTimeSlots` function.

### Email Notifications
Currently not implemented. Consider integrating:
- Resend
- SendGrid
- Amazon SES

### Payment Integration
For paid consultations, consider:
- Stripe
- PayPal
- Square

## Environment Variables

See `.env.example` for a complete list. Required variables:

```env
# Required
DATABASE_URL=         # PostgreSQL connection string
JWT_SECRET=           # Secret for JWT tokens
NEXT_PUBLIC_APP_URL=  # Base URL of your application

# Optional
ADMIN_CREATION_KEY=   # Key for creating admin accounts (default: secure-admin-key)
```

## Security

- Passwords hashed with bcrypt
- JWT tokens stored in HTTP-only cookies
- Route protection via middleware
- Role-based access control
- SQL injection protection via parameterized queries

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please create an issue in the GitHub repository.

---

**Randevu** - Making healthcare accessible, one appointment at a time.
