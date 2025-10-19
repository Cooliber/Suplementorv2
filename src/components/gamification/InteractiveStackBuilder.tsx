/**
 * Interactive Supplement Stack Builder with Gamified Feedback
 * Evidence-based stack building with real-time safety analysis and optimization
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSupplementGamificationStore } from "@/lib/stores/supplement-gamification-store";
import { useSupplementStore } from "@/lib/stores/supplement-store";
import type {
	InteractionAnalysis,
	SafetyProfile,
	SupplementCategory,
	SupplementInteraction,
} from "@/types/supplement";
import { AnimatePresence, motion } from "framer-motion";
import {
	AlertTriangle,
	Brain,
	CheckCircle,
	Heart,
	Info,
	Layers,
	Minus,
	Plus,
	Shield,
	Star,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface StackSupplement {
	id: string;
	name: string;
	category: SupplementCategory;
	dosage: string;
	timing: string;
	priority: number;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK";
	synergy: number; // 0-100 synergy score
	safety: "safe" | "caution" | "dangerous";
}

interface SupplementStack {
	id: string;
	name: string;
	description: string;
	purpose: string[];
	supplements: StackSupplement[];
	overallScore: number;
	safetyProfile: SafetyProfile;
	createdAt: Date;
}

interface InteractiveStackBuilderProps {
	onStackCreate?: (stack: SupplementStack) => void;
}

const SAMPLE_SUPPLEMENTS = [
	{
		id: "vit-c",
		name: "Vitamin C",
		category: "VITAMIN" as SupplementCategory,
		evidenceLevel: "STRONG" as const,
		synergy: 85,
		safety: "safe" as const,
	},
	{
		id: "magnesium",
		name: "Magnesium",
		category: "MINERAL" as SupplementCategory,
		evidenceLevel: "STRONG" as const,
		synergy: 90,
		safety: "safe" as const,
	},
	{
		id: "ashwagandha",
		name: "Ashwagandha",
		category: "ADAPTOGEN" as SupplementCategory,
		evidenceLevel: "MODERATE" as const,
		synergy: 75,
		safety: "caution" as const,
	},
	{
		id: "omega-3",
		name: "Omega-3",
		category: "FATTY_ACID" as SupplementCategory,
		evidenceLevel: "STRONG" as const,
		synergy: 80,
		safety: "safe" as const,
	},
];

export function InteractiveStackBuilder({
	onStackCreate,
}: InteractiveStackBuilderProps) {
	const [stackName, setStackName] = useState("");
	const [stackDescription, setStackDescription] = useState("");
	const [stackPurpose, setStackPurpose] = useState<string[]>([]);
	const [selectedSupplements, setSelectedSupplements] = useState<
		StackSupplement[]
	>([]);
	const [currentStack, setCurrentStack] = useState<SupplementStack | null>(
		null,
	);
	const [showAnalysis, setShowAnalysis] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	const { addXP, recordSupplementLearning } = useSupplementGamificationStore();
	const { addSupplement } = useSupplementStore();

	const purposeOptions = [
		"Energy & Focus",
		"Sleep Quality",
		"Stress Management",
		"Immune Support",
		"Cognitive Enhancement",
		"Athletic Performance",
		"Joint Health",
		"Heart Health",
		"Gut Health",
		"Anti-Aging",
	];

	useEffect(() => {
		analyzeStack();
	}, [selectedSupplements]);

	const analyzeStack = () => {
		if (selectedSupplements.length === 0) {
			setCurrentStack(null);
			return;
		}

		// Calculate overall synergy score
		const avgSynergy =
			selectedSupplements.reduce((sum, supp) => sum + supp.synergy, 0) /
			selectedSupplements.length;

		// Analyze safety profile
		const hasCaution = selectedSupplements.some((s) => s.safety === "caution");
		const hasDangerous = selectedSupplements.some(
			(s) => s.safety === "dangerous",
		);

		let overallRisk: "low" | "medium" | "high" = "low";
		if (hasDangerous) overallRisk = "high";
		else if (hasCaution) overallRisk = "medium";

		// Generate safety profile
		const safetyProfile: SafetyProfile = {
			overallRisk,
			interactions: generateInteractions(selectedSupplements),
			warnings: generateWarnings(selectedSupplements),
			polishWarnings: generateWarnings(selectedSupplements), // Simplified for demo
			contraindications: generateContraindications(selectedSupplements),
			polishContraindications: generateContraindications(selectedSupplements),
			dosageWarnings: generateDosageWarnings(selectedSupplements),
			polishDosageWarnings: generateDosageWarnings(selectedSupplements),
			timingConflicts: generateTimingConflicts(selectedSupplements),
			polishTimingConflicts: generateTimingConflicts(selectedSupplements),
			cycleRecommendations: generateCycleRecommendations(selectedSupplements),
			polishCycleRecommendations:
				generateCycleRecommendations(selectedSupplements),
		};

		const stack: SupplementStack = {
			id: `stack-${Date.now()}`,
			name: stackName || "My Supplement Stack",
			description: stackDescription,
			purpose: stackPurpose,
			supplements: selectedSupplements,
			overallScore: Math.round(avgSynergy),
			safetyProfile,
			createdAt: new Date(),
		};

		setCurrentStack(stack);
	};

	const generateInteractions = (
		supplements: StackSupplement[],
	): InteractionAnalysis[] => {
		// Simplified interaction generation for demo
		return supplements.length > 1
			? [
					{
						type: "beneficial",
						message: "These supplements may work together synergistically",
						polishMessage: "Te suplementy mogą działać synergicznie",
						severity: "low",
						supplements: supplements.map((s) => s.name),
						recommendation: "Monitor for enhanced effects",
						polishRecommendation: "Monitoruj wzmacnione efekty",
					},
				]
			: [];
	};

	const generateWarnings = (supplements: StackSupplement[]): string[] => {
		const warnings: string[] = [];
		supplements.forEach((supp) => {
			if (supp.safety === "caution") {
				warnings.push(`${supp.name} requires careful monitoring`);
			}
		});
		return warnings;
	};

	const generateContraindications = (
		supplements: StackSupplement[],
	): string[] => {
		return supplements.some((s) => s.safety === "dangerous")
			? ["Consult healthcare provider before use"]
			: [];
	};

	const generateDosageWarnings = (supplements: StackSupplement[]): string[] => {
		return supplements.length > 3
			? ["High number of supplements may increase interaction risk"]
			: [];
	};

	const generateTimingConflicts = (
		supplements: StackSupplement[],
	): string[] => {
		return supplements.some((s) => s.category === "ADAPTOGEN")
			? ["Adaptogens may affect sleep if taken in evening"]
			: [];
	};

	const generateCycleRecommendations = (
		supplements: StackSupplement[],
	): string[] => {
		return supplements.some((s) => s.category === "ADAPTOGEN")
			? ["Consider cycling adaptogens (5 days on, 2 days off)"]
			: [];
	};

	const addSupplementToStack = (supplement: (typeof SAMPLE_SUPPLEMENTS)[0]) => {
		if (selectedSupplements.find((s) => s.id === supplement.id)) return;

		const stackSupplement: StackSupplement = {
			id: supplement.id,
			name: supplement.name,
			category: supplement.category,
			dosage: "Standard dose", // Would be configurable in real app
			timing: "Daily", // Would be configurable in real app
			priority: selectedSupplements.length + 1,
			evidenceLevel: supplement.evidenceLevel,
			synergy: supplement.synergy,
			safety: supplement.safety,
		};

		setSelectedSupplements([...selectedSupplements, stackSupplement]);
		recordSupplementLearning(supplement.id);
	};

	const removeSupplementFromStack = (id: string) => {
		setSelectedSupplements(selectedSupplements.filter((s) => s.id !== id));
	};

	const updateSupplementDosage = (id: string, dosage: string) => {
		setSelectedSupplements(
			selectedSupplements.map((s) => (s.id === id ? { ...s, dosage } : s)),
		);
	};

	const updateSupplementTiming = (id: string, timing: string) => {
		setSelectedSupplements(
			selectedSupplements.map((s) => (s.id === id ? { ...s, timing } : s)),
		);
	};

	const createStack = async () => {
		if (!currentStack || selectedSupplements.length === 0) return;

		setIsCreating(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Award XP for creating stack
		addXP(50, "stack-creation");

		// Add supplements to supplement store
		selectedSupplements.forEach((supp) => {
			addSupplement({
				id: supp.id,
				name: supp.name,
				polishName: supp.name, // Simplified for demo
				category: supp.category,
				dosage: supp.dosage,
				timing: supp.timing,
			});
		});

		onStackCreate?.(currentStack);
		setIsCreating(false);
	};

	const getSafetyColor = (safety: string) => {
		switch (safety) {
			case "safe":
				return "text-green-600 bg-green-50";
			case "caution":
				return "text-yellow-600 bg-yellow-50";
			case "dangerous":
				return "text-red-600 bg-red-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	const getSafetyIcon = (safety: string) => {
		switch (safety) {
			case "safe":
				return <CheckCircle className="h-4 w-4" />;
			case "caution":
				return <Info className="h-4 w-4" />;
			case "dangerous":
				return <AlertTriangle className="h-4 w-4" />;
			default:
				return <Info className="h-4 w-4" />;
		}
	};

	return (
		<div className="mx-auto w-full max-w-6xl space-y-6">
			{/* Header */}
			<div className="space-y-2 text-center">
				<h2 className="flex items-center justify-center gap-2 font-bold text-3xl">
					<Layers className="h-8 w-8 text-primary" />
					Interactive Stack Builder
				</h2>
				<p className="text-muted-foreground">
					Create evidence-based supplement stacks with real-time safety analysis
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Stack Configuration */}
				<div className="space-y-6 lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>Stack Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label htmlFor="stack-name">Stack Name</Label>
								<Input
									id="stack-name"
									value={stackName}
									onChange={(e) => setStackName(e.target.value)}
									placeholder="e.g., Morning Energy Stack"
								/>
							</div>

							<div>
								<Label htmlFor="stack-description">Description</Label>
								<Textarea
									id="stack-description"
									value={stackDescription}
									onChange={(e) => setStackDescription(e.target.value)}
									placeholder="Describe the purpose and goals of this stack..."
									rows={3}
								/>
							</div>

							<div>
								<Label>Purpose</Label>
								<div className="mt-2 grid grid-cols-2 gap-2">
									{purposeOptions.map((purpose) => (
										<Button
											key={purpose}
											variant={
												stackPurpose.includes(purpose) ? "default" : "outline"
											}
											size="sm"
											onClick={() => {
												setStackPurpose((prev) =>
													prev.includes(purpose)
														? prev.filter((p) => p !== purpose)
														: [...prev, purpose],
												);
											}}
										>
											{purpose}
										</Button>
									))}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Selected Supplements */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Layers className="h-5 w-5" />
								Selected Supplements ({selectedSupplements.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							{selectedSupplements.length === 0 ? (
								<div className="py-8 text-center text-muted-foreground">
									<Layers className="mx-auto mb-4 h-12 w-12 opacity-50" />
									<p>No supplements selected</p>
									<p className="text-sm">
										Add supplements from the library below
									</p>
								</div>
							) : (
								<div className="space-y-3">
									{selectedSupplements.map((supp, index) => (
										<motion.div
											key={supp.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: 20 }}
											className="flex items-center gap-3 rounded-lg border p-3"
										>
											<div className="flex-1">
												<div className="mb-1 flex items-center gap-2">
													<span className="font-medium">{supp.name}</span>
													<Badge variant="outline" className="text-xs">
														{supp.category.replace("_", " ")}
													</Badge>
													<div
														className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${getSafetyColor(supp.safety)}`}
													>
														{getSafetyIcon(supp.safety)}
														{supp.safety}
													</div>
												</div>
												<div className="grid grid-cols-2 gap-2 text-sm">
													<Input
														value={supp.dosage}
														onChange={(e) =>
															updateSupplementDosage(supp.id, e.target.value)
														}
														placeholder="Dosage"
													/>
													<Input
														value={supp.timing}
														onChange={(e) =>
															updateSupplementTiming(supp.id, e.target.value)
														}
														placeholder="Timing"
													/>
												</div>
											</div>
											<Button
												variant="outline"
												size="sm"
												onClick={() => removeSupplementFromStack(supp.id)}
											>
												<Minus className="h-4 w-4" />
											</Button>
										</motion.div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Supplement Library & Analysis */}
				<div className="space-y-6">
					{/* Supplement Library */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Supplement Library</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{SAMPLE_SUPPLEMENTS.map((supplement) => {
									const isSelected = selectedSupplements.find(
										(s) => s.id === supplement.id,
									);
									return (
										<Button
											key={supplement.id}
											variant={isSelected ? "secondary" : "outline"}
											className="h-auto w-full justify-start p-3"
											onClick={() => addSupplementToStack(supplement)}
											disabled={!!isSelected}
										>
											<div className="text-left">
												<div className="font-medium">{supplement.name}</div>
												<div className="text-muted-foreground text-xs">
													{supplement.category.replace("_", " ")} •{" "}
													{supplement.evidenceLevel} evidence
												</div>
											</div>
										</Button>
									);
								})}
							</div>
						</CardContent>
					</Card>

					{/* Stack Analysis */}
					{currentStack && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Target className="h-5 w-5" />
									Stack Analysis
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="text-center">
									<div className="mb-1 font-bold text-2xl text-primary">
										{currentStack.overallScore}%
									</div>
									<div className="text-muted-foreground text-sm">
										Synergy Score
									</div>
									<Progress
										value={currentStack.overallScore}
										className="mt-2"
									/>
								</div>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm">Safety Rating</span>
										<div
											className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${getSafetyColor(currentStack.safetyProfile.overallRisk)}`}
										>
											{getSafetyIcon(currentStack.safetyProfile.overallRisk)}
											{currentStack.safetyProfile.overallRisk}
										</div>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm">Supplements</span>
										<span className="font-medium">
											{currentStack.supplements.length}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm">Evidence Strength</span>
										<div className="flex gap-1">
											{
												currentStack.supplements.filter(
													(s) => s.evidenceLevel === "STRONG",
												).length
											}
											<span className="text-green-600">●</span>
											{
												currentStack.supplements.filter(
													(s) => s.evidenceLevel === "MODERATE",
												).length
											}
											<span className="text-yellow-600">●</span>
											{
												currentStack.supplements.filter(
													(s) => s.evidenceLevel === "WEAK",
												).length
											}
											<span className="text-red-600">●</span>
										</div>
									</div>
								</div>

								{currentStack.safetyProfile.warnings.length > 0 && (
									<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
										<div className="flex items-start gap-2">
											<AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-600" />
											<div>
												<div className="font-medium text-sm text-yellow-800">
													Safety Warnings
												</div>
												{currentStack.safetyProfile.warnings.map(
													(warning, index) => (
														<div
															key={index}
															className="mt-1 text-xs text-yellow-700"
														>
															• {warning}
														</div>
													),
												)}
											</div>
										</div>
									</div>
								)}

								<Button
									onClick={createStack}
									disabled={isCreating || selectedSupplements.length === 0}
									className="w-full gap-2"
								>
									{isCreating ? (
										<>
											<Layers className="h-4 w-4 animate-pulse" />
											Creating Stack...
										</>
									) : (
										<>
											<Star className="h-4 w-4" />
											Create Stack (+50 XP)
										</>
									)}
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
