# Supplement Data Testing Framework Prompt

## Context
Comprehensive testing framework for supplement data validation, integrity, and functionality in the Suplementor T3 Stack platform with Polish localization focus.

## Prompt
```
Develop comprehensive testing framework for supplement data and functionality:

1. **Testing Architecture Overview**
   - Testing Stack Integration
     * Vitest 3.0+ as primary testing framework
     * JSDOM environment for DOM testing
     * MSW (Mock Service Worker) for API mocking
     * Testing Library for component testing
     * Polish localization testing utilities

2. **Unit Testing Strategy**
   - Supplement Profile Testing
     * Individual supplement data validation
     * Polish translation completeness verification
     * Research study data integrity checks
     * Dosage guideline validation
     * Safety profile completeness testing
   
   - Utility Function Testing
     * Migration utility function validation
     * Search and filter function testing
     * Data transformation accuracy
     * Polish text processing functions
     * Validation helper function testing

3. **Data Integrity Testing**
   - Schema Validation Testing
     ```typescript
     describe('Supplement Schema Validation', () => {
       test('validates complete Alpha-GPC profile', () => {
         const result = validateSupplement(alphaGPCProfile);
         expect(result.success).toBe(true);
       });
       
       test('rejects incomplete supplement data', () => {
         const incomplete = { id: 'test', name: 'Test' };
         const result = validateSupplement(incomplete);
         expect(result.success).toBe(false);
       });
     });
     ```
   
   - Cross-Reference Testing
     * Supplement interaction consistency
     * Research study citation verification
     * Evidence level consistency checks
     * Category classification accuracy

4. **Polish Localization Testing**
   - Translation Completeness Testing
     * Required Polish field validation
     * Character encoding verification (ą, ć, ę, ł, ń, ó, ś, ź, ż)
     * Medical terminology consistency
     * Cultural appropriateness assessment
   
   - Language Quality Testing
     * Grammar and spelling verification
     * Medical terminology accuracy
     * Consistency across supplements
     * User comprehension testing

5. **Integration Testing**
   - Database Integration Testing
     * Supplement data CRUD operations
     * Search functionality testing
     * Filter and sort operation validation
     * Performance testing with large datasets
   
   - API Endpoint Testing
     * tRPC procedure testing
     * Input validation testing
     * Output format verification
     * Error handling validation

6. **Component Testing**
   - Supplement Display Components
     * Supplement card rendering
     * Detail view functionality
     * Polish text display verification
     * Interactive element testing
   
   - Search and Filter Components
     * Search functionality validation
     * Filter option testing
     * Result accuracy verification
     * Performance with large datasets

7. **Performance Testing**
   - Data Loading Performance
     * Supplement database loading times
     * Search response times
     * Filter operation performance
     * Memory usage optimization
   
   - Rendering Performance
     * Component render times
     * Large list virtualization
     * 3D visualization performance
     * Mobile device optimization

8. **Accessibility Testing**
   - Screen Reader Compatibility
     * Polish language screen reader support
     * Semantic HTML structure validation
     * ARIA label accuracy
     * Keyboard navigation testing
   
   - Visual Accessibility
     * Color contrast validation
     * Font size and readability
     * High contrast mode support
     * Motion reduction preferences

9. **Error Handling Testing**
   - Validation Error Testing
     * Invalid supplement data handling
     * Missing translation error handling
     * Network error recovery
     * Graceful degradation testing
   
   - User Error Testing
     * Invalid search queries
     * Malformed filter inputs
     * Network connectivity issues
     * Browser compatibility errors

10. **Mock Data and Fixtures**
    - Test Data Generation
      ```typescript
      const createMockSupplement = (overrides?: Partial<SupplementWithRelations>) => ({
        id: 'test-supplement',
        name: 'Test Supplement',
        polishName: 'Testowy Suplement',
        category: 'NOOTROPIC',
        // ... complete mock data
        ...overrides
      });
      ```
    
    - Polish Test Data
      * Authentic Polish medical terminology
      * Cultural context test scenarios
      * Edge cases for Polish characters
      * Real-world usage patterns

11. **End-to-End Testing**
    - User Journey Testing
      * Supplement discovery workflow
      * Detailed information viewing
      * Interaction checking
      * Educational content consumption
    
    - Cross-Browser Testing
      * Chrome, Firefox, Safari compatibility
      * Mobile browser testing
      * Polish character rendering
      * Performance across platforms

12. **Continuous Testing Integration**
    - Automated Testing Pipeline
      * Pre-commit testing hooks
      * CI/CD integration with GitHub Actions
      * Automated regression testing
      * Performance monitoring
    
    - Quality Gates
      * Code coverage thresholds (80%+ target)
      * Performance benchmarks
      * Accessibility compliance
      * Polish localization completeness

13. **Test Documentation**
    - Testing Guidelines
      * Test writing standards
      * Polish localization testing procedures
      * Performance testing protocols
      * Accessibility testing checklists
    
    - Test Reporting
      * Coverage reports with Polish content analysis
      * Performance metrics tracking
      * Error rate monitoring
      * User experience metrics

Generate comprehensive testing framework with Polish localization focus, performance optimization, and quality assurance for the Suplementor platform.
```

## Expected Output
- Detailed testing strategy and architecture
- Unit and integration test specifications
- Polish localization testing procedures
- Performance and accessibility testing guidelines
- Continuous integration and quality gates

## Related Files
- All supplement data and components
- Testing utilities and mocks
- Polish localization systems
- Performance monitoring tools
