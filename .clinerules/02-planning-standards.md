# Planning Standards: Ingredients for Ownership

## Overview
This document defines task breakdown and planning methodologies specific to the health coaching web application, emphasizing vertical slice development and user-centric feature delivery.

## Vertical Slice Planning Approach

### Core Principle
Each development slice must deliver complete, end-to-end user value that can be tested and validated independently. Never build horizontal layers (e.g., "just the database" or "just the UI") without connecting them to user workflows.

### Slice Definition Template
```markdown
## Slice [N]: [Descriptive Name]
**Duration**: [X weeks]
**Goal**: [One sentence describing user value]
**User Story**: As a [user type], I want [capability] so that [benefit]

### Features
- [ ] Feature 1 (with acceptance criteria)
- [ ] Feature 2 (with acceptance criteria)
- [ ] Feature 3 (with acceptance criteria)

### Success Criteria
- [ ] Objective measure 1
- [ ] Objective measure 2
- [ ] User can complete [specific workflow]

### Technical Dependencies
- Dependency 1: [description and status]
- Dependency 2: [description and status]

### Risk Assessment
- Risk 1: [description and mitigation]
- Risk 2: [description and mitigation]
```

## User Story Templates

### Coach User Stories
```markdown
**Authentication & Setup**
- As a health coach, I want to securely log in so that I can access my ingredient documents
- As a health coach, I want to set up my profile so that clients can identify me

**Document Management**
- As a health coach, I want to create a new ingredient document so that I can provide food guidance to a client
- As a health coach, I want to view my document list so that I can quickly find and manage client recommendations
- As a health coach, I want to copy share links so that I can easily send them to clients

**Ingredient Color-Coding**
- As a health coach, I want to assign color categories to foods so that my client understands portion guidelines
- As a health coach, I want to search across all food categories so that I can quickly find specific items
- As a health coach, I want to save my work automatically so that I don't lose progress
- As a health coach, I want to edit existing documents so that I can update client recommendations

**Sharing & Tracking**
- As a health coach, I want to generate secure share links so that only my clients can access their recommendations
- As a health coach, I want to see client tracking progress so that I can understand their engagement
```

### Client User Stories
```markdown
**Document Access**
- As a client, I want to access my ingredient recommendations via a shared link so that I don't need to create an account
- As a client, I want to view my color-coded food recommendations clearly so that I understand what to prioritize
- As a client, I want to see my recommendations on mobile so that I can reference them while shopping or cooking

**Food Tracking**
- As a client, I want to check off foods I've purchased so that I can track my progress
- As a client, I want to see my completion progress so that I can stay motivated
- As a client, I want my tracking to save automatically so that I don't lose my progress
- As a client, I want to understand what each color means so that I can follow the recommendations correctly
```

## Task Sizing Guidelines

### Small Tasks (1-4 hours)
- Single component creation
- Basic styling updates
- Simple API endpoint
- Unit test for specific function
- Documentation updates

**Example**: Create a FoodItem component that displays name and color category

### Medium Tasks (4-8 hours)
- Complete feature implementation
- Integration between components
- Database schema changes
- Complex form handling
- Authentication flow setup

**Example**: Implement client list page with add/edit/delete functionality

### Large Tasks (1-2 days)
- End-to-end workflow implementation
- AI integration features
- Complex state management
- Performance optimization
- Security implementation

**Example**: Build complete ingredient document creation workflow from start to shareable link

### Extra Large Tasks (2+ days)
These should be broken down into smaller tasks. If a task takes more than 2 days, it's not properly decomposed.

## Dependency Mapping

### Critical Path Dependencies
1. **Authentication** → All other features
2. **Food Database Setup** → Ingredient editor
3. **Document Management** → Ingredient color-coding
4. **Ingredient Editor** → Client sharing
5. **Core Functionality** → Performance optimization

### Parallel Development Opportunities
- UI components can be built alongside data models
- Food database seeding can happen while building interfaces
- Client view can be developed in parallel with coach editor
- Testing can be written in parallel with implementation

