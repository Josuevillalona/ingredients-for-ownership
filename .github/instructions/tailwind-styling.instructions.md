---
applyTo: "**/*.{css,tsx,jsx}"
description: "Tailwind CSS styling guidelines for mobile-first responsive design"
---

# Tailwind CSS Styling Guidelines

Apply the [general project guidelines](../../.github/copilot-instructions.md) to all code.

## Mobile-First Design Principles
- Always design for mobile screens first, then enhance for larger screens
- Use responsive breakpoints: sm: (640px), md: (768px), lg: (1024px), xl: (1280px)
- Ensure touch targets are minimum 44px for mobile usability
- Test on actual mobile devices throughout development
- Optimize for various screen orientations

## Component Styling Patterns
- Use consistent spacing system (space-y-4, space-x-6, etc.)
- Implement proper hover and focus states for interactive elements
- Use semantic color classes for the food color-coding system:
  - Blue foods: `bg-blue-100 text-blue-800 border-blue-200`
  - Yellow foods: `bg-yellow-100 text-yellow-800 border-yellow-200`
  - Red foods: `bg-red-100 text-red-800 border-red-200`
- Apply consistent border radius (rounded-lg, rounded-md) across components

## Layout and Grid Systems
- Use CSS Grid for complex layouts: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Implement responsive container patterns: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Use flexbox for component-level layouts: `flex items-center justify-between`
- Apply consistent vertical spacing with `space-y-*` utilities
- Implement proper responsive padding and margins

## Interactive Element Styling
- Use consistent button styles with proper hover states
- Implement loading states with opacity and cursor changes
- Apply focus styles for keyboard navigation accessibility
- Use transition classes for smooth interactions: `transition-shadow duration-200`
- Ensure proper contrast ratios for accessibility

## Form Styling Standards
- Use consistent input styling across all forms
- Implement proper error state styling with red borders and text
- Apply consistent label positioning and styling
- Use proper spacing between form elements
- Implement responsive form layouts for mobile devices

## Performance Considerations
- Minimize custom CSS in favor of Tailwind utilities
- Use Tailwind's JIT mode for optimal bundle size
- Avoid arbitrary values unless absolutely necessary
- Group related classes for better readability
- Use CSS variables for dynamic theming when needed

## Accessibility Requirements
- Ensure sufficient color contrast for all text elements
- Use semantic HTML with appropriate Tailwind styling
- Implement proper focus indicators for interactive elements
- Use aria-labels and screen reader friendly text
- Test with screen readers for proper navigation

## Code Organization
- Group Tailwind classes logically (layout, spacing, colors, typography)
- Use string templates for conditional class application
- Extract common class combinations into reusable constants
- Comment complex responsive class combinations
- Use consistent naming for CSS custom properties
