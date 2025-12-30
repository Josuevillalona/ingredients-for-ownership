'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { AIRecommendationResponse } from '@/lib/types/ai-recommendations';

interface AIRecommendationPanelProps {
  onRecommendationsGenerated: (recommendations: AIRecommendationResponse) => void;
  className?: string;
  clientData?: {
    name?: string;
    goals?: string[];
    restrictions?: string[];
    sessionNotes?: string;
  };
}

type PanelState = 'collapsed' | 'input' | 'processing' | 'results';

export function AIRecommendationPanel({ onRecommendationsGenerated, className = '', clientData }: AIRecommendationPanelProps) {
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

  // Auto-populate with client data when panel opens
  React.useEffect(() => {
    if (state === 'input' && clientData && !clientProfile.trim()) {
      const parts: string[] = [];

      if (clientData.name) {
        parts.push(`Client: ${clientData.name}`);
      }

      if (clientData.goals && clientData.goals.length > 0) {
        parts.push(`\nHealth Goals:\n- ${clientData.goals.join('\n- ')}`);
      }

      if (clientData.restrictions && clientData.restrictions.length > 0) {
        parts.push(`\nDietary Restrictions: ${clientData.restrictions.join(', ')}`);
      }

      if (clientData.sessionNotes) {
        parts.push(`\nSession Notes:\n${clientData.sessionNotes}`);
      }

      if (parts.length > 0) {
        setClientProfile(parts.join('\n'));
      }
    }
  }, [state, clientData]);

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
      <div className={`bg-white border border-gray-100/50 shadow-sm rounded-[2rem] p-6 hover:shadow-md transition-all duration-300 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <h3 className="font-prompt font-bold text-lg text-brand-dark mb-1">AI Food Recommendations</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-md">
                Get smart food categorizations based on client needs in seconds.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setState('input')}
            className="rounded-full px-8 shadow-lg shadow-brand-gold/20"
          >
            Get AI Suggestions
          </Button>
        </div>
      </div>
    );
  }

  if (state === 'input') {
    return (
      <div className={`bg-white border border-gray-100 shadow-xl shadow-brand-dark/5 rounded-[2rem] p-8 ${className}`}>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center text-xl">
                ✨
              </div>
              <h3 className="font-prompt font-bold text-xl text-brand-dark">
                AI Food Recommendations
              </h3>
            </div>
            <button
              onClick={() => setState('collapsed')}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-500 font-medium ml-1">
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
                className={`px-4 py-2.5 rounded-full text-sm font-prompt font-medium transition-all duration-200 border ${quickToggles[key as keyof typeof quickToggles]
                  ? 'bg-brand-dark text-white border-brand-dark shadow-md transform scale-105'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-gold/50 hover:bg-brand-gold/5'
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
      <div className={`bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 ${className}`}>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-brand-gold/10 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="font-prompt font-bold text-xl text-brand-dark mb-3">
            Analyzing Client Profile...
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            Our AI is carefully processing the health data and categorizing foods based on nutritional profiles.
          </p>
          <div className="inline-flex flex-col items-start gap-3 bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></div>
              <span>Processing nutritional data...</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse delay-75"></div>
              <span>Matching foods to health goals...</span>
            </div>
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
      <div className={`bg-white border border-green-100 shadow-xl shadow-green-900/5 rounded-[2rem] p-8 overflow-hidden relative ${className}`}>
        {/* Success Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>

        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 text-xl shadow-sm border border-green-100">
              ✓
            </div>
            <div>
              <h3 className="font-prompt font-bold text-xl text-brand-dark">
                Recommendations Ready
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                Analysis complete in {(results.processingTime / 1000).toFixed(1)}s
              </p>
            </div>
          </div>
          <button
            onClick={() => setState('collapsed')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-center">
            <div className="font-prompt font-bold text-3xl text-blue-600 mb-1">{blueCount}</div>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Recommended</div>
          </div>
          <div className="bg-yellow-50/50 border border-yellow-100 rounded-2xl p-4 text-center">
            <div className="font-prompt font-bold text-3xl text-yellow-600 mb-1">{yellowCount}</div>
            <div className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Neutral</div>
          </div>
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 text-center">
            <div className="font-prompt font-bold text-3xl text-red-600 mb-1">{redCount}</div>
            <div className="text-xs font-bold text-red-500 uppercase tracking-wider">Avoid</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
          <p className="text-sm font-bold text-brand-dark mb-3 flex items-center gap-2">
            <span>📊</span> Analysis Summary
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
              Analyzed <strong>{results.foodsProcessed}</strong> total foods against client profile
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
              Automatically filtered {results.hardRulesApplied} items based on restrictions
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="ghost"
            onClick={handleClear}
            className="flex-1 text-gray-400 hover:text-gray-600"
          >
            Discard
          </Button>
          <Button
            variant="secondary"
            onClick={handleRegenerate}
            className="flex-1 rounded-full border-gray-200"
          >
            Try Again
          </Button>
          <Button
            variant="primary"
            onClick={() => setState('collapsed')}
            className="flex-[2] rounded-full shadow-lg shadow-brand-gold/20"
          >
            Review Foods Below ↓
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
