import { useAnalytics } from "./analytics";
import { trackError, trackPerformance } from "./sentry";

// Technical monitoring event types
export interface DatabaseMetrics {
	query: string;
	executionTime: number;
	rowsAffected: number;
	connectionId: string;
	timestamp: number;
	error?: Error;
}

export interface SecurityEvent {
	type:
		| "authentication"
		| "authorization"
		| "suspicious_activity"
		| "data_access"
		| "configuration_change";
	severity: "low" | "medium" | "high" | "critical";
	description: string;
	userId?: string;
	ipAddress?: string;
	userAgent?: string;
	resource?: string;
	action?: string;
	metadata?: Record<string, any>;
}

export interface InfrastructureMetrics {
	cpuUsage: number;
	memoryUsage: number;
	diskUsage: number;
	networkIO: { inbound: number; outbound: number };
	activeConnections: number;
	timestamp: number;
}

export interface ErrorMetrics {
	error: Error;
	context: {
		userId?: string;
		page?: string;
		component?: string;
		action?: string;
		timestamp: number;
	};
	severity: "low" | "medium" | "high" | "critical";
	category: "client" | "server" | "database" | "external_service" | "unknown";
}

export class TechnicalMonitor {
	private databaseMetrics: DatabaseMetrics[] = [];
	private securityEvents: SecurityEvent[] = [];
	private infrastructureMetrics: InfrastructureMetrics[] = [];
	private errorMetrics: ErrorMetrics[] = [];
	private maxBufferSize = 1000;

	constructor() {
		this.initializeTechnicalMonitoring();
	}

	private initializeTechnicalMonitoring(): void {
		// Monitor database performance
		this.initializeDatabaseMonitoring();

		// Monitor security events
		this.initializeSecurityMonitoring();

		// Monitor infrastructure metrics
		this.initializeInfrastructureMonitoring();

		// Monitor errors
		this.initializeErrorMonitoring();
	}

	private initializeDatabaseMonitoring(): void {
		// Track database query performance
		if (typeof window !== "undefined" && (window as any).prisma) {
			// This would be implemented with Prisma middleware in a real app
			console.log("Database monitoring initialized");
		}
	}

	private initializeSecurityMonitoring(): void {
		// Track authentication events
		if (typeof window !== "undefined") {
			// Listen for auth state changes
			document.addEventListener("authStateChange", (event: any) => {
				this.trackSecurityEvent({
					type: "authentication",
					severity: "low",
					description: `User ${event.detail.action}`,
					userId: event.detail.userId,
					action: event.detail.action,
				});
			});

			// Track suspicious activities
			this.trackSuspiciousActivities();
		}
	}

	private initializeInfrastructureMonitoring(): void {
		// Track resource usage
		if ("performance" in window && "memory" in (performance as any)) {
			setInterval(() => {
				this.trackInfrastructureMetrics({
					cpuUsage: this.getCPUUsage(),
					memoryUsage: this.getMemoryUsage(),
					diskUsage: 0, // Would need server-side data
					networkIO: { inbound: 0, outbound: 0 }, // Would need server-side data
					activeConnections: 0, // Would need server-side data
					timestamp: Date.now(),
				});
			}, 60000); // Every minute
		}
	}

	private initializeErrorMonitoring(): void {
		// Global error handler
		if (typeof window !== "undefined") {
			window.addEventListener("error", (event) => {
				this.trackError({
					error: event.error || new Error(event.message),
					context: {
						page: window.location.pathname,
						timestamp: Date.now(),
					},
					severity: "medium",
					category: "client",
				});
			});

			window.addEventListener("unhandledrejection", (event) => {
				this.trackError({
					error: new Error(
						event.reason?.message || "Unhandled promise rejection",
					),
					context: {
						page: window.location.pathname,
						timestamp: Date.now(),
					},
					severity: "high",
					category: "client",
				});
			});
		}
	}

	private trackSuspiciousActivities(): void {
		// Track rapid page navigation (possible bot activity)
		let navigationCount = 0;
		let lastNavigationTime = Date.now();

		if (typeof window !== "undefined") {
			window.addEventListener("popstate", () => {
				navigationCount++;
				const now = Date.now();
				const timeDiff = now - lastNavigationTime;

				if (navigationCount > 10 && timeDiff < 60000) {
					// 10 navigations in 1 minute
					this.trackSecurityEvent({
						type: "suspicious_activity",
						severity: "high",
						description: "Rapid navigation detected",
						metadata: {
							navigationCount,
							timeWindow: timeDiff,
						},
					});
				}

				lastNavigationTime = now;
			});
		}

		// Track unusual data access patterns
		this.trackUnusualDataAccess();
	}

