# 📖 Suplementor Quick Reference

**Fast lookup for common patterns and commands**

---

## 🚀 Commands

```bash
# Development
bun run dev              # Start dev server (localhost:3000)
bun run build            # Production build
bun run start            # Start production server
bun run typecheck        # TypeScript validation
bun run lint             # ESLint check
bun run test             # Run tests

# Database
bun run src/lib/db/migrations/add-performance-indexes.ts  # Add indexes
mongosh                  # MongoDB shell
```

---

## 🔧 tRPC Router Template

```typescript
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const myRouter = createTRPCRouter({
  // Query (read)
  getItems: publicProcedure
    .input(z.object({ 
      limit: z.number().min(1).max(100).default(20) 
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.myModel
        .find({ isActive: true })
        .limit(input.limit)
        .lean();
    }),

  // Mutation (write)
  createItem: publicProcedure
    .input(z.object({ 
      name: z.string().min(1).max(200) 
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.myModel.create({
        name: input.name,
        createdAt: new Date(),
      });
    }),
});
```

---

## 🗄️ Database Patterns

### Find with Filters
```typescript
await ctx.db.comprehensiveSupplement
  .find({
    category: { $in: ["VITAMINS_MINERALS", "AMINO_ACIDS"] },
    evidenceLevel: "STRONG",
    isActive: true,
  })
  .lean();
```

### Search (Safe)
```typescript
import { createSafeRegex } from "@/lib/utils/search-sanitizer";

const pattern = createSafeRegex(query);
await ctx.db.comprehensiveSupplement
  .find({
    $or: [
      { name: pattern },
      { polishName: pattern },
    ],
  })
  .lean();
```

### Pagination
```typescript
const skip = (page - 1) * limit;
await ctx.db.comprehensiveSupplement
  .find({ isActive: true })
  .sort({ lastUpdated: -1 })
  .skip(skip)
  .limit(limit)
  .lean();
```

### Aggregation
```typescript
await ctx.db.comprehensiveSupplement.aggregate([
  { $match: { isActive: true } },
  { $group: { _id: "$category", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);
```

---

## 🔒 Security Checklist

```typescript
// ✅ Input Validation
const InputSchema = z.object({
  query: z.string().min(1).max(200),
  limit: z.number().min(1).max(100),
});

// ✅ Search Sanitization
import { validateSearchQuery, createSafeRegex } from "@/lib/utils/search-sanitizer";

const validation = validateSearchQuery(input.query);
if (!validation.valid) throw new Error(validation.error);

const safePattern = createSafeRegex(input.query);

// ✅ Query Limits
.find({...})
  .limit(100)  // Always limit results
  .lean();     // Always use lean()

// ✅ Error Handling
try {
  const result = await ctx.db.model.find({...});
  return result;
} catch (error) {
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Failed to fetch data",
  });
}
```

---

## 🧪 Testing Template

```typescript
import { describe, it, expect } from "vitest";
import { createMockContext } from "@/lib/test-utils/trpc-test-helpers";
import { myRouter } from "@/server/api/routers/my-router";

describe("myRouter.getItems", () => {
  it("should return items", async () => {
    // Arrange
    const ctx = createMockContext();
    const mockData = [{ id: "1", name: "Test" }];
    
    ctx.db.myModel.find.mockReturnValue({
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue(mockData),
    });
    
    // Act
    const caller = myRouter.createCaller(ctx);
    const result = await caller.getItems({ limit: 10 });
    
    // Assert
    expect(result).toEqual(mockData);
    expect(ctx.db.myModel.find).toHaveBeenCalledWith({ isActive: true });
  });
});
```

---

## 📊 Available Models (ctx.db)

```typescript
ctx.db.knowledgeNode              // Knowledge graph nodes
ctx.db.knowledgeRelationship      // Knowledge graph edges
ctx.db.supplement                 // Basic supplements
ctx.db.comprehensiveSupplement    // Full supplement data
ctx.db.brainRegion                // Brain regions (3D)
ctx.db.neurotransmitterSystem     // Neurotransmitter data
ctx.db.researchStudy              // Research evidence
ctx.db.supplementIntakeLog        // User intake logs
ctx.db.effectMeasurement          // Effect tracking
ctx.db.supplementSchedule         // User schedules
ctx.db.progressInsight            // AI insights
ctx.db.userHealthProfile          // User profiles
ctx.db.aiRecommendation           // AI recommendations
ctx.db.drugSupplementInteraction  // Drug interactions
ctx.db.post                       // Posts (example)
```

