import { AnalyticsUtils, useAnalytics } from "./analytics";

// Core Web Vitals tracking
export interface WebVitalsMetrics {
	CLS?: number; // Cumulative Layout Shift
	FID?: number; // First Input Delay
	FCP?: number; // First Contentful Paint
	LCP?: number; // Largest Contentful Paint
	TTFB?: number; // Time to First Byte
	INP?: number; // Interaction to Next Paint
}

// 3D Performance Metrics
export interface ThreeDPerformanceMetrics {
	renderTime: number;
	frameRate: number;
	memoryUsage: number;
	triangleCount: number;
	drawCalls: number;
	shaderSwitches: number;
}

// Database Performance Metrics
export interface DatabasePerformanceMetrics {
	queryTime: number;
	connectionTime: number;
	rowsAffected: number;
	queryType: "SELECT" | "INSERT" | "UPDATE" | "DELETE";
	tableName?: string;
}

// API Performance Metrics
export interface APIPerformanceMetrics {
	endpoint: string;
	method: string;
	statusCode: number;
	responseTime: number;
	requestSize: number;
	responseSize: number;
}

export class PerformanceMonitor {
	private observers: PerformanceObserver[] = [];
	private metricsBuffer: Map<string, any[]> = new Map();
	private maxBufferSize = 100;

	constructor() {
		this.initializeWebVitalsTracking();
		this.initializeResourceTiming();
		this.initializeLongTaskTracking();
	}

