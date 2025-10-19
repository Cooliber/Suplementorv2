# Dokumentacja API dla deweloperów - Suplementor

## Spis treści
1. [Wprowadzenie](#wprowadzenie)
2. [Autoryzacja i uwierzytelnianie](#autoryzacja)
3. [tRPC Endpoints](#trpc-endpoints)
4. [REST API](#rest-api)
5. [WebSocket Events](#websocket-events)
6. [Biblioteki klienckie](#biblioteki-klienckie)
7. [Przykłady integracji](#przykłady-integracji)
8. [Rate limiting i quotas](#rate-limiting)
9. [Obsługa błędów](#obsługa-błędów)
10. [Webhooks](#webhooks)
11. [SDK Examples](#sdk-examples)
12. [Testing](#testing)

## Wprowadzenie

Suplementor API udostępnia kompleksowy dostęp do bazy suplementów, grafu wiedzy, analiz interakcji i danych edukacyjnych. Wszystkie endpointy obsługują polskie nazwy i opisy zgodnie z medyczną terminologią polską.

### Środowiska:
- **Production**: `https://api.suplementor.pl`
- **Staging**: `https://staging-api.suplementor.pl`
- **Development**: `http://localhost:3000/api`

### Wersje API:
- **v1.2.0** - Aktualna wersja stabilna
- **v1.1.0** - Wprowadzono WebSocket events
- **v1.0.0** - Pierwsza wersja z podstawową funkcjonalnością

## Autoryzacja i uwierzytelnianie

### JWT Authentication
```typescript
// Headers wymagane dla operacji zapisu
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json",
  "Accept-Language": "pl-PL"
}
```

### Uzyskanie tokena
```typescript
// Login endpoint
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securePassword123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

### Odświeżanie tokena
```typescript
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

## tRPC Endpoints

### Knowledge Graph Router

#### `knowledgeGraph.generate`
Generuje graf wiedzy z możliwością filtrowania i personalizacji.

**Input:**
```typescript
type KnowledgeGraphInput = {
  includeSupplements?: boolean;        // default: true
  includeNeurotransmitters?: boolean; // default: true
  includeBrainRegions?: boolean;      // default: true
  includeCognitiveFunctions?: boolean; // default: true
  maxNodes?: number;                  // default: 500, max: 1000
  evidenceLevels?: EvidenceLevel[];   // 'STRONG' | 'MODERATE' | 'WEAK'
  categories?: string[];              // Filtrowanie po kategoriach PL
  searchTerm?: string;                // Wyszukiwanie w PL/EN nazwach
  minImportance?: number;             // 0-1, default: 0
  layout?: 'force' | 'hierarchical' | 'circular';
  userId?: string;                    // Dla personalizacji
}
```

**Output:**
```typescript
type KnowledgeGraphOutput = {
  nodes: KnowledgeNode[];
  relationships: KnowledgeRelationship[];
  supplements: SupplementWithRelations[];
  metadata: {
    totalNodes: number;
    totalRelationships: number;
    generatedAt: string;
    layout: string;
    filters: KnowledgeGraphInput;
    processingTime: number;
  };
}
```

**Przykład użycia:**
```typescript
import { createTRPCReact } from '@trpc/react-query';

const trpc = createTRPCReact<AppRouter>();

function KnowledgeGraphComponent() {
  const { data: graphData, isLoading } = trpc.knowledgeGraph.generate.useQuery({
    includeSupplements: true,
    maxNodes: 200,
    evidenceLevels: ['STRONG', 'MODERATE'],
    searchTerm: 'omega-3',
    categories: ['Kwasy tłuszczowe'],
    layout: 'force'
  });

  if (isLoading) return <div>Generowanie grafu...</div>;

  return (
    <GraphVisualization
      nodes={graphData.nodes}
      relationships={graphData.relationships}
    />
  );
}
```

#### `knowledgeGraph.getNode`
Pobiera szczegółowe informacje o pojedynczym węźle wiedzy.

**Input:**
```typescript
type GetNodeInput = {
  id: string;
  includeRelationships?: boolean; // default: true
  includeResearch?: boolean;      // default: false
  depth?: number;                 // default: 1
}
```

**Output:**
```typescript
type GetNodeOutput = {
  node: KnowledgeNode;
  relationships: KnowledgeRelationship[];
  researchStudies?: ResearchStudy[];
  relatedNodes: KnowledgeNode[];
  path: KnowledgeNode[]; // Ścieżka do węzła głównego
}
```

**Przykład:**
```typescript
const { data: nodeData } = trpc.knowledgeGraph.getNode.useQuery({
  id: 'omega-3',
  includeRelationships: true,
  includeResearch: true,
  depth: 2
});

// nodeData zawiera:
// - Szczegóły suplementu omega-3
// - Wszystkie powiązania z neuroprzekaźnikami
// - Badania naukowe
// - Powiązane węzły w odległości 2 kroków
```

### Supplements Router

#### `supplements.list`
Pobiera paginowaną listę suplementów z zaawansowanym filtrowaniem.

**Input:**
```typescript
type SupplementsListInput = {
  category?: string;
  evidenceLevel?: EvidenceLevel;
  limit?: number;           // default: 50, max: 100
  offset?: number;          // default: 0
  search?: string;          // Wyszukiwanie w PL/EN
  sortBy?: 'name' | 'polishName' | 'importance' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  includeInactive?: boolean; // default: false
  tags?: string[];          // Filtrowanie po tagach
  activeCompounds?: string[]; // Filtrowanie po związkach aktywnych
}
```

**Output:**
```typescript
type SupplementsListOutput = {
  supplements: Supplement[];
  total: number;
  hasMore: boolean;
  categories: string[];     // Dostępne kategorie
  facets: {               // Dla zaawansowanego filtrowania
    evidenceLevels: Array<{level: EvidenceLevel, count: number}>;
    categories: Array<{category: string, count: number}>;
    tags: Array<{tag: string, count: number}>;
  };
}
```

**Przykład z zaawansowanym filtrowaniem:**
```typescript
const { data: supplements } = trpc.supplements.list.useQuery({
  search: 'kofeina',
  evidenceLevel: 'STRONG',
  category: 'Stymulanty',
  sortBy: 'importance',
  sortOrder: 'desc',
  limit: 20
});

// Response zawiera:
// - Lista suplementów pasujących do kryteriów
// - Facets dla dalszego filtrowania
// - Informacje o paginacji
```

#### `supplements.getById`
Pobiera kompletny profil suplementu z relacjami i badaniami.

**Input:**
```typescript
type GetSupplementInput = {
  id: string;
  includeRelationships?: boolean;
  includeResearch?: boolean;
  includeInteractions?: boolean;
  includeAlternatives?: boolean;
}
```

**Output:**
```typescript
type GetSupplementOutput = {
  supplement: SupplementWithRelations;
  relationships: KnowledgeRelationship[];
  researchStudies: ResearchStudy[];
  interactions: SupplementInteraction[];
  alternatives: Supplement[]; // Podobne suplementy
  safetyProfile: SafetyProfile;
}
```

**Przykład implementacji:**
```typescript
function SupplementDetailPage({ id }: { id: string }) {
  const { data: supplement, isLoading } = trpc.supplements.getById.useQuery({
    id,
    includeRelationships: true,
    includeResearch: true,
    includeInteractions: true,
    includeAlternatives: true
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="supplement-detail">
      <SupplementCard supplement={supplement.supplement} />
      <InteractionsMatrix interactions={supplement.interactions} />
      <ResearchStudies studies={supplement.researchStudies} />
      <AlternativesList alternatives={supplement.alternatives} />
    </div>
  );
}
```

#### `supplements.create` (Protected)
Tworzy nowy suplement w bazie danych.

**Input:**
```typescript
type CreateSupplementInput = {
  name: string;
  polishName: string;           // Wymagane
  scientificName?: string;
  polishCommonNames: string[];
  category: string;             // Kategoria po polsku
  subcategory?: string;
  description: string;
  polishDescription: string;    // Wymagane
  activeCompounds: ActiveCompound[];
  clinicalApplications: ClinicalApplication[];
  dosageGuidelines: DosageGuidelines;
  sideEffects: SideEffect[];
  contraindications: Contraindication[];
  interactions: SupplementInteraction[];
  tags: string[];
  evidenceLevel: EvidenceLevel;
  sources: ResearchSource[];
  metadata?: {
    createdBy?: string;
    version?: number;
    lastModified?: string;
  };
}
```

**Przykład tworzenia suplementu:**
```typescript
const createSupplement = trpc.supplements.create.useMutation();

await createSupplement.mutateAsync({
  name: 'Bacopa monnieri',
  polishName: 'Bakopa drobnolistna',
  scientificName: 'Bacopa monnieri (L.) Pennell',
  polishCommonNames: ['Brahmi', 'Bacopa'],
  category: 'Nootropiki',
  subcategory: 'Adaptogeny ziołowe',
  description: 'Perennial herb used in Ayurvedic medicine...',
  polishDescription: 'Wieloletnia roślina zielna stosowana w medycynie ajurwedyjskiej...',
  activeCompounds: [
    {
      name: 'Bacosides',
      polishName: 'Bakozydy',
      concentration: '55% bacosides A and B',
      mechanism: 'Modulation of neurotransmitter systems'
    }
  ],
  clinicalApplications: [
    {
      condition: 'Pamięć i funkcje poznawcze',
      evidenceLevel: 'MODERATE',
      dosage: '300-450mg ekstraktu standaryzowanego',
      duration: '4-6 tygodni dla widocznych efektów'
    }
  ],
  dosageGuidelines: {
    minimum: 100,
    maximum: 600,
    optimal: 300,
    unit: 'mg',
    frequency: 'raz dziennie',
    timing: 'rano z posiłkiem'
  },
  sideEffects: [
    {
      effect: 'Suchość w ustach',
      frequency: 'RARE',
      severity: 'MILD'
    }
  ],
  evidenceLevel: 'MODERATE',
  tags: ['nootropik', 'adaptogen', 'ajurweda', 'pamięć']
});
```

### Interactions Router

#### `interactions.analyze`
Analizuje interakcje między suplementami w czasie rzeczywistym.

**Input:**
```typescript
type AnalyzeInteractionsInput = {
  supplementIds: string[];
  userProfile?: {
    age?: number;
    weight?: number;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    conditions?: string[];
    currentMedications?: string[];
  };
  timeFrame?: 'acute' | 'chronic' | 'both'; // default: 'both'
}
```

**Output:**
```typescript
type AnalyzeInteractionsOutput = {
  interactions: SupplementInteraction[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendations: string[];
  warnings: string[];
  alternatives: Supplement[];
  analysis: {
    totalInteractions: number;
    synergistic: number;
    antagonistic: number;
    contraindicated: number;
    requiresMonitoring: number;
  };
}
```

**Przykład analizy interakcji:**
```typescript
const { data: analysis } = trpc.interactions.analyze.useQuery({
  supplementIds: ['kofeina', 'l-teanina', 'magnez'],
  userProfile: {
    age: 30,
    weight: 70,
    gender: 'MALE',
    conditions: ['nadciśnienie']
  }
});

// Wynik analizy:
// - SYNERGIA: Kofeina + L-teanina (łagodzenie efektów)
// - NEUTRALNE: Magnez + L-teanina
// - OSTROŻNOŚĆ: Kofeina przy nadciśnieniu
```

## REST API

### Graph Endpoints

#### `GET /api/v1/graph/generate`
Alternatywny endpoint REST dla generowania grafu.

**Query Parameters:**
```typescript
GET /api/v1/graph/generate?includeSupplements=true&maxNodes=200&evidenceLevels=STRONG&search=omega-3&categories=Kwasy tłuszczowe
```

**Response:**
```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "omega-3",
        "type": "SUPPLEMENT",
        "name": "Omega-3 Fatty Acids",
        "polishName": "Kwasy tłuszczowe Omega-3",
        "category": "Kwasy tłuszczowe",
        "importance": 0.95,
        "position": { "x": 100, "y": 200 },
        "color": "#3B82F6"
      }
    ],
    "relationships": [
      {
        "id": "rel-omega-dopamine",
        "sourceId": "omega-3",
        "targetId": "dopamine",
        "type": "ENHANCES",
        "strength": 0.7,
        "polishMechanism": "Poprawa płynności błon komórkowych neuronów dopaminergicznych"
      }
    ],
    "metadata": {
      "totalNodes": 150,
      "totalRelationships": 320,
      "generatedAt": "2024-01-15T10:30:00Z",
      "layout": "force",
      "filters": {
        "evidenceLevels": ["STRONG"],
        "searchTerm": "omega-3"
      }
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### `GET /api/v1/graph/export`
Eksportuje dane grafu w różnych formatach.

**Query Parameters:**
- `format`: json|csv|graphml|dot
- `includeMetadata`: boolean
- `polishOnly`: boolean
- `nodeTypes`: comma-separated list

**Przykład eksportu CSV:**
```typescript
const response = await fetch('/api/v1/graph/export?format=csv&polishOnly=true');
const csvData = await response.text();

// CSV zawiera kolumny:
// ID, Nazwa polska, Typ, Kategoria, Ważność, Opis
```

### Supplements CRUD

#### `GET /api/v1/supplements`
Lista suplementów z zaawansowaną paginacją i filtrowaniem.

**Query Parameters:**
```typescript
GET /api/v1/supplements?page=1&limit=50&category=Nootropiki&search=kofeina&sortBy=importance&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "supplements": [
      {
        "id": "kofeina",
        "name": "Caffeine",
        "polishName": "Kofeina",
        "scientificName": "1,3,7-trimethylxanthine",
        "category": "Stymulanty",
        "evidenceLevel": "STRONG",
        "importance": 0.9,
        "activeCompounds": [
          {
            "name": "Caffeine",
            "polishName": "Kofeina",
            "concentration": "99%",
            "mechanism": "Adenosine receptor antagonist"
          }
        ],
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1250,
      "totalPages": 25,
      "hasNext": true,
      "hasPrev": false
    },
    "facets": {
      "categories": [
        { "category": "Nootropiki", "count": 150 },
        { "category": "Adaptogeny", "count": 89 }
      ],
      "evidenceLevels": [
        { "level": "STRONG", "count": 450 },
        { "level": "MODERATE", "count": 600 }
      ]
    }
  }
}
```

#### `POST /api/v1/supplements` (Protected)
Tworzenie nowego suplementu.

**Body:**
```json
{
  "name": "Bacopa monnieri",
  "polishName": "Bakopa drobnolistna",
  "scientificName": "Bacopa monnieri (L.) Pennell",
  "polishCommonNames": ["Brahmi", "Bacopa"],
  "category": "Nootropiki",
  "subcategory": "Adaptogeny ziołowe",
  "description": "Perennial herb used in Ayurvedic medicine for cognitive enhancement",
  "polishDescription": "Wieloletnia roślina zielna stosowana w medycynie ajurwedyjskiej do poprawy funkcji poznawczych",
  "activeCompounds": [
    {
      "name": "Bacosides",
      "polishName": "Bakozydy",
      "concentration": "55% bacosides A and B",
      "mechanism": "Modulation of neurotransmitter systems and neuroprotection"
    }
  ],
  "clinicalApplications": [
    {
      "condition": "Pamięć i funkcje poznawcze",
      "polishCondition": "Pamięć i funkcje poznawcze",
      "evidenceLevel": "MODERATE",
      "dosage": "300-450mg ekstraktu standaryzowanego",
      "duration": "4-6 tygodni dla widocznych efektów",
      "outcomes": ["Poprawa pamięci", "Zmniejszenie lęku", "Neuroprotekcja"]
    }
  ],
  "dosageGuidelines": {
    "minimum": 100,
    "maximum": 600,
    "optimal": 300,
    "unit": "mg",
    "frequency": "raz dziennie",
    "timing": "rano z posiłkiem",
    "notes": "Zacząć od niższej dawki i stopniowo zwiększać"
  },
  "sideEffects": [
    {
      "effect": "Suchość w ustach",
      "polishEffect": "Suchość w ustach",
      "frequency": "RARE",
      "severity": "MILD"
    },
    {
      "effect": "Problemy żołądkowe",
      "polishEffect": "Problemy żołądkowe",
      "frequency": "OCCASIONAL",
      "severity": "MILD"
    }
  ],
  "contraindications": [
    {
      "condition": "Ciąża",
      "severity": "MODERATE",
      "reason": "Brak wystarczających badań bezpieczeństwa"
    }
  ],
  "evidenceLevel": "MODERATE",
  "tags": ["nootropik", "adaptogen", "ajurweda", "pamięć", "lęk"]
}
```

## WebSocket Events

### Connection i subskrypcje
```javascript
const ws = new WebSocket('wss://api.suplementor.pl/ws');

// Autoryzacja
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'AUTH',
    token: 'your-jwt-token'
  }));

  // Subskrypcja kanałów
  ws.send(JSON.stringify({
    type: 'SUBSCRIBE',
    channels: ['graph-updates', 'supplement-updates', 'research-updates']
  }));
};
```

### Event Types

#### `SUPPLEMENT_UPDATED`
```json
{
  "type": "SUPPLEMENT_UPDATED",
  "data": {
    "id": "omega-3",
    "changes": ["polishDescription", "researchStudies", "interactions"],
    "updatedAt": "2024-01-15T10:30:00Z",
    "updatedBy": "user-123",
    "version": 15
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
      "id": "study-456",
      "title": "Omega-3 supplementation and cognitive function",
      "polishTitle": "Suplementacja omega-3 a funkcje poznawcze",
      "journal": "Journal of Clinical Psychiatry",
      "year": 2024,
      "studyType": "META_ANALYSIS",
      "sampleSize": 1500,
      "evidenceLevel": "STRONG",
      "findings": "Significant improvement in memory and attention",
      "polishFindings": "Znacząca poprawa pamięci i uwagi",
      "pubmedId": "PMID: 12345678",
      "doi": "10.1000/jocp.2024.001"
    }
  }
}
```

#### `INTERACTION_DETECTED`
```json
{
  "type": "INTERACTION_DETECTED",
  "data": {
    "supplements": ["kofeina", "magnez"],
    "interactionType": "ANTAGONISTIC",
    "severity": "MODERATE",
    "mechanism": "Magnesium may reduce caffeine absorption",
    "polishMechanism": "Magnez może zmniejszać wchłanianie kofeiny",
    "confidence": 0.75,
    "sources": ["clinical-study-123", "pharmacology-review-456"]
  }
}
```

### Client-side event handling
```typescript
class SuplementorWebSocketClient {
  private ws: WebSocket;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.emit(message.type, message.data);
    };
  }

  public on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  public subscribe(channels: string[]) {
    this.send({
      type: 'SUBSCRIBE',
      channels
    });
  }

  private send(message: any) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}

// Użycie
const wsClient = new SuplementorWebSocketClient('wss://api.suplementor.pl/ws');

wsClient.on('SUPPLEMENT_UPDATED', (data) => {
  console.log('Suplement updated:', data);
  // Odśwież dane w UI
  refetchSupplementData(data.id);
});

wsClient.on('RESEARCH_STUDY_ADDED', (data) => {
  console.log('New research study:', data);
  // Pokaż notyfikację użytkownikowi
  showNotification('Nowe badanie naukowe dostępne!');
});
```

## Biblioteki klienckie

### Oficjalne SDK

#### TypeScript/JavaScript SDK
```bash
npm install @suplementor/api-client
```

```typescript
import { SuplementorAPI } from '@suplementor/api-client';

const api = new SuplementorAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.suplementor.pl',
  language: 'pl'
});

// Generowanie grafu wiedzy
const graph = await api.knowledgeGraph.generate({
  maxNodes: 200,
  searchTerm: 'omega-3',
  evidenceLevels: ['STRONG']
});

// Pobieranie suplementu
const supplement = await api.supplements.getById('omega-3');

// Analiza interakcji
const interactions = await api.interactions.analyze({
  supplementIds: ['kofeina', 'l-teanina']
});
```

#### Python SDK
```bash
pip install suplementor-api-client
```

```python
from suplementor_api import SuplementorAPI

api = SuplementorAPI(
    api_key='your-api-key',
    base_url='https://api.suplementor.pl',
    language='pl'
)

# Generowanie grafu
graph = api.knowledge_graph.generate(
    max_nodes=200,
    search_term='omega-3',
    evidence_levels=['STRONG']
)

# Pobieranie suplementów
supplements = api.supplements.list(
    category='Nootropiki',
    limit=50
)
```

#### PHP SDK
```bash
composer require suplementor/api-client
```

```php
<?php
use Suplementor\API\Client;

$api = new Client([
    'apiKey' => 'your-api-key',
    'baseUrl' => 'https://api.suplementor.pl',
    'language' => 'pl'
]);

// Generowanie grafu
$graph = $api->knowledgeGraph->generate([
    'maxNodes' => 200,
    'searchTerm' => 'omega-3'
]);

// Pobieranie suplementu
$supplement = $api->supplements->getById('omega-3');
```

## Przykłady integracji

### Next.js Integration
```typescript
// lib/suplementor-api.ts
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: '/api/trpc',
      headers() {
        return {
          authorization: `Bearer ${getAuthToken()}`,
        };
      },
    }),
  ],
});

