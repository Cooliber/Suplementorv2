/**
 * Comprehensive Supplements API Route
 * Handles CRUD operations for supplements with MongoDB integration
 */

import { comprehensiveSupplementsDatabase } from "@/data/comprehensive-supplements";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Request validation schemas
const GetSupplementsSchema = z.object({
	category: z.string().optional(),
	evidenceLevel: z.string().optional(),
	search: z.string().optional(),
	language: z.enum(["en", "pl"]).default("pl"),
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	sortBy: z
		.enum(["name", "polishName", "evidenceLevel", "lastUpdated"])
		.default("polishName"),
	sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

const CreateSupplementSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	polishName: z.string().min(1),
	category: z.enum([
		"NOOTROPIC",
		"FATTY_ACID",
		"MINERAL",
		"VITAMIN",
		"HERB",
		"AMINO_ACID",
		"PROBIOTIC",
		"ENZYME",
	]),
	description: z.string().min(1),
	polishDescription: z.string().min(1),
	evidenceLevel: z.enum(["STRONG", "MODERATE", "WEAK", "INSUFFICIENT"]),
	// Additional fields would be validated here
});

/**
 * GET /api/supplements
 * Retrieve supplements with filtering, searching, and pagination using hardcoded data
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const params = Object.fromEntries(searchParams.entries());

		// Validate query parameters
		const validatedParams = GetSupplementsSchema.parse(params);

		// Start with all supplements from hardcoded data
		let supplements = [...comprehensiveSupplementsDatabase];

		// Category filter
		if (validatedParams.category) {
			supplements = supplements.filter(
				(s) => s.category === validatedParams.category?.toUpperCase(),
			);
		}

		// Evidence level filter
		if (validatedParams.evidenceLevel) {
			supplements = supplements.filter(
				(s) => s.evidenceLevel === validatedParams.evidenceLevel?.toUpperCase(),
			);
		}

		// Text search
		if (validatedParams.search) {
			const searchLower = validatedParams.search.toLowerCase();
			supplements = supplements.filter((s) => {
				const searchableText = [
					s.name,
					s.polishName,
					s.description || "",
					s.polishDescription || "",
					...s.commonNames,
					...s.polishCommonNames,
					...s.tags,
					...s.activeCompounds.map((compound) =>
						validatedParams.language === "pl"
							? compound.polishName || compound.name
							: compound.name,
					),
					...s.clinicalApplications.map((app) =>
						validatedParams.language === "pl"
							? app.polishCondition
							: app.condition,
					),
				]
					.join(" ")
					.toLowerCase();

				return searchableText.includes(searchLower);
			});
		}

		// Build sort object
		const sortField =
			validatedParams.sortBy === "name" && validatedParams.language === "pl"
				? "polishName"
				: validatedParams.sortBy;
		const sortOrder = validatedParams.sortOrder === "desc" ? -1 : 1;

		supplements.sort((a, b) => {
			let aValue: string | number = "";
			let bValue: string | number = "";

			switch (sortField) {
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

		// Calculate pagination
		const skip = (validatedParams.page - 1) * validatedParams.limit;
		const totalCount = supplements.length;
		const paginatedSupplements = supplements.slice(
			skip,
			skip + validatedParams.limit,
		);

		// Calculate pagination metadata
		const totalPages = Math.ceil(totalCount / validatedParams.limit);
		const hasNextPage = validatedParams.page < totalPages;
		const hasPrevPage = validatedParams.page > 1;

		return NextResponse.json({
			success: true,
			data: paginatedSupplements,
			pagination: {
				currentPage: validatedParams.page,
				totalPages,
				totalCount,
				limit: validatedParams.limit,
				hasNextPage,
				hasPrevPage,
			},
			filters: {
				category: validatedParams.category,
				evidenceLevel: validatedParams.evidenceLevel,
				search: validatedParams.search,
				language: validatedParams.language,
			},
		});
	} catch (error) {
		console.error("Error fetching supplements:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					error: "Invalid query parameters",
					details: error.errors,
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 },
		);
	}
}

/**
 * POST /api/supplements
 * Create a new supplement (using hardcoded data - no persistence)
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const validatedData = CreateSupplementSchema.parse(body);

		// Check if supplement with this ID already exists in hardcoded data
		const existingSupplement = comprehensiveSupplementsDatabase.find(
			(s) => s.id === validatedData.id,
		);

		if (existingSupplement) {
			return NextResponse.json(
				{
					success: false,
					error: "Supplement with this ID already exists",
				},
				{ status: 409 },
			);
		}

		// For hardcoded deployment, return success but don't actually create
		// In a real deployment, this would be handled differently
		const mockSupplement = {
			...validatedData,
			lastUpdated: new Date(),
			version: "1.0.0",
			isActive: true,
		};

		return NextResponse.json(
			{
				success: true,
				data: mockSupplement,
				message: "Supplement creation request received (hardcoded data mode)",
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error creating supplement:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					error: "Invalid request data",
					details: error.errors,
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 },
		);
	}
}

/**
 * PUT /api/supplements
 * Bulk update supplements (using hardcoded data - no persistence)
 */
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const { supplements } = body;

		if (!Array.isArray(supplements)) {
			return NextResponse.json(
				{
					success: false,
					error: "Expected array of supplements",
				},
				{ status: 400 },
			);
		}

		const results = [];

		for (const supplementData of supplements) {
			try {
				// Check if supplement exists in hardcoded data
				const existingIndex = comprehensiveSupplementsDatabase.findIndex(
					(s) => s.id === supplementData.id,
				);

				if (existingIndex >= 0) {
					// In a real implementation, this would update the data
					// For hardcoded deployment, we simulate success
					results.push({
						id: supplementData.id,
						success: true,
						data: {
							...comprehensiveSupplementsDatabase[existingIndex],
							...supplementData,
							lastUpdated: new Date(),
						},
					});
				} else {
					results.push({
						id: supplementData.id,
						success: false,
						error: "Supplement not found in hardcoded data",
					});
				}
			} catch (error) {
				results.push({
					id: supplementData.id,
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				});
			}
		}

		const successCount = results.filter((r) => r.success).length;
		const errorCount = results.filter((r) => !r.success).length;

		return NextResponse.json({
			success: errorCount === 0,
			results,
			summary: {
				total: supplements.length,
				successful: successCount,
				failed: errorCount,
			},
			message: "Bulk update completed (hardcoded data mode)",
		});
	} catch (error) {
		console.error("Error bulk updating supplements:", error);

		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 },
		);
	}
}

/**
 * DELETE /api/supplements
 * Soft delete supplements (using hardcoded data - no persistence)
 */
export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const ids = searchParams.get("ids")?.split(",") || [];

		if (ids.length === 0) {
			return NextResponse.json(
				{
					success: false,
					error: "No supplement IDs provided",
				},
				{ status: 400 },
			);
		}

		// For hardcoded deployment, simulate deletion
		// In a real implementation, this would mark items as inactive
		const foundSupplements = comprehensiveSupplementsDatabase.filter((s) =>
			ids.includes(s.id),
		);

		return NextResponse.json({
			success: true,
			message: `${foundSupplements.length} supplements would be deactivated (hardcoded data mode)`,
			modifiedCount: foundSupplements.length,
		});
	} catch (error) {
		console.error("Error deleting supplements:", error);

		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 },
		);
	}
}
