"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FlaskConical, Activity, Zap, Brain, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ContentCategory {
	id: string;
	name: string;
	polishName: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
	bgColor: string;
	pages: ContentPage[];
}

interface ContentPage {
	id: string;
	name: string;
	polishName: string;
	url: string;
	description: string;
	polishDescription: string;
}

const CONTENT_STRUCTURE: ContentCategory[] = [
	{
		id: "learning",
		name: "Learning",
		polishName: "Nauka",
		icon: GraduationCap,
		color: "text-blue-600",
		bgColor: "bg-blue-50",
		pages: [
			{
				id: "education-hub",
				name: "Education Hub",
				polishName: "Centrum Edukacyjne",
				url: "/edukacja",
				description: "Central hub for all educational resources",
				polishDescription: "Centralne miejsce dla wszystkich zasobów edukacyjnych",
			},
		],
	},
	{
		id: "research",
		name: "Research",
		polishName: "Badania",
		icon: FlaskConical,
		color: "text-green-600",
		bgColor: "bg-green-50",
		pages: [
			{
				id: "research-studies",
				name: "Research Studies",
				polishName: "Badania Naukowe",
				url: "/badania",
				description: "Scientific evidence and clinical studies",
				polishDescription: "Dowody naukowe i badania kliniczne",
			},
		],
	},
	{
		id: "science",
		name: "Science",
		polishName: "Nauka",
		icon: Activity,
		color: "text-purple-600",
		bgColor: "bg-purple-50",
		pages: [
			{
				id: "mechanisms",
				name: "Mechanisms of Action",
				polishName: "Mechanizmy Działania",
				url: "/mechanizmy",
				description: "How supplements work at molecular level",
				polishDescription: "Jak suplementy działają na poziomie molekularnym",
			},
			{
				id: "neurotransmitters",
				name: "Neurotransmitters",
				polishName: "Neuroprzekaźniki",
				url: "/neuroprzekazniki",
				description: "Brain chemistry and neurotransmitter systems",
				polishDescription: "Chemia mózgu i systemy neuroprzekaźnikowe",
			},
		],
	},
	{
		id: "brain",
		name: "Brain",
		polishName: "Mózg",
		icon: Brain,
		color: "text-indigo-600",
		bgColor: "bg-indigo-50",
		pages: [
			{
				id: "brain-regions",
				name: "Brain Regions",
				polishName: "Obszary Mózgu",
				url: "/obszary-mozgu",
				description: "Brain anatomy and function",
				polishDescription: "Anatomia i funkcje mózgu",
			},
		],
	},
	{
		id: "body",
		name: "Human Body",
		polishName: "Ciało Człowieka",
		icon: Brain, // You may want to replace this with a more appropriate icon
		color: "text-emerald-600",
		bgColor: "bg-emerald-50",
		pages: [
			{
				id: "body-systems",
				name: "Body Systems",
				polishName: "Układy Ciała",
				url: "/uklad-ciala",
				description: "Human body systems and their functions",
				polishDescription: "Układy ciała człowieka i ich funkcje",
			},
			{
				id: "endocannabinoid-system",
				name: "Endocannabinoid System",
				polishName: "System Endokannabinoidowy",
				url: "/system-endokannabinoidowy",
				description: "Comprehensive information about the endocannabinoid system",
				polishDescription: "Kompleksowe informacje o systemie endokannabinoidowym",
			},
		],
	},
];

export function EducationalContentMap() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<BookOpen className="h-5 w-5" />
					Mapa Zasobów Edukacyjnych
				</CardTitle>
				<CardDescription>
					Przegląd wszystkich dostępnych materiałów edukacyjnych
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{CONTENT_STRUCTURE.map((category) => {
						const Icon = category.icon;
						return (
							<div key={category.id} className="space-y-3">
								{/* Category Header */}
								<div className="flex items-center gap-3">
									<div className={`p-2 rounded-lg ${category.bgColor}`}>
										<Icon className={`h-5 w-5 ${category.color}`} />
									</div>
									<div>
										<h3 className="font-semibold text-lg">{category.polishName}</h3>
										<Badge variant="secondary" className="text-xs">
											{category.pages.length} {category.pages.length === 1 ? "strona" : "strony"}
										</Badge>
									</div>
								</div>

								{/* Pages Grid */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-12">
									{category.pages.map((page) => (
										<Link key={page.id} href={page.url}>
											<Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary">
												<CardHeader className="pb-3">
													<CardTitle className="text-base flex items-center justify-between">
														<span>{page.polishName}</span>
														<ArrowRight className="h-4 w-4 text-muted-foreground" />
													</CardTitle>
												</CardHeader>
												<CardContent>
													<p className="text-sm text-muted-foreground">
														{page.polishDescription}
													</p>
												</CardContent>
											</Card>
										</Link>
									))}
								</div>
							</div>
						);
					})}
				</div>

				{/* Summary */}
				<div className="mt-8 pt-6 border-t">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-primary">
								{CONTENT_STRUCTURE.length}
							</div>
							<div className="text-xs text-muted-foreground">Kategorie</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-primary">
								{CONTENT_STRUCTURE.reduce((sum, cat) => sum + cat.pages.length, 0)}
							</div>
							<div className="text-xs text-muted-foreground">Strony</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-primary">100+</div>
							<div className="text-xs text-muted-foreground">Artykuły</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-primary">50+</div>
							<div className="text-xs text-muted-foreground">Badania</div>
						</div>
					</div>
				</div>

				{/* Learning Path Suggestion */}
				<div className="mt-6 p-4 bg-muted rounded-lg">
					<h4 className="font-semibold mb-2 flex items-center gap-2">
						<GraduationCap className="h-4 w-4" />
						Sugerowana Ścieżka Nauki
					</h4>
					<ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
						<li>Zacznij od <strong>Centrum Edukacyjnego</strong> aby poznać podstawy</li>
						<li>Przejdź do <strong>Mechanizmów Działania</strong> aby zrozumieć jak działają suplementy</li>
						<li>Poznaj <strong>Neuroprzekaźniki</strong> i ich rolę w mózgu</li>
						<li>Zbadaj <strong>Obszary Mózgu</strong> i ich funkcje</li>
						<li>Przejrzyj <strong>Badania Naukowe</strong> aby zobaczyć dowody</li>
					</ol>
				</div>
			</CardContent>
		</Card>
	);
}

