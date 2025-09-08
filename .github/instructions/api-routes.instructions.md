---
applyTo: "**/app/api/**/*.{ts,js}"
description: "Next.js API route guidelines for serverless functions"
---

# Next.js API Route Guidelines

Apply the [general project guidelines](../../.github/copilot-instructions.md) to all code.

## API Route Structure
- Use proper HTTP methods (GET, POST, PUT, DELETE) semantically
- Implement consistent error handling across all routes
- Return proper HTTP status codes (200, 201, 400, 401, 404, 500)
- Use NextRequest and NextResponse from Next.js 14+
- Structure responses with consistent JSON format

## Authentication and Authorization
- Verify Firebase Auth tokens on all protected routes
- Use getServerSession() for session management
- Return 401 for unauthenticated requests
- Implement coach-specific data isolation
- Exclude public routes for shared plan access only

## Request Validation
- Use Zod schemas for all request body validation
- Validate query parameters and path parameters
- Sanitize all user inputs with DOMPurify
- Return 400 Bad Request for validation failures
- Include detailed validation errors in development

## Firestore Integration
- Use the established service layer pattern (e.g., planService, clientService)
- Implement proper error handling for Firestore operations
- Use transactions for operations that modify multiple documents
- Optimize queries with proper indexing
- Handle Firestore constraints (no complex joins)

## Error Handling
- Implement try-catch blocks for all async operations
- Log errors with contextual information
- Return user-friendly error messages
- Don't expose sensitive information in error responses
- Use consistent error response format

## Performance Optimization
- Keep functions stateless and fast-executing
- Minimize cold start times
- Use appropriate caching strategies
- Optimize Firestore queries for minimal reads
- Implement request/response compression when beneficial

## Security Requirements
- Validate all inputs against injection attacks
- Implement rate limiting for public endpoints
- Use CORS appropriately for client access
- Sanitize outputs to prevent XSS
- Log security-relevant events for monitoring

## Response Patterns
- Use consistent JSON response structures
- Include proper HTTP headers
- Implement proper content-type headers
- Return meaningful data in success responses
- Include request IDs for debugging in development
