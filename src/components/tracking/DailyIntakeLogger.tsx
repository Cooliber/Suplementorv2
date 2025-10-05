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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertCircle,
	Brain,
	Calendar,
	CheckCircle,
	Clock,
	Frown,
	Meh,
	Minus,
	Pill,
	Plus,
	Save,
	Smile,
	Utensils,
	Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Validation schema
const IntakeLogSchema = z.object({
	supplementId: z.string().min(1, "Wybierz suplement"),
	dosage: z.object({
		amount: z.number().positive("Podaj prawidłową dawkę"),
		unit: z.string().min(1, "Wybierz jednostkę"),
		form: z.enum(["capsule", "tablet", "powder", "liquid", "gummy"]),
	}),
	timing: z.object({
		timestamp: z.date(),
		timeOfDay: z.enum(["morning", "afternoon", "evening", "night"]),
		withFood: z.boolean(),
		mealTiming: z.enum(["before", "with", "after", "empty_stomach"]),
	}),
	context: z.object({
		mood: z.number().int().min(1).max(5),
		energy: z.number().int().min(1).max(5),
		stress: z.number().int().min(1).max(5),
		sleep: z.number().int().min(1).max(5),
		notes: z.string().optional(),
		weather: z.string().optional(),
		exercise: z.boolean(),
		alcohol: z.boolean(),
		otherMedications: z.array(z.string()),
	}),
	adherence: z.object({
		planned: z.boolean(),
		missed: z.boolean(),
		reason: z.string().optional(),
		reminderUsed: z.boolean(),
	}),
	sideEffects: z.object({
		experienced: z.boolean(),
		effects: z.array(
			z.object({
				type: z.string(),
				severity: z.number().int().min(1).max(5),
				onset: z.string(),
				duration: z.string().optional(),
				description: z.string().optional(),
			}),
		),
		severity: z.enum(["mild", "moderate", "severe"]),
		duration: z.string().optional(),
	}),
});

type IntakeLogFormData = z.infer<typeof IntakeLogSchema>;

interface SupplementOption {
	id: string;
	name: string;
	polishName: string;
	category: string;
	recommendedDosage: string;
	forms: string[];
}

interface DailyIntakeLoggerProps {
	supplements: SupplementOption[];
	onSubmit: (data: IntakeLogFormData) => Promise<void>;
	onSaveDraft: (data: Partial<IntakeLogFormData>) => void;
	defaultValues?: Partial<IntakeLogFormData>;
	className?: string;
}

