# Przykłady dla deweloperów i fragmenty kodu - Suplementor

## Spis treści
1. [Przykłady komponentów React](#przykłady-komponentów-react)
2. [Hooki niestandardowe](#hooki-niestandardowe)
3. [Integracja z API](#integracja-z-api)
4. [Obsługa stanu z Zustand](#obsługa-stanu-z-zustand)
5. [Wizualizacja grafu wiedzy](#wizualizacja-grafu-wiedzy)
6. [Testowanie komponentów](#testowanie-komponentów)
7. [Przykłady użycia w aplikacjach](#przykłady-użycia-w-aplikacjach)

## Przykłady komponentów React

### 1. Komponent karty suplementu

```tsx
// components/SupplementCard.tsx
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Supplement } from '@/types/supplement';
import { EvidenceLevel, getEvidenceLevelColor } from '@/lib/evidence';

interface SupplementCardProps {
  supplement: Supplement;
  onSelect?: (id: string) => void;
  compact?: boolean;
}

export const SupplementCard = memo(({ supplement, onSelect, compact = false }: SupplementCardProps) => {
  const evidenceColor = getEvidenceLevelColor(supplement.evidenceLevel);

  return (
    <Card className={`supplement-card ${compact ? 'compact' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{supplement.polishName}</CardTitle>
            <p className="text-sm text-muted-foreground italic">
              {supplement.scientificName}
            </p>
          </div>
          <Badge
            variant="outline"
            className={`evidence-badge ${evidenceColor}`}
          >
            {supplement.evidenceLevel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {supplement.polishDescription}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">{supplement.category}</Badge>
            {supplement.dosageGuidelines.optimal && (
              <Badge variant="outline">
                {supplement.dosageGuidelines.optimal}{supplement.dosageGuidelines.unit}
              </Badge>
            )}
          </div>

          {onSelect && (
            <Button size="sm" onClick={() => onSelect(supplement.id)}>
              Zobacz szczegóły
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

SupplementCard.displayName = 'SupplementCard';
```

---

### 2. Komponent wykresu interakcji

```tsx
// components/InteractionsMatrix.tsx
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SupplementInteraction, InteractionType } from '@/types/interactions';

interface InteractionsMatrixProps {
  interactions: SupplementInteraction[];
  supplements: Supplement[];
}

export const InteractionsMatrix = ({ interactions, supplements }: InteractionsMatrixProps) => {
  const interactionMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, SupplementInteraction>> = {};

    supplements.forEach(supplement => {
      matrix[supplement.id] = {};
    });

    interactions.forEach(interaction => {
      matrix[interaction.supplement1Id][interaction.supplement2Id] = interaction;
      matrix[interaction.supplement2Id][interaction.supplement1Id] = interaction;
    });

    return matrix;
  }, [interactions, supplements]);

  const getInteractionColor = (type: InteractionType) => {
    switch (type) {
      case 'SYNERGY': return 'text-green-600 bg-green-50';
      case 'ANTAGONISM': return 'text-red-600 bg-red-50';
      case 'CAUTION': return 'text-yellow-600 bg-yellow-50';
      case 'CONTRAINDICATION': return 'text-red-800 bg-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getInteractionIcon = (type: InteractionType) => {
    switch (type) {
      case 'SYNERGY': return '✓';
      case 'ANTAGONISM': return '⚠';
      case 'CAUTION': return '!';
      case 'CONTRAINDICATION': return '✗';
      default: return '?';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Macierz interakcji</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2" style={{ gridTemplateColumns: `auto repeat(${supplements.length}, 1fr)` }}>
          {/* Header row */}
          <div></div>
          {supplements.map(supplement => (
            <div key={supplement.id} className="text-xs font-medium text-center p-2">
              {supplement.polishName}
            </div>
          ))}

          {/* Data rows */}
          {supplements.map(supplement1 => (
            <>
              <div key={`${supplement1.id}-header`} className="text-xs font-medium p-2">
                {supplement1.polishName}
              </div>
              {supplements.map(supplement2 => {
                const interaction = interactionMatrix[supplement1.id]?.[supplement2.id];

                if (supplement1.id === supplement2.id) {
                  return (
                    <div key={`${supplement1.id}-${supplement2.id}`} className="text-center p-2 text-gray-400">
                      -
                    </div>
                  );
                }

                return (
                  <div
                    key={`${supplement1.id}-${supplement2.id}`}
                    className={`text-center p-2 rounded ${interaction ? getInteractionColor(interaction.type) : 'bg-gray-50'}`}
                    title={interaction?.polishMechanism}
                  >
                    {interaction ? getInteractionIcon(interaction.type) : ''}
                  </div>
                );
              })}
            </>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-50 text-green-600 text-center text-xs">✓</span>
            Synergia
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-50 text-yellow-600 text-center text-xs">!</span>
            Ostrożność
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-50 text-red-600 text-center text-xs">⚠</span>
            Antagonizm
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-100 text-red-800 text-center text-xs">✗</span>
            Przeciwwskazanie
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## Hooki niestandardowe

### 1. Hook do zarządzania suplementacją użytkownika

```tsx
// hooks/useUserSupplements.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { suplementorAPI } from '@/lib/api';
import { Supplement, UserSupplement } from '@/types/supplement';

export const useUserSupplements = (userId?: string) => {
  const queryClient = useQueryClient();

  // Pobieranie suplementów użytkownika
  const {
    data: userSupplements,
    isLoading,
    error
  } = useQuery({
    queryKey: ['userSupplements', userId],
    queryFn: () => suplementorAPI.getUserSupplements(userId!),
    enabled: !!userId,
  });

  // Dodawanie suplementu
  const addSupplementMutation = useMutation({
    mutationFn: (data: { supplementId: string; dosage: number; frequency: string }) =>
      suplementorAPI.addUserSupplement(userId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSupplements', userId] });
    },
  });

  // Aktualizacja suplementu
  const updateSupplementMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<UserSupplement> }) =>
      suplementorAPI.updateUserSupplement(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSupplements', userId] });
    },
  });

  // Usuwanie suplementu
  const removeSupplementMutation = useMutation({
    mutationFn: (supplementId: string) =>
      suplementorAPI.removeUserSupplement(userId!, supplementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSupplements', userId] });
    },
  });

  return {
    userSupplements,
    isLoading,
    error,
    addSupplement: addSupplementMutation.mutate,
    updateSupplement: updateSupplementMutation.mutate,
    removeSupplement: removeSupplementMutation.mutate,
    isAdding: addSupplementMutation.isPending,
    isUpdating: updateSupplementMutation.isPending,
    isRemoving: removeSupplementMutation.isPending,
  };
};
```

---

### 2. Hook do grafu wiedzy

```tsx
// hooks/useKnowledgeGraph.ts
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { suplementorAPI } from '@/lib/api';
import { KnowledgeNode, KnowledgeRelationship } from '@/types/knowledge';

interface UseKnowledgeGraphOptions {
  includeSupplements?: boolean;
  includeNeurotransmitters?: boolean;
  includeBrainRegions?: boolean;
  maxNodes?: number;
  searchTerm?: string;
  categories?: string[];
  evidenceLevels?: string[];
}

export const useKnowledgeGraph = (options: UseKnowledgeGraphOptions) => {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [layout, setLayout] = useState<'force' | 'hierarchical' | 'circular'>('force');

  // Pobieranie danych grafu
  const {
    data: graphData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['knowledgeGraph', options],
    queryFn: () => suplementorAPI.getKnowledgeGraph({
      ...options,
      layout,
    }),
    staleTime: 5 * 60 * 1000, // 5 minut
  });

  // Przetwarzanie danych dla wizualizacji
  const processedData = useMemo(() => {
    if (!graphData) return null;

    const nodes = graphData.nodes.map(node => ({
      ...node,
      x: Math.random() * 800, // Inicjalne pozycje
      y: Math.random() * 600,
      vx: 0,
      vy: 0,
    }));

    return {
      nodes,
      relationships: graphData.relationships,
    };
  }, [graphData]);

  // Funkcje pomocnicze
  const findNode = (id: string) => {
    return graphData?.nodes.find(node => node.id === id);
  };

  const getRelatedNodes = (nodeId: string, depth: number = 1) => {
    return suplementorAPI.getRelatedNodes(nodeId, depth);
  };

  const searchNodes = (query: string) => {
    return graphData?.nodes.filter(node =>
      node.name.toLowerCase().includes(query.toLowerCase()) ||
      node.polishName.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    graphData: processedData,
    isLoading,
    error,
    selectedNode,
    setSelectedNode,
    layout,
    setLayout,
    findNode,
    getRelatedNodes,
    searchNodes,
  };
};
```

---

### 3. Hook do śledzenia suplementacji

```tsx
// hooks/useSupplementTracking.ts
import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { suplementorAPI } from '@/lib/api';

interface DosageEntry {
  supplementId: string;
  dosage: number;
  timestamp: Date;
  notes?: string;
}

export const useSupplementTracking = (userId: string) => {
  const [todayDosages, setTodayDosages] = useState<Map<string, DosageEntry>>(new Map());
  const queryClient = useQueryClient();

  // Logowanie dawki
  const logDosageMutation = useMutation({
    mutationFn: (entry: DosageEntry) =>
      suplementorAPI.logDosage(userId, entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplementTracking', userId] });
    },
  });

  // Sprawdzenie czy suplement został wzięty dzisiaj
  const isSupplementTakenToday = useCallback((supplementId: string) => {
    return todayDosages.has(supplementId);
  }, [todayDosages]);

  // Zalogowanie dawki
  const logDosage = useCallback((supplementId: string, dosage: number, notes?: string) => {
    const entry: DosageEntry = {
      supplementId,
      dosage,
      timestamp: new Date(),
      notes,
    };

    setTodayDosages(prev => new Map(prev.set(supplementId, entry)));
    logDosageMutation.mutate(entry);
  }, [logDosageMutation]);

  // Pobranie historii dawek
  const getDosageHistory = useCallback((supplementId: string, days: number = 30) => {
    return suplementorAPI.getDosageHistory(userId, supplementId, days);
  }, [userId]);

  return {
    todayDosages: Array.from(todayDosages.values()),
    isSupplementTakenToday,
    logDosage,
    getDosageHistory,
    isLogging: logDosageMutation.isPending,
  };
};
```

---

## Integracja z API

### 1. Klient API z error handling

```tsx
// lib/suplementor-api.ts
export class SuplementorAPI {
  private baseURL: string;
  private apiKey?: string;
  private onRateLimit?: (retryAfter: number) => void;

  constructor(config: {
    baseURL: string;
    apiKey?: string;
    onRateLimit?: (retryAfter: number) => void;
  }) {
    this.baseURL = config.baseURL;
    this.apiKey = config.apiKey;
    this.onRateLimit = config.onRateLimit;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept-Language': 'pl-PL',
      ...options.headers,
    };

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Obsługa rate limitingu
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
      this.onRateLimit?.(retryAfter);
      throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Suplementy
  async getSupplements(params?: {
    category?: string;
    search?: string;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    return this.request(`/api/v1/supplements?${searchParams}`);
  }

  async getSupplement(id: string) {
    return this.request(`/api/v1/supplements/${id}`);
  }

  // Graf wiedzy
  async getKnowledgeGraph(options?: {
    maxNodes?: number;
    searchTerm?: string;
    categories?: string[];
  }) {
    return this.request('/api/v1/knowledge-graph/generate', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  // Interakcje
  async analyzeInteractions(supplementIds: string[]) {
    return this.request('/api/v1/interactions/analyze', {
      method: 'POST',
      body: JSON.stringify({ supplementIds }),
    });
  }
}
```

---

### 2. React Query setup

```tsx
// lib/react-query.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minut
      gcTime: 10 * 60 * 1000, // 10 minut (dawniej cacheTime)
      retry: (failureCount, error: any) => {
        // Nie retry dla błędów 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
```

---

## Obsługa stanu z Zustand

### 1. Store dla suplementów użytkownika

```tsx
// stores/userSupplementsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Supplement, UserSupplement } from '@/types/supplement';

interface UserSupplementsState {
  supplements: UserSupplement[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addSupplement: (supplement: Omit<UserSupplement, 'id' | 'createdAt'>) => void;
  updateSupplement: (id: string, updates: Partial<UserSupplement>) => void;
  removeSupplement: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed
  getSupplementById: (id: string) => UserSupplement | undefined;
  getActiveSupplements: () => UserSupplement[];
  getSupplementsByCategory: (category: string) => UserSupplement[];
}

export const useUserSupplementsStore = create<UserSupplementsState>()(
  persist(
    (set, get) => ({
      supplements: [],
      isLoading: false,
      error: null,

      addSupplement: (supplementData) => {
        const newSupplement: UserSupplement = {
          ...supplementData,
          id: `us_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
        };

        set((state) => ({
          supplements: [...state.supplements, newSupplement],
          error: null,
        }));
      },

      updateSupplement: (id, updates) => {
        set((state) => ({
          supplements: state.supplements.map((supplement) =>
            supplement.id === id
              ? { ...supplement, ...updates, updatedAt: new Date() }
              : supplement
          ),
        }));
      },

      removeSupplement: (id) => {
        set((state) => ({
          supplements: state.supplements.filter((supplement) => supplement.id !== id),
        }));
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      getSupplementById: (id) => {
        return get().supplements.find((supplement) => supplement.id === id);
      },

      getActiveSupplements: () => {
        return get().supplements.filter((supplement) => supplement.isActive);
      },

      getSupplementsByCategory: (category) => {
        return get().supplements.filter((supplement) => supplement.category === category);
      },
    }),
    {
      name: 'user-supplements-storage',
      partialize: (state) => ({ supplements: state.supplements }),
    }
  )
);
```

---

### 2. Store dla ustawień aplikacji

```tsx
// stores/appSettingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'pl' | 'en';
  notifications: {
    supplementReminders: boolean;
    interactionAlerts: boolean;
    newResearch: boolean;
    achievements: boolean;
  };
  privacy: {
    shareUsageData: boolean;
    shareSupplements: boolean;
    allowPersonalization: boolean;
  };
  performance: {
    graphLOD: 'low' | 'medium' | 'high';
    animationsEnabled: boolean;
    cacheEnabled: boolean;
  };
}

interface AppSettingsState extends AppSettings {
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'pl',
  notifications: {
    supplementReminders: true,
    interactionAlerts: true,
    newResearch: false,
    achievements: true,
  },
  privacy: {
    shareUsageData: false,
    shareSupplements: false,
    allowPersonalization: true,
  },
  performance: {
    graphLOD: 'medium',
    animationsEnabled: true,
    cacheEnabled: true,
  },
};

export const useAppSettingsStore = create<AppSettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateSettings: (updates) => {
        set((state) => ({
          ...state,
          ...updates,
        }));
      },

      resetSettings: () => {
        set(defaultSettings);
      },
    }),
    {
      name: 'app-settings-storage',
    }
  )
);
```

---

## Wizualizacja grafu wiedzy

### 1. Komponent grafu z D3.js

```tsx
// components/KnowledgeGraph.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { KnowledgeNode, KnowledgeRelationship } from '@/types/knowledge';

interface KnowledgeGraphProps {
  nodes: KnowledgeNode[];
  relationships: KnowledgeRelationship[];
  width?: number;
  height?: number;
  onNodeClick?: (node: KnowledgeNode) => void;
}

export const KnowledgeGraph = ({
  nodes,
  relationships,
  width = 800,
  height = 600,
  onNodeClick
}: KnowledgeGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    // Simulation forces
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(relationships as any).id((d: any) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(20));

    // Draw relationships
    const link = svg.append('g')
      .selectAll('line')
      .data(relationships)
      .enter()
      .append('line')
      .attr('stroke', (d) => getRelationshipColor(d.type))
      .attr('stroke-width', (d) => Math.sqrt(d.strength) * 2)
      .attr('stroke-opacity', 0.6);

    // Draw nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', (d) => 5 + d.importance * 10)
      .attr('fill', (d) => getNodeColor(d.type))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(drag(simulation) as any);

    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text((d) => d.polishName || d.name)
      .attr('font-size', 12)
      .attr('dx', 12)
      .attr('dy', 4)
      .style('pointer-events', 'none');

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    // Node click handler
    node.on('click', (event, d) => {
      setSelectedNode(d);
      onNodeClick?.(d);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, relationships, width, height, onNodeClick]);

  return (
    <div className="knowledge-graph-container">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border rounded-lg bg-white"
      />
      {selectedNode && (
        <div className="node-details p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold">{selectedNode.polishName}</h3>
          <p className="text-sm text-gray-600">{selectedNode.description}</p>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getNodeColor = (type: string) => {
  const colors = {
    SUPPLEMENT: '#3B82F6',
    NEUROTRANSMITTER: '#10B981',
    BRAIN_REGION: '#F59E0B',
    COGNITIVE_FUNCTION: '#8B5CF6',
  };
  return colors[type as keyof typeof colors] || '#6B7280';
};

const getRelationshipColor = (type: string) => {
  const colors = {
    ENHANCES: '#10B981',
    INHIBITS: '#EF4444',
    MODULATES: '#F59E0B',
    ACTS_ON: '#3B82F6',
  };
  return colors[type as keyof typeof colors] || '#6B7280';
};

// Drag behavior
const drag = (simulation: d3.Simulation<any, any>) => {
  return d3.drag<any, any>()
    .on('start', (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on('drag', (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on('end', (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });
};
```

---

## Testowanie komponentów

### 1. Testowanie komponentów React

```tsx
// __tests__/SupplementCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupplementCard } from '@/components/SupplementCard';
import { mockSupplement } from '@/__mocks__/supplements';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithQueryClient = (component: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('SupplementCard', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders supplement information correctly', () => {
    renderWithQueryClient(
      <SupplementCard supplement={mockSupplement} />
    );

    expect(screen.getByText(mockSupplement.polishName)).toBeInTheDocument();
    expect(screen.getByText(mockSupplement.scientificName)).toBeInTheDocument();
    expect(screen.getByText(mockSupplement.category)).toBeInTheDocument();
  });

  it('calls onSelect when button is clicked', () => {
    renderWithQueryClient(
      <SupplementCard
        supplement={mockSupplement}
        onSelect={mockOnSelect}
      />
    );

    fireEvent.click(screen.getByText('Zobacz szczegóły'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockSupplement.id);
  });

  it('displays evidence level badge with correct color', () => {
    renderWithQueryClient(
      <SupplementCard supplement={mockSupplement} />
    );

    const badge = screen.getByText(mockSupplement.evidenceLevel);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('evidence-badge');
  });

  it('renders in compact mode when specified', () => {
    const { container } = renderWithQueryClient(
      <SupplementCard supplement={mockSupplement} compact />
    );

    expect(container.firstChild).toHaveClass('compact');
  });
});
```

---

### 2. Testowanie hooków

```tsx
// __tests__/hooks/useKnowledgeGraph.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useKnowledgeGraph } from '@/hooks/useKnowledgeGraph';
import { suplementorAPI } from '@/lib/api';

// Mock API
jest.mock('@/lib/api');
const mockedAPI = suplementorAPI as jest.Mocked<typeof suplementorAPI>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useKnowledgeGraph', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch knowledge graph data', async () => {
    const mockData = {
      nodes: [
        {
          id: 'omega-3',
          name: 'Omega-3',
          polishName: 'Omega-3',
          type: 'SUPPLEMENT',
          importance: 0.9,
        },
      ],
      relationships: [],
    };

    mockedAPI.getKnowledgeGraph.mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useKnowledgeGraph({
        maxNodes: 100,
        searchTerm: 'omega-3',
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.graphData).toEqual(
      expect.objectContaining({
        nodes: expect.arrayContaining([
          expect.objectContaining({
            id: 'omega-3',
            polishName: 'Omega-3',
          }),
        ]),
      })
    );

    expect(mockedAPI.getKnowledgeGraph).toHaveBeenCalledWith({
      maxNodes: 100,
      searchTerm: 'omega-3',
      layout: 'force',
    });
  });

  it('should handle search functionality', async () => {
    const mockData = {
      nodes: [
        { id: 'omega-3', name: 'Omega-3', polishName: 'Omega-3', type: 'SUPPLEMENT' },
        { id: 'witamina-d', name: 'Vitamin D', polishName: 'Witamina D', type: 'SUPPLEMENT' },
      ],
      relationships: [],
    };

    mockedAPI.getKnowledgeGraph.mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useKnowledgeGraph({ maxNodes: 100 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const searchResults = result.current.searchNodes('omega');
    expect(searchResults).toHaveLength(1);
    expect(searchResults[0].id).toBe('omega-3');
  });
});
```

---

## Przykłady użycia w aplikacjach

### 1. Integracja w aplikacji Next.js

```tsx
// pages/suplementy/[id].tsx
import { GetServerSideProps } from 'next';
import { KnowledgeGraph } from '@/components/KnowledgeGraph';
import { SupplementDetail } from '@/components/SupplementDetail';
import { useKnowledgeGraph } from '@/hooks/useKnowledgeGraph';
import { suplementorAPI } from '@/lib/api';

interface SupplementPageProps {
  supplement: Supplement;
}

export default function SupplementPage({ supplement }: SupplementPageProps) {
  const { graphData, isLoading, selectedNode, setSelectedNode } = useKnowledgeGraph({
    searchTerm: supplement.name,
    maxNodes: 50,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Szczegóły suplementu */}
        <div>
          <SupplementDetail supplement={supplement} />
        </div>

        {/* Graf wiedzy */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <KnowledgeGraph
              nodes={graphData?.nodes || []}
              relationships={graphData?.relationships || []}
              onNodeClick={setSelectedNode}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const supplement = await suplementorAPI.getSupplement(params?.id as string);

  return {
    props: {
      supplement,
    },
  };
};
```

---

### 2. Widget dla strony internetowej

```tsx
// components/SuplementorWidget.tsx
import React, { useEffect } from 'react';
import { useKnowledgeGraph } from '@/hooks/useKnowledgeGraph';

interface SuplementorWidgetProps {
  supplementId: string;
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
}

export const SuplementorWidget = ({
  supplementId,
  width = 400,
  height = 300,
  theme = 'light'
}: SuplementorWidgetProps) => {
  const { graphData, isLoading } = useKnowledgeGraph({
    searchTerm: supplementId,
    maxNodes: 20,
  });

  useEffect(() => {
    // Ładowanie skryptu Suplementor
    const script = document.createElement('script');
    script.src = 'https://cdn.suplementor.pl/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className={`suplementor-widget ${theme}`}
      style={{ width, height }}
      data-supplement-id={supplementId}
    >
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-sm text-gray-500">Ładowanie grafu wiedzy...</div>
        </div>
      )}
    </div>
  );
};

// Użycie w HTML
// <div data-suplementor-widget data-supplement-id="omega-3"></div>
```

---

### 3. Aplikacja mobilna React Native

```tsx
// screens/SupplementDetailScreen.tsx
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SupplementCard } from '@/components/SupplementCard';
import { InteractionsList } from '@/components/InteractionsList';
import { useSupplement } from '@/hooks/useSupplement';

export const SupplementDetailScreen = () => {
  const route = useRoute();
  const { supplementId } = route.params as { supplementId: string };

  const { supplement, interactions, isLoading } = useSupplement(supplementId);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Ładowanie suplementu...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SupplementCard supplement={supplement} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interakcje</Text>
        <InteractionsList interactions={interactions} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badania naukowe</Text>
        <ResearchList research={supplement.researchStudies} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
```

---

## Podsumowanie przykładów

### Najważniejsze wzorce:

1. **TypeScript** - pełne typowanie dla bezpieczeństwa
2. **React Query** - zarządzanie stanem serwera
3. **Zustand** - prosty stan aplikacji
4. **Error boundaries** - obsługa błędów
5. **Responsive design** - dla wszystkich urządzeń
6. **Accessibility** - ARIA labels i keyboard navigation

### Dobre praktyki:

- **Separation of concerns** - komponenty, hooki, API osobno
- **Performance optimization** - memoizacja, lazy loading
- **Error handling** - graceful degradation
- **Testing** - unit i integration tests
- **Documentation** - JSDoc komentarze

---

*Przykłady będą aktualizowane wraz z nowymi wersjami bibliotek. Ostatnia aktualizacja: październik 2025*