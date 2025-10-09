"use client";

import * as React from "react";
import { Award, ShoppingCart, Pill, Shield, TrendingUp, Users, Star, BarChart3, AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface MultiDimensionalRating {
	effectiveness?: number;
	valueForMoney?: number;
	easeOfUse?: number;
	safety?: number;
}

interface MultiDimensionalRatingDisplayProps {
	ratings: MultiDimensionalRating[];
	title?: string;
	showComparison?: boolean;
	showTrends?: boolean;
	className?: string;
}

interface RatingDimension {
	key: keyof MultiDimensionalRating;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	description: string;
	color: string;
	weight: number; // For calculating overall score
}

interface RatingDimensionWithStats extends RatingDimension {
	average: number;
	totalResponses: number;
	percentage: number;
	distribution?: Array<{ rating: number; count: number; percentage: number }>;
}

const RATING_DIMENSIONS: RatingDimension[] = [
	{
		key: "effectiveness",
		label: "Skuteczność",
		icon: Award,
		description: "Jak dobrze suplement spełnia swoje zadanie",
		color: "blue",
		weight: 0.4
	},
	{
		key: "valueForMoney",
		label: "Stosunek jakość/cena",
		icon: ShoppingCart,
		description: "Czy suplement jest wart swojej ceny",
		color: "green",
		weight: 0.25
	},
	{
		key: "easeOfUse",
		label: "Łatwość stosowania",
		icon: Pill,
		description: "Jak łatwo jest stosować suplement",
		color: "purple",
		weight: 0.2
	},
	{
		key: "safety",
		label: "Bezpieczeństwo",
		icon: Shield,
		description: "Poziom bezpieczeństwa i brak skutków ubocznych",
		color: "red",
		weight: 0.15
	},
];

export function MultiDimensionalRatingDisplay({
	ratings,
	title = "Wielowymiarowe oceny",
	showComparison = true,
	showTrends = true,
	className,
}: MultiDimensionalRatingDisplayProps) {
	// Calculate average ratings for each dimension
	const dimensionAverages = React.useMemo(() => {
		const sums = RATING_DIMENSIONS.reduce((acc, dim) => {
			acc[dim.key] = { sum: 0, count: 0 };
			return acc;
		}, {} as Record<keyof MultiDimensionalRating, { sum: number; count: number }>);

		ratings.forEach(rating => {
			RATING_DIMENSIONS.forEach(dim => {
				if (rating[dim.key]) {
					sums[dim.key].sum += rating[dim.key]!;
					sums[dim.key].count += 1;
				}
			});
		});

		return RATING_DIMENSIONS.map(dim => ({
			...dim,
			average: sums[dim.key].count > 0 ? sums[dim.key].sum / sums[dim.key].count : 0,
			totalResponses: sums[dim.key].count,
			percentage: sums[dim.key].count > 0 ? (sums[dim.key].sum / (sums[dim.key].count * 5)) * 100 : 0
		}));
	}, [ratings]);

	// Calculate overall weighted score
	const overallScore = React.useMemo(() => {
		let weightedSum = 0;
		let totalWeight = 0;

		dimensionAverages.forEach(dim => {
			if (dim.average > 0) {
				weightedSum += dim.average * dim.weight;
				totalWeight += dim.weight;
			}
		});

		return totalWeight > 0 ? weightedSum / totalWeight : 0;
	}, [dimensionAverages]);

	// Calculate rating distribution for each dimension
	const ratingDistributions = React.useMemo(() => {
		return RATING_DIMENSIONS.map(dim => {
			const distribution = [5, 4, 3, 2, 1].map(rating => {
				const count = ratings.filter(r => r[dim.key] === rating).length;
				return {
					rating,
					count,
					percentage: ratings.length > 0 ? (count / ratings.length) * 100 : 0
				};
			});
			return { ...dim, distribution };
		});
	}, [ratings, RATING_DIMENSIONS]);

	// Render dimension card
	const renderDimensionCard = (dim: RatingDimensionWithStats) => {
		const Icon = dim.icon;

		return (
			<Card key={dim.key} className="h-full">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className={cn(
								"p-2 rounded-lg",
								dim.color === "blue" && "bg-blue-100",
								dim.color === "green" && "bg-green-100",
								dim.color === "purple" && "bg-purple-100",
								dim.color === "red" && "bg-red-100"
							)}>
								<Icon className={cn(
									"w-5 h-5",
									dim.color === "blue" && "text-blue-600",
									dim.color === "green" && "text-green-600",
									dim.color === "purple" && "text-purple-600",
									dim.color === "red" && "text-red-600"
								)} />
							</div>
							<div>
								<CardTitle className="text-base">{dim.label}</CardTitle>
								<p className="text-xs text-muted-foreground mt-1">{dim.description}</p>
							</div>
						</div>

						<div className="text-right">
							<div className="text-2xl font-bold text-primary">{dim.average.toFixed(1)}</div>
							<div className="text-xs text-muted-foreground">{dim.totalResponses} ocen</div>
						</div>
					</div>
				</CardHeader>

				<CardContent className="pt-0">
					<div className="space-y-3">
						{/* Progress bar */}
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Średnia ocena</span>
								<span>{dim.average.toFixed(1)}/5</span>
							</div>
							<Progress
								value={dim.percentage}
								className={cn(
									"h-3",
									"[&>div]:bg-gradient-to-r",
									dim.color === "blue" && "[&>div]:from-blue-400 [&>div]:to-blue-600",
									dim.color === "green" && "[&>div]:from-green-400 [&>div]:to-green-600",
									dim.color === "purple" && "[&>div]:from-purple-400 [&>div]:to-purple-600",
									dim.color === "red" && "[&>div]:from-red-400 [&>div]:to-red-600"
								)}
							/>
						</div>

						{/* Rating distribution */}
						<div className="space-y-1">
							{[5, 4, 3, 2, 1].map(rating => {
								const ratingData = dim.distribution?.find((d: { rating: number; count: number; percentage: number }) => d.rating === rating);
								return (
									<div key={rating} className="flex items-center gap-2 text-xs">
										<span className="w-6">{rating}★</span>
										<div className="flex-1 bg-gray-200 rounded-full h-1.5">
											<div
												className={cn(
													"h-1.5 rounded-full transition-all duration-300",
													dim.color === "blue" && "bg-blue-500",
													dim.color === "green" && "bg-green-500",
													dim.color === "purple" && "bg-purple-500",
													dim.color === "red" && "bg-red-500"
												)}
												style={{ width: `${ratingData?.percentage || 0}%` }}
											/>
										</div>
										<span className="w-8 text-right">{ratingData?.count || 0}</span>
									</div>
								);
							})}
						</div>
					</div>
				</CardContent>
			</Card>
		);
	};

	// Render overall score
	const renderOverallScore = () => (
		<Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Star className="w-6 h-6 text-primary" />
					Ocena ogólna (ważona)
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-center space-y-4">
					<div className="text-5xl font-bold text-primary">{overallScore.toFixed(1)}</div>
					<div className="flex items-center justify-center gap-1">
						{Array.from({ length: 5 }, (_, i) => (
							<Star
								key={i}
								className={cn(
									"w-6 h-6",
									i < Math.floor(overallScore)
										? "fill-yellow-400 text-yellow-400"
										: "text-gray-300"
								)}
							/>
						))}
					</div>
					<p className="text-sm text-muted-foreground">
						Obliczona na podstawie {ratings.length} opinii z wagami dla poszczególnych wymiarów
					</p>

					{/* Weight distribution */}
					<div className="space-y-2 pt-4 border-t">
						<h4 className="text-sm font-medium">Wagi wymiarów:</h4>
						{dimensionAverages.map(dim => (
							<div key={dim.key} className="flex items-center justify-between text-xs">
								<span>{dim.label}</span>
								<div className="flex items-center gap-2">
									<div className="w-16 bg-gray-200 rounded-full h-1.5">
										<div
											className="h-1.5 rounded-full bg-primary"
											style={{ width: `${dim.weight * 100}%` }}
										/>
									</div>
									<span className="w-8 text-right">{(dim.weight * 100).toFixed(0)}%</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);

	// Render comparison view
	const renderComparison = () => {
		if (!showComparison || ratings.length < 2) return null;

		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="w-5 h-5" />
						Porównanie wymiarów
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{dimensionAverages.map(dim => (
							<div key={dim.key} className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">{dim.label}</span>
									<span className="text-sm">{dim.average.toFixed(1)}/5</span>
								</div>
								<div className="relative">
									<div className="flex h-2 rounded-full overflow-hidden">
										<div
											className={cn(
												"transition-all duration-500",
												dim.color === "blue" && "bg-blue-500",
												dim.color === "green" && "bg-green-500",
												dim.color === "purple" && "bg-purple-500",
												dim.color === "red" && "bg-red-500"
											)}
											style={{ width: `${dim.percentage}%` }}
										/>
										<div className="flex-1 bg-gray-200" />
									</div>
									<div className="absolute -top-6 left-0 w-full flex justify-between text-xs text-muted-foreground">
										<span>0</span>
										<span>5</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	};

	// Render insights
	const renderInsights = () => {
		const insights = [
			{
				title: "Najlepiej oceniany wymiar",
				value: dimensionAverages.reduce((best, current) =>
					current.average > best.average ? current : best
				).label,
				icon: TrendingUp,
				color: "text-green-600"
			},
			{
				title: "Najwięcej odpowiedzi",
				value: dimensionAverages.reduce((most, current) =>
					current.totalResponses > most.totalResponses ? current : most
				).label,
				icon: Users,
				color: "text-blue-600"
			},
			{
				title: "Najniżej oceniany wymiar",
				value: dimensionAverages.reduce((worst, current) =>
					current.average < worst.average ? current : worst
				).label,
				icon: AlertTriangle,
				color: "text-red-600"
			},
		];

		return (
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{insights.map((insight, index) => {
					const Icon = insight.icon;
					return (
						<Card key={index}>
							<CardContent className="p-4 text-center space-y-2">
								<Icon className={cn("w-8 h-8 mx-auto", insight.color)} />
								<div className="text-sm text-muted-foreground">{insight.title}</div>
								<div className="font-semibold">{insight.value}</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		);
	};

	if (ratings.length === 0) {
		return (
			<Card className={cn("w-full", className)}>
				<CardContent className="py-8 text-center">
					<BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
					<p className="text-muted-foreground">
						Brak danych do wyświetlenia wielowymiarowych ocen
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className={cn("w-full space-y-6", className)}>
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="w-6 h-6 text-primary" />
						{title}
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Analiza {ratings.length} opinii z podziałem na wymiary oceny
					</p>
				</CardHeader>
			</Card>

			{/* Overall Score */}
			{renderOverallScore()}

			{/* Detailed Analysis */}
			<Tabs defaultValue="dimensions" className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="dimensions">Wymiary</TabsTrigger>
					<TabsTrigger value="comparison">Porównanie</TabsTrigger>
					<TabsTrigger value="insights">Analizy</TabsTrigger>
					<TabsTrigger value="distribution">Rozkład</TabsTrigger>
				</TabsList>

				<TabsContent value="dimensions" className="space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{dimensionAverages.map(renderDimensionCard)}
					</div>
				</TabsContent>

				<TabsContent value="comparison">
					{renderComparison()}
				</TabsContent>

				<TabsContent value="insights">
					<div className="space-y-6">
						{renderInsights()}

						<Card>
							<CardHeader>
								<CardTitle>Spostrzeżenia</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<Alert>
									<TrendingUp className="h-4 w-4" />
									<AlertDescription>
										<strong>Najważniejszy wymiar:</strong> Skuteczność ma największy wpływ na ogólną ocenę suplementu ({(RATING_DIMENSIONS[0]?.weight ? (RATING_DIMENSIONS[0].weight * 100).toFixed(0) : 0)}% wagi).
									</AlertDescription>
								</Alert>

								<Alert>
									<Users className="h-4 w-4" />
									<AlertDescription>
										<strong>Zaangażowanie użytkowników:</strong> {dimensionAverages[0]?.totalResponses || 0} użytkowników podzieliło się swoimi doświadczeniami w poszczególnych wymiarach.
									</AlertDescription>
								</Alert>

								{dimensionAverages.some((d: any) => d.average < 3) && (
									<Alert variant="destructive">
										<AlertTriangle className="h-4 w-4" />
										<AlertDescription>
											<strong>Obszary do poprawy:</strong> Niektóre wymiary wymagają uwagi - rozważ konsultację z użytkownikami w celu zebrania więcej informacji zwrotnych.
										</AlertDescription>
									</Alert>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="distribution">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{ratingDistributions.map((dim: any) => (
							<Card key={dim.key}>
								<CardHeader>
									<CardTitle className="text-base flex items-center gap-2">
										{dim.icon && <dim.icon className="w-4 h-4" />}
										{dim.label}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										{dim.distribution?.map(({ rating, count, percentage }: any) => (
											<div key={rating} className="flex items-center gap-3">
												<span className="text-sm w-8">{rating}★</span>
												<div className="flex-1 bg-gray-200 rounded-full h-2">
													<div
														className={cn(
															"h-2 rounded-full transition-all duration-300",
															dim.color === "blue" && "bg-blue-500",
															dim.color === "green" && "bg-green-500",
															dim.color === "purple" && "bg-purple-500",
															dim.color === "red" && "bg-red-500"
														)}
														style={{ width: `${percentage}%` }}
													/>
												</div>
												<span className="text-sm w-8 text-right">{count}</span>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}