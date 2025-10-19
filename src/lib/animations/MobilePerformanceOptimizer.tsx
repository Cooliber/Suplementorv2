"use client";

/**
 * Mobile Performance Optimizer for Suplementor Animations
 * Battery-conscious animation rendering with adaptive frame rates
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
	AnimationPerformanceMonitor,
	DeviceCapabilities,
	type PhysiologicalAnimationController,
} from "./physiological-animations";

interface PerformanceMetrics {
	frameRate: number;
	memoryUsage: number;
	batteryLevel: number;
	thermalState: "nominal" | "fair" | "serious" | "critical";
	cpuUsage: number;
	gpuUsage: number;
	networkLatency: number;
	touchResponsiveness: number;
}

interface PerformanceConfig {
	targetFrameRate: number;
	maxFrameRate: number;
	minFrameRate: number;
	adaptiveQuality: boolean;
	batterySavingMode: boolean;
	thermalThrottling: boolean;
	memoryLimit: number; // MB
	enableProfiling: boolean;
}

interface BatteryManager extends EventTarget {
	charging: boolean;
	chargingTime: number;
	dischargingTime: number;
	level: number;
}

interface PerformanceOptimizerHookReturn {
	metrics: PerformanceMetrics;
	config: PerformanceConfig;
	qualityLevel: "low" | "medium" | "high" | "ultra";
	recommendations: string[];
	updateConfig: (updates: Partial<PerformanceConfig>) => void;
	forceOptimization: () => void;
	resetToDefaults: () => void;
}

const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
	targetFrameRate: 60,
	maxFrameRate: 60,
	minFrameRate: 15,
	adaptiveQuality: true,
	batterySavingMode: false,
	thermalThrottling: true,
	memoryLimit: 100, // MB
	enableProfiling: false,
};

const PERFORMANCE_THRESHOLDS = {
	frameRate: {
		excellent: 55,
		good: 45,
		poor: 30,
	},
	memoryUsage: {
		safe: 0.6, // 60%
		warning: 0.8, // 80%
		critical: 0.9, // 90%
	},
	batteryLevel: {
		high: 0.8, // 80%
		medium: 0.4, // 40%
		low: 0.2, // 20%
		critical: 0.1, // 10%
	},
	thermalState: {
		nominal: 40, // °C
		fair: 45,
		serious: 50,
		critical: 55,
	},
};

export const useMobilePerformanceOptimizer = (
	animationController?: PhysiologicalAnimationController,
): PerformanceOptimizerHookReturn => {
	const performanceMonitorRef = useRef<AnimationPerformanceMonitor | null>(
		null,
	);
	const frameCountRef = useRef(0);
	const lastFrameTimeRef = useRef(performance.now());
	const batteryManagerRef = useRef<BatteryManager | null>(null);

	const [metrics, setMetrics] = useState<PerformanceMetrics>({
		frameRate: 60,
		memoryUsage: 0,
		batteryLevel: 1,
		thermalState: "nominal",
		cpuUsage: 0,
		gpuUsage: 0,
		networkLatency: 0,
		touchResponsiveness: 0,
	});

	const [config, setConfig] = useState<PerformanceConfig>(
		DEFAULT_PERFORMANCE_CONFIG,
	);
	const [qualityLevel, setQualityLevel] = useState<
		"low" | "medium" | "high" | "ultra"
	>("high");
	const [recommendations, setRecommendations] = useState<string[]>([]);

	// Initialize performance monitoring
	useEffect(() => {
		if (!performanceMonitorRef.current) {
			performanceMonitorRef.current = new AnimationPerformanceMonitor();
		}

		// Initialize battery monitoring
		if ("getBattery" in navigator) {
			(navigator as any).getBattery().then((battery: BatteryManager) => {
				batteryManagerRef.current = battery;

				const updateBatteryLevel = () => {
					setMetrics((prev) => ({
						...prev,
						batteryLevel: battery.level,
						charging: battery.charging,
					}));
				};

				updateBatteryLevel();
				battery.addEventListener("levelchange", updateBatteryLevel);
				battery.addEventListener("chargingchange", updateBatteryLevel);

				return () => {
					battery.removeEventListener("levelchange", updateBatteryLevel);
					battery.removeEventListener("chargingchange", updateBatteryLevel);
				};
			});
		}

		return () => {
			performanceMonitorRef.current?.dispose?.();
		};
	}, []);

	// Frame rate monitoring
	const monitorFrameRate = useCallback(() => {
		const now = performance.now();
		frameCountRef.current++;

		if (now - lastFrameTimeRef.current >= 1000) {
			const actualFrameRate =
				(frameCountRef.current * 1000) / (now - lastFrameTimeRef.current);

			setMetrics((prev) => ({
				...prev,
				frameRate: Math.round(actualFrameRate),
			}));

			frameCountRef.current = 0;
			lastFrameTimeRef.current = now;
		}

		if (config.enableProfiling) {
			requestAnimationFrame(monitorFrameRate);
		}
	}, [config.enableProfiling]);

	// Memory usage monitoring
	const monitorMemoryUsage = useCallback(() => {
		if ("memory" in performance) {
			const memoryInfo = (performance as any).memory;
			const usage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;

			setMetrics((prev) => ({
				...prev,
				memoryUsage: usage,
			}));
		}
	}, []);

	// Thermal state monitoring (approximation)
	const monitorThermalState = useCallback(() => {
		// This is a simplified thermal monitoring
		// In a real implementation, you might use device APIs or performance metrics
		const thermalScore = metrics.cpuUsage * 0.4 + metrics.gpuUsage * 0.6;

		let thermalState: PerformanceMetrics["thermalState"] = "nominal";
		if (thermalScore > 0.8) thermalState = "critical";
		else if (thermalScore > 0.6) thermalState = "serious";
		else if (thermalScore > 0.4) thermalState = "fair";

		setMetrics((prev) => ({
			...prev,
			thermalState,
		}));
	}, [metrics.cpuUsage, metrics.gpuUsage]);

	// Performance monitoring loop
	useEffect(() => {
		if (!config.enableProfiling) return;

		const interval = setInterval(() => {
			performanceMonitorRef.current?.update();
			monitorMemoryUsage();
			monitorThermalState();

			// Update frame rate monitoring
			if (config.enableProfiling) {
				requestAnimationFrame(monitorFrameRate);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [
		config.enableProfiling,
		monitorFrameRate,
		monitorMemoryUsage,
		monitorThermalState,
	]);

	// Calculate quality level based on metrics
	const calculateQualityLevel = useCallback(():
		| "low"
		| "medium"
		| "high"
		| "ultra" => {
		const { frameRate, memoryUsage, batteryLevel, thermalState } = metrics;

		// Critical conditions - force low quality
		if (
			memoryUsage > PERFORMANCE_THRESHOLDS.memoryUsage.critical ||
			thermalState === "critical" ||
			batteryLevel < PERFORMANCE_THRESHOLDS.batteryLevel.critical
		) {
			return "low";
		}

		// Poor conditions - medium quality
		if (
			memoryUsage > PERFORMANCE_THRESHOLDS.memoryUsage.warning ||
			thermalState === "serious" ||
			batteryLevel < PERFORMANCE_THRESHOLDS.batteryLevel.low ||
			frameRate < PERFORMANCE_THRESHOLDS.frameRate.poor
		) {
			return "medium";
		}

		// Good conditions - high quality
		if (
			frameRate > PERFORMANCE_THRESHOLDS.frameRate.good &&
			memoryUsage < PERFORMANCE_THRESHOLDS.memoryUsage.safe &&
			batteryLevel > PERFORMANCE_THRESHOLDS.batteryLevel.medium
		) {
			return "high";
		}

		// Excellent conditions - ultra quality
		if (
			frameRate > PERFORMANCE_THRESHOLDS.frameRate.excellent &&
			memoryUsage < PERFORMANCE_THRESHOLDS.memoryUsage.safe &&
			batteryLevel > PERFORMANCE_THRESHOLDS.batteryLevel.high
		) {
			return "ultra";
		}

		return "medium";
	}, [metrics]);

	// Generate performance recommendations
	const generateRecommendations = useCallback(() => {
		const recs: string[] = [];
		const { frameRate, memoryUsage, batteryLevel, thermalState } = metrics;

		if (frameRate < PERFORMANCE_THRESHOLDS.frameRate.poor) {
			recs.push("Rozważ zmniejszenie liczby aktywnych animacji");
			recs.push("Wyłącz zaawansowane efekty wizualne");
		}

		if (memoryUsage > PERFORMANCE_THRESHOLDS.memoryUsage.warning) {
			recs.push("Zamknij inne aplikacje, aby zwolnić pamięć");
			recs.push("Włącz tryb oszczędzania baterii");
		}

		if (batteryLevel < PERFORMANCE_THRESHOLDS.batteryLevel.medium) {
			recs.push("Podłącz ładowarkę dla optymalnej wydajności");
			recs.push("Aktywuj tryb oszczędzania baterii");
		}

		if (thermalState !== "nominal") {
			recs.push("Urządzenie się nagrzewa - rozważ przerwę");
			recs.push("Zmniejsz jasność ekranu");
		}

		setRecommendations(recs);
	}, [metrics]);

	// Update quality level and recommendations
	useEffect(() => {
		const newQualityLevel = calculateQualityLevel();
		setQualityLevel(newQualityLevel);
		generateRecommendations();
	}, [metrics, calculateQualityLevel, generateRecommendations]);

	// Adaptive frame rate calculation
	const getAdaptiveFrameRate = useCallback((): number => {
		if (!config.adaptiveQuality) {
			return config.targetFrameRate;
		}

		const { frameRate, memoryUsage, batteryLevel, thermalState } = metrics;

		let targetFPS = config.targetFrameRate;

		// Reduce frame rate based on performance issues
		if (frameRate < PERFORMANCE_THRESHOLDS.frameRate.poor) {
			targetFPS = Math.max(config.minFrameRate, targetFPS * 0.7);
		}

		if (memoryUsage > PERFORMANCE_THRESHOLDS.memoryUsage.warning) {
			targetFPS = Math.max(config.minFrameRate, targetFPS * 0.8);
		}

		if (
			batteryLevel < PERFORMANCE_THRESHOLDS.batteryLevel.medium &&
			!batteryManagerRef.current?.charging
		) {
			targetFPS = Math.max(config.minFrameRate, targetFPS * 0.6);
		}

		if (thermalState === "serious" || thermalState === "critical") {
			targetFPS = Math.max(config.minFrameRate, targetFPS * 0.5);
		}

		return Math.max(
			config.minFrameRate,
			Math.min(config.maxFrameRate, targetFPS),
		);
	}, [config, metrics]);

	// Apply performance optimizations to animation controller
	useEffect(() => {
		if (!animationController) return;

		const adaptiveFPS = getAdaptiveFrameRate();

		// Adjust animation playback speed based on performance
		if (adaptiveFPS < 30) {
			animationController.setPlaybackSpeed("breathing-cycle", 0.5);
			animationController.setPlaybackSpeed("heartbeat-cycle", 0.5);
		} else if (adaptiveFPS < 45) {
			animationController.setPlaybackSpeed("breathing-cycle", 0.7);
			animationController.setPlaybackSpeed("heartbeat-cycle", 0.7);
		} else {
			animationController.setPlaybackSpeed("breathing-cycle", 1.0);
			animationController.setPlaybackSpeed("heartbeat-cycle", 1.0);
		}
	}, [animationController, getAdaptiveFrameRate]);

	// Update configuration
	const updateConfig = useCallback((updates: Partial<PerformanceConfig>) => {
		setConfig((prev) => ({ ...prev, ...updates }));
	}, []);

	// Force optimization - emergency performance mode
	const forceOptimization = useCallback(() => {
		setConfig((prev) => ({
			...prev,
			targetFrameRate: 30,
			adaptiveQuality: true,
			batterySavingMode: true,
			thermalThrottling: true,
		}));

		// Pause non-essential animations
		if (animationController) {
			animationController.pauseAnimation("blood-flow-circulation");
			animationController.pauseAnimation("hormone-release");
		}
	}, [animationController]);

	// Reset to defaults
	const resetToDefaults = useCallback(() => {
		setConfig(DEFAULT_PERFORMANCE_CONFIG);

		// Resume all animations
		if (animationController) {
			animationController.resumeAnimation("blood-flow-circulation");
			animationController.resumeAnimation("hormone-release");
		}
	}, [animationController]);

	return {
		metrics,
		config,
		qualityLevel,
		recommendations,
		updateConfig,
		forceOptimization,
		resetToDefaults,
	};
};

// Performance monitoring component
interface PerformanceMonitorProps {
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	compact?: boolean;
	showRecommendations?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
	position = "top-right",
	compact = false,
	showRecommendations = false,
}) => {
	const { metrics, qualityLevel, recommendations } =
		useMobilePerformanceOptimizer();

	const positionClasses = {
		"top-left": "top-2 left-2",
		"top-right": "top-2 right-2",
		"bottom-left": "bottom-2 left-2",
		"bottom-right": "bottom-2 right-2",
	};

	if (compact) {
		return (
			<div className={`fixed ${positionClasses[position]} z-50`}>
				<div className="rounded bg-black/80 px-2 py-1 text-white text-xs">
					<div className="flex items-center gap-2">
						<span>FPS: {metrics.frameRate}</span>
						<span>MEM: {(metrics.memoryUsage * 100).toFixed(0)}%</span>
						<span>BAT: {(metrics.batteryLevel * 100).toFixed(0)}%</span>
						<div
							className={`h-2 w-2 rounded-full ${
								qualityLevel === "low"
									? "bg-red-500"
									: qualityLevel === "medium"
										? "bg-yellow-500"
										: qualityLevel === "high"
											? "bg-green-500"
											: "bg-blue-500"
							}`}
						/>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`fixed ${positionClasses[position]} z-50 space-y-2`}>
			{/* Performance Metrics */}
			<div className="min-w-[200px] rounded-lg bg-black/80 p-3 text-white text-xs">
				<h4 className="mb-2 font-medium">Wydajność</h4>
				<div className="space-y-1">
					<div className="flex justify-between">
						<span>Klatki/sek:</span>
						<span
							className={
								metrics.frameRate < 30
									? "text-red-400"
									: metrics.frameRate < 45
										? "text-yellow-400"
										: "text-green-400"
							}
						>
							{metrics.frameRate}
						</span>
					</div>
					<div className="flex justify-between">
						<span>Pamięć:</span>
						<span
							className={
								metrics.memoryUsage > 0.8
									? "text-red-400"
									: metrics.memoryUsage > 0.6
										? "text-yellow-400"
										: "text-green-400"
							}
						>
							{(metrics.memoryUsage * 100).toFixed(0)}%
						</span>
					</div>
					<div className="flex justify-between">
						<span>Bateria:</span>
						<span
							className={
								metrics.batteryLevel < 0.2
									? "text-red-400"
									: metrics.batteryLevel < 0.4
										? "text-yellow-400"
										: "text-green-400"
							}
						>
							{(metrics.batteryLevel * 100).toFixed(0)}%
						</span>
					</div>
					<div className="flex justify-between">
						<span>Stan:</span>
						<span
							className={
								metrics.thermalState === "critical"
									? "text-red-400"
									: metrics.thermalState === "serious"
										? "text-yellow-400"
										: metrics.thermalState === "fair"
											? "text-orange-400"
											: "text-green-400"
							}
						>
							{metrics.thermalState}
						</span>
					</div>
				</div>

				{/* Quality Indicator */}
				<div className="mt-2 border-white/20 border-t pt-2">
					<div className="flex items-center justify-between">
						<span>Jakość:</span>
						<div
							className={`rounded px-2 py-1 text-xs ${
								qualityLevel === "low"
									? "bg-red-500/50 text-white"
									: qualityLevel === "medium"
										? "bg-yellow-500/50 text-white"
										: qualityLevel === "high"
											? "bg-green-500/50 text-white"
											: "bg-blue-500/50 text-white"
							}`}
						>
							{qualityLevel.toUpperCase()}
						</div>
					</div>
				</div>
			</div>

			{/* Recommendations */}
			{showRecommendations && recommendations.length > 0 && (
				<div className="max-w-[250px] rounded-lg bg-blue-900/80 p-3 text-white text-xs">
					<h4 className="mb-2 font-medium">Zalecenia</h4>
					<ul className="space-y-1">
						{recommendations.slice(0, 3).map((rec, index) => (
							<li key={index} className="text-blue-100">
								• {rec}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};
