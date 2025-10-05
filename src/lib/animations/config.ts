/**
 * Animation Configuration
 * Japanese-inspired easing curves and motion presets for Suplementor
 *
 * Philosophy: Calm, precise, elegant - not gaudy
 * Inspired by traditional Japanese aesthetics: ma (間), wabi-sabi, and kanso (simplicity)
 */

import type { Transition, Variants } from "framer-motion";

/**
 * Japanese-Inspired Easing Curves
 * Based on traditional Japanese motion principles
 */
export const easings = {
	// Gentle, natural easing - like water flowing
	gentle: [0.25, 0.1, 0.25, 1.0],

	// Calm entrance - like a sliding shoji door
	calm: [0.4, 0.0, 0.2, 1.0],

	// Precise movement - like a tea ceremony gesture
	precise: [0.45, 0.05, 0.55, 0.95],

	// Elegant exit - like cherry blossoms falling
	elegant: [0.7, 0.0, 0.3, 1.0],

	// Subtle bounce - minimal, refined
	subtleBounce: [0.34, 1.56, 0.64, 1.0],

	// Sharp but smooth - like a katana cut
	sharp: [0.9, 0.0, 0.1, 1.0],

	// Default smooth
	smooth: [0.43, 0.13, 0.23, 0.96],
} as const;

/**
 * Alias for backward compatibility
 */
export const easingCurves = easings;

/**
 * Duration presets (in seconds)
 * Shorter durations for subtlety
 */
export const durations = {
	instant: 0.1,
	fast: 0.2,
	normal: 0.3,
	slow: 0.5,
	slower: 0.8,
	slowest: 1.2,
} as const;

/**
 * Spring configurations
 * Subtle, refined spring physics
 */
export const springs = {
	// Gentle spring - minimal overshoot
	gentle: {
		type: "spring" as const,
		stiffness: 300,
		damping: 30,
		mass: 0.8,
	},

	// Calm spring - very subtle
	calm: {
		type: "spring" as const,
		stiffness: 200,
		damping: 25,
		mass: 1.0,
	},

	// Precise spring - no overshoot
	precise: {
		type: "spring" as const,
		stiffness: 400,
		damping: 40,
		mass: 0.5,
	},

	// Bouncy but refined
	subtle: {
		type: "spring" as const,
		stiffness: 260,
		damping: 20,
		mass: 0.7,
	},
} as const;

/**
 * Base transition configurations
 */
export const transitions = {
	// Default transition - gentle and calm
	default: {
		duration: durations.normal,
		ease: easings.gentle,
	},

	// Fast transition - for micro-interactions
	fast: {
		duration: durations.fast,
		ease: easings.calm,
	},

	// Slow transition - for emphasis
	slow: {
		duration: durations.slow,
		ease: easings.elegant,
	},

	// Spring transition - gentle bounce
	spring: springs.gentle,

	// Precise transition - no overshoot
	precise: {
		duration: durations.normal,
		ease: easings.precise,
	},
} as const;

/**
 * Fade animation variants
 */
export const fadeVariants: Variants = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
		transition: transitions.default,
	},
	exit: {
		opacity: 0,
		transition: transitions.fast,
	},
};

/**
 * Slide animation variants
 */
export const slideVariants = {
	up: {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: transitions.default },
		exit: { opacity: 0, y: -20, transition: transitions.fast },
	},
	down: {
		hidden: { opacity: 0, y: -20 },
		visible: { opacity: 1, y: 0, transition: transitions.default },
		exit: { opacity: 0, y: 20, transition: transitions.fast },
	},
	left: {
		hidden: { opacity: 0, x: 20 },
		visible: { opacity: 1, x: 0, transition: transitions.default },
		exit: { opacity: 0, x: -20, transition: transitions.fast },
	},
	right: {
		hidden: { opacity: 0, x: -20 },
		visible: { opacity: 1, x: 0, transition: transitions.default },
		exit: { opacity: 0, x: 20, transition: transitions.fast },
	},
} as const;

/**
 * Scale animation variants
 */
export const scaleVariants: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: transitions.spring,
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: transitions.fast,
	},
};

/**
 * Stagger children configuration
 */
export const staggerConfig = {
	// Subtle stagger - barely noticeable
	subtle: {
		staggerChildren: 0.03,
		delayChildren: 0.05,
	},

	// Normal stagger
	normal: {
		staggerChildren: 0.05,
		delayChildren: 0.1,
	},

	// Pronounced stagger
	pronounced: {
		staggerChildren: 0.1,
		delayChildren: 0.15,
	},
} as const;

/**
 * Page transition variants
 */
export const pageVariants: Variants = {
	initial: {
		opacity: 0,
		y: 8,
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: durations.normal,
			ease: easings.calm,
		},
	},
	exit: {
		opacity: 0,
		y: -8,
		transition: {
			duration: durations.fast,
			ease: easings.sharp,
		},
	},
};

/**
 * Modal/Dialog variants
 */
export const modalVariants: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.98,
		y: 10,
	},
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			duration: durations.normal,
			ease: easings.calm,
		},
	},
	exit: {
		opacity: 0,
		scale: 0.98,
		y: 10,
		transition: {
			duration: durations.fast,
			ease: easings.sharp,
		},
	},
};

/**
 * Hover animation presets
 */
export const hoverAnimations = {
	// Subtle lift - like paper lifting
	lift: {
		y: -2,
		transition: transitions.fast,
	},

	// Gentle scale
	scale: {
		scale: 1.02,
		transition: transitions.fast,
	},

	// Glow effect (opacity change)
	glow: {
		opacity: 0.9,
		transition: transitions.fast,
	},

	// Shift right - subtle
	shiftRight: {
		x: 2,
		transition: transitions.fast,
	},
} as const;

/**
 * Tap/Press animation presets
 */
export const tapAnimations = {
	// Subtle press
	press: {
		scale: 0.98,
		transition: { duration: durations.instant },
	},

	// Gentle press
	gentle: {
		scale: 0.99,
		transition: { duration: durations.instant },
	},
} as const;

/**
 * Loading animation variants
 */
export const loadingVariants: Variants = {
	pulse: {
		scale: [1, 1.05, 1],
		opacity: [0.5, 0.8, 0.5],
		transition: {
			duration: 1.5,
			repeat: Number.POSITIVE_INFINITY,
			ease: easings.gentle,
		},
	},
	shimmer: {
		backgroundPosition: ["200% 0", "-200% 0"],
		transition: {
			duration: 2,
			repeat: Number.POSITIVE_INFINITY,
			ease: "linear",
		},
	},
};

/**
 * Scroll reveal variants
 */
export const scrollRevealVariants: Variants = {
	hidden: {
		opacity: 0,
		y: 30,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: durations.slow,
			ease: easings.calm,
		},
	},
};

/**
 * Gesture configurations
 */
export const gestureConfig = {
	// Swipe thresholds
	swipe: {
		distance: 50,
		velocity: 0.5,
	},

	// Drag constraints
	drag: {
		elastic: 0.1,
		momentum: true,
	},
} as const;

/**
 * Reduced motion fallback
 */
export const reducedMotionTransition: Transition = {
	duration: 0.01,
	ease: "linear",
};
