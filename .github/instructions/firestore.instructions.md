---
applyTo: "**/lib/firebase/**/*.{ts,js}"
description: "Firestore database interaction patterns and service layer guidelines"
---

# Firestore Database Guidelines

Apply the [general project guidelines](../../.github/copilot-instructions.md) to all code.

## Service Layer Pattern
- Create service classes for each major entity (PlanService, ClientService, CoachService)
- Use dependency injection patterns where appropriate
- Implement consistent method naming (get*, create*, update*, delete*)
- Export singleton instances for use across the application
- Keep service methods focused and single-purpose

## Data Model Adherence
- Follow the established Firestore collection structure:
  - coaches/{coachId}
  - clients/{clientId}
  - plans/{planId}
- Use proper TypeScript interfaces for all document structures
- Implement Firestore Timestamp for all date fields
- Use proper field indexing for query optimization

## Query Optimization
- Use compound queries with proper index planning
- Implement pagination for large result sets
- Use where() clauses efficiently to minimize reads
- Order queries appropriately (orderBy after where clauses)
- Implement proper error handling for failed queries

## Security Implementation
- Enforce coach data isolation in all queries
- Use where('coachId', '==', coachId) for coach-specific data
- Implement proper soft deletion (isActive: false)
- Validate document ownership before operations
- Use Firestore security rules as backup, not primary security

## Transaction Patterns
- Use transactions for operations affecting multiple documents
- Keep transactions small and fast
- Implement proper retry logic for transaction conflicts
- Handle transaction failures gracefully
- Use batched writes for bulk operations when appropriate

## Error Handling
- Implement specific error types for different failure scenarios
- Handle network errors and offline scenarios
- Provide meaningful error messages for debugging
- Log Firestore errors with document IDs and operation context
- Implement exponential backoff for retry operations

## Data Validation
- Validate data before writing to Firestore
- Use Zod schemas for document structure validation
- Sanitize string fields before storage
- Implement field-level validation for required fields
- Handle Firestore data type constraints

## Performance Patterns
- Use get() for single document retrieval
- Use onSnapshot() for real-time updates only when necessary
- Implement proper cleanup for listeners
- Cache frequently accessed documents
- Minimize the number of document reads per operation

## Share Token Management
- Generate cryptographically secure share tokens
- Index share tokens for efficient lookup
- Implement token expiration where appropriate
- Handle token collision scenarios
- Validate token format and ownership
