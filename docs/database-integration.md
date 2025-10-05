# Integracja Bazy Danych - Graf Wiedzy o Suplementach

## Przegląd Architektury

System grafu wiedzy o suplementach wykorzystuje MongoDB jako główną bazę danych z tRPC do komunikacji API i React Query do zarządzania cache'em. Wszystkie dane są przechowywane z pełną obsługą polskich nazw i opisów.

## Struktura Bazy Danych

### Kolekcje MongoDB

#### 1. `supplements` - Suplementy
```typescript
interface SupplementDocument {
  _id: ObjectId;
  id: string; // UUID
  name: string; // Nazwa angielska
  polishName: string; // Nazwa polska (wymagana)
  scientificName?: string;
  polishCommonNames: string[]; // Polskie nazwy potoczne
  category: string; // Kategoria po polsku
  description: string;
  polishDescription: string; // Opis polski (wymagany)
  
  // Składniki aktywne
  activeCompounds: {
    name: string;
    polishName: string;
    concentration: string;
    mechanism: string;
    polishMechanism: string;
  }[];
  
  // Zastosowania kliniczne
  clinicalApplications: {
    condition: string;
    polishCondition: string;
    effectivenessRating: number; // 1-10
    evidenceLevel: 'STRONG' | 'MODERATE' | 'WEAK' | 'INSUFFICIENT';
    mechanism: string;
    polishMechanism: string;
    recommendedDosage: string;
    duration: string;
  }[];
  
  // Wytyczne dawkowania
  dosageGuidelines: {
    therapeuticRange: {
      min: number;
      max: number;
      unit: string;
    };
    timing: string[];
    withFood: boolean;
    contraindications: string[];
  };
  
  // Efekty uboczne
  sideEffects: {
    effect: string;
    polishEffect: string;
    frequency: string;
    severity: 'mild' | 'moderate' | 'severe';
  }[];
  
  // Badania naukowe
  researchStudies: {
    id: string;
    title: string;
    polishTitle: string;
    journal: string;
    year: number;
    studyType: 'RCT' | 'META_ANALYSIS' | 'OBSERVATIONAL' | 'CASE_STUDY';
    sampleSize: number;
    evidenceLevel: 'STRONG' | 'MODERATE' | 'WEAK';
    findings: string;
    polishFindings: string;
    pubmedId?: string;
  }[];
  
  // Metadane
  createdAt: Date;
  updatedAt: Date;
  version: number;
  tags: string[];
  isActive: boolean;
}
```

#### 2. `neurotransmitters` - Neuroprzekaźniki
```typescript
interface NeurotransmitterDocument {
  _id: ObjectId;
  id: string;
  name: string;
  polishName: string; // np. "Dopamina", "Serotonina"
  type: 'MONOAMINE' | 'AMINO_ACID' | 'PEPTIDE' | 'GASEOUS';
  description: string;
  polishDescription: string;
  
  // Funkcje biologiczne
  functions: {
    function: string;
    polishFunction: string;
    brainRegions: string[]; // ID regionów mózgu
    importance: number; // 0-1
  }[];
  
  // Receptory
  receptors: {
    name: string;
    polishName: string;
    type: string;
    location: string[];
    function: string;
    polishFunction: string;
  }[];
  
  // Szlaki metaboliczne
  metabolicPathways: {
    pathway: string;
    polishPathway: string;
    enzymes: string[];
    products: string[];
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}
```

#### 3. `brain_regions` - Regiony Mózgu
```typescript
interface BrainRegionDocument {
  _id: ObjectId;
  id: string;
  name: string;
  polishName: string; // np. "Hipokamp", "Kora przedczołowa"
  anatomicalCategory: string;
  polishAnatomicalCategory: string;
  description: string;
  polishDescription: string;
  
  // Funkcje poznawcze
  cognitiveFunctions: {
    function: string;
    polishFunction: string;
    importance: number;
    description: string;
    polishDescription: string;
  }[];
  
  // Połączenia anatomiczne
  connections: {
    targetRegionId: string;
    connectionType: 'AFFERENT' | 'EFFERENT' | 'BIDIRECTIONAL';
    strength: number;
    neurotransmitters: string[]; // ID neuroprzekaźników
  }[];
  
  // Współrzędne 3D (dla wizualizacji)
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  
  volume: number; // mm³
  createdAt: Date;
  updatedAt: Date;
}
```

