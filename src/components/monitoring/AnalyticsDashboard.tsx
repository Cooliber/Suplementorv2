"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMedicalAnalytics } from "@/lib/monitoring/medical-analytics";
import { usePerformanceMonitor } from "@/lib/monitoring/performance-monitor";
import { useUserBehaviorAnalytics } from "@/lib/monitoring/user-behavior-analytics";
import {
	Activity,
	AlertTriangle,
	BookOpen,
	Brain,
	CheckCircle,
	Clock,
	Database,
	Download,
	Eye,
	Globe,
	Info,
	Pill,
	RefreshCw,
	Search,
	Shield,
	TrendingDown,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardMetrics {
	performance: {
		webVitals: Record<string, number>;
		averageResponseTime: number;
		errorRate: number;
		uptime: number;
	};
	userBehavior: {
		activeUsers: number;
		sessionDuration: number;
		bounceRate: number;
		featureUsage: Record<string, number>;
	};
	medicalContent: {
		supplementInteractions: number;
		educationalEngagement: number;
		searchQueries: number;
		contentEffectiveness: number;
	};
	technical: {
		databaseQueries: number;
		apiCalls: number;
		memoryUsage: number;
		errorCount: number;
	};
}

export function AnalyticsDashboard() {
	const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
	const [autoRefresh, setAutoRefresh] = useState(true);

	const performanceMonitor = usePerformanceMonitor();
	const medicalAnalytics = useMedicalAnalytics();
	const userBehaviorAnalytics = useUserBehaviorAnalytics();

	useEffect(() => {
		fetchMetrics();

		let interval: NodeJS.Timeout;
		if (autoRefresh) {
			interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [autoRefresh]);

	const fetchMetrics = async () => {
		try {
			setIsLoading(true);

			// In a real implementation, this would fetch from your analytics API
			// For now, we'll simulate with mock data
			const mockMetrics: DashboardMetrics = {
				performance: {
					webVitals: {
						LCP: 2.1,
						FID: 95,
						CLS: 0.05,
						FCP: 1.8,
						TTFB: 180,
					},
					averageResponseTime: 245,
					errorRate: 0.02,
					uptime: 99.9,
				},
				userBehavior: {
					activeUsers: 127,
					sessionDuration: 8.5,
					bounceRate: 0.23,
					featureUsage: {
						brain_3d: 89,
						supplement_search: 156,
						stack_builder: 43,
						quiz: 67,
					},
				},
				medicalContent: {
					supplementInteractions: 234,
					educationalEngagement: 78,
					searchQueries: 189,
					contentEffectiveness: 85,
				},
				technical: {
					databaseQueries: 1250,
					apiCalls: 890,
					memoryUsage: 67,
					errorCount: 3,
				},
			};

			setMetrics(mockMetrics);
			setLastUpdated(new Date());
		} catch (error) {
			console.error("Failed to fetch metrics:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const exportMetrics = () => {
		if (!metrics) return;

		const dataStr = JSON.stringify(metrics, null, 2);
		const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

		const exportFileDefaultName = `suplementor-analytics-${new Date().toISOString().split("T")[0]}.json`;

		const linkElement = document.createElement("a");
		linkElement.setAttribute("href", dataUri);
		linkElement.setAttribute("download", exportFileDefaultName);
		linkElement.click();
	};

	if (isLoading && !metrics) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="flex items-center gap-2">
					<RefreshCw className="h-5 w-5 animate-spin" />
					<span>Ładowanie danych analitycznych...</span>
				</div>
			</div>
		);
	}

	if (!metrics) {
		return (
			<div className="p-8 text-center">
				<AlertTriangle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
				<p>Nie udało się załadować danych analitycznych</p>
				<Button onClick={fetchMetrics} className="mt-4">
					Spróbuj ponownie
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-bold text-2xl">Panel Analityczny</h2>
					<p className="text-muted-foreground">
						Ostatnia aktualizacja: {lastUpdated?.toLocaleString("pl-PL")}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setAutoRefresh(!autoRefresh)}
					>
						<RefreshCw
							className={`mr-2 h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`}
						/>
						{autoRefresh ? "Auto" : "Manualny"}
					</Button>
					<Button variant="outline" size="sm" onClick={fetchMetrics}>
						Odśwież
					</Button>
					<Button variant="outline" size="sm" onClick={exportMetrics}>
						<Download className="mr-2 h-4 w-4" />
						Eksportuj
					</Button>
				</div>
			</div>

			{/* Main Metrics Cards */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Aktywni Użytkownicy
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{metrics.userBehavior.activeUsers}
						</div>
						<p className="text-muted-foreground text-xs">
							<TrendingUp className="mr-1 inline h-3 w-3" />
							+12% od ostatniego tygodnia
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Średni Czas Sesji
						</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{metrics.userBehavior.sessionDuration}min
						</div>
						<p className="text-muted-foreground text-xs">
							<TrendingUp className="mr-1 inline h-3 w-3" />
							+8% od ostatniego tygodnia
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Interakcje z Suplementami
						</CardTitle>
						<Pill className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{metrics.medicalContent.supplementInteractions}
						</div>
						<p className="text-muted-foreground text-xs">
							<TrendingUp className="mr-1 inline h-3 w-3" />
							+23% od ostatniego tygodnia
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Skuteczność Treści
						</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{metrics.medicalContent.contentEffectiveness}%
						</div>
						<p className="text-muted-foreground text-xs">
							<CheckCircle className="mr-1 inline h-3 w-3 text-green-600" />
							Wysoka jakość treści edukacyjnych
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Detailed Analytics Tabs */}
			<Tabs defaultValue="performance" className="space-y-4">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="performance">Wydajność</TabsTrigger>
					<TabsTrigger value="behavior">Zachowanie Użytkowników</TabsTrigger>
					<TabsTrigger value="medical">Treści Medyczne</TabsTrigger>
					<TabsTrigger value="technical">Monitoring Techniczny</TabsTrigger>
				</TabsList>

				<TabsContent value="performance" className="space-y-4">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Zap className="h-5 w-5" />
									Core Web Vitals
								</CardTitle>
								<CardDescription>
									Metryki wydajności strony według Google
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{Object.entries(metrics.performance.webVitals).map(
									([key, value]) => (
										<div key={key} className="space-y-2">
											<div className="flex justify-between text-sm">
												<span>{key}</span>
												<span className="font-mono">
													{value}
													{key === "CLS" ? "" : "ms"}
												</span>
											</div>
											<Progress
												value={
													key === "CLS"
														? value * 100
														: Math.min((value / 4000) * 100, 100)
												}
												className="h-2"
											/>
											<div className="flex justify-between text-muted-foreground text-xs">
												<span>Dobry</span>
												<span>Potrzebuje poprawy</span>
											</div>
										</div>
									),
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Metryki Serwera</CardTitle>
								<CardDescription>Czas odpowiedzi i dostępność</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<span>Średni czas odpowiedzi</span>
									<Badge
										variant={
											metrics.performance.averageResponseTime < 500
												? "default"
												: "destructive"
										}
									>
										{metrics.performance.averageResponseTime}ms
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span>Współczynnik błędów</span>
									<Badge
										variant={
											metrics.performance.errorRate < 0.05
												? "default"
												: "destructive"
										}
									>
										{(metrics.performance.errorRate * 100).toFixed(2)}%
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span>Dostępność</span>
									<Badge
										variant={
											metrics.performance.uptime > 99
												? "default"
												: "destructive"
										}
									>
										{metrics.performance.uptime}%
									</Badge>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="behavior" className="space-y-4">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Użytkownicy i Sesje</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<span>Aktywni użytkownicy</span>
									<span className="font-bold text-2xl">
										{metrics.userBehavior.activeUsers}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Średni czas sesji</span>
									<span className="font-bold text-2xl">
										{metrics.userBehavior.sessionDuration}min
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Współczynnik odrzuceń</span>
									<Badge
										variant={
											metrics.userBehavior.bounceRate < 0.3
												? "default"
												: "destructive"
										}
									>
										{(metrics.userBehavior.bounceRate * 100).toFixed(1)}%
									</Badge>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Użytkowanie Funkcji</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{Object.entries(metrics.userBehavior.featureUsage).map(
									([feature, count]) => (
										<div
											key={feature}
											className="flex items-center justify-between"
										>
											<span className="capitalize">
												{feature.replace("_", " ")}
											</span>
											<Badge variant="outline">{count}</Badge>
										</div>
									),
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="medical" className="space-y-4">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Brain className="h-5 w-5" />
									Treści Edukacyjne
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<span>Interakcje z suplementami</span>
									<span className="font-bold text-2xl">
										{metrics.medicalContent.supplementInteractions}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Zaangażowanie edukacyjne</span>
									<span className="font-bold text-2xl">
										{metrics.medicalContent.educationalEngagement}%
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Wyszukiwania</span>
									<span className="font-bold text-2xl">
										{metrics.medicalContent.searchQueries}
									</span>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Skuteczność Treści</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span>Ogólna skuteczność</span>
										<Badge
											variant={
												metrics.medicalContent.contentEffectiveness > 80
													? "default"
													: "secondary"
											}
										>
											{metrics.medicalContent.contentEffectiveness}%
										</Badge>
									</div>
									<Progress
										value={metrics.medicalContent.contentEffectiveness}
										className="h-2"
									/>
									<p className="text-muted-foreground text-xs">
										Na podstawie czasu spędzonego i interakcji użytkowników
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="technical" className="space-y-4">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Database className="h-5 w-5" />
									Baza Danych
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<span>Zapytania (ostatnia godzina)</span>
									<span className="font-bold text-2xl">
										{metrics.technical.databaseQueries}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Wywołania API</span>
									<span className="font-bold text-2xl">
										{metrics.technical.apiCalls}
									</span>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Shield className="h-5 w-5" />
									Stan Systemu
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<span>Użycie pamięci</span>
									<Badge
										variant={
											metrics.technical.memoryUsage < 80
												? "default"
												: "destructive"
										}
									>
										{metrics.technical.memoryUsage}%
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span>Błędy</span>
									<Badge
										variant={
											metrics.technical.errorCount === 0
												? "default"
												: "destructive"
										}
									>
										{metrics.technical.errorCount}
									</Badge>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
