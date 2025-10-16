// scripts/take-screenshots.js
// Automated screenshot capture using Puppeteer

const puppeteer = require('puppeteer');
const { Client } = require('pg');
require('dotenv').config();

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = './public/screenshots';

// Test account credentials
const ACCOUNTS = {
  patient: {
    email: 'testpatient@gmail.com',
    password: 'password123', // Default test password
  },
  doctor: {
    email: 'testdoctor@gmail.com',
    password: 'password123',
  },
  admin: {
    email: 'admin@ihealth.ink',
    password: 'admin123',
  },
};

// Screenshot definitions
const SCREENSHOTS = {
  patient: [
    { name: 'dashboard', path: '/dashboard', wait: 2000 },
    { name: 'doctors-list', path: '/doctors', wait: 2000 },
    { name: 'appointments', path: '/appointments', wait: 2000 },
    { name: 'profile', path: '/profile', wait: 2000 },
  ],
  doctor: [
    { name: 'dashboard', path: '/doctor/dashboard', wait: 2000 },
    { name: 'profile-setup', path: '/doctor/profile-setup', wait: 2000 },
    { name: 'profile-verified', path: '/profile', wait: 2000 },
    { name: 'appointments', path: '/doctor/appointments', wait: 2000 },
    { name: 'schedule', path: '/doctor/schedule', wait: 2000 },
    { name: 'patients', path: '/doctor/patients', wait: 2000 },
  ],
  admin: [
    { name: 'dashboard', path: '/admin/dashboard', wait: 2000 },
    { name: 'doctors', path: '/admin/doctors', wait: 2000 },
  ],
};

async function login(page, email, password) {
  console.log(`  🔐 Logging in as ${email}...`);

  try {
    // Go to login page
    await page.goto(`${BASE_URL}/auth/signin`, { waitUntil: 'domcontentloaded', timeout: 20000 });

    // Wait for form to be visible
    await page.waitForSelector('#email', { timeout: 10000 });

    // Fill in credentials
    await page.type('#email', email, { delay: 30 });
    await page.type('#password', password, { delay: 30 });

    // Click login button and wait for navigation
    await page.click('button[type="submit"]');

    // Wait for redirect (could go to dashboard, profile, etc)
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('  ✅ Logged in successfully');
  } catch (error) {
    console.log(`  ❌ Login failed: ${error.message}`);
    throw error;
  }
}

async function logout(page) {
  try {
    // Clear cookies to logout
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.log('  ⚠️  Logout warning:', error.message);
  }
}

async function takeScreenshot(page, category, screenshot) {
  console.log(`  📸 Taking screenshot: ${screenshot.name}`);

  try {
    // Navigate to page
    await page.goto(`${BASE_URL}${screenshot.path}`, {
      waitUntil: 'networkidle2',
      timeout: 10000
    });

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, screenshot.wait));

    // Take screenshot
    const filepath = `${SCREENSHOT_DIR}/${category}/${screenshot.name}.png`;
    await page.screenshot({
      path: filepath,
      fullPage: true,
    });

    console.log(`  ✅ Saved: ${filepath}`);
    return true;
  } catch (error) {
    console.log(`  ⚠️  Failed: ${screenshot.name} - ${error.message}`);
    return false;
  }
}

async function getDoctorId() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const result = await client.query(
      'SELECT id FROM randevu.users WHERE email = $1',
      ['testdoctor@gmail.com']
    );
    await client.end();

    if (result.rows.length > 0) {
      return result.rows[0].id;
    }
  } catch (error) {
    console.log('  ⚠️  Could not get doctor ID from database');
    await client.end();
  }
  return null;
}

