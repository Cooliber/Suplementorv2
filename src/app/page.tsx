/**
 * Home Page - Main Entry Point for Suplementor Application
 * Simple landing page with navigation to main features
 */

"use client";

import { AnimatedPage, FadeIn, SlideIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	BookOpen,
	Brain,
	Search,
	Shield,
	Sparkles,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function HomePage() {
	return (
		<AnimatedPage className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
							<div>
								<h1 className="font-bold text-2xl text-gray-900 dark:text-white">
									Suplementor
								</h1>
								<p className="text-gray-600 text-sm dark:text-gray-400">
									Platforma Edukacyjna o Suplementach
								</p>
							</div>
						</div>
						<div className="flex gap-2">
							<Link href="/suplementy" data-testid="nav-suplementy">
								<Button variant="ghost">Suplementy</Button>
							</Link>
							<Link href="/wiedza" data-testid="nav-wiedza">
								<Button variant="ghost">Wiedza</Button>
							</Link>
							<Link href="/wyszukiwanie" data-testid="nav-wyszukiwanie">
								<Button variant="outline">
									<Search className="mr-2 h-4 w-4" />
									Wyszukiwanie
								</Button>
							</Link>
							<Link href="/rekomendacje" data-testid="nav-rekomendacje">
								<Button variant="outline">
									<Sparkles className="mr-2 h-4 w-4" />
									Rekomendacje AI
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="container mx-auto px-4 py-16">
				<div className="mx-auto max-w-3xl text-center">
					<FadeIn>
						<h2 className="mb-6 font-bold text-5xl text-gray-900 dark:text-white">
							Twoje Centrum Wiedzy o Suplementach
						</h2>
					</FadeIn>
					<SlideIn direction="up" delay={0.2}>
						<p className="mb-8 text-gray-600 text-xl dark:text-gray-300">
							Zgłębiaj wiedzę opartą na badaniach naukowych. Odkrywaj,
							analizuj i porównuj suplementy w jednym miejscu.
						</p>
					</SlideIn>
					<SlideIn direction="up" delay={0.4}>
						<div className="flex justify-center gap-4">
							<Link href="/wiedza">
								<Button size="lg" className="gap-2">
									<BookOpen className="h-5 w-5" />
									Przeglądaj Bazę Wiedzy
								</Button>
							</Link>
							<Link href="/suplementy">
								<Button size="lg" variant="outline" className="gap-2">
									<Zap className="h-5 w-5" />
									Zobacz Listę Suplementów
								</Button>
							</Link>
						</div>
					</SlideIn>
				</div>
			</section>

			{/* Features Grid */}
			<section className="container mx-auto px-4 py-16">
				<FadeIn delay={0.2}>
					<h3 className="mb-12 text-center font-bold text-3xl text-gray-900 dark:text-white">
						Główne Funkcje
					</h3>
				</FadeIn>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{/* Feature 3: Evidence-Based (Moved to first position) */}
					<Card className="transition-shadow hover:shadow-lg">
						<CardHeader>
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
								<BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
							</div>
							<CardTitle>Oparte na Dowodach</CardTitle>
							<CardDescription>
								Wszystkie informacje poparte badaniami naukowymi
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 text-gray-600 text-sm dark:text-gray-400">
								<li className="flex items-center gap-2">
									<Shield className="h-4 w-4 text-green-500" />5 poziomów
									dowodów naukowych
								</li>
								<li className="flex items-center gap-2">
									<Shield className="h-4 w-4 text-green-500" />
									Referencje do badań klinicznych
								</li>
								<li className="flex items-center gap-2">
									<Shield className="h-4 w-4 text-green-500" />
									Aktualizacje oparte na nowych badaniach
								</li>
							</ul>
							<Link href="/wiedza" className="mt-4 block w-full">
								<Button className="w-full" variant="outline">
									Dowiedz się więcej
								</Button>
							</Link>
						</CardContent>
					</Card>
					{/* Feature 1: Advanced Search */}
					<Card className="transition-shadow hover:shadow-lg">
						<CardHeader>
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
								<Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
							</div>
							<CardTitle>Zaawansowane Wyszukiwanie</CardTitle>
							<CardDescription>
								Polski NLP z autocomplete, fuzzy matching i rankingiem wyników
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 text-gray-600 text-sm dark:text-gray-400">
								<li className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-green-500" />
									Autocomplete w czasie rzeczywistym
								</li>
								<li className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-green-500" />
									Normalizacja polskich znaków
								</li>
								<li className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-green-500" />
									Ranking 0-100 dla każdego wyniku
								</li>
							</ul>
							<Link href="/wyszukiwanie">
								<Button className="mt-4 w-full">Przejdź do Wyszukiwania</Button>
							</Link>
						</CardContent>
					</Card>

					{/* Feature 2: AI Recommendations */}
					<Card className="transition-shadow hover:shadow-lg">
						<CardHeader>
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
								<Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
							</div>
							<CardTitle>Rekomendacje AI</CardTitle>
							<CardDescription>
								Personalizowane sugestie oparte na Twoim profilu zdrowotnym
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 text-gray-600 text-sm dark:text-gray-400">
								<li className="flex items-center gap-2">
									<Target className="h-4 w-4 text-purple-500" />
									12 celów zdrowotnych
								</li>
								<li className="flex items-center gap-2">
									<Target className="h-4 w-4 text-purple-500" />
									Scoring 0-100 dla każdego suplementu
								</li>
								<li className="flex items-center gap-2">
									<Target className="h-4 w-4 text-purple-500" />
									Analiza synergii i przeciwwskazań
								</li>
							</ul>
							<Link href="/rekomendacje">
								<Button className="mt-4 w-full">Otrzymaj Rekomendacje</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Stats Section */}
			<section className="container mx-auto px-4 py-16">
				<div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-white">
					<div className="grid gap-8 text-center md:grid-cols-3">
						<div>
							<div className="mb-2 font-bold text-5xl">27+</div>
							<div className="text-blue-100">Suplementów w Bazie</div>
						</div>
						<div>
							<div className="mb-2 font-bold text-5xl">12</div>
							<div className="text-blue-100">Celów Zdrowotnych</div>
						</div>
						<div>
							<div className="mb-2 font-bold text-5xl">100%</div>
							<div className="text-blue-100">Polska Lokalizacja</div>
						</div>
					</div>
				</div>
			</section>

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
