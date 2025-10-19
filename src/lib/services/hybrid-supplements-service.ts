/**
 * Hybrid Supplements Service
 * Primary: Comprehensive supplement data with MongoDB fallback
 * Provides unified interface for supplement data access with caching
 */

import { comprehensiveSupplementsDatabase } from "@/data/comprehensive-supplements";
import type { ComprehensiveSupplementProfile } from "@/data/comprehensive-supplements/types";
import {
	createNormalizedSearchIndex,
	filterSupplementsByCriteria,
	sortByRelevance,
	transformComprehensiveToLegacy,
} from "@/lib/utils/supplement-transformers";
import type {
	EvidenceLevel,
	SupplementCategory,
	SupplementWithRelations,
} from "@/types/supplement";
import { cachingService } from "./caching-service";

export interface SupplementSearchFilters {
	category?: SupplementCategory[];
	evidenceLevel?: EvidenceLevel[];
	searchTerm?: string;
	minEffectiveness?: number;
	maxCostPerMonth?: number;
	safetyProfile?: {
		pregnancySafe?: boolean;
		breastfeedingSafe?: boolean;
		pediatricApproved?: boolean;
	};
	mechanisms?: string[];
	conditions?: string[];
	difficultyLevel?: "beginner" | "intermediate" | "expert";
	language?: "en" | "pl";
}

export interface PaginationOptions {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface SupplementQueryResult {
	supplements: SupplementWithRelations[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasMore: boolean;
	};
}

export class HybridSupplementsService {
	private static instance: HybridSupplementsService;
	private comprehensiveData: Map<string, ComprehensiveSupplementProfile> =
		new Map();
	private isInitialized = false;

	private constructor() {
		this.initializeComprehensiveData();
	}

	static getInstance(): HybridSupplementsService {
		if (!HybridSupplementsService.instance) {
			HybridSupplementsService.instance = new HybridSupplementsService();
		}
		return HybridSupplementsService.instance;
	}

	private initializeComprehensiveData() {
		if (this.isInitialized) return;

		// Load comprehensive data into memory for fast access
		comprehensiveSupplementsDatabase.forEach((supplement) => {
			this.comprehensiveData.set(supplement.id, supplement);
		});

		this.isInitialized = true;
		console.log(
			`Loaded ${this.comprehensiveData.size} comprehensive supplements`,
		);
	}

	/**
	 * Transform comprehensive supplement data to legacy format for compatibility
	 */
	private transformToLegacyFormat(
		comprehensive: ComprehensiveSupplementProfile,
	): SupplementWithRelations {
		return transformComprehensiveToLegacy(comprehensive);
	}

	/**
	 * Get all supplements with optional filtering and pagination
	 */
	async getAllSupplements(
		filters?: SupplementSearchFilters,
		pagination?: PaginationOptions,
		useCache = true,
	): Promise<SupplementQueryResult> {
		const cacheKey = `supplements:all:${JSON.stringify({ filters, pagination })}`;

		if (useCache) {
			const cached = await cachingService.get<SupplementQueryResult>(cacheKey);
			if (cached.data) {
				return cached.data;
			}
		}

		// Use only comprehensive data (no MongoDB fallback)
		const result = await this.getSupplementsFromComprehensiveData(
			filters,
			pagination,
		);

		if (useCache) {
			await cachingService.set(cacheKey, result, { ttl: 300 * 1000 }); // Cache for 5 minutes
		}

		return result;
	}

