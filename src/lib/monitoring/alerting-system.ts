import { useAnalytics } from "./analytics";

// Alert severity levels
export enum AlertSeverity {
	LOW = "low",
	MEDIUM = "medium",
	HIGH = "high",
	CRITICAL = "critical",
}

// Alert types
export enum AlertType {
	PERFORMANCE = "performance",
	ERROR = "error",
	SECURITY = "security",
	MEDICAL_CONTENT = "medical_content",
	USER_BEHAVIOR = "user_behavior",
	TECHNICAL = "technical",
}

// Alert interface
export interface Alert {
	id: string;
	type: AlertType;
	severity: AlertSeverity;
	title: string;
	message: string;
	timestamp: number;
	metadata?: Record<string, any>;
	resolved?: boolean;
	resolvedAt?: number;
	resolvedBy?: string;
}

// Alert rule interface
export interface AlertRule {
	id: string;
	name: string;
	type: AlertType;
	severity: AlertSeverity;
	condition: (metrics: any) => boolean;
	message: string;
	cooldownMinutes: number;
	enabled: boolean;
}

// Performance thresholds
export interface PerformanceThresholds {
	maxResponseTime: number; // ms
	maxErrorRate: number; // percentage
	minUptime: number; // percentage
	maxMemoryUsage: number; // percentage
	minFrameRate: number; // fps
	maxLoadTime: number; // ms
}

// Default thresholds
const DEFAULT_THRESHOLDS: PerformanceThresholds = {
	maxResponseTime: 2000,
	maxErrorRate: 0.05,
	minUptime: 99.0,
	maxMemoryUsage: 85,
	minFrameRate: 30,
	maxLoadTime: 3000,
};

export class AlertingSystem {
	private alerts: Map<string, Alert> = new Map();
	private alertRules: AlertRule[] = [];
	private lastAlertTimes: Map<string, number> = new Map();
	private thresholds: PerformanceThresholds;
	private alertCallbacks: Array<(alert: Alert) => void> = [];

	constructor(thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS) {
		this.thresholds = thresholds;
		this.initializeDefaultRules();
	}

	private initializeDefaultRules(): void {
		this.alertRules = [
			// Performance alerts
			{
				id: "high_response_time",
				name: "High Response Time",
				type: AlertType.PERFORMANCE,
				severity: AlertSeverity.HIGH,
				condition: (metrics) =>
					metrics.responseTime > this.thresholds.maxResponseTime,
				message: `Czas odpowiedzi (${this.thresholds.maxResponseTime}ms) został przekroczony`,
				cooldownMinutes: 5,
				enabled: true,
			},
			{
				id: "high_error_rate",
				name: "High Error Rate",
				type: AlertType.ERROR,
				severity: AlertSeverity.CRITICAL,
				condition: (metrics) =>
					metrics.errorRate > this.thresholds.maxErrorRate,
				message: `Wysoki współczynnik błędów: ${(this.thresholds.maxErrorRate * 100).toFixed(2)}%`,
				cooldownMinutes: 10,
				enabled: true,
			},
			{
				id: "low_uptime",
				name: "Low Uptime",
				type: AlertType.TECHNICAL,
				severity: AlertSeverity.CRITICAL,
				condition: (metrics) => metrics.uptime < this.thresholds.minUptime,
				message: `Niska dostępność systemu: ${this.thresholds.minUptime}%`,
				cooldownMinutes: 15,
				enabled: true,
			},
			{
				id: "high_memory_usage",
				name: "High Memory Usage",
				type: AlertType.TECHNICAL,
				severity: AlertSeverity.MEDIUM,
				condition: (metrics) =>
					metrics.memoryUsage > this.thresholds.maxMemoryUsage,
				message: `Wysokie użycie pamięci: ${this.thresholds.maxMemoryUsage}%`,
				cooldownMinutes: 5,
				enabled: true,
			},
			{
				id: "low_frame_rate",
				name: "Low Frame Rate",
				type: AlertType.PERFORMANCE,
				severity: AlertSeverity.MEDIUM,
				condition: (metrics) =>
					metrics.frameRate < this.thresholds.minFrameRate,
				message: `Niska liczba klatek na sekundę: ${this.thresholds.minFrameRate} FPS`,
				cooldownMinutes: 5,
				enabled: true,
			},
			{
				id: "slow_page_load",
				name: "Slow Page Load",
				type: AlertType.PERFORMANCE,
				severity: AlertSeverity.HIGH,
				condition: (metrics) => metrics.loadTime > this.thresholds.maxLoadTime,
				message: `Wolne ładowanie strony: ${this.thresholds.maxLoadTime}ms`,
				cooldownMinutes: 5,
				enabled: true,
			},

			// Medical content alerts
			{
				id: "low_content_effectiveness",
				name: "Low Content Effectiveness",
				type: AlertType.MEDICAL_CONTENT,
				severity: AlertSeverity.MEDIUM,
				condition: (metrics) => metrics.contentEffectiveness < 60,
				message: "Niska skuteczność treści edukacyjnych",
				cooldownMinutes: 60,
				enabled: true,
			},
			{
				id: "high_bounce_rate",
				name: "High Bounce Rate",
				type: AlertType.USER_BEHAVIOR,
				severity: AlertSeverity.MEDIUM,
				condition: (metrics) => metrics.bounceRate > 0.4,
				message: "Wysoki współczynnik odrzuceń",
				cooldownMinutes: 30,
				enabled: true,
			},

			// Security alerts
			{
				id: "suspicious_activity",
				name: "Suspicious Activity",
				type: AlertType.SECURITY,
				severity: AlertSeverity.HIGH,
				condition: (metrics) => metrics.suspiciousEvents > 10,
				message: "Wykryto podejrzaną aktywność",
				cooldownMinutes: 15,
				enabled: true,
			},
		];
	}