// pages/suplement/[id].tsx
import { trpc } from '@/lib/suplementor-api';

export default function SupplementPage({ id }: { id: string }) {
  const { data: supplement, error, isLoading } = trpc.supplements.getById.useQuery({
    id,
    includeRelationships: true,
    includeResearch: true,
    includeInteractions: true
  });

  if (isLoading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd: {error.message}</div>;

  return (
    <div>
      <h1>{supplement.supplement.polishName}</h1>
      <SupplementDetail data={supplement} />
    </div>
  );
}
```

### React Hook dla grafu wiedzy
```typescript
// hooks/useKnowledgeGraph.ts
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';

export function useKnowledgeGraph(options: KnowledgeGraphInput) {
  const queryKey = ['knowledgeGraph', options];

  return useQuery({
    queryKey,
    queryFn: () => trpc.knowledgeGraph.generate.query(options),
    staleTime: 5 * 60 * 1000, // 5 minut
    cacheTime: 10 * 60 * 1000, // 10 minut
  });
}

// Użycie w komponencie
function KnowledgeGraphExplorer() {
  const { data: graphData, isLoading, error } = useKnowledgeGraph({
    maxNodes: 300,
    evidenceLevels: ['STRONG', 'MODERATE'],
    includeSupplements: true,
    includeNeurotransmitters: true,
    layout: 'force'
  });

  // Render grafu z danymi
}
```

### Real-time aktualizacje z WebSocket
```typescript
// hooks/useRealtimeUpdates.ts
import { useEffect, useState } from 'react';
import { SuplementorWebSocketClient } from '@/lib/websocket-client';

export function useRealtimeUpdates(channels: string[]) {
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    const wsClient = new SuplementorWebSocketClient('wss://api.suplementor.pl/ws');

    wsClient.on('SUPPLEMENT_UPDATED', (data) => {
      setUpdates(prev => [...prev, { type: 'supplement', data }]);
    });

    wsClient.on('RESEARCH_STUDY_ADDED', (data) => {
      setUpdates(prev => [...prev, { type: 'research', data }]);
    });

    wsClient.subscribe(channels);

    return () => {
      wsClient.disconnect();
    };
  }, [channels]);

  return updates;
}
```

## Rate limiting i quotas

### Limity dla różnych typów użytkowników:
- **Anonymous**: 100 zapytań/godzinę
- **Authenticated**: 1,000 zapytań/godzinę
- **Premium**: 10,000 zapytań/godzinę
- **API Key**: 50,000 zapytań/godzinę

### Headers informacyjne:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
X-RateLimit-Policy: authenticated-user
```

