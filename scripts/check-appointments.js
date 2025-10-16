// scripts/check-appointments.js
// Check appointments in database

const { Client } = require('pg');
require('dotenv').config();

async function checkAppointments() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    const email = 'testdoctor@gmail.com';

    // Get doctor user ID
    const userResult = await client.query(
      'SELECT id, name FROM randevu.users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log('❌ Doctor not found');
      await client.end();
      return;
    }

    const doctorId = userResult.rows[0].id;
    const doctorName = userResult.rows[0].name;

    console.log(`🔍 Checking appointments for: ${doctorName}`);
    console.log(`   Doctor ID: ${doctorId}\n`);

    // Get all appointments
    const allAppointments = await client.query(
      `SELECT a.*, p.name as patient_name, p.email as patient_email
       FROM randevu.appointments a
       INNER JOIN randevu.users p ON a.patient_id = p.id
       WHERE a.doctor_id = $1
       ORDER BY a.appointment_date, a.appointment_time`,
      [doctorId]
    );

    console.log('📋 ALL APPOINTMENTS:');
    console.log('-------------------');

    if (allAppointments.rows.length === 0) {
      console.log('❌ NO APPOINTMENTS FOUND!');
      console.log('\n💡 ISSUE: The appointment was not created in the database.');
    } else {
      console.log(`Total: ${allAppointments.rows.length}\n`);

      allAppointments.rows.forEach((apt, index) => {
        console.log(`${index + 1}. Appointment ID: ${apt.id}`);
        console.log(`   Patient: ${apt.patient_name} (${apt.patient_email})`);
        console.log(`   Date: ${apt.appointment_date}`);
        console.log(`   Time: ${apt.appointment_time}`);
        console.log(`   Status: ${apt.status}`);
        console.log(`   Duration: ${apt.duration_minutes} minutes`);
        console.log(`   Created: ${apt.created_at}`);
        if (apt.patient_notes) {
          console.log(`   Patient Notes: ${apt.patient_notes}`);
        }
        console.log('');
      });

      // Check upcoming appointments (today and future)
      const today = new Date().toISOString().split('T')[0];
      const upcoming = allAppointments.rows.filter(apt =>
        apt.appointment_date >= today &&
        (apt.status === 'pending' || apt.status === 'confirmed')
      );

      console.log('📅 UPCOMING APPOINTMENTS (Today onwards, pending/confirmed):');
      console.log('-------------------');
      console.log(`Count: ${upcoming.length}`);

      if (upcoming.length > 0) {
        upcoming.forEach((apt, index) => {
          console.log(`${index + 1}. ${apt.appointment_date} at ${apt.appointment_time} - ${apt.status}`);
        });
      }
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error);
    await client.end();
    process.exit(1);
  }
}

checkAppointments();
