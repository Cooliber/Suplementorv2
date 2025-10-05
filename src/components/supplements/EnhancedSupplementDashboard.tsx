"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { allSupplementProfiles } from "@/data/supplements";
import {
	AlertTriangle,
	BarChart3,
	Brain,
	CheckCircle,
	Filter,
	Info,
	Network,
	Search,
	Star,
	TrendingUp,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import SupplementInteractionNetwork, {
	convertSupplementsToNetworkFormat,
	generateInteractionsFromSupplements,
} from "../visualization/SupplementInteractionNetwork";
import ComprehensiveSupplementCard from "./ComprehensiveSupplementCard";
import SupplementDetailPanel from "./SupplementDetailPanel";
import SupplementSelector from "./SupplementSelector";

export interface EnhancedSupplementDashboardProps {
	supplements?: any[];
	onSupplementSelect?: (supplement: any) => void;
	className?: string;
}

const EnhancedSupplementDashboard: React.FC<
	EnhancedSupplementDashboardProps
> = ({
	supplements = allSupplementProfiles,
	onSupplementSelect,
	className = "",
}) => {
	const [selectedSupplementIds, setSelectedSupplementIds] = useState<string[]>(
		[],
	);
	const [selectedSupplementForDetails, setSelectedSupplementForDetails] =
		useState<string | null>(null);
	const [activeTab, setActiveTab] = useState("browse");

	// Convert supplement data for visualization
	const networkSupplements = useMemo(
		() => convertSupplementsToNetworkFormat(supplements),
		[supplements],
	);

	const networkInteractions = useMemo(
		() => generateInteractionsFromSupplements(supplements),
		[supplements],
	);

	const selectedSupplements = useMemo(
		() => supplements.filter((s) => selectedSupplementIds.includes(s.id)),
		[selectedSupplementIds, supplements],
	);

	const handleSupplementSelect = (supplementId: string) => {
		setSelectedSupplementIds((prev) =>
			prev.includes(supplementId)
				? prev.filter((id) => id !== supplementId)
				: [...prev, supplementId],
		);
	};

	const handleViewDetails = (supplementId: string) => {
		setSelectedSupplementForDetails(supplementId);
	};

	const handleInteractionSelect = (interaction: any) => {
		console.log("Selected interaction:", interaction);
	};

	const getTotalMonthlyCost = () => {
		return selectedSupplements.reduce(
			(total, supplement) =>
				total + (supplement.economicData?.averageCostPerMonth?.average || 0),
			0,
		);
	};

	const getAverageEffectiveness = () => {
		if (selectedSupplements.length === 0) return 0;
		return (
			selectedSupplements.reduce(
				(total, supplement) =>
					total +
					supplement.clinicalApplications.reduce(
						(sum: number, app: any) => sum + (app.effectivenessRating || 0),
						0,
					) /
						supplement.clinicalApplications.length,
				0,
			) / selectedSupplements.length
		);
	};

	const getPotentialInteractions = () => {
		const interactions: any[] = [];
		selectedSupplements.forEach((supplement: any) => {
			supplement.interactions.forEach((interaction: any) => {
				const targetSupplement = selectedSupplements.find(
					(s) =>
						s.name === interaction.substance ||
						s.polishName === interaction.polishSubstance,
				);
				if (targetSupplement) {
					interactions.push({
						...interaction,
						sourceSupplement: supplement,
						targetSupplement,
					});
				}
			});
		});
		return interactions;
	};

	const selectedSupplement = selectedSupplementForDetails
		? allSupplementProfiles.find(
				(s) => s.id === selectedSupplementForDetails,
			) || null
		: null;

	return (
		<div className="w-full space-y-6">
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-6 w-6" />
						Zaawansowany System Suplementów
					</CardTitle>
					<p className="text-muted-foreground">
						Kompleksowe narzędzie do analizy i doboru suplementów z pełną bazą
						danych naukowych
					</p>
				</CardHeader>
			</Card>

			{/* Main Dashboard */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="browse">Przeglądaj</TabsTrigger>
					<TabsTrigger value="selected">
						Wybrane ({selectedSupplementIds.length})
					</TabsTrigger>
					<TabsTrigger value="interactions">Interakcje</TabsTrigger>
					<TabsTrigger value="analysis">Analiza</TabsTrigger>
				</TabsList>

				{/* Browse Tab */}
				<TabsContent value="browse" className="space-y-6">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
						<div className="lg:col-span-1">
							<SupplementSelector
								onSelect={handleSupplementSelect}
								selectedSupplement={selectedSupplementIds[0] || ""}
								showAdvancedFilters={true}
							/>
						</div>

						<div className="lg:col-span-2">
							<div className="grid grid-cols-1 gap-4">
								{allSupplementProfiles.slice(0, 3).map((supplement: any) => (
									<div key={supplement.id} className="relative">
										<ComprehensiveSupplementCard
											supplement={supplement as any}
											onAddToStack={(id: string) => handleSupplementSelect(id)}
											onViewInteractions={(id: string) => handleViewDetails(id)}
										/>
										<div className="absolute top-4 right-4">
											{selectedSupplementIds.includes(supplement.id) && (
												<Badge className="bg-green-100 text-green-800">
													<CheckCircle className="mr-1 h-3 w-3" />
													Wybrany
												</Badge>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</TabsContent>

				{/* Selected Supplements Tab */}
				<TabsContent value="selected" className="space-y-6">
					{selectedSupplements.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<Search className="mb-4 h-12 w-12 text-gray-400" />
								<h3 className="mb-2 font-medium text-gray-900 text-lg">
									Brak wybranych suplementów
								</h3>
								<p className="mb-4 text-center text-gray-600">
									Wybierz suplementy z zakładki "Przeglądaj", aby zobaczyć je
									tutaj.
								</p>
								<Button onClick={() => setActiveTab("browse")}>
									Przeglądaj suplementy
								</Button>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-6">
							{/* Summary Stats */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
								<Card>
									<CardContent className="p-4">
										<div className="flex items-center gap-2">
											<Star className="h-5 w-5 text-yellow-500" />
											<div>
												<p className="text-gray-600 text-sm">
													Średnia skuteczność
												</p>
												<p className="font-bold text-2xl">
													{getAverageEffectiveness().toFixed(1)}/10
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardContent className="p-4">
										<div className="flex items-center gap-2">
											<TrendingUp className="h-5 w-5 text-green-500" />
											<div>
												<p className="text-gray-600 text-sm">
													Miesięczny koszt
												</p>
												<p className="font-bold text-2xl">
													{getTotalMonthlyCost().toFixed(0)}€
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardContent className="p-4">
										<div className="flex items-center gap-2">
											<Network className="h-5 w-5 text-blue-500" />
											<div>
												<p className="text-gray-600 text-sm">Interakcje</p>
												<p className="font-bold text-2xl">
													{getPotentialInteractions().length}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardContent className="p-4">
										<div className="flex items-center gap-2">
											<BarChart3 className="h-5 w-5 text-purple-500" />
											<div>
												<p className="text-gray-600 text-sm">Wybrane</p>
												<p className="font-bold text-2xl">
													{selectedSupplements.length}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Selected Supplements Grid */}
							<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
								{selectedSupplements.map((supplement) => (
									<div key={supplement.id} className="relative">
										<ComprehensiveSupplementCard
											supplement={supplement}
											showFullDetails={false}
											onViewInteractions={(id) => handleViewDetails(id)}
										/>
										<Button
											variant="outline"
											size="sm"
											className="absolute top-4 right-4"
											onClick={() => handleSupplementSelect(supplement.id)}
										>
											Usuń
										</Button>
									</div>
								))}
							</div>

							{/* Potential Interactions Alert */}
							{getPotentialInteractions().length > 0 && (
								<Alert>
									<AlertTriangle className="h-4 w-4" />
									<AlertDescription>
										<strong>Uwaga:</strong> Wykryto{" "}
										{getPotentialInteractions().length} potencjalnych interakcji
										między wybranymi suplementami. Sprawdź zakładkę "Interakcje"
										dla szczegółów.
									</AlertDescription>
								</Alert>
							)}
						</div>
					)}
				</TabsContent>

				{/* Interactions Tab */}
				<TabsContent value="interactions" className="space-y-6">
					<SupplementInteractionNetwork
						supplements={networkSupplements.filter((s) =>
							selectedSupplementIds.includes(s.id),
						)}
						interactions={networkInteractions.filter(
							(i) =>
								selectedSupplementIds.includes(i.sourceId) &&
								selectedSupplementIds.includes(i.targetId),
						)}
						selectedSupplementIds={selectedSupplementIds}
						onSupplementSelect={handleSupplementSelect}
						onInteractionSelect={handleInteractionSelect}
					/>
				</TabsContent>

				{/* Analysis Tab */}
				<TabsContent value="analysis" className="space-y-6">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Analiza wybranych suplementów</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<h4 className="mb-2 font-medium">Siła dowodów</h4>
									<div className="space-y-2">
										{selectedSupplements.map((supplement) => (
											<div
												key={supplement.id}
												className="flex items-center justify-between"
											>
												<span className="text-sm">{supplement.polishName}</span>
												<Badge
													variant={
														supplement.evidenceLevel === "STRONG"
															? "default"
															: supplement.evidenceLevel === "MODERATE"
																? "secondary"
																: "outline"
													}
												>
													{supplement.evidenceLevel}
												</Badge>
											</div>
										))}
									</div>
								</div>

								<div>
									<h4 className="mb-2 font-medium">Efektywność kosztowa</h4>
									<div className="space-y-2">
										{selectedSupplements.map((supplement) => (
											<div
												key={supplement.id}
												className="flex items-center justify-between"
											>
												<span className="text-sm">{supplement.polishName}</span>
												<Badge
													variant={
														supplement.economicData.costEffectivenessRating ===
														"Excellent"
															? "default"
															: supplement.economicData
																		.costEffectivenessRating === "Good"
																? "secondary"
																: "outline"
													}
												>
													{
														supplement.economicData
															.polishCostEffectivenessRating
													}
												</Badge>
											</div>
										))}
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Rekomendacje</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<Alert>
									<CheckCircle className="h-4 w-4" />
									<AlertDescription>
										Dobrze dobrany zestaw! Średnia skuteczność{" "}
										{getAverageEffectiveness().toFixed(1)}/10 przy koszcie{" "}
										{getTotalMonthlyCost().toFixed(0)}€ miesięcznie.
									</AlertDescription>
								</Alert>

								{getPotentialInteractions().length > 0 && (
									<Alert>
										<AlertTriangle className="h-4 w-4" />
										<AlertDescription>
											Rozważ konsultację z lekarzem przed łączeniem tych
											suplementów ze względu na wykryte interakcje.
										</AlertDescription>
									</Alert>
								)}

								<div className="pt-4">
									<Button
										variant="outline"
										className="w-full"
										onClick={() => setActiveTab("interactions")}
									>
										<Network className="mr-2 h-4 w-4" />
										Szczegółowa analiza interakcji
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>

			{/* Detail Panel Modal */}
			{selectedSupplement && (
				<SupplementDetailPanel
					supplement={selectedSupplement as any}
					isOpen={!!selectedSupplement}
					onClose={() => setSelectedSupplementForDetails(null)}
				/>
			)}
		</div>
	);
};

export default EnhancedSupplementDashboard;
