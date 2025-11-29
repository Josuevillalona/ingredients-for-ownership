import { clsx } from 'clsx';
import React from 'react';

interface CategoryPillProps {
    label: string;
    icon?: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
    className?: string;
}

export function CategoryPill({
    label,
    icon,
    active = false,
    onClick,
    className
}: CategoryPillProps) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                'flex items-center space-x-2 px-4 py-2 rounded-full font-prompt font-medium text-sm',
                'transition-all duration-[var(--transition-base)]',
                'hover:scale-105 active:scale-95',
                active
                    ? 'bg-brand-gold text-white shadow-soft'
                    : 'bg-brand-white text-brand-dark border border-brand-gold/20 hover:border-brand-gold/40',
                className
            )}
        >
            {icon && <span className="text-lg">{icon}</span>}
            <span>{label}</span>
        </button>
    );
}
