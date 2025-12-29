import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Ingredients for Ownership',
  description: 'Health coach dashboard for managing clients and nutrition plans',
};

import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModernDashboardLayout>
      {children}
    </ModernDashboardLayout>
  );
}
