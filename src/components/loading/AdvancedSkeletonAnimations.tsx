"use client";

/**
 * Advanced Skeleton Animations with Staggered Reveals
 * Enhanced loading states with sophisticated motion design
 */

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/lib/animations/hooks";
import { easings, durations, springs, staggerConfig } from "@/lib/animations/config";

interface StaggeredSkeletonProps {
	children: React.ReactNode;
	delay?: number;
	staggerDelay?: number;
	direction?: "up" | "down" | "left" | "right";
	className?: string;
}

export const StaggeredSkeleton: React.FC<StaggeredSkeletonProps> = ({
	children,
	delay = 0,
	staggerDelay = 0.1,
	direction = "up",
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	const directionMap = {
		up: { y: 20, x: 0 },
		down: { y: -20, x: 0 },
		left: { y: 0, x: 20 },
		right: { y: 0, x: -20 },
	};

	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, ...directionMap[direction] }}
			animate={{ opacity: 1, x: 0, y: 0 }}
			transition={{
				delay,
				duration: durations.normal,
				ease: easings.calm,
			}}
		>
			{children}
		</motion.div>
	);
};

interface SkeletonWaveProps {
	count?: number;
	className?: string;
}

export const SkeletonWave: React.FC<SkeletonWaveProps> = ({
	count = 5,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return (
			<div className={`flex items-end gap-1 ${className}`}>
				{Array.from({ length: count }).map((_, i) => (
					<Skeleton
						key={i}
						className="w-1 bg-muted-foreground/20"
						style={{
							height: `${Math.random() * 20 + 10}px`,
						}}
					/>
				))}
			</div>
		);
	}

	return (
		<div className={`flex items-end gap-1 ${className}`}>
			{Array.from({ length: count }).map((_, i) => (
				<motion.div
					key={i}
					className="w-1 bg-muted-foreground/20 rounded-sm"
					animate={{
						height: ["10px", `${Math.random() * 20 + 10}px`, "10px"],
					}}
					transition={{
						duration: 1.5,
						repeat: Number.POSITIVE_INFINITY,
						delay: i * 0.15,
						ease: easings.gentle,
					}}
				/>
			))}
		</div>
	);
};

interface PulsingSkeletonProps {
	className?: string;
	intensity?: "subtle" | "normal" | "strong";
}

export const PulsingSkeleton: React.FC<PulsingSkeletonProps> = ({
	className = "",
	intensity = "normal",
}) => {
	const shouldReduceMotion = useReducedMotion();

	const intensityMap = {
		subtle: { opacity: [0.3, 0.6, 0.3] },
		normal: { opacity: [0.2, 0.8, 0.2] },
		strong: { opacity: [0.1, 1, 0.1] },
	};

	if (shouldReduceMotion) {
		return <Skeleton className={className} />;
	}

	return (
		<motion.div
			className={`bg-muted ${className}`}
			animate={intensityMap[intensity]}
			transition={{
				duration: 1.5,
				repeat: Number.POSITIVE_INFINITY,
				ease: easings.gentle,
			}}
		/>
	);
};

interface ShimmerSkeletonProps {
	width?: string | number;
	height?: string | number;
	className?: string;
}

export const ShimmerSkeleton: React.FC<ShimmerSkeletonProps> = ({
	width = "100%",
	height = "16px",
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return (
			<Skeleton
				className={`bg-gradient-to-r from-muted via-muted-foreground/10 to-muted ${className}`}
				style={{ width, height }}
			/>
		);
	}

	return (
		<motion.div
			className={`bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] ${className}`}
			style={{ width, height }}
			animate={{
				backgroundPosition: ["200% 0", "-200% 0"],
			}}
			transition={{
				duration: 2.5,
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			}}
		/>
	);
};

interface StaggeredGridProps {
	items?: number;
	rows?: number;
	cols?: number;
	itemHeight?: string;
	gap?: string;
	className?: string;
}

