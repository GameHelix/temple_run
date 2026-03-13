# Local Development

## Prerequisites

- Node.js 18 or later
- A PostgreSQL database (local or hosted — see [DATABASE.md](./DATABASE.md))
- npm

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values. At minimum you need:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/randevu"
JWT_SECRET="any-random-string-for-dev"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_CREATION_KEY="dev-admin-key"
```

### 3. Initialize the database

```bash
node scripts/setup-db.js
```

This creates all tables and a default admin account. See [DATABASE.md](./DATABASE.md) for credentials.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command                    | Description                              |
|----------------------------|------------------------------------------|
| `npm run dev`              | Start dev server with Turbopack          |
| `npm run build`            | Build for production                     |
| `npm start`                | Start production server                  |
| `npm run lint`             | Run ESLint                               |
| `node scripts/setup-db.js` | Initialize / reset database schema       |

---

## Project Structure

```
randevu/
├── docs/                   # Documentation (you are here)
├── public/                 # Static assets, PWA icons, manifest
├── scripts/
│   ├── scripts.sql         # Database schema
│   └── setup-db.js         # Schema migration runner
└── src/
    ├── app/
    │   ├── api/            # API routes (Next.js route handlers)
    │   │   ├── admin/      # Admin-only endpoints
    │   │   ├── appointments/
    │   │   ├── auth/
    │   │   ├── availability/
    │   │   └── doctors/
    │   ├── admin/          # Admin UI pages
    │   ├── auth/           # Sign in / Sign up pages
    │   ├── doctor/         # Doctor dashboard pages
    │   ├── appointments/   # Patient appointments page
    │   ├── doctors/        # Doctor listing and profiles
    │   └── profile/        # User profile page
    ├── components/         # Reusable React components
    ├── context/
    │   └── AuthContext.tsx # Global auth state
    ├── lib/
    │   ├── db.ts           # PostgreSQL connection pool
    │   ├── jwt.ts          # JWT sign / verify (Node.js runtime)
    │   ├── edge-jwt.ts     # JWT verify (Edge runtime, middleware)
    │   ├── user-db.ts      # User database operations
    │   ├── doctor-db.ts    # Doctor database operations
    │   ├── appointment-db.ts
    │   ├── availability-db.ts
    │   └── schedule-db.ts
    ├── middleware.ts        # Route protection
    └── types/user.ts       # TypeScript types
```

---

## User Roles

| Role      | How to get it                              | Access                                    |
|-----------|--------------------------------------------|-------------------------------------------|
| `patient` | Default on sign-up                         | Browse doctors, book and manage appointments |
| `doctor`  | Select "Register as Doctor" on sign-up     | Set availability, manage appointments (requires admin verification) |
| `admin`   | Created via API with `ADMIN_CREATION_KEY`  | Verify doctors, manage platform           |

---

## Typical Development Workflow

1. Sign up as a **patient** to test the patient flow
2. Sign up as a **doctor**, complete the profile at `/doctor/profile-setup`
3. Sign in as **admin** (default account from setup) and verify the doctor at `/admin/doctors`
4. As the doctor, set availability at `/doctor/schedule`
5. As the patient, book an appointment at `/doctors`

---

## Linting

```bash
npm run lint
```

The project uses ESLint with the Next.js recommended config.
