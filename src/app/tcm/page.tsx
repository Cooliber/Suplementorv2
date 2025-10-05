/**
 * Traditional Chinese Medicine (TCM) Page
 */

import { FadeIn, SlideIn } from "@/components/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { tcmFormulas, tcmSupplements } from "@/data/tcm-supplements";
import { Droplet, Flame, Leaf, Mountain, Sparkles, Wind } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Medycyna Chińska (TCM) | Suplementor",
	description:
		"Odkryj tradycyjną medycynę chińską (TCM) z mapowaniem na zachodnie suplementy.",
};

const elementIcons = {
	Wood: Leaf,
	Fire: Flame,
	Earth: Mountain,
	Metal: Sparkles,
	Water: Droplet,
};

export default function TCMPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			<header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<h1 className="font-bold text-2xl text-gray-900 dark:text-white">
							Suplementor
						</h1>
						<nav className="flex gap-4">
							<a
								href="/"
								className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
							>
								Strona Główna
							</a>
							<a
								href="/wyszukiwanie"
								className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
							>
								Wyszukiwanie
							</a>
							<a
								href="/stack-builder"
								className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
							>
								Kreator Stosu
							</a>
						</nav>
					</div>
				</div>
			</header>

			<section className="container mx-auto px-4 py-16">
				<div className="mx-auto max-w-3xl text-center">
					<FadeIn>
						<h2 className="mb-6 font-bold text-5xl text-gray-900 dark:text-white">
							Tradycyjna Medycyna Chińska
						</h2>
					</FadeIn>
					<SlideIn direction="up" delay={0.2}>
						<p className="mb-8 text-gray-600 text-xl dark:text-gray-300">
							Odkryj starożytną mądrość TCM z nowoczesnym podejściem naukowym.
						</p>
					</SlideIn>
				</div>
			</section>

			<section className="container mx-auto px-4 py-8">
				<FadeIn delay={0.2}>
					<h3 className="mb-8 text-center font-bold text-3xl text-gray-900 dark:text-white">
						Pięć Elementów (五行)
					</h3>
				</FadeIn>
				<div className="grid gap-6 md:grid-cols-5">
					{(["Wood", "Fire", "Earth", "Metal", "Water"] as const).map(
						(element) => {
							const Icon = elementIcons[element];
							const polishNames = {
								Wood: "Drewno",
								Fire: "Ogień",
								Earth: "Ziemia",
								Metal: "Metal",
								Water: "Woda",
							};
							return (
								<Card
									key={element}
									className="text-center transition-shadow hover:shadow-lg"
								>
									<CardContent className="pt-6">
										<Icon className="mx-auto mb-4 h-12 w-12 text-green-600" />
										<h4 className="font-semibold text-gray-900 dark:text-white">
											{polishNames[element]}
										</h4>
										<p className="text-gray-500 text-sm">{element}</p>
									</CardContent>
								</Card>
							);
						},
					)}
				</div>
			</section>

			<section className="container mx-auto px-4 py-16">
				<FadeIn delay={0.2}>
					<h3 className="mb-8 text-center font-bold text-3xl text-gray-900 dark:text-white">
						Zioła TCM
					</h3>
				</FadeIn>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{tcmSupplements.map((supplement) => {
						const ElementIcon = elementIcons[supplement.element];
						return (
							<Card
								key={supplement.supplementId}
								className="transition-shadow hover:shadow-lg"
							>
								<CardHeader>
									<div className="mb-4 flex items-center justify-between">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
											<ElementIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
										</div>
										<Badge variant="outline">{supplement.polishElement}</Badge>
									</div>
									<CardTitle>{supplement.chineseName}</CardTitle>
									<CardDescription>
										{supplement.pinyin} • {supplement.latinName}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<p className="mb-2 font-semibold text-sm">
												Natura i Smak:
											</p>
											<div className="flex flex-wrap gap-2">
												<Badge variant="secondary">
													{supplement.properties.polishTemperature}
												</Badge>
												{supplement.properties.polishTaste.map((taste) => (
													<Badge key={taste} variant="outline">
														{taste}
													</Badge>
												))}
											</div>
										</div>
										<div>
											<p className="mb-2 font-semibold text-sm">Meridiany:</p>
											<div className="flex flex-wrap gap-2">
												{supplement.properties.polishMeridiansEntered.map(
													(meridian) => (
														<Badge key={meridian} variant="outline">
															{meridian}
														</Badge>
													),
												)}
											</div>
										</div>
										<div>
											<p className="mb-2 font-semibold text-sm">Yin/Yang:</p>
											<Badge
												variant={
													supplement.yinYang === "Yang"
														? "default"
														: "secondary"
												}
											>
												{supplement.yinYang}
											</Badge>
										</div>
										<div>
											<p className="mb-2 font-semibold text-sm">Działania:</p>
											<ul className="space-y-1 text-gray-600 text-sm dark:text-gray-400">
												{supplement.properties.polishActions
													.slice(0, 3)
													.map((action) => (
														<li key={action}>• {action}</li>
													))}
											</ul>
										</div>
										<Button className="w-full" variant="outline">
											Zobacz Szczegóły
										</Button>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>

			<section className="container mx-auto px-4 py-16">
				<FadeIn delay={0.2}>
					<h3 className="mb-8 text-center font-bold text-3xl text-gray-900 dark:text-white">
						Klasyczne Formuły TCM
					</h3>
				</FadeIn>
				<div className="grid gap-6 md:grid-cols-2">
					{tcmFormulas.map((formula) => (
						<Card
							key={formula.id}
							className="transition-shadow hover:shadow-lg"
						>
							<CardHeader>
								<CardTitle>{formula.name}</CardTitle>
								<CardDescription>
									{formula.pinyin} • {formula.polishName}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<Badge>{formula.polishCategory}</Badge>
									</div>
									<div>
										<p className="mb-2 font-semibold text-sm">Działania:</p>
										<ul className="space-y-1 text-gray-600 text-sm dark:text-gray-400">
											{formula.polishActions.map((action) => (
												<li key={action}>• {action}</li>
											))}
										</ul>
									</div>
									<div>
										<p className="mb-2 font-semibold text-sm">Wskazania:</p>
										<div className="flex flex-wrap gap-2">
											{formula.polishIndications.map((indication) => (
												<Badge key={indication} variant="outline">
													{indication}
												</Badge>
											))}
										</div>
									</div>
									<Button className="w-full" variant="outline">
										Zobacz Formułę
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</div>
	);
}
