# Suplementor UI Components Documentation

## Overview

This documentation provides a comprehensive guide to all UI components available in the Suplementor application. These components are built using Radix UI primitives and styled with Tailwind CSS, following accessibility best practices and Polish localization requirements.

## Component Categories

### 1. Form Components
- `Input` - Text input fields
- `Label` - Form labels with accessibility support
- `Select` - Dropdown selection component
- `Checkbox` - Boolean selection component
- `Switch` - On/off toggle component
- `Form` - Form wrapper with validation support
- `Button` - Interactive action buttons

### 2. Layout Components
- `Card` - Content containers with header, body, and footer
- `Accordion` - Collapsible content sections
- `Tabs` - Tabbed interface for organizing content
- `Dialog` - Modal dialogs and popups

### 3. Data Display Components
- `Badge` - Small status indicators
- `Avatar` - User profile images or initials
- `Table` - Structured data presentation
- `Progress` - Progress indicators
- `Slider` - Range selection component

### 4. Feedback Components
- `Alert` - Important messages and notifications
- `Toast` - Temporary notifications
- `Tooltip` - Contextual help text

### 5. Navigation Components
- `Breadcrumb` - Path navigation
- `DropdownMenu` - Context menus and dropdowns

## Usage Examples

### Basic Form Component Usage

```tsx
import { Input, Label, Button } from "@/components/ui";

export default function LoginForm() {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="wpisz swój email" />
      </div>
      <div>
        <Label htmlFor="password">Hasło</Label>
        <Input id="password" type="password" placeholder="wpisz swoje hasło" />
      </div>
      <Button type="submit">Zaloguj się</Button>
    </div>
  );
}
```

### Card Component with Polish Localization

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui";

export default function SupplementCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alfa-GPC</CardTitle>
        <CardDescription>Suplement cholinowy</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Alfa-GPC to wysoce biodostępna forma choliny, która skutecznie przekracza barierę krew-mózg.</p>
      </CardContent>
      <CardFooter>
        <Button>Dowiedz się więcej</Button>
      </CardFooter>
    </Card>
  );
}
```

### Table Component for Data Display

```tsx
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui";

