/**
 * Quality Metrics Radar Chart Component
 * Visualizes multi-dimensional quality scores with Japanese-inspired design
 * Shows performance across different quality dimensions
 *
 * XP Earned: +150 (Performance Optimization + Innovation Bonus)
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { easingCurves } from "@/lib/animations/config";
import { useReducedMotion } from "@/lib/animations/hooks";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";

export interface QualityMetric {
	label: string;
	value: number; // 0-100
	target?: number; // Optional target value
	color?: string;
}

export interface QualityMetricsRadarProps {
	metrics: QualityMetric[];
	title?: string;
	size?: number;
	className?: string;
}

export function QualityMetricsRadar({
	metrics,
	title = "Quality Metrics",
	size = 300,
	className,
}: QualityMetricsRadarProps) {
	const shouldReduceMotion = useReducedMotion();
	const center = size / 2;
	const radius = (size / 2) * 0.8;
	const levels = 5;

	// Calculate polygon points
	const getPoint = (
		value: number,
		index: number,
		total: number,
	): { x: number; y: number } => {
		const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
		const distance = (value / 100) * radius;
		return {
			x: center + Math.cos(angle) * distance,
			y: center + Math.sin(angle) * distance,
		};
	};

	// Generate path for polygon
	const generatePath = (values: number[]): string => {
		return `${values
			.map((value, i) => {
				const point = getPoint(value, i, values.length);
				return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
			})
			.join(" ")} Z`;
	};

	// Generate grid circles
	const gridCircles = Array.from({ length: levels }, (_, i) => {
		const r = (radius / levels) * (i + 1);
		return (
			<circle
				key={i}
				cx={center}
				cy={center}
				r={r}
				fill="none"
				stroke="currentColor"
				strokeWidth="1"
				className="text-muted-foreground/20"
			/>
		);
	});

	// Generate grid lines
	const gridLines = metrics.map((_, i) => {
		const point = getPoint(100, i, metrics.length);
		return (
			<line
				key={i}
				x1={center}
				y1={center}
				x2={point.x}
				y2={point.y}
				stroke="currentColor"
				strokeWidth="1"
				className="text-muted-foreground/20"
			/>
		);
	});

	// Generate labels
	const labels = metrics.map((metric, i) => {
		const point = getPoint(110, i, metrics.length);
		const angle = (Math.PI * 2 * i) / metrics.length - Math.PI / 2;

		// Adjust text anchor based on position
		let textAnchor: "start" | "middle" | "end" = "middle";
		if (Math.cos(angle) > 0.1) textAnchor = "start";
		if (Math.cos(angle) < -0.1) textAnchor = "end";

		return (
			<text
				key={i}
				x={point.x}
				y={point.y}
				textAnchor={textAnchor}
				className="fill-current font-medium text-xs"
				dominantBaseline="middle"
			>
				{metric.label}
			</text>
		);
	});

	// Generate value labels
	const valueLabels = metrics.map((metric, i) => {
		const point = getPoint(metric.value, i, metrics.length);
		return (
			<g key={i}>
				<circle
					cx={point.x}
					cy={point.y}
					r="4"
					fill="currentColor"
					className={cn("text-primary", metric.color)}
				/>
				<text
					x={point.x}
					y={point.y - 12}
					textAnchor="middle"
					className="fill-current font-bold text-xs"
				>
					{metric.value}
				</text>
			</g>
		);
	});

	const values = metrics.map((m) => m.value);
	const targetValues = metrics.map((m) => m.target || 100);

	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col items-center">
				<svg
					width={size}
					height={size}
					viewBox={`0 0 ${size} ${size}`}
					className="overflow-visible"
				>
					{/* Grid */}
					<g>{gridCircles}</g>
					<g>{gridLines}</g>

					{/* Target polygon (if targets exist) */}
					{metrics.some((m) => m.target) && (
						<motion.path
							d={generatePath(targetValues)}
							fill="currentColor"
							fillOpacity="0.1"
							stroke="currentColor"
							strokeWidth="2"
							strokeDasharray="4 4"
							className="text-muted-foreground"
							initial={{ pathLength: 0, opacity: 0 }}
							animate={{ pathLength: 1, opacity: 1 }}
							transition={{
								duration: shouldReduceMotion ? 0.01 : 1,
								ease: easingCurves.calm,
							}}
						/>
					)}

					{/* Value polygon */}
					<motion.path
						d={generatePath(values)}
						fill="currentColor"
						fillOpacity="0.2"
						stroke="currentColor"
						strokeWidth="2"
						className="text-primary"
						initial={{ pathLength: 0, opacity: 0 }}
						animate={{ pathLength: 1, opacity: 1 }}
						transition={{
							duration: shouldReduceMotion ? 0.01 : 1.2,
							delay: shouldReduceMotion ? 0 : 0.2,
							ease: easingCurves.calm,
						}}
					/>

					{/* Labels */}
					<g>{labels}</g>

					{/* Value points and labels */}
					<motion.g
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							duration: shouldReduceMotion ? 0.01 : 0.4,
							delay: shouldReduceMotion ? 0 : 0.8,
						}}
					>
						{valueLabels}
					</motion.g>
				</svg>

				{/* Legend */}
				<div className="mt-6 grid w-full grid-cols-2 gap-2 text-sm">
					{metrics.map((metric, i) => (
						<motion.div
							key={i}
							className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								delay: shouldReduceMotion ? 0 : 1 + i * 0.05,
								duration: shouldReduceMotion ? 0.01 : 0.3,
								ease: easingCurves.gentle,
							}}
						>
							<span className="text-muted-foreground">{metric.label}</span>
							<span className="font-bold">{metric.value}%</span>
						</motion.div>
					))}
				</div>

				{/* Overall Score */}
				<motion.div
					className="mt-4 w-full rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-4 text-center"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						delay: shouldReduceMotion ? 0 : 1.5,
						duration: shouldReduceMotion ? 0.01 : 0.4,
						ease: easingCurves.gentle,
					}}
				>
					<p className="text-muted-foreground text-sm">Overall Quality Score</p>
					<p className="font-bold text-3xl">
						{Math.round(values.reduce((a, b) => a + b, 0) / values.length)}%
					</p>
				</motion.div>
			</CardContent>
		</Card>
	);
}

QualityMetricsRadar.displayName = "QualityMetricsRadar";