async function capturePatientScreenshots(browser) {
  console.log('\n👤 PATIENT SCREENSHOTS');
  console.log('=' .repeat(50));

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Login as patient
  await login(page, ACCOUNTS.patient.email, ACCOUNTS.patient.password);

  // Take standard screenshots
  for (const screenshot of SCREENSHOTS.patient) {
    await takeScreenshot(page, 'patient', screenshot);
  }

  // Get doctor ID and take doctor profile screenshot
  const doctorId = await getDoctorId();
  if (doctorId) {
    console.log('  📸 Taking screenshot: doctor-profile');
    try {
      await page.goto(`${BASE_URL}/doctors/${doctorId}`, {
        waitUntil: 'networkidle2',
        timeout: 10000
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/patient/doctor-profile.png`,
        fullPage: true,
      });
      console.log(`  ✅ Saved: ${SCREENSHOT_DIR}/patient/doctor-profile.png`);

      // Scroll down to booking form for book-appointment screenshot
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await new Promise(resolve => setTimeout(resolve, 1000));
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/patient/book-appointment.png`,
        fullPage: false,
      });
      console.log(`  ✅ Saved: ${SCREENSHOT_DIR}/patient/book-appointment.png`);
    } catch (error) {
      console.log(`  ⚠️  Failed: doctor-profile - ${error.message}`);
    }
  }

  await logout(page);
  await page.close();
}

async function captureDoctorScreenshots(browser) {
  console.log('\n👨‍⚕️ DOCTOR SCREENSHOTS');
  console.log('=' .repeat(50));

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Login as doctor
  await login(page, ACCOUNTS.doctor.email, ACCOUNTS.doctor.password);

  // Take screenshots
  for (const screenshot of SCREENSHOTS.doctor) {
    await takeScreenshot(page, 'doctor', screenshot);
  }

  await logout(page);
  await page.close();
}

async function captureAdminScreenshots(browser) {
  console.log('\n🛡️  ADMIN SCREENSHOTS');
  console.log('=' .repeat(50));

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Login as admin
  await login(page, ACCOUNTS.admin.email, ACCOUNTS.admin.password);

  // Take screenshots
  for (const screenshot of SCREENSHOTS.admin) {
    await takeScreenshot(page, 'admin', screenshot);
  }

  // Additional admin screenshots
  console.log('  📸 Taking screenshot: doctor-verify');
  try {
    await page.goto(`${BASE_URL}/admin/doctors`, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/admin/doctor-verify.png`,
      fullPage: true,
    });
    console.log(`  ✅ Saved: ${SCREENSHOT_DIR}/admin/doctor-verify.png`);
  } catch (error) {
    console.log(`  ⚠️  Failed: doctor-verify - ${error.message}`);
  }

  await logout(page);
  await page.close();
}

async function main() {
  console.log('\n🚀 AUTOMATED SCREENSHOT CAPTURE');
  console.log('=' .repeat(50));
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`📁 Output: ${SCREENSHOT_DIR}\n`);

  console.log('⏳ Waiting for server to be ready...');
  console.log('   Make sure you have run: npm run dev\n');

  // Wait a bit for server to be ready
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // Capture all screenshots
    await capturePatientScreenshots(browser);
    await captureDoctorScreenshots(browser);
    await captureAdminScreenshots(browser);

    console.log('\n' + '=' .repeat(50));
    console.log('✅ SCREENSHOT CAPTURE COMPLETE!');
    console.log('=' .repeat(50));
    console.log('\n📋 Next steps:');
    console.log('1. Check screenshots in public/screenshots/');
    console.log('2. Uncomment Image component in src/app/screenshots/page.tsx');
    console.log('3. Visit http://localhost:3000/screenshots to view\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await browser.close();
  }
}

// Check if server is running before starting
async function checkServer() {
  try {
    const response = await fetch(BASE_URL);
    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.error('\n❌ ERROR: Development server is not running!');
    console.error('\n📌 Please start the server first:');
    console.error('   npm run dev\n');
    console.error('   Then run this script again.\n');
    process.exit(1);
  }
}

// Run
checkServer().then(() => {
  main().catch(console.error);
});
