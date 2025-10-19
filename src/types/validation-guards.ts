/**
 * =================================================================
 * COMPREHENSIVE TYPE GUARDS AND VALIDATION UTILITIES
 *
 * Runtime type checking, validation functions, and type guards
 * for all content types in the suplementor system.
 * =================================================================
 */

import type { ContentStatus, ContentType } from "./content-management";
import type {
	ContentDomain,
	CulturalContext,
	Language,
	Region,
} from "./cultural-localization";
import type {
	DifficultyLevel as DocDifficulty,
	DocumentationStatus,
	DocumentationType,
} from "./documentation";
import type {
	ActivityType,
	GamificationCategory,
	RarityLevel,
	RewardType,
} from "./gamification";

// ----------------------------------------------------------------
// 1. BASIC TYPE GUARDS
// ----------------------------------------------------------------

/**
 * Type guard for Language type
 */
export const isValidLanguage = (value: unknown): value is Language => {
	const validLanguages: Language[] = [
		"pl",
		"en",
		"de",
		"fr",
		"es",
		"it",
		"ru",
		"zh",
		"ja",
		"ko",
	];
	return (
		typeof value === "string" && validLanguages.includes(value as Language)
	);
};

/**
 * Type guard for Region type
 */
export const isValidRegion = (value: unknown): value is Region => {
	const validRegions: Region[] = [
		"PL",
		"US",
		"GB",
		"DE",
		"FR",
		"ES",
		"IT",
		"RU",
		"CN",
		"JP",
		"KR",
		"EU",
	];
	return typeof value === "string" && validRegions.includes(value as Region);
};

/**
 * Type guard for ContentDomain type
 */
export const isValidContentDomain = (
	value: unknown,
): value is ContentDomain => {
	const validDomains: ContentDomain[] = [
		"medical",
		"scientific",
		"educational",
		"commercial",
		"social",
		"technical",
		"legal",
		"cultural",
	];
	return (
		typeof value === "string" && validDomains.includes(value as ContentDomain)
	);
};

/**
 * Type guard for CulturalContext type
 */
export const isValidCulturalContext = (
	value: unknown,
): value is CulturalContext => {
	const validContexts: CulturalContext[] = [
		"formal",
		"informal",
		"academic",
		"medical",
		"business",
		"casual",
		"traditional",
		"modern",
	];
	return (
		typeof value === "string" &&
		validContexts.includes(value as CulturalContext)
	);
};

/**
 * Type guard for DocumentationType type
 */
export const isValidDocumentationType = (
	value: unknown,
): value is DocumentationType => {
	const validTypes: DocumentationType[] = [
		"guide",
		"tutorial",
		"faq",
		"reference",
		"api",
		"troubleshooting",
		"best_practices",
		"changelog",
	];
	return (
		typeof value === "string" && validTypes.includes(value as DocumentationType)
	);
};

/**
 * Type guard for DocumentationStatus type
 */
export const isValidDocumentationStatus = (
	value: unknown,
): value is DocumentationStatus => {
	const validStatuses: DocumentationStatus[] = [
		"draft",
		"review",
		"published",
		"archived",
		"deprecated",
	];
	return (
		typeof value === "string" &&
		validStatuses.includes(value as DocumentationStatus)
	);
};

/**
 * Type guard for GamificationCategory type
 */
export const isValidGamificationCategory = (
	value: unknown,
): value is GamificationCategory => {
	const validCategories: GamificationCategory[] = [
		"learning",
		"social",
		"exploration",
		"mastery",
		"consistency",
		"quality",
		"innovation",
	];
	return (
		typeof value === "string" &&
		validCategories.includes(value as GamificationCategory)
	);
};

/**
 * Type guard for RarityLevel type
 */
export const isValidRarityLevel = (value: unknown): value is RarityLevel => {
	const validRarities: RarityLevel[] = [
		"common",
		"uncommon",
		"rare",
		"epic",
		"legendary",
		"mythic",
	];
	return (
		typeof value === "string" && validRarities.includes(value as RarityLevel)
	);
};

