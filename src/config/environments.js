/**
 * Environment-specific configuration management for Suplementor Medical App
 * Provides type-safe configuration for different deployment environments
 */

import { env } from "../env.js";

/**
 * Environment types for type safety
 */
export const ENVIRONMENT_TYPES = {
	DEVELOPMENT: "development",
	STAGING: "staging",
	PRODUCTION: "production",
} as const;

export type EnvironmentType = typeof ENVIRONMENT_TYPES[keyof typeof ENVIRONMENT_TYPES];

/**
 * Feature flags configuration
 */
export const FEATURE_FLAGS = {
	BRAIN_3D: env.FEATURE_BRAIN_3D === "enabled",
	SUPPLEMENT_TRACKING: env.FEATURE_SUPPLEMENT_TRACKING === "enabled",
	GAMIFICATION: env.FEATURE_GAMIFICATION === "enabled",
	ADVANCED_ANALYTICS: env.FEATURE_ADVANCED_ANALYTICS === "enabled",
	DEBUG_LOGS: env.ENABLE_DEBUG_LOGS === "true",
	MOCK_DATA: env.ENABLE_MOCK_DATA === "true",
	PLAYGROUND: env.ENABLE_PLAYGROUND === "true",
} as const;

/**
 * Medical compliance configuration
 */
export const MEDICAL_CONFIG = {
	GDPR_COMPLIANCE: {
		STRICT: env.GDPR_COMPLIANCE_MODE === "strict",
		STANDARD: env.GDPR_COMPLIANCE_MODE === "standard",
		MINIMAL: env.GDPR_COMPLIANCE_MODE === "minimal",
	},

	DATA_PROTECTION: {
		ENABLED: env.MEDICAL_DATA_PROTECTION === "enabled",
		ENCRYPTION_KEY: env.MEDICAL_DATA_ENCRYPTION_KEY,
	},

	LOCALIZATION: {
		POLISH_ENABLED: env.POLISH_LOCALIZATION === "enabled",
		DEFAULT_LOCALE: env.NEXT_PUBLIC_DEFAULT_LOCALE || "pl",
	},

	DISCLAIMER: {
		ENABLED: env.NEXT_PUBLIC_MEDICAL_DISCLAIMER === "enabled",
		TEXT: "This application provides educational content about nootropics and cognitive enhancement. Not medical advice.",
	},
} as const;

/**
 * Performance optimization configuration
 */
export const PERFORMANCE_CONFIG = {
	BRAIN_VISUALIZATION: {
		ENABLED: env.BRAIN_VISUALIZATION_OPTIMIZATION === "enabled",
		MAX_POLYGONS: 50000,
		LOD_DISTANCE: 100,
	},

	CDN: {
		ENABLED: env.CDN_OPTIMIZATION === "enabled",
		REGIONAL_EUROPE: env.REGIONAL_CDN_EUROPE === "enabled",
		CACHE_TTL: {
			STATIC: 31536000, // 1 year
			DYNAMIC: 3600, // 1 hour
			API: 300, // 5 minutes
		},
	},

	COMPRESSION: {
		GZIP: true,
		BROTLI: true,
		IMAGE_OPTIMIZATION: true,
	},
} as const;

/**
 * Security configuration
 */
export const SECURITY_CONFIG = {
	ENCRYPTION: {
		DATABASE_KEY: env.DATABASE_ENCRYPTION_KEY,
		MEDICAL_DATA_KEY: env.MEDICAL_DATA_ENCRYPTION_KEY,
		AUDIT_LOG_KEY: env.AUDIT_LOG_ENCRYPTION_KEY,
		ALGORITHM: "aes-256-gcm",
	},

	HEADERS: {
		STRICT_TRANSPORT_SECURITY: "max-age=63072000; includeSubDomains; preload",
		CONTENT_SECURITY_POLICY: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.vercel-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: wss: https://vercel.live https://*.vercel-analytics.com; worker-src 'self' blob:; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none';",
		X_FRAME_OPTIONS: "DENY",
		X_CONTENT_TYPE_OPTIONS: "nosniff",
		REFERRER_POLICY: "strict-origin-when-cross-origin",
	},

	MEDICAL_DATA: {
		PROTECTED: true,
		CLASSIFICATION: "medical-educational",
		RETENTION_DAYS: 2555, // 7 years for medical data
	},
} as const;

/**
 * Database configuration
 */
export const DATABASE_CONFIG = {
	CONNECTION: {
		URL: env.DATABASE_URL,
		MONGODB_URI: env.MONGODB_URI,
		ENCRYPTION: !!env.DATABASE_ENCRYPTION_KEY,
	},

	POOLS: {
		MAX_CONNECTIONS: 20,
		MIN_CONNECTIONS: 5,
		IDLE_TIMEOUT: 300000, // 5 minutes
		CONNECTION_TIMEOUT: 60000, // 1 minute
	},

	RETRY: {
		MAX_ATTEMPTS: 3,
		INITIAL_DELAY: 1000,
		MAX_DELAY: 10000,
	},

	MIGRATIONS: {
		DIRECTORY: "./prisma/migrations",
		ENABLED: true,
		AUTO_RUN: env.NODE_ENV === "production",
	},
} as const;

/**
 * Third-party services configuration
 */
