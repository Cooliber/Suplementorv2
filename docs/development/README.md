# Development Guide

## Overview

This guide provides comprehensive information for developers working on the Suplementor project. It covers development setup, coding standards, testing practices, and contribution guidelines.

## Development Environment Setup

### Prerequisites

- **Node.js 20+** (LTS recommended)
- **Bun 1.1.38+** (recommended for better performance)
- **Git** for version control
- **VS Code** or your preferred IDE
- **MongoDB 7.0+** (local or Atlas)

### Initial Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/suplementor.git
cd suplementor
```

#### 2. Install Dependencies
```bash
# Using Bun (recommended)
bun install

# Alternative using npm
npm install
```

#### 3. Environment Configuration
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Database
MONGODB_URI="mongodb://localhost:27017/suplementor"

# NextAuth.js
NEXTAUTH_SECRET="your-development-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Development services
EMBEDDING_SERVICE_URL="http://localhost:8000"
ANALYTICS_ID="dev-analytics-id"
```

#### 4. Database Setup
```bash
# Start MongoDB (if local)
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux

# Seed development database
bun run db:seed
```

#### 5. Start Development Server
```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Development Workflow

### Code Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes
│   ├── (protected)/       # Protected routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── features/         # Feature-specific components
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
│   ├── hooks/           # Custom React hooks
│   ├── stores/          # State management
│   ├── services/        # Business logic services
│   └── types/           # TypeScript type definitions
├── data/                # Static data and configurations
└── styles/              # Global styles and Tailwind config
```

### Development Standards

#### TypeScript Guidelines

- **Strict Mode**: Always enabled in `tsconfig.json`
- **Interface Naming**: Use PascalCase for interfaces
- **Type Imports**: Use `import type` for type-only imports
- **Discriminated Unions**: Use for better type safety

```typescript
// ✅ Good
interface Supplement {
  id: string;
  name: string;
  polishName: string;
}

type SupplementCategory = 'nootropics' | 'vitamins' | 'minerals';

interface SupplementResponse {
  success: true;
  data: Supplement;
}

// ❌ Avoid
interface supplement {  // lowercase
  id: String;           // not string
}
```

#### Component Guidelines

- **File Naming**: PascalCase for components, camelCase for utilities
- **Props Interface**: Define props interface for all components
- **Polish Translation**: Include Polish translations for all user-facing text
- **Responsive Design**: Mobile-first approach

```typescript
// ✅ Good Component
interface SupplementCardProps {
  supplement: Supplement;
  onSelect?: (supplement: Supplement) => void;
  className?: string;
}

export const SupplementCard = ({
  supplement,
  onSelect,
  className
}: SupplementCardProps) => {
  return (
    <Card className={cn("p-4 hover:shadow-lg transition-shadow", className)}>
      <h3 className="text-lg font-semibold">{supplement.polishName}</h3>
      <p className="text-sm text-muted-foreground">{supplement.description}</p>
      {/* Polish content */}
    </Card>
  );
};
```

#### Polish Localization Standards

All user-facing content must include Polish translations:

```typescript
// ✅ Good
const supplementData = {
  name: "L-Theanine",
  polishName: "L-Teanina",
  description: "Amino acid promoting relaxation",
  polishDescription: "Aminokwas wspomagający relaksację",
  benefits: ["Reduces stress", "Improves focus"],
  polishBenefits: ["Zmniejsza stres", "Poprawia koncentrację"]
};

// ❌ Missing Polish translations
const supplementData = {
  name: "L-Theanine",
  description: "Amino acid promoting relaxation"  // Missing Polish
};
```

## Testing

### Testing Stack

- **Unit Testing**: Vitest with React Testing Library
- **Integration Testing**: Vitest with custom test utilities
- **E2E Testing**: Playwright for full user journey testing
- **Accessibility Testing**: axe-core and Pa11y
- **Performance Testing**: Lighthouse CI

### Writing Tests

#### Unit Tests
```typescript
// src/lib/services/__tests__/supplement-service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { supplementService } from '../supplement-service';

describe('SupplementService', () => {
  beforeEach(() => {
    // Setup test data
  });

  it('should return supplements filtered by category', async () => {
    const result = await supplementService.getByCategory('nootropics');

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('category', 'nootropics');
  });

  it('should validate supplement data structure', () => {
    const supplement = createMockSupplement();

    expect(supplement).toHaveProperty('polishName');
    expect(supplement).toHaveProperty('neuroEffects');
  });
});
```

