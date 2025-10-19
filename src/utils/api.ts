// API utilities for Suplementor Polish educational platform
// Provides helper functions for data fetching and API interactions

export interface ApiResponse<T> {
	data?: T;
	error?: string;
	success: boolean;
}

export interface SupplementData {
	id: string;
	name: string;
	polishName: string;
	category: string;
	description?: string;
	polishDescription?: string;
}

export interface GraphData {
	nodes: Array<{
		id: string;
		label: string;
		polishLabel: string;
		type: string;
	}>;
	edges: Array<{
		id: string;
		source: string;
		target: string;
		type: string;
	}>;
}

// Mock API functions for development
export async function fetchSupplements(): Promise<
	ApiResponse<SupplementData[]>
> {
	try {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const mockData: SupplementData[] = [
			{
				id: "alpha-gpc",
				name: "Alpha-GPC",
				polishName: "Alfa-GPC",
				category: "Nootropik",
				description: "Choline source supporting memory",
				polishDescription: "Źródło choliny wspierające pamięć",
			},
			{
				id: "l-theanine",
				name: "L-Theanine",
				polishName: "L-Teanina",
				category: "Aminokwas",
				description: "Calming amino acid",
				polishDescription: "Uspokajający aminokwas",
			},
			{
				id: "ashwagandha",
				name: "Ashwagandha",
				polishName: "Ashwagandha",
				category: "Adaptogen",
				description: "Stress-reducing herb",
				polishDescription: "Zioło redukujące stres",
			},
		];

		return {
			data: mockData,
			success: true,
		};
	} catch (error) {
		return {
			error: "Błąd podczas pobierania danych o suplementach",
			success: false,
		};
	}
}

export async function fetchGraphData(): Promise<ApiResponse<GraphData>> {
	try {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 1500));

		const mockData: GraphData = {
			nodes: [
				{
					id: "alpha-gpc",
					label: "Alpha-GPC",
					polishLabel: "Alfa-GPC",
					type: "supplement",
				},
				{
					id: "acetylcholine",
					label: "Acetylcholine",
					polishLabel: "Acetylocholina",
					type: "neurotransmitter",
				},
				{
					id: "memory",
					label: "Memory",
					polishLabel: "Pamięć",
					type: "function",
				},
			],
			edges: [
				{
					id: "alpha-gpc-acetylcholine",
					source: "alpha-gpc",
					target: "acetylcholine",
					type: "enhances",
				},
				{
					id: "acetylcholine-memory",
					source: "acetylcholine",
					target: "memory",
					type: "supports",
				},
			],
		};

		return {
			data: mockData,
			success: true,
		};
	} catch (error) {
		return {
			error: "Błąd podczas pobierania danych grafu",
			success: false,
		};
	}
}

interface SupplementInteractionAnalysis {
interactions: Array<{
		supplements: string[];
		type: string;
		description: string;
		severity: string;
	}>;
	safetyScore: number;
	recommendations: string[];
}

export async function analyzeSupplementInteractions(
	supplementIds: string[],
): Promise<ApiResponse<SupplementInteractionAnalysis>> {
	try {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 800));

		const mockAnalysis = {
			interactions: [
				{
					supplements: supplementIds.slice(0, 2),
					type: "synergistic",
					description: "Synergiczne działanie na koncentrację",
					severity: "beneficial",
				},
			],
			safetyScore: 85,
			recommendations: [
				"Przyjmuj z posiłkami",
				"Unikaj wieczornego dawkowania kofeiny",
			],
		};

		return {
			data: mockAnalysis,
			success: true,
		};
	} catch (error) {
		return {
			error: "Błąd podczas analizy interakcji",
			success: false,
		};
	}
}

// Helper function for error handling
export function handleApiError(error: unknown): string {
	if (typeof error === "string") {
		return error;
	}

	if (error?.message) {
		return error.message;
	}

	return "Wystąpił nieoczekiwany błąd";
}

// Helper function for Polish localization
export function getLocalizedText(
	englishText: string,
	polishText: string,
	language: "pl" | "en" = "pl",
): string {
	return language === "pl" ? polishText : englishText;
}