#### 4. `relationships` - Relacje między Elementami
```typescript
interface RelationshipDocument {
  _id: ObjectId;
  id: string;
  sourceId: string; // ID źródłowego elementu
  targetId: string; // ID docelowego elementu
  sourceType: 'SUPPLEMENT' | 'NEUROTRANSMITTER' | 'BRAIN_REGION' | 'COGNITIVE_FUNCTION';
  targetType: 'SUPPLEMENT' | 'NEUROTRANSMITTER' | 'BRAIN_REGION' | 'COGNITIVE_FUNCTION';
  
  // Typ relacji
  type: 'ENHANCES' | 'INHIBITS' | 'MODULATES' | 'SYNERGIZES' | 'ANTAGONIZES';
  
  // Siła i pewność
  strength: number; // 0-1
  confidence: number; // 0-1
  
  // Mechanizm działania
  mechanism: string;
  polishMechanism: string; // Wymagany polski opis
  
  // Poziom dowodów
  evidenceLevel: 'STRONG' | 'MODERATE' | 'WEAK' | 'INSUFFICIENT' | 'CONFLICTING';
  
  // Źródła
  sources: {
    type: 'STUDY' | 'REVIEW' | 'META_ANALYSIS';
    id: string;
    title: string;
    polishTitle?: string;
    year: number;
    journal: string;
    doi?: string;
    pubmedId?: string;
  }[];
  
  // Warunki
  conditions: {
    dosageRange?: {
      min: number;
      max: number;
      unit: string;
    };
    timing?: string[];
    duration?: string;
    population?: string;
    polishPopulation?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

#### 5. `cognitive_functions` - Funkcje Poznawcze
```typescript
interface CognitiveFunctionDocument {
  _id: ObjectId;
  id: string;
  name: string;
  polishName: string; // np. "Pamięć", "Uwaga", "Funkcje wykonawcze"
  category: string;
  polishCategory: string;
  description: string;
  polishDescription: string;
  
  // Subkomponenty
  subcomponents: {
    name: string;
    polishName: string;
    description: string;
    polishDescription: string;
    brainRegions: string[]; // ID regionów mózgu
  }[];
  
