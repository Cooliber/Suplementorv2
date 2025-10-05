/**
 * ScaleIn Animation Component
 * Scale animation with Japanese-inspired spring physics
 */

"use client";

import { scaleVariants } from "@/lib/animations/config";
import { useAnimationDelay, useReducedMotion } from "@/lib/animations/hooks";
import { type HTMLMotionProps, motion } from "framer-motion";
import type React from "react";

interface ScaleInProps
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
	 * Initial scale value
	 */
	initialScale?: number;

	/**
	 * Whether to animate on mount
	 */
	animateOnMount?: boolean;

	/**
	 * Children to animate
	 */
	children: React.ReactNode;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
	delay = 0,
	duration,
	initialScale = 0.95,
	animateOnMount = true,
	children,
	...props
}) => {
	const shouldReduceMotion = useReducedMotion();
	const isReady = useAnimationDelay(delay);

	// If reduced motion, render without animation
	if (shouldReduceMotion) {
		return <div className={props.className}>{children}</div>;
	}

	// Customize initial scale if provided
	const customVariants =
		initialScale !== 0.95
			? {
					hidden: {
						opacity: 0,
						scale: initialScale,
					},
					visible: scaleVariants.visible,
					exit: {
						opacity: 0,
						scale: initialScale,
					},
				}
			: scaleVariants;

	return (
		<motion.div
			variants={customVariants as any}
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

ScaleIn.displayName = "ScaleIn";
