# Suplementor Development Specifications
## Comprehensive Standards for T3 Stack Implementation

### Overview
This document establishes strict development standards for the Suplementor application, ensuring consistency, type safety, and adherence to Polish localization requirements.

## 1. Data Structure Standards

### 1.1 Supplement Schema Requirements
All supplement data must conform to the following Zod schema structure:

```typescript
export const SupplementSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(2).max(100),
  polishName: z.string().min(2).max(100),
  scientificName: z.string().optional(),
  commonNames: z.array(z.string()),
  polishCommonNames: z.array(z.string()),
  category: z.nativeEnum(SupplementCategory),
  description: z.string().max(1000).optional(),
  polishDescription: z.string().max(1000).optional(),
  
  // Active compounds with validation
  activeCompounds: z.array(z.object({
    name: z.string(),
    polishName: z.string().optional(),
    concentration: z.string().optional(),
    bioavailability: z.number().min(0).max(100).optional(),
    halfLife: z.string().optional(),
  })),
  
  // Clinical applications
  clinicalApplications: z.array(z.object({
    condition: z.string(),
    polishCondition: z.string(),
    efficacy: z.enum(['high', 'moderate', 'low', 'insufficient']),
    evidenceLevel: z.nativeEnum(EvidenceLevel),
    recommendedDose: z.string(),
    duration: z.string().optional(),
  })),
  
  // Mechanisms of action
  mechanisms: z.array(z.object({
    pathway: z.string(),
    description: z.string(),
    polishDescription: z.string(),
    evidenceLevel: z.nativeEnum(EvidenceLevel),
    targetSystems: z.array(z.string()).optional(),
  })),
  
  // Dosage guidelines
  dosageGuidelines: z.object({
    therapeuticRange: z.object({
      min: z.number().positive(),
      max: z.number().positive(),
      unit: z.string(),
    }),
    timing: z.array(z.string()),
    withFood: z.boolean(),
    contraindications: z.array(z.string()),
    polishContraindications: z.array(z.string()),
  }),
  
  // Safety profile
  sideEffects: z.array(z.object({
    effect: z.string(),
    polishEffect: z.string(),
    frequency: z.enum(['common', 'uncommon', 'rare', 'very_rare']),
    severity: z.enum(['mild', 'moderate', 'severe']),
    reversible: z.boolean(),
  })),
  
  // Interactions
  interactions: z.array(z.object({
    substance: z.string(),
    polishSubstance: z.string(),
    type: z.enum(['synergistic', 'antagonistic', 'additive', 'competitive']),
    severity: z.enum(['severe', 'moderate', 'minor', 'beneficial']),
    description: z.string(),
    polishDescription: z.string(),
  })),
  
  // Evidence and research
  evidenceLevel: z.nativeEnum(EvidenceLevel),
  researchStudies: z.array(z.object({
    title: z.string(),
    polishTitle: z.string().optional(),
    authors: z.array(z.string()),
    journal: z.string(),
    year: z.number().min(1900).max(new Date().getFullYear()),
    studyType: z.enum([
      'systematic_review',
      'meta_analysis',
      'randomized_controlled_trial',
      'cohort_study',
      'case_control_study',
      'cross_sectional_study',
      'case_series',
      'case_report',
      'expert_opinion',
      'in_vitro',
      'animal_study'
    ]),
    primaryOutcome: z.string(),
    polishPrimaryOutcome: z.string().optional(),
    findings: z.string(),
    polishFindings: z.string().optional(),
    pubmedId: z.string().optional(),
    doi: z.string().optional(),
  })),
  
  // Metadata
  tags: z.array(z.string()),
  lastUpdated: z.string().datetime(),
  createdAt: z.string().datetime(),
});
```