	/**
	 * Get supplements from comprehensive data
	 */
	private async getSupplementsFromComprehensiveData(
		filters?: SupplementSearchFilters,
		pagination?: PaginationOptions,
	): Promise<SupplementQueryResult> {
		let supplements = Array.from(this.comprehensiveData.values());

		// Apply filters
		if (filters) {
			supplements = this.applyFilters(supplements, filters);
		}

		// Apply sorting
		const sortBy = pagination?.sortBy || "polishName";
		const sortOrder = pagination?.sortOrder === "desc" ? -1 : 1;

		supplements.sort((a, b) => {
			let aValue: string | number = "";
			let bValue: string | number = "";

			switch (sortBy) {
				case "name":
					aValue = a.name.toLowerCase();
					bValue = b.name.toLowerCase();
					break;
				case "polishName":
					aValue = a.polishName.toLowerCase();
					bValue = b.polishName.toLowerCase();
					break;
				case "evidenceLevel": {
					const evidenceOrder = {
						STRONG: 4,
						MODERATE: 3,
						WEAK: 2,
						INSUFFICIENT: 1,
						CONFLICTING: 0,
					};
					aValue = evidenceOrder[a.evidenceLevel] || 0;
					bValue = evidenceOrder[b.evidenceLevel] || 0;
					break;
				}
				case "lastUpdated":
					aValue = new Date(a.lastUpdated).getTime();
					bValue = new Date(b.lastUpdated).getTime();
					break;
				default:
					aValue = a.polishName.toLowerCase();
					bValue = b.polishName.toLowerCase();
			}

			if (typeof aValue === "string" && typeof bValue === "string") {
				return sortOrder * aValue.localeCompare(bValue);
			}
			return sortOrder * ((aValue as number) - (bValue as number));
		});

		// Apply pagination
		const page = pagination?.page || 1;
		const limit = pagination?.limit || 20;
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;
		const paginatedSupplements = supplements.slice(startIndex, endIndex);

		return {
			supplements: paginatedSupplements.map((s) =>
				this.transformToLegacyFormat(s),
			),
			pagination: {
				page,
				limit,
				total: supplements.length,
				totalPages: Math.ceil(supplements.length / limit),
				hasMore: endIndex < supplements.length,
			},
		};
	}

	/**
	 * Apply filters to supplement array
	 */
	private applyFilters(
		supplements: ComprehensiveSupplementProfile[],
		filters: SupplementSearchFilters,
	): ComprehensiveSupplementProfile[] {
		return filterSupplementsByCriteria(supplements, {
			categories: filters.category?.map((c) => c),
			evidenceLevels: filters.evidenceLevel?.map((e) => e),
			minEffectiveness: filters.minEffectiveness,
			maxCost: filters.maxCostPerMonth,
			pregnancySafe: filters.safetyProfile?.pregnancySafe,
			breastfeedingSafe: filters.safetyProfile?.breastfeedingSafe,
			pediatricApproved: filters.safetyProfile?.pediatricApproved,
			searchTerm: filters.searchTerm,
			conditions: filters.conditions,
			mechanisms: filters.mechanisms,
		});
	}

	/**
	 * Get supplement by ID
	 */
	async getSupplementById(
		id: string,
		useCache = true,
	): Promise<SupplementWithRelations | null> {
		const cacheKey = `supplement:${id}`;

		if (useCache) {
			const cached =
				await cachingService.get<SupplementWithRelations>(cacheKey);
			if (cached.data) {
				return cached.data;
			}
		}

		// Use only comprehensive data (no MongoDB fallback)
		const comprehensive = this.comprehensiveData.get(id);
		if (comprehensive) {
			const result = this.transformToLegacyFormat(comprehensive);
			if (useCache) {
				await cachingService.set(cacheKey, result, { ttl: 600 * 1000 }); // Cache for 10 minutes
			}
			return result;
		}

		return null;
	}

	/**
	 * Search supplements with full-text search
	 */
	async searchSupplements(
		searchTerm: string,
		language: "en" | "pl" = "pl",
		limit = 50,
		useCache = true,
	): Promise<SupplementWithRelations[]> {
		const cacheKey = `search:${searchTerm}:${language}:${limit}`;

		if (useCache) {
			const cached =
				await cachingService.get<SupplementWithRelations[]>(cacheKey);
			if (cached.data) {
				return cached.data;
			}
		}

		// Use only comprehensive data (no MongoDB fallback)
		const supplements = Array.from(this.comprehensiveData.values());
		const searchTermLower = searchTerm.toLowerCase();

		const results = supplements
			.filter((supplement) => {
				const searchableText = [
					supplement.name,
					supplement.polishName,
					supplement.description || "",
					supplement.polishDescription || "",
					...supplement.commonNames,
					...supplement.polishCommonNames,
					...supplement.tags,
					...supplement.activeCompounds.map((compound) =>
						language === "pl"
							? compound.polishName || compound.name
							: compound.name,
					),
					...supplement.clinicalApplications.map((app) =>
						language === "pl" ? app.polishCondition : app.condition,
					),
				]
					.join(" ")
					.toLowerCase();

				return searchableText.includes(searchTermLower);
			})
			.sort((a, b) => {
				// Sort by evidence level first, then by name
				const evidenceOrder = {
					STRONG: 4,
					MODERATE: 3,
					WEAK: 2,
					INSUFFICIENT: 1,
					CONFLICTING: 0,
				};
				const aScore = evidenceOrder[a.evidenceLevel] || 0;
				const bScore = evidenceOrder[b.evidenceLevel] || 0;

				if (aScore !== bScore) {
					return bScore - aScore;
				}

				return a.polishName.localeCompare(b.polishName);
			})
			.slice(0, limit)
			.map((s) => this.transformToLegacyFormat(s) as SupplementWithRelations);

		if (useCache) {
			await cachingService.set(cacheKey, results, { ttl: 300 * 1000 });
		}

		return results;
	}

