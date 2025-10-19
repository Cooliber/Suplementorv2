"use client";

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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { KnowledgeAtom } from "@/types/atomic-content";
import {
	AlertTriangle,
	Atom,
	BookOpen,
	Brain,
	Filter,
	GraduationCap,
	Layers,
	RefreshCw,
	Search,
	Star,
	TrendingUp,
	Zap,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
	enhancedKnowledgeAtoms,
	getAtomsByCategory,
	getAtomsByType,
	getHighEvidenceAtoms,
	getRecentlyUpdatedAtoms,
} from "@/data/atoms/knowledge-base";
import { PRECISION_CONSTANTS, getAtomManager } from "@/lib/atoms/atom-manager";
import type { AtomSearchResult } from "@/types/atomic-content";
import KnowledgeAtomComponent from "./KnowledgeAtom";

interface AtomicKnowledgePanelProps {
	initialCategory?: string;
	initialType?: string;
	onAtomSelect?: (atom: any) => void;
	onReferenceClick?: (reference: string) => void;
	maxAtoms?: number;
	language?: "en" | "pl";
	className?: string;
}

// Helper functions moved outside component
const applyAdvancedFilters = (atoms: any[], filters: any): any[] => {
	let filtered = [...atoms];

	// Study size filter
	if (filters.studySize?.min) {
		filtered = filtered.filter(
			(atom) =>
				atom.metadata?.studySize &&
				atom.metadata.studySize >= filters.studySize.min,
		);
	}

	// Confidence filter
	if (filters.confidenceMin) {
		filtered = filtered.filter(
			(atom) =>
				atom.metadata?.confidence &&
				atom.metadata.confidence >= filters.confidenceMin,
		);
	}

	// Neuroimaging filter
	if (filters.hasNeuroimaging) {
		filtered = filtered.filter(
			(atom) => atom.metadata?.neuroimagingData !== undefined,
		);
	}

	// Biomarker presence
	if (filters.hasBiomarkers) {
		filtered = filtered.filter(
			(atom) =>
				atom.metadata?.biomarkers && atom.metadata.biomarkers.length > 0,
		);
	}

	return filtered;
};

const validateBiomarkerPrecision = (biomarker: any): boolean => {
	const biomarkerName = biomarker.name?.toUpperCase().replace(/[^A-Z]/g, "");
	if (!biomarkerName) return false;

	const biochemicalConstants = PRECISION_CONSTANTS.BIOCHEMICAL as Record<
		string,
		any
	>;
	const range = biochemicalConstants[biomarkerName];
	if (!range || typeof range.MIN !== "number" || typeof range.MAX !== "number")
		return false;

	return biomarker.value >= range.MIN && biomarker.value <= range.MAX;
};

const biomarkerIsClinicallySignificant = (biomarker: any): boolean => {
	const significance = biomarker.postIntervention && biomarker.baseline;

	if (!significance || !biomarker.baseline) return false;

	// Check for clinically meaningful changes
	const change = Math.abs(biomarker.postIntervention - biomarker.baseline);
	const percentChange = (change / biomarker.baseline) * 100;

	// Typically > 20% change is considered clinically significant
	return percentChange >= 20;
};

const getStatisticalSignificance = (pValue?: number): string => {
	if (!pValue) return "unknown";
	if (pValue < 0.001) return "extreme";
	if (pValue < 0.01) return "high";
	if (pValue < 0.05) return "moderate";
	return "low";
};

