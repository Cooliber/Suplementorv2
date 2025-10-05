"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	type SupplementWithRelations,
	allSupplementProfiles,
} from "@/data/supplements";
import {
	ChevronDown,
	ChevronUp,
	Clock,
	Euro,
	Filter,
	Plus,
	Search,
	Star,
	Users,
} from "lucide-react";
import React, { useState, useMemo } from "react";

interface SupplementSelectorProps {
	supplements?: any[];
	selectedSupplement?: string;
	onSelect?: (supplementId: string) => void;
	className?: string;
	showAdvancedFilters?: boolean;
}

type FilterCategory =
	| "category"
	| "evidenceLevel"
	| "clinicalApplication"
	| "mechanism"
	| "safety";

export default function SupplementSelector({
	supplements: externalSupplements,
	selectedSupplement: externalSelectedSupplement,
	onSelect,
	className,
	showAdvancedFilters = true,
}: SupplementSelectorProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
	const [showFilters, setShowFilters] = useState(false);

	// Filter states
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedEvidenceLevels, setSelectedEvidenceLevels] = useState<
		string[]
	>([]);
	const [selectedClinicalApps, setSelectedClinicalApps] = useState<string[]>(
		[],
	);
	const [selectedMechanisms, setSelectedMechanisms] = useState<string[]>([]);
	const [selectedSafetyProfiles, setSelectedSafetyProfiles] = useState<
		string[]
	>([]);
	const [sortBy, setSortBy] = useState<
		"name" | "evidence" | "effectiveness" | "cost"
	>("name");

	// Extract unique values for filters
	const filterOptions = useMemo(() => {
		const categories = [
			...new Set(allSupplementProfiles.map((s) => s.category)),
		];
		const evidenceLevels = [
			...new Set(allSupplementProfiles.map((s) => s.evidenceLevel)),
		];
		const clinicalApps = [
			...new Set(
				allSupplementProfiles.flatMap((s) =>
					s.clinicalApplications.map((app) => app.condition),
				),
			),
		];
		const mechanisms = [
			...new Set(
				allSupplementProfiles.flatMap((s) => s.mechanisms.map((m) => m.name)),
			),
		];

		return {
			categories: categories.sort(),
			evidenceLevels: evidenceLevels.sort(),
			clinicalApplications: clinicalApps.sort(),
			mechanisms: mechanisms.sort(),
		};
	}, []);

	// Filter and sort supplements (optimized with early returns)
	const filteredAndSortedSupplements = useMemo(() => {
		// Early return if no filters applied
		if (
			!searchQuery &&
			selectedCategories.length === 0 &&
			selectedEvidenceLevels.length === 0 &&
			selectedClinicalApps.length === 0 &&
			selectedMechanisms.length === 0
		) {
			// Just sort all supplements
			const sorted = [...allSupplementProfiles];
			sorted.sort((a, b) => {
				switch (sortBy) {
					case "evidence": {
						const evidenceOrder: Record<string, number> = {
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
					}
					case "effectiveness": {
						const aAvg =
							a.clinicalApplications.reduce(
								(sum, app) => sum + app.effectivenessRating,
								0,
							) / a.clinicalApplications.length;
						const bAvg =
							b.clinicalApplications.reduce(
								(sum, app) => sum + app.effectivenessRating,
								0,
							) / b.clinicalApplications.length;
						return bAvg - aAvg;
					}
					case "cost":
						return (
							((a as any).economicData?.averageCostPerMonth?.average || 0) -
							((b as any).economicData?.averageCostPerMonth?.average || 0)
						);
					default:
						return a.polishName.localeCompare(b.polishName);
				}
			});
			return sorted;
		}

		const filtered = allSupplementProfiles.filter((supplement) => {
			// Text search (early return if no match)
			if (searchQuery) {
				const searchLower = searchQuery.toLowerCase();
				const matchesSearch =
					supplement.polishName.toLowerCase().includes(searchLower) ||
					supplement.name.toLowerCase().includes(searchLower) ||
					(supplement.description || "").toLowerCase().includes(searchLower);

				if (!matchesSearch) return false;
			}

			// Category filter
			if (
				selectedCategories.length > 0 &&
				!selectedCategories.includes(supplement.category)
			) {
				return false;
			}

			// Evidence level filter
			if (
				selectedEvidenceLevels.length > 0 &&
				!selectedEvidenceLevels.includes(supplement.evidenceLevel)
			) {
				return false;
			}

			// Clinical application filter
			if (selectedClinicalApps.length > 0) {
				const hasMatchingApp = selectedClinicalApps.some((app) =>
					supplement.clinicalApplications.some(
						(sApp) => sApp.condition === app,
					),
				);
				if (!hasMatchingApp) return false;
			}

			// Mechanism filter
			if (selectedMechanisms.length > 0) {
				const hasMatchingMechanism = selectedMechanisms.some((mechanism) =>
					supplement.mechanisms.some((sMech) => sMech.name === mechanism),
				);
				if (!hasMatchingMechanism) return false;
			}

			return true;
		});

		// Sort supplements
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "evidence": {
					const evidenceOrder: Record<string, number> = {
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
				}
				case "effectiveness": {
					const aAvg =
						a.clinicalApplications.reduce(
							(sum, app) => sum + app.effectivenessRating,
							0,
						) / a.clinicalApplications.length;
					const bAvg =
						b.clinicalApplications.reduce(
							(sum, app) => sum + app.effectivenessRating,
							0,
						) / b.clinicalApplications.length;
					return bAvg - aAvg;
				}
				case "cost":
					return (
						((a as any).economicData?.averageCostPerMonth?.average || 0) -
						((b as any).economicData?.averageCostPerMonth?.average || 0)
					);
				default:
					return a.polishName.localeCompare(b.polishName);
			}
		});

		return filtered;
	}, [
		searchQuery,
		selectedCategories,
		selectedEvidenceLevels,
		selectedClinicalApps,
		selectedMechanisms,
		sortBy,
	]);

	const handleSelect = (supplementId: string) => {
		setSelectedSupplements((prev) =>
			prev.includes(supplementId)
				? prev.filter((id) => id !== supplementId)
				: [...prev, supplementId],
		);
		onSelect?.(supplementId);
	};

	const clearFilters = () => {
		setSelectedCategories([]);
		setSelectedEvidenceLevels([]);
		setSelectedClinicalApps([]);
		setSelectedMechanisms([]);
		setSelectedSafetyProfiles([]);
		setSearchQuery("");
	};

	const getActiveFilterCount = () => {
		return (
			selectedCategories.length +
			selectedEvidenceLevels.length +
			selectedClinicalApps.length +
			selectedMechanisms.length +
			selectedSafetyProfiles.length +
			(searchQuery ? 1 : 0)
		);
	};

	const getEvidenceLevelColor = (level: string) => {
		switch (level) {
			case "STRONG":
				return "bg-green-100 text-green-800 border-green-200";
			case "MODERATE":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "WEAK":
				return "bg-orange-100 text-orange-800 border-orange-200";
			case "INSUFFICIENT":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "NOOTROPIC":
				return "🧠";
			case "FATTY_ACID":
				return "🫒";
			case "MINERAL":
				return "⚡";
			case "VITAMIN":
				return "💊";
			case "ADAPTOGEN":
				return "🌿";
			default:
				return "🔬";
		}
	};

	return (
		<Card className={className}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Wybór Suplementów</CardTitle>
					<div className="flex items-center gap-2">
						{getActiveFilterCount() > 0 && (
							<Button variant="ghost" size="sm" onClick={clearFilters}>
								Wyczyść filtry ({getActiveFilterCount()})
							</Button>
						)}
						{showAdvancedFilters && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowFilters(!showFilters)}
								className="flex items-center gap-1"
							>
								<Filter className="h-4 w-4" />
								Filtry
								{showFilters ? (
									<ChevronUp className="h-4 w-4" />
								) : (
									<ChevronDown className="h-4 w-4" />
								)}
							</Button>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Search */}
					<div className="relative">
						<Search
							className="absolute top-3 left-3 h-4 w-4 text-muted-foreground"
							aria-hidden="true"
						/>
						<Input
							placeholder="Szukaj suplementów..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
							aria-label="Wyszukaj suplementy"
							role="searchbox"
						/>
					</div>

					{/* Sorting */}
					<div className="flex items-center gap-2">
						<span className="font-medium text-sm">Sortuj:</span>
						<Select
							value={sortBy}
							onValueChange={(value: any) => setSortBy(value)}
						>
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="name">Nazwa</SelectItem>
								<SelectItem value="evidence">Siła dowodów</SelectItem>
								<SelectItem value="effectiveness">Skuteczność</SelectItem>
								<SelectItem value="cost">Koszt</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Advanced Filters */}
					{showAdvancedFilters && (
						<Collapsible open={showFilters} onOpenChange={setShowFilters}>
							<CollapsibleContent className="space-y-4">
								{/* Categories */}
								<div>
									<h4 className="mb-2 font-medium">Kategorie</h4>
									<div className="flex flex-wrap gap-2">
										{filterOptions.categories.map((category) => (
											<div
												key={category}
												className="flex items-center space-x-2"
											>
												<Checkbox
													id={`category-${category}`}
													checked={selectedCategories.includes(category)}
													onCheckedChange={(checked) => {
														if (checked) {
															setSelectedCategories((prev) => [
																...prev,
																category,
															]);
														} else {
															setSelectedCategories((prev) =>
																prev.filter((c) => c !== category),
															);
														}
													}}
												/>
												<label
													htmlFor={`category-${category}`}
													className="flex items-center gap-1 text-sm"
												>
													{getCategoryIcon(category)} {category}
												</label>
											</div>
										))}
									</div>
								</div>

								{/* Evidence Levels */}
								<div>
									<h4 className="mb-2 font-medium">Siła dowodów</h4>
									<div className="flex flex-wrap gap-2">
										{filterOptions.evidenceLevels.map((level) => (
											<div key={level} className="flex items-center space-x-2">
												<Checkbox
													id={`evidence-${level}`}
													checked={selectedEvidenceLevels.includes(level)}
													onCheckedChange={(checked) => {
														if (checked) {
															setSelectedEvidenceLevels((prev) => [
																...prev,
																level,
															]);
														} else {
															setSelectedEvidenceLevels((prev) =>
																prev.filter((l) => l !== level),
															);
														}
													}}
												/>
												<label
													htmlFor={`evidence-${level}`}
													className="text-sm"
												>
													<Badge
														variant="outline"
														className={getEvidenceLevelColor(level)}
													>
														{level}
													</Badge>
												</label>
											</div>
										))}
									</div>
								</div>

								{/* Clinical Applications */}
								<div>
									<h4 className="mb-2 font-medium">Zastosowania kliniczne</h4>
									<div className="flex flex-wrap gap-2">
										{filterOptions.clinicalApplications
											.slice(0, 10)
											.map((app) => (
												<div key={app} className="flex items-center space-x-2">
													<Checkbox
														id={`clinical-${app}`}
														checked={selectedClinicalApps.includes(app)}
														onCheckedChange={(checked) => {
															if (checked) {
																setSelectedClinicalApps((prev) => [
																	...prev,
																	app,
																]);
															} else {
																setSelectedClinicalApps((prev) =>
																	prev.filter((a) => a !== app),
																);
															}
														}}
													/>
													<label
														htmlFor={`clinical-${app}`}
														className="text-sm"
													>
														{app}
													</label>
												</div>
											))}
									</div>
								</div>
							</CollapsibleContent>
						</Collapsible>
					)}

					{/* Results */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<p className="text-muted-foreground text-sm">
								Znaleziono {filteredAndSortedSupplements.length} suplementów
							</p>
						</div>

						{filteredAndSortedSupplements.map((supplement) => (
							<div
								key={supplement.id}
								className="flex items-start justify-between rounded-lg border p-3 hover:bg-muted/50"
							>
								<div className="flex-1">
									<div className="mb-1 flex items-center gap-2">
										<h4 className="font-medium">{supplement.polishName}</h4>
										<Badge
											variant="outline"
											className={getEvidenceLevelColor(
												supplement.evidenceLevel,
											)}
										>
											{supplement.evidenceLevel}
										</Badge>
										<Badge variant="secondary" className="text-xs">
											{getCategoryIcon(supplement.category)}{" "}
											{supplement.category}
										</Badge>
									</div>

									<p className="mb-2 text-muted-foreground text-sm">
										{supplement.polishDescription || supplement.description}
									</p>

									{/* Quick stats */}
									<div className="flex items-center gap-4 text-gray-500 text-xs">
										<div className="flex items-center gap-1">
											<Star className="h-3 w-3 text-yellow-500" />
											{supplement.clinicalApplications.length} zastosowań
										</div>
										<div className="flex items-center gap-1">
											<Users className="h-3 w-3" />
											{(supplement as any).clinicalEvidence?.totalStudies || 0}{" "}
											badań
										</div>
										<div className="flex items-center gap-1">
											<Euro className="h-3 w-3" />
											{(supplement as any).economicData?.averageCostPerMonth
												?.average || 0}
											€/miesiąc
										</div>
									</div>

									{/* Key mechanisms */}
									<div className="mt-2 flex flex-wrap gap-1">
										{supplement.mechanisms
											.slice(0, 2)
											.map((mechanism, index) => (
												<Badge
													key={index}
													variant="outline"
													className="text-xs"
												>
													{mechanism.polishName || mechanism.name}
												</Badge>
											))}
									</div>
								</div>

								<Button
									size="sm"
									variant={
										selectedSupplements.includes(supplement.id)
											? "default"
											: "outline"
									}
									onClick={() => handleSelect(supplement.id)}
									className="ml-4"
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>

					{selectedSupplements.length > 0 && (
						<div className="border-t pt-4">
							<h5 className="mb-2 font-medium">
								Wybrane suplementy ({selectedSupplements.length})
							</h5>
							<div className="flex flex-wrap gap-2">
								{selectedSupplements.map((id) => {
									const supplement = allSupplementProfiles.find(
										(s) => s.id === id,
									);
									return supplement ? (
										<Badge
											key={id}
											variant="default"
											className="flex items-center gap-1"
										>
											{supplement.polishName}
											<button
												onClick={() => handleSelect(id)}
												className="ml-1 rounded-full p-0.5 hover:bg-black/20"
											>
												×
											</button>
										</Badge>
									) : null;
								})}
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
