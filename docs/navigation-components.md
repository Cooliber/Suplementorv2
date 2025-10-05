# Navigation Components Documentation

## Overview

The Suplementor navigation system provides a comprehensive set of components for navigating the application, including main navigation, sidebar navigation, breadcrumb navigation, and footer navigation. All components are designed with Polish localization and accessibility in mind.

## Component Architecture

### Core Navigation Components

1. **MainNavigation** - Primary horizontal navigation bar with dropdown menus
2. **SidebarNavigation** - Vertical sidebar navigation with collapsible sections
3. **BreadcrumbNavigation** - Path-based navigation showing current location
4. **FooterNavigation** - Bottom navigation with supplementary links

### Supporting Components

1. **MobileSidebar** - Responsive sidebar for mobile devices
2. **NavigationMenu** - Generic navigation menu component
3. **SidebarNav** - Sidebar navigation list component
4. **BreadcrumbNav** - Breadcrumb navigation component

## Key Features

### Responsive Design
- **Desktop**: Full horizontal navigation with dropdowns
- **Tablet**: Condensed navigation with some dropdowns
- **Mobile**: Hamburger menu with slide-in sidebar

### Accessibility
- **WCAG Compliance**: Full AA compliance with Polish localization
- **ARIA Labels**: Comprehensive ARIA attributes for screen readers
- **Keyboard Navigation**: Full keyboard support with focus management
- **Semantic HTML**: Proper semantic structure throughout

### Internationalization
- **Polish Translation**: Complete Polish localization of all navigation items
- **Cultural Sensitivity**: Culturally appropriate navigation structure
- **RTL Support**: Right-to-left language support (future enhancement)

## Usage Examples

### Main Navigation Implementation

```tsx
import { MainNavigation } from '@/components/navigation';

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <MainNavigation />
      </div>
    </header>
  );
}
```

### Sidebar Navigation Implementation

```tsx
import { SidebarNav } from '@/components/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-white md:block">
        <SidebarNav />
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

### Breadcrumb Navigation Implementation

```tsx
import { BreadcrumbNav } from '@/components/navigation';

export default function PageHeader() {
  return (
    <div className="border-b">
      <div className="container flex h-16 items-center px-4">
        <BreadcrumbNav />
      </div>
    </div>
  );
}
```

### Footer Navigation Implementation

```tsx
import { FooterNavigation } from '@/components/navigation';

export default function SiteFooter() {
  return (
    <FooterNavigation />
  );
}
```

### Mobile Navigation Implementation

```tsx
import { MobileSidebar } from '@/components/navigation';

