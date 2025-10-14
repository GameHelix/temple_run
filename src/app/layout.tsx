import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { initializeApp } from './init';

// Initialize the application (including database setup)
initializeApp().catch(error => {
  console.error('Failed to initialize app:', error);
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Randevu - Doctor Appointment Booking',
  description: 'Book doctor appointments online. Find verified doctors, view availability, and schedule appointments instantly.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}