#### Component Tests
```typescript
// src/components/__tests__/SupplementCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SupplementCard } from '../SupplementCard';

describe('SupplementCard', () => {
  const mockSupplement: Supplement = {
    id: '1',
    name: 'L-Theanine',
    polishName: 'L-Teanina',
    category: 'nootropics',
    description: 'Promotes relaxation',
    polishDescription: 'Wspomaga relaksację',
    // ... other properties
  };

  it('should render Polish supplement name', () => {
    render(<SupplementCard supplement={mockSupplement} />);

    expect(screen.getByText('L-Teanina')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleSelect = vi.fn();
    render(<SupplementCard supplement={mockSupplement} onSelect={handleSelect} />);

    // Test interaction
  });
});
```

#### E2E Tests
```typescript
// e2e/supplement-search.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Supplement Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should search supplements in Polish', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'koncentracja');
    await page.click('[data-testid="search-button"]');

    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  });

  test('should display supplement details in Polish', async ({ page }) => {
    await page.click('[data-testid="supplement-card"]');

    await expect(page.locator('[data-testid="supplement-name"]')).toContainText('L-Teanina');
  });
});
```

### Running Tests

```bash
# Run all tests
bun run test

# Run specific test suites
bun run test:unit        # Unit tests only
bun run test:integration # Integration tests only
bun run test:e2e         # End-to-end tests only
bun run test:a11y        # Accessibility tests only

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage

# Run tests for specific file
bun run test SupplementCard.test.tsx
```

## Code Quality

### Linting and Formatting

#### ESLint Configuration
```bash
# Run ESLint
bun run lint

# Fix auto-fixable issues
bun run lint:fix

# Check specific files
bun run lint src/components/SupplementCard.tsx
```

#### Prettier Configuration
```bash
# Format all files
bun run format

# Check formatting
bun run format:check

# Format specific files
bun run format src/components/SupplementCard.tsx
```

#### TypeScript Checking
```bash
# Run TypeScript compiler
bun run typecheck

# Run with strict mode
bun run typecheck:strict
```

### Code Quality Tools

#### Bundle Analysis
```bash
# Analyze bundle size
bun run analyze

# Check for large dependencies
bun run bundle:check
```

#### Performance Monitoring
```bash
# Run Lighthouse audit
bun run lighthouse

# Check Core Web Vitals
bun run vitals
```

## Database Development

### Database Schema Management

#### Using Prisma (Recommended for new features)
```typescript
// prisma/schema.prisma
model Supplement {
  id          String   @id @default(cuid())
  name        String
  polishName  String   // Required for all supplements
  category    String
  description String
  polishDescription String

  // Relations
  interactions Interaction[]
  stacks      SupplementStack[]

  @@map("supplements")
}
```

#### MongoDB with Mongoose
```typescript
// src/lib/models/supplement.ts
import mongoose from 'mongoose';

const supplementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  polishName: { type: String, required: true }, // Always required
  category: { type: String, required: true },
  description: { type: String, required: true },
  polishDescription: { type: String, required: true },
  // ... other fields
}, {
  timestamps: true
});

export const Supplement = mongoose.model('Supplement', supplementSchema);
```

### Database Operations

#### Seeding Development Data
```typescript
// scripts/seed.ts
import { db } from '@/lib/db';
import { supplements } from '@/data/supplements';

async function seed() {
  // Clear existing data
  await db.supplement.deleteMany({});

  // Insert supplement data with Polish translations
  await db.supplement.createMany({
    data: supplements.map(supplement => ({
      ...supplement,
      // Ensure Polish translations exist
      polishName: supplement.polishName || supplement.name,
      polishDescription: supplement.polishDescription || supplement.description,
    }))
  });
}
```

#### Database Migrations
```bash
# Create new migration
bun run db:migrate:create migration-name

# Run migrations
bun run db:migrate

# Rollback migration
bun run db:migrate:rollback
```

## API Development

### tRPC Route Development

#### Creating New Routes
```typescript
// src/app/api/trpc/supplement/routes.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const supplementRouter = t.router({
  getByCategory: t.procedure
    .input(z.object({
      category: z.string(),
      limit: z.number().optional()
    }))
    .query(async ({ input }) => {
      const supplements = await db.supplement.findMany({
        where: { category: input.category },
        take: input.limit,
        // Ensure Polish translations are included
        select: {
          id: true,
          name: true,
          polishName: true,
          description: true,
          polishDescription: true,
          // ... other fields
        }
      });

      return supplements;
    })
});
```

### API Documentation

All API routes must be documented in the OpenAPI specification and include Polish translations for all response fields.

## State Management

### Zustand Store Development