export const StaggeredGrid: React.FC<StaggeredGridProps> = ({
	items = 6,
	rows = 2,
	cols = 3,
	itemHeight = "120px",
	gap = "1rem",
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return (
			<div
				className={`grid gap-${gap} ${className}`}
				style={{
					gridTemplateColumns: `repeat(${cols}, 1fr)`,
					gridTemplateRows: `repeat(${rows}, ${itemHeight})`,
				}}
			>
				{Array.from({ length: items }).map((_, i) => (
					<Skeleton key={i} className="w-full h-full" />
				))}
			</div>
		);
	}

	return (
		<div
			className={`grid gap-${gap} ${className}`}
			style={{
				gridTemplateColumns: `repeat(${cols}, 1fr)`,
				gridTemplateRows: `repeat(${rows}, ${itemHeight})`,
			}}
		>
			{Array.from({ length: items }).map((_, i) => (
				<motion.div
					key={i}
					className="w-full h-full"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						delay: i * 0.05,
						...springs.gentle,
					}}
				>
					<Skeleton className="w-full h-full" />
				</motion.div>
			))}
		</div>
	);
};

interface AnimatedSkeletonCardProps {
	variant?: "default" | "compact" | "detailed";
	showAvatar?: boolean;
	showActions?: boolean;
	className?: string;
}

export const AnimatedSkeletonCard: React.FC<AnimatedSkeletonCardProps> = ({
	variant = "default",
	showAvatar = true,
	showActions = false,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return (
			<Card className={className}>
				<CardHeader>
					{showAvatar && (
						<Skeleton className="w-12 h-12 rounded-full mb-4" />
					)}
					<Skeleton className="h-6 w-3/4" />
					<Skeleton className="h-4 w-full" />
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						{variant === "detailed" && (
							<>
								<Skeleton className="h-4 w-4/6" />
								<Skeleton className="h-4 w-3/4" />
							</>
						)}
					</div>
					{showActions && (
						<div className="flex gap-2 mt-4">
							<Skeleton className="h-8 w-16" />
							<Skeleton className="h-8 w-16" />
						</div>
					)}
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={className}>
			<CardHeader>
				{showAvatar && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ ...springs.gentle }}
					>
						<Skeleton className="w-12 h-12 rounded-full mb-4" />
					</motion.div>
				)}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1, duration: durations.normal, ease: easings.calm }}
				>
					<Skeleton className="h-6 w-3/4" />
					<Skeleton className="h-4 w-full" />
				</motion.div>
			</CardHeader>
			<CardContent>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2, duration: durations.normal, ease: easings.calm }}
				>
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						{variant === "detailed" && (
							<>
								<Skeleton className="h-4 w-4/6" />
								<Skeleton className="h-4 w-3/4" />
							</>
						)}
					</div>
					{showActions && (
						<motion.div
							className="flex gap-2 mt-4"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: durations.normal, ease: easings.calm }}
						>
							<Skeleton className="h-8 w-16" />
							<Skeleton className="h-8 w-16" />
						</motion.div>
					)}
				</motion.div>
			</CardContent>
		</Card>
	);
};

interface SkeletonListWithStaggerProps {
	items?: number;
	showAvatar?: boolean;
	showSubtitle?: boolean;
	className?: string;
}

