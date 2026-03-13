# Randevu — Doctor Appointment Booking System

A full-stack doctor appointment booking platform built with **Next.js 15**, **TypeScript**, and **PostgreSQL**. Patients browse verified doctors, check real-time availability, and book appointments. Doctors manage their schedules and patient appointments. Admins verify and oversee the platform.

## Screenshots

### Login
![Login Page](./screenshots/login%20page.png)

### Patient View
![Patient Page](./screenshots/patient%20page.png)

### Doctor Dashboard
![Doctor Page](./screenshots/doctor%20page.png)

### Admin Panel
![Admin Page](./screenshots/admin%20page.png)

---

## Tech Stack

| Layer       | Technology                           |
|-------------|--------------------------------------|
| Framework   | Next.js 15 (App Router, Turbopack)   |
| Language    | TypeScript 5                         |
| Database    | PostgreSQL (Neon recommended)        |
| Auth        | JWT + HTTP-only cookies              |
| Styling     | Tailwind CSS v4                      |
| UI          | Headless UI, Lucide Icons            |
| State       | React Context API                    |

---

## Features

### Patient
- Browse verified doctors filtered by specialization and city
- View doctor profiles (bio, education, experience, fees)
- See real-time available time slots (30-minute increments)
- Book, view, and cancel appointments

### Doctor
- Complete professional profile (credentials, fees, clinic)
- Set recurring weekly availability
- View, confirm, complete, or cancel appointments
- Add consultation notes
- Appears in search only after admin verification

### Admin
- Verify and manage doctor accounts
- Oversee all platform users

---

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd randevu
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

See [docs/CONFIGURATION.md](./docs/CONFIGURATION.md) for all variables.

### 3. Initialize database

```bash
node scripts/setup-db.js
```

See [docs/DATABASE.md](./docs/DATABASE.md) for database setup options.

### 4. Run

```bash
npm run dev
# Open http://localhost:3000
```

---

## Documentation

| Document | Description |
|---|---|
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Deploy to Vercel, Railway, or VPS |
| [docs/DATABASE.md](./docs/DATABASE.md) | Database setup (Neon, Supabase, local) |
| [docs/CONFIGURATION.md](./docs/CONFIGURATION.md) | Environment variables reference |
| [docs/LOCAL_DEVELOPMENT.md](./docs/LOCAL_DEVELOPMENT.md) | Local dev setup and project structure |

---

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/signin` | Sign in |
| GET | `/api/auth/me` | Get current user |

### Doctors
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/doctors` | List verified doctors (filterable) |
| GET | `/api/doctors/[id]` | Get doctor details |
| GET | `/api/doctors/profile` | Own profile (doctor only) |
| POST | `/api/doctors/profile` | Create/update profile (doctor only) |

### Appointments
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/appointments` | List user's appointments |
| POST | `/api/appointments` | Book appointment (patient only) |
| GET | `/api/appointments/[id]` | Get appointment details |
| PATCH | `/api/appointments/[id]` | Update appointment |
| DELETE | `/api/appointments/[id]` | Cancel appointment |

### Availability
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/availability?doctorId=X` | Get doctor schedule |
| GET | `/api/availability?doctorId=X&date=YYYY-MM-DD` | Get available slots for date |
| POST | `/api/availability` | Set schedule (doctor only) |

### Admin
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/doctors` | List all doctors |
| POST | `/api/admin/doctors/verify` | Verify a doctor |
| POST | `/api/admin/create-admin` | Create admin account |

---

## Appointment Lifecycle

```
pending → confirmed → completed
                  ↘ cancelled
                  ↘ no_show
```

---

## Customization

**Appointment duration** — default is 30 minutes. Change in `src/lib/appointment-db.ts` → `getAvailableTimeSlots`.

**Email notifications** — not included. Integrate [Resend](https://resend.com), SendGrid, or Amazon SES.

**Payments** — not included. Integrate Stripe or PayPal for paid consultations.

---

## License

MIT — see [LICENSE](./LICENSE)
