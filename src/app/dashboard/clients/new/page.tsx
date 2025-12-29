'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AddClientForm } from '@/components/forms/AddClientForm';
import { clientService } from '@/lib/firebase/clients';
import { useAuth } from '@/components/providers/AuthProvider';
import { CreateClientData } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

export default function NewClientPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateClient = async (clientData: CreateClientData) => {
        if (!user) return;
        setIsSubmitting(true);
        try {
            await clientService.createClient(user.uid, clientData);
            router.push('/dashboard/clients');
        } catch (error) {
            console.error('Error creating client:', error);
            alert('Failed to create client');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 font-prompt">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/dashboard/clients">
                    <Button variant="ghost" size="sm" className="rounded-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold text-brand-dark">Add New Client</h1>
            </div>

            <div className="bg-white rounded-[32px] shadow-card p-8 border border-gray-100">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-brand-dark mb-2">Client Information</h2>
                    <p className="text-gray-500 text-sm">Fill in the details below to create a new client profile.</p>
                </div>

                <AddClientForm
                    onSubmit={handleCreateClient}
                    onCancel={() => router.push('/dashboard/clients')}
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    );
}
