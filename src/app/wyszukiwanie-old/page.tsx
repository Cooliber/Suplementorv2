/**
 * Wyszukiwanie Page - Advanced search interface with results display
 * Dedicated search page with AdvancedSearchWithAutocomplete integration
 */

"use client";

import { AnimatedPage, FadeIn, SlideIn } from "@/components/animations";
import { AdvancedSearchWithAutocomplete } from "@/components/supplements/AdvancedSearchWithAutocomplete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	type SampleSupplement,
	sampleSupplements,
} from "@/data/sample-supplements";
import type { EvidenceLevel, SupplementCategory } from "@/types/supplement";
import {
	BookOpen,
	Bookmark,
	Clock,
	Filter,
	Grid,
	Heart,
	Info,
	List,
	Search,
	Share2,
	ShoppingCart,
	SortAsc,
	SortDesc,
	Star,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

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

export default function WyszukiwaniePage() {
	const [searchResults, setSearchResults] = useState<SampleSupplement[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [showFilters, setShowFilters] = useState(true);

	// Handle search execution
	const handleSearch = (filters: SearchFilters) => {
		setIsLoading(true);

		// Simulate search delay
		setTimeout(() => {
			const results = sampleSupplements.filter((supplement) => {
				const matchesQuery =
					!filters.query ||
					supplement.name.toLowerCase().includes(filters.query.toLowerCase()) ||
					supplement.polishName
						.toLowerCase()
						.includes(filters.query.toLowerCase()) ||
					supplement.description
						.toLowerCase()
						.includes(filters.query.toLowerCase());

				const matchesCategories =
					filters.categories.length === 0 ||
					filters.categories.includes(supplement.category);
				const matchesEvidence =
					filters.evidenceLevels.length === 0 ||
					filters.evidenceLevels.includes(supplement.evidenceLevel);

				const matchesSafety =
					supplement.safetyRating >= filters.safetyRating[0] &&
					supplement.safetyRating <= filters.safetyRating[1];
				const matchesPrice =
					!supplement.price ||
					(supplement.price.min >= filters.priceRange[0] &&
						supplement.price.max <= filters.priceRange[1]);

				const matchesStudies = !filters.hasStudies || supplement.studyCount > 0;
				const matchesReviews = !filters.hasReviews || supplement.userRating > 0;

				return (
					matchesQuery &&
					matchesCategories &&
					matchesEvidence &&
					matchesSafety &&
					matchesPrice &&
					matchesStudies &&
					matchesReviews
				);
			});

			// Apply sorting
			results.sort((a, b) => {
				let comparison = 0;

				switch (filters.sortBy) {
					case "name":
						comparison = a.name.localeCompare(b.name);
						break;
					case "evidence": {
						const evidenceOrder = {
							STRONG: 3,
							MODERATE: 2,
							WEAK: 1,
							INSUFFICIENT: 0,
							CONFLICTING: 0,
						};
						comparison =
							evidenceOrder[b.evidenceLevel] - evidenceOrder[a.evidenceLevel];
						break;
					}
					case "safety":
						comparison = b.safetyRating - a.safetyRating;
						break;
					case "rating":
						comparison = b.userRating - a.userRating;
						break;
					case "price":
						comparison = (a.price?.min || 0) - (b.price?.min || 0);
						break;
					case "effectiveness":
						comparison = (b.userRating || 0) - (a.userRating || 0);
						break;
					case "cost":
						comparison = (a.price?.min || 0) - (b.price?.min || 0);
						break;
					default: // relevance
						comparison = b.userRating - a.userRating;
				}

				return filters.sortOrder === "desc" ? comparison : -comparison;
			});

			setSearchResults(results);
			setIsLoading(false);
		}, 300);
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

	const getEvidenceColor = (level: EvidenceLevel) => {
		switch (level) {
			case "STRONG":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
			case "MODERATE":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
			case "WEAK":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
			case "INSUFFICIENT":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
			case "CONFLICTING":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
		}
	};

	const SearchResultCard = ({
		supplement,
	}: { supplement: SampleSupplement }) => (
		<Card className="group hover:-translate-y-1 h-full transition-all duration-200 hover:shadow-lg">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="mb-1 text-lg leading-tight">
							{supplement.polishName}
						</CardTitle>
						<CardDescription className="text-muted-foreground text-sm">
							{supplement.name}
						</CardDescription>
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="opacity-0 transition-opacity group-hover:opacity-100"
					>
						<Heart className="h-4 w-4" />
					</Button>
				</div>

				<div className="mt-2 flex items-center gap-2">
					<Badge variant="outline" className="text-xs">
						{categoryLabels[supplement.category]}
					</Badge>
					<Badge
						className={`text-xs ${getEvidenceColor(supplement.evidenceLevel)}`}
					>
						{evidenceLabels[supplement.evidenceLevel]}
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="pt-0">
				<p className="mb-3 line-clamp-2 text-muted-foreground text-sm">
					{supplement.polishDescription}
				</p>

				<div className="mb-3 flex items-center justify-between">
					<div className="flex items-center gap-1">
						<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
						<span className="font-medium text-sm">{supplement.userRating}</span>
						<span className="text-muted-foreground text-xs">/5</span>
					</div>
					<div className="text-right">
						<div className="font-semibold text-sm">
							{supplement.price?.min}-{supplement.price?.max} zł
						</div>
						<div className="text-muted-foreground text-xs">
							{supplement.studyCount} badań
						</div>
					</div>
				</div>

				<div className="mb-4 flex flex-wrap gap-1">
					{supplement.polishPrimaryBenefits
						.slice(0, 2)
						.map((benefit, index) => (
							<span
								key={index}
								className="rounded-full bg-blue-50 px-2 py-1 text-blue-700 text-xs"
							>
								{benefit}
							</span>
						))}
				</div>

				<div className="flex gap-2">
					<Link href={`/suplementy/${supplement.id}`} className="flex-1">
						<Button className="w-full" size="sm">
							<Info className="mr-1 h-3 w-3" />
							Szczegóły
						</Button>
					</Link>
					<Button variant="outline" size="sm">
						<ShoppingCart className="h-3 w-3" />
					</Button>
					<Button variant="outline" size="sm">
						<Share2 className="h-3 w-3" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	const SearchResultListItem = ({
		supplement,
	}: { supplement: SampleSupplement }) => (
		<Card className="group transition-all duration-200 hover:shadow-md">
			<CardContent className="p-4">
				<div className="flex items-center gap-4">
					<div className="flex-1">
						<div className="mb-2 flex items-center gap-3">
							<h3 className="font-semibold text-lg">{supplement.polishName}</h3>
							<span className="text-muted-foreground text-sm">
								({supplement.name})
							</span>
							<Badge variant="outline" className="text-xs">
								{categoryLabels[supplement.category]}
							</Badge>
							<Badge
								className={`text-xs ${getEvidenceColor(supplement.evidenceLevel)}`}
							>
								{evidenceLabels[supplement.evidenceLevel]}
							</Badge>
						</div>

						<p className="mb-2 text-muted-foreground text-sm">
							{supplement.polishDescription}
						</p>

						<div className="flex items-center gap-4 text-sm">
							<div className="flex items-center gap-1">
								<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
								<span className="font-medium">{supplement.userRating}/5</span>
							</div>
							<div>
								{supplement.price?.min}-{supplement.price?.max} zł
							</div>
							<div className="text-muted-foreground">
								{supplement.studyCount} badań
							</div>
						</div>
					</div>

					<div className="flex gap-2">
						<Link href={`/suplementy/${supplement.id}`}>
							<Button size="sm">
								<Info className="mr-1 h-3 w-3" />
								Szczegóły
							</Button>
						</Link>
						<Button variant="outline" size="sm">
							<ShoppingCart className="h-3 w-3" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<AnimatedPage className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Link href="/" className="flex items-center gap-3">
								<Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
								<div>
									<h1 className="font-bold text-2xl text-gray-900 dark:text-white">
										Wyszukiwanie
									</h1>
									<p className="text-gray-600 text-sm dark:text-gray-400">
										Zaawansowane wyszukiwanie suplementów
									</p>
								</div>
							</Link>
						</div>
						<div className="flex gap-2">
							<Link href="/suplementy">
								<Button variant="outline">
									<BookOpen className="mr-2 h-4 w-4" />
									Przeglądaj wszystkie
								</Button>
							</Link>
							<Link href="/rekomendacje">
								<Button variant="outline">
									<TrendingUp className="mr-2 h-4 w-4" />
									Rekomendacje AI
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				{/* Page Header */}
				<div className="mb-8">
					<FadeIn>
						<h2 className="mb-4 font-bold text-4xl text-gray-900 dark:text-white">
							Zaawansowane Wyszukiwanie
						</h2>
					</FadeIn>
					<SlideIn direction="up" delay={0.2}>
						<p className="max-w-3xl text-gray-600 text-xl dark:text-gray-300">
							Znajdź idealne suplementy używając naszego inteligentnego systemu
							wyszukiwania z autouzupełnianiem, filtrowaniem i rankingiem
							wyników.
						</p>
					</SlideIn>
				</div>

				{/* Search Interface */}
				<div className="mb-8">
					<AdvancedSearchWithAutocomplete
						onSearch={handleSearch}
						isLoading={isLoading}
						totalResults={searchResults.length}
					/>
				</div>

				{/* Search Results */}
				{searchResults.length > 0 && (
					<div className="space-y-6">
						{/* Results Header */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<h3 className="font-semibold text-xl">
									Wyniki wyszukiwania ({searchResults.length})
								</h3>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowFilters(!showFilters)}
								>
									<Filter className="mr-2 h-4 w-4" />
									{showFilters ? "Ukryj" : "Pokaż"} filtry
								</Button>
							</div>

							{/* View Mode Toggle */}
							<div className="flex items-center gap-2">
								<Button
									variant={viewMode === "grid" ? "default" : "outline"}
									size="sm"
									onClick={() => setViewMode("grid")}
								>
									<Grid className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "list" ? "default" : "outline"}
									size="sm"
									onClick={() => setViewMode("list")}
								>
									<List className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Results Grid/List */}
						{isLoading ? (
							<div
								className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : ""}`}
							>
								{Array.from({ length: 8 }).map((_, index) => (
									<Card key={index}>
										<CardHeader>
											<Skeleton className="h-4 w-3/4" />
											<Skeleton className="h-3 w-1/2" />
										</CardHeader>
										<CardContent>
											<Skeleton className="mb-2 h-3 w-full" />
											<Skeleton className="h-3 w-2/3" />
										</CardContent>
									</Card>
								))}
							</div>
						) : (
							<div
								className={
									viewMode === "grid"
										? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
										: "space-y-4"
								}
							>
								{searchResults.map((supplement) =>
									viewMode === "grid" ? (
										<SearchResultCard
											key={supplement.id}
											supplement={supplement}
										/>
									) : (
										<SearchResultListItem
											key={supplement.id}
											supplement={supplement}
										/>
									),
								)}
							</div>
						)}

						{/* Load More */}
						{searchResults.length >= 20 && (
							<div className="text-center">
								<Button variant="outline" size="lg">
									Załaduj więcej wyników
								</Button>
							</div>
						)}
					</div>
				)}

				{/* Empty State */}
				{searchResults.length === 0 && !isLoading && (
					<Card className="p-12 text-center">
						<CardContent>
							<Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
							<h3 className="mb-2 font-semibold text-lg">
								Rozpocznij wyszukiwanie
							</h3>
							<p className="mx-auto mb-6 max-w-md text-muted-foreground">
								Użyj pola wyszukiwania powyżej, aby znaleźć suplementy pasujące
								do Twoich potrzeb. Możesz szukać po nazwie, korzyściach
								zdrowotnych lub składnikach aktywnych.
							</p>
							<div className="flex flex-wrap justify-center gap-2">
								<Button variant="outline" size="sm">
									<Bookmark className="mr-1 h-3 w-3" />
									Zapisz wyszukiwanie
								</Button>
								<Button variant="outline" size="sm">
									<Clock className="mr-1 h-3 w-3" />
									Historia wyszukiwania
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</main>

			{/* Footer */}
			<footer className="mt-16 border-t bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
				<div className="container mx-auto px-4 py-8">
					<div className="text-center text-gray-600 dark:text-gray-400">
						<p className="mb-2">
							© 2025 Suplementor - Platforma Edukacyjna o Suplementach
						</p>
						<p className="text-sm">
							Wszystkie informacje oparte na badaniach naukowych
						</p>
					</div>
				</div>
			</footer>
		</AnimatedPage>
	);
}
