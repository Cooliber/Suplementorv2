# BrainSupplementCard Component

## Overview

The `BrainSupplementCard` is an educational component designed for the Suplementor platform to display comprehensive information about brain supplements with Polish localization support and interactive brain region visualization.

## Features

### Core Functionality
- **Educational Content**: Displays detailed supplement information including mechanisms of action, research evidence, and safety profiles
- **Polish Localization**: Full support for Polish language with medical terminology validation
- **Interactive Brain Visualization**: Visual representation of supplement effects on brain regions
- **Progress Tracking**: Optional learning progress tracking for educational modules
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support

### Polish Localization Features
- Medical terminology (mózg, witamina, terapia, etc.)
- Polish character support (ą, ć, ę, ł, ń, ó, ś, ź, ż)
- Cultural context for Polish healthcare system
- EU medical regulation compliance

### Interactive Features
- Clickable brain regions with detailed information
- Tabbed interface for organized content
- Bookmark functionality
- Progress tracking integration
- Responsive design for all screen sizes

## Usage

### Basic Usage

```tsx
import { BrainSupplementCard } from '@/components/BrainSupplementCard';

function SupplementPage() {
  return (
    <BrainSupplementCard
      supplement={supplementData}
      language="pl"
      interactive={true}
      showBrainVisualization={true}
    />
  );
}
```

### Advanced Usage with Event Handlers

```tsx
import { BrainSupplementCard, type BrainRegion } from '@/components/BrainSupplementCard';

function InteractiveSupplementPage() {
  const handleRegionClick = (region: BrainRegion) => {
    console.log('Selected brain region:', region.polishName);
  };

  const handleBookmark = (supplementId: string) => {
    // Handle bookmark logic
  };

  return (
    <BrainSupplementCard
      supplement={supplementData}
      language="pl"
      interactive={true}
      showBrainVisualization={true}
      showProgressTracking={true}
      allowBookmark={true}
      onRegionClick={handleRegionClick}
      onBookmark={handleBookmark}
    />
  );
}
```

## Props

### Required Props
- `supplement: BrainSupplementData` - The supplement data to display

### Optional Props
- `variant?: 'default' | 'compact' | 'detailed' | 'educational'` - Display variant (default: 'default')
- `size?: 'small' | 'medium' | 'large'` - Component size (default: 'medium')
- `language?: 'pl' | 'en'` - Display language (default: 'pl')
- `interactive?: boolean` - Enable interactive features (default: true)
- `showBrainVisualization?: boolean` - Show brain visualization (default: true)
- `showProgressTracking?: boolean` - Show progress tracking (default: false)
- `allowBookmark?: boolean` - Enable bookmark functionality (default: true)

### Accessibility Props
- `ariaLabel?: string` - Custom ARIA label
- `ariaDescription?: string` - Custom ARIA description
- `highContrast?: boolean` - High contrast mode
- `reducedMotion?: boolean` - Reduced motion mode

### Event Handlers
- `onRegionClick?: (region: BrainRegion) => void` - Brain region click handler
- `onSupplementClick?: (supplement: BrainSupplementData) => void` - Supplement click handler
- `onBookmark?: (supplementId: string) => void` - Bookmark handler
- `onProgressUpdate?: (progress: number) => void` - Progress update handler

## Data Structure

### BrainSupplementData Interface

```typescript
interface BrainSupplementData {
  id: string;
  name: string;
  polishName: string;
  scientificName?: string;
  category: 'vitamin' | 'mineral' | 'herb' | 'amino-acid' | 'nootropic' | 'adaptogen';
  polishCategory: string;

  // Content
  description: string;
  polishDescription: string;
  educationalContent: {
    howItWorks: string;
    polishHowItWorks: string;
    researchSummary: string;
    polishResearchSummary: string;
    safetyProfile: string;
    polishSafetyProfile: string;
  };

  // Brain regions
  primaryBrainRegions: BrainRegion[];
  secondaryBrainRegions: BrainRegion[];
  affectedSystems: string[];
  polishAffectedSystems: string[];

  // Evidence
  evidenceLevel: 'weak' | 'moderate' | 'strong' | 'very-strong';
  studyCount: number;
  participantCount: number;
  effectSize: number;

  // Safety
  contraindications: string[];
  polishContraindications: string[];
  sideEffects: {
    common: string[];
    uncommon: string[];
    rare: string[];
  };
  interactions: string[];
  polishInteractions: string[];
}
```

### BrainRegion Interface

```typescript
interface BrainRegion {
  id: string;
  name: string;
  polishName: string;
  description: string;
  polishDescription: string;
  coordinates: { x: number; y: number; z?: number };
  functions: string[];
  polishFunctions: string[];
  supplementEffects: SupplementEffect[];
  color: string;
  size: 'small' | 'medium' | 'large';
}
```