/**
 * Type guard for RewardType type
 */
export const isValidRewardType = (value: unknown): value is RewardType => {
	const validTypes: RewardType[] = [
		"xp",
		"badge",
		"title",
		"cosmetic",
		"feature",
		"currency",
	];
	return typeof value === "string" && validTypes.includes(value as RewardType);
};

/**
 * Type guard for ActivityType type
 */
export const isValidActivityType = (value: unknown): value is ActivityType => {
	const validTypes: ActivityType[] = [
		"quiz_completion",
		"module_completion",
		"streak",
		"social_interaction",
		"content_creation",
		"quality_contribution",
	];
	return (
		typeof value === "string" && validTypes.includes(value as ActivityType)
	);
};

/**
 * Type guard for ContentType type
 */
export const isValidContentType = (value: unknown): value is ContentType => {
	const validTypes: ContentType[] = [
		"article",
		"tutorial",
		"faq",
		"guide",
		"research",
		"supplement",
		"mechanism",
		"interaction",
		"safety",
		"clinical",
		"educational",
		"gamification",
		"cultural",
		"documentation",
	];
	return typeof value === "string" && validTypes.includes(value as ContentType);
};

/**
 * Type guard for ContentStatus type
 */
export const isValidContentStatus = (
	value: unknown,
): value is ContentStatus => {
	const validStatuses: ContentStatus[] = [
		"draft",
		"review",
		"approved",
		"published",
		"archived",
		"deprecated",
		"pending_translation",
		"translation_review",
		"cultural_review",
		"technical_review",
	];
	return (
		typeof value === "string" && validStatuses.includes(value as ContentStatus)
	);
};

// ----------------------------------------------------------------
// 2. COMPLEX TYPE GUARDS
// ----------------------------------------------------------------

/**
 * Type guard for objects with required string fields
 */
export const hasRequiredStringFields = (
	obj: unknown,
	fields: string[],
): obj is Record<string, string> => {
	if (!obj || typeof obj !== "object") return false;
	return fields.every(
		(field) =>
			field in obj &&
			typeof (obj as Record<string, unknown>)[field] === "string",
	);
};

/**
 * Type guard for objects with optional string fields
 */
export const hasOptionalStringFields = (
	obj: unknown,
	fields: string[],
): obj is Record<string, string | undefined> => {
	if (!obj || typeof obj !== "object") return false;
	return fields.every(
		(field) =>
			!(field in obj) ||
			typeof (obj as Record<string, unknown>)[field] === "string" ||
			(obj as Record<string, unknown>)[field] === undefined,
	);
};

/**
 * Type guard for objects with numeric fields
 */
export const hasNumericFields = (
	obj: unknown,
	fields: string[],
): obj is Record<string, number> => {
	if (!obj || typeof obj !== "object") return false;
	return fields.every(
		(field) =>
			field in obj &&
			typeof (obj as Record<string, unknown>)[field] === "number",
	);
};

/**
 * Type guard for objects with boolean fields
 */
export const hasBooleanFields = (
	obj: unknown,
	fields: string[],
): obj is Record<string, boolean> => {
	if (!obj || typeof obj !== "object") return false;
	return fields.every(
		(field) =>
			field in obj &&
			typeof (obj as Record<string, unknown>)[field] === "boolean",
	);
};

/**
 * Type guard for objects with array fields
 */
export const hasArrayFields = (
	obj: unknown,
	fields: string[],
): obj is Record<string, unknown[]> => {
	if (!obj || typeof obj !== "object") return false;
	return fields.every(
		(field) =>
			field in obj && Array.isArray((obj as Record<string, unknown>)[field]),
	);
};

/**
 * Type guard for objects with date fields
 */
export const hasDateFields = (
	obj: unknown,
	fields: string[],
): obj is Record<string, string> => {
	if (!obj || typeof obj !== "object") return false;
	return fields.every((field) => {
		const value = (obj as Record<string, unknown>)[field];
		return value && (typeof value === "string" || value instanceof Date);
	});
};