	/**
	 * Get supplements by category
	 */
	async getSupplementsByCategory(
		category: SupplementCategory,
		useCache = true,
	): Promise<SupplementWithRelations[]> {
		const cacheKey = `category:${category}`;

		if (useCache) {
			const cached =
				await cachingService.get<SupplementWithRelations[]>(cacheKey);
			if (cached.data) {
				return cached.data;
			}
		}

		try {
			const supplements = Array.from(this.comprehensiveData.values())
				.filter((supplement) => supplement.category === category)
				.sort((a, b) => a.polishName.localeCompare(b.polishName))
				.map((s) => this.transformToLegacyFormat(s) as SupplementWithRelations);

			if (useCache) {
				await cachingService.set(cacheKey, supplements, { ttl: 600 * 1000 });
			}

			return supplements as SupplementWithRelations[];
		} catch (error) {
			console.warn("Failed to get category from comprehensive data:", error);
			throw error;
		}
	}

	/**
	 * Get popular supplements (most researched)
	 */
	async getPopularSupplements(
		limit = 10,
		useCache = true,
	): Promise<SupplementWithRelations[]> {
		const cacheKey = `popular:${limit}`;

		if (useCache) {
			const cached =
				await cachingService.get<SupplementWithRelations[]>(cacheKey);
			if (cached.data) {
				return cached.data;
			}
		}

		try {
			const supplements = Array.from(this.comprehensiveData.values())
				.sort((a, b) => {
					// Sort by total studies first, then by evidence level
					if (
						a.clinicalEvidence.totalStudies !== b.clinicalEvidence.totalStudies
					) {
						return (
							b.clinicalEvidence.totalStudies - a.clinicalEvidence.totalStudies
						);
					}

					const evidenceOrder = {
						STRONG: 4,
						MODERATE: 3,
						WEAK: 2,
						INSUFFICIENT: 1,
						CONFLICTING: 0,
					};
					return (
						(evidenceOrder[b.evidenceLevel] || 0) -
						(evidenceOrder[a.evidenceLevel] || 0)
					);
				})
				.slice(0, limit)
				.map((s) => this.transformToLegacyFormat(s) as SupplementWithRelations);

			if (useCache) {
				await cachingService.set(cacheKey, supplements, { ttl: 600 * 1000 });
			}

			return supplements as SupplementWithRelations[];
		} catch (error) {
			console.warn(
				"Failed to get popular supplements from comprehensive data:",
				error,
			);
			throw error;
		}
	}

	/**
	 * Get supplement statistics
	 */
	async getStatistics(useCache = true) {
		const cacheKey = "statistics";

		if (useCache) {
			const cached = await cachingService.get(cacheKey);
			if (cached.data) {
				return cached.data;
			}
		}

		const supplements = Array.from(this.comprehensiveData.values());

		const total = supplements.length;
		const byCategory = supplements.reduce(
			(acc, supplement) => {
				acc[supplement.category] = (acc[supplement.category] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const byEvidenceLevel = supplements.reduce(
			(acc, supplement) => {
				acc[supplement.evidenceLevel] =
					(acc[supplement.evidenceLevel] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const avgStudiesPerSupplement =
			supplements.reduce(
				(sum, supplement) => sum + supplement.clinicalEvidence.totalStudies,
				0,
			) / total;

		const result = {
			total,
			byCategory,
			byEvidenceLevel,
			avgStudiesPerSupplement: Math.round(avgStudiesPerSupplement * 100) / 100,
		};

		if (useCache) {
			await cachingService.set(cacheKey, result, { ttl: 1800 * 1000 }); // Cache for 30 minutes
		}

		return result;
	}

	/**
	 * Clear all caches
	 */
	async clearCache(): Promise<void> {
		await cachingService.clear();
		console.log("Supplement service cache cleared");
	}

	/**
	 * Get cache status
	 */
	async getCacheStatus() {
		// Return a simple cache status since getStatus() doesn't exist
		return {
			totalEntries: this.comprehensiveData.size,
			cacheHits: 0,
			cacheMisses: 0,
			lastCleanup: Date.now(),
		};
	}
}

// Export singleton instance
export const hybridSupplementsService = HybridSupplementsService.getInstance();
export default hybridSupplementsService;