### Obsługa limitów w kodzie:
```typescript
const api = new SuplementorAPI({
  apiKey: 'your-api-key',
  onRateLimit: (retryAfter: number) => {
    console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
    // Implement exponential backoff
    setTimeout(() => {
      // Retry the request
    }, retryAfter * 1000);
  }
});
```

## Obsługa błędów

### Format odpowiedzi błędów:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Nieprawidłowe dane wejściowe",
    "polishMessage": "Nieprawidłowe dane wejściowe",
    "details": {
      "field": "polishName",
      "reason": "Pole jest wymagane",
      "providedValue": null
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req-123",
    "path": "/api/v1/supplements",
    "method": "POST"
  }
}
```

### Kody błędów:
- `VALIDATION_ERROR` - Błędne dane wejściowe
- `NOT_FOUND` - Zasób nie istnieje
- `UNAUTHORIZED` - Brak autoryzacji
- `FORBIDDEN` - Brak uprawnień
- `RATE_LIMIT_EXCEEDED` - Przekroczono limit zapytań
- `INTERNAL_ERROR` - Błąd serwera
- `DATABASE_ERROR` - Błąd bazy danych
- `EXTERNAL_API_ERROR` - Błąd zewnętrznego API

### Obsługa błędów w kliencie:
```typescript
try {
  const supplement = await api.supplements.getById('nonexistent-id');
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    console.log('Suplement nie istnieje');
  } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
    console.log('Przekroczono limit zapytań');
  } else {
    console.log('Inny błąd:', error.message);
  }
}
```

## Webhooks

### Konfiguracja webhooka:
```typescript
POST /api/v1/webhooks
{
  "url": "https://your-app.com/webhooks/suplementor",
  "events": ["supplement.updated", "research.added", "interaction.detected"],
  "secret": "your-webhook-secret",
  "active": true
}
```

### Przykład payload webhooka:
```json
{
  "event": "supplement.updated",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "omega-3",
    "changes": ["polishDescription", "researchStudies"],
    "webhookId": "wh-123"
  }
}
```

### Weryfikacja webhooka:
```typescript
const crypto = require('crypto');

