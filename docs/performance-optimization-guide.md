# Optymalizacja wydajności i rozwiązywanie problemów - Suplementor

## Spis treści
1. [Optymalizacja po stronie klienta](#optymalizacja-po-stronie-klienta)
2. [Optymalizacja po stronie serwera](#optymalizacja-po-stronie-serwera)
3. [Optymalizacja bazy danych](#optymalizacja-bazy-danych)
4. [Monitorowanie wydajności](#monitorowanie-wydajności)
5. [Rozwiązywanie problemów wydajnościowych](#rozwiązywanie-problemów-wydajnościowych)
6. [Skalowalność systemu](#skalowalność-systemu)

## Optymalizacja po stronie klienta

### 1. Optymalizacja JavaScript i React

#### Code Splitting:
```typescript
// Dynamic imports dla komponentów
const KnowledgeGraph = lazy(() => import('./components/KnowledgeGraph'));
const SupplementDetail = lazy(() => import('./components/SupplementDetail'));

// Route-based code splitting
const routes = [
  {
    path: '/graf-wiedzy',
    component: lazy(() => import('./pages/KnowledgeGraphPage'))
  },
  {
    path: '/suplementy/:id',
    component: lazy(() => import('./pages/SupplementDetailPage'))
  }
];
```

#### Memoizacja komponentów:
```typescript
// React.memo dla komponentów bez stanu
const SupplementCard = memo(({ supplement }: { supplement: Supplement }) => {
  return (
    <div className="supplement-card">
      <h3>{supplement.polishName}</h3>
      <p>{supplement.category}</p>
    </div>
  );
});

// useMemo dla drogich obliczeń
const filteredSupplements = useMemo(() => {
  return supplements.filter(s => s.evidenceLevel === 'STRONG');
}, [supplements]);

// useCallback dla funkcji
const handleSupplementClick = useCallback((id: string) => {
  navigate(`/suplementy/${id}`);
}, [navigate]);
```

---

### 2. Optymalizacja grafu wiedzy

#### Poziomy szczegółowości (LOD):
```typescript
interface GraphLOD {
  level: 'low' | 'medium' | 'high';
  maxNodes: number;
  renderMode: 'canvas' | 'svg' | 'webgl';
  physicsEnabled: boolean;
  labelsVisible: boolean;
}

// Automatyczne dostosowanie LOD
const getOptimalLOD = (viewportSize: number, nodeCount: number): GraphLOD => {
  if (nodeCount > 1000) {
    return {
      level: 'low',
      maxNodes: 500,
      renderMode: 'webgl',
      physicsEnabled: false,
      labelsVisible: false
    };
  } else if (nodeCount > 500) {
    return {
      level: 'medium',
      maxNodes: 1000,
      renderMode: 'canvas',
      physicsEnabled: true,
      labelsVisible: true
    };
  } else {
    return {
      level: 'high',
      maxNodes: nodeCount,
      renderMode: 'svg',
      physicsEnabled: true,
      labelsVisible: true
    };
  }
};
```

#### Buforowanie obliczeń:
```typescript
// Cache dla układów grafu
const graphLayoutCache = new Map<string, GraphLayout>();

const getCachedLayout = (nodes: KnowledgeNode[], layoutType: string): GraphLayout => {
  const cacheKey = `${nodes.length}_${layoutType}_${hash(nodes)}`;

  if (graphLayoutCache.has(cacheKey)) {
    return graphLayoutCache.get(cacheKey)!;
  }

  const layout = calculateLayout(nodes, layoutType);
  graphLayoutCache.set(cacheKey, layout);

  return layout;
};
```

---

### 3. Optymalizacja obrazów i zasobów

#### Lazy loading obrazów:
```typescript
// Intersection Observer dla obrazów
const ImageComponent = ({ src, alt }: { src: string; alt: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : placeholder}
      alt={alt}
      loading="lazy"
    />
  );
};
```

#### Optymalizacja WebGL:
```typescript
// Buforowanie geometrii
class GeometryCache {
  private cache = new Map<string, BufferGeometry>();

  getGeometry(type: string, params: any): BufferGeometry {
    const key = `${type}_${JSON.stringify(params)}`;

    if (!this.cache.has(key)) {
      const geometry = this.createGeometry(type, params);
      this.cache.set(key, geometry);
    }

    return this.cache.get(key)!;
  }

  private createGeometry(type: string, params: any): BufferGeometry {
    switch (type) {
      case 'brain':
        return new BrainGeometry(params);
      case 'molecule':
        return new MoleculeGeometry(params);
      default:
        return new SphereGeometry();
    }
  }
}
```

---

## Optymalizacja po stronie serwera

### 1. Optymalizacja API

#### Buforowanie odpowiedzi:
```typescript
// Redis cache dla API responses
const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const cacheKey = `${req.method}_${req.originalUrl}`;

  // Sprawdź cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Przechwyć odpowiedź
  const originalJson = res.json;
  res.json = function(body: any) {
    redis.setex(cacheKey, 300, JSON.stringify(body)); // 5 minut cache
    return originalJson.call(this, body);
  };

  next();
};
```

#### Kompresja odpowiedzi:
```typescript
// Gzip kompresja
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

---

### 2. Optymalizacja zapytań do bazy danych

#### Indeksy MongoDB:
```javascript
// Indeksy dla suplementów
db.supplements.createIndex({ "name": 1, "polishName": 1 });
db.supplements.createIndex({ "category": 1, "evidenceLevel": 1 });
db.supplements.createIndex({ "activeCompounds.name": 1 });
db.supplements.createIndex({ "tags": 1 });

// Indeksy złożone dla wyszukiwania
db.supplements.createIndex({
  "polishName": "text",
  "description": "text",
  "scientificName": "text"
});

// Indeksy dla grafu wiedzy
db.knowledgeNodes.createIndex({ "type": 1, "importance": -1 });
db.knowledgeRelationships.createIndex({ "sourceId": 1, "targetId": 1 });
```

#### Agregacja zapytań:
```typescript
// Efektywne pobieranie suplementów z relacjami
const getSupplementsWithRelations = async (category?: string) => {
  const pipeline = [
    // Match kategorii jeśli podana
    ...(category ? [{ $match: { category } }] : []),

    // Lookup relacji
    {
      $lookup: {
        from: "knowledgeRelationships",
        localField: "id",
        foreignField: "sourceId",
        as: "outgoingRelationships"
      }
    },
    {
      $lookup: {
        from: "knowledgeRelationships",
        localField: "id",
        foreignField: "targetId",
        as: "incomingRelationships"
      }
    },

    // Lookup badań
    {
      $lookup: {
        from: "researchStudies",
        localField: "id",
        foreignField: "supplementId",
        as: "researchStudies"
      }
    },

    // Sortowanie i limit
    { $sort: { importance: -1 } },
    { $limit: 50 }
  ];

  return await db.supplements.aggregate(pipeline);
};
```

---

## Optymalizacja bazy danych

### 1. Struktura kolekcji MongoDB

#### Kolekcja suplementów:
```javascript
{
  _id: ObjectId,
  id: "omega-3", // String ID dla aplikacji
  name: "Omega-3 Fatty Acids",
  polishName: "Kwasy tłuszczowe Omega-3",
  scientificName: "Omega-3 polyunsaturated fatty acids",
  category: "Kwasy tłuszczowe",
  subcategory: "Niezbędne kwasy tłuszczowe",

  // Dane podstawowe
  description: "...",
  polishDescription: "...",
  evidenceLevel: "STRONG",
  importance: 0.95,

  // Związki aktywne
  activeCompounds: [
    {
      name: "EPA",
      polishName: "Kwas eikozapentaenowy",
      concentration: "EPA:DHA 1.5:1",
      mechanism: "Modulation of inflammation pathways"
    }
  ],

  // Zastosowania kliniczne
  clinicalApplications: [
    {
      condition: "Choroby sercowo-naczyniowe",
      evidenceLevel: "STRONG",
      dosage: "1000mg EPA+DHA dziennie",
      outcomes: ["Redukcja ryzyka zawału", "Obniżenie triglicerydów"]
    }
  ],

  // Wytyczne dawkowania
  dosageGuidelines: {
    minimum: 250,
    maximum: 4000,
    optimal: 1000,
    unit: "mg",
    frequency: "raz dziennie",
    timing: "z posiłkiem"
  },

  // Metadata
  createdAt: ISODate,
  updatedAt: ISODate,
  version: 1,
  createdBy: "user-id",

  // Indeksy wyszukiwania
  searchText: "omega-3 kwasy tłuszczowe omega-3 fatty acids"
}
```

#### Kolekcja relacji wiedzy:
```javascript
{
  _id: ObjectId,
  id: "rel-omega-dopamine",
  sourceId: "omega-3",
  targetId: "dopamine",
  type: "ENHANCES",
  strength: 0.7,
  confidence: 0.85,

  // Opis mechanizmu
  mechanism: "Omega-3 fatty acids improve membrane fluidity in dopaminergic neurons",
  polishMechanism: "Kwasy omega-3 poprawiają płynność błon komórkowych neuronów dopaminergicznych",

  // Dowody
  evidenceLevel: "MODERATE",
  sources: [
    {
      type: "RESEARCH_STUDY",
      id: "study-123",
      title: "Omega-3 and neurotransmitter function",
      year: 2020,
      doi: "10.1000/j.neurosci.2020.01.001"
    }
  ],

  // Warunki relacji
  conditions: {
    dosage: ">1000mg dziennie",
    duration: ">4 tygodnie",
    population: "dorośli"
  }
}
```

---

### 2. Optymalizacja zapytań

#### Query optimization:
```typescript
// Nieoptymalne zapytanie
const supplements = await db.supplements.find({
  $or: [
    { name: new RegExp(searchTerm, 'i') },
    { polishName: new RegExp(searchTerm, 'i') },
    { description: new RegExp(searchTerm, 'i') }
  ]
});

// Optymalne zapytanie z indeksem tekstowym
const supplements = await db.supplements.find({
  $text: { $search: searchTerm }
}, {
  score: { $meta: "textScore" }
}).sort({
  score: { $meta: "textScore" }
});
```

#### Agregacja dla dashboardu:
```typescript
// Efektywne pobieranie danych dashboardu
const getDashboardData = async (userId: string) => {
  const pipeline = [
    // Podstawowe informacje użytkownika
    {
      $match: { userId: userId }
    },

    // Lookup suplementów użytkownika
    {
      $lookup: {
        from: "userSupplements",
        localField: "id",
        foreignField: "userId",
        as: "userSupplements"
      }
    },

    // Lookup ostatnich interakcji
    {
      $lookup: {
        from: "interactions",
        let: { supplementIds: "$userSupplements.supplementId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$supplementId", "$$supplementIds"]
              }
            }
          },
          { $sort: { createdAt: -1 } },
          { $limit: 5 }
        ],
        as: "recentInteractions"
      }
    },

    // Lookup postępów edukacyjnych
    {
      $lookup: {
        from: "educationProgress",
        localField: "id",
        foreignField: "userId",
        as: "educationProgress"
      }
    }
  ];

  return await db.users.aggregate(pipeline);
};
```

---

## Monitorowanie wydajności

### 1. Metryki wydajności

#### Core Web Vitals:
```typescript
// Monitorowanie Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

#### Metryki aplikacji:
```typescript
// Custom performance monitoring
const metrics = {
  // Czas ładowania komponentów
  componentLoadTime: measureComponentLoadTime,

  // Czas odpowiedzi API
  apiResponseTime: measureAPIResponseTime,

  // Pamięć używana przez graf
  graphMemoryUsage: measureGraphMemoryUsage,

  // Czas renderowania grafu
  graphRenderTime: measureGraphRenderTime,

  // Jakość interakcji
  interactionQuality: measureInteractionQuality
};
```

---

### 2. Logowanie i alerty

#### Structured logging:
```typescript
// Winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'suplementor-web' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Logowanie zdarzeń wydajności
logger.info('Graph render completed', {
  nodeCount: 150,
  renderTime: 245,
  memoryUsage: 45,
  userAgent: req.get('User-Agent')
});
```

#### Alerting thresholds:
```typescript
// Alerty wydajności
const performanceAlerts = {
  apiResponseTime: {
    warning: 1000, // 1 sekunda
    critical: 3000 // 3 sekundy
  },
  errorRate: {
    warning: 0.05, // 5%
    critical: 0.10 // 10%
  },
  memoryUsage: {
    warning: 100, // 100MB
    critical: 200 // 200MB
  }
};
```

---

## Rozwiązywanie problemów wydajnościowych

### 1. Problemy z czasem ładowania

#### Diagnoza:
```typescript
// Chrome DevTools Performance tab
// 1. Nagraj performance trace
// 2. Sprawdź Main thread
// 3. Zidentyfikuj długie taski
// 4. Sprawdź Network tab dla API calls
// 5. Sprawdź Memory tab dla leaków pamięci
```

#### Rozwiązania:
1. **Code splitting** - dzielenie bundla na chunk'i
2. **Lazy loading** - ładowanie komponentów na żądanie
3. **Caching** - cache'owanie API responses
4. **Optymalizacja obrazów** - WebP, responsive images

---

### 2. Problemy z pamięcią

#### Detekcja memory leaków:
```typescript
// Memory leak detection
if (process.env.NODE_ENV === 'development') {
  const memwatch = require('memwatch-next');

  memwatch.on('leak', (info: any) => {
    console.error('Memory leak detected:', info);
    logger.error('Memory leak', { info });
  });

  memwatch.on('stats', (stats: any) => {
    console.log('Memory stats:', stats);
  });
}
```

#### Rozwiązania:
1. **Event listener cleanup** - usuwanie listenerów przy unmount
2. **Timer cleanup** - clearTimeout, clearInterval
3. **Observer cleanup** - disconnect IntersectionObserver
4. **Cache cleanup** - LRU cache z limitem rozmiaru

---

### 3. Problemy z responsywnością

#### Optymalizacja interakcji:
```typescript
// Debouncing dla wyszukiwania
const debouncedSearch = debounce((query: string) => {
  performSearch(query);
}, 300);

// Throttling dla scroll events
const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 16); // ~60fps
```

#### Responsywny design:
```css
/* Mobile-first approach */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding: 2rem;
  }
}
```

---

## Skalowalność systemu

### 1. Architektura mikrousług

#### Podział na serwisy:
- **Supplement Service** - zarządzanie bazą suplementów
- **Knowledge Graph Service** - graf wiedzy i relacje
- **Interaction Service** - analiza interakcji
- **Education Service** - moduły edukacyjne
- **User Service** - zarządzanie użytkownikami

#### Komunikacja między serwisami:
```typescript
// Message queue z RabbitMQ
await channel.publish('supplement-exchange', 'supplement.updated', {
  supplementId: 'omega-3',
  changes: ['researchStudies'],
  timestamp: new Date()
});

// Event-driven architecture
eventBus.subscribe('supplement.updated', async (data) => {
  await cache.invalidate(`supplement:${data.supplementId}`);
  await searchIndex.update(data.supplementId);
});
```

---

### 2. Load balancing i CDN

#### Konfiguracja load balancera:
```nginx
# Nginx load balancer
upstream suplementor_backend {
    server backend1.suplementor.pl:3000 weight=3;
    server backend2.suplementor.pl:3000 weight=2;
    server backend3.suplementor.pl:3000 weight=1;
}

server {
    listen 80;
    server_name api.suplementor.pl;

    location / {
        proxy_pass http://suplementor_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### CDN dla zasobów statycznych:
```javascript
// CloudFlare Pages dla Next.js
// Cache headers dla statycznych zasobów
const cacheHeaders = {
  'Cache-Control': 'public, max-age=31536000, immutable',
  'CDN-Cache-Control': 'max-age=31536000',
  'Vercel-CDN-Cache-Control': 'max-age=31536000'
};
```

---

### 3. Database scaling

#### Read/Write splitting:
```typescript
// Read from replicas, write to primary
const dbConfig = {
  read: [
    'replica1.mongodb.net:27017',
    'replica2.mongodb.net:27017',
    'replica3.mongodb.net:27017'
  ],
  write: 'primary.mongodb.net:27017'
};

// Routing zapytań
const executeQuery = async (query: any, readOnly: boolean = false) => {
  const target = readOnly ? dbConfig.read : dbConfig.write;
  return await MongoClient.connect(target).then(db => db.execute(query));
};
```

#### Sharding strategia:
```javascript
// Shard key dla suplementów
sh.shardCollection("suplementor.supplements", { "category": 1 })

// Shard key dla użytkowników
sh.shardCollection("suplementor.users", { "country": 1 })

// Shard key dla relacji
sh.shardCollection("suplementor.knowledgeRelationships", { "sourceId": 1 })
```

---

## Podsumowanie

### Kluczowe strategie optymalizacji:

1. **Code splitting** - dzielenie aplikacji na mniejsze chunk'i
2. **Lazy loading** - ładowanie zasobów na żądanie
3. **Caching** - cache'owanie na wszystkich poziomach
4. **Database indexing** - odpowiednie indeksy dla zapytań
5. **CDN** - dystrybucja zasobów statycznych
6. **Monitoring** - śledzenie metryk wydajności

### Dla deweloperów:

- **Performance budget** - limity dla rozmiaru bundla
- **Core Web Vitals** - optymalizacja metryk Google
- **Progressive enhancement** - funkcjonalność bez JavaScript
- **Accessibility** - wydajność dla wszystkich użytkowników

---

*Przewodnik optymalizacji będzie aktualizowany wraz z rozwojem technologii. Ostatnia aktualizacja: październik 2025*