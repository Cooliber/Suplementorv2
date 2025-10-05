"use client";

/**
 * Japanese-Inspired Animation Components
 *
 * Design Principles:
 * - Ma (間): Negative space, breathing room
 * - Kanso (簡素): Simplicity, elimination of clutter
 * - Shizen (自然): Naturalness, effortlessness
 * - Seijaku (静寂): Tranquility, calm energy
 *
 * Animation Guidelines:
 * - Timing: 300-500ms (calm, not rushed)
 * - Easing: cubic-bezier(0.4, 0.0, 0.2, 1) (smooth)
 * - Distance: 20-40px (subtle, not dramatic)
 * - Opacity: 0 → 1 (gentle fade)
 * - Scale: 0.95 → 1 (minimal)
 */

import { type Variants, motion } from "framer-motion";
import type { ReactNode } from "react";

// Easing curves - Japanese aesthetic (smooth, natural)
export const easings = {
	smooth: [0.4, 0.0, 0.2, 1], // Default smooth easing
	gentle: [0.25, 0.1, 0.25, 1], // Very gentle
	natural: [0.33, 0.0, 0.2, 1], // Natural movement
	calm: [0.45, 0.0, 0.15, 1], // Calm, peaceful
} as const;

// Animation variants
const fadeInVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.4,
			ease: easings.smooth,
		},
	},
};

const slideInVariants = (
	direction: "up" | "down" | "left" | "right" = "up",
): Variants => {
	const directions = {
		up: { y: 30 },
		down: { y: -30 },
		left: { x: 30 },
		right: { x: -30 },
	};

	return {
		hidden: {
			opacity: 0,
			...directions[direction],
		},
		visible: {
			opacity: 1,
			x: 0,
			y: 0,
			transition: {
				duration: 0.5,
				ease: easings.smooth,
			},
		},
	};
};

const scaleInVariants: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.4,
			ease: easings.gentle,
		},
	},
};

// Component Props
interface AnimationProps {
	children: ReactNode;
	delay?: number;
	className?: string;
}

interface SlideInProps extends AnimationProps {
	direction?: "up" | "down" | "left" | "right";
}

/**
 * AnimatedPage - Wrapper for page transitions
 * Use this to wrap entire pages for smooth transitions
 */
export function AnimatedPage({ children, className }: AnimationProps) {
	return (
		<motion.div
			initial="hidden"
			animate="visible"
			exit="hidden"
			variants={fadeInVariants}
			className={className}
		>
			{children}
		</motion.div>
	);
}

/**
 * FadeIn - Gentle fade-in animation
 * Perfect for: Text, images, cards
 */
export function FadeIn({ children, delay = 0, className }: AnimationProps) {
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
			variants={fadeInVariants}
			transition={{ delay }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

/**
 * SlideIn - Smooth slide animation
 * Perfect for: Cards, sections, modals
 */
export function SlideIn({
	children,
	direction = "up",
	delay = 0,
	className,
}: SlideInProps) {
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
			variants={slideInVariants(direction)}
			transition={{ delay }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

/**
 * ScaleIn - Subtle scale animation
 * Perfect for: Buttons, icons, small elements
 */
export function ScaleIn({ children, delay = 0, className }: AnimationProps) {
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
			variants={scaleInVariants}
			transition={{ delay }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

/**
 * Stagger - Staggered children animations
 * Perfect for: Lists, grids, multiple cards
 */
interface StaggerProps extends AnimationProps {
	staggerDelay?: number;
}

export function Stagger({
	children,
	delay = 0,
	staggerDelay = 0.1,
	className,
}: StaggerProps) {
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				delayChildren: delay,
				staggerChildren: staggerDelay,
			},
		},
	};

	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
			variants={containerVariants}
			className={className}
		>
			{children}
		</motion.div>
	);
}

/**
 * StaggerItem - Individual item in a staggered list
 * Use inside Stagger component
 */
export function StaggerItem({ children, className }: AnimationProps) {
	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.4,
				ease: easings.smooth,
			},
		},
	};

	return (
		<motion.div variants={itemVariants} className={className}>
			{children}
		</motion.div>
	);
}

/**
 * HoverScale - Subtle hover scale effect
 * Perfect for: Interactive cards, buttons
 */
export function HoverScale({ children, className }: AnimationProps) {
	return (
		<motion.div
			whileHover={{
				scale: 1.02,
				transition: { duration: 0.2, ease: easings.gentle },
			}}
			whileTap={{ scale: 0.98 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

/**
 * HoverGlow - Subtle glow effect on hover
 * Perfect for: Cards, buttons, interactive elements
 */
export function HoverGlow({ children, className }: AnimationProps) {
	return (
		<motion.div
			whileHover={{
				boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
				transition: { duration: 0.3, ease: easings.smooth },
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}

/**
 * PulseGlow - Gentle pulsing glow
 * Perfect for: Loading states, active indicators
 */
export function PulseGlow({ children, className }: AnimationProps) {
	return (
		<motion.div
			animate={{
				boxShadow: [
					"0 0 0 0 rgba(59, 130, 246, 0)",
					"0 0 0 10px rgba(59, 130, 246, 0.1)",
					"0 0 0 0 rgba(59, 130, 246, 0)",
				],
			}}
			transition={{
				duration: 2,
				repeat: Number.POSITIVE_INFINITY,
				ease: easings.calm,
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}

/**
 * ShimmerEffect - Shimmer loading effect
 * Perfect for: Skeleton screens, loading states
 */
export function ShimmerEffect({ className }: { className?: string }) {
	return (
		<motion.div
			className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${className}`}
			animate={{
				backgroundPosition: ["200% 0", "-200% 0"],
			}}
			transition={{
				duration: 2,
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			}}
			style={{
				backgroundImage:
					"linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
				backgroundSize: "200% 100%",
			}}
		/>
	);
}

// Export all components and types
export { motion, type Variants };
export type { AnimationProps, SlideInProps, StaggerProps };
