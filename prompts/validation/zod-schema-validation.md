# Zod Schema Validation Framework Prompt

## Context
Comprehensive Zod validation framework for the Suplementor T3 Stack, ensuring type safety, data integrity, and Polish localization compliance.

## Prompt
```
Develop comprehensive Zod validation framework for supplement data:

1. **Core Schema Architecture**
   - Hierarchical Validation Structure
     * Base schemas for primitive types
     * Composite schemas for complex objects
     * Union schemas for variant types
     * Conditional schemas for dependent fields
   
   - Polish Localization Validation
     * Required Polish translations for user-facing content
     * Character encoding validation (UTF-8 with Polish characters)
     * Cultural appropriateness checks
     * Medical terminology consistency

2. **Supplement Profile Validation**
   ```typescript
   // Core supplement schema with Polish requirements
   const SupplementSchema = z.object({
     id: z.string().cuid(),
     name: z.string().min(2).max(100),
     polishName: z.string().min(2).max(100),
     scientificName: z.string().optional(),
     commonNames: z.array(z.string()).min(1),
     polishCommonNames: z.array(z.string()).min(1),
     category: SupplementCategorySchema,
     description: z.string().max(1000).optional(),
     polishDescription: z.string().max(1000).optional(),
     // ... additional fields with validation rules
   });
   ```

3. **Complex Nested Validation**
   - Active Compounds Validation
     * Concentration format validation (e.g., "300mg", "5%")
     * Bioavailability range (0-100%)
     * Half-life format validation
     * Metabolic pathway array validation
   
   - Clinical Applications Validation
     * Evidence level enum validation
     * Efficacy rating validation
     * Dosage format standardization
     * Effect size range validation (0-2.0)
     * Study count minimum requirements

4. **Research Study Validation**
   - Study Metadata Validation
     * PubMed ID format (8-digit numbers)
     * DOI format validation (10.xxxx/xxxxx)
     * Year range validation (1900-current year)
     * Quality score range (0-10)
   
   - Study Type Validation
     * Enum validation for study types
     * Evidence level consistency checks
     * Sample size minimum requirements
     * Duration format validation

5. **Safety Profile Validation**
   - Side Effects Validation
     * Frequency enum validation (common, uncommon, rare, very_rare)
     * Severity enum validation (mild, moderate, severe)
     * Time-to-onset format validation
     * Management instruction requirements
   
   - Interaction Validation
     * Interaction type enum validation
     * Severity level validation
     * Evidence level requirements
     * Polish translation completeness

6. **Dosage Guidelines Validation**
   - Therapeutic Range Validation
     * Minimum/maximum logical consistency (min < max)
     * Unit standardization (mg, mcg, g, IU)
     * Positive number requirements
     * Reasonable range checks
   
   - Timing Validation
     * Valid timing options (morning, afternoon, evening, etc.)
     * Food interaction boolean validation
     * Contraindication array validation

7. **Polish Localization Validation**
   - Translation Completeness
     * Required Polish fields validation
     * Character encoding verification
     * Length consistency between languages
     * Cultural appropriateness checks
   
   - Medical Terminology Validation
     * Standardized Polish medical terms
     * Consistency across supplements
     * Anatomical terminology accuracy
     * Clinical term appropriateness

8. **Custom Validation Rules**
   - Business Logic Validation
     * Evidence level consistency with study quality
     * Dosage range reasonableness
     * Interaction severity appropriateness
     * Research study relevance
   
   - Cross-Field Validation
     * Category-specific field requirements
     * Evidence level minimum study requirements
     * Safety profile completeness
     * Polish translation consistency

9. **Error Handling and Reporting**
   - Validation Error Types
     * Schema validation errors
     * Business rule violations
     * Translation completeness errors
     * Data consistency issues
   
   - Error Message Localization
     * Polish error messages for user-facing validation
     * Technical error messages for developers
     * Contextual error information
     * Suggested corrections

10. **Performance Optimization**
    - Validation Performance
      * Schema compilation optimization
      * Lazy validation for large objects
      * Caching for repeated validations
      * Streaming validation for large datasets
    
    - Memory Management
      * Schema instance reuse
      * Garbage collection optimization
      * Memory leak prevention
      * Resource cleanup procedures

11. **Testing Framework**
    - Validation Testing Strategy
      * Valid data test cases
      * Invalid data test cases
      * Edge case testing
      * Performance testing
    
    - Test Data Generation
      * Valid supplement profile generators
      * Invalid data generators for error testing
      * Polish localization test data
      * Boundary condition test cases

12. **Integration with T3 Stack**
    - tRPC Integration
      * Input validation for API endpoints
      * Output validation for responses
      * Error handling integration
      * Type inference optimization
    
    - Prisma Integration
      * Database schema validation
      * Migration validation
      * Data integrity checks
      * Query result validation

Generate comprehensive Zod validation framework with Polish localization focus, performance optimization, and T3 Stack integration for the Suplementor platform.
```

## Expected Output
- Comprehensive Zod schema definitions
- Polish localization validation rules
- Error handling and reporting systems
- Performance optimization strategies
- T3 Stack integration guidelines

## Related Files
- All supplement type definitions
- Validation utility functions
- Error handling systems
- Polish localization requirements
