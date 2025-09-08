import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Ingredients for Ownership',
  description: 'Health coach dashboard for managing clients and nutrition plans',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-cream">
      {children}
    </div>
  );
}
