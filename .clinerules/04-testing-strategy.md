# Testing Strategy: Ingredients for Ownership

## Overview
This document outlines the comprehensive testing approach for the health coaching web application, covering unit tests, integration tests, and end-to-end testing strategies specific to the Next.js/React/Firestore tech stack.

## Testing Philosophy

### Core Principles
1. **Test User Workflows**: Focus on testing complete user journeys, not just individual functions
2. **Mobile-First Testing**: Ensure all tests consider mobile user experience
3. **Data Integrity**: Verify coach-client data separation and security
4. **Performance Testing**: Validate load times and responsiveness
5. **AI Integration Testing**: Test AI features with fallback scenarios

### Testing Pyramid
```
                    E2E Tests (10%)
                 ┌─────────────────┐
                 │ User Workflows  │
                 │ Cross-browser   │
                 └─────────────────┘
              
              Integration Tests (30%)
           ┌─────────────────────────┐
           │ API Routes + Database   │
           │ Component Integration   │
           │ Authentication Flows    │
           └─────────────────────────┘
           
         Unit Tests (60%)
    ┌─────────────────────────────────┐
    │ Components, Hooks, Utilities    │
    │ Business Logic, Validations     │
    │ Service Layer Functions         │
    └─────────────────────────────────┘
```

## Unit Testing Standards

### Component Testing with React Testing Library
```typescript
// __tests__/components/FoodColorBadge.test.tsx
import { render, screen } from '@testing-library/react';
import { FoodColorBadge } from '@/components/ui/FoodColorBadge';

describe('FoodColorBadge', () => {
  it('renders blue food badge correctly', () => {
    render(<FoodColorBadge color="blue">Spinach</FoodColorBadge>);
    
    const badge = screen.getByText('Spinach');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('renders yellow food badge correctly', () => {
    render(<FoodColorBadge color="yellow">Rice</FoodColorBadge>);
    
    const badge = screen.getByText('Rice');
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('renders red food badge correctly', () => {
    render(<FoodColorBadge color="red">Cake</FoodColorBadge>);
    
    const badge = screen.getByText('Cake');
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });
});
```

### Form Testing Patterns
```typescript
// __tests__/components/PlanCreationForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlanCreationForm } from '@/components/features/plans/PlanCreationForm';
import { mockClient } from '@/lib/test-utils/mocks';

const mockOnSave = jest.fn();

describe('PlanCreationForm', () => {
  beforeEach(() => {
    mockOnSave.mockClear();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<PlanCreationForm client={mockClient} onSave={mockOnSave} />);
    
    const submitButton = screen.getByRole('button', { name: /save plan/i });
    await user.click(submitButton);
    
    expect(screen.getByText('Plan title is required')).toBeInTheDocument();
    expect(screen.getByText('At least one food item is required')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('submits valid plan data', async () => {
    const user = userEvent.setup();
    render(<PlanCreationForm client={mockClient} onSave={mockOnSave} />);
    
    // Fill in form
    await user.type(screen.getByLabelText(/plan title/i), 'Weight Loss Plan');
    await user.type(screen.getByLabelText(/food name/i), 'Spinach');
    await user.selectOptions(screen.getByLabelText(/food category/i), 'blue');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /save plan/i }));
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        clientId: mockClient.id,
        title: 'Weight Loss Plan',
        foods: [{ name: 'Spinach', category: 'blue' }]
      });
    });
  });

  it('handles submission errors gracefully', async () => {
    const user = userEvent.setup();
    mockOnSave.mockRejectedValue(new Error('Network error'));
    
    render(<PlanCreationForm client={mockClient} onSave={mockOnSave} />);
    
    // Fill and submit form
    await user.type(screen.getByLabelText(/plan title/i), 'Test Plan');
    await user.type(screen.getByLabelText(/food name/i), 'Apple');
    await user.click(screen.getByRole('button', { name: /save plan/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to save plan')).toBeInTheDocument();
    });
  });
});
```

### Custom Hook Testing
```typescript
// __tests__/hooks/usePlanCreation.test.tsx
import { renderHook, act } from '@testing-library/react';
import { usePlanCreation } from '@/hooks/usePlanCreation';
import { planService } from '@/lib/firebase/plans';

jest.mock('@/lib/firebase/plans');
const mockPlanService = planService as jest.Mocked<typeof planService>;

describe('usePlanCreation', () => {
  it('creates plan successfully', async () => {
    const mockPlan = { id: '1', title: 'Test Plan', foods: [] };
    mockPlanService.createPlan.mockResolvedValue(mockPlan);
    
    const { result } = renderHook(() => usePlanCreation('client-1'));
    
    await act(async () => {
      await result.current.createPlan({ title: 'Test Plan', foods: [] });
    });
    
    expect(result.current.state.status).toBe('success');
    expect(result.current.state.data).toEqual(mockPlan);
  });

  it('handles creation errors', async () => {
    mockPlanService.createPlan.mockRejectedValue(new Error('Database error'));
    
    const { result } = renderHook(() => usePlanCreation('client-1'));
    
    await act(async () => {
      await result.current.createPlan({ title: 'Test Plan', foods: [] });
    });
    
    expect(result.current.state.status).toBe('error');
    expect(result.current.state.error).toBe('Database error');
  });
});
```

