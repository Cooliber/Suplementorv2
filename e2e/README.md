# Suplementor E2E Tests with Playwright

Comprehensive end-to-end testing suite for the Suplementor Next.js application with Polish localization, accessibility compliance, and performance monitoring.

## 📋 Overview

This E2E test suite covers:

- **Homepage Navigation** - Landing page functionality and Polish content
- **Supplements Browsing** - Supplement search, filtering, and detail views
- **Knowledge Graph** - 3D/2D graph visualization and interactions
- **Accessibility** - WCAG AA compliance across all pages
- **Performance** - Core Web Vitals and load time monitoring
- **Polish Localization** - Verification of Polish language content
- **Responsive Design** - Mobile, tablet, and desktop layouts

## 🚀 Quick Start

### Install Dependencies

```bash
pnpm install
```

### Run All E2E Tests

```bash
pnpm test:e2e
```

### Run Tests in UI Mode (Interactive)

```bash
pnpm test:e2e:ui
```

### Run Tests in Headed Mode (See Browser)

```bash
pnpm test:e2e:headed
```

### Debug Tests

```bash
pnpm test:e2e:debug
```

## 🎯 Test Suites

### 1. Homepage Tests (`homepage.spec.ts`)

Tests for the main landing page:

- ✅ Polish content verification
- ✅ SEO meta tags
- ✅ Navigation menu
- ✅ WCAG AA accessibility
- ✅ Keyboard navigation
- ✅ Responsive design
- ✅ Performance budgets
- ✅ Dark mode toggle
- ✅ Heading hierarchy
- ✅ Image alt text

**Run:**
```bash
pnpm test:e2e e2e/homepage.spec.ts
```

### 2. Supplements Tests (`supplements.spec.ts`)

Tests for supplement browsing and search:

- ✅ Supplement cards/list display
- ✅ Search functionality
- ✅ Category filtering
- ✅ Detail page navigation
- ✅ Polish medical terminology
- ✅ Accessibility compliance
- ✅ Keyboard navigation
- ✅ Evidence level display
- ✅ Mobile responsiveness

**Run:**
```bash
pnpm test:e2e e2e/supplements.spec.ts
```

### 3. Knowledge Graph Tests (`knowledge-graph.spec.ts`)

Tests for graph visualization:

- ✅ Canvas/SVG rendering
- ✅ Graph controls (zoom, pan, reset)
- ✅ Graph legend
- ✅ Node interaction
- ✅ Search functionality
- ✅ Node type filtering
- ✅ Data export
- ✅ Performance with large datasets
- ✅ Polish neuroscience terms

**Run:**
```bash
pnpm test:e2e e2e/knowledge-graph.spec.ts
```

### 4. Accessibility Tests (`accessibility.spec.ts`)

Comprehensive WCAG AA compliance testing:

- ✅ Automated accessibility checks (axe-core)
- ✅ Heading hierarchy
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Color contrast
- ✅ Form labels
- ✅ Image alt text
- ✅ Language attributes
- ✅ Landmark roles

**Run:**
```bash
pnpm test:e2e e2e/accessibility.spec.ts
```

### 5. Performance Tests (`performance.spec.ts`)

Core Web Vitals and performance monitoring:

- ✅ LCP (Largest Contentful Paint) < 2.5s
- ✅ FCP (First Contentful Paint) < 1.8s
- ✅ CLS (Cumulative Layout Shift) < 0.1
- ✅ TTFB (Time to First Byte) < 800ms
- ✅ Bundle size budgets
- ✅ 3D graph rendering performance
- ✅ Lazy loading
- ✅ Caching strategies
- ✅ Scroll performance

**Run:**
```bash
pnpm test:e2e e2e/performance.spec.ts
```

## 🌐 Browser Testing

### Test on Specific Browsers

**Chromium:**
```bash
pnpm test:e2e:chromium
```

**Firefox:**
```bash
pnpm test:e2e:firefox
```

