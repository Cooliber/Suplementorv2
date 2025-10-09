"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	AlertTriangle,
	Calculator,
	Clock,
	Info,
	Shield,
	ShieldCheck,
	TrendingUp,
	Users,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart as RechartsBarChart,
	CartesianGrid,
	Cell,
	Line,
	LineChart as RechartsLineChart,
	Pie,
	PieChart as RechartsPieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface SafetyData {
	supplementId: string;
	name: string;
	polishName: string;
	category: string;

	// Dosage information
	recommendedDose: {
		min: number;
		max: number;
		unit: string;
	};
	safeUpperLimit?: number;
	toxicityThreshold?: number;

	// Safety profile
	sideEffects: {
		effect: string;
		polishEffect: string;
		frequency: "common" | "uncommon" | "rare" | "very_rare";
		severity: "mild" | "moderate" | "severe";
		dosageDependent: boolean;
	}[];
	interactions: {
		substance: string;
		polishSubstance: string;
		severity: "severe" | "moderate" | "minor";
		type: "contraindication" | "caution" | "monitor";
	}[];
	contraindications: string[];

	// Risk assessment
	overallRisk: "low" | "medium" | "high";
	hepaticRisk: boolean;
	renalRisk: boolean;
	cardiacRisk: boolean;

	// Population considerations
	safeForPregnancy: boolean;
	safeForChildren: boolean;
	safeForElderly: boolean;
}

interface DosageSafetyVisualizationProps {
	data: SafetyData[];
	selectedSupplement?: string;
	onSupplementChange?: (supplementId: string) => void;
	className?: string;
}

