/**
 * FadeIn Animation Component
 * Elegant fade-in animation with reduced motion support
 */

"use client";

import { fadeVariants } from "@/lib/animations/config";
import { useAnimationDelay, useReducedMotion } from "@/lib/animations/hooks";
import { type HTMLMotionProps, motion } from "framer-motion";
import type React from "react";

interface FadeInProps
	extends Omit<
		HTMLMotionProps<"div">,
		"variants" | "initial" | "animate" | "exit"
	> {
	/**
	 * Delay before animation starts (in milliseconds)
	 */
	delay?: number;

	/**
	 * Duration of animation (in seconds)
	 */
	duration?: number;

	/**
	 * Whether to animate on mount
	 */
	animateOnMount?: boolean;

	/**
	 * Custom variants (overrides default)
	 */
	customVariants?: typeof fadeVariants;

	/**
	 * Children to animate
	 */
	children: React.ReactNode;
}

export const FadeIn: React.FC<FadeInProps> = ({
	delay = 0,
	duration,
	animateOnMount = true,
	customVariants,
	children,
	...props
}) => {
	const shouldReduceMotion = useReducedMotion();
	const isReady = useAnimationDelay(delay);

	const variants = customVariants || fadeVariants;

	// If reduced motion, render without animation
	if (shouldReduceMotion) {
		return <div className={props.className}>{children}</div>;
	}

	return (
		<motion.div
			variants={variants}
			initial={animateOnMount ? "hidden" : false}
			animate={isReady ? "visible" : "hidden"}
			exit="exit"
			transition={duration ? { duration } : undefined}
			{...props}
		>
			{children}
		</motion.div>
	);
};

FadeIn.displayName = "FadeIn";
