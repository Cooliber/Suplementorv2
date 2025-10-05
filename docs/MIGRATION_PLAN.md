# Suplementor Migration Plan
## From nextjs-roocode-template to T3 Stack

### Overview
This document outlines the comprehensive migration plan for transferring all knowledge, data structures, and components from the nextjs-roocode-template prototype to the new Suplementor T3 Stack project.

## Migration Scope

### 1. Supplement Data Migration
**Source**: `nextjs-roocode-template/src/data/supplements/`
**Target**: `suplementor/src/data/supplements/`

#### Identified Supplement Profiles (21 total):
- acetyl-l-carnitine.ts
- alpha-gpc.ts
- aniracetam.ts
- ashwagandha.ts
- b-complex.ts
- b-vitamins-complex.ts
- bacopa-monnieri.ts
- bacopa.ts
- caffeine.ts
- creatine.ts
- ginkgo-biloba.ts
- l-theanine.ts
- lions-mane.ts
- magnesium.ts
- n-acetyl-cysteine.ts
- omega-3.ts
- phosphatidylserine.ts
- pycnogenol.ts
- rhodiola-rosea.ts
- rhodiola.ts
- sam-e.ts
- st-johns-wort.ts
- vitamin-d3.ts
- zinc.ts

#### Migration Strategy:
1. **Data Structure Conversion**: Convert from `SupplementProfile` interface to Prisma schema
2. **Polish Localization**: Ensure all `polishName` fields are properly migrated
3. **Evidence Integration**: Preserve research studies and evidence levels
4. **Validation**: Implement Zod schemas for all supplement data

### 2. Knowledge System Migration
**Source Files**:
- `src/lib/body-knowledge-system.ts`
- `src/lib/unified-knowledge-system.ts`
- `src/lib/scientific-data-integration.ts`
- `src/lib/enhanced-knowledge-system.ts`

**Target**: `suplementor/src/lib/knowledge/`

#### Components to Migrate:
- Knowledge graph data structures
- Scientific data integration systems
- Evidence-based recommendation engines
- Polish medical compliance systems

### 3. Type System Migration
**Source**: `nextjs-roocode-template/src/types/`
**Target**: `suplementor/src/types/`

#### Key Type Files:
- `supplement.ts` - Core supplement schemas
- `enhanced-supplement.ts` - Extended supplement interfaces
- `knowledge-graph.ts` - Knowledge graph structures
- `unified-knowledge.ts` - Unified knowledge system types

### 4. Knowledge Graph Data
**Source Files**:
- `src/data/knowledge-graph.ts`
- `src/data/authentic-knowledge-graph.ts`
- `src/data/unified-knowledge-graph.ts`

**Migration Requirements**:
- Preserve node relationships and evidence levels
- Maintain Polish translations
- Convert to database-compatible format

## Database Schema Design

### Core Tables

#### Supplements Table
```prisma
model Supplement {
  id                String   @id @default(cuid())
  name              String
  polishName        String
  scientificName    String?
  commonNames       String[]
  polishCommonNames String[]
  category          SupplementCategory
  description       String?
  polishDescription String?
  
  // Active compounds (JSON field)
  activeCompounds   Json
  
  // Clinical data
  clinicalApplications Json
  mechanisms           Json
  dosageGuidelines     Json
  
  // Safety data
  sideEffects       Json
  contraindications Json
  interactions      Json
  
  // Evidence and research
  evidenceLevel     EvidenceLevel
  researchStudies   Json
  
  // Metadata
  tags         String[]
  lastUpdated  DateTime @updatedAt
  createdAt    DateTime @default(now())
  
  // Relations
  userSupplements UserSupplement[]
  stackItems      StackSupplement[]
  
  @@index([category])
  @@index([evidenceLevel])
}
```

#### Knowledge Nodes Table
```prisma
model KnowledgeNode {
  id              String      @id @default(cuid())
  type            NodeType
  name            String
  polishName      String
  description     String
  polishDescription String?
  
  // Visual properties
  color           String
  size            Int
  position        Json?
  
  // Content properties
  properties      Json
  tags            String[]
  category        String
  
  // Evidence and reliability
  evidenceLevel   EvidenceLevel
  lastUpdated     DateTime @updatedAt
  sources         String[]
  
  // Graph properties
  centrality      Float?
  clustering      Float?
  importance      Float?
  
  // Relations
  sourceRelationships KnowledgeRelationship[] @relation("SourceNode")
  targetRelationships KnowledgeRelationship[] @relation("TargetNode")
  
  @@index([type])
  @@index([category])
  @@index([evidenceLevel])
}
```

