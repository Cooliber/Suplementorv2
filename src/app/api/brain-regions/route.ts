/**
 * Brain Regions API Route
 * Handles CRUD operations for brain regions with 3D visualization data
 */

import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Request validation schemas
const GetBrainRegionsSchema = z.object({
	category: z.string().optional(),
	hemisphere: z.enum(["LEFT", "RIGHT", "BILATERAL"]).optional(),
	search: z.string().optional(),
	language: z.enum(["en", "pl"]).default("pl"),
	difficultyLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
	supplementId: z.string().optional(), // Filter by supplement effects
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	sortBy: z
		.enum(["name", "polishName", "category", "lastUpdated"])
		.default("polishName"),
	sortOrder: z.enum(["asc", "desc"]).default("asc"),
	includeVisualization: z.coerce.boolean().default(true),
});

/**
 * GET /api/brain-regions
 * Retrieve brain regions with filtering and 3D visualization data (using hardcoded data)
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const params = Object.fromEntries(searchParams.entries());

		// Validate query parameters
		const validatedParams = GetBrainRegionsSchema.parse(params);

		// Mock brain regions data for hardcoded deployment
		const mockBrainRegions = [
			{
				id: "prefrontal-cortex",
				name: "Prefrontal Cortex",
				polishName: "Kora przedczołowa",
				category: "FRONTAL_LOBE",
				hemisphere: "BILATERAL",
				difficultyLevel: "INTERMEDIATE",
				description: "Executive function and decision making center",
				polishDescription:
					"Ośrodek funkcji wykonawczych i podejmowania decyzji",
				functions: ["Executive function", "Decision making", "Working memory"],
				polishFunctions: [
					"Funkcje wykonawcze",
					"Podejmowanie decyzji",
					"Pamięć robocza",
				],
				isActive: true,
				lastUpdated: new Date(),
				version: "1.0.0",
			},
			{
				id: "hippocampus",
				name: "Hippocampus",
				polishName: "Hipokamp",
				category: "LIMBIC_SYSTEM",
				hemisphere: "BILATERAL",
				difficultyLevel: "ADVANCED",
				description: "Memory formation and spatial navigation",
				polishDescription: "Tworzenie wspomnień i nawigacja przestrzenna",
				functions: ["Memory formation", "Spatial navigation", "Learning"],
				polishFunctions: [
					"Tworzenie wspomnień",
					"Nawigacja przestrzenna",
					"Uczenie się",
				],
				isActive: true,
				lastUpdated: new Date(),
				version: "1.0.0",
			},
		];

		// Apply filters
		let brainRegions = [...mockBrainRegions];

		// Category filter
		if (validatedParams.category) {
			brainRegions = brainRegions.filter(
				(r) => r.category === validatedParams.category?.toUpperCase(),
			);
		}

		// Hemisphere filter
		if (validatedParams.hemisphere) {
			brainRegions = brainRegions.filter(
				(r) => r.hemisphere === validatedParams.hemisphere,
			);
		}

		// Difficulty level filter
		if (validatedParams.difficultyLevel) {
			brainRegions = brainRegions.filter(
				(r) => r.difficultyLevel === validatedParams.difficultyLevel,
			);
		}

		// Text search
		if (validatedParams.search) {
			const searchLower = validatedParams.search.toLowerCase();
			brainRegions = brainRegions.filter((r) => {
				const searchableText = [
					r.name,
					r.polishName,
					r.description || "",
					r.polishDescription || "",
					...r.functions,
					...r.polishFunctions,
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

		brainRegions.sort((a, b) => {
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
				case "category":
					aValue = a.category.toLowerCase();
					bValue = b.category.toLowerCase();
					break;
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

		// Build projection to exclude/include visualization data
		let result = brainRegions;
		if (!validatedParams.includeVisualization) {
			result = brainRegions.map((r) => ({
				...r,
				visualizationProperties: undefined,
				modelFile: undefined,
				textureFiles: undefined,
			}));
		}

		// Calculate pagination
		const skip = (validatedParams.page - 1) * validatedParams.limit;
		const totalCount = brainRegions.length;
		const paginatedBrainRegions = result.slice(
			skip,
			skip + validatedParams.limit,
		);

		// Calculate pagination metadata
		const totalPages = Math.ceil(totalCount / validatedParams.limit);
		const hasNextPage = validatedParams.page < totalPages;
		const hasPrevPage = validatedParams.page > 1;

		return NextResponse.json({
			success: true,
			data: paginatedBrainRegions,
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
				hemisphere: validatedParams.hemisphere,
				difficultyLevel: validatedParams.difficultyLevel,
				supplementId: validatedParams.supplementId,
				search: validatedParams.search,
				language: validatedParams.language,
			},
		});
	} catch (error) {
		console.error("Error fetching brain regions:", error);

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
 * POST /api/brain-regions
 * Create a new brain region (using hardcoded data - no persistence)
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// For hardcoded deployment, simulate creation
		const mockBrainRegion = {
			...body,
			lastUpdated: new Date(),
			version: "1.0.0",
			isActive: true,
		};

		return NextResponse.json(
			{
				success: true,
				data: mockBrainRegion,
				message: "Brain region creation request received (hardcoded data mode)",
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error creating brain region:", error);

		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 },
		);
	}
}
