"use client";

/**
 * Advanced Search Bar Component
 * Full-featured search with Polish NLP, autocomplete, and filters
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/trpc/react";
import type { EvidenceLevel, SupplementCategory } from "@/types/supplement";
import { Filter, Search, TrendingUp, X } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

interface AdvancedSearchBarProps {
	onSearch: (results: any[]) => void;
	language?: "pl" | "en";
}

export function AdvancedSearchBar({
	onSearch,
	language = "pl",
}: AdvancedSearchBarProps) {
	const [query, setQuery] = useState("");
	const [showAutocomplete, setShowAutocomplete] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState<
		SupplementCategory[]
	>([]);
	const [selectedEvidenceLevels, setSelectedEvidenceLevels] = useState<
		EvidenceLevel[]
	>([]);
	const [fuzzyMatch, setFuzzyMatch] = useState(true);
	const [includeSynonyms, setIncludeSynonyms] = useState(true);

	// Autocomplete query
	const { data: autocompleteData } = api.advancedSearch.autocomplete.useQuery(
		{ query, language, limit: 5 },
		{ enabled: query.length > 1 && showAutocomplete },
	);

	// Popular searches
	const { data: popularSearches } = api.advancedSearch.popularSearches.useQuery(
		{
			language,
			limit: 10,
		},
	);

	// Search query
	const [searchParams, setSearchParams] = useState<any>(null);
	const searchQuery = api.advancedSearch.search.useQuery(
		searchParams || {
			query: "",
			language,
			fuzzyMatch,
			includeSynonyms,
			limit: 20,
		},
		{ enabled: !!searchParams },
	);

	React.useEffect(() => {
		if (searchQuery.data && searchParams) {
			onSearch(searchQuery.data.results);
			setShowAutocomplete(false);
		}
	}, [searchQuery.data, searchParams, onSearch]);

	// Handle search
	const handleSearch = useCallback(() => {
		if (query.trim().length === 0) return;

		setSearchParams({
			query: query.trim(),
			language,
			fuzzyMatch,
			includeSynonyms,
			categories:
				selectedCategories.length > 0 ? selectedCategories : undefined,
			evidenceLevels:
				selectedEvidenceLevels.length > 0 ? selectedEvidenceLevels : undefined,
			limit: 20,
		});
	}, [
		query,
		language,
		fuzzyMatch,
		includeSynonyms,
		selectedCategories,
		selectedEvidenceLevels,
	]);

	// Handle Enter key
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	// Handle popular search click
	const handlePopularSearchClick = (term: string) => {
		setQuery(term);
		setShowAutocomplete(false);
		setSearchParams({
			query: term,
			language,
			fuzzyMatch,
			includeSynonyms,
			categories:
				selectedCategories.length > 0 ? selectedCategories : undefined,
			evidenceLevels:
				selectedEvidenceLevels.length > 0 ? selectedEvidenceLevels : undefined,
			limit: 20,
		});
	};

	// Toggle category
	const toggleCategory = (category: SupplementCategory) => {
		setSelectedCategories((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category],
		);
	};

	// Toggle evidence level
	const toggleEvidenceLevel = (level: EvidenceLevel) => {
		setSelectedEvidenceLevels((prev) =>
			prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
		);
	};

	const categories: SupplementCategory[] = [
		"NOOTROPIC",
		"VITAMIN",
		"MINERAL",
		"AMINO_ACID",
		"HERB",
		"ADAPTOGEN",
		"COENZYME",
		"FATTY_ACID",
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

	return (
		<div className="w-full space-y-4">
			{/* Search Input */}
			<div className="relative">
				<div className="flex gap-2">
					<div className="relative flex-1">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
						<Input
							type="text"
							placeholder={
								language === "pl"
									? "Szukaj suplementów..."
									: "Search supplements..."
							}
							value={query}
							onChange={(e) => {
								setQuery(e.target.value);
								setShowAutocomplete(true);
							}}
							onKeyDown={handleKeyDown}
							onFocus={() => setShowAutocomplete(true)}
							className="pr-10 pl-10"
						/>
						{query && (
							<button
								onClick={() => {
									setQuery("");
									setShowAutocomplete(false);
								}}
								className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground hover:text-foreground"
							>
								<X className="h-4 w-4" />
							</button>
						)}
					</div>

					<Button onClick={handleSearch} disabled={searchQuery.isLoading}>
						{searchQuery.isLoading
							? language === "pl"
								? "Szukam..."
								: "Searching..."
							: language === "pl"
								? "Szukaj"
								: "Search"}
					</Button>

					{/* Filters Popover */}
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline" size="icon">
								<Filter className="h-4 w-4" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-80" align="end">
							<div className="space-y-4">
								<div>
									<h4 className="mb-3 font-medium">
										{language === "pl" ? "Kategorie" : "Categories"}
									</h4>
									<div className="space-y-2">
										{categories.map((category) => (
											<div
												key={category}
												className="flex items-center space-x-2"
											>
												<Checkbox
													id={category}
													checked={selectedCategories.includes(category)}
													onCheckedChange={() => toggleCategory(category)}
												/>
												<Label
													htmlFor={category}
													className="cursor-pointer text-sm"
												>
													{categoryLabels[category]}
												</Label>
											</div>
										))}
									</div>
								</div>

								<div>
									<h4 className="mb-3 font-medium">
										{language === "pl" ? "Poziom dowodów" : "Evidence Level"}
									</h4>
									<div className="space-y-2">
										{evidenceLevels.map((level) => (
											<div key={level} className="flex items-center space-x-2">
												<Checkbox
													id={level}
													checked={selectedEvidenceLevels.includes(level)}
													onCheckedChange={() => toggleEvidenceLevel(level)}
												/>
												<Label
													htmlFor={level}
													className="cursor-pointer text-sm"
												>
													{evidenceLabels[level]}
												</Label>
											</div>
										))}
									</div>
								</div>

								<div className="space-y-2 border-t pt-4">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="fuzzyMatch"
											checked={fuzzyMatch}
											onCheckedChange={(checked) =>
												setFuzzyMatch(checked as boolean)
											}
										/>
										<Label
											htmlFor="fuzzyMatch"
											className="cursor-pointer text-sm"
										>
											{language === "pl"
												? "Tolerancja błędów pisowni"
												: "Fuzzy matching"}
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="includeSynonyms"
											checked={includeSynonyms}
											onCheckedChange={(checked) =>
												setIncludeSynonyms(checked as boolean)
											}
										/>
										<Label
											htmlFor="includeSynonyms"
											className="cursor-pointer text-sm"
										>
											{language === "pl"
												? "Rozszerzaj synonimy"
												: "Include synonyms"}
										</Label>
									</div>
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>

				{/* Autocomplete Dropdown */}
				{showAutocomplete &&
					query.length > 1 &&
					autocompleteData &&
					autocompleteData.length > 0 && (
						<div className="absolute z-50 mt-2 w-full rounded-md border bg-popover p-2 shadow-md">
							{autocompleteData.map((item) => (
								<button
									key={item.id}
									onClick={() => {
										setQuery(item.name);
										handleSearch();
									}}
									className="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent"
								>
									<div className="flex items-center justify-between">
										<span>{item.name}</span>
										<Badge variant="secondary" className="text-xs">
											{categoryLabels[item.category as SupplementCategory]}
										</Badge>
									</div>
								</button>
							))}
						</div>
					)}
			</div>

			{/* Active Filters */}
			{(selectedCategories.length > 0 || selectedEvidenceLevels.length > 0) && (
				<div className="flex flex-wrap gap-2">
					{selectedCategories.map((category) => (
						<Badge key={category} variant="secondary" className="gap-1">
							{categoryLabels[category]}
							<button
								onClick={() => toggleCategory(category)}
								className="ml-1 hover:text-destructive"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					))}
					{selectedEvidenceLevels.map((level) => (
						<Badge key={level} variant="outline" className="gap-1">
							{evidenceLabels[level]}
							<button
								onClick={() => toggleEvidenceLevel(level)}
								className="ml-1 hover:text-destructive"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					))}
				</div>
			)}

			{/* Popular Searches */}
			{!query && popularSearches && (
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<TrendingUp className="h-4 w-4" />
						<span>
							{language === "pl"
								? "Popularne wyszukiwania:"
								: "Popular searches:"}
						</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{popularSearches.map((term) => (
							<Badge
								key={term}
								variant="outline"
								className="cursor-pointer hover:bg-accent"
								onClick={() => handlePopularSearchClick(term)}
							>
								{term}
							</Badge>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
