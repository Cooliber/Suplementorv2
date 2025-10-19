/**
 * Text similarity calculation with Unicode support
 * Handles special characters and different character sets
 */
export const calculateTextSimilarity = (
	text1: string,
	text2: string,
): number => {
	// Early return if identical
	if (text1 === text2) return 1;

	// Convert to arrays of "words" (handles non-ASCII characters)
	const words1 = text1.split(/\s+/).filter((word) => word.length > 0);
	const words2 = text2.split(/\s+/).filter((word) => word.length > 0);

	// Remove duplicates from first array for accurate counting
	const uniqueWords1 = [...new Set(words1)];
	const uniqueWords2 = [...new Set(words2)];

	// Find common words
	const commonWords = uniqueWords1.filter((word) =>
		uniqueWords2.includes(word),
	);

	// Return zero if no words in common
	if (commonWords.length === 0) return 0;

	// Calculate similarity ratio
	return (2 * commonWords.length) / (words1.length + words2.length);
};

import { PRECISION_CONSTANTS } from "@/lib/atoms/atom-manager";

/**
 * Check biomarker precision against known ranges
 */
export const validateBiomarkerPrecision = (biomarker: any): boolean => {
	const range =
		PRECISION_CONSTANTS.BIOCHEMICAL[
			biomarker.name
				?.toUpperCase()
				.replace(/[^A-Z]/g) as keyof typeof PRECISION_CONSTANTS.BIOCHEMICAL
		];
	if (!range) return false;
	return (
		biomarker.value >= (range as any).MIN &&
		biomarker.value <= (range as any).MAX
	);
};

/**
 * Determine if a biomarker value is clinically significant
 */
export const biomarkerIsClinicallySignificant = (biomarker: any): boolean => {
	const significance = biomarker.postIntervention && biomarker.baseline;
	if (!significance || !biomarker.baseline) return false;

	// Check for clinically meaningful changes (≥20% change)
	const change = Math.abs(biomarker.postIntervention - biomarker.baseline);
	const percentChange = (change / biomarker.baseline) * 100;
	return percentChange >= 20;
};

/**
 * Get statistical significance based on p-value
 */
export const getStatisticalSignificance = (pValue: number): string => {
	if (pValue < 0.01) return "high";
	if (pValue < 0.05) return "moderate";
	if (pValue < 0.1) return "low";
	return "unknown";
};
