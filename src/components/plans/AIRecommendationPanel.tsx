'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { AIRecommendationResponse } from '@/lib/types/ai-recommendations';

interface AIRecommendationPanelProps {
  onRecommendationsGenerated: (recommendations: AIRecommendationResponse) => void;
  className?: string;
}

type PanelState = 'collapsed' | 'input' | 'processing' | 'results';

export function AIRecommendationPanel({ onRecommendationsGenerated, className = '' }: AIRecommendationPanelProps) {
  const [state, setState] = useState<PanelState>('collapsed');
  const [clientProfile, setClientProfile] = useState('');
  const [quickToggles, setQuickToggles] = useState({
    diabetes: false,
    weightLoss: false,
    heartHealth: false,
    dairyFree: false,
    glutenFree: false,
    inflammation: false,
  });
  const [results, setResults] = useState<AIRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!clientProfile.trim() || clientProfile.trim().length < 10) {
      setError('Please enter at least 10 characters of client information');
      return;
    }

    setState('processing');
    setError(null);

    try {
      const response = await fetch('/api/ai/food-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientProfile: clientProfile.trim(),
          quickToggles
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate recommendations');
      }

      const data: AIRecommendationResponse = await response.json();
      setResults(data);
      setState('results');
      onRecommendationsGenerated(data);

    } catch (err) {
      console.error('AI recommendation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations');
      setState('input');
    }
  };

  const handleClear = () => {
    setClientProfile('');
    setQuickToggles({
      diabetes: false,
      weightLoss: false,
      heartHealth: false,
      dairyFree: false,
      glutenFree: false,
      inflammation: false,
    });
    setResults(null);
    setError(null);
    setState('collapsed');
  };

  const handleRegenerate = () => {
    setState('input');
    setResults(null);
  };

  const toggleQuick = (key: keyof typeof quickToggles) => {
    setQuickToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (state === 'collapsed') {
    return (
      <div className={`bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 border border-brand-gold/30 rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center">
              <span className="text-white text-xl">✨</span>
            </div>
            <div>
              <h3 className="font-prompt font-bold text-lg text-brand-dark">AI Food Recommendations</h3>
              <p className="text-sm text-brand-dark/70">Save 10+ minutes! Get smart food categorizations based on client needs.</p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setState('input')}
            className="whitespace-nowrap"
          >
            Get AI Suggestions
          </Button>
        </div>
      </div>
    );
  }

  if (state === 'input') {
    return (
      <div className={`bg-white border border-brand-gold/20 rounded-xl p-6 ${className}`}>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-prompt font-bold text-lg text-brand-dark flex items-center space-x-2">
              <span>✨</span>
              <span>AI Food Recommendations</span>
            </h3>
            <button
              onClick={() => setState('collapsed')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Collapse
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Paste your client notes or assessment details below. The AI will analyze and categorize foods automatically.
          </p>
        </div>

        {/* Client Profile Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-brand-dark mb-2 font-prompt">
            Client Information
          </label>
          <textarea
            value={clientProfile}
            onChange={(e) => setClientProfile(e.target.value)}
            placeholder="Example: 42yo female, Type 2 diabetes (HbA1c 7.2%), wants to lose 20lbs, dairy intolerance, reports low energy and joint inflammation. Currently on metformin. Prefers whole foods, minimal processing."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent resize-none font-prompt text-sm"
            rows={6}
          />
          <p className="text-xs text-gray-500 mt-1">
            Include: health goals, conditions, allergies, symptoms, preferences, medications
          </p>
        </div>

        {/* Quick Toggles */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-brand-dark mb-2 font-prompt">
            Quick Focus Areas (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries({
              diabetes: 'Diabetes',
              weightLoss: 'Weight Loss',
              heartHealth: 'Heart Health',
              dairyFree: 'Dairy-Free',
              glutenFree: 'Gluten-Free',
              inflammation: 'Inflammation'
            }).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleQuick(key as keyof typeof quickToggles)}
                className={`px-3 py-2 rounded-lg text-sm font-prompt font-medium transition-all ${
                  quickToggles[key as keyof typeof quickToggles]
                    ? 'bg-brand-gold text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={!clientProfile.trim() || clientProfile.trim().length < 10}
            className="flex-1"
          >
            Generate Recommendations ✨
          </Button>
          <Button
            variant="secondary"
            onClick={handleClear}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (state === 'processing') {
    return (
      <div className={`bg-white border border-brand-gold/20 rounded-xl p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-brand-gold/10 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-3xl">✨</span>
          </div>
          <h3 className="font-prompt font-bold text-lg text-brand-dark mb-2">
            Analyzing Client Profile...
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            AI is categorizing foods based on client needs
          </p>
          <div className="max-w-md mx-auto space-y-2 text-xs text-gray-500">
            <p>⏳ This takes ~10-15 seconds...</p>
            <p>📊 Processing nutritional data</p>
            <p>🎯 Matching foods to health goals</p>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'results' && results) {
    const blueCount = results.recommendations.filter(r => r.category === 'blue').length;
    const yellowCount = results.recommendations.filter(r => r.category === 'yellow').length;
    const redCount = results.recommendations.filter(r => r.category === 'red').length;

    return (
      <div className={`bg-green-50 border border-green-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">✓</span>
            </div>
            <div>
              <h3 className="font-prompt font-bold text-lg text-green-900">
                AI Recommendations Generated!
              </h3>
              <p className="text-sm text-green-700">
                Processed in {(results.processingTime / 1000).toFixed(1)} seconds
              </p>
            </div>
          </div>
          <button
            onClick={() => setState('collapsed')}
            className="text-sm text-green-700 hover:text-green-900"
          >
            Collapse
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="w-3 h-3 bg-[#81D4FA] rounded-full" />
              <span className="font-prompt font-bold text-2xl text-brand-dark">{blueCount}</span>
            </div>
            <p className="text-xs text-gray-600">Approved</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="w-3 h-3 bg-[#FFC000] rounded-full" />
              <span className="font-prompt font-bold text-2xl text-brand-dark">{yellowCount}</span>
            </div>
            <p className="text-xs text-gray-600">Neutral</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className="w-3 h-3 bg-[#FF5252] rounded-full" />
              <span className="font-prompt font-bold text-2xl text-brand-dark">{redCount}</span>
            </div>
            <p className="text-xs text-gray-600">Avoid</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 mb-2">
            <strong className="text-brand-dark">📊 Processing Summary:</strong>
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• {results.foodsProcessed} foods analyzed</li>
            <li>• {results.hardRulesApplied} caught by safety rules (allergies/restrictions)</li>
            <li>• {results.aiProcessed} processed by AI reasoning</li>
          </ul>
        </div>

        <p className="text-sm text-green-700 mb-4">
          ✓ Foods have been categorized below. Review and adjust as needed.
        </p>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={handleRegenerate}
            className="flex-1"
          >
            Regenerate with Different Input
          </Button>
          <Button
            variant="secondary"
            onClick={handleClear}
          >
            Clear All
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
