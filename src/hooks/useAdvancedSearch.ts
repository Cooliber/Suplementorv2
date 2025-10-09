"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useDebounce } from "./useDebounce";
import type { SupplementCategory, EvidenceLevel } from "@/types/supplement";

export interface SearchFilters {
	query: string;
	categories: SupplementCategory[];
	evidenceLevels: EvidenceLevel[];
	safetyRating: [number, number];
	priceRange: [number, number];
	hasStudies: boolean;
	hasReviews: boolean;
	sortBy: "relevance" | "name" | "evidence" | "safety" | "rating" | "price";
	sortOrder: "asc" | "desc";
}

export interface SearchResult {
	id: string;
	name: string;
	polishName: string;
	category: string;
	description: string;
	evidenceLevel: string;
	safetyRating: number;
	userRating: number;
	matchedFields: string[];
	relevanceScore: number;
	highlights: {
		name?: string;
		polishName?: string;
		description?: string;
		tags?: string[];
	};
}

export interface SearchSuggestion {
	text: string;
	type: "supplement" | "compound" | "benefit" | "category";
	count?: number;
}

export interface SearchHistoryItem {
	query: string;
	timestamp: number;
	resultCount?: number;
}

const STORAGE_KEYS = {
	SEARCH_HISTORY: "suplementor_search_history",
	SAVED_SEARCHES: "suplementor_saved_searches",
	POPULAR_QUERIES: "suplementor_popular_queries",
};

const MAX_HISTORY_ITEMS = 50;
const MAX_SUGGESTIONS = 8;

