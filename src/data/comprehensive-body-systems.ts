/**
 * Comprehensive Body Systems Database
 * Unified interface combining core systems, education, and metadata
 */

import { type BodySystem, bodySystems } from "./body-systems";
import {
	type SystemEducation,
	bodySystemsEducation,
} from "./body-systems-education";
import {
	type SystemMetadata,
	bodySystemsMetadata,
	crossReferences,
	searchIndex,
} from "./body-systems-metadata";

export interface ComprehensiveBodySystem extends BodySystem {
	education?: SystemEducation;
	metadata?: SystemMetadata;
}

// Combined database with all systems and their educational content
export const comprehensiveBodySystems: ComprehensiveBodySystem[] =
	bodySystems.map((system) => {
		const education = bodySystemsEducation.find(
			(edu) => edu.systemId === system.id,
		);
		const metadata = bodySystemsMetadata.find(
			(meta) => meta.systemId === system.id,
		);

		return {
			...system,
			education,
			metadata,
		};
	});

// Utility functions for accessing body systems data
export class BodySystemsService {
	/**
	 * Get all body systems
	 */
	static getAllSystems(): ComprehensiveBodySystem[] {
		return comprehensiveBodySystems;
	}

	/**
	 * Get system by ID
	 */
	static getSystemById(id: string): ComprehensiveBodySystem | undefined {
		return comprehensiveBodySystems.find((system) => system.id === id);
	}

	/**
	 * Get systems by category
	 */
	static getSystemsByCategory(category: string): ComprehensiveBodySystem[] {
		return comprehensiveBodySystems.filter((system) =>
			system.metadata?.categories.some((cat) =>
				cat.toLowerCase().includes(category.toLowerCase()),
			),
		);
	}

	/**
	 * Search systems by query
	 */
	static searchSystems(
		query: string,
		polish = false,
	): ComprehensiveBodySystem[] {
		const searchTerm = query.toLowerCase();
		return comprehensiveBodySystems.filter((system) => {
			// Search in system names
			if (polish && system.polishName.toLowerCase().includes(searchTerm))
				return true;
			if (!polish && system.name.toLowerCase().includes(searchTerm))
				return true;

			// Search in organs
			const organMatch = system.organs.some((organ) => {
				if (polish) {
					return (
						organ.polishName.toLowerCase().includes(searchTerm) ||
						organ.polishDescription.toLowerCase().includes(searchTerm)
					);
				}
				return (
					organ.name.toLowerCase().includes(searchTerm) ||
					organ.description.toLowerCase().includes(searchTerm)
				);
			});
			if (organMatch) return true;

			// Search in functions
			const functionMatch = [
				...system.functions,
				...system.polishFunctions,
			].some((func) => func.toLowerCase().includes(searchTerm));
			if (functionMatch) return true;

			// Search in metadata tags
			if (system.metadata) {
				const tagMatch = polish
					? system.metadata.polishTags.some((tag) =>
							tag.toLowerCase().includes(searchTerm),
						)
					: system.metadata.tags.some((tag) =>
							tag.toLowerCase().includes(searchTerm),
						);
				if (tagMatch) return true;
			}

			return false;
		});
	}

	/**
	 * Get educational content for a system and level
	 */
	static getEducationalContent(
		systemId: string,
		level: "beginner" | "intermediate" | "expert",
	) {
		const system = BodySystemsService.getSystemById(systemId);
		return system?.education?.levels.find((l) => l.level === level);
	}

	/**
	 * Get related systems
	 */
	static getRelatedSystems(systemId: string): ComprehensiveBodySystem[] {
		const system = BodySystemsService.getSystemById(systemId);
		if (!system?.metadata?.relatedSystems) return [];

		return system.metadata.relatedSystems
			.map((id) => BodySystemsService.getSystemById(id))
			.filter(Boolean) as ComprehensiveBodySystem[];
	}

	/**
	 * Get supplement relationships for a system
	 */
	static getSystemSupplements(systemId: string) {
		const system = BodySystemsService.getSystemById(systemId);
		return system?.relatedSupplements || [];
	}

	/**
	 * Get cross-references for a system
	 */
	static getSystemCrossReferences(systemId: string) {
		return crossReferences.filter(
			(ref) => ref.sourceSystem === systemId || ref.targetSystem === systemId,
		);
	}

	/**
	 * Get learning pathway for a system
	 */
	static getLearningPathway(systemId: string): string[] {
		const system = BodySystemsService.getSystemById(systemId);
		if (!system?.metadata?.prerequisites) return [];

		const pathway: string[] = [];
		const visited = new Set<string>();

		const buildPath = (currentId: string) => {
			if (visited.has(currentId)) return;
			visited.add(currentId);

			const currentSystem = BodySystemsService.getSystemById(currentId);
			if (currentSystem?.metadata?.prerequisites) {
				currentSystem.metadata.prerequisites.forEach((prereq) => {
					buildPath(prereq);
				});
			}

			pathway.push(currentId);
		};

		buildPath(systemId);
		return pathway;
	}

	/**
	 * Get system statistics
	 */
	static getSystemStatistics() {
		return {
			totalSystems: comprehensiveBodySystems.length,
			totalOrgans: comprehensiveBodySystems.reduce(
				(acc, system) => acc + system.organs.length,
				0,
			),
			totalSupplements: comprehensiveBodySystems.reduce(
				(acc, system) => acc + system.relatedSupplements.length,
				0,
			),
			difficultyDistribution: comprehensiveBodySystems.reduce(
				(acc, system) => {
					const difficulty = system.metadata?.difficulty || "intermediate";
					acc[difficulty] = (acc[difficulty] || 0) + 1;
					return acc;
				},
				{} as Record<string, number>,
			),
		};
	}
}

// Export individual components for direct access
export {
	bodySystems,
	bodySystemsEducation,
	bodySystemsMetadata,
	searchIndex,
	crossReferences,
};

// Default export for easy importing
export default comprehensiveBodySystems;
