# Graph Components Documentation

## Overview

The Suplementor Graph Components provide a comprehensive visualization system for exploring relationships between supplements, neurotransmitters, brain regions, and cognitive functions. Built with performance, accessibility, and Polish localization in mind, the system handles datasets of 500+ nodes while maintaining smooth interactions.

## Component Architecture

### Core Components

1. **GraphDashboard** - Main dashboard component orchestrating all visualization elements
2. **D3GraphVisualization** - Primary force-directed graph using D3.js for detailed visualizations
3. **CytoscapeVisualization** - Alternative graph visualization using Cytoscape.js for different layouts
4. **VirtualizedGraphVisualization** - High-performance canvas-based visualization for large datasets
5. **ConnectionVisualization** - Detailed connection visualization between specific nodes
6. **GraphControls** - Interactive controls for filtering, layout, and visualization options
7. **GraphLegend** - Visual legend explaining node and relationship types
8. **AccessibleGraphLegend** - WCAG-compliant version with enhanced accessibility features
9. **GraphExportImport** - Data export/import functionality in multiple formats
10. **NodeDetails** - Detailed information panel for selected nodes

### Supporting Components

1. **GraphControls** - Filter controls, search, and layout options
2. **GraphLegend** - Visual legend for node and relationship types
3. **NodeDetails** - Detailed information panel for selected nodes
4. **ConnectionVisualization** - Visualization of specific connections

## Key Features

### Performance Optimization
- **Virtualization**: Canvas-based rendering for datasets >500 nodes
- **Node Limiting**: Automatic limiting of rendered nodes with configurable maximum
- **Filtering**: Real-time filtering to reduce dataset size
- **Lazy Loading**: Progressive loading of graph data
- **WebGL Rendering**: Hardware-accelerated canvas rendering (future enhancement)

### Accessibility
- **WCAG Compliance**: Full AA compliance with Polish localization
- **ARIA Labels**: Comprehensive ARIA attributes for screen readers
- **Keyboard Navigation**: Full keyboard support with focus management
- **Semantic HTML**: Proper semantic structure throughout
- **Color Contrast**: Sufficient contrast ratios for all visual elements

### Internationalization
- **Polish Translation**: Complete Polish localization of all UI elements
- **RTL Support**: Right-to-left language support (future enhancement)
- **Cultural Sensitivity**: Culturally appropriate metaphors and terminology

## Usage Examples

### Basic Graph Dashboard

```tsx
import { GraphDashboard } from '@/components/graph';

export default function KnowledgeGraphPage() {
  return (
    <div className="container mx-auto py-8">
      <GraphDashboard />
    </div>
  );
}
```

### Custom Graph Configuration

```tsx
import { VirtualizedGraphVisualization } from '@/components/graph';

export default function CustomGraphView() {
  const { nodes, relationships, supplements, isLoading } = useGraphData({
    maxNodes: 1000,
    includeEvidenceLevels: ['STRONG', 'MODERATE'],
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <VirtualizedGraphVisualization
      nodes={nodes}
      relationships={relationships}
      supplements={supplements}
      width={1200}
      height={800}
      maxRenderNodes={500}
    />
  );
}
```

### Performance-Optimized Large Dataset Visualization

```tsx
import { VirtualizedGraphVisualization } from '@/components/graph';
import { useLazyGraphDataLoader } from '@/lib/performance/graph-performance-optimizations';

const LargeDatasetGraph = () => {
  const { nodes, relationships, isLoading, hasMore, loadMore } = useLazyGraphDataLoader(100, 50);
  
  return (
    <div className="flex flex-col h-full">
      <VirtualizedGraphVisualization
        nodes={nodes}
        relationships={relationships}
        width={1200}
        height={800}
        maxRenderNodes={500}
        enablePhysics={false}
        onViewportChange={loadMore}
      />
      
      {hasMore && (
        <Button 
          onClick={loadMore} 
          disabled={isLoading}
          className="mt-4 mx-auto"
        >
          {isLoading ? 'Ładowanie...' : 'Załaduj więcej'}
        </Button>
      )}
    </div>
  );
};
```

## Component APIs

### GraphDashboard Props

```typescript
interface GraphDashboardProps {
  nodes: KnowledgeNode[];
  relationships: KnowledgeRelationship[];
  supplements: SupplementWithRelations[];
  width?: number;
  height?: number;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
  onNodeSelect?: (node: KnowledgeNode) => void;
  onRelationshipSelect?: (relationship: KnowledgeRelationship) => void;
}
```

### D3GraphVisualization Props

```typescript
interface D3GraphVisualizationProps {
  nodes: KnowledgeNode[];
  relationships: KnowledgeRelationship[];
  supplements: SupplementWithRelations[];
  width?: number;
  height?: number;
  nodeSize?: number;
  linkDistance?: number;
  enablePhysics?: boolean;
  className?: string;
  onNodeClick?: (node: KnowledgeNode) => void;
  onNodeHover?: (node: KnowledgeNode | null) => void;
}
```

### VirtualizedGraphVisualization Props

```typescript
interface VirtualizedGraphVisualizationProps {
  nodes: KnowledgeNode[];
  relationships: KnowledgeRelationship[];
  supplements: SupplementWithRelations[];
  width?: number;
  height?: number;
  maxRenderNodes?: number;
  enablePhysics?: boolean;
  className?: string;
  onNodeClick?: (node: KnowledgeNode) => void;
  onNodeHover?: (node: KnowledgeNode | null) => void;
}
```

