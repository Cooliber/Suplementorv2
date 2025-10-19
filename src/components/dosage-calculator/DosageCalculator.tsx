"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import ErrorAlert, { createErrorInfo } from "@/components/ui/error-alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { useDosageCalculation } from "@/lib/services/dosage-calculation-service";
import {
	AlertTriangle,
	Brain,
	Calculator,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Clock,
	Heart,
	Info,
	Moon,
	Pill,
	Shield,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";

import type {
	DosageCalculationInput,
	DosageCalculationResult,
} from "@/types/dosage-calculator";
import { CalculationOptionsStep } from "./steps/CalculationOptionsStep";
import { ResultsStep } from "./steps/ResultsStep";
import { SupplementSelectionStep } from "./steps/SupplementSelectionStep";
// Import our custom components and types
import { UserProfileStep } from "./steps/UserProfileStep";

interface DosageCalculatorProps {
	className?: string;
}

type CalculationStep = "profile" | "supplements" | "options" | "results";

const STEP_TITLES = {
	profile: { pl: "Profil użytkownika", en: "User Profile" },
	supplements: { pl: "Wybór suplementów", en: "Supplement Selection" },
	options: { pl: "Opcje obliczeń", en: "Calculation Options" },
	results: { pl: "Wyniki", en: "Results" },
} as const;

const POPULAR_COMBINATIONS = [
	{
		id: "cognitive_enhancement",
		name: "Cognitive Enhancement",
		polishName: "Poprawa funkcji poznawczych",
		icon: Brain,
		description: "Nootropics and vitamins for mental clarity and focus",
		polishDescription: "Nootropiki i witaminy na jasność umysłu i skupienie",
		supplements: ["nootropics", "vitamins", "amino_acids"],
	},
	{
		id: "energy_performance",
		name: "Energy & Performance",
		polishName: "Energia i wydolność",
		icon: Zap,
		description: "Adaptogens and amino acids for sustained energy",
		polishDescription: "Adaptogeny i aminokwasy na utrzymaną energię",
		supplements: ["adaptogens", "amino_acids", "minerals"],
	},
	{
		id: "stress_relief",
		name: "Stress Relief",
		polishName: "Redukcja stresu",
		icon: Heart,
		description: "Herbs and minerals for stress management",
		polishDescription: "Zioła i minerały na zarządzanie stresem",
		supplements: ["herbs", "minerals", "adaptogens"],
	},
	{
		id: "sleep_optimization",
		name: "Sleep Optimization",
		polishName: "Optymalizacja snu",
		icon: Moon,
		description: "Supplements for better sleep quality",
		polishDescription: "Suplementy na lepszą jakość snu",
		supplements: ["herbs", "amino_acids", "minerals"],
	},
];

export function DosageCalculator({ className }: DosageCalculatorProps) {
	const [currentStep, setCurrentStep] = useState<CalculationStep>("profile");
	const [calculationResult, setCalculationResult] =
		useState<DosageCalculationResult | null>(null);

	// Use our new error handling system
	const errorHandler = useErrorHandler();
	const {
		calculateDosage,
		retryCalculation,
		isCalculating,
		error,
		clearError,
	} = useDosageCalculation();

	// Form data state
	const [userProfile, setUserProfile] = useState<
		Partial<DosageCalculationInput["userProfile"]>
	>({
		age: 25,
		gender: "other",
		weight: 70,
		height: 175,
		activityLevel: "moderate",
		healthConditions: [],
		currentMedications: [],
		allergies: [],
		pregnant: false,
		breastfeeding: false,
	});

	const [supplements, setSupplements] = useState<
		DosageCalculationInput["supplements"]
	>([]);
	const [calculationOptions, setCalculationOptions] = useState({
		calculationType: "stack" as const,
		includeInteractions: true,
		includeContraindications: true,
	});

	const [isPolish, setIsPolish] = useState(true);

	// Step navigation
	const goToNextStep = () => {
		const steps: CalculationStep[] = [
			"profile",
			"supplements",
			"options",
			"results",
		];
		const currentIndex = steps.indexOf(currentStep);
		if (currentIndex < steps.length - 1) {
			setCurrentStep(steps[currentIndex + 1]!);
		}
	};

	const goToPreviousStep = () => {
		const steps: CalculationStep[] = [
			"profile",
			"supplements",
			"options",
			"results",
		];
		const currentIndex = steps.indexOf(currentStep);
		if (currentIndex > 0) {
			setCurrentStep(steps[currentIndex - 1]!);
		}
	};

	// Enhanced validation for each step with proper form validation
	const canProceedFromProfile = () => {
		return !!(
			userProfile.age &&
			userProfile.gender &&
			userProfile.weight &&
			userProfile.height &&
			userProfile.activityLevel &&
			userProfile.age >= 18 &&
			userProfile.age <= 120 &&
			userProfile.weight >= 30 &&
			userProfile.weight <= 300 &&
			userProfile.height >= 100 &&
			userProfile.height <= 250
		);
	};

	const canProceedFromSupplements = () => {
		return (
			supplements.length > 0 && supplements.every((supp) => supp.supplementId)
		);
	};

	const canProceedFromOptions = () => {
		return true; // Options step always allows proceeding
	};

	const canCalculate = () => {
		return (
			canProceedFromProfile() &&
			canProceedFromSupplements() &&
			canProceedFromOptions()
		);
	};

	// Enhanced step validation with visual feedback
	const getStepValidationStatus = (step: CalculationStep) => {
		switch (step) {
			case "profile":
				return canProceedFromProfile();
			case "supplements":
				return canProceedFromSupplements();
			case "options":
				return canProceedFromOptions();
			default:
				return false;
		}
	};

	const getStepValidationMessage = (step: CalculationStep) => {
		if (getStepValidationStatus(step)) {
			return isPolish ? "Poprawnie wypełnione" : "Completed correctly";
		}

		switch (step) {
			case "profile":
				return isPolish
					? "Uzupełnij podstawowe informacje"
					: "Complete basic information";
			case "supplements":
				return isPolish ? "Wybierz suplementy" : "Select supplements";
			case "options":
				return isPolish
					? "Sprawdź opcje obliczeń"
					: "Review calculation options";
			default:
				return "";
		}
	};

	// Calculate dosage with enhanced error handling
	const handleCalculate = async () => {
		if (!canCalculate()) return;

		try {
			const calculationInput: DosageCalculationInput = {
				userProfile: userProfile as DosageCalculationInput["userProfile"],
				supplements,
				calculationType: calculationOptions.calculationType,
				includeInteractions: calculationOptions.includeInteractions,
				includeContraindications: calculationOptions.includeContraindications,
			};

			const result = await calculateDosage(calculationInput, {
				includeInteractions: calculationOptions.includeInteractions,
				includeContraindications: calculationOptions.includeContraindications,
				timeout: 30000,
			});

			if (result) {
				setCalculationResult(result);
				setCurrentStep("results");
			}
		} catch (err) {
			// Error is already handled by the useDosageCalculation hook
			console.error("Calculation error:", err);
		}
	};

	// Retry calculation
	const handleRetryCalculation = async () => {
		try {
			const calculationInput: DosageCalculationInput = {
				userProfile: userProfile as DosageCalculationInput["userProfile"],
				supplements,
				calculationType: calculationOptions.calculationType,
				includeInteractions: calculationOptions.includeInteractions,
				includeContraindications: calculationOptions.includeContraindications,
			};

			const result = await retryCalculation(calculationInput, {
				includeInteractions: calculationOptions.includeInteractions,
				includeContraindications: calculationOptions.includeContraindications,
			});

			if (result) {
				setCalculationResult(result);
				setCurrentStep("results");
			}
		} catch (err) {
			console.error("Retry calculation error:", err);
		}
	};

	// Quick selection handlers
	const handlePopularCombinationSelect = (combinationId: string) => {
		const combination = POPULAR_COMBINATIONS.find(
			(c) => c.id === combinationId,
		);
		if (combination) {
			// This would typically load supplements based on the combination
			// For now, just show a message
			console.log(`Selected combination: ${combination.name}`);
		}
	};

	const getStepProgress = () => {
		const steps: CalculationStep[] = [
			"profile",
			"supplements",
			"options",
			"results",
		];
		return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
	};

	const getCurrentStepTitle = () => {
		return isPolish ? STEP_TITLES[currentStep].pl : STEP_TITLES[currentStep].en;
	};

	return (
		<div className={`mx-auto max-w-5xl p-6 ${className}`}>
			{/* Enhanced Header */}
			<div className="mb-8">
				<div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8">
					<div className="absolute inset-0 bg-grid-pattern opacity-5" />
					<div className="relative mb-4 flex items-center gap-4">
						<div className="relative rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 shadow-lg">
							<Calculator className="h-10 w-10 text-white" />
							<div className="-top-1 -right-1 absolute h-4 w-4 animate-pulse rounded-full bg-green-500" />
						</div>
						<div className="flex-1">
							<h1 className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text font-bold text-4xl text-transparent">
								{isPolish
									? "Kalkulator dawek suplementów"
									: "Supplement Dosage Calculator"}
							</h1>
							<p className="mt-2 text-lg text-muted-foreground">
								{isPolish
									? "Oblicz bezpieczne i skuteczne dawki suplementów dostosowane do Twojego profilu"
									: "Calculate safe and effective supplement dosages tailored to your profile"}
							</p>
						</div>
					</div>

					{/* Enhanced Progress bar */}
					<div className="space-y-3">
						<div className="flex items-center justify-between text-sm">
							<span className="font-medium">{getCurrentStepTitle()}</span>
							<div className="flex items-center gap-2">
								<span className="text-muted-foreground">
									{Math.round(getStepProgress())}%
								</span>
								<span className="text-muted-foreground text-xs">
									{isPolish ? "Krok" : "Step"}{" "}
									{Math.floor(getStepProgress() / 25) + 1}{" "}
									{isPolish ? "z 4" : "of 4"}
								</span>
							</div>
						</div>
						<div className="relative">
							<Progress value={getStepProgress()} className="h-3 bg-muted/50" />
							<div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/5" />
						</div>
					</div>
				</div>
			</div>

			{/* Enhanced Popular combinations quick select */}
			{currentStep === "supplements" && (
				<Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
					<CardHeader className="pb-4">
						<CardTitle className="flex items-center gap-3 text-xl">
							<div className="rounded-lg bg-primary/10 p-2">
								<Users className="h-6 w-6 text-primary" />
							</div>
							{isPolish ? "Popularne kombinacje" : "Popular Combinations"}
						</CardTitle>
						<CardDescription className="text-base">
							{isPolish
								? "Wybierz popularną kombinację suplementów, aby szybko zacząć"
								: "Choose a popular supplement combination to get started quickly"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{POPULAR_COMBINATIONS.map((combination) => {
								const IconComponent = combination.icon;
								return (
									<Button
										key={combination.id}
										variant="outline"
										className="group flex h-auto flex-col items-start gap-3 p-6 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
										onClick={() =>
											handlePopularCombinationSelect(combination.id)
										}
									>
										<div className="flex w-full items-center gap-3">
											<div className="rounded-lg bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
												<IconComponent className="h-6 w-6 text-primary" />
											</div>
											<div className="flex-1 text-left">
												<div className="font-semibold text-base">
													{isPolish ? combination.polishName : combination.name}
												</div>
												<div className="text-muted-foreground text-sm leading-tight">
													{isPolish
														? combination.polishDescription
														: combination.description}
												</div>
											</div>
										</div>
										<div className="flex w-full items-center justify-between text-muted-foreground text-xs">
											<span>
												{combination.supplements.length}{" "}
												{isPolish ? "suplementów" : "supplements"}
											</span>
											<span className="font-medium text-primary">
												{isPolish ? "Kliknij aby wybrać" : "Click to select"}
											</span>
										</div>
									</Button>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Enhanced Main content */}
			<Card className="border-0 bg-gradient-to-br from-background to-muted/20 shadow-lg">
				<CardHeader className="pb-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-3">
								{currentStep === "profile" && (
									<Users className="h-6 w-6 text-primary" />
								)}
								{currentStep === "supplements" && (
									<Pill className="h-6 w-6 text-primary" />
								)}
								{currentStep === "options" && (
									<Info className="h-6 w-6 text-primary" />
								)}
								{currentStep === "results" && (
									<CheckCircle className="h-6 w-6 text-primary" />
								)}
							</div>
							<div>
								<CardTitle className="text-2xl">
									{getCurrentStepTitle()}
								</CardTitle>
								<CardDescription className="mt-1 text-base">
									{currentStep === "profile" &&
										(isPolish
											? "Podaj informacje o swoim zdrowiu i stylu życia"
											: "Provide information about your health and lifestyle")}
									{currentStep === "supplements" &&
										(isPolish
											? "Wybierz suplementy do obliczenia dawek"
											: "Select supplements for dosage calculation")}
									{currentStep === "options" &&
										(isPolish
											? "Dostosuj opcje obliczeń"
											: "Customize calculation options")}
									{currentStep === "results" &&
										(isPolish
											? "Zobacz swoje spersonalizowane rekomendacje"
											: "View your personalized recommendations")}
								</CardDescription>
							</div>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsPolish(!isPolish)}
							className="transition-colors hover:bg-primary/10"
						>
							{isPolish ? "EN" : "PL"}
						</Button>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Enhanced Error display */}
					{error && (
						<ErrorAlert
							error={createErrorInfo.dosageCalculation(
								error instanceof Error ? error.message : String(error),
							)}
							onRetry={handleRetryCalculation}
							onDismiss={clearError}
						/>
					)}

					{/* Show error handler errors if any */}
					{errorHandler.errors.length > 0 && (
						<div className="space-y-2">
							{errorHandler.errors.map((errorInfo, index) => (
								<ErrorAlert
									key={errorInfo.timestamp.getTime()}
									error={errorInfo}
									onRetry={
										errorInfo.retryable ? handleRetryCalculation : undefined
									}
									onDismiss={() =>
										errorHandler.clearError(
											errorInfo.timestamp.getTime().toString(),
										)
									}
								/>
							))}
						</div>
					)}

					{/* Step content */}
					{currentStep === "profile" && (
						<UserProfileStep
							userProfile={userProfile}
							onUserProfileChange={setUserProfile}
							isPolish={isPolish}
						/>
					)}

					{currentStep === "supplements" && (
						<SupplementSelectionStep
							supplements={supplements}
							onSupplementsChange={setSupplements}
							isPolish={isPolish}
						/>
					)}

					{currentStep === "options" && (
						<CalculationOptionsStep
							options={calculationOptions}
							onOptionsChange={setCalculationOptions}
							isPolish={isPolish}
						/>
					)}

					{currentStep === "results" && calculationResult && (
						<ResultsStep result={calculationResult} isPolish={isPolish} />
					)}
				</CardContent>
			</Card>

			{/* Enhanced Navigation */}
			<div className="mt-8 flex items-center justify-between rounded-2xl bg-muted/30 p-6">
				<Button
					variant="outline"
					onClick={goToPreviousStep}
					disabled={currentStep === "profile"}
					className="flex items-center gap-2 px-6 py-3 transition-all duration-200 hover:bg-primary/5"
				>
					<ChevronLeft className="h-4 w-4" />
					{isPolish ? "Wstecz" : "Previous"}
				</Button>

				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<span>
						{isPolish ? "Krok" : "Step"}{" "}
						{Math.floor(getStepProgress() / 25) + 1} {isPolish ? "z 4" : "of 4"}
					</span>
					<div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
						<div
							className="h-full bg-primary transition-all duration-300"
							style={{ width: `${getStepProgress()}%` }}
						/>
					</div>
				</div>

				{currentStep === "options" ? (
					<Button
						onClick={handleCalculate}
						disabled={!canCalculate() || isCalculating}
						className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 px-8 py-3 shadow-lg transition-all duration-200 hover:from-primary/90 hover:to-primary/70 hover:shadow-xl"
					>
						{isCalculating ? (
							<>
								<div className="h-4 w-4 animate-spin rounded-full border-white border-b-2" />
								{isPolish ? "Obliczanie..." : "Calculating..."}
							</>
						) : (
							<>
								<Calculator className="h-4 w-4" />
								{isPolish ? "Oblicz dawki" : "Calculate Dosages"}
							</>
						)}
					</Button>
				) : (
					<Button
						onClick={goToNextStep}
						disabled={
							(currentStep === "profile" && !canProceedFromProfile()) ||
							(currentStep === "supplements" && !canProceedFromSupplements())
						}
						className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 px-8 py-3 shadow-lg transition-all duration-200 hover:from-primary/90 hover:to-primary/70 hover:shadow-xl"
					>
						{isPolish ? "Dalej" : "Next"}
						<ChevronRight className="h-4 w-4" />
					</Button>
				)}
			</div>

			{/* Enhanced Safety notice */}
			<Alert className="mt-6 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
				<div className="flex items-center gap-3">
					<div className="rounded-full bg-amber-100 p-2">
						<Shield className="h-5 w-5 text-amber-600" />
					</div>
					<AlertDescription className="text-amber-800">
						<div className="space-y-1">
							<p className="font-medium">
								{isPolish
									? "⚠️ Ważna informacja bezpieczeństwa"
									: "⚠️ Important Safety Notice"}
							</p>
							<p className="text-sm">
								{isPolish
									? "Pamiętaj, że ten kalkulator nie zastępuje profesjonalnej porady medycznej. Zawsze konsultuj się z lekarzem przed rozpoczęciem suplementacji."
									: "Remember that this calculator does not replace professional medical advice. Always consult with a healthcare provider before starting supplementation."}
							</p>
						</div>
					</AlertDescription>
				</div>
			</Alert>
		</div>
	);
}
