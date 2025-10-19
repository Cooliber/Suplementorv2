/**
 * Suplementy Page - Comprehensive supplements listing with search and filtering
 * Main supplements catalog page with grid layout and advanced filtering
 */

"use client";

import { AnimatedPage, FadeIn, SlideIn } from "@/components/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	type SampleSupplement,
	sampleSupplements,
} from "@/data/sample-supplements";
import type { EvidenceLevel, SupplementCategory } from "@/types/supplement";
import {
	BookOpen,
	Filter,
	Heart,
	Info,
	Search,
	Share2,
	ShoppingCart,
	SlidersHorizontal,
	Star,
	TrendingUp,
	Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function SuplementyPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<
		SupplementCategory | "all"
	>("all");
	const [selectedEvidenceLevel, setSelectedEvidenceLevel] = useState<
		EvidenceLevel | "all"
	>("all");
	const [sortBy, setSortBy] = useState<
		"name" | "rating" | "evidence" | "price"
	>("rating");
	const [showFilters, setShowFilters] = useState(false);

	// Filter and sort supplements
	const filteredAndSortedSupplements = useMemo(() => {
		const filtered = sampleSupplements.filter((supplement) => {
			const matchesSearch =
				searchQuery === "" ||
				supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				supplement.polishName
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				supplement.description
					.toLowerCase()
					.includes(searchQuery.toLowerCase());

			const matchesCategory =
				selectedCategory === "all" || supplement.category === selectedCategory;
			const matchesEvidence =
				selectedEvidenceLevel === "all" ||
				supplement.evidenceLevel === selectedEvidenceLevel;

			return matchesSearch && matchesCategory && matchesEvidence;
		});

		// Sort supplements
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return a.name.localeCompare(b.name);
				case "rating":
					return b.userRating - a.userRating;
				case "evidence": {
					const evidenceOrder = {
						STRONG: 3,
						MODERATE: 2,
						WEAK: 1,
						INSUFFICIENT: 0,
						CONFLICTING: 0,
					};
					return (
						evidenceOrder[b.evidenceLevel] - evidenceOrder[a.evidenceLevel]
					);
				}
				case "price":
					return (a.price?.min || 0) - (b.price?.min || 0);
				default:
					return 0;
			}
		});

		return filtered;
	}, [searchQuery, selectedCategory, selectedEvidenceLevel, sortBy]);

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

	const SupplementCard = ({ supplement }: { supplement: SampleSupplement }) => (
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
					key={`${supplement.id}-benefit-${benefit}`}
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

	return (
		<AnimatedPage className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Link href="/" className="flex items-center gap-3">
								<BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
								<div>
									<h1 className="font-bold text-2xl text-gray-900 dark:text-white">
										Suplementy
									</h1>
									<p className="text-gray-600 text-sm dark:text-gray-400">
										Katalog suplementów oparty na badaniach naukowych
									</p>
								</div>
							</Link>
						</div>
						<div className="flex gap-2">
							<Link href="/wyszukiwanie">
								<Button variant="outline">
									<Search className="mr-2 h-4 w-4" />
									Zaawansowane wyszukiwanie
								</Button>
							</Link>
							<Link href="/rekomendacje">
								<Button variant="outline">
									<Zap className="mr-2 h-4 w-4" />
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
							Baza Suplementów
						</h2>
					</FadeIn>
					<SlideIn direction="up" delay={0.2}>
						<p className="max-w-3xl text-gray-600 text-xl dark:text-gray-300">
							Odkryj naszą kompleksową bazę suplementów opartą na badaniach
							naukowych. Zobacz szczegółowe informacje, dowody naukowe i opinie
							użytkowników.
						</p>
					</SlideIn>
				</div>

				{/* Search and Filters */}
				<Card className="mb-8">
					<CardContent className="pt-6">
						<div className="flex flex-col gap-4 lg:flex-row">
							{/* Search Input */}
							<div className="flex-1">
								<Label htmlFor="search" className="sr-only">
									Wyszukaj suplementy
								</Label>
								<div className="relative">
									<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="search"
										placeholder="Szukaj suplementów..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>

							{/* Category Filter */}
							<div className="w-full lg:w-48">
								<Select
									value={selectedCategory}
									onValueChange={(value: any) => setSelectedCategory(value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Wszystkie kategorie" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Wszystkie kategorie</SelectItem>
										{categories.map((category) => (
											<SelectItem key={category} value={category}>
												{categoryLabels[category]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Evidence Level Filter */}
							<div className="w-full lg:w-48">
								<Select
									value={selectedEvidenceLevel}
									onValueChange={(value: any) =>
										setSelectedEvidenceLevel(value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Wszystkie poziomy dowodów" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											Wszystkie poziomy dowodów
										</SelectItem>
										{evidenceLevels.map((level) => (
											<SelectItem key={level} value={level}>
												{evidenceLabels[level]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Sort By */}
							<div className="w-full lg:w-48">
								<Select
									value={sortBy}
									onValueChange={(value: any) => setSortBy(value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Sortuj według" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="rating">Ocena użytkowników</SelectItem>
										<SelectItem value="name">Nazwa</SelectItem>
										<SelectItem value="evidence">Poziom dowodów</SelectItem>
										<SelectItem value="price">Cena</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Advanced Filters Toggle */}
							<Button
								variant="outline"
								onClick={() => setShowFilters(!showFilters)}
								className="lg:w-auto"
							>
								<SlidersHorizontal className="mr-2 h-4 w-4" />
								Filtry
							</Button>
						</div>

						{/* Advanced Filters */}
						{showFilters && (
							<div className="mt-4 border-t pt-4">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
									<div>
										<h4 className="mb-2 font-medium">Zakres cenowy</h4>
										<div className="text-muted-foreground text-sm">
											Wkrótce dostępne
										</div>
									</div>
									<div>
										<h4 className="mb-2 font-medium">Ocena bezpieczeństwa</h4>
										<div className="text-muted-foreground text-sm">
											Wkrótce dostępne
										</div>
									</div>
									<div>
										<h4 className="mb-2 font-medium">Liczba badań</h4>
										<div className="text-muted-foreground text-sm">
											Wkrótce dostępne
										</div>
									</div>
									<div>
										<h4 className="mb-2 font-medium">Dostępność</h4>
										<div className="text-muted-foreground text-sm">
											Wkrótce dostępne
										</div>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Results Info */}
				<div className="mb-6 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<h3 className="font-semibold text-lg">
							Znaleźliśmy {filteredAndSortedSupplements.length} suplementów
						</h3>
						{(searchQuery ||
							selectedCategory !== "all" ||
							selectedEvidenceLevel !== "all") && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setSearchQuery("");
									setSelectedCategory("all");
									setSelectedEvidenceLevel("all");
								}}
								className="text-muted-foreground"
							>
								Wyczyść filtry
							</Button>
						)}
					</div>
				</div>

				{/* Supplements Grid */}
				{filteredAndSortedSupplements.length > 0 ? (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{filteredAndSortedSupplements.map((supplement) => (
							<SupplementCard key={supplement.id} supplement={supplement} />
						))}
					</div>
				) : (
					<Card className="p-12 text-center">
						<CardContent>
							<Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
							<h3 className="mb-2 font-semibold text-lg">Brak suplementów</h3>
							<p className="mb-4 text-muted-foreground">
								Nie znaleźliśmy suplementów pasujących do Twoich kryteriów
								wyszukiwania.
							</p>
							<Button
								variant="outline"
								onClick={() => {
									setSearchQuery("");
									setSelectedCategory("all");
									setSelectedEvidenceLevel("all");
								}}
							>
								Wyczyść filtry
							</Button>
						</CardContent>
					</Card>
				)}

				{/* Load More / Pagination */}
				{filteredAndSortedSupplements.length > 0 && (
					<div className="mt-12 text-center">
						<Button variant="outline" size="lg">
							Załaduj więcej suplementów
						</Button>
					</div>
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
