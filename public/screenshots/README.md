# Screenshots Directory

This directory contains screenshots for the application's screenshots gallery page at `/screenshots`.

## Directory Structure

```
screenshots/
├── patient/          # Patient portal screenshots
├── doctor/           # Doctor portal screenshots
└── admin/            # Admin panel screenshots
```

## How to Add Screenshots

### 1. Take Screenshots

Navigate through the application and take screenshots of each major page/feature:

**Patient Portal:**
- `dashboard.png` - Patient dashboard
- `doctors-list.png` - Browse doctors page
- `doctor-profile.png` - Individual doctor profile
- `book-appointment.png` - Appointment booking form
- `appointments.png` - Patient appointments list
- `profile.png` - Patient profile page

**Doctor Portal:**
- `dashboard.png` - Doctor dashboard
- `profile-setup.png` - Profile setup page
- `profile-pending.png` - Profile pending verification
- `profile-verified.png` - Verified profile
- `appointments.png` - Doctor appointments management
- `schedule.png` - Weekly schedule management
- `patients.png` - Patients list

**Admin Panel:**
- `dashboard.png` - Admin dashboard
- `doctors.png` - Doctors management
- `doctor-verify.png` - Doctor verification interface
- `users.png` - Users management
- `appointments.png` - Appointments overview

### 2. Save Screenshots

Save each screenshot in the appropriate subdirectory with the exact filename listed above.

**Recommended screenshot settings:**
- Format: PNG (for better quality)
- Resolution: 1920x1080 or higher
- Make sure no sensitive personal data is visible
- Use test accounts with sample data

### 3. Optimize Images

Before adding to the repository, optimize images to reduce file size:

```bash
# Using imagemagick
mogrify -resize 1920x1080 -quality 85 screenshots/**/*.png

# Or using online tools like TinyPNG
```

### 4. Update the Gallery

After adding screenshots, uncomment the `Image` component in `src/app/screenshots/page.tsx`:

Find this section:
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

And change it to:
```tsx
<Image
  src={screenshot.path}
  alt={screenshot.title}
  fill
  className="object-cover"
/>
```

### 5. Test the Gallery

Run the development server and navigate to `/screenshots` to verify all images load correctly:

```bash
npm run dev
```

Then visit: http://localhost:3000/screenshots

## Tips for Better Screenshots

1. **Use consistent browser window size** - Take all screenshots at the same resolution
2. **Hide browser UI** - Use browser's presentation mode or full-screen
3. **Use realistic test data** - Fill forms and pages with believable sample data
4. **Show various states** - Capture different UI states (empty, loading, filled, error, etc.)
5. **Maintain privacy** - Don't include real patient or doctor information
6. **Good lighting** - Ensure the UI is clearly visible with proper contrast

## Example Screenshot Workflow

```bash
# 1. Login as patient
# 2. Navigate to dashboard
# 3. Press F12 (Dev Tools) > Device Toolbar > Set to 1920x1080
# 4. Take screenshot (Cmd+Shift+5 on Mac, Win+Shift+S on Windows)
# 5. Save as: public/screenshots/patient/dashboard.png
# 6. Repeat for all pages
```

## File Naming Convention

- Use lowercase
- Use hyphens for spaces (e.g., `doctor-profile.png` not `doctor_profile.png`)
- Be descriptive but concise
- Match the paths specified in `src/app/screenshots/page.tsx`
