// src/app/terms/page.tsx
export const metadata = {
  title: 'Terms of Service | Randevu',
  description: 'Terms and conditions for using the Randevu application',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using Randevu, you accept and agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4">
            Randevu is a platform that connects patients with healthcare providers for appointment scheduling.
            We facilitate bookings but do not provide medical services directly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="mb-4">You are responsible for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and up-to-date information</li>
            <li>Notifying us of any unauthorized use of your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Appointments</h2>
          <p className="mb-4">
            Patients must provide accurate information when booking appointments.
            Doctors must maintain accurate availability schedules and honor confirmed appointments.
            Cancellations should be made as early as possible.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Doctor Verification</h2>
          <p className="mb-4">
            Doctors must provide valid credentials and license information.
            We verify doctor credentials, but patients should always confirm qualifications independently.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Medical Disclaimer</h2>
          <p className="mb-4">
            Randevu is a scheduling platform only. We do not provide medical advice, diagnosis, or treatment.
            Always seek professional medical advice for health concerns.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Prohibited Activities</h2>
          <p className="mb-4">You may not:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Use the platform for unlawful purposes</li>
            <li>Impersonate others or provide false information</li>
            <li>Interfere with the platform's operation</li>
            <li>Attempt to gain unauthorized access to our systems</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">
            Randevu is not liable for the quality of medical services provided by healthcare professionals
            on our platform. We are a technology platform facilitating connections only.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
          <p className="mb-4">
            We may modify these terms at any time. Continued use of the platform after changes
            constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
          <p className="mb-4">
            For questions about these Terms of Service, please contact us through our support channels.
          </p>
        </section>
      </div>
    </div>
  );
}