### Validation Testing
```typescript
// __tests__/validations/plan.test.ts
import { validatePlan, planSchema } from '@/lib/validations/plan';

describe('Plan Validation', () => {
  it('validates correct plan data', () => {
    const validPlan = {
      clientId: 'client-123',
      title: 'Healthy Eating Plan',
      foods: [
        { name: 'Spinach', category: 'blue' as const },
        { name: 'Rice', category: 'yellow' as const, portion: '1 cup' }
      ]
    };
    
    expect(() => validatePlan(validPlan)).not.toThrow();
  });

  it('rejects plan without title', () => {
    const invalidPlan = {
      clientId: 'client-123',
      title: '',
      foods: [{ name: 'Spinach', category: 'blue' as const }]
    };
    
    expect(() => validatePlan(invalidPlan)).toThrow('Plan title is required');
  });

  it('rejects plan without foods', () => {
    const invalidPlan = {
      clientId: 'client-123',
      title: 'Test Plan',
      foods: []
    };
    
    expect(() => validatePlan(invalidPlan)).toThrow('At least one food item is required');
  });

  it('rejects invalid food categories', () => {
    const invalidPlan = {
      clientId: 'client-123',
      title: 'Test Plan',
      foods: [{ name: 'Apple', category: 'purple' as any }]
    };
    
    expect(() => validatePlan(invalidPlan)).toThrow();
  });
});
```

## Integration Testing

### API Route Testing
```typescript
// __tests__/api/plans.test.ts
import { createMocks } from 'node-mocks-http';
import { GET, POST } from '@/app/api/plans/route';
import { getServerSession } from 'next-auth';
import { planService } from '@/lib/firebase/plans';

jest.mock('next-auth');
jest.mock('@/lib/firebase/plans');

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockPlanService = planService as jest.Mocked<typeof planService>;

describe('/api/plans', () => {
  describe('GET', () => {
    it('returns plans for authenticated coach', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'coach-123', email: 'coach@example.com' }
      });
      
      const mockPlans = [
        { id: '1', title: 'Plan 1', coachId: 'coach-123' },
        { id: '2', title: 'Plan 2', coachId: 'coach-123' }
      ];
      mockPlanService.getCoachPlans.mockResolvedValue(mockPlans);
      
      const { req } = createMocks({ method: 'GET' });
      const response = await GET(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.plans).toEqual(mockPlans);
      expect(mockPlanService.getCoachPlans).toHaveBeenCalledWith('coach-123');
    });

    it('returns 401 for unauthenticated requests', async () => {
      mockGetServerSession.mockResolvedValue(null);
      
      const { req } = createMocks({ method: 'GET' });
      const response = await GET(req);
      
      expect(response.status).toBe(401);
    });
  });

  describe('POST', () => {
    it('creates plan for authenticated coach', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'coach-123', email: 'coach@example.com' }
      });
      
      const planData = {
        clientId: 'client-456',
        title: 'New Plan',
        foods: [{ name: 'Apple', category: 'blue' }]
      };
      
      const createdPlan = { id: 'plan-789', ...planData, coachId: 'coach-123' };
      mockPlanService.createPlan.mockResolvedValue(createdPlan);
      
      const { req } = createMocks({
        method: 'POST',
        body: planData
      });
      
      const response = await POST(req);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.plan).toEqual(createdPlan);
      expect(mockPlanService.createPlan).toHaveBeenCalledWith('coach-123', planData);
    });

    it('validates request data', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'coach-123', email: 'coach@example.com' }
      });
      
      const invalidData = {
        clientId: '',
        title: '',
        foods: []
      };
      
      const { req } = createMocks({
        method: 'POST',
        body: invalidData
      });
      
      const response = await POST(req);
      
      expect(response.status).toBe(400);
    });
  });
});
```

