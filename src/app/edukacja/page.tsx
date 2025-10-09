import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Brain, FlaskConical, Zap, Activity, Clock, GraduationCap, TrendingUp, ChevronRight, Users, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
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
					<Card className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-lg group">
						<CardHeader className="bg-green-50/50">
							<div className="flex items-center justify-between mb-2">
								<Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
									Początkujący
								</Badge>
								<BookOpen className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
							</div>
							<CardTitle className="text-green-900">Podstawy Suplementacji</CardTitle>
							<CardDescription className="text-green-700">
								Idealne dla osób rozpoczynających przygodę z suplementami
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Accordion type="single" collapsible className="w-full">
								<AccordionItem value="beginner-content" className="border-green-200">
									<AccordionTrigger className="text-green-800 hover:text-green-900">
										Zobacz program nauczania
									</AccordionTrigger>
									<AccordionContent className="space-y-3">
										<div className="space-y-2">
											{[
												"Czym są suplementy i jak działają",
												"Bezpieczeństwo i dawkowanie",
												"Najpopularniejsze suplementy",
												"Podstawowe interakcje",
												"Wskazówki zakupowe"
											].map((topic, index) => (
												<div key={index} className="flex items-center gap-2 text-sm">
													<span className="text-green-600 mt-0.5">✓</span>
													<span>{topic}</span>
												</div>
											))}
										</div>
										<Separator className="my-3" />
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Szacowany czas:</span>
											<span className="font-medium text-green-700">2-3 godziny</span>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
							<Button className="w-full bg-green-600 hover:bg-green-700 text-white">
								Rozpocznij Naukę
								<ChevronRight className="ml-2 h-4 w-4" />
							</Button>
						</CardContent>
					</Card>

					{/* Intermediate Module */}
					<Card className="border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg group">
						<CardHeader className="bg-blue-50/50">
							<div className="flex items-center justify-between mb-2">
								<Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
									Średniozaawansowany
								</Badge>
								<Brain className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
							</div>
							<CardTitle className="text-blue-900">Mechanizmy Działania</CardTitle>
							<CardDescription className="text-blue-700">
								Pogłębiona wiedza o tym, jak suplementy wpływają na organizm
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Accordion type="single" collapsible className="w-full">
								<AccordionItem value="intermediate-content" className="border-blue-200">
									<AccordionTrigger className="text-blue-800 hover:text-blue-900">
										Zobacz program nauczania
									</AccordionTrigger>
									<AccordionContent className="space-y-3">
										<div className="space-y-2">
											{[
												"Receptory i szlaki sygnałowe",
												"Neuroprzekaźniki i hormony",
												"Interakcje i synergizm",
												"Farmakokinetyka podstawowa",
												"Biomarkery i ocena efektywności"
											].map((topic, index) => (
												<div key={index} className="flex items-center gap-2 text-sm">
													<span className="text-blue-600 mt-0.5">✓</span>
													<span>{topic}</span>
												</div>
											))}
										</div>
										<Separator className="my-3" />
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Szacowany czas:</span>
											<span className="font-medium text-blue-700">4-5 godzin</span>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
							<Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
								Kontynuuj Naukę
								<ChevronRight className="ml-2 h-4 w-4" />
							</Button>
						</CardContent>
					</Card>

					{/* Expert Module */}
					<Card className="border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg group">
						<CardHeader className="bg-purple-50/50">
							<div className="flex items-center justify-between mb-2">
								<Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
									Ekspert
								</Badge>
								<FlaskConical className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
							</div>
							<CardTitle className="text-purple-900">Badania i Dowody</CardTitle>
							<CardDescription className="text-purple-700">
								Zaawansowana analiza badań naukowych i dowodów klinicznych
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Accordion type="single" collapsible className="w-full">
								<AccordionItem value="expert-content" className="border-purple-200">
									<AccordionTrigger className="text-purple-800 hover:text-purple-900">
										Zobacz program nauczania
									</AccordionTrigger>
									<AccordionContent className="space-y-3">
										<div className="space-y-2">
											{[
												"Analiza badań klinicznych",
												"Farmakokinetyka i farmakodynamika",
												"Projektowanie protokołów",
												"Meta-analiza i systematyczne przeglądy",
												"Indywidualizacja suplementacji"
											].map((topic, index) => (
												<div key={index} className="flex items-center gap-2 text-sm">
													<span className="text-purple-600 mt-0.5">✓</span>
													<span>{topic}</span>
												</div>
											))}
										</div>
										<Separator className="my-3" />
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Szacowany czas:</span>
											<span className="font-medium text-purple-700">6-8 godzin</span>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
							<Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
								Zgłębiaj Wiedzę
								<ChevronRight className="ml-2 h-4 w-4" />
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
						<Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer group border-2 border-transparent hover:border-primary/20">
							<CardHeader className="text-center">
								<div className="mx-auto mb-3 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
									<FlaskConical className="h-8 w-8 text-primary" />
								</div>
								<CardTitle className="text-lg group-hover:text-primary transition-colors">Badania Naukowe</CardTitle>
								<CardDescription className="text-sm">
									Przegląd badań klinicznych i dowodów naukowych
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="flex items-center justify-center text-xs text-muted-foreground">
									<span>150+ badań</span>
									<ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
								</div>
							</CardContent>
						</Card>
					</Link>

					<Link href="/mechanizmy">
						<Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer group border-2 border-transparent hover:border-primary/20">
							<CardHeader className="text-center">
								<div className="mx-auto mb-3 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
									<Activity className="h-8 w-8 text-primary" />
								</div>
								<CardTitle className="text-lg group-hover:text-primary transition-colors">Mechanizmy Działania</CardTitle>
								<CardDescription className="text-sm">
									Jak suplementy wpływają na organizm na poziomie molekularnym
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="flex items-center justify-center text-xs text-muted-foreground">
									<span>6 mechanizmów</span>
									<ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
								</div>
							</CardContent>
						</Card>
					</Link>

					<Link href="/neuroprzekazniki">
						<Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer group border-2 border-transparent hover:border-primary/20">
							<CardHeader className="text-center">
								<div className="mx-auto mb-3 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
									<Zap className="h-8 w-8 text-primary" />
								</div>
								<CardTitle className="text-lg group-hover:text-primary transition-colors">Neuroprzekaźniki</CardTitle>
								<CardDescription className="text-sm">
									Poznaj chemię mózgu i systemy neuroprzekaźnikowe
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="flex items-center justify-center text-xs text-muted-foreground">
									<span>6 systemów</span>
									<ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
								</div>
							</CardContent>
						</Card>
					</Link>

					<Link href="/obszary-mozgu">
						<Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer group border-2 border-transparent hover:border-primary/20">
							<CardHeader className="text-center">
								<div className="mx-auto mb-3 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
									<Brain className="h-8 w-8 text-primary" />
								</div>
								<CardTitle className="text-lg group-hover:text-primary transition-colors">Obszary Mózgu</CardTitle>
								<CardDescription className="text-sm">
									Anatomia i funkcje różnych regionów mózgu
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="flex items-center justify-center text-xs text-muted-foreground">
									<span>8 regionów</span>
									<ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
								</div>
							</CardContent>
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

