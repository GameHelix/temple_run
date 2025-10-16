# Screenshot Capture Guide

This guide provides a step-by-step process to capture all screenshots for the application gallery.

## Prerequisites

1. Have test accounts ready:
   - Patient: testpatient@gmail.com
   - Doctor: testdoctor@gmail.com (verified)
   - Admin: admin@ihealth.ink

2. Ensure doctor has:
   - Complete profile
   - Available schedule
   - Some test appointments

3. Screenshot settings:
   - Resolution: 1920x1080
   - Format: PNG
   - Browser: Chrome/Firefox in presentation mode
   - Hide bookmarks bar and extensions

## Screenshot Checklist

### Part 1: Patient Portal Screenshots

Login as: `testpatient@gmail.com`

- [ ] **1. Patient Dashboard** (`public/screenshots/patient/dashboard.png`)
  - Navigate to: `/dashboard`
  - Show: Upcoming appointments, quick stats

- [ ] **2. Find Doctors** (`public/screenshots/patient/doctors-list.png`)
  - Navigate to: `/doctors`
  - Show: List of verified doctors with filters visible
  - Apply a filter to show functionality

- [ ] **3. Doctor Profile** (`public/screenshots/patient/doctor-profile.png`)
  - Navigate to: `/doctors/[testdoctor-id]`
  - Show: Complete doctor profile with booking form
  - Scroll to show both profile info and booking section

- [ ] **4. Book Appointment** (`public/screenshots/patient/book-appointment.png`)
  - Stay on: `/doctors/[testdoctor-id]`
  - Fill in the booking form (date, time, notes)
  - Show available time slots highlighted
  - **OR** create a dedicated booking modal screenshot if you have one

- [ ] **5. My Appointments** (`public/screenshots/patient/appointments.png`)
  - Navigate to: `/appointments`
  - Show: List with different appointment statuses (pending, confirmed, completed)
  - Apply "Upcoming" filter

- [ ] **6. Patient Profile** (`public/screenshots/patient/profile.png`)
  - Navigate to: `/profile`
  - Show: Patient information form filled out

### Part 2: Doctor Portal Screenshots

Login as: `testdoctor@gmail.com`

- [ ] **7. Doctor Dashboard** (`public/screenshots/doctor/dashboard.png`)
  - Navigate to: `/doctor/dashboard`
  - Show: Appointment stats, today's schedule, patient overview

- [ ] **8. Profile Setup** (`public/screenshots/doctor/profile-setup.png`)
  - Navigate to: `/doctor/profile-setup`
  - Show: Complete profile form with all fields
  - **Note**: If profile is already complete, you may need to take this from a fresh doctor account OR just show the filled form

- [ ] **9. Profile - Pending Verification** (`public/screenshots/doctor/profile-pending.png`)
  - Navigate to: `/profile` (as unverified doctor with complete profile)
  - Show: Blue banner indicating "Pending Verification"
  - **Note**: You'll need an unverified doctor account for this

- [ ] **10. Profile - Verified** (`public/screenshots/doctor/profile-verified.png`)
  - Navigate to: `/profile` (as verified doctor)
  - Show: Green banner indicating "Verified"

- [ ] **11. Appointment Management** (`public/screenshots/doctor/appointments.png`)
  - Navigate to: `/doctor/appointments`
  - Show: List of appointments with filters (Today, Upcoming, Past)
  - Show appointments with different statuses

- [ ] **12. Schedule Management** (`public/screenshots/doctor/schedule.png`)
  - Navigate to: `/doctor/schedule`
  - Show: Weekly availability grid with time slots
  - Show edit mode if available

- [ ] **13. Patients List** (`public/screenshots/doctor/patients.png`)
  - Navigate to: `/doctor/patients`
  - Show: List of patients with appointment history

### Part 3: Admin Panel Screenshots

Login as: `admin@ihealth.ink`

- [ ] **14. Admin Dashboard** (`public/screenshots/admin/dashboard.png`)
  - Navigate to: `/admin/dashboard`
  - Show: System statistics, charts, overview cards

- [ ] **15. Doctors Management** (`public/screenshots/admin/doctors.png`)
  - Navigate to: `/admin/doctors`
  - Show: List with both verified and unverified doctors
  - Show profile status column
  - Show "Verify" button states

- [ ] **16. Doctor Verification** (`public/screenshots/admin/doctor-verify.png`)
  - Stay on: `/admin/doctors`
  - Highlight the verification interface
  - **OR** capture verification modal/confirmation if available

- [ ] **17. Users Management** (`public/screenshots/admin/users.png`)
  - Navigate to: `/admin/users` (if exists)
  - Show: List of all users (patients, doctors, admins)
  - **Note**: If this page doesn't exist, skip it

- [ ] **18. Appointments Overview** (`public/screenshots/admin/appointments.png`)
  - Navigate to: `/admin/appointments` (if exists)
  - Show: All appointments across the system
  - **Note**: If this page doesn't exist, skip it

## Taking the Screenshot

### On macOS:
1. Press `Cmd + Shift + 5`
2. Select "Capture Selected Window" or "Capture Selected Portion"
3. Click on browser window
4. Screenshot saves to Desktop
5. Move to appropriate folder and rename

### On Windows:
1. Press `Win + Shift + S`
2. Select area
3. Screenshot copies to clipboard
4. Open Paint/Preview and paste
5. Save to appropriate folder

### On Linux:
1. Use `gnome-screenshot` or `flameshot`
2. Select area
3. Save to appropriate folder

## Tips for High-Quality Screenshots

1. **Full-screen browser**: Press F11 for full-screen (exit with F11 again)
2. **Hide dev tools**: Close any open developer tools
3. **Clean browser**: Use incognito/private mode for clean UI
4. **Realistic data**: Use meaningful test data, not "test test test"
5. **Consistent zoom**: Use 100% zoom (Cmd/Ctrl + 0)
6. **Good state**: Show pages with data, not empty states
7. **Multiple states**: Capture forms both empty and filled if helpful
8. **Timing**: Avoid loading spinners or transition states

## Post-Processing

After capturing all screenshots:

1. **Review** all images for quality and consistency
2. **Optimize** file sizes (use TinyPNG or ImageOptim)
3. **Verify** filenames match exactly as specified
4. **Test** by uncommenting the Image component in `/src/app/screenshots/page.tsx`

## Quick Optimization Command

If you have ImageMagick installed:

```bash
# Resize and optimize all screenshots
cd public/screenshots
find . -name "*.png" -exec mogrify -resize 1920x1080\> -quality 85 {} \;
```

## Activating the Screenshots

Once all screenshots are in place:

1. Open `src/app/screenshots/page.tsx`
2. Find line ~330 (the commented Image component)
3. Uncomment this block:
```tsx
<Image
  src={screenshot.path}
  alt={screenshot.title}
  fill
  className="object-cover"
/>
```
4. Remove the placeholder div above it
5. Run `npm run dev` and visit `/screenshots` to verify

## Need Help?

- Screenshots not showing? Check:
  - Filenames match exactly (case-sensitive)
  - Files are in correct directories
  - Image component is uncommented
  - No typos in paths

- Poor quality? Try:
  - Taking screenshots at higher resolution
  - Using lossless PNG format
  - Avoiding browser zoom/scaling
  - Using native screenshot tools
