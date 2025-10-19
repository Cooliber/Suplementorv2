import { useCallback, useEffect, useRef } from "react";
import { AnalyticsUtils, useAnalytics } from "./analytics";

// User interaction types
export interface UserInteractionEvent {
	element: string;
	action: "click" | "hover" | "scroll" | "focus" | "input" | "drag" | "drop";
	page: string;
	section?: string;
	metadata?: Record<string, any>;
	timestamp: number;
}

// Learning progress events
export interface LearningProgressEvent {
	moduleId: string;
	moduleType:
		| "brain_region"
		| "supplement"
		| "educational_content"
		| "quiz"
		| "tutorial";
	action: "start" | "progress" | "complete" | "pause" | "restart";
	progress: number; // 0-1
	timeSpent: number; // milliseconds
	score?: number; // for quizzes
	metadata?: Record<string, any>;
}

// Feature usage events
export interface FeatureUsageEvent {
	feature: string;
	action: string;
	duration?: number;
	success?: boolean;
	metadata?: Record<string, any>;
}

// Search and discovery events
export interface SearchEvent {
	query: string;
	category?: string;
	filters?: Record<string, any>;
	resultCount: number;
	clickedResult?: string;
	timeToClick?: number;
}

// Supplement interaction events
export interface SupplementInteractionEvent {
	supplementId: string;
	action:
		| "view"
		| "add_to_stack"
		| "remove_from_stack"
		| "search"
		| "compare"
		| "bookmark";
	stackId?: string;
	metadata?: Record<string, any>;
}

export class UserBehaviorAnalytics {
	private interactionBuffer: UserInteractionEvent[] = [];
	private maxBufferSize = 50;
	private flushInterval?: NodeJS.Timeout;
	private sessionStartTime = Date.now();
	private pageStartTime = Date.now();

	constructor() {
		this.initializeTracking();
		this.startPeriodicFlush();
	}

	private initializeTracking(): void {
		if (typeof window === "undefined") return;

		// Track page visibility changes
		document.addEventListener(
			"visibilitychange",
			this.handleVisibilityChange.bind(this),
		);

		// Track time spent on page
		window.addEventListener("beforeunload", this.handlePageUnload.bind(this));

		// Track scroll depth
		window.addEventListener(
			"scroll",
			this.throttle(this.handleScroll.bind(this), 1000),
		);

		// Track clicks on interactive elements
		document.addEventListener("click", this.handleClick.bind(this));

		// Track form interactions
		document.addEventListener("focusin", this.handleFocus.bind(this));
		document.addEventListener("focusout", this.handleBlur.bind(this));
	}

	private handleVisibilityChange(): void {
		if (document.visibilityState === "hidden") {
			const timeSpent = Date.now() - this.pageStartTime;
			AnalyticsUtils.trackEducationalEngagement(
				window.location.pathname,
				"page_interaction",
				timeSpent,
			);
		} else if (document.visibilityState === "visible") {
			this.pageStartTime = Date.now();
		}
	}

	private handlePageUnload(): void {
		const totalTimeSpent = Date.now() - this.pageStartTime;
		const sessionTime = Date.now() - this.sessionStartTime;

		AnalyticsUtils.track("page_unload", {
			time_spent_seconds: Math.round(totalTimeSpent / 1000),
			session_time_seconds: Math.round(sessionTime / 1000),
			scroll_depth: this.getScrollDepth(),
			page_url: window.location.pathname,
		});
	}

	private handleScroll(): void {
		const scrollDepth = this.getScrollDepth();
		if (scrollDepth > 0.25 && scrollDepth % 0.25 < 0.05) {
			// Track at 25%, 50%, 75%, 100%
			AnalyticsUtils.track("scroll_depth", {
				depth_percentage: Math.round(scrollDepth * 100),
				page_url: window.location.pathname,
			});
		}
	}

	private handleClick(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		const elementInfo = this.getElementInfo(target);

		if (elementInfo) {
			this.trackInteraction({
				element: elementInfo.element,
				action: "click",
				page: window.location.pathname,
				section: elementInfo.section,
				metadata: {
					text: target.textContent?.slice(0, 100), // Limit text length
					href: (target as HTMLAnchorElement).href,
					className: target.className,
				},
				timestamp: Date.now(),
			});
		}
	}

