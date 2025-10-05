# Prototype to T3 Stack Data Transformation Prompt

## Context
Comprehensive data transformation strategy for migrating from nextjs-roocode-template prototype to Suplementor T3 Stack implementation, maintaining data integrity and enhancing structure.

## Prompt
```
Develop comprehensive data transformation strategy for prototype to T3 Stack migration:

1. **Migration Architecture Overview**
   - Source: nextjs-roocode-template prototype
   - Target: Suplementor T3 Stack (Next.js 15, Prisma, tRPC, TypeScript 5.8+)
   - Data preservation requirements
   - Enhancement opportunities
   - Polish localization integration

2. **Data Structure Transformation**
   - Prototype SupplementProfile → T3 SupplementWithRelations
     * Simple arrays → Complex nested objects
     * Basic strings → Multilingual fields (English + Polish)
     * Limited metadata → Comprehensive research integration
     * Basic safety → Detailed interaction profiles
   
   - Schema Evolution Strategy
     * Backward compatibility considerations
     * Version control for data structures
     * Migration rollback procedures
     * Data validation at each step

3. **Enhanced Data Fields**
   - Polish Localization Fields
     * polishName, polishDescription, polishCommonNames
     * polishContraindications, polishManagement
     * polishMechanism, polishRecommendation
     * Cultural context adaptations
   
   - Research Enhancement
     * PubMed ID integration
     * DOI linking
     * Quality score assessment (0-10 scale)
     * Effect size quantification
     * Participant count tracking
   
   - Clinical Application Expansion
     * Efficacy ratings with evidence levels
     * Recommendation grades (A, B, C, D)
     * Duration and dosage specifications
     * Population-specific considerations

4. **Migration Utility Functions**
   ```typescript
   // Core transformation functions
   migrateSupplementProfile(prototype: SupplementProfile): SupplementWithRelations
   mapCategory(prototypeCategory: string): SupplementCategory
   mapEvidenceLevel(prototypeLevel: string): EvidenceLevel
   mapStudyType(prototypeType: string): StudyType
   enhanceWithPolishTranslations(data: any): any
   ```

5. **Data Quality Assurance**
   - Validation Pipeline
     * Zod schema validation at each step
     * Type safety enforcement
     * Required field verification
     * Data integrity checks
   
   - Quality Metrics
     * Translation completeness (100% target)
     * Research study coverage (minimum 1 per supplement)
     * Evidence level distribution analysis
     * Safety profile completeness

6. **Batch Migration Strategy**
   - Phase 1: Core nootropics (Alpha-GPC, L-Theanine, Caffeine) ✅
   - Phase 2: Adaptogens and vitamins (Ashwagandha, B-Complex, Magnesium) ✅
   - Phase 3: Remaining supplements (14+ profiles)
   - Phase 4: Knowledge graph data (brain regions, interactions)
   - Phase 5: Educational content and quizzes

7. **Error Handling and Recovery**
   - Migration Error Types
     * Schema validation failures
     * Translation missing errors
     * Research data inconsistencies
     * Type conversion errors
   
   - Recovery Strategies
     * Automatic retry mechanisms
     * Fallback to default values
     * Manual intervention protocols
     * Data repair procedures

8. **Performance Considerations**
   - Large Dataset Handling
     * Streaming migration for large files
     * Memory-efficient processing
     * Progress tracking and reporting
     * Parallel processing where possible
   
   - Database Integration
     * Prisma schema compatibility
     * Efficient bulk operations
     * Index optimization
     * Query performance testing

9. **Testing and Validation**
   - Migration Testing Strategy
     * Unit tests for transformation functions
     * Integration tests for complete workflows
     * Data integrity verification
     * Performance benchmarking
   
   - Validation Checkpoints
     * Pre-migration data audit
     * Mid-migration progress checks
     * Post-migration verification
     * User acceptance testing

10. **Documentation and Tracking**
    - Migration Documentation
      * Transformation mapping tables
      * Decision rationale records
      * Known limitations documentation
      * Future enhancement roadmap
    
    - Progress Tracking
      * Migration status dashboard
      * Quality metrics monitoring
      * Error rate tracking
      * Performance metrics

11. **Rollback and Recovery**
    - Backup Strategies
      * Complete prototype data backup
      * Incremental migration snapshots
      * Version-controlled transformations
      * Recovery point objectives
    
    - Rollback Procedures
      * Automated rollback triggers
      * Manual rollback protocols
      * Data consistency verification
      * Service continuity planning

12. **Future-Proofing**
    - Extensibility Considerations
      * New supplement addition workflows
      * Schema evolution procedures
      * Localization expansion (beyond Polish)
      * Research data integration automation
    
    - Maintenance Procedures
      * Regular data quality audits
      * Translation update workflows
      * Research evidence updates
      * Performance optimization cycles

Generate comprehensive migration strategy with detailed implementation guidelines, quality assurance procedures, and Polish localization focus for the Suplementor T3 Stack transformation.
```

## Expected Output
- Detailed migration architecture and strategy
- Data transformation specifications
- Quality assurance and validation procedures
- Error handling and recovery protocols
- Future-proofing and maintenance guidelines

## Related Files
- Migration utility functions
- All supplement profile transformations
- Quality validation scripts
- Polish localization systems
