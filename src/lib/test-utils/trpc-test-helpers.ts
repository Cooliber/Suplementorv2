/**
 * tRPC Testing Helpers
 * Utilities for testing tRPC routers with mocked MongoDB context
 */

import type { Session } from "next-auth";
import { expect, vi } from "vitest";

/**
 * Creates a mock tRPC context for testing
 * @param overrides - Optional context overrides
 * @returns Mock context object
 */
export function createMockContext(
	overrides: {
		session?: Session | null;
		db?: any;
	} = {},
) {
	const mockDb = overrides.db || createMockDb();

	return {
		session: overrides.session || null,
		db: mockDb,
	};
}

/**
 * Creates a mock database object with Mongoose-like methods
 * @returns Mock db object with all models
 */
export function createMockDb() {
	const createMockModel = () => ({
		find: vi.fn().mockReturnThis(),
		findOne: vi.fn().mockReturnThis(),
		findById: vi.fn().mockReturnThis(),
		create: vi.fn(),
		updateOne: vi.fn(),
		deleteOne: vi.fn(),
		aggregate: vi.fn(),
		countDocuments: vi.fn(),
		sort: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		skip: vi.fn().mockReturnThis(),
		select: vi.fn().mockReturnThis(),
		populate: vi.fn().mockReturnThis(),
		lean: vi.fn().mockResolvedValue([]),
		exec: vi.fn().mockResolvedValue([]),
	});

	return {
		knowledgeNode: createMockModel(),
		knowledgeRelationship: createMockModel(),
		supplement: createMockModel(),
		comprehensiveSupplement: createMockModel(),
		brainRegion: createMockModel(),
		neurotransmitterSystem: createMockModel(),
		researchStudy: createMockModel(),
		supplementIntakeLog: createMockModel(),
		effectMeasurement: createMockModel(),
		supplementSchedule: createMockModel(),
		progressInsight: createMockModel(),
		userHealthProfile: createMockModel(),
		aiRecommendation: createMockModel(),
		drugSupplementInteraction: createMockModel(),
		post: createMockModel(),
	};
}

/**
 * Creates a mock authenticated session
 * @param userId - Optional user ID
 * @returns Mock session object
 */
export function createMockSession(userId = "test-user-id"): Session {
	return {
		user: {
			id: userId,
			name: "Test User",
			email: "test@example.com",
			image: null,
		},
		expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
	};
}

/**
 * Creates mock supplement data for testing
 * @param overrides - Optional field overrides
 * @returns Mock supplement object
 */
export function createMockSupplement(overrides: any = {}) {
	return {
		id: "test-supplement-id",
		name: "Test Supplement",
		polishName: "Testowy Suplement",
		category: "VITAMINS_MINERALS",
		evidenceLevel: "STRONG",
		description: "Test description",
		polishDescription: "Testowy opis",
		tags: ["test", "supplement"],
		polishTags: ["test", "suplement"],
		isActive: true,
		lastUpdated: new Date(),
		...overrides,
	};
}

/**
 * Creates mock knowledge node data for testing
 * @param overrides - Optional field overrides
 * @returns Mock knowledge node object
 */
export function createMockKnowledgeNode(overrides: any = {}) {
	return {
		id: "test-node-id",
		name: "Test Node",
		polishName: "Testowy Węzeł",
		type: "SUPPLEMENT",
		category: "COGNITIVE",
		description: "Test node description",
		polishDescription: "Testowy opis węzła",
		evidenceLevel: "STRONG",
		importance: 8,
		centrality: 0.75,
		tags: ["test"],
		...overrides,
	};
}

/**
 * Creates mock user health profile for testing
 * @param overrides - Optional field overrides
 * @returns Mock user health profile
 */
export function createMockUserProfile(overrides: any = {}) {
	return {
		age: 30,
		gender: "male" as const,
		weight: 75,
		healthGoals: ["cognitive_enhancement", "energy_boost"],
		existingConditions: [],
		currentMedications: [],
		allergies: [],
		dietaryRestrictions: [],
		experienceLevel: "intermediate" as const,
		...overrides,
	};
}

/**
 * Asserts that a tRPC error was thrown
 * @param fn - Function that should throw
 * @param code - Expected error code
 */
export async function expectTRPCError(
	fn: () => Promise<any>,
	code = "BAD_REQUEST",
) {
	try {
		await fn();
		throw new Error("Expected function to throw tRPC error");
	} catch (error: any) {
		expect(error.code).toBe(code);
	}
}

/**
 * Waits for all pending promises to resolve
 * Useful for testing async operations
 */
export async function flushPromises() {
	return new Promise((resolve) => setImmediate(resolve));
}

/**
 * Creates a mock MongoDB lean() result
 * @param data - Data to return
 * @returns Chainable mock with lean() support
 */
export function mockLeanQuery(data: any) {
	return {
		find: vi.fn().mockReturnThis(),
		findOne: vi.fn().mockReturnThis(),
		sort: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		skip: vi.fn().mockReturnThis(),
		select: vi.fn().mockReturnThis(),
		lean: vi.fn().mockResolvedValue(data),
	};
}

/**
 * Example test using these helpers:
 *
 * ```typescript
 * import { createMockContext, createMockSupplement } from '@/lib/test-utils/trpc-test-helpers';
 * import { supplementRouter } from '@/server/api/routers/supplement';
 *
 * describe('supplementRouter.getById', () => {
 *   it('should return supplement by id', async () => {
 *     const mockSupplement = createMockSupplement();
 *     const ctx = createMockContext();
 *
 *     ctx.db.comprehensiveSupplement.findOne.mockReturnValue({
 *       lean: vi.fn().mockResolvedValue(mockSupplement),
 *     });
 *
 *     const caller = supplementRouter.createCaller(ctx);
 *     const result = await caller.getById({
 *       id: 'test-supplement-id',
 *       includeRelations: false
 *     });
 *
 *     expect(result).toEqual(mockSupplement);
 *     expect(ctx.db.comprehensiveSupplement.findOne).toHaveBeenCalledWith({
 *       id: 'test-supplement-id',
 *       isActive: true,
 *     });
 *   });
 * });
 * ```
 */
