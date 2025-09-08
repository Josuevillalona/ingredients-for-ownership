# Ingredients for Ownership - General Coding Instructions

## Project Overview
This is a health coaching web application that helps coaches create personalized nutritional plans for clients, replacing PDF-based workflows with AI-assisted plan generation.

**Mission**: Replace manual PDF workflows with dynamic, AI-assisted nutritional plan creation
**Tech Stack**: Next.js 14+, React 18+, TypeScript, Tailwind CSS, Firestore, Firebase Auth, Google Gemini AI
**Deployment**: Vercel (serverless functions)

## Core Business Logic
### Food Color-Coding System
- **Blue Foods**: Nutrient-dense, unlimited consumption
- **Yellow Foods**: Moderate portions, balanced intake  
- **Red Foods**: Limited portions, occasional consumption

### User Workflows
- **Coach Workflow**: Login → Select Client → Create/Edit Plan → Share with Client
- **Client Workflow**: Access shared link → View plan → Follow recommendations

## General Coding Principles

### Architecture Constraints
- **Serverless Environment**: All functions must be stateless and fast-executing
- **Mobile-First**: Coaches primarily work on mobile devices - optimize for touch interfaces
- **Performance**: Target page load times under 3 seconds
- **Offline Considerations**: Basic offline viewing capability for clients

### Code Quality Standards
- Use TypeScript for all new code with strict type checking
- Follow functional programming principles where possible
- Implement comprehensive error handling with user-friendly messages
- Use Zod for all data validation at API boundaries
- Prioritize code readability and maintainability

### Security Requirements
- Strict data isolation between coach accounts
- All API routes require authentication except public plan sharing
- Sanitize all user inputs using DOMPurify
- Implement proper Firebase security rules
- Use HTTPS everywhere (enforced by Vercel)

### Performance Guidelines
- Implement code splitting and lazy loading for non-critical components
- Use React.memo for expensive re-renders
- Optimize Firestore queries with proper indexing
- Minimize bundle size for mobile networks
- Cache responses where appropriate

### Error Handling Standards
- Implement error boundaries for React components
- Provide meaningful error messages to users
- Log errors for debugging but don't expose sensitive information
- Always handle loading and error states in UI components
- Use try-catch blocks for all async operations

### Data Management
- Design for Firestore strengths (no complex joins, plan for denormalization)
- Use proper TypeScript interfaces for all data models
- Implement optimistic updates where appropriate
- Cache frequently accessed data
- Follow the established data model patterns for coaches, clients, and plans

### Mobile Optimization
- Use mobile-first responsive design principles
- Ensure touch-friendly interface elements (minimum 44px touch targets)
- Optimize for various screen sizes and orientations
- Consider network limitations and loading states
- Test on actual mobile devices

### AI Integration Guidelines
- Implement AI features as enhancements, not dependencies
- Provide fallback functionality when AI services are unavailable
- Handle API rate limits and errors gracefully
- Use AI to accelerate workflows, not replace core functionality
- Maintain user control over AI-generated content

### Development Workflow
- Follow vertical slice development - each feature should deliver complete user value
- Implement progressive enhancement - core functionality works without advanced features
- Prioritize MVP features that directly support the coach-client workflow
- Test on mobile devices throughout development
- Document any deviations from established patterns
