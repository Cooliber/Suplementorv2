"use client";

/**
 * Smooth Transitions Between Loading and Loaded States
 * Elegant state transitions with Japanese-inspired motion
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/lib/animations/hooks";
import { easings, durations, springs } from "@/lib/animations/config";

interface ContentTransitionProps {
	isLoading?: boolean;
	skeleton: React.ReactNode;
	children: React.ReactNode;
	transitionType?: "fade" | "slide" | "scale" | "slideUp";
	className?: string;
}

export const ContentTransition: React.FC<ContentTransitionProps> = ({
	isLoading = false,
	skeleton,
	children,
	transitionType = "fade",
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	const transitionVariants = {
		fade: {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
		},
		slide: {
			initial: { opacity: 0, x: 20 },
			animate: { opacity: 1, x: 0 },
			exit: { opacity: 0, x: -20 },
		},
		scale: {
			initial: { opacity: 0, scale: 0.95 },
			animate: { opacity: 1, scale: 1 },
			exit: { opacity: 0, scale: 0.95 },
		},
		slideUp: {
			initial: { opacity: 0, y: 20 },
			animate: { opacity: 1, y: 0 },
			exit: { opacity: 0, y: -20 },
		},
	};

	return (
		<div className={`relative ${className}`}>
			<AnimatePresence mode="wait">
				{isLoading ? (
					<motion.div
						key="skeleton"
						variants={transitionVariants[transitionType]}
						initial="initial"
						animate="animate"
						exit="exit"
						transition={{
							duration: durations.normal,
							ease: easings.calm,
						}}
					>
						{skeleton}
					</motion.div>
				) : (
					<motion.div
						key="content"
						variants={transitionVariants[transitionType]}
						initial="initial"
						animate="animate"
						exit="exit"
						transition={{
							duration: durations.normal,
							ease: easings.calm,
						}}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

interface StaggeredContentRevealProps {
	isLoading?: boolean;
	skeleton: React.ReactNode;
	children: React.ReactNode;
	staggerDelay?: number;
	direction?: "up" | "down" | "left" | "right";
	className?: string;
}

export const StaggeredContentReveal: React.FC<StaggeredContentRevealProps> = ({
	isLoading = false,
	skeleton,
	children,
	staggerDelay = 0.1,
	direction = "up",
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (isLoading) {
		return <div className={className}>{skeleton}</div>;
	}

	const directionMap = {
		up: { y: 30 },
		down: { y: -30 },
		left: { x: 30 },
		right: { x: -30 },
	};

	// If children is a fragment or array, we need to handle it differently
	const contentArray = React.Children.toArray(children);

	return (
		<div className={className}>
			{contentArray.map((child, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, ...directionMap[direction] }}
					animate={{ opacity: 1, x: 0, y: 0 }}
					transition={{
						delay: index * staggerDelay,
						duration: durations.normal,
						ease: easings.calm,
					}}
				>
					{child}
				</motion.div>
			))}
		</div>
	);
};

interface MorphingContentProps {
	isLoading?: boolean;
	skeleton: React.ReactNode;
	children: React.ReactNode;
	morphType?: "height" | "width" | "both";
	className?: string;
}

export const MorphingContent: React.FC<MorphingContentProps> = ({
	isLoading = false,
	skeleton,
	children,
	morphType = "height",
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return (
			<div className={className}>
				{isLoading ? skeleton : children}
			</div>
		);
	}

	return (
		<div className={`relative overflow-hidden ${className}`}>
			<AnimatePresence mode="wait">
				{isLoading ? (
					<motion.div
						key="skeleton"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: durations.fast, ease: easings.calm }}
					>
						{skeleton}
					</motion.div>
				) : (
					<motion.div
						key="content"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: durations.fast, ease: easings.calm }}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

interface ProgressiveContentLoaderProps {
	steps: Array<{
		content: React.ReactNode;
		duration?: number;
	}>;
	onComplete?: () => void;
	autoPlay?: boolean;
	showProgress?: boolean;
	className?: string;
}

export const ProgressiveContentLoader: React.FC<ProgressiveContentLoaderProps> = ({
	steps,
	onComplete,
	autoPlay = true,
	showProgress = true,
	className = "",
}) => {
	const [currentStep, setCurrentStep] = useState(0);
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const shouldReduceMotion = useReducedMotion();

	useEffect(() => {
		if (!isPlaying || currentStep >= steps.length - 1) return;

		const timer = setTimeout(() => {
			setCurrentStep(prev => {
				const next = prev + 1;
				if (next >= steps.length - 1) {
					setIsPlaying(false);
					onComplete?.();
				}
				return next;
			});
		}, steps[currentStep]?.duration || 1000);

		return () => clearTimeout(timer);
	}, [currentStep, isPlaying, steps, onComplete]);

	const progress = ((currentStep + 1) / steps.length) * 100;

	return (
		<div className={`space-y-4 ${className}`}>
			{showProgress && (
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span>Krok {currentStep + 1} z {steps.length}</span>
						<span>{Math.round(progress)}%</span>
					</div>
					<div className="h-2 bg-muted rounded-full overflow-hidden">
						<motion.div
							className="h-full bg-primary"
							initial={{ width: 0 }}
							animate={{ width: `${progress}%` }}
							transition={{ duration: durations.normal, ease: easings.calm }}
						/>
					</div>
				</div>
			)}

			<AnimatePresence mode="wait">
				<motion.div
					key={currentStep}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: durations.normal, ease: easings.calm }}
				>
					{steps[currentStep]?.content}
				</motion.div>
			</AnimatePresence>

			{!autoPlay && currentStep < steps.length - 1 && (
				<div className="flex justify-center">
					<button
						onClick={() => setCurrentStep(prev => prev + 1)}
						className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
					>
						Następny krok
					</button>
				</div>
			)}
		</div>
	);
};

interface SmartContentTransitionProps {
	isLoading?: boolean;
	error?: Error | null;
	skeleton: React.ReactNode;
	errorFallback?: React.ReactNode;
	children: React.ReactNode;
	retry?: () => void;
	className?: string;
}

export const SmartContentTransition: React.FC<SmartContentTransitionProps> = ({
	isLoading = false,
	error = null,
	skeleton,
	errorFallback,
	children,
	retry,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (error) {
		return (
			<div className={className}>
				{errorFallback || (
					<Card>
						<CardContent className="pt-6">
							<div className="text-center space-y-4">
								<div className="text-red-500">
									<svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div>
									<p className="font-medium text-red-700 dark:text-red-400">
										Wystąpił błąd podczas ładowania
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										{error.message || "Nie udało się załadować zawartości"}
									</p>
								</div>
								{retry && (
									<button
										onClick={retry}
										className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
									>
										Spróbuj ponownie
									</button>
								)}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		);
	}

	return (
		<ContentTransition
			isLoading={isLoading}
			skeleton={skeleton}
			className={className}
		>
			{children}
		</ContentTransition>
	);
};

interface ListTransitionProps {
	items: any[];
	isLoading?: boolean;
	skeletonCount?: number;
	renderSkeleton?: (index: number) => React.ReactNode;
	renderItem: (item: any, index: number) => React.ReactNode;
	keyExtractor: (item: any, index: number) => string;
	staggerDelay?: number;
	className?: string;
}

export const ListTransition: React.FC<ListTransitionProps> = ({
	items,
	isLoading = false,
	skeletonCount = 5,
	renderSkeleton,
	renderItem,
	keyExtractor,
	staggerDelay = 0.05,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (isLoading) {
		return (
			<div className={`space-y-4 ${className}`}>
				{Array.from({ length: skeletonCount }).map((_, index) => (
					<motion.div
						key={`skeleton-${index}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							delay: index * staggerDelay,
							duration: durations.normal,
							ease: easings.calm,
						}}
					>
						{renderSkeleton ? renderSkeleton(index) : <Skeleton className="h-16 w-full" />}
					</motion.div>
				))}
			</div>
		);
	}

	return (
		<div className={`space-y-4 ${className}`}>
			<AnimatePresence>
				{items.map((item, index) => (
					<motion.div
						key={keyExtractor(item, index)}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{
							delay: index * staggerDelay,
							duration: durations.normal,
							ease: easings.calm,
						}}
						layout
					>
						{renderItem(item, index)}
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};

interface GridTransitionProps {
	items: any[];
	isLoading?: boolean;
	columns?: number;
	skeletonCount?: number;
	renderSkeleton?: (index: number) => React.ReactNode;
	renderItem: (item: any, index: number) => React.ReactNode;
	keyExtractor: (item: any, index: number) => string;
	staggerDelay?: number;
	className?: string;
}

export const GridTransition: React.FC<GridTransitionProps> = ({
	items,
	isLoading = false,
	columns = 3,
	skeletonCount = 6,
	renderSkeleton,
	renderItem,
	keyExtractor,
	staggerDelay = 0.03,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (isLoading) {
		return (
			<div
				className={`grid gap-4 ${className}`}
				style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
			>
				{Array.from({ length: skeletonCount }).map((_, index) => (
					<motion.div
						key={`skeleton-${index}`}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{
							delay: index * staggerDelay,
							...springs.gentle,
						}}
					>
						{renderSkeleton ? renderSkeleton(index) : <Skeleton className="aspect-square w-full" />}
					</motion.div>
				))}
			</div>
		);
	}

	return (
		<div
			className={`grid gap-4 ${className}`}
			style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
		>
			<AnimatePresence>
				{items.map((item, index) => (
					<motion.div
						key={keyExtractor(item, index)}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{
							delay: index * staggerDelay,
							...springs.gentle,
						}}
						layout
					>
						{renderItem(item, index)}
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};

interface PageTransitionProps {
	isLoading?: boolean;
	children: React.ReactNode;
	loadingMessage?: string;
	className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
	isLoading = false,
	children,
	loadingMessage = "Ładowanie strony...",
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	return (
		<AnimatePresence mode="wait">
			{isLoading ? (
				<motion.div
					key="loading"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: durations.normal, ease: easings.calm }}
					className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}
				>
					<div className="text-center space-y-4">
						<Skeleton className="w-16 h-16 rounded-full mx-auto" />
						<div className="space-y-2">
							<Skeleton className="h-6 w-48 mx-auto" />
							<Skeleton className="h-4 w-32 mx-auto" />
						</div>
					</div>
				</motion.div>
			) : (
				<motion.div
					key="content"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: durations.normal, ease: easings.calm }}
					className={className}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};