## Risk Assessment Patterns

### Technical Risks
```markdown
**Large Food Database Performance**
- Risk: 200+ food items may cause mobile performance issues
- Mitigation: Implement lazy loading, category-based navigation, efficient search indexing
- Monitoring: Test loading times and search performance on mobile devices

**Mobile Touch Interface Complexity**
- Risk: Color-coding interface may be difficult to use on mobile
- Mitigation: Design touch-friendly interfaces, test with real users, implement haptic feedback
- Monitoring: Track user interaction patterns and completion rates

**Public Sharing Security**
- Risk: Share links must be secure but not require client authentication
- Mitigation: Use cryptographically secure tokens, implement proper access controls
- Monitoring: Audit token security and access patterns
```

### Business Risks
```markdown
**User Adoption with Simplified Focus**
- Risk: Coaches may want more features than just ingredient recommendations
- Mitigation: Focus on core value proposition, plan future features based on feedback
- Monitoring: Track user engagement and feature requests

**Client Engagement**
- Risk: Clients may not use tracking features consistently
- Mitigation: Design simple, motivating interface, provide progress visualization
- Monitoring: Track client checkbox usage and engagement metrics
- Monitoring: Regular security reviews and penetration testing
```

## Sprint Planning Process

### Pre-Sprint Planning
1. Review previous sprint outcomes and lessons learned
2. Validate current slice goals against user feedback
3. Assess technical debt and performance issues
4. Update risk assessments based on new information

### Sprint Goal Definition
Each sprint should have ONE clear goal that delivers user value:
- ✅ "Coaches can create and share basic nutritional plans"
- ❌ "Build database schema and some UI components"

### Task Breakdown Process
1. Start with user workflow (end-to-end)
2. Identify required components and APIs
3. Break into testable units
4. Estimate effort and identify dependencies
5. Plan testing and validation approach

### Definition of Ready (for tasks)
- [ ] Clear acceptance criteria defined
- [ ] Dependencies identified and resolved
- [ ] Effort estimated (with confidence level)
- [ ] Testing approach planned
- [ ] Success criteria measurable

### Definition of Done (for tasks)
- [ ] Code implemented and reviewed
- [ ] Tests written and passing
- [ ] Functionality manually tested
- [ ] Documentation updated
- [ ] Deployed to staging environment
- [ ] Acceptance criteria verified

## Quality Gates

### Feature-Level Quality Gates
- [ ] Core user workflow completable end-to-end
- [ ] Mobile responsiveness verified
- [ ] Error handling implemented
- [ ] Performance acceptable (< 3s load times)
- [ ] Security review completed

### Slice-Level Quality Gates
- [ ] All planned features completed
- [ ] Integration testing passed
- [ ] User acceptance testing completed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Ready for user feedback

## Feedback Integration Process

### User Feedback Collection
- Conduct user testing after each slice
- Gather feedback on both functionality and usability
- Document feedback in lessons-learned.md
- Prioritize feedback for next slice planning

### Technical Feedback Integration
- Regular code reviews with focus on maintainability
- Performance monitoring and optimization
- Security audits and improvements
- Dependency updates and maintenance

## Planning Anti-Patterns to Avoid

### ❌ Horizontal Layer Development
Don't build "just the database" or "just the UI" without connecting to user workflows

### ❌ Feature Creep Within Slices
Stick to planned slice scope; new ideas go to backlog for future slices

### ❌ Skipping Testing
Every feature must be testable and tested before moving to next task

### ❌ Ignoring Mobile Experience
All features must work on mobile from the start, not as an afterthought

### ❌ Over-Engineering
Build for current needs, not hypothetical future requirements

## Success Metrics Tracking

### Development Velocity
- Track story points completed per sprint
- Monitor task estimation accuracy
- Measure time from start to deployment

### Quality Metrics
- Bug discovery rate by slice
- Test coverage percentage
- Performance benchmark trends

### User Value Metrics
- Feature adoption rates
- User workflow completion rates
- Time savings compared to PDF workflow
