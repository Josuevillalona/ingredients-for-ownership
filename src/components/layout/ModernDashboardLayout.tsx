'use client';

import React from 'react';
import { ModernSidebar } from './ModernSidebar';

interface ModernDashboardLayoutProps {
    children: React.ReactNode;
}

export function ModernDashboardLayout({ children }: ModernDashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100 flex gap-2 font-prompt">
            {/* Sidebar - Sticky and independent */}
            <ModernSidebar />

            {/* Main Content Area */}
            <main className="flex-1 p-4 h-screen overflow-hidden">
                <div className="bg-brand-white rounded-[40px] shadow-card w-full h-full overflow-y-auto p-8 relative border border-white scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
}
