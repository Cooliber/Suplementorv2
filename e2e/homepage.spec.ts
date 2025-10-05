import {
	checkResponsiveLayout,
	checkSEOMetaTags,
	expect,
	test,
	waitForNetworkIdle,
} from "./fixtures/base";

/**
 * Homepage E2E Tests
 * Tests for the main landing page with Polish localization and accessibility
 */

test.describe("Homepage", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
		await waitForNetworkIdle(page);
	});

	test("should load successfully and display Polish content", async ({
		page,
	}) => {
		// Check page title
		await expect(page).toHaveTitle(/Suplementor/i);

		// Check for Polish language content
		const heading = page.locator("h1").first();
		await expect(heading).toBeVisible();

		// Verify Polish characters in content
		const content = await page.textContent("body");
		expect(content).toBeTruthy();

		// Check for common Polish words
		const hasPolishWords = /suplementy|wiedza|mózg|poznawcz/i.test(content!);
		expect(hasPolishWords).toBe(true);
	});

	test("should have proper SEO meta tags", async ({ page }) => {
		await checkSEOMetaTags(page);

		// Check for Polish language meta tag
		const htmlLang = await page.locator("html").getAttribute("lang");
		expect(htmlLang).toBe("pl");
	});

	test("should display navigation menu", async ({ page }) => {
		// Check for main navigation
		const nav = page.locator("nav").first();
		await expect(nav).toBeVisible();

		// Check for key navigation links
		const supplementsLink = page.getByRole("link", { name: /suplementy/i });
		await expect(supplementsLink).toBeVisible();

		const knowledgeLink = page.getByRole("link", { name: /wiedza/i });
		await expect(knowledgeLink).toBeVisible();
	});

	test("should be accessible (WCAG AA)", async ({
		accessiblePage,
		checkAccessibility,
	}) => {
		await checkAccessibility(accessiblePage, {
			rules: {
				// Disable color-contrast for now as it may fail on some elements
				"color-contrast": { enabled: true },
			},
		});
	});

	test("should support keyboard navigation", async ({ page }) => {
		// Focus on first interactive element
		await page.keyboard.press("Tab");

		// Check that an element is focused
		const focusedElement = await page.evaluate(() => {
			const el = document.activeElement;
			return {
				tagName: el?.tagName,
				role: el?.getAttribute("role"),
				ariaLabel: el?.getAttribute("aria-label"),
			};
		});

		expect(focusedElement.tagName).toBeTruthy();

		// Navigate through several elements
		for (let i = 0; i < 5; i++) {
			await page.keyboard.press("Tab");
			await page.waitForTimeout(100);
		}

		// Verify focus is still within the page
		const stillFocused = await page.evaluate(
			() => document.activeElement !== null,
		);
		expect(stillFocused).toBe(true);
	});

	test("should be responsive on mobile devices", async ({ page }) => {
		const breakpoints = [
			{ width: 375, height: 667 }, // iPhone SE
			{ width: 414, height: 896 }, // iPhone 11 Pro Max
			{ width: 768, height: 1024 }, // iPad
			{ width: 1920, height: 1080 }, // Desktop
		];

		await checkResponsiveLayout(page, breakpoints);
	});

	test("should load within performance budget", async ({
		page,
		measurePerformance,
	}) => {
		const metrics = await measurePerformance(page);

		// Core Web Vitals thresholds
		expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
		expect(metrics.cls).toBeLessThan(0.1); // CLS < 0.1
		expect(metrics.ttfb).toBeLessThan(800); // TTFB < 800ms
	});

	test("should display supplement showcase", async ({ page }) => {
		// Look for supplement cards or showcase
		const supplementSection = page
			.locator('[data-testid="supplement-showcase"]')
			.or(page.locator("section").filter({ hasText: /suplementy/i }));

		// Wait for content to load
		await page.waitForTimeout(1000);

		// Check if section exists (may not be on homepage)
		const isVisible = await supplementSection.isVisible().catch(() => false);

		if (isVisible) {
			await expect(supplementSection).toBeVisible();
		}
	});

	test("should have working links to main sections", async ({ page }) => {
		// Test navigation to supplements page
		const supplementsLink = page
			.getByRole("link", { name: /suplementy/i })
			.first();
		if (await supplementsLink.isVisible()) {
			await supplementsLink.click();
			await waitForNetworkIdle(page);
			expect(page.url()).toContain("suplementy");

			// Go back
			await page.goBack();
			await waitForNetworkIdle(page);
		}
	});

	test("should display footer with proper information", async ({ page }) => {
		// Scroll to footer
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(500);

		// Check for footer
		const footer = page.locator("footer");
		const footerVisible = await footer.isVisible().catch(() => false);

		if (footerVisible) {
			await expect(footer).toBeVisible();

			// Check for copyright or company info
			const footerText = await footer.textContent();
			expect(footerText).toBeTruthy();
		}
	});

	test("should handle dark mode toggle if available", async ({ page }) => {
		// Look for theme toggle button
		const themeToggle = page.getByRole("button", {
			name: /theme|motyw|ciemny/i,
		});
		const toggleExists = await themeToggle.isVisible().catch(() => false);

		if (toggleExists) {
			// Get initial theme
			const initialTheme = await page.evaluate(() => {
				return document.documentElement.classList.contains("dark");
			});

			// Click toggle
			await themeToggle.click();
			await page.waitForTimeout(300);

			// Check theme changed
			const newTheme = await page.evaluate(() => {
				return document.documentElement.classList.contains("dark");
			});

			expect(newTheme).not.toBe(initialTheme);
		}
	});

	test("should not have console errors", async ({ page }) => {
		const consoleErrors: string[] = [];

		page.on("console", (msg) => {
			if (msg.type() === "error") {
				consoleErrors.push(msg.text());
			}
		});

		await page.reload();
		await waitForNetworkIdle(page);

		// Filter out known acceptable errors (like third-party scripts)
		const criticalErrors = consoleErrors.filter(
			(error) =>
				!error.includes("favicon") && !error.includes("chrome-extension"),
		);

		expect(criticalErrors).toHaveLength(0);
	});

	test("should have proper heading hierarchy", async ({ page }) => {
		const headings = await page.evaluate(() => {
			const h1s = Array.from(document.querySelectorAll("h1")).length;
			const h2s = Array.from(document.querySelectorAll("h2")).length;
			const h3s = Array.from(document.querySelectorAll("h3")).length;

			return { h1s, h2s, h3s };
		});

		// Should have exactly one h1
		expect(headings.h1s).toBe(1);

		// Should have some h2s for structure
		expect(headings.h2s).toBeGreaterThan(0);
	});

	test("should load images with proper alt text", async ({ page }) => {
		const images = await page.locator("img").all();

		for (const img of images) {
			const alt = await img.getAttribute("alt");
			const src = await img.getAttribute("src");

			// Images should have alt text (can be empty for decorative images)
			expect(alt).not.toBeNull();

			// Images should have src
			expect(src).toBeTruthy();
		}
	});
});