// ----------------------------------------------------------------
// 3. VALIDATION UTILITIES
// ----------------------------------------------------------------

/**
 * Validation result interface
 */
export interface ValidationResult<T = unknown> {
	success: boolean;
	data?: T;
	errors: ValidationError[];
	warnings: ValidationWarning[];
}

/**
 * Validation error interface
 */
export interface ValidationError {
	field: string;
	message: string;
	polishMessage?: string;
	code: string;
	severity: "error" | "warning" | "info";
	path?: string;
}

/**
 * Validation warning interface
 */
export interface ValidationWarning {
	field: string;
	message: string;
	polishMessage?: string;
	suggestion?: string;
	severity: "low" | "medium" | "high";
	path?: string;
}

/**
 * Validates string length constraints
 */
export const validateStringLength = (
	value: unknown,
	min?: number,
	max?: number,
	fieldName = "field",
): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (typeof value !== "string") {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be a string`,
			code: "INVALID_TYPE",
			severity: "error",
		});
		return errors;
	}

	if (min !== undefined && value.length < min) {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be at least ${min} characters`,
			code: "MIN_LENGTH",
			severity: "error",
		});
	}

	if (max !== undefined && value.length > max) {
		errors.push({
			field: fieldName,
			message: `${fieldName} must not exceed ${max} characters`,
			code: "MAX_LENGTH",
			severity: "error",
		});
	}

	return errors;
};

/**
 * Validates numeric range constraints
 */
export const validateNumberRange = (
	value: unknown,
	min?: number,
	max?: number,
	fieldName = "field",
): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (typeof value !== "number" || Number.isNaN(value)) {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be a valid number`,
			code: "INVALID_TYPE",
			severity: "error",
		});
		return errors;
	}

	if (min !== undefined && value < min) {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be at least ${min}`,
			code: "MIN_VALUE",
			severity: "error",
		});
	}

	if (max !== undefined && value > max) {
		errors.push({
			field: fieldName,
			message: `${fieldName} must not exceed ${max}`,
			code: "MAX_VALUE",
			severity: "error",
		});
	}

	return errors;
};

/**
 * Validates array constraints
 */
export const validateArray = (
	value: unknown,
	minItems?: number,
	maxItems?: number,
	itemValidator?: (item: unknown) => ValidationError[],
	fieldName = "field",
): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (!Array.isArray(value)) {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be an array`,
			code: "INVALID_TYPE",
			severity: "error",
		});
		return errors;
	}

	if (minItems !== undefined && value.length < minItems) {
		errors.push({
			field: fieldName,
			message: `${fieldName} must contain at least ${minItems} items`,
			code: "MIN_ITEMS",
			severity: "error",
		});
	}

	if (maxItems !== undefined && value.length > maxItems) {
		errors.push({
			field: fieldName,
			message: `${fieldName} must not exceed ${maxItems} items`,
			code: "MAX_ITEMS",
			severity: "error",
		});
	}

	if (itemValidator) {
		value.forEach((item, index) => {
			const itemErrors = itemValidator(item);
			itemErrors.forEach((error) => {
				errors.push({
					...error,
					field: `${fieldName}[${index}].${error.field}`,
					path: `${fieldName}[${index}]`,
				});
			});
		});
	}

	return errors;
};

/**
 * Validates email format
 */
export const validateEmail = (
	value: unknown,
	fieldName = "email",
): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (typeof value !== "string") {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be a string`,
			code: "INVALID_TYPE",
			severity: "error",
		});
		return errors;
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(value)) {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be a valid email address`,
			code: "INVALID_FORMAT",
			severity: "error",
		});
	}

	return errors;
};

/**
 * Validates URL format
 */
export const validateUrl = (
	value: unknown,
	fieldName = "url",
): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (typeof value !== "string") {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be a string`,
			code: "INVALID_TYPE",
			severity: "error",
		});
		return errors;
	}

	try {
		new URL(value);
	} catch {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be a valid URL`,
			code: "INVALID_FORMAT",
			severity: "error",
		});
	}

	return errors;
};

/**
 * Validates date format (ISO 8601)
 */
export const validateDate = (
	value: unknown,
	fieldName = "date",
): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (typeof value !== "string" && !(value instanceof Date)) {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be a string or Date`,
			code: "INVALID_TYPE",
			severity: "error",
		});
		return errors;
	}

	const dateValue = typeof value === "string" ? value : value.toISOString();
	const date = new Date(dateValue);

	if (Number.isNaN(date.getTime())) {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be a valid date`,
			code: "INVALID_FORMAT",
			severity: "error",
		});
	}

	return errors;
};

/**
 * Validates enum values
 */
export const validateEnum = <T extends Record<string, string | number>>(
	value: unknown,
	enumObject: T,
	fieldName = "field",
): ValidationError[] => {
	const errors: ValidationError[] = [];
	const validValues = Object.values(enumObject);

	if (!validValues.includes(value as T[keyof T])) {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be one of: ${validValues.join(", ")}`,
			code: "INVALID_ENUM",
			severity: "error",
		});
	}

	return errors;
};