export function useAdvancedSearch(supplements: any[] = []) {
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
	const [savedSearches, setSavedSearches] = useState<any[]>([]);
	const [popularQueries, setPopularQueries] = useState<string[]>([]);

	const debouncedQuery = useDebounce(searchQuery, 300);

	// Load data from localStorage on mount
	useEffect(() => {
		try {
			const history = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
			const saved = localStorage.getItem(STORAGE_KEYS.SAVED_SEARCHES);
			const popular = localStorage.getItem(STORAGE_KEYS.POPULAR_QUERIES);

			if (history) setSearchHistory(JSON.parse(history));
			if (saved) setSavedSearches(JSON.parse(saved));
			if (popular) setPopularQueries(JSON.parse(popular));
		} catch (error) {
			console.warn("Failed to load search data from localStorage:", error);
		}
	}, []);

	// Save search history to localStorage
	const saveSearchHistory = useCallback((history: SearchHistoryItem[]) => {
		try {
			localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
		} catch (error) {
			console.warn("Failed to save search history:", error);
		}
	}, []);

	// Generate search suggestions based on query and data
	const searchSuggestions = useMemo(() => {
		if (!debouncedQuery || debouncedQuery.length < 2) return [];

		const suggestions: SearchSuggestion[] = [];
		const query = debouncedQuery.toLowerCase();

		// Supplement name suggestions
		supplements.forEach((supplement) => {
			if (supplement.name.toLowerCase().includes(query)) {
				suggestions.push({
					text: supplement.name,
					type: "supplement",
					count: supplements.filter(s => s.name.toLowerCase().includes(query)).length,
				});
			}
			if (supplement.polishName?.toLowerCase().includes(query)) {
				suggestions.push({
					text: supplement.polishName,
					type: "supplement",
				});
			}
		});

		// Active compounds suggestions
		supplements.forEach((supplement) => {
			supplement.activeCompounds?.forEach((compound: any) => {
				if (compound.name.toLowerCase().includes(query)) {
					suggestions.push({
						text: compound.name,
						type: "compound",
					});
				}
			});
		});

		// Category suggestions
		const categories = [
			"NOOTROPIC", "VITAMIN", "MINERAL", "AMINO_ACID", "HERB",
			"ADAPTOGEN", "COENZYME", "FATTY_ACID", "PROBIOTIC", "ENZYME"
		];

		categories.forEach((category) => {
			if (category.toLowerCase().includes(query)) {
				suggestions.push({
					text: category.replace("_", " "),
					type: "category",
				});
			}
		});

		// Benefit suggestions
		const benefits = [
			"memory", "focus", "energy", "sleep", "stress", "mood",
			"immune", "brain", "heart", "joint", "skin", "hair"
		];

		benefits.forEach((benefit) => {
			if (benefit.includes(query)) {
				suggestions.push({
					text: benefit,
					type: "benefit",
				});
			}
		});

		return suggestions.slice(0, MAX_SUGGESTIONS);
	}, [debouncedQuery, supplements]);

	// Fuzzy search implementation using simple string similarity
	const fuzzySearch = useCallback((text: string, query: string, threshold = 0.3): boolean => {
		const textLower = text.toLowerCase();
		const queryLower = query.toLowerCase();

		// Exact match gets highest score
		if (textLower === queryLower) return true;

		// Check if query is contained in text
		if (textLower.includes(queryLower)) return true;

		// Simple fuzzy matching using character overlap
		const queryChars = new Set(queryLower.split(''));
		const textChars = textLower.split('');
		const intersection = textChars.filter(char => queryChars.has(char));
		const union = new Set([...queryLower.split(''), ...textLower.split('')]);

		const jaccardSimilarity = intersection.length / union.size;

		return jaccardSimilarity >= threshold;
	}, []);

	// Calculate relevance score
	const calculateRelevanceScore = useCallback((supplement: any, query: string): number => {
		if (!query) return 0;

		let score = 0;
		const queryLower = query.toLowerCase();

		// Name matches (highest weight)
		if (supplement.name.toLowerCase().includes(queryLower)) {
			score += 10;
			if (supplement.name.toLowerCase().startsWith(queryLower)) score += 5;
		}

		// Polish name matches
		if (supplement.polishName?.toLowerCase().includes(queryLower)) {
			score += 8;
			if (supplement.polishName.toLowerCase().startsWith(queryLower)) score += 4;
		}

		// Description matches
		if (supplement.description?.toLowerCase().includes(queryLower)) score += 3;
		if (supplement.polishDescription?.toLowerCase().includes(queryLower)) score += 2;

		// Tags matches
		supplement.tags?.forEach((tag: string) => {
			if (tag.toLowerCase().includes(queryLower)) score += 4;
		});

		// Active compounds matches
		supplement.activeCompounds?.forEach((compound: any) => {
			if (compound.name.toLowerCase().includes(queryLower)) score += 6;
		});

		// Category matches
		if (supplement.category.toLowerCase().includes(queryLower.replace(/[^a-z]/g, ''))) {
			score += 5;
		}

		// Boost score for popular/well-rated supplements
		score += (supplement.userRating || 0) * 0.5;
		score += Math.log(supplement.studyCount || 1) * 0.3;

		return score;
	}, []);

	// Generate search results with highlighting
	const searchResults = useMemo(() => {
		if (!debouncedQuery || debouncedQuery.length < 2) return [];

		setIsSearching(true);
		const results: SearchResult[] = [];

		supplements.forEach((supplement) => {
			const matchedFields: string[] = [];
			const highlights: any = {};

			// Check name matches
			if (fuzzySearch(supplement.name, debouncedQuery)) {
				matchedFields.push("name");
				highlights.name = highlightText(supplement.name, debouncedQuery);
			}

			// Check Polish name matches
			if (supplement.polishName && fuzzySearch(supplement.polishName, debouncedQuery)) {
				matchedFields.push("polishName");
				highlights.polishName = highlightText(supplement.polishName, debouncedQuery);
			}

			// Check description matches
			if (supplement.description && fuzzySearch(supplement.description, debouncedQuery)) {
				matchedFields.push("description");
				highlights.description = highlightText(supplement.description, debouncedQuery);
			}

			// Check tags matches
			const matchedTags: string[] = [];
			supplement.tags?.forEach((tag: string) => {
				if (fuzzySearch(tag, debouncedQuery)) {
					matchedTags.push(highlightText(tag, debouncedQuery));
				}
			});
			if (matchedTags.length > 0) {
				matchedFields.push("tags");
				highlights.tags = matchedTags;
			}

			// Check active compounds
			supplement.activeCompounds?.forEach((compound: any) => {
				if (fuzzySearch(compound.name, debouncedQuery)) {
					matchedFields.push("compounds");
				}
			});

			// If we have matches, add to results
			if (matchedFields.length > 0) {
				results.push({
					id: supplement.id,
					name: supplement.name,
					polishName: supplement.polishName || supplement.name,
					category: supplement.category,
					description: supplement.description || "",
					evidenceLevel: supplement.evidenceLevel,
					safetyRating: supplement.safetyRating || 0,
					userRating: supplement.userRating || 0,
					matchedFields,
					relevanceScore: calculateRelevanceScore(supplement, debouncedQuery),
					highlights,
				});
			}
		});

		// Sort by relevance score
		results.sort((a, b) => b.relevanceScore - a.relevanceScore);

		setIsSearching(false);
		return results;
	}, [debouncedQuery, supplements, fuzzySearch, calculateRelevanceScore]);

	// Highlight text utility
	const highlightText = (text: string, query: string): string => {
		if (!query) return text;

		const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
		return text.replace(regex, '<mark>$1</mark>');
	};

	// Add search to history
	const addToHistory = useCallback((query: string, resultCount?: number) => {
		const newItem: SearchHistoryItem = {
			query,
			timestamp: Date.now(),
			resultCount,
		};

		setSearchHistory(prev => {
			const filtered = prev.filter(item => item.query !== query);
			const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
			saveSearchHistory(updated);
			return updated;
		});

		// Update popular queries
		setPopularQueries(prev => {
			const updated = [...prev];
			const existingIndex = updated.indexOf(query);

			if (existingIndex > -1) {
				updated.splice(existingIndex, 1);
			}

			updated.unshift(query);

			const trimmed = updated.slice(0, 20);
			localStorage.setItem(STORAGE_KEYS.POPULAR_QUERIES, JSON.stringify(trimmed));

			return trimmed;
		});
	}, [saveSearchHistory]);

	// Save search filters
	const saveSearch = useCallback((name: string, filters: SearchFilters) => {
		const newSavedSearch = {
			id: Date.now().toString(),
			name,
			filters,
			createdAt: new Date().toISOString(),
		};

		setSavedSearches(prev => {
			const updated = [newSavedSearch, ...prev];
			localStorage.setItem(STORAGE_KEYS.SAVED_SEARCHES, JSON.stringify(updated));
			return updated;
		});
	}, []);

	// Delete saved search
	const deleteSavedSearch = useCallback((id: string) => {
		setSavedSearches(prev => {
			const updated = prev.filter(search => search.id !== id);
			localStorage.setItem(STORAGE_KEYS.SAVED_SEARCHES, JSON.stringify(updated));
			return updated;
		});
	}, []);

	// Clear search history
	const clearHistory = useCallback(() => {
		setSearchHistory([]);
		localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
	}, []);

	return {
		// Search state
		searchQuery,
		setSearchQuery,
		debouncedQuery,
		isSearching,

		// Results and suggestions
		searchResults,
		searchSuggestions,

		// History and saved searches
		searchHistory,
		savedSearches,
		popularQueries,

		// Actions
		addToHistory,
		saveSearch,
		deleteSavedSearch,
		clearHistory,

		// Utilities
		highlightText,
	};
}