function verifyWebhookSignature(payload: string, signature: string, secret: string) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return signature === `sha256=${expectedSignature}`;
}
```

## SDK Examples

### Kompletny przykład Next.js aplikacji:
```typescript
// pages/api/trpc/[trpc].ts
import { createNextApiHandler } from '@trpc/next';
import { appRouter } from '@/server/routers/_app';

export default createNextApiHandler({
  router: appRouter,
  createContext: ({ req, res }) => ({
    req,
    res,
    user: req.headers.authorization ? verifyToken(req.headers.authorization) : null
  }),
});

// lib/api-client.ts
export class SuplementorClient {
  private baseURL: string;
  private token?: string;

  constructor(baseURL: string, token?: string) {
    this.baseURL = baseURL;
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      'Accept-Language': 'pl-PL',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getSupplements(params: SupplementsListInput) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request<SupplementsListOutput>(`/api/v1/supplements?${queryString}`);
  }

  async getSupplement(id: string) {
    return this.request<GetSupplementOutput>(`/api/v1/supplements/${id}`);
  }

  async analyzeInteractions(supplementIds: string[], userProfile?: UserProfile) {
    return this.request<AnalyzeInteractionsOutput>('/api/v1/interactions/analyze', {
      method: 'POST',
      body: JSON.stringify({ supplementIds, userProfile }),
    });
  }
}