// ----------------------------------------------------------------
// 4. COMPREHENSIVE VALIDATION FUNCTIONS
// ----------------------------------------------------------------

/**
 * Validates Polish text (including diacritics)
 */
export const validatePolishText = (
	value: unknown,
	fieldName = "text",
): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (typeof value !== "string") {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be a string`,
			code: "INVALID_TYPE",
			severity: "error",
		});
		return errors;
	}

	// Check for Polish diacritics and characters
	const polishRegex = /^[a-zA-ZąĄćĆęĘłŁńŃóÓśŚźŹżŻ\s\-.,!?'"()]+$/;
	if (!polishRegex.test(value)) {
		errors.push({
			field: fieldName,
			message: `${fieldName} contains invalid characters for Polish text`,
			code: "INVALID_POLISH_CHARS",
			severity: "error",
		});
	}

	return errors;
};

/**
 * Validates scientific/medical terminology
 */
export const validateScientificTerminology = (
	value: unknown,
	fieldName = "term",
): ValidationError[] => {
	const errors: ValidationError[] = [];

	const stringErrors = validateStringLength(value, 2, 100, fieldName);
	errors.push(...stringErrors);

	if (errors.length > 0) return errors;

	const term = value as string;

	// Check for proper scientific formatting
	if (term.includes("  ")) {
		errors.push({
			field: fieldName,
			message: `${fieldName} contains double spaces`,
			code: "DOUBLE_SPACES",
			severity: "warning",
		});
	}

	// Check for proper capitalization
	if (term.length > 0 && !/^[A-Z]/.test(term)) {
		errors.push({
			field: fieldName,
			message: `${fieldName} should start with a capital letter`,
			code: "CAPITALIZATION",
			severity: "warning",
		});
	}

	return errors;
};

/**
 * Validates evidence levels and citations
 */
export const validateEvidenceLevel = (
	value: unknown,
	fieldName = "evidenceLevel",
): ValidationError[] => {
	const errors: ValidationError[] = [];

	const validLevels = [
		"STRONG",
		"MODERATE",
		"WEAK",
		"INSUFFICIENT",
		"CONFLICTING",
	];
	const stringErrors = validateStringLength(value, 1, 20, fieldName);
	errors.push(...stringErrors);

	if (errors.length > 0) return errors;

	if (!validLevels.includes((value as string).toUpperCase())) {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be one of: ${validLevels.join(", ")}`,
			code: "INVALID_EVIDENCE_LEVEL",
			severity: "error",
		});
	}

	return errors;
};

/**
 * Validates citations and references
 */
