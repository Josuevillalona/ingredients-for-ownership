---
applyTo: "**/*.{ts,tsx}"
description: "TypeScript and React component guidelines for the health coaching application"
---

# TypeScript and React Component Guidelines

Apply the [general project guidelines](../.github/copilot-instructions.md) to all code.

## Component Structure and Naming
- Use PascalCase for all component names (e.g., `ClientList`, `PlanCreationForm`, `FoodColorBadge`)
- Follow the established component structure template:
  1. State declarations
  2. Hooks (useRouter, custom hooks)
  3. Effects
  4. Event handlers
  5. Render JSX

## TypeScript Standards
- Use interfaces for props and data structures, not types
- Implement discriminated unions for complex state management
- Prefix private class members with underscore (_)
- Use optional chaining (?.) and nullish coalescing (??) operators
- Always define return types for functions that return JSX

## React Component Patterns
- Use functional components with hooks exclusively
- Follow React hooks rules (no conditional hooks)
- Use React.FC type for components that accept children
- Keep components small and focused on single responsibility
- Implement proper loading and error states for all async operations

## State Management
- Use useState for local component state
- Use custom hooks for complex logic and API interactions
- Implement proper error boundaries for component trees
- Use React.memo for expensive re-renders
- Prefer controlled components for form inputs

## Component Props
- Always define TypeScript interfaces for component props
- Use descriptive prop names that clearly indicate purpose
- Implement default values using destructuring with defaults
- Use optional props (?:) appropriately
- Include callback props for parent-child communication

## Form Handling
- Use React Hook Form for all form implementations
- Combine with Zod schemas for validation
- Implement proper error display and user feedback
- Use uncontrolled components with register() when possible
- Implement loading states during form submission

## Error Handling in Components
- Wrap components in error boundaries where appropriate
- Handle async errors in useEffect and event handlers
- Display user-friendly error messages
- Implement retry mechanisms for failed operations
- Log errors for debugging without exposing sensitive data

## Performance Optimization
- Use React.memo for components that receive stable props
- Implement callback memoization with useCallback
- Use useMemo for expensive calculations
- Lazy load heavy components with React.lazy
- Implement proper cleanup in useEffect hooks
