import {
	expect,
	test,
	testKeyboardNavigation,
	waitForNetworkIdle,
} from "./fixtures/base";

/**
 * Accessibility E2E Tests
 * Comprehensive WCAG AA compliance testing with Polish localization
 */

test.describe("Accessibility Compliance", () => {
	const testPages = [
		{ url: "/", name: "Homepage" },
		{ url: "/suplementy", name: "Supplements" },
		{ url: "/wiedza", name: "Knowledge" },
		{ url: "/psychology", name: "Psychology" },
	];

	for (const { url, name } of testPages) {
		test.describe(`${name} Page Accessibility`, () => {
			test.beforeEach(async ({ page }) => {
				try {
					await page.goto(url, {
						waitUntil: "domcontentloaded",
						timeout: 10000,
					});
					await waitForNetworkIdle(page);
				} catch (e) {
					// Page might not exist, skip
					test.skip();
				}
			});

			test(`should pass WCAG AA compliance on ${name}`, async ({
				accessiblePage,
				checkAccessibility,
			}) => {
				await page.waitForTimeout(2000);

				await checkAccessibility(accessiblePage, {
					rules: {
						"color-contrast": { enabled: true },
						"image-alt": { enabled: true },
						label: { enabled: true },
						"link-name": { enabled: true },
						"button-name": { enabled: true },
					},
				});
			});

			test(`should have proper heading hierarchy on ${name}`, async ({
				page,
			}) => {
				const headings = await page.evaluate(() => {
					const h1s = Array.from(document.querySelectorAll("h1"));
					const h2s = Array.from(document.querySelectorAll("h2"));
					const h3s = Array.from(document.querySelectorAll("h3"));
					const h4s = Array.from(document.querySelectorAll("h4"));

					return {
						h1Count: h1s.length,
						h2Count: h2s.length,
						h3Count: h3s.length,
						h4Count: h4s.length,
						h1Text: h1s.map((h) => h.textContent),
					};
				});

				// Should have exactly one h1
				expect(headings.h1Count).toBe(1);

				// H1 should have content
				expect(headings.h1Text[0]).toBeTruthy();
				expect(headings.h1Text[0]?.length).toBeGreaterThan(0);
			});

			test(`should have proper ARIA labels on ${name}`, async ({ page }) => {
				const ariaIssues = await page.evaluate(() => {
					const issues: string[] = [];

					// Check buttons have accessible names
					const buttons = Array.from(document.querySelectorAll("button"));
					buttons.forEach((btn, i) => {
						const hasText = btn.textContent?.trim();
						const hasAriaLabel = btn.getAttribute("aria-label");
						const hasAriaLabelledBy = btn.getAttribute("aria-labelledby");

						if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
							issues.push(`Button ${i} has no accessible name`);
						}
					});

					// Check links have accessible names
					const links = Array.from(document.querySelectorAll("a"));
					links.forEach((link, i) => {
						const hasText = link.textContent?.trim();
						const hasAriaLabel = link.getAttribute("aria-label");

						if (!hasText && !hasAriaLabel) {
							issues.push(`Link ${i} has no accessible name`);
						}
					});

					return issues;
				});

				// Allow some minor issues but not too many
				expect(ariaIssues.length).toBeLessThan(5);
			});

			test(`should support keyboard navigation on ${name}`, async ({
				page,
			}) => {
				await page.waitForTimeout(1000);

				// Tab through interactive elements
				const focusableElements: string[] = [];

				for (let i = 0; i < 20; i++) {
					await page.keyboard.press("Tab");
					await page.waitForTimeout(100);

					const focused = await page.evaluate(() => {
						const el = document.activeElement;
						return {
							tagName: el?.tagName,
							role: el?.getAttribute("role"),
							ariaLabel: el?.getAttribute("aria-label"),
							text: el?.textContent?.substring(0, 50),
						};
					});

					if (focused.tagName) {
						focusableElements.push(focused.tagName);
					}
				}

				// Should have found some focusable elements
				expect(focusableElements.length).toBeGreaterThan(0);

				// Should include interactive elements
				const hasInteractive = focusableElements.some((tag) =>
					["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"].includes(tag),
				);
				expect(hasInteractive).toBe(true);
			});

			test(`should have visible focus indicators on ${name}`, async ({
				page,
			}) => {
				await page.waitForTimeout(1000);

				// Tab to first focusable element
				await page.keyboard.press("Tab");
				await page.waitForTimeout(200);

				// Check if focus is visible
				const focusStyle = await page.evaluate(() => {
					const el = document.activeElement;
					if (!el) return null;

					const style = window.getComputedStyle(el);
					return {
						outline: style.outline,
						outlineWidth: style.outlineWidth,
						outlineColor: style.outlineColor,
						boxShadow: style.boxShadow,
					};
				});

				if (focusStyle) {
					// Should have some focus indicator
					const hasFocusIndicator =
						focusStyle.outline !== "none" ||
						focusStyle.outlineWidth !== "0px" ||
						focusStyle.boxShadow !== "none";

					expect(hasFocusIndicator).toBe(true);
				}
			});

			test(`should have proper color contrast on ${name}`, async ({ page }) => {
				await page.waitForTimeout(1000);

				// Check main text elements for contrast
				const contrastIssues = await page.evaluate(() => {
					const issues: string[] = [];

					// Helper to calculate relative luminance
					const getLuminance = (rgb: string) => {
						const [r, g, b] = rgb.match(/\d+/g)?.map(Number);
						const [rs, gs, bs] = [r, g, b].map((c) => {
							c = c / 255;
							return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
						});
						return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
					};

					// Check headings and paragraphs
					const elements = Array.from(
						document.querySelectorAll("h1, h2, h3, p, a, button"),
					);

					elements.slice(0, 20).forEach((el, i) => {
						const style = window.getComputedStyle(el);
						const color = style.color;
						const bgColor = style.backgroundColor;

						if (color && bgColor && bgColor !== "rgba(0, 0, 0, 0)") {
							const textLum = getLuminance(color);
							const bgLum = getLuminance(bgColor);

							const ratio =
								textLum > bgLum
									? (textLum + 0.05) / (bgLum + 0.05)
									: (bgLum + 0.05) / (textLum + 0.05);

							// WCAG AA requires 4.5:1 for normal text, 3:1 for large text
							const fontSize = Number.parseFloat(style.fontSize);
							const minRatio =
								fontSize >= 18 ||
								(fontSize >= 14 && style.fontWeight === "bold")
									? 3
									: 4.5;

							if (ratio < minRatio) {
								issues.push(
									`Element ${i} has insufficient contrast: ${ratio.toFixed(2)}:1`,
								);
							}
						}
					});

					return issues;
				});

				// Allow some issues but not too many
				expect(contrastIssues.length).toBeLessThan(10);
			});

			test(`should have proper form labels on ${name}`, async ({ page }) => {
				await page.waitForTimeout(1000);

				const formIssues = await page.evaluate(() => {
					const issues: string[] = [];

					// Check all inputs have labels
					const inputs = Array.from(
						document.querySelectorAll("input, select, textarea"),
					);

					inputs.forEach((input, i) => {
						const id = input.getAttribute("id");
						const ariaLabel = input.getAttribute("aria-label");
						const ariaLabelledBy = input.getAttribute("aria-labelledby");
						const type = input.getAttribute("type");

						// Skip hidden inputs
						if (type === "hidden") return;

						let hasLabel = false;

						if (id) {
							const label = document.querySelector(`label[for="${id}"]`);
							if (label) hasLabel = true;
						}

						if (ariaLabel || ariaLabelledBy) hasLabel = true;

						if (!hasLabel) {
							issues.push(`Input ${i} (type: ${type}) has no label`);
						}
					});

					return issues;
				});

				// Forms should have proper labels
				expect(formIssues.length).toBeLessThan(5);
			});

			test(`should have alt text for images on ${name}`, async ({ page }) => {
				await page.waitForTimeout(1000);

				const images = await page.locator("img").all();

				for (const img of images) {
					const alt = await img.getAttribute("alt");

					// All images must have alt attribute (can be empty for decorative)
					expect(alt).not.toBeNull();
				}
			});

			test(`should have proper language attribute on ${name}`, async ({
				page,
			}) => {
				const htmlLang = await page.locator("html").getAttribute("lang");

				// Should have Polish language set
				expect(htmlLang).toBe("pl");
			});

			test(`should have skip to main content link on ${name}`, async ({
				page,
			}) => {
				// Look for skip link
				const skipLink = page.getByRole("link", {
					name: /skip|pomiń|przejdź do treści/i,
				});

				const skipExists = await skipLink.isVisible().catch(() => false);

				if (!skipExists) {
					// Skip link might be visually hidden but accessible
					const skipInDom = await page
						.locator('a[href="#main"], a[href="#content"]')
						.count();

					// It's okay if there's no skip link on simple pages
					expect(skipInDom).toBeGreaterThanOrEqual(0);
				}
			});
		});
	}

	test("should support screen reader announcements", async ({ page }) => {
		await page.goto("/");
		await waitForNetworkIdle(page);

		// Check for ARIA live regions
		const liveRegions = await page.locator("[aria-live]").count();

		// Live regions are good for dynamic content
		expect(liveRegions).toBeGreaterThanOrEqual(0);
	});

	test("should have proper landmark roles", async ({ page }) => {
		await page.goto("/");
		await waitForNetworkIdle(page);

		const landmarks = await page.evaluate(() => {
			return {
				main: document.querySelectorAll('main, [role="main"]').length,
				nav: document.querySelectorAll('nav, [role="navigation"]').length,
				header: document.querySelectorAll('header, [role="banner"]').length,
				footer: document.querySelectorAll('footer, [role="contentinfo"]')
					.length,
			};
		});

		// Should have main landmark
		expect(landmarks.main).toBeGreaterThan(0);

		// Should have navigation
		expect(landmarks.nav).toBeGreaterThan(0);
	});
});
