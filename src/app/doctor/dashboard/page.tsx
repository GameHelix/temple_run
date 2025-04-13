// src/app/doctor/dashboard/page.tsx
import DoctorDashboardPage from '@/components/doctor/DoctorDashboard';

export const metadata = {
  title: 'Doctor Dashboard | Healthcare Assistant',
  description: 'Manage your patients and healthcare services',
};

export default function Page() {
  return <DoctorDashboardPage />;
}