---

## 🎯 Common Zod Schemas

```typescript
// String validation
z.string().min(1).max(200)
z.string().email()
z.string().url()
z.string().uuid()
z.string().cuid()

// Number validation
z.number().min(1).max(100)
z.number().int()
z.number().positive()

// Enum validation
z.enum(["STRONG", "MODERATE", "WEAK"])

// Array validation
z.array(z.string()).min(1).max(10)

// Object validation
z.object({
  name: z.string(),
  age: z.number().optional(),
})

// Union types
z.union([z.string(), z.number()])

// Default values
z.number().default(10)
z.boolean().default(false)
```

---

## 🐛 Debugging

### TypeScript Errors
```bash
# Check specific file
npx tsc --noEmit src/server/api/routers/my-router.ts

# Full typecheck
bun run typecheck
```

### Database Queries
```typescript
// Log query
const query = ctx.db.model.find({...});
console.log(query.getQuery());

// Explain query
const explain = await ctx.db.model
  .find({...})
  .explain("executionStats");
console.log(JSON.stringify(explain, null, 2));
```

### MongoDB Shell
```bash
# Connect
mongosh mongodb://localhost:27017/suplementor_education

# List collections
show collections

# Count documents
db.comprehensive_supplements.countDocuments()

# Find one
db.comprehensive_supplements.findOne()

# List indexes
db.comprehensive_supplements.getIndexes()
```

---

## 📁 File Locations

```
Key Files:
├── src/server/api/routers/          # tRPC routers
├── src/lib/db/models/               # Mongoose schemas
├── src/lib/utils/search-sanitizer.ts # Search security
├── src/lib/test-utils/              # Testing helpers
├── src/lib/db/migrations/           # Database migrations
└── src/server/api/trpc.ts           # tRPC config

Documentation:
├── MISSION_COMPLETE_REPORT.md       # Completion report
├── DEVELOPER_GUIDE.md               # Full dev guide
└── QUICK_REFERENCE.md               # This file
```

---

## 🔗 Useful Links

- **Next.js:** https://nextjs.org/docs
- **tRPC:** https://trpc.io/docs
- **Mongoose:** https://mongoosejs.com/docs
- **Zod:** https://zod.dev
- **Vitest:** https://vitest.dev

---

## ⚡ Performance Tips

1. **Always use `.lean()`** for read operations
2. **Add indexes** for frequently queried fields
3. **Limit results** with `.limit()`
4. **Use projection** with `.select()` to fetch only needed fields
5. **Avoid N+1 queries** - use aggregation or populate
6. **Cache frequently accessed data** (consider Redis)
7. **Monitor slow queries** (>200ms threshold)

---

## 🎨 Code Style

```typescript
// ✅ Good
const supplements = await ctx.db.comprehensiveSupplement
  .find({ isActive: true })
  .sort({ evidenceLevel: -1 })
  .limit(20)
  .lean();

// ❌ Bad
const supplements = await ctx.db.comprehensiveSupplement.find({ isActive: true }).sort({ evidenceLevel: -1 }).limit(20).lean();
```

---

## 🚨 Common Mistakes

```typescript
// ❌ DON'T: Import models directly
import { ComprehensiveSupplement } from "@/lib/db/models";

// ✅ DO: Use ctx.db
const data = await ctx.db.comprehensiveSupplement.find({...});

// ❌ DON'T: Unsafe regex
.find({ name: new RegExp(userInput, 'i') })

// ✅ DO: Safe regex
import { createSafeRegex } from "@/lib/utils/search-sanitizer";
.find({ name: createSafeRegex(userInput) })

// ❌ DON'T: Forget .lean()
const docs = await ctx.db.model.find({...});

// ✅ DO: Always .lean()
const docs = await ctx.db.model.find({...}).lean();

// ❌ DON'T: Skip validation
.query(async ({ ctx, input }) => {
  return await ctx.db.model.find({ id: input.id });
})

// ✅ DO: Validate input
.input(z.object({ id: z.string().cuid() }))
.query(async ({ ctx, input }) => {
  return await ctx.db.model.find({ id: input.id });
})
```

---

*Quick Reference v1.0 - Last updated: 2025-10-05*

