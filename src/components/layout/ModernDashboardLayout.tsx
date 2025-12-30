'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ModernSidebar } from './ModernSidebar';

interface ModernDashboardLayoutProps {
    children: React.ReactNode;
}

export function ModernDashboardLayout({ children }: ModernDashboardLayoutProps) {
    const pathname = usePathname();
    const isFullWidthPage = pathname === '/dashboard/plans/new' || pathname?.endsWith('/edit');

    return (
        <div className="min-h-screen bg-gray-100 flex gap-2 font-prompt">
            {/* Sidebar - Sticky and independent */}
            <ModernSidebar />

            {/* Main Content Area */}
            <main className="flex-1 p-4 h-screen overflow-hidden">
                <div className={`bg-brand-white rounded-[40px] shadow-card w-full h-full overflow-y-auto relative border border-white scroll-smooth ${isFullWidthPage ? 'p-0' : 'p-8'}`}>
                    {children}
                </div>
            </main>
        </div>
    );
}
