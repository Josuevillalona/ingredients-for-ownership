'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Settings, User, Mail, Palette, Save, X, Shield, Calendar } from 'lucide-react';

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
      // Mock API call simulation
      await new Promise(resolve => setTimeout(resolve, 800));
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

  // Safe date formatting
  const joinedDate = coach?.createdAt?.toDate
    ? coach.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="font-prompt pb-20">

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-brand-dark mb-8 pl-1">Settings</h1>

      <div className="flex flex-col xl:flex-row gap-8">

        {/* Left Col: Profile Hero (Dark Context) */}
        <div className="xl:w-1/3 space-y-6">
          <Card variant="dark" className="p-6 relative overflow-hidden shadow-xl">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full -mr-6 -mt-6 blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-brand-gold p-0.5 shadow-glow flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-brand-gold/20 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                    <span className="text-xl font-bold text-white">
                      {coach?.name?.charAt(0).toUpperCase() || 'C'}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-0.5">{coach?.name || 'Coach'}</h2>
                  <p className="text-white/60 text-xs">Administrator</p>
                </div>
              </div>

              <div className="w-full border-t border-white/10 mb-4"></div>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Joined</p>
                  <p className="font-medium">{joinedDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Status</p>
                  <div className="inline-flex items-center gap-1.5 bg-white/5 rounded-full px-2 py-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-xs font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Edit Form */}
        <div className="flex-1">
          <Card className="p-8 border-gray-100 shadow-card">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-brand-dark">Profile Details</h2>
                <p className="text-brand-dark/50 text-sm">Manage your personal information and preferences.</p>
              </div>
              <Button
                variant={isEditing ? "ghost" : "secondary"}
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-full w-12 h-12 p-0 flex items-center justify-center border-2 border-gray-200 hover:border-brand-gold hover:bg-brand-gold/5 transition-all"
              >
                {isEditing ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
              </Button>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.includes('successfully')
                ? 'bg-green-50 text-green-700 border border-green-100'
                : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                <div className={`w-2 h-2 rounded-full ${message.includes('successfully') ? 'bg-green-500' : 'bg-red-500'}`} />
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-brand-dark/80 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-gold" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-dark/80 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-gold" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>



              {isEditing && (
                <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 hover:text-brand-dark"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-brand-dark hover:bg-black text-white px-8 rounded-full shadow-lg shadow-brand-dark/20"
                  >
                    {isLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>

      </div>
    </div>
  );
}
