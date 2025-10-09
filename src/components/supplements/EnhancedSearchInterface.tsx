"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { EvidenceLevel, SupplementCategory } from "@/types/supplement";
import {
	Filter,
	Search,
	SlidersHorizontal,
	Sparkles,
	Star,
	TrendingUp,
	X,
} from "lucide-react";
import { useState } from "react";

interface SearchFilters {
	query: string;
	categories: SupplementCategory[];
	evidenceLevels: EvidenceLevel[];
	safetyRating: [number, number];
	priceRange: [number, number];
	hasStudies: boolean;
	hasReviews: boolean;
	sortBy: "relevance" | "name" | "evidence" | "safety" | "rating" | "price";
	sortOrder: "asc" | "desc";
}

interface EnhancedSearchInterfaceProps {
	onSearch: (filters: SearchFilters) => void;
	onSuggestionClick?: (suggestion: string) => void;
	isLoading?: boolean;
	suggestions?: string[];
	popularSearches?: string[];
	totalResults?: number;
}

export function EnhancedSearchInterface({
	onSearch,
	onSuggestionClick,
	isLoading = false,
	suggestions = [],
	popularSearches = [],
	totalResults,
}: EnhancedSearchInterfaceProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<SupplementCategory[]>([]);
	const [selectedEvidenceLevels, setSelectedEvidenceLevels] = useState<EvidenceLevel[]>([]);
	const [safetyRange, setSafetyRange] = useState<[number, number]>([0, 10]);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
	const [hasStudies, setHasStudies] = useState(false);
	const [hasReviews, setHasReviews] = useState(false);
	const [sortBy, setSortBy] = useState<"relevance" | "name" | "evidence" | "safety" | "rating" | "price">("relevance");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [showAdvanced, setShowAdvanced] = useState(false);

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

	const handleSearch = () => {
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
		};
		onSearch(filters);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const toggleCategory = (category: SupplementCategory) => {
		setSelectedCategories(prev =>
			prev.includes(category)
				? prev.filter(c => c !== category)
				: [...prev, category]
		);
	};

	const toggleEvidenceLevel = (level: EvidenceLevel) => {
		setSelectedEvidenceLevels(prev =>
			prev.includes(level)
				? prev.filter(l => l !== level)
				: [...prev, level]
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
		sortBy !== "relevance";

	return (
		<TooltipProvider>
			<div className="space-y-6">
				{/* Main Search Bar */}
				<Card>
					<CardHeader className="pb-4">
						<CardTitle className="flex items-center gap-2">
							<Search className="h-5 w-5" />
							Zaawansowane wyszukiwanie suplementów
						</CardTitle>
						<CardDescription>
							Znajdź suplementy dostosowane do Twoich potrzeb z zaawansowaną analizą i rankingiem
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-2">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Szukaj suplementów, korzyści, składników..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyPress={handleKeyPress}
									className="pl-10 pr-10"
								/>
								{searchQuery && (
									<Button
										variant="ghost"
										size="sm"
										className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
										onClick={() => setSearchQuery("")}
									>
										<X className="h-3 w-3" />
									</Button>
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
													<div key={category} className="flex items-center space-x-2">
														<input
															type="checkbox"
															id={`category-${category}`}
															checked={selectedCategories.includes(category)}
															onChange={() => toggleCategory(category)}
															className="rounded"
															aria-label={`Kategoria: ${categoryLabels[category]}`}
														/>
														<Label htmlFor={`category-${category}`} className="cursor-pointer text-sm">
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
													<div key={level} className="flex items-center space-x-2">
														<input
															type="checkbox"
															id={`evidence-${level}`}
															checked={selectedEvidenceLevels.includes(level)}
															onChange={() => toggleEvidenceLevel(level)}
															className="rounded"
															aria-label={`Poziom dowodów: ${evidenceLabels[level]}`}
														/>
														<Label htmlFor={`evidence-${level}`} className="cursor-pointer text-sm">
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
													onValueChange={(value) => setSafetyRange(value as [number, number])}
													max={10}
													min={0}
													step={1}
													className="w-full"
												/>
												<div className="flex justify-between text-xs text-muted-foreground mt-1">
													<span>{safetyRange[0]}</span>
													<span>{safetyRange[1]}</span>
												</div>
											</div>
										</div>

										{/* Additional Filters */}
										<div className="space-y-3 border-t pt-4">
											<div className="flex items-center justify-between">
												<Label htmlFor="hasStudies" className="cursor-pointer text-sm">
													Tylko suplementy z badaniami
												</Label>
												<Switch
													id="hasStudies"
													checked={hasStudies}
													onCheckedChange={setHasStudies}
												/>
											</div>

											<div className="flex items-center justify-between">
												<Label htmlFor="hasReviews" className="cursor-pointer text-sm">
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
							<div className="flex items-center justify-between text-sm text-muted-foreground">
								<span>
									Znaleziono {totalResults} suplementów
									{searchQuery && (
										<span> dla zapytania "{searchQuery}"</span>
									)}
								</span>

								<Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
									const [sort, order] = value.split('-');
									setSortBy(sort as any);
									setSortOrder(order as any);
								}}>
									<SelectTrigger className="w-48">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="relevance-desc">Trafność (malejąco)</SelectItem>
										<SelectItem value="name-asc">Nazwa (A-Z)</SelectItem>
										<SelectItem value="name-desc">Nazwa (Z-A)</SelectItem>
										<SelectItem value="evidence-desc">Poziom dowodów</SelectItem>
										<SelectItem value="safety-desc">Bezpieczeństwo</SelectItem>
										<SelectItem value="rating-desc">Ocena użytkowników</SelectItem>
										<SelectItem value="price-asc">Cena (rosnąco)</SelectItem>
										<SelectItem value="price-desc">Cena (malejąco)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Suggestions and Popular Searches */}
				{!searchQuery && (suggestions.length > 0 || popularSearches.length > 0) && (
					<div className="grid gap-6 lg:grid-cols-2">
						{/* AI Suggestions */}
						{suggestions.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Sparkles className="h-5 w-5 text-primary" />
										Sugerowane wyszukiwania AI
									</CardTitle>
									<CardDescription>
										Dopasowane do Twoich potrzeb i celów zdrowotnych
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex flex-wrap gap-2">
										{suggestions.map((suggestion, index) => (
											<Button
												key={index}
												variant="outline"
												size="sm"
												onClick={() => {
													setSearchQuery(suggestion);
													onSuggestionClick?.(suggestion);
												}}
											>
												{suggestion}
											</Button>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Popular Searches */}
						{popularSearches.length > 0 && (
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
										{popularSearches.slice(0, 8).map((search, index) => (
											<Button
												key={index}
												variant="ghost"
												size="sm"
												onClick={() => setSearchQuery(search)}
											>
												{search}
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
							<Filter className="h-4 w-4 mr-2" />
							{showAdvanced ? "Ukryj" : "Pokaż"} filtry zaawansowane
						</Button>

						{showAdvanced && (
							<div className="mt-4 space-y-4 border-t pt-4">
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<Label className="text-sm font-medium">Zakres cenowy (PLN)</Label>
										<div className="px-2 mt-2">
											<Slider
												value={priceRange}
												onValueChange={(value) => setPriceRange(value as [number, number])}
												max={500}
												min={0}
												step={10}
												className="w-full"
											/>
											<div className="flex justify-between text-xs text-muted-foreground mt-1">
												<span>{priceRange[0]} zł</span>
												<span>{priceRange[1]} zł</span>
											</div>
										</div>
									</div>

									<div>
										<Label className="text-sm font-medium">Sortowanie</Label>
										<Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
											<SelectTrigger className="mt-2">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="relevance">Trafność</SelectItem>
												<SelectItem value="name">Nazwa</SelectItem>
												<SelectItem value="evidence">Poziom dowodów</SelectItem>
												<SelectItem value="safety">Bezpieczeństwo</SelectItem>
												<SelectItem value="rating">Ocena użytkowników</SelectItem>
												<SelectItem value="price">Cena</SelectItem>
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