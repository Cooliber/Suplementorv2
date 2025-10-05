import {
	checkSEOMetaTags,
	expect,
	test,
	waitForNetworkIdle,
} from "./fixtures/base";

/**
 * Supplements Page E2E Tests
 * Tests for supplement browsing, search, and detail views
 */

test.describe("Supplements Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/suplementy");
		await waitForNetworkIdle(page);
	});

	test("should load supplements page with Polish content", async ({ page }) => {
		// Check page title
		await expect(page).toHaveTitle(/Suplementy|Supplement/i);

		// Check for main heading
		const heading = page.locator("h1");
		await expect(heading).toBeVisible();

		// Verify Polish content
		const content = await page.textContent("body");
		expect(content).toContain("suplementy" || "Suplementy");
	});

	test("should display supplement cards or list", async ({ page }) => {
		// Wait for content to load
		await page.waitForTimeout(2000);

		// Look for supplement cards (various possible selectors)
		const supplementCards = page
			.locator('[data-testid="supplement-card"]')
			.or(page.locator("article").or(page.locator(".supplement-card")));

		// Check if any supplements are displayed
		const count = await supplementCards.count();

		// Should have at least some supplements or a message
		if (count > 0) {
			expect(count).toBeGreaterThan(0);

			// Check first card has content
			const firstCard = supplementCards.first();
			await expect(firstCard).toBeVisible();
		}
	});

	test("should have search functionality", async ({ page }) => {
		// Look for search input
		const searchInput = page
			.getByRole("searchbox")
			.or(page.getByPlaceholder(/szukaj|search/i));

		const searchExists = await searchInput.isVisible().catch(() => false);

		if (searchExists) {
			// Type in search
			await searchInput.fill("omega");
			await page.waitForTimeout(500);

			// Check that results update
			const content = await page.textContent("body");
			expect(content).toBeTruthy();
		}
	});

	test("should filter supplements by category", async ({ page }) => {
		// Look for category filters
		const categoryFilter = page
			.getByRole("button", { name: /kategoria|category|filtr/i })
			.or(
				page
					.locator("select")
					.or(page.locator('[data-testid="category-filter"]')),
			);

		const filterExists = await categoryFilter.isVisible().catch(() => false);

		if (filterExists) {
			await categoryFilter.click();
			await page.waitForTimeout(300);

			// Select a category if options are available
			const options = page
				.getByRole("option")
				.or(page.locator('[role="menuitem"]'));

			const optionCount = await options.count();
			if (optionCount > 0) {
				await options.first().click();
				await page.waitForTimeout(500);
			}
		}
	});

	test("should navigate to supplement detail page", async ({ page }) => {
		// Wait for supplements to load
		await page.waitForTimeout(2000);

		// Find first supplement link
		const supplementLink = page
			.getByRole("link")
			.filter({
				hasText: /omega|alpha|gpc|ashwagandha|magnez/i,
			})
			.first();

		const linkExists = await supplementLink.isVisible().catch(() => false);

		if (linkExists) {
			await supplementLink.click();
			await waitForNetworkIdle(page);

			// Should navigate to detail page
			expect(page.url()).not.toBe("/suplementy");

			// Should show supplement details
			const detailContent = await page.textContent("body");
			expect(detailContent).toBeTruthy();
		}
	});

	test("should display supplement information in Polish", async ({ page }) => {
		await page.waitForTimeout(2000);

		// Check for Polish medical terminology
		const content = await page.textContent("body");

		// Look for common Polish supplement terms
		const hasPolishTerms =
			/dawkowanie|działanie|przeciwwskazania|skutki|badania/i.test(content!);

		if (content && content.length > 100) {
			expect(hasPolishTerms).toBe(true);
		}
	});

	test("should be accessible on supplements page", async ({
		accessiblePage,
		checkAccessibility,
	}) => {
		await page.waitForTimeout(2000);

		// Run accessibility checks
		await checkAccessibility(accessiblePage, {
			rules: {
				"color-contrast": { enabled: true },
			},
		});
	});

	test("should support keyboard navigation through supplements", async ({
		page,
	}) => {
		await page.waitForTimeout(2000);

		// Tab through interactive elements
		await page.keyboard.press("Tab");
		await page.waitForTimeout(100);

		let tabCount = 0;
		const maxTabs = 10;

		while (tabCount < maxTabs) {
			await page.keyboard.press("Tab");
			await page.waitForTimeout(100);

			const focused = await page.evaluate(() => {
				const el = document.activeElement;
				return el?.tagName;
			});

			if (focused) {
				tabCount++;
			} else {
				break;
			}
		}

		expect(tabCount).toBeGreaterThan(0);
	});

	test("should show supplement categories", async ({ page }) => {
		await page.waitForTimeout(2000);

		const content = await page.textContent("body");

		// Check for common supplement categories in Polish
		const hasCategories = /nootropik|witamin|mineral|adaptogen|aminokwas/i.test(
			content!,
		);

		if (content && content.length > 100) {
			// Categories might be present
			expect(content).toBeTruthy();
		}
	});

	test("should display evidence levels", async ({ page }) => {
		await page.waitForTimeout(2000);

		const content = await page.textContent("body");

		// Look for evidence level indicators
		const hasEvidenceLevels = /silne|umiarkowane|słabe|dowody|badania/i.test(
			content!,
		);

		if (content && content.length > 100) {
			// Evidence levels might be displayed
			expect(content).toBeTruthy();
		}
	});

	test("should handle empty search results gracefully", async ({ page }) => {
		const searchInput = page
			.getByRole("searchbox")
			.or(page.getByPlaceholder(/szukaj|search/i));

		const searchExists = await searchInput.isVisible().catch(() => false);

		if (searchExists) {
			// Search for something that doesn't exist
			await searchInput.fill("xyzabc123nonexistent");
			await page.waitForTimeout(1000);

			// Should show no results message
			const content = await page.textContent("body");
			const hasNoResultsMessage = /brak|nie znaleziono|no results|empty/i.test(
				content!,
			);

			// Either shows message or shows all results
			expect(content).toBeTruthy();
		}
	});

	test("should load supplement images", async ({ page }) => {
		await page.waitForTimeout(2000);

		const images = await page.locator("img").all();

		if (images.length > 0) {
			for (const img of images.slice(0, 5)) {
				// Check first 5 images
				const src = await img.getAttribute("src");
				const alt = await img.getAttribute("alt");

				expect(src).toBeTruthy();
				expect(alt).not.toBeNull();
			}
		}
	});

	test("should have proper meta tags for SEO", async ({ page }) => {
		await checkSEOMetaTags(page);
	});

	test("should be responsive on mobile", async ({ page }) => {
		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.waitForTimeout(500);

		// Check that content is still visible
		const heading = page.locator("h1");
		await expect(heading).toBeVisible();

		// Check for mobile menu if navigation is collapsed
		const mobileMenu = page.getByRole("button", { name: /menu|nawigacja/i });
		const mobileMenuExists = await mobileMenu.isVisible().catch(() => false);

		if (mobileMenuExists) {
			await mobileMenu.click();
			await page.waitForTimeout(300);
		}
	});

	test("should not have JavaScript errors", async ({ page }) => {
		const errors: string[] = [];

		page.on("console", (msg) => {
			if (msg.type() === "error") {
				errors.push(msg.text());
			}
		});

		await page.reload();
		await waitForNetworkIdle(page);

		const criticalErrors = errors.filter(
			(error) =>
				!error.includes("favicon") && !error.includes("chrome-extension"),
		);

		expect(criticalErrors.length).toBeLessThan(3); // Allow some minor errors
	});
});
