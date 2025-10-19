/**
 * Advanced Filter Types for Supplement Filtering System
 * Comprehensive filtering with Polish localization and multiple filter types
 */

import type { EvidenceLevel, SupplementCategory } from "./supplement";

// Core filter state interface
export interface FilterState {
	// Text search
	query: string;

	// Category filters
	categories: SupplementCategory[];
	evidenceLevels: EvidenceLevel[];

	// Range filters
	priceRange: [number, number];
	dosageRange: [number, number];
	ratingRange: [number, number];
	safetyRating: [number, number];

	// Multi-select filters
	activeCompounds: string[];
	clinicalConditions: string[];
	mechanisms: string[];
	sideEffects: string[];
	tags: string[];

	// Boolean filters
	hasStudies: boolean;
	hasReviews: boolean;
	hasInteractions: boolean;
	onlyNatural: boolean;

	// Sorting
	sortBy: SortOption;
	sortOrder: "asc" | "desc";

	// Filter combination logic
	combinationMode: "AND" | "OR";
}

// Sorting options
export type SortOption =
	| "relevance"
	| "name"
	| "polishName"
	| "category"
	| "evidence"
	| "price"
	| "rating"
	| "safety"
	| "createdAt"
	| "updatedAt";

// Filter preset for saving/loading filter combinations
export interface FilterPreset {
	id: string;
	name: string;
	description?: string;
	icon?: string;
	filters: FilterState;
	createdAt: string;
	updatedAt: string;
	isDefault?: boolean;
	category?: string;
}

// Filter analytics for popular suggestions
export interface FilterAnalytics {
	popularCategories: Array<{ category: SupplementCategory; count: number }>;
	popularCompounds: Array<{ compound: string; count: number }>;
	popularConditions: Array<{ condition: string; count: number }>;
	recentSearches: string[];
	frequentlyUsedFilters: FilterPreset[];
}

// URL state for shareable filters
export interface UrlFilterState {
	q?: string; // query
	c?: string; // categories (comma-separated)
	e?: string; // evidence levels (comma-separated)
	pr?: string; // price range (min-max)
	dr?: string; // dosage range (min-max)
	rr?: string; // rating range (min-max)
	sr?: string; // safety rating (min-max)
	ac?: string; // active compounds (comma-separated)
	cc?: string; // clinical conditions (comma-separated)
	m?: string; // mechanisms (comma-separated)
	se?: string; // side effects (comma-separated)
	t?: string; // tags (comma-separated)
	st?: string; // has studies (true/false)
	rv?: string; // has reviews (true/false)
	hi?: string; // has interactions (true/false)
	n?: string; // only natural (true/false)
	s?: string; // sort by
	o?: string; // sort order (asc/desc)
	cm?: string; // combination mode (AND/OR)
}

// Filter validation schema
export interface FilterValidation {
	isValid: boolean;
	errors: string[];
	warnings: string[];
}

// Filter component props
export interface FilterSectionProps {
	title: string;
	description?: string;
	children: React.ReactNode;
	isCollapsible?: boolean;
	defaultExpanded?: boolean;
}

export interface RangeFilterProps {
	label: string;
	value: [number, number];
	onChange: (value: [number, number]) => void;
	min: number;
	max: number;
	step: number;
	unit?: string;
	formatValue?: (value: number) => string;
}

// Filter hook return type
export interface UseFiltersReturn {
	filters: FilterState;
	setFilters: (filters: Partial<FilterState>) => void;
	updateFilter: <K extends keyof FilterState>(
		key: K,
		value: FilterState[K],
	) => void;
	clearFilters: () => void;
	clearFilterSection: (section: keyof FilterState) => void;
	hasActiveFilters: boolean;
	activeFilterCount: number;
	presets: FilterPreset[];
	savePreset: (name: string, description?: string) => void;
	loadPreset: (presetId: string) => void;
	deletePreset: (presetId: string) => void;
	analytics: FilterAnalytics;
	urlState: UrlFilterState;
	applyUrlState: (urlState: UrlFilterState) => void;
	generateUrl: () => string;
	isLoading: boolean;
	error?: string;
}

