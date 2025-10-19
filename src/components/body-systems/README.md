# Body Systems Interactive Diagrams

A comprehensive 3D interactive diagram system for educational anatomy visualization in the suplementor app. Built with React Three Fiber, TypeScript, and Polish language support.

## Features

### 🎯 Core Functionality
- **7 Body Systems**: Skeletal, Muscular, Respiratory, Nervous, Endocrine, Reproductive, Integumentary
- **Interactive 3D Models**: Click, hover, zoom, rotate, and pan controls
- **Physiological Animations**: Breathing, muscle contraction, nerve impulses, and more
- **Supplement Integration**: Visual effects showing supplement impacts on organs
- **Polish Language Support**: Complete localization for Polish users

### 📱 Mobile Optimization
- **Touch-Friendly Controls**: Optimized for mobile devices and tablets
- **Gesture Support**: Pinch-to-zoom, pan, and rotate gestures
- **Responsive Design**: Adapts to different screen sizes
- **Touch Joystick**: Virtual joystick for camera control

### ♿ Accessibility Features
- **Screen Reader Support**: ARIA labels and announcements in Polish
- **Keyboard Navigation**: Full keyboard control support
- **High Contrast Mode**: Enhanced visibility for visually impaired users
- **Reduced Motion**: Respects user motion preferences
- **Large Text**: Scalable text and UI elements

### ⚡ Performance Optimization
- **Level of Detail (LOD)**: Adaptive quality based on distance
- **Frustum Culling**: Only renders visible objects
- **Instanced Rendering**: Efficient rendering of multiple objects
- **Memory Management**: Automatic cleanup and optimization
- **Adaptive Quality**: Adjusts based on device performance

## Architecture

### Component Structure

```
src/components/body-systems/
├── InteractiveOrgan.tsx          # Base organ component
├── BodySystemsViewer.tsx         # Main viewer component
├── DiagramViewer.tsx             # Complete diagram interface
├── SkeletalSystem.tsx            # Skeletal system implementation
├── MuscularSystem.tsx            # Muscular system implementation
├── RespiratorySystem.tsx         # Respiratory system implementation
├── MobileControls.tsx            # Mobile-optimized controls
├── AccessibilityControls.tsx     # Accessibility features
├── PerformanceOptimizer.tsx      # Performance utilities
├── index.ts                      # Main exports
└── README.md                     # This file
```

### Type Definitions

```typescript
// Core types in src/types/body-systems.ts
interface AnatomicalStructure {
  id: string;
  name: string;
  polishName: string;
  position: [number, number, number];
  color: string;
  size: number;
  category: BodySystem;
  system: string;
  polishSystem: string;
}

interface BodySystem {
  id: string;
  name: string;
  polishName: string;
  color: string;
  icon: string;
  description: string;
  polishDescription: string;
  organs: string[];
  polishOrgans: string[];
}
```

## Usage

### Basic Implementation

```tsx
import { DiagramViewer } from "@/components/body-systems";

export default function AnatomyPage() {
  return (
    <DiagramViewer
      selectedSupplements={["calcium", "vitamin-d"]}
      currentSystem="skeletal"
      showAnatomyLabels={true}
      showPhysiologyAnimations={true}
      enableAudio={false}
      onSystemChange={(systemId) => console.log(systemId)}
      onOrganSelect={(organId) => console.log(organId)}
    />
  );
}
```

### System-Specific Usage

```tsx
import { SkeletalSystem } from "@/components/body-systems";

function SkeletalDiagram() {
  return (
    <Canvas>
      <SkeletalSystem
        selectedSupplements={["calcium"]}
        animationSpeed={1}
        showJoints={true}
        showLabels={true}
        onBoneClick={(boneId) => console.log(boneId)}
      />
    </Canvas>
  );
}
```

### Mobile Controls

```tsx
import { MobileControls, useMobileDetection } from "@/components/body-systems";

function MobileInterface() {
  const isMobile = useMobileDetection();

  return (
    <>
      {isMobile && (
        <MobileControls
          isVisible={true}
          animationSpeed={1}
          isPlaying={true}
          showLabels={true}
          enableAudio={false}
          onAnimationSpeedChange={setSpeed}
          onPlayPause={togglePlay}
          onToggleLabels={toggleLabels}
          onToggleAudio={toggleAudio}
          onResetView={resetView}
          onFullscreenToggle={toggleFullscreen}
        />
      )}
    </>
  );
}
```

### Accessibility Features

```tsx
import { AccessibilityControls, useScreenReader } from "@/components/body-systems";

function AccessibleInterface() {
  const { announce } = useScreenReader();

  return (
    <AccessibilityControls
      isVisible={true}
      highContrast={false}
      reducedMotion={false}
      largeText={false}
      screenReaderSupport={true}
      keyboardNavigation={true}
      onHighContrastToggle={setHighContrast}
      onReducedMotionToggle={setReducedMotion}
      onLargeTextToggle={setLargeText}
      onScreenReaderToggle={setScreenReader}
      onKeyboardNavigationToggle={setKeyboardNav}
    />
  );
}
```

## Body Systems

### 1. Skeletal System (Układ szkieletowy)
- **Components**: Skull, Spine, Ribs, Pelvis, Long bones
- **Features**: Joint articulation, bone structure visualization
- **Animations**: Joint movement, bone growth indicators

### 2. Muscular System (Układ mięśniowy)
- **Components**: Skeletal muscles, Smooth muscles, Cardiac muscle
- **Features**: Muscle fiber visualization, contraction animations
- **Animations**: Muscle contraction, fiber recruitment

