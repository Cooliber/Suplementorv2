# Suplementor Production Readiness - Systematic Repair Plan

## Executive Summary

**Current Status**: Next.js 15 T3 Stack application with 1099 TypeScript errors
**Target**: Zero errors, production-ready deployment
**Approach**: Systematic, phase-based repair with verification at each step

## Phase 1: Critical Foundation Fixes ✅ PARTIALLY COMPLETE

### 1.1 Animation System Fixes ✅ COMPLETE
- [x] Fixed `easingCurves` export (added alias in config.ts)
- [x] Fixed framer-motion type issues in animation components
- [x] Cleaned build cache
- **Result**: Animation errors eliminated (12 errors fixed)

### 1.2 Database Context Issues 🔴 CRITICAL - IN PROGRESS
**Problem**: `ctx.db` not available in tRPC context (25+ errors)
**Root Cause**: Prisma client not properly initialized in tRPC context
**Files Affected**:
- `src/server/api/routers/knowledge.ts`
- `src/server/api/routers/recommendations.ts`
- All tRPC routers using database

**Fix Strategy**:
1. Check `src/server/api/trpc.ts` for database context setup
2. Verify Prisma client initialization in `src/server/db.ts`
3. Ensure context includes `db` property
4. Update all router imports to use correct context type

### 1.3 Type Import Issues 🟡 MEDIUM PRIORITY
**Problem**: `verbatimModuleSyntax` requires type-only imports
**Files Affected**:
- `src/components/graph/CytoscapeVisualization.tsx`
- `src/components/graph/D3GraphVisualization.tsx`
- Multiple graph visualization components

**Fix**: Change imports to use `import type` for type-only imports

## Phase 2: Component Prop Type Mismatches

### 2.1 Missing Component Props
**Files with Issues**:
- `src/app/suplementy/page.tsx` (7 errors)
- `src/app/wiedza/page.tsx` (1 error)
- `src/app/knowledge-graph/page.tsx` (2 errors)

**Common Issues**:
- Components expecting props that don't exist
- Type mismatches between component definitions and usage
- Missing prop definitions in component interfaces

### 2.2 Gamification Component Issues
**Files**:
- `src/components/gamification/StreakCalendar.tsx`
- `src/components/gamification/XPProgressBar.tsx`
- `src/components/gamification/LevelUpNotification.tsx`

**Issues**:
- Undefined property access (`levelInfo` possibly undefined)
- Date string type mismatches
- Missing return statements

## Phase 3: Data Type Mismatches

### 3.1 Supplement Category Enum Issues
**Problem**: Missing `PROBIOTIC` and `ENZYME` categories
**Files**:
- `src/components/features/search/AdvancedSearchBar.tsx`
- `src/components/features/search/SearchResults.tsx`

**Fix**: Add missing categories to type definitions

### 3.2 Polish Localization Type Issues
**Files**:
- `src/lib/supplement-migration-utils.ts`
- Multiple supplement data files

**Issues**:
- Missing required fields in clinical applications
- Missing `polishPathway` in mechanisms
- Missing `clinicalSignificance` in interactions

## Phase 4: Service Layer Fixes

### 4.1 Polish Search Service
**File**: `src/lib/services/polish-search-service.ts`
**Issues**: Array index possibly undefined (13 errors)
**Fix**: Add proper null checks and array bounds validation

### 4.2 Supplement Interaction Service
**File**: `src/lib/services/supplement-interaction-service.ts`
**Issues**: Type import errors, undefined parameter handling

### 4.3 MongoDB Integration
**Files**:
- `src/lib/db/mongodb.ts`
- `src/lib/db/models/*.ts`

**Issues**: Mongoose model type definitions

## Phase 5: Script and Utility Fixes

### 5.1 Validation Scripts
**File**: `src/scripts/validate-supplements.ts`
**Issues**: Missing exports, implicit any types

### 5.2 Component Generator
**File**: `scripts/generate-supplement-template.ts`
**Issues**: Undefined parameter handling

## Implementation Strategy

### Priority Order:
1. **P0 - Blockers**: Database context, build-breaking errors
2. **P1 - Critical**: Component prop mismatches, type imports
3. **P2 - Important**: Data type issues, service layer
4. **P3 - Nice-to-have**: Scripts, utilities

### Verification Steps:
After each phase:
1. Run `bun run typecheck`
2. Count remaining errors
3. Document fixes in this file
4. Commit changes with descriptive message

## Current Error Breakdown

```
Total Errors: 1099

By Category:
- Database context (ctx.db): ~150 errors
- Type imports (verbatimModuleSyntax): ~70 errors
- Component props: ~50 errors
- Undefined/null checks: ~200 errors
- Implicit any types: ~150 errors
- Data type mismatches: ~100 errors
- Missing exports: ~30 errors
- Other: ~349 errors
```

## Next Immediate Actions

1. Fix database context in tRPC setup
2. Add type-only imports for graph components
3. Fix component prop definitions
4. Add null checks for array access
5. Complete type definitions for supplement data

## Success Criteria

- [ ] Zero TypeScript errors
- [ ] `bun run build` completes successfully
- [ ] All E2E tests pass
- [ ] Performance metrics meet targets
- [ ] Security audit clean
- [ ] PWA functionality verified
- [ ] Polish localization 100% complete

## Progress Tracking

- **Phase 1.1**: ✅ Complete (12 errors fixed)
- **Phase 1.2**: 🔄 In Progress
- **Phase 1.3**: ⏳ Pending
- **Phase 2**: ⏳ Pending
- **Phase 3**: ⏳ Pending
- **Phase 4**: ⏳ Pending
- **Phase 5**: ⏳ Pending

---

**Last Updated**: 2025-01-XX
**Errors Remaining**: 1099 → Target: 0
**Estimated Completion**: Systematic approach, ~4-6 hours of focused work

