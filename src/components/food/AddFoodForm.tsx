import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { CreateFoodData, FoodItem } from '@/lib/types';

interface AddFoodFormProps {
  onSubmit: (data: CreateFoodData) => Promise<void>;
  onCancel: () => void;
  initialData?: FoodItem;
  isLoading?: boolean;
}

export function AddFoodForm({ 
  onSubmit, 
  onCancel, 
  initialData,
  isLoading = false 
}: AddFoodFormProps) {
  const [formData, setFormData] = useState<CreateFoodData>(() => ({
    name: initialData?.name || '',
    description: initialData?.description || '',
    servingSize: initialData?.servingSize || '',
    portionGuidelines: initialData?.portionGuidelines || '',
    nutritionalInfo: initialData?.nutritionalInfo || {},
    tags: initialData?.tags || [],
    source: 'manual'
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Food name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleNutritionalInfoChange = (field: string, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      nutritionalInfo: {
        ...prev.nutritionalInfo,
        [field]: numValue
      }
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {initialData ? 'Edit Food Item' : 'Add New Food Item'}
        </h2>
        <p className="text-gray-600 text-sm">
          Add foods to your personal database for easy plan creation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Food Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors
                ${errors.name ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="Enter food name..."
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              placeholder="Optional description or notes about this food..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="servingSize" className="block text-sm font-medium text-gray-700 mb-2">
                Serving Size
              </label>
              <input
                type="text"
                id="servingSize"
                value={formData.servingSize}
                onChange={(e) => setFormData(prev => ({ ...prev, servingSize: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
                placeholder="e.g., 1 cup, 100g..."
              />
            </div>

            <div>
              <label htmlFor="portionGuidelines" className="block text-sm font-medium text-gray-700 mb-2">
                Portion Guidelines
              </label>
              <input
                type="text"
                id="portionGuidelines"
                value={formData.portionGuidelines}
                onChange={(e) => setFormData(prev => ({ ...prev, portionGuidelines: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
                placeholder="e.g., palm-sized portion..."
              />
            </div>
          </div>
        </div>

        {/* Nutritional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Nutritional Information (Optional)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { key: 'calories', label: 'Calories', unit: '' },
              { key: 'protein', label: 'Protein', unit: 'g' },
              { key: 'carbs', label: 'Carbs', unit: 'g' },
              { key: 'fat', label: 'Fat', unit: 'g' }
            ].map(({ key, label, unit }) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-2">
                  {label} {unit && `(${unit})`}
                </label>
                <input
                  type="number"
                  id={key}
                  step="0.1"
                  min="0"
                  value={formData.nutritionalInfo?.[key as keyof typeof formData.nutritionalInfo] || ''}
                  onChange={(e) => handleNutritionalInfoChange(key, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Tags</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition-colors"
              placeholder="Add tags for easier searching..."
            />
            <Button 
              type="button" 
              variant="secondary" 
              onClick={addTag}
              disabled={!tagInput.trim()}
            >
              Add
            </Button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {initialData ? 'Update Food' : 'Add Food'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
