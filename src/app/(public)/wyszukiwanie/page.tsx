"use client";

/**
 * Advanced Search Page
 * Full-featured search interface with Polish NLP
 */

import { AdvancedSearchBar } from "@/components/features/search/AdvancedSearchBar";
import { SearchResults } from "@/components/features/search/SearchResults";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SearchPage() {
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [hasSearched, setHasSearched] = useState(false);

	const handleSearch = (results: any[]) => {
		setSearchResults(results);
		setHasSearched(true);
	};

	return (
		<div className="container mx-auto max-w-7xl px-4 py-8">
			{/* Header */}
			<div className="mb-8 text-center">
				<div className="mb-4 flex items-center justify-center gap-3">
					<Search className="h-10 w-10 text-primary" />
					<h1 className="font-bold text-4xl">Zaawansowane Wyszukiwanie</h1>
				</div>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
					Znajdź idealne suplementy dzięki zaawansowanemu wyszukiwaniu z polskim
					NLP, rozszerzaniem synonimów i inteligentnym rankingiem.
				</p>
			</div>

			{/* Search Bar */}
			<div className="mb-8">
				<AdvancedSearchBar onSearch={handleSearch} language="pl" />
			</div>

			{/* CTA for Recommendations */}
			{!hasSearched && (
				<div className="mb-8 rounded-lg border-2 border-primary/50 border-dashed bg-primary/5 p-6">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="mb-2 flex items-center gap-2 font-semibold text-lg">
								<Sparkles className="h-5 w-5 text-primary" />
								Nie wiesz czego szukasz?
							</h3>
							<p className="text-muted-foreground">
								Wypróbuj nasz system rekomendacji AI, który dobierze suplementy
								idealnie dopasowane do Twoich celów zdrowotnych.
							</p>
						</div>
						<Link href="/rekomendacje">
							<Button size="lg">
								<Sparkles className="mr-2 h-4 w-4" />
								Uzyskaj rekomendacje AI
							</Button>
						</Link>
					</div>
				</div>
			)}

			{/* Results */}
			{hasSearched && (
				<div>
					<SearchResults results={searchResults} language="pl" />
				</div>
			)}

			{/* Empty State */}
			{!hasSearched && (
				<div className="py-12 text-center">
					<Search className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50" />
					<h3 className="mb-2 font-semibold text-xl">Zacznij wyszukiwanie</h3>
					<p className="mx-auto max-w-md text-muted-foreground">
						Wpisz nazwę suplementu, składnik aktywny lub cel zdrowotny, aby
						znaleźć odpowiednie suplementy.
					</p>
					<div className="mt-6 flex flex-wrap justify-center gap-2">
						<span className="text-muted-foreground text-sm">Przykłady:</span>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								const searchBar = document.querySelector(
									'input[type="text"]',
								) as HTMLInputElement;
								if (searchBar) {
									searchBar.value = "pamięć";
									searchBar.dispatchEvent(
										new Event("input", { bubbles: true }),
									);
								}
							}}
						>
							pamięć
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								const searchBar = document.querySelector(
									'input[type="text"]',
								) as HTMLInputElement;
								if (searchBar) {
									searchBar.value = "koncentracja";
									searchBar.dispatchEvent(
										new Event("input", { bubbles: true }),
									);
								}
							}}
						>
							koncentracja
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								const searchBar = document.querySelector(
									'input[type="text"]',
								) as HTMLInputElement;
								if (searchBar) {
									searchBar.value = "omega-3";
									searchBar.dispatchEvent(
										new Event("input", { bubbles: true }),
									);
								}
							}}
						>
							omega-3
						</Button>
					</div>
				</div>
			)}

			{/* Features */}
			<div className="mt-16 grid gap-6 md:grid-cols-3">
				<div className="rounded-lg border bg-card p-6">
					<h4 className="mb-2 font-semibold">🇵🇱 Polski NLP</h4>
					<p className="text-muted-foreground text-sm">
						Zaawansowane przetwarzanie języka polskiego z normalizacją znaków,
						stemmingiem i rozszerzaniem synonimów.
					</p>
				</div>
				<div className="rounded-lg border bg-card p-6">
					<h4 className="mb-2 font-semibold">🎯 Inteligentny Ranking</h4>
					<p className="text-muted-foreground text-sm">
						Wyniki sortowane według trafności z uwzględnieniem dopasowania
						nazwy, opisu, tagów i poziomu dowodów.
					</p>
				</div>
				<div className="rounded-lg border bg-card p-6">
					<h4 className="mb-2 font-semibold">🔍 Fuzzy Matching</h4>
					<p className="text-muted-foreground text-sm">
						Tolerancja błędów pisowni dzięki algorytmowi Levenshteina - znajdź
						to czego szukasz nawet z literówkami.
					</p>
				</div>
			</div>
		</div>
	);
}