### ConnectionVisualization Props

```typescript
interface ConnectionVisualizationProps {
  nodes: KnowledgeNode[];
  relationships: KnowledgeRelationship[];
  sourceNodeId: string;
  width?: number;
  height?: number;
  className?: string;
}
```

## Performance Guidelines

### For Datasets < 100 Nodes
- Use `D3GraphVisualization` for detailed interactions
- Enable physics simulation for dynamic layouts
- All visualization features are available

### For Datasets 100-500 Nodes
- Use `D3GraphVisualization` with physics disabled for static views
- Consider filtering to reduce dataset size
- Canvas-based rendering is recommended

### For Datasets > 500 Nodes
- Use `VirtualizedGraphVisualization` exclusively
- Disable physics simulation
- Implement lazy loading for progressive data loading
- Limit `maxRenderNodes` to 500 for optimal performance

## Accessibility Standards

All graph components comply with WCAG 2.1 AA standards:

1. **Keyboard Navigation**: Full keyboard support with tab indexing
2. **Screen Reader Compatibility**: ARIA labels and live regions
3. **Color Contrast**: Minimum 4.5:1 contrast ratios
4. **Focus Management**: Visible focus indicators
5. **Semantic Structure**: Proper heading hierarchy and landmarks

### Polish Localization Accessibility

- All ARIA labels translated to Polish
- Keyboard shortcuts adapted for Polish keyboards
- Cultural considerations for visual metaphors
- Right-to-left support prepared for future languages

## Testing

### Unit Tests
All components have comprehensive unit tests covering:
- Rendering and basic functionality
- Event handling and user interactions
- State management and updates
- Error handling and edge cases

### Integration Tests
- Full system workflow testing
- Data flow between components
- API integration points
- Performance benchmarks

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation
- Color contrast compliance
- Semantic structure validation

## Export/Import Capabilities

### Supported Formats
1. **JSON** - Raw graph data export
2. **PNG** - Static image export
3. **SVG** - Scalable vector graphics export
4. **PDF** - Printable document export (future)

### Import Features
- **JSON Import** - Restore graph configurations from exported data
- **Template Import** - Apply predefined graph templates
- **Merge Functionality** - Combine multiple graph datasets

## Data Integration

### MongoDB Integration
The graph system integrates with the existing MongoDB supplement database through:
- Prisma ORM for data access
- Knowledge graph store for state management
- Graph data service for data transformation

### External API Integration
- PubMed API for latest research data
- ClinicalTrials.gov for trial information
- Nutritional databases for supplement data

### Real-time Updates
- WebSocket connections for live data updates
- Push notifications for new research findings
- Automatic data synchronization

## Customization

### Styling
All components use Tailwind CSS classes and can be customized:
- ClassName prop for additional styling
- CSS variables for theming
- Component variants for different appearances

### Layout Options
- Force-directed layout (D3)
- Circular layout (Cytoscape)
- Hierarchical layout (Cytoscape)
- Grid layout (Cytoscape)
- Concentric layout (Cytoscape)

### Performance Tuning
- Adjustable node limits
- Configurable physics parameters
- Custom rendering thresholds
- Memory usage optimization

## Future Enhancements

### Planned Features
1. **3D Visualization** - Three-dimensional graph rendering
2. **Machine Learning Integration** - AI-powered relationship discovery
3. **Real-time Collaboration** - Multi-user graph editing
4. **Advanced Analytics** - Statistical analysis and insights
5. **Mobile Optimization** - Touch-friendly mobile interface

### Performance Improvements
1. **WebAssembly Integration** - Faster computation with WASM
2. **GPU Acceleration** - WebGL-based rendering enhancements
3. **Progressive Loading** - Streaming large dataset loading
4. **Caching Strategy** - Intelligent data caching

## Troubleshooting

### Common Issues

1. **Slow Performance with Large Datasets**
   - Solution: Use VirtualizedGraphVisualization component
   - Solution: Reduce maxRenderNodes property
   - Solution: Disable physics simulation

2. **Accessibility Audit Failures**
   - Solution: Use AccessibleGraphLegend component
   - Solution: Check color contrast ratios
   - Solution: Verify focus management

3. **Data Synchronization Issues**
   - Solution: Check GraphDatabaseIntegrationService
   - Solution: Verify API endpoints
   - Solution: Review data transformation mappings

## Best Practices

### Performance Recommendations
1. Limit rendered nodes to 500 for optimal performance
2. Use filtering to reduce dataset size before rendering
3. Disable physics simulation for static visualizations
4. Use canvas-based rendering for large datasets
5. Implement progressive loading for very large datasets

### Accessibility Guidelines
1. Always use AccessibleGraphLegend for WCAG compliance
2. Maintain proper color contrast ratios (4.5:1 minimum)
3. Implement full keyboard navigation support
4. Provide meaningful ARIA labels and descriptions
5. Test with screen readers regularly

### Internationalization
1. Keep Polish translations up to date
2. Use proper text direction for RTL languages
3. Consider cultural differences in visual metaphors
4. Maintain consistent terminology across translations

## Contributing

When adding new graph components or modifying existing ones:

1. Follow the established patterns for props and TypeScript interfaces
2. Include comprehensive test coverage
3. Ensure accessibility compliance
4. Provide Polish localization for all text
5. Document component usage in this guide
6. Maintain consistent styling with the design system
7. Consider performance implications for large datasets