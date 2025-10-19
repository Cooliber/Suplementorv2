/**
 * Performance Monitoring Service
 * Tracks and optimizes performance for large supplement dataset operations
 */

import { cachingService } from "./caching-service";
import { hybridSupplementsService } from "./hybrid-supplements-service";

export interface PerformanceMetrics {
	timestamp: number;
	operation: string;
	duration: number;
	success: boolean;
	cacheHit: boolean;
	dataSize: number;
	memoryUsage?: number;
	error?: string;
}

export interface PerformanceStats {
	totalOperations: number;
	averageResponseTime: number;
	cacheHitRate: number;
	errorRate: number;
	memoryUsage: number;
	topSlowOperations: Array<{
		operation: string;
		averageTime: number;
		count: number;
	}>;
	optimizationRecommendations: string[];
}

export interface OptimizationConfig {
	enableMemoryMonitoring: boolean;
	enableDetailedLogging: boolean;
	maxCacheSize: number;
	cacheTTL: number;
	enablePerformanceAlerts: boolean;
	alertThresholds: {
		responseTime: number; // ms
		errorRate: number; // percentage
		memoryUsage: number; // percentage
	};
}

export class PerformanceMonitoringService {
	private static instance: PerformanceMonitoringService;
	private metrics: PerformanceMetrics[] = [];
	private config: OptimizationConfig;
	private monitoringInterval?: NodeJS.Timeout;
	private isMonitoring = false;

	private constructor() {
		this.config = {
			enableMemoryMonitoring: true,
			enableDetailedLogging: process.env.NODE_ENV === "development",
			maxCacheSize: 50 * 1024 * 1024, // 50MB
			cacheTTL: 300000, // 5 minutes
			enablePerformanceAlerts: true,
			alertThresholds: {
				responseTime: 1000, // 1 second
				errorRate: 5, // 5%
				memoryUsage: 80, // 80%
			},
		};

		this.startMonitoring();
	}

	static getInstance(): PerformanceMonitoringService {
		if (!PerformanceMonitoringService.instance) {
			PerformanceMonitoringService.instance =
				new PerformanceMonitoringService();
		}
		return PerformanceMonitoringService.instance;
	}

	/**
	 * Start performance monitoring
	 */
	private startMonitoring(): void {
		if (this.isMonitoring) return;

		this.isMonitoring = true;

		// Monitor every 30 seconds
		this.monitoringInterval = setInterval(() => {
			this.collectSystemMetrics();
			this.analyzePerformance();
		}, 30000);

		// Override service methods to add monitoring
		this.wrapServiceMethods();
	}

	/**
	 * Stop performance monitoring
	 */
	stopMonitoring(): void {
		if (this.monitoringInterval) {
			clearInterval(this.monitoringInterval);
			this.monitoringInterval = undefined;
		}
		this.isMonitoring = false;
	}

	/**
	 * Wrap service methods with performance monitoring
	 */
	private wrapServiceMethods(): void {
		const originalGetAllSupplements =
			hybridSupplementsService.getAllSupplements;
		const originalGetSupplementById =
			hybridSupplementsService.getSupplementById;
		const originalSearchSupplements =
			hybridSupplementsService.searchSupplements;

		// Wrap getAllSupplements
		hybridSupplementsService.getAllSupplements = async (
			filters,
			pagination,
			useCache,
		) => {
			return this.monitorOperation(
				"getAllSupplements",
				async () =>
					originalGetAllSupplements.call(
						hybridSupplementsService,
						filters,
						pagination,
						useCache,
					),
				{ filters, pagination, useCache },
			);
		};

		// Wrap getSupplementById
		hybridSupplementsService.getSupplementById = async (id, useCache) => {
			return this.monitorOperation(
				"getSupplementById",
				async () =>
					originalGetSupplementById.call(
						hybridSupplementsService,
						id,
						useCache,
					),
				{ id, useCache },
			);
		};

		// Wrap searchSupplements
		hybridSupplementsService.searchSupplements = async (
			searchTerm,
			language,
			limit,
			useCache,
		) => {
			return this.monitorOperation(
				"searchSupplements",
				async () =>
					originalSearchSupplements.call(
						hybridSupplementsService,
						searchTerm,
						language,
						limit,
						useCache,
					),
				{ searchTerm, language, limit, useCache },
			);
		};
	}

