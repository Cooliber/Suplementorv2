"use client";

/**
 * Advanced Filter State Management Hook
 * Comprehensive filtering with URL sync, local storage, and analytics
 */

import type {
	FilterAnalytics,
	FilterPreset,
	FilterState,
	SortOption,
	UrlFilterState,
	UseFiltersReturn,
} from "@/types/filters";
import { defaultFilterState } from "@/types/filters";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useDebounce } from "./useDebounce";

// Filter state reducer
type FilterAction =
	| { type: "SET_FILTERS"; payload: Partial<FilterState> }
	| { type: "UPDATE_FILTER"; key: keyof FilterState; value: any }
	| { type: "CLEAR_FILTERS" }
	| { type: "CLEAR_SECTION"; section: keyof FilterState }
	| { type: "LOAD_PRESET"; preset: FilterPreset }
	| { type: "APPLY_URL_STATE"; urlState: UrlFilterState };

const filterReducer = (
	state: FilterState,
	action: FilterAction,
): FilterState => {
	switch (action.type) {
		case "SET_FILTERS":
			return { ...state, ...action.payload };
		case "UPDATE_FILTER":
			return { ...state, [action.key]: action.value };
		case "CLEAR_FILTERS":
			return defaultFilterState;
		case "CLEAR_SECTION": {
			const currentValue = state[action.section];
			if (Array.isArray(currentValue)) {
				if (currentValue.length === 2 && typeof currentValue[0] === "number") {
					// Handle range filters
					const defaultRange: [number, number] = [
						0,
						action.section === "priceRange" ? 1000 : 10,
					];
					return { ...state, [action.section]: defaultRange };
				}
				return { ...state, [action.section]: [] };
			}
			if (typeof currentValue === "boolean") {
				return { ...state, [action.section]: false };
			}
			return state;
		}
		case "LOAD_PRESET":
			return { ...defaultFilterState, ...action.preset.filters };
		case "APPLY_URL_STATE":
			return parseUrlState(action.urlState);
		default:
			return state;
	}
};

// URL state parsing
const parseUrlState = (urlState: UrlFilterState): FilterState => {
	const state = { ...defaultFilterState };

	if (urlState.q) state.query = urlState.q;
	if (urlState.c) state.categories = urlState.c.split(",") as any[];
	if (urlState.e) state.evidenceLevels = urlState.e.split(",") as any[];
	if (urlState.pr) {
		const [minStr, maxStr] = urlState.pr.split("-");
		const min = Number(minStr);
		const max = Number(maxStr);
		if (!Number.isNaN(min) && !Number.isNaN(max)) {
			state.priceRange = [min, max];
		}
	}
	if (urlState.dr) {
		const [minStr, maxStr] = urlState.dr.split("-");
		const min = Number(minStr);
		const max = Number(maxStr);
		if (!Number.isNaN(min) && !Number.isNaN(max)) {
			state.dosageRange = [min, max];
		}
	}
	if (urlState.rr) {
		const [minStr, maxStr] = urlState.rr.split("-");
		const min = Number(minStr);
		const max = Number(maxStr);
		if (!Number.isNaN(min) && !Number.isNaN(max)) {
			state.ratingRange = [min, max];
		}
	}
	if (urlState.sr) {
		const [minStr, maxStr] = urlState.sr.split("-");
		const min = Number(minStr);
		const max = Number(maxStr);
		if (!Number.isNaN(min) && !Number.isNaN(max)) {
			state.safetyRating = [min, max];
		}
	}
	if (urlState.ac) state.activeCompounds = urlState.ac.split(",");
	if (urlState.cc) state.clinicalConditions = urlState.cc.split(",");
	if (urlState.m) state.mechanisms = urlState.m.split(",");
	if (urlState.se) state.sideEffects = urlState.se.split(",");
	if (urlState.t) state.tags = urlState.t.split(",");
	if (urlState.st === "true") state.hasStudies = true;
	if (urlState.rv === "true") state.hasReviews = true;
	if (urlState.hi === "true") state.hasInteractions = true;
	if (urlState.n === "true") state.onlyNatural = true;
	if (urlState.s) state.sortBy = urlState.s as SortOption;
	if (urlState.o) state.sortOrder = urlState.o as "asc" | "desc";
	if (urlState.cm) state.combinationMode = urlState.cm as "AND" | "OR";

	return state;
};