### 1.2 Knowledge Graph Schema
```typescript
export const KnowledgeNodeSchema = z.object({
  id: z.string().cuid(),
  type: z.nativeEnum(NodeType),
  name: z.string(),
  polishName: z.string(),
  description: z.string(),
  polishDescription: z.string().optional(),
  
  // Visual properties for 3D rendering
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  size: z.number().min(1).max(50),
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }).optional(),
  
  // Content properties
  properties: z.record(z.unknown()),
  tags: z.array(z.string()),
  category: z.string(),
  
  // Evidence and reliability
  evidenceLevel: z.nativeEnum(EvidenceLevel),
  sources: z.array(z.string()),
  
  // Graph analytics
  centrality: z.number().optional(),
  clustering: z.number().optional(),
  importance: z.number().optional(),
});

export const KnowledgeRelationshipSchema = z.object({
  id: z.string().cuid(),
  sourceId: z.string().cuid(),
  targetId: z.string().cuid(),
  type: z.nativeEnum(RelationshipType),
  
  // Relationship strength and confidence
  strength: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  bidirectional: z.boolean().default(false),
  
  // Evidence and context
  evidenceLevel: z.nativeEnum(EvidenceLevel),
  mechanism: z.string(),
  polishMechanism: z.string().optional(),
  
  // Temporal properties
  onset: z.string().optional(),
  duration: z.string().optional(),
  reversibility: z.enum(['reversible', 'irreversible', 'partially_reversible']).optional(),
});
```

## 2. Polish Localization Standards

### 2.1 Required Polish Fields
Every user-facing entity MUST include Polish translations:

```typescript
interface PolishLocalizable {
  name: string;           // English name
  polishName: string;     // Polish name (REQUIRED)
  description?: string;   // English description
  polishDescription?: string; // Polish description (REQUIRED if description exists)
}
```

### 2.2 Medical Terminology Standards
- Use official Polish medical terminology from Polish Medical Dictionary
- Neurological terms must follow Polish Neurological Society standards
- Supplement names should include both Polish translation and original name

### 2.3 Character Support
All text fields must support Polish characters: ą, ć, ę, ł, ń, ó, ś, ź, ż

### 2.4 Currency and Pricing
- All prices in EUR (€) format: "od 3,99 €"
- Use Polish decimal separator (comma) in display
- Store as numbers in database for calculations

## 3. Type Safety Standards

### 3.1 Strict TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### 3.2 Zod Validation Requirements
- All API inputs MUST be validated with Zod schemas
- Database models MUST have corresponding Zod schemas
- Form inputs MUST use react-hook-form with Zod resolvers

### 3.3 Error Handling Standards
```typescript
// Standard error response type
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    polishMessage: z.string(),
    details: z.unknown().optional(),
  }),
});

// Standard success response type
export const SuccessResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
  });
```

## 4. Database Schema Standards

### 4.1 Naming Conventions
- Table names: PascalCase (e.g., `Supplement`, `KnowledgeNode`)
- Field names: camelCase (e.g., `polishName`, `evidenceLevel`)
- Enum values: UPPER_SNAKE_CASE (e.g., `STRONG`, `MODERATE`)

### 4.2 Required Fields for All Models
```prisma
model BaseModel {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 4.3 Indexing Strategy
- Index all foreign keys
- Index frequently queried fields (category, evidenceLevel, type)
- Composite indexes for common query patterns

### 4.4 JSON Field Standards
For complex nested data, use JSON fields with TypeScript types:

```typescript
// Define the shape of JSON data
type ActiveCompound = {
  name: string;
  polishName?: string;
  concentration?: string;
  bioavailability?: number;
};

// Use in Prisma model
model Supplement {
  activeCompounds Json // ActiveCompound[]
}

