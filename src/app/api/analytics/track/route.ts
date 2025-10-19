import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Analytics event schema for validation
const AnalyticsEventSchema = z.object({
	name: z.string(),
	properties: z.record(z.any()).optional(),
	category: z
		.enum([
			"user_interaction",
			"performance",
			"medical_content",
			"technical",
			"localization",
		])
		.optional(),
	timestamp: z.number().optional(),
	sessionId: z.string(),
	userId: z.string().optional(),
	userAgent: z.string().optional(),
	url: z.string().optional(),
	referrer: z.string().optional(),
});

// GDPR compliance: Only process events if consent is given
async function validateConsent(sessionId: string): Promise<boolean> {
	try {
		// In a real implementation, you would check against your database
		// For now, we'll implement a simple check based on session storage
		return true; // Placeholder - implement proper consent validation
	} catch (error) {
		console.error("Error validating consent:", error);
		return false;
	}
}

// Rate limiting to prevent abuse
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(sessionId: string): boolean {
	const now = Date.now();
	const windowMs = 60000; // 1 minute window
	const maxRequests = 100; // Max 100 requests per minute per session

	const existing = rateLimitMap.get(sessionId);

	if (!existing || now > existing.resetTime) {
		rateLimitMap.set(sessionId, { count: 1, resetTime: now + windowMs });
		return true;
	}

	if (existing.count >= maxRequests) {
		return false;
	}

	existing.count++;
	return true;
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate the request body
		const event = AnalyticsEventSchema.parse(body);

		// Check rate limiting
		if (!checkRateLimit(event.sessionId)) {
			return NextResponse.json(
				{ error: "Rate limit exceeded" },
				{ status: 429 },
			);
		}

		// Validate GDPR consent
		const hasConsent = await validateConsent(event.sessionId);
		if (!hasConsent) {
			return NextResponse.json(
				{ error: "Consent required for analytics" },
				{ status: 403 },
			);
		}

		// Sanitize and validate the event data
		const sanitizedEvent = {
			name: event.name,
			properties: event.properties || {},
			category: event.category || "user_interaction",
			timestamp: event.timestamp || Date.now(),
			sessionId: event.sessionId,
			userId: event.userId,
			// Remove potentially sensitive data
			userAgent: undefined,
			url: event.url?.replace(/\/(suplementy|badania)\/\d+/g, "/$1/[id]"), // Anonymize dynamic routes
			referrer: event.referrer,
		};

		// Store the event (in a real app, you'd send this to your analytics service)
		await storeAnalyticsEvent(sanitizedEvent);

		// Also send to external analytics services if configured
		await forwardToExternalServices(sanitizedEvent);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Analytics tracking error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid event data", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// Store analytics event in database (placeholder implementation)
async function storeAnalyticsEvent(event: any): Promise<void> {
	try {
		// In a real implementation, you would store this in your database
		// For example, using Prisma:
		/*
    await prisma.analyticsEvent.create({
      data: {
        name: event.name,
        properties: event.properties,
        category: event.category,
        timestamp: new Date(event.timestamp),
        sessionId: event.sessionId,
        userId: event.userId,
        url: event.url,
        referrer: event.referrer,
      },
    });
    */

		// For now, we'll just log it
		console.log("📊 Analytics Event Stored:", {
			name: event.name,
			category: event.category,
			sessionId: event.sessionId,
			timestamp: new Date(event.timestamp).toISOString(),
		});
	} catch (error) {
		console.error("Failed to store analytics event:", error);
		throw error;
	}
}

// Forward to external analytics services
async function forwardToExternalServices(event: any): Promise<void> {
	try {
		// Forward to custom analytics service if configured
		if (process.env.CUSTOM_ANALYTICS_ENDPOINT) {
			await fetch(process.env.CUSTOM_ANALYTICS_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.CUSTOM_ANALYTICS_TOKEN}`,
				},
				body: JSON.stringify(event),
			});
		}

		// You could also forward to other services like:
		// - Google Analytics
		// - Mixpanel
		// - PostHog
		// - etc.
	} catch (error) {
		console.warn("Failed to forward to external analytics service:", error);
		// Don't throw - we don't want external service failures to break our app
	}
}

// Health check endpoint
export async function GET() {
	return NextResponse.json({
		status: "ok",
		timestamp: new Date().toISOString(),
		version: "1.0.0",
	});
}
