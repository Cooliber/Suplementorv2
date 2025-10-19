"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import type { BodySystem } from "@/data/body-systems";
import {
	Activity,
	Brain,
	ChevronDown,
	ChevronUp,
	Droplets,
	Eye,
	Filter,
	Heart,
	Search,
	Shield,
	Thermometer,
	X,
} from "lucide-react";
import React, { useState, useMemo } from "react";

interface BodySystemSearchProps {
	systems: BodySystem[];
	onFilteredResults: (filtered: BodySystem[]) => void;
	initialQuery?: string;
}

interface SearchFilters {
	query: string;
	supplementCount: { min: number; max: number };
	organCount: { min: number; max: number };
	evidenceLevels: string[];
	effectTypes: string[];
}

const evidenceLevels = ["STRONG", "MODERATE", "WEAK", "INSUFFICIENT"];
const effectTypes = ["SUPPORTS", "ENHANCES", "PROTECTS", "REGULATES"];

const systemIcons: Record<string, React.ReactNode> = {
	cardiovascular: <Heart className="h-4 w-4" />,
	digestive: <Activity className="h-4 w-4" />,
	immune: <Shield className="h-4 w-4" />,
	skeletal: <Activity className="h-4 w-4" />,
	muscular: <Activity className="h-4 w-4" />,
	respiratory: <Activity className="h-4 w-4" />,
	nervous: <Brain className="h-4 w-4" />,
	endocrine: <Activity className="h-4 w-4" />,
	reproductive: <Activity className="h-4 w-4" />,
	integumentary: <Shield className="h-4 w-4" />,
	endocannabinoid: <Brain className="h-4 w-4" />,
	lymphatic: <Shield className="h-4 w-4" />,
	urinary: <Droplets className="h-4 w-4" />,
	sensory: <Eye className="h-4 w-4" />,
	vestibular: <Brain className="h-4 w-4" />,
	hematopoietic: <Heart className="h-4 w-4" />,
	thermoregulatory: <Thermometer className="h-4 w-4" />,
	excretory: <Activity className="h-4 w-4" />,
};