  // Testy neuropsychologiczne
  assessmentTests: {
    name: string;
    polishName: string;
    description: string;
    polishDescription: string;
    measuredAspects: string[];
    polishMeasuredAspects: string[];
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}
```

## Przepływ Danych: MongoDB → Graf

### 1. Pobieranie Danych (tRPC Endpoints)

```typescript
// src/server/api/routers/knowledge-graph.ts
export const knowledgeGraphRouter = createTRPCRouter({
  // Pobieranie pełnego grafu
  generate: publicProcedure
    .input(z.object({
      includeSupplements: z.boolean().default(true),
      includeNeurotransmitters: z.boolean().default(true),
      includeBrainRegions: z.boolean().default(true),
      includeCognitiveFunctions: z.boolean().default(true),
      maxNodes: z.number().default(500),
      evidenceLevels: z.array(z.enum(['STRONG', 'MODERATE', 'WEAK'])).default(['STRONG', 'MODERATE']),
      categories: z.array(z.string()).optional(),
      searchTerm: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const { db } = ctx;
      
      // Pobierz suplementy z polskimi nazwami
      const supplements = await db.collection('supplements')
        .find({
          isActive: true,
          ...(input.categories && { category: { $in: input.categories } }),
          ...(input.searchTerm && {
            $or: [
              { name: { $regex: input.searchTerm, $options: 'i' } },
              { polishName: { $regex: input.searchTerm, $options: 'i' } },
              { polishDescription: { $regex: input.searchTerm, $options: 'i' } }
            ]
          })
        })
        .limit(input.maxNodes)
        .toArray();
      
      // Pobierz neuroprzekaźniki
      const neurotransmitters = input.includeNeurotransmitters 
        ? await db.collection('neurotransmitters').find({}).toArray()
        : [];
      
      // Pobierz regiony mózgu
      const brainRegions = input.includeBrainRegions
        ? await db.collection('brain_regions').find({}).toArray()
        : [];
      
      // Pobierz funkcje poznawcze
      const cognitiveFunctions = input.includeCognitiveFunctions
        ? await db.collection('cognitive_functions').find({}).toArray()
        : [];
      
      // Pobierz relacje między elementami
      const allIds = [
        ...supplements.map(s => s.id),
        ...neurotransmitters.map(n => n.id),
        ...brainRegions.map(b => b.id),
        ...cognitiveFunctions.map(c => c.id)
      ];
      
      const relationships = await db.collection('relationships')
        .find({
          isActive: true,
          evidenceLevel: { $in: input.evidenceLevels },
          sourceId: { $in: allIds },
          targetId: { $in: allIds }
        })
        .toArray();
      
      // Konwertuj do formatu grafu
      return transformToGraphFormat({
        supplements,
        neurotransmitters,
        brainRegions,
        cognitiveFunctions,
        relationships
      });
    }),
    
  // Aktualizacja pojedynczego węzła
  updateNode: protectedProcedure
    .input(z.object({
      id: z.string(),
      type: z.enum(['SUPPLEMENT', 'NEUROTRANSMITTER', 'BRAIN_REGION', 'COGNITIVE_FUNCTION']),
      data: z.record(z.any())
    }))
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      const collection = getCollectionForType(input.type);
      
      const result = await db.collection(collection)
        .updateOne(
          { id: input.id },
          { 
            $set: { 
              ...input.data, 
              updatedAt: new Date(),
              version: { $inc: 1 }
            } 
          }
        );
      
      // Invalidate cache
      await ctx.revalidateTag(`graph-${input.type.toLowerCase()}`);
      
      return result;
    }),
    
  // Dodawanie nowej relacji
  addRelationship: protectedProcedure
    .input(z.object({
      sourceId: z.string(),
      targetId: z.string(),
      type: z.enum(['ENHANCES', 'INHIBITS', 'MODULATES', 'SYNERGIZES', 'ANTAGONIZES']),
      strength: z.number().min(0).max(1),
      confidence: z.number().min(0).max(1),
      mechanism: z.string(),
      polishMechanism: z.string(),
      evidenceLevel: z.enum(['STRONG', 'MODERATE', 'WEAK', 'INSUFFICIENT']),
      sources: z.array(z.object({
        type: z.enum(['STUDY', 'REVIEW', 'META_ANALYSIS']),
        title: z.string(),
        polishTitle: z.string().optional(),
        year: z.number(),
        journal: z.string(),
        doi: z.string().optional(),
        pubmedId: z.string().optional()
      }))
    }))
    .mutation(async ({ input, ctx }) => {
      const { db } = ctx;
      
      const relationship = {
        id: generateUUID(),
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
      
      await db.collection('relationships').insertOne(relationship);
      
      // Invalidate graph cache
      await ctx.revalidateTag('graph-relationships');
      
      return relationship;
    })
});
```

### 2. Transformacja Danych

```typescript
// src/lib/services/graph-data-transformer.ts
export function transformToGraphFormat(data: DatabaseCollections): GraphData {
  const nodes: KnowledgeNode[] = [];
  const relationships: KnowledgeRelationship[] = [];
  
  // Transformuj suplementy
  data.supplements.forEach(supplement => {
    nodes.push({
      id: supplement.id,
      name: supplement.name,
      polishName: supplement.polishName,
      type: 'SUPPLEMENT',
      description: supplement.description,
      polishDescription: supplement.polishDescription,
      category: supplement.category,
      evidenceLevel: calculateOverallEvidenceLevel(supplement.researchStudies),
      size: calculateNodeSize(supplement),
      importance: calculateImportance(supplement),
      x: 0, // Będzie obliczone przez algorytm układu
      y: 0
    });
  });
  
  // Transformuj neuroprzekaźniki
  data.neurotransmitters.forEach(neurotransmitter => {
    nodes.push({
      id: neurotransmitter.id,
      name: neurotransmitter.name,
      polishName: neurotransmitter.polishName,
      type: 'NEUROTRANSMITTER',
      description: neurotransmitter.description,
      polishDescription: neurotransmitter.polishDescription,
      category: neurotransmitter.type,
      evidenceLevel: 'STRONG', // Neuroprzekaźniki mają silne podstawy naukowe
      size: 10,
      importance: calculateNeurotransmitterImportance(neurotransmitter),
      x: 0,
      y: 0
    });
  });
  
  // Transformuj regiony mózgu
  data.brainRegions.forEach(region => {
    nodes.push({
      id: region.id,
      name: region.name,
      polishName: region.polishName,
      type: 'BRAIN_REGION',
      description: region.description,
      polishDescription: region.polishDescription,
      category: region.polishAnatomicalCategory,
      evidenceLevel: 'STRONG',
      size: Math.log(region.volume) * 2, // Rozmiar bazowany na objętości
      importance: calculateRegionImportance(region),
      x: region.coordinates.x,
      y: region.coordinates.y
    });
  });
  
  // Transformuj funkcje poznawcze
  data.cognitiveFunctions.forEach(func => {
    nodes.push({
      id: func.id,
      name: func.name,
      polishName: func.polishName,
      type: 'COGNITIVE_FUNCTION',
      description: func.description,
      polishDescription: func.polishDescription,
      category: func.polishCategory,
      evidenceLevel: 'MODERATE',
      size: 8,
      importance: calculateFunctionImportance(func),
      x: 0,
      y: 0
    });
  });
  
  // Transformuj relacje
  data.relationships.forEach(rel => {
    relationships.push({
      id: rel.id,
      sourceId: rel.sourceId,
      targetId: rel.targetId,
      type: rel.type,
      strength: rel.strength,
      confidence: rel.confidence,
      mechanism: rel.mechanism,
      polishMechanism: rel.polishMechanism,
      evidenceLevel: rel.evidenceLevel
    });
  });
  
  return { nodes, relationships };
}
```

### 3. Cache'owanie z React Query

```typescript
// src/hooks/useGraphData.ts
export function useGraphData(options: GraphDataOptions = {}) {
  const {
    includeSupplements = true,
    includeNeurotransmitters = true,
    includeBrainRegions = true,
    includeCognitiveFunctions = true,
    maxNodes = 500,
    evidenceLevels = ['STRONG', 'MODERATE'],
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000 // 5 minut
  } = options;
  
  const queryKey = [
    'knowledge-graph',
    {
      includeSupplements,
      includeNeurotransmitters,
      includeBrainRegions,
      includeCognitiveFunctions,
      maxNodes,
      evidenceLevels
    }
  ];
  
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching
  } = api.knowledgeGraph.generate.useQuery(
    {
      includeSupplements,
      includeNeurotransmitters,
      includeBrainRegions,
      includeCognitiveFunctions,
      maxNodes,
      evidenceLevels
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minut
      cacheTime: 30 * 60 * 1000, // 30 minut
      refetchInterval: autoRefresh ? refreshInterval : false,
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error) => {
        console.error('Błąd ładowania danych grafu:', error);
        // Opcjonalnie: wyślij do systemu monitorowania błędów
      }
    }
  );
  
  // Memoizowane dane z fallback
  const processedData = useMemo(() => {
    if (!data) {
      return {
        nodes: [],
        relationships: [],
        supplements: []
      };
    }
    
    return {
      nodes: data.nodes || [],
      relationships: data.relationships || [],
      supplements: data.supplements || []
    };
  }, [data]);
  
  return {
    ...processedData,
    isLoading,
    error,
    refetch,
    isRefetching,
    queryKey
  };
}
```

## Aktualizacje Real-time

### WebSocket Integration

```typescript
// src/lib/services/realtime-graph-service.ts
export class RealtimeGraphService {
  private ws: WebSocket | null = null;
  private subscribers: Map<string, (data: any) => void> = new Map();
  
