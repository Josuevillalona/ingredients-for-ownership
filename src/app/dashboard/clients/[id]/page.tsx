'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/hooks/useAuth';
import { clientService } from '@/lib/firebase/clients';
import { ingredientDocumentService } from '@/lib/firebase/ingredient-documents';
import type { Client } from '@/lib/types';
import type { IngredientDocument } from '@/lib/types/ingredient-document';
import {
  User,
  Target,
  AlertTriangle,
  FileText,
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  ClipboardList,
  ChevronRight,
  Save,
  X
} from 'lucide-react';

export default function ClientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [plans, setPlans] = useState<IngredientDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    sessionNotes: '',
    goals: [] as string[],
    restrictions: [] as string[]
  });

  useEffect(() => {
    const fetchClientAndPlans = async () => {
      if (!user || !id) return;

      setIsLoading(true);
      setError(null);

      try {
        const clientData = await clientService.getClient(id as string, user.uid);
        setClient(clientData);

        if (clientData) {
          // Initialize edit data
          setEditData({
            name: clientData.name || '',
            email: clientData.email || '',
            sessionNotes: clientData.sessionNotes || '',
            goals: clientData.goals || [],
            restrictions: clientData.restrictions || []
          });

          // Fetch plans
          const allPlans = await ingredientDocumentService.getCoachDocuments(user.uid, 100);
          const clientPlans = allPlans.filter(
            plan => plan.clientName.toLowerCase() === clientData.name.toLowerCase()
          );
          setPlans(clientPlans);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientAndPlans();
  }, [user, id]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCreatePlan = () => {
    if (client) {
      router.push(`/dashboard/plans/new?clientId=${encodeURIComponent(client.id)}`);
    }
  };

  const handleDeleteClient = async () => {
    if (!client || !user) return;
    if (!confirm(`Are you sure you want to delete ${client.name}? This cannot be undone.`)) return;

    try {
      await clientService.deleteClient(client.id, user.uid);
      router.push('/dashboard/clients');
    } catch (err: any) {
      alert('Failed to delete client: ' + err.message);
    }
  };

  const handleSave = async () => {
    if (!client || !user) return;
    setIsSaving(true);

    try {
      await clientService.updateClient(client.id, user.uid, {
        name: editData.name,
        email: editData.email,
        sessionNotes: editData.sessionNotes,
        goals: editData.goals.filter(g => g.trim()),
        restrictions: editData.restrictions.filter(r => r.trim())
      });

      // Update local state
      setClient({
        ...client,
        name: editData.name,
        email: editData.email,
        sessionNotes: editData.sessionNotes,
        goals: editData.goals.filter(g => g.trim()),
        restrictions: editData.restrictions.filter(r => r.trim())
      });

      setIsEditing(false);
    } catch (err: any) {
      alert('Failed to save: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (client) {
      setEditData({
        name: client.name || '',
        email: client.email || '',
        sessionNotes: client.sessionNotes || '',
        goals: client.goals || [],
        restrictions: client.restrictions || []
      });
    }
    setIsEditing(false);
  };

  const addGoal = () => setEditData({ ...editData, goals: [...editData.goals, ''] });
  const addRestriction = () => setEditData({ ...editData, restrictions: [...editData.restrictions, ''] });

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...editData.goals];
    newGoals[index] = value;
    setEditData({ ...editData, goals: newGoals });
  };

  const updateRestriction = (index: number, value: string) => {
    const newRestrictions = [...editData.restrictions];
    newRestrictions[index] = value;
    setEditData({ ...editData, restrictions: newRestrictions });
  };

  const removeGoal = (index: number) => {
    setEditData({ ...editData, goals: editData.goals.filter((_, i) => i !== index) });
  };

  const removeRestriction = (index: number) => {
    setEditData({ ...editData, restrictions: editData.restrictions.filter((_, i) => i !== index) });
  };

  if (isLoading) {
    return (
      <div className="font-prompt pb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <div className="h-64 bg-gray-100 rounded-[32px] animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <div className="h-40 bg-gray-100 rounded-[32px] animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="font-prompt pb-20">
        <Card className="p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="font-bold text-xl text-brand-dark mb-2">Client Not Found</h2>
          <p className="text-brand-dark/60 mb-6">{error || 'The client you are looking for does not exist.'}</p>
          <Link href="/dashboard/clients">
            <Button variant="primary">Back to Clients</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="font-prompt pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/clients"
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-brand-dark" />
          </Link>
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="text-3xl font-bold text-brand-dark bg-transparent border-b-2 border-brand-gold focus:outline-none"
              />
            ) : (
              <h1 className="text-3xl font-bold text-brand-dark">{client.name}</h1>
            )}
            <p className="text-brand-dark/50 text-sm">Client since {formatDate(client.createdAt)}</p>
          </div>
        </div>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={handleCancel} className="flex items-center gap-2">
                <X className="w-4 h-4" /> Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
                <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={handleDeleteClient} className="flex items-center gap-2 text-red-500 hover:bg-red-50">
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Edit
              </Button>
              <Button variant="primary" onClick={handleCreatePlan} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create Plan
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">

          {/* Client Info */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
                <User className="w-5 h-5 text-brand-gold" />
              </div>
              <h2 className="text-xl font-bold text-brand-dark">Client Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-brand-dark/40 mb-1">Full Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-brand-gold focus:outline-none"
                  />
                ) : (
                  <p className="font-medium text-brand-dark">{client.name}</p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-brand-dark/40 mb-1">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-brand-gold focus:outline-none"
                    placeholder="Optional"
                  />
                ) : (
                  <p className="font-medium text-brand-dark">{client.email || 'Not provided'}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Session Notes */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-brand-dark">Session Notes</h2>
            </div>

            {isEditing ? (
              <textarea
                value={editData.sessionNotes}
                onChange={(e) => setEditData({ ...editData, sessionNotes: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-brand-gold focus:outline-none resize-none"
                placeholder="Add session notes..."
              />
            ) : client.sessionNotes ? (
              <p className="text-brand-dark/80 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-xl p-4">
                {client.sessionNotes}
              </p>
            ) : (
              <p className="text-brand-dark/50 text-sm bg-gray-50 rounded-xl p-4">No session notes yet.</p>
            )}
          </Card>

          {/* Nutrition Plans */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-brand-dark">Nutrition Plans</h2>
              </div>
              <Button variant="primary" size="sm" onClick={handleCreatePlan}>
                <Plus className="w-4 h-4 mr-1" /> New Plan
              </Button>
            </div>

            {plans.length > 0 ? (
              <div className="space-y-3">
                {plans.map((plan) => (
                  <Link
                    key={plan.id}
                    href={`/dashboard/plans/${plan.id}`}
                    className="block p-4 rounded-xl border border-gray-100 hover:border-brand-gold/30 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-brand-dark group-hover:text-brand-gold transition-colors">
                          Plan - {formatDate(plan.createdAt)}
                        </h3>
                        <p className="text-sm text-brand-dark/50">Created {formatDate(plan.createdAt)}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-brand-dark/30 group-hover:text-brand-gold transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-brand-dark/60 mb-4">No nutrition plans created yet.</p>
                <Button variant="primary" size="sm" onClick={handleCreatePlan}>Create First Plan</Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Health Goals */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-gold" />
                <h3 className="font-bold text-brand-dark">Health Goals</h3>
              </div>
              {isEditing && (
                <Button variant="ghost" size="sm" onClick={addGoal} className="text-brand-gold">
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                {editData.goals.map((goal, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => updateGoal(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-gold focus:outline-none"
                      placeholder="Enter goal..."
                    />
                    <button onClick={() => removeGoal(index)} className="text-red-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {editData.goals.length === 0 && (
                  <button onClick={addGoal} className="w-full py-2 text-sm text-brand-gold border border-dashed border-brand-gold/30 rounded-lg hover:bg-brand-gold/5">
                    + Add Goal
                  </button>
                )}
              </div>
            ) : client.goals && client.goals.length > 0 ? (
              <ul className="space-y-2">
                {client.goals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-brand-dark/80">
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full mt-2 flex-shrink-0"></span>
                    {goal}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-brand-dark/50 text-sm">No goals specified.</p>
            )}
          </Card>

          {/* Dietary Restrictions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-brand-dark">Restrictions</h3>
              </div>
              {isEditing && (
                <Button variant="ghost" size="sm" onClick={addRestriction} className="text-brand-gold">
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                {editData.restrictions.map((restriction, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={restriction}
                      onChange={(e) => updateRestriction(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-brand-gold focus:outline-none"
                      placeholder="Enter restriction..."
                    />
                    <button onClick={() => removeRestriction(index)} className="text-red-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {editData.restrictions.length === 0 && (
                  <button onClick={addRestriction} className="w-full py-2 text-sm text-red-500 border border-dashed border-red-200 rounded-lg hover:bg-red-50">
                    + Add Restriction
                  </button>
                )}
              </div>
            ) : client.restrictions && client.restrictions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {client.restrictions.map((restriction, index) => (
                  <span key={index} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                    {restriction}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-brand-dark/50 text-sm">No restrictions specified.</p>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}
