/**
 * Search Query Sanitizer
 * Prevents regex DoS attacks and optimizes search queries
 */

/**
 * Escapes special regex characters to prevent regex DoS attacks
 * @param text - User input text to escape
 * @returns Safely escaped text for use in regex
 */
export function escapeRegex(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Creates a safe case-insensitive regex pattern
 * @param query - User search query
 * @param options - Regex options
 * @returns Safe RegExp object
 */
export function createSafeRegex(
	query: string,
	options: { caseSensitive?: boolean; wholeWord?: boolean } = {},
): RegExp {
	const escaped = escapeRegex(query);
	const pattern = options.wholeWord ? `\\b${escaped}\\b` : escaped;
	const flags = options.caseSensitive ? "" : "i";

	return new RegExp(pattern, flags);
}

/**
 * Normalizes Polish text for better search matching
 * Removes diacritics and converts to lowercase
 * @param text - Text to normalize
 * @returns Normalized text
 */
export function normalizePolishText(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/ł/g, "l")
		.replace(/Ł/g, "l");
}

/**
 * Tokenizes search query into individual terms
 * @param query - Search query
 * @returns Array of search terms
 */
export function tokenizeQuery(query: string): string[] {
	return query
		.trim()
		.split(/\s+/)
		.filter((term) => term.length > 0);
}

/**
 * Builds optimized MongoDB text search query
 * Uses $text operator when available, falls back to regex
 * @param query - User search query
 * @param fields - Fields to search in
 * @param options - Search options
 * @returns MongoDB query object
 */
export function buildTextSearchQuery(
	query: string,
	fields: string[],
	options: {
		useTextIndex?: boolean;
		caseSensitive?: boolean;
		fuzzy?: boolean;
	} = {},
): any {
	const {
		useTextIndex = false,
		caseSensitive = false,
		fuzzy = false,
	} = options;

	// Use MongoDB text search if available
	if (useTextIndex) {
		return {
			$text: {
				$search: query,
				$caseSensitive: caseSensitive,
			},
		};
	}

	// Fall back to regex search
	const tokens = tokenizeQuery(query);
	const regexPatterns = tokens.map((token) =>
		createSafeRegex(token, { caseSensitive }),
	);

	// Build $or query for multiple fields
	const orConditions = fields.flatMap((field) =>
		regexPatterns.map((regex) => ({
			[field]: regex,
		})),
	);

	return { $or: orConditions };
}

/**
 * Validates search query length and complexity
 * @param query - Search query to validate
 * @param options - Validation options
 * @returns Validation result
 */
export function validateSearchQuery(
	query: string,
	options: {
		minLength?: number;
		maxLength?: number;
		maxTokens?: number;
	} = {},
): { valid: boolean; error?: string } {
	const { minLength = 1, maxLength = 200, maxTokens = 10 } = options;

	if (query.length < minLength) {
		return {
			valid: false,
			error: `Query too short (minimum ${minLength} characters)`,
		};
	}

	if (query.length > maxLength) {
		return {
			valid: false,
			error: `Query too long (maximum ${maxLength} characters)`,
		};
	}

	const tokens = tokenizeQuery(query);
	if (tokens.length > maxTokens) {
		return {
			valid: false,
			error: `Too many search terms (maximum ${maxTokens})`,
		};
	}

	return { valid: true };
}

/**
 * Builds optimized array search query for tags
 * Prefers exact matches over regex for better performance
 * @param query - Search query
 * @param field - Array field name (e.g., 'tags', 'polishTags')
 * @param exactMatches - Array of exact tag values to match
 * @returns MongoDB query object
 */
export function buildArraySearchQuery(
	query: string,
	field: string,
	exactMatches: string[] = [],
): any {
	// If we have exact matches, use $in for better performance
	if (exactMatches.length > 0) {
		return {
			[field]: { $in: exactMatches },
		};
	}

	// Fall back to regex for fuzzy matching
	const regex = createSafeRegex(query);
	return {
		[field]: { $in: [regex] },
	};
}

/**
 * Optimizes sort parameters for MongoDB
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort direction
 * @returns MongoDB sort object
 */
export function buildSortQuery(
	sortBy: string,
	sortOrder: "asc" | "desc" = "asc",
): Record<string, 1 | -1> {
	return {
		[sortBy]: sortOrder === "asc" ? 1 : -1,
	};
}

/**
 * Builds pagination parameters
 * @param page - Page number (1-based)
 * @param limit - Items per page
 * @returns Skip and limit values
 */
export function buildPaginationParams(
	page = 1,
	limit = 20,
): { skip: number; limit: number } {
	const safePage = Math.max(1, page);
	const safeLimit = Math.min(Math.max(1, limit), 100);

	return {
		skip: (safePage - 1) * safeLimit,
		limit: safeLimit,
	};
}
