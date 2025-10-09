"use client";

import { useState, useMemo } from "react";
import { EnhancedSearchInterface } from "@/components/supplements/EnhancedSearchInterface";
import { SupplementGrid } from "@/components/supplements/SupplementGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sparkles, TrendingUp, Award, Users, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { sampleSupplements, getFeaturedSupplements, getPopularSupplements } from "@/data/sample-supplements";

export default function SupplementsPage() {
	const [filteredSupplements, setFilteredSupplements] = useState(sampleSupplements);
	const [totalResults, setTotalResults] = useState(sampleSupplements.length);

	const handleSearch = (filters: any) => {
		let results = [...sampleSupplements];

		// Apply search query
		if (filters.query) {
			results = results.filter(supplement =>
				supplement.polishName.toLowerCase().includes(filters.query.toLowerCase()) ||
				supplement.name.toLowerCase().includes(filters.query.toLowerCase()) ||
				supplement.polishDescription.toLowerCase().includes(filters.query.toLowerCase())
			);
		}

		// Apply category filter
		if (filters.categories.length > 0) {
			results = results.filter(supplement => filters.categories.includes(supplement.category));
		}

		// Apply evidence level filter
		if (filters.evidenceLevels.length > 0) {
			results = results.filter(supplement => filters.evidenceLevels.includes(supplement.evidenceLevel));
		}

		// Apply safety rating filter
		results = results.filter(supplement =>
			supplement.safetyRating >= filters.safetyRating[0] &&
			supplement.safetyRating <= filters.safetyRating[1]
		);

		// Apply sorting
		results.sort((a, b) => {
			switch (filters.sortBy) {
				case "name":
					return filters.sortOrder === "asc"
						? a.polishName.localeCompare(b.polishName)
						: b.polishName.localeCompare(a.polishName);
				case "evidence":
					const evidenceOrder = { STRONG: 4, MODERATE: 3, WEAK: 2, INSUFFICIENT: 1, CONFLICTING: 0 };
					return filters.sortOrder === "asc"
						? evidenceOrder[a.evidenceLevel] - evidenceOrder[b.evidenceLevel]
						: evidenceOrder[b.evidenceLevel] - evidenceOrder[a.evidenceLevel];
				case "safety":
					return filters.sortOrder === "asc"
						? a.safetyRating - b.safetyRating
						: b.safetyRating - a.safetyRating;
				case "rating":
					return filters.sortOrder === "asc"
						? a.userRating - b.userRating
						: b.userRating - a.userRating;
				case "price":
					const aPrice = a.price ? a.price.min : 0;
					const bPrice = b.price ? b.price.min : 0;
					return filters.sortOrder === "asc" ? aPrice - bPrice : bPrice - aPrice;
				default:
					return 0;
			}
		});

		setFilteredSupplements(results);
		setTotalResults(results.length);
	};

	const handleSupplementClick = (id: string) => {
		// Navigate to supplement detail page
		window.location.href = `/suplementy/${id}`;
	};

	const popularSearches = ["pamięć", "koncentracja", "sen", "stres", "energia", "nastrój"];

	return (
		<div className="container mx-auto max-w-7xl px-4 py-8">
			{/* Header */}
			<div className="mb-8 text-center">
				<h1 className="mb-4 font-bold text-4xl">Baza Suplementów</h1>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
					Odkryj kompleksową bazę suplementów z analizą naukową, mechanizmami działania i praktycznymi rekomendacjami
				</p>
			</div>

			{/* Stats Cards */}
			<div className="mb-8 grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Wszystkie suplementy</CardTitle>
						<Badge variant="secondary">{sampleSupplements.length}</Badge>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{sampleSupplements.length}</div>
						<p className="text-xs text-muted-foreground">
							W naszej bazie danych
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Silne dowody</CardTitle>
						<Award className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{sampleSupplements.filter((s: any) => s.evidenceLevel === "STRONG").length}
						</div>
						<p className="text-xs text-muted-foreground">
							Z potwierdzoną skutecznością
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Popularne</CardTitle>
						<TrendingUp className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{sampleSupplements.filter((s: any) => s.userRating > 4.5).length}
						</div>
						<p className="text-xs text-muted-foreground">
							Wysoko oceniane przez użytkowników
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Badania</CardTitle>
						<Users className="h-4 w-4 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{sampleSupplements.reduce((acc: number, s: any) => acc + s.studyCount, 0).toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">
							Opublikowanych badań naukowych
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Search Interface */}
			<div className="mb-8">
				<EnhancedSearchInterface
					onSearch={handleSearch}
					popularSearches={popularSearches}
					totalResults={totalResults}
				/>
			</div>

			{/* CTA for AI Recommendations */}
			<Card className="mb-8 border-primary/50 bg-primary/5">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Sparkles className="h-5 w-5 text-primary" />
						Nie wiesz który suplement wybrać?
					</CardTitle>
					<CardDescription>
						Skorzystaj z naszego systemu rekomendacji AI, który dobierze suplementy idealnie dopasowane do Twoich celów zdrowotnych i stylu życia.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Link href="/rekomendacje">
						<Button size="lg">
							<Sparkles className="mr-2 h-4 w-4" />
							Uzyskaj rekomendacje AI
						</Button>
					</Link>
				</CardContent>
			</Card>

			{/* Supplement Grid */}
			<SupplementGrid
				supplements={filteredSupplements}
				onSupplementClick={handleSupplementClick}
				showSearch={false}
				showFilters={false}
				defaultViewMode="grid"
			/>
		</div>
	);
}