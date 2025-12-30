'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    FileText,
    Users,
    Utensils,
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

export function ModernSidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    const isActive = (path: string) => {
        if (path === '/dashboard' && pathname === '/dashboard') return true;
        if (path !== '/dashboard' && pathname?.startsWith(path)) return true;
        return false;
    };

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: Home },
        { label: 'Plans', path: '/dashboard/plans', icon: FileText },
        { label: 'Clients', path: '/dashboard/clients', icon: Users },
        { label: 'Foods', path: '/dashboard/foods', icon: Utensils },
        { label: 'Profile', path: '/dashboard/profile', icon: Settings },
    ];

    return (
        <div className="w-20 bg-brand-white rounded-[40px] shadow-card flex flex-col items-center py-8 gap-8 h-[calc(100vh-2rem)] sticky top-4 mb-4 ml-4">
            {/* Logo */}
            <img
                src="/icons/icon-192x192.svg"
                alt="IO Logo"
                className="w-10 h-10 rounded-xl shadow-glow shrink-0"
            />

            {/* Navigation Icons */}
            <div className="flex flex-col gap-6 w-full items-center flex-1 overflow-y-auto no-scrollbar py-2">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 group
                 ${active
                                    ? 'bg-brand-gold/10 text-brand-gold shadow-glow'
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-brand-dark'}
               `}
                            title={item.label}
                        >
                            <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                                <Icon className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto pt-4 shrink-0">
                <button
                    onClick={() => signOut()}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 group text-gray-400 hover:bg-red-50 hover:text-red-500"
                    title="Sign Out"
                >
                    <div className="transition-transform duration-300 group-hover:scale-110">
                        <LogOut className="w-6 h-6" />
                    </div>
                </button>
            </div>
        </div>
    );
}
