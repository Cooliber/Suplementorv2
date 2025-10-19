"use client";

/**
 * Enhanced Animated Loading Indicators
 * Japanese-inspired loading animations with smooth, elegant motion
 */

import { durations, easings, springs } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/hooks";
import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import type React from "react";

interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg" | "xl";
	speed?: "slow" | "normal" | "fast";
	className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = "md",
	speed = "normal",
	className = "",
}) => {
	const shouldReduceMotion = useReducedMotion();

	const sizeMap = {
		sm: 16,
		md: 24,
		lg: 32,
		xl: 48,
	};

	const speedMap = {
		slow: 2,
		normal: 1.5,
		fast: 1,
	};

	if (shouldReduceMotion) {
		return (
			<Loader2
				className={`animate-spin text-muted-foreground ${className}`}
				size={sizeMap[size]}
			/>
		);
	}

	return (
		<motion.div
			className={className}
			animate={{ rotate: 360 }}
			transition={{
				duration: speedMap[speed],
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			}}
		>
			<Loader2 size={sizeMap[size]} className="text-muted-foreground" />
		</motion.div>
	);
};

export const PulseLoader: React.FC<{
	size?: "sm" | "md" | "lg";
	intensity?: "subtle" | "normal" | "strong";
	className?: string;
}> = ({ size = "md", intensity = "normal", className = "" }) => {
	const shouldReduceMotion = useReducedMotion();

	const sizeMap = {
		sm: 8,
		md: 16,
		lg: 24,
	};

	const intensityMap = {
		subtle: { scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] },
		normal: { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] },
		strong: { scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] },
	};

	if (shouldReduceMotion) {
		return (
			<div
				className={`rounded-full bg-primary ${className}`}
				style={{
					width: sizeMap[size],
					height: sizeMap[size],
				}}
			/>
		);
	}

	return (
		<motion.div
			className={`rounded-full bg-primary ${className}`}
			style={{
				width: sizeMap[size],
				height: sizeMap[size],
			}}
			animate={intensityMap[intensity]}
			transition={{
				duration: 1.5,
				repeat: Number.POSITIVE_INFINITY,
				ease: easings.gentle,
			}}
		/>
	);
};

export const ShimmerLoader: React.FC<{
	width?: string | number;
	height?: string | number;
	className?: string;
}> = ({ width = "100%", height = "16px", className = "" }) => {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return (
			<div
				className={`bg-[length:200%_100%] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${className}`}
				style={{ width, height }}
			/>
		);
	}

	return (
		<motion.div
			className={`bg-[length:200%_100%] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${className}`}
			style={{ width, height }}
			animate={{
				backgroundPosition: ["200% 0", "-200% 0"],
			}}
			transition={{
				duration: 2,
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			}}
		/>
	);
};

export const DotsLoader: React.FC<{
	count?: number;
	size?: "sm" | "md" | "lg";
	spacing?: "tight" | "normal" | "loose";
	className?: string;
}> = ({ count = 3, size = "md", spacing = "normal", className = "" }) => {
	const shouldReduceMotion = useReducedMotion();

	const sizeMap = {
		sm: 4,
		md: 6,
		lg: 8,
	};

	const spacingMap = {
		tight: 2,
		normal: 4,
		loose: 6,
	};

	if (shouldReduceMotion) {
		return (
			<div
				className={`flex items-center gap-${spacingMap[spacing]} ${className}`}
			>
				{Array.from({ length: count }).map((_, i) => (
					<div
						key={i}
						className="rounded-full bg-primary"
						style={{
							width: sizeMap[size],
							height: sizeMap[size],
						}}
					/>
				))}
			</div>
		);
	}

	return (
		<div
			className={`flex items-center gap-${spacingMap[spacing]} ${className}`}
		>
			{Array.from({ length: count }).map((_, i) => (
				<motion.div
					key={i}
					className="rounded-full bg-primary"
					style={{
						width: sizeMap[size],
						height: sizeMap[size],
					}}
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.7, 1, 0.7],
					}}
					transition={{
						duration: 1.2,
						repeat: Number.POSITIVE_INFINITY,
						delay: i * 0.2,
						ease: easings.gentle,
					}}
				/>
			))}
		</div>
	);
};

