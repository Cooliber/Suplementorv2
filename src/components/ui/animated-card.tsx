/**
 * AnimatedCard Component
 * Enhanced card with Japanese-inspired hover animations
 */

"use client";

import { type HTMLMotionProps, motion } from "framer-motion";
import * as React from "react";

import { hoverAnimations, tapAnimations } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/hooks";
import { cn } from "@/lib/utils";

export interface AnimatedCardProps
	extends Omit<HTMLMotionProps<"div">, "whileHover" | "whileTap"> {
	/**
	 * Animation style for hover
	 */
	hoverStyle?: "lift" | "scale" | "glow" | "none";
	/**
	 * Whether card is clickable
	 */
	clickable?: boolean;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
	(
		{ className, hoverStyle = "lift", clickable = false, children, ...props },
		ref,
	) => {
		const shouldReduceMotion = useReducedMotion();

		// Get animation configurations
		const hoverAnimation =
			hoverStyle !== "none" && !shouldReduceMotion
				? hoverAnimations[hoverStyle]
				: undefined;

		const tapAnimation =
			clickable && !shouldReduceMotion ? tapAnimations.gentle : undefined;

		return (
			<motion.div
				ref={ref}
				className={cn(
					"rounded-lg border bg-card text-card-foreground shadow-sm",
					clickable && "cursor-pointer",
					className,
				)}
				whileHover={hoverAnimation}
				whileTap={tapAnimation}
				{...props}
			>
				{children}
			</motion.div>
		);
	},
);
AnimatedCard.displayName = "AnimatedCard";

const AnimatedCardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex flex-col space-y-1.5 p-6", className)}
		{...props}
	/>
));
AnimatedCardHeader.displayName = "AnimatedCardHeader";

const AnimatedCardTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			"font-semibold text-2xl leading-none tracking-tight",
			className,
		)}
		{...props}
	/>
));
AnimatedCardTitle.displayName = "AnimatedCardTitle";

const AnimatedCardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn("text-muted-foreground text-sm", className)}
		{...props}
	/>
));
AnimatedCardDescription.displayName = "AnimatedCardDescription";

const AnimatedCardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
AnimatedCardContent.displayName = "AnimatedCardContent";

const AnimatedCardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex items-center p-6 pt-0", className)}
		{...props}
	/>
));
AnimatedCardFooter.displayName = "AnimatedCardFooter";

export {
	AnimatedCard,
	AnimatedCardHeader,
	AnimatedCardFooter,
	AnimatedCardTitle,
	AnimatedCardDescription,
	AnimatedCardContent,
};
