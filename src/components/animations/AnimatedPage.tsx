/**
 * AnimatedPage Component
 * Wrapper for pages with smooth transitions
 */

"use client";

import { pageVariants } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/hooks";
import { type HTMLMotionProps, motion } from "framer-motion";
import type React from "react";

interface AnimatedPageProps
	extends Omit<
		HTMLMotionProps<"div">,
		"variants" | "initial" | "animate" | "exit"
	> {
	/**
	 * Children to animate
	 */
	children: React.ReactNode;

	/**
	 * Custom className
	 */
	className?: string;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({
	children,
	className,
	...props
}) => {
	const shouldReduceMotion = useReducedMotion();

	// If reduced motion, render without animation
	if (shouldReduceMotion) {
		return (
			<div className={className} {...(props as any)}>
				{children}
			</div>
		);
	}

	return (
		<motion.div
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
};

AnimatedPage.displayName = "AnimatedPage";