export const RingLoader: React.FC<{
	size?: "sm" | "md" | "lg";
	thickness?: "thin" | "normal" | "thick";
	className?: string;
}> = ({ size = "md", thickness = "normal", className = "" }) => {
	const shouldReduceMotion = useReducedMotion();

	const sizeMap = {
		sm: 24,
		md: 32,
		lg: 48,
	};

	const thicknessMap = {
		thin: 2,
		normal: 3,
		thick: 4,
	};

	if (shouldReduceMotion) {
		return (
			<div
				className={`animate-spin rounded-full border-2 border-primary/20 border-t-primary ${className}`}
				style={{
					width: sizeMap[size],
					height: sizeMap[size],
				}}
			/>
		);
	}

	return (
		<motion.div
			className={`rounded-full border-primary/20 ${className}`}
			style={{
				width: sizeMap[size],
				height: sizeMap[size],
				borderWidth: thicknessMap[thickness],
				borderTopColor: "rgb(var(--primary))",
			}}
			animate={{ rotate: 360 }}
			transition={{
				duration: 1,
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			}}
		/>
	);
};

export const WaveLoader: React.FC<{
	bars?: number;
	className?: string;
}> = ({ bars = 5, className = "" }) => {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return (
			<div className={`flex items-end gap-1 ${className}`}>
				{Array.from({ length: bars }).map((_, i) => (
					<div
						key={i}
						className="rounded-sm bg-primary"
						style={{
							width: "3px",
							height: `${Math.random() * 20 + 10}px`,
						}}
					/>
				))}
			</div>
		);
	}

	return (
		<div className={`flex items-end gap-1 ${className}`}>
			{Array.from({ length: bars }).map((_, i) => (
				<motion.div
					key={i}
					className="rounded-sm bg-primary"
					style={{ width: "3px" }}
					animate={{
						height: ["10px", `${Math.random() * 20 + 10}px`, "10px"],
					}}
					transition={{
						duration: 1.2,
						repeat: Number.POSITIVE_INFINITY,
						delay: i * 0.1,
						ease: easings.gentle,
					}}
				/>
			))}
		</div>
	);
};

export const BreathingLoader: React.FC<{
	size?: "sm" | "md" | "lg";
	className?: string;
}> = ({ size = "md", className = "" }) => {
	const shouldReduceMotion = useReducedMotion();

	const sizeMap = {
		sm: "8px",
		md: "16px",
		lg: "24px",
	};

	if (shouldReduceMotion) {
		return (
			<div
				className={`rounded-full bg-primary ${className}`}
				style={{
					width: sizeMap[size],
					height: sizeMap[size],
				}}
			/>
		);
	}

	return (
		<motion.div
			className={`rounded-full bg-primary ${className}`}
			style={{
				width: sizeMap[size],
				height: sizeMap[size],
			}}
			animate={{
				scale: [1, 1.2, 1],
				opacity: [0.6, 1, 0.6],
			}}
			transition={{
				duration: 2,
				repeat: Number.POSITIVE_INFINITY,
				ease: easings.calm,
			}}
		/>
	);
};

export const LoadingText: React.FC<{
	text?: string;
	showDots?: boolean;
	className?: string;
}> = ({ text = "Ładowanie", showDots = true, className = "" }) => {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return (
			<div className={`flex items-center gap-2 ${className}`}>
				<span className="text-muted-foreground">{text}</span>
				{showDots && <DotsLoader count={3} size="sm" />}
			</div>
		);
	}

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<span className="text-muted-foreground">{text}</span>
			{showDots && <DotsLoader count={3} size="sm" />}
		</div>
	);
};

export const SkeletonPulse: React.FC<{
	className?: string;
	children: React.ReactNode;
}> = ({ className = "", children }) => {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			className={className}
			animate={{
				opacity: [0.5, 1, 0.5],
			}}
			transition={{
				duration: 1.5,
				repeat: Number.POSITIVE_INFINITY,
				ease: easings.gentle,
			}}
		>
			{children}
		</motion.div>
	);
};
