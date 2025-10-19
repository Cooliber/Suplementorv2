import { CircadianTimingPanel } from "@/components/education/CircadianTimingPanel";
import { EducationalContentMap } from "@/components/education/EducationalContentMap";
import ProgressTracker from "@/components/education/ProgressTracker";
import { BreadcrumbNavigation } from "@/components/navigation/BreadcrumbNavigation";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Activity,
	BookOpen,
	Brain,
	ChevronRight,
	Clock,
	FlaskConical,
	GraduationCap,
	Star,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Edukacja | Suplementor",
	description:
		"Centrum zasobów edukacyjnych - naucz się wszystkiego o suplementach, mózgu i zdrowiu",
};

export default function EducationHubPage() {
	return (
		<div className="container mx-auto space-y-12 px-4 py-8">
			{/* Breadcrumb Navigation */}
			<BreadcrumbNavigation />

			{/* Hero Section */}
			<div className="space-y-4 text-center">
				<div className="flex justify-center">
					<GraduationCap className="h-16 w-16 text-primary" />
				</div>
				<h1 className="font-bold text-4xl md:text-5xl">Centrum Edukacyjne</h1>
				<p className="mx-auto max-w-2xl text-muted-foreground text-xl">
					Kompleksowe zasoby edukacyjne o suplementach, mózgu i zdrowiu. Ucz się
					w swoim tempie z materiałami dostosowanymi do Twojego poziomu.
				</p>
			</div>

			{/* Progress Tracker */}
			<section>
				<ProgressTracker />
			</section>

			{/* Educational Content Map */}
			<section className="space-y-4">
				<div>
					<h2 className="mb-2 font-bold text-3xl">Mapa Zasobów Edukacyjnych</h2>
					<p className="text-muted-foreground">
						Przegląd wszystkich dostępnych materiałów edukacyjnych. Kliknij na
						dowolną stronę, aby rozpocząć naukę.
					</p>
				</div>
				<EducationalContentMap />
			</section>

			{/* Educational Modules Grid */}
			<section className="space-y-6">
				<div>
					<h2 className="mb-2 font-bold text-3xl">Moduły Edukacyjne</h2>
					<p className="text-muted-foreground">
						Wybierz poziom trudności i rozpocznij naukę
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{/* Beginner Module */}
					<Card className="group border-2 border-green-200 transition-all hover:border-green-400 hover:shadow-lg">
						<CardHeader className="bg-green-50/50">
							<div className="mb-2 flex items-center justify-between">
								<Badge
									variant="secondary"
									className="bg-green-100 text-green-800 hover:bg-green-200"
								>
									Początkujący
								</Badge>
								<BookOpen className="h-5 w-5 text-green-600 transition-transform group-hover:scale-110" />
							</div>
							<CardTitle className="text-green-900">
								Podstawy Suplementacji
							</CardTitle>
							<CardDescription className="text-green-700">
								Idealne dla osób rozpoczynających przygodę z suplementami
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Accordion type="single" collapsible className="w-full">
								<AccordionItem
									value="beginner-content"
									className="border-green-200"
								>
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
												"Wskazówki zakupowe",
											].map((topic, index) => (
												<div
													key={index}
													className="flex items-center gap-2 text-sm"
												>
													<span className="mt-0.5 text-green-600">✓</span>
													<span>{topic}</span>
												</div>
											))}
										</div>
										<Separator className="my-3" />
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">
												Szacowany czas:
											</span>
											<span className="font-medium text-green-700">
												2-3 godziny
											</span>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
							<Button className="w-full bg-green-600 text-white hover:bg-green-700">
								Rozpocznij Naukę
								<ChevronRight className="ml-2 h-4 w-4" />
							</Button>
						</CardContent>
					</Card>

					{/* Intermediate Module */}
					<Card className="group border-2 border-blue-200 transition-all hover:border-blue-400 hover:shadow-lg">
						<CardHeader className="bg-blue-50/50">
							<div className="mb-2 flex items-center justify-between">
								<Badge
									variant="secondary"
									className="bg-blue-100 text-blue-800 hover:bg-blue-200"
								>
									Średniozaawansowany
								</Badge>
								<Brain className="h-5 w-5 text-blue-600 transition-transform group-hover:scale-110" />
							</div>
							<CardTitle className="text-blue-900">
								Mechanizmy Działania
							</CardTitle>
							<CardDescription className="text-blue-700">
								Pogłębiona wiedza o tym, jak suplementy wpływają na organizm
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Accordion type="single" collapsible className="w-full">
								<AccordionItem
									value="intermediate-content"
									className="border-blue-200"
								>
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
												"Biomarkery i ocena efektywności",
											].map((topic, index) => (
												<div
													key={index}
													className="flex items-center gap-2 text-sm"
												>
													<span className="mt-0.5 text-blue-600">✓</span>
													<span>{topic}</span>
												</div>
											))}
										</div>
										<Separator className="my-3" />
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">
												Szacowany czas:
											</span>
											<span className="font-medium text-blue-700">
												4-5 godzin
											</span>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
							<Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
								Kontynuuj Naukę
								<ChevronRight className="ml-2 h-4 w-4" />
							</Button>
						</CardContent>
					</Card>

					{/* Expert Module */}
					<Card className="group border-2 border-purple-200 transition-all hover:border-purple-400 hover:shadow-lg">
						<CardHeader className="bg-purple-50/50">
							<div className="mb-2 flex items-center justify-between">
								<Badge
									variant="secondary"
									className="bg-purple-100 text-purple-800 hover:bg-purple-200"
								>
									Ekspert
								</Badge>
								<FlaskConical className="h-5 w-5 text-purple-600 transition-transform group-hover:scale-110" />
							</div>
							<CardTitle className="text-purple-900">
								Badania i Dowody
							</CardTitle>
							<CardDescription className="text-purple-700">
								Zaawansowana analiza badań naukowych i dowodów klinicznych
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Accordion type="single" collapsible className="w-full">
								<AccordionItem
									value="expert-content"
									className="border-purple-200"
								>
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
												"Indywidualizacja suplementacji",
											].map((topic, index) => (
												<div
													key={index}
													className="flex items-center gap-2 text-sm"
												>
													<span className="mt-0.5 text-purple-600">✓</span>
													<span>{topic}</span>
												</div>
											))}
										</div>
										<Separator className="my-3" />
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">
												Szacowany czas:
											</span>
											<span className="font-medium text-purple-700">
												6-8 godzin
											</span>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
							<Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
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
					<h2 className="mb-2 font-bold text-3xl">Eksploruj Tematy</h2>
					<p className="text-muted-foreground">
						Przejdź do szczegółowych sekcji edukacyjnych
					</p>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Link href="/badania">
						<Card className="group h-full cursor-pointer border-2 border-transparent transition-all hover:scale-105 hover:border-primary/20 hover:shadow-lg">
							<CardHeader className="text-center">
								<div className="mx-auto mb-3 rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
									<FlaskConical className="h-8 w-8 text-primary" />
								</div>
								<CardTitle className="text-lg transition-colors group-hover:text-primary">
									Badania Naukowe
								</CardTitle>
								<CardDescription className="text-sm">
									Przegląd badań klinicznych i dowodów naukowych
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="flex items-center justify-center text-muted-foreground text-xs">
									<span>150+ badań</span>
									<ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
								</div>
							</CardContent>
						</Card>
					</Link>

					<Link href="/mechanizmy">
						<Card className="group h-full cursor-pointer border-2 border-transparent transition-all hover:scale-105 hover:border-primary/20 hover:shadow-lg">
							<CardHeader className="text-center">
								<div className="mx-auto mb-3 rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
									<Activity className="h-8 w-8 text-primary" />
								</div>
								<CardTitle className="text-lg transition-colors group-hover:text-primary">
									Mechanizmy Działania
								</CardTitle>
								<CardDescription className="text-sm">
									Jak suplementy wpływają na organizm na poziomie molekularnym
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="flex items-center justify-center text-muted-foreground text-xs">
									<span>6 mechanizmów</span>
									<ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
								</div>
							</CardContent>
						</Card>
					</Link>

					<Link href="/neuroprzekazniki">
						<Card className="group h-full cursor-pointer border-2 border-transparent transition-all hover:scale-105 hover:border-primary/20 hover:shadow-lg">
							<CardHeader className="text-center">
								<div className="mx-auto mb-3 rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
									<Zap className="h-8 w-8 text-primary" />
								</div>
								<CardTitle className="text-lg transition-colors group-hover:text-primary">
									Neuroprzekaźniki
								</CardTitle>
								<CardDescription className="text-sm">
									Poznaj chemię mózgu i systemy neuroprzekaźnikowe
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="flex items-center justify-center text-muted-foreground text-xs">
									<span>6 systemów</span>
									<ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
								</div>
							</CardContent>
						</Card>
					</Link>

					<Link href="/obszary-mozgu">
						<Card className="group h-full cursor-pointer border-2 border-transparent transition-all hover:scale-105 hover:border-primary/20 hover:shadow-lg">
							<CardHeader className="text-center">
								<div className="mx-auto mb-3 rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
									<Brain className="h-8 w-8 text-primary" />
								</div>
								<CardTitle className="text-lg transition-colors group-hover:text-primary">
									Obszary Mózgu
								</CardTitle>
								<CardDescription className="text-sm">
									Anatomia i funkcje różnych regionów mózgu
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="flex items-center justify-center text-muted-foreground text-xs">
									<span>8 regionów</span>
									<ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
								</div>
							</CardContent>
						</Card>
					</Link>
				</div>
			</section>

			{/* Learning Paths */}
			<section className="space-y-6">
				<div>
					<h2 className="mb-2 font-bold text-3xl">Ścieżki Nauki</h2>
					<p className="text-muted-foreground">
						Strukturyzowane programy edukacyjne prowadzące Cię krok po kroku
					</p>
				</div>
				{/* Learning paths available for different topics */}
			</section>

			{/* Circadian Rhythm Section */}
			<section className="space-y-6">
				<div>
					<h2 className="mb-2 flex items-center gap-3 font-bold text-3xl">
						<Clock className="h-8 w-8 text-primary" />
						Rytm Dobowy i Suplementacja
					</h2>
					<p className="text-muted-foreground">
						Dowiedz się, kiedy najlepiej przyjmować suplementy zgodnie z
						naturalnym rytmem organizmu
					</p>
				</div>
				<CircadianTimingPanel />
			</section>

			{/* Call to Action */}
			<section className="space-y-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-8 text-center">
				<TrendingUp className="mx-auto h-12 w-12 text-primary" />
				<h2 className="font-bold text-2xl">Gotowy na Rozpoczęcie Nauki?</h2>
				<p className="mx-auto max-w-2xl text-muted-foreground">
					Rozpocznij swoją edukacyjną podróż już dziś. Wybierz moduł odpowiedni
					dla Twojego poziomu i rozwijaj swoją wiedzę o suplementach i zdrowiu.
				</p>
				<div className="flex flex-wrap justify-center gap-4">
					<Button size="lg">Rozpocznij od Podstaw</Button>
					<Button size="lg" variant="outline">
						Przeglądaj Wszystkie Zasoby
					</Button>
				</div>
			</section>
		</div>
	);
}