// URL state generation
const generateUrlState = (filters: FilterState): UrlFilterState => {
	const urlState: UrlFilterState = {};

	if (filters.query) urlState.q = filters.query;
	if (filters.categories.length > 0) urlState.c = filters.categories.join(",");
	if (filters.evidenceLevels.length > 0)
		urlState.e = filters.evidenceLevels.join(",");
	if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) {
		urlState.pr = `${filters.priceRange[0]}-${filters.priceRange[1]}`;
	}
	if (filters.dosageRange[0] !== 0 || filters.dosageRange[1] !== 5000) {
		urlState.dr = `${filters.dosageRange[0]}-${filters.dosageRange[1]}`;
	}
	if (filters.ratingRange[0] !== 0 || filters.ratingRange[1] !== 5) {
		urlState.rr = `${filters.ratingRange[0]}-${filters.ratingRange[1]}`;
	}
	if (filters.safetyRating[0] !== 0 || filters.safetyRating[1] !== 10) {
		urlState.sr = `${filters.safetyRating[0]}-${filters.safetyRating[1]}`;
	}
	if (filters.activeCompounds.length > 0)
		urlState.ac = filters.activeCompounds.join(",");
	if (filters.clinicalConditions.length > 0)
		urlState.cc = filters.clinicalConditions.join(",");
	if (filters.mechanisms.length > 0) urlState.m = filters.mechanisms.join(",");
	if (filters.sideEffects.length > 0)
		urlState.se = filters.sideEffects.join(",");
	if (filters.tags.length > 0) urlState.t = filters.tags.join(",");
	if (filters.hasStudies) urlState.st = "true";
	if (filters.hasReviews) urlState.rv = "true";
	if (filters.hasInteractions) urlState.hi = "true";
	if (filters.onlyNatural) urlState.n = "true";
	if (filters.sortBy !== "relevance") urlState.s = filters.sortBy;
	if (filters.sortOrder !== "desc") urlState.o = filters.sortOrder;
	if (filters.combinationMode !== "AND") urlState.cm = filters.combinationMode;

	return urlState;
};

// Local storage keys
const STORAGE_KEYS = {
	PRESETS: "suplementor_filter_presets",
	ANALYTICS: "suplementor_filter_analytics",
	RECENT_SEARCHES: "suplementor_recent_searches",
} as const;

// Default presets
const defaultPresets: FilterPreset[] = [
	{
		id: "evidence-based",
		name: "Tylko sprawdzone",
		description: "Suplementy z silnymi dowodami naukowymi",
		icon: "🔬",
		filters: {
			...defaultFilterState,
			evidenceLevels: ["STRONG", "MODERATE"],
			hasStudies: true,
			sortBy: "evidence",
			sortOrder: "desc",
		},
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		isDefault: true,
		category: "evidence",
	},
	{
		id: "natural-only",
		name: "Tylko naturalne",
		description: "Suplementy pochodzenia naturalnego",
		icon: "🌿",
		filters: {
			...defaultFilterState,
			categories: ["HERB", "ADAPTOGEN"],
			onlyNatural: true,
			sortBy: "name",
			sortOrder: "asc",
		},
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		isDefault: true,
		category: "natural",
	},
	{
		id: "nootropics",
		name: "Nootropiki",
		description: "Suplementy poprawiające funkcje poznawcze",
		icon: "🧠",
		filters: {
			...defaultFilterState,
			categories: ["NOOTROPIC"],
			evidenceLevels: ["STRONG", "MODERATE"],
			sortBy: "evidence",
			sortOrder: "desc",
		},
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		isDefault: true,
		category: "cognitive",
	},
];

