/**
 * StaggerChildren Animation Component
 * Container that staggers animation of its children
 */

"use client";

import { staggerConfig } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/hooks";
import { type HTMLMotionProps, type Variants, motion } from "framer-motion";
import type React from "react";

type StaggerPreset = "subtle" | "normal" | "pronounced";

interface StaggerChildrenProps
	extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate"> {
	/**
	 * Stagger preset
	 */
	preset?: StaggerPreset;

	/**
	 * Custom stagger delay (in seconds)
	 */
	staggerDelay?: number;

	/**
	 * Delay before first child animates (in seconds)
	 */
	delayChildren?: number;

	/**
	 * Whether to animate on mount
	 */
	animateOnMount?: boolean;

	/**
	 * Children to animate
	 */
	children: React.ReactNode;
}

export const StaggerChildren: React.FC<StaggerChildrenProps> = ({
	preset = "normal",
	staggerDelay,
	delayChildren,
	animateOnMount = true,
	children,
	...props
}) => {
	const shouldReduceMotion = useReducedMotion();

	// If reduced motion, render without animation
	if (shouldReduceMotion) {
		return <div className={props.className}>{children}</div>;
	}

	// Get stagger configuration
	const config = staggerConfig[preset];

	// Create variants with stagger
	const containerVariants: Variants = {
		hidden: {
			opacity: 0,
		},
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: staggerDelay ?? config.staggerChildren,
				delayChildren: delayChildren ?? config.delayChildren,
			},
		},
	};

	return (
		<motion.div
			variants={containerVariants}
			initial={animateOnMount ? "hidden" : false}
			animate="visible"
			{...props}
		>
			{children}
		</motion.div>
	);
};

StaggerChildren.displayName = "StaggerChildren";
