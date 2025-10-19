# Contributing to Suplementor

## Welcome Contributors! 👋

Thank you for your interest in contributing to Suplementor, the comprehensive Polish supplement education platform. We welcome contributions from developers, medical professionals, translators, and anyone passionate about evidence-based supplement education.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Polish Localization](#polish-localization)
- [Medical Content Guidelines](#medical-content-guidelines)
- [Pull Request Process](#pull-request-process)
- [Community Guidelines](#community-guidelines)

## Getting Started

### Prerequisites

- **Node.js 20+** (LTS recommended)
- **Bun 1.1.38+** (recommended for better performance)
- **Git** for version control
- **Basic knowledge** of React, Next.js, and TypeScript

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/suplementor.git
   cd suplementor
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   bun run dev
   ```

5. **Run tests**
   ```bash
   bun run test
   ```

## Development Process

### Branch Strategy

We use a structured branching strategy:

```
main          # Production-ready code
├── develop   # Development branch
    ├── feature/supplement-categories  # New features
    ├── bugfix/accessibility-issues    # Bug fixes
    ├── refactor/component-optimization # Refactoring
    └── hotfix/critical-security       # Critical fixes
```

### Feature Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

2. **Develop your feature**
   - Follow TypeScript strict mode
   - Include comprehensive tests
   - Add Polish translations
   - Update documentation

3. **Run quality checks**
   ```bash
   bun run check  # Runs lint, typecheck, and tests
   ```

4. **Commit with conventional commits**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature

   - Add new supplement category
   - Include Polish translations
   - Add comprehensive tests
   - Update documentation"
   ```

5. **Push and create Pull Request**
   ```bash
   git push origin feature/amazing-new-feature
   ```

## Code Standards

### TypeScript Guidelines

#### Strict Mode Requirements
- All code must pass TypeScript strict mode
- No `any` types without explicit justification
- Proper null/undefined handling

```typescript
// ✅ Good
interface Supplement {
  id: string;
  name: string;
  polishName: string;
  category: SupplementCategory;
}

const getSupplement = (id: string): Promise<Supplement | null> => {
  // Implementation
};

// ❌ Avoid
const getSupplement = (id: any): any => {
  // Implementation
};
```

#### Interface and Type Best Practices
- Use interfaces for object shapes
- Use union types for discriminated unions
- Export types for reusable interfaces

### Component Development

#### File Structure
```
src/components/
├── FeatureComponent/
│   ├── FeatureComponent.tsx     # Main component
│   ├── FeatureComponent.test.tsx # Tests
│   ├── index.ts                 # Exports
│   └── types.ts                 # Local types
```

#### Component Guidelines
- **Props Interface**: Define clear prop interfaces
- **Accessibility**: Include proper ARIA labels
- **Polish Translation**: All user-facing text in Polish
- **Responsive Design**: Mobile-first approach

```typescript
// ✅ Good Component
interface SupplementCardProps {
  supplement: Supplement;
  onSelect?: (supplement: Supplement) => void;
  className?: string;
}

export const SupplementCard: React.FC<SupplementCardProps> = ({
  supplement,
  onSelect,
  className
}) => {
  return (
    <Card className={cn("p-4 hover:shadow-lg transition-shadow", className)}>
      <h3 className="text-lg font-semibold">{supplement.polishName}</h3>
      <p className="text-sm text-muted-foreground">{supplement.description}</p>
      <button
        onClick={() => onSelect?.(supplement)}
        className="sr-only"
        aria-label={`Zobacz szczegóły suplementu ${supplement.polishName}`}
      >
        Szczegóły
      </button>
    </Card>
  );
};
```

### State Management

#### Zustand Store Guidelines
- Use slice pattern for complex state
- Include proper TypeScript types
- Implement proper error handling

```typescript
// ✅ Good Store
interface SupplementState {
  supplements: Supplement[];
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSupplements: (supplements: Supplement[]) => void;
  setSelectedCategory: (category: string | null) => void;
  fetchSupplements: () => Promise<void>;
}

export const useSupplementStore = create<SupplementState>()(
  devtools(
    (set, get) => ({
      // State
      supplements: [],
      selectedCategory: null,
      isLoading: false,
      error: null,

      // Actions
      setSupplements: (supplements) => set({ supplements }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      fetchSupplements: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/supplements');
          const supplements = await response.json();
          set({ supplements, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Błąd podczas ładowania',
            isLoading: false
          });
        }
      }
    }),
    { name: 'supplement-store' }
  )
);
```

## Testing Requirements

### Test Coverage Requirements

- **Unit Tests**: 80% coverage for new code
- **Integration Tests**: Critical user journeys
- **E2E Tests**: Main user workflows
- **Accessibility Tests**: WCAG 2.1 AA compliance

### Testing Patterns

#### Unit Tests
```typescript
describe('SupplementCard', () => {
  const mockSupplement: Supplement = {
    id: '1',
    name: 'L-Theanine',
    polishName: 'L-Teanina',
    category: 'nootropics',
    // ... other properties
  };

  it('should render Polish supplement name', () => {
    render(<SupplementCard supplement={mockSupplement} />);
    expect(screen.getByText('L-Teanina')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleSelect = vi.fn();
    render(<SupplementCard supplement={mockSupplement} onSelect={handleSelect} />);

    // Test interaction
  });
});
```

#### Integration Tests
```typescript
describe('Supplement Search Integration', () => {
  it('should search and display results in Polish', async () => {
    render(<SupplementSearch />);

    const searchInput = screen.getByPlaceholderText('Szukaj suplementów');
    await userEvent.type(searchInput, 'koncentracja');

    await waitFor(() => {
      expect(screen.getByText('L-Teanina')).toBeInTheDocument();
    });
  });
});
```

## Polish Localization

### Translation Requirements

All user-facing content must include Polish translations:

#### Required Fields
- `name` and `polishName`
- `description` and `polishDescription`
- `benefits` and `polishBenefits`
- `warnings` and `polishWarnings`

#### Medical Terminology
- Use official Polish medical dictionary terms
- Consult with medical professionals for accuracy
- Include both scientific and common names

```typescript
// ✅ Good
const supplementData = {
  name: "L-Theanine",
  polishName: "L-Teanina",
  description: "Amino acid promoting relaxation",
  polishDescription: "Aminokwas wspomagający relaksację",
  benefits: ["Reduces stress", "Improves focus"],
  polishBenefits: ["Zmniejsza stres", "Poprawia koncentrację"],
  category: "nootropics",
  polishCategory: "nootropiki"
};
```

### Localization Testing

Test Polish translations in context:
- Verify text fits in UI components
- Check pluralization rules
- Validate date/number formatting

## Medical Content Guidelines

### Evidence-Based Information

#### Research Requirements
- All health claims must cite peer-reviewed research
- Include evidence levels (high, medium, low)
- Regular review by medical professionals

#### Safety Information
- Comprehensive interaction warnings
- Contraindication documentation
- Side effect profiles

### Healthcare Professional Involvement

- Medical content reviewed by qualified professionals
- Regular updates based on latest research
- Clear disclaimers about supplement information

## Pull Request Process

### PR Requirements

#### 1. Quality Checks
- [ ] All tests pass
- [ ] TypeScript compilation successful
- [ ] ESLint checks pass
- [ ] Prettier formatting applied

#### 2. Documentation
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Component documentation included

#### 3. Polish Localization
- [ ] All user-facing text translated to Polish
- [ ] Medical terminology validated
- [ ] UI accommodates Polish text length

#### 4. Testing
- [ ] Unit tests included for new functionality
- [ ] Integration tests for user workflows
- [ ] Accessibility tests pass

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Accessibility tests pass

## Polish Localization

- [ ] All user-facing text translated
- [ ] Medical terminology validated
- [ ] UI tested with Polish content

## Screenshots

Add screenshots if UI changes are included

## Related Issues

Closes #issue-number

## Checklist

- [ ] Code follows project standards
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Polish translations complete
- [ ] Accessibility compliant
```

## Community Guidelines

### Code of Conduct

- **Respectful Communication**: Be kind and inclusive
- **Constructive Feedback**: Focus on code, not people
- **Inclusive Language**: Use gender-neutral and accessible language
- **Cultural Sensitivity**: Respect Polish culture and medical practices

### Reporting Issues

When reporting bugs or requesting features:

1. **Search existing issues** first
2. **Use clear, descriptive titles**
3. **Include reproduction steps** for bugs
4. **Provide context** for feature requests
5. **Include screenshots** when relevant

### Feature Requests

For new features:
- Explain the use case clearly
- Consider Polish market requirements
- Think about medical accuracy
- Consider accessibility implications

## Getting Help

### Resources
- **Documentation**: Check `/docs` directory
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions for questions
- **Medical Consultation**: Consult healthcare professionals for medical content

### Contact
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Community Q&A
- **Email**: For security issues or sensitive matters

## Recognition

Contributors are recognized for:
- Code contributions
- Documentation improvements
- Translation work
- Medical content review
- Community support

---

Thank you for contributing to Suplementor! Your work helps provide accurate, evidence-based supplement education to Polish users. 🇵🇱