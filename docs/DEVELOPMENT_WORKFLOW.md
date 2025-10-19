# Development Workflow Guide

## 🚀 Daily Development Workflow

### 🌅 Start of Day Routine

```bash
# 1. Update your local environment
git checkout develop
git pull origin develop

# 2. Install latest dependencies
bun install

# 3. Run quality checks
bun run check

# 4. Start development server
bun run dev
```

### 🔄 Development Cycle

#### For New Features
```bash
# 1. Create feature branch
git checkout -b feature/supplement-categories

# 2. Develop incrementally with tests
bun run test:watch  # Run tests in watch mode

# 3. Commit frequently with conventional commits
git add .
git commit -m "feat: add supplement category filter

- Add dropdown component for category selection
- Implement filtering logic in Zustand store
- Add Polish translations for all categories
- Include unit tests for filter functionality"

# 4. Push for continuous integration
git push origin feature/supplement-categories
```

#### For Bug Fixes
```bash
# 1. Create bugfix branch
git checkout -b bugfix/accessibility-navbar

# 2. Reproduce and fix the issue
# Test the fix thoroughly

# 3. Commit with clear description
git add .
git commit -m "fix: resolve navbar accessibility issue

- Add proper ARIA labels to navigation elements
- Fix keyboard navigation for dropdown menus
- Ensure screen reader compatibility
- Add tests for accessibility compliance"

# 4. Push for immediate review
git push origin bugfix/accessibility-navbar
```

### 🔍 Code Quality Workflow

#### Before Committing
```bash
# 1. Run all quality checks
bun run check

# 2. Run test suite
bun run test:all

# 3. Check TypeScript compilation
bun run typecheck

# 4. Validate Polish translations
bun run localization:validate

# 5. Check accessibility
bun run test:a11y
```

#### Pre-Push Checklist
- [ ] All tests pass
- [ ] TypeScript compilation successful
- [ ] Code formatted with Biome
- [ ] ESLint checks pass
- [ ] Accessibility tests pass
- [ ] Polish translations complete
- [ ] Performance impact assessed

### 🏥 Medical Content Development

#### For Medical Content Changes
```bash
# 1. Research and gather evidence
# Cite peer-reviewed sources
# Consult medical professionals

# 2. Create content with proper structure
# Include English and Polish versions
# Add evidence levels and citations

# 3. Submit for medical review
# Use medical content issue template
# Provide all source materials

# 4. Implement after approval
# Follow medical review board feedback
# Include professional review notes
```

### 🌍 Localization Workflow

#### Adding Polish Translations
```typescript
// 1. Add to translation files
// src/lib/locales/pl/medical-terms.json
{
  "supplement": "suplement",
  "nootropics": "nootropiki",
  "cognitiveEnhancement": "poprawaFunkcjiPoznawczych",
  "neuroprotection": "neuroprotekcja"
}

// 2. Use in components with proper typing
interface LocalizedText {
  en: string;
  pl: string;
}

const supplementNames: Record<string, LocalizedText> = {
  "l-theanine": { en: "L-Theanine", pl: "L-Teanina" }
};

// 3. Test with Polish locale
// Verify text length and cultural appropriateness
```

### 📊 Testing Workflow

#### Unit Testing Approach
```typescript
// 1. Write tests alongside implementation
describe('SupplementCard', () => {
  const mockSupplement = {
    id: '1',
    name: 'L-Theanine',
    polishName: 'L-Teanina',
    category: 'nootropics'
  };

  it('should render Polish supplement name', () => {
    render(<SupplementCard supplement={mockSupplement} />);
    expect(screen.getByText('L-Teanina')).toBeInTheDocument();
  });
});

// 2. Test error scenarios
it('should handle missing supplement data gracefully', () => {
  // Test error boundaries and loading states
});

// 3. Test accessibility
it('should be accessible to screen readers', () => {
  // Test ARIA labels and keyboard navigation
});
```

#### Integration Testing
```typescript
// 1. Test component interactions
describe('Supplement Search Integration', () => {
  it('should search and display results in Polish', async () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText('Szukaj suplementów');
    await userEvent.type(searchInput, 'koncentracja');

    await waitFor(() => {
      expect(screen.getByText('L-Teanina')).toBeInTheDocument();
    });
  });
});
```

#### E2E Testing
```typescript
// 1. Test complete user journeys
test('complete supplement research workflow', async ({ page }) => {
  await page.goto('/suplementy');

  // Search for supplement
  await page.fill('[data-testid="supplement-search"]', 'koncentracja');
  await page.click('[data-testid="search-button"]');

  // Navigate to supplement details
  await page.click('[data-testid="supplement-card"]');

  // Verify Polish content
  await expect(page.locator('[data-testid="supplement-name"]')).toContainText('L-Teanina');
});
```

### 🚀 Deployment Workflow

#### Staging Deployment
```bash
# 1. Test in staging environment
bun run build
bun run preview

# 2. Run full test suite
bun run test:all

# 3. Deploy to staging
bun run vercel-deploy:preview

# 4. Verify deployment
bun run verify:deployment
```

