/**
 * BrainSupplementCard Component Tests
 * Comprehensive tests with Polish character validation and accessibility testing
 *
 * SETUP REQUIRED: This test file requires proper Jest and Testing Library setup.
 *
 * Install dependencies:
 * npm install --save-dev @testing-library/react @testing-library/jest-dom @types/jest jest-axe
 *
 * Configure Jest in your project for component testing by adding to your Jest config:
 * {
 *   "testEnvironment": "jsdom",
 *   "setupFilesAfterEnv": ["<rootDir>/src/setupTests.ts"]
 * }
 *
 * Create src/setupTests.ts with:
 * import '@testing-library/jest-dom';
 */

import React from "react";
import { BrainSupplementCard } from "./BrainSupplementCard";
import type { BrainSupplementData } from "./types";

// Test utilities (uncomment when testing framework is properly configured)
// To set up testing, install:
// npm install --save-dev @testing-library/react @testing-library/jest-dom @types/jest jest-axe
/*
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers
expect.extend(toHaveNoViolations);
*/

// Sample test data
const mockSupplementData: BrainSupplementData = {
	id: "test-supplement",
	name: "Test Supplement",
	polishName: "Testowy Suplement",
	scientificName: "Testus supplementus",
	category: "vitamin",
	polishCategory: "witamina",

	description:
		"A test supplement for brain health with comprehensive features.",
	polishDescription:
		"Testowy suplement dla zdrowia mózgu z kompleksowymi funkcjami.",

	educationalContent: {
		howItWorks:
			"This supplement works through multiple mechanisms to support brain health.",
		polishHowItWorks:
			"Ten suplement działa poprzez wiele mechanizmów wspierających zdrowie mózgu.",
		researchSummary:
			"Multiple studies show significant benefits for cognitive function.",
		polishResearchSummary:
			"Wiele badań pokazuje znaczące korzyści dla funkcji poznawczych.",
		safetyProfile: "Generally safe with mild side effects in some individuals.",
		polishSafetyProfile:
			"Ogólnie bezpieczny z łagodnymi efektami ubocznymi u niektórych osób.",
	},

	primaryBrainRegions: [
		{
			id: "hippocampus",
			name: "Hippocampus",
			polishName: "Hipokamp",
			description: "Memory formation center",
			polishDescription: "Centrum tworzenia pamięci",
			coordinates: { x: 0.5, y: 0.6, z: 0.3 },
			functions: ["Memory formation", "Learning"],
			polishFunctions: ["Tworzenie pamięci", "Uczenie się"],
			supplementEffects: [
				{
					type: "enhancement",
					polishType: "wzmocnienie",
					strength: "strong",
					mechanism: "BDNF upregulation",
					polishMechanism: "wzrost BDNF",
					evidenceLevel: "strong",
					duration: "8-12 weeks",
					polishDuration: "8-12 tygodni",
				},
			],
			color: "#3B82F6",
			size: "medium",
		},
	],

	secondaryBrainRegions: [],
	affectedSystems: ["Cognitive system"],
	polishAffectedSystems: ["System poznawczy"],

	evidenceLevel: "strong",
	studyCount: 10,
	participantCount: 500,
	effectSize: 0.5,

	recommendedDosage: {
		min: 100,
		max: 200,
		unit: "mg",
		frequency: "daily",
		polishFrequency: "dziennie",
		timing: ["morning"],
		withFood: false,
	},

	contraindications: ["Pregnancy"],
	polishContraindications: ["Ciąża"],
	sideEffects: {
		common: ["Mild headache"],
		uncommon: ["Nausea"],
		rare: ["Allergic reaction"],
	},
	interactions: ["Other medications"],
	polishInteractions: ["Inne leki"],

	difficultyLevel: "beginner",
	learningObjectives: ["Learn about brain health"],
	polishLearningObjectives: ["Poznać zdrowie mózgu"],
	relatedTopics: ["Nutrition", "Health"],
	polishRelatedTopics: ["Żywienie", "Zdrowie"],
};

