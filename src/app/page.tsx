import ChatInterface from '@/components/ChatInterface';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 bg-gray-50 p-4 pt-6">
        <div className="max-w-2xl mx-auto mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthcare Assistant</h1>
          <p className="text-gray-600 mb-4">
            Get quick answers to your health questions and general medical information from our AI-powered assistant.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-blue-600">Health Information</h3>
              <p className="text-sm text-gray-600 mt-1">Access reliable information about common conditions, symptoms, and treatments.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-blue-600">Wellness Tips</h3>
              <p className="text-sm text-gray-600 mt-1">Discover advice for nutrition, exercise, sleep, and maintaining a healthy lifestyle.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-blue-600">Personal Journey</h3>
              <p className="text-sm text-gray-600 mt-1">Create an account to track your conversations and receive personalized guidance.</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md h-[70vh] flex flex-col">
          <ChatInterface />
        </div>
        
        <div className="max-w-2xl mx-auto mt-4 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
          <p className="font-semibold mb-1">Healthcare Disclaimer:</p>
          <p>
            This healthcare assistant is for informational purposes only. The information provided is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
          <p className="mt-2">
            If you are experiencing a medical emergency, please call your local emergency services immediately or visit the nearest emergency room.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto mt-4 text-center text-xs text-gray-500">
          <p>
            <Link href="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link> • 
            <Link href="/terms" className="ml-2 underline hover:text-gray-700">Terms of Service</Link>
          </p>
        </div>
      </div>
    </main>
  );
}