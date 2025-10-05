/**
 * Polish Search Service with NLP
 * Advanced search functionality with Polish language processing
 * Handles Polish characters, stemming, synonyms, and fuzzy matching
 */

import type { EvidenceLevel, SupplementCategory } from "@/types/supplement";

// Polish character normalization map
const POLISH_CHAR_MAP: Record<string, string> = {
	ą: "a",
	ć: "c",
	ę: "e",
	ł: "l",
	ń: "n",
	ó: "o",
	ś: "s",
	ź: "z",
	ż: "z",
	Ą: "A",
	Ć: "C",
	Ę: "E",
	Ł: "L",
	Ń: "N",
	Ó: "O",
	Ś: "S",
	Ź: "Z",
	Ż: "Z",
};

// Polish medical terminology synonyms
const POLISH_SYNONYMS: Record<string, string[]> = {
	pamięć: [
		"zapamiętywanie",
		"przypominanie",
		"pamięć krótkotrwała",
		"pamięć długotrwała",
	],
	koncentracja: ["uwaga", "skupienie", "focus"],
	lęk: ["niepokój", "stres", "anxiety"],
	depresja: ["przygnębienie", "smutek", "obniżony nastrój"],
	sen: ["bezsenność", "insomnia", "zaburzenia snu"],
	energia: ["zmęczenie", "witalność", "siła"],
	mózg: ["móżdżek", "kora mózgowa", "hipokamp", "neurony"],
	nootropik: ["nootropowy", "kognitywny", "cognitive enhancer"],
	witamina: ["witaminy", "suplementacja witaminowa"],
	minerał: ["minerały", "pierwiastki śladowe"],
	aminokwas: ["aminokwasy", "białko", "protein"],
	zioło: ["ziołowy", "roślinny", "herbal"],
	adaptogen: ["adaptogenny", "adaptogeny"],
};

// Common Polish stopwords to filter out
const POLISH_STOPWORDS = new Set([
	"i",
	"w",
	"na",
	"z",
	"do",
	"o",
	"dla",
	"po",
	"od",
	"przez",
	"przy",
	"ze",
	"się",
	"to",
	"jest",
	"są",
	"był",
	"była",
	"było",
	"jak",
	"co",
	"czy",
	"który",
	"która",
	"które",
	"ten",
	"ta",
	"te",
]);

export interface PolishSearchOptions {
	query: string;
	language?: "pl" | "en";
	fuzzyMatch?: boolean;
	includeSynonyms?: boolean;
	categories?: SupplementCategory[];
	evidenceLevels?: EvidenceLevel[];
	minEffectiveness?: number; // 0-10
}

export interface SearchResult {
	id: string;
	name: string;
	polishName: string;
	category: SupplementCategory;
	relevanceScore: number;
	matchedTerms: string[];
	snippet: string;
}

export class PolishSearchService {
	/**
	 * Normalize Polish characters to ASCII equivalents
	 */
	private normalizePolish(text: string): string {
		return text
			.split("")
			.map((char) => POLISH_CHAR_MAP[char] || char)
			.join("");
	}

	/**
	 * Remove Polish stopwords from text
	 */
	private removeStopwords(words: string[]): string[] {
		return words.filter((word) => !POLISH_STOPWORDS.has(word.toLowerCase()));
	}

	/**
	 * Simple Polish stemming (remove common suffixes)
	 */
	private stemPolish(word: string): string {
		const lowerWord = word.toLowerCase();

		// Remove common Polish suffixes
		const suffixes = [
			"ach",
			"ami",
			"ów",
			"om",
			"em",
			"ie",
			"ą",
			"ę",
			"y",
			"i",
			"a",
			"o",
			"u",
		];

		for (const suffix of suffixes) {
			if (lowerWord.endsWith(suffix) && lowerWord.length > suffix.length + 2) {
				return lowerWord.slice(0, -suffix.length);
			}
		}

		return lowerWord;
	}

	/**
	 * Expand query with Polish synonyms
	 */
	private expandWithSynonyms(words: string[]): string[] {
		const expanded = new Set(words);

		for (const word of words) {
			const lowerWord = word.toLowerCase();

			// Check if word has synonyms
			for (const [key, synonyms] of Object.entries(POLISH_SYNONYMS)) {
				if (lowerWord.includes(key) || key.includes(lowerWord)) {
					synonyms.forEach((syn) => expanded.add(syn));
				}
			}
		}

		return Array.from(expanded);
	}