**WebKit (Safari):**
```bash
pnpm test:e2e:webkit
```

**Mobile Devices:**
```bash
pnpm test:e2e:mobile
```

## 📊 Test Reports

### View HTML Report

After running tests, view the interactive HTML report:

```bash
pnpm test:e2e:report
```

Reports are generated in:
- `playwright-report/` - HTML report
- `test-results/` - Screenshots, videos, traces
- `test-results/results.json` - JSON results
- `test-results/junit.xml` - JUnit XML for CI

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)

Key configurations:

- **Base URL:** `http://localhost:3000`
- **Locale:** `pl-PL` (Polish)
- **Timezone:** `Europe/Warsaw`
- **Timeout:** 60 seconds per test
- **Retries:** 2 on CI, 0 locally
- **Screenshots:** On failure
- **Videos:** On failure
- **Traces:** On first retry

### Custom Fixtures (`e2e/fixtures/base.ts`)

Extended Playwright with:

- `accessiblePage` - Page with axe-core injected
- `checkPolishContent` - Verify Polish text
- `checkAccessibility` - WCAG AA compliance
- `measurePerformance` - Core Web Vitals

## 🎨 Polish Localization Testing

All tests verify Polish language content:

- ✅ Polish characters (ą, ć, ę, ł, ń, ó, ś, ź, ż)
- ✅ Medical terminology in Polish
- ✅ UI labels and descriptions
- ✅ Error messages
- ✅ `lang="pl"` attribute
- ✅ Polish date/time formatting

## ♿ Accessibility Testing

WCAG AA compliance verified:

- ✅ Color contrast ratios
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ ARIA attributes
- ✅ Semantic HTML
- ✅ Form labels
- ✅ Image alt text

## 📈 Performance Budgets

Enforced performance thresholds:

| Metric | Threshold | Description |
|--------|-----------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| FCP | < 1.8s | First Contentful Paint |
| CLS | < 0.1 | Cumulative Layout Shift |
| TTFB | < 800ms | Time to First Byte |
| JS Bundle | < 1MB | Total JavaScript size |
| CSS Bundle | < 200KB | Total CSS size |
| Total | < 3MB | Total page weight |

## 🐛 Debugging

### Debug Specific Test

```bash
pnpm test:e2e:debug e2e/homepage.spec.ts
```

### Run with Playwright Inspector

```bash
PWDEBUG=1 pnpm test:e2e
```

### View Trace

```bash
playwright show-trace test-results/trace.zip
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
- name: Install Playwright Browsers
  run: pnpm exec playwright install --with-deps

- name: Run E2E Tests
  run: pnpm test:e2e

- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 📝 Writing New Tests

### Example Test Structure

```typescript
import { test, expect, waitForNetworkIdle } from './fixtures/base';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/my-page');
    await waitForNetworkIdle(page);
  });
  
  test('should do something', async ({ page }) => {
    // Your test code
    await expect(page.locator('h1')).toBeVisible();
  });
  
  test('should be accessible', async ({ accessiblePage, checkAccessibility }) => {
    await checkAccessibility(accessiblePage);
  });
});
```

## 🎯 Best Practices

1. **Use Polish localization** - Test with Polish content
2. **Check accessibility** - Include accessibility tests
3. **Measure performance** - Monitor Core Web Vitals
4. **Test responsively** - Check mobile, tablet, desktop
5. **Handle async** - Use proper waits and timeouts
6. **Clean up** - Reset state between tests
7. **Use fixtures** - Leverage custom fixtures
8. **Document tests** - Add clear descriptions

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [axe-core Accessibility](https://github.com/dequelabs/axe-core)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)

## 🤝 Contributing

When adding new features:

1. Write E2E tests for new pages/components
2. Include accessibility tests
3. Add performance checks
4. Verify Polish localization
5. Update this README

## 📄 License

Same as the main Suplementor project.