	// Check all alert rules against current metrics
	public checkAlerts(metrics: Record<string, any>): Alert[] {
		const newAlerts: Alert[] = [];

		for (const rule of this.alertRules) {
			if (!rule.enabled) continue;

			// Check cooldown
			const lastAlertTime = this.lastAlertTimes.get(rule.id) || 0;
			const cooldownMs = rule.cooldownMinutes * 60 * 1000;
			if (Date.now() - lastAlertTime < cooldownMs) {
				continue;
			}

			// Check condition
			if (rule.condition(metrics)) {
				const alert = this.createAlert(rule, metrics);
				newAlerts.push(alert);
				this.alerts.set(alert.id, alert);
				this.lastAlertTimes.set(rule.id, Date.now());

				// Trigger callbacks
				this.alertCallbacks.forEach((callback) => callback(alert));
			}
		}

		return newAlerts;
	}

	private createAlert(rule: AlertRule, metrics: Record<string, any>): Alert {
		return {
			id: `${rule.id}_${Date.now()}`,
			type: rule.type,
			severity: rule.severity,
			title: rule.name,
			message: rule.message,
			timestamp: Date.now(),
			metadata: {
				ruleId: rule.id,
				metrics,
				threshold: this.getThresholdValue(rule.id),
			},
		};
	}

	private getThresholdValue(ruleId: string): number | undefined {
		switch (ruleId) {
			case "high_response_time":
				return this.thresholds.maxResponseTime;
			case "high_error_rate":
				return this.thresholds.maxErrorRate;
			case "low_uptime":
				return this.thresholds.minUptime;
			case "high_memory_usage":
				return this.thresholds.maxMemoryUsage;
			case "low_frame_rate":
				return this.thresholds.minFrameRate;
			case "slow_page_load":
				return this.thresholds.maxLoadTime;
			default:
				return undefined;
		}
	}

	// Resolve an alert
	public resolveAlert(alertId: string, resolvedBy?: string): boolean {
		const alert = this.alerts.get(alertId);
		if (!alert || alert.resolved) {
			return false;
		}

		alert.resolved = true;
		alert.resolvedAt = Date.now();
		alert.resolvedBy = resolvedBy;

		return true;
	}

	// Get all active alerts
	public getActiveAlerts(): Alert[] {
		return Array.from(this.alerts.values()).filter((alert) => !alert.resolved);
	}

	// Get alerts by severity
	public getAlertsBySeverity(severity: AlertSeverity): Alert[] {
		return Array.from(this.alerts.values()).filter(
			(alert) => alert.severity === severity,
		);
	}

	// Get alerts by type
	public getAlertsByType(type: AlertType): Alert[] {
		return Array.from(this.alerts.values()).filter(
			(alert) => alert.type === type,
		);
	}

