---
applyTo: "**/lib/validations/**/*.{ts,js}"
description: "Zod validation schema guidelines for data validation"
---

# Zod Validation Schema Guidelines

Apply the [general project guidelines](../../.github/copilot-instructions.md) to all code.

## Schema Definition Standards
- Create comprehensive schemas for all data models (Coach, Client, Plan, FoodItem)
- Use descriptive error messages for validation failures
- Implement proper field validation rules based on business requirements
- Export both the schema and inferred TypeScript types
- Group related validation schemas in logical files

## Business Rule Validation
- Enforce food color-coding system validation (blue, yellow, red only)
- Implement proper string length limits based on UI constraints
- Validate email formats where applicable
- Ensure required fields align with business logic
- Implement custom validation for complex business rules

## API Validation Patterns
- Create request/response validation schemas for all API endpoints
- Validate both request bodies and query parameters
- Implement proper error handling for validation failures
- Use transform() for data sanitization and normalization
- Validate file uploads and media content appropriately

## Form Validation Integration
- Design schemas that integrate seamlessly with React Hook Form
- Provide user-friendly error messages for form fields
- Implement real-time validation where appropriate
- Handle complex form validation scenarios (conditional fields)
- Support both client-side and server-side validation

## Data Transformation
- Use z.transform() for data normalization (trim strings, format dates)
- Implement proper type coercion where needed
- Handle optional and nullable fields appropriately
- Transform data for Firestore compatibility (Timestamps, etc.)
- Validate and transform nested objects and arrays

## Error Handling
- Provide specific error messages for each validation rule
- Use z.custom() for complex business logic validation
- Implement proper error aggregation for multiple field failures
- Handle validation errors gracefully in API routes
- Log validation errors for debugging and monitoring

## Performance Optimization
- Use z.lazy() for recursive schema definitions
- Implement schema caching for frequently used validations
- Optimize schema parsing for large data structures
- Use partial schemas for update operations
- Minimize validation overhead in hot code paths

## Security Validation
- Sanitize string inputs to prevent XSS attacks
- Validate data types to prevent injection attacks
- Implement length limits to prevent DoS attacks
- Validate file types and sizes for uploads
- Use allowlists for enum validation rather than blocklists

## Schema Composition
- Use z.intersection() and z.union() for complex type composition
- Create base schemas and extend them for specific use cases
- Implement schema inheritance patterns where appropriate
- Use discriminated unions for polymorphic data structures
- Share common validation rules across related schemas
