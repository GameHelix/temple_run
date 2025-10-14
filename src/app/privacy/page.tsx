// src/app/privacy/page.tsx
export const metadata = {
  title: 'Privacy Policy | Randevu',
  description: 'Learn how Randevu handles your data and protects your privacy',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide when creating an account, booking appointments, or using our services, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Personal information (name, email, phone number)</li>
            <li>Health information related to appointments</li>
            <li>Doctor profiles and credentials</li>
            <li>Appointment history and preferences</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Facilitate appointment bookings between patients and doctors</li>
            <li>Send appointment reminders and notifications</li>
            <li>Improve our services and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
          <p className="mb-4">
            We implement industry-standard security measures to protect your personal and health information.
            Your data is encrypted in transit and at rest.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
          <p className="mb-4">
            We do not sell your personal information. We only share your information with:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Healthcare providers you book appointments with</li>
            <li>Service providers who help us operate our platform</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your account</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy, please contact us through our support channels.
          </p>
        </section>
      </div>
    </div>
  );
}