const AtomicKnowledgePanel: React.FC<AtomicKnowledgePanelProps> = ({
	initialCategory = "neuroscience",
	initialType = "mechanism",
	onAtomSelect,
	onReferenceClick,
	maxAtoms = 50,
	language = "pl",
	className = "",
}) => {
	const [selectedCategory, setSelectedCategory] =
		useState<string>(initialCategory);
	const [selectedType, setSelectedType] = useState<string>(initialType);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [evidenceFilter, setEvidenceFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<
		"recent" | "evidence" | "category" | "precision" | "effect"
	>("recent");

	const categories = useMemo(() => {
		const cats = Array.from(
			new Set(enhancedKnowledgeAtoms.map((atom) => atom.category)),
		);
		return cats.sort();
	}, []);

	const types = useMemo(() => {
		const types = Array.from(
			new Set(enhancedKnowledgeAtoms.map((atom) => atom.type)),
		);
		return types.sort();
	}, []);

	const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);

	const filteredAtoms = useMemo(() => {
		let atoms = enhancedKnowledgeAtoms;

		// Category filter
		if (selectedCategory !== "all") {
			atoms = atoms.filter((atom) => atom.category === selectedCategory);
		}

		// Type filter
		if (selectedType !== "all") {
			atoms = atoms.filter((atom) => atom.type === selectedType);
		}

		// Evidence filter
		if (evidenceFilter !== "all") {
			atoms = atoms.filter((atom) => atom.evidenceLevel === evidenceFilter);
		}

		// Search filter - basic text search
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			atoms = atoms.filter(
				(atom) =>
					atom.title.toLowerCase().includes(query) ||
					atom.polishTitle.toLowerCase().includes(query) ||
					atom.content.toLowerCase().includes(query) ||
					atom.polishContent.toLowerCase().includes(query),
			);
		}

		// Advanced filtering with precision criteria
		if (showAdvancedSearch) {
			atoms = applyAdvancedFilters(atoms, {
				studySize: { min: 100 },
				confidenceMin: 0.8,
				hasNeuroimaging: true,
			});
		}

		// Sorting with enhanced options
		switch (sortBy) {
			case "recent":
				atoms.sort(
					(a, b) =>
						new Date(b.lastUpdated).getTime() -
						new Date(a.lastUpdated).getTime(),
				);
				break;
			case "evidence": {
				const evidenceOrder = {
					STRONG: 3,
					MODERATE: 2,
					WEAK: 1,
					INSUFFICIENT: 0,
				};
				atoms.sort(
					(a, b) =>
						evidenceOrder[b.evidenceLevel] - evidenceOrder[a.evidenceLevel],
				);
				break;
			}
			case "category":
				atoms.sort((a, b) => a.category.localeCompare(b.category));
				break;
			case "precision":
				// Sort by evidence quality and data precision
				atoms.sort((a, b) => {
					const scoreA = calculatePrecisionScore(a);
					const scoreB = calculatePrecisionScore(b);
					return scoreB - scoreA;
				});
				break;
			case "effect":
				// Sort by effect size and clinical significance
				atoms.sort((a, b) => {
					const scoreA = calculateEffectScore(a);
					const scoreB = calculateEffectScore(b);
					return scoreB - scoreA;
				});
				break;
			default:
				atoms.sort((a, b) => a.title.localeCompare(b.title));
		}

		return atoms.slice(0, maxAtoms);
	}, [
		selectedCategory,
		selectedType,
		evidenceFilter,
		searchQuery,
		sortBy,
		maxAtoms,
		showAdvancedSearch,
	]);

	const calculatePrecisionScore = (atom: any): number => {
		let score = 0;

		// Evidence level weight
		const evidenceWeights: Record<string, number> = {
			STRONG: 30,
			MODERATE: 20,
			WEAK: 10,
			INSUFFICIENT: 5,
		};
		score += evidenceWeights[atom.evidenceLevel] || 5;

		// Reference count quality
		if (atom.references && atom.references.length > 0) {
			score += Math.min(atom.references.length * 5, 25);

			// Quality of references (journals with impact factor)
			for (const ref of atom.references) {
				if (
					ref.includes("Nature") ||
					ref.includes("Science") ||
					ref.includes("Cell") ||
					ref.includes("Lancet")
				) {
					score += 2;
				}
			}
		}

		// Metadata quality bonuses
		if (atom.metadata) {
			// Neuroimaging data with good sample size
			if ((atom as any).metadata?.neuroimagingData) {
				const data = (atom as any).metadata.neuroimagingData;
				if (
					data.sampleSize >=
					PRECISION_CONSTANTS.STATISTICAL.PREFERRED_SAMPLE_SIZE
				) {
					score += 15;
				}
				if (data.pValue && data.pValue < 0.01) {
					score += 10;
				}
				if (
					data.ci95 &&
					data.ci95.upper - data.ci95.lower < data.ci95.upper * 0.2
				) {
					score += 5;
				}
			}

			// Biomarker precision validation
			if ((atom as any).metadata?.biomarkers) {
				for (const biomarker of (atom as any).metadata.biomarkers) {
					if (validateBiomarkerPrecision(biomarker)) {
						score += 8;
					}
				}
			}

			// Genetic factors with allele-specific data
			if ((atom as any).metadata?.geneticFactors) {
				score += (atom as any).metadata.geneticFactors.some(
					(f: any) => f.genotypeSpecificity,
				)
					? 10
					: 0;
			}

			// Studies with high participant numbers
			if ((atom as any).metadata?.studySize) {
				if (
					(atom as any).metadata.studySize >=
					PRECISION_CONSTANTS.STATISTICAL.LARGE_SAMPLE_SIZE
				) {
					score += 12;
				}
			}
		}

		// Content freshness
		const daysOld =
			(Date.now() - new Date(atom.lastUpdated).getTime()) /
			(1000 * 60 * 60 * 24);
		const freshness = Math.max(0, 100 - daysOld);
		score += freshness * 0.1;

		return Math.min(100, score);
	};

	const calculateEffectScore = (atom: any): number => {
		let score = 0;

		if (
			(atom as any).metadata?.neuroimagingData &&
			(atom as any).metadata.effect?.change
		) {
			const change = Math.abs((atom as any).metadata.effect.change);
			const significance = getStatisticalSignificance(
				(atom as any).metadata.effect.pValue,
			);

			// Large effect sizes get higher scores
			score += change * 10;
			if (significance === "high") score += 15;
		}

		if ((atom as any).metadata?.biomarkers) {
			for (const biomarker of (atom as any).metadata.biomarkers) {
				// Validate physiological significance
				if (biomarkerIsClinicallySignificant(biomarker)) {
					score += 8;
				}
			}
		}

		return score;
	};

	const handleAdvancedSearch = async (
		query: string,
	): Promise<AtomSearchResult> => {
		const atomManager = getAtomManager();

		// Process search query with precision requirements
		const filters: any = {};

		// Extract precision-based search filters
		const queryLower = query.toLowerCase();

		// Look for numerical patterns in the search
		const numberPattern = /\b(?:p\s*[-+]?\d+(?:\.\d+)?)\s*\b/g;
		if (numberPattern.test(queryLower)) {
			const parts = queryLower.split("-");
			if (parts.length > 1) {
				const dosage = parts[1];
				if (dosage) {
					const dosageParts = dosage.split("mg");
					const minVal = dosageParts[0] ? Number.parseFloat(dosageParts[0]) : 0;
					const maxVal = dosageParts[1]
						? Number.parseFloat(dosageParts[1])
						: 1000;
					filters.dosageRange = {
						substance: "unknown",
						min: Number.isNaN(minVal) ? 0 : minVal,
						max: Number.isNaN(maxVal) ? 1000 : maxVal,
					};
				}
			}
		}

		// Look for study size patterns
		const studySizePattern = /\b(?:n\s*=\s*(\d+)\b)/;
		if (studySizePattern.test(queryLower)) {
			const match = studySizePattern.exec(queryLower);
			if (match?.[1]) {
				const studySize = Number.parseInt(match[1]);
				filters.studySize = { min: studySize };
			}
		}

		// Look for confidence levels
		if (queryLower.includes("high ")) {
			filters.confidenceMin = 0.9;
		}

		// Look for specific neuroimaging techniques
		const imaging = ["pet", "fmri", "mri", "eeg", "meg"];
		if (imaging.some((technique) => queryLower.includes(technique))) {
			filters.hasNeuroimaging = true;
		}

		// Look for biomarkers
		const biomarkers = ["gaba", "serum", "cortisol", "il-6", "nf-l"];
		if (biomarkers.some((biomarker) => queryLower.includes(biomarker))) {
			filters.hasBiomarkers = true;
		}

		// Execute enhanced search with filters
		const result = atomManager.searchAtoms({
			query: query,
			categories: filters.categories,
			types: filters.types,
			evidenceLevels: filters.evidenceLevels,
		});

		return result;
	};

	const handleReferenceClick = (reference: string) => {
		onReferenceClick?.(reference);
	};

	const handleAtomClick = (atom: any) => {
		onAtomSelect?.(atom);
	};

	const getCategoryIcon = (category: string) => {
		const icons: Record<string, React.ReactNode> = {
			neuroscience: <Brain className="h-4 w-4" />,
			microbiome: <GraduationCap className="h-4 w-4" />,
			mitochondria: <Zap className="h-4 w-4" />,
			supplementation: <Star className="h-4 w-4" />,
			sleep: <Layers className="h-4 w-4" />,
			inflammation: <AlertTriangle className="h-4 w-4" />,
			chronobiology: <RefreshCw className="h-4 w-4" />,
			mental_health: <Brain className="h-4 w-4" />,
		};
		return icons[category] || <Atom className="h-4 w-4" />;
	};

	return (
		<div className={className}>
			{/* Header */}
			<div className="mb-6">
				<CardHeader className="pb-4">
					<CardTitle className="flex items-center gap-2">
						<Atom className="h-6 w-6" />
						Baza Wiedzy Atomowej
						<Badge variant="secondary">
							{enhancedKnowledgeAtoms.length} atomów
						</Badge>
						<Badge variant="outline" className="ml-2">
							2025 Research
						</Badge>
					</CardTitle>
					<CardDescription>
						Przeglądaj najnowsze badania naukowe w strukturze atomowej
					</CardDescription>
				</CardHeader>
			</div>

			{/* Filters */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-lg">
						<Filter className="h-5 w-5" />
						Filtry i Wyszukiwanie
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Search */}
					<div>
						<Label htmlFor="search">Wyszukaj</Label>
						<div className="relative">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
							<Input
								id="search"
								placeholder="Szukaj po tytule, treści..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						{/* Category Filter */}
						<div>
							<Label htmlFor="category">Kategoria</Label>
							<Select
								value={selectedCategory}
								onValueChange={setSelectedCategory}
							>
								<SelectTrigger id="category">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Wszystkie kategorie</SelectItem>
									{categories.map((category) => (
										<SelectItem key={category} value={category}>
											<div className="flex items-center gap-2">
												{getCategoryIcon(category)}
												<span className="capitalize">{category}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Type Filter */}
						<div>
							<Label htmlFor="type">Typ</Label>
							<Select value={selectedType} onValueChange={setSelectedType}>
								<SelectTrigger id="type">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Wszystkie typy</SelectItem>
									{types.map((type) => (
										<SelectItem key={type} value={type} className="capitalize">
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Evidence Filter */}
						<div>
							<Label htmlFor="evidence">Poziom dowodów</Label>
							<Select value={evidenceFilter} onValueChange={setEvidenceFilter}>
								<SelectTrigger id="evidence">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Wszystkie poziomy</SelectItem>
									<SelectItem value="STRONG">Silne dowody</SelectItem>
									<SelectItem value="MODERATE">Umiarkowane dowody</SelectItem>
									<SelectItem value="WEAK">Słabe dowody</SelectItem>
									<SelectItem value="INSUFFICIENT">Niewystarczające</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Sort Options */}
					<div className="flex items-center gap-4">
						<Label>Sortuj według:</Label>
						<Tabs
							value={sortBy}
							onValueChange={setSortBy as any}
							className="w-auto"
						>
							<TabsList>
								<TabsTrigger value="recent">Najnowsze</TabsTrigger>
								<TabsTrigger value="evidence">Dowody</TabsTrigger>
								<TabsTrigger value="category">Kategoria</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</CardContent>
			</Card>

			{/* Quick Access Panels */}
			<div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* High Evidence Atoms */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Star className="h-5 w-5 text-green-600" />
							Najlepsze Dowody
						</CardTitle>
						<CardDescription>
							Treści z silnymi dowodami naukowymi
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{getHighEvidenceAtoms()
								.slice(0, 3)
								.map((atom) => (
									<KnowledgeAtomComponent
										key={atom.id}
										atom={atom}
										compact={true}
										showRelated={false}
										showReferences={false}
										onAtomClick={handleAtomClick}
										onReferenceClick={handleReferenceClick}
										language={language}
									/>
								))}
						</div>
					</CardContent>
				</Card>

				{/* Recently Updated */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<TrendingUp className="h-5 w-5 text-blue-600" />
							Ostatnio Zaktualizowane
						</CardTitle>
						<CardDescription>Najnowsze odkrycia naukowe</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{getRecentlyUpdatedAtoms(7)
								.slice(0, 3)
								.map((atom) => (
									<KnowledgeAtomComponent
										key={atom.id}
										atom={atom}
										compact={true}
										showRelated={false}
										showReferences={false}
										onAtomClick={handleAtomClick}
										onReferenceClick={handleReferenceClick}
										language={language}
									/>
								))}
						</div>
					</CardContent>
				</Card>

				{/* Categories Overview */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Layers className="h-5 w-5 text-purple-600" />
							Kategorie
						</CardTitle>
						<CardDescription>Przegląd tematyczny</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{categories.slice(0, 4).map((category) => {
								const atoms = getAtomsByCategory(category);
								const highEvidence = atoms.filter(
									(a) => a.evidenceLevel === "STRONG",
								).length;

								return (
									<div
										key={category}
										className="flex cursor-pointer items-center justify-between rounded border p-2 transition-colors hover:bg-muted/50"
										onClick={() => setSelectedCategory(category)}
									>
										<div className="flex items-center gap-2">
											{getCategoryIcon(category)}
											<span className="text-sm capitalize">{category}</span>
										</div>
										<div className="flex items-center gap-2 text-muted-foreground text-xs">
											<span>{atoms.length}</span>
											{highEvidence > 0 && (
												<span className="font-medium text-green-600">
													+{highEvidence}
												</span>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<div className="space-y-4">
				{filteredAtoms.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Brain className="mb-4 h-12 w-12 text-muted-foreground" />
							<h3 className="mb-2 font-semibold text-lg">Brak wyników</h3>
							<p className="mb-4 text-center text-muted-foreground">
								Nie znaleziono atomów pasujących do Twoich kryteriów
								wyszukiwania.
							</p>
							<Button
								onClick={() => {
									setSearchQuery("");
									setSelectedCategory("all");
									setSelectedType("all");
									setEvidenceFilter("all");
								}}
								variant="outline"
							>
								Wyczyść filtry
							</Button>
						</CardContent>
					</Card>
				) : (
					<>
						<div className="flex items-center justify-between">
							<h3 className="font-semibold text-lg">
								Znaleziono {filteredAtoms.length} atomów wiedzy
							</h3>
							<div className="text-muted-foreground text-sm">
								{searchQuery && `Szukanie: "${searchQuery}" • `}
								{selectedCategory !== "all" &&
									`Kategoria: ${selectedCategory} • `}
								{selectedType !== "all" && `Typ: ${selectedType} • `}
								{evidenceFilter !== "all" && `Dowody: ${evidenceFilter}`}
							</div>
						</div>

						<div className="grid gap-4">
							{filteredAtoms.map((atom) => (
								<KnowledgeAtomComponent
									key={atom.id}
									atom={atom}
									showRelated={true}
									showReferences={true}
									onAtomClick={handleAtomClick}
									onReferenceClick={handleReferenceClick}
									language={language}
								/>
							))}
						</div>

						{filteredAtoms.length >= maxAtoms && (
							<Card>
								<CardContent className="flex flex-col items-center justify-center py-8">
									<p className="mb-4 text-muted-foreground">
										Wyświetlono pierwsze {maxAtoms} atomów z{" "}
										{filteredAtoms.length} dostępnych
									</p>
									<Select
										value={maxAtoms.toString()}
										onValueChange={(value) =>
											(window.location.href = `?max=${value}`)
										}
									>
										<SelectTrigger className="w-48">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="25">25 atomów</SelectItem>
											<SelectItem value="50">50 atomów</SelectItem>
											<SelectItem value="100">100 atomów</SelectItem>
											<SelectItem value="200">200 atomów</SelectItem>
											<SelectItem value="500">500 atomów</SelectItem>
										</SelectContent>
									</Select>
								</CardContent>
							</Card>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default AtomicKnowledgePanel;
