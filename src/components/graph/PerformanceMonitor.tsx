"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
	Activity,
	AlertTriangle,
	BarChart3,
	Cpu,
	Eye,
	EyeOff,
	HardDrive,
	RefreshCw,
	Settings,
	TrendingDown,
	TrendingUp,
	Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface PerformanceMetrics {
	fps: number;
	memoryUsage: number;
	heapSize: number;
	renderTime: number;
	nodeCount: number;
	relationshipCount: number;
	timestamp: number;
}

interface PerformanceThresholds {
	fps: { warning: number; critical: number };
	memory: { warning: number; critical: number }; // MB
	renderTime: { warning: number; critical: number }; // ms
}

interface PerformanceMonitorProps {
	nodeCount: number;
	relationshipCount: number;
	onPerformanceIssue?: (issue: {
		type: string;
		severity: "warning" | "critical";
		message: string;
	}) => void;
	onQualityAdjustment?: (newQuality: "low" | "medium" | "high") => void;
	className?: string;
	autoOptimize?: boolean;
	showDetailed?: boolean;
}

// Default performance thresholds
const defaultThresholds: PerformanceThresholds = {
	fps: { warning: 30, critical: 15 },
	memory: { warning: 100, critical: 200 }, // MB
	renderTime: { warning: 50, critical: 100 }, // ms
};

