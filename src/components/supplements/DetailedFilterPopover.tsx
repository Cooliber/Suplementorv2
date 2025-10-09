"use client";

/**
 * Detailed Filter Popover Component
 * Comprehensive multi-select filtering for supplement features and attributes
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFilters } from "@/hooks/useFilters";
import type { SupplementCategory, EvidenceLevel } from "@/types/supplement";
import {
	ChevronDown,
	ChevronUp,
	Search,
	Filter,
	Brain,
	Heart,
	Shield,
	Star,
	TrendingUp,
	X,
	Info,
} from "lucide-react";
import { useState, useMemo } from "react";

interface DetailedFilterPopoverProps {
	children: React.ReactNode;
	availableCompounds?: string[];
	availableConditions?: string[];
	availableMechanisms?: string[];
	availableSideEffects?: string[];
	availableTags?: string[];
	onFiltersChange?: (filters: any) => void;
}

export function DetailedFilterPopover({
	children,
	availableCompounds = [],
	availableConditions = [],
	availableMechanisms = [],
	availableSideEffects = [],
	availableTags = [],
	onFiltersChange,
}: DetailedFilterPopoverProps) {
	const {
		filters,
		updateFilter,
		clearFilterSection,
	} = useFilters();

	const [searchTerms, setSearchTerms] = useState<Record<string, string>>({
		compounds: "",
		conditions: "",
		mechanisms: "",
		sideEffects: "",
		tags: "",
	});

	const [expandedSections, setExpandedSections] = useState<Set<string>>(
		new Set(["categories", "evidence"])
	);

	// Filter options based on search terms
	const filteredCompounds = useMemo(() =>
		availableCompounds.filter(compound =>
			compound.toLowerCase().includes((searchTerms.compounds || "").toLowerCase())
		).slice(0, 50),
		[availableCompounds, searchTerms.compounds]
	);

	const filteredConditions = useMemo(() =>
		availableConditions.filter(condition =>
			condition.toLowerCase().includes((searchTerms.conditions || "").toLowerCase())
		).slice(0, 50),
		[availableConditions, searchTerms.conditions]
	);

	const filteredMechanisms = useMemo(() =>
		availableMechanisms.filter(mechanism =>
			mechanism.toLowerCase().includes((searchTerms.mechanisms || "").toLowerCase())
		).slice(0, 50),
		[availableMechanisms, searchTerms.mechanisms]
	);

	const filteredSideEffects = useMemo(() =>
		availableSideEffects.filter(effect =>
			effect.toLowerCase().includes((searchTerms.sideEffects || "").toLowerCase())
		).slice(0, 50),
		[availableSideEffects, searchTerms.sideEffects]
	);

	const filteredTags = useMemo(() =>
		availableTags.filter(tag =>
			tag.toLowerCase().includes((searchTerms.tags || "").toLowerCase())
		).slice(0, 50),
		[availableTags, searchTerms.tags]
	);

	// Category and evidence level options
	const categories: SupplementCategory[] = [
		"NOOTROPIC",
		"VITAMIN",
		"MINERAL",
		"AMINO_ACID",
		"HERB",
		"ADAPTOGEN",
		"COENZYME",
		"FATTY_ACID",
		"PROBIOTIC",
		"ENZYME",
		"OTHER",
	];

	const evidenceLevels: EvidenceLevel[] = [
		"STRONG",
		"MODERATE",
		"WEAK",
		"INSUFFICIENT",
		"CONFLICTING",
	];

	const categoryLabels: Record<SupplementCategory, string> = {
		NOOTROPIC: "Nootropiki",
		VITAMIN: "Witaminy",
		MINERAL: "Minerały",
		AMINO_ACID: "Aminokwasy",
		HERB: "Zioła",
		ADAPTOGEN: "Adaptogeny",
		COENZYME: "Koenzymy",
		FATTY_ACID: "Kwasy tłuszczowe",
		PROBIOTIC: "Probiotyki",
		ENZYME: "Enzymy",
		OTHER: "Inne",
	};

	const evidenceLabels: Record<EvidenceLevel, string> = {
		STRONG: "Silne dowody",
		MODERATE: "Umiarkowane dowody",
		WEAK: "Słabe dowody",
		INSUFFICIENT: "Niewystarczające",
		CONFLICTING: "Sprzeczne",
	};

	// Toggle section expansion
	const toggleSection = (section: string) => {
		setExpandedSections(prev => {
			const newSet = new Set(prev);
			if (newSet.has(section)) {
				newSet.delete(section);
			} else {
				newSet.add(section);
			}
			return newSet;
		});
	};

	// Handle filter changes
	const handleFilterChange = () => {
		onFiltersChange?.(filters);
	};

	// Generic checkbox handler
	const handleMultiSelectChange = (
		filterKey: keyof typeof filters,
		value: string,
		checked: boolean
	) => {
		const currentValues = (filters[filterKey] as string[]) || [];
		const newValues = checked
			? [...currentValues, value]
			: currentValues.filter(v => v !== value);
		updateFilter(filterKey, newValues);
		handleFilterChange();
	};

	// Clear section handler
	const handleClearSection = (section: keyof typeof filters) => {
		clearFilterSection(section);
		handleFilterChange();
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				{children}
			</PopoverTrigger>
			<PopoverContent className="w-[500px] max-h-[80vh] overflow-hidden" align="start">
				<TooltipProvider>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold flex items-center gap-2">
								<Filter className="h-4 w-4" />
								Szczegółowe filtry
							</h3>
						</div>

						<Tabs defaultValue="basic" className="w-full">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="basic">Podstawowe</TabsTrigger>
								<TabsTrigger value="advanced">Zaawansowane</TabsTrigger>
								<TabsTrigger value="ranges">Zakresy</TabsTrigger>
							</TabsList>

							{/* Basic Filters Tab */}
							<TabsContent value="basic" className="space-y-4 mt-4">
								{/* Categories */}
								<Collapsible
									open={expandedSections.has("categories")}
									onOpenChange={() => toggleSection("categories")}
								>
									<CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
										<div className="flex items-center gap-2">
											<Brain className="h-4 w-4" />
											<span className="font-medium">Kategorie</span>
											{filters.categories.length > 0 && (
												<Badge variant="secondary" className="text-xs">
													{filters.categories.length}
												</Badge>
											)}
										</div>
										<div className="flex items-center gap-2">
											{filters.categories.length > 0 && (
												<Button
													variant="ghost"
													size="sm"
													className="h-6 px-2 text-xs"
													onClick={(e) => {
														e.stopPropagation();
														handleClearSection("categories");
													}}
												>
													Wyczyść
												</Button>
											)}
											{expandedSections.has("categories") ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
										</div>
									</CollapsibleTrigger>
									<CollapsibleContent className="space-y-2 mt-2">
										<div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
											{categories.map((category) => (
												<div key={category} className="flex items-center space-x-2">
													<Checkbox
														id={`category-${category}`}
														checked={filters.categories.includes(category)}
														onCheckedChange={(checked) =>
															handleMultiSelectChange("categories", category, !!checked)
														}
													/>
													<Label
														htmlFor={`category-${category}`}
														className="cursor-pointer text-sm"
													>
														{categoryLabels[category]}
													</Label>
												</div>
											))}
										</div>
									</CollapsibleContent>
								</Collapsible>

								{/* Evidence Levels */}
								<Collapsible
									open={expandedSections.has("evidence")}
									onOpenChange={() => toggleSection("evidence")}
								>
									<CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
										<div className="flex items-center gap-2">
											<Star className="h-4 w-4" />
											<span className="font-medium">Dowody naukowe</span>
											{filters.evidenceLevels.length > 0 && (
												<Badge variant="secondary" className="text-xs">
													{filters.evidenceLevels.length}
												</Badge>
											)}
										</div>
										<div className="flex items-center gap-2">
											{filters.evidenceLevels.length > 0 && (
												<Button
													variant="ghost"
													size="sm"
													className="h-6 px-2 text-xs"
													onClick={(e) => {
														e.stopPropagation();
														handleClearSection("evidenceLevels");
													}}
												>
													Wyczyść
												</Button>
											)}
											{expandedSections.has("evidence") ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
										</div>
									</CollapsibleTrigger>
									<CollapsibleContent className="space-y-2 mt-2">
										<div className="grid grid-cols-1 gap-2">
											{evidenceLevels.map((level) => (
												<div key={level} className="flex items-center space-x-2">
													<Checkbox
														id={`evidence-${level}`}
														checked={filters.evidenceLevels.includes(level)}
														onCheckedChange={(checked) =>
															handleMultiSelectChange("evidenceLevels", level, !!checked)
														}
													/>
													<Label
														htmlFor={`evidence-${level}`}
														className="cursor-pointer text-sm flex-1"
													>
														{evidenceLabels[level]}
													</Label>
												</div>
											))}
										</div>
									</CollapsibleContent>
								</Collapsible>
							</TabsContent>

							{/* Advanced Filters Tab */}
							<TabsContent value="advanced" className="space-y-4 mt-4">
								{/* Active Compounds */}
								{availableCompounds.length > 0 && (
									<Collapsible
										open={expandedSections.has("compounds")}
										onOpenChange={() => toggleSection("compounds")}
									>
										<CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
											<div className="flex items-center gap-2">
												<Search className="h-4 w-4" />
												<span className="font-medium">Substancje czynne</span>
												{filters.activeCompounds.length > 0 && (
													<Badge variant="secondary" className="text-xs">
														{filters.activeCompounds.length}
													</Badge>
												)}
											</div>
											<div className="flex items-center gap-2">
												{filters.activeCompounds.length > 0 && (
													<Button
														variant="ghost"
														size="sm"
														className="h-6 px-2 text-xs"
														onClick={(e) => {
															e.stopPropagation();
															handleClearSection("activeCompounds");
														}}
													>
														Wyczyść
													</Button>
												)}
												{expandedSections.has("compounds") ? (
													<ChevronUp className="h-4 w-4" />
												) : (
													<ChevronDown className="h-4 w-4" />
												)}
											</div>
										</CollapsibleTrigger>
										<CollapsibleContent className="space-y-3 mt-2">
											<Input
												placeholder="Szukaj substancji czynnych..."
												value={searchTerms.compounds}
												onChange={(e) => setSearchTerms(prev => ({ ...prev, compounds: e.target.value }))}
												className="text-sm"
											/>
											<div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
												{filteredCompounds.map((compound) => (
													<div key={compound} className="flex items-center space-x-2">
														<Checkbox
															id={`compound-${compound}`}
															checked={filters.activeCompounds.includes(compound)}
															onCheckedChange={(checked) =>
																handleMultiSelectChange("activeCompounds", compound, !!checked)
															}
														/>
														<Label
															htmlFor={`compound-${compound}`}
															className="cursor-pointer text-sm flex-1"
														>
															{compound}
														</Label>
													</div>
												))}
											</div>
										</CollapsibleContent>
									</Collapsible>
								)}

								{/* Clinical Conditions */}
								{availableConditions.length > 0 && (
									<Collapsible
										open={expandedSections.has("conditions")}
										onOpenChange={() => toggleSection("conditions")}
									>
										<CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
											<div className="flex items-center gap-2">
												<Heart className="h-4 w-4" />
												<span className="font-medium">Zastosowania kliniczne</span>
												{filters.clinicalConditions.length > 0 && (
													<Badge variant="secondary" className="text-xs">
														{filters.clinicalConditions.length}
													</Badge>
												)}
											</div>
											<div className="flex items-center gap-2">
												{filters.clinicalConditions.length > 0 && (
													<Button
														variant="ghost"
														size="sm"
														className="h-6 px-2 text-xs"
														onClick={(e) => {
															e.stopPropagation();
															handleClearSection("clinicalConditions");
														}}
													>
														Wyczyść
													</Button>
												)}
												{expandedSections.has("conditions") ? (
													<ChevronUp className="h-4 w-4" />
												) : (
													<ChevronDown className="h-4 w-4" />
												)}
											</div>
										</CollapsibleTrigger>
										<CollapsibleContent className="space-y-3 mt-2">
											<Input
												placeholder="Szukaj zastosowań..."
												value={searchTerms.conditions}
												onChange={(e) => setSearchTerms(prev => ({ ...prev, conditions: e.target.value }))}
												className="text-sm"
											/>
											<div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
												{filteredConditions.map((condition) => (
													<div key={condition} className="flex items-center space-x-2">
														<Checkbox
															id={`condition-${condition}`}
															checked={filters.clinicalConditions.includes(condition)}
															onCheckedChange={(checked) =>
																handleMultiSelectChange("clinicalConditions", condition, !!checked)
															}
														/>
														<Label
															htmlFor={`condition-${condition}`}
															className="cursor-pointer text-sm flex-1"
														>
															{condition}
														</Label>
													</div>
												))}
											</div>
										</CollapsibleContent>
									</Collapsible>
								)}

								{/* Mechanisms */}
								{availableMechanisms.length > 0 && (
									<Collapsible
										open={expandedSections.has("mechanisms")}
										onOpenChange={() => toggleSection("mechanisms")}
									>
										<CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
											<div className="flex items-center gap-2">
												<TrendingUp className="h-4 w-4" />
												<span className="font-medium">Mechanizmy działania</span>
												{filters.mechanisms.length > 0 && (
													<Badge variant="secondary" className="text-xs">
														{filters.mechanisms.length}
													</Badge>
												)}
											</div>
											<div className="flex items-center gap-2">
												{filters.mechanisms.length > 0 && (
													<Button
														variant="ghost"
														size="sm"
														className="h-6 px-2 text-xs"
														onClick={(e) => {
															e.stopPropagation();
															handleClearSection("mechanisms");
														}}
													>
														Wyczyść
													</Button>
												)}
												{expandedSections.has("mechanisms") ? (
													<ChevronUp className="h-4 w-4" />
												) : (
													<ChevronDown className="h-4 w-4" />
												)}
											</div>
										</CollapsibleTrigger>
										<CollapsibleContent className="space-y-3 mt-2">
											<Input
												placeholder="Szukaj mechanizmów..."
												value={searchTerms.mechanisms}
												onChange={(e) => setSearchTerms(prev => ({ ...prev, mechanisms: e.target.value }))}
												className="text-sm"
											/>
											<div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
												{filteredMechanisms.map((mechanism) => (
													<div key={mechanism} className="flex items-center space-x-2">
														<Checkbox
															id={`mechanism-${mechanism}`}
															checked={filters.mechanisms.includes(mechanism)}
															onCheckedChange={(checked) =>
																handleMultiSelectChange("mechanisms", mechanism, !!checked)
															}
														/>
														<Label
															htmlFor={`mechanism-${mechanism}`}
															className="cursor-pointer text-sm flex-1"
														>
															{mechanism}
														</Label>
													</div>
												))}
											</div>
										</CollapsibleContent>
									</Collapsible>
								)}

								{/* Tags */}
								{availableTags.length > 0 && (
									<Collapsible
										open={expandedSections.has("tags")}
										onOpenChange={() => toggleSection("tags")}
									>
										<CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md">
											<div className="flex items-center gap-2">
												<Filter className="h-4 w-4" />
												<span className="font-medium">Tagi</span>
												{filters.tags.length > 0 && (
													<Badge variant="secondary" className="text-xs">
														{filters.tags.length}
													</Badge>
												)}
											</div>
											<div className="flex items-center gap-2">
												{filters.tags.length > 0 && (
													<Button
														variant="ghost"
														size="sm"
														className="h-6 px-2 text-xs"
														onClick={(e) => {
															e.stopPropagation();
															handleClearSection("tags");
														}}
													>
														Wyczyść
													</Button>
												)}
												{expandedSections.has("tags") ? (
													<ChevronUp className="h-4 w-4" />
												) : (
													<ChevronDown className="h-4 w-4" />
												)}
											</div>
										</CollapsibleTrigger>
										<CollapsibleContent className="space-y-3 mt-2">
											<Input
												placeholder="Szukaj tagów..."
												value={searchTerms.tags}
												onChange={(e) => setSearchTerms(prev => ({ ...prev, tags: e.target.value }))}
												className="text-sm"
											/>
											<div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
												{filteredTags.map((tag) => (
													<div key={tag} className="flex items-center space-x-2">
														<Checkbox
															id={`tag-${tag}`}
															checked={filters.tags.includes(tag)}
															onCheckedChange={(checked) =>
																handleMultiSelectChange("tags", tag, !!checked)
															}
														/>
														<Label
															htmlFor={`tag-${tag}`}
															className="cursor-pointer text-sm"
														>
															{tag}
														</Label>
													</div>
												))}
											</div>
										</CollapsibleContent>
									</Collapsible>
								)}
							</TabsContent>

							{/* Range Filters Tab */}
							<TabsContent value="ranges" className="space-y-6 mt-4">
								{/* Price Range */}
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<Label className="text-sm font-medium">Zakres cenowy (PLN)</Label>
										<div className="flex items-center gap-2">
											<span className="text-xs text-muted-foreground">
												{filters.priceRange[0]} - {filters.priceRange[1]} zł
											</span>
											<Button
												variant="ghost"
												size="sm"
												className="h-6 px-2 text-xs"
												onClick={() => {
													updateFilter("priceRange", [0, 1000]);
													handleFilterChange();
												}}
											>
												Reset
											</Button>
										</div>
									</div>
									<Slider
										value={filters.priceRange}
										onValueChange={(value) => {
											updateFilter("priceRange", value as [number, number]);
											handleFilterChange();
										}}
										max={1000}
										min={0}
										step={10}
										className="w-full"
									/>
								</div>

								{/* Dosage Range */}
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<Label className="text-sm font-medium">Zakres dawkowania (mg)</Label>
										<div className="flex items-center gap-2">
											<span className="text-xs text-muted-foreground">
												{filters.dosageRange[0]} - {filters.dosageRange[1]} mg
											</span>
											<Button
												variant="ghost"
												size="sm"
												className="h-6 px-2 text-xs"
												onClick={() => {
													updateFilter("dosageRange", [0, 5000]);
													handleFilterChange();
												}}
											>
												Reset
											</Button>
										</div>
									</div>
									<Slider
										value={filters.dosageRange}
										onValueChange={(value) => {
											updateFilter("dosageRange", value as [number, number]);
											handleFilterChange();
										}}
										max={5000}
										min={0}
										step={50}
										className="w-full"
									/>
								</div>

								{/* User Rating */}
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<Label className="text-sm font-medium">Ocena użytkowników</Label>
										<div className="flex items-center gap-2">
											<span className="text-xs text-muted-foreground">
												{filters.ratingRange[0]} - {filters.ratingRange[1]}/5
											</span>
											<Button
												variant="ghost"
												size="sm"
												className="h-6 px-2 text-xs"
												onClick={() => {
													updateFilter("ratingRange", [0, 5]);
													handleFilterChange();
												}}
											>
												Reset
											</Button>
										</div>
									</div>
									<Slider
										value={filters.ratingRange}
										onValueChange={(value) => {
											updateFilter("ratingRange", value as [number, number]);
											handleFilterChange();
										}}
										max={5}
										min={0}
										step={0.1}
										className="w-full"
									/>
								</div>

								{/* Safety Rating */}
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<Label className="text-sm font-medium">Ocena bezpieczeństwa</Label>
										<div className="flex items-center gap-2">
											<span className="text-xs text-muted-foreground">
												{filters.safetyRating[0]} - {filters.safetyRating[1]}/10
											</span>
											<Button
												variant="ghost"
												size="sm"
												className="h-6 px-2 text-xs"
												onClick={() => {
													updateFilter("safetyRating", [0, 10]);
													handleFilterChange();
												}}
											>
												Reset
											</Button>
										</div>
									</div>
									<Slider
										value={filters.safetyRating}
										onValueChange={(value) => {
											updateFilter("safetyRating", value as [number, number]);
											handleFilterChange();
										}}
										max={10}
										min={0}
										step={1}
										className="w-full"
									/>
								</div>

								{/* Boolean Filters */}
								<div className="space-y-4 border-t pt-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Label htmlFor="hasStudies" className="cursor-pointer text-sm">
												Tylko suplementy z badaniami
											</Label>
											<Tooltip>
												<TooltipTrigger>
													<Info className="h-3 w-3 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													Wyświetl tylko suplementy z opublikowanymi badaniami naukowymi
												</TooltipContent>
											</Tooltip>
										</div>
										<Switch
											id="hasStudies"
											checked={filters.hasStudies}
											onCheckedChange={(checked) => {
												updateFilter("hasStudies", checked);
												handleFilterChange();
											}}
										/>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Label htmlFor="hasReviews" className="cursor-pointer text-sm">
												Tylko suplementy z opiniami
											</Label>
											<Tooltip>
												<TooltipTrigger>
													<Info className="h-3 w-3 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													Wyświetl tylko suplementy z opiniami użytkowników
												</TooltipContent>
											</Tooltip>
										</div>
										<Switch
											id="hasReviews"
											checked={filters.hasReviews}
											onCheckedChange={(checked) => {
												updateFilter("hasReviews", checked);
												handleFilterChange();
											}}
										/>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Label htmlFor="onlyNatural" className="cursor-pointer text-sm">
												Tylko suplementy naturalne
											</Label>
											<Tooltip>
												<TooltipTrigger>
													<Info className="h-3 w-3 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													Wyświetl tylko suplementy pochodzenia naturalnego (zioła, adaptogeny)
												</TooltipContent>
											</Tooltip>
										</div>
										<Switch
											id="onlyNatural"
											checked={filters.onlyNatural}
											onCheckedChange={(checked) => {
												updateFilter("onlyNatural", checked);
												handleFilterChange();
											}}
										/>
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</TooltipProvider>
			</PopoverContent>
		</Popover>
	);
}