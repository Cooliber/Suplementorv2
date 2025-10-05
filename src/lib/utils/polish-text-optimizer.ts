/**
 * Polish Text Optimization Utilities
 * Optimized text processing for Polish language with diacritics support
 */

// Polish diacritics mapping for normalization
const POLISH_DIACRITICS_MAP: Record<string, string> = {
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

// Common Polish medical/supplement terms for optimization
const POLISH_MEDICAL_TERMS = new Set([
	"suplement",
	"suplementy",
	"witamina",
	"witaminy",
	"minerał",
	"minerały",
	"kwasy",
	"tłuszczowe",
	"omega",
	"magnez",
	"wapń",
	"żelazo",
	"cynk",
	"neuroprzekaźnik",
	"neuroprzekaźniki",
	"dopamina",
	"serotonina",
	"gaba",
	"mózg",
	"pamięć",
	"koncentracja",
	"uwaga",
	"stres",
	"sen",
	"energia",
	"neuroplastyczność",
	"synapsa",
	"neuron",
	"receptory",
	"mechanizm",
	"badania",
	"skuteczność",
	"dawkowanie",
	"bezpieczeństwo",
	"interakcje",
]);

// Text processing cache for performance
const textProcessingCache = new Map<string, string>();
const searchCache = new Map<string, RegExp>();

// Performance monitoring
interface TextProcessingMetrics {
	totalProcessed: number;
	cacheHits: number;
	averageProcessingTime: number;
	lastCleanup: number;
}

const metrics: TextProcessingMetrics = {
	totalProcessed: 0,
	cacheHits: 0,
	averageProcessingTime: 0,
	lastCleanup: Date.now(),
};

/**
 * Normalize Polish text for search and comparison
 * Optimized with caching for better performance
 */
export function normalizePolishText(text: string): string {
	if (!text) return "";

	// Check cache first
	const cached = textProcessingCache.get(text);
	if (cached !== undefined) {
		metrics.cacheHits++;
		return cached;
	}

	const startTime = performance.now();

	// Normalize using NFD decomposition for better diacritics handling
	let normalized = text.normalize("NFD");

	// Remove diacritics using optimized character replacement
	normalized = normalized.replace(/[\u0300-\u036f]/g, "");

	// Convert to lowercase
	normalized = normalized.toLowerCase();

	// Cache the result
	textProcessingCache.set(text, normalized);

	// Update metrics
	const processingTime = performance.now() - startTime;
	metrics.totalProcessed++;
	metrics.averageProcessingTime =
		(metrics.averageProcessingTime * (metrics.totalProcessed - 1) +
			processingTime) /
		metrics.totalProcessed;

	// Cleanup cache if it gets too large
	if (textProcessingCache.size > 1000) {
		cleanupCache();
	}

	return normalized;
}

/**
 * Fast Polish text search with diacritics support
 * Optimized for graph node filtering
 */
export function createPolishSearchMatcher(
	searchTerm: string,
): (text: string) => boolean {
	if (!searchTerm) return () => true;

	const cacheKey = searchTerm.toLowerCase();
	let regex = searchCache.get(cacheKey);

	if (!regex) {
		// Normalize search term
		const normalizedTerm = normalizePolishText(searchTerm);

		// Escape special regex characters
		const escapedTerm = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

		// Create case-insensitive regex
		regex = new RegExp(escapedTerm, "i");
		searchCache.set(cacheKey, regex);
	}

	return (text: string) => {
		const normalizedText = normalizePolishText(text);
		return regex?.test(normalizedText);
	};
}

/**
 * Optimized Polish text highlighting for search results
 */
export function highlightPolishText(text: string, searchTerm: string): string {
	if (!searchTerm || !text) return text;

	const normalizedSearch = normalizePolishText(searchTerm);
	const normalizedText = normalizePolishText(text);

	// Find matches in normalized text
	const regex = new RegExp(
		`(${normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
		"gi",
	);
	const matches = normalizedText.match(regex);

	if (!matches) return text;

	// Highlight matches in original text (preserving diacritics)
	let highlightedText = text;
	let offset = 0;

	matches.forEach((match) => {
		const matchIndex = normalizedText.indexOf(match, offset);
		if (matchIndex !== -1) {
			// Find corresponding position in original text
			const originalMatch = text.substring(
				matchIndex,
				matchIndex + match.length,
			);
			const highlightedMatch = `<mark class="bg-yellow-200 px-1 rounded">${originalMatch}</mark>`;

			highlightedText = highlightedText.replace(
				originalMatch,
				highlightedMatch,
			);
			offset = matchIndex + match.length;
		}
	});

	return highlightedText;
}

/**
 * Truncate Polish text intelligently (avoiding breaking words with diacritics)
 */
export function truncatePolishText(
	text: string,
	maxLength: number,
	suffix = "...",
): string {
	if (!text || text.length <= maxLength) return text;

	// Find the last space before maxLength to avoid breaking words
	let truncateIndex = maxLength;
	for (let i = maxLength; i >= 0; i--) {
		if (text[i] === " ") {
			truncateIndex = i;
			break;
		}
	}

	// If no space found, truncate at maxLength
	if (truncateIndex === maxLength && text[maxLength] !== " ") {
		truncateIndex = maxLength;
	}

	return text.substring(0, truncateIndex).trim() + suffix;
}

/**
 * Sort Polish text array with proper locale support
 */
export function sortPolishTexts(texts: string[]): string[] {
	return texts.sort((a, b) =>
		a.localeCompare(b, "pl", {
			sensitivity: "base",
			numeric: true,
			ignorePunctuation: true,
		}),
	);
}

/**
 * Extract Polish keywords from text for indexing
 */
export function extractPolishKeywords(text: string, minLength = 3): string[] {
	if (!text) return [];

	const normalizedText = normalizePolishText(text);

	// Split into words and filter
	const words = normalizedText
		.split(/\s+/)
		.filter(
			(word) =>
				word.length >= minLength &&
				!isStopWord(word) &&
				/^[a-zA-Z0-9ąćęłńóśźż]+$/.test(word),
		);

	// Remove duplicates and sort
	return Array.from(new Set(words)).sort();
}

/**
 * Check if word is a Polish stop word
 */
function isStopWord(word: string): boolean {
	const polishStopWords = new Set([
		"i",
		"w",
		"z",
		"na",
		"do",
		"od",
		"po",
		"za",
		"o",
		"u",
		"a",
		"ale",
		"czy",
		"jak",
		"że",
		"się",
		"nie",
		"to",
		"co",
		"dla",
		"lub",
		"oraz",
		"przez",
		"przy",
		"bez",
		"pod",
		"nad",
	]);

	return polishStopWords.has(word.toLowerCase());
}

/**
 * Optimize Polish text for display in limited space
 */
export function optimizePolishTextForDisplay(
	text: string,
	maxLength: number,
	prioritizeKeywords = true,
): string {
	if (!text || text.length <= maxLength) return text;

	if (prioritizeKeywords) {
		// Try to preserve important medical terms
		const words = text.split(" ");
		const importantWords: string[] = [];
		const regularWords: string[] = [];

		words.forEach((word) => {
			const normalizedWord = normalizePolishText(word);
			if (POLISH_MEDICAL_TERMS.has(normalizedWord)) {
				importantWords.push(word);
			} else {
				regularWords.push(word);
			}
		});

		// Build optimized text starting with important words
		let optimizedText = importantWords.join(" ");

		// Add regular words if space allows
		for (const word of regularWords) {
			if (optimizedText.length + word.length + 1 <= maxLength - 3) {
				// -3 for ellipsis
				optimizedText += ` ${word}`;
			} else {
				break;
			}
		}

		return optimizedText.length < text.length
			? `${optimizedText}...`
			: optimizedText;
	}

	return truncatePolishText(text, maxLength);
}

/**
 * Batch process multiple Polish texts for better performance
 */
export function batchProcessPolishTexts(
	texts: string[],
	processor: (text: string) => string,
): string[] {
	const batchSize = 100;
	const results: string[] = [];

	for (let i = 0; i < texts.length; i += batchSize) {
		const batch = texts.slice(i, i + batchSize);
		const batchResults = batch.map(processor);
		results.push(...batchResults);

		// Allow other tasks to run between batches
		if (i + batchSize < texts.length) {
			setTimeout(() => {}, 0);
		}
	}

	return results;
}

/**
 * Clean up processing caches to prevent memory leaks
 */
function cleanupCache(): void {
	const now = Date.now();

	// Clean up every 5 minutes
	if (now - metrics.lastCleanup > 5 * 60 * 1000) {
		textProcessingCache.clear();
		searchCache.clear();
		metrics.lastCleanup = now;

		console.log("Polish text processing cache cleaned up");
	}
}

/**
 * Get text processing performance metrics
 */
export function getTextProcessingMetrics(): TextProcessingMetrics {
	return { ...metrics };
}

/**
 * Reset text processing metrics
 */
export function resetTextProcessingMetrics(): void {
	metrics.totalProcessed = 0;
	metrics.cacheHits = 0;
	metrics.averageProcessingTime = 0;
	metrics.lastCleanup = Date.now();
}

/**
 * Validate Polish text encoding
 */
export function validatePolishTextEncoding(text: string): boolean {
	try {
		// Check if text can be properly encoded/decoded
		const encoded = encodeURIComponent(text);
		const decoded = decodeURIComponent(encoded);

		// Check if Polish characters are preserved
		const polishChars = text.match(/[ąćęłńóśźż]/gi);
		const decodedPolishChars = decoded.match(/[ąćęłńóśźż]/gi);

		return polishChars?.length === decodedPolishChars?.length;
	} catch (error) {
		console.warn("Polish text encoding validation failed:", error);
		return false;
	}
}

/**
 * Optimize Polish text for search indexing
 */
export function optimizeForSearchIndex(text: string): {
	normalized: string;
	keywords: string[];
	searchable: string;
} {
	const normalized = normalizePolishText(text);
	const keywords = extractPolishKeywords(text);
	const searchable = [normalized, ...keywords].join(" ");

	return {
		normalized,
		keywords,
		searchable,
	};
}

// Export cache management functions for external use
export const cacheManager = {
	clear: () => {
		textProcessingCache.clear();
		searchCache.clear();
	},
	size: () => ({
		textCache: textProcessingCache.size,
		searchCache: searchCache.size,
	}),
	cleanup: cleanupCache,
};