### Firestore Integration Testing
```typescript
// __tests__/lib/firebase/plans.test.ts
import { planService } from '@/lib/firebase/plans';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

jest.mock('firebase/firestore');

const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockQuery = query as jest.MockedFunction<typeof query>;
const mockWhere = where as jest.MockedFunction<typeof where>;

describe('PlanService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPlan', () => {
    it('creates plan with correct data structure', async () => {
      const mockDocRef = { id: 'plan-123' };
      mockAddDoc.mockResolvedValue(mockDocRef as any);
      
      const planData = {
        clientId: 'client-456',
        title: 'Test Plan',
        foods: [{ name: 'Apple', category: 'blue' as const }]
      };
      
      const result = await planService.createPlan('coach-123', planData);
      
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...planData,
          coachId: 'coach-123',
          shareToken: expect.any(String),
          isActive: true,
          createdAt: expect.anything(),
          lastModified: expect.anything()
        })
      );
      
      expect(result.id).toBe('plan-123');
      expect(result.coachId).toBe('coach-123');
    });
  });

  describe('getCoachPlans', () => {
    it('queries plans for specific coach', async () => {
      const mockDocs = [
        { id: 'plan-1', data: () => ({ title: 'Plan 1' }) },
        { id: 'plan-2', data: () => ({ title: 'Plan 2' }) }
      ];
      
      mockGetDocs.mockResolvedValue({
        docs: mockDocs
      } as any);
      
      const result = await planService.getCoachPlans('coach-123');
      
      expect(mockQuery).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(), // where coachId
        expect.anything(), // where isActive
        expect.anything()  // orderBy
      );
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('plan-1');
    });
  });
});
```

## End-to-End Testing

### User Workflow Testing with Playwright
```typescript
// e2e/coach-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Coach Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authenticated coach session
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'coach@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('complete plan creation workflow', async ({ page }) => {
    // Navigate to client selection
    await page.click('[data-testid="create-plan-button"]');
    await expect(page).toHaveURL('/dashboard/plans/create');
    
    // Select client
    await page.click('[data-testid="client-selector"]');
    await page.click('[data-testid="client-option-1"]');
    
    // Fill plan details
    await page.fill('[data-testid="plan-title"]', 'Weight Loss Plan');
    
    // Add foods
    await page.click('[data-testid="add-food-button"]');
    await page.fill('[data-testid="food-name-0"]', 'Spinach');
    await page.selectOption('[data-testid="food-category-0"]', 'blue');
    
    await page.click('[data-testid="add-food-button"]');
    await page.fill('[data-testid="food-name-1"]', 'Rice');
    await page.selectOption('[data-testid="food-category-1"]', 'yellow');
    await page.fill('[data-testid="food-portion-1"]', '1 cup');
    
    // Save plan
    await page.click('[data-testid="save-plan-button"]');
    
    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page).toHaveURL('/dashboard/plans');
    
    // Verify plan appears in list
    await expect(page.locator('[data-testid="plan-card"]')).toContainText('Weight Loss Plan');
  });

  test('share plan with client', async ({ page }) => {
    // Navigate to existing plan
    await page.goto('/dashboard/plans');
    await page.click('[data-testid="plan-card"]:first-child');
    
    // Generate share link
    await page.click('[data-testid="share-plan-button"]');
    
    // Copy share link
    const shareLink = await page.locator('[data-testid="share-link"]').textContent();
    expect(shareLink).toMatch(/\/plan\/[a-zA-Z0-9]+/);
    
    // Test client view (open in new context to simulate different user)
    const clientContext = await page.context().browser()?.newContext();
    const clientPage = await clientContext?.newPage();
    
    if (clientPage && shareLink) {
      await clientPage.goto(shareLink);
      
      // Verify client can view plan
      await expect(clientPage.locator('[data-testid="plan-title"]')).toBeVisible();
      await expect(clientPage.locator('[data-testid="food-list"]')).toBeVisible();
      
      // Verify color-coded foods are displayed
      await expect(clientPage.locator('[data-testid="blue-foods"]')).toBeVisible();
      await expect(clientPage.locator('[data-testid="yellow-foods"]')).toBeVisible();
      
      await clientContext?.close();
    }
  });
});
```

### Mobile Testing
```typescript
// e2e/mobile-workflow.spec.ts
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

test.describe('Mobile Coach Experience', () => {
  test('plan creation on mobile', async ({ page }) => {
    await page.goto('/login');
    
    // Test mobile-friendly login
    await page.fill('[data-testid="email"]', 'coach@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.tap('[data-testid="login-button"]');
    
    // Test mobile navigation
    await page.tap('[data-testid="mobile-menu-button"]');
    await page.tap('[data-testid="create-plan-link"]');
    
    // Test mobile form interaction
    await page.tap('[data-testid="client-selector"]');
    await page.tap('[data-testid="client-option-1"]');
    
    // Test touch-friendly food addition
    await page.fill('[data-testid="plan-title"]', 'Mobile Plan');
    await page.tap('[data-testid="add-food-button"]');
    
    // Verify mobile-optimized layout
    const foodForm = page.locator('[data-testid="food-form"]');
    await expect(foodForm).toBeVisible();
    
    // Test mobile keyboard interaction
    await page.fill('[data-testid="food-name-0"]', 'Apple');
    await page.tap('[data-testid="food-category-0"]');
    await page.tap('[data-testid="category-blue"]');
    
    await page.tap('[data-testid="save-plan-button"]');
    
    // Verify mobile success state
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
});
```

