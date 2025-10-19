/**
 * Individual Supplement API Route
 * Handles operations for specific supplements by ID
 */

import { comprehensiveSupplementsDatabase } from "@/data/comprehensive-supplements";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Request validation schemas
const UpdateSupplementSchema = z.object({
	name: z.string().min(1).optional(),
	polishName: z.string().min(1).optional(),
	category: z
		.enum([
			"NOOTROPIC",
			"FATTY_ACID",
			"MINERAL",
			"VITAMIN",
			"HERB",
			"AMINO_ACID",
			"PROBIOTIC",
			"ENZYME",
		])
		.optional(),
	description: z.string().min(1).optional(),
	polishDescription: z.string().min(1).optional(),
	evidenceLevel: z
		.enum(["STRONG", "MODERATE", "WEAK", "INSUFFICIENT"])
		.optional(),
	tags: z.array(z.string()).optional(),
	polishTags: z.array(z.string()).optional(),
	isActive: z.boolean().optional(),
});

const GetSupplementOptionsSchema = z.object({
	language: z.enum(["en", "pl"]).default("pl"),
	includeInactive: z.coerce.boolean().default(false),
	fields: z.string().optional(), // Comma-separated list of fields to include
});

/**
 * GET /api/supplements/[id]
 * Retrieve a specific supplement by ID using hardcoded data
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { searchParams } = new URL(request.url);
		const queryParams = Object.fromEntries(searchParams.entries());

		// Validate query parameters
		const options = GetSupplementOptionsSchema.parse(queryParams);

		// Find supplement in hardcoded data
		const supplement = comprehensiveSupplementsDatabase.find(
			(s) => s.id === params.id,
		);

		if (!supplement) {
			return NextResponse.json(
				{
					success: false,
					error: "Supplement not found",
				},
				{ status: 404 },
			);
		}

		// Build field selection
		let result = supplement;
		if (options.fields) {
			const fields = options.fields.split(",").map((f) => f.trim());
			const filteredResult: any = {};
			fields.forEach((field) => {
				if (field in supplement) {
					filteredResult[field] = (supplement as any)[field];
				}
			});
			result = filteredResult;
		}

		return NextResponse.json({
			success: true,
			data: result,
		});
	} catch (error) {
		console.error("Error fetching supplement:", error);

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
 * PUT /api/supplements/[id]
 * Update a specific supplement (using hardcoded data - no persistence)
 */
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const body = await request.json();

		// Validate request body
		const validatedData = UpdateSupplementSchema.parse(body);

		// Find supplement in hardcoded data
		const supplementIndex = comprehensiveSupplementsDatabase.findIndex(
			(s) => s.id === params.id,
		);

		if (supplementIndex === -1) {
			return NextResponse.json(
				{
					success: false,
					error: "Supplement not found",
				},
				{ status: 404 },
			);
		}

		// For hardcoded deployment, simulate update
		const updatedSupplement = {
			...comprehensiveSupplementsDatabase[supplementIndex],
			...validatedData,
			lastUpdated: new Date(),
		};

		return NextResponse.json({
			success: true,
			data: updatedSupplement,
			message: "Supplement update request received (hardcoded data mode)",
		});
	} catch (error) {
		console.error("Error updating supplement:", error);

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
 * DELETE /api/supplements/[id]
 * Soft delete a specific supplement (using hardcoded data - no persistence)
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		// Find supplement in hardcoded data
		const supplement = comprehensiveSupplementsDatabase.find(
			(s) => s.id === params.id,
		);

		if (!supplement) {
			return NextResponse.json(
				{
					success: false,
					error: "Supplement not found",
				},
				{ status: 404 },
			);
		}

		// For hardcoded deployment, simulate deletion
		return NextResponse.json({
			success: true,
			message: "Supplement would be deactivated (hardcoded data mode)",
			data: { id: params.id, isActive: false },
		});
	} catch (error) {
		console.error("Error deleting supplement:", error);

		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 },
		);
	}
}