// Performance optimization recommendations
const optimizationTips = {
	lowFps: [
		"Zmniejsz liczbę wyświetlanych węzłów",
		"Wyłącz animacje i efekty wizualne",
		"Użyj prostszego układu grafu",
		"Przełącz na tryb niskiej jakości",
	],
	highMemory: [
		"Ogranicz liczbę węzłów do 500",
		"Wyczyść cache przeglądarki",
		"Zamknij inne karty przeglądarki",
		"Użyj wirtualizacji dla dużych list",
	],
	slowRender: [
		"Wyłącz fizykę grafu",
		"Zmniejsz częstotliwość aktualizacji",
		"Użyj WebGL dla lepszej wydajności",
		"Ogranicz liczbę etykiet węzłów",
	],
};

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
	nodeCount,
	relationshipCount,
	onPerformanceIssue,
	onQualityAdjustment,
	className = "",
	autoOptimize = true,
	showDetailed = false,
}) => {
	const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
	const [currentMetrics, setCurrentMetrics] =
		useState<PerformanceMetrics | null>(null);
	const [isMonitoring, setIsMonitoring] = useState(true);
	const [showAdvanced, setShowAdvanced] = useState(showDetailed);
	const [performanceIssues, setPerformanceIssues] = useState<
		Array<{
			type: string;
			severity: "warning" | "critical";
			message: string;
			timestamp: number;
		}>
	>([]);

	const frameCountRef = useRef(0);
	const lastTimeRef = useRef(performance.now());
	const renderStartRef = useRef(0);
	const animationFrameRef = useRef<number>(0);

	// FPS and render time measurement
	const measurePerformance = useCallback(() => {
		if (!isMonitoring) return;

		frameCountRef.current++;
		const currentTime = performance.now();
		const renderTime = currentTime - renderStartRef.current;

		// Calculate FPS every second
		if (currentTime - lastTimeRef.current >= 1000) {
			const fps = frameCountRef.current;
			frameCountRef.current = 0;
			lastTimeRef.current = currentTime;

			// Get memory usage (if available)
			let memoryUsage = 0;
			let heapSize = 0;

			if ("memory" in performance) {
				const memory = (performance as any).memory;
				memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
				heapSize = memory.totalJSHeapSize / 1024 / 1024;
			}

			const newMetrics: PerformanceMetrics = {
				fps,
				memoryUsage,
				heapSize,
				renderTime,
				nodeCount,
				relationshipCount,
				timestamp: currentTime,
			};

			setCurrentMetrics(newMetrics);
			setMetrics((prev) => [...prev.slice(-59), newMetrics]); // Keep last 60 measurements

			// Check for performance issues
			checkPerformanceThresholds(newMetrics);
		}

		renderStartRef.current = performance.now();
		animationFrameRef.current = requestAnimationFrame(measurePerformance);
	}, [isMonitoring, nodeCount, relationshipCount]);

	// Check performance against thresholds
	const checkPerformanceThresholds = useCallback(
		(metrics: PerformanceMetrics) => {
			const issues: Array<{
				type: string;
				severity: "warning" | "critical";
				message: string;
				timestamp: number;
			}> = [];

			// FPS checks
			if (metrics.fps < defaultThresholds.fps.critical) {
				issues.push({
					type: "fps",
					severity: "critical",
					message: `Krytycznie niski FPS: ${metrics.fps}. Graf może działać bardzo wolno.`,
					timestamp: metrics.timestamp,
				});

				if (autoOptimize && onQualityAdjustment) {
					onQualityAdjustment("low");
				}
			} else if (metrics.fps < defaultThresholds.fps.warning) {
				issues.push({
					type: "fps",
					severity: "warning",
					message: `Niski FPS: ${metrics.fps}. Rozważ optymalizację.`,
					timestamp: metrics.timestamp,
				});
			}

			// Memory checks
			if (metrics.memoryUsage > defaultThresholds.memory.critical) {
				issues.push({
					type: "memory",
					severity: "critical",
					message: `Krytyczne zużycie pamięci: ${metrics.memoryUsage.toFixed(1)}MB. Aplikacja może się zawiesić.`,
					timestamp: metrics.timestamp,
				});
			} else if (metrics.memoryUsage > defaultThresholds.memory.warning) {
				issues.push({
					type: "memory",
					severity: "warning",
					message: `Wysokie zużycie pamięci: ${metrics.memoryUsage.toFixed(1)}MB.`,
					timestamp: metrics.timestamp,
				});
			}

			// Render time checks
			if (metrics.renderTime > defaultThresholds.renderTime.critical) {
				issues.push({
					type: "render",
					severity: "critical",
					message: `Bardzo wolne renderowanie: ${metrics.renderTime.toFixed(1)}ms.`,
					timestamp: metrics.timestamp,
				});
			} else if (metrics.renderTime > defaultThresholds.renderTime.warning) {
				issues.push({
					type: "render",
					severity: "warning",
					message: `Wolne renderowanie: ${metrics.renderTime.toFixed(1)}ms.`,
					timestamp: metrics.timestamp,
				});
			}

			if (issues.length > 0) {
				setPerformanceIssues((prev) => [...prev.slice(-9), ...issues]); // Keep last 10 issues
				issues.forEach((issue) => onPerformanceIssue?.(issue));
			}
		},
		[autoOptimize, onQualityAdjustment, onPerformanceIssue],
	);

	// Start/stop monitoring
	useEffect(() => {
		if (isMonitoring) {
			measurePerformance();
		} else if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [isMonitoring, measurePerformance]);

	// Polish text processing performance monitoring
	const measurePolishTextPerformance = useCallback(
		(textCount: number) => {
			const startTime = performance.now();

			// Simulate Polish text processing
			const polishTexts = Array.from(
				{ length: textCount },
				(_, i) => `Węzeł testowy z polskimi znakami: ąćęłńóśźż ${i}`,
			);

			polishTexts.forEach((text) => {
				text.normalize("NFD").toLowerCase();
			});

			const endTime = performance.now();
			const processingTime = endTime - startTime;

			if (processingTime > 10) {
				// 10ms threshold for text processing
				onPerformanceIssue?.({
					type: "text-processing",
					severity: "warning",
					message: `Wolne przetwarzanie polskiego tekstu: ${processingTime.toFixed(1)}ms dla ${textCount} tekstów`,
				});
			}

			return processingTime;
		},
		[onPerformanceIssue],
	);

	// Get performance status
	const getPerformanceStatus = () => {
		if (!currentMetrics) return { status: "unknown", color: "gray" };

		const criticalIssues = performanceIssues.filter(
			(i) =>
				i.severity === "critical" &&
				currentMetrics.timestamp - i.timestamp < 5000, // Last 5 seconds
		);

		const warningIssues = performanceIssues.filter(
			(i) =>
				i.severity === "warning" &&
				currentMetrics.timestamp - i.timestamp < 5000,
		);

		if (criticalIssues.length > 0) {
			return { status: "critical", color: "red" };
		}
		if (warningIssues.length > 0) {
			return { status: "warning", color: "yellow" };
		}
		return { status: "good", color: "green" };
	};

	const performanceStatus = getPerformanceStatus();

	// Clear performance issues
	const clearIssues = () => {
		setPerformanceIssues([]);
	};

	// Toggle monitoring
	const toggleMonitoring = () => {
		setIsMonitoring(!isMonitoring);
	};

	// Get optimization recommendations
	const getRecommendations = () => {
		const recentIssues = performanceIssues.filter(
			(i) => currentMetrics && currentMetrics.timestamp - i.timestamp < 10000, // Last 10 seconds
		);

		const recommendations = new Set<string>();

		recentIssues.forEach((issue) => {
			switch (issue.type) {
				case "fps":
					optimizationTips.lowFps.forEach((tip) => recommendations.add(tip));
					break;
				case "memory":
					optimizationTips.highMemory.forEach((tip) =>
						recommendations.add(tip),
					);
					break;
				case "render":
					optimizationTips.slowRender.forEach((tip) =>
						recommendations.add(tip),
					);
					break;
			}
		});

		return Array.from(recommendations);
	};

	if (!showAdvanced && performanceStatus.status === "good") {
		return (
			<div className={`flex items-center gap-2 ${className}`}>
				<Badge variant="outline" className="text-green-600">
					<Activity className="mr-1 h-3 w-3" />
					Wydajność: OK
				</Badge>
				{currentMetrics && (
					<Badge variant="outline">{currentMetrics.fps} FPS</Badge>
				)}
				<Button variant="ghost" size="sm" onClick={() => setShowAdvanced(true)}>
					<Eye className="h-4 w-4" />
				</Button>
			</div>
		);
	}

	return (
		<Card className={className}>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-lg">
						<Activity className="h-5 w-5" />
						Monitor wydajności
					</CardTitle>
					<div className="flex items-center gap-2">
						<Badge
							variant="outline"
							className={`text-${performanceStatus.color}-600`}
						>
							{performanceStatus.status === "good"
								? "Dobra"
								: performanceStatus.status === "warning"
									? "Ostrzeżenie"
									: "Krytyczna"}
						</Badge>
						<Button variant="outline" size="sm" onClick={toggleMonitoring}>
							{isMonitoring ? (
								<TrendingDown className="h-4 w-4" />
							) : (
								<TrendingUp className="h-4 w-4" />
							)}
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowAdvanced(false)}
						>
							<EyeOff className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Current Metrics */}
				{currentMetrics && (
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						<div className="text-center">
							<div
								className={`font-bold text-2xl text-${
									currentMetrics.fps >= defaultThresholds.fps.warning
										? "green"
										: currentMetrics.fps >= defaultThresholds.fps.critical
											? "yellow"
											: "red"
								}-600`}
							>
								{currentMetrics.fps}
							</div>
							<div className="flex items-center justify-center gap-1 text-gray-600 text-xs">
								<Zap className="h-3 w-3" />
								FPS
							</div>
						</div>

						<div className="text-center">
							<div
								className={`font-bold text-2xl text-${
									currentMetrics.memoryUsage <= defaultThresholds.memory.warning
										? "green"
										: currentMetrics.memoryUsage <=
												defaultThresholds.memory.critical
											? "yellow"
											: "red"
								}-600`}
							>
								{currentMetrics.memoryUsage.toFixed(0)}
							</div>
							<div className="flex items-center justify-center gap-1 text-gray-600 text-xs">
								<HardDrive className="h-3 w-3" />
								MB RAM
							</div>
						</div>

						<div className="text-center">
							<div
								className={`font-bold text-2xl text-${
									currentMetrics.renderTime <=
									defaultThresholds.renderTime.warning
										? "green"
										: currentMetrics.renderTime <=
												defaultThresholds.renderTime.critical
											? "yellow"
											: "red"
								}-600`}
							>
								{currentMetrics.renderTime.toFixed(0)}
							</div>
							<div className="flex items-center justify-center gap-1 text-gray-600 text-xs">
								<Cpu className="h-3 w-3" />
								ms render
							</div>
						</div>

						<div className="text-center">
							<div className="font-bold text-2xl text-blue-600">
								{currentMetrics.nodeCount}
							</div>
							<div className="flex items-center justify-center gap-1 text-gray-600 text-xs">
								<BarChart3 className="h-3 w-3" />
								węzłów
							</div>
						</div>
					</div>
				)}

				{/* Performance Issues */}
				{performanceIssues.length > 0 && (
					<>
						<Separator />
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<h4 className="font-medium text-sm">Problemy wydajności</h4>
								<Button variant="outline" size="sm" onClick={clearIssues}>
									<RefreshCw className="mr-1 h-3 w-3" />
									Wyczyść
								</Button>
							</div>

							{performanceIssues.slice(-3).map((issue, index) => (
								<Alert
									key={index}
									className={
										issue.severity === "critical"
											? "border-red-200 bg-red-50"
											: "border-yellow-200 bg-yellow-50"
									}
								>
									<AlertTriangle className="h-4 w-4" />
									<AlertDescription className="text-sm">
										{issue.message}
									</AlertDescription>
								</Alert>
							))}
						</div>
					</>
				)}

				{/* Optimization Recommendations */}
				{getRecommendations().length > 0 && (
					<>
						<Separator />
						<div className="space-y-2">
							<h4 className="flex items-center gap-2 font-medium text-sm">
								<Settings className="h-4 w-4" />
								Rekomendacje optymalizacji
							</h4>
							<ul className="space-y-1 text-gray-600 text-sm">
								{getRecommendations()
									.slice(0, 3)
									.map((tip, index) => (
										<li key={index} className="flex items-start gap-2">
											<span className="mt-1 text-blue-600">•</span>
											{tip}
										</li>
									))}
							</ul>
						</div>
					</>
				)}

				{/* Memory Usage Progress */}
				{currentMetrics && currentMetrics.memoryUsage > 0 && (
					<>
						<Separator />
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Zużycie pamięci</span>
								<span>
									{currentMetrics.memoryUsage.toFixed(1)} /{" "}
									{currentMetrics.heapSize.toFixed(1)} MB
								</span>
							</div>
							<Progress
								value={
									(currentMetrics.memoryUsage / currentMetrics.heapSize) * 100
								}
								className="h-2"
							/>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
};

export default PerformanceMonitor;
