/**
 * SlideIn Animation Component
 * Directional slide animations with Japanese-inspired easing
 */

"use client";

import { slideVariants } from "@/lib/animations/config";
import { useAnimationDelay, useReducedMotion } from "@/lib/animations/hooks";
import { type HTMLMotionProps, motion } from "framer-motion";
import type React from "react";

type Direction = "up" | "down" | "left" | "right";

interface SlideInProps
	extends Omit<
		HTMLMotionProps<"div">,
		"variants" | "initial" | "animate" | "exit"
	> {
	/**
	 * Direction of slide animation
	 */
	direction?: Direction;

	/**
	 * Delay before animation starts (in milliseconds)
	 */
	delay?: number;

	/**
	 * Duration of animation (in seconds)
	 */
	duration?: number;

	/**
	 * Distance to slide (in pixels)
	 */
	distance?: number;

	/**
	 * Whether to animate on mount
	 */
	animateOnMount?: boolean;

	/**
	 * Children to animate
	 */
	children: React.ReactNode;
}

export const SlideIn: React.FC<SlideInProps> = ({
	direction = "up",
	delay = 0,
	duration,
	distance = 20,
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

	// Get variants for direction
	const variants = slideVariants[direction];

	// Customize distance if provided
	const customVariants =
		distance !== 20
			? {
					hidden: {
						...variants.hidden,
						[direction === "up" || direction === "down" ? "y" : "x"]:
							direction === "up" || direction === "left" ? distance : -distance,
					},
					visible: variants.visible,
					exit: {
						...variants.exit,
						[direction === "up" || direction === "down" ? "y" : "x"]:
							direction === "up" || direction === "left" ? -distance : distance,
					},
				}
			: variants;

	return (
		<motion.div
			variants={customVariants}
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

SlideIn.displayName = "SlideIn";
