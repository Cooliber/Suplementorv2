# 🚀 Suplementor Developer Guide

**Complete guide for developing and maintaining the Suplementor application**

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Development Patterns](#development-patterns)
4. [Database Operations](#database-operations)
5. [Testing](#testing)
6. [Common Tasks](#common-tasks)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- **Bun** 1.1.38+ (package manager)
- **Node.js** 18+ (runtime)
- **MongoDB** 6.0+ (database)
- **TypeScript** 5.8+ (language)

### Installation
```bash
# Clone repository
git clone <repository-url>
cd suplementor

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Run database migrations
bun run src/lib/db/migrations/add-performance-indexes.ts

# Start development server
bun run dev
```

### Verify Setup
```bash
# Type check
bun run typecheck

# Build
bun run build

# Run tests
bun run test
```

---

## Architecture Overview

### Tech Stack
- **Framework:** Next.js 15.2.3 (App Router)
- **Language:** TypeScript 5.8.2
- **Database:** MongoDB with Mongoose ODM
- **API:** tRPC 11.0.0
- **Package Manager:** Bun 1.1.38
- **Styling:** Tailwind CSS 4

### Project Structure
```
suplementor/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   ├── lib/
│   │   ├── db/
│   │   │   ├── models/        # Mongoose schemas
│   │   │   ├── migrations/    # Database migrations
│   │   │   └── mongodb.ts     # Connection management
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   └── test-utils/        # Testing helpers
│   ├── server/
│   │   └── api/
│   │       ├── routers/       # tRPC routers
│   │       └── trpc.ts        # tRPC configuration
│   └── types/                 # TypeScript type definitions
├── scripts/                   # Build and utility scripts
└── docs/                      # Documentation
```

---

## Development Patterns

### 1. tRPC Router Pattern

**✅ CORRECT - Use ctx.db:**
```typescript
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const myRouter = createTRPCRouter({
  getItems: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.comprehensiveSupplement
        .find({ isActive: true })
        .limit(input.limit)
        .lean();
      
      return items;
    }),
});
```

**❌ INCORRECT - Direct model import:**
```typescript
// DON'T DO THIS
import { ComprehensiveSupplement } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongodb";

.query(async ({ input }) => {
  await connectToDatabase(); // ❌ Wrong
  const items = await ComprehensiveSupplement.find({...}); // ❌ Wrong
})
```

### 2. Search Query Pattern

**✅ CORRECT - Use search sanitizer:**
```typescript
import { createSafeRegex, validateSearchQuery } from "@/lib/utils/search-sanitizer";

.query(async ({ ctx, input }) => {
  // Validate input
  const validation = validateSearchQuery(input.query);
  if (!validation.valid) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: validation.error,
    });
  }

  // Create safe regex
  const safePattern = createSafeRegex(input.query);
  
  const results = await ctx.db.comprehensiveSupplement
    .find({
      $or: [
        { name: safePattern },
        { polishName: safePattern },
      ],
    })
    .lean();
    
  return results;
})
```

**❌ INCORRECT - Unsafe regex:**
```typescript
// DON'T DO THIS - Vulnerable to regex DoS
.query(async ({ ctx, input }) => {
  const results = await ctx.db.comprehensiveSupplement
    .find({
      name: new RegExp(input.query, 'i'), // ❌ Unsafe
    })
    .lean();
})
```

### 3. Mongoose Query Pattern

**Always use `.lean()` for read operations:**
```typescript
// ✅ Good - Returns plain JavaScript objects
const supplements = await ctx.db.comprehensiveSupplement
  .find({ category: "VITAMINS_MINERALS" })
  .sort({ evidenceLevel: -1 })
  .limit(20)
  .lean(); // ← Important!

// ❌ Bad - Returns Mongoose documents (slower, more memory)
const supplements = await ctx.db.comprehensiveSupplement
  .find({ category: "VITAMINS_MINERALS" })
  .sort({ evidenceLevel: -1 })
  .limit(20);
```

---

## Database Operations

### Available Models (via ctx.db)

```typescript
ctx.db.knowledgeNode
ctx.db.knowledgeRelationship
ctx.db.supplement
ctx.db.comprehensiveSupplement
ctx.db.brainRegion
ctx.db.neurotransmitterSystem
ctx.db.researchStudy
ctx.db.supplementIntakeLog
ctx.db.effectMeasurement
ctx.db.supplementSchedule
ctx.db.progressInsight
ctx.db.userHealthProfile
ctx.db.aiRecommendation
ctx.db.drugSupplementInteraction
ctx.db.post
```

### Common Query Patterns

#### Find with filters
```typescript
const results = await ctx.db.comprehensiveSupplement
  .find({
    category: { $in: ["VITAMINS_MINERALS", "AMINO_ACIDS"] },
    evidenceLevel: "STRONG",
    isActive: true,
  })
  .lean();
```

#### Text search
```typescript
const results = await ctx.db.comprehensiveSupplement
  .find({
    $text: { $search: query },
  })
  .select("name polishName description")
  .lean();
```

#### Pagination
```typescript
const page = 1;
const limit = 20;
const skip = (page - 1) * limit;

const results = await ctx.db.comprehensiveSupplement
  .find({ isActive: true })
  .sort({ lastUpdated: -1 })
  .skip(skip)
  .limit(limit)
  .lean();
```

#### Aggregation
```typescript
const stats = await ctx.db.comprehensiveSupplement.aggregate([
  { $match: { isActive: true } },
  { $group: {
      _id: "$category",
      count: { $sum: 1 },
      avgEvidence: { $avg: "$evidenceLevel" },
    }
  },
  { $sort: { count: -1 } },
]);
```

---

## Testing

### Unit Testing with Vitest

```typescript
import { describe, it, expect } from "vitest";
import { 
  createMockContext, 
  createMockSupplement 
} from "@/lib/test-utils/trpc-test-helpers";
import { supplementRouter } from "@/server/api/routers/supplement";

describe("supplementRouter.getById", () => {
  it("should return supplement by id", async () => {
    // Arrange
    const mockSupplement = createMockSupplement();
    const ctx = createMockContext();
    
    ctx.db.comprehensiveSupplement.findOne.mockReturnValue({
      lean: vi.fn().mockResolvedValue(mockSupplement),
    });
    
    // Act
    const caller = supplementRouter.createCaller(ctx);
    const result = await caller.getById({ 
      id: "test-id",
      includeRelations: false 
    });
    
    // Assert
    expect(result).toEqual(mockSupplement);
  });
});
```

### Integration Testing

```typescript
import { createMockContext } from "@/lib/test-utils/trpc-test-helpers";
import connectToDatabase from "@/lib/db/mongodb";

describe("Supplement Integration Tests", () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  it("should fetch real supplements from database", async () => {
    const ctx = createMockContext({
      db: {
        comprehensiveSupplement: ComprehensiveSupplement,
      },
    });
    
    const caller = supplementRouter.createCaller(ctx);
    const result = await caller.getAll({ limit: 5 });
    
    expect(result.length).toBeGreaterThan(0);
  });
});
```

---

## Common Tasks

### Adding a New tRPC Router

1. **Create router file:**
```typescript
// src/server/api/routers/my-router.ts
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const myRouter = createTRPCRouter({
  getItems: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.myModel.find({}).limit(input.limit).lean();
    }),
});
```

2. **Register in root router:**
```typescript
// src/server/api/root.ts
import { myRouter } from "@/server/api/routers/my-router";

export const appRouter = createTRPCRouter({
  // ... existing routers
  myRouter: myRouter,
});
```

### Adding a New Mongoose Model

1. **Create model file:**
```typescript
// src/lib/db/models/MyModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IMyModel extends Document {
  name: string;
  polishName: string;
  // ... other fields
}

const MyModelSchema = new Schema<IMyModel>({
  name: { type: String, required: true },
  polishName: { type: String, required: true },
}, { timestamps: true });

// Add indexes
MyModelSchema.index({ name: "text", polishName: "text" });

export const MyModel = mongoose.models.MyModel || 
  mongoose.model<IMyModel>("MyModel", MyModelSchema);
```

2. **Export from index:**
```typescript
// src/lib/db/models/index.ts
export { MyModel } from "./MyModel";
```

3. **Add to tRPC context:**
```typescript
// src/server/api/trpc.ts
const db = {
  // ... existing models
  myModel: models.MyModel,
};
```

---

## Troubleshooting

### TypeScript Errors

**Problem:** `Cannot find name 'ctx'`
```typescript
// ❌ Missing ctx parameter
.query(async ({ input }) => {
  await ctx.db... // Error!
})

// ✅ Add ctx parameter
.query(async ({ ctx, input }) => {
  await ctx.db...
})
```

### Database Connection Issues

**Problem:** `MongooseError: Operation buffering timed out`

**Solution:**
```typescript
// Check MongoDB connection string in .env
MONGODB_URI=mongodb://localhost:27017/suplementor_education

// Verify MongoDB is running
mongod --version

// Test connection
bun run src/lib/db/mongodb.ts
```

### Performance Issues

**Problem:** Slow queries

**Solutions:**
1. Add indexes for frequently queried fields
2. Use `.lean()` for read operations
3. Limit result sets with `.limit()`
4. Use projection with `.select()`
5. Check query explain plan

```typescript
// Check query performance
const explain = await ctx.db.comprehensiveSupplement
  .find({ category: "VITAMINS_MINERALS" })
  .explain("executionStats");

console.log(explain);
```

---

## Best Practices

### ✅ DO
- Use `ctx.db` for all database access
- Always use `.lean()` for read operations
- Validate user input with zod schemas
- Sanitize search queries
- Add indexes for frequently queried fields
- Use TypeScript strict mode
- Write tests for critical paths
- Document complex logic

### ❌ DON'T
- Import models directly in routers
- Call `connectToDatabase()` in procedures
- Use unsafe regex patterns
- Skip input validation
- Return Mongoose documents (use `.lean()`)
- Use `any` type unnecessarily
- Commit sensitive data to git

---

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **tRPC Docs:** https://trpc.io/docs
- **Mongoose Docs:** https://mongoosejs.com/docs
- **MongoDB Docs:** https://docs.mongodb.com
- **TypeScript Docs:** https://www.typescriptlang.org/docs

---

*Last updated: 2025-10-05*  
*Maintained by: The Augster*

