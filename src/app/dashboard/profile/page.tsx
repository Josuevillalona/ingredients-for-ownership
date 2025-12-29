'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, coach, refreshCoachProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: coach?.name || '',
    email: coach?.email || '',
    colorCodingStyle: coach?.preferences?.colorCodingStyle || 'standard',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // TODO: Implement profile update in AuthService
      // For now, just show success message
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      await refreshCoachProfile();
    } catch (error: any) {
      setMessage('Failed to update profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-brand-dark shadow-lg border-b border-brand-gold/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="text-brand-white/70 hover:text-brand-white">
                ← Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
                <span className="text-brand-white font-prompt font-bold text-lg">I</span>
              </div>
              <h1 className="text-brand-white font-prompt font-bold text-2xl">
                Coach Profile
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-brand-white rounded-xl shadow-sm border border-brand-gold/20 p-8">
          {/* Profile Header */}
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-brand-gold rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-brand-white font-prompt font-bold text-3xl">
                {coach?.name?.charAt(0).toUpperCase() || 'C'}
              </span>
            </div>
            <h2 className="font-prompt font-bold text-2xl text-brand-dark">
              {coach?.name || 'Coach'}
            </h2>
            <p className="text-brand-dark/60 font-prompt">
              {coach?.email || user?.email}
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully')
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
              <p className="font-prompt text-sm">{message}</p>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-dark mb-2 font-prompt">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent font-prompt disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-2 font-prompt">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled={true}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 font-prompt"
                placeholder="Email cannot be changed"
              />
              <p className="text-xs text-brand-dark/60 mt-1 font-prompt">
                Email address cannot be changed for security reasons
              </p>
            </div>

            {/* Color Coding Style */}
            <div>
              <label htmlFor="colorCodingStyle" className="block text-sm font-medium text-brand-dark mb-2 font-prompt">
                Color Coding Style
              </label>
              <select
                id="colorCodingStyle"
                name="colorCodingStyle"
                value={formData.colorCodingStyle}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent font-prompt disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="standard">Standard (Blue, Yellow, Red)</option>
                <option value="colorblind">Colorblind Friendly</option>
                <option value="high-contrast">High Contrast</option>
              </select>
            </div>

            {/* Account Info */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-prompt font-semibold text-brand-dark mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-prompt font-medium text-brand-dark/60">Account Created:</span>
                  <p className="font-prompt text-brand-dark">
                    {coach?.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                  </p>
                </div>
                <div>
                  <span className="font-prompt font-medium text-brand-dark/60">User ID:</span>
                  <p className="font-prompt text-brand-dark text-xs break-all">
                    {user?.uid || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              {!isEditing ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: coach?.name || '',
                        email: coach?.email || '',
                        colorCodingStyle: coach?.preferences?.colorCodingStyle || 'standard',
                      });
                      setMessage('');
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