	private handleFocus(event: FocusEvent): void {
		const target = event.target as HTMLElement;
		if (
			target.tagName === "INPUT" ||
			target.tagName === "TEXTAREA" ||
			target.tagName === "SELECT"
		) {
			this.trackInteraction({
				element: target.tagName.toLowerCase(),
				action: "focus",
				page: window.location.pathname,
				metadata: {
					input_type: (target as HTMLInputElement).type,
					placeholder: (target as HTMLInputElement).placeholder,
				},
				timestamp: Date.now(),
			});
		}
	}

	private handleBlur(event: FocusEvent): void {
		const target = event.target as HTMLElement;
		if (
			target.tagName === "INPUT" ||
			target.tagName === "TEXTAREA" ||
			target.tagName === "SELECT"
		) {
			this.trackInteraction({
				element: target.tagName.toLowerCase(),
				action: "input",
				page: window.location.pathname,
				metadata: {
					input_type: (target as HTMLInputElement).type,
					has_value: (target as HTMLInputElement).value.length > 0,
				},
				timestamp: Date.now(),
			});
		}
	}

	private getElementInfo(
		element: HTMLElement,
	): { element: string; section?: string } | null {
		// Identify interactive elements and their context
		if (element.tagName === "BUTTON") {
			return { element: "button", section: this.getSectionContext(element) };
		}
		if (element.tagName === "A") {
			return { element: "link", section: this.getSectionContext(element) };
		}
		if (element.className.includes("supplement-card")) {
			return { element: "supplement_card", section: "supplements" };
		}
		if (element.className.includes("brain-region")) {
			return { element: "brain_region", section: "brain_visualization" };
		}
		if (element.className.includes("quiz")) {
			return { element: "quiz_element", section: "education" };
		}
		if (element.closest("[data-tracking]")) {
			const trackingElement = element.closest("[data-tracking]") as HTMLElement;
			return {
				element: trackingElement.dataset.tracking || "tracked_element",
				section: this.getSectionContext(trackingElement),
			};
		}

		return null;
	}

	private getSectionContext(element: HTMLElement): string | undefined {
		// Find the nearest section or component context
		const section = element.closest("section, [data-section], .section");
		if (section) {
			return section.className || section.id || "section";
		}

		// Check for common component contexts
		if (element.closest(".supplement-stack-builder")) return "stack_builder";
		if (element.closest(".brain-3d-viewer")) return "brain_3d";
		if (element.closest(".knowledge-graph")) return "knowledge_graph";
		if (element.closest(".quiz-container")) return "quiz";
		if (element.closest(".search-results")) return "search";

		return undefined;
	}

	private getScrollDepth(): number {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		const windowHeight = window.innerHeight;
		const documentHeight = Math.max(
			document.body.scrollHeight,
			document.body.offsetHeight,
			document.documentElement.clientHeight,
			document.documentElement.scrollHeight,
			document.documentElement.offsetHeight,
		);

		return (scrollTop + windowHeight) / documentHeight;
	}

	private throttle<T extends (...args: any[]) => any>(
		func: T,
		limit: number,
	): T {
		let inThrottle: boolean;
		return ((...args: any[]) => {
			if (!inThrottle) {
				func.apply(this, args);
				inThrottle = true;
				setTimeout(() => (inThrottle = false), limit);
			}
		}) as T;
	}

	private trackInteraction(interaction: UserInteractionEvent): void {
		this.interactionBuffer.push(interaction);

		if (this.interactionBuffer.length >= this.maxBufferSize) {
			this.flushInteractions();
		}
	}

	private startPeriodicFlush(): void {
		this.flushInterval = setInterval(() => {
			if (this.interactionBuffer.length > 0) {
				this.flushInteractions();
			}
		}, 30000); // Flush every 30 seconds
	}

