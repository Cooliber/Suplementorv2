/**
 * ScrollReveal Animation Component
 * Reveals content when scrolled into view
 */

"use client";

import { scrollRevealVariants } from "@/lib/animations/config";
import { useReducedMotion, useScrollReveal } from "@/lib/animations/hooks";
import { type HTMLMotionProps, motion } from "framer-motion";
import type React from "react";

interface ScrollRevealProps
	extends Omit<
		HTMLMotionProps<"div">,
		"variants" | "initial" | "animate" | "ref"
	> {
	/**
	 * Intersection observer threshold (0-1)
	 */
	threshold?: number;

	/**
	 * Root margin for intersection observer
	 */
	rootMargin?: string;

	/**
	 * Whether to animate only once
	 */
	once?: boolean;

	/**
	 * Children to animate
	 */
	children: React.ReactNode;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
	threshold = 0.1,
	rootMargin = "50px",
	once = true,
	children,
	...props
}) => {
	const shouldReduceMotion = useReducedMotion();
	const { ref, isVisible } = useScrollReveal({
		threshold,
		rootMargin,
	});

	// If reduced motion, render without animation
	if (shouldReduceMotion) {
		return <div className={props.className}>{children}</div>;
	}

	return (
		<motion.div
			ref={ref}
			variants={scrollRevealVariants}
			initial="hidden"
			animate={isVisible ? "visible" : once ? "hidden" : "hidden"}
			{...props}
		>
			{children}
		</motion.div>
	);
};

ScrollReveal.displayName = "ScrollReveal";