// Filter context type for React Context API
export interface FilterContextType extends UseFiltersReturn {
	provider: true;
}

// Default filter state
export const defaultFilterState: FilterState = {
	query: "",
	categories: [],
	evidenceLevels: [],
	priceRange: [0, 1000],
	dosageRange: [0, 5000],
	ratingRange: [0, 5],
	safetyRating: [0, 10],
	activeCompounds: [],
	clinicalConditions: [],
	mechanisms: [],
	sideEffects: [],
	tags: [],
	hasStudies: false,
	hasReviews: false,
	hasInteractions: false,
	onlyNatural: false,
	sortBy: "relevance",
	sortOrder: "desc",
	combinationMode: "AND",
};

// Filter categories for organization
export const filterCategories = {
	basic: {
		query: "Wyszukiwanie tekstowe",
		categories: "Kategorie suplementów",
		evidenceLevels: "Poziom dowodów naukowych",
	},
	ranges: {
		priceRange: "Zakres cenowy",
		dosageRange: "Zakres dawkowania",
		ratingRange: "Ocena użytkowników",
		safetyRating: "Ocena bezpieczeństwa",
	},
	advanced: {
		activeCompounds: "Substancje czynne",
		clinicalConditions: "Zastosowania kliniczne",
		mechanisms: "Mechanizmy działania",
		sideEffects: "Efekty uboczne",
		tags: "Tagi",
	},
	boolean: {
		hasStudies: "Tylko suplementy z badaniami",
		hasReviews: "Tylko suplementy z opiniami",
		hasInteractions: "Tylko suplementy z interakcjami",
		onlyNatural: "Tylko suplementy naturalne",
	},
} as const;

// Polish translations for filter labels
export const filterLabels: Record<keyof FilterState, string> = {
	query: "Wyszukiwanie",
	categories: "Kategorie",
	evidenceLevels: "Poziom dowodów",
	priceRange: "Cena",
	dosageRange: "Dawka",
	ratingRange: "Ocena",
	safetyRating: "Bezpieczeństwo",
	activeCompounds: "Substancje czynne",
	clinicalConditions: "Zastosowania",
	mechanisms: "Mechanizmy",
	sideEffects: "Efekty uboczne",
	tags: "Tagi",
	hasStudies: "Badania dostępne",
	hasReviews: "Opinie dostępne",
	hasInteractions: "Interakcje dostępne",
	onlyNatural: "Tylko naturalne",
	sortBy: "Sortowanie",
	sortOrder: "Kolejność",
	combinationMode: "Tryb łączenia",
};

// Sort option labels
export const sortOptionLabels: Record<SortOption, string> = {
	relevance: "Trafność",
	name: "Nazwa (EN)",
	polishName: "Nazwa (PL)",
	category: "Kategoria",
	evidence: "Dowody naukowe",
	price: "Cena",
	rating: "Ocena użytkowników",
	safety: "Bezpieczeństwo",
	createdAt: "Data dodania",
	updatedAt: "Ostatnia aktualizacja",
};

// Evidence level labels
export const evidenceLevelLabels: Record<EvidenceLevel, string> = {
	STRONG: "Silne dowody",
	MODERATE: "Umiarkowane dowody",
	WEAK: "Słabe dowody",
	INSUFFICIENT: "Niewystarczające",
	CONFLICTING: "Sprzeczne",
};

// Category labels
export const categoryLabels: Record<SupplementCategory, string> = {
	VITAMIN: "Witaminy",
	MINERAL: "Minerały",
	AMINO_ACID: "Aminokwasy",
	FATTY_ACID: "Kwasy tłuszczowe",
	HERB: "Zioła",
	NOOTROPIC: "Nootropiki",
	ADAPTOGEN: "Adaptogeny",
	COENZYME: "Koenzymy",
	PROBIOTIC: "Probiotyki",
	ENZYME: "Enzymy",
	OTHER: "Inne",
};
