/**
 * Medical App Middleware for Suplementor
 * Handles GDPR compliance, medical data protection, and security headers
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Medical data protection headers
const MEDICAL_HEADERS = {
	"X-Medical-App": "suplementor-edu",
	"X-Medical-Data-Protection": "gdpr-compliant",
	"X-Data-Classification": "medical-educational",
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"Referrer-Policy": "strict-origin-when-cross-origin",
};

// GDPR compliance configuration
const GDPR_CONFIG = {
	strictMode: process.env.GDPR_COMPLIANCE_MODE === "strict",
	medicalDataRetention: Number.parseInt(
		process.env.MEDICAL_DATA_RETENTION_DAYS || "2555",
	),
	requireConsent: process.env.USER_CONSENT_REQUIRED === "true",
	anonymousOnly: process.env.ANONYMOUS_TRACKING_ONLY === "true",
};

// Routes that require medical data protection
const MEDICAL_ROUTES = [
	"/api/supplements",
	"/api/brain-regions",
	"/api/tracking",
	"/suplementy",
	"/wiedza",
	"/brain",
];

// All routes are public - no authentication required
const PROTECTED_ROUTES: string[] = [];

// Public routes that don't need protection
const PUBLIC_ROUTES = [
	"/api/health",
	"/api/auth",
	"/auth",
	"/polityka-prywatnosci",
	"/regulamin",
];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const response = NextResponse.next();

	// Add medical data protection headers to all responses
	Object.entries(MEDICAL_HEADERS).forEach(([key, value]) => {
		response.headers.set(key, value);
	});

	// Handle GDPR compliance for medical routes
	if (isMedicalRoute(pathname)) {
		return handleMedicalRoute(request, response);
	}

	// Skip authentication - all routes are public
	// if (isProtectedRoute(pathname)) {
	// 	return handleProtectedRoute(request, response);
	// }

	// Handle public routes
	if (isPublicRoute(pathname)) {
		return handlePublicRoute(request, response);
	}

	// Default medical data protection for all other routes
	return addMedicalDataProtection(response);
}

/**
 * Check if route requires medical data protection
 */
function isMedicalRoute(pathname: string): boolean {
	return MEDICAL_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if route requires authentication
 */
function isProtectedRoute(pathname: string): boolean {
	return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if route is public
 */
function isPublicRoute(pathname: string): boolean {
	return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Handle medical routes with GDPR compliance
 */
function handleMedicalRoute(
	request: NextRequest,
	response: NextResponse,
): NextResponse {
	// Add GDPR-compliant cache headers for medical data
	response.headers.set(
		"Cache-Control",
		"private, no-cache, no-store, must-revalidate",
	);
	response.headers.set("Pragma", "no-cache");
	response.headers.set("Expires", "0");

	// Add medical data classification
	response.headers.set("X-Medical-Data-Type", "educational-content");

	// Check for GDPR consent if required
	if (GDPR_CONFIG.requireConsent) {
		const hasConsent = request.cookies.get("gdpr-consent");
		const hasMedicalConsent = request.cookies.get("medical-data-consent");

		if (!hasConsent || !hasMedicalConsent) {
			// Redirect to consent page for medical routes
			const consentUrl = new URL("/zgoda-medyczna", request.url);
			return NextResponse.redirect(consentUrl);
		}
	}

	// Log medical data access (if enabled)
	if (process.env.LOG_MEDICAL_DATA_ACCESS === "true") {
		console.log(
			`Medical data access: ${pathname} at ${new Date().toISOString()}`,
		);
	}

	return response;
}

/**
 * Handle protected routes requiring authentication
 */
function handleProtectedRoute(
	request: NextRequest,
	response: NextResponse,
): NextResponse {
	// Check for authentication
	const sessionToken =
		request.cookies.get("next-auth.session-token") ||
		request.cookies.get("__Secure-next-auth.session-token");

	if (!sessionToken) {
		const loginUrl = new URL("/auth/logowanie", request.url);
		return NextResponse.redirect(loginUrl);
	}

	// Add additional security for protected medical routes
	response.headers.set("X-Auth-Protection", "secure-session");
	response.headers.set(
		"Cache-Control",
		"no-cache, no-store, must-revalidate, private",
	);

	return response;
}

/**
 * Handle public routes
 */
function handlePublicRoute(
	request: NextRequest,
	response: NextResponse,
): NextResponse {
	// Health check endpoint - minimal headers
	if (request.nextUrl.pathname === "/api/health") {
		response.headers.set(
			"Cache-Control",
			"no-cache, no-store, must-revalidate",
		);
		response.headers.set("Pragma", "no-cache");
		response.headers.set("Expires", "0");
		return response;
	}

	// Auth routes - secure but cacheable
	response.headers.set("Cache-Control", "public, max-age=300");
	response.headers.set("X-Auth-Protection", "public-access");

	return response;
}

/**
 * Add general medical data protection headers
 */
function addMedicalDataProtection(response: NextResponse): NextResponse {
	response.headers.set("X-Medical-Data-Protection", "gdpr-compliant");
	response.headers.set("X-Data-Classification", "general-educational");

	return response;
}

/**
 * GDPR cookie consent handler
 */
export function handleGDPRConsent(
	consentType: "gdpr" | "medical",
	granted: boolean,
) {
	const cookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict" as const,
		maxAge: consentType === "gdpr" ? 365 * 24 * 60 * 60 : 2555 * 24 * 60 * 60, // GDPR: 1 year, Medical: 7 years
		path: "/",
	};

	const cookieName =
		consentType === "gdpr" ? "gdpr-consent" : "medical-data-consent";
	const cookieValue = granted ? "granted" : "denied";

	const response = NextResponse.next();
	response.cookies.set(cookieName, cookieValue, cookieOptions);

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!_next/static|_next/image|favicon.ico|public/).*)",
	],
};
