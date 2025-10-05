/**
 * MongoDB Supplements Service
 * Database-driven service for supplement data with Polish localization
 * Replaces static data with MongoDB queries
 */

import { ComprehensiveSupplement } from "@/lib/db/models";
import connectToDatabase from "@/lib/db/mongodb";
import type { EvidenceLevel, SupplementCategory } from "@/types/supplement";

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

export class MongoDBSupplementsService {
	/**
	 * Get all supplements with optional filtering and pagination
	 */
	async getAllSupplements(
		filters?: SupplementSearchFilters,
		pagination?: PaginationOptions,
	) {
		await connectToDatabase();

		const query: any = { isActive: true };

		// Apply filters
		if (filters?.category && filters.category.length > 0) {
			query.category = { $in: filters.category };
		}

		if (filters?.evidenceLevel && filters.evidenceLevel.length > 0) {
			query.evidenceLevel = { $in: filters.evidenceLevel };
		}

		if (filters?.searchTerm) {
			const searchRegex = new RegExp(filters.searchTerm, "i");
			query.$or = [
				{ name: searchRegex },
				{ polishName: searchRegex },
				{ description: searchRegex },
				{ polishDescription: searchRegex },
				{ tags: searchRegex },
				{ polishTags: searchRegex },
				{ searchKeywords: searchRegex },
				{ polishSearchKeywords: searchRegex },
			];
		}

		if (filters?.conditions && filters.conditions.length > 0) {
			query["clinicalApplications.polishCondition"] = {
				$in: filters.conditions.map((c) => new RegExp(c, "i")),
			};
		}

		if (filters?.mechanisms && filters.mechanisms.length > 0) {
			query["mechanisms.polishPathway"] = {
				$in: filters.mechanisms.map((m) => new RegExp(m, "i")),
			};
		}

		// Safety profile filters
		if (filters?.safetyProfile?.pregnancySafe) {
			query["safetyProfile.pregnancyCategory"] = { $in: ["A", "B"] };
		}

		if (filters?.safetyProfile?.breastfeedingSafe) {
			query["safetyProfile.breastfeedingSafety"] = "Safe";
		}

		if (filters?.safetyProfile?.pediatricApproved) {
			query["safetyProfile.pediatricUse.approved"] = true;
		}

		// Cost filter
		if (filters?.maxCostPerMonth) {
			query["economicData.averageCostPerMonth.average"] = {
				$lte: filters.maxCostPerMonth,
			};
		}

		// Pagination
		const page = pagination?.page || 1;
		const limit = pagination?.limit || 20;
		const skip = (page - 1) * limit;

		// Sorting
		const sortField = pagination?.sortBy || "polishName";
		const sortOrder = pagination?.sortOrder === "desc" ? -1 : 1;
		const sort: any = { [sortField]: sortOrder };

		const [supplements, total] = await Promise.all([
			ComprehensiveSupplement.find(query)
				.sort(sort)
				.skip(skip)
				.limit(limit)
				.lean(),
			ComprehensiveSupplement.countDocuments(query),
		]);

		return {
			supplements,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
				hasMore: page * limit < total,
			},
		};
	}

	/**
	 * Get supplement by ID
	 */
	async getSupplementById(id: string) {
		await connectToDatabase();

		const supplement = await ComprehensiveSupplement.findOne({
			id,
			isActive: true,
		}).lean();

		return supplement;
	}

	/**
	 * Get supplements by category
	 */
	async getSupplementsByCategory(category: SupplementCategory) {
		await connectToDatabase();

		const supplements = await ComprehensiveSupplement.find({
			category,
			isActive: true,
		})
			.sort({ polishName: 1 })
			.lean();

		return supplements;
	}

	/**
	 * Search supplements with full-text search
	 */
	async searchSupplements(searchTerm: string, language: "en" | "pl" = "pl") {
		await connectToDatabase();

		const searchRegex = new RegExp(searchTerm, "i");

		const supplements = await ComprehensiveSupplement.find({
			isActive: true,
			$or: [
				{ name: searchRegex },
				{ polishName: searchRegex },
				{ description: searchRegex },
				{ polishDescription: searchRegex },
				{ tags: searchRegex },
				{ polishTags: searchRegex },
				{ searchKeywords: searchRegex },
				{ polishSearchKeywords: searchRegex },
				{ "activeCompounds.name": searchRegex },
				{ "activeCompounds.polishName": searchRegex },
				{ "clinicalApplications.condition": searchRegex },
				{ "clinicalApplications.polishCondition": searchRegex },
			],
		})
			.sort({ evidenceLevel: -1, polishName: 1 })
			.limit(50)
			.lean();

		return supplements;
	}

	/**
	 * Get supplements by evidence level
	 */
	async getSupplementsByEvidenceLevel(evidenceLevel: EvidenceLevel) {
		await connectToDatabase();

		const supplements = await ComprehensiveSupplement.find({
			evidenceLevel,
			isActive: true,
		})
			.sort({ polishName: 1 })
			.lean();

		return supplements;
	}

	/**
	 * Get supplements for specific condition
	 */
	async getSupplementsForCondition(
		condition: string,
		language: "en" | "pl" = "pl",
	) {
		await connectToDatabase();

		const conditionRegex = new RegExp(condition, "i");
		const field =
			language === "pl"
				? "clinicalApplications.polishCondition"
				: "clinicalApplications.condition";

		const supplements = await ComprehensiveSupplement.find({
			isActive: true,
			[field]: conditionRegex,
		})
			.sort({ "clinicalApplications.effectivenessRating": -1 })
			.lean();

		return supplements;
	}

	/**
	 * Get popular supplements (most researched)
	 */
	async getPopularSupplements(limit = 10) {
		await connectToDatabase();

		const supplements = await ComprehensiveSupplement.find({
			isActive: true,
		})
			.sort({ "clinicalEvidence.totalStudies": -1, evidenceLevel: -1 })
			.limit(limit)
			.lean();

		return supplements;
	}

	/**
	 * Get recently updated supplements
	 */
	async getRecentlyUpdatedSupplements(limit = 10) {
		await connectToDatabase();

		const supplements = await ComprehensiveSupplement.find({
			isActive: true,
		})
			.sort({ lastUpdated: -1 })
			.limit(limit)
			.lean();

		return supplements;
	}

	/**
	 * Get supplement statistics
	 */
	async getStatistics() {
		await connectToDatabase();

		const [total, byCategory, byEvidenceLevel, avgStudiesPerSupplement] =
			await Promise.all([
				ComprehensiveSupplement.countDocuments({ isActive: true }),
				ComprehensiveSupplement.aggregate([
					{ $match: { isActive: true } },
					{ $group: { _id: "$category", count: { $sum: 1 } } },
					{ $sort: { count: -1 } },
				]),
				ComprehensiveSupplement.aggregate([
					{ $match: { isActive: true } },
					{ $group: { _id: "$evidenceLevel", count: { $sum: 1 } } },
					{ $sort: { count: -1 } },
				]),
				ComprehensiveSupplement.aggregate([
					{ $match: { isActive: true } },
					{
						$group: {
							_id: null,
							avgStudies: { $avg: "$clinicalEvidence.totalStudies" },
						},
					},
				]),
			]);

		return {
			total,
			byCategory: byCategory.reduce(
				(acc, item) => {
					acc[item._id] = item.count;
					return acc;
				},
				{} as Record<string, number>,
			),
			byEvidenceLevel: byEvidenceLevel.reduce(
				(acc, item) => {
					acc[item._id] = item.count;
					return acc;
				},
				{} as Record<string, number>,
			),
			avgStudiesPerSupplement: avgStudiesPerSupplement[0]?.avgStudies || 0,
		};
	}

	/**
	 * Create new supplement (admin only)
	 */
	async createSupplement(supplementData: any) {
		await connectToDatabase();

		const supplement = await ComprehensiveSupplement.create(supplementData);
		return supplement;
	}

	/**
	 * Update supplement (admin only)
	 */
	async updateSupplement(id: string, updateData: any) {
		await connectToDatabase();

		const supplement = await ComprehensiveSupplement.findOneAndUpdate(
			{ id, isActive: true },
			{ ...updateData, lastUpdated: new Date() },
			{ new: true },
		).lean();

		return supplement;
	}

	/**
	 * Soft delete supplement (admin only)
	 */
	async deleteSupplement(id: string) {
		await connectToDatabase();

		const supplement = await ComprehensiveSupplement.findOneAndUpdate(
			{ id },
			{ isActive: false, lastUpdated: new Date() },
			{ new: true },
		).lean();

		return supplement;
	}
}

// Export singleton instance
export const mongoDBSupplementsService = new MongoDBSupplementsService();
export default mongoDBSupplementsService;