	/**
	 * Monitor operation performance
	 */
	private async monitorOperation<T>(
		operationName: string,
		operation: () => Promise<T>,
		context?: any,
	): Promise<T> {
		const startTime = performance.now();
		let success = true;
		let error: string | undefined;
		let cacheHit = false;

		try {
			const result = await operation();

			// Check if result came from cache
			if (context?.useCache !== false) {
				const cacheStatus = cachingService.getCacheStatus(
					`${operationName}:${JSON.stringify(context)}`,
				);
				cacheHit = cacheStatus === "fresh";
			}

			return result;
		} catch (err) {
			success = false;
			error = err instanceof Error ? err.message : "Unknown error";
			throw err;
		} finally {
			const duration = performance.now() - startTime;
			const dataSize = this.estimateDataSize(context);

			const metric: PerformanceMetrics = {
				timestamp: Date.now(),
				operation: operationName,
				duration,
				success,
				cacheHit,
				dataSize,
				error,
			};

			this.recordMetric(metric);

			// Log slow operations
			if (
				this.config.enableDetailedLogging &&
				duration > this.config.alertThresholds.responseTime
			) {
				console.warn(
					`Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`,
				);
			}
		}
	}

	/**
	 * Record performance metric
	 */
	private recordMetric(metric: PerformanceMetrics): void {
		this.metrics.push(metric);

		// Keep only last 1000 metrics to prevent memory bloat
		if (this.metrics.length > 1000) {
			this.metrics = this.metrics.slice(-1000);
		}

		// Store in localStorage for persistence
		try {
			localStorage.setItem(
				"performanceMetrics",
				JSON.stringify(this.metrics.slice(-100)),
			);
		} catch (error) {
			console.warn("Failed to store performance metrics:", error);
		}
	}

	/**
	 * Estimate data size for operation context
	 */
	private estimateDataSize(context?: any): number {
		if (!context) return 0;

		try {
			return new Blob([JSON.stringify(context)]).size;
		} catch {
			return 0;
		}
	}

