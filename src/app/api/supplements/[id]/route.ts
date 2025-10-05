/**
 * Individual Supplement API Route
 * Handles operations for specific supplements by ID
 */

import { ComprehensiveSupplement } from "@/lib/db/models";
import connectToDatabase from "@/lib/db/mongodb";
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
 * Retrieve a specific supplement by ID
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await connectToDatabase();

		const { searchParams } = new URL(request.url);
		const queryParams = Object.fromEntries(searchParams.entries());

		// Validate query parameters
		const options = GetSupplementOptionsSchema.parse(queryParams);

		// Build query
		const query: any = { id: params.id };

		if (!options.includeInactive) {
			query.isActive = true;
		}

		// Build field selection
		let selectFields = {};
		if (options.fields) {
			const fields = options.fields.split(",").map((f) => f.trim());
			selectFields = fields.reduce((acc, field) => {
				acc[field] = 1;
				return acc;
			}, {} as any);
		}

		// Find supplement
		const supplement = await ComprehensiveSupplement.findOne(
			query,
			selectFields,
		).lean();

		if (!supplement) {
			return NextResponse.json(
				{
					success: false,
					error: "Supplement not found",
				},
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			data: supplement,
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
 * Update a specific supplement
 */
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await connectToDatabase();

		const body = await request.json();

		// Validate request body
		const validatedData = UpdateSupplementSchema.parse(body);

		// Update supplement
		const updatedSupplement = await ComprehensiveSupplement.findOneAndUpdate(
			{ id: params.id, isActive: true },
			{
				...validatedData,
				lastUpdated: new Date(),
			},
			{
				new: true,
				runValidators: true,
			},
		);

		if (!updatedSupplement) {
			return NextResponse.json(
				{
					success: false,
					error: "Supplement not found",
				},
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			data: updatedSupplement,
			message: "Supplement updated successfully",
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
 * Soft delete a specific supplement
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await connectToDatabase();

		// Soft delete by marking as inactive
		const updatedSupplement = await ComprehensiveSupplement.findOneAndUpdate(
			{ id: params.id, isActive: true },
			{
				isActive: false,
				lastUpdated: new Date(),
			},
			{ new: true },
		);

		if (!updatedSupplement) {
			return NextResponse.json(
				{
					success: false,
					error: "Supplement not found",
				},
				{ status: 404 },
			);
		}

		return NextResponse.json({
			success: true,
			message: "Supplement deactivated successfully",
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
