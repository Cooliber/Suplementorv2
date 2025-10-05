/**
 * AI Recommendations Page for Protected Route
 * This page provides personalized supplement recommendations based on user profile
 */

"use client";

import { HealthProfileSetup } from "@/components/ai";
import { AIRecommendationInterface } from "@/components/recommendations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Activity,
	AlertTriangle,
	Award,
	BookOpen,
	Brain,
	CheckCircle,
	Clock,
	Heart,
	Star,
	Target,
	TrendingUp,
	User,
	XCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const AIRecommendationsPage = () => {
	const [activeTab, setActiveTab] = useState("recommendations");
	const [userProfile, setUserProfile] = useState<any>(null);
	const [recommendations, setRecommendations] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Mock recommendations data
	const mockRecommendations = [
		{
			id: "rec-1",
			supplement: {
				id: "alpha-gpc",
				name: "Alpha-GPC",
				polishName: "Alfa-GPC",
				category: "Nootropic",
				polishCategory: "Nootropik",
				description: "Choline supplement that crosses the blood-brain barrier",
				polishDescription:
					"Suplement choliny, który przechodzi barierę krew-mózg",
				evidenceLevel: "STRONG",
				polishEvidenceLevel: "Silne",
				mechanisms: ["Cholinergic enhancement"],
				polishMechanisms: ["Wzmacnianie cholinergiczne"],
			},
			reason:
				"Matches cognitive enhancement goals and has strong evidence for memory improvement",
			polishReason:
				"Odpowiada celom wzmacniania funkcji poznawczych i ma silne dowody na poprawę pamięci",
			confidence: 95,
			priority: "HIGH",
			polishPriority: "WYSOKI",
			timing: "Morning with breakfast",
			polishTiming: "Rano ze śniadaniem",
			dosage: "300-600mg daily",
			polishDosage: "300-600mg dziennie",
		},
		{
			id: "rec-2",
			supplement: {
				id: "lions-mane",
				name: "Lion's Mane",
				polishName: "Soplówka jeżowata",
				category: "Nootropic",
				polishCategory: "Nootropik",
				description:
					"Medicinal mushroom that supports nerve growth factor production",
				polishDescription:
					"Grzyb leczniczy wspierający produkcję czynnika wzrostu nerwów",
				evidenceLevel: "MODERATE",
				polishEvidenceLevel: "Umiarkowane",
				mechanisms: ["Neurogenesis support", "Neuroprotection"],
				polishMechanisms: ["Wsparcie neurogenezy", "Neuroprotekcja"],
			},
			reason:
				"Complements cognitive enhancement stack with neuroprotective properties",
			polishReason:
				"Uzupełnia zestaw wzmacniający funkcje poznawcze właściwościami neuroprotektorskimi",
			confidence: 87,
			priority: "MEDIUM",
			polishPriority: "ŚREDNI",
			timing: "Morning or afternoon",
			polishTiming: "Rano lub po południu",
			dosage: "750-1500mg daily",
			polishDosage: "750-1500mg dziennie",
		},
	];

	useEffect(() => {
		// Simulate loading data
		setTimeout(() => {
			setRecommendations(mockRecommendations);
			setIsLoading(false);
		}, 1500);
	}, []);

	const handleRecommendationGenerated = (rec: any) => {
		console.log("Recommendation generated:", rec);
		setRecommendations((prev) => [rec, ...prev]);
	};

	const handleRecommendationAccepted = (id: string) => {
		console.log("Recommendation accepted:", id);
		setRecommendations((prev) =>
			prev.map((rec) =>
				rec.id === id ? { ...rec, accepted: true, status: "IMPLEMENTED" } : rec,
			),
		);
	};

	const handleRecommendationRejected = (id: string) => {
		console.log("Recommendation rejected:", id);
		setRecommendations((prev) =>
			prev.map((rec) =>
				rec.id === id ? { ...rec, accepted: false, status: "REJECTED" } : rec,
			),
		);
	};

	const handleProfileUpdate = (profile: any) => {
		setUserProfile(profile);
		console.log("Profile updated:", profile);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="border-b bg-white">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Brain className="h-8 w-8 text-blue-600" />
							<h1 className="font-bold text-2xl text-gray-900">
								Rekomendacje AI
							</h1>
						</div>
						<div className="flex items-center gap-4">
							<Badge variant="outline" className="flex items-center gap-1">
								<Star className="h-4 w-4" />
								Pro
							</Badge>
							<Button variant="outline" size="sm">
								<User className="mr-2 h-4 w-4" />
								Profil
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h2 className="mb-2 font-bold text-3xl">
						Personalizowane rekomendacje
					</h2>
					<p className="text-gray-600">
						Niestandardowe rekomendacje suplementów oparte na Twoim profilu
						zdrowotnym i celach
					</p>
				</div>

				{/* Health Profile Setup */}
				<div className="mb-8">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<User className="h-5 w-5" />
								Profil zdrowotny
							</CardTitle>
						</CardHeader>
						<CardContent>
							<HealthProfileSetup
								onProfileUpdate={handleProfileUpdate}
								initialProfile={userProfile}
								onComplete={handleProfileUpdate}
							/>
						</CardContent>
					</Card>
				</div>

				{/* Recommendations Dashboard */}
				<div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="h-5 w-5" />
								Rekomendacje
							</CardTitle>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="flex h-64 items-center justify-center">
									<div className="h-8 w-8 animate-spin rounded-full border-blue-500 border-b-2" />
								</div>
							) : (
								<div className="space-y-4">
									{recommendations.map((rec) => (
										<Card
											key={rec.id}
											className="transition-shadow hover:shadow-md"
										>
											<CardContent className="p-4">
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<div className="mb-2 flex items-center gap-2">
															<h3 className="font-semibold">
																{rec.supplement.polishName}
															</h3>
															<Badge variant="outline">
																{rec.supplement.polishCategory}
															</Badge>
															<Badge
																className={
																	rec.priority === "HIGH"
																		? "bg-red-100 text-red-800"
																		: rec.priority === "MEDIUM"
																			? "bg-yellow-100 text-yellow-800"
																			: "bg-green-100 text-green-800"
																}
															>
																{rec.polishPriority}
															</Badge>
														</div>

														<p className="mb-2 text-gray-600 text-sm">
															{rec.supplement.polishDescription}
														</p>

														<div className="mb-3 flex items-center gap-4 text-gray-500 text-sm">
															<span className="flex items-center gap-1">
																<Activity className="h-4 w-4" />
																{rec.polishTiming}
															</span>
															<span className="flex items-center gap-1">
																<Target className="h-4 w-4" />
																{rec.polishDosage}
															</span>
															<span className="flex items-center gap-1">
																<Star className="h-4 w-4" />
																{rec.confidence}%
															</span>
														</div>

														<div className="mb-3">
															<p className="text-sm">
																<strong>Przyczyna:</strong> {rec.polishReason}
															</p>
														</div>

														<div className="flex items-center gap-2">
															<Progress
																value={rec.confidence}
																className="h-2"
															/>
															<span className="text-gray-500 text-xs">
																{rec.confidence}%
															</span>
														</div>
													</div>

													<div className="ml-4 flex flex-col gap-2">
														<Button
															size="sm"
															onClick={() =>
																handleRecommendationAccepted(rec.id)
															}
															className={
																rec.accepted
																	? "bg-green-600 hover:bg-green-700"
																	: ""
															}
														>
															{rec.accepted ? (
																<>
																	<CheckCircle className="mr-1 h-4 w-4" />
																	Zaakceptowano
																</>
															) : (
																<>
																	<CheckCircle className="mr-1 h-4 w-4" />
																	Akceptuj
																</>
															)}
														</Button>
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																handleRecommendationRejected(rec.id)
															}
														>
															<XCircle className="mr-1 h-4 w-4" />
															Odrzuć
														</Button>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Activity className="h-5 w-5" />
									Statystyki
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<span>Rekomendacje</span>
										<span className="font-medium">
											{recommendations.length}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span>Zaakceptowane</span>
										<span className="font-medium">
											{recommendations.filter((r) => r.accepted).length}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span>Wysoki priorytet</span>
										<span className="font-medium">
											{
												recommendations.filter((r) => r.priority === "HIGH")
													.length
											}
										</span>
									</div>
									<div className="pt-4">
										<Button className="w-full">
											<AlertTriangle className="mr-2 h-4 w-4" />
											Generuj nowe
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<BookOpen className="h-5 w-5" />
									Edukacja
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<p className="text-gray-600 text-sm">
										Dowiedz się więcej o suplementach i ich działaniu w oparciu
										o Twoje potrzeby.
									</p>
									<Button variant="outline" className="w-full">
										<TrendingUp className="mr-2 h-4 w-4" />
										Śledź efekty
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* AI Interface */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Brain className="h-5 w-5" />
							Interfejs AI
						</CardTitle>
					</CardHeader>
					<CardContent>
						<AIRecommendationInterface />
					</CardContent>
				</Card>
			</main>

			{/* Footer */}
			<footer className="mt-12 border-t bg-white">
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						<div className="flex items-center gap-2">
							<Brain className="h-5 w-5 text-blue-600" />
							<span className="font-medium">Suplementor</span>
							<span className="text-gray-500 text-sm">© 2025</span>
						</div>
						<div className="flex items-center gap-4 text-gray-600 text-sm">
							<span>Ochrona prywatności</span>
							<span>Regulamin</span>
							<span>Pomoc</span>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default AIRecommendationsPage;