#### Production Deployment
```bash
# 1. Ensure all tests pass
bun run test:all

# 2. Build for production
bun run build

# 3. Deploy to production
bun run vercel-deploy

# 4. Monitor deployment
bun run health:check
```

### 🔧 Hotfix Workflow

#### Emergency Bug Fixes
```bash
# 1. Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-security-patch

# 2. Implement fix
git add .
git commit -m "fix: resolve critical security vulnerability

- Patch XSS vulnerability in supplement search
- Add input sanitization middleware
- Update dependencies to secure versions"

# 3. Deploy immediately
git push origin hotfix/critical-security-patch

# 4. Merge back to develop
git checkout develop
git merge hotfix/critical-security-patch
git push origin develop
```

### 📚 Documentation Workflow

#### Keeping Documentation Updated
```bash
# 1. Update README for new features
# Edit relevant documentation files

# 2. Update API documentation
# Generate latest API docs

# 3. Update component documentation
# Add Storybook stories for new components

# 4. Commit documentation changes
git add docs/
git commit -m "docs: update documentation for new features

- Add API documentation for supplement endpoints
- Update component stories for new UI elements
- Include Polish translation examples"
```

### 🔍 Code Review Workflow

#### Preparing for Code Review
- [ ] Ensure all tests pass
- [ ] Add comprehensive comments
- [ ] Include Polish translations
- [ ] Update documentation
- [ ] Check accessibility compliance
- [ ] Performance impact assessed

#### During Code Review
- [ ] Respond to feedback promptly
- [ ] Make requested changes
- [ ] Re-run tests after changes
- [ ] Request re-review when ready

#### After Code Review
- [ ] Merge approved changes
- [ ] Delete feature branch
- [ ] Monitor for issues in production
- [ ] Update related documentation

### 🎯 Performance Optimization Workflow

#### Identifying Performance Issues
```bash
# 1. Run performance tests
bun run test:performance

# 2. Analyze bundle size
bun run deploy:analyze

# 3. Check Core Web Vitals
# Monitor in production dashboard

# 4. Profile slow operations
# Use React DevTools Profiler
```

#### Optimizing Performance
```typescript
// 1. Implement code splitting
const SupplementDetails = lazy(() => import('./SupplementDetails'));

// 2. Optimize re-renders
const SupplementCard = memo(({ supplement, onSelect }) => {
  // Component implementation
});

// 3. Use proper loading states
const SupplementList = () => {
  const { data, isLoading, error } = useSupplements();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{/* Render supplements */}</div>;
};
```

### 🔒 Security Development Workflow

#### Security-First Development
```typescript
// 1. Validate all inputs
const validateSupplementData = (data: unknown): SupplementData => {
  const schema = z.object({
    name: z.string().min(1).max(100),
    polishName: z.string().min(1).max(100),
    // ... other validations
  });

  return schema.parse(data);
};

// 2. Sanitize user inputs
const sanitizeSearchQuery = (query: string): string => {
  return query.replace(/[<>\"']/g, '');
};

// 3. Use proper authentication
const requireAuth = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
};
```

### 📊 Monitoring and Analytics

#### Development Monitoring
```bash
# 1. Monitor application health
bun run health:check

# 2. Check error rates
# Monitor Sentry dashboard

# 3. Track performance metrics
# Monitor Core Web Vitals

# 4. Monitor user analytics
# Check Google Analytics reports
```

#### Error Tracking
```typescript
// 1. Implement proper error boundaries
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    logErrorToService(error, errorInfo);
  }
}

// 2. Add error tracking to async operations
const fetchSupplements = async () => {
  try {
    const response = await fetch('/api/supplements');
    return await response.json();
  } catch (error) {
    // Log and handle error
    logError('Failed to fetch supplements', error);
    throw error;
  }
};
```

## 🎯 Best Practices Summary

### Daily Development
- ✅ Always pull latest changes before starting work
- ✅ Run quality checks before committing
- ✅ Write tests alongside implementation
- ✅ Use conventional commit messages
- ✅ Keep branches focused and short-lived

### Medical Content
- ✅ Always cite peer-reviewed sources
- ✅ Consult medical professionals for health claims
- ✅ Include comprehensive safety information
- ✅ Use proper Polish medical terminology
- ✅ Submit for medical review before implementation

### Quality Assurance
- ✅ Test on multiple devices and browsers
- ✅ Verify Polish translations in context
- ✅ Check accessibility with screen readers
- ✅ Monitor performance impact
- ✅ Validate medical accuracy

### Collaboration
- ✅ Communicate early and often
- ✅ Use issue templates for consistency
- ✅ Provide clear reproduction steps
- ✅ Be respectful in code reviews
- ✅ Help others when possible

---

*This workflow guide helps maintain SUPLEMENTOR's high standards for medical accuracy, code quality, and user experience. Following these practices ensures consistent, reliable, and safe educational content for Polish users.*