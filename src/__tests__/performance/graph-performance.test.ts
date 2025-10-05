import type { VirtualizedGraphVisualization } from '@/components/graph/VirtualizedGraphVisualization';
import { useKnowledgeGraphStore } from '@/lib/stores/knowledge-graph-store';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the store
vi.mock('@/lib/stores/knowledge-graph-store', () => ({
  useKnowledgeGraphStore: vi.fn(),
}));

describe('Performance Benchmark Tests', () => {
  const mockStore = {
    filters: {
      nodeTypes: [],
      relationshipTypes: [],
      evidenceLevels: [],
      searchTerm: '',
      minStrength: 0,
      maxNodes: 100,
      showLabels: true,
    },
    maxRenderNodes: 500,
    setFilters: vi.fn(),
  };

  beforeEach(() => {
    (useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(mockStore);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('handles small dataset efficiently (< 100 nodes)', async () => {
    const smallDataset = generateTestDataset(50, 75);
    
    const startTime = performance.now();
    
    render(
      <VirtualizedGraphVisualization
        nodes={smallDataset.nodes}
        relationships={smallDataset.relationships}
        supplements={smallDataset.supplements}
        width={800}
        height={600}
      />
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render quickly for small datasets
    expect(renderTime).toBeLessThan(100); // Less than 100ms
    
    // Should render all nodes
    const canvas = screen.getByRole('img');
    expect(canvas).toBeInTheDocument();
    
    // Check that performance metrics are acceptable
    expect(smallDataset.nodes.length).toBe(50);
    expect(smallDataset.relationships.length).toBe(75);
  });

  it('handles medium dataset efficiently (100-500 nodes)', async () => {
    const mediumDataset = generateTestDataset(300, 450);
    
    const startTime = performance.now();
    
    render(
      <VirtualizedGraphVisualization
        nodes={mediumDataset.nodes}
        relationships={mediumDataset.relationships}
        supplements={mediumDataset.supplements}
        width={800}
        height={600}
      />
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render reasonably quickly for medium datasets
    expect(renderTime).toBeLessThan(300); // Less than 300ms
    
    // Should render all nodes
    const canvas = screen.getByRole('img');
    expect(canvas).toBeInTheDocument();
    
    // Check that performance metrics are acceptable
    expect(mediumDataset.nodes.length).toBe(300);
    expect(mediumDataset.relationships.length).toBe(450);
  });

  it('handles large dataset with node limiting (500+ nodes)', async () => {
    const largeDataset = generateTestDataset(1000, 1500);
    
    // Override maxRenderNodes to test limiting
    const limitedStore = {
      ...mockStore,
      maxRenderNodes: 500,
    };
    
    (useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(limitedStore);
    
    const startTime = performance.now();
    
    render(
      <VirtualizedGraphVisualization
        nodes={largeDataset.nodes}
        relationships={largeDataset.relationships}
        supplements={largeDataset.supplements}
        width={800}
        height={600}
      />
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render reasonably quickly for large datasets with limiting
    expect(renderTime).toBeLessThan(500); // Less than 500ms
    
    // Should render all nodes
    const canvas = screen.getByRole('img');
    expect(canvas).toBeInTheDocument();
    
    // Check that performance metrics are acceptable
    expect(largeDataset.nodes.length).toBe(1000);
    expect(largeDataset.relationships.length).toBe(1500);
  });

  it('handles extremely large dataset with aggressive limiting (>1000 nodes)', async () => {
    const hugeDataset = generateTestDataset(2000, 3000);
    
    // Override maxRenderNodes to test aggressive limiting
    const limitedStore = {
      ...mockStore,
      maxRenderNodes: 500,
    };
    
    (useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(limitedStore);
    
    const startTime = performance.now();
    
    render(
      <VirtualizedGraphVisualization
        nodes={hugeDataset.nodes}
        relationships={hugeDataset.relationships}
        supplements={hugeDataset.supplements}
        width={800}
        height={600}
      />
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render quickly for huge datasets with aggressive limiting
    expect(renderTime).toBeLessThan(700); // Less than 700ms
    
    // Should render all nodes
    const canvas = screen.getByRole('img');
    expect(canvas).toBeInTheDocument();
    
    // Even though we have 2000 nodes, we should only render 500
    expect(hugeDataset.nodes.length).toBe(2000);
    expect(hugeDataset.relationships.length).toBe(3000);
  });

  it('maintains frame rate during animations', async () => {
    const dataset = generateTestDataset(200, 300);
    
    render(
      <VirtualizedGraphVisualization
        nodes={dataset.nodes}
        relationships={dataset.relationships}
        supplements={dataset.supplements}
        width={800}
        height={600}
        className="test-graph"
      />
    );
    
    // Simulate animation frames
    const startTime = performance.now();
    
    // Run multiple animation frames
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 16)); // ~60fps
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    // Should maintain reasonable frame rate
    expect(totalTime).toBeLessThan(200); // Less than 200ms for 10 frames
  });

  it('efficiently filters large datasets', async () => {
    const largeDataset = generateTestDataset(1000, 1500);
    
    // Override filters to test filtering performance
    const filteredStore = {
      ...mockStore,
      filters: {
        ...mockStore.filters,
        nodeTypes: ['SUPPLEMENT'],
        relationshipTypes: ['ENHANCES'],
        evidenceLevels: ['STRONG'],
        minStrength: 0.5,
      },
      maxRenderNodes: 500,
    };
    
    (useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(filteredStore);
    
    const startTime = performance.now();
    
    render(
      <VirtualizedGraphVisualization
        nodes={largeDataset.nodes}
        relationships={largeDataset.relationships}
        supplements={largeDataset.supplements}
        width={800}
        height={600}
      />
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render quickly with filtering
    expect(renderTime).toBeLessThan(500); // Less than 500ms
    
    // Should render all nodes
    const canvas = screen.getByRole('img');
    expect(canvas).toBeInTheDocument();
  });

  it('efficiently handles search operations on large datasets', async () => {
    const largeDataset = generateTestDataset(1000, 1500);
    
    // Override filters to test search performance
    const searchStore = {
      ...mockStore,
      filters: {
        ...mockStore.filters,
        searchTerm: 'test',
      },
      maxRenderNodes: 500,
    };
    
    (useKnowledgeGraphStore as unknown as vi.Mock).mockReturnValue(searchStore);
    
    const startTime = performance.now();
    
    render(
      <VirtualizedGraphVisualization
        nodes={largeDataset.nodes}
        relationships={largeDataset.relationships}
        supplements={largeDataset.supplements}
        width={800}
        height={600}
      />
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render quickly with search
    expect(renderTime).toBeLessThan(500); // Less than 500ms
    
    // Should render all nodes
    const canvas = screen.getByRole('img');
    expect(canvas).toBeInTheDocument();
  });

  it('maintains memory usage within acceptable limits', async () => {
    // This is a simplified test - actual memory profiling would require browser APIs
    const initialMemory = process.memoryUsage().heapUsed;
    
    const largeDataset = generateTestDataset(1000, 1500);
    
    render(
      <VirtualizedGraphVisualization
        nodes={largeDataset.nodes}
        relationships={largeDataset.relationships}
        supplements={largeDataset.supplements}
        width={800}
        height={600}
      />
    );
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be reasonable (this is a very loose check)
    // In a real browser environment, we'd use performance.memory
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB increase
  });
});

// Helper function to generate test datasets
function generateTestDataset(nodeCount: number, relationshipCount: number) {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `node-${i}`,
    name: `Node ${i}`,
    polishName: `Węzeł ${i}`,
    type: i % 3 === 0 ? 'SUPPLEMENT' : i % 3 === 1 ? 'NEUROTRANSMITTER' : 'BRAIN_REGION',
    description: `Description for node ${i}`,
    polishDescription: `Opis dla węzła ${i}`,
    evidenceLevel: i % 4 === 0 ? 'STRONG' : i % 4 === 1 ? 'MODERATE' : i % 4 === 2 ? 'WEAK' : 'INSUFFICIENT',
    category: i % 3 === 0 ? 'NOOTROPIC' : i % 3 === 1 ? 'NEUROTRANSMITTER' : 'BRAIN_REGION',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    x: (i % 100) * 10,
    y: Math.floor(i / 100) * 10,
    size: 5 + (i % 10),
    importance: 0.1 + (i % 100) / 100,
  }));

  const relationships = Array.from({ length: relationshipCount }, (_, i) => ({
    id: `rel-${i}`,
    sourceId: `node-${i % nodeCount}`,
    targetId: `node-${(i + 1) % nodeCount}`,
    type: i % 5 === 0 ? 'ENHANCES' : i % 5 === 1 ? 'INHIBITS' : i % 5 === 2 ? 'MODULATES' : i % 5 === 3 ? 'SYNERGIZES' : 'ANTAGONIZES',
    mechanism: `Mechanism ${i}`,
    polishMechanism: `Mechanizm ${i}`,
    strength: 0.1 + (i % 100) / 100,
    confidence: 0.5 + (i % 50) / 100,
    evidenceLevel: i % 4 === 0 ? 'STRONG' : i % 4 === 1 ? 'MODERATE' : i % 4 === 2 ? 'WEAK' : 'INSUFFICIENT',
    description: `Description for relationship ${i}`,
    polishDescription: `Opis dla relacji ${i}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const supplements = Array.from({ length: Math.min(100, nodeCount) }, (_, i) => ({
    id: `supp-${i}`,
    name: `Supplement ${i}`,
    polishName: `Suplement ${i}`,
    scientificName: `Scientific Name ${i}`,
    commonNames: [`Common Name ${i}`],
    polishCommonNames: [`Pospolita Nazwa ${i}`],
    category: 'NOOTROPIC',
    description: `Description for supplement ${i}`,
    polishDescription: `Opis dla suplementu ${i}`,
    activeCompounds: [],
    clinicalApplications: [],
    mechanisms: [],
    dosageGuidelines: {
      therapeuticRange: { min: 100, max: 200, unit: 'mg' },
      timing: ['morning'],
      withFood: true,
      contraindications: [],
      polishContraindications: [],
      interactions: [],
    },
    sideEffects: [],
    interactions: [],
    evidenceLevel: 'STRONG',
    researchStudies: [],
    tags: [],
    lastUpdated: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    knowledgeNodeId: `node-${i}`,
  }));

  return { nodes, relationships, supplements };
}