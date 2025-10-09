"use client";

import * as React from "react";
import { BarChart3, TrendingUp, Users, Award, AlertTriangle, CheckCircle, Star, Calendar, Filter } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ReviewStats, SupplementReviewSummary } from "@/types/review";

interface ReviewStatsProps {
	stats: ReviewStats;
	summary?: SupplementReviewSummary;
	totalReviews: number;
	averageRating: number;
	className?: string;
}

export function ReviewStats({
	stats,
	summary,
	totalReviews,
	averageRating,
	className,
}: ReviewStatsProps) {
	const [timeRange, setTimeRange] = React.useState("30d");
	const [activeTab, setActiveTab] = React.useState("overview");

	// Calculate rating distribution percentages
	const ratingDistribution = React.useMemo(() => {
		return [5, 4, 3, 2, 1].map(rating => ({
			rating,
			count: stats.distribution[rating as keyof typeof stats.distribution],
			percentage: totalReviews > 0 ? (stats.distribution[rating as keyof typeof stats.distribution] / totalReviews) * 100 : 0
		}));
	}, [stats, totalReviews]);

	// Calculate review quality metrics
	const qualityMetrics = React.useMemo(() => {
		const verifiedPercentage = summary?.verifiedPercentage || 0;
		const recommendationRate = summary?.recommendationRate || 0;
		const avgHelpfulVotes = totalReviews > 0 ? (stats.total * 0.3) : 0; // Mock calculation

		return {
			verifiedPercentage,
			recommendationRate,
			avgHelpfulVotes,
			avgReviewLength: 150, // Mock data
			responseRate: 85, // Mock data
		};
	}, [summary, stats, totalReviews]);

	// Render rating distribution chart
	const renderRatingDistribution = () => {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">Rozkład ocen</h3>
					<Badge variant="outline">{totalReviews} opinii</Badge>
				</div>

				<div className="space-y-3">
					{ratingDistribution.map(({ rating, count, percentage }) => (
						<div key={rating} className="flex items-center gap-4">
							<div className="flex items-center gap-2 min-w-[4rem]">
								<span className="text-sm font-medium">{rating}</span>
								<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
							</div>
							<div className="flex-1">
								<Progress value={percentage} className="h-3" />
							</div>
							<div className="flex items-center gap-2 min-w-[4rem] text-right">
								<span className="text-sm font-medium">{count}</span>
								<span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	// Render quality metrics
	const renderQualityMetrics = () => {
		const metrics = [
			{
				label: "Opinie zweryfikowane",
				value: `${qualityMetrics.verifiedPercentage.toFixed(1)}%`,
				icon: CheckCircle,
				color: "text-green-600",
				description: "Użytkownicy potwierdzili zakup"
			},
			{
				label: "Rekomendacje",
				value: `${qualityMetrics.recommendationRate.toFixed(1)}%`,
				icon: Award,
				color: "text-blue-600",
				description: "4-5 gwiazdek"
			},
			{
				label: "Średnia długość opinii",
				value: `${qualityMetrics.avgReviewLength} znaków`,
				icon: BarChart3,
				color: "text-purple-600",
				description: "Więcej szczegółów = lepsza jakość"
			},
			{
				label: "Odpowiedzi na pytania",
				value: `${qualityMetrics.responseRate}%`,
				icon: Users,
				color: "text-orange-600",
				description: "Autorzy odpowiadają na komentarze"
			},
		];

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{metrics.map((metric, index) => {
					const Icon = metric.icon;
					return (
						<div key={index} className="p-4 border rounded-lg space-y-2">
							<div className="flex items-center gap-2">
								<Icon className={cn("w-5 h-5", metric.color)} />
								<span className="font-medium">{metric.label}</span>
							</div>
							<div className="text-2xl font-bold text-primary">{metric.value}</div>
							<p className="text-xs text-muted-foreground">{metric.description}</p>
						</div>
					);
				})}
			</div>
		);
	};

	// Render trends over time (mock data)
	const renderTrends = () => {
		const trends = [
			{ period: "Ostatni tydzień", reviews: 12, avgRating: 4.2 },
			{ period: "Ostatni miesiąc", reviews: 45, avgRating: 4.1 },
			{ period: "Ostatnie 3 miesiące", reviews: 128, avgRating: 4.0 },
			{ period: "Ostatni rok", reviews: 456, avgRating: 3.9 },
		];

		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">Trendy w czasie</h3>
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger className="w-48">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="7d">Ostatni tydzień</SelectItem>
							<SelectItem value="30d">Ostatni miesiąc</SelectItem>
							<SelectItem value="90d">Ostatnie 3 miesiące</SelectItem>
							<SelectItem value="1y">Ostatni rok</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-3">
					{trends.map((trend, index) => (
						<div key={index} className="flex items-center justify-between p-3 border rounded-lg">
							<div className="flex items-center gap-3">
								<Calendar className="w-4 h-4 text-muted-foreground" />
								<span className="font-medium">{trend.period}</span>
							</div>
							<div className="flex items-center gap-4">
								<div className="text-center">
									<div className="text-lg font-bold">{trend.reviews}</div>
									<div className="text-xs text-muted-foreground">opinii</div>
								</div>
								<div className="text-center">
									<div className="text-lg font-bold flex items-center gap-1">
										{trend.avgRating}
										<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
									</div>
									<div className="text-xs text-muted-foreground">średnia</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	// Render top insights
	const renderInsights = () => {
		const insights = [
			{
				type: "positive",
				title: "Najczęściej wymieniane zalety",
				items: summary?.topPros || ["Skuteczność", "Łatwość stosowania", "Dobra cena"],
				icon: TrendingUp,
				color: "text-green-600"
			},
			{
				type: "negative",
				title: "Najczęściej wymieniane wady",
				items: summary?.topCons || ["Cena", "Dostępność", "Smak"],
				icon: AlertTriangle,
				color: "text-red-600"
			},
		];

		return (
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{insights.map((insight, index) => {
					const Icon = insight.icon;
					return (
						<div key={index} className="space-y-4">
							<div className="flex items-center gap-2">
								<Icon className={cn("w-5 h-5", insight.color)} />
								<h3 className="text-lg font-semibold">{insight.title}</h3>
							</div>

							<div className="space-y-2">
								{insight.items.map((item, itemIndex) => (
									<div key={itemIndex} className="flex items-center gap-2 p-2 border rounded">
										<div className={cn(
											"w-2 h-2 rounded-full",
											insight.type === "positive" ? "bg-green-500" : "bg-red-500"
										)} />
										<span className="text-sm">{item}</span>
									</div>
								))}
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div className={cn("w-full space-y-6", className)}>
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="w-6 h-6 text-primary" />
						Analiza opinii i ocen
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Overall Rating */}
						<div className="text-center space-y-2">
							<div className="text-4xl font-bold text-primary">{averageRating.toFixed(1)}</div>
							<div className="flex items-center justify-center gap-1">
								{Array.from({ length: 5 }, (_, i) => (
									<Star
										key={i}
										className={cn(
											"w-5 h-5",
											i < Math.floor(averageRating)
												? "fill-yellow-400 text-yellow-400"
												: "text-gray-300"
										)}
									/>
								))}
							</div>
							<div className="text-sm text-muted-foreground">Średnia ocena</div>
						</div>

						{/* Total Reviews */}
						<div className="text-center space-y-2">
							<div className="text-4xl font-bold text-primary">{totalReviews}</div>
							<div className="text-sm text-muted-foreground">Łącznie opinii</div>
						</div>

						{/* Verified Reviews */}
						<div className="text-center space-y-2">
							<div className="text-4xl font-bold text-green-600">
								{qualityMetrics.verifiedPercentage.toFixed(0)}%
							</div>
							<div className="text-sm text-muted-foreground">Zweryfikowanych</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Detailed Analytics */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="overview">Przegląd</TabsTrigger>
					<TabsTrigger value="distribution">Rozkład</TabsTrigger>
					<TabsTrigger value="trends">Trendy</TabsTrigger>
					<TabsTrigger value="insights">Analizy</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Jakość opinii</CardTitle>
							</CardHeader>
							<CardContent>
								{renderQualityMetrics()}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Najważniejsze spostrzeżenia</CardTitle>
							</CardHeader>
							<CardContent>
								{renderInsights()}
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="distribution">
					<Card>
						<CardHeader>
							<CardTitle>Rozkład ocen</CardTitle>
						</CardHeader>
						<CardContent>
							{renderRatingDistribution()}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="trends">
					<Card>
						<CardHeader>
							<CardTitle>Trendy w czasie</CardTitle>
						</CardHeader>
						<CardContent>
							{renderTrends()}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="insights">
					<Card>
						<CardHeader>
							<CardTitle>Szczegółowe analizy</CardTitle>
						</CardHeader>
						<CardContent>
							{renderInsights()}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}