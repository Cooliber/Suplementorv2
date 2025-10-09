"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, X, Info, CheckCircle, AlertCircle, User, Activity, Heart, Pill } from "lucide-react";
import { EnhancedInput, EnhancedSelect, ValidationSummary } from "@/components/ui/enhanced-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserProfileSchema as ValidationUserProfileSchema, type UserProfileData } from "@/lib/validation-utils";
import { type DosageCalculationInput } from "@/types/dosage-calculator";

interface UserProfileStepProps {
	userProfile: Partial<UserProfileData>;
	onUserProfileChange: (profile: Partial<UserProfileData>) => void;
	isPolish: boolean;
}

const ACTIVITY_LEVELS = [
	{ value: "sedentary", label: "Mała aktywność", englishLabel: "Sedentary" },
	{ value: "light", label: "Lekka aktywność", englishLabel: "Light Activity" },
	{ value: "moderate", label: "Umiarkowana aktywność", englishLabel: "Moderate Activity" },
	{ value: "active", label: "Wysoka aktywność", englishLabel: "Active" },
	{ value: "very_active", label: "Bardzo wysoka aktywność", englishLabel: "Very Active" },
];

const COMMON_CONDITIONS = [
	"Diabetes/Cukrzyca",
	"Hypertension/Nadciśnienie",
	"Heart Disease/Choroba serca",
	"Liver Disease/Choroba wątroby",
	"Kidney Disease/Choroba nerek",
	"Thyroid Disease/Choroba tarczycy",
	"Anxiety/Lęk",
	"Depression/Depresja",
	"Insomnia/Bezsenność",
	"Arthritis/Artretyzm",
];

