"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlertTriangle,
	Baby,
	Heart,
	Info,
	Pill,
	Shield,
	Stethoscope,
	TriangleAlert,
	Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

import type { ComprehensiveSupplementProfile } from "@/data/comprehensive-supplements/types";

interface SafetyInformationDisplayProps {
	supplement: ComprehensiveSupplementProfile;
	showTitle?: boolean;
	compact?: boolean;
	className?: string;
}

export const SafetyInformationDisplay: React.FC<
	SafetyInformationDisplayProps
> = ({ supplement, showTitle = true, compact = false, className = "" }) => {
	const [activeTab, setActiveTab] = useState("overview");

	const getPregnancyBadgeVariant = (category: string) => {
		switch (category) {
			case "A":
				return "default";
			case "B":
				return "secondary";
			case "C":
			case "D":
			case "X":
				return "destructive";
			default:
				return "outline";
		}
	};

	const getBreastfeedingBadgeVariant = (safety: string) => {
		return safety === "Safe"
			? "default"
			: safety === "Caution"
				? "secondary"
				: "destructive";
	};

	const getPediatricBadgeVariant = (approved: boolean) => {
		return approved ? "default" : "secondary";
	};

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case "severe":
				return "text-red-600 bg-red-50 border-red-200";
			case "moderate":
				return "text-orange-600 bg-orange-50 border-orange-200";
			case "minor":
				return "text-yellow-600 bg-yellow-50 border-yellow-200";
			case "beneficial":
				return "text-green-600 bg-green-50 border-green-200";
			default:
				return "text-gray-600 bg-gray-50 border-gray-200";
		}
	};

	const getInteractionIcon = (type: string) => {
		switch (type) {
			case "synergistic":
				return <Heart className="h-4 w-4 text-green-600" />;
			case "antagonistic":
				return <AlertTriangle className="h-4 w-4 text-red-600" />;
			case "additive":
				return <Pill className="h-4 w-4 text-blue-600" />;
			case "competitive":
				return <TriangleAlert className="h-4 w-4 text-orange-600" />;
			default:
				return <Info className="h-4 w-4 text-gray-600" />;
		}
	};

	if (compact) {
		return (
			<Card className={className}>
				{showTitle && (
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-lg">
							<Shield className="h-5 w-5" />
							Bezpieczeństwo
						</CardTitle>
					</CardHeader>
				)}
				<CardContent className="space-y-4">
					{/* Quick Safety Overview */}
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="flex items-center gap-1">
									<Baby className="h-4 w-4" />
									Ciąża:
								</span>
								<Badge
									variant={getPregnancyBadgeVariant(
										supplement.safetyProfile.pregnancyCategory,
									)}
								>
									Kategoria {supplement.safetyProfile.pregnancyCategory}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="flex items-center gap-1">
									<Users className="h-4 w-4" />
									Karmienie:
								</span>
								<Badge
									variant={getBreastfeedingBadgeVariant(
										supplement.safetyProfile.breastfeedingSafety,
									)}
								>
									{supplement.safetyProfile.breastfeedingSafety === "Safe"
										? "Bezpieczne"
										: "Ostrożność"}
								</Badge>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="flex items-center gap-1">
									<Stethoscope className="h-4 w-4" />
									Dzieci:
								</span>
								<Badge
									variant={getPediatricBadgeVariant(
										supplement.safetyProfile.pediatricUse.approved,
									)}
								>
									{supplement.safetyProfile.pediatricUse.approved
										? "Zatwierdzone"
										: "Niezatwierdzone"}
								</Badge>
							</div>
							{supplement.sideEffects.length > 0 && (
								<div className="flex items-center justify-between">
									<span>Efekty uboczne:</span>
									<span className="font-medium">
										{supplement.sideEffects.length}
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Key Warnings */}
					{supplement.dosageGuidelines.contraindications.length > 0 && (
						<Alert variant="destructive">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription>
								<strong>Przeciwwskazania:</strong>{" "}
								{supplement.dosageGuidelines.polishContraindications.join(", ")}
							</AlertDescription>
						</Alert>
					)}

					{/* Critical Interactions */}
					{supplement.interactions.filter((i) => i.severity === "severe")
						.length > 0 && (
						<Alert variant="destructive">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription>
								<strong>Poważne interakcje:</strong>{" "}
								{supplement.interactions
									.filter((i) => i.severity === "severe")
									.map((i) => i.polishSubstance || i.substance)
									.join(", ")}
							</AlertDescription>
						</Alert>
					)}
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={className}>
			{showTitle && (
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-lg">
						<Shield className="h-5 w-5" />
						Profil bezpieczeństwa
					</CardTitle>
				</CardHeader>
			)}
			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="overview">Przegląd</TabsTrigger>
						<TabsTrigger value="contraindications">
							Przeciwwskazania
						</TabsTrigger>
						<TabsTrigger value="interactions">Interakcje</TabsTrigger>
						<TabsTrigger value="populations">Populacje</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-4">
						{/* Population Safety */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-3">
								<h4 className="flex items-center gap-2 font-medium">
									<Users className="h-4 w-4" />
									Populacje specjalne
								</h4>
								<div className="space-y-2 text-sm">
									<div className="flex items-center justify-between">
										<span className="flex items-center gap-2">
											<Baby className="h-4 w-4" />
											Ciąża:
										</span>
										<Badge
											variant={getPregnancyBadgeVariant(
												supplement.safetyProfile.pregnancyCategory,
											)}
										>
											Kategoria {supplement.safetyProfile.pregnancyCategory}
										</Badge>
									</div>
									<div className="flex items-center justify-between">
										<span className="flex items-center gap-2">
											<Users className="h-4 w-4" />
											Karmienie piersią:
										</span>
										<Badge
											variant={getBreastfeedingBadgeVariant(
												supplement.safetyProfile.breastfeedingSafety,
											)}
										>
											{supplement.safetyProfile.breastfeedingSafety === "Safe"
												? "Bezpieczne"
												: "Ostrożność"}
										</Badge>
									</div>
									<div className="flex items-center justify-between">
										<span className="flex items-center gap-2">
											<Stethoscope className="h-4 w-4" />
											Dzieci:
										</span>
										<Badge
											variant={getPediatricBadgeVariant(
												supplement.safetyProfile.pediatricUse.approved,
											)}
										>
											{supplement.safetyProfile.pediatricUse.approved
												? "Zatwierdzone"
												: "Niezatwierdzone"}
											{supplement.safetyProfile.pediatricUse.ageLimit &&
												` (${supplement.safetyProfile.pediatricUse.ageLimit})`}
										</Badge>
									</div>
								</div>
							</div>

							<div className="space-y-3">
								<h4 className="font-medium">Statystyki bezpieczeństwa</h4>
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div className="rounded-lg border p-3 text-center">
										<div className="font-bold text-blue-600 text-lg">
											{supplement.sideEffects.length}
										</div>
										<div className="text-gray-600">Efekty uboczne</div>
									</div>
									<div className="rounded-lg border p-3 text-center">
										<div className="font-bold text-lg text-orange-600">
											{supplement.interactions.length}
										</div>
										<div className="text-gray-600">Interakcje</div>
									</div>
								</div>
							</div>
						</div>

						<Separator />

						{/* Common Side Effects */}
						{supplement.sideEffects.length > 0 && (
							<div>
								<h4 className="mb-3 font-medium">Najczęstsze efekty uboczne</h4>
								<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
									{supplement.sideEffects.slice(0, 4).map((effect, index) => (
										<div
											key={index}
											className="flex items-center justify-between rounded-lg border p-3 text-sm"
										>
											<div>
												<div className="font-medium">{effect.polishEffect}</div>
												<div className="text-gray-600 text-xs">
													{effect.frequency} •{" "}
													{effect.severity === "mild"
														? "łagodny"
														: effect.severity === "moderate"
															? "umiarkowany"
															: "ciężki"}
												</div>
											</div>
											{effect.reversible && (
												<Badge variant="outline" className="text-xs">
													odwracalny
												</Badge>
											)}
										</div>
									))}
								</div>
							</div>
						)}
					</TabsContent>

					{/* Contraindications Tab */}
					<TabsContent value="contraindications" className="space-y-4">
						{supplement.dosageGuidelines.contraindications.length > 0 ? (
							<div className="space-y-3">
								<h4 className="flex items-center gap-2 font-medium">
									<AlertTriangle className="h-4 w-4 text-red-600" />
									Bezwzględne przeciwwskazania
								</h4>
								<div className="space-y-2">
									{supplement.dosageGuidelines.polishContraindications.map(
										(contraindication, index) => (
											<Alert key={index} variant="destructive">
												<AlertTriangle className="h-4 w-4" />
												<AlertDescription>{contraindication}</AlertDescription>
											</Alert>
										),
									)}
								</div>
							</div>
						) : (
							<div className="py-8 text-center text-gray-500">
								<Shield className="mx-auto mb-3 h-12 w-12 opacity-50" />
								<p>Brak zgłoszonych przeciwwskazań</p>
							</div>
						)}
					</TabsContent>

					{/* Interactions Tab */}
					<TabsContent value="interactions" className="space-y-4">
						{supplement.interactions.length > 0 ? (
							<div className="space-y-3">
								<h4 className="font-medium">
									Interakcje z innymi substancjami
								</h4>
								<div className="space-y-3">
									{supplement.interactions.map((interaction, index) => (
										<div
											key={index}
											className={`rounded-lg border p-4 ${getSeverityColor(interaction.severity)}`}
										>
											<div className="flex items-start gap-3">
												{getInteractionIcon(interaction.type)}
												<div className="flex-1">
													<div className="mb-1 flex items-center gap-2">
														<span className="font-medium">
															{interaction.polishSubstance ||
																interaction.substance}
														</span>
														<Badge variant="outline" className="text-xs">
															{interaction.type}
														</Badge>
														<Badge
															variant={
																interaction.severity === "severe"
																	? "destructive"
																	: "secondary"
															}
															className="text-xs"
														>
															{interaction.severity}
														</Badge>
													</div>
													<p className="mb-2 text-sm">
														{interaction.polishDescription ||
															interaction.description}
													</p>
													{interaction.polishClinicalSignificance && (
														<p className="text-gray-600 text-xs">
															<strong>Znaczenie kliniczne:</strong>{" "}
															{interaction.polishClinicalSignificance}
														</p>
													)}
													{interaction.polishRecommendation && (
														<p className="mt-1 text-blue-600 text-xs">
															<strong>Rekomendacja:</strong>{" "}
															{interaction.polishRecommendation}
														</p>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						) : (
							<div className="py-8 text-center text-gray-500">
								<Pill className="mx-auto mb-3 h-12 w-12 opacity-50" />
								<p>Brak zgłoszonych interakcji</p>
							</div>
						)}
					</TabsContent>

					{/* Special Populations Tab */}
					<TabsContent value="populations" className="space-y-4">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							{/* Elderly */}
							{supplement.safetyProfile.elderlyConsiderations.length > 0 && (
								<div className="space-y-3">
									<h4 className="flex items-center gap-2 font-medium">
										<Users className="h-4 w-4" />
										Osoby starsze
									</h4>
									<div className="space-y-2">
										{supplement.safetyProfile.polishElderlyConsiderations.map(
											(consideration, index) => (
												<div
													key={index}
													className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3"
												>
													<Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
													<span className="text-sm">{consideration}</span>
												</div>
											),
										)}
									</div>
								</div>
							)}

							{/* Pediatric */}
							{supplement.safetyProfile.pediatricUse.specialConsiderations
								.length > 0 && (
								<div className="space-y-3">
									<h4 className="flex items-center gap-2 font-medium">
										<Stethoscope className="h-4 w-4" />
										Dzieci i młodzież
									</h4>
									<div className="space-y-2">
										{supplement.safetyProfile.pediatricUse.polishSpecialConsiderations.map(
											(consideration, index) => (
												<div
													key={index}
													className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3"
												>
													<Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
													<span className="text-sm">{consideration}</span>
												</div>
											),
										)}
									</div>
								</div>
							)}

							{/* Hepatic */}
							{supplement.safetyProfile.hepaticImpairment &&
								supplement.safetyProfile.hepaticImpairment !== "No data" && (
									<div className="space-y-3">
										<h4 className="flex items-center gap-2 font-medium">
											<Heart className="h-4 w-4" />
											Zaburzenia wątroby
										</h4>
										<Alert>
											<Info className="h-4 w-4" />
											<AlertDescription>
												{supplement.safetyProfile.polishHepaticImpairment}
											</AlertDescription>
										</Alert>
									</div>
								)}

							{/* Renal */}
							{supplement.safetyProfile.renalImpairment &&
								supplement.safetyProfile.renalImpairment !== "No data" && (
									<div className="space-y-3">
										<h4 className="flex items-center gap-2 font-medium">
											<Stethoscope className="h-4 w-4" />
											Zaburzenia nerek
										</h4>
										<Alert>
											<Info className="h-4 w-4" />
											<AlertDescription>
												{supplement.safetyProfile.polishRenalImpairment}
											</AlertDescription>
										</Alert>
									</div>
								)}
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};

export default SafetyInformationDisplay;
