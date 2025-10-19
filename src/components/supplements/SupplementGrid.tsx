"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { EvidenceLevel, SupplementCategory } from "@/types/supplement";
import { Grid, List, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { SkeletonGrid } from "@/components/loading/SkeletonCard";
import { CompactSupplementCard } from "./CompactSupplementCard";
import { EnhancedSupplementCard } from "./EnhancedSupplementCard";

interface Supplement {
	id: string;
	name: string;
	polishName: string;
	category: SupplementCategory;
	polishCategory: string;
	description: string;
	polishDescription: string;
	evidenceLevel: EvidenceLevel;
	safetyRating: number;
	userRating: number;
	primaryBenefits: string[];
	polishPrimaryBenefits: string[];
	studyCount: number;
	price?: {
		min: number;
		max: number;
		currency: string;
	};
}

interface SupplementGridProps {
	supplements: Supplement[];
	onSupplementClick?: (id: string) => void;
	onFavoriteClick?: (id: string) => void;
	onDosageClick?: (id: string) => void;
	onSafetyClick?: (id: string) => void;
	isLoading?: boolean;
	showSearch?: boolean;
	showFilters?: boolean;
	showViewToggle?: boolean;
	defaultViewMode?: "grid" | "list";
	compactCards?: boolean;
}

export function SupplementGrid({
	supplements,
	onSupplementClick,
	onFavoriteClick,
	onDosageClick,
	onSafetyClick,
	isLoading = false,
	showSearch = true,
	showFilters = true,
	showViewToggle = true,
	defaultViewMode = "grid",
	compactCards = false,
}: SupplementGridProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [selectedEvidenceLevel, setSelectedEvidenceLevel] =
		useState<string>("all");
	const [sortBy, setSortBy] = useState<string>("name");
	const [viewMode, setViewMode] = useState<"grid" | "list">(defaultViewMode);

	// Filter and sort supplements
	const filteredSupplements = supplements
		.filter((supplement) => {
			const matchesSearch =
				supplement.polishName
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				supplement.polishDescription
					.toLowerCase()
					.includes(searchQuery.toLowerCase());

			const matchesCategory =
				selectedCategory === "all" || supplement.category === selectedCategory;
			const matchesEvidence =
				selectedEvidenceLevel === "all" ||
				supplement.evidenceLevel === selectedEvidenceLevel;

			return matchesSearch && matchesCategory && matchesEvidence;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return a.polishName.localeCompare(b.polishName);
				case "evidence": {
					const evidenceOrder = {
						STRONG: 4,
						MODERATE: 3,
						WEAK: 2,
						INSUFFICIENT: 1,
						CONFLICTING: 0,
					};
					return (
						evidenceOrder[b.evidenceLevel] - evidenceOrder[a.evidenceLevel]
					);
				}
				case "safety":
					return b.safetyRating - a.safetyRating;
				case "rating":
					return b.userRating - a.userRating;
				case "studies":
					return b.studyCount - a.studyCount;
				default:
					return 0;
			}
		});

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

	if (isLoading) {
		return (
			<div className="space-y-4">
				{/* Enhanced loading skeleton */}
				<SkeletonGrid count={8} />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Search and Filters */}
			{(showSearch || showFilters) && (
				<div className="space-y-4">
					{/* Search Bar */}
					{showSearch && (
						<div className="relative">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Szukaj suplementów..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
					)}

					{/* Filters Row */}
					{showFilters && (
						<div className="flex flex-wrap items-center gap-4">
							<div className="flex items-center gap-2">
								<SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
								<span className="font-medium text-sm">Filtry:</span>
							</div>

							<Select
								value={selectedCategory}
								onValueChange={setSelectedCategory}
							>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Kategoria" />
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

							<Select
								value={selectedEvidenceLevel}
								onValueChange={setSelectedEvidenceLevel}
							>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Poziom dowodów" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Wszystkie poziomy</SelectItem>
									{evidenceLevels.map((level) => (
										<SelectItem key={level} value={level}>
											{evidenceLabels[level]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Sortuj według" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="name">Nazwa</SelectItem>
									<SelectItem value="evidence">Poziom dowodów</SelectItem>
									<SelectItem value="safety">Bezpieczeństwo</SelectItem>
									<SelectItem value="rating">Ocena użytkowników</SelectItem>
									<SelectItem value="studies">Liczba badań</SelectItem>
								</SelectContent>
							</Select>

							{/* View Toggle */}
							{showViewToggle && (
								<div className="ml-auto flex items-center gap-1 rounded-lg border p-1">
									<Button
										variant={viewMode === "grid" ? "default" : "ghost"}
										size="sm"
										onClick={() => setViewMode("grid")}
										className="h-8 w-8 p-0"
									>
										<Grid className="h-4 w-4" />
									</Button>
									<Button
										variant={viewMode === "list" ? "default" : "ghost"}
										size="sm"
										onClick={() => setViewMode("list")}
										className="h-8 w-8 p-0"
									>
										<List className="h-4 w-4" />
									</Button>
								</div>
							)}
						</div>
					)}
				</div>
			)}

			{/* Results Info */}
			<div className="flex items-center justify-between">
				<p className="text-muted-foreground text-sm">
					Znaleziono {filteredSupplements.length} suplementów
					{searchQuery && <span> dla zapytania "{searchQuery}"</span>}
				</p>

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
					>
						Wyczyść filtry
					</Button>
				)}
			</div>

			{/* Supplement Grid/List */}
			{filteredSupplements.length > 0 ? (
				<div
					className={
						viewMode === "grid"
							? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
							: "space-y-3"
					}
				>
					{filteredSupplements.map((supplement) => {
						const CardComponent =
							compactCards || viewMode === "list"
								? CompactSupplementCard
								: EnhancedSupplementCard;

						return (
							<CardComponent
								key={supplement.id}
								{...supplement}
								onCardClick={onSupplementClick}
								onFavoriteClick={onFavoriteClick}
								onDosageClick={onDosageClick}
								onSafetyClick={onSafetyClick}
								compact={viewMode === "list"}
							/>
						);
					})}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<Search className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
					<h3 className="mb-2 font-semibold text-lg">Brak suplementów</h3>
					<p className="max-w-md text-muted-foreground">
						Nie znaleziono suplementów spełniających wybrane kryteria. Spróbuj
						zmienić filtry wyszukiwania.
					</p>
				</div>
			)}
		</div>
	);
}
