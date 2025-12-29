'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  const router = useRouter();

  // Auto-redirect authenticated users to dashboard
  useEffect(() => {
    // This will be implemented once we have auth context
    // For now, just show landing page
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Brand Logo */}
          <div className="w-24 h-24 bg-brand-gold rounded-full mx-auto mb-8 flex items-center justify-center shadow-soft-lg">
            <span className="text-brand-white font-prompt font-bold text-4xl">I</span>
          </div>

          {/* Hero Text */}
          <h1 className="font-prompt font-bold text-4xl sm:text-6xl text-brand-dark mb-6">
            Ingredients for{' '}
            <span className="text-brand-gold">Ownership</span>
          </h1>

          <p className="text-xl text-brand-dark/70 mb-8 max-w-3xl mx-auto font-prompt">
            Replace inefficient PDF workflows with AI-assisted nutritional plan creation.
            Create professional plans in minutes, not hours.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => router.push('/login')}
              className="w-full sm:w-auto"
            >
              Sign In to Dashboard
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push('/signup')}
              className="w-full sm:w-auto"
            >
              Create Coach Account
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Mobile-First Design',
              description: 'Optimized for coaches who work on mobile devices',
              icon: '📱'
            },
            {
              title: 'Color-Coded System',
              description: 'Blue, Yellow, Red food categorization for clear client guidance',
              icon: '🎨'
            },
            {
              title: 'Instant Sharing',
              description: 'Share plans with clients via simple, professional links',
              icon: '🔗'
            }
          ].map((feature, index) => (
            <Card key={index} hover>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-prompt font-semibold text-xl text-brand-dark mb-3">
                {feature.title}
              </h3>
              <p className="text-brand-dark/60 font-prompt">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
