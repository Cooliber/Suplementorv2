"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlertTriangle,
	BookOpen,
	Brain,
	ChevronDown,
	ChevronRight,
	Info,
	Lightbulb,
	Microscope,
	Pause,
	Play,
	RotateCcw,
	Target,
	TrendingUp,
	X,
	Zap,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

import {
	type NeurotransmitterSystem,
	neurotransmitterSystems,
} from "@/data/neurotransmitter-pathways";

interface NeurotransmitterEducationModuleProps {
	selectedNeurotransmitter?: string;
	neurotransmitter?: any;
	difficultyLevel?: "beginner" | "intermediate" | "expert";
	showSupplementInteractions?: boolean;
	onSupplementClick?: (supplementId: string) => void;
	onModuleComplete?: () => void;
	className?: string;
}

const NeurotransmitterEducationModule: React.FC<
	NeurotransmitterEducationModuleProps
> = ({
	selectedNeurotransmitter,
	neurotransmitter,
	difficultyLevel = "intermediate",
	showSupplementInteractions = true,
	onSupplementClick,
	onModuleComplete,
	className = "",
}) => {
	const [activeNeurotransmitter, setActiveNeurotransmitter] = useState(
		selectedNeurotransmitter || "dopamine",
	);
	const [expandedSections, setExpandedSections] = useState<Set<string>>(
		new Set(["overview"]),
	);
	const [showMisconceptions, setShowMisconceptions] = useState(false);
	const [animationPlaying, setAnimationPlaying] = useState(false);

	const currentNeurotransmitter = useMemo(() => {
		return neurotransmitterSystems.find(
			(nt) => nt.id === activeNeurotransmitter,
		);
	}, [activeNeurotransmitter]);

	const toggleSection = (sectionId: string) => {
		const newExpanded = new Set(expandedSections);
		if (newExpanded.has(sectionId)) {
			newExpanded.delete(sectionId);
		} else {
			newExpanded.add(sectionId);
		}
		setExpandedSections(newExpanded);
	};

	const getEducationalContent = (nt: NeurotransmitterSystem) => {
		const { educationalContent } = nt as any;
		if (!educationalContent) {
			return {
				content: "",
				polishContent: "",
			};
		}
		switch (difficultyLevel) {
			case "beginner":
				return {
					content: educationalContent.beginnerExplanation || "",
					polishContent: educationalContent.polishBeginnerExplanation || "",
				};
			case "expert":
				return {
					content: educationalContent.expertAnalysis || "",
					polishContent: educationalContent.polishExpertAnalysis || "",
				};
			default:
				return {
					content: educationalContent.intermediateDetails || "",
					polishContent: educationalContent.polishIntermediateDetails || "",
				};
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case "MONOAMINE":
				return "bg-purple-100 text-purple-800 border-purple-200";
			case "AMINO_ACID":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "PEPTIDE":
				return "bg-green-100 text-green-800 border-green-200";
			case "GASEOUS":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "LIPID":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getInteractionTypeColor = (type: string) => {
		switch (type) {
			case "INCREASES":
				return "text-green-600";
			case "DECREASES":
				return "text-red-600";
			case "MODULATES":
				return "text-blue-600";
			case "BLOCKS":
				return "text-orange-600";
			case "ENHANCES":
				return "text-purple-600";
			default:
				return "text-gray-600";
		}
	};

	if (!currentNeurotransmitter) {
		return (
			<div className={`p-4 ${className}`}>
				<Alert>
					<AlertTriangle className="h-4 w-4" />
					<AlertDescription>
						Nie znaleziono danych o wybranym neuroprzekaźniku.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const educationalContent = getEducationalContent(currentNeurotransmitter);

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Neurotransmitter selector */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2">
						<Brain className="h-5 w-5" />
						Systemy neuroprzekaźników
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-2 md:grid-cols-4">
						{neurotransmitterSystems.map((nt) => (
							<Button
								key={nt.id}
								variant={
									activeNeurotransmitter === nt.id ? "default" : "outline"
								}
								size="sm"
								onClick={() => setActiveNeurotransmitter(nt.id)}
								className="justify-start"
							>
								<Zap className="mr-1 h-3 w-3" />
								{nt.polishName}
							</Button>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Main content */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div>
							<CardTitle className="flex items-center gap-2 text-2xl">
								<Zap className="h-6 w-6" />
								{currentNeurotransmitter.polishName}
							</CardTitle>
							<p className="mt-1 text-gray-600 text-sm">
								{currentNeurotransmitter.name} •{" "}
								{(currentNeurotransmitter as any).chemistry?.formula}
							</p>
						</div>
						<Badge
							className={getCategoryColor(
								(currentNeurotransmitter as any).category,
							)}
						>
							{(currentNeurotransmitter as any).category}
						</Badge>
					</div>

					<div className="mt-4 rounded-lg bg-blue-50 p-4">
						<p className="text-sm leading-relaxed">
							{educationalContent.polishContent}
						</p>
					</div>
				</CardHeader>

				<CardContent>
					<Tabs defaultValue="overview" className="space-y-4">
						<TabsList className="grid w-full grid-cols-6">
							<TabsTrigger value="overview">Przegląd</TabsTrigger>
							<TabsTrigger value="chemistry">Chemia</TabsTrigger>
							<TabsTrigger value="receptors">Receptory</TabsTrigger>
							<TabsTrigger value="pathways">Szlaki</TabsTrigger>
							<TabsTrigger value="supplements">Suplementy</TabsTrigger>
							<TabsTrigger value="clinical">Klinika</TabsTrigger>
						</TabsList>

						{/* Overview Tab */}
						<TabsContent value="overview" className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="flex items-center gap-2 text-sm">
											<Lightbulb className="h-4 w-4" />
											Kluczowe fakty
										</CardTitle>
									</CardHeader>
									<CardContent>
										<ul className="space-y-2">
											{(
												currentNeurotransmitter as any
											).educationalContent.polishKeyFacts.map(
												(fact: any, index: number) => (
													<li
														key={index}
														className="flex items-start gap-2 text-sm"
													>
														<span className="mt-1 text-green-500">•</span>
														{fact}
													</li>
												),
											)}
										</ul>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="flex items-center gap-2 text-sm">
											<Target className="h-4 w-4" />
											Główne funkcje
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{(currentNeurotransmitter as any).functions.map(
												(func: any, index: number) => (
													<div key={index} className="rounded-lg border p-3">
														<h4 className="mb-1 font-medium text-sm">
															{func.polishCategory}
														</h4>
														<div className="mb-2 flex flex-wrap gap-1">
															{func.polishEffects.map(
																(effect: any, idx: number) => (
																	<Badge
																		key={idx}
																		variant="outline"
																		className="text-xs"
																	>
																		{effect}
																	</Badge>
																),
															)}
														</div>
														<p className="text-gray-600 text-xs">
															Czas działania: {func.polishTimeScale}
														</p>
													</div>
												),
											)}
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Common misconceptions */}
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="flex items-center justify-between text-sm">
										<div className="flex items-center gap-2">
											<AlertTriangle className="h-4 w-4" />
											Częste nieporozumienia
										</div>
										<Button
											size="sm"
											variant="ghost"
											onClick={() => setShowMisconceptions(!showMisconceptions)}
										>
											{showMisconceptions ? (
												<ChevronDown className="h-3 w-3" />
											) : (
												<ChevronRight className="h-3 w-3" />
											)}
										</Button>
									</CardTitle>
								</CardHeader>
								{showMisconceptions && (
									<CardContent>
										<div className="space-y-2">
											{(
												currentNeurotransmitter as any
											).educationalContent.polishCommonMisconceptions.map(
												(misconception: any, index: number) => (
													<Alert
														key={index}
														className="border-orange-200 bg-orange-50"
													>
														<X className="h-4 w-4 text-orange-600" />
														<AlertDescription className="text-sm">
															{misconception}
														</AlertDescription>
													</Alert>
												),
											)}
										</div>
									</CardContent>
								)}
							</Card>
						</TabsContent>

						{/* Chemistry Tab */}
						<TabsContent value="chemistry" className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm">
											Właściwości chemiczne
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Wzór:</span>
											<span className="font-mono">
												{(currentNeurotransmitter as any).chemistry?.formula}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>Masa molowa:</span>
											<span>
												{
													(currentNeurotransmitter as any).chemistry
														?.molecularWeight
												}{" "}
												g/mol
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span>SMILES:</span>
											<span className="break-all font-mono text-xs">
												{(currentNeurotransmitter as any).chemistry?.structure}
											</span>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm">Synteza</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										<div className="text-sm">
											<strong>Prekursor:</strong>{" "}
											{
												(currentNeurotransmitter as any).chemistry?.synthesis
													?.polishPrecursor
											}
										</div>
										<div className="text-sm">
											<strong>Enzymy:</strong>
											<ul className="mt-1 ml-2 list-inside list-disc">
												{(
													currentNeurotransmitter as any
												).chemistry?.synthesis?.polishEnzymes?.map(
													(enzyme: any, index: number) => (
														<li key={index}>{enzyme}</li>
													),
												)}
											</ul>
										</div>
										<div className="text-sm">
											<strong>Szlak:</strong>{" "}
											{
												(currentNeurotransmitter as any).chemistry?.synthesis
													?.polishPathway
											}
										</div>
									</CardContent>
								</Card>
							</div>

							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm">Degradacja</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<h4 className="mb-2 font-medium text-sm">
												Enzymy degradujące:
											</h4>
											<div className="flex flex-wrap gap-1">
												{(
													currentNeurotransmitter as any
												).chemistry?.degradation?.polishEnzymes?.map(
													(enzyme: any, index: number) => (
														<Badge
															key={index}
															variant="outline"
															className="text-xs"
														>
															{enzyme}
														</Badge>
													),
												)}
											</div>
										</div>
										<div>
											<h4 className="mb-2 font-medium text-sm">Metabolity:</h4>
											<div className="flex flex-wrap gap-1">
												{(
													currentNeurotransmitter as any
												).chemistry?.degradation?.polishMetabolites?.map(
													(metabolite: any, index: number) => (
														<Badge
															key={index}
															variant="secondary"
															className="text-xs"
														>
															{metabolite}
														</Badge>
													),
												)}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Receptors Tab */}
						<TabsContent value="receptors" className="space-y-4">
							<div className="space-y-4">
								{currentNeurotransmitter.receptors.map((receptor, index) => (
									<Card key={index}>
										<CardHeader className="pb-2">
											<CardTitle className="flex items-center justify-between text-sm">
												{receptor.polishName}
												<Badge
													variant={
														(receptor as any).type === "IONOTROPIC"
															? "default"
															: "secondary"
													}
												>
													{(receptor as any).type}
												</Badge>
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-3">
											<div>
												<h4 className="mb-1 font-medium text-xs">
													Lokalizacja:
												</h4>
												<div className="flex flex-wrap gap-1">
													{(receptor as any).polishLocation?.map(
														(location: any, idx: number) => (
															<Badge
																key={idx}
																variant="outline"
																className="text-xs"
															>
																{location}
															</Badge>
														),
													)}
												</div>
											</div>

											<div>
												<h4 className="mb-1 font-medium text-xs">Funkcja:</h4>
												<p className="text-gray-600 text-xs">
													{(receptor as any).polishFunction}
												</p>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div>
													<h4 className="mb-1 font-medium text-xs">
														Powinowactwo:
													</h4>
													<span className="text-xs">
														{(receptor as any).affinity} nM
													</span>
												</div>
												<div>
													<h4 className="mb-1 font-medium text-xs">
														Sygnalizacja:
													</h4>
													<div className="flex flex-wrap gap-1">
														{(receptor as any).polishSignaling?.map(
															(signal: any, idx: number) => (
																<Badge
																	key={idx}
																	variant="outline"
																	className="text-xs"
																>
																	{signal}
																</Badge>
															),
														)}
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						{/* Pathways Tab */}
						<TabsContent value="pathways" className="space-y-4">
							<div className="space-y-4">
								{currentNeurotransmitter.pathways.map((pathway, index) => (
									<Card key={index}>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm">
												{pathway.polishName}
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-3">
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<div>
													<h4 className="mb-1 font-medium text-xs">
														Pochodzenie:
													</h4>
													<p className="text-gray-600 text-xs">
														{(pathway as any).polishOrigin}
													</p>
												</div>
												<div>
													<h4 className="mb-1 font-medium text-xs">Cele:</h4>
													<div className="flex flex-wrap gap-1">
														{(pathway as any).polishTargets?.map(
															(target: any, idx: number) => (
																<Badge
																	key={idx}
																	variant="outline"
																	className="text-xs"
																>
																	{target}
																</Badge>
															),
														)}
													</div>
												</div>
											</div>

											<div>
												<h4 className="mb-1 font-medium text-xs">Funkcja:</h4>
												<p className="text-gray-600 text-xs">
													{(pathway as any).polishFunction}
												</p>
											</div>

											<Alert className="border-blue-200 bg-blue-50">
												<Info className="h-4 w-4 text-blue-600" />
												<AlertDescription className="text-xs">
													<strong>Znaczenie kliniczne:</strong>{" "}
													{(pathway as any).polishClinicalRelevance}
												</AlertDescription>
											</Alert>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						{/* Supplements Tab */}
						<TabsContent value="supplements" className="space-y-4">
							{showSupplementInteractions &&
							(currentNeurotransmitter as any).supplementInteractions?.length >
								0 ? (
								<div className="space-y-4">
									{(currentNeurotransmitter as any).supplementInteractions?.map(
										(interaction: any, index: number) => (
											<Card
												key={index}
												className="cursor-pointer transition-shadow hover:shadow-md"
											>
												<CardHeader className="pb-2">
													<CardTitle className="flex items-center justify-between text-sm">
														<span>{interaction.polishSupplementName}</span>
														<div className="flex items-center gap-2">
															<Badge
																variant="outline"
																className={getInteractionTypeColor(
																	interaction.interactionType,
																)}
															>
																{interaction.interactionType}
															</Badge>
															<Badge variant="secondary" className="text-xs">
																{interaction.evidenceLevel}
															</Badge>
														</div>
													</CardTitle>
												</CardHeader>
												<CardContent className="space-y-3">
													<div>
														<h4 className="mb-1 font-medium text-xs">
															Mechanizm:
														</h4>
														<p className="text-gray-600 text-xs">
															{interaction.polishMechanism}
														</p>
													</div>

													<div>
														<h4 className="mb-1 font-medium text-xs">
															Znaczenie kliniczne:
														</h4>
														<p className="text-gray-600 text-xs">
															{interaction.polishClinicalSignificance}
														</p>
													</div>

													<div className="grid grid-cols-2 gap-4">
														<div>
															<h4 className="mb-1 font-medium text-xs">
																Czas działania:
															</h4>
															<span className="text-xs">
																{interaction.polishTimeToEffect}
															</span>
														</div>
														<div>
															<h4 className="mb-1 font-medium text-xs">
																Zależność od dawki:
															</h4>
															<Badge
																variant={
																	interaction.doseDependency
																		? "default"
																		: "secondary"
																}
																className="text-xs"
															>
																{interaction.doseDependency ? "Tak" : "Nie"}
															</Badge>
														</div>
													</div>

													{onSupplementClick && (
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																onSupplementClick(interaction.supplementId)
															}
															className="w-full"
														>
															Zobacz szczegóły suplementu
														</Button>
													)}
												</CardContent>
											</Card>
										),
									)}
								</div>
							) : (
								<Alert>
									<Info className="h-4 w-4" />
									<AlertDescription>
										Brak udokumentowanych interakcji z suplementami dla tego
										neuroprzekaźnika.
									</AlertDescription>
								</Alert>
							)}
						</TabsContent>

						{/* Clinical Tab */}
						<TabsContent value="clinical" className="space-y-4">
							<div className="space-y-4">
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm">
											Zaburzenia związane
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{(
												currentNeurotransmitter as any
											).clinicalAspects?.disorders?.map(
												(disorder: any, index: number) => (
													<div key={index} className="rounded-lg border p-3">
														<div className="mb-2 flex items-center justify-between">
															<h4 className="font-medium text-sm">
																{disorder.polishCondition}
															</h4>
															<Badge
																variant={
																	disorder.alteration === "DECREASED"
																		? "destructive"
																		: disorder.alteration === "INCREASED"
																			? "default"
																			: "secondary"
																}
																className="text-xs"
															>
																{disorder.alteration}
															</Badge>
														</div>

														<p className="mb-2 text-gray-600 text-xs">
															{disorder.polishMechanism}
														</p>

														<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
															<div>
																<h5 className="mb-1 font-medium text-xs">
																	Objawy:
																</h5>
																<div className="flex flex-wrap gap-1">
																	{disorder.polishSymptoms?.map(
																		(symptom: any, idx: number) => (
																			<Badge
																				key={idx}
																				variant="outline"
																				className="text-xs"
																			>
																				{symptom}
																			</Badge>
																		),
																	)}
																</div>
															</div>
															<div>
																<h5 className="mb-1 font-medium text-xs">
																	Leczenie:
																</h5>
																<div className="flex flex-wrap gap-1">
																	{disorder.polishTreatments?.map(
																		(treatment: any, idx: number) => (
																			<Badge
																				key={idx}
																				variant="secondary"
																				className="text-xs"
																			>
																				{treatment}
																			</Badge>
																		),
																	)}
																</div>
															</div>
														</div>
													</div>
												),
											)}
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm">Biomarkery</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{(
												currentNeurotransmitter as any
											).clinicalAspects?.biomarkers?.map(
												(biomarker: any, index: number) => (
													<div key={index} className="rounded-lg border p-3">
														<div className="mb-1 flex items-center justify-between">
															<h4 className="font-medium text-sm">
																{biomarker.polishMarker}
															</h4>
															<span className="text-gray-500 text-xs">
																{biomarker.normalRange}
															</span>
														</div>
														<p className="text-gray-600 text-xs">
															{biomarker.polishClinicalSignificance}
														</p>
													</div>
												),
											)}
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
};

export default NeurotransmitterEducationModule;
