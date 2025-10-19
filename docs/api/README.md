# API Documentation

## Overview

The Suplementor API provides comprehensive access to supplement data, knowledge graphs, user management, and educational content. Built with tRPC for type-safe API routes and comprehensive Polish localization.

## Base URL

```
Development: http://localhost:3000/api/trpc
Production: https://suplementor.vercel.app/api/trpc
```

## Authentication

All API routes require authentication via NextAuth.js. Include the session token in your requests:

```typescript
// Client-side usage
import { createTRPCReact } from '@trpc/react-query';

const trpc = createTRPCReact<AppRouter>();

// Use in components
const { data: supplements } = trpc.supplement.getAll.useQuery({
  category: 'nootropics'
});
```

## API Routes

### Supplement API

#### Get All Supplements
```typescript
supplement.getAll: {
  input: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  };
  output: Supplement[];
}
```

**Parameters:**
- `category` (optional): Filter by supplement category
- `search` (optional): Search in supplement names and descriptions
- `limit` (optional): Maximum number of results (default: 50)
- `offset` (optional): Number of results to skip (default: 0)

**Example:**
```typescript
const supplements = await trpc.supplement.getAll.query({
  category: 'nootropics',
  search: 'l-teanina',
  limit: 20
});
```

#### Get Supplement by ID
```typescript
supplement.getById: {
  input: { id: string };
  output: Supplement | null;
}
```

**Example:**
```typescript
const supplement = await trpc.supplement.getById.query({
  id: '507f1f77bcf86cd799439011'
});
```

#### Search Supplements
```typescript
supplement.search: {
  input: {
    query: string;
    filters?: {
      category?: string[];
      benefits?: string[];
      safetyRating?: string[];
    };
  };
  output: Supplement[];
}
```

**Example:**
```typescript
const results = await trpc.supplement.search.query({
  query: 'koncentracja',
  filters: {
    category: ['nootropics'],
    benefits: ['cognitive-enhancement']
  }
});
```

#### Get Supplement Interactions
```typescript
supplement.getInteractions: {
  input: { supplementIds: string[] };
  output: Interaction[];
}
```

**Example:**
```typescript
const interactions = await trpc.supplement.getInteractions.query({
  supplementIds: ['supplement1', 'supplement2']
});
```

#### Get Personalized Recommendations
```typescript
supplement.getRecommendations: {
  input: {
    userGoals: string[];
    currentSupplements?: string[];
    healthProfile?: HealthProfile;
  };
  output: SupplementRecommendation[];
}
```

**Example:**
```typescript
const recommendations = await trpc.supplement.getRecommendations.query({
  userGoals: ['cognitive-enhancement', 'stress-reduction'],
  currentSupplements: ['l-teanina'],
  healthProfile: userHealthProfile
});
```

### Knowledge Graph API

#### Get Knowledge Graph
```typescript
knowledge.getGraph: {
  input: {
    depth?: number;
    categories?: string[];
  };
  output: KnowledgeGraph;
}
```

**Example:**
```typescript
const graph = await trpc.knowledge.getGraph.query({
  depth: 2,
  categories: ['brain-regions', 'neurotransmitters']
});
```

#### Get Knowledge Node
```typescript
knowledge.getNode: {
  input: { id: string };
  output: KnowledgeNode | null;
}
```

**Example:**
```typescript
const node = await trpc.knowledge.getNode.query({
  id: 'frontal-cortex'
});
```

#### Search Knowledge Base
```typescript
knowledge.searchKnowledge: {
  input: {
    query: string;
    type?: 'brain-region' | 'neurotransmitter' | 'supplement';
  };
  output: KnowledgeNode[];
}
```

**Example:**
```typescript
const results = await trpc.knowledge.searchKnowledge.query({
  query: 'pamięć',
  type: 'brain-region'
});
```

### User Management API

#### Get User Profile
```typescript
user.getProfile: {
  input: undefined;
  output: UserProfile;
}
```

#### Update User Profile
```typescript
user.updateProfile: {
  input: Partial<UserProfile>;
  output: UserProfile;
}
```

#### Get User Supplement Stacks
```typescript
user.getSupplementStacks: {
  input: undefined;
  output: SupplementStack[];
}
```

### Educational Content API

#### Get Learning Modules
```typescript
learning.getModules: {
  input: {
    category?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  output: LearningModule[];
}
```

#### Get Module Content
```typescript
learning.getModuleContent: {
  input: { moduleId: string };
  output: ModuleContent;
}
```

#### Track Learning Progress
```typescript
learning.trackProgress: {
  input: {
    moduleId: string;
    progress: number;
    completed?: boolean;
  };
  output: LearningProgress;
}
```

## Data Types

### Supplement
```typescript
interface Supplement {
  id: string;
  name: string;
  polishName: string;
  category: string;
  description: string;
  benefits: string[];
  dosage: string;
  timing: string;
  price: string;
  skład: {
    activeIngredient: string;
    concentration: string;
    form: string;
    additional: string[];
  };
  neuroEffects: string[];
  warnings: string[];
  source: string;
  evidenceLevel: 'high' | 'medium' | 'low';
  researchCitations: string[];
  interactions: InteractionData[];
  createdAt: Date;
  updatedAt: Date;
}
```

### KnowledgeNode
```typescript
interface KnowledgeNode {
  id: string;
  name: string;
  polishName: string;
  type: 'brain-region' | 'neurotransmitter' | 'supplement' | 'concept';
  description: string;
  functions: string[];
  relatedNodes: string[];
  position?: {
    x: number;
    y: number;
    z: number;
  };
  color?: string;
  importance: number;
}
```

### Interaction
```typescript
interface Interaction {
  id: string;
  supplements: string[];
  type: 'synergistic' | 'antagonistic' | 'contraindicated';
  severity: 'low' | 'medium' | 'high';
  description: string;
  evidence: string[];
  recommendations: string[];
}
```

## Error Handling

All API routes return standardized error responses:

```typescript
interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

Common error codes:
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `RATE_LIMITED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting

API routes are rate-limited to prevent abuse:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
- Special limits for resource-intensive endpoints

## Polish Localization

All API responses include complete Polish translations:
- Supplement names and descriptions in Polish
- Medical terminology using official Polish medical dictionary
- Error messages localized to Polish
- Date and number formatting according to Polish standards

## WebSocket Events

Real-time updates via WebSocket:

```typescript
// Client-side WebSocket connection
const ws = new WebSocket('wss://suplementor.vercel.app/api/websocket');

// Subscribe to supplement updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'supplement-updates'
}));

// Listen for updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'supplement-update') {
    // Handle supplement update
  }
};
```

## SDK and Libraries

### JavaScript/TypeScript SDK
```bash
npm install @suplementor/sdk
```

```typescript
import { SuplementorAPI } from '@suplementor/sdk';

const api = new SuplementorAPI({
  apiKey: 'your-api-key',
  baseUrl: 'https://suplementor.vercel.app'
});

const supplements = await api.supplements.getAll({
  category: 'nootropics'
});
```

### REST API (Alternative)
For non-TypeScript clients, REST endpoints are available:

```
GET /api/supplements?category=nootropics
GET /api/supplements/{id}
POST /api/supplements/search
GET /api/knowledge/graph
```

## Support

For API support:
- Check this documentation first
- Review the TypeScript definitions in `src/lib/types/`
- Examine existing usage in `src/lib/hooks/`
- Create an issue for bugs or feature requests