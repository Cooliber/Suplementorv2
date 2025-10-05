# API Reference - Graf Wiedzy o Suplementach

## Przegląd API

System grafu wiedzy udostępnia RESTful API oraz tRPC endpoints do zarządzania danymi o suplementach, neuroprzekaźnikach, regionach mózgu i ich relacjach. Wszystkie endpointy obsługują polskie nazwy i opisy.

## Autoryzacja

```typescript
// Headers wymagane dla operacji zapisu
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json",
  "Accept-Language": "pl-PL"
}
```

## tRPC Endpoints

### Knowledge Graph Router

#### `knowledgeGraph.generate`

Generuje graf wiedzy na podstawie zadanych parametrów.

**Input:**
```typescript
{
  includeSupplements?: boolean; // default: true
  includeNeurotransmitters?: boolean; // default: true
  includeBrainRegions?: boolean; // default: true
  includeCognitiveFunctions?: boolean; // default: true
  maxNodes?: number; // default: 500, max: 1000
  evidenceLevels?: ('STRONG' | 'MODERATE' | 'WEAK')[]; // default: ['STRONG', 'MODERATE']
  categories?: string[]; // Filtrowanie po kategoriach
  searchTerm?: string; // Wyszukiwanie w polskich nazwach i opisach
  minImportance?: number; // 0-1, default: 0
  layout?: 'force' | 'hierarchical' | 'circular'; // default: 'force'
}
```

**Output:**
```typescript
{
  nodes: KnowledgeNode[];
  relationships: KnowledgeRelationship[];
  supplements: SupplementWithRelations[];
  metadata: {
    totalNodes: number;
    totalRelationships: number;
    generatedAt: string;
    layout: string;
    filters: object;
  };
}
```

**Przykład użycia:**
```typescript
const { data } = api.knowledgeGraph.generate.useQuery({
  includeSupplements: true,
  maxNodes: 100,
  evidenceLevels: ['STRONG'],
  searchTerm: 'omega-3',
  categories: ['Kwasy tłuszczowe']
});
```

#### `knowledgeGraph.getNode`

Pobiera szczegółowe informacje o pojedynczym węźle.

**Input:**
```typescript
{
  id: string;
  includeRelationships?: boolean; // default: true
  includeResearch?: boolean; // default: false
}
```

**Output:**
```typescript
{
  node: KnowledgeNode;
  relationships: KnowledgeRelationship[];
  researchStudies?: ResearchStudy[];
  relatedNodes: KnowledgeNode[];
}
```

#### `knowledgeGraph.searchNodes`

Wyszukuje węzły na podstawie polskich nazw i opisów.

**Input:**
```typescript
{
  query: string;
  types?: NodeType[];
  limit?: number; // default: 50
  offset?: number; // default: 0
  sortBy?: 'relevance' | 'importance' | 'name';
  sortOrder?: 'asc' | 'desc';
}
```

**Output:**
```typescript
{
  nodes: KnowledgeNode[];
  total: number;
  hasMore: boolean;
  searchMetadata: {
    query: string;
    processingTime: number;
    suggestions: string[];
  };
}
```

### Supplements Router

#### `supplements.list`

Pobiera listę suplementów z polskimi nazwami.

**Input:**
```typescript
{
  category?: string;
  evidenceLevel?: EvidenceLevel;
  limit?: number; // default: 50
  offset?: number; // default: 0
  search?: string; // Wyszukiwanie w polskich polach
  sortBy?: 'name' | 'polishName' | 'importance' | 'createdAt';
  includeInactive?: boolean; // default: false
}
```

**Output:**
```typescript
{
  supplements: Supplement[];
  total: number;
  hasMore: boolean;
  categories: string[]; // Dostępne kategorie po polsku
}
```

#### `supplements.getById`

Pobiera szczegółowe informacje o suplemencie.

**Input:**
```typescript
{
  id: string;
  includeRelationships?: boolean;
  includeResearch?: boolean;
  includeInteractions?: boolean;
}
```

**Output:**
```typescript
{
  supplement: SupplementWithRelations;
  relationships: KnowledgeRelationship[];
  researchStudies: ResearchStudy[];
  interactions: SupplementInteraction[];
  relatedSupplements: Supplement[];
}
```