export const SERVICES_CONFIG = {
	STRIPE: {
		PUBLISHABLE_KEY: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		SECRET_KEY: env.STRIPE_SECRET_KEY,
		WEBHOOK_SECRET: env.STRIPE_WEBHOOK_SECRET,
		ENABLED: !!(env.STRIPE_SECRET_KEY && env.STRIPE_PUBLISHABLE_KEY),
	},

	OPENAI: {
		API_KEY: env.OPENAI_API_KEY,
		ENABLED: !!env.OPENAI_API_KEY,
		MODEL: "gpt-4",
		MAX_TOKENS: 2000,
	},

	SENTRY: {
		DSN: env.NEXT_PUBLIC_SENTRY_DSN || env.SENTRY_DSN,
		ENABLED: !!(env.NEXT_PUBLIC_SENTRY_DSN || env.SENTRY_DSN),
		ENVIRONMENT: env.NODE_ENV,
		SAMPLE_RATE: 0.1,
	},

	ANALYTICS: {
		VERCEL: env.VERCEL_ANALYTICS === "enabled",
		GDPR_COMPLIANT: true,
		ERROR_TRACKING: env.ERROR_TRACKING === "enabled",
	},
} as const;

/**
 * Deployment configuration
 */
export const DEPLOYMENT_CONFIG = {
	ENVIRONMENT: env.NODE_ENV,
	VERCEL_ENV: env.VERCEL_ENV,
	REGION: env.VERCEL_REGION || env.DEPLOYMENT_REGION,
	BUILD_ID: env.BUILD_ID,

	HEALTH_CHECK: {
		PATH: "/api/health",
		TIMEOUT: 5000,
		RETRY_ATTEMPTS: 3,
	},

	MONITORING: {
		ENABLED: env.ERROR_TRACKING === "enabled",
		SENTRY: SERVICES_CONFIG.SENTRY.ENABLED,
		ANALYTICS: SERVICES_CONFIG.ANALYTICS.VERCEL,
	},

	LOGGING: {
		LEVEL: env.ENABLE_DEBUG_LOGS === "true" ? "debug" : "info",
		ENABLED: true,
		GDPR_COMPLIANT: true,
	},
} as const;

/**
 * Get current environment type
 */
export function getCurrentEnvironment(): EnvironmentType {
	if (env.VERCEL_ENV === "production" || env.NODE_ENV === "production") {
		return ENVIRONMENT_TYPES.PRODUCTION;
	}
	if (env.VERCEL_ENV === "preview" || env.NODE_ENV === "staging") {
		return ENVIRONMENT_TYPES.STAGING;
	}
	return ENVIRONMENT_TYPES.DEVELOPMENT;
}

/**
 * Check if current environment is production
 */
export function isProduction(): boolean {
	return getCurrentEnvironment() === ENVIRONMENT_TYPES.PRODUCTION;
}

/**
 * Check if current environment is development
 */
export function isDevelopment(): boolean {
	return getCurrentEnvironment() === ENVIRONMENT_TYPES.DEVELOPMENT;
}

/**
 * Check if current environment is staging
 */
export function isStaging(): boolean {
	return getCurrentEnvironment() === ENVIRONMENT_TYPES.STAGING;
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig() {
	const currentEnv = getCurrentEnvironment();

	return {
		environment: currentEnv,
		features: FEATURE_FLAGS,
		medical: MEDICAL_CONFIG,
		performance: PERFORMANCE_CONFIG,
		security: SECURITY_CONFIG,
		database: DATABASE_CONFIG,
		services: SERVICES_CONFIG,
		deployment: DEPLOYMENT_CONFIG,
	};
}

/**
 * Validate current environment configuration
 */
export function validateEnvironmentConfig(): {
	isValid: boolean;
	errors: string[];
	warnings: string[];
} {
	const errors: string[] = [];
	const warnings: string[] = [];

	// Production environment checks
	if (isProduction()) {
		if (!env.NEXTAUTH_SECRET) {
			errors.push("NEXTAUTH_SECRET is required in production");
		}
		if (!env.DATABASE_URL && !env.MONGODB_URI) {
			errors.push("Database connection is required in production");
		}
		if (!env.MEDICAL_DATA_ENCRYPTION_KEY) {
			errors.push("Medical data encryption key is required in production");
		}
		if (!env.DATABASE_ENCRYPTION_KEY) {
			errors.push("Database encryption key is required in production");
		}
		if (!env.AUDIT_LOG_ENCRYPTION_KEY) {
			errors.push("Audit log encryption key is required in production");
		}
	}

	// Medical compliance checks
	if (!MEDICAL_CONFIG.GDPR_COMPLIANCE.STRICT) {
		warnings.push("GDPR compliance is not set to strict mode");
	}
	if (!MEDICAL_CONFIG.DATA_PROTECTION.ENABLED) {
		errors.push("Medical data protection must be enabled");
	}
	if (!MEDICAL_CONFIG.DISCLAIMER.ENABLED) {
		warnings.push("Medical disclaimer is not enabled");
	}

	// Security checks
	if (isProduction() && !SECURITY_CONFIG.ENCRYPTION.DATABASE_KEY) {
		errors.push("Database encryption key is required for production security");
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
	};
}