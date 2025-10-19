import { track as vercelTrack } from "@vercel/analytics";
import { trackError, trackPerformance } from "./sentry";

// Types for analytics events
export interface AnalyticsEvent {
	name: string;
	properties?: Record<string, any>;
	category?:
		| "user_interaction"
		| "performance"
		| "medical_content"
		| "technical"
		| "localization";
	timestamp?: number;
}

export interface PerformanceMetrics {
	name: string;
	value: number;
	unit: "ms" | "bytes" | "count";
	tags?: Record<string, string>;
}

export interface MedicalContentInteraction {
	contentType:
		| "supplement"
		| "brain_region"
		| "educational_content"
		| "research";
	contentId: string;
	action: "view" | "interact" | "complete" | "search" | "bookmark";
	duration?: number;
	metadata?: Record<string, any>;
}

// GDPR-compliant analytics configuration
export class GDPRCompliantAnalytics {
	private consentGiven = false;
	private userId?: string;
	private sessionId: string;

	constructor() {
		this.sessionId = this.generateSessionId();
		this.loadConsentStatus();
	}

	private generateSessionId(): string {
		return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	private loadConsentStatus(): void {
		if (typeof window !== "undefined") {
			const consent = localStorage.getItem("analytics-consent");
			this.consentGiven = consent === "true";
		}
	}

	public setConsent(granted: boolean): void {
		this.consentGiven = granted;
		if (typeof window !== "undefined") {
			localStorage.setItem("analytics-consent", granted.toString());
		}

		if (granted) {
			this.track("consent_granted", { timestamp: Date.now() });
		}
	}

	public setUserId(userId: string): void {
		this.userId = userId;
	}

	public track(eventName: string, properties?: Record<string, any>): void {
		if (!this.consentGiven) {
			console.log("Analytics consent not given, skipping event:", eventName);
			return;
		}

		const event: AnalyticsEvent = {
			name: eventName,
			properties: {
				...properties,
				sessionId: this.sessionId,
				userId: this.userId,
				timestamp: Date.now(),
				userAgent:
					typeof window !== "undefined"
						? window.navigator.userAgent
						: undefined,
				url: typeof window !== "undefined" ? window.location.href : undefined,
				referrer: typeof window !== "undefined" ? document.referrer : undefined,
			},
			timestamp: Date.now(),
		};

		// Send to Vercel Analytics
		vercelTrack(eventName, properties);

		// Send to custom analytics endpoint if configured
		this.sendToCustomEndpoint(event);

		// Log for debugging in development
		if (process.env.NODE_ENV === "development") {
			console.log("📊 Analytics Event:", event);
		}
	}

	private async sendToCustomEndpoint(event: AnalyticsEvent): Promise<void> {
		try {
			// Only send to custom endpoint if configured
			if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
				await fetch("/api/analytics/track", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(event),
				});
			}
		} catch (error) {
			console.warn("Failed to send analytics to custom endpoint:", error);
		}
	}

	public trackPerformance(metrics: PerformanceMetrics): void {
		this.track("performance_metric", {
			metric_name: metrics.name,
			metric_value: metrics.value,
			metric_unit: metrics.unit,
			...metrics.tags,
		});

		// Also send to Sentry for performance monitoring
		trackPerformance(metrics.name, metrics.value, metrics.tags);
	}

	public trackMedicalInteraction(interaction: MedicalContentInteraction): void {
		this.track("medical_content_interaction", {
			content_type: interaction.contentType,
			content_id: interaction.contentId,
			action: interaction.action,
			duration: interaction.duration,
			...interaction.metadata,
		});
	}

	public trackError(error: Error, context?: Record<string, any>): void {
		this.track("error_occurred", {
			error_message: error.message,
			error_stack: error.stack,
			...context,
		});

		// Also send to Sentry
		trackError(error, context);
	}

	public trackFeatureUsage(
		feature: string,
		action: string,
		metadata?: Record<string, any>,
	): void {
		this.track("feature_usage", {
			feature,
			action,
			...metadata,
		});
	}

	public trackLocalization(language: string, region?: string): void {
		this.track("localization_event", {
			language,
			region,
			user_language:
				typeof navigator !== "undefined" ? navigator.language : undefined,
		});
	}
}

// Singleton instance
export const analytics = new GDPRCompliantAnalytics();

// React hook for easy usage in components
export function useAnalytics() {
	return {
		track: analytics.track.bind(analytics),
		trackPerformance: analytics.trackPerformance.bind(analytics),
		trackMedicalInteraction: analytics.trackMedicalInteraction.bind(analytics),
		trackError: analytics.trackError.bind(analytics),
		trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
		trackLocalization: analytics.trackLocalization.bind(analytics),
		setUserId: analytics.setUserId.bind(analytics),
		setConsent: analytics.setConsent.bind(analytics),
	};
}

// Utility functions for common tracking patterns
export const AnalyticsUtils = {
	// Track page views with enhanced metadata
	trackPageView: (page: string, title?: string) => {
		analytics.track("page_view", {
			page,
			title,
			viewport_width:
				typeof window !== "undefined" ? window.innerWidth : undefined,
			viewport_height:
				typeof window !== "undefined" ? window.innerHeight : undefined,
		});
	},

	// Track time spent on educational content
	trackEducationalEngagement: (
		contentId: string,
		contentType: string,
		timeSpent: number,
	) => {
		analytics.track("educational_engagement", {
			content_id: contentId,
			content_type: contentType,
			time_spent_seconds: Math.round(timeSpent / 1000),
			engagement_level:
				timeSpent > 300000 ? "high" : timeSpent > 60000 ? "medium" : "low", // 5min, 1min thresholds
		});
	},

	// Track supplement stack creation and modifications
	trackSupplementStack: (
		action: "create" | "modify" | "delete",
		stackData: any,
	) => {
		analytics.track("supplement_stack_interaction", {
			action,
			supplement_count: stackData.supplements?.length || 0,
			categories: stackData.supplements?.map((s: any) => s.category) || [],
			total_dosage: stackData.totalDosage,
		});
	},

	// Track brain visualization interactions
	trackBrainVisualization: (
		action: string,
		region?: string,
		duration?: number,
	) => {
		analytics.track("brain_visualization_interaction", {
			action,
			brain_region: region,
			interaction_duration_ms: duration,
		});
	},

	// Track search queries and results
	trackSearch: (
		query: string,
		resultCount: number,
		filters?: Record<string, any>,
	) => {
		analytics.track("search_performed", {
			query,
			result_count: resultCount,
			query_length: query.length,
			has_filters: Object.keys(filters || {}).length > 0,
			filters_used: filters,
		});
	},

	// Track learning progress and quiz results
	trackLearningProgress: (
		moduleId: string,
		progress: number,
		score?: number,
	) => {
		analytics.track("learning_progress", {
			module_id: moduleId,
			progress_percentage: Math.round(progress * 100),
			score,
			completion_status:
				progress >= 1
					? "completed"
					: progress > 0.5
						? "in_progress"
						: "started",
		});
	},
};
