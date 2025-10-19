"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedCellularVisualization } from "@/components/visualization";
import { Award, BookOpen, Info, Microscope } from "lucide-react";
import React, { useState } from "react";

export default function CellularVisualizationPage() {
	const [currentProgress, setCurrentProgress] = useState(0);
	const [interactions, setInteractions] = useState<string[]>([]);

	const handleProgress = (progress: number) => {
		setCurrentProgress(progress);
	};

	const handleInteraction = (interaction: string) => {
		setInteractions((prev) => [...prev.slice(-9), interaction]); // Keep last 10 interactions
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="mx-auto max-w-7xl space-y-6">
				{/* Header */}
				<div className="space-y-4 text-center">
					<h1 className="flex items-center justify-center gap-3 font-bold text-4xl text-gray-900">
						<Microscope className="h-10 w-10 text-blue-600" />
						Zaawansowana Wizualizacja Komórkowa
					</h1>
					<p className="mx-auto max-w-3xl text-gray-600 text-xl">
						Odkryj fascynujący świat procesów biologicznych na poziomie
						molekularnym. Interaktywne symulacje pozwolą Ci zrozumieć, jak
						suplementy wpływają na Twój organizm.
					</p>

					<div className="flex flex-wrap justify-center gap-2">
						<Badge variant="secondary" className="bg-blue-100 text-blue-800">
							<Award className="mr-1 h-3 w-3" />
							Edukacyjne
						</Badge>
						<Badge variant="secondary" className="bg-green-100 text-green-800">
							Interaktywne
						</Badge>
						<Badge
							variant="secondary"
							className="bg-purple-100 text-purple-800"
						>
							Naukowe
						</Badge>
						<Badge
							variant="secondary"
							className="bg-orange-100 text-orange-800"
						>
							W języku polskim
						</Badge>
					</div>
				</div>

				{/* Main visualization */}
				<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
					{/* Visualization component */}
					<div className="xl:col-span-2">
						<AdvancedCellularVisualization
							visualizationType="cellular"
							autoPlay={true}
							showControls={true}
							showEducationalContent={true}
							onProgress={handleProgress}
							onInteraction={handleInteraction}
							className="shadow-2xl"
						/>
					</div>

					{/* Side panel */}
					<div className="space-y-4">
						{/* Progress indicator */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Info className="h-5 w-5" />
									Postęp nauki
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div>
										<div className="mb-1 flex justify-between text-sm">
											<span>Postęp symulacji</span>
											<span>{Math.round(currentProgress * 100)}%</span>
										</div>
										<div className="h-2 w-full rounded-full bg-gray-200">
											<div
												className="h-2 rounded-full bg-blue-600 transition-all duration-300"
												style={{ width: `${currentProgress * 100}%` }}
											/>
										</div>
									</div>

									<div className="text-gray-600 text-sm">
										<p>
											Obejrzano kroków: <strong>{interactions.length}</strong>
										</p>
										<p>
											Ostatnia interakcja:{" "}
											<strong>
												{interactions[interactions.length - 1] || "Brak"}
											</strong>
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Recent interactions */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Ostatnie interakcje</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="max-h-48 space-y-2 overflow-y-auto">
									{interactions.length === 0 ? (
										<p className="py-4 text-center text-gray-500 text-sm">
											Brak interakcji - rozpocznij eksplorację!
										</p>
									) : (
										interactions.map((interaction, index) => (
											<div
												key={index}
												className="rounded bg-gray-50 p-2 text-sm"
											>
												{interaction}
											</div>
										))
									)}
								</div>
							</CardContent>
						</Card>

						{/* Educational info */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<BookOpen className="h-5 w-5" />
									Informacje edukacyjne
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="space-y-2 text-sm">
									<div className="rounded-lg bg-blue-50 p-3">
										<h4 className="font-semibold text-blue-900">
											Procesy komórkowe
										</h4>
										<p className="mt-1 text-blue-700 text-xs">
											Odkryj, jak mitochondria produkują energię ATP i jak
											suplementy wpływają na ten proces.
										</p>
									</div>

									<div className="rounded-lg bg-green-50 p-3">
										<h4 className="font-semibold text-green-900">
											Interakcje molekularne
										</h4>
										<p className="mt-1 text-green-700 text-xs">
											Zobacz, jak cząsteczki suplementów wiążą się z receptorami
											w błonie komórkowej.
										</p>
									</div>

									<div className="rounded-lg bg-purple-50 p-3">
										<h4 className="font-semibold text-purple-900">
											Procesy fizjologiczne
										</h4>
										<p className="mt-1 text-purple-700 text-xs">
											Poznaj wymianę gazową w płucach i krążenie krwi w
											organizmie.
										</p>
									</div>
								</div>

								<div className="border-t pt-3 text-gray-500 text-xs">
									<p>
										💡 <strong>Wskazówka:</strong> Użyj myszki, aby obracać i
										powiększać wizualizację. Kliknij przycisk play, aby
										uruchomić symulację.
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Feature showcase */}
				<Card>
					<CardHeader>
						<CardTitle>Funkcje wizualizacji</CardTitle>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="features" className="w-full">
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="features">Funkcje</TabsTrigger>
								<TabsTrigger value="supplements">Suplementy</TabsTrigger>
								<TabsTrigger value="education">Edukacja</TabsTrigger>
								<TabsTrigger value="technical">Techniczne</TabsTrigger>
							</TabsList>

							<TabsContent value="features" className="space-y-4">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div className="rounded-lg border p-4">
										<h4 className="mb-2 font-semibold">
											🔬 Symulacje fizyczne
										</h4>
										<p className="text-gray-600 text-sm">
											Realistyczne symulacje fizyczne z dynamiką płynów SPH,
											elektrostatyką i ruchem Browna.
										</p>
									</div>

									<div className="rounded-lg border p-4">
										<h4 className="mb-2 font-semibold">
											🧬 Procesy biologiczne
										</h4>
										<p className="text-gray-600 text-sm">
											Wizualizacja procesów takich jak synteza ATP, transkrypcja
											DNA i transport jonów.
										</p>
									</div>

									<div className="rounded-lg border p-4">
										<h4 className="mb-2 font-semibold">🎯 Interaktywność</h4>
										<p className="text-gray-600 text-sm">
											Możliwość manipulacji cząsteczkami i obserwacji wpływu
											suplementów w czasie rzeczywistym.
										</p>
									</div>

									<div className="rounded-lg border p-4">
										<h4 className="mb-2 font-semibold">
											📱 Optymalizacja mobilna
										</h4>
										<p className="text-gray-600 text-sm">
											Adaptacyjna jakość renderowania dostosowana do możliwości
											urządzenia.
										</p>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="supplements" className="space-y-4">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
									<div className="rounded-lg border p-4 text-center">
										<h4 className="mb-2 font-semibold">💊 Kreatyna</h4>
										<p className="text-gray-600 text-sm">
											Transport kreatyny do komórek mięśniowych i wpływ na
											syntezę fosfokreatyny.
										</p>
									</div>

									<div className="rounded-lg border p-4 text-center">
										<h4 className="mb-2 font-semibold">🧠 L-teanina</h4>
										<p className="text-gray-600 text-sm">
											Modulacja receptorów GABA i wpływ na neuroprzekaźniki w
											mózgu.
										</p>
									</div>

									<div className="rounded-lg border p-4 text-center">
										<h4 className="mb-2 font-semibold">❤️ Koenzym Q10</h4>
										<p className="text-gray-600 text-sm">
											Transport do mitochondriów i udział w łańcuchu transportu
											elektronów.
										</p>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="education" className="space-y-4">
								<div className="space-y-4">
									<div className="rounded-lg bg-blue-50 p-4">
										<h4 className="mb-2 font-semibold text-blue-900">
											🎓 Edukacja w języku polskim
										</h4>
										<p className="text-blue-700 text-sm">
											Wszystkie adnotacje, opisy i wyjaśnienia są dostępne w
											języku polskim, z uwzględnieniem polskiej terminologii
											naukowej i kontekstu kulturowego.
										</p>
									</div>

									<div className="rounded-lg bg-green-50 p-4">
										<h4 className="mb-2 font-semibold text-green-900">
											🧠 Interaktywne quizy
										</h4>
										<p className="text-green-700 text-sm">
											Testuj swoją wiedzę za pomocą interaktywnych quizów z
											natychmiastową informacją zwrotną.
										</p>
									</div>

									<div className="rounded-lg bg-purple-50 p-4">
										<h4 className="mb-2 font-semibold text-purple-900">
											📚 Adnotacje edukacyjne
										</h4>
										<p className="text-purple-700 text-sm">
											Szczegółowe wyjaśnienia procesów biologicznych pojawiają
											się podczas symulacji.
										</p>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="technical" className="space-y-4">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div className="rounded-lg border p-4">
										<h4 className="mb-2 font-semibold">⚡ GPU-akceleracja</h4>
										<p className="text-gray-600 text-sm">
											Renderowanie tysięcy cząsteczek w czasie rzeczywistym przy
											użyciu WebGL i shaderów.
										</p>
									</div>

									<div className="rounded-lg border p-4">
										<h4 className="mb-2 font-semibold">
											🔬 Dokładność naukowa
										</h4>
										<p className="text-gray-600 text-sm">
											Parametry fizyczne oparte na rzeczywistych wartościach
											biologicznych i chemicznych.
										</p>
									</div>

									<div className="rounded-lg border p-4">
										<h4 className="mb-2 font-semibold">
											🎛️ Kontrola wydajności
										</h4>
										<p className="text-gray-600 text-sm">
											Adaptacyjna jakość renderowania w zależności od możliwości
											urządzenia.
										</p>
									</div>

									<div className="rounded-lg border p-4">
										<h4 className="mb-2 font-semibold">
											💾 Optymalizacja pamięci
										</h4>
										<p className="text-gray-600 text-sm">
											Efektywne zarządzanie pamięcią i pooling cząsteczek dla
											płynnej animacji.
										</p>
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="py-8 text-center text-gray-500 text-sm">
					<p>
						Zaawansowana wizualizacja komórkowa | Suplementor v2.0 | Rozszerzona
						rzeczywistość biologiczna w języku polskim
					</p>
				</div>
			</div>
		</div>
	);
}