export function useFilters(
	initialFilters?: Partial<FilterState>,
): UseFiltersReturn {
	const [filters, dispatch] = useReducer(filterReducer, {
		...defaultFilterState,
		...initialFilters,
	});

	const [presets, setPresets] = useState<FilterPreset[]>(defaultPresets);
	const [analytics, setAnalytics] = useState<FilterAnalytics>({
		popularCategories: [],
		popularCompounds: [],
		popularConditions: [],
		recentSearches: [],
		frequentlyUsedFilters: [],
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>();

	// Debounced search query for real-time filtering
	const debouncedQuery = useDebounce(filters.query, 300);

	// Load data from localStorage on mount
	useEffect(() => {
		try {
			const savedPresets = localStorage.getItem(STORAGE_KEYS.PRESETS);
			if (savedPresets) {
				const parsed = JSON.parse(savedPresets) as FilterPreset[];
				setPresets((prev) => [...defaultPresets, ...parsed]);
			}

			const savedAnalytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
			if (savedAnalytics) {
				setAnalytics(JSON.parse(savedAnalytics));
			}
		} catch (err) {
			console.error("Error loading filter data:", err);
		}
	}, []);

	// Save presets to localStorage when they change
	useEffect(() => {
		try {
			const customPresets = presets.filter((p) => !p.isDefault);
			localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(customPresets));
		} catch (err) {
			console.error("Error saving presets:", err);
		}
	}, [presets]);

	// Update URL when filters change (but not on initial load)
	useEffect(() => {
		if (typeof window !== "undefined") {
			const url = new URL(window.location.href);
			const urlState = generateUrlState(filters);

			// Clear existing filter params
			const params = new URLSearchParams(url.search);
			Object.keys(params).forEach((key) => {
				if (
					key.startsWith("q") ||
					key.startsWith("c") ||
					key.startsWith("e") ||
					key.startsWith("p") ||
					key.startsWith("d") ||
					key.startsWith("r") ||
					key.startsWith("s") ||
					key.startsWith("a") ||
					key.startsWith("m") ||
					key.startsWith("t") ||
					key.startsWith("h") ||
					key.startsWith("o") ||
					key.startsWith("n") ||
					key.startsWith("cm")
				) {
					params.delete(key);
				}
			});

			// Add new filter params
			Object.entries(urlState).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					params.set(key, value);
				}
			});

			const newUrl = `${url.pathname}?${params.toString()}`;
			window.history.replaceState({}, "", newUrl);
		}
	}, [filters]);

	// Update analytics when filters change
	useEffect(() => {
		if (filters.query) {
			setAnalytics((prev) => ({
				...prev,
				recentSearches: [
					filters.query,
					...prev.recentSearches.filter((s) => s !== filters.query).slice(0, 9),
				],
			}));
		}
	}, [filters.query]);

	const setFilters = useCallback((newFilters: Partial<FilterState>) => {
		dispatch({ type: "SET_FILTERS", payload: newFilters });
	}, []);

	const updateFilter = useCallback(
		<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
			dispatch({ type: "UPDATE_FILTER", key, value });
		},
		[],
	);

	const clearFilters = useCallback(() => {
		dispatch({ type: "CLEAR_FILTERS" });
	}, []);

	const clearFilterSection = useCallback((section: keyof FilterState) => {
		dispatch({ type: "CLEAR_SECTION", section });
	}, []);

	const savePreset = useCallback(
		(name: string, description?: string) => {
			const newPreset: FilterPreset = {
				id: `preset_${Date.now()}`,
				name,
				description,
				filters: { ...filters },
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				category: "custom",
			};

			setPresets((prev) => [...prev, newPreset]);

			// Update analytics
			setAnalytics((prev) => ({
				...prev,
				frequentlyUsedFilters: [
					newPreset,
					...prev.frequentlyUsedFilters.slice(0, 4),
				],
			}));
		},
		[filters],
	);

	const loadPreset = useCallback(
		(presetId: string) => {
			const preset = presets.find((p) => p.id === presetId);
			if (preset) {
				dispatch({ type: "LOAD_PRESET", preset });
			}
		},
		[presets],
	);

	const deletePreset = useCallback((presetId: string) => {
		setPresets((prev) => prev.filter((p) => p.id !== presetId));
	}, []);

	const applyUrlState = useCallback((urlState: UrlFilterState) => {
		dispatch({ type: "APPLY_URL_STATE", urlState });
	}, []);

	const generateUrl = useCallback(() => {
		if (typeof window === "undefined") return "";
		const urlState = generateUrlState(filters);
		const params = new URLSearchParams();

		Object.entries(urlState).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				params.set(key, value);
			}
		});

		return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
	}, [filters]);

	// Calculate active filter count
	const activeFilterCount = useCallback(() => {
		let count = 0;
		if (filters.query) count++;
		if (filters.categories.length > 0) count++;
		if (filters.evidenceLevels.length > 0) count++;
		if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) count++;
		if (filters.dosageRange[0] !== 0 || filters.dosageRange[1] !== 5000)
			count++;
		if (filters.ratingRange[0] !== 0 || filters.ratingRange[1] !== 5) count++;
		if (filters.safetyRating[0] !== 0 || filters.safetyRating[1] !== 10)
			count++;
		if (filters.activeCompounds.length > 0) count++;
		if (filters.clinicalConditions.length > 0) count++;
		if (filters.mechanisms.length > 0) count++;
		if (filters.sideEffects.length > 0) count++;
		if (filters.tags.length > 0) count++;
		if (filters.hasStudies) count++;
		if (filters.hasReviews) count++;
		if (filters.hasInteractions) count++;
		if (filters.onlyNatural) count++;
		if (filters.sortBy !== "relevance") count++;
		return count;
	}, [filters]);

	const hasActiveFilters = activeFilterCount() > 0;

	return {
		filters,
		setFilters,
		updateFilter,
		clearFilters,
		clearFilterSection,
		hasActiveFilters,
		activeFilterCount: activeFilterCount(),
		presets,
		savePreset,
		loadPreset,
		deletePreset,
		analytics,
		urlState: generateUrlState(filters),
		applyUrlState,
		generateUrl,
		isLoading,
		error,
	};
}
