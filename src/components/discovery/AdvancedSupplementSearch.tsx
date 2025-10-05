"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib/utils";
import { ChevronDown, Filter, Loader2, Search, X } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

// Polish supplement categories with translations
const SUPPLEMENT_CATEGORIES = [
	{ id: "NOOTROPIC", name: "Nootropiki", englishName: "Nootropics", count: 45 },
	{ id: "VITAMIN", name: "Witaminy", englishName: "Vitamins", count: 32 },
	{ id: "MINERAL", name: "Minerały", englishName: "Minerals", count: 28 },
	{
		id: "FATTY_ACID",
		name: "Kwasy tłuszczowe",
		englishName: "Fatty Acids",
		count: 18,
	},
	{
		id: "AMINO_ACID",
		name: "Aminokwasy",
		englishName: "Amino Acids",
		count: 24,
	},
	{ id: "HERB", name: "Zioła", englishName: "Herbs", count: 67 },
	{ id: "PROBIOTIC", name: "Probiotyki", englishName: "Probiotics", count: 15 },
	{ id: "ENZYME", name: "Enzymy", englishName: "Enzymes", count: 12 },
];

// Evidence levels with Polish translations
const EVIDENCE_LEVELS = [
	{
		id: "STRONG",
		name: "Silne",
		color: "bg-green-100 text-green-800 border-green-200",
		count: 23,
	},
	{
		id: "MODERATE",
		name: "Umiarkowane",
		color: "bg-yellow-100 text-yellow-800 border-yellow-200",
		count: 89,
	},
	{
		id: "WEAK",
		name: "Słabe",
		color: "bg-orange-100 text-orange-800 border-orange-200",
		count: 67,
	},
	{
		id: "INSUFFICIENT",
		name: "Niewystarczające",
		color: "bg-red-100 text-red-800 border-red-200",
		count: 34,
	},
];

// Clinical conditions with Polish translations
const CLINICAL_CONDITIONS = [
	"Pamięć i koncentracja",
	"Stres i lęk",
	"Sen i regeneracja",
	"Energia i witalność",
	"Nastrój i depresja",
	"Funkcje poznawcze",
	"Zdrowie serca",
	"Odporność",
	"Zdrowie kości",
	"Zdrowie skóry",
	"Trawienie",
	"Detoksykacja",
];

interface SearchFilters {
	categories: string[];
	evidenceLevels: string[];
	clinicalConditions: string[];
	availableInPoland: boolean;
	maxPrice: number | null;
	organicOnly: boolean;
	veganFriendly: boolean;
}

interface SupplementSuggestion {
	id: string;
	name: string;
	polishName: string;
	category: string;
	evidenceLevel: string;
	description: string;
}

interface AdvancedSupplementSearchProps {
	onSearch: (query: string, filters: SearchFilters) => void;
	onSuggestionSelect: (supplement: SupplementSuggestion) => void;
	loading?: boolean;
	suggestions?: SupplementSuggestion[];
	className?: string;
}