## Performance Testing

### Load Time Testing
```typescript
// __tests__/performance/page-load.test.ts
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('dashboard loads within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('plan creation form is responsive', async ({ page }) => {
    await page.goto('/dashboard/plans/create');
    
    // Measure time to interactive
    const startTime = Date.now();
    await page.waitForSelector('[data-testid="plan-title"]');
    await page.fill('[data-testid="plan-title"]', 'Test');
    const interactiveTime = Date.now() - startTime;
    
    expect(interactiveTime).toBeLessThan(1000);
  });
});
```

## AI Integration Testing

### AI Service Testing
```typescript
// __tests__/lib/ai/plan-generator.test.ts
import { generatePlanFromNotes } from '@/lib/ai/plan-generator';
import { geminiService } from '@/lib/ai/gemini';

jest.mock('@/lib/ai/gemini');
const mockGeminiService = geminiService as jest.Mocked<typeof geminiService>;

describe('AI Plan Generator', () => {
  it('generates plan from session notes', async () => {
    const mockResponse = {
      foods: [
        { name: 'Spinach', category: 'blue', notes: 'Rich in iron' },
        { name: 'Quinoa', category: 'yellow', portion: '1/2 cup' }
      ]
    };
    
    mockGeminiService.generatePlan.mockResolvedValue(mockResponse);
    
    const sessionNotes = 'Client wants to lose weight, vegetarian, iron deficiency';
    const result = await generatePlanFromNotes(sessionNotes);
    
    expect(result.foods).toHaveLength(2);
    expect(result.foods[0].category).toBe('blue');
    expect(mockGeminiService.generatePlan).toHaveBeenCalledWith(sessionNotes);
  });

  it('handles AI service failures gracefully', async () => {
    mockGeminiService.generatePlan.mockRejectedValue(new Error('API Error'));
    
    const sessionNotes = 'Client wants to lose weight';
    
    await expect(generatePlanFromNotes(sessionNotes)).rejects.toThrow('AI service unavailable');
  });

  it('validates AI-generated content', async () => {
    const invalidResponse = {
      foods: [
        { name: '', category: 'purple' } // Invalid data
      ]
    };
    
    mockGeminiService.generatePlan.mockResolvedValue(invalidResponse);
    
    const sessionNotes = 'Client wants to lose weight';
    
    await expect(generatePlanFromNotes(sessionNotes)).rejects.toThrow('Invalid AI response');
  });
});
```

## Test Data Management

### Mock Data Factory
```typescript
// lib/test-utils/mocks.ts
import { Coach, Client, Plan, FoodItem } from '@/lib/types';

export const createMockCoach = (overrides: Partial<Coach> = {}): Coach => ({
  id: 'coach-123',
  email: 'coach@example.com',
  name: 'Dr. Smith',
  createdAt: new Date(),
  preferences: {
    colorCodingStyle: 'standard'
  },
  ...overrides
});

export const createMockClient = (overrides: Partial<Client> = {}): Client => ({
  id: 'client-456',
  coachId: 'coach-123',
  name: 'John Doe',
  email: 'john@example.com',
  sessionNotes: 'Wants to lose weight, vegetarian',
  goals: ['weight loss', 'energy'],
  restrictions: ['vegetarian'],
  createdAt: new Date(),
  lastUpdated: new Date(),
  ...overrides
});

export const createMockPlan = (overrides: Partial<Plan> = {}): Plan => ({
  id: 'plan-789',
  clientId: 'client-456',
  coachId: 'coach-123',
  title: 'Weight Loss Plan',
  foods: [
    { name: 'Spinach', category: 'blue' },
    { name: 'Rice', category: 'yellow', portion: '1 cup' }
  ],
  shareToken: 'abc123xyz',
  isActive: true,
  createdAt: new Date(),
  lastModified: new Date(),
  ...overrides
});
```

## Testing Checklist

### Before Each Release
- [ ] All unit tests passing
- [ ] Integration tests covering API routes
- [ ] E2E tests for critical user workflows
- [ ] Mobile responsiveness verified
- [ ] Performance benchmarks met
- [ ] AI integration tested with fallbacks
- [ ] Security tests for data isolation
- [ ] Cross-browser compatibility verified

### Slice-Specific Testing
- [ ] **Slice 1**: Basic auth and plan creation workflow
- [ ] **Slice 2**: Multi-client management and data separation
- [ ] **Slice 3**: AI integration and template functionality
- [ ] **Slice 4**: Performance optimization and error handling

### Continuous Testing
- [ ] Automated test runs on every commit
- [ ] Performance monitoring in staging
- [ ] User acceptance testing after each slice
- [ ] Security audits for authentication flows
