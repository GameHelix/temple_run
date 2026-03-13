# Database Setup

Randevu uses PostgreSQL. We recommend [Neon](https://neon.tech) for a free managed serverless PostgreSQL instance, but any PostgreSQL 14+ provider works.

---

## 1. Create a PostgreSQL Database

### Option A — Neon (recommended, free tier available)

1. Go to [neon.tech](https://neon.tech) and create an account
2. Click **New Project**
3. Give your project a name (e.g. `randevu`)
4. Copy the connection string — it looks like:
   ```
   postgresql://username:password@ep-something.region.aws.neon.tech/neondb?sslmode=require
   ```
5. Paste it as `DATABASE_URL` in your `.env` file

### Option B — Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database**
3. Copy the **Connection string (URI)** under the "URI" tab
4. Append `?sslmode=require` if not already present

### Option C — Local PostgreSQL

```bash
psql -U postgres -c "CREATE DATABASE randevu;"
```
Connection string: `postgresql://postgres:yourpassword@localhost:5432/randevu`

---

## 2. Run the Schema Migration

After setting `DATABASE_URL` in your `.env` file:

```bash
node scripts/setup-db.js
```

This runs `scripts/scripts.sql` which creates:
- `randevu.users` — all user accounts
- `randevu.doctor_profiles` — doctor credentials and profile
- `randevu.availability_schedule` — weekly recurring schedules
- `randevu.appointments` — appointment bookings
- All necessary indexes

---

## 3. Default Admin Account

The migration script creates a default admin user:

| Field    | Value                    |
|----------|--------------------------|
| Email    | `admin@randevu.com`      |
| Password | `admin123`               |
| Role     | `admin`                  |

**Change this password immediately after your first login.**

You can create additional admin accounts via the API:

```bash
curl -X POST https://your-domain.com/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "you@example.com",
    "password": "StrongPassword123!",
    "adminKey": "YOUR_ADMIN_CREATION_KEY"
  }'
```

---

## 4. Optional Sample Data

The SQL file includes two sample verified doctors (commented out by default). To seed them, open `scripts/scripts.sql` and uncomment the block at the bottom labeled `-- 7. Sample doctor data`.

---

## 5. Schema Overview

```
randevu.users
  id, name, email, password (bcrypt), role (patient|doctor|admin)

randevu.doctor_profiles
  user_id → users.id, specialization, bio, education,
  experience_years, consultation_fee, clinic_name, city, is_verified

randevu.availability_schedule
  doctor_id → users.id, day_of_week (0-6), start_time, end_time, is_available

randevu.appointments
  doctor_id, patient_id → users.id,
  appointment_date, appointment_time, duration_minutes (default 30),
  status (pending|confirmed|cancelled|completed|no_show),
  patient_notes, doctor_notes, cancellation_reason
```

---

## 6. Resetting the Database

To drop and recreate all tables (destructive — development only):

```sql
DROP SCHEMA randevu CASCADE;
```

Then run `node scripts/setup-db.js` again.