#### Knowledge Relationships Table
```prisma
model KnowledgeRelationship {
  id              String    @id @default(cuid())
  sourceId        String
  targetId        String
  type            RelationshipType
  
  // Relationship properties
  strength        Float     // 0-1 scale
  confidence      Float     // 0-1 scale
  bidirectional   Boolean   @default(false)
  
  // Evidence and context
  evidenceLevel   EvidenceLevel
  mechanism       String
  polishDescription String?
  
  // Temporal properties
  onset           String?
  duration        String?
  reversibility   String?
  
  // Dosage dependency
  dosageDependency Json?
  
  // Relations
  sourceNode      KnowledgeNode @relation("SourceNode", fields: [sourceId], references: [id])
  targetNode      KnowledgeNode @relation("TargetNode", fields: [targetId], references: [id])
  
  @@index([sourceId])
  @@index([targetId])
  @@index([type])
}
```

### Enums
```prisma
enum SupplementCategory {
  VITAMIN
  MINERAL
  AMINO_ACID
  FATTY_ACID
  HERB
  NOOTROPIC
  ADAPTOGEN
  PROBIOTIC
  ENZYME
  OTHER
}

enum EvidenceLevel {
  STRONG
  MODERATE
  WEAK
  INSUFFICIENT
  CONFLICTING
}

enum NodeType {
  SUPPLEMENT
  NEUROTRANSMITTER
  BRAIN_REGION
  COGNITIVE_FUNCTION
  PATHWAY
  MECHANISM
}

enum RelationshipType {
  ENHANCES
  INHIBITS
  MODULATES
  SYNERGIZES
  ANTAGONIZES
  REQUIRES
  PRODUCES
  METABOLIZES
}
```

## tRPC API Design

### Supplement Procedures
```typescript
export const supplementRouter = createTRPCRouter({
  // Get all supplements with filtering
  getAll: publicProcedure
    .input(z.object({
      category: z.nativeEnum(SupplementCategory).optional(),
      evidenceLevel: z.nativeEnum(EvidenceLevel).optional(),
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Implementation
    }),

  // Get supplement by ID with full details
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Implementation
    }),

  // Get supplement interactions
  getInteractions: publicProcedure
    .input(z.object({ supplementIds: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      // Implementation
    }),

  // Search supplements
  search: publicProcedure
    .input(z.object({
      query: z.string(),
      limit: z.number().default(10),
    }))
    .query(async ({ ctx, input }) => {
      // Implementation
    }),
});
```

### Knowledge Graph Procedures
```typescript
export const knowledgeRouter = createTRPCRouter({
  // Get knowledge graph data
  getGraph: publicProcedure
    .input(z.object({
      nodeTypes: z.array(z.nativeEnum(NodeType)).optional(),
      maxNodes: z.number().default(100),
    }))
    .query(async ({ ctx, input }) => {
      // Implementation
    }),

  // Get node details
  getNode: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Implementation
    }),

  // Get related nodes
  getRelatedNodes: publicProcedure
    .input(z.object({
      nodeId: z.string(),
      depth: z.number().default(1),
    }))
    .query(async ({ ctx, input }) => {
      // Implementation
    }),

  // Search knowledge base
  searchKnowledge: publicProcedure
    .input(z.object({
      query: z.string(),
      nodeTypes: z.array(z.nativeEnum(NodeType)).optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Implementation
    }),
});
```

## File Structure Mapping

### Source → Target Mapping
```
nextjs-roocode-template/src/data/supplements/
→ suplementor/src/data/supplements/

nextjs-roocode-template/src/types/
→ suplementor/src/types/

nextjs-roocode-template/src/lib/
→ suplementor/src/lib/

nextjs-roocode-template/src/data/knowledge-graph.ts
→ suplementor/src/data/knowledge/

nextjs-roocode-template/src/components/
→ suplementor/src/components/
```

### New T3 Stack Structure
```
suplementor/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── supplements/       # Supplement-related components
│   │   ├── knowledge/         # Knowledge graph components
│   │   └── educational/       # Educational components
│   ├── data/                  # Static data files
│   │   ├── supplements/       # Migrated supplement profiles
│   │   └── knowledge/         # Knowledge graph data
│   ├── lib/                   # Utility libraries
│   │   ├── knowledge/         # Knowledge system
│   │   ├── supplements/       # Supplement utilities
│   │   └── validation/        # Zod schemas
│   ├── server/                # tRPC server
│   │   └── api/              # API routers
│   ├── types/                 # TypeScript type definitions
│   └── styles/               # CSS styles
├── prisma/                    # Database schema
└── docs/                     # Documentation
```

## Next Steps

1. **Database Schema Implementation** - Create Prisma schema with all required models
2. **Type System Migration** - Migrate and enhance TypeScript interfaces
3. **Data Migration Scripts** - Create scripts to transfer supplement data
4. **tRPC API Implementation** - Build API procedures for data access
5. **Component Migration** - Transfer and adapt React components
6. **Testing Setup** - Configure Vitest with comprehensive test coverage
7. **Polish Localization** - Implement comprehensive Polish language support

## Success Criteria

- [ ] All 21+ supplement profiles successfully migrated
- [ ] Knowledge graph data preserved with relationships
- [ ] Polish translations maintained throughout
- [ ] Type safety with Zod validation
- [ ] tRPC API fully functional
- [ ] Database schema optimized for performance
- [ ] Comprehensive test coverage (>80%)
- [ ] Polish localization framework established
