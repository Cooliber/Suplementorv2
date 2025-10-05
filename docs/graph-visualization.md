# Graf Wiedzy o Suplementach - System Wizualizacji

## Przegląd

System wizualizacji grafów dla aplikacji Suplementor umożliwia interaktywne eksplorowanie połączeń między suplementami, neurotransmiterami, regionami mózgu i funkcjami poznawczymi. System został zaprojektowany z myślą o polskich użytkownikach i zawiera pełne tłumaczenia oraz lokalizację.

## Architektura

### Komponenty główne

1. **GraphDashboard** - Główny komponent dashboardu
2. **D3GraphVisualization** - Wizualizacja oparta na D3.js
3. **CytoscapeVisualization** - Wizualizacja oparta na Cytoscape.js
4. **GraphControls** - Panel kontrolny z filtrami
5. **GraphLegend** - Legenda grafu
6. **NodeDetails** - Panel szczegółów węzła
7. **ConnectionVisualization** - Analiza połączeń

### Usługi i hooki

- **GraphDataService** - Serwis do generowania danych grafu
- **useGraphData** - Hook do zarządzania danymi grafu
- **useKnowledgeGraphStore** - Store Zustand do stanu grafu

## Funkcjonalności

### Wizualizacja

- **Dwa silniki renderowania**: D3.js i Cytoscape.js
- **Różne układy**: siłowy, hierarchiczny, kołowy, siatkowy, promieniowy
- **Interaktywność**: zoom, pan, drag & drop, selekcja węzłów
- **Animacje**: płynne przejścia i efekty hover

### Filtrowanie i wyszukiwanie

- **Filtry typów węzłów**: suplementy, neurotransmitery, regiony mózgu
- **Filtry relacji**: wzmacnia, hamuje, synergizuje, antagonizuje
- **Poziomy dowodów**: silne, umiarkowane, słabe, niewystarczające
- **Wyszukiwanie tekstowe**: po nazwach polskich i angielskich
- **Filtry siły połączeń**: zakres 0-100%

### Analiza połączeń

- **Macierz połączeń**: tabelaryczny widok relacji
- **Analiza siły**: wizualizacja intensywności połączeń
- **Statystyki**: liczba węzłów, połączeń, poziomy dowodów
- **Ścieżki**: znajdowanie najkrótszych ścieżek między węzłami

## Użycie

### Podstawowe użycie

```tsx
import { GraphDashboard } from '@/components/graph';
import { useGraphData } from '@/hooks';

function MyGraphPage() {
  const { nodes, relationships, supplements, isLoading } = useGraphData({
    includeSupplements: true,
    includeNeurotransmitters: true,
    maxNodes: 500
  });

  if (isLoading) return <div>Ładowanie...</div>;

  return (
    <GraphDashboard
      nodes={nodes}
      relationships={relationships}
      supplements={supplements}
    />
  );
}
```

### Zaawansowane filtrowanie

```tsx
import { useGraphData, useFilteredGraphData } from '@/hooks';
import { useKnowledgeGraphStore } from '@/lib/stores/knowledge-graph-store';

function FilteredGraph() {
  const { nodes, relationships } = useGraphData();
  const { filters } = useKnowledgeGraphStore();
  
  const filteredData = useFilteredGraphData(nodes, relationships, filters);
  
  return (
    <GraphDashboard
      nodes={filteredData.nodes}
      relationships={filteredData.relationships}
    />
  );
}
```

### Niestandardowa konfiguracja

```tsx
import { GraphDataService } from '@/lib/services';

const customService = new GraphDataService();

const data = await customService.generateGraphData({
  includeSupplements: true,
  includeNeurotransmitters: false,
  minEvidenceLevel: 'STRONG',
  maxNodes: 200
});
```

## Typy danych

### KnowledgeNode

```typescript
interface KnowledgeNode {
  id: string;
  name: string;
  polishName: string;
  type: NodeType;
  description: string;
  polishDescription?: string;
  category: string;
  evidenceLevel: EvidenceLevel;
  size: number;
  importance: number;
  x?: number;
  y?: number;
  metadata?: Record<string, any>;
}
```

### KnowledgeRelationship

```typescript
interface KnowledgeRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  strength: number;
  confidence: number;
  mechanism: string;
  polishMechanism: string;
  evidenceLevel: EvidenceLevel;
  metadata?: Record<string, any>;
}
```