#### Creating Feature Stores
```typescript
// src/lib/stores/supplement-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SupplementState {
  supplements: Supplement[];
  selectedCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSupplements: (supplements: Supplement[]) => void;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Async actions
  fetchSupplements: () => Promise<void>;
  searchSupplements: (query: string) => Promise<void>;
}

export const useSupplementStore = create<SupplementState>()(
  devtools(
    (set, get) => ({
      // Initial state
      supplements: [],
      selectedCategory: null,
      searchQuery: '',
      isLoading: false,
      error: null,

      // Actions
      setSupplements: (supplements) => set({ supplements }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Async actions
      fetchSupplements: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/supplements');
          const supplements = await response.json();

          set({ supplements, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
        }
      },

      searchSupplements: async (query) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/supplements/search?q=${query}`);
          const supplements = await response.json();

          set({ supplements, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Search failed',
            isLoading: false
          });
        }
      }
    }),
    { name: 'supplement-store' }
  )
);
```

## Error Handling

### Error Boundary Implementation

```typescript
// src/components/ErrorBoundary.tsx
'use client';

import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
      <h2 className="text-lg font-semibold text-red-800">
        Wystąpił błąd
      </h2>
      <p className="text-red-600 mt-2">
        {error.message}
      </p>
      <button
        onClick={resetError}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Spróbuj ponownie
      </button>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to monitoring service
        console.error('Application error:', error, errorInfo);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
```

## Performance Optimization

### Bundle Optimization

#### Dynamic Imports
```typescript
// Use dynamic imports for heavy components
const BrainVisualization = lazy(() =>
  import('@/components/BrainVisualization').then(mod => ({
    default: mod.BrainVisualization
  }))
);
```

#### Code Splitting
```typescript
// src/app/suplementy/page.tsx
import dynamic from 'next/dynamic';

const SupplementCatalog = dynamic(() =>
  import('@/components/supplements/SupplementCatalog'), {
  loading: () => <div>Ładowanie...</div>
});
```

### Database Query Optimization

```typescript
// Optimize queries with proper indexing
const getSupplementsByCategory = async (category: string) => {
  return await db.supplement.findMany({
    where: { category },
    select: {
      id: true,
      name: true,
      polishName: true,
      // Only select needed fields
    }
  });
};
```

## Internationalization (i18n)

### Adding New Translations

#### 1. Add to Translation Files
```json
// public/locales/pl/common.json
{
  "search": "Szukaj",
  "loading": "Ładowanie",
  "error": "Błąd",
  "retry": "Spróbuj ponownie"
}
```

#### 2. Use in Components
```typescript
// src/components/SearchInput.tsx
import { useTranslation } from 'next-i18next';

export const SearchInput = () => {
  const { t } = useTranslation('common');

  return (
    <input
      placeholder={t('search')}
      aria-label={t('search')}
    />
  );
};
```

## Contributing Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/amazing-feature
```

### 2. Make Changes
- Follow coding standards
- Add tests for new functionality
- Update documentation
- Ensure Polish translations are complete

### 3. Run Quality Checks
```bash
# Run all checks
bun run check

# Individual checks
bun run lint
bun run typecheck
bun run test
bun run build
```

### 4. Commit Changes
```bash
# Use conventional commits
git add .
git commit -m "feat: add amazing new feature

- Add new supplement category
- Include Polish translations
- Add comprehensive tests
- Update documentation"
```

### 5. Push and Create PR
```bash
git push origin feature/amazing-feature
```

## Debugging

### Development Tools

#### React DevTools
1. Install React DevTools browser extension
2. Use React DevTools to inspect component state
3. Monitor component re-renders

#### Redux DevTools (for Zustand)
```typescript
// Enable Redux DevTools for Zustand
import { devtools } from 'zustand/middleware';

export const useStore = create(
  devtools(store, { name: 'suplementor-store' })
);
```

#### Database Debugging
```bash
# Enable MongoDB query logging
DEBUG=mongodb:* bun run dev

# Check database connection
bun run db:health-check
```

### Common Issues

#### TypeScript Errors
```bash
# Check TypeScript compilation
bun run typecheck

# Common fixes:
# 1. Add missing type annotations
# 2. Import types correctly
# 3. Check for null/undefined values
```

#### Build Errors
```bash
# Debug build issues
NODE_OPTIONS="--max-old-space-size=4096" bun run build

# Check for missing dependencies
bun run deps:check
```

## Deployment from Development

### Staging Deployment
```bash
# Deploy to staging
git push origin develop

# Check staging deployment
open https://suplementor-staging.vercel.app
```

### Production Deployment
```bash
# Deploy to production
git push origin main

# Check production deployment
open https://suplementor.vercel.app
```

## Getting Help

### Resources
- **Project Documentation**: `/docs` directory
- **API Documentation**: `/docs/api/README.md`
- **Component Library**: Storybook (`bun run storybook`)
- **Type Definitions**: TypeScript language server

### Community
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Q&A and community support
- **Code Reviews**: Request reviews from maintainers

### Development Support
- Check existing issues for similar problems
- Review pull requests for examples
- Ask questions in GitHub Discussions
- Create detailed bug reports with reproduction steps

---

Happy coding! 🚀