export default function SupplementTable({ supplements }: { supplements: Supplement[] }) {
  return (
    <Table>
      <TableCaption>Lista dostępnych suplementów</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nazwa</TableHead>
          <TableHead>Kategoria</TableHead>
          <TableHead>Poziom dowodów</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {supplements.map((supplement) => (
          <TableRow key={supplement.id}>
            <TableCell className="font-medium">{supplement.polishName}</TableCell>
            <TableCell>{supplement.category}</TableCell>
            <TableCell>
              <Badge variant="outline">{supplement.evidenceLevel}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Accordion for FAQ Sections

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui";

export default function FAQSection() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Czym są nootropiki?</AccordionTrigger>
        <AccordionContent>
          Nootropiki to substancje, które poprawiają funkcje poznawcze, takie jak pamięć, kreatywność i motywacja, 
          u osób zdrowych. Mogą również wspierać funkcje mózgu u osób z zaburzeniami poznawczymi.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Jakie suplementy warto stosować?</AccordionTrigger>
        <AccordionContent>
          Wybór suplementów zależy od indywidualnych potrzeb i celów. Najlepiej skonsultować się z lekarzem 
          lub dietetykiem przed rozpoczęciem suplementacji.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

### Dialog for Modal Interactions

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui";
import { Button } from "@/components/ui/button";

export default function SupplementInfoDialog({ supplement }: { supplement: Supplement }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Więcej informacji</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{supplement.polishName}</DialogTitle>
          <DialogDescription>{supplement.polishDescription}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Dawkowanie</h4>
            <p>{supplement.dosageGuidelines.recommendedDose}</p>
          </div>
          <div>
            <h4 className="font-medium">Poziom dowodów</h4>
            <Badge>{supplement.evidenceLevel}</Badge>
          </div>
        </div>
        <DialogFooter>
          <Button type="button">Zamknij</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## Accessibility Features

All components follow WCAG 2.1 AA guidelines and include:

1. **Proper ARIA attributes** - Semantic markup with appropriate ARIA roles
2. **Keyboard navigation** - Full keyboard support for all interactive elements
3. **Screen reader compatibility** - Proper labeling and announcements
4. **Color contrast** - Minimum 4.5:1 contrast ratio for text elements
5. **Focus management** - Visible focus indicators and logical tab order
6. **Polish localization** - All labels and descriptions in Polish

## Styling and Customization

Components use Tailwind CSS classes and can be customized in several ways:

1. **ClassName prop** - Pass additional classes to override styles
2. **CSS variables** - Use CSS custom properties for theming
3. **Variants** - Predefined style variants (e.g., button variants)
4. **Composition** - Combine components to create complex layouts

### Customization Example

```tsx
import { Button } from "@/components/ui/button";

// Using variants
<Button variant="primary">Główny</Button>
<Button variant="secondary">Drugorzędny</Button>
<Button variant="outline">Zarys</Button>

// Using className prop for custom styles
<Button className="bg-purple-600 hover:bg-purple-700 text-white">
  Niestandardowy przycisk
</Button>

// Using size variants
<Button size="sm">Mały</Button>
<Button size="md">Średni</Button>
<Button size="lg">Duży</Button>
```

## Performance Considerations

1. **Tree shaking** - Components are exported individually for optimal bundling
2. **Server-side rendering** - All components support SSR
3. **Bundle size** - Lightweight implementation with minimal dependencies
4. **Virtualization** - Large data sets use virtualization for performance

## Polish Localization

All components include proper Polish localization:

1. **Text labels** - All UI text in Polish
2. **Semantic structure** - Proper HTML semantics for Polish content
3. **Typography** - Appropriate fonts and spacing for Polish text
4. **Cultural considerations** - Design patterns familiar to Polish users

## Testing

Each component includes comprehensive test coverage:

1. **Unit tests** - Individual component rendering and behavior
2. **Integration tests** - Component interaction with state and props
3. **Accessibility tests** - Screen reader and keyboard navigation
4. **Visual regression tests** - Consistent appearance across updates

## Best Practices

### Component Composition

```tsx
// Good: Compose components for complex layouts
<Card>
  <CardHeader>
    <CardTitle>Tytuł karty</CardTitle>
    <CardDescription>Opis karty</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
  <CardFooter>
    {/* Card actions */}
  </CardFooter>
</Card>

// Avoid: Deeply nested custom components
<div className="border rounded-lg p-4">
  <h3 className="text-lg font-semibold">Tytuł</h3>
  <p className="text-gray-600">Opis</p>
  {/* Content */}
</div>
```

### Accessibility Patterns

```tsx
// Good: Proper labeling
<Label htmlFor="email-input">Email</Label>
<Input id="email-input" type="email" />

// Good: ARIA attributes for complex interactions
<Button 
  aria-expanded={isOpen} 
  aria-controls="menu-content"
>
  Menu
</Button>

// Good: Semantic structure
<nav aria-label="Nawigacja główna">
  <ul>
    <li><a href="/strona">Strona główna</a></li>
    {/* More navigation items */}
  </ul>
</nav>
```

## Component API Reference

### Button

Props:
- `variant`: `"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"`
- `size`: `"default" | "sm" | "lg" | "icon"`
- `asChild`: `boolean` - Render as child element instead of button

### Input

Props:
- `type`: HTML input type
- `placeholder`: Placeholder text
- All standard HTML input attributes

### Card

Sub-components:
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title element
- `CardDescription` - Description element
- `CardContent` - Main content area
- `CardFooter` - Footer section

### Dialog

Sub-components:
- `Dialog` - Main dialog wrapper
- `DialogTrigger` - Element that opens the dialog
- `DialogContent` - Dialog content area
- `DialogHeader` - Header section
- `DialogTitle` - Dialog title
- `DialogDescription` - Dialog description
- `DialogFooter` - Footer section
- `DialogClose` - Close button

## Theming

The components support light and dark themes through CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 47.4% 11.2%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 47.4% 11.2%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 100% 50%;
  --destructive-foreground: 210 40% 98%;
  --ring: 215 20.2% 65.1%;
  --radius: 0.5rem;
}

.dark {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  --muted: 223 47% 11%;
  --muted-foreground: 215.4 16.3% 56.9%;
  --accent: 216 34% 17%;
  --accent-foreground: 210 40% 98%;
  --popover: 224 71% 4%;
  --popover-foreground: 215 20.2% 65.1%;
  --border: 216 34% 17%;
  --input: 216 34% 17%;
  --card: 224 71% 4%;
  --card-foreground: 213 31% 91%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 1.2%;
  --secondary: 222.2 47.4% 11.2%;
  --secondary-foreground: 210 40% 98%;
  --destructive: 0 63% 31%;
  --destructive-foreground: 210 40% 98%;
  --ring: 216 34% 17%;
  --radius: 0.5rem;
}
```

## Contributing

When adding new components or modifying existing ones:

1. Follow the established patterns for props and TypeScript interfaces
2. Include comprehensive test coverage
3. Ensure accessibility compliance
4. Provide Polish localization for all text
5. Document component usage in this guide
6. Maintain consistent styling with the design system

## Version History

- v1.0.0 - Initial component library implementation
- v1.1.0 - Added comprehensive accessibility features
- v1.2.0 - Enhanced Polish localization support
- v1.3.0 - Added performance optimizations