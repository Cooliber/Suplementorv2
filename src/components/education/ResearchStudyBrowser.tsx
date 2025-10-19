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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	getHighQualityStudies,
	getRecentStudies,
	getStudiesByCategory,
	researchStudiesDatabase,
	searchResearchStudies,
} from "@/data/education/research-studies-database";
import {
	ResearchStudyCard as ResearchStudyCardType,
	type SupplementCategory,
} from "@/types/education";
import {
	BookOpen,
	Calendar,
	ExternalLink,
	Filter,
	Grid3X3,
	List,
	Search,
	SlidersHorizontal,
	Star,
	TrendingUp,
	Users,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import ResearchStudyCard from "./ResearchStudyCard";

interface ResearchStudyBrowserProps {
	initialCategory?: SupplementCategory;
	showFilters?: boolean;
	maxStudies?: number;
	compactView?: boolean;
}

type ViewMode = "grid" | "list";
type SortOption = "relevance" | "year" | "quality" | "sample_size";

export default function ResearchStudyBrowser({
	initialCategory,
	showFilters = true,
	maxStudies,
	compactView = false,
}: ResearchStudyBrowserProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<
		SupplementCategory | "all"
	>(initialCategory || "all");
	const [evidenceLevel, setEvidenceLevel] = useState<string>("all");
	const [qualityFilter, setQualityFilter] = useState<string>("all");
	const [yearRange, setYearRange] = useState<{ min?: number; max?: number }>(
		{},
	);
	const [studyType, setStudyType] = useState<string>("all");
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [sortBy, setSortBy] = useState<SortOption>("relevance");
	const [savedStudies, setSavedStudies] = useState<Set<string>>(new Set());

	// Filter and search studies
	const filteredStudies = useMemo(() => {
		let studies = searchResearchStudies(researchStudiesDatabase, {
			searchTerm: searchTerm || undefined,
			category: selectedCategory === "all" ? undefined : selectedCategory,
			evidenceLevel: evidenceLevel === "all" ? undefined : evidenceLevel,
			year: yearRange,
			quality: qualityFilter === "all" ? undefined : qualityFilter,
			studyType: studyType === "all" ? undefined : studyType,
		});

		// Sort studies
		studies.sort((a, b) => {
			switch (sortBy) {
				case "year":
					return b.year - a.year;
				case "quality":
					return b.quality.score - a.quality.score;
				case "sample_size":
					return b.methodology.sampleSize - a.methodology.sampleSize;
				default: {
					// Sort by relevance score (could be enhanced with more sophisticated scoring)
					const aScore =
						a.quality.score +
						(a.relevance.evidenceLevel === "strong"
							? 3
							: a.relevance.evidenceLevel === "moderate"
								? 2
								: 1);
					const bScore =
						b.quality.score +
						(b.relevance.evidenceLevel === "strong"
							? 3
							: b.relevance.evidenceLevel === "moderate"
								? 2
								: 1);
					return bScore - aScore;
				}
			}
		});

		if (maxStudies) {
			studies = studies.slice(0, maxStudies);
		}

		return studies;
	}, [
		searchTerm,
		selectedCategory,
		evidenceLevel,
		qualityFilter,
		yearRange,
		studyType,
		sortBy,
		maxStudies,
	]);

	const handleSaveStudy = (studyId: string) => {
		setSavedStudies((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(studyId)) {
				newSet.delete(studyId);
			} else {
				newSet.add(studyId);
			}
			return newSet;
		});
	};

	const handleShareStudy = (studyId: string) => {
		const study = researchStudiesDatabase.find((s) => s.id === studyId);
		if (study?.doi) {
			navigator.clipboard.writeText(`https://doi.org/${study.doi}`);
		}
	};

	const clearFilters = () => {
		setSearchTerm("");
		setSelectedCategory("all");
		setEvidenceLevel("all");
		setQualityFilter("all");
		setYearRange({});
		setStudyType("all");
		setSortBy("relevance");
	};

	const activeFiltersCount = [
		searchTerm,
		selectedCategory !== "all",
		evidenceLevel !== "all",
		qualityFilter !== "all",
		yearRange.min || yearRange.max,
		studyType !== "all",
	].filter(Boolean).length;

	return (
		<div className="space-y-6">
			{/* Search and Filter Bar */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
						<div className="flex flex-1 gap-2">
							<div className="relative max-w-sm flex-1">
								<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
								<Input
									placeholder="Search studies..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
							{showFilters && (
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="outline" size="sm">
											<SlidersHorizontal className="mr-2 h-4 w-4" />
											Filters
											{activeFiltersCount > 0 && (
												<Badge variant="secondary" className="ml-2">
													{activeFiltersCount}
												</Badge>
											)}
										</Button>
									</DialogTrigger>
									<DialogContent className="max-w-md">
										<DialogHeader>
											<DialogTitle>Filter Studies</DialogTitle>
											<DialogDescription>
												Filter research studies by various criteria
											</DialogDescription>
										</DialogHeader>
										<div className="space-y-4">
											<div>
												<label className="font-medium text-sm">Category</label>
												<Select
													value={selectedCategory}
													onValueChange={(value) =>
														setSelectedCategory(
															value as SupplementCategory | "all",
														)
													}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="all">All Categories</SelectItem>
														<SelectItem value="vitamins_minerals">
															Vitamins & Minerals
														</SelectItem>
														<SelectItem value="herbal_medicine">
															Herbal Medicine
														</SelectItem>
														<SelectItem value="cognitive_enhancers">
															Cognitive Enhancers
														</SelectItem>
														<SelectItem value="sports_nutrition">
															Sports Nutrition
														</SelectItem>
														<SelectItem value="gut_health">
															Gut Health
														</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div>
												<label className="font-medium text-sm">
													Evidence Level
												</label>
												<Select
													value={evidenceLevel}
													onValueChange={setEvidenceLevel}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="all">All Levels</SelectItem>
														<SelectItem value="strong">Strong</SelectItem>
														<SelectItem value="moderate">Moderate</SelectItem>
														<SelectItem value="weak">Weak</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div>
												<label className="font-medium text-sm">
													Study Quality
												</label>
												<Select
													value={qualityFilter}
													onValueChange={setQualityFilter}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="all">All Quality</SelectItem>
														<SelectItem value="excellent">Excellent</SelectItem>
														<SelectItem value="good">Good</SelectItem>
														<SelectItem value="fair">Fair</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div>
												<label className="font-medium text-sm">
													Study Type
												</label>
												<Select value={studyType} onValueChange={setStudyType}>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="all">All Types</SelectItem>
														<SelectItem value="RCT">RCT</SelectItem>
														<SelectItem value="meta_analysis">
															Meta-Analysis
														</SelectItem>
														<SelectItem value="observational">
															Observational
														</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<Button
												onClick={clearFilters}
												variant="outline"
												className="w-full"
											>
												Clear All Filters
											</Button>
										</div>
									</DialogContent>
								</Dialog>
							)}
						</div>

						<div className="flex gap-2">
							<Select
								value={sortBy}
								onValueChange={(value) => setSortBy(value as SortOption)}
							>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="relevance">Relevance</SelectItem>
									<SelectItem value="year">Year</SelectItem>
									<SelectItem value="quality">Quality</SelectItem>
									<SelectItem value="sample_size">Sample Size</SelectItem>
								</SelectContent>
							</Select>

							<div className="flex rounded-md border">
								<Button
									variant={viewMode === "grid" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("grid")}
									className="rounded-r-none"
								>
									<Grid3X3 className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "list" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("list")}
									className="rounded-l-none"
								>
									<List className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Quick Filter Tabs */}
			<Tabs
				value={selectedCategory}
				onValueChange={(value) =>
					setSelectedCategory(value as SupplementCategory | "all")
				}
			>
				<TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="vitamins_minerals">Vitamins</TabsTrigger>
					<TabsTrigger value="herbal_medicine">Herbal</TabsTrigger>
					<TabsTrigger value="cognitive_enhancers">Cognitive</TabsTrigger>
					<TabsTrigger value="sports_nutrition">Sports</TabsTrigger>
					<TabsTrigger value="gut_health">Gut Health</TabsTrigger>
					<TabsTrigger value="immune_support">Immune</TabsTrigger>
				</TabsList>
			</Tabs>

			{/* Results Summary */}
			<div className="flex items-center justify-between">
				<p className="text-muted-foreground text-sm">
					Showing {filteredStudies.length} of {researchStudiesDatabase.length}{" "}
					studies
				</p>
				{activeFiltersCount > 0 && (
					<Button variant="ghost" size="sm" onClick={clearFilters}>
						Clear filters ({activeFiltersCount})
					</Button>
				)}
			</div>

			{/* Studies Display */}
			{filteredStudies.length > 0 ? (
				<div
					className={
						viewMode === "grid"
							? "grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3"
							: "space-y-4"
					}
				>
					{filteredStudies.map((study) => (
						<ResearchStudyCard
							key={study.id}
							study={study}
							compact={compactView || viewMode === "list"}
							onSave={handleSaveStudy}
							onShare={handleShareStudy}
							isSaved={savedStudies.has(study.id)}
						/>
					))}
				</div>
			) : (
				<Card>
					<CardContent className="py-12 text-center">
						<BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
						<h3 className="mb-2 font-medium text-lg">No studies found</h3>
						<p className="mb-4 text-muted-foreground">
							Try adjusting your search terms or filters to find relevant
							research studies.
						</p>
						<Button onClick={clearFilters} variant="outline">
							Clear all filters
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Featured Studies Section */}
			{!searchTerm && selectedCategory === "all" && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Star className="h-5 w-5 text-yellow-500" />
							Featured High-Quality Studies
						</CardTitle>
						<CardDescription>
							Hand-picked research studies with excellent methodology and high
							clinical relevance
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{getHighQualityStudies()
								.slice(0, 4)
								.map((study) => (
									<div
										key={study.id}
										className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
									>
										<div className="mb-2 flex items-start justify-between">
											<h4 className="line-clamp-2 font-medium text-sm">
												{study.title}
											</h4>
											<Badge className="bg-green-100 text-green-800 text-xs">
												{study.quality.rating}
											</Badge>
										</div>
										<p className="mb-2 text-muted-foreground text-xs">
											{study.authors.join(", ")} • {study.year}
										</p>
										<p className="mb-3 line-clamp-2 text-muted-foreground text-xs">
											{study.abstract}
										</p>
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="outline"
												className="text-xs"
												asChild
											>
												<a
													href={`https://doi.org/${study.doi}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													<ExternalLink className="mr-1 h-3 w-3" />
													View Study
												</a>
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => handleSaveStudy(study.id)}
											>
												<Star
													className={`h-3 w-3 ${savedStudies.has(study.id) ? "fill-yellow-400 text-yellow-400" : ""}`}
												/>
											</Button>
										</div>
									</div>
								))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