## Testing

### Setup Requirements

To run the comprehensive test suite, install the required testing dependencies:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @types/jest jest-axe
```

### Test Categories

The component includes comprehensive tests for:

1. **Rendering Tests**
   - Default props rendering
   - Polish/English content switching
   - Evidence badge display
   - Component variants

2. **Polish Character Validation**
   - Polish character rendering (ą, ć, ę, ł, ń, ó, ś, ź, ż)
   - Medical terminology validation
   - Mixed language content handling

3. **Interactive Features**
   - Brain region click events
   - Tab navigation
   - Bookmark functionality
   - Progress tracking

4. **Accessibility Tests**
   - WCAG 2.1 AA compliance
   - Screen reader support
   - Keyboard navigation
   - High contrast mode

5. **Performance Tests**
   - Render time validation
   - Large dataset handling
   - Memory usage optimization

### Running Tests

```bash
# Run all component tests
npm test BrainSupplementCard

# Run with coverage
npm test -- --coverage --testPathPattern=BrainSupplementCard

# Run accessibility tests
npm test -- --testNamePattern="accessibility"
```

## Accessibility Features

### WCAG 2.1 AA Compliance
- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility

### Polish Accessibility
- Polish language screen reader support
- Proper pronunciation of Polish medical terms
- Cultural context considerations
- High contrast mode for visual impairments

### Keyboard Navigation
- Tab order management
- Focus indicators
- Skip links
- Enter/Space activation

## Performance Optimizations

### Bundle Size
- Tree-shakeable component design
- Lazy loading support
- Optimized re-renders with React.memo
- Minimal external dependencies

### Runtime Performance
- Virtual scrolling for large brain region lists
- Memoized calculations
- Efficient state management
- Image lazy loading

### Loading States
- Skeleton loading for brain visualization
- Progressive content loading
- Error boundaries
- Retry mechanisms

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Accessibility**: NVDA, JAWS, VoiceOver support
- **Polish Fonts**: Proper rendering of Polish characters across all supported browsers

## Integration Examples

### With Assessment System

```tsx
import { BrainSupplementCard } from '@/components/BrainSupplementCard';
import { AssessmentEngine } from '@/lib/assessment';

function AssessmentModule() {
  const [currentSupplement, setCurrentSupplement] = useState(null);

  return (
    <div>
      <AssessmentEngine onSupplementSelect={setCurrentSupplement} />
      {currentSupplement && (
        <BrainSupplementCard
          supplement={currentSupplement}
          showProgressTracking={true}
          onProgressUpdate={(progress) => {
            // Update assessment progress
          }}
        />
      )}
    </div>
  );
}
```

### With Progress Tracking

```tsx
import { BrainSupplementCard } from '@/components/BrainSupplementCard';
import { ProgressTracker } from '@/components/ProgressTracker';

function LearningModule() {
  const [progress, setProgress] = useState(0);

  return (
    <div>
      <ProgressTracker value={progress} />
      <BrainSupplementCard
        supplement={supplementData}
        showProgressTracking={true}
        onProgressUpdate={setProgress}
      />
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **Polish Characters Not Displaying**
   - Ensure UTF-8 encoding
   - Check font support for Polish characters
   - Verify browser language settings

2. **Brain Visualization Not Loading**
   - Check WebGL support
   - Verify brain region data structure
   - Ensure coordinates are within valid ranges

3. **Accessibility Issues**
   - Run accessibility audit with testing library
   - Check ARIA labels and descriptions
   - Verify keyboard navigation

### Performance Issues

1. **Slow Rendering**
   - Enable lazy loading
   - Reduce brain region complexity
   - Optimize image sizes

2. **High Memory Usage**
   - Implement virtual scrolling for large datasets
   - Use React.memo for expensive components
   - Clean up event listeners

## Contributing

When contributing to this component:

1. **Follow TypeScript Best Practices**
   - Use strict type checking
   - Include JSDoc comments
   - Follow existing naming conventions

2. **Maintain Polish Localization**
   - Add Polish translations for new features
   - Validate medical terminology
   - Test Polish character rendering

3. **Ensure Accessibility**
   - Test with screen readers
   - Verify keyboard navigation
   - Run accessibility audits

4. **Update Tests**
   - Add tests for new features
   - Update existing tests for changes
   - Ensure Polish character validation

## Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added brain visualization features
- **v1.2.0**: Enhanced Polish localization
- **v1.3.0**: Improved accessibility features
- **v1.4.0**: Added progress tracking integration

## License

This component is part of the Suplementor platform and follows the project's licensing terms.