## Konfiguracja

### Opcje GraphDataService

```typescript
interface GraphDataServiceOptions {
  includeSupplements?: boolean;
  includeNeurotransmitters?: boolean;
  includeBrainRegions?: boolean;
  includeCognitiveFunctions?: boolean;
  includePathways?: boolean;
  includeMechanisms?: boolean;
  minEvidenceLevel?: EvidenceLevel;
  maxNodes?: number;
}
```

### Filtry grafu

```typescript
interface KnowledgeGraphFilters {
  nodeTypes: NodeType[];
  relationshipTypes: RelationshipType[];
  evidenceLevels: EvidenceLevel[];
  searchTerm: string;
  minStrength: number;
  maxStrength: number;
  maxNodes: number;
  showLabels: boolean;
  showRelationshipLabels: boolean;
  minConfidence: number;
  categories: string[];
}
```

## Wydajność

### Optymalizacje

- **Wirtualizacja**: Renderowanie tylko widocznych elementów
- **Lazy loading**: Ładowanie danych na żądanie
- **Memoizacja**: Cache'owanie wyników obliczeń
- **Throttling**: Ograniczanie częstotliwości aktualizacji

### Limity

- **Maksymalna liczba węzłów**: 2000 (konfigurowalne)
- **Maksymalna liczba połączeń**: 5000 (konfigurowalne)
- **Częstotliwość aktualizacji**: 60 FPS dla animacji

## Testowanie

### Uruchamianie testów

```bash
npm run test
npm run test:coverage
npm run test:ui
```

### Struktura testów

- **Testy jednostkowe**: Komponenty i hooki
- **Testy integracyjne**: Przepływ danych
- **Testy wydajnościowe**: Duże zbiory danych
- **Testy wizualne**: Storybook

## Rozszerzanie

### Dodawanie nowych typów węzłów

1. Dodaj nowy typ do `NodeType` enum
2. Zaktualizuj `nodeTypeOptions` w `GraphControls`
3. Dodaj logikę generowania w `GraphDataService`
4. Zaktualizuj style w komponentach wizualizacji

### Dodawanie nowych typów relacji

1. Dodaj nowy typ do `RelationshipType` enum
2. Zaktualizuj `relationshipTypeOptions` w `GraphControls`
3. Dodaj kolory i style w komponentach wizualizacji
4. Zaktualizuj logikę filtrowania

### Dodawanie nowych układów

1. Dodaj konfigurację układu w `CytoscapeVisualization`
2. Zaktualizuj `layoutOptions` w `GraphControls`
3. Dodaj obsługę w `D3GraphVisualization` jeśli potrzebne

## Lokalizacja

Wszystkie teksty interfejsu są w języku polskim:

- **Nazwy węzłów**: `polishName` field
- **Opisy**: `polishDescription` field
- **Mechanizmy**: `polishMechanism` field
- **Interfejs**: Wszystkie etykiety, tooltips, komunikaty

## Troubleshooting

### Problemy z wydajnością

- Zmniejsz `maxNodes` w opcjach
- Wyłącz animacje (`enablePhysics: false`)
- Użyj prostszego układu (grid zamiast force)

### Problemy z danymi

- Sprawdź poprawność importów suplementów
- Zweryfikuj strukturę `KnowledgeNode` i `KnowledgeRelationship`
- Sprawdź logi w konsoli przeglądarki

### Problemy z renderowaniem

- Sprawdź czy D3.js i Cytoscape.js są poprawnie zainstalowane
- Zweryfikuj wymiary kontenera
- Sprawdź czy CSS jest poprawnie załadowany

## Roadmapa

### Planowane funkcjonalności

- **Eksport do różnych formatów**: PNG, SVG, PDF, JSON
- **Zaawansowane algorytmy układu**: Community detection, clustering
- **Integracja z AI**: Automatyczne sugerowanie połączeń
- **Tryb VR/AR**: Immersyjna wizualizacja 3D
- **Współpraca w czasie rzeczywistym**: Multi-user editing

### Ulepszenia wydajności

- **WebGL rendering**: Dla bardzo dużych grafów
- **Web Workers**: Obliczenia w tle
- **Progressive loading**: Stopniowe ładowanie danych
- **Adaptive quality**: Automatyczne dostosowanie jakości
