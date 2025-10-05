# Brain 3D Visualization Component Prompt

## Context
Development of interactive 3D brain visualization component for the Suplementor platform using React Three Fiber, focusing on supplement-brain region interactions with Polish educational content.

## Prompt
```
Develop comprehensive 3D brain visualization component specifications:

1. **Technical Architecture**
   - React Three Fiber 9.3+ integration
   - Three.js 0.180+ core functionality
   - Drei 10.7+ utilities (OrbitControls, Html overlays)
   - Next.js 15 App Router compatibility
   - TypeScript 5.8+ strict mode compliance

2. **3D Model Requirements**
   - High-quality brain mesh with anatomical accuracy
   - Segmented regions for individual interaction
   - LOD (Level of Detail) optimization for performance
   - Mobile-responsive rendering capabilities
   - Polish anatomical labels integration

3. **Interactive Features**
   - Region Selection System
     * Click to select brain regions
     * Hover tooltips with Polish descriptions
     * Multi-region selection capability
     * Selection state persistence
     * Keyboard navigation support
   
   - Supplement Effect Visualization
     * Color-coded activation patterns
     * Opacity animations for effect intensity
     * Temporal effect visualization (onset, peak, duration)
     * Dosage-response relationship mapping
     * Mechanism-specific visual indicators

4. **Brain Region Data Structure**
   ```typescript
   interface BrainRegionData {
     id: string;
     name: string;
     polishName: string;
     description: string;
     polishDescription: string;
     functions: string[];
     polishFunctions: string[];
     position: Vector3;
     color: string;
     supplementEffects: SupplementEffect[];
   }
   ```

5. **Supplement Integration**
   - Alpha-GPC Effects
     * Cholinergic enhancement in hippocampus and prefrontal cortex
     * Memory formation pathway highlighting
     * Acetylcholine receptor distribution visualization
   
   - L-Theanine Effects
     * Alpha wave promotion in frontal regions
     * GABA receptor activation patterns
     * Relaxation pathway visualization
   
   - Caffeine Effects
     * Adenosine receptor blockade visualization
     * Alertness network activation
     * Dopaminergic pathway enhancement

6. **Animation System**
   - Smooth region transitions with easing
   - Pulsing effects for active regions
   - Rotation and zoom animations
   - Timeline-based effect visualization
   - Performance-optimized frame rates (60fps target)

7. **User Interface Integration**
   - Control Panel Components
     * Region selection list with Polish names
     * Supplement effect toggles
     * Animation speed controls
     * View preset buttons (frontal, sagittal, coronal)
     * Reset and home position controls
   
   - Information Overlays
     * Html overlays for detailed region information
     * Supplement mechanism explanations
     * Polish educational content display
     * Interactive quiz integration points

8. **Educational Features**
   - Learning Modes
     * Exploration mode for free navigation
     * Guided tour mode with predefined paths
     * Quiz mode with region identification
     * Supplement effect demonstration mode
   
   - Progress Tracking
     * Region exploration completion
     * Quiz performance metrics
     * Time spent in different modes
     * Learning objective achievement

9. **Accessibility Considerations**
   - Keyboard navigation support
   - Screen reader compatibility
   - High contrast mode options
   - Motion reduction preferences
   - Polish language screen reader support

10. **Performance Optimization**
    - Frustum culling for off-screen regions
    - Instanced rendering for repeated elements
    - Texture compression and optimization
    - Memory management for mobile devices
    - Progressive loading for complex models

11. **Mobile Responsiveness**
    - Touch gesture support (pinch, pan, rotate)
    - Responsive UI scaling
    - Performance optimization for mobile GPUs
    - Battery usage considerations
    - Offline capability for core features

12. **Polish Localization**
    - Complete Polish anatomical terminology
    - Cultural context for brain function descriptions
    - Educational content adapted for Polish students
    - Medical terminology consistency
    - Regional accent considerations for audio

Generate comprehensive 3D brain visualization specifications with Polish educational focus and technical implementation details for the Suplementor platform.
```

## Expected Output
- Detailed technical architecture specifications
- Interactive feature requirements
- Brain region data structure definitions
- Animation and performance guidelines
- Polish localization requirements

## Related Files
- Brain3D component implementation
- Polish brain region data
- Supplement effect visualization data
- Educational content integration
