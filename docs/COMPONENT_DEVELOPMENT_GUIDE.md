# Component Development Guide

## Overview

This guide provides comprehensive instructions for developing components in the Suplementor platform using the automated component generation system.

## Development Environment Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- MongoDB (for database features)
- Git

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd suplementor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup development environment:**
   ```bash
   npm run dev:setup
   ```

4. **Configure environment variables:**
   - Review `.env.local`
   - Add required API keys
   - Update database settings if needed

5. **Start development server:**
   ```bash
   npm run dev
   ```

## Component Development Workflow

### 1. Planning Phase

Before creating a component:

- **Define the purpose**: What problem does it solve?
- **Identify the type**: UI, Feature, Page, or Layout?
- **Consider localization**: Will it need Polish translations?
- **Accessibility requirements**: WCAG 2.1 AA compliance needed?
- **Performance considerations**: Will it handle large datasets?

### 2. Component Generation

Use the interactive component generator:

```bash
npm run generate:component
```

**Generation Options:**

- **Component Name**: PascalCase (e.g., `SupplementCard`)
- **Type**: Choose from UI, Feature, Page, Layout
- **Description**: Brief description of functionality
- **Features**: Select required features (localization, accessibility, etc.)

### 3. Development Phase

#### File Structure

Generated components follow this structure:

```
src/components/[ComponentName]/
├── index.ts                    # Public API
├── [ComponentName].tsx         # Main component
├── [ComponentName].test.tsx    # Tests
├── [ComponentName].stories.tsx # Storybook stories
├── types.ts                    # TypeScript definitions
└── README.md                   # Component documentation
```

#### Development Best Practices

**TypeScript:**
- Use strict TypeScript settings
- Define proper interfaces for props
- Use generic types when appropriate
- Include JSDoc comments for complex logic

**Polish Localization:**
```typescript
import { usePolishLocalization } from '@/lib/hooks/use-polish-localization';

function MyComponent() {
  const { t, formatMedicalTerm } = usePolishLocalization();

  return (
    <div>
      <h1>{t('myComponent.title', 'My Component')}</h1>
      <p>{formatMedicalTerm('brain', 'mózg')}</p>
    </div>
  );
}
```

**Accessibility:**
- Use semantic HTML elements
- Include ARIA labels and descriptions
- Ensure keyboard navigation
- Test with screen readers

**Performance:**
- Use React.memo for expensive components
- Implement proper loading states
- Optimize re-renders with useMemo/useCallback
- Consider virtualization for large lists

### 4. Testing Phase

#### Running Tests

```bash
# Run all tests
npm test

# Run component tests only
npm run test:run -- --testPathPattern=components

# Run with coverage
npm run test:coverage
```

#### Writing Tests

**Component Tests:**
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays Polish text correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('mózg')).toBeInTheDocument();
  });
});
```

**Localization Tests:**
```typescript
import { validatePolishText } from '@/lib/localization/validation';

describe('Polish Localization', () => {
  it('validates Polish characters', () => {
    const result = validatePolishText(' mózg i serce');
    expect(result.isValid).toBe(true);
  });
});
```

### 5. Validation Phase

#### Component Validation

```bash
# Validate all components
npm run validate:components

# Validate localization
npm run localization:validate

# Type checking
npm run typecheck:dev
```

#### Manual Validation Checklist

- [ ] TypeScript compilation passes
- [ ] Polish characters render correctly
- [ ] Accessibility features work
- [ ] Performance is acceptable
- [ ] Tests pass
- [ ] Storybook stories render
- [ ] Localization is complete

### 6. Documentation Phase

Update component documentation:

- **README.md**: Component purpose, props, examples
- **Inline comments**: Complex logic explanations
- **JSDoc**: Function and interface documentation
- **Storybook**: Usage examples

## Advanced Features

### Custom Templates

To create custom component templates:

1. Add template files to `scripts/component-generator/templates/`
2. Update `template-engine.ts` to include new templates
3. Modify `file-structure.ts` for new file patterns

### Extending Localization

To add new translations:

1. Add entries to `src/lib/localization/dictionary.ts`
2. Update validation rules in `src/lib/localization/validation.ts`
3. Test with `npm run localization:validate`

### Performance Optimization

For high-performance components:

1. Enable performance monitoring in component generator
2. Use React DevTools Profiler
3. Implement proper memoization
4. Consider code splitting for large components

## Troubleshooting

### Common Issues

**1. TypeScript Errors:**
```bash
npm run typecheck:dev
```
- Check import paths
- Verify TypeScript configuration
- Update type definitions

**2. Polish Character Issues:**
```bash
npm run localization:validate
```
- Check file encoding (UTF-8)
- Verify font support
- Test in different browsers

**3. Component Generation Fails:**
```bash
npm run validate:components
```
- Check file permissions
- Verify template integrity
- Review error logs

**4. Performance Issues:**
- Use React DevTools Profiler
- Check for unnecessary re-renders
- Optimize expensive operations

### Getting Help

1. **Check logs**: Review console output for error messages
2. **Validate setup**: Run `npm run dev:setup` to verify environment
3. **Test incrementally**: Build and test components step by step
4. **Community resources**: Check documentation and examples

## Deployment

### Pre-deployment Checklist

- [ ] All tests pass
- [ ] TypeScript compilation succeeds
- [ ] Localization validation passes
- [ ] Accessibility requirements met
- [ ] Performance benchmarks satisfied
- [ ] Documentation is complete
- [ ] Code review completed

### Build Process

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Best Practices Summary

1. **Plan thoroughly** before generating components
2. **Use TypeScript** for type safety
3. **Implement Polish localization** for all user-facing text
4. **Ensure accessibility** compliance
5. **Write comprehensive tests**
6. **Document everything** clearly
7. **Validate continuously** during development
8. **Optimize performance** proactively
9. **Follow consistent patterns** across components
10. **Keep components focused** and reusable

## Support

For additional support:

- Review the component generator documentation
- Check existing component examples
- Use the validation tools
- Consult the development team

---

*This guide is part of the Suplementor platform documentation. Last updated: 2025-09-29*