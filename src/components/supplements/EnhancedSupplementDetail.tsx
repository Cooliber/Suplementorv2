"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { EvidenceLevel, SupplementCategory } from "@/types/supplement";
import {
	AlertTriangle,
	BookOpen,
	Brain,
	Calculator,
	CheckCircle,
	Clock,
	ExternalLink,
	Heart,
	Info,
	Shield,
	Star,
	TrendingUp,
	Zap,
} from "lucide-react";
import { useState } from "react";

interface EnhancedSupplementDetailProps {
	id: string;
	name: string;
	polishName: string;
	category: SupplementCategory;
	polishCategory: string;
	description: string;
	polishDescription: string;
	evidenceLevel: EvidenceLevel;
	safetyRating: number;
	userRating: number;
	primaryBenefits: string[];
	polishPrimaryBenefits: string[];
	mechanismOfAction: string;
	polishMechanismOfAction: string;
	studyCount: number;
	activeCompounds?: string[];
	sideEffects?: string[];
	contraindications?: string[];
	interactions?: string[];
	brainRegions?: string[];
	dosageGuidelines?: {
		therapeuticRange: {
			min: number;
			max: number;
			unit: string;
		};
		timing: string[];
		withFood: boolean;
	};
	researchStudies?: any[];
	price?: {
		min: number;
		max: number;
		currency: string;
	};
	onFavoriteClick?: (id: string) => void;
	onDosageCalculate?: (id: string) => void;
	onSafetyCheck?: (id: string) => void;
	onInteractionCheck?: (id: string) => void;
}

const evidenceLevelConfig = {
	STRONG: {
		color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
		label: "Silne dowody",
		icon: Star,
		progressColor: "bg-green-500",
	},
	MODERATE: {
		color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
		label: "Umiarkowane dowody",
		icon: TrendingUp,
		progressColor: "bg-blue-500",
	},
	WEAK: {
		color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
		label: "Słabe dowody",
		icon: Info,
		progressColor: "bg-yellow-500",
	},
	INSUFFICIENT: {
		color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
		label: "Niewystarczające",
		icon: Info,
		progressColor: "bg-gray-500",
	},
	CONFLICTING: {
		color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
		label: "Sprzeczne",
		icon: Info,
		progressColor: "bg-red-500",
	},
};

const categoryIcons: Record<SupplementCategory, React.ComponentType<any>> = {
	NOOTROPIC: Brain,
	VITAMIN: Heart,
	MINERAL: Shield,
	AMINO_ACID: Zap,
	HERB: TrendingUp,
	ADAPTOGEN: Shield,
	COENZYME: Zap,
	FATTY_ACID: Heart,
	PROBIOTIC: Shield,
	ENZYME: Zap,
	OTHER: Info,
};

