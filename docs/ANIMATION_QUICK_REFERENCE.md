# Animation System - Quick Reference Guide

## 🚀 Quick Start

### Import Animation Components
```tsx
import { FadeIn, SlideIn, AnimatedPage } from '@/components/animations';
```

### Import Hooks
```tsx
import { useReducedMotion, useScrollReveal, useHoverAnimation } from '@/components/animations';
```

### Import Config
```tsx
import { easings, durations, hoverAnimations, tapAnimations } from '@/components/animations';
```

## 📦 Components

### FadeIn
Elegant fade-in animation.

```tsx
<FadeIn delay={100} duration={0.5}>
  <Card>Content</Card>
</FadeIn>
```

**Props:**
- `delay?: number` - Delay in ms (default: 0)
- `duration?: number` - Duration in seconds
- `animateOnMount?: boolean` - Animate on mount (default: true)
- `customVariants?: Variants` - Custom variants

### SlideIn
Directional slide animation.

```tsx
<SlideIn direction="up" delay={200} distance={30}>
  <Content />
</SlideIn>
```

**Props:**
- `direction?: 'up' | 'down' | 'left' | 'right'` - Direction (default: 'up')
- `delay?: number` - Delay in ms (default: 0)
- `duration?: number` - Duration in seconds
- `distance?: number` - Distance in px (default: 20)
- `animateOnMount?: boolean` - Animate on mount (default: true)

### AnimatedPage
Page wrapper with transitions.

```tsx
<AnimatedPage>
  <PageContent />
</AnimatedPage>
```

**Props:**
- `className?: string` - Custom className

## 🎣 Hooks

### useReducedMotion
Detect user's motion preference.

```tsx
const shouldReduceMotion = useReducedMotion();
// Returns: boolean
```

### useScrollReveal
Scroll-triggered animations.

```tsx
const { ref, isVisible } = useScrollReveal({
  threshold: 0.1,
  rootMargin: '50px',
});

<div ref={ref}>
  {isVisible && <Content />}
</div>
```

### useHoverAnimation
Hover effect management.

```tsx
const { isHovered, onHoverStart, onHoverEnd } = useHoverAnimation();

<div onMouseEnter={onHoverStart} onMouseLeave={onHoverEnd}>
  {isHovered ? 'Hovered!' : 'Hover me'}
</div>
```

### useStaggerDelay
Calculate stagger timing.

```tsx
const delay = useStaggerDelay(index, 0.05);
// Returns: number (delay in seconds)
```

## 🎨 Animation Patterns

### Pattern 1: Animated Card with Hover
```tsx
import { motion } from 'framer-motion';
import { hoverAnimations, tapAnimations } from '@/components/animations';

<motion.div
  whileHover={hoverAnimations.lift}
  whileTap={tapAnimations.gentle}
  className="card"
>
  <CardContent />
</motion.div>
```

### Pattern 2: Staggered List
```tsx
import { motion } from 'framer-motion';
import { staggerConfig, fadeVariants } from '@/components/animations';

<motion.div
  variants={{ visible: { transition: staggerConfig.normal } }}
  initial="hidden"
  animate="visible"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={fadeVariants}>
      <Item data={item} />
    </motion.div>
  ))}
</motion.div>
```

### Pattern 3: Scroll Reveal
```tsx
import { motion } from 'framer-motion';
import { useScrollReveal, scrollRevealVariants } from '@/components/animations';

const { ref, isVisible } = useScrollReveal();

<motion.div
  ref={ref}
  variants={scrollRevealVariants}
  initial="hidden"
  animate={isVisible ? 'visible' : 'hidden'}
>
  <Content />
</motion.div>
```

### Pattern 4: Page Transition
```tsx
import { AnimatedPage } from '@/components/animations';

export default function MyPage() {
  return (
    <AnimatedPage>
      <h1>Page Title</h1>
      <Content />
    </AnimatedPage>
  );
}
```

### Pattern 5: Modal with Backdrop
```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants } from '@/components/animations';

<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="backdrop"
      />
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="modal"
      >
        <ModalContent />
      </motion.div>
    </>
  )}
</AnimatePresence>
```

## 🎯 Easing Curves