#### `supplements.create` (Protected)

Tworzy nowy suplement.

**Input:**
```typescript
{
  name: string;
  polishName: string; // Wymagane
  scientificName?: string;
  polishCommonNames: string[];
  category: string; // Po polsku
  description: string;
  polishDescription: string; // Wymagane
  activeCompounds: ActiveCompound[];
  clinicalApplications: ClinicalApplication[];
  dosageGuidelines: DosageGuidelines;
  sideEffects: SideEffect[];
  tags: string[];
}
```

#### `supplements.update` (Protected)

Aktualizuje istniejący suplement.

**Input:**
```typescript
{
  id: string;
  data: Partial<SupplementUpdateData>;
  version: number; // Optimistic locking
}
```

#### `supplements.addResearchStudy` (Protected)

Dodaje badanie naukowe do suplementu.

**Input:**
```typescript
{
  supplementId: string;
  study: {
    title: string;
    polishTitle: string;
    journal: string;
    year: number;
    studyType: StudyType;
    sampleSize: number;
    evidenceLevel: EvidenceLevel;
    findings: string;
    polishFindings: string;
    pubmedId?: string;
    doi?: string;
  };
}
```

### Relationships Router

#### `relationships.create` (Protected)

Tworzy nową relację między węzłami.

**Input:**
```typescript
{
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  strength: number; // 0-1
  confidence: number; // 0-1
  mechanism: string;
  polishMechanism: string; // Wymagane
  evidenceLevel: EvidenceLevel;
  sources: ResearchSource[];
  conditions?: RelationshipConditions;
}
```

#### `relationships.update` (Protected)

Aktualizuje istniejącą relację.

**Input:**
```typescript
{
  id: string;
  data: Partial<RelationshipUpdateData>;
  reason: string; // Powód aktualizacji
}
```

#### `relationships.validate`

Waliduje proponowaną relację.

**Input:**
```typescript
{
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  mechanism: string;
  polishMechanism: string;
}
```

**Output:**
```typescript
{
  isValid: boolean;
  confidence: number;
  warnings: string[];
  suggestions: string[];
  existingRelationships: KnowledgeRelationship[];
}
```

## REST API Endpoints

### Graph Data

#### `GET /api/graph/generate`

Alternatywny endpoint REST dla generowania grafu.

**Query Parameters:**
- `includeSupplements` (boolean)
- `maxNodes` (number)
- `evidenceLevels` (string, comma-separated)
- `search` (string)
- `categories` (string, comma-separated)

**Response:**
```json
{
  "success": true,
  "data": {
    "nodes": [...],
    "relationships": [...],
    "metadata": {...}
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### `GET /api/graph/export`

Eksportuje dane grafu w różnych formatach.

**Query Parameters:**
- `format` (json|csv|graphml)
- `includeMetadata` (boolean)
- `polishOnly` (boolean)

### Supplements

#### `GET /api/supplements`

Lista suplementów z paginacją.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `category` (string)
- `search` (string)
- `sortBy` (string)
- `sortOrder` (asc|desc)

#### `GET /api/supplements/:id`

Szczegóły suplementu.

#### `POST /api/supplements` (Protected)

Tworzenie nowego suplementu.

#### `PUT /api/supplements/:id` (Protected)

Aktualizacja suplementu.

#### `DELETE /api/supplements/:id` (Protected)

Usunięcie suplementu (soft delete).

### Search

#### `GET /api/search`

Globalne wyszukiwanie w grafie.

**Query Parameters:**
- `q` (string, required)
- `types` (string, comma-separated)
- `limit` (number)
- `lang` (pl|en, default: pl)

**Response:**
```json
{
  "results": [
    {
      "id": "omega-3",
      "type": "SUPPLEMENT",
      "name": "Omega-3 Fatty Acids",
      "polishName": "Kwasy tłuszczowe Omega-3",
      "description": "...",
      "polishDescription": "...",
      "relevance": 0.95,
      "category": "Kwasy tłuszczowe"
    }
  ],
  "total": 15,
  "suggestions": ["omega 3", "kwasy omega-3"],
  "processingTime": 45
}
```

## WebSocket Events

### Connection

```javascript
const ws = new WebSocket('wss://api.suplementor.pl/ws');

