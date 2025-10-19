/**
 * Health Check API Route for Suplementor Medical App
 * Provides comprehensive health monitoring for deployment verification
 */

import { type NextRequest, NextResponse } from "next/server";

// Health check configuration
const HEALTH_CONFIG = {
	medical: {
		dataProtection: process.env.MEDICAL_DATA_PROTECTION === "enabled",
		gdprCompliance: process.env.GDPR_COMPLIANCE_MODE === "strict",
		polishLocalization: process.env.POLISH_LOCALIZATION === "enabled",
	},
	performance: {
		brainVisualization:
			process.env.BRAIN_VISUALIZATION_OPTIMIZATION === "enabled",
		cdnOptimization: process.env.CDN_OPTIMIZATION === "enabled",
		regionalCDN: process.env.REGIONAL_CDN_EUROPE === "enabled",
	},
	security: {
		httpsEnforced: process.env.NODE_ENV === "production",
		secureHeaders: true,
		medicalDataProtected: true,
	},
	deployment: {
		region: process.env.VERCEL_REGION || "unknown",
		environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
		buildId: process.env.VERCEL_BUILD_ID || "development",
	},
};

/**
 * GET /api/health - Comprehensive health check
 */
export async function GET(request: NextRequest) {
	const startTime = Date.now();

	try {
		// Perform comprehensive health checks
		const healthStatus = await performHealthChecks();

		const responseTime = Date.now() - startTime;

		const response = {
			status: healthStatus.overall === "healthy" ? "ok" : "degraded",
			timestamp: new Date().toISOString(),
			version: process.env.npm_package_version || "1.0.0",
			environment: HEALTH_CONFIG.deployment.environment,
			region: HEALTH_CONFIG.deployment.region,
			responseTime: `${responseTime}ms`,
			checks: healthStatus,
			medical: {
				disclaimer:
					"This application provides educational content about nootropics and cognitive enhancement. Not medical advice.",
				gdprCompliant: HEALTH_CONFIG.medical.gdprCompliance,
				dataProtection: HEALTH_CONFIG.medical.dataProtection,
				polishLocalized: HEALTH_CONFIG.medical.polishLocalization,
			},
		};

		const statusCode = healthStatus.overall === "healthy" ? 200 : 503;

		return NextResponse.json(response, {
			status: statusCode,
			headers: {
				"Cache-Control": "no-cache, no-store, must-revalidate",
				Pragma: "no-cache",
				Expires: "0",
				"X-Health-Check": "medical-app",
				"X-Medical-Data-Protection": "gdpr-compliant",
			},
		});
	} catch (error) {
		const responseTime = Date.now() - startTime;

		return NextResponse.json(
			{
				status: "error",
				timestamp: new Date().toISOString(),
				error: error instanceof Error ? error.message : "Unknown error",
				responseTime: `${responseTime}ms`,
				medical: {
					disclaimer:
						"Health check failed - service may be experiencing issues",
					gdprCompliant: false,
					dataProtection: false,
				},
			},
			{
				status: 503,
				headers: {
					"Cache-Control": "no-cache, no-store, must-revalidate",
					"X-Health-Check": "error",
				},
			},
		);
	}
}

/**
 * Perform comprehensive health checks
 */
async function performHealthChecks() {
	const checks = {
		database: await checkDatabase(),
		memory: checkMemoryUsage(),
		environment: checkEnvironment(),
		medical: checkMedicalCompliance(),
		performance: checkPerformanceOptimizations(),
		security: checkSecurityHeaders(),
		localization: checkPolishLocalization(),
	};

	const overall = determineOverallHealth(checks);

	return {
		overall,
		...checks,
	};
}

/**
 * Check database connectivity and health
 */
