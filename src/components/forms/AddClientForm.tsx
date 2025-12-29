'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { CreateClientData } from '@/lib/types';

interface AddClientFormProps {
  onSubmit: (clientData: CreateClientData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AddClientForm({ onSubmit, onCancel, isLoading = false }: AddClientFormProps) {
  const [formData, setFormData] = useState<CreateClientData>({
    name: '',
    email: '',
    sessionNotes: '',
    goals: [''],
    restrictions: [''],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (field: 'goals' | 'restrictions', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'goals' | 'restrictions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'goals' | 'restrictions', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }

    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }

    const validGoals = formData.goals.filter(goal => goal.trim().length > 0);
    if (validGoals.length === 0) {
      newErrors.goals = 'At least one goal is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done by parent component
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-brand-dark mb-2 font-prompt">
          Client Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all outline-none font-prompt ${errors.name ? 'ring-2 ring-red-100 bg-red-50' : ''
            }`}
          placeholder="Enter client's full name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Email (Optional) */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-2 font-prompt">
          Email Address (Optional)
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all outline-none font-prompt ${errors.email ? 'ring-2 ring-red-100 bg-red-50' : ''
            }`}
          placeholder="client@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* Session Notes */}
      <div>
        <label htmlFor="sessionNotes" className="block text-sm font-medium text-brand-dark mb-2 font-prompt">
          Session Notes
        </label>
        <textarea
          id="sessionNotes"
          name="sessionNotes"
          value={formData.sessionNotes}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all outline-none font-prompt resize-none"
          placeholder="Initial session notes, health concerns, background info..."
        />
      </div>

      {/* Goals */}
      <div>
        <label className="block text-sm font-medium text-brand-dark mb-2 font-prompt">
          Health & Nutrition Goals *
        </label>
        {formData.goals.map((goal, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={goal}
              onChange={(e) => handleArrayChange('goals', index, e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all outline-none font-prompt"
              placeholder={`Goal ${index + 1} (e.g., "Lose 15 pounds", "Increase energy")`}
            />
            {formData.goals.length > 1 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => removeArrayItem('goals', index)}
                className="px-3 rounded-xl border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => addArrayItem('goals')}
          className="mt-2 rounded-full border-dashed border-2 border-gray-300 text-gray-400 hover:border-brand-gold hover:text-brand-gold"
        >
          + Add Another Goal
        </Button>
        {errors.goals && <p className="mt-1 text-sm text-red-600">{errors.goals}</p>}
      </div>

      {/* Dietary Restrictions */}
      <div>
        <label className="block text-sm font-medium text-brand-dark mb-2 font-prompt">
          Dietary Restrictions & Allergies
        </label>
        {formData.restrictions.map((restriction, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={restriction}
              onChange={(e) => handleArrayChange('restrictions', index, e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all outline-none font-prompt"
              placeholder={`Restriction ${index + 1} (e.g., "Gluten-free", "Nut allergy")`}
            />
            {formData.restrictions.length > 1 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => removeArrayItem('restrictions', index)}
                className="px-3 rounded-xl border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => addArrayItem('restrictions')}
          className="mt-2 rounded-full border-dashed border-2 border-gray-300 text-gray-400 hover:border-brand-gold hover:text-brand-gold"
        >
          + Add Another Restriction
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="flex-1 rounded-full text-white"
        >
          {isLoading ? 'Creating Client...' : 'Create Client'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-full"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