ws.onopen = () => {
  // Subskrybuj aktualizacje grafu
  ws.send(JSON.stringify({
    type: 'SUBSCRIBE',
    channel: 'graph-updates'
  }));
};
```

### Events

#### `SUPPLEMENT_UPDATED`

```json
{
  "type": "SUPPLEMENT_UPDATED",
  "data": {
    "id": "omega-3",
    "changes": ["polishDescription", "researchStudies"],
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### `RELATIONSHIP_ADDED`

```json
{
  "type": "RELATIONSHIP_ADDED",
  "data": {
    "id": "rel-123",
    "sourceId": "omega-3",
    "targetId": "dopamine",
    "type": "ENHANCES",
    "polishMechanism": "Wzmocnienie płynności błon komórkowych"
  }
}
```

#### `RESEARCH_STUDY_ADDED`

```json
{
  "type": "RESEARCH_STUDY_ADDED",
  "data": {
    "supplementId": "omega-3",
    "study": {
      "title": "...",
      "polishTitle": "...",
      "evidenceLevel": "STRONG"
    }
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Nieprawidłowe dane wejściowe",
    "details": {
      "field": "polishName",
      "reason": "Pole jest wymagane"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req-123"
  }
}
```

### Error Codes

- `VALIDATION_ERROR` - Błąd walidacji danych
- `NOT_FOUND` - Zasób nie został znaleziony
- `UNAUTHORIZED` - Brak autoryzacji
- `FORBIDDEN` - Brak uprawnień
- `RATE_LIMIT_EXCEEDED` - Przekroczono limit zapytań
- `INTERNAL_ERROR` - Błąd wewnętrzny serwera
- `DATABASE_ERROR` - Błąd bazy danych
- `CACHE_ERROR` - Błąd cache'u

## Rate Limiting

### Limity dla różnych typów użytkowników

- **Anonymous**: 100 zapytań/godzinę
- **Authenticated**: 1000 zapytań/godzinę
- **Premium**: 10000 zapytań/godzinę
- **API Key**: 50000 zapytań/godzinę

### Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

## Versioning

API używa semantic versioning w headerze:

```
API-Version: v1.2.0
```

Obsługiwane wersje:
- `v1.0.0` - Podstawowa funkcjonalność
- `v1.1.0` - Dodano wyszukiwanie polskie
- `v1.2.0` - Dodano WebSocket events

## SDK i Biblioteki

### TypeScript/JavaScript

```bash
npm install @suplementor/graph-api
```

```typescript
import { SupplementorAPI } from '@suplementor/graph-api';

const api = new SupplementorAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.suplementor.pl',
  language: 'pl'
});

const graph = await api.graph.generate({
  maxNodes: 100,
  searchTerm: 'omega-3'
});
```

### Python

```bash
pip install suplementor-graph-api
```

```python
from suplementor_api import SupplementorAPI

api = SupplementorAPI(
    api_key='your-api-key',
    base_url='https://api.suplementor.pl',
    language='pl'
)

graph = api.graph.generate(
    max_nodes=100,
    search_term='omega-3'
)
```

## Przykłady Integracji

### React Hook

```typescript
import { useGraphData } from '@/hooks/useGraphData';

function GraphComponent() {
  const { 
    nodes, 
    relationships, 
    isLoading, 
    error 
  } = useGraphData({
    maxNodes: 200,
    searchTerm: 'magnez',
    evidenceLevels: ['STRONG', 'MODERATE']
  });

  if (isLoading) return <div>Ładowanie grafu...</div>;
  if (error) return <div>Błąd: {error.message}</div>;

  return <GraphVisualization nodes={nodes} relationships={relationships} />;
}
```

### Next.js API Route

```typescript
// pages/api/custom-graph.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { generateGraph } from '@/lib/graph-generator';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { searchTerm, category } = req.query;
    
    const graph = await generateGraph({
      searchTerm: searchTerm as string,
      categories: category ? [category as string] : undefined,
      maxNodes: 100
    });
    
    res.status(200).json({
      success: true,
      data: graph
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Błąd generowania grafu'
      }
    });
  }
}
```