	/**
	 * Calculate Levenshtein distance for fuzzy matching
	 */
	private levenshteinDistance(str1: string, str2: string): number {
		const matrix: number[][] = [];

		for (let i = 0; i <= str2.length; i++) {
			matrix[i] = [i];
		}

		for (let j = 0; j <= str1.length; j++) {
			const row = matrix[0];
			if (row) {
				row[j] = j;
			}
		}

		for (let i = 1; i <= str2.length; i++) {
			for (let j = 1; j <= str1.length; j++) {
				const currentRow = matrix[i];
				const prevRow = matrix[i - 1];

				if (!currentRow || !prevRow) continue;

				if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
					currentRow[j] = prevRow[j - 1] ?? 0;
				} else {
					currentRow[j] = Math.min(
						(prevRow[j - 1] ?? 0) + 1, // substitution
						(currentRow[j - 1] ?? 0) + 1, // insertion
						(prevRow[j] ?? 0) + 1, // deletion
					);
				}
			}
		}

		const lastRow = matrix[str2.length];
		return lastRow?.[str1.length] ?? 0;
	}

	/**
	 * Check if two words are similar (fuzzy match)
	 */
	private isFuzzyMatch(word1: string, word2: string, threshold = 2): boolean {
		const distance = this.levenshteinDistance(
			word1.toLowerCase(),
			word2.toLowerCase(),
		);
		const maxLength = Math.max(word1.length, word2.length);

		// Allow distance based on word length
		const allowedDistance = Math.min(threshold, Math.floor(maxLength * 0.3));

		return distance <= allowedDistance;
	}

	/**
	 * Process search query with Polish NLP
	 */
	processQuery(
		query: string,
		options: Partial<PolishSearchOptions> = {},
	): {
		normalizedQuery: string;
		searchTerms: string[];
		stemmedTerms: string[];
		expandedTerms: string[];
	} {
		// Normalize Polish characters
		const normalized = this.normalizePolish(query);

		// Tokenize
		const words = query.toLowerCase().split(/\s+/);

		// Remove stopwords
		const filtered = this.removeStopwords(words);

		// Stem words
		const stemmed = filtered.map((word) => this.stemPolish(word));

		// Expand with synonyms if requested
		const expanded = options.includeSynonyms
			? this.expandWithSynonyms(filtered)
			: filtered;

		return {
			normalizedQuery: normalized,
			searchTerms: filtered,
			stemmedTerms: stemmed,
			expandedTerms: expanded,
		};
	}

	/**
	 * Calculate relevance score for a supplement
	 */
	calculateRelevance(
		supplement: {
			name: string;
			polishName: string;
			description?: string;
			polishDescription: string;
			tags?: string[];
			category: string;
		},
		processedQuery: {
			searchTerms: string[];
			stemmedTerms: string[];
			expandedTerms: string[];
		},
		options: Partial<PolishSearchOptions> = {},
	): { score: number; matchedTerms: string[] } {
		let score = 0;
		const matchedTerms: string[] = [];

		const searchableText = [
			supplement.polishName,
			supplement.name,
			supplement.polishDescription,
			supplement.description || "",
			...(supplement.tags || []),
		]
			.join(" ")
			.toLowerCase();

		// Exact name match (highest priority)
		for (const term of processedQuery.searchTerms) {
			if (supplement.polishName.toLowerCase().includes(term)) {
				score += 100;
				matchedTerms.push(term);
			}
			if (supplement.name.toLowerCase().includes(term)) {
				score += 80;
				matchedTerms.push(term);
			}
		}

		// Stemmed match
		for (const stemmed of processedQuery.stemmedTerms) {
			if (searchableText.includes(stemmed)) {
				score += 50;
			}
		}

		// Expanded terms (synonyms)
		for (const expanded of processedQuery.expandedTerms) {
			if (searchableText.includes(expanded.toLowerCase())) {
				score += 30;
				matchedTerms.push(expanded);
			}
		}

		// Fuzzy matching if enabled
		if (options.fuzzyMatch) {
			const words = searchableText.split(/\s+/);
			for (const term of processedQuery.searchTerms) {
				for (const word of words) {
					if (this.isFuzzyMatch(term, word)) {
						score += 20;
						matchedTerms.push(word);
					}
				}
			}
		}

		// Category boost
		if (
			options.categories?.includes(supplement.category as SupplementCategory)
		) {
			score += 10;
		}

		return { score, matchedTerms: [...new Set(matchedTerms)] };
	}

	/**
	 * Generate search snippet with highlighted terms
	 */
	generateSnippet(
		text: string,
		matchedTerms: string[],
		maxLength = 200,
	): string {
		if (!matchedTerms.length) {
			return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
		}

		// Find first occurrence of any matched term
		let startIndex = 0;
		for (const term of matchedTerms) {
			const index = text.toLowerCase().indexOf(term.toLowerCase());
			if (index !== -1) {
				startIndex = Math.max(0, index - 50);
				break;
			}
		}

		const snippet = text.slice(startIndex, startIndex + maxLength);
		return (
			(startIndex > 0 ? "..." : "") +
			snippet +
			(startIndex + maxLength < text.length ? "..." : "")
		);
	}
}

// Export singleton instance
export const polishSearchService = new PolishSearchService();
