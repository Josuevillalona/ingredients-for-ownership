import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { NetworkStatusIndicator } from '@/components/NetworkStatus';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ingredients for Ownership - Health Coaching Platform',
  description: 'AI-assisted nutritional plan creation for health coaches',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#BD9A60',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body 
        className="font-prompt antialiased"
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <ErrorBoundary>
            <NetworkStatusIndicator />
            {children}
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
