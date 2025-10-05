---
type: "agent_requested"
description: "Example description"
---

# T3 Stack Integration Rules for Suplementor

## Overview
Comprehensive guidelines for implementing T3 Stack (Next.js 15, TypeScript 5.8+, Prisma, tRPC) in the Suplementor Polish educational platform with focus on performance, type safety, and Polish localization.

## Next.js 15 App Router Standards

### Directory Structure
```
suplementor/
├── app/                          # App Router (Next.js 15)
│   ├── (public)/                # Public routes
│   │   ├── page.tsx             # Homepage
│   │   ├── suplementy/          # Supplements section
│   │   └── wiedza/              # Knowledge/Brain section
│   ├── (protected)/             # Protected routes
│   │   ├── profil/              # User profile
│   │   └── postepy/             # Progress tracking
│   ├── api/                     # API routes
│   │   └── trpc/                # tRPC endpoints
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── loading.tsx              # Loading UI
├── src/
│   ├── components/              # Reusable components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── features/            # Feature-specific components
│   │   └── layout/              # Layout components
│   ├── lib/                     # Utilities and configurations
│   ├── types/                   # TypeScript type definitions
│   ├── data/                    # Static data (supplements, brain regions)
│   └── server/                  # Server-side code
│       ├── api/                 # tRPC routers
│       ├── auth.ts              # NextAuth configuration
│       └── db.ts                # Database connection
```

### TypeScript 5.8+ Configuration
```typescript
// tsconfig.json requirements
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "~/*": ["./src/*"],
      "@/*": ["./src/*"]
    }
  }
}
```

### Polish Localization Types
```typescript
// Required type definitions for Polish content
interface PolishLocalizedContent {
  name: string;
  polishName: string;
  description?: string;
  polishDescription: string;
  commonNames: string[];
  polishCommonNames: string[];
}

interface SupplementWithRelations extends PolishLocalizedContent {
  id: string;
  category: SupplementCategory;
  activeCompounds: ActiveCompound[];
  clinicalApplications: ClinicalApplication[];
  mechanisms: MechanismOfAction[];
  dosageGuidelines: DosageGuidelines;
  sideEffects: SideEffect[];
  interactions: SupplementInteraction[];
  evidenceLevel: EvidenceLevel;
  researchStudies: ResearchStudy[];
  tags: string[];
  lastUpdated: string;
  createdAt: string;
}
```

## tRPC Implementation Standards

### Router Structure
```typescript
// src/server/api/root.ts
export const appRouter = createTRPCRouter({
  supplement: supplementRouter,
  brainRegion: brainRegionRouter,
  user: userRouter,
  education: educationRouter,
  analytics: analyticsRouter,
});

// Polish localization support in procedures
export const supplementRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ 
      id: z.string(),
      language: z.enum(['pl', 'en']).default('pl')
    }))
    .query(({ input }) => {
      // Return localized content based on language
    }),
    
  search: publicProcedure
    .input(z.object({
      query: z.string(),
      category: z.string().optional(),
      language: z.enum(['pl', 'en']).default('pl')
    }))
    .query(({ input }) => {
      // Implement Polish text search
    }),
});
```

### Input Validation with Zod
```typescript
// Polish-aware validation schemas
export const SupplementSearchSchema = z.object({
  query: z.string().min(1).max(100),
  category: SupplementCategorySchema.optional(),
  evidenceLevel: EvidenceLevelSchema.optional(),
  language: z.enum(['pl', 'en']).default('pl'),
  filters: z.object({
    hasPolishTranslation: z.boolean().default(true),
    priceRange: z.object({
      min: z.number().min(0),
      max: z.number().max(1000),
      currency: z.literal('EUR')
    }).optional()
  }).optional()
});
```

## Prisma Database Schema

### Polish Localization Schema
```prisma
model Supplement {
  id                    String   @id @default(cuid())
  name                  String
  polishName            String
  scientificName        String?
  commonNames           String[]
  polishCommonNames     String[]
  category              SupplementCategory
  description           String?
  polishDescription     String?
  
  // Relations
  activeCompounds       ActiveCompound[]
  clinicalApplications  ClinicalApplication[]
  mechanisms            MechanismOfAction[]
  sideEffects           SideEffect[]
  interactions          SupplementInteraction[]
  researchStudies       ResearchStudy[]
  
  // Metadata
  tags                  String[]
  evidenceLevel         EvidenceLevel
  lastUpdated           DateTime @updatedAt
  createdAt             DateTime @default(now())
  
  @@map("supplements")
}

model ClinicalApplication {
  id                    String   @id @default(cuid())
  condition             String
  polishCondition       String
  indication            String
  polishIndication      String
  efficacy              String
  evidenceLevel         EvidenceLevel
  recommendedDose       String
  duration              String?
  effectSize            Float?
  studyCount            Int?
  participantCount      Int?
  recommendationGrade   String
  
  supplementId          String
  supplement            Supplement @relation(fields: [supplementId], references: [id])
  
  @@map("clinical_applications")
}
```