export const validateCitation = (
	value: unknown,
	fieldName = "citation",
): ValidationError[] => {
	const errors: ValidationError[] = [];

	if (typeof value !== "string") {
		errors.push({
			field: fieldName,
			message: `${fieldName} must be a string`,
			code: "INVALID_TYPE",
			severity: "error",
		});
		return errors;
	}

	// Check for PMID format
	if (value.startsWith("PMID:")) {
		const pmid = value.substring(5);
		if (!/^\d+$/.test(pmid)) {
			errors.push({
				field: fieldName,
				message: `${fieldName} PMID must contain only numbers after 'PMID:'`,
				code: "INVALID_PMID_FORMAT",
				severity: "error",
			});
		}
	}

	// Check for DOI format
	if (value.startsWith("doi:")) {
		const doi = value.substring(4);
		if (!/^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i.test(doi)) {
			errors.push({
				field: fieldName,
				message: `${fieldName} DOI format is invalid`,
				code: "INVALID_DOI_FORMAT",
				severity: "error",
			});
		}
	}

	return errors;
};

// ----------------------------------------------------------------
// 5. BATCH VALIDATION UTILITIES
// ----------------------------------------------------------------

/**
 * Validates an array of items with a validator function
 */
export const validateArrayItems = <T>(
	items: T[],
	validator: (item: T) => ValidationResult<T>,
	fieldName = "items",
): ValidationResult<T[]> => {
	const errors: ValidationError[] = [];
	const warnings: ValidationWarning[] = [];
	const validItems: T[] = [];

	items.forEach((item, index) => {
		const result = validator(item);

		if (result.success && result.data !== undefined) {
			validItems.push(result.data as T);
		} else {
			result.errors.forEach((error) => {
				errors.push({
					...error,
					field: `${fieldName}[${index}].${error.field}`,
					path: `${fieldName}[${index}]`,
				});
			});
		}

		result.warnings.forEach((warning) => {
			warnings.push({
				...warning,
				field: `${fieldName}[${index}].${warning.field}`,
				path: `${fieldName}[${index}]`,
			});
		});
	});

	return {
		success: errors.length === 0,
		data: validItems,
		errors,
		warnings,
	};
};

/**
 * Validates an object with a schema
 */
export const validateObject = <T extends Record<string, unknown>>(
	obj: unknown,
	schema: Record<string, (value: unknown) => ValidationError[]>,
	requiredFields: string[] = [],
): ValidationResult<T> => {
	const errors: ValidationError[] = [];
	const warnings: ValidationWarning[] = [];

	if (!obj || typeof obj !== "object") {
		errors.push({
			field: "object",
			message: "Value must be an object",
			code: "INVALID_TYPE",
			severity: "error",
		});
		return { success: false, errors, warnings };
	}

	const object = obj as Record<string, unknown>;

	// Validate required fields
	requiredFields.forEach((field) => {
		if (
			!(field in object) ||
			object[field as string] === null ||
			object[field as string] === undefined
		) {
			errors.push({
				field: field as string,
				message: `${field as string} is required`,
				code: "REQUIRED_FIELD",
				severity: "error",
			});
		}
	});

	// Validate each field in schema
	Object.entries(schema).forEach(([field, validator]) => {
		if (field in object) {
			const fieldErrors = validator(object[field]);
			fieldErrors.forEach((error) => {
				errors.push({
					...error,
					field: `${field}.${error.field}`,
				});
			});
		}
	});

	return {
		success: errors.length === 0,
		data: object as T,
		errors,
		warnings,
	};
};

// ----------------------------------------------------------------
// 6. TYPE ASSERTION UTILITIES
// ----------------------------------------------------------------

/**
 * Asserts that a value is of a specific type, throwing an error if not
 */
export const assertType = <T>(
	value: unknown,
	guard: (value: unknown) => value is T,
	typeName: string,
): T => {
	if (!guard(value)) {
		throw new Error(`Expected ${typeName}, but received ${typeof value}`);
	}
	return value;
};

/**
 * Safely casts a value to a specific type with validation
 */
