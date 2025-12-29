'use client';

import React from 'react';
import { Home, Users, PieChart, Settings, LogOut, Search, Activity, Calendar } from 'lucide-react';

export default function DesignSystemPage() {
    return (
        <div className="min-h-screen bg-brand-white text-brand-dark p-8 font-prompt">
            <header className="mb-12">
                <h1 className="text-4xl font-semibold mb-4">Design System - v2</h1>
                <p className="text-xl text-brand-dark/60 font-light">Rounded Aesthetics • Minimalist Icons • Gold/White</p>
            </header>

            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-border-subtle">1. Colors & Tokens</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <ColorSwatch name="Brand Dark" hex="#191B24" bg="bg-brand-dark" text="text-white" />
                    <ColorSwatch name="Brand Gold" hex="#BD9A60" bg="bg-brand-gold" text="text-white" />
                    <ColorSwatch name="Surface White" hex="#FFFFFF" bg="bg-white" text="text-brand-dark" border />
                    {/* Accent Soft */}
                    <ColorSwatch name="Gold Accent" hex="rgba(189,154,96,0.1)" bg="bg-brand-gold/10" text="text-brand-dark" />
                </div>
            </section>

            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-border-subtle">2. Typography (Light/Regular)</h2>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-semibold">Heading 1 (Semibold 4xl)</h1>
                        <code className="text-sm text-gray-400">font-semibold text-4xl</code>
                    </div>
                    <div>
                        <h2 className="text-3xl font-medium">Heading 2 (Medium 3xl)</h2>
                        <code className="text-sm text-gray-400">font-medium text-3xl</code>
                    </div>
                    <div>
                        <h3 className="text-2xl font-normal">Heading 3 (Normal 2xl)</h3>
                        <code className="text-sm text-gray-400">font-normal text-2xl</code>
                    </div>
                    <div>
                        <p className="text-base font-light leading-relaxed max-w-2xl">
                            **Body Text**: The quick brown fox jumps over the lazy dog. Ingredients for Ownership provides data-driven nutritional planning. This text is readable, light, and airy.
                        </p>
                        <code className="text-sm text-gray-400">font-light text-base leading-relaxed</code>
                    </div>
                </div>
            </section>

            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-border-subtle">3. Buttons (Rounded-Full)</h2>
                <div className="flex flex-wrap gap-4 items-center p-8 bg-gray-50 rounded-3xl">
                    {/* Manually styled for demo until component is updated */}
                    <button className="bg-brand-gold text-white px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform shadow-md">
                        Primary Action
                    </button>

                    <button className="bg-white text-brand-dark border border-gray-200 px-6 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors">
                        Secondary Action
                    </button>

                    <button className="text-brand-gold px-6 py-2 rounded-full font-medium hover:bg-brand-gold/10 transition-colors">
                        Ghost Action
                    </button>

                    <button className="w-10 h-10 bg-brand-gold text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                        <Activity className="w-5 h-5" />
                    </button>
                </div>
            </section>

            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-border-subtle">4. Modern Dashboard Layout</h2>
                <div className="bg-gray-100 rounded-[40px] p-8 overflow-hidden shadow-inner border border-gray-200">

                    <div className="flex h-[700px] w-full max-w-6xl mx-auto gap-6">

                        {/* Rounded Sidebar (Pill Shape Container) */}
                        <div className="w-20 bg-white rounded-[40px] shadow-card flex flex-col items-center py-8 gap-8 h-full sticky top-0">
                            {/* Logo */}
                            <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-glow">
                                I
                            </div>

                            {/* Navigation Icons */}
                            <div className="flex flex-col gap-6 w-full items-center">
                                <SidebarIcon active><Home className="w-6 h-6" /></SidebarIcon>
                                <SidebarIcon><Users className="w-6 h-6" /></SidebarIcon>
                                <SidebarIcon><PieChart className="w-6 h-6" /></SidebarIcon>
                                <SidebarIcon><Calendar className="w-6 h-6" /></SidebarIcon>
                                <SidebarIcon><Settings className="w-6 h-6" /></SidebarIcon>
                            </div>

                            <div className="mt-auto pb-4">
                                <SidebarIcon><LogOut className="w-6 h-6" /></SidebarIcon>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 flex flex-col gap-6 overflow-hidden">

                            {/* Top Bar */}
                            <div className="flex justify-between items-center bg-white rounded-[40px] p-4 px-8 shadow-card">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-semibold text-brand-dark">Dashboard</h2>
                                    <span className="h-6 w-px bg-gray-200"></span>
                                    <p className="text-brand-dark/40 text-sm font-light">Overview</p>
                                </div>

                                <div className="flex gap-4 items-center">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" placeholder="Search data..." className="bg-gray-50 rounded-full pl-10 pr-4 py-2.5 text-sm w-64 border-none focus:ring-2 focus:ring-brand-gold/20 outline-none transition-all" />
                                    </div>
                                    <button className="bg-brand-dark text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-brand-dark/20 flex items-center gap-2">
                                        <span>Make Appointment</span>
                                        <Activity className="w-4 h-4" />
                                    </button>
                                    <div className="w-10 h-10 bg-gray-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
                                        <div className="w-full h-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold">C</div>
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Grid */}
                            <div className="flex-1 grid grid-cols-3 gap-6 overflow-y-auto pb-4 pr-2">

                                {/* Large Chart Card */}
                                <div className="col-span-2 bg-white rounded-[40px] shadow-card p-8 border border-white relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="font-semibold text-lg">Plan Engagement</h3>
                                            <p className="text-sm text-gray-400 font-light">Client activity over the last 7 days</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 rounded-full bg-gray-50 text-xs font-medium text-gray-500 hover:bg-gray-100">Daily</button>
                                            <button className="px-3 py-1 rounded-full bg-brand-gold text-white text-xs font-medium shadow-md">Weekly</button>
                                        </div>
                                    </div>

                                    {/* Mock Chart */}
                                    <div className="h-48 flex items-end justify-between gap-4 px-2">
                                        {[30, 50, 45, 60, 40, 75, 55].map((h, i) => (
                                            <div key={i} className="flex-1 flex flex-col gap-2 items-center group/bar">
                                                <div className="w-full bg-blue-50/50 rounded-t-2xl relative overflow-hidden transition-all duration-500 ease-out group-hover/bar:bg-blue-50" style={{ height: '100%' }}>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-brand-gold rounded-t-2xl transition-all duration-700 ease-out shadow-[0_-4px_20px_rgba(189,154,96,0.4)]" style={{ height: `${h}%` }}></div>
                                                </div>
                                                <span className="text-xs text-gray-300 font-light">Day {i + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Side Stats */}
                                <div className="col-span-1 flex flex-col gap-6">
                                    {/* Gold Card - White Text */}
                                    <div className="bg-brand-gold rounded-[40px] shadow-card p-8 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-10 -mb-10 blur-xl"></div>

                                        <div className="relative z-10">
                                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                                <Activity className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="font-bold text-2xl mb-1">98%</h3>
                                            <p className="text-white/80 text-sm font-light mb-6">Average adherence rate</p>
                                            <button className="bg-white text-brand-gold px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform w-full">
                                                View Report
                                            </button>
                                        </div>
                                    </div>

                                    {/* List Card */}
                                    <div className="flex-1 bg-white rounded-[40px] shadow-card p-6 border border-white overflow-hidden">
                                        <h3 className="font-semibold text-lg mb-4">Recent Plans</h3>
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-white group-hover:shadow-sm">
                                                        {String.fromCharCode(64 + i)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-medium text-brand-dark">Client {i}</h4>
                                                        <p className="text-xs text-gray-400 font-light">Updated 2h ago</p>
                                                    </div>
                                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}

function ColorSwatch({ name, hex, bg, text, border = false }: { name: string, hex: string, bg: string, text: string, border?: boolean }) {
    return (
        <div className="flex flex-col gap-2 group cursor-pointer">
            <div className={`h-24 rounded-3xl ${bg} ${border ? 'border border-gray-200' : ''} shadow-sm group-hover:shadow-md transition-all duration-300 flex items-end p-4`}>
                <span className={`font-mono text-xs ${text} opacity-80 group-hover:opacity-100`}>{hex}</span>
            </div>
            <span className="font-medium text-sm">{name}</span>
        </div>
    );
}

function SidebarIcon({ children, active = false }: { children: React.ReactNode, active?: boolean }) {
    return (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 group
      ${active
                ? 'bg-brand-gold/10 text-brand-gold shadow-glow'
                : 'text-gray-400 hover:bg-gray-50 hover:text-brand-dark'}
    `}>
            <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {children}
            </div>
        </div>
    );
}
