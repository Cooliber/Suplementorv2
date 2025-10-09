"use client";

/**
 * Advanced Supplement Filters Component
 * Comprehensive filtering interface with shadcn/ui components and Polish localization
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
	Filter,
	Search,
	SlidersHorizontal,
	Star,
	TrendingUp,
	X,
	Bookmark,
	BookmarkCheck,
	Share2,
	RotateCcw,
} from "lucide-react";
import { useState } from "react";

interface AdvancedSupplementFiltersProps {
	onFiltersChange?: (filters: any) => void;
	availableCompounds?: string[];
	availableConditions?: string[];
	availableMechanisms?: string[];
	availableSideEffects?: string[];
	availableTags?: string[];
	isLoading?: boolean;
}

export function AdvancedSupplementFilters({
	onFiltersChange,
	availableCompounds = [],
	availableConditions = [],
	availableMechanisms = [],
	availableSideEffects = [],
	availableTags = [],
	isLoading = false,
}: AdvancedSupplementFiltersProps) {
	const {
		filters,
		updateFilter,
		clearFilters,
		clearFilterSection,
		hasActiveFilters,
		activeFilterCount,
		presets,
		savePreset,
		loadPreset,
		generateUrl,
	} = useFilters();

	const [expandedSections, setExpandedSections] = useState<Set<string>>(
		new Set(["categories", "evidence"])
	);
	const [showSavePresetDialog, setShowSavePresetDialog] = useState(false);
	const [presetName, setPresetName] = useState("");

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

	const sortOptions = [
		{ value: "relevance", label: "Trafność" },
		{ value: "name", label: "Nazwa (EN)" },
		{ value: "polishName", label: "Nazwa (PL)" },
		{ value: "category", label: "Kategoria" },
		{ value: "evidence", label: "Dowody naukowe" },
		{ value: "price", label: "Cena" },
		{ value: "rating", label: "Ocena użytkowników" },
		{ value: "safety", label: "Bezpieczeństwo" },
		{ value: "createdAt", label: "Data dodania" },
		{ value: "updatedAt", label: "Ostatnia aktualizacja" },
	];

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

	// Save preset
	const handleSavePreset = () => {
		if (presetName.trim()) {
			savePreset(presetName.trim());
			setPresetName("");
			setShowSavePresetDialog(false);
		}
	};

	// Share current filters
	const handleShare = async () => {
		const url = generateUrl();
		try {
			await navigator.share({
				title: "Filtry suplementów",
				text: "Sprawdź te filtry suplementów",
				url,
			});
		} catch {
			await navigator.clipboard.writeText(url);
			// Could show a toast here
		}
	};

	return (
		<TooltipProvider>
			<div className="space-y-4">
				{/* Main Filter Controls */}
				<Card>
					<CardHeader className="pb-4">
						<CardTitle className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Filter className="h-5 w-5" />
								Zaawansowane filtry suplementów
								{hasActiveFilters && (
									<Badge variant="secondary">
										{activeFilterCount} aktywnych
									</Badge>
								)}
							</div>
							<div className="flex items-center gap-2">
								{hasActiveFilters && (
									<Button
										variant="outline"
										size="sm"
										onClick={clearFilters}
									>
										<RotateCcw className="h-4 w-4 mr-1" />
										Wyczyść
									</Button>
								)}
								<Button
									variant="outline"
									size="sm"
									onClick={handleShare}
									disabled={!hasActiveFilters}
								>
									<Share2 className="h-4 w-4" />
								</Button>
							</div>
						</CardTitle>
						<CardDescription>
							Dokładne filtrowanie suplementów według kategorii, dowodów naukowych i właściwości
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-4">
						{/* Search Query */}
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Szukaj suplementów, korzyści, składników..."
								value={filters.query}
								onChange={(e) => {
									updateFilter("query", e.target.value);
									handleFilterChange();
								}}
								className="pl-10"
							/>
						</div>

						{/* Quick Filter Buttons */}
						<div className="flex flex-wrap gap-2">
							{presets.slice(0, 3).map((preset) => (
								<Button
									key={preset.id}
									variant="outline"
									size="sm"
									onClick={() => loadPreset(preset.id)}
								>
									{preset.icon} {preset.name}
								</Button>
							))}
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowSavePresetDialog(true)}
								disabled={!hasActiveFilters}
							>
								<Bookmark className="h-4 w-4 mr-1" />
								Zapisz filtr
							</Button>
						</div>

						{/* Advanced Filters Popover */}
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline" className="w-full">
									<SlidersHorizontal className="h-4 w-4 mr-2" />
									Zaawansowane filtry
									{hasActiveFilters && (
										<Badge variant="secondary" className="ml-2">
											{activeFilterCount}
										</Badge>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-96 max-h-[80vh] overflow-y-auto" align="start">
								<div className="space-y-6">
									{/* Categories Section */}
									<Collapsible
										open={expandedSections.has("categories")}
										onOpenChange={() => toggleSection("categories")}
									>
										<CollapsibleTrigger className="flex items-center justify-between w-full">
											<h4 className="font-medium">Kategorie suplementów</h4>
											{expandedSections.has("categories") ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
										</CollapsibleTrigger>
										<CollapsibleContent className="space-y-3 mt-3">
											<div className="grid grid-cols-1 gap-3">
												{categories.map((category) => (
													<div key={category} className="flex items-center space-x-2">
														<Checkbox
															id={`category-${category}`}
															checked={filters.categories.includes(category)}
															onCheckedChange={(checked) => {
																const newCategories = checked
																	? [...filters.categories, category]
																	: filters.categories.filter(c => c !== category);
																updateFilter("categories", newCategories);
																handleFilterChange();
															}}
														/>
														<Label
															htmlFor={`category-${category}`}
															className="cursor-pointer text-sm flex-1"
														>
															{categoryLabels[category]}
														</Label>
													</div>
												))}
											</div>
										</CollapsibleContent>
									</Collapsible>

									{/* Evidence Levels Section */}
									<Collapsible
										open={expandedSections.has("evidence")}
										onOpenChange={() => toggleSection("evidence")}
									>
										<CollapsibleTrigger className="flex items-center justify-between w-full">
											<h4 className="font-medium">Poziom dowodów naukowych</h4>
											{expandedSections.has("evidence") ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
										</CollapsibleTrigger>
										<CollapsibleContent className="space-y-3 mt-3">
											<div className="grid grid-cols-1 gap-3">
												{evidenceLevels.map((level) => (
													<div key={level} className="flex items-center space-x-2">
														<Checkbox
															id={`evidence-${level}`}
															checked={filters.evidenceLevels.includes(level)}
															onCheckedChange={(checked) => {
																const newLevels = checked
																	? [...filters.evidenceLevels, level]
																	: filters.evidenceLevels.filter(l => l !== level);
																updateFilter("evidenceLevels", newLevels);
																handleFilterChange();
															}}
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

									{/* Range Filters */}
									<div className="space-y-4">
										{/* Price Range */}
										<div>
											<div className="flex items-center justify-between mb-2">
												<Label className="text-sm font-medium">Zakres cenowy</Label>
												<span className="text-xs text-muted-foreground">
													{filters.priceRange[0]} - {filters.priceRange[1]} zł
												</span>
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

										{/* Safety Rating */}
										<div>
											<div className="flex items-center justify-between mb-2">
												<Label className="text-sm font-medium">Ocena bezpieczeństwa</Label>
												<span className="text-xs text-muted-foreground">
													{filters.safetyRating[0]} - {filters.safetyRating[1]}/10
												</span>
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

										{/* User Rating */}
										<div>
											<div className="flex items-center justify-between mb-2">
												<Label className="text-sm font-medium">Ocena użytkowników</Label>
												<span className="text-xs text-muted-foreground">
													{filters.ratingRange[0]} - {filters.ratingRange[1]}/5
												</span>
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
									</div>

									{/* Boolean Filters */}
									<div className="space-y-3 border-t pt-4">
										<div className="flex items-center justify-between">
											<Label htmlFor="hasStudies" className="cursor-pointer text-sm">
												Tylko suplementy z badaniami
											</Label>
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
											<Label htmlFor="hasReviews" className="cursor-pointer text-sm">
												Tylko suplementy z opiniami
											</Label>
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
											<Label htmlFor="onlyNatural" className="cursor-pointer text-sm">
												Tylko suplementy naturalne
											</Label>
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

									{/* Sort Options */}
									<div className="border-t pt-4">
										<Label className="text-sm font-medium mb-3 block">Sortowanie</Label>
										<div className="space-y-2">
											<Select
												value={filters.sortBy}
												onValueChange={(value) => {
													updateFilter("sortBy", value as any);
													handleFilterChange();
												}}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{sortOptions.map((option) => (
														<SelectItem key={option.value} value={option.value}>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											<Select
												value={filters.sortOrder}
												onValueChange={(value) => {
													updateFilter("sortOrder", value as "asc" | "desc");
													handleFilterChange();
												}}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="asc">Rosnąco</SelectItem>
													<SelectItem value="desc">Malejąco</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
								</div>
							</PopoverContent>
						</Popover>
					</CardContent>
				</Card>

				{/* Active Filters Display */}
				{hasActiveFilters && (
					<Card>
						<CardContent className="pt-4">
							<div className="flex flex-wrap gap-2">
								{filters.categories.map((category) => (
									<Badge key={category} variant="secondary" className="gap-1">
										{categoryLabels[category]}
										<Button
											variant="ghost"
											size="sm"
											className="h-4 w-4 p-0 hover:bg-transparent"
											onClick={() => {
												const newCategories = filters.categories.filter(c => c !== category);
												updateFilter("categories", newCategories);
												handleFilterChange();
											}}
										>
											<X className="h-2 w-2" />
										</Button>
									</Badge>
								))}

								{filters.evidenceLevels.map((level) => (
									<Badge key={level} variant="outline" className="gap-1">
										{evidenceLabels[level]}
										<Button
											variant="ghost"
											size="sm"
											className="h-4 w-4 p-0 hover:bg-transparent"
											onClick={() => {
												const newLevels = filters.evidenceLevels.filter(l => l !== level);
												updateFilter("evidenceLevels", newLevels);
												handleFilterChange();
											}}
										>
											<X className="h-2 w-2" />
										</Button>
									</Badge>
								))}

								{(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) && (
									<Badge variant="outline" className="gap-1">
										Cena: {filters.priceRange[0]}-{filters.priceRange[1]} zł
										<Button
											variant="ghost"
											size="sm"
											className="h-4 w-4 p-0 hover:bg-transparent"
											onClick={() => {
												updateFilter("priceRange", [0, 1000]);
												handleFilterChange();
											}}
										>
											<X className="h-2 w-2" />
										</Button>
									</Badge>
								)}

								{filters.hasStudies && (
									<Badge variant="outline" className="gap-1">
										Tylko z badaniami
										<Button
											variant="ghost"
											size="sm"
											className="h-4 w-4 p-0 hover:bg-transparent"
											onClick={() => {
												updateFilter("hasStudies", false);
												handleFilterChange();
											}}
										>
											<X className="h-2 w-2" />
										</Button>
									</Badge>
								)}

								<Button
									variant="ghost"
									size="sm"
									onClick={clearFilters}
									className="text-muted-foreground"
								>
									Wyczyść wszystkie filtry
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Save Preset Dialog */}
				{showSavePresetDialog && (
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Zapisz filtr</CardTitle>
							<CardDescription>
								Zapisz bieżące filtry jako preset do późniejszego wykorzystania
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Input
								placeholder="Nazwa filtra..."
								value={presetName}
								onChange={(e) => setPresetName(e.target.value)}
								onKeyPress={(e) => e.key === "Enter" && handleSavePreset()}
							/>
							<div className="flex gap-2">
								<Button onClick={handleSavePreset} disabled={!presetName.trim()}>
									Zapisz
								</Button>
								<Button
									variant="outline"
									onClick={() => setShowSavePresetDialog(false)}
								>
									Anuluj
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</TooltipProvider>
	);
}