## State Management with Zustand

### Polish-Aware Store Slices
```typescript
// src/lib/stores/supplement-store.ts
interface SupplementState {
  selectedSupplements: SupplementWithRelations[];
  searchQuery: string;
  language: 'pl' | 'en';
  filters: SupplementFilters;
  
  // Actions
  addSupplement: (supplement: SupplementWithRelations) => void;
  removeSupplement: (id: string) => void;
  setLanguage: (language: 'pl' | 'en') => void;
  setSearchQuery: (query: string) => void;
  updateFilters: (filters: Partial<SupplementFilters>) => void;
}

export const useSupplementStore = create<SupplementState>((set, get) => ({
  selectedSupplements: [],
  searchQuery: '',
  language: 'pl', // Default to Polish
  filters: {
    categories: [],
    evidenceLevels: [],
    hasPolishTranslation: true,
  },
  
  addSupplement: (supplement) => set((state) => ({
    selectedSupplements: [...state.selectedSupplements, supplement]
  })),
  
  setLanguage: (language) => set({ language }),
  // ... other actions
}));
```

## Component Development Standards

### Polish Localization Hooks
```typescript
// src/lib/hooks/use-polish-localization.ts
export function usePolishLocalization() {
  const { language } = useSupplementStore();
  
  const getLocalizedText = useCallback((
    englishText: string,
    polishText: string
  ) => {
    return language === 'pl' ? polishText : englishText;
  }, [language]);
  
  const formatPolishCurrency = useCallback((amount: number) => {
    return `od ${amount.toFixed(2)} €`;
  }, []);
  
  const formatPolishDosage = useCallback((
    amount: number,
    unit: string,
    frequency: string
  ) => {
    return `${amount}${unit} ${frequency}`;
  }, []);
  
  return {
    getLocalizedText,
    formatPolishCurrency,
    formatPolishDosage,
    isPolish: language === 'pl'
  };
}
```

### Component Patterns
```typescript
// Polish-aware component example
interface SupplementCardProps {
  supplement: SupplementWithRelations;
  showPolishOnly?: boolean;
}

export function SupplementCard({ 
  supplement, 
  showPolishOnly = true 
}: SupplementCardProps) {
  const { getLocalizedText, formatPolishCurrency } = usePolishLocalization();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {getLocalizedText(supplement.name, supplement.polishName)}
        </CardTitle>
        <CardDescription>
          {getLocalizedText(
            supplement.description || '', 
            supplement.polishDescription
          )}
        </CardDescription>
      </CardHeader>
      {/* ... rest of component */}
    </Card>
  );
}
```

## Performance Optimization

### Next.js 15 Optimizations
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@react-three/fiber',
      '@react-three/drei',
      'three',
      'lucide-react',
      '@radix-ui/react-icons'
    ],
    serverComponentsExternalPackages: ['three', 'canvas']
  },
  
  // Polish character support
  i18n: {
    locales: ['pl', 'en'],
    defaultLocale: 'pl',
  },
  
  // Performance optimizations
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // Bundle optimization
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  },
};
```

## Testing Standards

### Polish Localization Testing
```typescript
// src/__tests__/polish-localization.test.ts
describe('Polish Localization', () => {
  test('renders Polish characters correctly', () => {
    const polishText = 'Płat czołowy, móżdżek, neuroprzekaźniki';
    render(<SupplementCard supplement={mockSupplement} />);
    expect(screen.getByText(polishText)).toBeInTheDocument();
  });
  
  test('formats Polish currency correctly', () => {
    const { formatPolishCurrency } = renderHook(() => 
      usePolishLocalization()
    ).result.current;
    
    expect(formatPolishCurrency(3.99)).toBe('od 3.99 €');
  });
});
```

## Quality Assurance

### Build Requirements
- Zero TypeScript errors with strict mode
- Zero ESLint warnings
- 100% Polish character rendering support
- All tRPC procedures type-safe
- Prisma schema validates successfully

### Performance Targets
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- 3D brain visualization loads < 3s
