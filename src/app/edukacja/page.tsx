import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Brain, FlaskConical, Zap, Activity, Clock, GraduationCap, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProgressTracker from "@/components/education/ProgressTracker";
import { CircadianTimingPanel } from "@/components/education/CircadianTimingPanel";
import { EducationalContentMap } from "@/components/education/EducationalContentMap";
import { BreadcrumbNavigation } from "@/components/navigation/BreadcrumbNavigation";

export const metadata: Metadata = {
	title: "Edukacja | Suplementor",
	description: "Centrum zasobów edukacyjnych - naucz się wszystkiego o suplementach, mózgu i zdrowiu",
};

export default function EducationHubPage() {
	return (
		<div className="container mx-auto px-4 py-8 space-y-12">
			{/* Breadcrumb Navigation */}
			<BreadcrumbNavigation />

			{/* Hero Section */}
			<div className="text-center space-y-4">
				<div className="flex justify-center">
					<GraduationCap className="h-16 w-16 text-primary" />
				</div>
				<h1 className="text-4xl md:text-5xl font-bold">Centrum Edukacyjne</h1>
				<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
					Kompleksowe zasoby edukacyjne o suplementach, mózgu i zdrowiu. 
					Ucz się w swoim tempie z materiałami dostosowanymi do Twojego poziomu.
				</p>
			</div>

			{/* Progress Tracker */}
			<section>
				<ProgressTracker />
			</section>

			{/* Educational Content Map */}
			<section className="space-y-4">
				<div>
					<h2 className="text-3xl font-bold mb-2">Mapa Zasobów Edukacyjnych</h2>
					<p className="text-muted-foreground">
						Przegląd wszystkich dostępnych materiałów edukacyjnych. Kliknij na dowolną stronę, aby rozpocząć naukę.
					</p>
				</div>
				<EducationalContentMap />
			</section>

			{/* Educational Modules Grid */}
			<section className="space-y-6">
				<div>
					<h2 className="text-3xl font-bold mb-2">Moduły Edukacyjne</h2>
					<p className="text-muted-foreground">
						Wybierz poziom trudności i rozpocznij naukę
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Beginner Module */}
					<Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
						<CardHeader>
							<div className="flex items-center justify-between mb-2">
								<Badge variant="secondary" className="bg-green-100 text-green-800">
									Początkujący
								</Badge>
								<BookOpen className="h-5 w-5 text-green-600" />
							</div>
							<CardTitle>Podstawy Suplementacji</CardTitle>
							<CardDescription>
								Idealne dla osób rozpoczynających przygodę z suplementami
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<ul className="space-y-2 text-sm">
								<li className="flex items-start gap-2">
									<span className="text-green-600 mt-0.5">✓</span>
									<span>Czym są suplementy i jak działają</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-green-600 mt-0.5">✓</span>
									<span>Bezpieczeństwo i dawkowanie</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-green-600 mt-0.5">✓</span>
									<span>Najpopularniejsze suplementy</span>
								</li>
							</ul>
							<Button className="w-full" variant="outline">
								Rozpocznij Naukę
							</Button>
						</CardContent>
					</Card>

					{/* Intermediate Module */}
					<Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
						<CardHeader>
							<div className="flex items-center justify-between mb-2">
								<Badge variant="secondary" className="bg-blue-100 text-blue-800">
									Średniozaawansowany
								</Badge>
								<Brain className="h-5 w-5 text-blue-600" />
							</div>
							<CardTitle>Mechanizmy Działania</CardTitle>
							<CardDescription>
								Pogłębiona wiedza o tym, jak suplementy wpływają na organizm
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<ul className="space-y-2 text-sm">
								<li className="flex items-start gap-2">
									<span className="text-blue-600 mt-0.5">✓</span>
									<span>Receptory i szlaki sygnałowe</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-blue-600 mt-0.5">✓</span>
									<span>Neuroprzekaźniki i hormony</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-blue-600 mt-0.5">✓</span>
									<span>Interakcje i synergizm</span>
								</li>
							</ul>
							<Button className="w-full" variant="outline">
								Kontynuuj Naukę
							</Button>
						</CardContent>
					</Card>

					{/* Expert Module */}
					<Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
						<CardHeader>
							<div className="flex items-center justify-between mb-2">
								<Badge variant="secondary" className="bg-purple-100 text-purple-800">
									Ekspert
								</Badge>
								<FlaskConical className="h-5 w-5 text-purple-600" />
							</div>
							<CardTitle>Badania i Dowody</CardTitle>
							<CardDescription>
								Zaawansowana analiza badań naukowych i dowodów klinicznych
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<ul className="space-y-2 text-sm">
								<li className="flex items-start gap-2">
									<span className="text-purple-600 mt-0.5">✓</span>
									<span>Analiza badań klinicznych</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-purple-600 mt-0.5">✓</span>
									<span>Farmakokinetyka i farmakodynamika</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-purple-600 mt-0.5">✓</span>
									<span>Projektowanie protokołów</span>
								</li>
							</ul>
							<Button className="w-full" variant="outline">
								Zgłębiaj Wiedzę
							</Button>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Quick Links to Other Educational Pages */}
			<section className="space-y-6">
				<div>
					<h2 className="text-3xl font-bold mb-2">Eksploruj Tematy</h2>
					<p className="text-muted-foreground">
						Przejdź do szczegółowych sekcji edukacyjnych
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<Link href="/badania">
						<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
							<CardHeader>
								<FlaskConical className="h-8 w-8 text-primary mb-2" />
								<CardTitle className="text-lg">Badania Naukowe</CardTitle>
								<CardDescription>
									Przegląd badań klinicznych i dowodów naukowych
								</CardDescription>
							</CardHeader>
						</Card>
					</Link>

					<Link href="/mechanizmy">
						<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
							<CardHeader>
								<Activity className="h-8 w-8 text-primary mb-2" />
								<CardTitle className="text-lg">Mechanizmy Działania</CardTitle>
								<CardDescription>
									Jak suplementy wpływają na organizm na poziomie molekularnym
								</CardDescription>
							</CardHeader>
						</Card>
					</Link>

					<Link href="/neuroprzekazniki">
						<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
							<CardHeader>
								<Zap className="h-8 w-8 text-primary mb-2" />
								<CardTitle className="text-lg">Neuroprzekaźniki</CardTitle>
								<CardDescription>
									Poznaj chemię mózgu i systemy neuroprzekaźnikowe
								</CardDescription>
							</CardHeader>
						</Card>
					</Link>

					<Link href="/obszary-mozgu">
						<Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
							<CardHeader>
								<Brain className="h-8 w-8 text-primary mb-2" />
								<CardTitle className="text-lg">Obszary Mózgu</CardTitle>
								<CardDescription>
									Anatomia i funkcje różnych regionów mózgu
								</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				</div>
			</section>

			{/* Learning Paths */}
			<section className="space-y-6">
				<div>
					<h2 className="text-3xl font-bold mb-2">Ścieżki Nauki</h2>
					<p className="text-muted-foreground">
						Strukturyzowane programy edukacyjne prowadzące Cię krok po kroku
					</p>
				</div>
				{/* Learning paths available for different topics */}
			</section>

			{/* Circadian Rhythm Section */}
			<section className="space-y-6">
				<div>
					<h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
						<Clock className="h-8 w-8 text-primary" />
						Rytm Dobowy i Suplementacja
					</h2>
					<p className="text-muted-foreground">
						Dowiedz się, kiedy najlepiej przyjmować suplementy zgodnie z naturalnym rytmem organizmu
					</p>
				</div>
				<CircadianTimingPanel />
			</section>

			{/* Call to Action */}
			<section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 text-center space-y-4">
				<TrendingUp className="h-12 w-12 text-primary mx-auto" />
				<h2 className="text-2xl font-bold">Gotowy na Rozpoczęcie Nauki?</h2>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					Rozpocznij swoją edukacyjną podróż już dziś. Wybierz moduł odpowiedni dla Twojego poziomu 
					i rozwijaj swoją wiedzę o suplementach i zdrowiu.
				</p>
				<div className="flex gap-4 justify-center flex-wrap">
					<Button size="lg">
						Rozpocznij od Podstaw
					</Button>
					<Button size="lg" variant="outline">
						Przeglądaj Wszystkie Zasoby
					</Button>
				</div>
			</section>
		</div>
	);
}