export default function MobileHeader() {
  return (
    <header className="flex h-16 items-center border-b px-4 md:hidden">
      <MobileSidebar>
        <div className="p-4">
          {/* Mobile content */}
        </div>
      </MobileSidebar>
      <div className="flex-1 text-center font-semibold">
        Suplementor
      </div>
    </header>
  );
}
```

## Component APIs

### MainNavigation Props

```typescript
interface MainNavigationProps {
  className?: string;
}
```

### SidebarNav Props

```typescript
interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  onItemClick?: () => void;
}
```

### BreadcrumbNav Props

```typescript
interface BreadcrumbNavProps {
  className?: string;
}
```

### MobileSidebar Props

```typescript
interface MobileSidebarProps {
  children: React.ReactNode;
}
```

### FooterNavigation Props

```typescript
interface FooterNavigationProps {
  className?: string;
}
```

## Navigation Structure

### Main Categories

1. **Główna** (Main)
   - Strona główna (Home)
   - Graf wiedzy (Knowledge Graph)
   - Baza suplementów (Supplement Database)

2. **Nauka** (Learning)
   - Wiedza (Knowledge)
   - Badania naukowe (Scientific Studies)
   - Mechanizmy działania (Mechanisms of Action)
   - Neuroprzekaźniki (Neurotransmitters)
   - Obszary mózgu (Brain Regions)

3. **Narzędzia** (Tools)
   - Śledzenie (Tracking)
   - Kalendarz (Calendar)
   - Statystyki (Statistics)
   - Rekomendacje (Recommendations)
   - Odkrywanie (Discovery)
   - Interakcje (Interactions)

4. **Społeczność** (Community)
   - Forum (Forum)
   - Rankingi (Rankings)
   - Społeczność (Community)

5. **Konto** (Account)
   - Profil (Profile)
   - Ustawienia (Settings)
   - Powiadomienia (Notifications)
   - Pomoc (Help)
   - Prywatność (Privacy)

## Performance Guidelines

### Optimization Strategies

1. **Lazy Loading**: Navigation components load only when needed
2. **Code Splitting**: Separate bundles for navigation components
3. **Memoization**: Cached navigation state for repeated renders
4. **Virtualization**: Efficient rendering of long navigation lists

### Mobile Performance

1. **Touch Optimization**: Touch-friendly navigation elements
2. **Gesture Support**: Swipe gestures for mobile navigation
3. **Transition Effects**: Smooth animations for mobile menus
4. **Memory Management**: Efficient cleanup of mobile navigation

## Accessibility Standards

All navigation components comply with WCAG 2.1 AA standards:

1. **Keyboard Navigation**: Full keyboard support with tab indexing
2. **Screen Reader Compatibility**: ARIA labels and live regions
3. **Color Contrast**: Minimum 4.5:1 contrast ratios
4. **Focus Management**: Visible focus indicators
5. **Semantic Structure**: Proper heading hierarchy and landmarks

### Polish Localization Accessibility

- All ARIA labels translated to Polish
- Keyboard shortcuts adapted for Polish keyboards
- Cultural considerations for navigation patterns
- Right-to-left support prepared for future languages

## Testing

### Unit Tests
All navigation components have comprehensive unit tests covering:
- Rendering and basic functionality
- Event handling and user interactions
- State management and updates
- Error handling and edge cases

### Integration Tests
- Full navigation system workflow testing
- Responsive design behavior
- Accessibility compliance validation
- Performance benchmarks

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation
- Color contrast compliance
- Semantic structure validation

## Customization

### Styling
All navigation components use Tailwind CSS classes and can be customized:
- ClassName prop for additional styling
- CSS variables for theming
- Component variants for different appearances

### Navigation Items
Navigation items can be customized:
- Dynamic item generation from data
- Custom icons and labels
- Conditional visibility based on user state
- Role-based access control

## Best Practices

### Navigation Design

1. **Consistent Placement**: Navigation elements in predictable locations
2. **Clear Labels**: Descriptive navigation item names
3. **Logical Grouping**: Related items grouped together
4. **Visual Hierarchy**: Clear distinction between primary and secondary navigation

### Mobile Navigation

1. **Hamburger Pattern**: Standard hamburger menu for mobile
2. **Swipe Gestures**: Intuitive swipe navigation
3. **Touch Targets**: Adequate touch target sizes
4. **Performance**: Optimized mobile navigation performance

### Accessibility

1. **Skip Links**: Skip navigation links for keyboard users
2. **Focus Indicators**: Visible focus management
3. **Landmark Roles**: Proper ARIA landmark roles
4. **Screen Reader Labels**: Descriptive screen reader text

## Troubleshooting

### Common Issues

1. **Navigation Not Appearing on Mobile**
   - Solution: Check mobile breakpoint classes
   - Solution: Verify MobileSidebar implementation
   - Solution: Ensure responsive design classes

2. **Accessibility Audit Failures**
   - Solution: Use AccessibleNavigation components
   - Solution: Check color contrast ratios
   - Solution: Verify focus management

3. **Performance Issues with Large Navigation**
   - Solution: Implement virtualization
   - Solution: Use lazy loading
   - Solution: Optimize rendering with memoization

## Future Enhancements

### Planned Features
1. **Voice Navigation** - Voice-activated navigation
2. **Gesture Navigation** - Advanced gesture support
3. **AI-Powered Navigation** - Predictive navigation based on user behavior
4. **Multi-language Support** - Dynamic language switching
5. **Dark Mode Integration** - Navigation theme switching

### Performance Improvements
1. **Intersection Observer** - Efficient visibility detection
2. **Web Workers** - Background navigation processing
3. **Service Workers** - Offline navigation support
4. **Prefetching** - Intelligent link prefetching

## Contributing

When adding new navigation components or modifying existing ones:

1. Follow the established patterns for props and TypeScript interfaces
2. Include comprehensive test coverage
3. Ensure accessibility compliance
4. Provide Polish localization for all text
5. Document component usage in this guide
6. Maintain consistent styling with the design system
7. Consider performance implications for mobile devices