const AdvancedSupplementSearch: React.FC<AdvancedSupplementSearchProps> = ({
	onSearch,
	onSuggestionSelect,
	loading = false,
	suggestions = [],
	className = "",
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [filters, setFilters] = useState<SearchFilters>({
		categories: [],
		evidenceLevels: [],
		clinicalConditions: [],
		availableInPoland: false,
		maxPrice: null,
		organicOnly: false,
		veganFriendly: false,
	});
	const [showFilters, setShowFilters] = useState(false);

	// Debounce search query for performance
	const debouncedQuery = useDebounce(searchQuery, 300);

	// Trigger search when query or filters change
	useEffect(() => {
		if (
			debouncedQuery.length >= 2 ||
			Object.values(filters).some((v) =>
				Array.isArray(v)
					? v.length > 0
					: v === true || (typeof v === "number" && v > 0),
			)
		) {
			onSearch(debouncedQuery, filters);
		}
	}, [debouncedQuery, filters, onSearch]);

	// Handle filter changes
	const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	}, []);

	const toggleArrayFilter = useCallback(
		(
			key: "categories" | "evidenceLevels" | "clinicalConditions",
			value: string,
		) => {
			setFilters((prev) => ({
				...prev,
				[key]: prev[key].includes(value)
					? prev[key].filter((item) => item !== value)
					: [...prev[key], value],
			}));
		},
		[],
	);

	// Clear all filters
	const clearFilters = useCallback(() => {
		setFilters({
			categories: [],
			evidenceLevels: [],
			clinicalConditions: [],
			availableInPoland: false,
			maxPrice: null,
			organicOnly: false,
			veganFriendly: false,
		});
	}, []);

	// Count active filters
	const activeFiltersCount = useMemo(() => {
		return (
			filters.categories.length +
			filters.evidenceLevels.length +
			filters.clinicalConditions.length +
			(filters.availableInPoland ? 1 : 0) +
			(filters.maxPrice ? 1 : 0) +
			(filters.organicOnly ? 1 : 0) +
			(filters.veganFriendly ? 1 : 0)
		);
	}, [filters]);

	// Handle suggestion selection
	const handleSuggestionSelect = useCallback(
		(suggestion: SupplementSuggestion) => {
			setSearchQuery(suggestion.polishName);
			setShowSuggestions(false);
			onSuggestionSelect(suggestion);
		},
		[onSuggestionSelect],
	);

	// Handle search input
	const handleSearchChange = useCallback((value: string) => {
		setSearchQuery(value);
		setShowSuggestions(value.length >= 2);
	}, []);

	return (
		<div className={cn("w-full space-y-4", className)}>
			{/* Main Search Bar */}
			<div className="relative">
				<div className="relative">
					<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
					<Input
						type="text"
						placeholder="Wyszukaj suplementy (np. magnesium, omega-3, nootropiki)..."
						value={searchQuery}
						onChange={(e) => handleSearchChange(e.target.value)}
						onFocus={() => setShowSuggestions(searchQuery.length >= 2)}
						className="h-12 pr-12 pl-10 text-base"
						aria-label="Wyszukaj suplementy"
					/>
					{loading && (
						<Loader2 className="-translate-y-1/2 absolute top-1/2 right-3 h-4 w-4 transform animate-spin text-gray-400" />
					)}
					{searchQuery && !loading && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setSearchQuery("");
								setShowSuggestions(false);
							}}
							className="-translate-y-1/2 absolute top-1/2 right-1 h-8 w-8 transform p-0"
							aria-label="Wyczyść wyszukiwanie"
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>

				{/* Search Suggestions */}
				{showSuggestions && suggestions.length > 0 && (
					<Card className="absolute top-full right-0 left-0 z-50 mt-1 max-h-80 overflow-y-auto">
						<CardContent className="p-0">
							<Command>
								<CommandList>
									<CommandGroup>
										{suggestions.map((suggestion) => (
											<CommandItem
												key={suggestion.id}
												onSelect={() => handleSuggestionSelect(suggestion)}
												className="flex cursor-pointer items-center justify-between p-3 hover:bg-gray-50"
											>
												<div className="flex-1">
													<div className="font-medium text-sm">
														{suggestion.polishName}
													</div>
													<div className="mt-1 text-gray-600 text-xs">
														{
															SUPPLEMENT_CATEGORIES.find(
																(cat) => cat.id === suggestion.category,
															)?.name
														}
													</div>
												</div>
												<Badge
													className={cn(
														"text-xs",
														EVIDENCE_LEVELS.find(
															(level) => level.id === suggestion.evidenceLevel,
														)?.color,
													)}
												>
													{
														EVIDENCE_LEVELS.find(
															(level) => level.id === suggestion.evidenceLevel,
														)?.name
													}
												</Badge>
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Filter Controls */}
			<div className="flex flex-wrap items-center gap-2">
				<Popover open={showFilters} onOpenChange={setShowFilters}>
					<PopoverTrigger asChild>
						<Button variant="outline" className="h-10">
							<Filter className="mr-2 h-4 w-4" />
							Filtry
							{activeFiltersCount > 0 && (
								<Badge
									variant="secondary"
									className="ml-2 flex h-5 w-5 items-center justify-center p-0 text-xs"
								>
									{activeFiltersCount}
								</Badge>
							)}
							<ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-96 p-0" align="start">
						<div className="max-h-96 space-y-4 overflow-y-auto p-4">
							{/* Categories Filter */}
							<div>
								<Label className="mb-3 block font-medium text-sm">
									Kategorie
								</Label>
								<div className="grid grid-cols-2 gap-2">
									{SUPPLEMENT_CATEGORIES.map((category) => (
										<div
											key={category.id}
											className="flex items-center space-x-2"
										>
											<Checkbox
												id={`category-${category.id}`}
												checked={filters.categories.includes(category.id)}
												onCheckedChange={() =>
													toggleArrayFilter("categories", category.id)
												}
											/>
											<Label
												htmlFor={`category-${category.id}`}
												className="flex-1 cursor-pointer text-sm"
											>
												{category.name}
												<span className="ml-1 text-gray-500">
													({category.count})
												</span>
											</Label>
										</div>
									))}
								</div>
							</div>

							<Separator />

							{/* Evidence Levels Filter */}
							<div>
								<Label className="mb-3 block font-medium text-sm">
									Poziom dowodów
								</Label>
								<div className="space-y-2">
									{EVIDENCE_LEVELS.map((level) => (
										<div key={level.id} className="flex items-center space-x-2">
											<Checkbox
												id={`evidence-${level.id}`}
												checked={filters.evidenceLevels.includes(level.id)}
												onCheckedChange={() =>
													toggleArrayFilter("evidenceLevels", level.id)
												}
											/>
											<Label
												htmlFor={`evidence-${level.id}`}
												className="flex-1 cursor-pointer text-sm"
											>
												<Badge className={cn("mr-2", level.color)}>
													{level.name}
												</Badge>
												<span className="text-gray-500">({level.count})</span>
											</Label>
										</div>
									))}
								</div>
							</div>

							<Separator />

							{/* Clinical Conditions Filter */}
							<div>
								<Label className="mb-3 block font-medium text-sm">
									Zastosowania kliniczne
								</Label>
								<div className="grid max-h-32 grid-cols-1 gap-2 overflow-y-auto">
									{CLINICAL_CONDITIONS.map((condition) => (
										<div
											key={condition}
											className="flex items-center space-x-2"
										>
											<Checkbox
												id={`condition-${condition}`}
												checked={filters.clinicalConditions.includes(condition)}
												onCheckedChange={() =>
													toggleArrayFilter("clinicalConditions", condition)
												}
											/>
											<Label
												htmlFor={`condition-${condition}`}
												className="cursor-pointer text-sm"
											>
												{condition}
											</Label>
										</div>
									))}
								</div>
							</div>

							<Separator />

							{/* Additional Filters */}
							<div className="space-y-3">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="available-poland"
										checked={filters.availableInPoland}
										onCheckedChange={(checked) =>
											updateFilter("availableInPoland", checked)
										}
									/>
									<Label
										htmlFor="available-poland"
										className="cursor-pointer text-sm"
									>
										Dostępne w Polsce
									</Label>
								</div>

								<div className="flex items-center space-x-2">
									<Checkbox
										id="organic-only"
										checked={filters.organicOnly}
										onCheckedChange={(checked) =>
											updateFilter("organicOnly", checked)
										}
									/>
									<Label
										htmlFor="organic-only"
										className="cursor-pointer text-sm"
									>
										Tylko organiczne
									</Label>
								</div>

								<div className="flex items-center space-x-2">
									<Checkbox
										id="vegan-friendly"
										checked={filters.veganFriendly}
										onCheckedChange={(checked) =>
											updateFilter("veganFriendly", checked)
										}
									/>
									<Label
										htmlFor="vegan-friendly"
										className="cursor-pointer text-sm"
									>
										Przyjazne dla wegan
									</Label>
								</div>
							</div>

							{/* Filter Actions */}
							<div className="flex justify-between border-t pt-4">
								<Button variant="outline" size="sm" onClick={clearFilters}>
									Wyczyść filtry
								</Button>
								<Button size="sm" onClick={() => setShowFilters(false)}>
									Zastosuj filtry
								</Button>
							</div>
						</div>
					</PopoverContent>
				</Popover>

				{/* Active Filter Tags */}
				{activeFiltersCount > 0 && (
					<div className="flex flex-wrap items-center gap-2">
						{filters.categories.map((categoryId) => {
							const category = SUPPLEMENT_CATEGORIES.find(
								(cat) => cat.id === categoryId,
							);
							return category ? (
								<Badge key={categoryId} variant="secondary" className="text-xs">
									{category.name}
									<Button
										variant="ghost"
										size="sm"
										onClick={() => toggleArrayFilter("categories", categoryId)}
										className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
									>
										<X className="h-3 w-3" />
									</Button>
								</Badge>
							) : null;
						})}

						{filters.evidenceLevels.map((levelId) => {
							const level = EVIDENCE_LEVELS.find((lvl) => lvl.id === levelId);
							return level ? (
								<Badge key={levelId} variant="secondary" className="text-xs">
									{level.name}
									<Button
										variant="ghost"
										size="sm"
										onClick={() => toggleArrayFilter("evidenceLevels", levelId)}
										className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
									>
										<X className="h-3 w-3" />
									</Button>
								</Badge>
							) : null;
						})}

						{filters.availableInPoland && (
							<Badge variant="secondary" className="text-xs">
								Dostępne w Polsce
								<Button
									variant="ghost"
									size="sm"
									onClick={() => updateFilter("availableInPoland", false)}
									className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
								>
									<X className="h-3 w-3" />
								</Button>
							</Badge>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default AdvancedSupplementSearch;
