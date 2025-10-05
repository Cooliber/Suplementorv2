# Component Development Prompt Template

## Context
Development of React components for the Suplementor Polish educational platform with focus on TypeScript safety, Polish localization, and educational effectiveness.

## Component Development Prompt

```
Create a [COMPONENT_TYPE] component for the Suplementor platform with the following requirements:

### Technical Specifications
- **Framework**: Next.js 15 App Router with React 19
- **Language**: TypeScript 5.8+ with strict mode
- **Styling**: TailwindCSS 4+ with shadcn/ui components
- **State Management**: Zustand for complex state, React hooks for local state
- **Accessibility**: WCAG 2.1 AA compliance with Polish screen reader support

### Polish Localization Requirements
- **Primary Language**: Polish (pl-PL) with fallback to English
- **Medical Terminology**: Use approved Polish medical dictionary terms
- **Character Support**: Full support for ą, ć, ę, ł, ń, ó, ś, ź, ż
- **Cultural Context**: Appropriate for Polish healthcare and educational systems
- **Currency Format**: Euro pricing in "od X,XX €" format

### Component Structure
```typescript
interface [COMPONENT_NAME]Props {
  // Define props with Polish localization support
  data: [DATA_TYPE];
  language?: 'pl' | 'en';
  onAction?: (action: [ACTION_TYPE]) => void;
  className?: string;
  // ... other props
}

export function [COMPONENT_NAME]({
  data,
  language = 'pl',
  onAction,
  className,
  ...props
}: [COMPONENT_NAME]Props) {
  // Implementation with Polish localization hooks
}
```

### Educational Integration
- **Learning Objectives**: Clear educational goals for component usage
- **Interactive Elements**: Engaging user interactions for learning
- **Progress Tracking**: Integration with learning progress system
- **Assessment Integration**: Support for quiz and evaluation features

### Performance Requirements
- **Loading Time**: Component renders within 200ms
- **Bundle Size**: Minimize impact on overall bundle size
- **Mobile Optimization**: Responsive design for mobile devices
- **3D Compatibility**: If applicable, optimize for WebGL rendering

### Quality Assurance
- **Type Safety**: Full TypeScript coverage with no any types
- **Testing**: Unit tests with Polish localization validation
- **Accessibility**: Screen reader and keyboard navigation support
- **Error Handling**: Graceful degradation and error boundaries

Generate the complete component implementation with:
1. TypeScript interface definitions
2. Component implementation with Polish localization
3. Styling with TailwindCSS and shadcn/ui
4. Unit tests with Polish character validation
5. Storybook stories for documentation
6. Accessibility features and ARIA labels
```

## Expected Output Structure

### 1. Type Definitions
```typescript
// types/[component-name].ts
export interface [ComponentName]Props {
  // Comprehensive type definitions
}

export interface [ComponentName]Data {
  // Data structure with Polish localization
}
```

### 2. Component Implementation
```typescript
// components/[component-name].tsx
import { usePolishLocalization } from '@/lib/hooks/use-polish-localization';

export function [ComponentName](props: [ComponentName]Props) {
  // Implementation with Polish support
}
```

### 3. Styling
```typescript
// Tailwind classes with responsive design
const componentStyles = {
  container: "w-full rounded-lg border bg-card text-card-foreground shadow-sm",
  header: "flex flex-col space-y-1.5 p-6",
  content: "p-6 pt-0",
  // ... other styles
};
```

### 4. Tests
```typescript
// __tests__/[component-name].test.tsx
describe('[ComponentName]', () => {
  test('renders Polish text correctly', () => {
    // Polish character rendering tests
  });
  
  test('handles Polish localization', () => {
    // Localization functionality tests
  });
});
```

### 5. Documentation
```typescript
// [component-name].stories.tsx
export default {
  title: 'Components/[ComponentName]',
  component: [ComponentName],
  parameters: {
    docs: {
      description: {
        component: 'Polish educational component for Suplementor platform'
      }
    }
  }
};
```

## Quality Checklist

### Technical Requirements
- [ ] TypeScript 5.8+ strict mode compliance
- [ ] Next.js 15 App Router compatibility
- [ ] TailwindCSS 4+ styling implementation
- [ ] shadcn/ui component integration
- [ ] Zustand state management (if needed)

### Polish Localization
- [ ] All user-facing text in Polish
- [ ] Medical terminology accuracy verified
- [ ] Polish character rendering tested
- [ ] Cultural appropriateness confirmed
- [ ] EU regulatory compliance maintained

### Educational Standards
- [ ] Clear learning objectives defined
- [ ] Interactive elements implemented
- [ ] Progress tracking integration
- [ ] Assessment compatibility ensured
- [ ] Scientific accuracy verified

### Performance & Accessibility
- [ ] WCAG 2.1 AA compliance achieved
- [ ] Mobile responsiveness confirmed
- [ ] Loading performance optimized
- [ ] Error handling implemented
- [ ] Screen reader compatibility tested

## Related Files
- Polish localization hooks: `src/lib/hooks/use-polish-localization.ts`
- Component library: `src/components/ui/`
- Type definitions: `src/types/`
- Testing utilities: `src/__tests__/utils/`
- Storybook configuration: `.storybook/`
