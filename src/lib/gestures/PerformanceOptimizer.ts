/**
 * Performance Optimization System for Gesture Processing
 * Monitors and optimizes gesture recognition performance across different devices
 */

import {
	type GestureEvent,
	type PerformanceConfig,
	type PerformanceStats,
	Point2D,
} from "../types/gestures";

export class PerformanceOptimizer {
	private config: PerformanceConfig;
	private performanceHistory: PerformanceEntry[] = [];
	private frameTimeHistory: number[] = [];
	private memoryUsageHistory: number[] = [];
	private gestureQueue: GestureEvent[] = [];
	private processingTimeouts: Map<string, NodeJS.Timeout> = new Map();
	private lastFrameTime = 0;
	private frameCount = 0;
	private isMonitoring = false;

	constructor(config: PerformanceConfig) {
		this.config = config;
		this.initializePerformanceMonitoring();
	}

	/**
	 * Initialize performance monitoring
	 */
	private initializePerformanceMonitoring(): void {
		if (typeof window !== "undefined" && "performance" in window) {
			this.startFrameMonitoring();
			this.startMemoryMonitoring();
			this.startGestureQueueProcessing();
		}
	}

	/**
	 * Monitor frame rate and timing
	 */
	private startFrameMonitoring(): void {
		const monitorFrame = (currentTime: number) => {
			if (this.lastFrameTime > 0) {
				const frameTime = currentTime - this.lastFrameTime;
				this.frameTimeHistory.push(frameTime);

				// Keep only recent history
				if (this.frameTimeHistory.length > 60) {
					// Last 60 frames
					this.frameTimeHistory.shift();
				}

				// Adaptive quality adjustment
				this.adjustQualityBasedOnPerformance(frameTime);
			}

			this.lastFrameTime = currentTime;
			this.frameCount++;

			requestAnimationFrame(monitorFrame);
		};

		requestAnimationFrame(monitorFrame);
	}

	/**
	 * Monitor memory usage
	 */
	private startMemoryMonitoring(): void {
		const monitorMemory = () => {
			if ("memory" in performance) {
				const memory = (performance as any).memory;
				this.memoryUsageHistory.push(memory.usedJSHeapSize);

				// Keep only recent history
				if (this.memoryUsageHistory.length > 30) {
					// Last 30 measurements
					this.memoryUsageHistory.shift();
				}

				// Memory cleanup if needed
				if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
					this.performMemoryCleanup();
				}
			}

			setTimeout(monitorMemory, 5000); // Check every 5 seconds
		};

