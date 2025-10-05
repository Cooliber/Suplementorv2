/**
 * Animation Components Index
 * Export all animation components for easy importing
 */

export { FadeIn } from "./FadeIn";
export { SlideIn } from "./SlideIn";
export { ScaleIn } from "./ScaleIn";
export { AnimatedPage } from "./AnimatedPage";
export { StaggerChildren } from "./StaggerChildren";
export { ScrollReveal } from "./ScrollReveal";

// Note: HoverGlow and other Framer Motion components are in index.tsx
// They cannot be re-exported here due to TypeScript limitations with .tsx extensions

// Re-export animation config and hooks for convenience
export * from "@/lib/animations/config";
export * from "@/lib/animations/hooks";
