# Suplementor Testing Framework Setup
## Comprehensive Testing Strategy for T3 Stack Implementation

### Overview
This document outlines the testing framework setup for the Suplementor application, ensuring comprehensive coverage of supplement data validation, knowledge systems, and Polish localization.

## Testing Stack

### Core Testing Tools
- **Vitest**: Primary testing framework for unit and integration tests
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing
- **MSW (Mock Service Worker)**: API mocking for integration tests
- **Prisma Test Environment**: Database testing with isolated test databases

### Configuration Files

#### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      'src/**/*.stories.{ts,tsx}',
      'src/**/*.spec.{ts,tsx}',
      'src/__mocks__/**/*',
      'src/**/*.d.ts',
      'src/__tests__/**/*',
      'src/env/*'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov', 'junit', 'cobertura', 'json', 'text'],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      exclude: [
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/__mocks__/**/*',
        'src/**/*.d.ts',
        'src/__tests__/**/*',
        'src/env/*',
        'src/types/**/*',
        '**/*.config.{js,ts}',
      ],
    },
    testTimeout: 20000,
    reporters: ['html', 'junit', 'default'],
    outputFile: {
      html: './test-results/html/index.html',
      junit: './test-results/junit.xml',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### src/test/setup.ts
```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Three.js for 3D components
vi.mock('three', () => ({
  Scene: vi.fn(() => ({})),
  PerspectiveCamera: vi.fn(() => ({})),
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    render: vi.fn(),
    domElement: document.createElement('canvas'),
  })),
  Mesh: vi.fn(() => ({})),
  BoxGeometry: vi.fn(() => ({})),
  MeshBasicMaterial: vi.fn(() => ({})),
}));

// Mock React Three Fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="three-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: () => ({
    camera: {},
    scene: {},
    gl: {},
  }),
}));

// Mock React Three Drei
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drei-html">{children}</div>
  ),
  Environment: () => <div data-testid="environment" />,
  Float: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="float">{children}</div>
  ),
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Global test setup
beforeAll(() => {
  // Setup global test environment
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterAll(() => {
  // Cleanup global test environment
});
```

## Test Categories

### 1. Unit Tests

#### Supplement Data Validation Tests
```typescript
// src/types/__tests__/supplement.test.ts
import { describe, it, expect } from 'vitest';
import { 
  validateSupplement, 
  validateActiveCompound,
  SupplementSchema 
} from '@/types/supplement';

describe('Supplement Validation', () => {
  describe('validateSupplement', () => {
    it('should validate a complete supplement profile', () => {
      const validSupplement = {
        id: 'cuid123',
        name: 'Alpha-GPC',
        polishName: 'Alfa-GPC',
        scientificName: 'L-Alpha glycerylphosphorylcholine',
        commonNames: ['GPC', 'Choline alfoscerate'],
        polishCommonNames: ['GPC', 'Alfoscerat choliny'],
        category: 'NOOTROPIC',
        description: 'A choline compound',
        polishDescription: 'Związek choliny',
        activeCompounds: [{
          name: 'Alpha-GPC',
          polishName: 'Alfa-GPC',
          concentration: '300mg',
          bioavailability: 95,
        }],
        clinicalApplications: [{
          condition: 'Cognitive enhancement',
          polishCondition: 'Wzmocnienie funkcji poznawczych',
          efficacy: 'moderate',
          evidenceLevel: 'MODERATE',
          recommendedDose: '300-600mg daily',
        }],
        mechanisms: [{
          pathway: 'Cholinergic pathway',
          description: 'Enhances acetylcholine synthesis',
          polishDescription: 'Wzmacnia syntezę acetylocholiny',
          evidenceLevel: 'STRONG',
        }],
        dosageGuidelines: {
          therapeuticRange: { min: 300, max: 1200, unit: 'mg' },
          timing: ['morning'],
          withFood: true,
          contraindications: [],
          polishContraindications: [],
          interactions: [],
        },
        sideEffects: [],
        interactions: [],
        evidenceLevel: 'MODERATE',
        researchStudies: [],
        tags: ['nootropic', 'choline'],
        lastUpdated: '2024-01-15T00:00:00Z',
        createdAt: '2024-01-15T00:00:00Z',
      };

      const result = validateSupplement(validSupplement);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.polishName).toBe('Alfa-GPC');
        expect(result.data.category).toBe('NOOTROPIC');
      }
    });

    it('should reject supplement without required Polish translations', () => {
      const invalidSupplement = {
        id: 'cuid123',
        name: 'Alpha-GPC',
        // Missing polishName
        category: 'NOOTROPIC',
        // ... other required fields
      };

      const result = validateSupplement(invalidSupplement);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContainEqual(
          expect.objectContaining({
            message: expect.stringContaining('polishName')
          })
        );
      }
    });

    it('should validate Polish characters in text fields', () => {
      const supplementWithPolishChars = {
        // ... base supplement data
        polishName: 'Kwasy tłuszczowe Omega-3',
        polishDescription: 'Wspomaga funkcje mózgu i serca. Zawiera EPA i DHA.',
      };

      const result = validateSupplement(supplementWithPolishChars);
      expect(result.success).toBe(true);
    });
  });

  describe('validateActiveCompound', () => {
    it('should validate active compound with bioavailability', () => {
      const compound = {
        name: 'EPA',
        polishName: 'Kwas eikozapentaenowy',
        concentration: '500mg',
        bioavailability: 85,
        halfLife: '2-3 hours',
      };

      const result = validateActiveCompound(compound);
      expect(result.success).toBe(true);
    });

    it('should reject bioavailability outside 0-100 range', () => {
      const compound = {
        name: 'EPA',
        bioavailability: 150, // Invalid
      };

      const result = validateActiveCompound(compound);
      expect(result.success).toBe(false);
    });
  });
});
```

#### Knowledge Graph Tests
```typescript
// src/types/__tests__/knowledge-graph.test.ts
import { describe, it, expect } from 'vitest';
import { 
  validateKnowledgeNode, 
  validateKnowledgeRelationship 
} from '@/types/knowledge-graph';

describe('Knowledge Graph Validation', () => {
  describe('validateKnowledgeNode', () => {
    it('should validate a complete knowledge node', () => {
      const validNode = {
        id: 'cuid123',
        type: 'SUPPLEMENT',
        name: 'Alpha-GPC',
        polishName: 'Alfa-GPC',
        description: 'A choline compound for cognitive enhancement',
        polishDescription: 'Związek choliny dla wzmocnienia funkcji poznawczych',
        color: '#FF5733',
        size: 15,
        position: { x: 0, y: 0, z: 0 },
        properties: {
          category: 'nootropic',
          evidenceLevel: 'MODERATE',
        },
        tags: ['nootropic', 'choline'],
        category: 'supplement',
        evidenceLevel: 'MODERATE',
        sources: ['pubmed:12345'],
        lastUpdated: '2024-01-15T00:00:00Z',
        createdAt: '2024-01-15T00:00:00Z',
      };

      const result = validateKnowledgeNode(validNode);
      expect(result.success).toBe(true);
    });

    it('should reject invalid color format', () => {
      const nodeWithInvalidColor = {
        // ... other valid fields
        color: 'red', // Should be hex format
      };

      const result = validateKnowledgeNode(nodeWithInvalidColor);
      expect(result.success).toBe(false);
    });
  });

  describe('validateKnowledgeRelationship', () => {
    it('should validate relationship with dosage dependency', () => {
      const validRelationship = {
        id: 'cuid123',
        sourceId: 'cuid456',
        targetId: 'cuid789',
        type: 'ENHANCES',
        strength: 0.8,
        confidence: 0.9,
        bidirectional: false,
        evidenceLevel: 'STRONG',
        mechanism: 'Increases acetylcholine synthesis',
        polishMechanism: 'Zwiększa syntezę acetylocholiny',
        dosageDependency: {
          threshold: 300,
          unit: 'mg',
          effectCurve: 'sigmoid',
        },
        lastUpdated: '2024-01-15T00:00:00Z',
        createdAt: '2024-01-15T00:00:00Z',
      };

      const result = validateKnowledgeRelationship(validRelationship);
      expect(result.success).toBe(true);
    });
  });
});
```

### 2. Integration Tests

#### tRPC API Tests
```typescript
// src/server/api/__tests__/supplement.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTRPCMsw } from 'msw-trpc';
import { setupServer } from 'msw/node';
import { appRouter } from '@/server/api/root';
import { createTRPCClient } from '@trpc/client';

const server = setupServer();

describe('Supplement API', () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
  });

  describe('getAll', () => {
    it('should return supplements with Polish translations', async () => {
      // Mock implementation would go here
      const supplements = await trpc.supplement.getAll.query({
        limit: 10,
      });

      expect(supplements.supplements).toBeDefined();
      expect(supplements.supplements.length).toBeGreaterThan(0);
      
      supplements.supplements.forEach(supplement => {
        expect(supplement.polishName).toBeDefined();
        expect(supplement.polishName.length).toBeGreaterThan(0);
      });
    });

    it('should filter by category', async () => {
      const supplements = await trpc.supplement.getAll.query({
        category: 'NOOTROPIC',
      });

      supplements.supplements.forEach(supplement => {
        expect(supplement.category).toBe('NOOTROPIC');
      });
    });
  });

  describe('getInteractions', () => {
    it('should analyze supplement interactions', async () => {
      const result = await trpc.supplement.getInteractions.query({
        supplementIds: ['alpha-gpc', 'caffeine'],
      });

      expect(result.overallRisk).toMatch(/^(low|medium|high)$/);
      expect(result.interactions).toBeDefined();
      expect(result.polishWarnings).toBeDefined();
    });
  });
});
```

### 3. Component Tests

#### Supplement Component Tests
```typescript
// src/components/__tests__/SupplementCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SupplementCard } from '@/components/supplements/SupplementCard';
import { mockSupplement } from '@/test/mocks/supplement';

describe('SupplementCard', () => {
  it('should render supplement name and Polish name', () => {
    render(
      <SupplementCard 
        supplement={mockSupplement} 
        showPolishNames={true} 
      />
    );

    expect(screen.getByText(mockSupplement.name)).toBeInTheDocument();
    expect(screen.getByText(mockSupplement.polishName)).toBeInTheDocument();
  });

  it('should display evidence level badge', () => {
    render(<SupplementCard supplement={mockSupplement} />);
    
    expect(screen.getByText(mockSupplement.evidenceLevel)).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const onSelect = vi.fn();
    render(
      <SupplementCard 
        supplement={mockSupplement} 
        onSelect={onSelect} 
      />
    );

    await userEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(mockSupplement);
  });
});
```

## Mock Data and Utilities

### Test Mocks
```typescript
// src/test/mocks/supplement.ts
import type { SupplementWithRelations } from '@/types/supplement';

export const mockSupplement: SupplementWithRelations = {
  id: 'test-alpha-gpc',
  name: 'Alpha-GPC',
  polishName: 'Alfa-GPC',
  scientificName: 'L-Alpha glycerylphosphorylcholine',
  commonNames: ['GPC', 'Choline alfoscerate'],
  polishCommonNames: ['GPC', 'Alfoscerat choliny'],
  category: 'NOOTROPIC',
  description: 'A highly bioavailable form of choline',
  polishDescription: 'Wysoce biodostępna forma choliny',
  activeCompounds: [{
    name: 'Alpha-GPC',
    polishName: 'Alfa-GPC',
    concentration: '300mg',
    bioavailability: 95,
  }],
  clinicalApplications: [{
    condition: 'Cognitive enhancement',
    polishCondition: 'Wzmocnienie funkcji poznawczych',
    efficacy: 'moderate',
    evidenceLevel: 'MODERATE',
    recommendedDose: '300-600mg daily',
  }],
  mechanisms: [{
    pathway: 'Cholinergic pathway',
    description: 'Enhances acetylcholine synthesis',
    polishDescription: 'Wzmacnia syntezę acetylocholiny',
    evidenceLevel: 'STRONG',
  }],
  dosageGuidelines: {
    therapeuticRange: { min: 300, max: 1200, unit: 'mg' },
    timing: ['morning'],
    withFood: true,
    contraindications: [],
    polishContraindications: [],
    interactions: [],
  },
  sideEffects: [],
  interactions: [],
  evidenceLevel: 'MODERATE',
  researchStudies: [],
  tags: ['nootropic', 'choline'],
  lastUpdated: '2024-01-15T00:00:00Z',
  createdAt: '2024-01-15T00:00:00Z',
  knowledgeNodeId: null,
};
```

## Test Scripts

### package.json Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:supplements": "vitest run src/types/__tests__/supplement.test.ts",
    "test:knowledge": "vitest run src/types/__tests__/knowledge-graph.test.ts",
    "test:api": "vitest run src/server/api/__tests__/",
    "test:components": "vitest run src/components/__tests__/"
  }
}
```

## Coverage Requirements

### Minimum Coverage Thresholds
- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

### Critical Path Coverage (100% Required)
- Supplement data validation (Zod schemas)
- Knowledge graph validation
- Polish localization functions
- API endpoint security
- Database operations

### Testing Checklist

Before any code merge, ensure:
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Component tests pass
- [ ] Coverage thresholds met
- [ ] Polish localization tested
- [ ] 3D component mocks working
- [ ] API endpoints validated
- [ ] Database operations tested
- [ ] Error handling tested
- [ ] Performance benchmarks met
