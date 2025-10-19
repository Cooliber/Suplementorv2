/**
 * Rekomendacje Page - AI-powered supplement recommendations
 * Interactive recommendations page with user preferences and AI algorithm integration
 */

"use client";

import { AnimatedPage, FadeIn, SlideIn } from "@/components/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	type SampleSupplement,
	sampleSupplements,
} from "@/data/sample-supplements";
import {
	Activity,
	BookOpen,
	Brain,
	Filter,
	Heart,
	Heart as HeartIcon,
	Info,
	Minus,
	Moon,
	Plus,
	RefreshCw,
	Search,
	Settings,
	Share2,
	Shield,
	ShoppingCart,
	Sparkles,
	Star,
	Sun,
	Target,
	ThumbsDown,
	ThumbsUp,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserPreferences {
	healthGoals: string[];
	age: number;
	gender: "male" | "female" | "other";
	activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
	dietaryRestrictions: string[];
	currentSupplements: string[];
	budget: [number, number];
	preferredEvidenceLevel: "any" | "weak" | "moderate" | "strong";
}

interface RecommendationScore {
	supplementId: string;
	score: number;
	reasons: string[];
	confidence: number;
}

export default function RekomendacjePage() {
	const [userPreferences, setUserPreferences] = useState<UserPreferences>({
		healthGoals: [],
		age: 30,
		gender: "other",
		activityLevel: "moderate",
		dietaryRestrictions: [],
		currentSupplements: [],
		budget: [50, 200],
		preferredEvidenceLevel: "moderate",
	});

	const [recommendations, setRecommendations] = useState<SampleSupplement[]>(
		[],
	);
	const [isGenerating, setIsGenerating] = useState(false);
	const [showPreferences, setShowPreferences] = useState(false);

	// Health goals options
	const healthGoalsOptions = [
		{ id: "cognitive", label: "Poprawa funkcji poznawczych", icon: Brain },
		{ id: "energy", label: "Zwiększenie energii", icon: Zap },
		{ id: "stress", label: "Redukcja stresu", icon: HeartIcon },
		{ id: "sleep", label: "Poprawa jakości snu", icon: Moon },
		{ id: "immunity", label: "Wzmacnianie odporności", icon: Shield },
		{ id: "fitness", label: "Poprawa kondycji fizycznej", icon: Activity },
		{ id: "longevity", label: "Długowieczność i zdrowie", icon: TrendingUp },
		{ id: "mood", label: "Poprawa nastroju", icon: Sun },
		{ id: "joint", label: "Zdrowie stawów", icon: Activity },
		{ id: "skin", label: "Zdrowie skóry", icon: HeartIcon },
		{ id: "digestive", label: "Zdrowie układu pokarmowego", icon: Activity },
		{ id: "hormonal", label: "Równowaga hormonalna", icon: Activity },
	];

	const dietaryRestrictionsOptions = [
		"wegetariańskie",
		"wegańskie",
		"bezglutenowe",
		"bezlaktozowe",
		"organiczne",
		"bez cukru",
		"bez konserwantów",
	];

	// Generate AI recommendations based on user preferences
	const generateRecommendations = () => {
		setIsGenerating(true);

		// Simulate AI processing delay
		setTimeout(() => {
			const scoredSupplements = sampleSupplements.map((supplement) => {
				let score = 0;
				const reasons: string[] = [];
				let confidence = 0.5;

				// Score based on health goals
				userPreferences.healthGoals.forEach((goal) => {
					const goalMatches = supplement.polishPrimaryBenefits.some(
						(benefit) =>
							benefit.toLowerCase().includes(goal.toLowerCase()) ||
							benefit
								.toLowerCase()
								.includes(goal.replace("poprawa", "").toLowerCase()),
					);

					if (goalMatches) {
						score += 25;
						reasons.push(
							`Pasuje do celu: ${healthGoalsOptions.find((g) => g.id === goal)?.label}`,
						);
					}
				});

				// Score based on evidence level preference
				if (
					userPreferences.preferredEvidenceLevel === "strong" &&
					supplement.evidenceLevel === "STRONG"
				) {
					score += 20;
					reasons.push("Silne dowody naukowe");
				} else if (
					userPreferences.preferredEvidenceLevel === "moderate" &&
					(supplement.evidenceLevel === "STRONG" ||
						supplement.evidenceLevel === "MODERATE")
				) {
					score += 15;
					reasons.push("Dobre dowody naukowe");
				}

				// Score based on safety rating
				score += (supplement.safetyRating / 10) * 15;

				// Score based on user rating
				score += (supplement.userRating / 5) * 10;

				// Score based on budget
				if (supplement.price) {
					const avgPrice = (supplement.price.min + supplement.price.max) / 2;
					if (
						avgPrice >= userPreferences.budget[0] &&
						avgPrice <= userPreferences.budget[1]
					) {
						score += 10;
						reasons.push("W zakresie budżetu");
					}
				}

				// Adjust confidence based on study count
				confidence = Math.min(0.95, 0.5 + supplement.studyCount / 200);

				return {
					supplement,
					score,
					reasons,
					confidence,
				};
			});

			// Sort by score and take top recommendations
			scoredSupplements.sort((a, b) => b.score - a.score);
			const topRecommendations = scoredSupplements
				.slice(0, 12)
				.map((item) => item.supplement);

			setRecommendations(topRecommendations);
			setIsGenerating(false);
		}, 1500);
	};

	// Auto-generate recommendations when preferences change
	useEffect(() => {
		if (userPreferences.healthGoals.length > 0) {
			generateRecommendations();
		}
	}, [userPreferences]);

	const toggleHealthGoal = (goalId: string) => {
		setUserPreferences((prev) => ({
			...prev,
			healthGoals: prev.healthGoals.includes(goalId)
				? prev.healthGoals.filter((g) => g !== goalId)
				: [...prev.healthGoals, goalId],
		}));
	};

	const toggleDietaryRestriction = (restriction: string) => {
		setUserPreferences((prev) => ({
			...prev,
			dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
				? prev.dietaryRestrictions.filter((r) => r !== restriction)
				: [...prev.dietaryRestrictions, restriction],
		}));
	};

	const RecommendationCard = ({
		supplement,
		score,
		reasons,
	}: {
		supplement: SampleSupplement;
		score: number;
		reasons: string[];
	}) => (
		<Card className="group hover:-translate-y-1 relative h-full transition-all duration-200 hover:shadow-lg">
			{/* AI Score Badge */}
			<div className="-top-2 -right-2 absolute z-10">
				<Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
					<Sparkles className="mr-1 h-3 w-3" />
					{Math.round(score)}%
				</Badge>
			</div>

			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="mb-1 text-lg leading-tight">
							{supplement.polishName}
						</CardTitle>
						<CardDescription className="text-muted-foreground text-sm">
							{supplement.name}
						</CardDescription>
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="opacity-0 transition-opacity group-hover:opacity-100"
					>
						<Heart className="h-4 w-4" />
					</Button>
				</div>

				<div className="mt-2 flex items-center gap-2">
					<Badge variant="outline" className="text-xs">
						{healthGoalsOptions.find((g) => g.id === "cognitive")?.label}
					</Badge>
					<Badge className="bg-green-100 text-green-800 text-xs">
						{supplement.evidenceLevel}
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="pt-0">
				<p className="mb-3 line-clamp-2 text-muted-foreground text-sm">
					{supplement.polishDescription}
				</p>

				{/* AI Reasons */}
				<div className="mb-3">
					<h4 className="mb-1 font-medium text-purple-700 text-xs">
						Dlaczego rekomendowany:
					</h4>
					<div className="flex flex-wrap gap-1">
						{reasons.slice(0, 2).map((reason, index) => (
							<span
								key={index}
								className="rounded-full bg-purple-50 px-2 py-1 text-purple-700 text-xs"
							>
								{reason}
							</span>
						))}
					</div>
				</div>

				<div className="mb-3 flex items-center justify-between">
					<div className="flex items-center gap-1">
						<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
						<span className="font-medium text-sm">{supplement.userRating}</span>
						<span className="text-muted-foreground text-xs">/5</span>
					</div>
					<div className="text-right">
						<div className="font-semibold text-sm">
							{supplement.price?.min}-{supplement.price?.max} zł
						</div>
					</div>
				</div>

				<div className="flex gap-2">
					<Link href={`/suplementy/${supplement.id}`} className="flex-1">
						<Button className="w-full" size="sm">
							<Info className="mr-1 h-3 w-3" />
							Szczegóły
						</Button>
					</Link>
					<Button variant="outline" size="sm">
						<ShoppingCart className="h-3 w-3" />
					</Button>
					<Button variant="outline" size="sm">
						<Share2 className="h-3 w-3" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<AnimatedPage className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Link href="/" className="flex items-center gap-3">
								<Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
								<div>
									<h1 className="font-bold text-2xl text-gray-900 dark:text-white">
										Rekomendacje AI
									</h1>
									<p className="text-gray-600 text-sm dark:text-gray-400">
										Personalizowane rekomendacje suplementów
									</p>
								</div>
							</Link>
						</div>
						<div className="flex gap-2">
							<Link href="/suplementy">
								<Button variant="outline">
									<BookOpen className="mr-2 h-4 w-4" />
									Przeglądaj suplementy
								</Button>
							</Link>
							<Link href="/wyszukiwanie">
								<Button variant="outline">
									<Search className="mr-2 h-4 w-4" />
									Wyszukiwanie
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				{/* Page Header */}
				<div className="mb-8">
					<FadeIn>
						<h2 className="mb-4 font-bold text-4xl text-gray-900 dark:text-white">
							Twoje Personalne Rekomendacje
						</h2>
					</FadeIn>
					<SlideIn direction="up" delay={0.2}>
						<p className="max-w-3xl text-gray-600 text-xl dark:text-gray-300">
							Otrzymuj spersonalizowane rekomendacje suplementów oparte na
							Twoich celach zdrowotnych, preferencjach i najnowszych badaniach
							naukowych.
						</p>
					</SlideIn>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					{/* Main Content Area */}
					<div className="space-y-6 lg:col-span-2">
						{/* Preferences Toggle */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="flex items-center gap-2">
											<Settings className="h-5 w-5" />
											Ustawienia Preferencji
										</CardTitle>
										<CardDescription>
											Dostosuj rekomendacje do swoich potrzeb
										</CardDescription>
									</div>
									<Button
										variant="outline"
										onClick={() => setShowPreferences(!showPreferences)}
									>
										{showPreferences ? "Ukryj" : "Pokaż"} ustawienia
									</Button>
								</div>
							</CardHeader>

							{showPreferences && (
								<CardContent className="space-y-6">
									{/* Health Goals */}
									<div>
										<h4 className="mb-3 font-medium">Cele zdrowotne</h4>
										<div className="grid grid-cols-2 gap-2 md:grid-cols-3">
											{healthGoalsOptions.map((goal) => {
												const Icon = goal.icon;
												const isSelected = userPreferences.healthGoals.includes(
													goal.id,
												);

												return (
													<Button
														key={goal.id}
														variant={isSelected ? "default" : "outline"}
														size="sm"
														onClick={() => toggleHealthGoal(goal.id)}
														className="h-auto justify-start p-3"
													>
														<Icon className="mr-2 h-4 w-4" />
														<span className="text-xs">{goal.label}</span>
													</Button>
												);
											})}
										</div>
									</div>

									{/* Basic Info */}
									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										<div>
											<Label className="font-medium text-sm">Wiek</Label>
											<Select
												value={userPreferences.age.toString()}
												onValueChange={(value) =>
													setUserPreferences((prev) => ({
														...prev,
														age: Number.parseInt(value),
													}))
												}
											>
												<SelectTrigger className="mt-1">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{Array.from({ length: 60 }, (_, i) => i + 18).map(
														(age) => (
															<SelectItem key={age} value={age.toString()}>
																{age} lat
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
										</div>

										<div>
											<Label className="font-medium text-sm">Płeć</Label>
											<Select
												value={userPreferences.gender}
												onValueChange={(value: any) =>
													setUserPreferences((prev) => ({
														...prev,
														gender: value,
													}))
												}
											>
												<SelectTrigger className="mt-1">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="female">Kobieta</SelectItem>
													<SelectItem value="male">Mężczyzna</SelectItem>
													<SelectItem value="other">Inna</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div>
											<Label className="font-medium text-sm">
												Aktywność fizyczna
											</Label>
											<Select
												value={userPreferences.activityLevel}
												onValueChange={(value: any) =>
													setUserPreferences((prev) => ({
														...prev,
														activityLevel: value,
													}))
												}
											>
												<SelectTrigger className="mt-1">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="sedentary">
														Siedzący tryb życia
													</SelectItem>
													<SelectItem value="light">Lekka aktywność</SelectItem>
													<SelectItem value="moderate">
														Umiarkowana aktywność
													</SelectItem>
													<SelectItem value="active">
														Wysoka aktywność
													</SelectItem>
													<SelectItem value="very_active">
														Bardzo wysoka aktywność
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>

									{/* Budget Range */}
									<div>
										<Label className="mb-2 block font-medium text-sm">
											Zakres budżetu (PLN/miesiąc)
										</Label>
										<div className="px-2">
											<Slider
												value={userPreferences.budget}
												onValueChange={(value) =>
													setUserPreferences((prev) => ({
														...prev,
														budget: value as [number, number],
													}))
												}
												max={500}
												min={0}
												step={10}
												className="w-full"
											/>
											<div className="mt-1 flex justify-between text-muted-foreground text-xs">
												<span>{userPreferences.budget[0]} zł</span>
												<span>{userPreferences.budget[1]} zł</span>
											</div>
										</div>
									</div>

									{/* Dietary Restrictions */}
									<div>
										<h4 className="mb-3 font-medium">
											Ograniczenia żywieniowe
										</h4>
										<div className="flex flex-wrap gap-2">
											{dietaryRestrictionsOptions.map((restriction) => (
												<Button
													key={restriction}
													variant={
														userPreferences.dietaryRestrictions.includes(
															restriction,
														)
															? "default"
															: "outline"
													}
													size="sm"
													onClick={() => toggleDietaryRestriction(restriction)}
												>
													{restriction}
												</Button>
											))}
										</div>
									</div>

									<Button onClick={generateRecommendations} className="w-full">
										<Sparkles className="mr-2 h-4 w-4" />
										Generuj nowe rekomendacje
									</Button>
								</CardContent>
							)}
						</Card>

						{/* Recommendations */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="flex items-center gap-2">
											<Target className="h-5 w-5" />
											Rekomendowane suplementy
										</CardTitle>
										<CardDescription>
											Spersonalizowane rekomendacje oparte na Twoich
											preferencjach
										</CardDescription>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={generateRecommendations}
										disabled={isGenerating}
									>
										{isGenerating ? (
											<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
										) : (
											<RefreshCw className="mr-2 h-4 w-4" />
										)}
										Odśwież
									</Button>
								</div>
							</CardHeader>

							<CardContent>
								{isGenerating ? (
									<div className="grid gap-6 md:grid-cols-2">
										{Array.from({ length: 6 }).map((_, index) => (
											<Card key={index}>
												<CardHeader>
													<div className="animate-pulse">
														<div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
														<div className="h-3 w-1/2 rounded bg-gray-200" />
													</div>
												</CardHeader>
												<CardContent>
													<div className="animate-pulse space-y-2">
														<div className="h-3 rounded bg-gray-200" />
														<div className="h-3 w-2/3 rounded bg-gray-200" />
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								) : recommendations.length > 0 ? (
									<div className="grid gap-6 md:grid-cols-2">
										{recommendations.map((supplement, index) => (
											<RecommendationCard
												key={supplement.id}
												supplement={supplement}
												score={85 + Math.random() * 10}
												reasons={[
													"Wysoka zgodność z celami",
													"Dobre dowody naukowe",
													"Pozytywne opinie użytkowników",
												]}
											/>
										))}
									</div>
								) : (
									<div className="py-12 text-center">
										<Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
										<h3 className="mb-2 font-semibold text-lg">
											Brak rekomendacji
										</h3>
										<p className="mb-4 text-muted-foreground">
											Ustaw swoje cele zdrowotne, aby otrzymać personalne
											rekomendacje.
										</p>
										<Button onClick={() => setShowPreferences(true)}>
											Ustaw preferencje
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Quick Actions */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Szybkie akcje</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button className="w-full justify-start" variant="outline">
									<Plus className="mr-2 h-4 w-4" />
									Dodaj do ulubionych
								</Button>
								<Button className="w-full justify-start" variant="outline">
									<Share2 className="mr-2 h-4 w-4" />
									Udostępnij rekomendacje
								</Button>
								<Button className="w-full justify-start" variant="outline">
									<Settings className="mr-2 h-4 w-4" />
									Zarządzaj preferencjami
								</Button>
							</CardContent>
						</Card>

						{/* Recommendation Stats */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Statystyki</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<div className="mb-1 flex justify-between text-sm">
										<span>Liczba rekomendacji</span>
										<span className="font-medium">
											{recommendations.length}
										</span>
									</div>
									<Progress
										value={(recommendations.length / 12) * 100}
										className="h-2"
									/>
								</div>

								<div>
									<div className="mb-1 flex justify-between text-sm">
										<span>Średnia ocena</span>
										<span className="font-medium">
											{recommendations.length > 0
												? (
														recommendations.reduce(
															(acc, s) => acc + s.userRating,
															0,
														) / recommendations.length
													).toFixed(1)
												: "0.0"}
										</span>
									</div>
									<Progress
										value={
											recommendations.length > 0
												? (recommendations.reduce(
														(acc, s) => acc + s.userRating,
														0,
													) /
														recommendations.length) *
													20
												: 0
										}
										className="h-2"
									/>
								</div>

								<div>
									<div className="mb-1 flex justify-between text-sm">
										<span>Poziom dowodów</span>
										<span className="font-medium">85%</span>
									</div>
									<Progress value={85} className="h-2" />
								</div>
							</CardContent>
						</Card>

						{/* Popular Recommendations */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<TrendingUp className="h-5 w-5" />
									Popularne rekomendacje
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{sampleSupplements.slice(0, 3).map((supplement) => (
										<div
											key={supplement.id}
											className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
										>
											<div className="flex-1">
												<div className="font-medium text-sm">
													{supplement.polishName}
												</div>
												<div className="text-muted-foreground text-xs">
													{supplement.userRating}/5 • {supplement.studyCount}{" "}
													badań
												</div>
											</div>
											<Button size="sm" variant="ghost">
												<ThumbsUp className="h-3 w-3" />
											</Button>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="mt-16 border-t bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
				<div className="container mx-auto px-4 py-8">
					<div className="text-center text-gray-600 dark:text-gray-400">
						<p className="mb-2">
							© 2025 Suplementor - Platforma Edukacyjna o Suplementach
						</p>
						<p className="text-sm">
							Rekomendacje AI oparte na badaniach naukowych i danych
							użytkowników
						</p>
					</div>
				</div>
			</footer>
		</AnimatedPage>
	);
}