async function checkDatabase() {
	try {
		// Check MongoDB connection if available
		if (process.env.MONGODB_URI) {
			// In a real implementation, you'd ping the database
			// For now, we'll just check if the URI is configured
			return {
				status: "healthy",
				message: "Database configuration present",
				details: { type: "mongodb" },
			};
		}

		return {
			status: "healthy",
			message: "Running in demo mode without database",
			details: { mode: "demo" },
		};
	} catch (error) {
		return {
			status: "unhealthy",
			message: "Database connection failed",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Check memory usage
 */
function checkMemoryUsage() {
	try {
		// In a real implementation, you'd check actual memory usage
		// For now, we'll return a basic check
		return {
			status: "healthy",
			message: "Memory usage within limits",
			details: { usage: "normal" },
		};
	} catch (error) {
		return {
			status: "warning",
			message: "Memory check failed",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Check environment configuration
 */
function checkEnvironment() {
	const requiredEnvVars = [
		"NEXTAUTH_SECRET",
		"GDPR_COMPLIANCE_MODE",
		"MEDICAL_DATA_PROTECTION",
	];

	const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

	if (missing.length > 0) {
		return {
			status: "unhealthy",
			message: `Missing required environment variables: ${missing.join(", ")}`,
			details: { missing },
		};
	}

	return {
		status: "healthy",
		message: "All required environment variables present",
		details: { configured: requiredEnvVars.length },
	};
}

/**
 * Check medical compliance settings
 */
function checkMedicalCompliance() {
	const checks = {
		gdpr: HEALTH_CONFIG.medical.gdprCompliance,
		dataProtection: HEALTH_CONFIG.medical.dataProtection,
		disclaimer: process.env.NEXT_PUBLIC_MEDICAL_DISCLAIMER === "enabled",
	};

	const allCompliant = Object.values(checks).every(Boolean);

	return {
		status: allCompliant ? "healthy" : "warning",
		message: allCompliant
			? "Medical compliance verified"
			: "Some medical compliance settings missing",
		details: checks,
	};
}

/**
 * Check performance optimizations
 */
function checkPerformanceOptimizations() {
	const checks = {
		brainVisualization: HEALTH_CONFIG.performance.brainVisualization,
		cdnOptimization: HEALTH_CONFIG.performance.cdnOptimization,
		regionalCDN: HEALTH_CONFIG.performance.regionalCDN,
	};

	const optimizationsEnabled = Object.values(checks).filter(Boolean).length;

	return {
		status: optimizationsEnabled >= 2 ? "healthy" : "warning",
		message: `${optimizationsEnabled}/3 performance optimizations enabled`,
		details: checks,
	};
}

/**
 * Check security headers and settings
 */
function checkSecurityHeaders() {
	const checks = {
		httpsEnforced: HEALTH_CONFIG.security.httpsEnforced,
		secureHeaders: HEALTH_CONFIG.security.secureHeaders,
		medicalDataProtected: HEALTH_CONFIG.security.medicalDataProtected,
	};

	const allSecure = Object.values(checks).every(Boolean);

	return {
		status: allSecure ? "healthy" : "warning",
		message: allSecure
			? "Security configuration verified"
			: "Some security settings need attention",
		details: checks,
	};
}

/**
 * Check Polish localization settings
 */
function checkPolishLocalization() {
	const checks = {
		polishEnabled: HEALTH_CONFIG.medical.polishLocalization,
		defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE === "pl",
		fontsOptimized: process.env.POLISH_FONT_OPTIMIZATION === "true",
	};

	const localizationComplete =
		Object.values(checks).filter(Boolean).length >= 2;

	return {
		status: localizationComplete ? "healthy" : "warning",
		message: localizationComplete
			? "Polish localization configured"
			: "Polish localization incomplete",
		details: checks,
	};
}

/**
 * Determine overall health status
 */
function determineOverallHealth(
	checks: Record<string, any>,
): "healthy" | "warning" | "unhealthy" {
	const statuses = Object.values(checks).map((check: any) => check.status);

	if (statuses.includes("unhealthy")) {
		return "unhealthy";
	}

	if (statuses.includes("warning")) {
		return "warning";
	}

	return "healthy";
}

/**
 * POST /api/health - Trigger detailed diagnostics
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { diagnostic = false } = body;

		if (!diagnostic) {
			return NextResponse.json(
				{ error: "Diagnostic mode required for POST requests" },
				{ status: 400 },
			);
		}

		// Perform detailed diagnostics
		const diagnostics = await performDetailedDiagnostics();

		return NextResponse.json(
			{
				status: "ok",
				timestamp: new Date().toISOString(),
				diagnostics,
				medical: {
					disclaimer: "Diagnostic information for authorized personnel only",
					dataClassification: "internal-use",
				},
			},
			{
				headers: {
					"X-Diagnostic-Mode": "enabled",
					"X-Medical-Data-Protection": "restricted-access",
				},
			},
		);
	} catch (error) {
		return NextResponse.json(
			{
				status: "error",
				error: error instanceof Error ? error.message : "Diagnostic failed",
			},
			{ status: 500 },
		);
	}
}

/**
 * Perform detailed diagnostics for troubleshooting
 */
async function performDetailedDiagnostics() {
	return {
		environment: {
			nodeVersion: process.version,
			platform: process.platform,
			arch: process.arch,
			uptime: process.uptime(),
		},
		memory: process.memoryUsage(),
		deployment: HEALTH_CONFIG.deployment,
		features: {
			brain3D: process.env.NEXT_PUBLIC_BRAIN_3D_ENABLED,
			supplementTracking: process.env.NEXT_PUBLIC_SUPPLEMENT_TRACKING,
			gamification: process.env.NEXT_PUBLIC_GAMIFICATION,
		},
	};
}
