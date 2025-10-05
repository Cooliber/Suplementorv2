/**
 * Translation Hook
 * Simple hook for accessing Polish translations
 */

"use client";

import { pl } from "./pl";

type NestedKeyOf<ObjectType extends object> = {
	[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
		? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
		: `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationPath = NestedKeyOf<typeof pl>;

/**
 * Get nested value from object using dot notation path
 */
function getNestedValue(obj: any, path: string): string {
	return path.split(".").reduce((current, key) => current?.[key], obj) ?? path;
}

/**
 * Replace placeholders in translation string
 * Example: "Found {count} items" with { count: 5 } => "Found 5 items"
 */
function replacePlaceholders(
	text: string,
	params?: Record<string, string | number>,
): string {
	if (!params) return text;

	return Object.entries(params).reduce((result, [key, value]) => {
		return result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
	}, text);
}

/**
 * Translation hook
 *
 * @example
 * const { t } = useTranslation();
 * t('common.loading') // "Ładowanie..."
 * t('search.results', { count: 5 }) // "Znaleziono 5 suplementów"
 */
export function useTranslation() {
	const t = (
		key: TranslationPath,
		params?: Record<string, string | number>,
	): string => {
		const translation = getNestedValue(pl, key);
		return replacePlaceholders(translation, params);
	};

	return { t, translations: pl };
}

/**
 * Direct translation function (for use outside components)
 */
export function translate(
	key: TranslationPath,
	params?: Record<string, string | number>,
): string {
	const translation = getNestedValue(pl, key);
	return replacePlaceholders(translation, params);
}
