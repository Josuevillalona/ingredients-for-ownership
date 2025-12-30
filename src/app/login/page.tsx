'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn, user, loading: authLoading } = useAuth();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Show loading screen while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-gold rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <img src="/icons/icon-192x192.svg" alt="Loading" className="w-10 h-10" />
          </div>
          <p className="text-brand-dark/60 font-prompt">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show login form if user is already authenticated
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex font-prompt">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-dark overflow-hidden">
        {/* Background Image */}
        <Image
          src="/PDF-background.png"
          alt="Health coaching background"
          fill
          className="object-cover opacity-40"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/80 via-brand-dark/60 to-transparent" />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          {/* Logo */}
          <div className="mb-8">
            <img
              src="/OI logos/Normal Light (1).png"
              alt="Ingredients for Ownership"
              className="h-12 w-auto"
            />
          </div>

          {/* Tagline */}
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Create personalized nutrition plans in minutes
          </h2>
          <p className="text-white/70 text-lg max-w-md">
            AI-powered food recommendations tailored to each client's unique health goals and dietary needs.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-gold rounded-full mx-auto mb-4 flex items-center justify-center">
              <img src="/icons/icon-192x192.svg" alt="IO Logo" className="w-10 h-10" />
            </div>
            <h1 className="font-bold text-3xl text-brand-dark">
              Welcome Back
            </h1>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all outline-none text-base"
                  placeholder="coach@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-brand-dark mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all outline-none text-base"
                  placeholder="Your password"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full rounded-full"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-brand-dark/60 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/signup')}
                  className="text-brand-gold hover:text-brand-hover font-medium"
                >
                  Create one here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
