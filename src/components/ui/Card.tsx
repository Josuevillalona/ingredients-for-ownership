import { clsx } from 'clsx';
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'dashed';
    hover?: boolean;
}

export function Card({
    children,
    className,
    variant = 'default',
    hover = false
}: CardProps) {
    return (
        <div
            className={clsx(
                'bg-brand-white rounded-2xl p-6 transition-all duration-[var(--transition-base)]',
                variant === 'default'
                    ? 'shadow-soft border border-brand-gold/10'
                    : 'border-2 border-dashed border-brand-gold/30',
                hover && 'hover:shadow-soft-lg hover:border-brand-gold/20 hover:-translate-y-0.5',
                className
            )}
        >
            {children}
        </div>
    );
}