### 3. Respiratory System (Układ oddechowy)
- **Components**: Lungs, Trachea, Bronchi, Diaphragm
- **Features**: Lung expansion/contraction, gas exchange indicators
- **Animations**: Breathing cycle, alveoli gas exchange

### 4. Nervous System (Układ nerwowy)
- **Components**: Brain, Spinal cord, Nerves, Sensory organs
- **Features**: Neuron network, synaptic transmission
- **Animations**: Nerve impulses, brain activity

### 5. Endocrine System (Układ hormonalny)
- **Components**: Pituitary, Thyroid, Adrenals, Pancreas, Gonads
- **Features**: Hormone pathway visualization, receptor binding
- **Animations**: Hormone release, signal transduction

### 6. Reproductive System (Układ rozrodczy)
- **Components**: Testes/Ovaries, Uterus, Prostate, Mammary glands
- **Features**: Gametogenesis process, cellular detail
- **Animations**: Cell division, fertilization process

### 7. Integumentary System (Układ powłokowy)
- **Components**: Skin, Hair, Nails, Sweat glands, Sebaceous glands
- **Features**: Skin layer cross-section, barrier function
- **Animations**: Skin cell turnover, sweat production

## Polish Language Integration

All components include complete Polish language support:

- **Labels and Descriptions**: All anatomical terms in Polish
- **Tooltips**: Interactive help text in Polish
- **Audio Announcements**: Screen reader support in Polish
- **Educational Content**: Learning materials in Polish

### Example Polish Labels

```typescript
const polishLabels = {
  skull: "Czaszka",
  spine: "Kręgosłup",
  lungs: "Płuca",
  heart: "Serce",
  brain: "Mózg",
  muscles: "Mięśnie",
  bones: "Kości",
  nerves: "Nerwy",
};
```

## Performance Optimization

### Automatic Optimizations
- **LOD System**: Reduces detail for distant objects
- **Frustum Culling**: Only renders visible objects
- **Instanced Rendering**: Efficient multiple object rendering
- **Memory Management**: Automatic cleanup and optimization

### Manual Controls
```tsx
import { PerformanceOptimizer } from "@/components/body-systems";

function OptimizedScene() {
  return (
    <PerformanceOptimizer
      enableLOD={true}
      enableFrustumCulling={true}
      maxFPS={60}
    >
      <DiagramViewer />
    </PerformanceOptimizer>
  );
}
```

## Mobile Features

### Touch Interactions
- **Pinch to Zoom**: Two-finger zoom gesture
- **Pan**: Single-finger drag to pan
- **Rotate**: Two-finger rotate gesture
- **Virtual Joystick**: On-screen camera control

### Mobile Controls
```tsx
<MobileControls
  isVisible={true}
  animationSpeed={1}
  isPlaying={true}
  showLabels={true}
  enableAudio={false}
  onAnimationSpeedChange={setSpeed}
  onPlayPause={togglePlay}
  onToggleLabels={toggleLabels}
  onToggleAudio={toggleAudio}
  onResetView={resetView}
  onFullscreenToggle={toggleFullscreen}
/>
```

## Accessibility Features

### Screen Reader Support
- **ARIA Labels**: Proper labeling for all interactive elements
- **Live Regions**: Dynamic content announcements
- **Keyboard Navigation**: Full keyboard control
- **Focus Management**: Proper focus handling

### Visual Accessibility
- **High Contrast Mode**: Enhanced color contrast
- **Large Text**: Scalable text sizes
- **Reduced Motion**: Respects motion preferences
- **Color Blind Support**: Accessible color schemes

## Integration with Suplementor

### Supplement Effects
The system integrates with the suplementor supplement database to show:

- **Visual Effects**: Color-coded supplement impacts
- **Mechanism Display**: How supplements affect organs
- **Evidence Levels**: Scientific evidence indicators
- **Dosage Information**: Supplement timing and dosage

### Educational Integration
- **Cross-References**: Links to supplement information
- **Learning Paths**: Guided educational content
- **Progress Tracking**: User learning progress
- **Quiz Integration**: Assessment and testing

## Development

### Setup
```bash
# Install dependencies (already included in suplementor)
npm install @react-three/fiber @react-three/drei three

# Run development server
npm run dev
```

### Testing
```bash
# Run component tests
npm run test

# Run accessibility tests
npm run test:accessibility

# Run performance tests
npm run test:performance
```

### Building
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+
- **WebGL**: Required for 3D rendering
- **Touch**: Full touch support for mobile devices

## Performance Targets

- **Frame Rate**: 60 FPS on modern devices
- **Memory Usage**: <100MB for complex scenes
- **Load Time**: <3 seconds for initial load
- **Interaction Latency**: <100ms response time

## Future Enhancements

### Planned Features
- **AR Mode**: Augmented reality organ visualization
- **VR Support**: Virtual reality anatomy exploration
- **Multi-language**: Additional language support
- **Offline Mode**: Cached anatomy models
- **Collaborative Features**: Multi-user exploration

### Advanced Interactions
- **Organ Cross-Sections**: Cutaway views
- **Time-based Animations**: Growth and development
- **Pathology Visualization**: Disease state representations
- **Surgical Views**: Medical procedure simulations

## Contributing

When contributing to the body systems components:

1. **Follow Polish Language Guidelines**: All user-facing text must be in Polish
2. **Maintain Performance**: Test on mobile devices
3. **Accessibility First**: Ensure all features are accessible
4. **TypeScript Strict**: Maintain type safety
5. **Component Documentation**: Document all props and usage

## License

This component system is part of the suplementor application and follows the same licensing terms.