	/**
	 * Collect system metrics
	 */
	private collectSystemMetrics(): void {
		if (!this.config.enableMemoryMonitoring) return;

		// Get memory usage if available
		if ("memory" in performance) {
			const memory = (performance as any).memory;
			const memoryUsage =
				(memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

			// Check memory threshold
			if (
				this.config.enablePerformanceAlerts &&
				memoryUsage > this.config.alertThresholds.memoryUsage
			) {
				console.warn(`High memory usage detected: ${memoryUsage.toFixed(2)}%`);
			}
		}
	}

	/**
	 * Analyze performance and generate recommendations
	 */
	private analyzePerformance(): void {
		if (this.metrics.length < 10) return;

		const recentMetrics = this.metrics.slice(-100);
		const stats = this.calculateStats(recentMetrics);

		// Generate optimization recommendations
		const recommendations = this.generateRecommendations(stats);

		// Log recommendations in development
		if (this.config.enableDetailedLogging && recommendations.length > 0) {
			console.log("Performance recommendations:", recommendations);
		}

		// Store stats for UI display
		try {
			localStorage.setItem("performanceStats", JSON.stringify(stats));
		} catch (error) {
			console.warn("Failed to store performance stats:", error);
		}
	}

	/**
	 * Calculate performance statistics
	 */
	private calculateStats(metrics: PerformanceMetrics[]): PerformanceStats {
		const totalOperations = metrics.length;
		const successfulOperations = metrics.filter((m) => m.success).length;
		const failedOperations = totalOperations - successfulOperations;
		const cacheHits = metrics.filter((m) => m.cacheHit).length;

		const averageResponseTime =
			metrics.reduce((sum, m) => sum + m.duration, 0) / totalOperations;
		const cacheHitRate = (cacheHits / totalOperations) * 100;
		const errorRate = (failedOperations / totalOperations) * 100;

		// Group by operation type
		const operationGroups = metrics.reduce(
			(groups, metric) => {
				const operation = metric.operation || "unknown";
				if (!groups[operation]) {
					groups[operation] = [];
				}
				groups[operation].push(metric);
				return groups;
			},
			{} as Record<string, PerformanceMetrics[]>,
		);

		// Calculate average times per operation
		const topSlowOperations = Object.entries(operationGroups)
			.map(([operation, operationMetrics]) => ({
				operation,
				averageTime:
					operationMetrics.reduce((sum, m) => sum + m.duration, 0) /
					operationMetrics.length,
				count: operationMetrics.length,
			}))
			.sort((a, b) => b.averageTime - a.averageTime)
			.slice(0, 5);

		return {
			totalOperations,
			averageResponseTime,
			cacheHitRate,
			errorRate,
			memoryUsage: this.getMemoryUsage(),
			topSlowOperations,
			optimizationRecommendations: this.generateRecommendations({
				totalOperations,
				averageResponseTime,
				cacheHitRate,
				errorRate,
				memoryUsage: this.getMemoryUsage(),
				topSlowOperations,
				optimizationRecommendations: [],
			}),
		};
	}

	/**
	 * Generate optimization recommendations
	 */
	private generateRecommendations(stats: PerformanceStats): string[] {
		const recommendations: string[] = [];

		// Response time recommendations
		if (stats.averageResponseTime > 500) {
			recommendations.push(
				"Rozważ zwiększenie TTL cache dla często używanych zapytań",
			);
			recommendations.push(
				"Zaimplementuj paginację dla zapytań zwracających dużo danych",
			);
		}

		// Cache hit rate recommendations
		if (stats.cacheHitRate < 60) {
			recommendations.push(
				"Zwiększ TTL cache lub dodaj więcej kluczy cache dla lepszej wydajności",
			);
		}

		// Error rate recommendations
		if (stats.errorRate > 5) {
			recommendations.push(
				"Sprawdź błędy w logach i rozważ dodanie retry logic dla nieudanych operacji",
			);
		}

		// Memory usage recommendations
		if (stats.memoryUsage > 70) {
			recommendations.push(
				"Rozważ oczyszczenie cache lub zmniejszenie maksymalnego rozmiaru cache",
			);
		}

		// Operation-specific recommendations
		stats.topSlowOperations.forEach((op) => {
			if (op.averageTime > 1000) {
				recommendations.push(
					`Operacja ${op.operation} jest wolna (${op.averageTime.toFixed(0)}ms) - rozważ optymalizację`,
				);
			}
		});

		return recommendations;
	}

	/**
	 * Get current memory usage percentage
	 */
	private getMemoryUsage(): number {
		if ("memory" in performance) {
			const memory = (performance as any).memory;
			return (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
		}
		return 0;
	}

	/**
	 * Get performance statistics
	 */
	getPerformanceStats(): PerformanceStats | null {
		try {
			const stored = localStorage.getItem("performanceStats");
			if (stored) {
				return JSON.parse(stored);
			}
		} catch (error) {
			console.warn("Failed to load performance stats:", error);
		}

		if (this.metrics.length >= 10) {
			return this.calculateStats(this.metrics.slice(-100));
		}

		return null;
	}

	/**
	 * Get recent metrics
	 */
	getRecentMetrics(limit = 50): PerformanceMetrics[] {
		return this.metrics.slice(-limit);
	}

	/**
	 * Clear performance data
	 */
	clearPerformanceData(): void {
		this.metrics = [];
		try {
			localStorage.removeItem("performanceMetrics");
			localStorage.removeItem("performanceStats");
		} catch (error) {
			console.warn("Failed to clear performance data:", error);
		}
	}

	/**
	 * Export performance data for analysis
	 */
	exportPerformanceData(): {
		metrics: PerformanceMetrics[];
		stats: PerformanceStats | null;
		exportedAt: string;
	} {
		return {
			metrics: this.metrics,
			stats: this.getPerformanceStats(),
			exportedAt: new Date().toISOString(),
		};
	}

	/**
	 * Optimize cache settings based on performance data
	 */
	optimizeCacheSettings(): {
		recommendedTTL: number;
		recommendedMaxSize: number;
		reasoning: string[];
	} {
		const stats = this.getPerformanceStats();
		if (!stats) {
			return {
				recommendedTTL: this.config.cacheTTL,
				recommendedMaxSize: this.config.maxCacheSize,
				reasoning: ["Brak wystarczających danych do optymalizacji"],
			};
		}

		const reasoning: string[] = [];
		let recommendedTTL = this.config.cacheTTL;
		let recommendedMaxSize = this.config.maxCacheSize;

		// Adjust TTL based on cache hit rate
		if (stats.cacheHitRate < 50) {
			recommendedTTL = Math.min(this.config.cacheTTL * 2, 1800000); // Max 30 minutes
			reasoning.push(
				`Niski cache hit rate (${stats.cacheHitRate.toFixed(1)}%) - zwiększam TTL`,
			);
		} else if (stats.cacheHitRate > 90) {
			recommendedTTL = Math.max(this.config.cacheTTL * 0.8, 60000); // Min 1 minute
			reasoning.push(
				`Wysoki cache hit rate (${stats.cacheHitRate.toFixed(1)}%) - zmniejszam TTL`,
			);
		}

		// Adjust cache size based on memory usage
		if (stats.memoryUsage > 80) {
			recommendedMaxSize = Math.max(
				this.config.maxCacheSize * 0.8,
				10 * 1024 * 1024,
			); // Min 10MB
			reasoning.push(
				`Wysokie zużycie pamięci (${stats.memoryUsage.toFixed(1)}%) - zmniejszam rozmiar cache`,
			);
		}

		return {
			recommendedTTL,
			recommendedMaxSize,
			reasoning,
		};
	}

	/**
	 * Apply optimization recommendations
	 */
	applyOptimizations(): {
		changes: string[];
		applied: boolean;
	} {
		const optimization = this.optimizeCacheSettings();
		const changes: string[] = [];
		let applied = false;

		if (optimization.recommendedTTL !== this.config.cacheTTL) {
			this.config.cacheTTL = optimization.recommendedTTL;
			changes.push(`Zmieniono TTL cache na ${optimization.recommendedTTL}ms`);
			applied = true;
		}

		if (optimization.recommendedMaxSize !== this.config.maxCacheSize) {
			this.config.maxCacheSize = optimization.recommendedMaxSize;
			changes.push(
				`Zmieniono maksymalny rozmiar cache na ${optimization.recommendedMaxSize} bytes`,
			);
			applied = true;
		}

		// Clear cache if size was reduced significantly
		if (this.config.maxCacheSize < 30 * 1024 * 1024) {
			// Less than 30MB
			hybridSupplementsService.clearCache();
			changes.push("Wyczyszczono cache ze względu na zmniejszony rozmiar");
		}

		return { changes, applied };
	}

	/**
	 * Get cache performance report
	 */
	async getCachePerformanceReport() {
		const cacheStats = await hybridSupplementsService.getCacheStatus();
		const performanceStats = this.getPerformanceStats();

		return {
			cacheStats,
			performanceStats,
			recommendations: performanceStats?.optimizationRecommendations || [],
			timestamp: new Date().toISOString(),
		};
	}

	/**
	 * Update configuration
	 */
	updateConfig(newConfig: Partial<OptimizationConfig>): void {
		this.config = { ...this.config, ...newConfig };
	}

	/**
	 * Get current configuration
	 */
	getConfig(): OptimizationConfig {
		return { ...this.config };
	}
}

// Export singleton instance
export const performanceMonitoringService =
	PerformanceMonitoringService.getInstance();
export default performanceMonitoringService;