const DailyIntakeLogger: React.FC<DailyIntakeLoggerProps> = ({
	supplements,
	onSubmit,
	onSaveDraft,
	defaultValues,
	className = "",
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSideEffects, setShowSideEffects] = useState(false);
	const [sideEffectsList, setSideEffectsList] = useState<
		Array<{
			type: string;
			severity: number;
			onset: string;
			duration?: string;
			description?: string;
		}>
	>([]);

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isValid },
		reset,
	} = useForm<IntakeLogFormData>({
		resolver: zodResolver(IntakeLogSchema),
		defaultValues: {
			timing: {
				timestamp: new Date(),
				timeOfDay: "morning",
				withFood: false,
				mealTiming: "empty_stomach",
			},
			context: {
				mood: 3,
				energy: 3,
				stress: 3,
				sleep: 3,
				notes: "",
				weather: "",
				exercise: false,
				alcohol: false,
				otherMedications: [],
			},
			adherence: {
				planned: true,
				missed: false,
				reason: "",
				reminderUsed: false,
			},
			sideEffects: {
				experienced: false,
				effects: [],
				severity: "mild",
				duration: "",
			},
			...defaultValues,
		},
	});

	const selectedSupplementId = watch("supplementId");
	const selectedSupplement = supplements.find(
		(s) => s.id === selectedSupplementId,
	);

	const timeOfDayOptions = [
		{ value: "morning", label: "Rano", icon: "🌅" },
		{ value: "afternoon", label: "Po południu", icon: "☀️" },
		{ value: "evening", label: "Wieczorem", icon: "🌆" },
		{ value: "night", label: "W nocy", icon: "🌙" },
	];

	const mealTimingOptions = [
		{ value: "before", label: "Przed posiłkiem" },
		{ value: "with", label: "Z posiłkiem" },
		{ value: "after", label: "Po posiłku" },
		{ value: "empty_stomach", label: "Na czczo" },
	];

	const formOptions = [
		{ value: "capsule", label: "Kapsułka" },
		{ value: "tablet", label: "Tabletka" },
		{ value: "powder", label: "Proszek" },
		{ value: "liquid", label: "Płyn" },
		{ value: "gummy", label: "Żelki" },
	];

	const unitOptions = [
		{ value: "mg", label: "mg" },
		{ value: "g", label: "g" },
		{ value: "mcg", label: "mcg" },
		{ value: "IU", label: "IU" },
		{ value: "ml", label: "ml" },
		{ value: "sztuki", label: "sztuki" },
	];

	const commonSideEffects = [
		"Ból głowy",
		"Nudności",
		"Zawroty głowy",
		"Zmęczenie",
		"Bezsenność",
		"Podrażnienie żołądka",
		"Wysypka",
		"Biegunka",
		"Zaparcia",
		"Niepokój",
	];

	const getMoodIcon = (value: number) => {
		if (value <= 2) return <Frown className="h-4 w-4 text-red-500" />;
		if (value <= 3) return <Meh className="h-4 w-4 text-yellow-500" />;
		return <Smile className="h-4 w-4 text-green-500" />;
	};

	const getEnergyIcon = (value: number) => {
		return (
			<Zap
				className={cn("h-4 w-4", {
					"text-red-500": value <= 2,
					"text-yellow-500": value === 3,
					"text-green-500": value >= 4,
				})}
			/>
		);
	};

	const addSideEffect = useCallback(() => {
		setSideEffectsList((prev) => [
			...prev,
			{
				type: "",
				severity: 1,
				onset: "",
				duration: "",
				description: "",
			},
		]);
	}, []);

	const removeSideEffect = useCallback((index: number) => {
		setSideEffectsList((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const updateSideEffect = useCallback(
		(index: number, field: string, value: any) => {
			setSideEffectsList((prev) =>
				prev.map((effect, i) =>
					i === index ? { ...effect, [field]: value } : effect,
				),
			);
		},
		[],
	);

	const handleFormSubmit = async (data: IntakeLogFormData) => {
		setIsSubmitting(true);
		try {
			// Add side effects to form data
			data.sideEffects.effects = sideEffectsList;
			await onSubmit(data);
			reset();
			setSideEffectsList([]);
			setShowSideEffects(false);
		} catch (error) {
			console.error("Error submitting intake log:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSaveDraft = useCallback(() => {
		const currentData = watch();
		onSaveDraft({
			...currentData,
			sideEffects: { ...currentData.sideEffects, effects: sideEffectsList },
		});
	}, [watch, onSaveDraft, sideEffectsList]);

	return (
		<Card className={cn("mx-auto w-full max-w-4xl", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Pill className="h-5 w-5" />
					Dziennik przyjmowania suplementów
				</CardTitle>
				<p className="text-gray-600 text-sm">
					Zapisz szczegóły przyjęcia suplementu i swoje samopoczucie
				</p>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
					{/* Supplement Selection */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<Label htmlFor="supplement">Suplement *</Label>
							<Controller
								name="supplementId"
								control={control}
								render={({ field }) => (
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger>
											<SelectValue placeholder="Wybierz suplement" />
										</SelectTrigger>
										<SelectContent>
											{supplements.map((supplement) => (
												<SelectItem key={supplement.id} value={supplement.id}>
													<div className="flex items-center gap-2">
														<span>{supplement.polishName}</span>
														<Badge variant="outline" className="text-xs">
															{supplement.category}
														</Badge>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							{errors.supplementId && (
								<p className="mt-1 text-red-600 text-sm">
									{errors.supplementId.message}
								</p>
							)}
						</div>

						<div>
							<Label htmlFor="timestamp">Data i godzina *</Label>
							<Controller
								name="timing.timestamp"
								control={control}
								render={({ field }) => (
									<Input
										type="datetime-local"
										value={
											field.value
												? new Date(
														field.value.getTime() -
															field.value.getTimezoneOffset() * 60000,
													)
														.toISOString()
														.slice(0, 16)
												: ""
										}
										onChange={(e) => field.onChange(new Date(e.target.value))}
									/>
								)}
							/>
						</div>
					</div>

					{/* Dosage Information */}
					<div className="space-y-4">
						<h3 className="flex items-center gap-2 font-medium text-lg">
							<Pill className="h-4 w-4" />
							Dawkowanie
						</h3>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<div>
								<Label htmlFor="amount">Ilość *</Label>
								<Controller
									name="dosage.amount"
									control={control}
									render={({ field }) => (
										<Input
											type="number"
											step="0.1"
											placeholder="np. 500"
											value={field.value || ""}
											onChange={(e) =>
												field.onChange(Number.parseFloat(e.target.value) || 0)
											}
										/>
									)}
								/>
								{errors.dosage?.amount && (
									<p className="mt-1 text-red-600 text-sm">
										{errors.dosage.amount.message}
									</p>
								)}
							</div>

							<div>
								<Label htmlFor="unit">Jednostka *</Label>
								<Controller
									name="dosage.unit"
									control={control}
									render={({ field }) => (
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder="Wybierz jednostkę" />
											</SelectTrigger>
											<SelectContent>
												{unitOptions.map((unit) => (
													<SelectItem key={unit.value} value={unit.value}>
														{unit.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							</div>

							<div>
								<Label htmlFor="form">Forma *</Label>
								<Controller
									name="dosage.form"
									control={control}
									render={({ field }) => (
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder="Wybierz formę" />
											</SelectTrigger>
											<SelectContent>
												{formOptions.map((form) => (
													<SelectItem key={form.value} value={form.value}>
														{form.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							</div>
						</div>

						{selectedSupplement && (
							<div className="rounded-lg bg-blue-50 p-3">
								<p className="text-blue-800 text-sm">
									<strong>Zalecana dawka:</strong>{" "}
									{selectedSupplement.recommendedDosage}
								</p>
							</div>
						)}
					</div>

					{/* Timing Information */}
					<div className="space-y-4">
						<h3 className="flex items-center gap-2 font-medium text-lg">
							<Clock className="h-4 w-4" />
							Czas przyjęcia
						</h3>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<Label htmlFor="timeOfDay">Pora dnia</Label>
								<Controller
									name="timing.timeOfDay"
									control={control}
									render={({ field }) => (
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{timeOfDayOptions.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														<span className="flex items-center gap-2">
															<span>{option.icon}</span>
															{option.label}
														</span>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							</div>

							<div>
								<Label htmlFor="mealTiming">Względem posiłku</Label>
								<Controller
									name="timing.mealTiming"
									control={control}
									render={({ field }) => (
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{mealTimingOptions.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							</div>
						</div>

						<div className="flex items-center space-x-2">
							<Controller
								name="timing.withFood"
								control={control}
								render={({ field }) => (
									<Checkbox
										id="withFood"
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
							<Label htmlFor="withFood" className="flex items-center gap-2">
								<Utensils className="h-4 w-4" />
								Przyjęte z jedzeniem
							</Label>
						</div>
					</div>

					{/* Context & Mood */}
					<div className="space-y-4">
						<h3 className="flex items-center gap-2 font-medium text-lg">
							<Brain className="h-4 w-4" />
							Samopoczucie i kontekst
						</h3>

						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							{["mood", "energy", "stress", "sleep"].map((field) => (
								<div key={field}>
									<Label className="mb-2 flex items-center gap-2">
										{field === "mood" &&
											getMoodIcon((watch as any)(`context.${field}`) as number)}
										{field === "energy" &&
											getEnergyIcon(
												(watch as any)(`context.${field}`) as number,
											)}
										{field === "stress" && (
											<AlertCircle className="h-4 w-4 text-orange-500" />
										)}
										{field === "sleep" && (
											<Calendar className="h-4 w-4 text-purple-500" />
										)}
										{field === "mood"
											? "Nastrój"
											: field === "energy"
												? "Energia"
												: field === "stress"
													? "Stres"
													: "Sen"}
									</Label>
									<Controller
										name={`context.${field}` as any}
										control={control}
										render={({ field: formField }) => (
											<div className="space-y-2">
												<Progress
													value={formField.value * 20}
													className="h-2"
												/>
												<div className="flex justify-between text-gray-500 text-xs">
													<span>1</span>
													<span>3</span>
													<span>5</span>
												</div>
												<Input
													type="range"
													min="1"
													max="5"
													step="1"
													value={formField.value}
													onChange={(e) =>
														formField.onChange(Number.parseInt(e.target.value))
													}
													className="w-full"
												/>
											</div>
										)}
									/>
								</div>
							))}
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="flex items-center space-x-2">
								<Controller
									name="context.exercise"
									control={control}
									render={({ field }) => (
										<Checkbox
											id="exercise"
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
								<Label htmlFor="exercise">Ćwiczenia dzisiaj</Label>
							</div>

							<div className="flex items-center space-x-2">
								<Controller
									name="context.alcohol"
									control={control}
									render={({ field }) => (
										<Checkbox
											id="alcohol"
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
								<Label htmlFor="alcohol">Alkohol dzisiaj</Label>
							</div>
						</div>

						<div>
							<Label htmlFor="notes">Dodatkowe notatki</Label>
							<Controller
								name="context.notes"
								control={control}
								render={({ field }) => (
									<Textarea
										placeholder="Opisz swoje samopoczucie, okoliczności przyjęcia suplementu..."
										className="min-h-20"
										{...field}
									/>
								)}
							/>
						</div>
					</div>

					{/* Side Effects */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="flex items-center gap-2 font-medium text-lg">
								<AlertCircle className="h-4 w-4" />
								Skutki uboczne
							</h3>
							<Controller
								name="sideEffects.experienced"
								control={control}
								render={({ field }) => (
									<div className="flex items-center space-x-2">
										<Checkbox
											id="sideEffects"
											checked={field.value}
											onCheckedChange={(checked) => {
												field.onChange(checked);
												setShowSideEffects(!!checked);
											}}
										/>
										<Label htmlFor="sideEffects">
											Wystąpiły skutki uboczne
										</Label>
									</div>
								)}
							/>
						</div>

						{showSideEffects && (
							<div className="space-y-4 rounded-lg border p-4">
								{sideEffectsList.map((effect, index) => (
									<div
										key={index}
										className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-3 md:grid-cols-4"
									>
										<div>
											<Label>Typ skutku ubocznego</Label>
											<Select
												value={effect.type}
												onValueChange={(value) =>
													updateSideEffect(index, "type", value)
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Wybierz" />
												</SelectTrigger>
												<SelectContent>
													{commonSideEffects.map((sideEffect) => (
														<SelectItem key={sideEffect} value={sideEffect}>
															{sideEffect}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div>
											<Label>Nasilenie (1-5)</Label>
											<Input
												type="number"
												min="1"
												max="5"
												value={effect.severity}
												onChange={(e) =>
													updateSideEffect(
														index,
														"severity",
														Number.parseInt(e.target.value),
													)
												}
											/>
										</div>

										<div>
											<Label>Czas wystąpienia</Label>
											<Input
												placeholder="np. 30 min"
												value={effect.onset}
												onChange={(e) =>
													updateSideEffect(index, "onset", e.target.value)
												}
											/>
										</div>

										<div className="flex items-end">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => removeSideEffect(index)}
											>
												<Minus className="h-3 w-3" />
											</Button>
										</div>
									</div>
								))}

								<Button
									type="button"
									variant="outline"
									onClick={addSideEffect}
									className="w-full"
								>
									<Plus className="mr-2 h-3 w-3" />
									Dodaj skutek uboczny
								</Button>
							</div>
						)}
					</div>

					<Separator />

					{/* Form Actions */}
					<div className="flex items-center justify-between">
						<Button type="button" variant="outline" onClick={handleSaveDraft}>
							Zapisz szkic
						</Button>

						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									reset();
									setSideEffectsList([]);
									setShowSideEffects(false);
								}}
							>
								Wyczyść
							</Button>
							<Button
								type="submit"
								disabled={!isValid || isSubmitting}
								className="min-w-32"
							>
								{isSubmitting ? (
									<>
										<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
										Zapisywanie...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										Zapisz wpis
									</>
								)}
							</Button>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default DailyIntakeLogger;
