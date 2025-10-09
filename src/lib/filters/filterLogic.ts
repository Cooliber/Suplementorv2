/**
 * Advanced Filter Logic for Supplement Filtering
 * Handles complex filter combinations with AND/OR operations
 */

import type { FilterState, SortOption } from "@/types/filters";
import type { SupplementWithRelations } from "@/types/supplement";

// Filter match result
export interface FilterMatch {
	matches: boolean;
	score: number; // For relevance scoring
	reasons: string[]; // Why it matched/failed
}

// Main filter function
export function filterSupplements(
	supplements: SupplementWithRelations[],
	filters: FilterState
): SupplementWithRelations[] {
	if (!supplements.length) return [];

	let filtered = supplements;

	// Apply each filter type
	filtered = applyTextSearch(filtered, filters);
	filtered = applyCategoryFilters(filtered, filters);
	filtered = applyEvidenceFilters(filtered, filters);
	filtered = applyRangeFilters(filtered, filters);
	filtered = applyMultiSelectFilters(filtered, filters);
	filtered = applyBooleanFilters(filtered, filters);

	// Apply sorting
	filtered = applySorting(filtered, filters);

	return filtered;
}

// Text search with relevance scoring
function applyTextSearch(
	supplements: SupplementWithRelations[],
	filters: FilterState
): SupplementWithRelations[] {
	if (!filters.query.trim()) return supplements;

	const query = filters.query.toLowerCase().trim();
	const terms = query.split(/\s+/).filter(term => term.length > 0);

	return supplements
		.map(supplement => {
			const match = calculateTextMatch(supplement, terms);
			return { supplement, match };
		})
		.filter(({ match }) => match.matches)
		.sort((a, b) => b.match.score - a.match.score)
		.map(({ supplement }) => supplement);
}

// Calculate text match with relevance scoring
function calculateTextMatch(
	supplement: SupplementWithRelations,
	terms: string[]
): FilterMatch {
	let score = 0;
	const reasons: string[] = [];

	// Search in multiple fields with different weights
	const fields = [
		{ value: supplement.name, weight: 10, name: "nazwa" },
		{ value: supplement.polishName, weight: 10, name: "nazwa polska" },
		{ value: supplement.scientificName || "", weight: 8, name: "nazwa naukowa" },
		{ value: supplement.description || "", weight: 3, name: "opis" },
		{ value: supplement.polishDescription || "", weight: 3, name: "opis polski" },
		{ value: supplement.commonNames.join(" "), weight: 5, name: "nazwy potoczne" },
		{ value: supplement.polishCommonNames.join(" "), weight: 5, name: "nazwy polskie" },
		{ value: supplement.activeCompounds.map(c => c.name).join(" "), weight: 6, name: "substancje czynne" },
		{ value: supplement.clinicalApplications.map(c => c.condition).join(" "), weight: 4, name: "zastosowania" },
		{ value: supplement.tags.join(" "), weight: 7, name: "tagi" },
	];

	let matches = false;

	for (const term of terms) {
		let termMatches = false;

		for (const field of fields) {
			if (field.value.toLowerCase().includes(term)) {
				score += field.weight;
				reasons.push(`Znalezione "${term}" w ${field.name}`);
				termMatches = true;
				matches = true;

				// Bonus for exact matches
				if (field.value.toLowerCase() === term) {
					score += field.weight * 2;
					reasons.push(`Dokładne dopasowanie w ${field.name}`);
				}

				// Bonus for start of field
				if (field.value.toLowerCase().startsWith(term)) {
					score += field.weight * 1.5;
					reasons.push(`Dopasowanie na początku ${field.name}`);
				}
			}
		}

		if (!termMatches) {
			reasons.push(`Nie znaleziono "${term}"`);
		}
	}

	return { matches, score, reasons };
}

// Category filters
function applyCategoryFilters(
	supplements: SupplementWithRelations[],
	filters: FilterState
): SupplementWithRelations[] {
	if (filters.categories.length === 0) return supplements;

	return supplements.filter(supplement =>
		filters.categories.includes(supplement.category)
	);
}

// Evidence level filters
function applyEvidenceFilters(
	supplements: SupplementWithRelations[],
	filters: FilterState
): SupplementWithRelations[] {
	if (filters.evidenceLevels.length === 0) return supplements;

	return supplements.filter(supplement =>
		filters.evidenceLevels.includes(supplement.evidenceLevel)
	);
}