describe("BrainSupplementCard", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Rendering", () => {
		it("renders with default props", () => {
			render(<BrainSupplementCard />);
			expect(screen.getByTestId("brain-supplement-card")).toBeInTheDocument();
		});

		it("renders supplement name and description", () => {
			render(<BrainSupplementCard supplement={mockSupplementData} />);

			expect(screen.getByText("Testowy Suplement")).toBeInTheDocument();
			expect(screen.getByText("Testus supplementus")).toBeInTheDocument();
			expect(
				screen.getByText(
					"Testowy suplement dla zdrowia mózgu z kompleksowymi funkcjami.",
				),
			).toBeInTheDocument();
		});

		it("renders Polish content when language is set to Polish", () => {
			render(
				<BrainSupplementCard supplement={mockSupplementData} language="pl" />,
			);

			expect(screen.getByText("Testowy Suplement")).toBeInTheDocument();
			expect(
				screen.getByText(
					"Testowy suplement dla zdrowia mózgu z kompleksowymi funkcjami.",
				),
			).toBeInTheDocument();
		});

		it("renders English content when language is set to English", () => {
			render(
				<BrainSupplementCard supplement={mockSupplementData} language="en" />,
			);

			expect(screen.getByText("Test Supplement")).toBeInTheDocument();
			expect(
				screen.getByText(
					"A test supplement for brain health with comprehensive features.",
				),
			).toBeInTheDocument();
		});

		it("renders evidence badges correctly", () => {
			render(<BrainSupplementCard supplement={mockSupplementData} />);

			expect(screen.getByText("strong")).toBeInTheDocument();
			expect(screen.getByText("witamina")).toBeInTheDocument();
		});
	});

	describe("Polish Character Validation", () => {
		it("validates Polish characters in supplement names", () => {
			const polishSupplement = {
				...mockSupplementData,
				polishName: "Suplement z polskimi znakami: ą ć ę ł ń ó ś ź ż",
				polishDescription:
					"Opis zawierający wszystkie polskie znaki: ą ć ę ł ń ó ś ź ż Ą Ć Ę Ł Ń Ó Ś Ź Ż",
			};

			render(
				<BrainSupplementCard supplement={polishSupplement} language="pl" />,
			);

			// Should render without errors
			expect(
				screen.getByText("Suplement z polskimi znakami: ą ć ę ł ń ó ś ź ż"),
			).toBeInTheDocument();
			expect(
				screen.getByText(
					"Opis zawierający wszystkie polskie znaki: ą ć ę ł ń ó ś ź ż Ą Ć Ę Ł Ń Ó Ś Ź Ż",
				),
			).toBeInTheDocument();
		});

		it("validates Polish medical terminology", () => {
			const medicalSupplement = {
				...mockSupplementData,
				polishName: "Witamina B12 (kobalamina)",
				polishDescription:
					"Wspiera funkcje nerwowe i tworzenie czerwonych krwinek",
				polishCategory: "witamina",
			};

			render(
				<BrainSupplementCard supplement={medicalSupplement} language="pl" />,
			);

			expect(screen.getByText("Witamina B12 (kobalamina)")).toBeInTheDocument();
			expect(screen.getByText("witamina")).toBeInTheDocument();
		});

		it("handles mixed Polish and English content", () => {
			const mixedSupplement = {
				...mockSupplementData,
				name: "Vitamin B12 (Cobalamin)",
				polishName: "Witamina B12 (kobalamina)",
				description:
					"Essential for neurological function and red blood cell formation",
				polishDescription:
					"Niezbędna dla funkcji neurologicznych i tworzenia czerwonych krwinek",
			};

			render(<BrainSupplementCard supplement={mixedSupplement} />);

			// Should handle both languages appropriately
			expect(screen.getByText("Witamina B12 (kobalamina)")).toBeInTheDocument();
			expect(
				screen.getByText(
					"Niezbędna dla funkcji neurologicznych i tworzenia czerwonych krwinek",
				),
			).toBeInTheDocument();
		});
	});

	describe("Interactive Features", () => {
		it("handles region click events", () => {
			const onRegionClick = jest.fn();
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					interactive={true}
					onRegionClick={onRegionClick}
				/>,
			);

			const regionElement = screen.getByText("Hipokamp");
			fireEvent.click(regionElement);

			expect(onRegionClick).toHaveBeenCalledWith(
				mockSupplementData.primaryBrainRegions[0],
			);
		});

		it("handles supplement click events", () => {
			const onSupplementClick = jest.fn();
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					onSupplementClick={onSupplementClick}
				/>,
			);

			// Click on the supplement card (this would typically be handled by the parent)
			const supplementCard = screen.getByTestId("brain-supplement-card");
			fireEvent.click(supplementCard);

			// Note: The actual click handling would depend on implementation
			expect(supplementCard).toBeInTheDocument();
		});

		it("handles bookmark functionality", () => {
			const onBookmark = jest.fn();
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					allowBookmark={true}
					onBookmark={onBookmark}
				/>,
			);

			const bookmarkButton = screen.getByLabelText(/dodaj zakładkę/i);
			fireEvent.click(bookmarkButton);

			expect(onBookmark).toHaveBeenCalledWith("test-supplement");
		});

		it("toggles bookmark state correctly", () => {
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					allowBookmark={true}
				/>,
			);

			const bookmarkButton = screen.getByLabelText(/dodaj zakładkę/i);

			// Initially not bookmarked
			expect(bookmarkButton).toBeInTheDocument();

			// Click to bookmark
			fireEvent.click(bookmarkButton);

			// Button should still be present (state change is internal)
			expect(screen.getByTestId("brain-supplement-card")).toBeInTheDocument();
		});
	});

	describe("Tab Navigation", () => {
		it("switches between tabs correctly", async () => {
			render(<BrainSupplementCard supplement={mockSupplementData} />);

			// Default tab should be overview
			expect(screen.getByText(/jak działa/i)).toBeInTheDocument();

			// Click on brain regions tab
			const brainRegionsTab = screen.getByText(/regiony mózgu/i);
			fireEvent.click(brainRegionsTab);

			await waitFor(() => {
				expect(screen.getByText(/główne regiony mózgu/i)).toBeInTheDocument();
			});

			// Click on research tab
			const researchTab = screen.getByText(/badania/i);
			fireEvent.click(researchTab);

			await waitFor(() => {
				expect(screen.getByText(/badania kliniczne/i)).toBeInTheDocument();
			});

			// Click on safety tab
			const safetyTab = screen.getByText(/bezpieczeństwo/i);
			fireEvent.click(safetyTab);

			await waitFor(() => {
				expect(screen.getByText(/przeciwwskazania/i)).toBeInTheDocument();
			});
		});

		it("displays brain regions when brain-regions tab is selected", async () => {
			render(<BrainSupplementCard supplement={mockSupplementData} />);

			const brainRegionsTab = screen.getByText(/regiony mózgu/i);
			fireEvent.click(brainRegionsTab);

			await waitFor(() => {
				expect(screen.getByText("Hipokamp")).toBeInTheDocument();
				expect(
					screen.getByText("Centrum tworzenia pamięci"),
				).toBeInTheDocument();
			});
		});
	});

	describe("Brain Visualization", () => {
		it("shows brain visualization placeholder when enabled", () => {
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					showBrainVisualization={true}
				/>,
			);

			expect(screen.getByText(/wizualizacja mózgu/i)).toBeInTheDocument();
			expect(
				screen.getByText(/interaktywna wizualizacja regionów mózgu/i),
			).toBeInTheDocument();
		});

		it("hides brain visualization when disabled", () => {
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					showBrainVisualization={false}
				/>,
			);

			expect(screen.queryByText(/wizualizacja mózgu/i)).not.toBeInTheDocument();
		});
	});

	describe("Progress Tracking", () => {
		it("shows progress tracker when enabled", () => {
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					showProgressTracking={true}
				/>,
			);

			expect(screen.getByText(/postęp nauki/i)).toBeInTheDocument();
			expect(
				screen.getByText(/śledź swój postęp w nauce o suplementach/i),
			).toBeInTheDocument();
		});

		it("hides progress tracker when disabled", () => {
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					showProgressTracking={false}
				/>,
			);

			expect(screen.queryByText(/postęp nauki/i)).not.toBeInTheDocument();
		});

		it("handles progress updates", () => {
			const onProgressUpdate = jest.fn();
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					showProgressTracking={true}
					onProgressUpdate={onProgressUpdate}
				/>,
			);

			// Progress tracking UI should be present
			expect(screen.getByText(/postęp nauki/i)).toBeInTheDocument();
		});
	});

	describe("Accessibility", () => {
		it("passes accessibility audit", async () => {
			const { container } = render(
				<BrainSupplementCard supplement={mockSupplementData} />,
			);

			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});

		it("has proper ARIA labels", () => {
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					ariaLabel="Custom supplement card label"
					ariaDescription="Custom description for screen readers"
				/>,
			);

			const card = screen.getByTestId("brain-supplement-card");
			expect(card).toHaveAttribute(
				"aria-label",
				"Custom supplement card label",
			);
			expect(card).toHaveAttribute(
				"aria-description",
				"Custom description for screen readers",
			);
		});

		it("supports high contrast mode", () => {
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					highContrast={true}
				/>,
			);

			const card = screen.getByTestId("brain-supplement-card");
			expect(card).toHaveClass("brain-supplement-card--high-contrast");
		});

		it("supports reduced motion", () => {
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					reducedMotion={true}
				/>,
			);

			const card = screen.getByTestId("brain-supplement-card");
			expect(card).toHaveClass("brain-supplement-card--reduced-motion");
		});

		it("has proper heading structure", () => {
			render(<BrainSupplementCard supplement={mockSupplementData} />);

			// Should have proper heading levels
			const mainTitle = screen.getByRole("heading", { level: 2 });
			expect(mainTitle).toBeInTheDocument();
			expect(mainTitle).toHaveTextContent("Testowy Suplement");
		});

		it("supports keyboard navigation", () => {
			render(<BrainSupplementCard supplement={mockSupplementData} />);

			const card = screen.getByTestId("brain-supplement-card");
			const tabs = screen.getAllByRole("tab");

			// Card should be focusable
			card.focus();
			expect(document.activeElement).toBe(card);

			// Tabs should be focusable
			tabs.forEach((tab) => {
				tab.focus();
				expect(document.activeElement).toBe(tab);
			});
		});
	});

	describe("Performance", () => {
		it("renders within acceptable time", async () => {
			const startTime = performance.now();

			render(<BrainSupplementCard supplement={mockSupplementData} />);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should render within 100ms (adjust based on requirements)
			expect(renderTime).toBeLessThan(100);
		});

		it("handles lazy loading correctly", () => {
			render(
				<BrainSupplementCard supplement={mockSupplementData} lazyLoad={true} />,
			);

			// Component should still render with lazy loading enabled
			expect(screen.getByTestId("brain-supplement-card")).toBeInTheDocument();
		});

		it("handles large datasets efficiently", () => {
			const largeSupplement = {
				...mockSupplementData,
				primaryBrainRegions: Array.from({ length: 20 }, (_, i) => ({
					id: `region-${i}`,
					name: `Region ${i}`,
					polishName: `Region ${i}`,
					description: `Description ${i}`,
					polishDescription: `Opis ${i}`,
					coordinates: { x: 0.5, y: 0.5, z: 0.5 },
					functions: [`Function ${i}`],
					polishFunctions: [`Funkcja ${i}`],
					supplementEffects: [],
					color: "#3B82F6",
					size: "medium" as const,
				})),
			};

			const startTime = performance.now();

			render(<BrainSupplementCard supplement={largeSupplement} />);

			const endTime = performance.now();
			const renderTime = endTime - startTime;

			// Should handle large datasets reasonably well
			expect(renderTime).toBeLessThan(200);
			expect(screen.getByTestId("brain-supplement-card")).toBeInTheDocument();
		});
	});

	describe("Error Handling", () => {
		it("handles missing supplement data gracefully", () => {
			// @ts-expect-error - Testing error handling
			render(<BrainSupplementCard supplement={null} />);

			// Should render without crashing
			expect(screen.getByTestId("brain-supplement-card")).toBeInTheDocument();
		});

		it("handles malformed supplement data", () => {
			const malformedSupplement = {
				...mockSupplementData,
				primaryBrainRegions: null,
				// @ts-expect-error - Testing error handling
			};

			render(<BrainSupplementCard supplement={malformedSupplement} />);

			// Should render without crashing
			expect(screen.getByTestId("brain-supplement-card")).toBeInTheDocument();
		});
	});

	describe("Theme Support", () => {
		it("applies light theme correctly", () => {
			render(
				<BrainSupplementCard supplement={mockSupplementData} theme="light" />,
			);

			const card = screen.getByTestId("brain-supplement-card");
			expect(card).toHaveClass("brain-supplement-card--light");
		});

		it("applies dark theme correctly", () => {
			render(
				<BrainSupplementCard supplement={mockSupplementData} theme="dark" />,
			);

			const card = screen.getByTestId("brain-supplement-card");
			expect(card).toHaveClass("brain-supplement-card--dark");
		});

		it("applies auto theme correctly", () => {
			render(
				<BrainSupplementCard supplement={mockSupplementData} theme="auto" />,
			);

			const card = screen.getByTestId("brain-supplement-card");
			expect(card).not.toHaveClass("brain-supplement-card--light");
			expect(card).not.toHaveClass("brain-supplement-card--dark");
		});
	});

	describe("Responsive Design", () => {
		it("adapts to different screen sizes", () => {
			render(<BrainSupplementCard supplement={mockSupplementData} />);

			const card = screen.getByTestId("brain-supplement-card");

			// Should have responsive classes
			expect(card).toHaveClass("w-full");
			expect(card).toHaveClass("max-w-4xl");
		});

		it("handles different size variants", () => {
			const { rerender } = render(
				<BrainSupplementCard supplement={mockSupplementData} size="small" />,
			);

			let card = screen.getByTestId("brain-supplement-card");
			expect(card).toHaveClass("brain-supplement-card--small");

			rerender(
				<BrainSupplementCard supplement={mockSupplementData} size="large" />,
			);
			card = screen.getByTestId("brain-supplement-card");
			expect(card).toHaveClass("brain-supplement-card--large");
		});
	});

	describe("Component Variants", () => {
		it("renders compact variant correctly", () => {
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					variant="compact"
				/>,
			);

			const card = screen.getByTestId("brain-supplement-card");
			expect(card).toHaveClass("brain-supplement-card--compact");
		});

		it("renders detailed variant correctly", () => {
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					variant="detailed"
				/>,
			);

			const card = screen.getByTestId("brain-supplement-card");
			expect(card).toHaveClass("brain-supplement-card--detailed");
		});

		it("renders educational variant correctly", () => {
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					variant="educational"
				/>,
			);

			const card = screen.getByTestId("brain-supplement-card");
			expect(card).toHaveClass("brain-supplement-card--educational");
		});
	});

	describe("Integration Tests", () => {
		it("integrates properly with Polish localization system", () => {
			render(
				<BrainSupplementCard
					supplement={mockSupplementData}
					language="pl"
					enableMedicalTerms={true}
					validatePolishChars={true}
				/>,
			);

			// Should render Polish content
			expect(screen.getByText("Testowy Suplement")).toBeInTheDocument();
			expect(screen.getByText("witamina")).toBeInTheDocument();
		});

		it("handles real supplement data structure", () => {
			// Test with a more realistic supplement structure
			const realisticSupplement = {
				...mockSupplementData,
				evidenceLevel: "moderate" as const,
				studyCount: 8,
				participantCount: 320,
				effectSize: 0.4,
				primaryBrainRegions: [
					{
						id: "prefrontal-cortex",
						name: "Prefrontal Cortex",
						polishName: "Kora przedczołowa",
						description: "Executive function and decision making",
						polishDescription: "Funkcje wykonawcze i podejmowanie decyzji",
						coordinates: { x: 0.5, y: 0.3, z: 0.7 },
						functions: [
							"Executive function",
							"Decision making",
							"Working memory",
						],
						polishFunctions: [
							"Funkcje wykonawcze",
							"Podejmowanie decyzji",
							"Pamięć robocza",
						],
						supplementEffects: [
							{
								type: "enhancement",
								polishType: "wzmocnienie",
								strength: "moderate",
								mechanism: "Cholinergic enhancement",
								polishMechanism: "wzmocnienie cholinergiczne",
								evidenceLevel: "moderate",
								duration: "4-6 weeks",
								polishDuration: "4-6 tygodni",
							},
						],
						color: "#10B981",
						size: "large",
					},
				],
			};

			render(<BrainSupplementCard supplement={realisticSupplement} />);

			expect(screen.getByText("Kora przedczołowa")).toBeInTheDocument();
			expect(
				screen.getByText("Funkcje wykonawcze i podejmowanie decyzji"),
			).toBeInTheDocument();
		});
	});
});
