"use client";

/**
 * Recommendation Wizard Component
 * Multi-step wizard for personalized supplement recommendations
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/trpc/react";
import {
	ChevronLeft,
	ChevronRight,
	Shield,
	Sparkles,
	Target,
	User,
} from "lucide-react";
import React, { useState } from "react";

type HealthGoal =
	| "cognitive_enhancement"
	| "memory_improvement"
	| "focus_concentration"
	| "stress_reduction"
	| "anxiety_relief"
	| "mood_improvement"
	| "energy_boost"
	| "sleep_quality"
	| "physical_performance"
	| "neuroprotection"
	| "anti_aging"
	| "immune_support";

interface UserProfile {
	age: number;
	gender: "male" | "female" | "other";
	weight?: number;
	healthGoals: HealthGoal[];
	existingConditions: string[];
	currentMedications: string[];
	allergies: string[];
	dietaryRestrictions: string[];
	experienceLevel: "beginner" | "intermediate" | "advanced";
}

interface RecommendationWizardProps {
	onComplete: (recommendations: any) => void;
	language?: "pl" | "en";
}

export function RecommendationWizard({
	onComplete,
	language = "pl",
}: RecommendationWizardProps) {
	const [step, setStep] = useState(1);
	const [profile, setProfile] = useState<Partial<UserProfile>>({
		healthGoals: [],
		existingConditions: [],
		currentMedications: [],
		allergies: [],
		dietaryRestrictions: [],
		experienceLevel: "beginner",
	});

	const [shouldFetch, setShouldFetch] = React.useState(false);
	const recommendationsQuery = api.recommendations.getRecommendations.useQuery(
		{ userProfile: profile as any, limit: 10 },
		{ enabled: shouldFetch && !!profile.age && !!profile.gender },
	);

	React.useEffect(() => {
		if (recommendationsQuery.data && shouldFetch) {
			onComplete(recommendationsQuery.data);
			setShouldFetch(false);
		}
	}, [recommendationsQuery.data, shouldFetch, onComplete]);

	const healthGoals: {
		id: HealthGoal;
		label: string;
		polishLabel: string;
		icon: string;
	}[] = [
		{
			id: "cognitive_enhancement",
			label: "Cognitive Enhancement",
			polishLabel: "Poprawa funkcji poznawczych",
			icon: "🧠",
		},
		{
			id: "memory_improvement",
			label: "Memory Improvement",
			polishLabel: "Poprawa pamięci",
			icon: "💭",
		},
		{
			id: "focus_concentration",
			label: "Focus & Concentration",
			polishLabel: "Koncentracja i uwaga",
			icon: "🎯",
		},
		{
			id: "stress_reduction",
			label: "Stress Reduction",
			polishLabel: "Redukcja stresu",
			icon: "😌",
		},
		{
			id: "anxiety_relief",
			label: "Anxiety Relief",
			polishLabel: "Łagodzenie lęku",
			icon: "🕊️",
		},
		{
			id: "mood_improvement",
			label: "Mood Improvement",
			polishLabel: "Poprawa nastroju",
			icon: "😊",
		},
		{
			id: "energy_boost",
			label: "Energy Boost",
			polishLabel: "Zwiększenie energii",
			icon: "⚡",
		},
		{
			id: "sleep_quality",
			label: "Sleep Quality",
			polishLabel: "Jakość snu",
			icon: "😴",
		},
		{
			id: "physical_performance",
			label: "Physical Performance",
			polishLabel: "Wydolność fizyczna",
			icon: "💪",
		},
		{
			id: "neuroprotection",
			label: "Neuroprotection",
			polishLabel: "Neuroprotekcja",
			icon: "🛡️",
		},
		{
			id: "anti_aging",
			label: "Anti-Aging",
			polishLabel: "Anti-aging",
			icon: "⏳",
		},
		{
			id: "immune_support",
			label: "Immune Support",
			polishLabel: "Wsparcie odporności",
			icon: "🦠",
		},
	];

	const toggleHealthGoal = (goal: HealthGoal) => {
		setProfile((prev) => ({
			...prev,
			healthGoals: prev.healthGoals?.includes(goal)
				? prev.healthGoals.filter((g) => g !== goal)
				: [...(prev.healthGoals || []), goal],
		}));
	};

	const handleSubmit = () => {
		if (
			!profile.age ||
			!profile.gender ||
			!profile.healthGoals ||
			profile.healthGoals.length === 0
		) {
			return;
		}

		setShouldFetch(true);
	};

	const totalSteps = 4;
	const progress = (step / totalSteps) * 100;

	return (
		<div className="mx-auto w-full max-w-3xl space-y-6">
			{/* Progress Bar */}
			<div className="space-y-2">
				<div className="flex justify-between text-muted-foreground text-sm">
					<span>
						{language === "pl" ? "Krok" : "Step"} {step}{" "}
						{language === "pl" ? "z" : "of"} {totalSteps}
					</span>
					<span>{Math.round(progress)}%</span>
				</div>
				<Progress value={progress} className="h-2" />
			</div>

			{/* Step 1: Basic Info */}
			{step === 1 && (
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<User className="h-5 w-5 text-primary" />
							<CardTitle>
								{language === "pl"
									? "Podstawowe informacje"
									: "Basic Information"}
							</CardTitle>
						</div>
						<CardDescription>
							{language === "pl"
								? "Podaj podstawowe dane, aby dostosować rekomendacje"
								: "Provide basic information to personalize recommendations"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="age">
									{language === "pl" ? "Wiek" : "Age"}
								</Label>
								<Input
									id="age"
									type="number"
									min="13"
									max="120"
									value={profile.age || ""}
									onChange={(e) =>
										setProfile({
											...profile,
											age: Number.parseInt(e.target.value),
										})
									}
									placeholder="25"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="weight">
									{language === "pl" ? "Waga (kg)" : "Weight (kg)"} (
									{language === "pl" ? "opcjonalnie" : "optional"})
								</Label>
								<Input
									id="weight"
									type="number"
									min="30"
									max="300"
									value={profile.weight || ""}
									onChange={(e) =>
										setProfile({
											...profile,
											weight: Number.parseInt(e.target.value),
										})
									}
									placeholder="70"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label>{language === "pl" ? "Płeć" : "Gender"}</Label>
							<RadioGroup
								value={profile.gender}
								onValueChange={(value) =>
									setProfile({ ...profile, gender: value as any })
								}
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="male" id="male" />
									<Label htmlFor="male" className="cursor-pointer">
										{language === "pl" ? "Mężczyzna" : "Male"}
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="female" id="female" />
									<Label htmlFor="female" className="cursor-pointer">
										{language === "pl" ? "Kobieta" : "Female"}
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="other" id="other" />
									<Label htmlFor="other" className="cursor-pointer">
										{language === "pl" ? "Inna" : "Other"}
									</Label>
								</div>
							</RadioGroup>
						</div>

						<div className="space-y-2">
							<Label>
								{language === "pl"
									? "Poziom doświadczenia"
									: "Experience Level"}
							</Label>
							<RadioGroup
								value={profile.experienceLevel}
								onValueChange={(value) =>
									setProfile({ ...profile, experienceLevel: value as any })
								}
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="beginner" id="beginner" />
									<Label htmlFor="beginner" className="cursor-pointer">
										{language === "pl" ? "Początkujący" : "Beginner"}
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="intermediate" id="intermediate" />
									<Label htmlFor="intermediate" className="cursor-pointer">
										{language === "pl" ? "Średniozaawansowany" : "Intermediate"}
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="advanced" id="advanced" />
									<Label htmlFor="advanced" className="cursor-pointer">
										{language === "pl" ? "Zaawansowany" : "Advanced"}
									</Label>
								</div>
							</RadioGroup>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Step 2: Health Goals */}
			{step === 2 && (
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Target className="h-5 w-5 text-primary" />
							<CardTitle>
								{language === "pl" ? "Cele zdrowotne" : "Health Goals"}
							</CardTitle>
						</div>
						<CardDescription>
							{language === "pl"
								? "Wybierz 1-5 celów, które chcesz osiągnąć"
								: "Select 1-5 goals you want to achieve"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
							{healthGoals.map((goal) => (
								<button
									key={goal.id}
									onClick={() => toggleHealthGoal(goal.id)}
									className={`rounded-lg border-2 p-4 text-left transition-all ${
										profile.healthGoals?.includes(goal.id)
											? "border-primary bg-primary/5"
											: "border-border hover:border-primary/50"
									}`}
									disabled={
										!profile.healthGoals?.includes(goal.id) &&
										(profile.healthGoals?.length || 0) >= 5
									}
								>
									<div className="mb-2 text-2xl">{goal.icon}</div>
									<div className="font-medium text-sm">
										{language === "pl" ? goal.polishLabel : goal.label}
									</div>
								</button>
							))}
						</div>
						{profile.healthGoals && profile.healthGoals.length > 0 && (
							<div className="mt-4 text-muted-foreground text-sm">
								{language === "pl" ? "Wybrano:" : "Selected:"}{" "}
								{profile.healthGoals.length}/5
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Step 3: Safety Information */}
			{step === 3 && (
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Shield className="h-5 w-5 text-primary" />
							<CardTitle>
								{language === "pl"
									? "Informacje o bezpieczeństwie"
									: "Safety Information"}
							</CardTitle>
						</div>
						<CardDescription>
							{language === "pl"
								? "Pomóż nam zapewnić bezpieczne rekomendacje"
								: "Help us ensure safe recommendations"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="medications">
								{language === "pl"
									? "Przyjmowane leki (opcjonalnie)"
									: "Current Medications (optional)"}
							</Label>
							<Input
								id="medications"
								placeholder={
									language === "pl"
										? "np. Aspiryna, Metformina"
										: "e.g. Aspirin, Metformin"
								}
								value={profile.currentMedications?.join(", ") || ""}
								onChange={(e) =>
									setProfile({
										...profile,
										currentMedications: e.target.value
											.split(",")
											.map((s) => s.trim())
											.filter(Boolean),
									})
								}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="conditions">
								{language === "pl"
									? "Istniejące schorzenia (opcjonalnie)"
									: "Existing Conditions (optional)"}
							</Label>
							<Input
								id="conditions"
								placeholder={
									language === "pl"
										? "np. Cukrzyca, Nadciśnienie"
										: "e.g. Diabetes, Hypertension"
								}
								value={profile.existingConditions?.join(", ") || ""}
								onChange={(e) =>
									setProfile({
										...profile,
										existingConditions: e.target.value
											.split(",")
											.map((s) => s.trim())
											.filter(Boolean),
									})
								}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="allergies">
								{language === "pl"
									? "Alergie (opcjonalnie)"
									: "Allergies (optional)"}
							</Label>
							<Input
								id="allergies"
								placeholder={
									language === "pl"
										? "np. Orzechy, Gluten"
										: "e.g. Nuts, Gluten"
								}
								value={profile.allergies?.join(", ") || ""}
								onChange={(e) =>
									setProfile({
										...profile,
										allergies: e.target.value
											.split(",")
											.map((s) => s.trim())
											.filter(Boolean),
									})
								}
							/>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Step 4: Review & Submit */}
			{step === 4 && (
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Sparkles className="h-5 w-5 text-primary" />
							<CardTitle>
								{language === "pl" ? "Podsumowanie" : "Review"}
							</CardTitle>
						</div>
						<CardDescription>
							{language === "pl"
								? "Sprawdź swoje dane przed wygenerowaniem rekomendacji"
								: "Review your information before generating recommendations"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h4 className="mb-2 font-medium">
								{language === "pl" ? "Podstawowe dane" : "Basic Info"}
							</h4>
							<div className="space-y-1 text-muted-foreground text-sm">
								<p>
									{language === "pl" ? "Wiek:" : "Age:"} {profile.age}
								</p>
								<p>
									{language === "pl" ? "Płeć:" : "Gender:"} {profile.gender}
								</p>
								<p>
									{language === "pl" ? "Poziom:" : "Level:"}{" "}
									{profile.experienceLevel}
								</p>
							</div>
						</div>

						<div>
							<h4 className="mb-2 font-medium">
								{language === "pl" ? "Cele zdrowotne" : "Health Goals"}
							</h4>
							<div className="flex flex-wrap gap-2">
								{profile.healthGoals?.map((goalId) => {
									const goal = healthGoals.find((g) => g.id === goalId);
									return (
										<Badge key={goalId} variant="secondary">
											{goal?.icon}{" "}
											{language === "pl" ? goal?.polishLabel : goal?.label}
										</Badge>
									);
								})}
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Navigation */}
			<div className="flex justify-between">
				<Button
					variant="outline"
					onClick={() => setStep(step - 1)}
					disabled={step === 1}
				>
					<ChevronLeft className="mr-2 h-4 w-4" />
					{language === "pl" ? "Wstecz" : "Back"}
				</Button>

				{step < totalSteps ? (
					<Button
						onClick={() => setStep(step + 1)}
						disabled={
							(step === 1 && (!profile.age || !profile.gender)) ||
							(step === 2 &&
								(!profile.healthGoals || profile.healthGoals.length === 0))
						}
					>
						{language === "pl" ? "Dalej" : "Next"}
						<ChevronRight className="ml-2 h-4 w-4" />
					</Button>
				) : (
					<Button
						onClick={handleSubmit}
						disabled={recommendationsQuery.isLoading || shouldFetch}
					>
						{recommendationsQuery.isLoading || shouldFetch ? (
							language === "pl" ? (
								"Generuję..."
							) : (
								"Generating..."
							)
						) : (
							<>
								<Sparkles className="mr-2 h-4 w-4" />
								{language === "pl"
									? "Generuj rekomendacje"
									: "Generate Recommendations"}
							</>
						)}
					</Button>
				)}
			</div>
		</div>
	);
}