// Type-safe access
const supplement = await prisma.supplement.findUnique({
  where: { id }
});
const compounds = supplement.activeCompounds as ActiveCompound[];
```

## 5. Component Architecture Standards

### 5.1 Component Structure
```
src/components/
├── ui/                    # shadcn/ui base components
├── supplements/           # Supplement-specific components
│   ├── SupplementCard.tsx
│   ├── SupplementDetails.tsx
│   ├── SupplementSearch.tsx
│   └── SupplementStack.tsx
├── knowledge/             # Knowledge graph components
│   ├── KnowledgeGraph3D.tsx
│   ├── NodeDetails.tsx
│   └── RelationshipView.tsx
├── educational/           # Educational components
│   ├── Brain3D.tsx
│   ├── LearningModule.tsx
│   └── QuizEngine.tsx
└── layout/               # Layout components
    ├── Navigation.tsx
    ├── Header.tsx
    └── Footer.tsx
```

### 5.2 Component Naming Standards
- Components: PascalCase (e.g., `SupplementCard`)
- Props interfaces: ComponentName + "Props" (e.g., `SupplementCardProps`)
- Hooks: camelCase starting with "use" (e.g., `useSupplementData`)

### 5.3 Props Interface Standards
```typescript
interface SupplementCardProps {
  supplement: Supplement;
  showPolishNames?: boolean;
  onSelect?: (supplement: Supplement) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}
```

## 6. Testing Standards

### 6.1 Test Coverage Requirements
- Minimum 80% code coverage
- 100% coverage for critical paths (data validation, API endpoints)
- All Zod schemas must have validation tests

### 6.2 Test Structure
```typescript
// Example test structure
describe('SupplementService', () => {
  describe('getSupplementById', () => {
    it('should return supplement with Polish translations', async () => {
      // Arrange
      const supplementId = 'test-id';
      
      // Act
      const result = await supplementService.getById(supplementId);
      
      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.polishName).toBeDefined();
        expect(result.data.polishDescription).toBeDefined();
      }
    });
    
    it('should handle invalid ID gracefully', async () => {
      // Arrange
      const invalidId = 'invalid';
      
      // Act
      const result = await supplementService.getById(invalidId);
      
      // Assert
      expect(result.success).toBe(false);
      expect(result.error.polishMessage).toBeDefined();
    });
  });
});
```

### 6.3 Mock Strategies
- Use MSW for API mocking
- Mock 3D components for unit tests
- Use test databases for integration tests

## 7. Performance Standards

### 7.1 Bundle Size Limits
- Initial bundle: < 500KB gzipped
- Route chunks: < 200KB gzipped
- Component chunks: < 100KB gzipped

### 7.2 Loading Performance
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s

### 7.3 3D Rendering Optimization
- Use React.memo for expensive 3D components
- Implement LOD (Level of Detail) for complex models
- Lazy load 3D assets

## 8. Security Standards

### 8.1 Input Validation
- All user inputs validated with Zod
- SQL injection prevention through Prisma
- XSS prevention through proper escaping

### 8.2 Authentication & Authorization
- NextAuth.js for authentication
- Role-based access control for admin features
- Secure session management

### 8.3 Data Protection
- No sensitive data in client-side code
- Environment variables for all secrets
- HTTPS enforcement in production

## 9. Code Quality Standards

### 9.1 Linting Configuration
- ESLint with strict rules
- Prettier for code formatting
- Biome for additional checks

### 9.2 Git Workflow
- Conventional Commits format
- Feature branch workflow
- Required PR reviews
- Automated testing on PRs

### 9.3 Documentation Requirements
- JSDoc comments for all public APIs
- README files for each major module
- Type definitions with descriptions

## 10. Deployment Standards

### 10.1 Environment Configuration
- Development, staging, and production environments
- Environment-specific database configurations
- Feature flags for gradual rollouts

### 10.2 Monitoring and Logging
- Error tracking with structured logging
- Performance monitoring
- User analytics (privacy-compliant)

### 10.3 Backup and Recovery
- Automated database backups
- Disaster recovery procedures
- Data migration scripts

## Compliance Checklist

Before any code merge, ensure:
- [ ] All Polish translations are present and accurate
- [ ] Zod schemas validate all data structures
- [ ] TypeScript strict mode passes
- [ ] Test coverage meets requirements
- [ ] Performance benchmarks are met
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility tested