export function BodySystemSearch({
	systems,
	onFilteredResults,
	initialQuery = "",
}: BodySystemSearchProps) {
	const [filters, setFilters] = useState<SearchFilters>({
		query: initialQuery,
		supplementCount: { min: 0, max: 10 },
		organCount: { min: 0, max: 10 },
		evidenceLevels: [],
		effectTypes: [],
	});

	const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
	const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

	// Generate search suggestions based on available content
	const allSearchTerms = useMemo(() => {
		const terms = new Set<string>();

		systems.forEach((system) => {
			// Add system names
			terms.add(system.polishName.toLowerCase());
			terms.add(system.name.toLowerCase());

			// Add organ names
			system.organs.forEach((organ) => {
				terms.add(organ.polishName.toLowerCase());
				terms.add(organ.name.toLowerCase());
			});

			// Add supplement names
			system.relatedSupplements.forEach((supplement) => {
				terms.add(supplement.polishSupplementName.toLowerCase());
				terms.add(supplement.supplementName.toLowerCase());
			});

			// Add functions
			system.polishFunctions.forEach((func) => {
				terms.add(func.toLowerCase());
			});
		});

		return Array.from(terms).sort();
	}, [systems]);

	// Filter systems based on current filters
	const filteredSystems = useMemo(() => {
		return systems.filter((system) => {
			// Text search
			if (filters.query.trim()) {
				const query = filters.query.toLowerCase();
				const matchesSystem =
					system.polishName.toLowerCase().includes(query) ||
					system.name.toLowerCase().includes(query) ||
					system.polishDescription.toLowerCase().includes(query);

				const matchesOrgans = system.organs.some(
					(organ) =>
						organ.polishName.toLowerCase().includes(query) ||
						organ.name.toLowerCase().includes(query) ||
						organ.polishDescription.toLowerCase().includes(query),
				);

				const matchesSupplements = system.relatedSupplements.some(
					(supplement) =>
						supplement.polishSupplementName.toLowerCase().includes(query) ||
						supplement.supplementName.toLowerCase().includes(query) ||
						supplement.polishMechanism.toLowerCase().includes(query),
				);

				const matchesFunctions = system.polishFunctions.some((func) =>
					func.toLowerCase().includes(query),
				);

				if (
					!matchesSystem &&
					!matchesOrgans &&
					!matchesSupplements &&
					!matchesFunctions
				) {
					return false;
				}
			}

			// Supplement count filter
			if (
				system.relatedSupplements.length < filters.supplementCount.min ||
				system.relatedSupplements.length > filters.supplementCount.max
			) {
				return false;
			}

			// Organ count filter
			if (
				system.organs.length < filters.organCount.min ||
				system.organs.length > filters.organCount.max
			) {
				return false;
			}

			// Evidence level filter
			if (filters.evidenceLevels.length > 0) {
				const hasMatchingEvidence = system.relatedSupplements.some(
					(supplement) =>
						filters.evidenceLevels.includes(supplement.evidenceLevel),
				);
				if (!hasMatchingEvidence) return false;
			}

			// Effect type filter
			if (filters.effectTypes.length > 0) {
				const hasMatchingEffect = system.relatedSupplements.some((supplement) =>
					filters.effectTypes.includes(supplement.effectType),
				);
				if (!hasMatchingEffect) return false;
			}

			return true;
		});
	}, [systems, filters]);

	// Update parent component with filtered results
	React.useEffect(() => {
		onFilteredResults(filteredSystems);
	}, [filteredSystems, onFilteredResults]);

	// Generate search suggestions
	React.useEffect(() => {
		if (filters.query.length > 2) {
			const query = filters.query.toLowerCase();
			const suggestions = allSearchTerms
				.filter((term) => term.includes(query))
				.slice(0, 5);
			setSearchSuggestions(suggestions);
		} else {
			setSearchSuggestions([]);
		}
	}, [filters.query, allSearchTerms]);

	const updateFilter = <K extends keyof SearchFilters>(
		key: K,
		value: SearchFilters[K],
	) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const resetFilters = () => {
		setFilters({
			query: "",
			supplementCount: { min: 0, max: 10 },
			organCount: { min: 0, max: 10 },
			evidenceLevels: [],
			effectTypes: [],
		});
	};

	const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
		setFilters((prev) => ({
			...prev,
			[key]: prev[key].includes(value)
				? prev[key].filter((v) => v !== value)
				: [...prev[key], value],
		}));
	};

	return (
		<Card className="mb-6">
			<CardContent className="pt-6">
				{/* Main Search Bar */}
				<div className="space-y-4">
					<div className="relative">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
						<Input
							placeholder="Szukaj układów ciała, narządów, suplementów..."
							value={filters.query}
							onChange={(e) => updateFilter("query", e.target.value)}
							className="pr-20 pl-10"
						/>
						<div className="-translate-y-1/2 absolute top-1/2 right-2 flex transform gap-1">
							{filters.query && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => updateFilter("query", "")}
									className="h-6 w-6 p-0"
								>
									<X className="h-3 w-3" />
								</Button>
							)}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
								className="h-6 px-2"
							>
								<Filter className="mr-1 h-3 w-3" />
								<span className="text-xs">Filtry</span>
							</Button>
						</div>
					</div>

					{/* Search Suggestions */}
					{searchSuggestions.length > 0 && (
						<div className="flex flex-wrap gap-2">
							<span className="mr-2 text-gray-500 text-xs">Sugestie:</span>
							{searchSuggestions.map((suggestion, index) => (
								<Button
									key={index}
									variant="outline"
									size="sm"
									className="h-6 text-xs"
									onClick={() => updateFilter("query", suggestion)}
								>
									{suggestion}
								</Button>
							))}
						</div>
					)}

					{/* Advanced Filters */}
					<Collapsible
						open={showAdvancedFilters}
						onOpenChange={setShowAdvancedFilters}
					>
						<CollapsibleContent className="space-y-4">
							<div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2 md:gap-6">
								{/* Count Filters */}
								<div className="space-y-4">
									<div>
										<label className="mb-2 block font-medium text-sm">
											Liczba suplementów: {filters.supplementCount.min} -{" "}
											{filters.supplementCount.max}
										</label>
										<div className="flex items-center gap-2">
											<Input
												type="number"
												min="0"
												max="10"
												value={filters.supplementCount.min}
												onChange={(e) =>
													updateFilter("supplementCount", {
														...filters.supplementCount,
														min: Number.parseInt(e.target.value) || 0,
													})
												}
												className="w-20"
											/>
											<span className="text-sm">-</span>
											<Input
												type="number"
												min="0"
												max="10"
												value={filters.supplementCount.max}
												onChange={(e) =>
													updateFilter("supplementCount", {
														...filters.supplementCount,
														max: Number.parseInt(e.target.value) || 10,
													})
												}
												className="w-20"
											/>
										</div>
									</div>

									<div>
										<label className="mb-2 block font-medium text-sm">
											Liczba narządów: {filters.organCount.min} -{" "}
											{filters.organCount.max}
										</label>
										<div className="flex items-center gap-2">
											<Input
												type="number"
												min="0"
												max="10"
												value={filters.organCount.min}
												onChange={(e) =>
													updateFilter("organCount", {
														...filters.organCount,
														min: Number.parseInt(e.target.value) || 0,
													})
												}
												className="w-20"
											/>
											<span className="text-sm">-</span>
											<Input
												type="number"
												min="0"
												max="10"
												value={filters.organCount.max}
												onChange={(e) =>
													updateFilter("organCount", {
														...filters.organCount,
														max: Number.parseInt(e.target.value) || 10,
													})
												}
												className="w-20"
											/>
										</div>
									</div>
								</div>

								{/* Category Filters */}
								<div className="space-y-4">
									<div>
										<label className="mb-2 block font-medium text-sm">
											Poziom dowodów:
										</label>
										<div className="flex flex-wrap gap-2">
											{evidenceLevels.map((level) => (
												<Button
													key={level}
													variant={
														filters.evidenceLevels.includes(level)
															? "default"
															: "outline"
													}
													size="sm"
													className="h-7 text-xs"
													onClick={() =>
														toggleArrayFilter("evidenceLevels", level)
													}
												>
													{level === "STRONG" && "Silny"}
													{level === "MODERATE" && "Umiarkowany"}
													{level === "WEAK" && "Słaby"}
													{level === "INSUFFICIENT" && "Niewystarczający"}
												</Button>
											))}
										</div>
									</div>

									<div>
										<label className="mb-2 block font-medium text-sm">
											Typ działania:
										</label>
										<div className="flex flex-wrap gap-2">
											{effectTypes.map((type) => (
												<Button
													key={type}
													variant={
														filters.effectTypes.includes(type)
															? "default"
															: "outline"
													}
													size="sm"
													className="h-7 text-xs"
													onClick={() => toggleArrayFilter("effectTypes", type)}
												>
													{type === "SUPPORTS" && "Wspiera"}
													{type === "ENHANCES" && "Wzmacnia"}
													{type === "PROTECTS" && "Chroni"}
													{type === "REGULATES" && "Reguluje"}
												</Button>
											))}
										</div>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-between border-t pt-4">
								<div className="flex gap-2">
									<Badge variant="secondary">
										Znalezione: {filteredSystems.length}
									</Badge>
									<Badge variant="outline">Wszystkie: {systems.length}</Badge>
								</div>
								<Button variant="outline" size="sm" onClick={resetFilters}>
									Resetuj filtry
								</Button>
							</div>
						</CollapsibleContent>
					</Collapsible>
				</div>
			</CardContent>
		</Card>
	);
}