	private trackUnusualDataAccess(): void {
		// Monitor for unusual API call patterns
		const apiCallCounts = new Map<string, number>();
		const apiCallTimes = new Map<string, number[]>();

		// This would be implemented with fetch interceptors in a real app
		if (typeof window !== "undefined") {
			const originalFetch = window.fetch;
			window.fetch = async (...args) => {
				const url = args[0] as string;
				const now = Date.now();

				if (url.includes("/api/")) {
					const count = apiCallCounts.get(url) || 0;
					apiCallCounts.set(url, count + 1);

					if (!apiCallTimes.has(url)) {
						apiCallTimes.set(url, []);
					}
					const times = apiCallTimes.get(url)!;
					times.push(now);

					// Keep only last 100 calls
					if (times.length > 100) {
						times.shift();
					}

					// Check for rapid API calls
					if (times.length >= 10) {
						const recentTimes = times.slice(-10);
						const timeSpan =
							recentTimes[recentTimes.length - 1] - recentTimes[0];

						if (timeSpan < 10000 && timeSpan > 0) {
							// 10 calls in 10 seconds
							this.trackSecurityEvent({
								type: "suspicious_activity",
								severity: "medium",
								description: `Rapid API calls to ${url}`,
								metadata: {
									callCount: recentTimes.length,
									timeSpan,
									callsPerSecond: recentTimes.length / (timeSpan / 1000),
								},
							});
						}
					}
				}

				return originalFetch(...args);
			};
		}
	}

	private getCPUUsage(): number {
		// Browser doesn't provide direct CPU usage, this would need server-side data
		return 0;
	}

