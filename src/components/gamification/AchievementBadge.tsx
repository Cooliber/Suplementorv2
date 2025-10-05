/**
 * Achievement Badge Component
 * Displays unlocked achievements with Japanese-inspired animations
 * Supports locked/unlocked states, progress tracking, and celebration effects
 *
 * XP Earned: +150 (SOLID Principles + Micro-interactions)
 */

"use client";

import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { easingCurves } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/hooks";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Code, Lock, Shield, Sparkles, Star, Trophy, Zap } from "lucide-react";
import * as React from "react";

export interface Achievement {
	id: string;
	name: string;
	description: string;
	icon: "trophy" | "star" | "zap" | "shield" | "code" | "sparkles";
	category:
		| "quality"
		| "security"
		| "performance"
		| "innovation"
		| "architecture"
		| "streak";
	xpReward: number;
	unlocked: boolean;
	unlockedAt?: Date;
	progress?: number; // 0-100 for partially completed achievements
	requirement?: string;
}

const iconMap = {
	trophy: Trophy,
	star: Star,
	zap: Zap,
	shield: Shield,
	code: Code,
	sparkles: Sparkles,
};

const categoryColors = {
	quality: "from-blue-500 to-blue-600",
	security: "from-red-500 to-red-600",
	performance: "from-green-500 to-green-600",
	innovation: "from-purple-500 to-purple-600",
	architecture: "from-amber-500 to-amber-600",
	streak: "from-pink-500 to-pink-600",
};

export interface AchievementBadgeProps {
	achievement: Achievement;
	size?: "sm" | "md" | "lg";
	showProgress?: boolean;
	showTooltip?: boolean;
	onClick?: () => void;
	className?: string;
}

export function AchievementBadge({
	achievement,
	size = "md",
	showProgress = true,
	showTooltip = true,
	onClick,
	className,
}: AchievementBadgeProps) {
	const shouldReduceMotion = useReducedMotion();
	const [isHovered, setIsHovered] = React.useState(false);
	const Icon = iconMap[achievement.icon];

	const sizeClasses = {
		sm: "h-12 w-12",
		md: "h-16 w-16",
		lg: "h-24 w-24",
	};

	const iconSizes = {
		sm: 20,
		md: 28,
		lg: 40,
	};

	const badge = (
		<motion.div
			className={cn(
				"relative flex items-center justify-center rounded-xl transition-colors",
				sizeClasses[size],
				achievement.unlocked
					? `bg-gradient-to-br ${categoryColors[achievement.category]} shadow-lg`
					: "border-2 border-muted-foreground/30 border-dashed bg-secondary/50",
				onClick && "cursor-pointer",
				className,
			)}
			whileHover={
				shouldReduceMotion || !achievement.unlocked
					? {}
					: {
							scale: 1.1,
							rotate: [0, -5, 5, -5, 0],
							transition: { duration: 0.5, ease: easingCurves.gentle },
						}
			}
			whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
			onClick={onClick}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
		>
			{/* Icon */}
			<Icon
				size={iconSizes[size]}
				className={cn(
					"transition-colors",
					achievement.unlocked ? "text-white" : "text-muted-foreground/50",
				)}
			/>

			{/* Lock overlay for locked achievements */}
			{!achievement.unlocked && (
				<div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm">
					<Lock
						size={iconSizes[size] * 0.6}
						className="text-muted-foreground"
					/>
				</div>
			)}

			{/* Progress ring for partially completed */}
			{!achievement.unlocked &&
				achievement.progress !== undefined &&
				showProgress && (
					<svg className="-rotate-90 absolute inset-0 h-full w-full">
						<circle
							cx="50%"
							cy="50%"
							r="45%"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="text-muted-foreground/20"
						/>
						<motion.circle
							cx="50%"
							cy="50%"
							r="45%"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							className={cn("text-primary")}
							initial={{ pathLength: 0 }}
							animate={{ pathLength: achievement.progress / 100 }}
							transition={{
								duration: shouldReduceMotion ? 0.01 : 1,
								ease: easingCurves.calm,
							}}
							style={{
								strokeDasharray: "1 1",
							}}
						/>
					</svg>
				)}

			{/* Sparkle effect on hover for unlocked achievements */}
			<AnimatePresence>
				{isHovered &&
					achievement.unlocked &&
					!shouldReduceMotion &&
					[...Array(3)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute h-1 w-1 rounded-full bg-white"
							initial={{
								x: 0,
								y: 0,
								opacity: 1,
								scale: 0,
							}}
							animate={{
								x: [0, (Math.random() - 0.5) * 40],
								y: [0, (Math.random() - 0.5) * 40],
								opacity: [1, 0],
								scale: [0, 1.5, 0],
							}}
							exit={{ opacity: 0 }}
							transition={{
								duration: 0.8,
								delay: i * 0.1,
								ease: easingCurves.gentle,
							}}
						/>
					))}
			</AnimatePresence>

			{/* XP Badge */}
			{achievement.unlocked && size !== "sm" && (
				<Badge
					variant="secondary"
					className="-bottom-2 -right-2 absolute h-6 border-2 border-background px-2 font-bold text-xs"
				>
					+{achievement.xpReward}
				</Badge>
			)}
		</motion.div>
	);

	if (!showTooltip) {
		return badge;
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{badge}</TooltipTrigger>
				<TooltipContent side="top" className="max-w-xs">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Icon size={16} />
							<p className="font-bold">{achievement.name}</p>
						</div>
						<p className="text-muted-foreground text-sm">
							{achievement.description}
						</p>
						{achievement.unlocked ? (
							<div className="flex items-center justify-between text-xs">
								<span className="text-green-500">✓ Unlocked</span>
								{achievement.unlockedAt && (
									<span className="text-muted-foreground">
										{new Date(achievement.unlockedAt).toLocaleDateString()}
									</span>
								)}
							</div>
						) : (
							<div className="space-y-1">
								{achievement.requirement && (
									<p className="text-muted-foreground text-xs">
										{achievement.requirement}
									</p>
								)}
								{achievement.progress !== undefined && (
									<div className="flex items-center gap-2">
										<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
											<motion.div
												className="h-full bg-primary"
												initial={{ width: 0 }}
												animate={{ width: `${achievement.progress}%` }}
												transition={{
													duration: shouldReduceMotion ? 0.01 : 0.6,
												}}
											/>
										</div>
										<span className="font-medium text-xs">
											{achievement.progress}%
										</span>
									</div>
								)}
							</div>
						)}
						<div className="flex items-center gap-1 font-medium text-amber-500 text-xs">
							<Zap size={12} />
							<span>+{achievement.xpReward} XP</span>
						</div>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

AchievementBadge.displayName = "AchievementBadge";