		monitorMemory();
	}

	/**
	 * Process gesture queue with throttling
	 */
	private startGestureQueueProcessing(): void {
		setInterval(() => {
			this.processGestureQueue();
		}, this.config.gestureProcessing.throttleMs);
	}

	/**
	 * Add gesture to processing queue
	 */
	queueGesture(gesture: GestureEvent): void {
		// Debounce similar gestures
		const existingIndex = this.gestureQueue.findIndex(
			(g) =>
				g.type === gesture.type &&
				Math.abs(g.timestamp - gesture.timestamp) <
					this.config.gestureProcessing.debounceMs,
		);

		if (existingIndex >= 0) {
			// Replace existing gesture with newer one
			this.gestureQueue[existingIndex] = gesture;
		} else {
			// Add new gesture if queue isn't full
			if (
				this.gestureQueue.length < this.config.gestureProcessing.maxQueueSize
			) {
				this.gestureQueue.push(gesture);
			}
		}
	}

	/**
	 * Process queued gestures
	 */
	private processGestureQueue(): void {
		if (this.gestureQueue.length === 0) return;

		const currentTime = Date.now();
		const averageFrameTime = this.getAverageFrameTime();

		// Adjust processing based on performance
		if (averageFrameTime > 16.67) {
			// Below 60fps
			this.processQueueConservatively();
		} else {
			this.processQueueAggressively();
		}

		// Clear processed gestures
		this.gestureQueue = [];
	}

	/**
	 * Conservative queue processing for low performance
	 */
	private processQueueConservatively(): void {
		// Process only high-priority gestures
		const highPriorityGestures = this.gestureQueue.filter((g) =>
			["pan", "pinch", "rotate"].includes(g.type),
		);

		highPriorityGestures.forEach((gesture) => {
			this.emitGesture(gesture);
		});
	}

	/**
	 * Aggressive queue processing for good performance
	 */
	private processQueueAggressively(): void {
		// Process all gestures
		this.gestureQueue.forEach((gesture) => {
			this.emitGesture(gesture);
		});
	}

	/**
	 * Emit gesture event
	 */
	private emitGesture(gesture: GestureEvent): void {
		const event = new CustomEvent("optimizedGesture", {
			detail: gesture,
		});
		window.dispatchEvent(event);
	}

	/**
	 * Adjust quality based on performance
	 */
	private adjustQualityBasedOnPerformance(frameTime: number): void {
		const averageFrameTime = this.getAverageFrameTime();

		if (averageFrameTime > 20) {
			// Below 50fps
			this.reduceQuality();
		} else if (averageFrameTime < 12) {
			// Above 80fps
			this.increaseQuality();
		}
	}

	/**
	 * Reduce rendering quality for better performance
	 */
	private reduceQuality(): void {
		// Emit quality reduction event
		const event = new CustomEvent("reduceQuality", {
			detail: {
				targetFrameTime: 20,
				suggestions: [
					"reduce-shadow-quality",
					"disable-post-processing",
					"lower-particle-count",
					"simplify-materials",
				],
			},
		});
		window.dispatchEvent(event);
	}

	/**
	 * Increase rendering quality when performance allows
	 */
	private increaseQuality(): void {
		// Emit quality increase event
		const event = new CustomEvent("increaseQuality", {
			detail: {
				currentPerformance: "good",
				suggestions: [
					"enable-shadows",
					"increase-texture-resolution",
					"enable-post-processing",
				],
			},
		});
		window.dispatchEvent(event);
	}

	/**
	 * Perform memory cleanup
	 */
	private performMemoryCleanup(): void {
		// Clear old performance history
		this.performanceHistory = [];
		this.frameTimeHistory = this.frameTimeHistory.slice(-30);
		this.memoryUsageHistory = this.memoryUsageHistory.slice(-10);

		// Force garbage collection if available
		if ("gc" in window) {
			(window as any).gc();
		}

		// Clear unused DOM elements
		this.clearUnusedElements();

		const event = new CustomEvent("memoryCleanup", {
			detail: { timestamp: Date.now() },
		});
		window.dispatchEvent(event);
	}

	/**
	 * Clear unused DOM elements
	 */
	private clearUnusedElements(): void {
		// Remove orphaned label elements
		const labels = document.querySelectorAll(".brain-region-label");
		labels.forEach((label) => {
			if (!document.body.contains(label)) {
				label.remove();
			}
		});

		// Clear unused canvas textures
		const canvases = document.querySelectorAll("canvas");
		canvases.forEach((canvas) => {
			const ctx = canvas.getContext("2d");
			if (ctx && !canvas.isConnected) {
				// Clear canvas
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
		});
	}

	/**
	 * Get average frame time
	 */
	private getAverageFrameTime(): number {
		if (this.frameTimeHistory.length === 0) return 16.67; // Default 60fps

		return (
			this.frameTimeHistory.reduce((sum, time) => sum + time, 0) /
			this.frameTimeHistory.length
		);
	}

	/**
	 * Get current performance statistics
	 */
	getPerformanceStats(): PerformanceStats {
		const averageFrameTime = this.getAverageFrameTime();
		const frameRate = 1000 / averageFrameTime;

		const recentFrameTimes = this.frameTimeHistory.slice(-10);
		const frameTimeVariance = this.calculateVariance(recentFrameTimes);

		const averageMemoryUsage =
			this.memoryUsageHistory.length > 0
				? this.memoryUsageHistory.reduce((sum, usage) => sum + usage, 0) /
					this.memoryUsageHistory.length
				: 0;

		// Calculate user experience score based on multiple factors
		const frameRateScore = Math.min(frameRate / 60, 1); // Normalize to 60fps
		const stabilityScore = Math.max(0, 1 - frameTimeVariance / 100); // Lower variance = higher stability
		const memoryScore = Math.max(
			0,
			1 - averageMemoryUsage / (100 * 1024 * 1024),
		); // Assume 100MB target

		const userExperienceScore =
			frameRateScore * 0.5 + stabilityScore * 0.3 + memoryScore * 0.2;

		return {
			averageFrameTime,
			gestureRecognitionAccuracy: this.calculateGestureAccuracy(),
			memoryUsage: averageMemoryUsage,
			batteryImpact: this.estimateBatteryImpact(),
			userExperienceScore,
		};
	}

	/**
	 * Calculate gesture recognition accuracy
	 */
	private calculateGestureAccuracy(): number {
		// This would track actual gesture recognition success rate
		// For now, return a simulated value based on performance
		const frameRate = 1000 / this.getAverageFrameTime();
		return Math.min(frameRate / 60, 1) * 0.95; // Base accuracy with performance factor
	}

	/**
	 * Estimate battery impact
	 */
	private estimateBatteryImpact(): number {
		const frameRate = 1000 / this.getAverageFrameTime();
		const memoryUsage =
			this.memoryUsageHistory[this.memoryUsageHistory.length - 1] || 0;

		// Simple estimation based on frame rate and memory usage
		const frameRateImpact = (frameRate / 60) * 0.5; // 50% weight
		const memoryImpact = (memoryUsage / (50 * 1024 * 1024)) * 0.3; // 30% weight for 50MB baseline

		return Math.min(frameRateImpact + memoryImpact, 1);
	}

	/**
	 * Calculate variance for stability measurement
	 */
	private calculateVariance(values: number[]): number {
		if (values.length === 0) return 0;

		const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
		const squaredDiffs = values.map((val) => (val - mean) ** 2);
		return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
	}

	/**
	 * Optimize gesture processing for current device
	 */
	optimizeForDevice(deviceType: string): void {
		switch (deviceType) {
			case "mobile-low-end":
				this.optimizeForLowEndMobile();
				break;
			case "mobile-high-end":
				this.optimizeForHighEndMobile();
				break;
			case "desktop-low-end":
				this.optimizeForLowEndDesktop();
				break;
			case "desktop-high-end":
				this.optimizeForHighEndDesktop();
				break;
		}
	}

	/**
	 * Optimize for low-end mobile devices
	 */
	private optimizeForLowEndMobile(): void {
		this.config.gestureProcessing.throttleMs = 50; // Increase throttling
		this.config.gestureProcessing.debounceMs = 100;
		this.config.gestureProcessing.maxQueueSize = 5;

		this.config.rendering.frameRate = 30;
		this.config.rendering.quality = "low";
		this.config.rendering.adaptiveQuality = true;

		this.config.memory.maxGestureHistory = 10;
		this.config.memory.cleanupInterval = 10000;
	}

	/**
	 * Optimize for high-end mobile devices
	 */
	private optimizeForHighEndMobile(): void {
		this.config.gestureProcessing.throttleMs = 16; // 60fps processing
		this.config.gestureProcessing.debounceMs = 50;
		this.config.gestureProcessing.maxQueueSize = 15;

		this.config.rendering.frameRate = 60;
		this.config.rendering.quality = "high";
		this.config.rendering.adaptiveQuality = true;

		this.config.memory.maxGestureHistory = 30;
		this.config.memory.cleanupInterval = 5000;
	}

	/**
	 * Optimize for low-end desktop devices
	 */
	private optimizeForLowEndDesktop(): void {
		this.config.gestureProcessing.throttleMs = 32;
		this.config.gestureProcessing.debounceMs = 75;
		this.config.gestureProcessing.maxQueueSize = 10;

		this.config.rendering.frameRate = 30;
		this.config.rendering.quality = "medium";
		this.config.rendering.adaptiveQuality = false;

		this.config.memory.maxGestureHistory = 20;
		this.config.memory.cleanupInterval = 8000;
	}

	/**
	 * Optimize for high-end desktop devices
	 */
	private optimizeForHighEndDesktop(): void {
		this.config.gestureProcessing.throttleMs = 8; // High-frequency processing
		this.config.gestureProcessing.debounceMs = 25;
		this.config.gestureProcessing.maxQueueSize = 25;

		this.config.rendering.frameRate = 60;
		this.config.rendering.quality = "ultra";
		this.config.rendering.adaptiveQuality = false;

		this.config.memory.maxGestureHistory = 50;
		this.config.memory.cleanupInterval = 3000;
	}

	/**
	 * Adaptive gesture threshold adjustment
	 */
	adjustGestureThresholds(performanceLevel: "low" | "medium" | "high"): void {
		switch (performanceLevel) {
			case "low":
				this.config.gestureProcessing.throttleMs = Math.max(
					this.config.gestureProcessing.throttleMs,
					50,
				);
				this.config.gestureProcessing.debounceMs = Math.max(
					this.config.gestureProcessing.debounceMs,
					100,
				);
				break;
			case "medium":
				this.config.gestureProcessing.throttleMs = 32;
				this.config.gestureProcessing.debounceMs = 75;
				break;
			case "high":
				this.config.gestureProcessing.throttleMs = Math.min(
					this.config.gestureProcessing.throttleMs,
					16,
				);
				this.config.gestureProcessing.debounceMs = Math.min(
					this.config.gestureProcessing.debounceMs,
					50,
				);
				break;
		}
	}

	/**
	 * Pre-allocate resources for better performance
	 */
	preallocateResources(): void {
		// Pre-allocate arrays and objects
		this.gestureQueue = new Array(this.config.gestureProcessing.maxQueueSize);
		this.frameTimeHistory = new Array(60);
		this.memoryUsageHistory = new Array(30);

		// Pre-create DOM elements for labels
		this.precreateLabelElements();

		// Warm up WebGL context if available
		this.warmUpWebGLContext();
	}

	/**
	 * Pre-create label elements for better performance
	 */
	private precreateLabelElements(): void {
		const labelPool = document.createElement("div");
		labelPool.id = "gesture-label-pool";
		labelPool.style.display = "none";

		// Create a pool of label elements
		for (let i = 0; i < 10; i++) {
			const label = document.createElement("div");
			label.className = "brain-region-label pooled";
			label.style.position = "fixed";
			label.style.pointerEvents = "none";
			labelPool.appendChild(label);
		}

		document.body.appendChild(labelPool);
	}

	/**
	 * Warm up WebGL context
	 */
	private warmUpWebGLContext(): void {
		const canvas = document.createElement("canvas");
		canvas.width = 256;
		canvas.height = 256;
		const gl =
			canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		if (gl) {
			// Simple warmup operations
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.finish();
		}

		canvas.remove();
	}

	/**
	 * Monitor specific performance metrics
	 */
	monitorCustomMetric(name: string, value: number): void {
		const entry: PerformanceEntry = {
			name,
			entryType: "measure",
			startTime: performance.now(),
			duration: value,
		};

		this.performanceHistory.push(entry);

		// Keep only recent entries
		if (this.performanceHistory.length > 100) {
			this.performanceHistory.shift();
		}
	}

	/**
	 * Get performance recommendations
	 */
	getPerformanceRecommendations(): string[] {
		const stats = this.getPerformanceStats();
		const recommendations: string[] = [];

		if (stats.averageFrameTime > 20) {
			recommendations.push(
				"Rozważ zmniejszenie jakości grafiki dla lepszej płynności",
			);
		}

		if (stats.memoryUsage > 50 * 1024 * 1024) {
			// 50MB
			recommendations.push(
				"Wykonaj czyszczenie pamięci dla optymalnej wydajności",
			);
		}

		if (stats.gestureRecognitionAccuracy < 0.8) {
			recommendations.push("Dostosuj czułość gestów w ustawieniach");
		}

		if (stats.batteryImpact > 0.7) {
			recommendations.push(
				"Zmniejsz częstotliwość przetwarzania gestów, aby oszczędzać baterię",
			);
		}

		return recommendations;
	}

	/**
	 * Enable performance monitoring
	 */
	startMonitoring(): void {
		this.isMonitoring = true;
		this.lastFrameTime = performance.now();
	}

	/**
	 * Disable performance monitoring
	 */
	stopMonitoring(): void {
		this.isMonitoring = false;
		this.clearProcessingTimeouts();
	}

	/**
	 * Clear processing timeouts
	 */
	private clearProcessingTimeouts(): void {
		for (const timeout of this.processingTimeouts.values()) {
			clearTimeout(timeout);
		}
		this.processingTimeouts.clear();
	}

	/**
	 * Update configuration
	 */
	updateConfig(config: Partial<PerformanceConfig>): void {
		this.config = { ...this.config, ...config };
	}

	/**
	 * Get current configuration
	 */
	getConfig(): PerformanceConfig {
		return { ...this.config };
	}

	/**
	 * Reset performance history
	 */
	resetHistory(): void {
		this.performanceHistory = [];
		this.frameTimeHistory = [];
		this.memoryUsageHistory = [];
		this.gestureQueue = [];
		this.frameCount = 0;
		this.lastFrameTime = 0;
	}

	/**
	 * Export performance data for analysis
	 */
	exportPerformanceData(): any {
		return {
			frameTimeHistory: [...this.frameTimeHistory],
			memoryUsageHistory: [...this.memoryUsageHistory],
			performanceHistory: [...this.performanceHistory],
			currentStats: this.getPerformanceStats(),
			config: this.config,
			timestamp: Date.now(),
		};
	}

	/**
	 * Dispose of resources
	 */
	dispose(): void {
		this.stopMonitoring();
		this.clearProcessingTimeouts();

		// Remove pre-allocated elements
		const labelPool = document.getElementById("gesture-label-pool");
		if (labelPool) {
			labelPool.remove();
		}
	}
}

// Supporting interface for performance entries
interface PerformanceEntry {
	name: string;
	entryType: string;
	startTime: number;
	duration: number;
}
