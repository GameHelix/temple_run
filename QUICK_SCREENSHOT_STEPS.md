# Quick Screenshot Steps

## You Need to Manually Take 18 Screenshots

The folders exist but are EMPTY. Follow these steps:

## Step 1: Start Your Application
```bash
cd /Users/ismatsamadov/randevu
npm run dev
```

## Step 2: Take Screenshots One by One

### Patient Screenshots (6 total)

#### 1. Patient Dashboard
- Login as: `testpatient@gmail.com`
- Navigate to: `http://localhost:3000/dashboard`
- Take screenshot: **Cmd+Shift+4** (Mac) or **Win+Shift+S** (Windows)
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/patient/dashboard.png`

#### 2. Doctors List
- Navigate to: `http://localhost:3000/doctors`
- Take screenshot
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/patient/doctors-list.png`

#### 3. Doctor Profile
- Click on a doctor or go to: `http://localhost:3000/doctors/[doctor-id]`
- Take screenshot
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/patient/doctor-profile.png`

#### 4. Book Appointment
- On doctor profile page, scroll to booking form
- Take screenshot of the booking section
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/patient/book-appointment.png`

#### 5. My Appointments
- Navigate to: `http://localhost:3000/appointments`
- Take screenshot
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/patient/appointments.png`

#### 6. Patient Profile
- Navigate to: `http://localhost:3000/profile`
- Take screenshot
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/patient/profile.png`

---

### Doctor Screenshots (7 total)

#### 7. Doctor Dashboard
- Logout, login as: `testdoctor@gmail.com`
- Navigate to: `http://localhost:3000/doctor/dashboard`
- Take screenshot
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/doctor/dashboard.png`

#### 8. Profile Setup
- Navigate to: `http://localhost:3000/doctor/profile-setup`
- Take screenshot
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/doctor/profile-setup.png`

#### 9. Profile Pending
- Navigate to: `http://localhost:3000/profile` (if unverified)
- Take screenshot showing blue "pending" banner
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/doctor/profile-pending.png`

#### 10. Profile Verified
- Navigate to: `http://localhost:3000/profile` (if verified)
- Take screenshot showing green "verified" banner
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/doctor/profile-verified.png`

#### 11. Appointments Management
- Navigate to: `http://localhost:3000/doctor/appointments`
- Take screenshot
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/doctor/appointments.png`

#### 12. Schedule Management
- Navigate to: `http://localhost:3000/doctor/schedule`
- Take screenshot
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/doctor/schedule.png`

#### 13. Patients List
- Navigate to: `http://localhost:3000/doctor/patients`
- Take screenshot
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/doctor/patients.png`

---

### Admin Screenshots (5 total)

#### 14. Admin Dashboard
- Logout, login as: `admin@ihealth.ink`
- Navigate to: `http://localhost:3000/admin/dashboard`
- Take screenshot
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/admin/dashboard.png`

#### 15. Doctors Management
- Navigate to: `http://localhost:3000/admin/doctors`
- Take screenshot
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/admin/doctors.png`

#### 16. Doctor Verification
- Stay on doctors page, highlight verify button area
- Take screenshot
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/admin/doctor-verify.png`

#### 17. Users Management
- Navigate to: `http://localhost:3000/admin/users` (if page exists)
- Take screenshot
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/admin/users.png`
- **Skip if page doesn't exist**

#### 18. Appointments Overview
- Navigate to: `http://localhost:3000/admin/appointments` (if page exists)
- Take screenshot
- Save as: `/Users/ismatsamadov/randevu/public/screenshots/admin/appointments.png`
- **Skip if page doesn't exist**

---

## Step 3: Verify Screenshots

Check that files are saved:
```bash
ls -la /Users/ismatsamadov/randevu/public/screenshots/patient/
ls -la /Users/ismatsamadov/randevu/public/screenshots/doctor/
ls -la /Users/ismatsamadov/randevu/public/screenshots/admin/
```

## Step 4: Activate Gallery

Edit file: `/Users/ismatsamadov/randevu/src/app/screenshots/page.tsx`

Find this code (around line 330):
```tsx
{/* Uncomment when screenshots are added:
<Image
  src={screenshot.path}
  alt={screenshot.title}
  fill
  className="object-cover"
/>
*/}
```

Change to:
```tsx
<Image
  src={screenshot.path}
  alt={screenshot.title}
  fill
  className="object-cover"
/>
```

## Step 5: View Gallery

Visit: `http://localhost:3000/screenshots`

---

## Screenshot Tips (macOS)

### Method 1: Cmd+Shift+4
1. Press **Cmd+Shift+4**
2. Drag to select area
3. Screenshot saves to Desktop
4. Move file to correct folder and rename

### Method 2: Cmd+Shift+4, then Space
1. Press **Cmd+Shift+4**, then press **Space**
2. Click on browser window
3. Gets entire window with shadow
4. Move file to correct folder and rename

### Method 3: Use Preview
1. Open Preview app
2. File → Take Screenshot → From Selected Window
3. Save directly to correct folder

---

## Need Help?

If a page doesn't exist, skip it. The gallery will still work with partial screenshots.

Minimum recommended screenshots:
- Patient: dashboard, doctors-list, appointments
- Doctor: dashboard, appointments, profile-verified
- Admin: dashboard, doctors