	private initializeWebVitalsTracking(): void {
		// Track Core Web Vitals using Performance Observer API
		if (typeof window !== "undefined" && "PerformanceObserver" in window) {
			try {
				// Largest Contentful Paint (LCP)
				const lcpObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					const lastEntry = entries[entries.length - 1];
					this.trackWebVital("LCP", lastEntry.startTime);
				});
				lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
				this.observers.push(lcpObserver);

				// First Input Delay (FID)
				const fidObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry) => {
						this.trackWebVital(
							"FID",
							(entry as any).processingStart - entry.startTime,
						);
					});
				});
				fidObserver.observe({ entryTypes: ["first-input"] });
				this.observers.push(fidObserver);

				// Cumulative Layout Shift (CLS)
				let clsValue = 0;
				const clsObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry: any) => {
						if (!entry.hadRecentInput) {
							clsValue += entry.value;
							this.trackWebVital("CLS", clsValue);
						}
					});
				});
				clsObserver.observe({ entryTypes: ["layout-shift"] });
				this.observers.push(clsObserver);

				// Interaction to Next Paint (INP)
				const inpObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry: any) => {
						this.trackWebVital("INP", entry.duration);
					});
				});
				inpObserver.observe({ entryTypes: ["measure"] });
				this.observers.push(inpObserver);
			} catch (error) {
				console.warn("Failed to initialize Web Vitals tracking:", error);
			}
		}
	}

	private initializeResourceTiming(): void {
		if (typeof window !== "undefined" && "PerformanceObserver" in window) {
			try {
				const resourceObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry) => {
						if (entry.duration > 1000) {
							// Only track slow resources
							this.trackResourceTiming(entry);
						}
					});
				});
				resourceObserver.observe({ entryTypes: ["resource"] });
				this.observers.push(resourceObserver);
			} catch (error) {
				console.warn("Failed to initialize resource timing:", error);
			}
		}
	}

	private initializeLongTaskTracking(): void {
		if (typeof window !== "undefined" && "PerformanceObserver" in window) {
			try {
				const longTaskObserver = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry) => {
						this.trackLongTask(entry);
					});
				});
				longTaskObserver.observe({ entryTypes: ["longtask"] });
				this.observers.push(longTaskObserver);
			} catch (error) {
				console.warn("Failed to initialize long task tracking:", error);
			}
		}
	}

	private trackWebVital(metric: keyof WebVitalsMetrics, value: number): void {
		const metrics = { [metric]: value };
		AnalyticsUtils.trackPerformance({
			name: `web_vitals_${metric.toLowerCase()}`,
			value,
			unit: metric === "CLS" ? "count" : "ms",
			tags: {
				metric_type: "web_vitals",
				page_url: window.location.pathname,
			},
		});

		// Store in buffer for batch processing
		this.addToBuffer("web_vitals", { metric, value, timestamp: Date.now() });
	}

	private trackResourceTiming(entry: PerformanceResourceTiming): void {
		AnalyticsUtils.trackPerformance({
			name: "resource_timing",
			value: entry.duration,
			unit: "ms",
			tags: {
				resource_name: entry.name,
				resource_type: this.getResourceType(entry),
				page_url: window.location.pathname,
			},
		});
	}

	private trackLongTask(entry: PerformanceEntry): void {
		AnalyticsUtils.trackPerformance({
			name: "long_task",
			value: entry.duration,
			unit: "ms",
			tags: {
				task_name: entry.name,
				page_url: window.location.pathname,
			},
		});
	}

	private getResourceType(entry: PerformanceResourceTiming): string {
		if (entry.name.includes(".js")) return "script";
		if (entry.name.includes(".css")) return "stylesheet";
		if (
			entry.name.includes(".jpg") ||
			entry.name.includes(".png") ||
			entry.name.includes(".webp")
		)
			return "image";
		if (entry.name.includes(".glb") || entry.name.includes(".gltf"))
			return "3d_model";
		if (entry.name.includes("api/")) return "api_call";
		return "other";
	}

	private addToBuffer(type: string, data: any): void {
		if (!this.metricsBuffer.has(type)) {
			this.metricsBuffer.set(type, []);
		}

		const buffer = this.metricsBuffer.get(type)!;
		buffer.push(data);

		if (buffer.length > this.maxBufferSize) {
			buffer.shift(); // Remove oldest entry
		}
	}

	// 3D Performance Monitoring
	public trackThreeDPerformance(metrics: ThreeDPerformanceMetrics): void {
		AnalyticsUtils.trackPerformance({
			name: "3d_render_time",
			value: metrics.renderTime,
			unit: "ms",
			tags: {
				frame_rate: metrics.frameRate.toString(),
				memory_usage: metrics.memoryUsage.toString(),
				triangle_count: metrics.triangleCount.toString(),
				draw_calls: metrics.drawCalls.toString(),
			},
		});

		// Track frame rate separately if it's concerning
		if (metrics.frameRate < 30) {
			AnalyticsUtils.trackPerformance({
				name: "low_frame_rate",
				value: metrics.frameRate,
				unit: "count",
				tags: {
					severity: metrics.frameRate < 15 ? "critical" : "warning",
				},
			});
		}
	}

	// Database Performance Monitoring
	public trackDatabasePerformance(metrics: DatabasePerformanceMetrics): void {
		AnalyticsUtils.trackPerformance({
			name: "database_query",
			value: metrics.queryTime,
			unit: "ms",
			tags: {
				query_type: metrics.queryType,
				table_name: metrics.tableName || "unknown",
				rows_affected: metrics.rowsAffected.toString(),
			},
		});

		// Alert on slow queries
		if (metrics.queryTime > 1000) {
			AnalyticsUtils.trackPerformance({
				name: "slow_database_query",
				value: metrics.queryTime,
				unit: "ms",
				tags: {
					query_type: metrics.queryType,
					table_name: metrics.tableName || "unknown",
					severity: metrics.queryTime > 5000 ? "critical" : "warning",
				},
			});
		}
	}

	// API Performance Monitoring
	public trackAPIPerformance(metrics: APIPerformanceMetrics): void {
		AnalyticsUtils.trackPerformance({
			name: "api_endpoint",
			value: metrics.responseTime,
			unit: "ms",
			tags: {
				endpoint: metrics.endpoint,
				method: metrics.method,
				status_code: metrics.statusCode.toString(),
				request_size: metrics.requestSize.toString(),
				response_size: metrics.responseSize.toString(),
			},
		});

		// Track slow API calls
		if (metrics.responseTime > 2000) {
			AnalyticsUtils.trackPerformance({
				name: "slow_api_call",
				value: metrics.responseTime,
				unit: "ms",
				tags: {
					endpoint: metrics.endpoint,
					status_code: metrics.statusCode.toString(),
					severity: metrics.responseTime > 10000 ? "critical" : "warning",
				},
			});
		}
	}

	// Custom performance measurement
	public startMeasurement(name: string): () => void {
		const startTime = performance.now();

		return () => {
			const endTime = performance.now();
			const duration = endTime - startTime;

			AnalyticsUtils.trackPerformance({
				name,
				value: duration,
				unit: "ms",
				tags: {
					measurement_type: "custom",
				},
			});

			return duration;
		};
	}

	// Memory usage tracking
	public trackMemoryUsage(): void {
		if ("memory" in performance) {
			const memory = (performance as any).memory;

			AnalyticsUtils.trackPerformance({
				name: "memory_usage",
				value: memory.usedJSHeapSize,
				unit: "bytes",
				tags: {
					total_heap: memory.totalJSHeapSize.toString(),
					heap_limit: memory.jsHeapSizeLimit.toString(),
					usage_percentage: (
						(memory.usedJSHeapSize / memory.jsHeapSizeLimit) *
						100
					).toFixed(2),
				},
			});
		}
	}

	// Get performance summary
	public getPerformanceSummary(): Record<string, any> {
		const summary: Record<string, any> = {};

		for (const [type, buffer] of this.metricsBuffer.entries()) {
			if (buffer.length > 0) {
				const values = buffer.map((item) => item.value || 0);
				summary[type] = {
					count: buffer.length,
					average: values.reduce((a, b) => a + b, 0) / values.length,
					min: Math.min(...values),
					max: Math.max(...values),
					latest: buffer[buffer.length - 1],
				};
			}
		}

		return summary;
	}

	// Cleanup observers
	public destroy(): void {
		this.observers.forEach((observer) => observer.disconnect());
		this.observers = [];
		this.metricsBuffer.clear();
	}
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
	const analytics = useAnalytics();

	const startMeasurement = (name: string) => {
		return performanceMonitor.startMeasurement(name);
	};

	const trackThreeDPerformance = (metrics: ThreeDPerformanceMetrics) => {
		performanceMonitor.trackThreeDPerformance(metrics);
	};

	const trackDatabasePerformance = (metrics: DatabasePerformanceMetrics) => {
		performanceMonitor.trackDatabasePerformance(metrics);
	};

	const trackAPIPerformance = (metrics: APIPerformanceMetrics) => {
		performanceMonitor.trackAPIPerformance(metrics);
	};

	const trackMemoryUsage = () => {
		performanceMonitor.trackMemoryUsage();
	};

	return {
		startMeasurement,
		trackThreeDPerformance,
		trackDatabasePerformance,
		trackAPIPerformance,
		trackMemoryUsage,
		getSummary: () => performanceMonitor.getPerformanceSummary(),
	};
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();
