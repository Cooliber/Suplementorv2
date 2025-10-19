"use client";

/**
 * Enhanced Progress Bars for Multi-Step Processes
 * Smooth animations and step-by-step progress visualization
 */

import { Progress } from "@/components/ui/progress";
import { durations, easings, springs } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/hooks";
import { motion, useSpring, useTransform } from "framer-motion";
import type React from "react";
import { useEffect } from "react";

interface EnhancedProgressBarProps {
	value: number;
	max?: number;
	showPercentage?: boolean;
	showLabel?: boolean;
	label?: string;
	size?: "sm" | "md" | "lg";
	variant?: "default" | "success" | "warning" | "error";
	animated?: boolean;
	className?: string;
}

export const EnhancedProgressBar: React.FC<EnhancedProgressBarProps> = ({
	value,
	max = 100,
	showPercentage = false,
	showLabel = false,
	label,
	size = "md",
	variant = "default",
	animated = true,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();
	const percentage = Math.min((value / max) * 100, 100);

	const sizeMap = {
		sm: "h-1",
		md: "h-2",
		lg: "h-3",
	};

	const variantMap = {
		default: "bg-primary",
		success: "bg-green-500",
		warning: "bg-yellow-500",
		error: "bg-red-500",
	};

	if (shouldReduceMotion || !animated) {
		return (
			<div className={`space-y-2 ${className}`}>
				{(showLabel || label) && (
					<div className="flex items-center justify-between">
						<span className="font-medium text-sm">{label}</span>
						{showPercentage && (
							<span className="text-muted-foreground text-sm">
								{Math.round(percentage)}%
							</span>
						)}
					</div>
				)}
				<Progress
					value={percentage}
					className={`${sizeMap[size]}[&>div]:${variantMap[variant]}`}
				/>
			</div>
		);
	}

	// Animated progress with spring physics
	const springConfig = { stiffness: 100, damping: 20, mass: 0.8 };
	const animatedValue = useSpring(0, springConfig);
	const width = useTransform(animatedValue, [0, 100], ["0%", "100%"]);

	useEffect(() => {
		animatedValue.set(percentage);
	}, [percentage, animatedValue]);

	return (
		<div className={`space-y-2 ${className}`}>
			{(showLabel || label) && (
				<div className="flex items-center justify-between">
					<span className="font-medium text-sm">{label}</span>
					{showPercentage && (
						<motion.span
							className="text-muted-foreground text-sm"
							key={Math.round(percentage)} // Re-animate when percentage changes
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: durations.fast, ease: easings.calm }}
						>
							{Math.round(percentage)}%
						</motion.span>
					)}
				</div>
			)}
			<div
				className={`relative ${sizeMap[size]} overflow-hidden rounded-full bg-secondary`}
			>
				<motion.div
					className={`h-full ${variantMap[variant]} rounded-full`}
					style={{ width }}
					transition={{
						...springConfig,
					}}
				/>
			</div>
		</div>
	);
};

interface MultiStepProgressProps {
	steps: Array<{
		label: string;
		description?: string;
		status: "completed" | "current" | "pending";
	}>;
	currentStep: number;
	showStepNumbers?: boolean;
	orientation?: "horizontal" | "vertical";
	className?: string;
}

