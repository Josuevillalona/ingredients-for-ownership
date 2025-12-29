/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'prompt': ['Prompt', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#191B24',      // Primary navigation, headers
          gold: '#BD9A60',      // CTAs, accent, success
          white: '#FFFFFF',     // Backgrounds, cards
          cream: '#FFF7EF',     // Page backgrounds
          black: '#000000',     // High contrast text
          hover: '#A68755',     // Darker gold for hover
          active: '#8F7448',    // Even darker for active
          focus: '#BD9A60',     // Gold for focus rings
          // Additional shades for depth
          'gold-light': '#D4B883',
          'gold-dark': '#A68755',
          'dark-light': '#2A2D3A',
        },
        // Food category colors (maintaining existing system)
        food: {
          blue: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            200: '#BFDBFE',
            500: '#3B82F6',
            600: '#2563EB',
            800: '#1E40AF',
          },
          yellow: {
            50: '#FEFCE8',
            100: '#FEF3C7',
            200: '#FDE68A',
            500: '#F59E0B',
            600: '#D97706',
            800: '#92400E',
          },
          red: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            200: '#FECACA',
            500: '#EF4444',
            600: '#DC2626',
            800: '#991B1B',
          }
        }
      },
      fontSize: {
        // Mobile-optimized typography scale
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],      // 16px minimum for mobile
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(25, 27, 36, 0.04), 0 1px 2px rgba(25, 27, 36, 0.06)',
        'soft-lg': '0 4px 16px rgba(25, 27, 36, 0.08), 0 2px 4px rgba(25, 27, 36, 0.06)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'float': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 0 3px rgba(189, 154, 96, 0.1)',
      },
    },
  },
  plugins: [],
};