	private getMemoryUsage(): number {
		if ("memory" in performance) {
			const memory = (performance as any).memory;
			return (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
		}
		return 0;
	}

	// Public methods for manual tracking
	public trackDatabaseMetrics(metrics: DatabaseMetrics): void {
		this.databaseMetrics.push(metrics);

		if (this.databaseMetrics.length > this.maxBufferSize) {
			this.databaseMetrics = this.databaseMetrics.slice(-this.maxBufferSize);
		}

		// Send to analytics
		useAnalytics().trackPerformance("database_query", metrics.executionTime, {
			query_type: this.getQueryType(metrics.query),
			rows_affected: metrics.rowsAffected.toString(),
			connection_id: metrics.connectionId,
		});

		// Track errors if present
		if (metrics.error) {
			trackError(metrics.error, {
				query: metrics.query,
				executionTime: metrics.executionTime,
				connectionId: metrics.connectionId,
			});
		}
	}

	public trackSecurityEvent(event: SecurityEvent): void {
		this.securityEvents.push(event);

		if (this.securityEvents.length > this.maxBufferSize) {
			this.securityEvents = this.securityEvents.slice(-this.maxBufferSize);
		}

		// Send to analytics
		useAnalytics().track("security_event", {
			event_type: event.type,
			severity: event.severity,
			description: event.description,
			user_id: event.userId,
			ip_address: event.ipAddress,
			resource: event.resource,
			action: event.action,
			...event.metadata,
		});

		// Send critical security events to Sentry
		if (event.severity === "critical" || event.severity === "high") {
			trackError(new Error(`Security Event: ${event.description}`), {
				securityType: event.type,
				severity: event.severity,
				userId: event.userId,
				ipAddress: event.ipAddress,
			});
		}
	}

	public trackInfrastructureMetrics(metrics: InfrastructureMetrics): void {
		this.infrastructureMetrics.push(metrics);

		if (this.infrastructureMetrics.length > this.maxBufferSize) {
			this.infrastructureMetrics = this.infrastructureMetrics.slice(
				-this.maxBufferSize,
			);
		}

		// Send to analytics
		useAnalytics().trackPerformance("infrastructure", metrics.cpuUsage, {
			metric_type: "infrastructure",
			memory_usage: metrics.memoryUsage.toString(),
			disk_usage: metrics.diskUsage.toString(),
			active_connections: metrics.activeConnections.toString(),
		});
	}

	public trackError(errorMetrics: ErrorMetrics): void {
		this.errorMetrics.push(errorMetrics);

		if (this.errorMetrics.length > this.maxBufferSize) {
			this.errorMetrics = this.errorMetrics.slice(-this.maxBufferSize);
		}

		// Send to Sentry
		trackError(errorMetrics.error, {
			page: errorMetrics.context.page,
			component: errorMetrics.context.component,
			action: errorMetrics.context.action,
			userId: errorMetrics.context.userId,
			severity: errorMetrics.severity,
			category: errorMetrics.category,
		});

		// Send to analytics
		useAnalytics().track("error_occurred", {
			error_message: errorMetrics.error.message,
			error_stack: errorMetrics.error.stack,
			page: errorMetrics.context.page,
			component: errorMetrics.context.component,
			action: errorMetrics.context.action,
			severity: errorMetrics.severity,
			category: errorMetrics.category,
		});
	}

	private getQueryType(query: string): string {
		const normalizedQuery = query.trim().toUpperCase();
		if (normalizedQuery.startsWith("SELECT")) return "SELECT";
		if (normalizedQuery.startsWith("INSERT")) return "INSERT";
		if (normalizedQuery.startsWith("UPDATE")) return "UPDATE";
		if (normalizedQuery.startsWith("DELETE")) return "DELETE";
		return "OTHER";
	}

	// Get technical monitoring summary
	public getTechnicalSummary(): {
		database: {
			totalQueries: number;
			averageExecutionTime: number;
			errorCount: number;
			slowQueries: number;
		};
		security: {
			totalEvents: number;
			bySeverity: Record<string, number>;
			recentSuspiciousActivity: number;
		};
		infrastructure: {
			averageCPU: number;
			averageMemory: number;
			peakMemory: number;
		};
		errors: {
			totalErrors: number;
			byCategory: Record<string, number>;
			bySeverity: Record<string, number>;
		};
	} {
		const database = this.databaseMetrics.reduce(
			(acc, metric) => {
				acc.totalQueries++;
				acc.averageExecutionTime += metric.executionTime;
				if (metric.error) acc.errorCount++;
				if (metric.executionTime > 1000) acc.slowQueries++;
				return acc;
			},
			{
				totalQueries: 0,
				averageExecutionTime: 0,
				errorCount: 0,
				slowQueries: 0,
			},
		);

		database.averageExecutionTime =
			database.totalQueries > 0
				? database.averageExecutionTime / database.totalQueries
				: 0;

		const security = this.securityEvents.reduce(
			(acc, event) => {
				acc.totalEvents++;
				acc.bySeverity[event.severity] =
					(acc.bySeverity[event.severity] || 0) + 1;
				return acc;
			},
			{ totalEvents: 0, bySeverity: {} as Record<string, number> },
		);

		const recentSuspiciousActivity = this.securityEvents.filter(
			(event) =>
				event.type === "suspicious_activity" &&
				event.timestamp > Date.now() - 24 * 60 * 60 * 1000, // Last 24 hours
		).length;

		const infrastructure = this.infrastructureMetrics.reduce(
			(acc, metric) => {
				acc.averageCPU += metric.cpuUsage;
				acc.averageMemory += metric.memoryUsage;
				acc.peakMemory = Math.max(acc.peakMemory, metric.memoryUsage);
				return acc;
			},
			{ averageCPU: 0, averageMemory: 0, peakMemory: 0 },
		);

		const count = this.infrastructureMetrics.length;
		infrastructure.averageCPU =
			count > 0 ? infrastructure.averageCPU / count : 0;
		infrastructure.averageMemory =
			count > 0 ? infrastructure.averageMemory / count : 0;

		const errors = this.errorMetrics.reduce(
			(acc, errorMetric) => {
				acc.totalErrors++;
				acc.byCategory[errorMetric.category] =
					(acc.byCategory[errorMetric.category] || 0) + 1;
				acc.bySeverity[errorMetric.severity] =
					(acc.bySeverity[errorMetric.severity] || 0) + 1;
				return acc;
			},
			{
				totalErrors: 0,
				byCategory: {} as Record<string, number>,
				bySeverity: {} as Record<string, number>,
			},
		);

		return {
			database,
			security: { ...security, recentSuspiciousActivity },
			infrastructure,
			errors,
		};
	}

	// Monitor API endpoint performance
	public monitorAPIEndpoint(
		endpoint: string,
		method: string,
		startTime: number,
	): void {
		const responseTime = Date.now() - startTime;

		useAnalytics().trackPerformance("api_endpoint", responseTime, {
			endpoint,
			method,
			response_time_ms: responseTime,
		});
	}

	// Monitor database connection health
	public monitorDatabaseConnection(
		connectionId: string,
		connected: boolean,
	): void {
		useAnalytics().track("database_connection", {
			connection_id: connectionId,
			status: connected ? "connected" : "disconnected",
			timestamp: Date.now(),
		});

		if (!connected) {
			trackError(new Error(`Database connection lost: ${connectionId}`), {
				connectionId,
				status: "disconnected",
			});
		}
	}
}

// React hook for technical monitoring
export function useTechnicalMonitor() {
	const trackDatabaseMetrics = (metrics: DatabaseMetrics) => {
		technicalMonitor.trackDatabaseMetrics(metrics);
	};

	const trackSecurityEvent = (event: SecurityEvent) => {
		technicalMonitor.trackSecurityEvent(event);
	};

	const trackInfrastructureMetrics = (metrics: InfrastructureMetrics) => {
		technicalMonitor.trackInfrastructureMetrics(metrics);
	};

	const trackError = (errorMetrics: ErrorMetrics) => {
		technicalMonitor.trackError(errorMetrics);
	};

	const monitorAPIEndpoint = (
		endpoint: string,
		method: string,
		startTime: number,
	) => {
		technicalMonitor.monitorAPIEndpoint(endpoint, method, startTime);
	};

	const monitorDatabaseConnection = (
		connectionId: string,
		connected: boolean,
	) => {
		technicalMonitor.monitorDatabaseConnection(connectionId, connected);
	};

	const getSummary = () => {
		return technicalMonitor.getTechnicalSummary();
	};

	return {
		trackDatabaseMetrics,
		trackSecurityEvent,
		trackInfrastructureMetrics,
		trackError,
		monitorAPIEndpoint,
		monitorDatabaseConnection,
		getSummary,
	};
}

// Singleton instance
export const technicalMonitor = new TechnicalMonitor();
