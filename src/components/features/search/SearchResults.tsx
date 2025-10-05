"use client";

/**
 * Search Results Component
 * Displays search results with relevance scores and snippets
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { EvidenceLevel, SupplementCategory } from "@/types/supplement";
import { AlertCircle, ExternalLink, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SearchResult {
	id: string;
	name: string;
	polishName: string;
	category: SupplementCategory;
	evidenceLevel: EvidenceLevel;
	relevanceScore: number;
	matchedTerms: string[];
	snippet: string;
}

interface SearchResultsProps {
	results: SearchResult[];
	language?: "pl" | "en";
	onSupplementClick?: (id: string) => void;
}

export function SearchResults({
	results,
	language = "pl",
	onSupplementClick,
}: SearchResultsProps) {
	const [sortBy, setSortBy] = useState<"relevance" | "evidence">("relevance");

	const categoryLabels: Record<SupplementCategory, string> = {
		NOOTROPIC: "Nootropik",
		VITAMIN: "Witamina",
		MINERAL: "Minerał",
		AMINO_ACID: "Aminokwas",
		HERB: "Zioło",
		ADAPTOGEN: "Adaptogen",
		COENZYME: "Koenzym",
		FATTY_ACID: "Kwas tłuszczowy",
		PROBIOTIC: "Probiotyk",
		ENZYME: "Enzym",
		OTHER: "Inne",
	};

	const evidenceLabels: Record<
		EvidenceLevel,
		{ label: string; color: string }
	> = {
		STRONG: { label: "Silne dowody", color: "bg-green-500" },
		MODERATE: { label: "Umiarkowane", color: "bg-blue-500" },
		WEAK: { label: "Słabe", color: "bg-yellow-500" },
		INSUFFICIENT: { label: "Niewystarczające", color: "bg-gray-500" },
		CONFLICTING: { label: "Sprzeczne", color: "bg-red-500" },
	};

	// Sort results
	const sortedResults = [...results].sort((a, b) => {
		if (sortBy === "relevance") {
			return b.relevanceScore - a.relevanceScore;
		}
		const evidenceOrder: Record<EvidenceLevel, number> = {
			STRONG: 5,
			MODERATE: 4,
			WEAK: 3,
			INSUFFICIENT: 2,
			CONFLICTING: 1,
		};
		return evidenceOrder[b.evidenceLevel] - evidenceOrder[a.evidenceLevel];
	});

	// Highlight matched terms in snippet
	const highlightSnippet = (snippet: string, matchedTerms: string[]) => {
		let highlighted = snippet;
		matchedTerms.forEach((term) => {
			const regex = new RegExp(`(${term})`, "gi");
			highlighted = highlighted.replace(
				regex,
				'<mark class="bg-yellow-200 dark:bg-yellow-900">$1</mark>',
			);
		});
		return highlighted;
	};

	if (results.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
				<h3 className="mb-2 font-semibold text-lg">
					{language === "pl" ? "Brak wyników" : "No results found"}
				</h3>
				<p className="max-w-md text-muted-foreground">
					{language === "pl"
						? "Spróbuj użyć innych słów kluczowych lub zmień filtry wyszukiwania."
						: "Try using different keywords or adjust your search filters."}
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Results Header */}
			<div className="flex items-center justify-between">
				<div className="text-muted-foreground text-sm">
					{language === "pl"
						? `Znaleziono ${results.length} ${results.length === 1 ? "suplement" : "suplementów"}`
						: `Found ${results.length} supplement${results.length === 1 ? "" : "s"}`}
				</div>
				<div className="flex gap-2">
					<Button
						variant={sortBy === "relevance" ? "default" : "outline"}
						size="sm"
						onClick={() => setSortBy("relevance")}
					>
						<TrendingUp className="mr-2 h-4 w-4" />
						{language === "pl" ? "Trafność" : "Relevance"}
					</Button>
					<Button
						variant={sortBy === "evidence" ? "default" : "outline"}
						size="sm"
						onClick={() => setSortBy("evidence")}
					>
						<Star className="mr-2 h-4 w-4" />
						{language === "pl" ? "Dowody" : "Evidence"}
					</Button>
				</div>
			</div>

			{/* Results List */}
			<div className="space-y-3">
				{sortedResults.map((result) => (
					<Card
						key={result.id}
						className="cursor-pointer transition-shadow hover:shadow-md"
						onClick={() => onSupplementClick?.(result.id)}
					>
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
									<CardTitle className="mb-1 text-lg">
										{language === "pl" ? result.polishName : result.name}
									</CardTitle>
									<CardDescription className="text-sm">
										{language === "pl" ? result.name : result.polishName}
									</CardDescription>
								</div>
								<div className="flex flex-col items-end gap-2">
									<Badge variant="secondary">
										{categoryLabels[result.category]}
									</Badge>
									<div className="flex items-center gap-1">
										<div
											className={`h-2 w-2 rounded-full ${evidenceLabels[result.evidenceLevel].color}`}
										/>
										<span className="text-muted-foreground text-xs">
											{evidenceLabels[result.evidenceLevel].label}
										</span>
									</div>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{/* Snippet */}
								<p
									className="line-clamp-2 text-muted-foreground text-sm"
									dangerouslySetInnerHTML={{
										__html: highlightSnippet(
											result.snippet,
											result.matchedTerms,
										),
									}}
								/>

								{/* Matched Terms */}
								{result.matchedTerms.length > 0 && (
									<div className="flex flex-wrap gap-1">
										{result.matchedTerms.slice(0, 5).map((term, idx) => (
											<Badge key={idx} variant="outline" className="text-xs">
												{term}
											</Badge>
										))}
									</div>
								)}

								{/* Relevance Score */}
								<div className="flex items-center justify-between border-t pt-2">
									<div className="flex items-center gap-2">
										<span className="text-muted-foreground text-xs">
											{language === "pl" ? "Trafność:" : "Relevance:"}
										</span>
										<div className="flex gap-0.5">
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													className={`h-3 w-3 ${
														i < Math.ceil((result.relevanceScore / 100) * 5)
															? "fill-yellow-400 text-yellow-400"
															: "text-gray-300"
													}`}
												/>
											))}
										</div>
										<span className="font-medium text-xs">
											{Math.round(result.relevanceScore)}%
										</span>
									</div>
									<Link
										href={`/suplementy/${result.id}`}
										onClick={(e) => e.stopPropagation()}
										className="flex items-center gap-1 text-primary text-xs hover:underline"
									>
										{language === "pl" ? "Zobacz szczegóły" : "View details"}
										<ExternalLink className="h-3 w-3" />
									</Link>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