export function EnhancedSupplementDetail({
	id,
	name,
	polishName,
	category,
	polishCategory,
	description,
	polishDescription,
	evidenceLevel,
	safetyRating,
	userRating,
	primaryBenefits,
	polishPrimaryBenefits,
	mechanismOfAction,
	polishMechanismOfAction,
	studyCount,
	activeCompounds,
	sideEffects,
	contraindications,
	interactions,
	brainRegions,
	dosageGuidelines,
	researchStudies,
	price,
	onFavoriteClick,
	onDosageCalculate,
	onSafetyCheck,
	onInteractionCheck,
}: EnhancedSupplementDetailProps) {
	const [isFavorited, setIsFavorited] = useState(false);
	const [activeTab, setActiveTab] = useState("overview");

	const EvidenceIcon = evidenceLevelConfig[evidenceLevel].icon;
	const CategoryIcon = categoryIcons[category];

	const handleFavoriteClick = () => {
		setIsFavorited(!isFavorited);
		onFavoriteClick?.(id);
	};

	const getSafetyColor = (rating: number) => {
		if (rating >= 8) return "text-green-600";
		if (rating >= 6) return "text-yellow-600";
		return "text-red-600";
	};

	const getSafetyLabel = (rating: number) => {
		if (rating >= 8) return "Bardzo bezpieczny";
		if (rating >= 6) return "Bezpieczny";
		return "Wymaga ostrożności";
	};

	const getEvidenceProgress = (level: EvidenceLevel) => {
		const progressMap = {
			STRONG: 100,
			MODERATE: 75,
			WEAK: 50,
			INSUFFICIENT: 25,
			CONFLICTING: 30,
		};
		return progressMap[level];
	};

	return (
		<TooltipProvider>
			<div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-green-50/50">
				<div className="container mx-auto space-y-8 px-4 py-8">
					{/* Enhanced Header Section */}
					<div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-8">
						<div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row">
							<div className="flex-1">
								<div className="mb-4 flex flex-wrap items-center gap-3">
									<div className="flex items-center gap-2">
										<CategoryIcon className="h-6 w-6 text-primary" />
										<Badge variant="secondary" className="text-sm">
											{polishCategory}
										</Badge>
									</div>

									<Tooltip>
										<TooltipTrigger asChild>
											<Badge
												variant="secondary"
												className={`${evidenceLevelConfig[evidenceLevel].color} text-sm`}
											>
												<EvidenceIcon className="h-4 w-4 mr-1" />
												{evidenceLevelConfig[evidenceLevel].label}
											</Badge>
										</TooltipTrigger>
										<TooltipContent>
											<p>Poziom dowodów naukowych</p>
										</TooltipContent>
									</Tooltip>

									<div className="flex items-center gap-1">
										<Star className="h-4 w-4 fill-current text-yellow-500" />
										<span className="font-medium text-sm">
											{userRating}
										</span>
									</div>
								</div>

								<h1 className="mb-3 font-bold text-4xl text-gray-900">
									{polishName}
								</h1>
								<p className="mb-4 text-gray-600 text-lg leading-relaxed">
									{polishDescription}
								</p>

								<div className="mb-6 flex flex-wrap gap-2">
									{polishPrimaryBenefits.map((benefit, index) => (
										<Badge key={index} variant="outline" className="text-sm">
											{benefit}
										</Badge>
									))}
								</div>

								{/* Quick Stats */}
								<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
									<div className="flex items-center gap-2">
										<BookOpen className="h-5 w-5 text-muted-foreground" />
										<div>
											<div className="font-semibold">{studyCount}</div>
											<div className="text-xs text-muted-foreground">badań</div>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Shield className={`h-5 w-5 ${getSafetyColor(safetyRating)}`} />
										<div>
											<div className={`font-semibold ${getSafetyColor(safetyRating)}`}>
												{safetyRating}/10
											</div>
											<div className="text-xs text-muted-foreground">
												{getSafetyLabel(safetyRating)}
											</div>
										</div>
									</div>

									{price && (
										<div className="flex items-center gap-2">
											<span className="text-lg font-semibold text-primary">
												{price.min}-{price.max} {price.currency}
											</span>
										</div>
									)}

									<div className="flex items-center gap-2">
										<Progress
											value={getEvidenceProgress(evidenceLevel)}
											className="h-2 flex-1"
										/>
										<span className="text-xs text-muted-foreground">
											{Math.round(getEvidenceProgress(evidenceLevel))}%
										</span>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col gap-3 lg:flex-row">
								<Button
									className="gap-2"
									onClick={handleFavoriteClick}
									variant={isFavorited ? "default" : "outline"}
								>
									<Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
									{isFavorited ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
								</Button>

								<div className="flex gap-2">
									<Button variant="outline" className="gap-2" onClick={() => onDosageCalculate?.(id)}>
										<Calculator className="h-4 w-4" />
										Kalkulator dawki
									</Button>

									<Button variant="outline" className="gap-2" onClick={() => onSafetyCheck?.(id)}>
										<Shield className="h-4 w-4" />
										Sprawdź bezpieczeństwo
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Safety Alert */}
					{safetyRating < 7 && (
						<Alert className="border-yellow-200 bg-yellow-50">
							<AlertTriangle className="h-4 w-4 text-yellow-600" />
							<AlertDescription className="text-yellow-800">
								Ten suplement wymaga szczególnej ostrożności. Skonsultuj się z
								lekarzem przed rozpoczęciem suplementacji.
							</AlertDescription>
						</Alert>
					)}

					{/* Main Content Tabs */}
					<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
						<TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
							<TabsTrigger value="overview">Przegląd</TabsTrigger>
							<TabsTrigger value="mechanism">Mechanizm</TabsTrigger>
							<TabsTrigger value="dosage">Dawkowanie</TabsTrigger>
							<TabsTrigger value="safety">Bezpieczeństwo</TabsTrigger>
							<TabsTrigger value="research">Badania</TabsTrigger>
							<TabsTrigger value="interactions">Interakcje</TabsTrigger>
						</TabsList>

						{/* Overview Tab */}
						<TabsContent value="overview" className="space-y-6">
							<div className="grid gap-6 lg:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Info className="h-5 w-5 text-blue-500" />
											Informacje ogólne
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div>
											<h4 className="mb-2 font-medium">Nazwa naukowa</h4>
											<p className="text-muted-foreground">{name}</p>
										</div>

										{activeCompounds && activeCompounds.length > 0 && (
											<div>
												<h4 className="mb-2 font-medium">Składniki aktywne</h4>
												<div className="flex flex-wrap gap-1">
													{activeCompounds.map((compound, index) => (
														<Badge key={index} variant="outline" className="text-xs">
															{compound}
														</Badge>
													))}
												</div>
											</div>
										)}

										{brainRegions && brainRegions.length > 0 && (
											<div>
												<h4 className="mb-2 font-medium">Wpływ na obszary mózgu</h4>
												<div className="flex flex-wrap gap-1">
													{brainRegions.map((region, index) => (
														<Badge key={index} variant="outline" className="text-xs">
															{region}
														</Badge>
													))}
												</div>
											</div>
										)}
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<CheckCircle className="h-5 w-5 text-green-500" />
											Korzyści
										</CardTitle>
									</CardHeader>
									<CardContent>
										<ul className="space-y-2">
											{polishPrimaryBenefits.map((benefit, index) => (
												<li key={index} className="flex items-center gap-2">
													<div className="h-2 w-2 rounded-full bg-green-500" />
													<span className="text-sm">{benefit}</span>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						{/* Mechanism Tab */}
						<TabsContent value="mechanism" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Zap className="h-5 w-5 text-yellow-500" />
										Mechanizm działania
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="prose max-w-none">
										<p className="text-gray-700 leading-relaxed">
											{polishMechanismOfAction}
										</p>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Dosage Tab */}
						<TabsContent value="dosage" className="space-y-6">
							{dosageGuidelines && (
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Calculator className="h-5 w-5 text-blue-500" />
											Zalecane dawkowanie
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid gap-4 md:grid-cols-2">
											<div>
												<h4 className="mb-2 font-medium">Zakres terapeutyczny</h4>
												<p className="text-lg font-semibold text-primary">
													{dosageGuidelines.therapeuticRange.min} - {dosageGuidelines.therapeuticRange.max} {dosageGuidelines.therapeuticRange.unit}
												</p>
											</div>

											<div>
												<h4 className="mb-2 font-medium">Czas przyjmowania</h4>
												<div className="flex flex-wrap gap-1">
													{dosageGuidelines.timing.map((time, index) => (
														<Badge key={index} variant="outline">
															{time}
														</Badge>
													))}
												</div>
											</div>
										</div>

										<Separator />

										<div>
											<h4 className="mb-2 font-medium">Zalecenia</h4>
											<div className="flex items-center gap-2 text-sm">
												{dosageGuidelines.withFood ? (
													<>
														<CheckCircle className="h-4 w-4 text-green-500" />
														<span>Najlepiej przyjmować z posiłkiem</span>
													</>
												) : (
													<>
														<Clock className="h-4 w-4 text-blue-500" />
														<span>Może być przyjmowany na czczo</span>
													</>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							)}
						</TabsContent>

						{/* Safety Tab */}
						<TabsContent value="safety" className="space-y-6">
							<div className="grid gap-6 lg:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<AlertTriangle className="h-5 w-5 text-orange-500" />
											Działania niepożądane
										</CardTitle>
									</CardHeader>
									<CardContent>
										{sideEffects && sideEffects.length > 0 ? (
											<ul className="space-y-2">
												{sideEffects.map((effect, index) => (
													<li key={index} className="flex items-center gap-2 text-sm">
														<div className="h-2 w-2 rounded-full bg-orange-400" />
														{effect}
													</li>
												))}
											</ul>
										) : (
											<p className="text-muted-foreground">Brak zgłoszonych działań niepożądanych</p>
										)}
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Shield className="h-5 w-5 text-red-500" />
											Przeciwwskazania
										</CardTitle>
									</CardHeader>
									<CardContent>
										{contraindications && contraindications.length > 0 ? (
											<ul className="space-y-2">
												{contraindications.map((contraindication, index) => (
													<li key={index} className="flex items-center gap-2 text-sm">
														<div className="h-2 w-2 rounded-full bg-red-400" />
														{contraindication}
													</li>
												))}
											</ul>
										) : (
											<p className="text-muted-foreground">Brak przeciwwskazań</p>
										)}
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						{/* Research Tab */}
						<TabsContent value="research" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<BookOpen className="h-5 w-5 text-purple-500" />
										Badania naukowe
									</CardTitle>
									<CardDescription>
										Znaleziono {studyCount} badań dotyczących tego suplementu
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="text-center py-8">
										<p className="text-muted-foreground">
											Szczegółowe informacje o badaniach naukowych będą dostępne wkrótce.
										</p>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Interactions Tab */}
						<TabsContent value="interactions" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<ExternalLink className="h-5 w-5 text-indigo-500" />
										Interakcje z innymi substancjami
									</CardTitle>
								</CardHeader>
								<CardContent>
									{interactions && interactions.length > 0 ? (
										<div className="space-y-2">
											{interactions.map((interaction, index) => (
												<div key={index} className="flex items-center gap-2 text-sm">
													<div className="h-2 w-2 rounded-full bg-indigo-400" />
													{interaction}
												</div>
											))}
										</div>
									) : (
										<p className="text-muted-foreground">Brak zgłoszonych interakcji</p>
									)}
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</TooltipProvider>
	);
}