import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import PerformanceMonitor from "./PerformanceMonitor";

// Mock performance API for consistent Storybook behavior
const mockPerformance = {
	now: () => Date.now(),
	memory: {
		usedJSHeapSize: 50 * 1024 * 1024, // 50MB
		totalJSHeapSize: 100 * 1024 * 1024, // 100MB
		jsHeapSizeLimit: 2 * 1024 * 1024 * 1024, // 2GB
	},
};

// Override global performance for stories
(global as any).performance = mockPerformance;

const meta: Meta<typeof PerformanceMonitor> = {
	title: "Graph/PerformanceMonitor",
	component: PerformanceMonitor,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Komponent monitorowania wydajności grafu z polskimi komunikatami i rekomendacjami optymalizacji.",
			},
		},
	},
	argTypes: {
		nodeCount: {
			control: { type: "range", min: 0, max: 1000, step: 10 },
			description: "Liczba węzłów w grafie",
		},
		relationshipCount: {
			control: { type: "range", min: 0, max: 500, step: 5 },
			description: "Liczba relacji w grafie",
		},
		onPerformanceIssue: {
			description: "Callback wywoływany przy problemach wydajności",
		},
		onQualityAdjustment: {
			description: "Callback do automatycznej regulacji jakości",
		},
		autoOptimize: {
			description: "Automatyczna optymalizacja przy problemach",
		},
		showDetailed: {
			description: "Pokazuje szczegółowe metryki",
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

// Good performance scenario
export const GoodPerformance: Story = {
	args: {
		nodeCount: 50,
		relationshipCount: 25,
		onPerformanceIssue: action("performanceIssue"),
		onQualityAdjustment: action("qualityAdjustment"),
		autoOptimize: true,
		showDetailed: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Dobra wydajność - wszystkie metryki w normie, brak ostrzeżeń.",
			},
		},
	},
	beforeEach: () => {
		// Mock good performance metrics
		mockPerformance.memory.usedJSHeapSize = 30 * 1024 * 1024; // 30MB
	},
};

// Warning performance scenario
export const WarningPerformance: Story = {
	args: {
		nodeCount: 200,
		relationshipCount: 150,
		onPerformanceIssue: action("performanceIssue"),
		onQualityAdjustment: action("qualityAdjustment"),
		autoOptimize: true,
		showDetailed: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Ostrzeżenie wydajności - średnie obciążenie, pojawiają się pierwsze ostrzeżenia.",
			},
		},
	},
	beforeEach: () => {
		// Mock warning level metrics
		mockPerformance.memory.usedJSHeapSize = 120 * 1024 * 1024; // 120MB
	},
};

// Critical performance scenario
export const CriticalPerformance: Story = {
	args: {
		nodeCount: 500,
		relationshipCount: 400,
		onPerformanceIssue: action("performanceIssue"),
		onQualityAdjustment: action("qualityAdjustment"),
		autoOptimize: true,
		showDetailed: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Krytyczna wydajność - wysokie obciążenie, wymagana optymalizacja.",
			},
		},
	},
	beforeEach: () => {
		// Mock critical level metrics
		mockPerformance.memory.usedJSHeapSize = 250 * 1024 * 1024; // 250MB
	},
};

// Compact view (minimal UI)
export const CompactView: Story = {
	args: {
		nodeCount: 100,
		relationshipCount: 75,
		onPerformanceIssue: action("performanceIssue"),
		onQualityAdjustment: action("qualityAdjustment"),
		autoOptimize: false,
		showDetailed: false,
	},
	parameters: {
		docs: {
			description: {
				story: "Widok kompaktowy - minimalne UI, tylko podstawowe metryki.",
			},
		},
	},
};

// Large dataset performance
export const LargeDataset: Story = {
	args: {
		nodeCount: 1000,
		relationshipCount: 800,
		onPerformanceIssue: action("performanceIssue"),
		onQualityAdjustment: action("qualityAdjustment"),
		autoOptimize: true,
		showDetailed: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Duży zbiór danych - testuje monitor przy maksymalnym obciążeniu.",
			},
		},
	},
	beforeEach: () => {
		// Mock high memory usage
		mockPerformance.memory.usedJSHeapSize = 400 * 1024 * 1024; // 400MB
	},
};

// Auto-optimization disabled
export const NoAutoOptimization: Story = {
	args: {
		nodeCount: 300,
		relationshipCount: 200,
		onPerformanceIssue: action("performanceIssue"),
		onQualityAdjustment: action("qualityAdjustment"),
		autoOptimize: false,
		showDetailed: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Bez automatycznej optymalizacji - użytkownik musi ręcznie reagować na problemy.",
			},
		},
	},
	beforeEach: () => {
		// Mock problematic metrics
		mockPerformance.memory.usedJSHeapSize = 180 * 1024 * 1024; // 180MB
	},
};

// Interactive test
export const InteractiveTest: Story = {
	args: {
		nodeCount: 150,
		relationshipCount: 100,
		onPerformanceIssue: action("performanceIssue"),
		onQualityAdjustment: action("qualityAdjustment"),
		autoOptimize: true,
		showDetailed: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Test monitoring toggle
		const monitorToggle = canvas.getByRole("button");
		await userEvent.click(monitorToggle);

		// Test clear issues button (if visible)
		try {
			const clearButton = canvas.getByText(/wyczyść/i);
			await userEvent.click(clearButton);
		} catch (e) {
			// Button might not be visible if no issues
		}

		// Verify performance metrics are displayed
		expect(canvas.getByText(/fps/i)).toBeInTheDocument();
	},
	parameters: {
		docs: {
			description: {
				story: "Test interaktywności - automatycznie testuje funkcje monitora.",
			},
		},
	},
};

