import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Environment configuration schemas for different deployment environments
const createEnvironmentSchema = (isProduction = false) => ({
	// Core application settings
	NODE_ENV: z
		.enum(["development", "test", "staging", "production"])
		.default("development"),
	VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),

	// NextAuth.js Configuration (disabled - public access)
	NEXTAUTH_SECRET: z.string().optional(),
	NEXTAUTH_URL: z.string().url().optional(),

	// OAuth Providers
	GOOGLE_CLIENT_ID: z.string().optional(),
	GOOGLE_CLIENT_SECRET: z.string().optional(),

	// Database Configuration
	DATABASE_URL: z.string().optional(),
	MONGODB_URI: z.string().optional(),

	// Medical App Configuration
	MEDICAL_DATA_PROTECTION: z.enum(["enabled", "disabled"]).default("enabled"),
	GDPR_COMPLIANCE_MODE: z
		.enum(["strict", "standard", "minimal"])
		.default("strict"),
	POLISH_LOCALIZATION: z.enum(["enabled", "disabled"]).default("enabled"),

	// Performance & Optimization
	BRAIN_VISUALIZATION_OPTIMIZATION: z
		.enum(["enabled", "disabled"])
		.default("enabled"),
	CDN_OPTIMIZATION: z.enum(["enabled", "disabled"]).default("enabled"),
	REGIONAL_CDN_EUROPE: z.enum(["enabled", "disabled"]).default("enabled"),

	// Security & Encryption
	DATABASE_ENCRYPTION_KEY: isProduction ? z.string() : z.string().optional(),
	MEDICAL_DATA_ENCRYPTION_KEY: isProduction
		? z.string()
		: z.string().optional(),
	AUDIT_LOG_ENCRYPTION_KEY: isProduction ? z.string() : z.string().optional(),

	// Third-party Services
	OPENAI_API_KEY: z.string().optional(),
	STRIPE_PUBLISHABLE_KEY: z.string().optional(),
	STRIPE_SECRET_KEY: isProduction ? z.string() : z.string().optional(),
	STRIPE_WEBHOOK_SECRET: isProduction ? z.string() : z.string().optional(),

	// Monitoring & Analytics
	SENTRY_DSN: z.string().optional(),
	VERCEL_ANALYTICS: z.enum(["enabled", "disabled"]).default("enabled"),
	ERROR_TRACKING: z.enum(["enabled", "disabled"]).default("enabled"),

	// Development Tools
	ENABLE_DEBUG_LOGS: z.enum(["true", "false"]).default("false"),
	ENABLE_MOCK_DATA: z.enum(["true", "false"]).default("true"),
	ENABLE_PLAYGROUND: z.enum(["true", "false"]).default("false"),

	// Deployment Configuration
	DEPLOYMENT_REGION: z.string().default("fra1"),
	BUILD_ID: z.string().optional(),
	VERCEL_REGION: z.string().optional(),

	// Feature Flags
	FEATURE_BRAIN_3D: z.enum(["enabled", "disabled"]).default("enabled"),
	FEATURE_SUPPLEMENT_TRACKING: z
		.enum(["enabled", "disabled"])
		.default("enabled"),
	FEATURE_GAMIFICATION: z.enum(["enabled", "disabled"]).default("enabled"),
	FEATURE_ADVANCED_ANALYTICS: z
		.enum(["enabled", "disabled"])
		.default("disabled"),
});

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		...createEnvironmentSchema(process.env.NODE_ENV === "production"),

		// Database variables (optional - using hardcoded data for public access)
		// ...(process.env.NODE_ENV === "production" && {
		// 	DATABASE_URL: z.string(),
		// 	MONGODB_URI: z.string(),
		// }),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		// Public environment variables (safe for client-side)
		NEXT_PUBLIC_MEDICAL_DISCLAIMER: z
			.enum(["enabled", "disabled"])
			.default("enabled"),
		NEXT_PUBLIC_GDPR_COMPLIANCE: z
			.enum(["strict", "standard"])
			.default("strict"),
		NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(["pl", "en"]).default("pl"),
		NEXT_PUBLIC_APP_VERSION: z.string().default("1.0.0"),
		NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email().optional(),

		// Feature flags for client
		NEXT_PUBLIC_FEATURE_BRAIN_3D: z
			.enum(["enabled", "disabled"])
			.default("enabled"),
		NEXT_PUBLIC_FEATURE_SUPPLEMENT_TRACKING: z
			.enum(["enabled", "disabled"])
			.default("enabled"),
		NEXT_PUBLIC_FEATURE_GAMIFICATION: z
			.enum(["enabled", "disabled"])
			.default("enabled"),

		// Public API keys (safe for client)
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
		NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),

		// Development flags
		NEXT_PUBLIC_ENABLE_DEBUG: z.enum(["true", "false"]).default("false"),
		NEXT_PUBLIC_ENABLE_MOCK_DATA: z.enum(["true", "false"]).default("true"),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		// Server environment variables
		NODE_ENV: process.env.NODE_ENV,
		VERCEL_ENV: process.env.VERCEL_ENV,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		DATABASE_URL: process.env.DATABASE_URL,
		MONGODB_URI: process.env.MONGODB_URI,
		MEDICAL_DATA_PROTECTION: process.env.MEDICAL_DATA_PROTECTION,
		GDPR_COMPLIANCE_MODE: process.env.GDPR_COMPLIANCE_MODE,
		POLISH_LOCALIZATION: process.env.POLISH_LOCALIZATION,
		BRAIN_VISUALIZATION_OPTIMIZATION:
			process.env.BRAIN_VISUALIZATION_OPTIMIZATION,
		CDN_OPTIMIZATION: process.env.CDN_OPTIMIZATION,
		REGIONAL_CDN_EUROPE: process.env.REGIONAL_CDN_EUROPE,
		DATABASE_ENCRYPTION_KEY: process.env.DATABASE_ENCRYPTION_KEY,
		MEDICAL_DATA_ENCRYPTION_KEY: process.env.MEDICAL_DATA_ENCRYPTION_KEY,
		AUDIT_LOG_ENCRYPTION_KEY: process.env.AUDIT_LOG_ENCRYPTION_KEY,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		SENTRY_DSN: process.env.SENTRY_DSN,
		VERCEL_ANALYTICS: process.env.VERCEL_ANALYTICS,
		ERROR_TRACKING: process.env.ERROR_TRACKING,
		ENABLE_DEBUG_LOGS: process.env.ENABLE_DEBUG_LOGS,
		ENABLE_MOCK_DATA: process.env.ENABLE_MOCK_DATA,
		ENABLE_PLAYGROUND: process.env.ENABLE_PLAYGROUND,
		DEPLOYMENT_REGION: process.env.DEPLOYMENT_REGION,
		BUILD_ID: process.env.VERCEL_BUILD_ID,
		VERCEL_REGION: process.env.VERCEL_REGION,
		FEATURE_BRAIN_3D: process.env.FEATURE_BRAIN_3D,
		FEATURE_SUPPLEMENT_TRACKING: process.env.FEATURE_SUPPLEMENT_TRACKING,
		FEATURE_GAMIFICATION: process.env.FEATURE_GAMIFICATION,
		FEATURE_ADVANCED_ANALYTICS: process.env.FEATURE_ADVANCED_ANALYTICS,

		// Client environment variables
		NEXT_PUBLIC_MEDICAL_DISCLAIMER: process.env.NEXT_PUBLIC_MEDICAL_DISCLAIMER,
		NEXT_PUBLIC_GDPR_COMPLIANCE: process.env.NEXT_PUBLIC_GDPR_COMPLIANCE,
		NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
		NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
		NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
		NEXT_PUBLIC_FEATURE_BRAIN_3D: process.env.NEXT_PUBLIC_FEATURE_BRAIN_3D,
		NEXT_PUBLIC_FEATURE_SUPPLEMENT_TRACKING:
			process.env.NEXT_PUBLIC_FEATURE_SUPPLEMENT_TRACKING,
		NEXT_PUBLIC_FEATURE_GAMIFICATION:
			process.env.NEXT_PUBLIC_FEATURE_GAMIFICATION,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
		NEXT_PUBLIC_ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG,
		NEXT_PUBLIC_ENABLE_MOCK_DATA: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA,
	},

	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,

	/**
	 * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
	 * `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,
});