	// Subscribe to alert notifications
	public onAlert(callback: (alert: Alert) => void): () => void {
		this.alertCallbacks.push(callback);

		// Return unsubscribe function
		return () => {
			const index = this.alertCallbacks.indexOf(callback);
			if (index > -1) {
				this.alertCallbacks.splice(index, 1);
			}
		};
	}

	// Update thresholds
	public updateThresholds(newThresholds: Partial<PerformanceThresholds>): void {
		this.thresholds = { ...this.thresholds, ...newThresholds };
	}

	// Add custom alert rule
	public addAlertRule(rule: Omit<AlertRule, "id">): string {
		const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		const newRule: AlertRule = { ...rule, id };
		this.alertRules.push(newRule);
		return id;
	}

	// Remove alert rule
	public removeAlertRule(ruleId: string): boolean {
		const index = this.alertRules.findIndex((rule) => rule.id === ruleId);
		if (index > -1) {
			this.alertRules.splice(index, 1);
			return true;
		}
		return false;
	}

	// Get alert statistics
	public getAlertStats(): {
		total: number;
		bySeverity: Record<AlertSeverity, number>;
		byType: Record<AlertType, number>;
		recent: number; // Last 24 hours
	} {
		const alerts = Array.from(this.alerts.values());
		const last24h = Date.now() - 24 * 60 * 60 * 1000;

		const bySeverity = alerts.reduce(
			(acc, alert) => {
				acc[alert.severity] = (acc[alert.severity] || 0) + 1;
				return acc;
			},
			{} as Record<AlertSeverity, number>,
		);

		const byType = alerts.reduce(
			(acc, alert) => {
				acc[alert.type] = (acc[alert.type] || 0) + 1;
				return acc;
			},
			{} as Record<AlertType, number>,
		);

		return {
			total: alerts.length,
			bySeverity,
			byType,
			recent: alerts.filter((alert) => alert.timestamp > last24h).length,
		};
	}

	// Send alert notification
	private async sendNotification(alert: Alert): Promise<void> {
		try {
			// In a real implementation, you would send notifications via:
			// - Email
			// - Slack/Discord webhooks
			// - SMS
			// - Push notifications

			if (
				process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL &&
				alert.severity === AlertSeverity.CRITICAL
			) {
				await fetch(process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						text: `🚨 ${alert.title}`,
						blocks: [
							{
								type: "header",
								text: {
									type: "plain_text",
									text: `🚨 ${alert.title}`,
								},
							},
							{
								type: "section",
								text: {
									type: "plain_text",
									text: alert.message,
								},
							},
							{
								type: "context",
								elements: [
									{
										type: "plain_text",
										text: `Severity: ${alert.severity} | Time: ${new Date(alert.timestamp).toISOString()}`,
									},
								],
							},
						],
					}),
				});
			}

			// Log alert for debugging
			console.warn(
				`🚨 Alert [${alert.severity.toUpperCase()}]: ${alert.title} - ${alert.message}`,
			);
		} catch (error) {
			console.error("Failed to send alert notification:", error);
		}
	}

	// Initialize alert notification system
	public initializeNotifications(): void {
		this.onAlert((alert) => {
			this.sendNotification(alert);
		});
	}
}

// React hook for alerting system
export function useAlertingSystem() {
	const [alerts, setAlerts] = useState<Alert[]>([]);
	const [alertStats, setAlertStats] = useState<any>(null);

	useEffect(() => {
		const alertingSystem = new AlertingSystem();

		// Subscribe to new alerts
		const unsubscribe = alertingSystem.onAlert((alert) => {
			setAlerts((prev) => [alert, ...prev]);
		});

		// Initialize notifications
		alertingSystem.initializeNotifications();

		// Update stats periodically
		const statsInterval = setInterval(() => {
			setAlertStats(alertingSystem.getAlertStats());
		}, 60000); // Every minute

		return () => {
			unsubscribe();
			clearInterval(statsInterval);
		};
	}, []);

	const resolveAlert = (alertId: string, resolvedBy?: string) => {
		// In a real implementation, this would call the alerting system
		setAlerts((prev) =>
			prev.map((alert) =>
				alert.id === alertId
					? { ...alert, resolved: true, resolvedAt: Date.now(), resolvedBy }
					: alert,
			),
		);
	};

	return {
		alerts,
		alertStats,
		resolveAlert,
	};
}

// Singleton instance
export const alertingSystem = new AlertingSystem();