  connect() {
    this.ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'SUPPLEMENT_UPDATED':
          this.notifySubscribers('supplement-update', message.data);
          break;
        case 'RELATIONSHIP_ADDED':
          this.notifySubscribers('relationship-add', message.data);
          break;
        case 'RESEARCH_STUDY_ADDED':
          this.notifySubscribers('research-update', message.data);
          break;
      }
    };
  }
  
  subscribe(event: string, callback: (data: any) => void) {
    this.subscribers.set(event, callback);
  }
  
  private notifySubscribers(event: string, data: any) {
    const callback = this.subscribers.get(event);
    if (callback) {
      callback(data);
    }
  }
}
```

## Strategia Cache'owania

### 1. Poziomy Cache'u

1. **Browser Cache** (React Query)
   - Czas życia: 30 minut
   - Automatyczne odświeżanie: 10 minut
   - Invalidacja: przy aktualizacjach danych

2. **CDN Cache** (Vercel/CloudFlare)
   - Czas życia: 1 godzina
   - Invalidacja: przy deploy'mencie

3. **Database Cache** (MongoDB)
   - Indeksy na często używanych polach
   - Agregacje z cache'owaniem

### 2. Invalidacja Cache'u

```typescript
// src/lib/services/cache-invalidation.ts
export class CacheInvalidationService {
  static async invalidateGraphCache(
    type: 'supplement' | 'neurotransmitter' | 'relationship' | 'all',
    id?: string
  ) {
    const queryClient = getQueryClient();
    
    switch (type) {
      case 'supplement':
        await queryClient.invalidateQueries(['knowledge-graph']);
        await queryClient.invalidateQueries(['supplement', id]);
        break;
      case 'relationship':
        await queryClient.invalidateQueries(['knowledge-graph']);
        await queryClient.invalidateQueries(['relationships']);
        break;
      case 'all':
        await queryClient.invalidateQueries(['knowledge-graph']);
        break;
    }
    
    // Wyślij notyfikację WebSocket
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('graph-cache-invalidated', {
        detail: { type, id }
      }));
    }
  }
}
```

## Obsługa Błędów

### 1. Strategie Retry

```typescript
// src/lib/services/error-handling.ts
export const graphErrorHandling = {
  retry: {
    attempts: 3,
    delay: (attempt: number) => Math.min(1000 * 2 ** attempt, 10000),
    condition: (error: any) => {
      // Retry tylko dla błędów sieciowych i 5xx
      return error.status >= 500 || error.code === 'NETWORK_ERROR';
    }
  },
  
  fallback: {
    // Dane fallback dla krytycznych komponentów
    nodes: [],
    relationships: [],
    supplements: []
  },
  
  logging: {
    level: 'error',
    service: 'graph-data',
    includeStack: true,
    includeUserAgent: true
  }
};
```

### 2. Monitoring Wydajności

```typescript
// src/lib/services/performance-monitoring.ts
export class GraphPerformanceMonitor {
  static trackQuery(queryName: string, duration: number, nodeCount: number) {
    // Wyślij metryki do systemu monitorowania
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'graph_query_performance', {
        query_name: queryName,
        duration_ms: duration,
        node_count: nodeCount,
        custom_parameter: 'graph_performance'
      });
    }
    
    // Log do konsoli w development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Graf Query: ${queryName}`, {
        duration: `${duration}ms`,
        nodes: nodeCount,
        performance: duration > 1000 ? 'slow' : 'fast'
      });
    }
  }
  
  static trackError(error: Error, context: string) {
    console.error(`Graf Error [${context}]:`, error);
    
    // Wyślij do systemu monitorowania błędów
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        tags: {
          component: 'knowledge-graph',
          context
        }
      });
    }
  }
}
```

## Najlepsze Praktyki

### 1. Optymalizacja Zapytań MongoDB

- Używaj indeksów na polach `id`, `isActive`, `category`
- Ogranicz liczbę zwracanych dokumentów
- Używaj projekcji do ograniczenia pól
- Implementuj paginację dla dużych zbiorów

### 2. Zarządzanie Pamięcią

- Regularnie czyść nieużywane cache'e
- Monitoruj zużycie pamięci w React Query
- Używaj lazy loading dla dużych grafów

### 3. Bezpieczeństwo

- Waliduj wszystkie dane wejściowe
- Używaj rate limiting dla API
- Implementuj autoryzację dla operacji zapisu
- Szyfruj wrażliwe dane w bazie

### 4. Skalowanie

- Używaj sharding MongoDB dla dużych zbiorów
- Implementuj read replicas
- Rozważ CDN dla statycznych danych
- Monitoruj wydajność zapytań