	private flushInteractions(): void {
		if (this.interactionBuffer.length === 0) return;

		const interactions = [...this.interactionBuffer];
		this.interactionBuffer = [];

		// Group interactions by type for efficient processing
		const interactionsByType = interactions.reduce(
			(acc, interaction) => {
				const key = `${interaction.action}_${interaction.element}`;
				if (!acc[key]) acc[key] = [];
				acc[key].push(interaction);
				return acc;
			},
			{} as Record<string, UserInteractionEvent[]>,
		);

		// Send analytics events
		Object.entries(interactionsByType).forEach(([type, typeInteractions]) => {
			AnalyticsUtils.track("user_interactions", {
				interaction_type: type,
				count: typeInteractions.length,
				page: typeInteractions[0].page,
				section: typeInteractions[0].section,
				time_range: {
					start: typeInteractions[0].timestamp,
					end: typeInteractions[typeInteractions.length - 1].timestamp,
				},
			});
		});
	}

	// Public methods for manual tracking
	public trackLearningProgress(event: LearningProgressEvent): void {
		AnalyticsUtils.trackLearningProgress(
			event.moduleId,
			event.progress,
			event.score,
		);

		AnalyticsUtils.track("learning_engagement", {
			module_id: event.moduleId,
			module_type: event.moduleType,
			action: event.action,
			progress: event.progress,
			time_spent_seconds: Math.round(event.timeSpent / 1000),
			score: event.score,
			...event.metadata,
		});
	}

	public trackFeatureUsage(event: FeatureUsageEvent): void {
		AnalyticsUtils.trackFeatureUsage(event.feature, event.action, {
			duration: event.duration,
			success: event.success,
			...event.metadata,
		});
	}

	public trackSearch(event: SearchEvent): void {
		AnalyticsUtils.trackSearch(event.query, event.resultCount, event.filters);

		if (event.clickedResult) {
			AnalyticsUtils.track("search_result_click", {
				query: event.query,
				clicked_result: event.clickedResult,
				time_to_click_ms: event.timeToClick,
				position: this.extractPositionFromResultId(event.clickedResult),
			});
		}
	}

	public trackSupplementInteraction(event: SupplementInteractionEvent): void {
		AnalyticsUtils.trackSupplementStack(event.action, {
			supplementId: event.supplementId,
			stackId: event.stackId,
			...event.metadata,
		});

		AnalyticsUtils.track("supplement_interaction", {
			supplement_id: event.supplementId,
			action: event.action,
			stack_id: event.stackId,
			...event.metadata,
		});
	}

	private extractPositionFromResultId(resultId: string): number {
		// Extract position from result ID if available
		const match = resultId.match(/position-(\d+)/);
		return match ? Number.parseInt(match[1], 10) : -1;
	}

	public destroy(): void {
		if (this.flushInterval) {
			clearInterval(this.flushInterval);
		}
		this.flushInteractions(); // Final flush
	}
}

// React hook for user behavior analytics
export function useUserBehaviorAnalytics() {
	const analytics = useAnalytics();
	const behaviorTrackerRef = useRef<UserBehaviorAnalytics | null>(null);

	useEffect(() => {
		behaviorTrackerRef.current = new UserBehaviorAnalytics();

		return () => {
			behaviorTrackerRef.current?.destroy();
		};
	}, []);

	const trackLearningProgress = useCallback((event: LearningProgressEvent) => {
		behaviorTrackerRef.current?.trackLearningProgress(event);
	}, []);

	const trackFeatureUsage = useCallback((event: FeatureUsageEvent) => {
		behaviorTrackerRef.current?.trackFeatureUsage(event);
	}, []);

	const trackSearch = useCallback((event: SearchEvent) => {
		behaviorTrackerRef.current?.trackSearch(event);
	}, []);

	const trackSupplementInteraction = useCallback(
		(event: SupplementInteractionEvent) => {
			behaviorTrackerRef.current?.trackSupplementInteraction(event);
		},
		[],
	);

	return {
		trackLearningProgress,
		trackFeatureUsage,
		trackSearch,
		trackSupplementInteraction,
	};
}

// Singleton instance for non-React usage
export const userBehaviorAnalytics = new UserBehaviorAnalytics();
