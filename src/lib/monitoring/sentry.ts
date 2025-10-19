// Sentry monitoring disabled - package not installed

export function initSentry() {
	console.log("ℹ️ Sentry monitoring disabled - package not installed");
}

// Stub functions for compatibility
export const trackError = (error: Error, context?: Record<string, any>) => {
	console.error("Error tracked locally:", error, context);
};

export const trackPerformance = (
	name: string,
	duration: number,
	tags?: Record<string, string>,
) => {
	console.log(`Performance tracked: ${name} took ${duration}ms`, tags);
};

export const trackGraphGeneration = (
	nodeCount: number,
	duration: number,
	error?: Error,
) => {
	if (error) {
		console.error("Graph generation error:", error);
	} else {
		console.log(`Graph generated with ${nodeCount} nodes in ${duration}ms`);
	}
};

export const trackSearchQuery = (
	query: string,
	resultCount: number,
	duration: number,
) => {
	console.log(
		`Search query "${query}" returned ${resultCount} results in ${duration}ms`,
	);
};

export const trackBrainVisualization = (
	action: string,
	region?: string,
	duration?: number,
) => {
	console.log(
		`Brain visualization: ${action} on ${region || "unknown"} in ${duration || 0}ms`,
	);
};

export const trackSupplementInteraction = (
	action: string,
	supplementId?: string,
	category?: string,
) => {
	console.log(
		`Supplement interaction: ${action} on ${supplementId || "unknown"} in category ${category || "unknown"}`,
	);
};