// Użycie w komponencie
function SupplementsPage() {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = new SuplementorClient('/api');

    client.getSupplements({
      category: 'Nootropiki',
      limit: 20,
      sortBy: 'importance'
    }).then(data => {
      setSupplements(data.supplements);
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching supplements:', error);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Ładowanie suplementów...</div>;

  return (
    <div className="supplements-grid">
      {supplements.map(supplement => (
        <SupplementCard key={supplement.id} supplement={supplement} />
      ))}
    </div>
  );
}
```

## Testing

### Testowanie jednostkowe:
```typescript
// __tests__/api-client.test.ts
import { SuplementorAPI } from '@/lib/api-client';

describe('SuplementorAPI', () => {
  let api: SuplementorAPI;

  beforeEach(() => {
    api = new SuplementorAPI({
      apiKey: 'test-key',
      baseURL: 'http://localhost:3000'
    });
  });

  it('should fetch supplements list', async () => {
    const mockResponse = {
      supplements: [
        {
          id: 'test-supplement',
          name: 'Test Supplement',
          polishName: 'Testowy Suplement'
        }
      ],
      total: 1,
      hasMore: false
    };

    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await api.supplements.list({ limit: 10 });

    expect(result.supplements).toHaveLength(1);
    expect(result.supplements[0].polishName).toBe('Testowy Suplement');
  });
});
```

### Testowanie integracyjne:
```typescript
// __tests__/integration/supplements.test.ts
describe('Supplements API Integration', () => {
  it('should create and retrieve supplement', async () => {
    const newSupplement = {
      name: 'Test Supplement',
      polishName: 'Testowy Suplement',
      category: 'Testowa Kategoria',
      // ... inne wymagane pola
    };

    // Test tworzenia
    const created = await api.supplements.create(newSupplement);
    expect(created.id).toBeDefined();

    // Test pobierania
    const retrieved = await api.supplements.getById(created.id);
    expect(retrieved.supplement.polishName).toBe('Testowy Suplement');

    // Cleanup
    await api.supplements.delete(created.id);
  });
});
```

---

*Dokumentacja będzie regularnie aktualizowana. Ostatnia aktualizacja: październik 2025*