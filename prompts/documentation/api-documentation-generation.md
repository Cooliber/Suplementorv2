# API Documentation Generation Prompt

## Context
Comprehensive API documentation generation for the Suplementor T3 Stack platform, focusing on tRPC procedures, supplement data access, and Polish localization support.

## Prompt
```
Generate comprehensive API documentation for the Suplementor platform:

1. **API Architecture Overview**
   - tRPC Integration
     * Type-safe API procedures
     * Input/output validation with Zod
     * Error handling and status codes
     * Authentication and authorization
   
   - Endpoint Categories
     * Supplement data retrieval
     * Search and filtering operations
     * User management and preferences
     * Educational content access
     * Polish localization support

2. **Supplement Data API**
   - Core Supplement Operations
     ```typescript
     // Get supplement by ID
     supplement.getById: publicProcedure
       .input(z.object({ id: z.string() }))
       .query(({ input }) => SupplementWithRelations)
     
     // Search supplements
     supplement.search: publicProcedure
       .input(z.object({ 
         query: z.string(),
         category?: z.string(),
         evidenceLevel?: z.string(),
         language: z.enum(['en', 'pl']).default('pl')
       }))
       .query(({ input }) => SupplementWithRelations[])
     ```
   
   - Advanced Query Operations
     * Filter by clinical applications
     * Sort by evidence quality
     * Pagination for large datasets
     * Related supplement suggestions

3. **Polish Localization API**
   - Language Support Endpoints
     * Get available translations
     * Retrieve localized content
     * Cultural context information
     * Medical terminology glossary
   
   - Content Localization
     * Supplement names and descriptions
     * Clinical application translations
     * Safety information in Polish
     * Educational content localization

4. **Search and Filter API**
   - Advanced Search Capabilities
     ```typescript
     supplement.advancedSearch: publicProcedure
       .input(z.object({
         filters: z.object({
           categories: z.array(SupplementCategorySchema).optional(),
           evidenceLevels: z.array(EvidenceLevelSchema).optional(),
           clinicalApplications: z.array(z.string()).optional(),
           safetyProfile: z.enum(['low', 'medium', 'high']).optional()
         }),
         sort: z.object({
           field: z.enum(['name', 'evidenceLevel', 'lastUpdated']),
           direction: z.enum(['asc', 'desc'])
         }).optional(),
         pagination: z.object({
           page: z.number().min(1),
           limit: z.number().min(1).max(100)
         })
       }))
       .query(({ input }) => PaginatedSupplementResponse)
     ```

5. **Educational Content API**
   - Brain Region Information
     * 3D model data access
     * Region-supplement interactions
     * Polish anatomical terminology
     * Educational descriptions
   
   - Learning Modules
     * Quiz questions and answers
     * Progress tracking
     * Achievement systems
     * Polish educational content

6. **Interaction and Safety API**
   - Drug Interaction Checking
     ```typescript
     interaction.checkDrugInteractions: publicProcedure
       .input(z.object({
         supplementIds: z.array(z.string()),
         medications: z.array(z.string()).optional(),
         userProfile: UserProfileSchema.optional()
       }))
       .query(({ input }) => InteractionAnalysisResponse)
     ```
   
   - Safety Assessment
     * Contraindication checking
     * Dosage validation
     * Side effect information
     * Polish safety warnings

7. **User Management API**
   - User Preferences
     * Language preferences (Polish/English)
     * Educational level settings
     * Supplement tracking
     * Progress monitoring
   
   - Personalization
     * Recommended supplements
     * Learning path customization
     * Cultural context preferences
     * Accessibility settings

8. **Error Handling Documentation**
   - Error Response Format
     ```typescript
     interface APIError {
       code: string;
       message: string;
       polishMessage: string;
       details?: Record<string, any>;
       timestamp: string;
     }
     ```
   
   - Common Error Codes
     * SUPPLEMENT_NOT_FOUND
     * INVALID_SEARCH_QUERY
     * TRANSLATION_MISSING
     * VALIDATION_ERROR
     * RATE_LIMIT_EXCEEDED

9. **Authentication and Authorization**
   - Authentication Methods
     * NextAuth.js integration
     * Session management
     * Token validation
     * Polish user interface
   
   - Authorization Levels
     * Public access (basic supplement info)
     * Registered user access (personalization)
     * Premium access (advanced features)
     * Admin access (content management)

10. **Rate Limiting and Performance**
    - Rate Limiting Rules
      * Public endpoints: 100 requests/minute
      * Authenticated endpoints: 1000 requests/minute
      * Search endpoints: 50 requests/minute
      * Heavy operations: 10 requests/minute
    
    - Performance Guidelines
      * Response time targets (<200ms for simple queries)
      * Caching strategies
      * Database optimization
      * CDN integration for static content

11. **API Versioning and Compatibility**
    - Versioning Strategy
      * Semantic versioning (v1.0.0)
      * Backward compatibility guarantees
      * Deprecation notices
      * Migration guides
    
    - Breaking Change Management
      * Advance notice periods
      * Migration assistance
      * Legacy endpoint support
      * Polish documentation updates

12. **SDK and Integration Examples**
    - TypeScript SDK
      ```typescript
      import { createTRPCClient } from '@trpc/client';
      import type { AppRouter } from './server/api/root';
      
      const client = createTRPCClient<AppRouter>({
        url: 'https://api.suplementor.pl/trpc',
      });
      
      // Get supplement with Polish localization
      const supplement = await client.supplement.getById.query({
        id: 'alpha-gpc',
        language: 'pl'
      });
      ```
    
    - Integration Examples
      * React component integration
      * Mobile app integration
      * Third-party service integration
      * Polish healthcare system integration

Generate comprehensive API documentation with Polish localization focus, practical examples, and integration guidelines for the Suplementor platform.
```

## Expected Output
- Complete API endpoint documentation
- Polish localization API specifications
- Error handling and authentication guidelines
- Integration examples and SDK documentation
- Performance and versioning strategies

## Related Files
- tRPC router definitions
- API endpoint implementations
- Authentication and authorization systems
- Polish localization infrastructure
