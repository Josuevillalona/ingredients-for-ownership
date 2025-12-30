import { clsx } from 'clsx';
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'dashed' | 'elevated' | 'dark';
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
    children,
    className,
    variant = 'default',
    hover = false,
    padding = 'md'
}: CardProps) {
    const paddingStyles = {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-5',
        lg: 'p-6'
    };

    return (
        <div
            className={clsx(
                'transition-all duration-[var(--duration-base)]',
                // New default shape
                'rounded-[32px]',

                // Variant styles
                variant === 'default' && 'bg-brand-white shadow-card border border-white',
                variant === 'dashed' && 'border-2 border-dashed border-[var(--border-default)] bg-transparent',
                // Legacy support (mapped to modern)
                variant === 'elevated' && 'bg-brand-white shadow-card-hover border border-[var(--border-subtle)]',
                variant === 'dark' && 'bg-brand-dark text-white shadow-card border border-white/10',

                // Hover effects
                hover && 'hover:shadow-card-hover hover:-translate-y-1',

                // Padding
                paddingStyles[padding],

                className
            )}
        >
            {children}
        </div>
    );
}
