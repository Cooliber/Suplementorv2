"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
	AlertCircle,
	ArrowLeft,
	ArrowRight,
	Brain,
	CheckCircle,
	Dumbbell,
	Heart,
	Moon,
	Pill,
	Plus,
	Save,
	Settings,
	Target,
	Trash2,
	User,
	Utensils,
} from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";

interface HealthGoal {
	id: string;
	category:
		| "COGNITIVE"
		| "PHYSICAL"
		| "MENTAL"
		| "LONGEVITY"
		| "PERFORMANCE"
		| "RECOVERY";
	polishCategory: string;
	goal: string;
	polishGoal: string;
	priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
	polishPriority: string;
	targetTimeframe: string;
	polishTargetTimeframe: string;
	isActive: boolean;
}

interface MedicalCondition {
	condition: string;
	polishCondition: string;
	severity: "MILD" | "MODERATE" | "SEVERE";
	polishSeverity: string;
	diagnosedDate: Date;
	isActive: boolean;
}

interface UserHealthProfile {
	demographics: {
		age: number;
		gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
		weight: number;
		height: number;
		activityLevel:
			| "SEDENTARY"
			| "LIGHTLY_ACTIVE"
			| "MODERATELY_ACTIVE"
			| "VERY_ACTIVE"
			| "EXTREMELY_ACTIVE";
		sleepHours: number;
		stressLevel: number;
	};
	healthGoals: HealthGoal[];
	medicalHistory: {
		conditions: MedicalCondition[];
		allergies: Array<{
			allergen: string;
			polishAllergen: string;
			severity: "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING";
			polishSeverity: string;
		}>;
		medications: Array<{
			name: string;
			polishName: string;
			dosage: string;
			frequency: string;
			polishFrequency: string;
		}>;
	};
	lifestyle: {
		diet: {
			type:
				| "OMNIVORE"
				| "VEGETARIAN"
				| "VEGAN"
				| "KETO"
				| "PALEO"
				| "MEDITERRANEAN"
				| "OTHER";
			polishType: string;
			restrictions: string[];
			polishRestrictions: string[];
		};
		exercise: {
			types: string[];
			polishTypes: string[];
			frequency: number;
			intensity: "LOW" | "MODERATE" | "HIGH" | "VARIABLE";
			polishIntensity: string;
		};
		sleep: {
			averageHours: number;
			quality: number;
			issues: string[];
			polishIssues: string[];
		};
		stress: {
			level: number;
			sources: string[];
			polishSources: string[];
		};
	};
	cognitiveProfile: {
		strengths: string[];
		polishStrengths: string[];
		weaknesses: string[];
		polishWeaknesses: string[];
		learningStyle: "VISUAL" | "AUDITORY" | "KINESTHETIC" | "MIXED";
		polishLearningStyle: string;
		attentionSpan: number;
	};
	preferences: {
		supplementForms: Array<
			"CAPSULE" | "TABLET" | "POWDER" | "LIQUID" | "GUMMY" | "SUBLINGUAL"
		>;
		polishSupplementForms: string[];
		budgetRange: {
			min: number;
			max: number;
			currency: string;
			period: "MONTHLY" | "QUARTERLY" | "YEARLY";
			polishPeriod: string;
		};
		avoidIngredients: string[];
		polishAvoidIngredients: string[];
	};
}

interface HealthProfileSetupProps {
	initialProfile?: Partial<UserHealthProfile>;
	onProfileUpdate: (profile: UserHealthProfile) => void;
	onComplete: (profile: UserHealthProfile) => void;
	className?: string;
}

