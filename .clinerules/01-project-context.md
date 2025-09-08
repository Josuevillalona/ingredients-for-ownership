# Project Context: Ingredients for Ownership

## Project Overview
**Name**: Ingredients for Ownership (MVP)  
**Type**: Health Coach Web Application  
**Timeline**: 5-10 Weeks  
**Complexity**: Simple MVP with AI Integration  

## Mission Statement
Enable health coaches to rapidly create shareable, color-coded ingredient recommendation pages for clients, eliminating the need for complex client management systems and focusing on simple, visual food guidance.

## Target Users
- **Primary**: Health coaches who need quick ingredient guidance tools (use existing CRM systems)
- **Secondary**: Clients who receive and track ingredient recommendations

## Core Business Logic
### Food Color-Coding System
- **Blue Foods**: Nutrient-dense, unlimited consumption
- **Yellow Foods**: Moderate portions, balanced intake
- **Red Foods**: Limited portions, occasional consumption

### User Workflows
1. **Coach Workflow**: Login → Dashboard → Create Ingredient Document → Color-Code Foods → Share Link
2. **Client Workflow**: Access shared link → View color-coded recommendations → Track food purchases/decisions

## Technical Architecture
### Tech Stack
- **Frontend**: Next.js 14+ (React) with Tailwind CSS
- **Backend**: Node.js via Vercel Serverless Functions
- **Database**: Google Firestore (NoSQL)
- **Authentication**: Firebase Authentication
- **AI Integration**: Google Gemini API (or OpenAI as fallback)
- **Deployment**: Vercel
- **Version Control**: Git

### Key Constraints
- **Serverless Environment**: Functions must be stateless and fast
- **Firestore Limitations**: No complex joins, plan for denormalization
- **Mobile-First**: Coaches often work on mobile devices
- **Offline Considerations**: Basic offline viewing for clients

## Implementation Roadmap (5 Layers)

### Layer 1: Foundation & Core Structure (Weeks 1-2)
**Goal**: Establish new data architecture and complete food database
**Features**:
- New simplified data models (Coach → IngredientsDocuments)
- Complete food database with 200+ items across 8 categories
- Updated authentication and security rules
- Data migration from old client/plan structure

**Success Criteria**:
- New data models deployed to Firestore
- Complete food database seeded and indexed
- Authentication working with new structure

### Layer 2: Dashboard & Document Management (Weeks 1-2)
**Goal**: Replace client management with document management
**Features**:
- Document list dashboard (replace client cards)
- Create new ingredient document functionality
- Share link generation and copying
- Edit/delete document operations

**Success Criteria**:
- Dashboard shows ingredient documents, not clients
- Can create, edit, and share ingredient documents
- Mobile-responsive document management

### Layer 3: Ingredient Editor Interface (Weeks 2-3)
**Goal**: Build comprehensive ingredient color-coding interface
**Features**:
- Category-based food navigation (8 categories)
- Color-coding interface for 200+ food items
- Mobile-optimized touch interactions
- Search and filtering across all foods
- Auto-save and draft management

**Success Criteria**:
- All food categories accessible and navigable
- Color selection works for all foods
- Mobile interface is touch-friendly and performant
- Search functionality works across categories

### Layer 4: Client View & Tracking (Weeks 1-2)
**Goal**: Create public ingredient viewing and tracking system
**Features**:
- Public ingredient pages (no authentication required)
- Color-coded ingredient display for clients
- Checkbox tracking system for food purchases
- Mobile-optimized client experience
- Progress visualization

**Success Criteria**:
- Public pages accessible via share links
- Client tracking functionality works
- Data persists between client visits
- Coach can see client progress

### Layer 5: Polish & Optimization (Week 1)
**Goal**: Performance optimization and production readiness
**Features**:
- Performance optimization for large food database
- Enhanced search and filtering
- Error handling and edge cases
- Beta testing preparation

**Success Criteria**:
- Fast loading with full food database
- Comprehensive error handling
- Ready for beta coach testing

## Data Model Overview
### Core Collections
```
coaches/
  {coachId}
    - email: string
    - name: string
    - createdAt: timestamp

ingredientDocuments/
  {documentId}
    - clientName: string
    - coachId: string (ownership)
    - shareToken: string (for public access)
    - createdAt: timestamp
    - updatedAt: timestamp
    - ingredients: IngredientSelection[]

foodCategories/ (Global - read-only)
  {categoryId}
    - name: string
    - order: number
    - foods: Food[]

IngredientSelection:
  - foodId: string
  - categoryId: string
  - colorCode: 'blue' | 'yellow' | 'red' | null
  - clientChecked: boolean (for tracking)
```

### Key Design Decisions
- **Simplified Structure**: Removed client management complexity
- **Document-Centric**: Focus on ingredient documents, not client relationships
- **Global Food Database**: Standardized food categories across all coaches
- **Token-Based Sharing**: Secure public access without client authentication
- **Client Tracking**: Simple checkbox system for food purchase tracking
  {coachId}/
    - email, name, createdAt
    - subscription status, preferences

clients/
  {clientId}/
    - name, email, coachId
    - sessionNotes, goals, restrictions
    - createdAt, lastUpdated

plans/
  {planId}/
    - clientId, coachId, title
    - foods: [{ name, category, notes }]
    - shareToken, isActive
    - createdAt, lastModified
```

## Success Metrics
### MVP Success Criteria
- [ ] 5+ beta coaches creating ingredient documents
- [ ] 50+ ingredient documents created and shared
- [ ] Average document creation time < 15 minutes
- [ ] 70%+ client engagement with tracking features
- [ ] 90%+ uptime during beta period

### Technical Success Criteria
- [ ] Page load times < 3 seconds (even with 200+ food items)
- [ ] Mobile responsiveness across devices
- [ ] Secure token-based sharing system
- [ ] Fast search across full food database
- [ ] Reliable client tracking data persistence

## Risk Assessment
### High-Risk Areas
1. **UI Complexity with Large Food Database**: 200+ food items in mobile interface
2. **Performance with Full Food Database**: Ensuring fast loading and search
3. **Data Migration**: Moving from client/plan structure to document structure
4. **Mobile UX**: Complex color-coding interface on touch devices

### Mitigation Strategies
1. Implement lazy loading and efficient search indexing
2. Use virtual scrolling and category-based navigation
3. Provide safe data export before migration
4. Extensive mobile testing with real devices
5. Progressive enhancement for core functionality

## Development Principles
1. **Vertical Slice Development**: Each slice delivers complete user value
2. **Mobile-First Design**: Optimize for coach mobile usage
3. **Progressive Enhancement**: Core functionality works without AI
4. **Data Security**: Strict separation between coach accounts
5. **Performance Focus**: Fast loading for busy coaches
