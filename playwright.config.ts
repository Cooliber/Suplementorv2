import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration for Suplementor Next.js Application
 * Comprehensive E2E testing with Polish localization, accessibility, and performance testing
 */

export default defineConfig({
	// Test directory
	testDir: "./e2e",

	// Test file patterns
	testMatch: "**/*.spec.ts",

	// Maximum time one test can run
	timeout: 60 * 1000,

	// Expect timeout for assertions
	expect: {
		timeout: 10 * 1000,
	},

	// Run tests in files in parallel
	fullyParallel: true,

	// Fail the build on CI if you accidentally left test.only in the source code
	forbidOnly: !!process.env.CI,

	// Retry on CI only
	retries: process.env.CI ? 2 : 0,

	// Opt out of parallel tests on CI
	...(process.env.CI ? { workers: 1 } : {}),

	// Reporter to use
	reporter: [
		["html", { outputFolder: "playwright-report", open: "never" }],
		["json", { outputFile: "test-results/results.json" }],
		["junit", { outputFile: "test-results/junit.xml" }],
		["list"],
	],

	// Shared settings for all the projects below
	use: {
		// Base URL to use in actions like `await page.goto('/')`
		baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",

		// Collect trace when retrying the failed test
		trace: "on-first-retry",

		// Screenshot on failure
		screenshot: "only-on-failure",

		// Video on failure
		video: "retain-on-failure",

		// Locale for Polish language testing
		locale: "pl-PL",

		// Timezone
		timezoneId: "Europe/Warsaw",

		// Viewport size
		viewport: { width: 1280, height: 720 },

		// Ignore HTTPS errors
		ignoreHTTPSErrors: true,

		// Action timeout
		actionTimeout: 15 * 1000,

		// Navigation timeout
		navigationTimeout: 30 * 1000,
	},

	// Configure projects for major browsers
	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				// Polish language preferences
				locale: "pl-PL",
				timezoneId: "Europe/Warsaw",
			},
		},

		{
			name: "firefox",
			use: {
				...devices["Desktop Firefox"],
				locale: "pl-PL",
				timezoneId: "Europe/Warsaw",
			},
		},

		{
			name: "webkit",
			use: {
				...devices["Desktop Safari"],
				locale: "pl-PL",
				timezoneId: "Europe/Warsaw",
			},
		},

		// Mobile viewports for responsive testing
		{
			name: "Mobile Chrome",
			use: {
				...devices["Pixel 5"],
				locale: "pl-PL",
				timezoneId: "Europe/Warsaw",
			},
		},

		{
			name: "Mobile Safari",
			use: {
				...devices["iPhone 12"],
				locale: "pl-PL",
				timezoneId: "Europe/Warsaw",
			},
		},

		// Tablet viewports
		{
			name: "iPad",
			use: {
				...devices["iPad Pro"],
				locale: "pl-PL",
				timezoneId: "Europe/Warsaw",
			},
		},
	],

	// Run your local dev server before starting the tests
	webServer: {
		command: "pnpm dev",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
		stdout: "ignore",
		stderr: "pipe",
	},

	// Output folder for test artifacts
	outputDir: "test-results",
});