// Memory pressure simulation
export const MemoryPressure: Story = {
	args: {
		nodeCount: 400,
		relationshipCount: 300,
		onPerformanceIssue: action("performanceIssue"),
		onQualityAdjustment: action("qualityAdjustment"),
		autoOptimize: true,
		showDetailed: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Symulacja wysokiego zużycia pamięci - testuje ostrzeżenia i rekomendacje.",
			},
		},
	},
	beforeEach: () => {
		// Simulate memory pressure
		mockPerformance.memory.usedJSHeapSize = 350 * 1024 * 1024; // 350MB
		mockPerformance.memory.totalJSHeapSize = 400 * 1024 * 1024; // 400MB
	},
};

// Polish text processing performance
export const PolishTextPerformance: Story = {
	args: {
		nodeCount: 200,
		relationshipCount: 150,
		onPerformanceIssue: action("performanceIssue"),
		onQualityAdjustment: action("qualityAdjustment"),
		autoOptimize: true,
		showDetailed: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Test wydajności przetwarzania polskiego tekstu z diakrytykami.",
			},
		},
	},
	decorators: [
		(Story) => {
			// Simulate Polish text processing load
			React.useEffect(() => {
				const polishTexts = Array.from(
					{ length: 1000 },
					(_, i) => `Węzeł testowy z polskimi znakami: ąćęłńóśźż ${i}`,
				);

				// Simulate text processing
				polishTexts.forEach((text) => {
					text.normalize("NFD").toLowerCase();
				});
			}, []);

			return <Story />;
		},
	],
};

// Mobile performance
export const MobilePerformance: Story = {
	args: {
		nodeCount: 50,
		relationshipCount: 30,
		onPerformanceIssue: action("performanceIssue"),
		onQualityAdjustment: action("qualityAdjustment"),
		autoOptimize: true,
		showDetailed: false, // Simplified for mobile
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
		docs: {
			description: {
				story: "Wydajność na urządzeniach mobilnych - uproszczony interfejs.",
			},
		},
	},
	beforeEach: () => {
		// Simulate mobile constraints
		mockPerformance.memory.usedJSHeapSize = 80 * 1024 * 1024; // 80MB
		mockPerformance.memory.totalJSHeapSize = 120 * 1024 * 1024; // 120MB
	},
};

// Performance recovery scenario
export const PerformanceRecovery: Story = {
	args: {
		nodeCount: 100,
		relationshipCount: 50,
		onPerformanceIssue: action("performanceIssue"),
		onQualityAdjustment: action("qualityAdjustment"),
		autoOptimize: true,
		showDetailed: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Scenariusz poprawy wydajności - symuluje powrót do normalnych wartości.",
			},
		},
	},
	decorators: [
		(Story) => {
			const [memoryUsage, setMemoryUsage] = React.useState(200 * 1024 * 1024);

			React.useEffect(() => {
				// Simulate memory cleanup over time
				const interval = setInterval(() => {
					setMemoryUsage((prev) =>
						Math.max(50 * 1024 * 1024, prev - 10 * 1024 * 1024),
					);
				}, 2000);

				return () => clearInterval(interval);
			}, []);

			React.useEffect(() => {
				mockPerformance.memory.usedJSHeapSize = memoryUsage;
			}, [memoryUsage]);

			return <Story />;
		},
	],
};

// Stress test scenario
export const StressTest: Story = {
	args: {
		nodeCount: 800,
		relationshipCount: 600,
		onPerformanceIssue: action("performanceIssue"),
		onQualityAdjustment: action("qualityAdjustment"),
		autoOptimize: true,
		showDetailed: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Test obciążeniowy - maksymalne obciążenie systemu monitorowania.",
			},
		},
	},
	beforeEach: () => {
		// Simulate extreme load
		mockPerformance.memory.usedJSHeapSize = 500 * 1024 * 1024; // 500MB
		mockPerformance.memory.totalJSHeapSize = 600 * 1024 * 1024; // 600MB
	},
};

// Recommendations showcase
export const RecommendationsShowcase: Story = {
	args: {
		nodeCount: 350,
		relationshipCount: 250,
		onPerformanceIssue: action("performanceIssue"),
		onQualityAdjustment: action("qualityAdjustment"),
		autoOptimize: false, // Disabled to show recommendations
		showDetailed: true,
	},
	parameters: {
		docs: {
			description: {
				story: "Prezentacja rekomendacji optymalizacji w języku polskim.",
			},
		},
	},
	beforeEach: () => {
		// Set up conditions that trigger recommendations
		mockPerformance.memory.usedJSHeapSize = 160 * 1024 * 1024; // 160MB
	},
};

// Dark mode performance monitor
export const DarkMode: Story = {
	args: {
		nodeCount: 100,
		relationshipCount: 75,
		onPerformanceIssue: action("performanceIssue"),
		onQualityAdjustment: action("qualityAdjustment"),
		autoOptimize: true,
		showDetailed: true,
		className: "dark",
	},
	parameters: {
		backgrounds: {
			default: "dark",
		},
		docs: {
			description: {
				story: "Monitor wydajności w trybie ciemnym.",
			},
		},
	},
};
