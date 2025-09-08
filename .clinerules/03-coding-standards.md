# Coding Standards: Ingredients for Ownership

## Overview
This document establishes coding standards and best practices specific to the Next.js/React/Firestore tech stack used in the health coaching web application.

## Project Structure

### Next.js 14+ App Router Structure
```
src/
├── app/                          # App Router (Next.js 14+)
│   ├── (auth)/                   # Route groups for auth pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/                # Protected coach dashboard
│   │   ├── clients/
│   │   ├── plans/
│   │   └── templates/
│   ├── plan/[shareToken]/        # Public client plan view
│   ├── api/                      # API routes (serverless functions)
│   │   ├── auth/
│   │   ├── clients/
│   │   ├── plans/
│   │   └── ai/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components (buttons, inputs)
│   ├── forms/                    # Form-specific components
│   ├── layout/                   # Layout components (nav, sidebar)
│   └── features/                 # Feature-specific components
│       ├── auth/
│       ├── clients/
│       ├── plans/
│       └── ai/
├── lib/                          # Utility functions and configurations
│   ├── firebase/                 # Firebase configuration and helpers
│   ├── utils/                    # General utility functions
│   ├── validations/              # Zod schemas for validation
│   └── types/                    # TypeScript type definitions
├── hooks/                        # Custom React hooks
└── constants/                    # Application constants
```

## React Component Standards

### Component Naming and Organization
```typescript
// ✅ Good: PascalCase for components
export function ClientList() { }
export function PlanCreationForm() { }
export function FoodColorBadge() { }

// ❌ Bad: camelCase or kebab-case
export function clientList() { }
export function plan_creation_form() { }
```

### Component Structure Template
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { validatePlan } from '@/lib/validations/plan';
import type { Plan, Client } from '@/lib/types';

interface PlanCreationFormProps {
  client: Client;
  onSave: (plan: Plan) => void;
  initialData?: Partial<Plan>;
}

export function PlanCreationForm({ 
  client, 
  onSave, 
  initialData 
}: PlanCreationFormProps) {
  // 1. State declarations
  const [plan, setPlan] = useState<Partial<Plan>>(initialData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 2. Hooks
  const router = useRouter();

  // 3. Effects
  useEffect(() => {
    // Component setup logic
  }, []);

  // 4. Event handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const validatedPlan = validatePlan(plan);
      await onSave(validatedPlan);
      router.push('/dashboard/plans');
    } catch (error) {
      setErrors({ submit: 'Failed to save plan' });
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Render
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Component JSX */}
    </form>
  );
}
```

### Props and State Management
```typescript
// ✅ Good: Use TypeScript interfaces for props
interface ClientCardProps {
  client: Client;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
}

// ✅ Good: Use discriminated unions for complex state
type PlanState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Plan }
  | { status: 'error'; error: string };

// ✅ Good: Use custom hooks for complex logic
function usePlanCreation(clientId: string) {
  const [state, setState] = useState<PlanState>({ status: 'idle' });
  
  const createPlan = async (planData: Partial<Plan>) => {
    setState({ status: 'loading' });
    try {
      const plan = await savePlanToFirestore(planData);
      setState({ status: 'success', data: plan });
    } catch (error) {
      setState({ status: 'error', error: error.message });
    }
  };

  return { state, createPlan };
}
```

## Firestore Integration Standards

### Data Model Patterns
```typescript
// lib/types/index.ts
export interface Coach {
  id: string;
  email: string;
  name: string;
  createdAt: Timestamp;
  preferences: {
    defaultPlanTemplate?: string;
    colorCodingStyle: 'standard' | 'custom';
  };
}

export interface Client {
  id: string;
  coachId: string;
  name: string;
  email?: string;
  sessionNotes: string;
  goals: string[];
  restrictions: string[];
  createdAt: Timestamp;
  lastUpdated: Timestamp;
}

export interface Plan {
  id: string;
  clientId: string;
  coachId: string;
  title: string;
  foods: FoodItem[];
  shareToken: string;
  isActive: boolean;
  createdAt: Timestamp;
  lastModified: Timestamp;
}

export interface FoodItem {
  name: string;
  category: 'blue' | 'yellow' | 'red';
  notes?: string;
  portion?: string;
}
```

### Firestore Service Layer
```typescript
// lib/firebase/plans.ts
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import type { Plan, CreatePlanData } from '@/lib/types';

export class PlanService {
  private collection = collection(db, 'plans');

  async createPlan(coachId: string, data: CreatePlanData): Promise<Plan> {
    const planData = {
      ...data,
      coachId,
      shareToken: generateShareToken(),
      isActive: true,
      createdAt: Timestamp.now(),
      lastModified: Timestamp.now(),
    };

    const docRef = await addDoc(this.collection, planData);
    return { id: docRef.id, ...planData } as Plan;
  }

