'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-gray-800/60 backdrop-blur-sm p-8 rounded-lg shadow border border-gray-700">
        <Link 
          href="/" 
          className="text-blue-400 hover:text-blue-300 inline-flex items-center mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-indigo-100 mb-6">Privacy Policy</h1>
        
        <div className="space-y-6 text-indigo-200">
          <section>
            <h2 className="text-xl font-semibold text-indigo-100 mb-3">1. Introduction</h2>
            <p>
              Welcome to the Healthcare Assistant (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>
            <p className="mt-2">
              Please read this Privacy Policy carefully. By accessing or using our application, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-indigo-100 mb-3">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-indigo-100 mb-2">2.1 Personal Information</h3>
            <p>
              We may collect personal information that you voluntarily provide to us when you register with the application, such as:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Password (stored in encrypted form)</li>
            </ul>
            
            <h3 className="text-lg font-medium text-indigo-100 mb-2 mt-4">2.2 Health-Related Information</h3>
            <p>
              When you use our chatbot feature, we may collect:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Your questions and conversations with our healthcare assistant</li>
              <li>Information about health topics you&apos;re interested in</li>
            </ul>
            
            <h3 className="text-lg font-medium text-indigo-100 mb-2 mt-4">2.3 Usage Information</h3>
            <p>
              We automatically collect certain information about your device and how you interact with our application, including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>IP address</li>
              <li>Device type and operating system</li>
              <li>Browser type</li>
              <li>Pages visited and features used</li>
              <li>Time and date of your visits</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-indigo-100 mb-3">3. How We Use Your Information</h2>
            <p>
              We may use the information we collect for various purposes, including to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Create and manage your account</li>
              <li>Process your requests and respond to your inquiries</li>
              <li>Personalize your experience and provide tailored content</li>
              <li>Develop new features and functionality</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Protect against unauthorized access and ensure the security of our application</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-indigo-100 mb-3">4. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Service Providers:</strong> We may share information with third-party vendors and service providers who assist us in operating our application and conducting our business.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required to do so by law or in response to valid requests by public authorities.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of the transaction.</li>
              <li><strong>With Your Consent:</strong> We may share your information with third parties when you explicitly consent to such sharing.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-indigo-100 mb-3">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-indigo-100 mb-3">6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your personal information, we will securely delete or anonymize it.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-indigo-100 mb-3">7. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate or incomplete information</li>
              <li>The right to delete your personal information</li>
              <li>The right to restrict or object to processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, please contact us using the information provided in the &ldquo;Contact Us&rdquo; section.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-indigo-100 mb-3">8. Children&apos;s Privacy</h2>
            <p>
              Our application is not intended for use by children under 16 years of age. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16 without verification of parental consent, we will take steps to remove that information from our servers.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-indigo-100 mb-3">9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last Updated&rdquo; date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-indigo-100 mb-3">10. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              Email: privacy@healthcareassistant.com<br />
              Healthcare Assistant<br />
              123 Health Street<br />
              Medical City, MC 12345
            </p>
          </section>
          
          <p className="mt-6 text-sm text-indigo-400">Last Updated: April 11, 2025</p>
        </div>
      </div>
    </div>
  );
}