### Japanese-Inspired Easings
```tsx
import { easings } from '@/components/animations';

// Like water flowing
easings.gentle // [0.25, 0.1, 0.25, 1.0]

// Like sliding shoji door
easings.calm // [0.4, 0.0, 0.2, 1.0]

// Like tea ceremony gesture
easings.precise // [0.45, 0.05, 0.55, 0.95]

// Like cherry blossoms falling
easings.elegant // [0.7, 0.0, 0.3, 1.0]

// Like katana cut
easings.sharp // [0.9, 0.0, 0.1, 1.0]
```

### Usage
```tsx
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3, ease: easings.calm }}
>
  Content
</motion.div>
```

## ⏱️ Duration Presets

```tsx
import { durations } from '@/components/animations';

durations.instant  // 0.1s
durations.fast     // 0.2s
durations.normal   // 0.3s
durations.slow     // 0.5s
durations.slower   // 0.8s
durations.slowest  // 1.2s
```

## 🌸 Spring Configurations

```tsx
import { springs } from '@/components/animations';

springs.gentle  // Minimal overshoot
springs.calm    // Very subtle
springs.precise // No overshoot
springs.subtle  // Bouncy but refined
```

### Usage
```tsx
<motion.div
  animate={{ scale: 1 }}
  transition={springs.gentle}
>
  Content
</motion.div>
```

## 🎭 Hover & Tap Animations

### Hover Animations
```tsx
import { hoverAnimations } from '@/components/animations';

hoverAnimations.lift       // y: -2
hoverAnimations.scale      // scale: 1.02
hoverAnimations.glow       // opacity: 0.9
hoverAnimations.shiftRight // x: 2
```

### Tap Animations
```tsx
import { tapAnimations } from '@/components/animations';

tapAnimations.press  // scale: 0.98
tapAnimations.gentle // scale: 0.99
```

### Usage
```tsx
<motion.button
  whileHover={hoverAnimations.lift}
  whileTap={tapAnimations.press}
>
  Click me
</motion.button>
```

## 📱 Responsive Animations

### Disable on Mobile
```tsx
import { useReducedMotion } from '@/components/animations';

const shouldReduceMotion = useReducedMotion();
const isMobile = useMediaQuery('(max-width: 768px)');

<motion.div
  animate={!shouldReduceMotion && !isMobile ? { y: 0 } : {}}
>
  Content
</motion.div>
```

## ♿ Accessibility

### Always Respect Reduced Motion
```tsx
import { useReducedMotion } from '@/components/animations';

const shouldReduceMotion = useReducedMotion();

// All animation components automatically respect this
// Manual usage:
<motion.div
  animate={shouldReduceMotion ? {} : { opacity: 1 }}
>
  Content
</motion.div>
```

## 🎨 Best Practices

### DO ✅
- Use `AnimatedPage` for all pages
- Use `FadeIn` for content reveals
- Use `SlideIn` for list items
- Respect reduced motion preference
- Keep animations subtle (Japanese aesthetic)
- Use appropriate easing curves
- Test on low-end devices

### DON'T ❌
- Overuse animations (less is more)
- Use long durations (> 1s)
- Animate layout properties (width, height)
- Ignore reduced motion
- Use gaudy effects
- Animate on every interaction
- Forget to test performance

## 🔧 Troubleshooting

### Animation Not Working
1. Check if reduced motion is enabled
2. Verify Framer Motion is installed
3. Check component is wrapped in motion.*
4. Verify variants are correct

### Performance Issues
1. Use `will-change` CSS property
2. Animate transform and opacity only
3. Use GPU-accelerated properties
4. Reduce number of animated elements
5. Use `React.memo` for list items

### Accessibility Issues
1. Always use `useReducedMotion()`
2. Provide fallback for no-JS
3. Test with screen readers
4. Ensure keyboard navigation works

## 📚 Resources

- [Animation Config](../src/lib/animations/config.ts)
- [Animation Hooks](../src/lib/animations/hooks.ts)
- [Animation Components](../src/components/animations/)
- [Framer Motion Docs](https://www.framer.com/motion/)

---

**Quick Tip**: Start with `AnimatedPage`, `FadeIn`, and `SlideIn`. These cover 80% of use cases!

