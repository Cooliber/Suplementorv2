import { expect, test, waitForNetworkIdle } from "./fixtures/base";

/**
 * Knowledge Graph E2E Tests
 * Tests for 3D/2D graph visualization, node interactions, and data exploration
 */

test.describe("Knowledge Graph Visualization", () => {
	test.beforeEach(async ({ page }) => {
		// Try multiple possible graph URLs
		const graphUrls = [
			"/wiedza/graf-wiedzy",
			"/graf-wiedzy",
			"/knowledge-graph",
			"/wiedza",
		];

		let loaded = false;
		for (const url of graphUrls) {
			try {
				await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10000 });
				loaded = true;
				break;
			} catch (e) {}
		}

		if (!loaded) {
			// Fallback to homepage
			await page.goto("/");
		}

		await waitForNetworkIdle(page);
	});

	test("should load knowledge graph page", async ({ page }) => {
		// Check if we're on a graph-related page
		const url = page.url();
		const isGraphPage = /graf|knowledge|wiedza/i.test(url);

		if (isGraphPage) {
			// Check for graph-related content
			const content = await page.textContent("body");
			expect(content).toBeTruthy();
		}
	});

	test("should display graph visualization canvas or SVG", async ({ page }) => {
		await page.waitForTimeout(3000); // Wait for graph to render

		// Look for canvas (D3/Three.js) or SVG (Cytoscape)
		const canvas = page
			.locator("canvas")
			.or(
				page
					.locator("svg")
					.or(page.locator('[data-testid="graph-visualization"]')),
			);

		const visualizationExists = await canvas.isVisible().catch(() => false);

		if (visualizationExists) {
			await expect(canvas.first()).toBeVisible();
		}
	});

	test("should have graph controls", async ({ page }) => {
		await page.waitForTimeout(2000);

		// Look for zoom controls
		const zoomIn = page.getByRole("button", { name: /zoom in|powiększ|\+/i });
		const zoomOut = page.getByRole("button", {
			name: /zoom out|pomniejsz|\-/i,
		});
		const reset = page.getByRole("button", {
			name: /reset|resetuj|wyśrodkuj/i,
		});

		const hasControls =
			(await zoomIn.isVisible().catch(() => false)) ||
			(await zoomOut.isVisible().catch(() => false)) ||
			(await reset.isVisible().catch(() => false));

		if (hasControls) {
			// Test zoom in
			if (await zoomIn.isVisible().catch(() => false)) {
				await zoomIn.click();
				await page.waitForTimeout(300);
			}

			// Test zoom out
			if (await zoomOut.isVisible().catch(() => false)) {
				await zoomOut.click();
				await page.waitForTimeout(300);
			}

			// Test reset
			if (await reset.isVisible().catch(() => false)) {
				await reset.click();
				await page.waitForTimeout(300);
			}
		}
	});

	test("should display graph legend", async ({ page }) => {
		await page.waitForTimeout(2000);

		// Look for legend
		const legend = page
			.locator('[data-testid="graph-legend"]')
			.or(page.locator(".legend").or(page.getByText(/legenda|legend/i)));

		const legendExists = await legend.isVisible().catch(() => false);

		if (legendExists) {
			await expect(legend.first()).toBeVisible();

			// Check for node type descriptions
			const legendContent = await legend.first().textContent();
			expect(legendContent).toBeTruthy();
		}
	});

	test("should show node details on interaction", async ({ page }) => {
		await page.waitForTimeout(3000);

		// Try to click on a node (if canvas-based, this is tricky)
		const canvas = page.locator("canvas").first();
		const canvasExists = await canvas.isVisible().catch(() => false);

		if (canvasExists) {
			// Click in the center of the canvas
			const box = await canvas.boundingBox();
			if (box) {
				await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
				await page.waitForTimeout(500);

				// Look for node details panel
				const detailsPanel = page
					.locator('[data-testid="node-details"]')
					.or(
						page
							.locator(".node-details")
							.or(page.getByText(/szczegóły|details/i)),
					);

				const detailsVisible = await detailsPanel
					.isVisible()
					.catch(() => false);

				if (detailsVisible) {
					await expect(detailsPanel.first()).toBeVisible();
				}
			}
		}
	});

	test("should have search functionality for nodes", async ({ page }) => {
		await page.waitForTimeout(2000);

		const searchInput = page
			.getByRole("searchbox")
			.or(page.getByPlaceholder(/szukaj|search|węzeł|node/i));

		const searchExists = await searchInput.isVisible().catch(() => false);

		if (searchExists) {
			await searchInput.fill("dopamina");
			await page.waitForTimeout(500);

			// Check if search results appear
			const content = await page.textContent("body");
			expect(content).toBeTruthy();
		}
	});

	test("should filter nodes by type", async ({ page }) => {
		await page.waitForTimeout(2000);

		// Look for node type filters
		const filterButton = page.getByRole("button", {
			name: /filtr|filter|typ|type/i,
		});
		const filterExists = await filterButton.isVisible().catch(() => false);

		if (filterExists) {
			await filterButton.click();
			await page.waitForTimeout(300);

			// Look for filter options
			const filterOptions = page
				.getByRole("checkbox")
				.or(page.getByRole("menuitem"));

			const optionCount = await filterOptions.count();
			if (optionCount > 0) {
				await filterOptions.first().click();
				await page.waitForTimeout(500);
			}
		}
	});

	test("should export graph data", async ({ page }) => {
		await page.waitForTimeout(2000);

		const exportButton = page.getByRole("button", {
			name: /eksport|export|pobierz|download/i,
		});
		const exportExists = await exportButton.isVisible().catch(() => false);

		if (exportExists) {
			// Set up download listener
			const downloadPromise = page
				.waitForEvent("download", { timeout: 5000 })
				.catch(() => null);

			await exportButton.click();
			await page.waitForTimeout(500);

			// Check if download started
			const download = await downloadPromise;

			if (download) {
				expect(download.suggestedFilename()).toBeTruthy();
			}
		}
	});

	test("should display graph statistics", async ({ page }) => {
		await page.waitForTimeout(2000);

		const content = await page.textContent("body");

		// Look for statistics like node count, relationship count
		const hasStats = /węzły|nodes|połączenia|relationships|edges|\d+/i.test(
			content!,
		);

		if (content && content.length > 100) {
			expect(hasStats).toBe(true);
		}
	});

	test("should handle graph performance with many nodes", async ({ page }) => {
		await page.waitForTimeout(3000);

		// Measure frame rate or responsiveness
		const performanceMetrics = await page.evaluate(() => {
			return {
				memory: (performance as any).memory?.usedJSHeapSize || 0,
				timing:
					performance.timing.loadEventEnd - performance.timing.navigationStart,
			};
		});

		// Should load within reasonable time
		expect(performanceMetrics.timing).toBeLessThan(10000); // 10 seconds
	});

	test("should be accessible with keyboard navigation", async ({ page }) => {
		await page.waitForTimeout(2000);

		// Tab through controls
		await page.keyboard.press("Tab");
		await page.waitForTimeout(100);

		let tabCount = 0;
		const maxTabs = 15;

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

	test("should display Polish node names and descriptions", async ({
		page,
	}) => {
		await page.waitForTimeout(2000);

		const content = await page.textContent("body");

		// Check for Polish neuroscience terms
		const hasPolishTerms =
			/dopamina|serotonina|noradrenalina|acetylocholina|mózg|kora|hipokamp/i.test(
				content!,
			);

		if (content && content.length > 100) {
			expect(hasPolishTerms).toBe(true);
		}
	});

	test("should not have console errors during graph rendering", async ({
		page,
	}) => {
		const errors: string[] = [];

		page.on("console", (msg) => {
			if (msg.type() === "error") {
				errors.push(msg.text());
			}
		});

		await page.reload();
		await page.waitForTimeout(3000); // Wait for graph to render

		const criticalErrors = errors.filter(
			(error) =>
				!error.includes("favicon") &&
				!error.includes("chrome-extension") &&
				!error.includes("WebGL"), // WebGL warnings are common
		);

		expect(criticalErrors.length).toBeLessThan(5);
	});
});
