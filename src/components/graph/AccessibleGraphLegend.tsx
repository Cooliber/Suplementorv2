/**
 * Accessible Graph Legend Component
 * Enhanced for WCAG compliance with proper ARIA labels, keyboard navigation,
 * and screen reader support for Polish users
 */

import { Badge } from "@/components/ui/badge";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import type React from "react";

// Node type to color and Polish label mapping
const nodeTypeMap: Record<string, { color: string; label: string }> = {
	SUPPLEMENT: { color: "#3B82F6", label: "Suplement" },
	NEUROTRANSMITTER: { color: "#10B981", label: "Neuroprzekaźnik" },
	BRAIN_REGION: { color: "#8B5CF6", label: "Obszar mózgu" },
	COGNITIVE_FUNCTION: { color: "#F59E0B", label: "Funkcja poznawcza" },
	PATHWAY: { color: "#EF4444", label: "Szlak" },
	MECHANISM: { color: "#EC4899", label: "Mechanizm" },
	VITAMIN: { color: "#06B6D4", label: "Witamina" },
	MINERAL: { color: "#84CC16", label: "Minerał" },
	AMINO_ACID: { color: "#F97316", label: "Aminokwas" },
	FATTY_ACID: { color: "#14B8A6", label: "Kwas tłuszczowy" },
	HERB: { color: "#22C55E", label: "Zioło" },
	NOOTROPIC: { color: "#6366F1", label: "Nootropik" },
	ADAPTOGEN: { color: "#A855F7", label: "Adaptogen" },
};

// Relationship type to color and Polish label mapping
const relationshipTypeMap: Record<string, { color: string; label: string }> = {
	ENHANCES: { color: "#10B981", label: "Wzmacnia" },
	INHIBITS: { color: "#EF4444", label: "Hamuje" },
	MODULATES: { color: "#8B5CF6", label: "Moduluje" },
	SYNERGIZES: { color: "#F59E0B", label: "Synergizuje" },
	ANTAGONIZES: { color: "#F97316", label: "Antagonizuje" },
	REQUIRES: { color: "#3B82F6", label: "Wymaga" },
	PRODUCES: { color: "#EC4899", label: "Produkuje" },
	METABOLIZES: { color: "#06B6D4", label: "Metabolizuje" },
};

const AccessibleGraphLegend: React.FC = () => {
	const { filters, setFilters } = useKnowledgeGraphStore();

	const toggleNodeTypeFilter = (type: string) => {
		const newTypes = filters.nodeTypes.includes(type as any)
			? filters.nodeTypes.filter((t) => t !== type)
			: [...filters.nodeTypes, type as any];

		setFilters({ nodeTypes: newTypes });
	};

	const toggleRelationshipTypeFilter = (type: string) => {
		const newTypes = filters.relationshipTypes.includes(type as any)
			? filters.relationshipTypes.filter((t) => t !== type)
			: [...filters.relationshipTypes, type as any];

		setFilters({ relationshipTypes: newTypes });
	};

	return (
		<div
			role="region"
			aria-label="Legenda grafu wiedzy"
			className="rounded-lg border bg-white p-4 shadow-sm"
		>
			<h3
				className="mb-4 font-semibold text-gray-800 text-lg"
				id="graph-legend-title"
			>
				Legenda
			</h3>

			<div className="space-y-6">
				{/* Node Types Section */}
				<div>
					<h4
						className="mb-2 font-medium text-gray-700 text-md"
						id="node-types-heading"
					>
						Typy węzłów
					</h4>
					<ul aria-labelledby="node-types-heading" className="space-y-2">
						{Object.entries(nodeTypeMap).map(([type, { color, label }]) => {
							const isActive = filters.nodeTypes.includes(type as any);
							return (
								<li key={type}>
									<button
										role="switch"
										aria-checked={isActive}
										aria-label={`Filtruj po typie ${label}`}
										onClick={() => toggleNodeTypeFilter(type)}
										className={`flex w-full items-center gap-2 rounded p-2 text-left transition-colors ${
											isActive
												? "border border-blue-200 bg-blue-50"
												: "hover:bg-gray-50"
										}`}
									>
										<div
											className="h-4 w-4 rounded-full border border-gray-300"
											style={{ backgroundColor: color }}
											aria-hidden="true"
										/>
										<span
											className={
												isActive ? "font-medium text-blue-700" : "text-gray-700"
											}
										>
											{label}
										</span>
										<span className="ml-auto text-gray-500 text-xs">
											({type})
										</span>
									</button>
								</li>
							);
						})}
					</ul>
				</div>

				{/* Relationship Types Section */}
				<div>
					<h4
						className="mb-2 font-medium text-gray-700 text-md"
						id="relationship-types-heading"
					>
						Typy relacji
					</h4>
					<ul
						aria-labelledby="relationship-types-heading"
						className="space-y-2"
					>
						{Object.entries(relationshipTypeMap).map(
							([type, { color, label }]) => {
								const isActive = filters.relationshipTypes.includes(
									type as any,
								);
								return (
									<li key={type}>
										<button
											role="switch"
											aria-checked={isActive}
											aria-label={`Filtruj po relacji ${label}`}
											onClick={() => toggleRelationshipTypeFilter(type)}
											className={`flex w-full items-center gap-2 rounded p-2 text-left transition-colors ${
												isActive
													? "border border-green-200 bg-green-50"
													: "hover:bg-gray-50"
											}`}
										>
											<div
												className="h-0.5 w-4"
												style={{ backgroundColor: color }}
												aria-hidden="true"
											/>
											<span
												className={
													isActive
														? "font-medium text-green-700"
														: "text-gray-700"
												}
											>
												{label}
											</span>
											<span className="ml-auto text-gray-500 text-xs">
												({type})
											</span>
										</button>
									</li>
								);
							},
						)}
					</ul>
				</div>

				{/* Evidence Levels Section */}
				<div>
					<h4
						className="mb-2 font-medium text-gray-700 text-md"
						id="evidence-levels-heading"
					>
						Poziomy dowodów
					</h4>
					<div
						role="group"
						aria-labelledby="evidence-levels-heading"
						className="flex flex-wrap gap-2"
					>
						{(
							[
								"STRONG",
								"MODERATE",
								"WEAK",
								"INSUFFICIENT",
								"CONFLICTING",
							] as const
						).map((level) => {
							const isActive = filters.evidenceLevels.includes(level);
							return (
								<button
									key={level}
									role="switch"
									aria-checked={isActive}
									aria-label={`Filtruj po poziomie dowodów ${level}`}
									onClick={() => {
										const newLevels = isActive
											? filters.evidenceLevels.filter((l) => l !== level)
											: [...filters.evidenceLevels, level];
										setFilters({ evidenceLevels: newLevels });
									}}
									className={`rounded-full px-3 py-1.5 font-medium text-sm transition-colors ${
										isActive
											? "border border-blue-300 bg-blue-100 text-blue-800"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									{level}
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AccessibleGraphLegend;