const DosageSafetyVisualization: React.FC<DosageSafetyVisualizationProps> = ({
	data,
	selectedSupplement,
	onSupplementChange,
	className = "",
}) => {
	const [activeTab, setActiveTab] = useState("calculator");
	const [userWeight, setUserWeight] = useState<number>(70);
	const [userAge, setUserAge] = useState<number>(30);
	const [userCondition, setUserCondition] = useState<string>("healthy");
	const [dosageInput, setDosageInput] = useState<number>(0);

	// Color schemes
	const riskColors = {
		low: "#10B981",
		medium: "#F59E0B",
		high: "#EF4444",
	};

	const frequencyColors = {
		common: "#EF4444",
		uncommon: "#F97316",
		rare: "#F59E0B",
		very_rare: "#10B981",
	};

	const severityColors = {
		mild: "#10B981",
		moderate: "#F59E0B",
		severe: "#EF4444",
	};

	const getRiskColor = (risk: string) => {
		return riskColors[risk as keyof typeof riskColors] || "#6B7280";
	};

	const getFrequencyColor = (frequency: string) => {
		return frequencyColors[frequency as keyof typeof frequencyColors] || "#6B7280";
	};

	const getSeverityColor = (severity: string) => {
		return severityColors[severity as keyof typeof severityColors] || "#6B7280";
	};

	const getCategoryText = (category: string) => {
		const categories: Record<string, string> = {
			NOOTROPIC: "Nootropiki",
			VITAMIN: "Witaminy",
			MINERAL: "Minerały",
			FATTY_ACID: "Kwasy tłuszczowe",
			AMINO_ACID: "Aminokwasy",
			HERB: "Zioła",
			PROBIOTIC: "Probiotyki",
			ENZYME: "Enzymy",
		};
		return categories[category] || category;
	};

	// Get current supplement data
	const currentSupplement = useMemo(() => {
		if (selectedSupplement) {
			return data.find(item => item.supplementId === selectedSupplement);
		}
		return data[0];
	}, [data, selectedSupplement]);

	// Calculate dosage recommendation
	const dosageCalculation = useMemo(() => {
		if (!currentSupplement) return null;

		const baseDose = (currentSupplement.recommendedDose.min + currentSupplement.recommendedDose.max) / 2;
		let adjustedDose = baseDose;

		// Weight-based adjustment (simplified)
		if (userWeight < 60) adjustedDose *= 0.8;
		else if (userWeight > 90) adjustedDose *= 1.2;

		// Age-based adjustment
		if (userAge < 18) adjustedDose *= 0.7;
		else if (userAge > 65) adjustedDose *= 0.9;

		// Condition-based adjustment
		if (userCondition === "liver-disease") adjustedDose *= 0.6;
		else if (userCondition === "kidney-disease") adjustedDose *= 0.7;

		return {
			recommended: Math.round(adjustedDose * 100) / 100,
			min: Math.round(currentSupplement.recommendedDose.min * 100) / 100,
			max: Math.round(currentSupplement.recommendedDose.max * 100) / 100,
			unit: currentSupplement.recommendedDose.unit,
		};
	}, [currentSupplement, userWeight, userAge, userCondition]);

	// Prepare side effects data
	const sideEffectsData = useMemo(() => {
		if (!currentSupplement) return [];

		return currentSupplement.sideEffects.map(effect => ({
			effect: effect.polishEffect,
			frequency: effect.frequency,
			severity: effect.severity,
			dosageDependent: effect.dosageDependent,
			color: getFrequencyColor(effect.frequency),
		}));
	}, [currentSupplement]);

	// Prepare risk profile data
	const riskProfileData = useMemo(() => {
		if (!currentSupplement) return [];

		return [
			{ category: "Ryzyko ogólne", value: currentSupplement.overallRisk === "low" ? 25 : currentSupplement.overallRisk === "medium" ? 50 : 75, color: getRiskColor(currentSupplement.overallRisk) },
			{ category: "Ryzyko wątrobowe", value: currentSupplement.hepaticRisk ? 60 : 20, color: currentSupplement.hepaticRisk ? "#EF4444" : "#10B981" },
			{ category: "Ryzyko nerkowe", value: currentSupplement.renalRisk ? 60 : 20, color: currentSupplement.renalRisk ? "#EF4444" : "#10B981" },
			{ category: "Ryzyko sercowe", value: currentSupplement.cardiacRisk ? 60 : 20, color: currentSupplement.cardiacRisk ? "#EF4444" : "#10B981" },
		];
	}, [currentSupplement]);

	// Custom tooltip
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="rounded-lg border bg-white p-3 shadow-lg">
					<p className="mb-2 font-medium text-sm">{label}</p>
					<p className="text-xs">
						<span style={{ color: payload[0].color }}>Wartość:</span> {payload[0].value}%
					</p>
				</div>
			);
		}
		return null;
	};

	if (!currentSupplement) {
		return (
			<Card className={cn("w-full", className)}>
				<CardContent className="flex items-center justify-center py-12">
					<p className="text-gray-600">Brak danych o suplemencie</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Calculator className="h-5 w-5" />
						Kalkulator dawkowania i bezpieczeństwo
					</CardTitle>
					<Select value={selectedSupplement || currentSupplement.supplementId} onValueChange={onSupplementChange}>
						<SelectTrigger className="w-64">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{data.map(supplement => (
								<SelectItem key={supplement.supplementId} value={supplement.supplementId}>
									{supplement.polishName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</CardHeader>

			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="calculator" className="text-xs">
							<Calculator className="mr-1 h-3 w-3" />
							Kalkulator
						</TabsTrigger>
						<TabsTrigger value="safety" className="text-xs">
							<Shield className="mr-1 h-3 w-3" />
							Bezpieczeństwo
						</TabsTrigger>
						<TabsTrigger value="effects" className="text-xs">
							<AlertTriangle className="mr-1 h-3 w-3" />
							Skutki uboczne
						</TabsTrigger>
						<TabsTrigger value="interactions" className="text-xs">
							<Info className="mr-1 h-3 w-3" />
							Interakcje
						</TabsTrigger>
					</TabsList>

					<TabsContent value="calculator" className="mt-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{/* User Parameters */}
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Parametry użytkownika</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<Label htmlFor="weight">Masa ciała (kg)</Label>
										<Input
											id="weight"
											type="number"
											value={userWeight}
											onChange={(e) => setUserWeight(Number(e.target.value))}
											min="30"
											max="200"
										/>
									</div>
									<div>
										<Label htmlFor="age">Wiek</Label>
										<Input
											id="age"
											type="number"
											value={userAge}
											onChange={(e) => setUserAge(Number(e.target.value))}
											min="1"
											max="120"
										/>
									</div>
									<div>
										<Label htmlFor="condition">Stan zdrowia</Label>
										<Select value={userCondition} onValueChange={setUserCondition}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="healthy">Zdrowy</SelectItem>
												<SelectItem value="liver-disease">Choroba wątroby</SelectItem>
												<SelectItem value="kidney-disease">Choroba nerek</SelectItem>
												<SelectItem value="heart-disease">Choroba serca</SelectItem>
												<SelectItem value="pregnant">Ciąża</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</CardContent>
							</Card>

							{/* Dosage Calculation Results */}
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Zalecana dawka</CardTitle>
								</CardHeader>
								<CardContent>
									{dosageCalculation && (
										<div className="space-y-4">
											<div className="text-center">
												<p className="text-3xl font-bold text-blue-600">
													{dosageCalculation.recommended} {dosageCalculation.unit}
												</p>
												<p className="text-gray-600 text-sm">dziennie</p>
											</div>

											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span>Zakres:</span>
													<span>{dosageCalculation.min} - {dosageCalculation.max} {dosageCalculation.unit}</span>
												</div>
												<Progress
													value={((dosageCalculation.recommended - dosageCalculation.min) / (dosageCalculation.max - dosageCalculation.min)) * 100}
													className="h-2"
												/>
											</div>

											{currentSupplement.safeUpperLimit && (
												<div className="rounded-lg bg-yellow-50 p-3">
													<p className="text-yellow-800 text-sm">
														<strong>Bezpieczny górny limit:</strong> {currentSupplement.safeUpperLimit} {currentSupplement.recommendedDose.unit}
													</p>
												</div>
											)}

											{currentSupplement.toxicityThreshold && (
												<div className="rounded-lg bg-red-50 p-3">
													<p className="text-red-800 text-sm">
														<strong>Próg toksyczności:</strong> {currentSupplement.toxicityThreshold} {currentSupplement.recommendedDose.unit}
													</p>
												</div>
											)}
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="safety" className="mt-6">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							{/* Risk Profile */}
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Profil ryzyka</CardTitle>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer width="100%" height={300}>
										<RechartsBarChart data={riskProfileData} layout="horizontal">
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis type="number" domain={[0, 100]} />
											<YAxis type="category" dataKey="category" width={100} tick={{ fontSize: 12 }} />
											<Tooltip content={<CustomTooltip />} />
											<Bar dataKey="value" radius={[0, 4, 4, 0]}>
												{riskProfileData.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.color} />
												))}
											</Bar>
										</RechartsBarChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							{/* Population Safety */}
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Bezpieczeństwo dla grup</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">Ciąża</span>
											{currentSupplement.safeForPregnancy ? (
												<Badge className="bg-green-100 text-green-800">
													<ShieldCheck className="mr-1 h-3 w-3" />
													Bezpieczny
												</Badge>
											) : (
												<Badge className="bg-red-100 text-red-800">
													<AlertTriangle className="mr-1 h-3 w-3" />
													Niebezpieczny
												</Badge>
											)}
										</div>

										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">Dzieci</span>
											{currentSupplement.safeForChildren ? (
												<Badge className="bg-green-100 text-green-800">Bezpieczny</Badge>
											) : (
												<Badge className="bg-red-100 text-red-800">Niebezpieczny</Badge>
											)}
										</div>

										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">Osoby starsze</span>
											{currentSupplement.safeForElderly ? (
												<Badge className="bg-green-100 text-green-800">Bezpieczny</Badge>
											) : (
												<Badge className="bg-red-100 text-red-800">Niebezpieczny</Badge>
											)}
										</div>
									</div>

									<div className="mt-6">
										<h4 className="mb-3 font-medium text-sm">Ogólne ryzyko</h4>
										<div className="flex items-center gap-2">
											<Progress
												value={currentSupplement.overallRisk === "low" ? 25 : currentSupplement.overallRisk === "medium" ? 50 : 75}
												className="h-3 flex-1"
											/>
											<Badge
												style={{ backgroundColor: getRiskColor(currentSupplement.overallRisk) }}
												className="text-white"
											>
												{currentSupplement.overallRisk === "low" ? "Niskie" : currentSupplement.overallRisk === "medium" ? "Średnie" : "Wysokie"}
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="effects" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Skutki uboczne</CardTitle>
							</CardHeader>
							<CardContent>
								{sideEffectsData.length > 0 ? (
									<div className="space-y-4">
										{sideEffectsData.map((effect, index) => (
											<div key={index} className="rounded-lg border p-4">
												<div className="mb-3 flex items-center justify-between">
													<h4 className="font-medium text-sm">{effect.effect}</h4>
													<div className="flex items-center gap-2">
														<Badge
															style={{ backgroundColor: getFrequencyColor(effect.frequency) }}
															className="text-white text-xs"
														>
															{effect.frequency === "common" ? "Częste" : effect.frequency === "uncommon" ? "Niezbyt częste" : effect.frequency === "rare" ? "Rzadkie" : "Bardzo rzadkie"}
														</Badge>
														<Badge
															style={{ backgroundColor: getSeverityColor(effect.severity) }}
															className="text-white text-xs"
														>
															{effect.severity === "mild" ? "Łagodne" : effect.severity === "moderate" ? "Umiarkowane" : "Ciężkie"}
														</Badge>
													</div>
												</div>

												{effect.dosageDependent && (
													<div className="rounded-lg bg-blue-50 p-2">
														<p className="text-blue-800 text-xs">
															⚠️ Zależne od dawki - wyższe dawki zwiększają ryzyko
														</p>
													</div>
												)}
											</div>
										))}
									</div>
								) : (
									<div className="text-center text-gray-600 py-8">
										<ShieldCheck className="mx-auto mb-2 h-8 w-8 text-green-500" />
										<p>Brak zgłoszonych skutków ubocznych</p>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="interactions" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Interakcje i przeciwwskazania</CardTitle>
							</CardHeader>
							<CardContent>
								{currentSupplement.interactions.length > 0 || currentSupplement.contraindications.length > 0 ? (
									<div className="space-y-6">
										{currentSupplement.interactions.length > 0 && (
											<div>
												<h4 className="mb-3 font-medium text-sm">Interakcje z innymi substancjami</h4>
												<div className="space-y-2">
													{currentSupplement.interactions.map((interaction, index) => (
														<div key={index} className="flex items-center justify-between rounded-lg border p-3">
															<span className="font-medium text-sm">{interaction.polishSubstance}</span>
															<Badge
																className={cn(
																	"text-white text-xs",
																	interaction.severity === "severe" && "bg-red-500",
																	interaction.severity === "moderate" && "bg-yellow-500",
																	interaction.severity === "minor" && "bg-blue-500"
																)}
															>
																{interaction.severity === "severe" ? "Ciężka" : interaction.severity === "moderate" ? "Umiarkowana" : "Łagodna"}
															</Badge>
														</div>
													))}
												</div>
											</div>
										)}

										{currentSupplement.contraindications.length > 0 && (
											<div>
												<h4 className="mb-3 font-medium text-sm">Przeciwwskazania</h4>
												<div className="rounded-lg bg-red-50 p-4">
													<ul className="space-y-1">
														{currentSupplement.contraindications.map((contraindication, index) => (
															<li key={index} className="flex items-center gap-2 text-red-800 text-sm">
																<AlertTriangle className="h-3 w-3" />
																{contraindication}
															</li>
														))}
													</ul>
												</div>
											</div>
										)}
									</div>
								) : (
									<div className="text-center text-gray-600 py-8">
										<Shield className="mx-auto mb-2 h-8 w-8 text-green-500" />
										<p>Brak znaczących interakcji lub przeciwwskazań</p>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};

export default DosageSafetyVisualization;