export function UserProfileStep({ userProfile, onUserProfileChange, isPolish }: UserProfileStepProps) {
 	const [newCondition, setNewCondition] = useState("");
 	const [newMedication, setNewMedication] = useState("");
 	const [newAllergy, setNewAllergy] = useState("");

 	const form = useForm<UserProfileData>({
 		resolver: zodResolver(ValidationUserProfileSchema),
 		defaultValues: {
 			age: userProfile.age || 25,
 			gender: userProfile.gender || "other",
 			weight: userProfile.weight || 70,
 			height: userProfile.height || 175,
 			activityLevel: userProfile.activityLevel || "moderate",
 			healthConditions: userProfile.healthConditions || [],
 			currentMedications: userProfile.currentMedications || [],
 			allergies: userProfile.allergies || [],
 			pregnant: userProfile.pregnant || false,
 			breastfeeding: userProfile.breastfeeding || false,
 			goals: userProfile.goals || [],
 			preferences: userProfile.preferences || {},
 		},
 		mode: "onChange",
 	});

 	const { register, handleSubmit, setValue, watch, control, formState: { errors, isSubmitting } } = form;

 	const { fields: conditionFields, append: appendCondition, remove: removeCondition } = useFieldArray({
 		control: form.control,
 		name: "healthConditions",
 	});

 	const { fields: medicationFields, append: appendMedication, remove: removeMedication } = useFieldArray({
 		control: form.control,
 		name: "currentMedications",
 	});

 	const { fields: allergyFields, append: appendAllergy, remove: removeAllergy } = useFieldArray({
 		control: form.control,
 		name: "allergies",
 	});

 	const onSubmit = (data: UserProfileData) => {
 		onUserProfileChange(data);
 	};

 	const addCondition = () => {
 		if (newCondition.trim()) {
 			appendCondition(newCondition.trim());
 			setNewCondition("");
 		}
 	};

 	const addMedication = () => {
 		if (newMedication.trim()) {
 			appendMedication(newMedication.trim());
 			setNewMedication("");
 		}
 	};

 	const addAllergy = () => {
 		if (newAllergy.trim()) {
 			appendAllergy(newAllergy.trim());
 			setNewAllergy("");
 		}
 	};

	return (
		<TooltipProvider>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Enhanced Basic Information */}
					<Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
						<CardHeader className="pb-4">
							<CardTitle className="flex items-center gap-3 text-xl">
								<div className="p-2 bg-primary/10 rounded-lg">
									<User className="h-6 w-6 text-primary" />
								</div>
								{isPolish ? "Podstawowe informacje" : "Basic Information"}
							</CardTitle>
							<CardDescription className="text-base">
								{isPolish
									? "Podaj podstawowe informacje o sobie - te dane są niezbędne do dokładnych obliczeń"
									: "Provide basic information about yourself - this data is essential for accurate calculations"}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={control}
									name="age"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												{isPolish ? "Wiek" : "Age"}
												<Tooltip>
													<TooltipTrigger>
														<Info className="h-4 w-4 text-muted-foreground" />
													</TooltipTrigger>
													<TooltipContent>
														<p className="max-w-xs">
															{isPolish
																? "Wiek wpływa na metabolizm i dawki suplementów"
																: "Age affects metabolism and supplement dosages"}
														</p>
													</TooltipContent>
												</Tooltip>
											</FormLabel>
											<FormControl>
												<EnhancedInput
													type="number"
													placeholder={isPolish ? "np. 25" : "e.g. 25"}
													min={18}
													max={120}
													tooltip={isPolish ? "Wiek wpływa na metabolizm i dawki suplementów" : "Age affects metabolism and supplement dosages"}
													{...field}
													onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={control}
									name="gender"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{isPolish ? "Płeć" : "Gender"}</FormLabel>
											<FormControl>
												<EnhancedSelect
													placeholder={isPolish ? "Wybierz płeć" : "Select gender"}
													options={[
														{ value: "male", label: isPolish ? "Mężczyzna" : "Male" },
														{ value: "female", label: isPolish ? "Kobieta" : "Female" },
														{ value: "other", label: isPolish ? "Inna" : "Other" },
													]}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={control}
									name="weight"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												{isPolish ? "Waga (kg)" : "Weight (kg)"}
												<Tooltip>
													<TooltipTrigger>
														<Info className="h-4 w-4 text-muted-foreground" />
													</TooltipTrigger>
													<TooltipContent>
														<p className="max-w-xs">
															{isPolish
																? "Waga wpływa na dawki większości suplementów"
																: "Weight affects dosages for most supplements"}
														</p>
													</TooltipContent>
												</Tooltip>
											</FormLabel>
											<FormControl>
												<EnhancedInput
													type="number"
													placeholder={isPolish ? "np. 70" : "e.g. 70"}
													min={30}
													max={300}
													step={0.1}
													tooltip={isPolish ? "Waga wpływa na dawki większości suplementów" : "Weight affects dosages for most supplements"}
													{...field}
													onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={control}
									name="height"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{isPolish ? "Wzrost (cm)" : "Height (cm)"}</FormLabel>
											<FormControl>
												<EnhancedInput
													type="number"
													placeholder={isPolish ? "np. 175" : "e.g. 175"}
													min={100}
													max={250}
													{...field}
													onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={control}
								name="activityLevel"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<Activity className="h-4 w-4" />
											{isPolish ? "Poziom aktywności fizycznej" : "Physical Activity Level"}
											<Tooltip>
												<TooltipTrigger>
													<Info className="h-4 w-4 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													<p className="max-w-xs">
														{isPolish
															? "Wyższy poziom aktywności może wymagać wyższych dawek niektórych suplementów"
															: "Higher activity levels may require higher dosages of certain supplements"}
													</p>
												</TooltipContent>
											</Tooltip>
										</FormLabel>
										<FormControl>
											<EnhancedSelect
												placeholder={isPolish ? "Wybierz poziom aktywności" : "Select activity level"}
												options={ACTIVITY_LEVELS.map((level) => ({
													value: level.value,
													label: isPolish ? level.label : level.englishLabel,
												}))}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Progress indicator for basic info */}
							<div className="bg-muted/50 p-4 rounded-lg">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm font-medium">
										{isPolish ? "Ukończoność profilu" : "Profile completion"}
									</span>
									<span className="text-sm text-muted-foreground">
										{Object.values(form.watch()).filter((value) =>
											value !== undefined && value !== null && (typeof value !== "string" || value !== "")
										).length}/5
									</span>
								</div>
								<div className="w-full bg-muted rounded-full h-2">
									<div
										className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300"
										style={{
											width: `${(Object.values(form.watch()).filter((value) =>
												value !== undefined && value !== null && (typeof value !== "string" || value !== "")
											).length / 5) * 100}%`
										}}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Enhanced Health Conditions */}
					<Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-transparent">
						<CardHeader className="pb-4">
							<CardTitle className="flex items-center gap-3 text-xl">
								<div className="p-2 bg-amber-100 rounded-lg">
									<Heart className="h-6 w-6 text-amber-600" />
								</div>
								{isPolish ? "Stan zdrowia" : "Health Conditions"}
							</CardTitle>
							<CardDescription className="text-base">
								{isPolish
									? "Wybierz lub dodaj swoje schorzenia - te informacje są kluczowe dla bezpieczeństwa"
									: "Select or add your health conditions - this information is crucial for safety"}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Common conditions */}
							<div className="space-y-2">
								<Label>{isPolish ? "Powszechne schorzenia" : "Common Conditions"}</Label>
								<div className="flex flex-wrap gap-2">
									{COMMON_CONDITIONS.map((condition) => {
										const isSelected = form.watch("healthConditions")?.includes(condition);
										return (
											<Button
												key={condition}
												variant={isSelected ? "default" : "outline"}
												size="sm"
												onClick={() => {
													const currentConditions = form.watch("healthConditions") || [];
													if (isSelected) {
														form.setValue("healthConditions", currentConditions.filter(c => c !== condition));
													} else {
														form.setValue("healthConditions", [...currentConditions, condition]);
													}
												}}
											>
												{condition.split("/")[isPolish ? 1 : 0]}
											</Button>
										);
									})}
								</div>
							</div>

							<Separator />

							{/* Custom conditions */}
							<div className="space-y-2">
								<Label>{isPolish ? "Dodaj własne schorzenie" : "Add Custom Condition"}</Label>
								<div className="flex gap-2">
									<Input
										value={newCondition}
										onChange={(e) => setNewCondition(e.target.value)}
										placeholder={isPolish ? "np. Migrena" : "e.g. Migraine"}
										onKeyPress={(e) => e.key === "Enter" && addCondition()}
									/>
									<Button onClick={addCondition} size="icon">
										<Plus className="h-4 w-4" />
									</Button>
								</div>
							</div>

							{/* Selected conditions */}
							{form.watch("healthConditions") && form.watch("healthConditions").length > 0 && (
								<div className="space-y-2">
									<Label>{isPolish ? "Wybrane schorzenia" : "Selected Conditions"}</Label>
									<div className="flex flex-wrap gap-2">
										{form.watch("healthConditions").map((condition, index) => (
											<Badge key={index} variant="secondary" className="flex items-center gap-1">
												{condition}
												<Button
													variant="ghost"
													size="sm"
													className="h-auto p-0 ml-1"
													onClick={() => removeCondition(index)}
												>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										))}
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Enhanced Current Medications */}
					<Card className="border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-transparent">
						<CardHeader className="pb-4">
							<CardTitle className="flex items-center gap-3 text-xl">
								<div className="p-2 bg-red-100 rounded-lg">
									<Pill className="h-6 w-6 text-red-600" />
								</div>
								{isPolish ? "Aktualne leki" : "Current Medications"}
							</CardTitle>
							<CardDescription className="text-base">
								{isPolish
									? "Dodaj leki, które obecnie przyjmujesz - kluczowe dla analizy interakcji"
									: "Add medications you are currently taking - crucial for interaction analysis"}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex gap-2">
								<Input
									value={newMedication}
									onChange={(e) => setNewMedication(e.target.value)}
									placeholder={isPolish ? "np. Aspiryna" : "e.g. Aspirin"}
									onKeyPress={(e) => e.key === "Enter" && addMedication()}
								/>
								<Button onClick={addMedication} size="icon">
									<Plus className="h-4 w-4" />
								</Button>
							</div>

							{form.watch("currentMedications") && form.watch("currentMedications").length > 0 && (
								<div className="space-y-2">
									<Label>{isPolish ? "Aktualne leki" : "Current Medications"}</Label>
									<div className="flex flex-wrap gap-2">
										{form.watch("currentMedications").map((medication, index) => (
											<Badge key={index} variant="outline" className="flex items-center gap-1">
												{medication}
												<Button
													variant="ghost"
													size="sm"
													className="h-auto p-0 ml-1"
													onClick={() => removeMedication(index)}
												>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										))}
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Enhanced Allergies */}
					<Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent">
						<CardHeader className="pb-4">
							<CardTitle className="flex items-center gap-3 text-xl">
								<div className="p-2 bg-orange-100 rounded-lg">
									<AlertCircle className="h-6 w-6 text-orange-600" />
								</div>
								{isPolish ? "Alergie i nietolerancje" : "Allergies & Intolerances"}
							</CardTitle>
							<CardDescription className="text-base">
								{isPolish
									? "Dodaj znane alergie i nietolerancje - zapobiegnie to niebezpiecznym rekomendacjom"
									: "Add known allergies and intolerances - this prevents dangerous recommendations"}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex gap-2">
								<Input
									value={newAllergy}
									onChange={(e) => setNewAllergy(e.target.value)}
									placeholder={isPolish ? "np. Orzechy" : "e.g. Nuts"}
									onKeyPress={(e) => e.key === "Enter" && addAllergy()}
								/>
								<Button onClick={addAllergy} size="icon">
									<Plus className="h-4 w-4" />
								</Button>
							</div>

							{form.watch("allergies") && form.watch("allergies").length > 0 && (
								<div className="space-y-2">
									<Label>{isPolish ? "Alergie" : "Allergies"}</Label>
									<div className="flex flex-wrap gap-2">
										{form.watch("allergies").map((allergy, index) => (
											<Badge key={index} variant="destructive" className="flex items-center gap-1">
												{allergy}
												<Button
													variant="ghost"
													size="sm"
													className="h-auto p-0 ml-1"
													onClick={() => removeAllergy(index)}
												>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										))}
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Enhanced Special Conditions */}
					<Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent">
						<CardHeader className="pb-4">
							<CardTitle className="flex items-center gap-3 text-xl">
								<div className="p-2 bg-purple-100 rounded-lg">
									<Info className="h-6 w-6 text-purple-600" />
								</div>
								{isPolish ? "Specjalne okoliczności" : "Special Circumstances"}
							</CardTitle>
							<CardDescription className="text-base">
								{isPolish
									? "Zaznacz jeśli dotyczy - te informacje wpływają na bezpieczeństwo suplementacji"
									: "Check if applicable - this information affects supplementation safety"}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<FormField
								control={control}
								name="pregnant"
								render={({ field }) => (
									<FormItem className="flex items-center space-x-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel>{isPolish ? "Jestem w ciąży" : "I am pregnant"}</FormLabel>
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name="breastfeeding"
								render={({ field }) => (
									<FormItem className="flex items-center space-x-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel>{isPolish ? "Karmię piersią" : "I am breastfeeding"}</FormLabel>
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					{/* Validation Summary */}
					<ValidationSummary />

					{/* Hidden submit to trigger validation */}
					<input type="submit" className="hidden" />
				</form>
			</Form>
		</TooltipProvider>
	);
}