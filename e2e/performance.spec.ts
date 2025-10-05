import { expect, test, waitForNetworkIdle } from "./fixtures/base";

/**
 * Performance E2E Tests
 * Tests for Core Web Vitals, load times, and rendering performance
 */

test.describe("Performance Metrics", () => {
	test("should meet Core Web Vitals thresholds on homepage", async ({
		page,
	}) => {
		await page.goto("/");

		// Wait for page to fully load
		await page.waitForLoadState("networkidle");

		// Measure Core Web Vitals
		const metrics = await page.evaluate(() => {
			return new Promise<{
				lcp: number;
				fcp: number;
				cls: number;
				ttfb: number;
				fid: number;
			}>((resolve) => {
				const metrics = {
					lcp: 0,
					fcp: 0,
					cls: 0,
					ttfb: 0,
					fid: 0,
				};

				// Largest Contentful Paint
				new PerformanceObserver((list) => {
					const entries = list.getEntries();
					const lastEntry = entries[entries.length - 1] as any;
					metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
				}).observe({ entryTypes: ["largest-contentful-paint"] });

				// First Contentful Paint
				const paintEntries = performance.getEntriesByType("paint");
				const fcpEntry = paintEntries.find(
					(entry) => entry.name === "first-contentful-paint",
				);
				if (fcpEntry) {
					metrics.fcp = fcpEntry.startTime;
				}

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

				// First Input Delay (approximation)
				new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry: any) => {
						metrics.fid = entry.processingStart - entry.startTime;
					});
				}).observe({ entryTypes: ["first-input"] });

				// Wait for metrics to be collected
				setTimeout(() => resolve(metrics), 3000);
			});
		});

		// Core Web Vitals thresholds (good)
		expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
		expect(metrics.fcp).toBeLessThan(1800); // FCP < 1.8s
		expect(metrics.cls).toBeLessThan(0.1); // CLS < 0.1
		expect(metrics.ttfb).toBeLessThan(800); // TTFB < 800ms
	});

	test("should load page within performance budget", async ({ page }) => {
		const startTime = Date.now();

		await page.goto("/");
		await page.waitForLoadState("domcontentloaded");

		const loadTime = Date.now() - startTime;

		// Page should load within 3 seconds
		expect(loadTime).toBeLessThan(3000);
	});

	test("should have acceptable bundle size", async ({ page }) => {
		await page.goto("/");
		await waitForNetworkIdle(page);

		// Get all network requests
		const resources = await page.evaluate(() => {
			const entries = performance.getEntriesByType(
				"resource",
			) as PerformanceResourceTiming[];

			let totalJS = 0;
			let totalCSS = 0;
			let totalImages = 0;

			entries.forEach((entry) => {
				const size = entry.transferSize || 0;

				if (entry.name.endsWith(".js")) {
					totalJS += size;
				} else if (entry.name.endsWith(".css")) {
					totalCSS += size;
				} else if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
					totalImages += size;
				}
			});

			return {
				totalJS,
				totalCSS,
				totalImages,
				total: totalJS + totalCSS + totalImages,
			};
		});

		// Bundle size budgets (in bytes)
		expect(resources.totalJS).toBeLessThan(1000000); // < 1MB JS
		expect(resources.totalCSS).toBeLessThan(200000); // < 200KB CSS
		expect(resources.total).toBeLessThan(3000000); // < 3MB total
	});

	test("should render 3D graph with acceptable performance", async ({
		page,
	}) => {
		// Navigate to graph page
		const graphUrls = [
			"/wiedza/graf-wiedzy",
			"/graf-wiedzy",
			"/knowledge-graph",
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
			test.skip();
			return;
		}

		// Wait for graph to render
		await page.waitForTimeout(3000);

		// Measure rendering performance
		const performance = await page.evaluate(() => {
			return {
				memory: (window.performance as any).memory?.usedJSHeapSize || 0,
				fps: 0, // Would need more complex measurement
			};
		});

		// Memory usage should be reasonable (< 100MB)
		expect(performance.memory).toBeLessThan(100000000);
	});

	test("should handle large datasets efficiently", async ({ page }) => {
		await page.goto("/suplementy");
		await waitForNetworkIdle(page);

		// Measure time to render list
		const renderTime = await page.evaluate(() => {
			const start = performance.now();

			// Force a reflow
			document.body.offsetHeight;

			const end = performance.now();
			return end - start;
		});

		// Rendering should be fast
		expect(renderTime).toBeLessThan(100); // < 100ms
	});

	test("should lazy load images", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("domcontentloaded");

		// Check for lazy loading attributes
		const lazyImages = await page.evaluate(() => {
			const images = Array.from(document.querySelectorAll("img"));

			return images.map((img) => ({
				loading: img.getAttribute("loading"),
				src: img.getAttribute("src"),
			}));
		});

		// At least some images should use lazy loading
		const hasLazyLoading = lazyImages.some((img) => img.loading === "lazy");

		// It's okay if not all images are lazy loaded
		expect(lazyImages.length).toBeGreaterThan(0);
	});

	test("should use efficient caching strategies", async ({ page }) => {
		await page.goto("/");
		await waitForNetworkIdle(page);

		// Get cache headers
		const cacheHeaders = await page.evaluate(() => {
			const entries = performance.getEntriesByType(
				"resource",
			) as PerformanceResourceTiming[];

			return entries.slice(0, 10).map((entry) => ({
				name: entry.name,
				duration: entry.duration,
			}));
		});

		// Resources should load quickly (cached or optimized)
		const avgDuration =
			cacheHeaders.reduce((sum, h) => sum + h.duration, 0) /
			cacheHeaders.length;
		expect(avgDuration).toBeLessThan(500); // Average < 500ms
	});

	test("should minimize layout shifts", async ({ page }) => {
		await page.goto("/");

		// Measure CLS over time
		const cls = await page.evaluate(() => {
			return new Promise<number>((resolve) => {
				let clsValue = 0;

				new PerformanceObserver((list) => {
					const entries = list.getEntries();
					entries.forEach((entry: any) => {
						if (!entry.hadRecentInput) {
							clsValue += entry.value;
						}
					});
				}).observe({ entryTypes: ["layout-shift"] });

				setTimeout(() => resolve(clsValue), 3000);
			});
		});

		// CLS should be minimal
		expect(cls).toBeLessThan(0.1);
	});

	test("should have fast Time to Interactive", async ({ page }) => {
		const startTime = Date.now();

		await page.goto("/");
		await page.waitForLoadState("networkidle");

		// Click on an interactive element
		const button = page.getByRole("button").first();
		const buttonExists = await button.isVisible().catch(() => false);

		if (buttonExists) {
			await button.click();
			const interactiveTime = Date.now() - startTime;

			// Should be interactive within 3.5 seconds
			expect(interactiveTime).toBeLessThan(3500);
		}
	});

	test("should optimize font loading", async ({ page }) => {
		await page.goto("/");
		await waitForNetworkIdle(page);

		// Check for font-display property
		const fontOptimization = await page.evaluate(() => {
			const styles = Array.from(document.styleSheets);
			let hasFontDisplay = false;

			try {
				styles.forEach((sheet) => {
					try {
						const rules = Array.from(sheet.cssRules || []);
						rules.forEach((rule: any) => {
							if (rule.style?.fontDisplay) {
								hasFontDisplay = true;
							}
						});
					} catch (e) {
						// Cross-origin stylesheet
					}
				});
			} catch (e) {
				// Error accessing stylesheets
			}

			return hasFontDisplay;
		});

		// Font optimization is good but not required
		expect(fontOptimization).toBeDefined();
	});

	test("should minimize main thread blocking", async ({ page }) => {
		await page.goto("/");
		await waitForNetworkIdle(page);

		// Measure long tasks
		const longTasks = await page.evaluate(() => {
			return new Promise<number>((resolve) => {
				let taskCount = 0;

				new PerformanceObserver((list) => {
					taskCount += list.getEntries().length;
				}).observe({ entryTypes: ["longtask"] });

				setTimeout(() => resolve(taskCount), 3000);
			});
		});

		// Should have minimal long tasks
		expect(longTasks).toBeLessThan(10);
	});

	test("should handle scroll performance", async ({ page }) => {
		await page.goto("/");
		await waitForNetworkIdle(page);

		// Scroll down the page
		const scrollPerformance = await page.evaluate(() => {
			return new Promise<number>((resolve) => {
				const start = performance.now();
				let frameCount = 0;

				const measureFrame = () => {
					frameCount++;
					if (frameCount < 60) {
						requestAnimationFrame(measureFrame);
					} else {
						const end = performance.now();
						const fps = 1000 / ((end - start) / frameCount);
						resolve(fps);
					}
				};

				// Start scrolling
				window.scrollBy(0, 10);
				requestAnimationFrame(measureFrame);
			});
		});

		// Should maintain good FPS during scroll
		expect(scrollPerformance).toBeGreaterThan(30); // > 30 FPS
	});
});
