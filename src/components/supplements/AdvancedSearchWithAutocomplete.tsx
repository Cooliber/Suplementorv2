"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import type { ComprehensiveSupplementProfile } from "@/data/comprehensive-supplements/types";
import { useAdvancedSearch } from "@/hooks/useAdvancedSearch";
import { useNLPSearch, useVoiceSearch } from "@/hooks/useVoiceSearch";
import { hybridSupplementsService } from "@/lib/services/hybrid-supplements-service";
import type { EvidenceLevel, SupplementCategory } from "@/types/supplement";
import {
	Bookmark,
	Clock,
	Filter,
	History,
	Mic,
	MicOff,
	Search,
	SlidersHorizontal,
	Sparkles,
	Star,
	TrendingUp,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchFilters {
	query: string;
	categories: SupplementCategory[];
	evidenceLevels: EvidenceLevel[];
	safetyRating: [number, number];
	priceRange: [number, number];
	hasStudies: boolean;
	hasReviews: boolean;
	sortBy:
		| "relevance"
		| "name"
		| "evidence"
		| "safety"
		| "rating"
		| "price"
		| "effectiveness"
		| "cost";
	sortOrder: "asc" | "desc";
	// New comprehensive data filters
	pregnancySafe?: boolean;
	breastfeedingSafe?: boolean;
	pediatricApproved?: boolean;
	maxCostPerMonth?: number;
	minEffectiveness?: number;
	mechanisms?: string[];
	conditions?: string[];
}

interface AdvancedSearchWithAutocompleteProps {
	onSearch: (filters: SearchFilters) => void;
	onSuggestionClick?: (suggestion: string) => void;
	isLoading?: boolean;
	suggestions?: string[];
	popularSearches?: string[];
	totalResults?: number;
}

export function AdvancedSearchWithAutocomplete({
	onSearch,
	onSuggestionClick,
	isLoading = false,
	suggestions = [],
	popularSearches = [],
	totalResults,
}: AdvancedSearchWithAutocompleteProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<
		SupplementCategory[]
	>([]);
	const [selectedEvidenceLevels, setSelectedEvidenceLevels] = useState<
		EvidenceLevel[]
	>([]);
	const [safetyRange, setSafetyRange] = useState<[number, number]>([0, 10]);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
	const [hasStudies, setHasStudies] = useState(false);
	const [hasReviews, setHasReviews] = useState(false);
	const [sortBy, setSortBy] = useState<
		| "relevance"
		| "name"
		| "evidence"
		| "safety"
		| "rating"
		| "price"
		| "effectiveness"
		| "cost"
	>("relevance");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);

	// New comprehensive data filters
	const [pregnancySafe, setPregnancySafe] = useState(false);
	const [breastfeedingSafe, setBreastfeedingSafe] = useState(false);
	const [pediatricApproved, setPediatricApproved] = useState(false);
	const [maxCostPerMonth, setMaxCostPerMonth] = useState<number>(500);
	const [minEffectiveness, setMinEffectiveness] = useState<number>(5);

	const searchInputRef = useRef<HTMLInputElement>(null);
	const suggestionsRef = useRef<HTMLDivElement>(null);

	const {
		searchResults,
		searchSuggestions,
		searchHistory,
		savedSearches,
		popularQueries,
		addToHistory,
		saveSearch,
		deleteSavedSearch,
		clearHistory,
		highlightText,
	} = useAdvancedSearch([]); // Use empty array as default

	const {
		isListening,
		isSupported: isVoiceSupported,
		startListening,
		stopListening,
		transcript,
		error: voiceError,
	} = useVoiceSearch({
		language: "pl-PL",
		continuous: false,
		interimResults: true,
	});

	const {
		analyzeQuery,
		generateSuggestions: generateNLPSuggestions,
		enhanceQuery,
	} = useNLPSearch();

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

	// Handle search execution
	const handleSearch = async () => {
		const filters: SearchFilters = {
			query: searchQuery,
			categories: selectedCategories,
			evidenceLevels: selectedEvidenceLevels,
			safetyRating: safetyRange,
			priceRange,
			hasStudies,
			hasReviews,
			sortBy,
			sortOrder,
			pregnancySafe: pregnancySafe,
			breastfeedingSafe: breastfeedingSafe,
			pediatricApproved: pediatricApproved,
			maxCostPerMonth: maxCostPerMonth,
			minEffectiveness: minEffectiveness,
		};

		try {
			// Use hybrid service for search
			const results = await hybridSupplementsService.getAllSupplements(
				{
					category: selectedCategories,
					evidenceLevel: selectedEvidenceLevels,
					searchTerm: searchQuery,
					safetyProfile: {
						pregnancySafe: pregnancySafe,
						breastfeedingSafe: breastfeedingSafe,
						pediatricApproved: pediatricApproved,
					},
					maxCostPerMonth: maxCostPerMonth,
					minEffectiveness: minEffectiveness,
				},
				{
					sortBy: sortBy === "relevance" ? "polishName" : sortBy,
					sortOrder: sortOrder,
					limit: 50,
				},
			);

			addToHistory(searchQuery, results.pagination.total);
			onSearch(filters);
			setShowSuggestions(false);
		} catch (error) {
			console.error("Search failed:", error);
			// Fallback to simple search
			onSearch(filters);
		}
	};

	// Handle keyboard navigation
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	// Handle suggestion selection
	const handleSuggestionSelect = (suggestion: string) => {
		setSearchQuery(suggestion);
		setShowSuggestions(false);
		onSuggestionClick?.(suggestion);
		searchInputRef.current?.focus();
	};

	// Handle search result selection
	const handleResultSelect = (result: any) => {
		setSearchQuery(result.name);
		setShowSuggestions(false);
	};

	// Enhanced voice search with NLP
	const toggleVoiceSearch = async () => {
		if (!isVoiceSupported) {
			alert("Twoja przeglądarka nie obsługuje rozpoznawania mowy.");
			return;
		}

		try {
			if (isListening) {
				stopListening();
			} else {
				await startListening();
			}
		} catch (error) {
			console.error("Voice search error:", error);
		}
	};

	// Handle voice transcript updates
	useEffect(() => {
		if (transcript) {
			// Analyze the voice input with NLP
			const analysis = analyzeQuery(transcript);

			// Enhance the search query based on NLP analysis
			const enhancedQuery = enhanceQuery(transcript, analysis);

			// Update search query if we have a good transcript
			if (transcript.length > 3) {
				setSearchQuery(enhancedQuery);

				// Show NLP analysis results
				console.log("NLP Analysis:", analysis);
			}
		}
	}, [transcript, analyzeQuery, enhanceQuery]);

	// Close suggestions when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				suggestionsRef.current &&
				!suggestionsRef.current.contains(event.target as Node) &&
				searchInputRef.current &&
				!searchInputRef.current.contains(event.target as Node)
			) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Show suggestions when typing
	useEffect(() => {
		setShowSuggestions(
			searchQuery.length > 1 &&
				(searchResults.length > 0 || searchSuggestions.length > 0),
		);
	}, [searchQuery, searchResults, searchSuggestions]);

	const toggleCategory = (category: SupplementCategory) => {
		setSelectedCategories((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category],
		);
	};

	const toggleEvidenceLevel = (level: EvidenceLevel) => {
		setSelectedEvidenceLevels((prev) =>
			prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
		);
	};

	const clearFilters = () => {
		setSearchQuery("");
		setSelectedCategories([]);
		setSelectedEvidenceLevels([]);
		setSafetyRange([0, 10]);
		setPriceRange([0, 500]);
		setHasStudies(false);
		setHasReviews(false);
		setSortBy("relevance");
		setSortOrder("desc");
		setPregnancySafe(false);
		setBreastfeedingSafe(false);
		setPediatricApproved(false);
		setMaxCostPerMonth(500);
		setMinEffectiveness(5);
		setShowSuggestions(false);
	};

	const hasActiveFilters =
		searchQuery ||
		selectedCategories.length > 0 ||
		selectedEvidenceLevels.length > 0 ||
		safetyRange[0] > 0 ||
		safetyRange[1] < 10 ||
		priceRange[0] > 0 ||
		priceRange[1] < 500 ||
		hasStudies ||
		hasReviews ||
		sortBy !== "relevance" ||
		pregnancySafe ||
		breastfeedingSafe ||
		pediatricApproved ||
		maxCostPerMonth < 500 ||
		minEffectiveness > 5;

	return (
		<TooltipProvider>
			<div className="space-y-6">
				{/* Main Search Bar */}
				<Card>
					<CardHeader className="pb-4">
						<CardTitle className="flex items-center gap-2">
							<Search className="h-5 w-5" />
							Zaawansowane wyszukiwanie z autouzupełnianiem
						</CardTitle>
						<CardDescription>
							Inteligentne wyszukiwanie suplementów z podpowiedziami i
							tolerancją błędów
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-2">
							<div className="relative flex-1">
								<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
								<Input
									ref={searchInputRef}
									placeholder="Szukaj suplementów, korzyści, składników..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyPress={handleKeyPress}
									onFocus={() => setShowSuggestions(searchQuery.length > 1)}
									className="pr-20 pl-10"
								/>

								{/* Search controls */}
								<div className="-translate-y-1/2 absolute top-1/2 right-1 flex gap-1">
									{searchQuery && (
										<Button
											variant="ghost"
											size="sm"
											className="h-6 w-6 p-0"
											onClick={() => setSearchQuery("")}
										>
											<X className="h-3 w-3" />
										</Button>
									)}

									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="sm"
												className="h-6 w-6 p-0"
												onClick={toggleVoiceSearch}
												disabled={!isVoiceSupported}
											>
												{isListening ? (
													<Mic className="h-3 w-3 animate-pulse text-red-500" />
												) : (
													<MicOff className="h-3 w-3" />
												)}
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											{isVoiceSupported
												? isListening
													? "Kliknij aby zatrzymać"
													: "Kliknij aby mówić"
												: "Rozpoznawanie mowy nie jest obsługiwane"}
										</TooltipContent>
									</Tooltip>
								</div>

								{/* Voice search indicator */}
								{isListening && (
									<div className="-bottom-8 absolute right-0 left-0 text-center">
										<div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-700 text-sm">
											<div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
											Słucham...{" "}
											{transcript && (
												<span className="font-medium">"{transcript}"</span>
											)}
										</div>
									</div>
								)}

								{/* Voice error indicator */}
								{voiceError && (
									<div className="-bottom-8 absolute right-0 left-0 text-center">
										<div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-700 text-sm">
											<X className="h-3 w-3" />
											{voiceError}
										</div>
									</div>
								)}

								{/* Autocomplete suggestions */}
								{showSuggestions && (
									<div
										ref={suggestionsRef}
										className="absolute top-full right-0 left-0 z-50 mt-1 max-h-96 overflow-auto rounded-md border bg-background shadow-lg"
									>
										<Command>
											<CommandList>
												{/* Search results */}
												{searchResults.length > 0 && (
													<CommandGroup heading="Suplementy">
														{searchResults.slice(0, 5).map((result) => (
															<CommandItem
																key={result.id}
																onSelect={() => handleResultSelect(result)}
																className="flex items-center gap-3 p-3"
															>
																<div className="flex-1">
																	<div className="font-medium">
																		{result.highlights.name ? (
																			<span
																				dangerouslySetInnerHTML={{
																					__html: result.highlights.name,
																				}}
																			/>
																		) : (
																			result.name
																		)}
																	</div>
																	<div className="text-muted-foreground text-sm">
																		{result.category} • Ocena:{" "}
																		{result.userRating}/5
																	</div>
																</div>
																<Badge variant="outline" className="text-xs">
																	{result.evidenceLevel}
																</Badge>
															</CommandItem>
														))}
													</CommandGroup>
												)}

												{/* Search suggestions */}
												{searchSuggestions.length > 0 && (
													<CommandGroup heading="Sugestie">
														{searchSuggestions
															.slice(0, 3)
															.map((suggestion, index) => (
																<CommandItem
																	key={index}
																	onSelect={() =>
																		handleSuggestionSelect(suggestion.text)
																	}
																>
																	<Sparkles className="mr-2 h-4 w-4 text-primary" />
																	{suggestion.text}
																</CommandItem>
															))}
													</CommandGroup>
												)}

												{/* Search history */}
												{searchHistory.length > 0 && !searchQuery && (
													<CommandGroup heading="Ostatnie wyszukiwania">
														{searchHistory.slice(0, 3).map((item, index) => (
															<CommandItem
																key={index}
																onSelect={() =>
																	handleSuggestionSelect(item.query)
																}
															>
																<History className="mr-2 h-4 w-4" />
																{item.query}
															</CommandItem>
														))}
													</CommandGroup>
												)}

												{searchResults.length === 0 &&
													searchSuggestions.length === 0 && (
														<CommandEmpty>
															Brak wyników dla "{searchQuery}"
														</CommandEmpty>
													)}
											</CommandList>
										</Command>
									</div>
								)}
							</div>

							<Button onClick={handleSearch} disabled={isLoading}>
								{isLoading ? "Szukam..." : "Szukaj"}
							</Button>

							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline" size="icon">
										<SlidersHorizontal className="h-4 w-4" />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-96" align="end">
									<div className="space-y-6">
										{/* Categories */}
										<div>
											<h4 className="mb-3 font-medium">Kategorie</h4>
											<div className="grid grid-cols-2 gap-2">
												{categories.map((category) => (
													<div
														key={category}
														className="flex items-center space-x-2"
													>
														<input
															type="checkbox"
															id={`category-${category}`}
															checked={selectedCategories.includes(category)}
															onChange={() => toggleCategory(category)}
															className="rounded"
															aria-label={`Kategoria: ${categoryLabels[category]}`}
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
										</div>

										{/* Evidence Levels */}
										<div>
											<h4 className="mb-3 font-medium">Poziom dowodów</h4>
											<div className="space-y-2">
												{evidenceLevels.map((level) => (
													<div
														key={level}
														className="flex items-center space-x-2"
													>
														<input
															type="checkbox"
															id={`evidence-${level}`}
															checked={selectedEvidenceLevels.includes(level)}
															onChange={() => toggleEvidenceLevel(level)}
															className="rounded"
															aria-label={`Poziom dowodów: ${evidenceLabels[level]}`}
														/>
														<Label
															htmlFor={`evidence-${level}`}
															className="cursor-pointer text-sm"
														>
															{evidenceLabels[level]}
														</Label>
													</div>
												))}
											</div>
										</div>

										{/* Safety Rating */}
										<div>
											<h4 className="mb-3 font-medium">Ocena bezpieczeństwa</h4>
											<div className="px-2">
												<Slider
													value={safetyRange}
													onValueChange={(value) =>
														setSafetyRange(value as [number, number])
													}
													max={10}
													min={0}
													step={1}
													className="w-full"
												/>
												<div className="mt-1 flex justify-between text-muted-foreground text-xs">
													<span>{safetyRange[0]}</span>
													<span>{safetyRange[1]}</span>
												</div>
											</div>
										</div>

										{/* Safety Filters */}
										<div className="space-y-3 border-t pt-4">
											<h4 className="font-medium text-sm">
												Filtry bezpieczeństwa
											</h4>

											<div className="grid grid-cols-1 gap-3">
												<div className="flex items-center justify-between">
													<Label
														htmlFor="pregnancySafe"
														className="cursor-pointer text-sm"
													>
														Bezpieczne w ciąży
													</Label>
													<Switch
														id="pregnancySafe"
														checked={pregnancySafe}
														onCheckedChange={setPregnancySafe}
													/>
												</div>

												<div className="flex items-center justify-between">
													<Label
														htmlFor="breastfeedingSafe"
														className="cursor-pointer text-sm"
													>
														Bezpieczne podczas karmienia
													</Label>
													<Switch
														id="breastfeedingSafe"
														checked={breastfeedingSafe}
														onCheckedChange={setBreastfeedingSafe}
													/>
												</div>

												<div className="flex items-center justify-between">
													<Label
														htmlFor="pediatricApproved"
														className="cursor-pointer text-sm"
													>
														Zatwierdzone dla dzieci
													</Label>
													<Switch
														id="pediatricApproved"
														checked={pediatricApproved}
														onCheckedChange={setPediatricApproved}
													/>
												</div>
											</div>
										</div>

										{/* Additional Filters */}
										<div className="space-y-3 border-t pt-4">
											<div className="flex items-center justify-between">
												<Label
													htmlFor="hasStudies"
													className="cursor-pointer text-sm"
												>
													Tylko suplementy z badaniami
												</Label>
												<Switch
													id="hasStudies"
													checked={hasStudies}
													onCheckedChange={setHasStudies}
												/>
											</div>

											<div className="flex items-center justify-between">
												<Label
													htmlFor="hasReviews"
													className="cursor-pointer text-sm"
												>
													Tylko suplementy z opiniami
												</Label>
												<Switch
													id="hasReviews"
													checked={hasReviews}
													onCheckedChange={setHasReviews}
												/>
											</div>
										</div>
									</div>
								</PopoverContent>
							</Popover>
						</div>

						{/* Active Filters */}
						{hasActiveFilters && (
							<div className="flex flex-wrap gap-2">
								{selectedCategories.map((category) => (
									<Badge key={category} variant="secondary" className="gap-1">
										{categoryLabels[category]}
										<Button
											variant="ghost"
											size="sm"
											className="h-4 w-4 p-0 hover:bg-transparent"
											onClick={() => toggleCategory(category)}
										>
											<X className="h-2 w-2" />
										</Button>
									</Badge>
								))}

								{selectedEvidenceLevels.map((level) => (
									<Badge key={level} variant="outline" className="gap-1">
										{evidenceLabels[level]}
										<Button
											variant="ghost"
											size="sm"
											className="h-4 w-4 p-0 hover:bg-transparent"
											onClick={() => toggleEvidenceLevel(level)}
										>
											<X className="h-2 w-2" />
										</Button>
									</Badge>
								))}

								{(safetyRange[0] > 0 || safetyRange[1] < 10) && (
									<Badge variant="outline" className="gap-1">
										Bezpieczeństwo: {safetyRange[0]}-{safetyRange[1]}
										<Button
											variant="ghost"
											size="sm"
											className="h-4 w-4 p-0 hover:bg-transparent"
											onClick={() => setSafetyRange([0, 10])}
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
						)}

						{/* Results Info */}
						{totalResults !== undefined && (
							<div className="flex items-center justify-between text-muted-foreground text-sm">
								<span>
									Znaleziono {totalResults} suplementów
									{searchQuery && <span> dla zapytania "{searchQuery}"</span>}
								</span>

								<Select
									value={`${sortBy}-${sortOrder}`}
									onValueChange={(value) => {
										const [sort, order] = value.split("-");
										setSortBy(sort as any);
										setSortOrder(order as any);
									}}
								>
									<SelectTrigger className="w-48">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="relevance-desc">
											Trafność (malejąco)
										</SelectItem>
										<SelectItem value="name-asc">Nazwa (A-Z)</SelectItem>
										<SelectItem value="name-desc">Nazwa (Z-A)</SelectItem>
										<SelectItem value="evidence-desc">
											Poziom dowodów
										</SelectItem>
										<SelectItem value="safety-desc">Bezpieczeństwo</SelectItem>
										<SelectItem value="rating-desc">
											Ocena użytkowników
										</SelectItem>
										<SelectItem value="price-asc">Cena (rosnąco)</SelectItem>
										<SelectItem value="price-desc">Cena (malejąco)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Search History and Popular Queries */}
				{!searchQuery &&
					(searchHistory.length > 0 || popularQueries.length > 0) && (
						<div className="grid gap-6 lg:grid-cols-2">
							{/* Search History */}
							{searchHistory.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<History className="h-5 w-5 text-blue-600" />
											Ostatnie wyszukiwania
										</CardTitle>
										<CardDescription>
											Twoja historia wyszukiwania z podpowiedziami
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											{searchHistory.slice(0, 6).map((item, index) => (
												<div
													key={index}
													className="flex items-center justify-between"
												>
													<Button
														variant="ghost"
														size="sm"
														className="h-auto justify-start p-2"
														onClick={() => handleSuggestionSelect(item.query)}
													>
														<div className="text-left">
															<div className="font-medium">{item.query}</div>
															<div className="text-muted-foreground text-xs">
																{item.resultCount
																	? `${item.resultCount} wyników`
																	: "Brak wyników"}
															</div>
														</div>
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
														onClick={() => {
															/* Remove from history */
														}}
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
											))}
											<Button
												variant="ghost"
												size="sm"
												onClick={clearHistory}
												className="w-full text-muted-foreground"
											>
												Wyczyść historię
											</Button>
										</div>
									</CardContent>
								</Card>
							)}

							{/* Popular Queries */}
							{popularQueries.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<TrendingUp className="h-5 w-5 text-green-600" />
											Popularne wyszukiwania
										</CardTitle>
										<CardDescription>
											To czego szukają inni użytkownicy
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex flex-wrap gap-2">
											{popularQueries.slice(0, 8).map((query, index) => (
												<Button
													key={index}
													variant="ghost"
													size="sm"
													onClick={() => handleSuggestionSelect(query)}
												>
													{query}
												</Button>
											))}
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					)}

				{/* Advanced Filters Toggle */}
				<Card>
					<CardContent className="pt-6">
						<Button
							variant="ghost"
							onClick={() => setShowAdvanced(!showAdvanced)}
							className="w-full"
						>
							<Filter className="mr-2 h-4 w-4" />
							{showAdvanced ? "Ukryj" : "Pokaż"} filtry zaawansowane
						</Button>

						{showAdvanced && (
							<div className="mt-4 space-y-4 border-t pt-4">
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<Label className="font-medium text-sm">
											Zakres cenowy (PLN)
										</Label>
										<div className="mt-2 px-2">
											<Slider
												value={priceRange}
												onValueChange={(value) =>
													setPriceRange(value as [number, number])
												}
												max={500}
												min={0}
												step={10}
												className="w-full"
											/>
											<div className="mt-1 flex justify-between text-muted-foreground text-xs">
												<span>{priceRange[0]} zł</span>
												<span>{priceRange[1]} zł</span>
											</div>
										</div>
									</div>

									<div>
										<Label className="font-medium text-sm">
											Maksymalny koszt miesięczny (€)
										</Label>
										<div className="mt-2 px-2">
											<Slider
												value={[maxCostPerMonth]}
												onValueChange={(value) =>
													setMaxCostPerMonth(value[0] || 10)
												}
												max={500}
												min={10}
												step={5}
												className="w-full"
											/>
											<div className="mt-1 flex justify-between text-muted-foreground text-xs">
												<span>10€</span>
												<span>{maxCostPerMonth}€</span>
											</div>
										</div>
									</div>

									<div>
										<Label className="font-medium text-sm">
											Minimalna skuteczność
										</Label>
										<div className="mt-2 px-2">
											<Slider
												value={[minEffectiveness]}
												onValueChange={(value) =>
													setMinEffectiveness(value[0] || 1)
												}
												max={10}
												min={1}
												step={1}
												className="w-full"
											/>
											<div className="mt-1 flex justify-between text-muted-foreground text-xs">
												<span>1</span>
												<span>{minEffectiveness}/10</span>
											</div>
										</div>
									</div>

									<div>
										<Label className="font-medium text-sm">Sortowanie</Label>
										<Select
											value={sortBy}
											onValueChange={(value: any) => setSortBy(value)}
										>
											<SelectTrigger className="mt-2">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="relevance">Trafność</SelectItem>
												<SelectItem value="name">Nazwa</SelectItem>
												<SelectItem value="evidence">Poziom dowodów</SelectItem>
												<SelectItem value="safety">Bezpieczeństwo</SelectItem>
												<SelectItem value="rating">
													Ocena użytkowników
												</SelectItem>
												<SelectItem value="price">Cena</SelectItem>
												<SelectItem value="effectiveness">
													Skuteczność
												</SelectItem>
												<SelectItem value="cost">Koszt miesięczny</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</TooltipProvider>
	);
}
