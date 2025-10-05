# Suplementor Component Generator

A comprehensive component generation system for the Suplementor platform with built-in Polish localization, accessibility features, and quality validation.

## Features

- 🚀 **Multiple Component Types**: UI, Feature, Page, and Layout components
- 🇵🇱 **Polish Localization**: Built-in Polish language support with medical terminology
- ♿ **Accessibility**: WCAG 2.1 AA compliance by default
- ⚡ **Performance**: Built-in performance optimizations
- 🔍 **Quality Validation**: Automated validation and testing
- 🎨 **Template System**: Extensible template engine
- 📁 **File Structure Automation**: Automatic file and directory creation

## Quick Start

### Interactive Mode

```bash
npm run generate:component
```

### Programmatic Generation

```bash
# Generate UI component
npm run generate:component:ui

# Generate feature component
npm run generate:component:feature

# Generate page component
npm run generate:component:page

# Generate layout component
npm run generate:component:layout
```

### Command Line Options

```bash
node scripts/component-generator/index.js [options]

Options:
  --help, -h          Show help message
  --interactive       Launch interactive CLI
  --version           Show version information
  --type <type>       Component type (ui, feature, page, layout)
  --name <name>       Component name (PascalCase)
  --description <desc> Component description
  --author <author>   Author name

Examples:
  node scripts/component-generator/index.js --interactive
  node scripts/component-generator/index.js --type ui --name MyButton --description "A custom button component"
```

## Component Types

### UI Components
Reusable interface components (buttons, inputs, cards, etc.)

**Features:**
- Polish localization
- Accessibility support
- TypeScript interfaces
- Storybook stories
- Unit tests

### Feature Components
Business logic components with data fetching and state management

**Features:**
- Zustand state management
- React Query integration
- Error handling
- Loading states
- Polish localization

### Page Components
Full page components with routing and layout

**Features:**
- Next.js App Router
- SEO optimization
- Polish localization
- Performance monitoring
- Error boundaries

### Layout Components
Layout wrapper components for consistent structure

**Features:**
- Responsive design
- Theme support
- Navigation integration
- Polish localization
- Accessibility features

## Polish Localization

The component generator includes comprehensive Polish localization support:

### Medical Terminology
- 25+ medical terms with accurate Polish translations
- Context-aware translations
- Category-based organization (anatomy, conditions, treatments, supplements)

### Character Validation
- Polish character support (ą, ć, ę, ł, ń, ó, ś, ź, ż)
- Common typo detection
- Character rendering validation

### Usage in Components

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

## Development Setup

### Environment Configuration

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup development environment:**
   ```bash
   npm run dev:setup
   ```

3. **Configure environment variables:**
   Edit `.env.local` with your API keys and database settings

### Development Scripts

```bash
# Start development server
npm run dev

# Type checking
npm run typecheck:dev

# Component validation
npm run validate:components

# Localization validation
npm run localization:validate

# Clean development environment
npm run dev:clean

# Reset development environment
npm run dev:reset
```

## Architecture

### Core Systems

1. **Template Engine** (`template-engine.ts`)
   - Handles template rendering
   - Variable substitution
   - File generation

2. **File Structure Automation** (`file-structure.ts`)
   - Directory creation
   - File organization
   - Path management

3. **Polish Localization Integration** (`polish-localization.ts`)
   - Medical terminology
   - Character validation
   - Translation management

4. **Quality Validation System** (`quality-validation.ts`)
   - Accessibility validation
   - Performance checks
   - TypeScript validation

5. **CLI Interface** (`cli.ts`)
   - Interactive prompts
   - Command parsing
   - User experience

### File Structure

```
scripts/component-generator/
├── index.ts                 # Main entry point
├── template-engine.ts       # Template rendering
├── file-structure.ts        # File organization
├── polish-localization.ts   # Polish language support
├── quality-validation.ts    # Validation system
├── cli.ts                   # Command line interface
├── templates/               # Component templates
└── README.md               # This file

src/lib/
├── hooks/
│   └── use-polish-localization.ts
└── localization/
    ├── types.ts            # TypeScript definitions
    ├── dictionary.ts       # Translation data
    ├── validation.ts       # Validation utilities
    └── index.ts           # Public API
```

## Configuration

### Development Configuration

The system uses several configuration files:

- `.env.local` - Environment variables
- `dev.config.json` - Development settings
- `tsconfig.dev.json` - TypeScript configuration

### Customization

You can customize the component generation by:

1. **Modifying templates** in `scripts/component-generator/templates/`
2. **Adding translations** in `src/lib/localization/dictionary.ts`
3. **Extending validation** in `src/lib/localization/validation.ts`
4. **Adding features** in `scripts/component-generator/index.ts`

## Validation

### Component Validation

Components are validated for:
- TypeScript compilation
- Polish character rendering
- Accessibility compliance
- Performance metrics
- Code quality

### Localization Validation

Polish text is validated for:
- Character encoding
- Medical terminology accuracy
- Common typos
- Cultural appropriateness

## Troubleshooting

### Common Issues

1. **TypeScript errors:**
   ```bash
   npm run typecheck:dev
   ```

2. **Missing dependencies:**
   ```bash
   npm install
   ```

3. **Component generation fails:**
   ```bash
   npm run validate:components
   ```

4. **Polish characters not rendering:**
   ```bash
   npm run localization:validate
   ```

### Getting Help

- Check the component generator logs
- Review the generated component structure
- Validate localization with the provided tools
- Check TypeScript compilation errors

## Contributing

When contributing to the component generator:

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include Polish localization
4. Add validation tests
5. Update documentation

## License

This component generator is part of the Suplementor platform.