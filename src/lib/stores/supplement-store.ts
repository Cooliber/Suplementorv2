import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Types for supplement store
interface Supplement {
	id: string;
	name: string;
	polishName: string;
	category: string;
	dosage?: string;
	timing?: string;
	notes?: string;
}

interface SupplementFilters {
	categories: string[];
	evidenceLevels: string[];
	hasPolishTranslation: boolean;
	priceRange?: {
		min: number;
		max: number;
	};
}

interface SupplementState {
	// Selected supplements for stack building
	selectedSupplements: Supplement[];

	// Search and filtering
	searchQuery: string;
	filters: SupplementFilters;
	language: "pl" | "en";

	// UI state
	isLoading: boolean;
	error: string | null;

	// Actions
	addSupplement: (supplement: Supplement) => void;
	removeSupplement: (id: string) => void;
	updateSupplement: (id: string, updates: Partial<Supplement>) => void;
	clearSupplements: () => void;

	// Search and filtering actions
	setSearchQuery: (query: string) => void;
	updateFilters: (filters: Partial<SupplementFilters>) => void;
	setLanguage: (language: "pl" | "en") => void;

	// UI actions
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
}

export const useSupplementStore = create<SupplementState>()(
	devtools(
		persist(
			(set, get) => ({
				// Initial state
				selectedSupplements: [],
				searchQuery: "",
				filters: {
					categories: [],
					evidenceLevels: [],
					hasPolishTranslation: true,
				},
				language: "pl",
				isLoading: false,
				error: null,

				// Supplement management actions
				addSupplement: (supplement) =>
					set(
						(state) => {
							const exists = state.selectedSupplements.find(
								(s) => s.id === supplement.id,
							);
							if (exists) return state;

							return {
								selectedSupplements: [...state.selectedSupplements, supplement],
							};
						},
						false,
						"addSupplement",
					),

				removeSupplement: (id) =>
					set(
						(state) => ({
							selectedSupplements: state.selectedSupplements.filter(
								(s) => s.id !== id,
							),
						}),
						false,
						"removeSupplement",
					),

				updateSupplement: (id, updates) =>
					set(
						(state) => ({
							selectedSupplements: state.selectedSupplements.map((s) =>
								s.id === id ? { ...s, ...updates } : s,
							),
						}),
						false,
						"updateSupplement",
					),

				clearSupplements: () =>
					set(
						{
							selectedSupplements: [],
						},
						false,
						"clearSupplements",
					),

				// Search and filtering actions
				setSearchQuery: (query) =>
					set(
						{
							searchQuery: query,
						},
						false,
						"setSearchQuery",
					),

				updateFilters: (newFilters) =>
					set(
						(state) => ({
							filters: { ...state.filters, ...newFilters },
						}),
						false,
						"updateFilters",
					),

				setLanguage: (language) =>
					set(
						{
							language,
						},
						false,
						"setLanguage",
					),

				// UI actions
				setLoading: (loading) =>
					set(
						{
							isLoading: loading,
						},
						false,
						"setLoading",
					),

				setError: (error) =>
					set(
						{
							error,
						},
						false,
						"setError",
					),
			}),
			{
				name: "supplement-store",
				partialize: (state) => ({
					selectedSupplements: state.selectedSupplements,
					language: state.language,
					filters: state.filters,
				}),
			},
		),
		{
			name: "supplement-store",
		},
	),
);

// Selectors for derived state
export const useSelectedSupplementsCount = () =>
	useSupplementStore((state) => state.selectedSupplements.length);

export const useSupplementById = (id: string) =>
	useSupplementStore((state) =>
		state.selectedSupplements.find((s) => s.id === id),
	);

export const useSupplementsByCategory = (category: string) =>
	useSupplementStore((state) =>
		state.selectedSupplements.filter((s) => s.category === category),
	);

// Helper functions
export const getLocalizedSupplementName = (
	supplement: Supplement,
	language: "pl" | "en",
) => {
	return language === "pl" ? supplement.polishName : supplement.name;
};