  async getCoachPlans(coachId: string): Promise<Plan[]> {
    const q = query(
      this.collection,
      where('coachId', '==', coachId),
      where('isActive', '==', true),
      orderBy('lastModified', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Plan[];
  }

  async getPlanByShareToken(shareToken: string): Promise<Plan | null> {
    const q = query(
      this.collection,
      where('shareToken', '==', shareToken),
      where('isActive', '==', true)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Plan;
  }

  async updatePlan(planId: string, updates: Partial<Plan>): Promise<void> {
    const docRef = doc(this.collection, planId);
    await updateDoc(docRef, {
      ...updates,
      lastModified: Timestamp.now(),
    });
  }

  async deletePlan(planId: string): Promise<void> {
    const docRef = doc(this.collection, planId);
    await updateDoc(docRef, { isActive: false });
  }
}

export const planService = new PlanService();
```

### Firebase Security Rules Patterns
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Coaches can only access their own data
    match /coaches/{coachId} {
      allow read, write: if request.auth != null && request.auth.uid == coachId;
    }
    
    // Clients belong to coaches
    match /clients/{clientId} {
      allow read, write: if request.auth != null && 
        resource.data.coachId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.coachId == request.auth.uid;
    }
    
    // Plans belong to coaches, but can be read by share token
    match /plans/{planId} {
      allow read, write: if request.auth != null && 
        resource.data.coachId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.coachId == request.auth.uid;
      // Allow public read for shared plans (implement carefully)
      allow read: if resource.data.isActive == true;
    }
  }
}
```

## API Route Standards

### API Route Structure
```typescript
// app/api/plans/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { planService } from '@/lib/firebase/plans';
import { validatePlan } from '@/lib/validations/plan';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plans = await planService.getCoachPlans(session.user.id);
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = validatePlan(body);
    
    const plan = await planService.createPlan(session.user.id, validatedData);
    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors }, 
        { status: 400 }
      );
    }
    
    console.error('Failed to create plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
```

## Tailwind CSS Standards

### Component Styling Patterns
```typescript
// ✅ Good: Use CSS variables for theme colors
const colorClasses = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  red: 'bg-red-100 text-red-800 border-red-200',
} as const;

// ✅ Good: Create reusable component variants
function FoodColorBadge({ 
  color, 
  children 
}: { 
  color: 'blue' | 'yellow' | 'red'; 
  children: React.ReactNode; 
}) {
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${colorClasses[color]}
    `}>
      {children}
    </span>
  );
}

// ✅ Good: Mobile-first responsive design
function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className="
      bg-white rounded-lg shadow-sm border border-gray-200 p-4
      hover:shadow-md transition-shadow duration-200
      sm:p-6 md:p-8
    ">
      <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:text-xl">
        {plan.title}
      </h3>
      {/* Content */}
    </div>
  );
}
```

### Layout and Grid Patterns
```typescript
// ✅ Good: Responsive grid layouts
function ClientGrid({ clients }: { clients: Client[] }) {
  return (
    <div className="
      grid gap-4 
      grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4
    ">
      {clients.map(client => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}

// ✅ Good: Consistent spacing system
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        {/* Navigation */}
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
```

## Error Handling Standards

### Client-Side Error Handling
```typescript
// ✅ Good: Comprehensive error boundaries
'use client';

import { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center py-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            We're sorry, but something unexpected happened.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Form Validation with Zod
```typescript
// lib/validations/plan.ts
import { z } from 'zod';

export const foodItemSchema = z.object({
  name: z.string().min(1, 'Food name is required').max(100),
  category: z.enum(['blue', 'yellow', 'red']),
  notes: z.string().optional(),
  portion: z.string().optional(),
});

export const planSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  title: z.string().min(1, 'Plan title is required').max(200),
  foods: z.array(foodItemSchema).min(1, 'At least one food item is required'),
});

export type CreatePlanData = z.infer<typeof planSchema>;

export function validatePlan(data: unknown): CreatePlanData {
  return planSchema.parse(data);
}
```

## Performance Standards

### Code Splitting and Lazy Loading
```typescript
// ✅ Good: Lazy load heavy components
import { lazy, Suspense } from 'react';

const PlanEditor = lazy(() => import('@/components/features/plans/PlanEditor'));
const AIAssistant = lazy(() => import('@/components/features/ai/AIAssistant'));

function PlanCreationPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading plan editor...</div>}>
        <PlanEditor />
      </Suspense>
      
      <Suspense fallback={<div>Loading AI assistant...</div>}>
        <AIAssistant />
      </Suspense>
    </div>
  );
}
```

### Data Fetching Patterns
```typescript
// ✅ Good: Use React Query for data fetching
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function useClients(coachId: string) {
  return useQuery({
    queryKey: ['clients', coachId],
    queryFn: () => clientService.getCoachClients(coachId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

function useCreateClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clientService.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
```

## Security Standards

### Input Sanitization
```typescript
// ✅ Good: Sanitize user inputs
import DOMPurify from 'dompurify';

function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

// ✅ Good: Validate and sanitize in API routes
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Validate structure
  const validatedData = planSchema.parse(body);
  
  // Sanitize text fields
  const sanitizedData = {
    ...validatedData,
    title: DOMPurify.sanitize(validatedData.title),
    foods: validatedData.foods.map(food => ({
      ...food,
      name: DOMPurify.sanitize(food.name),
      notes: food.notes ? DOMPurify.sanitize(food.notes) : undefined,
    })),
  };
  
  // Process sanitized data
}
```

## Testing Integration Points

### Component Testing Setup
```typescript
// __tests__/components/PlanCard.test.tsx
import { render, screen } from '@testing-library/react';
import { PlanCard } from '@/components/features/plans/PlanCard';
import { mockPlan } from '@/lib/test-utils/mocks';

describe('PlanCard', () => {
  it('displays plan title and food count', () => {
    render(<PlanCard plan={mockPlan} />);
    
    expect(screen.getByText(mockPlan.title)).toBeInTheDocument();
    expect(screen.getByText(`${mockPlan.foods.length} foods`)).toBeInTheDocument();
  });
});
```

## Code Quality Checklist

### Before Committing
- [ ] TypeScript types are properly defined
- [ ] Components follow naming conventions
- [ ] Error handling is implemented
- [ ] Mobile responsiveness is verified
- [ ] Performance considerations are addressed
- [ ] Security validations are in place
- [ ] Tests are written and passing
- [ ] Code is properly documented
