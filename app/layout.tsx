import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Temple Run – Neon Endless Runner',
  description:
    'A 3D-style neon endless runner — swipe to dodge, jump, and slide through a cyberpunk corridor.',
  keywords: ['game', 'endless runner', 'temple run', 'neon', 'cyberpunk', 'browser game'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#060014',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-black overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