export const SkeletonListWithStagger: React.FC<SkeletonListWithStaggerProps> = ({
	items = 5,
	showAvatar = true,
	showSubtitle = true,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return (
			<div className={`space-y-4 ${className}`}>
				{Array.from({ length: items }).map((_, i) => (
					<div key={i} className="flex items-center gap-4">
						{showAvatar && <Skeleton className="w-12 h-12 rounded-full" />}
						<div className="flex-1 space-y-2">
							<Skeleton className="h-5 w-3/4" />
							{showSubtitle && <Skeleton className="h-4 w-1/2" />}
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className={`space-y-4 ${className}`}>
			{Array.from({ length: items }).map((_, i) => (
				<motion.div
					key={i}
					className="flex items-center gap-4"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{
						delay: i * 0.08,
						duration: durations.normal,
						ease: easings.calm,
					}}
				>
					{showAvatar && (
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{
								delay: i * 0.08 + 0.1,
								...springs.gentle,
							}}
						>
							<Skeleton className="w-12 h-12 rounded-full" />
						</motion.div>
					)}
					<div className="flex-1 space-y-2">
						<Skeleton className="h-5 w-3/4" />
						{showSubtitle && <Skeleton className="h-4 w-1/2" />}
					</div>
				</motion.div>
			))}
		</div>
	);
};

interface SkeletonTableWithAnimationProps {
	rows?: number;
	columns?: number;
	showHeader?: boolean;
	className?: string;
}

export const SkeletonTableWithAnimation: React.FC<SkeletonTableWithAnimationProps> = ({
	rows = 5,
	columns = 4,
	showHeader = true,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return (
			<div className={`space-y-3 ${className}`}>
				{showHeader && (
					<div className="flex gap-4">
						{Array.from({ length: columns }).map((_, i) => (
							<Skeleton key={i} className="h-6 flex-1" />
						))}
					</div>
				)}
				{Array.from({ length: rows }).map((_, rowIndex) => (
					<div key={rowIndex} className="flex gap-4">
						{Array.from({ length: columns }).map((_, colIndex) => (
							<Skeleton key={colIndex} className="h-4 flex-1" />
						))}
					</div>
				))}
			</div>
		);
	}

	return (
		<div className={`space-y-3 ${className}`}>
			{showHeader && (
				<motion.div
					className="flex gap-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: durations.normal, ease: easings.calm }}
				>
					{Array.from({ length: columns }).map((_, i) => (
						<Skeleton key={i} className="h-6 flex-1" />
					))}
				</motion.div>
			)}

			{Array.from({ length: rows }).map((_, rowIndex) => (
				<motion.div
					key={rowIndex}
					className="flex gap-4"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{
						delay: rowIndex * 0.05,
						duration: durations.normal,
						ease: easings.calm,
					}}
				>
					{Array.from({ length: columns }).map((_, colIndex) => (
						<Skeleton key={colIndex} className="h-4 flex-1" />
					))}
				</motion.div>
			))}
		</div>
	);
};

interface BreathingSkeletonProps {
	count?: number;
	className?: string;
}

export const BreathingSkeleton: React.FC<BreathingSkeletonProps> = ({
	count = 3,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return (
			<div className={`flex gap-2 ${className}`}>
				{Array.from({ length: count }).map((_, i) => (
					<Skeleton key={i} className="w-2 h-8" />
				))}
			</div>
		);
	}

	return (
		<div className={`flex gap-2 ${className}`}>
			{Array.from({ length: count }).map((_, i) => (
				<motion.div
					key={i}
					className="w-2 bg-muted rounded-sm"
					animate={{
						height: ["20px", "40px", "20px"],
						opacity: [0.3, 1, 0.3],
					}}
					transition={{
						duration: 1.5,
						repeat: Number.POSITIVE_INFINITY,
						delay: i * 0.2,
						ease: easings.gentle,
					}}
				/>
			))}
		</div>
	);
};

interface SkeletonChartAnimationProps {
	type?: "bar" | "line" | "pie";
	bars?: number;
	className?: string;
}

export const SkeletonChartAnimation: React.FC<SkeletonChartAnimationProps> = ({
	type = "bar",
	bars = 6,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (type === "pie") {
		return (
			<div className={`relative ${className}`}>
				<Skeleton className="w-32 h-32 rounded-full mx-auto" />
				<div className="absolute inset-0 flex items-center justify-center">
					<Skeleton className="w-16 h-16 rounded-full" />
				</div>
			</div>
		);
	}

	if (type === "line") {
		return (
			<div className={`space-y-4 ${className}`}>
				<div className="flex justify-between">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-4 w-8" />
					))}
				</div>
				<div className="relative h-32">
					<Skeleton className="w-full h-full" />
				</div>
			</div>
		);
	}

	// Bar chart
	if (shouldReduceMotion) {
		return (
			<div className={`flex items-end gap-2 h-32 ${className}`}>
				{Array.from({ length: bars }).map((_, i) => (
					<Skeleton
						key={i}
						className="w-full bg-muted"
						style={{
							height: `${Math.random() * 60 + 20}%`,
						}}
					/>
				))}
			</div>
		);
	}

	return (
		<div className={`flex items-end gap-2 h-32 ${className}`}>
			{Array.from({ length: bars }).map((_, i) => (
				<motion.div
					key={i}
					className="w-full bg-muted rounded-sm"
					initial={{ height: 0 }}
					animate={{
						height: `${Math.random() * 60 + 20}%`,
					}}
					transition={{
						delay: i * 0.1,
						duration: durations.slow,
						ease: easings.calm,
					}}
				/>
			))}
		</div>
	);
};