export const safeCast = <T>(
	value: unknown,
	guard: (value: unknown) => value is T,
	typeName: string,
): T | null => {
	try {
		return assertType(value, guard, typeName);
	} catch {
		return null;
	}
};

/**
 * Validates and transforms data with comprehensive error reporting
 */
export const validateAndTransform = <TInput, TOutput>(
	input: TInput,
	validator: (input: TInput) => ValidationResult<TOutput>,
): ValidationResult<TOutput> => {
	return validator(input);
};

// ----------------------------------------------------------------
// 7. RUNTIME TYPE CHECKING UTILITIES
// ----------------------------------------------------------------

/**
 * Checks if a value matches a type pattern at runtime
 */
export const matchesType = (value: unknown, pattern: TypePattern): boolean => {
	switch (pattern.type) {
		case "string":
			return (
				typeof value === "string" &&
				(!pattern.minLength || value.length >= pattern.minLength) &&
				(!pattern.maxLength || value.length <= pattern.maxLength)
			);

		case "number":
			if (typeof value !== "number" || Number.isNaN(value)) return false;
			return (
				(!pattern.minimum || value >= pattern.minimum) &&
				(!pattern.maximum || value <= pattern.maximum)
			);

		case "boolean":
			return typeof value === "boolean";

		case "array":
			if (!Array.isArray(value)) return false;
			if (pattern.minItems && value.length < pattern.minItems) return false;
			if (pattern.maxItems && value.length > pattern.maxItems) return false;
			if (pattern.itemPattern) {
				return value.every((item) => matchesType(item, pattern.itemPattern!));
			}
			return true;

		case "object": {
			if (!value || typeof value !== "object" || Array.isArray(value))
				return false;
			const obj = value as Record<string, unknown>;

			// Check required fields
			if (pattern.requiredFields) {
				for (const field of pattern.requiredFields) {
					if (!(field in obj)) return false;
				}
			}

			// Check field patterns
			if (pattern.fields) {
				for (const [field, fieldPattern] of Object.entries(pattern.fields)) {
					if (field in obj && !matchesType(obj[field], fieldPattern)) {
						return false;
					}
				}
			}

			return true;
		}

		case "enum":
			return pattern.values ? pattern.values.includes(value) : false;

		case "union":
			return pattern.patterns
				? pattern.patterns.some((p) => matchesType(value, p))
				: false;

		default:
			return false;
	}
};

/**
 * Type pattern for runtime type checking
 */
export interface TypePattern {
	type: "string" | "number" | "boolean" | "array" | "object" | "enum" | "union";
	minLength?: number;
	maxLength?: number;
	minimum?: number;
	maximum?: number;
	minItems?: number;
	maxItems?: number;
	itemPattern?: TypePattern;
	requiredFields?: string[];
	fields?: Record<string, TypePattern>;
	values?: unknown[];
	patterns?: TypePattern[];
}

// ----------------------------------------------------------------
// 8. PERFORMANCE AND MEMORY UTILITIES
// ----------------------------------------------------------------

/**
 * Validates large datasets efficiently
 */
export const validateBatch = async <T>(
	items: T[],
	validator: (item: T) => Promise<ValidationResult>,
	concurrency = 10,
): Promise<ValidationResult<T[]>> => {
	const errors: ValidationError[] = [];
	const warnings: ValidationWarning[] = [];
	const validItems: T[] = [];

	// Process items in batches for better performance
	for (let i = 0; i < items.length; i += concurrency) {
		const batch = items.slice(i, i + concurrency);
		const batchPromises = batch.map(validator);
		const batchResults = await Promise.all(batchPromises);

		batchResults.forEach((result, index) => {
			const itemIndex = i + index;

			if (result.success && result.data !== undefined) {
				validItems.push(result.data as T);
			} else {
				result.errors.forEach((error) => {
					errors.push({
						...error,
						field: `items[${itemIndex}].${error.field}`,
						path: `items[${itemIndex}]`,
					});
				});
			}

			result.warnings.forEach((warning) => {
				warnings.push({
					...warning,
					field: `items[${itemIndex}].${warning.field}`,
					path: `items[${itemIndex}]`,
				});
			});
		});
	}

	return {
		success: errors.length === 0,
		data: validItems,
		errors,
		warnings,
	};
};