const HealthProfileSetup: React.FC<HealthProfileSetupProps> = ({
	initialProfile,
	onProfileUpdate,
	onComplete,
	className = "",
}) => {
	const [currentStep, setCurrentStep] = useState(0);
	const [profile, setProfile] = useState<UserHealthProfile>({
		demographics: {
			age: 0,
			gender: "PREFER_NOT_TO_SAY",
			weight: 0,
			height: 0,
			activityLevel: "MODERATELY_ACTIVE",
			sleepHours: 8,
			stressLevel: 5,
		},
		healthGoals: [],
		medicalHistory: {
			conditions: [],
			allergies: [],
			medications: [],
		},
		lifestyle: {
			diet: {
				type: "OMNIVORE",
				polishType: "Wszystkożerny",
				restrictions: [],
				polishRestrictions: [],
			},
			exercise: {
				types: [],
				polishTypes: [],
				frequency: 3,
				intensity: "MODERATE",
				polishIntensity: "Umiarkowana",
			},
			sleep: {
				averageHours: 8,
				quality: 7,
				issues: [],
				polishIssues: [],
			},
			stress: {
				level: 5,
				sources: [],
				polishSources: [],
			},
		},
		cognitiveProfile: {
			strengths: [],
			polishStrengths: [],
			weaknesses: [],
			polishWeaknesses: [],
			learningStyle: "MIXED",
			polishLearningStyle: "Mieszany",
			attentionSpan: 30,
		},
		preferences: {
			supplementForms: ["CAPSULE"],
			polishSupplementForms: ["Kapsułki"],
			budgetRange: {
				min: 50,
				max: 200,
				currency: "EUR",
				period: "MONTHLY",
				polishPeriod: "Miesięcznie",
			},
			avoidIngredients: [],
			polishAvoidIngredients: [],
		},
		...initialProfile,
	});

	const steps = [
		{
			id: "demographics",
			title: "Dane podstawowe",
			icon: <User className="h-4 w-4" />,
		},
		{
			id: "goals",
			title: "Cele zdrowotne",
			icon: <Target className="h-4 w-4" />,
		},
		{
			id: "medical",
			title: "Historia medyczna",
			icon: <Heart className="h-4 w-4" />,
		},
		{
			id: "lifestyle",
			title: "Styl życia",
			icon: <Dumbbell className="h-4 w-4" />,
		},
		{
			id: "cognitive",
			title: "Profil poznawczy",
			icon: <Brain className="h-4 w-4" />,
		},
		{
			id: "preferences",
			title: "Preferencje",
			icon: <Settings className="h-4 w-4" />,
		},
	];

	const progress = ((currentStep + 1) / steps.length) * 100;

	const updateProfile = useCallback(
		(updates: Partial<UserHealthProfile>) => {
			const newProfile = { ...profile, ...updates };
			setProfile(newProfile);
			onProfileUpdate(newProfile);
		},
		[profile, onProfileUpdate],
	);

	const addHealthGoal = () => {
		const newGoal: HealthGoal = {
			id: `goal_${Date.now()}`,
			category: "COGNITIVE",
			polishCategory: "Poznawcze",
			goal: "",
			polishGoal: "",
			priority: "MEDIUM",
			polishPriority: "Średni",
			targetTimeframe: "3 months",
			polishTargetTimeframe: "3 miesiące",
			isActive: true,
		};

		updateProfile({
			healthGoals: [...profile.healthGoals, newGoal],
		});
	};

	const updateHealthGoal = (goalId: string, updates: Partial<HealthGoal>) => {
		const updatedGoals = profile.healthGoals.map((goal) =>
			goal.id === goalId ? { ...goal, ...updates } : goal,
		);
		updateProfile({ healthGoals: updatedGoals });
	};

	const removeHealthGoal = (goalId: string) => {
		const updatedGoals = profile.healthGoals.filter(
			(goal) => goal.id !== goalId,
		);
		updateProfile({ healthGoals: updatedGoals });
	};

	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			onComplete(profile);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const isStepValid = () => {
		switch (currentStep) {
			case 0: // Demographics
				return (
					profile.demographics.age > 0 &&
					profile.demographics.weight > 0 &&
					profile.demographics.height > 0
				);
			case 1: // Goals
				return (
					profile.healthGoals.length > 0 &&
					profile.healthGoals.some((goal) => goal.polishGoal.trim() !== "")
				);
			case 2: // Medical
				return true; // Optional step
			case 3: // Lifestyle
				return true; // Has defaults
			case 4: // Cognitive
				return true; // Has defaults
			case 5: // Preferences
				return (
					profile.preferences.budgetRange.min > 0 &&
					profile.preferences.budgetRange.max > 0
				);
			default:
				return true;
		}
	};

	const renderDemographicsStep = () => (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<Label htmlFor="age">Wiek</Label>
					<Input
						id="age"
						type="number"
						min="13"
						max="120"
						value={profile.demographics.age || ""}
						onChange={(e) =>
							updateProfile({
								demographics: {
									...profile.demographics,
									age: Number.parseInt(e.target.value) || 0,
								},
							})
						}
						placeholder="np. 30"
					/>
				</div>

				<div>
					<Label htmlFor="gender">Płeć</Label>
					<Select
						value={profile.demographics.gender}
						onValueChange={(value: any) =>
							updateProfile({
								demographics: { ...profile.demographics, gender: value },
							})
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="MALE">Mężczyzna</SelectItem>
							<SelectItem value="FEMALE">Kobieta</SelectItem>
							<SelectItem value="OTHER">Inna</SelectItem>
							<SelectItem value="PREFER_NOT_TO_SAY">
								Wolę nie podawać
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label htmlFor="weight">Waga (kg)</Label>
					<Input
						id="weight"
						type="number"
						min="30"
						max="300"
						value={profile.demographics.weight || ""}
						onChange={(e) =>
							updateProfile({
								demographics: {
									...profile.demographics,
									weight: Number.parseInt(e.target.value) || 0,
								},
							})
						}
						placeholder="np. 70"
					/>
				</div>

				<div>
					<Label htmlFor="height">Wzrost (cm)</Label>
					<Input
						id="height"
						type="number"
						min="100"
						max="250"
						value={profile.demographics.height || ""}
						onChange={(e) =>
							updateProfile({
								demographics: {
									...profile.demographics,
									height: Number.parseInt(e.target.value) || 0,
								},
							})
						}
						placeholder="np. 175"
					/>
				</div>
			</div>

			<div>
				<Label htmlFor="activity-level">Poziom aktywności</Label>
				<Select
					value={profile.demographics.activityLevel}
					onValueChange={(value: any) =>
						updateProfile({
							demographics: { ...profile.demographics, activityLevel: value },
						})
					}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="SEDENTARY">Siedzący tryb życia</SelectItem>
						<SelectItem value="LIGHTLY_ACTIVE">Lekko aktywny</SelectItem>
						<SelectItem value="MODERATELY_ACTIVE">
							Umiarkowanie aktywny
						</SelectItem>
						<SelectItem value="VERY_ACTIVE">Bardzo aktywny</SelectItem>
						<SelectItem value="EXTREMELY_ACTIVE">
							Ekstremalnie aktywny
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<Label htmlFor="sleep-hours">Godziny snu dziennie</Label>
					<Input
						id="sleep-hours"
						type="number"
						min="3"
						max="12"
						value={profile.demographics.sleepHours}
						onChange={(e) =>
							updateProfile({
								demographics: {
									...profile.demographics,
									sleepHours: Number.parseInt(e.target.value) || 8,
								},
							})
						}
					/>
				</div>

				<div>
					<Label htmlFor="stress-level">Poziom stresu (1-10)</Label>
					<Input
						id="stress-level"
						type="number"
						min="1"
						max="10"
						value={profile.demographics.stressLevel}
						onChange={(e) =>
							updateProfile({
								demographics: {
									...profile.demographics,
									stressLevel: Number.parseInt(e.target.value) || 5,
								},
							})
						}
					/>
				</div>
			</div>
		</div>
	);

	const renderGoalsStep = () => (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="font-medium text-lg">Twoje cele zdrowotne</h3>
				<Button onClick={addHealthGoal} size="sm">
					<Plus className="mr-1 h-3 w-3" />
					Dodaj cel
				</Button>
			</div>

			{profile.healthGoals.length === 0 ? (
				<div className="py-8 text-center text-gray-500">
					<Target className="mx-auto mb-4 h-12 w-12 text-gray-400" />
					<p>Dodaj swój pierwszy cel zdrowotny</p>
				</div>
			) : (
				<div className="space-y-4">
					{profile.healthGoals.map((goal) => (
						<Card key={goal.id} className="p-4">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Select
										value={goal.category}
										onValueChange={(value: string) =>
											updateHealthGoal(goal.id, {
												category: value as any,
												polishCategory:
													(
														{
															COGNITIVE: "Poznawcze",
															PHYSICAL: "Fizyczne",
															MENTAL: "Psychiczne",
															LONGEVITY: "Długowieczność",
															PERFORMANCE: "Wydajność",
															RECOVERY: "Regeneracja",
														} as Record<string, string>
													)[value] || value,
											})
										}
									>
										<SelectTrigger className="w-48">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="COGNITIVE">Poznawcze</SelectItem>
											<SelectItem value="PHYSICAL">Fizyczne</SelectItem>
											<SelectItem value="MENTAL">Psychiczne</SelectItem>
											<SelectItem value="LONGEVITY">Długowieczność</SelectItem>
											<SelectItem value="PERFORMANCE">Wydajność</SelectItem>
											<SelectItem value="RECOVERY">Regeneracja</SelectItem>
										</SelectContent>
									</Select>

									<Button
										variant="outline"
										size="sm"
										onClick={() => removeHealthGoal(goal.id)}
									>
										<Trash2 className="h-3 w-3" />
									</Button>
								</div>

								<div>
									<Label>Opis celu</Label>
									<Textarea
										value={goal.polishGoal}
										onChange={(e) =>
											updateHealthGoal(goal.id, {
												polishGoal: e.target.value,
												goal: e.target.value, // For now, same as Polish
											})
										}
										placeholder="np. Poprawa koncentracji i pamięci roboczej"
										className="mt-1"
									/>
								</div>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<Label>Priorytet</Label>
										<Select
											value={goal.priority}
											onValueChange={(value: string) =>
												updateHealthGoal(goal.id, {
													priority: value as any,
													polishPriority:
														(
															{
																LOW: "Niski",
																MEDIUM: "Średni",
																HIGH: "Wysoki",
																CRITICAL: "Krytyczny",
															} as Record<string, string>
														)[value] || value,
												})
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="LOW">Niski</SelectItem>
												<SelectItem value="MEDIUM">Średni</SelectItem>
												<SelectItem value="HIGH">Wysoki</SelectItem>
												<SelectItem value="CRITICAL">Krytyczny</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label>Czas realizacji</Label>
										<Select
											value={goal.polishTargetTimeframe}
											onValueChange={(value) =>
												updateHealthGoal(goal.id, {
													polishTargetTimeframe: value,
													targetTimeframe: value, // For now, same as Polish
												})
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="1 miesiąc">1 miesiąc</SelectItem>
												<SelectItem value="3 miesiące">3 miesiące</SelectItem>
												<SelectItem value="6 miesięcy">6 miesięcy</SelectItem>
												<SelectItem value="1 rok">1 rok</SelectItem>
												<SelectItem value="Długoterminowy">
													Długoterminowy
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);

	const renderMedicalStep = () => (
		<div className="space-y-6">
			<div className="text-center text-gray-600">
				<Heart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
				<h3 className="mb-2 font-medium text-lg">Historia medyczna</h3>
				<p>
					Te informacje pomogą nam lepiej dostosować rekomendacje do Twojego
					stanu zdrowia
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<Card className="p-4">
					<h4 className="mb-3 font-medium">Alergie</h4>
					<p className="mb-3 text-gray-600 text-sm">
						Podaj substancje, na które jesteś uczulony/a
					</p>
					<Textarea
						placeholder="np. orzechy, gluten, laktoza..."
						className="min-h-20"
					/>
				</Card>

				<Card className="p-4">
					<h4 className="mb-3 font-medium">Przyjmowane leki</h4>
					<p className="mb-3 text-gray-600 text-sm">
						Lista leków, które obecnie przyjmujesz
					</p>
					<Textarea
						placeholder="np. metformina, aspiryna..."
						className="min-h-20"
					/>
				</Card>
			</div>

			<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
				<div className="flex items-start gap-3">
					<AlertCircle className="mt-0.5 h-5 w-5 text-blue-600" />
					<div>
						<h4 className="font-medium text-blue-800">Ważne</h4>
						<p className="text-blue-700 text-sm">
							Te informacje są poufne i będą używane wyłącznie do personalizacji
							rekomendacji. Zawsze skonsultuj się z lekarzem przed rozpoczęciem
							suplementacji.
						</p>
					</div>
				</div>
			</div>
		</div>
	);

	const renderLifestyleStep = () => (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<Card className="p-4">
					<h4 className="mb-3 flex items-center gap-2 font-medium">
						<Utensils className="h-4 w-4" />
						Dieta
					</h4>

					<div className="space-y-3">
						<div>
							<Label>Typ diety</Label>
							<Select
								value={profile.lifestyle.diet.type}
								onValueChange={(value: any) =>
									updateProfile({
										lifestyle: {
											...profile.lifestyle,
											diet: {
												...profile.lifestyle.diet,
												type: value,
												polishType:
													(
														{
															OMNIVORE: "Wszystkożerny",
															VEGETARIAN: "Wegetariański",
															VEGAN: "Wegański",
															KETO: "Ketogeniczny",
															PALEO: "Paleo",
															MEDITERRANEAN: "Śródziemnomorski",
															OTHER: "Inny",
														} as Record<string, string>
													)[value] || value,
											},
										},
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="OMNIVORE">Wszystkożerny</SelectItem>
									<SelectItem value="VEGETARIAN">Wegetariański</SelectItem>
									<SelectItem value="VEGAN">Wegański</SelectItem>
									<SelectItem value="KETO">Ketogeniczny</SelectItem>
									<SelectItem value="PALEO">Paleo</SelectItem>
									<SelectItem value="MEDITERRANEAN">
										Śródziemnomorski
									</SelectItem>
									<SelectItem value="OTHER">Inny</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</Card>

				<Card className="p-4">
					<h4 className="mb-3 flex items-center gap-2 font-medium">
						<Dumbbell className="h-4 w-4" />
						Aktywność fizyczna
					</h4>

					<div className="space-y-3">
						<div>
							<Label>Częstotliwość (razy w tygodniu)</Label>
							<Input
								type="number"
								min="0"
								max="14"
								value={profile.lifestyle.exercise.frequency}
								onChange={(e) =>
									updateProfile({
										lifestyle: {
											...profile.lifestyle,
											exercise: {
												...profile.lifestyle.exercise,
												frequency: Number.parseInt(e.target.value) || 0,
											},
										},
									})
								}
							/>
						</div>

						<div>
							<Label>Intensywność</Label>
							<Select
								value={profile.lifestyle.exercise.intensity}
								onValueChange={(value: any) =>
									updateProfile({
										lifestyle: {
											...profile.lifestyle,
											exercise: {
												...profile.lifestyle.exercise,
												intensity: value,
												polishIntensity:
													(
														{
															LOW: "Niska",
															MODERATE: "Umiarkowana",
															HIGH: "Wysoka",
															VARIABLE: "Zmienna",
														} as Record<string, string>
													)[value] || value,
											},
										},
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="LOW">Niska</SelectItem>
									<SelectItem value="MODERATE">Umiarkowana</SelectItem>
									<SelectItem value="HIGH">Wysoka</SelectItem>
									<SelectItem value="VARIABLE">Zmienna</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</Card>

				<Card className="p-4">
					<h4 className="mb-3 flex items-center gap-2 font-medium">
						<Moon className="h-4 w-4" />
						Sen
					</h4>

					<div className="space-y-3">
						<div>
							<Label>Średnia liczba godzin snu</Label>
							<Input
								type="number"
								min="3"
								max="12"
								step="0.5"
								value={profile.lifestyle.sleep.averageHours}
								onChange={(e) =>
									updateProfile({
										lifestyle: {
											...profile.lifestyle,
											sleep: {
												...profile.lifestyle.sleep,
												averageHours: Number.parseFloat(e.target.value) || 8,
											},
										},
									})
								}
							/>
						</div>

						<div>
							<Label>Jakość snu (1-10)</Label>
							<Input
								type="number"
								min="1"
								max="10"
								value={profile.lifestyle.sleep.quality}
								onChange={(e) =>
									updateProfile({
										lifestyle: {
											...profile.lifestyle,
											sleep: {
												...profile.lifestyle.sleep,
												quality: Number.parseInt(e.target.value) || 7,
											},
										},
									})
								}
							/>
						</div>
					</div>
				</Card>

				<Card className="p-4">
					<h4 className="mb-3 font-medium">Stres</h4>

					<div className="space-y-3">
						<div>
							<Label>Poziom stresu (1-10)</Label>
							<Input
								type="number"
								min="1"
								max="10"
								value={profile.lifestyle.stress.level}
								onChange={(e) =>
									updateProfile({
										lifestyle: {
											...profile.lifestyle,
											stress: {
												...profile.lifestyle.stress,
												level: Number.parseInt(e.target.value) || 5,
											},
										},
									})
								}
							/>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);

	const renderCognitiveStep = () => (
		<div className="space-y-6">
			<div className="text-center">
				<Brain className="mx-auto mb-4 h-12 w-12 text-blue-600" />
				<h3 className="mb-2 font-medium text-lg">Profil poznawczy</h3>
				<p className="text-gray-600">
					Pomóż nam zrozumieć Twoje mocne strony i obszary do poprawy
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<Label>Styl uczenia się</Label>
					<Select
						value={profile.cognitiveProfile.learningStyle}
						onValueChange={(value: any) =>
							updateProfile({
								cognitiveProfile: {
									...profile.cognitiveProfile,
									learningStyle: value,
									polishLearningStyle:
										(
											{
												VISUAL: "Wzrokowy",
												AUDITORY: "Słuchowy",
												KINESTHETIC: "Kinestetyczny",
												MIXED: "Mieszany",
											} as Record<string, string>
										)[value] || value,
								},
							})
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="VISUAL">Wzrokowy</SelectItem>
							<SelectItem value="AUDITORY">Słuchowy</SelectItem>
							<SelectItem value="KINESTHETIC">Kinestetyczny</SelectItem>
							<SelectItem value="MIXED">Mieszany</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label>Czas koncentracji (minuty)</Label>
					<Input
						type="number"
						min="5"
						max="180"
						value={profile.cognitiveProfile.attentionSpan}
						onChange={(e) =>
							updateProfile({
								cognitiveProfile: {
									...profile.cognitiveProfile,
									attentionSpan: Number.parseInt(e.target.value) || 30,
								},
							})
						}
					/>
				</div>
			</div>
		</div>
	);

	const renderPreferencesStep = () => (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<Card className="p-4">
					<h4 className="mb-3 font-medium">Budżet miesięczny</h4>

					<div className="space-y-3">
						<div>
							<Label>Minimum (EUR)</Label>
							<Input
								type="number"
								min="0"
								value={profile.preferences.budgetRange.min}
								onChange={(e) =>
									updateProfile({
										preferences: {
											...profile.preferences,
											budgetRange: {
												...profile.preferences.budgetRange,
												min: Number.parseInt(e.target.value) || 0,
											},
										},
									})
								}
							/>
						</div>

						<div>
							<Label>Maksimum (EUR)</Label>
							<Input
								type="number"
								min="0"
								value={profile.preferences.budgetRange.max}
								onChange={(e) =>
									updateProfile({
										preferences: {
											...profile.preferences,
											budgetRange: {
												...profile.preferences.budgetRange,
												max: Number.parseInt(e.target.value) || 0,
											},
										},
									})
								}
							/>
						</div>
					</div>
				</Card>

				<Card className="p-4">
					<h4 className="mb-3 font-medium">Preferowane formy</h4>

					<div className="space-y-2">
						{[
							{ value: "CAPSULE", label: "Kapsułki" },
							{ value: "TABLET", label: "Tabletki" },
							{ value: "POWDER", label: "Proszek" },
							{ value: "LIQUID", label: "Płyn" },
							{ value: "GUMMY", label: "Żelki" },
							{ value: "SUBLINGUAL", label: "Podjęzykowe" },
						].map((form) => (
							<div key={form.value} className="flex items-center space-x-2">
								<Checkbox
									id={form.value}
									checked={profile.preferences.supplementForms.includes(
										form.value as any,
									)}
									onCheckedChange={(checked) => {
										const forms = checked
											? [
													...profile.preferences.supplementForms,
													form.value as any,
												]
											: profile.preferences.supplementForms.filter(
													(f) => f !== form.value,
												);

										updateProfile({
											preferences: {
												...profile.preferences,
												supplementForms: forms,
												polishSupplementForms: forms.map((f) => {
													const mapping = {
														CAPSULE: "Kapsułki",
														TABLET: "Tabletki",
														POWDER: "Proszek",
														LIQUID: "Płyn",
														GUMMY: "Żelki",
														SUBLINGUAL: "Podjęzykowe",
													};
													return mapping[f as keyof typeof mapping] || f;
												}),
											},
										});
									}}
								/>
								<Label htmlFor={form.value} className="text-sm">
									{form.label}
								</Label>
							</div>
						))}
					</div>
				</Card>
			</div>
		</div>
	);

	const renderCurrentStep = () => {
		switch (currentStep) {
			case 0:
				return renderDemographicsStep();
			case 1:
				return renderGoalsStep();
			case 2:
				return renderMedicalStep();
			case 3:
				return renderLifestyleStep();
			case 4:
				return renderCognitiveStep();
			case 5:
				return renderPreferencesStep();
			default:
				return null;
		}
	};

	return (
		<div className={cn("mx-auto w-full max-w-4xl space-y-6", className)}>
			{/* Progress Header */}
			<Card>
				<CardHeader>
					<div className="mb-4 flex items-center justify-between">
						<CardTitle>Konfiguracja profilu zdrowotnego</CardTitle>
						<Badge variant="outline">
							Krok {currentStep + 1} z {steps.length}
						</Badge>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span>Postęp</span>
							<span>{Math.round(progress)}%</span>
						</div>
						<Progress value={progress} className="h-2" />
					</div>

					<div className="mt-4 flex items-center justify-center">
						<div className="flex items-center space-x-2">
							{steps.map((step, index) => (
								<div
									key={step.id}
									className={cn(
										"flex h-8 w-8 items-center justify-center rounded-full font-medium text-xs",
										index <= currentStep
											? "bg-blue-600 text-white"
											: "bg-gray-200 text-gray-600",
									)}
								>
									{index < currentStep ? (
										<CheckCircle className="h-4 w-4" />
									) : (
										step.icon
									)}
								</div>
							))}
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Current Step Content */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{steps[currentStep]?.icon}
						{steps[currentStep]?.title}
					</CardTitle>
				</CardHeader>
				<CardContent>{renderCurrentStep()}</CardContent>
			</Card>

			{/* Navigation */}
			<div className="flex items-center justify-between">
				<Button
					variant="outline"
					onClick={handlePrevious}
					disabled={currentStep === 0}
				>
					<ArrowLeft className="mr-1 h-3 w-3" />
					Poprzedni
				</Button>

				<Button onClick={handleNext} disabled={!isStepValid()}>
					{currentStep === steps.length - 1 ? (
						<>
							<Save className="mr-1 h-3 w-3" />
							Zakończ
						</>
					) : (
						<>
							Następny
							<ArrowRight className="ml-1 h-3 w-3" />
						</>
					)}
				</Button>
			</div>
		</div>
	);
};

export default HealthProfileSetup;