// Range filters
function applyRangeFilters(
	supplements: SupplementWithRelations[],
	filters: FilterState
): SupplementWithRelations[] {
	let filtered = supplements;

	// Note: Price, dosage, and rating filters would need to be implemented
	// based on actual data structure. For now, we'll pass through.
	// These would typically come from a separate pricing/rating service.

	return filtered;
}

// Multi-select filters
function applyMultiSelectFilters(
	supplements: SupplementWithRelations[],
	filters: FilterState
): SupplementWithRelations[] {
	let filtered = supplements;

	// Active compounds filter
	if (filters.activeCompounds.length > 0) {
		filtered = filtered.filter(supplement =>
			filters.activeCompounds.some(compound =>
				supplement.activeCompounds.some(ac =>
					ac.name.toLowerCase().includes(compound.toLowerCase())
				)
			)
		);
	}

	// Clinical conditions filter
	if (filters.clinicalConditions.length > 0) {
		filtered = filtered.filter(supplement =>
			filters.clinicalConditions.some(condition =>
				supplement.clinicalApplications.some(ca =>
					ca.condition.toLowerCase().includes(condition.toLowerCase()) ||
					ca.polishCondition.toLowerCase().includes(condition.toLowerCase())
				)
			)
		);
	}

	// Mechanisms filter
	if (filters.mechanisms.length > 0) {
		filtered = filtered.filter(supplement =>
			filters.mechanisms.some(mechanism =>
				supplement.mechanisms.some(m =>
					m.pathway.toLowerCase().includes(mechanism.toLowerCase()) ||
					m.polishPathway.toLowerCase().includes(mechanism.toLowerCase()) ||
					m.description.toLowerCase().includes(mechanism.toLowerCase())
				)
			)
		);
	}

	// Side effects filter (inverse - exclude supplements with these side effects)
	if (filters.sideEffects.length > 0) {
		filtered = filtered.filter(supplement =>
			!filters.sideEffects.some(sideEffect =>
				supplement.sideEffects.some(se =>
					se.effect.toLowerCase().includes(sideEffect.toLowerCase()) ||
					se.polishEffect.toLowerCase().includes(sideEffect.toLowerCase())
				)
			)
		);
	}

	// Tags filter
	if (filters.tags.length > 0) {
		filtered = filtered.filter(supplement =>
			filters.tags.some(tag =>
				supplement.tags.some(supplementTag =>
					supplementTag.toLowerCase().includes(tag.toLowerCase())
				)
			)
		);
	}

	return filtered;
}

// Boolean filters
function applyBooleanFilters(
	supplements: SupplementWithRelations[],
	filters: FilterState
): SupplementWithRelations[] {
	let filtered = supplements;

	// Has studies filter
	if (filters.hasStudies) {
		filtered = filtered.filter(supplement =>
			supplement.researchStudies.length > 0
		);
	}

	// Has reviews filter (would need review data)
	if (filters.hasReviews) {
		// This would need to be implemented based on actual review data
		filtered = filtered.filter(supplement => true); // Placeholder
	}

	// Only natural supplements
	if (filters.onlyNatural) {
		const naturalCategories = ["HERB", "ADAPTOGEN"];
		filtered = filtered.filter(supplement =>
			naturalCategories.includes(supplement.category)
		);
	}

	return filtered;
}

// Sorting function
function applySorting(
	supplements: SupplementWithRelations[],
	filters: FilterState
): SupplementWithRelations[] {
	if (filters.sortBy === "relevance") {
		// Already sorted by relevance in text search
		return supplements;
	}

	return [...supplements].sort((a, b) => {
		let aValue: any, bValue: any;

		switch (filters.sortBy) {
			case "name":
				aValue = a.name.toLowerCase();
				bValue = b.name.toLowerCase();
				break;
			case "polishName":
				aValue = a.polishName.toLowerCase();
				bValue = b.polishName.toLowerCase();
				break;
			case "category":
				aValue = a.category;
				bValue = b.category;
				break;
			case "evidence":
				// Convert evidence level to numeric value
				aValue = getEvidenceLevelValue(a.evidenceLevel);
				bValue = getEvidenceLevelValue(b.evidenceLevel);
				break;
			case "price":
				// Would need price data
				aValue = 0;
				bValue = 0;
				break;
			case "rating":
				// Would need rating data
				aValue = 0;
				bValue = 0;
				break;
			case "safety":
				// Would need safety data
				aValue = 0;
				bValue = 0;
				break;
			case "createdAt":
				aValue = new Date(a.createdAt);
				bValue = new Date(b.createdAt);
				break;
			case "updatedAt":
				aValue = new Date(a.lastUpdated);
				bValue = new Date(b.lastUpdated);
				break;
			default:
				return 0;
		}

		if (aValue < bValue) {
			return filters.sortOrder === "asc" ? -1 : 1;
		}
		if (aValue > bValue) {
			return filters.sortOrder === "asc" ? 1 : -1;
		}
		return 0;
	});
}