/**
 * Memory-efficient validation for large objects
 */
export const validateLargeObject = <T extends Record<string, unknown>>(
	obj: T,
	schema: Record<string, (value: unknown) => ValidationError[]>,
	options: { maxDepth?: number; maxArraySize?: number } = {},
): ValidationResult<T> => {
	const { maxDepth = 10, maxArraySize = 10000 } = options;
	return validateObjectRecursive(obj, schema, 0, maxDepth, maxArraySize);
};

/**
 * Recursive validation for nested objects
 */
const validateObjectRecursive = <T extends Record<string, unknown>>(
	obj: T,
	schema: Record<string, (value: unknown) => ValidationError[]>,
	depth: number,
	maxDepth: number,
	maxArraySize: number,
): ValidationResult<T> => {
	const errors: ValidationError[] = [];
	const warnings: ValidationWarning[] = [];

	if (depth > maxDepth) {
		errors.push({
			field: "object",
			message: "Maximum object depth exceeded",
			code: "MAX_DEPTH_EXCEEDED",
			severity: "error",
		});
		return { success: false, errors, warnings };
	}

	if (!obj || typeof obj !== "object") {
		errors.push({
			field: "object",
			message: "Value must be an object",
			code: "INVALID_TYPE",
			severity: "error",
		});
		return { success: false, errors, warnings };
	}

	// Validate each field in schema
	Object.entries(schema).forEach(([field, validator]) => {
		if (field in obj) {
			const value = obj[field];

			// Handle arrays with size limits
			if (Array.isArray(value) && value.length > maxArraySize) {
				errors.push({
					field,
					message: `Array size exceeds maximum allowed size of ${maxArraySize}`,
					code: "ARRAY_TOO_LARGE",
					severity: "error",
				});
				return;
			}

			// Handle nested objects recursively
			if (value && typeof value === "object" && !Array.isArray(value)) {
				// For nested objects, we'd need a nested schema
				// This is a simplified version
				const fieldErrors = validator(value);
				fieldErrors.forEach((error) => {
					errors.push({
						...error,
						field: `${field}.${error.field}`,
					});
				});
			} else {
				const fieldErrors = validator(value);
				fieldErrors.forEach((error) => {
					errors.push({
						...error,
						field: `${field}.${error.field}`,
					});
				});
			}
		}
	});

	return {
		success: errors.length === 0,
		data: obj,
		errors,
		warnings,
	};
};

// ----------------------------------------------------------------
// 9. EXPORT UTILITIES FOR EASY ACCESS
// ----------------------------------------------------------------

/**
 * Combined validation utilities export
 */
export const ValidationUtils = {
	// Basic validators
	validateStringLength,
	validateNumberRange,
	validateArray,
	validateEmail,
	validateUrl,
	validateDate,
	validateEnum,

	// Specialized validators
	validatePolishText,
	validateScientificTerminology,
	validateEvidenceLevel,
	validateCitation,

	// Complex validators
	validateArrayItems,
	validateObject,
	validateBatch,
	validateLargeObject,

	// Type guards
	isValidLanguage,
	isValidRegion,
	isValidContentDomain,
	isValidCulturalContext,
	isValidDocumentationType,
	isValidDocumentationStatus,
	isValidGamificationCategory,
	isValidRarityLevel,
	isValidRewardType,
	isValidActivityType,
	isValidContentType,
	isValidContentStatus,

	// Utility guards
	hasRequiredStringFields,
	hasOptionalStringFields,
	hasNumericFields,
	hasBooleanFields,
	hasArrayFields,
	hasDateFields,

	// Type assertions
	assertType,
	safeCast,
	matchesType,

	// Runtime checking
	validateAndTransform,
};

/**
 * Default export for easy importing
 */
export default ValidationUtils;