export const MultiStepProgress: React.FC<MultiStepProgressProps> = ({
	steps,
	currentStep,
	showStepNumbers = true,
	orientation = "horizontal",
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	if (orientation === "vertical") {
		return (
			<div className={`space-y-4 ${className}`}>
				{steps.map((step, index) => {
					const isCompleted = index < currentStep;
					const isCurrent = index === currentStep;
					const isPending = index > currentStep;

					return (
						<div key={index} className="flex items-start gap-3">
							{/* Step indicator */}
							<div className="flex flex-col items-center">
								<motion.div
									className={`flex h-8 w-8 items-center justify-center rounded-full font-medium text-sm ${
										isCompleted
											? "bg-primary text-primary-foreground"
											: isCurrent
												? "border-2 border-primary bg-primary/10 text-primary"
												: "bg-muted text-muted-foreground"
									}`}
									initial={shouldReduceMotion ? {} : { scale: 0 }}
									animate={{ scale: 1 }}
									transition={{
										delay: index * 0.1,
										...springs.gentle,
									}}
								>
									{showStepNumbers ? index + 1 : isCompleted ? "✓" : ""}
								</motion.div>

								{/* Connector line */}
								{index < steps.length - 1 && (
									<motion.div
										className={`mt-2 h-8 w-0.5 ${
											isCompleted ? "bg-primary" : "bg-muted"
										}`}
										initial={{ height: 0 }}
										animate={{ height: 32 }}
										transition={{
											delay: (index + 1) * 0.1,
											duration: durations.normal,
											ease: easings.calm,
										}}
									/>
								)}
							</div>

							{/* Step content */}
							<div className="flex-1 pt-1">
								<motion.div
									initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{
										delay: index * 0.1,
										duration: durations.normal,
										ease: easings.calm,
									}}
								>
									<h3
										className={`font-medium ${isCurrent ? "text-primary" : ""}`}
									>
										{step.label}
									</h3>
									{step.description && (
										<p className="mt-1 text-muted-foreground text-sm">
											{step.description}
										</p>
									)}
								</motion.div>
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	// Horizontal layout
	return (
		<div className={`space-y-4 ${className}`}>
			{/* Progress bar */}
			<div className="relative">
				<div className="h-2 overflow-hidden rounded-full bg-muted">
					<motion.div
						className="h-full rounded-full bg-primary"
						initial={{ width: 0 }}
						animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
						transition={{
							duration: durations.slow,
							ease: easings.calm,
						}}
					/>
				</div>
			</div>

			{/* Step indicators */}
			<div className="flex justify-between">
				{steps.map((step, index) => {
					const isCompleted = index < currentStep;
					const isCurrent = index === currentStep;
					const isPending = index > currentStep;

					return (
						<div key={index} className="flex flex-1 flex-col items-center">
							{/* Step circle */}
							<motion.div
								className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full font-medium text-sm ${
									isCompleted
										? "bg-primary text-primary-foreground"
										: isCurrent
											? "border-2 border-primary bg-primary/10 text-primary"
											: "bg-muted text-muted-foreground"
								}`}
								initial={shouldReduceMotion ? {} : { scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									delay: index * 0.1,
									...springs.gentle,
								}}
							>
								{showStepNumbers ? index + 1 : isCompleted ? "✓" : ""}
							</motion.div>

							{/* Step label */}
							<motion.div
								className={`text-center text-sm ${
									isCurrent
										? "font-medium text-primary"
										: "text-muted-foreground"
								}`}
								initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									delay: index * 0.1 + 0.2,
									duration: durations.normal,
									ease: easings.calm,
								}}
							>
								{step.label}
							</motion.div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

interface CircularProgressProps {
	value: number;
	max?: number;
	size?: "sm" | "md" | "lg" | "xl";
	thickness?: "thin" | "normal" | "thick";
	showPercentage?: boolean;
	showLabel?: boolean;
	label?: string;
	children?: React.ReactNode;
	className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
	value,
	max = 100,
	size = "md",
	thickness = "normal",
	showPercentage = false,
	showLabel = false,
	label,
	children,
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();
	const percentage = Math.min((value / max) * 100, 100);

	const sizeMap = {
		sm: 40,
		md: 60,
		lg: 80,
		xl: 120,
	};

	const thicknessMap = {
		thin: 2,
		normal: 4,
		thick: 6,
	};

	const radius = (sizeMap[size] - thicknessMap[thickness] * 2) / 2;
	const circumference = radius * 2 * Math.PI;
	const strokeDasharray = circumference;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;

	if (shouldReduceMotion) {
		return (
			<div
				className={`relative inline-flex items-center justify-center ${className}`}
			>
				<div
					className="rounded-full border-primary"
					style={{
						width: sizeMap[size],
						height: sizeMap[size],
						borderWidth: thicknessMap[thickness],
					}}
				/>
				{(showPercentage || showLabel || label) && (
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						{showPercentage && (
							<span className="font-medium text-sm">
								{Math.round(percentage)}%
							</span>
						)}
						{label && (
							<span className="text-muted-foreground text-xs">{label}</span>
						)}
					</div>
				)}
				{children && (
					<div className="absolute inset-0 flex items-center justify-center">
						{children}
					</div>
				)}
			</div>
		);
	}

	return (
		<div
			className={`relative inline-flex items-center justify-center ${className}`}
		>
			<motion.svg
				width={sizeMap[size]}
				height={sizeMap[size]}
				className="-rotate-90 transform"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: durations.normal, ease: easings.calm }}
			>
				{/* Background circle */}
				<circle
					cx={sizeMap[size] / 2}
					cy={sizeMap[size] / 2}
					r={radius}
					stroke="currentColor"
					strokeWidth={thicknessMap[thickness]}
					fill="none"
					className="text-muted/20"
				/>

				{/* Progress circle */}
				<motion.circle
					cx={sizeMap[size] / 2}
					cy={sizeMap[size] / 2}
					r={radius}
					stroke="currentColor"
					strokeWidth={thicknessMap[thickness]}
					fill="none"
					strokeLinecap="round"
					className="text-primary"
					strokeDasharray={strokeDasharray}
					initial={{ strokeDashoffset: circumference }}
					animate={{ strokeDashoffset }}
					transition={{
						duration: durations.slow,
						ease: easings.calm,
					}}
				/>
			</motion.svg>

			{/* Content overlay */}
			{(showPercentage || showLabel || label || children) && (
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					{showPercentage && (
						<motion.span
							className="font-medium text-sm"
							key={Math.round(percentage)}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: durations.fast, ease: easings.calm }}
						>
							{Math.round(percentage)}%
						</motion.span>
					)}
					{label && (
						<span className="text-muted-foreground text-xs">{label}</span>
					)}
					{children}
				</div>
			)}
		</div>
	);
};

interface SegmentedProgressProps {
	segments: Array<{
		value: number;
		label?: string;
		color?: string;
	}>;
	total: number;
	showLabels?: boolean;
	size?: "sm" | "md" | "lg";
	className?: string;
}

export const SegmentedProgress: React.FC<SegmentedProgressProps> = ({
	segments,
	total,
	showLabels = false,
	size = "md",
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	const sizeMap = {
		sm: "h-1",
		md: "h-2",
		lg: "h-3",
	};

	const totalValue = segments.reduce((sum, segment) => sum + segment.value, 0);

	if (shouldReduceMotion) {
		return (
			<div className={`space-y-2 ${className}`}>
				<div className={`flex overflow-hidden rounded-full ${sizeMap[size]}`}>
					{segments.map((segment, index) => {
						const width = (segment.value / totalValue) * 100;
						return (
							<div
								key={index}
								className="h-full"
								style={{
									width: `${width}%`,
									backgroundColor:
										segment.color || `hsl(${index * 60}, 70%, 50%)`,
								}}
							/>
						);
					})}
				</div>
				{showLabels && (
					<div className="flex justify-between text-muted-foreground text-xs">
						{segments.map((segment, index) => (
							<span key={index}>{segment.label}</span>
						))}
					</div>
				)}
			</div>
		);
	}

	return (
		<div className={`space-y-2 ${className}`}>
			<div className={`flex overflow-hidden rounded-full ${sizeMap[size]}`}>
				{segments.map((segment, index) => {
					const width = (segment.value / totalValue) * 100;
					return (
						<motion.div
							key={index}
							className="h-full"
							style={{
								backgroundColor:
									segment.color || `hsl(${index * 60}, 70%, 50%)`,
							}}
							initial={{ width: 0 }}
							animate={{ width: `${width}%` }}
							transition={{
								delay: index * 0.1,
								duration: durations.normal,
								ease: easings.calm,
							}}
						/>
					);
				})}
			</div>
			{showLabels && (
				<motion.div
					className="flex justify-between text-muted-foreground text-xs"
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						delay: 0.3,
						duration: durations.normal,
						ease: easings.calm,
					}}
				>
					{segments.map((segment, index) => (
						<span key={index}>{segment.label}</span>
					))}
				</motion.div>
			)}
		</div>
	);
};