// Helper function to convert evidence level to numeric value
function getEvidenceLevelValue(level: string): number {
	const levels = {
		"STRONG": 5,
		"MODERATE": 4,
		"WEAK": 3,
		"INSUFFICIENT": 2,
		"CONFLICTING": 1,
	};
	return levels[level as keyof typeof levels] || 0;
}

// Filter analysis for debugging and optimization
export function analyzeFilters(filters: FilterState): {
	complexity: number;
	estimatedResults: number;
	performance: "fast" | "medium" | "slow";
	recommendations: string[];
} {
	let complexity = 0;
	const recommendations: string[] = [];

	// Analyze each filter type
	if (filters.query) complexity += 3;
	if (filters.categories.length > 0) complexity += 1;
	if (filters.evidenceLevels.length > 0) complexity += 1;
	if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) complexity += 2;
	if (filters.dosageRange[0] !== 0 || filters.dosageRange[1] !== 5000) complexity += 2;
	if (filters.ratingRange[0] !== 0 || filters.ratingRange[1] !== 5) complexity += 2;
	if (filters.safetyRating[0] !== 0 || filters.safetyRating[1] !== 10) complexity += 2;
	if (filters.activeCompounds.length > 0) complexity += 2;
	if (filters.clinicalConditions.length > 0) complexity += 2;
	if (filters.mechanisms.length > 0) complexity += 2;
	if (filters.sideEffects.length > 0) complexity += 2;
	if (filters.tags.length > 0) complexity += 1;
	if (filters.hasStudies) complexity += 1;
	if (filters.hasReviews) complexity += 1;
	if (filters.hasInteractions) complexity += 1;
	if (filters.onlyNatural) complexity += 1;

	// Estimate result count (this would need actual data analysis)
	let estimatedResults = 100; // Base assumption
	if (filters.query) estimatedResults *= 0.3;
	if (filters.categories.length > 0) estimatedResults *= 0.8;
	if (filters.evidenceLevels.length > 0) estimatedResults *= 0.7;
	if (filters.hasStudies) estimatedResults *= 0.5;

	// Performance assessment
	let performance: "fast" | "medium" | "slow" = "fast";
	if (complexity > 10) performance = "medium";
	if (complexity > 20) performance = "slow";

	// Generate recommendations
	if (complexity > 15) {
		recommendations.push("Rozważ użycie mniej filtrów dla lepszej wydajności");
	}
	if (filters.query && filters.query.length < 3) {
		recommendations.push("Użyj dłuższego zapytania wyszukiwania dla lepszych wyników");
	}
	if (filters.categories.length > 5) {
		recommendations.push("Rozważ wybór mniejszej liczby kategorii");
	}

	return {
		complexity,
		estimatedResults: Math.max(1, Math.floor(estimatedResults)),
		performance,
		recommendations,
	};
}

// Extract available filter options from supplements
export function extractFilterOptions(supplements: SupplementWithRelations[]) {
	const compounds = new Set<string>();
	const conditions = new Set<string>();
	const mechanisms = new Set<string>();
	const sideEffects = new Set<string>();
	const tags = new Set<string>();

	supplements.forEach(supplement => {
		supplement.activeCompounds.forEach(compound => {
			compounds.add(compound.name);
		});

		supplement.clinicalApplications.forEach(app => {
			conditions.add(app.condition);
			if (app.polishCondition) conditions.add(app.polishCondition);
		});

		supplement.mechanisms.forEach(mechanism => {
			mechanisms.add(mechanism.pathway);
			if (mechanism.polishPathway) mechanisms.add(mechanism.polishPathway);
		});

		supplement.sideEffects.forEach(effect => {
			sideEffects.add(effect.effect);
			if (effect.polishEffect) sideEffects.add(effect.polishEffect);
		});

		supplement.tags.forEach(tag => {
			tags.add(tag);
		});
	});

	return {
		compounds: Array.from(compounds).sort(),
		conditions: Array.from(conditions).sort(),
		mechanisms: Array.from(mechanisms).sort(),
		sideEffects: Array.from(sideEffects).sort(),
		tags: Array.from(tags).sort(),
	};
}