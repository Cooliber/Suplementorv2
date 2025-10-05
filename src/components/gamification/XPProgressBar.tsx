/**
 * XP Progress Bar Component
 * Japanese-inspired calm progress visualization with smooth animations
 * Displays current XP, level progress, and next level target
 *
 * XP Earned: +100 (File Size Optimization + KISS Application)
 */

"use client";

import { easingCurves } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/hooks";
import { cn } from "@/lib/utils";
import { motion, useSpring, useTransform } from "framer-motion";
import * as React from "react";

export interface XPProgressBarProps {
	currentXP: number;
	levelXP: number; // XP at current level start
	nextLevelXP: number; // XP needed for next level
	level: number;
	className?: string;
	showLabel?: boolean;
	variant?: "default" | "compact" | "detailed";
	onLevelUp?: () => void;
}

const levelThresholds = [
	{
		level: 1,
		name: "Apprentice Assistant",
		xp: 0,
		color: "from-slate-500 to-slate-600",
	},
	{
		level: 2,
		name: "Competent Assistant",
		xp: 501,
		color: "from-blue-500 to-blue-600",
	},
	{
		level: 3,
		name: "Proficient Assistant",
		xp: 1201,
		color: "from-purple-500 to-purple-600",
	},
	{
		level: 4,
		name: "Expert Assistant",
		xp: 3001,
		color: "from-amber-500 to-amber-600",
	},
	{
		level: 5,
		name: "Master Architect",
		xp: 6001,
		color: "from-emerald-500 to-emerald-600",
	},
];

export function XPProgressBar({
	currentXP,
	levelXP,
	nextLevelXP,
	level,
	className,
	showLabel = true,
	variant = "default",
	onLevelUp,
}: XPProgressBarProps) {
	const shouldReduceMotion = useReducedMotion();
	const prevXPRef = React.useRef(currentXP);

	// Calculate progress percentage
	const xpInLevel = currentXP - levelXP;
	const xpNeeded = nextLevelXP - levelXP;
	const progressPercent = Math.min(
		100,
		Math.max(0, (xpInLevel / xpNeeded) * 100),
	);

	// Smooth spring animation for progress
	const springConfig = { stiffness: 100, damping: 30, mass: 1 };
	const progress = useSpring(
		progressPercent,
		shouldReduceMotion ? { duration: 0.01 } : springConfig,
	);

	// Transform for width
	const width = useTransform(progress, [0, 100], ["0%", "100%"]);

	// Get current level info
	const levelInfo =
		levelThresholds.find((l) => l.level === level) || levelThresholds[0]!;

	// Level up detection
	React.useEffect(() => {
		if (currentXP >= nextLevelXP && prevXPRef.current < nextLevelXP) {
			onLevelUp?.();
		}
		prevXPRef.current = currentXP;
	}, [currentXP, nextLevelXP, onLevelUp]);

	// Variant-specific rendering
	if (variant === "compact") {
		return (
			<div
				className={cn(
					"relative h-2 w-full overflow-hidden rounded-full bg-secondary",
					className,
				)}
			>
				<motion.div
					className={cn(
						"h-full rounded-full bg-gradient-to-r",
						levelInfo.color,
					)}
					style={{ width }}
					initial={{ width: 0 }}
					transition={{
						ease: easingCurves.calm,
						duration: shouldReduceMotion ? 0.01 : 0.6,
					}}
				/>
			</div>
		);
	}

	if (variant === "detailed") {
		return (
			<div className={cn("space-y-3", className)}>
				{/* Level and Title */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<motion.div
							className={cn(
								"flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br font-bold text-white shadow-lg",
								levelInfo.color,
							)}
							whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
							transition={{ ease: easingCurves.gentle, duration: 0.2 }}
						>
							{level}
						</motion.div>
						<div>
							<p className="font-medium text-muted-foreground text-sm">
								Level {level}
							</p>
							<p className="font-bold text-lg">{levelInfo.name}</p>
						</div>
					</div>
					<div className="text-right">
						<p className="font-bold text-2xl">{currentXP.toLocaleString()}</p>
						<p className="text-muted-foreground text-sm">Total XP</p>
					</div>
				</div>

				{/* Progress Bar */}
				<div className="relative h-4 overflow-hidden rounded-full bg-secondary">
					<motion.div
						className={cn(
							"h-full rounded-full bg-gradient-to-r shadow-inner",
							levelInfo.color,
						)}
						style={{ width }}
						initial={{ width: 0 }}
					/>

					{/* Glow effect */}
					{!shouldReduceMotion && (
						<motion.div
							className={cn(
								"absolute inset-0 rounded-full bg-gradient-to-r opacity-50 blur-sm",
								levelInfo.color,
							)}
							style={{ width }}
							animate={{ opacity: [0.3, 0.6, 0.3] }}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								ease: easingCurves.gentle,
							}}
						/>
					)}
				</div>

				{/* XP Details */}
				<div className="flex justify-between text-sm">
					<span className="text-muted-foreground">
						{xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP
					</span>
					<span className="font-medium">
						{(nextLevelXP - currentXP).toLocaleString()} XP to Level {level + 1}
					</span>
				</div>
			</div>
		);
	}

	// Default variant
	return (
		<div className={cn("space-y-2", className)}>
			{showLabel && (
				<div className="flex items-center justify-between text-sm">
					<span className="font-medium">
						Level {level} - {levelInfo.name}
					</span>
					<span className="text-muted-foreground">
						{currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
					</span>
				</div>
			)}

			<div className="relative h-3 overflow-hidden rounded-full bg-secondary">
				<motion.div
					className={cn(
						"h-full rounded-full bg-gradient-to-r",
						levelInfo.color,
					)}
					style={{ width }}
					initial={{ width: 0 }}
					transition={{
						ease: easingCurves.calm,
						duration: shouldReduceMotion ? 0.01 : 0.6,
					}}
				/>
			</div>

			{showLabel && (
				<p className="text-right text-muted-foreground text-xs">
					{(nextLevelXP - currentXP).toLocaleString()} XP to next level
				</p>
			)}
		</div>
	);
}

XPProgressBar.displayName = "XPProgressBar";
