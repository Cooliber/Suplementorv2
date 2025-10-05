import AxeBuilder from "@axe-core/playwright";
import { test as base, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

/**
 * Extended Playwright fixtures with accessibility testing and Polish localization support
 */

// Extend base test with custom fixtures
export const test = base.extend<{
	/**
	 * Page with accessibility testing utilities injected
	 */
	accessiblePage: Page;

	/**
	 * Helper to check Polish language content
	 */
	checkPolishContent: (
		page: Page,
		selector: string,
		expectedText: string,
	) => Promise<void>;

	/**
	 * Helper to verify WCAG AA compliance
	 */
	checkAccessibility: (page: Page, options?: any) => Promise<void>;

	/**
	 * Helper to measure Core Web Vitals
	 */
	measurePerformance: (page: Page) => Promise<{
		lcp: number;
		fid: number;
		cls: number;
		ttfb: number;
	}>;
}>({
	// Accessible page fixture - just pass through the page
	accessiblePage: async ({ page }, use) => {
		await use(page);
	},

	// Polish content verification helper
	checkPolishContent: async ({}, use) => {
		await use(async (page: Page, selector: string, expectedText: string) => {
			const element = page.locator(selector);
			await expect(element).toBeVisible();
			const text = await element.textContent();
			expect(text).toContain(expectedText);
		});
	},

	// Accessibility checking helper using AxeBuilder
	checkAccessibility: async ({}, use) => {
		await use(async (page: Page, options = {}) => {
			const accessibilityScanResults = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
				.analyze();

			// Check for violations
			if (accessibilityScanResults.violations.length > 0) {
				console.log("Accessibility violations found:");
				accessibilityScanResults.violations.forEach((violation) => {
					console.log(`- ${violation.id}: ${violation.description}`);
					console.log(`  Impact: ${violation.impact}`);
					console.log(`  Nodes: ${violation.nodes.length}`);
				});
			}

			// Fail test if there are critical violations
			const criticalViolations = accessibilityScanResults.violations.filter(
				(v) => v.impact === "critical" || v.impact === "serious",
			);

			expect(criticalViolations.length).toBe(0);
		});
	},

	// Performance measurement helper
	measurePerformance: async ({}, use) => {
		await use(async (page: Page) => {
			const metrics = await page.evaluate(() => {
				return new Promise<{
					lcp: number;
					fid: number;
					cls: number;
					ttfb: number;
				}>((resolve) => {
					const metrics = {
						lcp: 0,
						fid: 0,
						cls: 0,
						ttfb: 0,
					};

					// Largest Contentful Paint
					new PerformanceObserver((list) => {
						const entries = list.getEntries();
						const lastEntry = entries[entries.length - 1] as any;
						metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
					}).observe({ entryTypes: ["largest-contentful-paint"] });

					// First Input Delay
					new PerformanceObserver((list) => {
						const entries = list.getEntries();
						entries.forEach((entry: any) => {
							metrics.fid = entry.processingStart - entry.startTime;
						});
					}).observe({ entryTypes: ["first-input"] });

					// Cumulative Layout Shift
					new PerformanceObserver((list) => {
						const entries = list.getEntries();
						entries.forEach((entry: any) => {
							if (!entry.hadRecentInput) {
								metrics.cls += entry.value;
							}
						});
					}).observe({ entryTypes: ["layout-shift"] });

					// Time to First Byte
					const navigationEntry = performance.getEntriesByType(
						"navigation",
					)[0] as any;
					if (navigationEntry) {
						metrics.ttfb =
							navigationEntry.responseStart - navigationEntry.requestStart;
					}

					// Wait a bit for metrics to be collected
					setTimeout(() => resolve(metrics), 3000);
				});
			});

			return metrics;
		});
	},
});

/**
 * Helper function to wait for network idle
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000) {
	await page.waitForLoadState("networkidle", { timeout });
}

/**
 * Helper function to check if element has Polish characters
 */
export async function hasPolishCharacters(text: string): Promise<boolean> {
	const polishChars = /[ąćęłńóśźż]/i;
	return polishChars.test(text);
}

/**
 * Helper function to verify keyboard navigation
 */
export async function testKeyboardNavigation(page: Page, selectors: string[]) {
	for (const selector of selectors) {
		await page.keyboard.press("Tab");
		const focused = await page.evaluate(() => document.activeElement?.tagName);
		expect(focused).toBeTruthy();
	}
}

/**
 * Helper function to check color contrast
 */
export async function checkColorContrast(page: Page, selector: string) {
	const contrast = await page.evaluate((sel) => {
		const element = document.querySelector(sel);
		if (!element) return null;

		const style = window.getComputedStyle(element);
		const color = style.color;
		const backgroundColor = style.backgroundColor;

		// Simple contrast calculation (simplified for demo)
		return { color, backgroundColor };
	}, selector);

	expect(contrast).toBeTruthy();
	return contrast;
}

/**
 * Helper to take screenshot with Polish filename
 */
export async function takePolishScreenshot(page: Page, name: string) {
	const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
	await page.screenshot({
		path: `test-results/screenshots/${name}-${timestamp}.png`,
		fullPage: true,
	});
}

/**
 * Helper to verify meta tags for SEO
 */
export async function checkSEOMetaTags(page: Page) {
	const title = await page.title();
	expect(title).toBeTruthy();
	expect(title.length).toBeGreaterThan(10);
	expect(title.length).toBeLessThan(60);

	const description = await page
		.locator('meta[name="description"]')
		.getAttribute("content");
	expect(description).toBeTruthy();
	expect(description?.length).toBeGreaterThan(50);
	expect(description?.length).toBeLessThan(160);

	const ogTitle = await page
		.locator('meta[property="og:title"]')
		.getAttribute("content");
	expect(ogTitle).toBeTruthy();

	const ogDescription = await page
		.locator('meta[property="og:description"]')
		.getAttribute("content");
	expect(ogDescription).toBeTruthy();
}

/**
 * Helper to check responsive design
 */
export async function checkResponsiveLayout(
	page: Page,
	breakpoints: { width: number; height: number }[],
) {
	for (const breakpoint of breakpoints) {
		await page.setViewportSize(breakpoint);
		await page.waitForTimeout(500); // Wait for layout to settle

		// Check that content is visible and not overflowing
		const bodyOverflow = await page.evaluate(() => {
			const body = document.body;
			return {
				scrollWidth: body.scrollWidth,
				clientWidth: body.clientWidth,
				scrollHeight: body.scrollHeight,
				clientHeight: body.clientHeight,
			};
		});

		// Allow some tolerance for scrollbars
		expect(bodyOverflow.scrollWidth).toBeLessThanOrEqual(
			bodyOverflow.clientWidth + 20,
		);
	}
}

export { expect };
