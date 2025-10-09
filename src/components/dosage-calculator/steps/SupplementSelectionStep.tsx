"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Plus, X, Pill, Clock, AlertTriangle, CheckCircle, Info, Filter, Star, TrendingUp } from "lucide-react";
import { type DosageCalculationInput, type SupplementInput } from "@/types/dosage-calculator";
import { type SupplementWithRelations } from "@/types/supplement";

interface SupplementSelectionStepProps {
	supplements: DosageCalculationInput["supplements"];
	onSupplementsChange: (supplements: DosageCalculationInput["supplements"]) => void;
	isPolish: boolean;
}

const SUPPLEMENT_CATEGORIES = [
	{ value: "NOOTROPIC", label: "Nootropiki", englishLabel: "Nootropics" },
	{ value: "VITAMIN", label: "Witaminy", englishLabel: "Vitamins" },
	{ value: "MINERAL", label: "Minerały", englishLabel: "Minerals" },
	{ value: "AMINO_ACID", label: "Aminokwasy", englishLabel: "Amino Acids" },
	{ value: "HERB", label: "Zioła", englishLabel: "Herbs" },
	{ value: "ADAPTOGEN", label: "Adaptogeny", englishLabel: "Adaptogens" },
	{ value: "FATTY_ACID", label: "Kwasy tłuszczowe", englishLabel: "Fatty Acids" },
	{ value: "OTHER", label: "Inne", englishLabel: "Other" },
];

const DESIRED_EFFECTS = [
	{ value: "therapeutic", label: "Terapeutyczny", englishLabel: "Therapeutic" },
	{ value: "preventive", label: "Profilaktyczny", englishLabel: "Preventive" },
	{ value: "optimal", label: "Optymalny", englishLabel: "Optimal" },
];

const TIMING_OPTIONS = [
	{ value: "morning", label: "Rano", englishLabel: "Morning" },
	{ value: "afternoon", label: "Popołudnie", englishLabel: "Afternoon" },
	{ value: "evening", label: "Wieczór", englishLabel: "Evening" },
	{ value: "night", label: "Noc", englishLabel: "Night" },
];

export function SupplementSelectionStep({
	supplements,
	onSupplementsChange,
	isPolish
}: SupplementSelectionStepProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [availableSupplements, setAvailableSupplements] = useState<SupplementWithRelations[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	// Load available supplements
	useEffect(() => {
		loadSupplements();
	}, [searchQuery, selectedCategory]);

	const loadSupplements = async () => {
		setIsLoading(true);
		try {
			const params = new URLSearchParams();
			if (searchQuery) params.append("search", searchQuery);
			if (selectedCategory) params.append("category", selectedCategory);

			const response = await fetch(`/api/trpc/supplement.getAll?${params}`);
			if (response.ok) {
				const data = await response.json();
				setAvailableSupplements(data.supplements || []);
			}
		} catch (error) {
			console.error("Failed to load supplements:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const addSupplement = (supplement: SupplementWithRelations) => {
		const newSupplementInput: SupplementInput = {
			supplementId: supplement.id,
			desiredEffect: "therapeutic",
			timingPreference: ["morning"],
			withFood: supplement.dosageGuidelines?.withFood ?? true,
		};

		onSupplementsChange([...supplements, newSupplementInput]);
	};

	const removeSupplement = (supplementId: string) => {
		onSupplementsChange(supplements.filter(s => s.supplementId !== supplementId));
	};

	const updateSupplement = (supplementId: string, updates: Partial<SupplementInput>) => {
		onSupplementsChange(
			supplements.map(s =>
				s.supplementId === supplementId ? { ...s, ...updates } : s
			)
		);
	};

	const getSupplementById = (supplementId: string) => {
		return availableSupplements.find(s => s.id === supplementId);
	};

	return (
		<TooltipProvider>
			<div className="space-y-6">
				{/* Enhanced Search and Filter */}
				<Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
					<CardHeader className="pb-4">
						<CardTitle className="flex items-center gap-3 text-xl">
							<div className="p-2 bg-primary/10 rounded-lg">
								<Search className="h-6 w-6 text-primary" />
							</div>
							{isPolish ? "Wyszukaj suplementy" : "Search Supplements"}
						</CardTitle>
						<CardDescription className="text-base">
							{isPolish
								? "Znajdź suplementy do dodania do kalkulacji z zaawansowaną wyszukiwarką"
								: "Find supplements to add to your calculation with advanced search"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="search" className="flex items-center gap-2">
									<Search className="h-4 w-4" />
									{isPolish ? "Wyszukaj" : "Search"}
									<Tooltip>
										<TooltipTrigger>
											<Info className="h-4 w-4 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent>
											<p className="max-w-xs">
												{isPolish
													? "Szukaj po nazwie, składnikach aktywnych lub efektach"
													: "Search by name, active ingredients, or effects"}
											</p>
										</TooltipContent>
									</Tooltip>
								</Label>
								<div className="relative">
									<Input
										id="search"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder={isPolish ? "np. Witamina D, Omega-3, nootropiki" : "e.g. Vitamin D, Omega-3, nootropics"}
										className="pl-10"
									/>
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="category" className="flex items-center gap-2">
									<Filter className="h-4 w-4" />
									{isPolish ? "Kategoria" : "Category"}
								</Label>
								<Select value={selectedCategory} onValueChange={setSelectedCategory}>
									<SelectTrigger>
										<SelectValue placeholder={isPolish ? "Wszystkie kategorie" : "All categories"} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">{isPolish ? "Wszystkie" : "All"}</SelectItem>
										{SUPPLEMENT_CATEGORIES.map((category) => (
											<SelectItem key={category.value} value={category.value}>
												<div className="flex items-center gap-2">
													<span>{isPolish ? category.label : category.englishLabel}</span>
													{selectedCategory === category.value && (
														<CheckCircle className="h-4 w-4 text-primary" />
													)}
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<Button onClick={loadSupplements} disabled={isLoading} className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200">
							{isLoading ? (
								<>
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
									{isPolish ? "Ładowanie suplementów..." : "Loading supplements..."}
								</>
							) : (
								<>
									<Search className="h-5 w-5 mr-2" />
									{isPolish ? "Szukaj suplementów" : "Search Supplements"}
									<span className="ml-2 text-sm opacity-90">
										({availableSupplements.length} {isPolish ? "znalezionych" : "found"})
									</span>
								</>
							)}
						</Button>
					</CardContent>
				</Card>

			{/* Enhanced Available Supplements */}
			<Card className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
				<CardHeader className="pb-4">
					<CardTitle className="flex items-center gap-3 text-xl">
						<div className="p-2 bg-green-100 rounded-lg">
							<Pill className="h-6 w-6 text-green-600" />
						</div>
						{isPolish ? "Dostępne suplementy" : "Available Supplements"}
					</CardTitle>
					<CardDescription className="text-base">
						{isPolish
							? `Znaleziono ${availableSupplements.length} suplementów z różnymi poziomami wiarygodności`
							: `Found ${availableSupplements.length} supplements with varying evidence levels`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{availableSupplements.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
							{availableSupplements.map((supplement) => {
								const isSelected = supplements.some(s => s.supplementId === supplement.id);
								return (
									<div
										key={supplement.id}
										className={`p-5 border-2 rounded-xl space-y-3 transition-all duration-200 hover:shadow-md ${
											isSelected
												? "border-primary bg-primary/5 shadow-lg"
												: "border-border hover:border-primary/30"
										}`}
									>
										<div className="flex items-start justify-between">
											<div className="flex-1 space-y-2">
												<div className="flex items-center gap-2">
													<h4 className="font-semibold text-base">
														{isPolish ? supplement.polishName : supplement.name}
													</h4>
													{isSelected && (
														<Badge variant="default" className="text-xs">
															<CheckCircle className="h-3 w-3 mr-1" />
															{isPolish ? "Wybrany" : "Selected"}
														</Badge>
													)}
												</div>
												<div className="flex items-center gap-2">
													<Badge variant="outline" className="text-xs">
														{supplement.category.replace("_", " ")}
													</Badge>
													{supplement.evidenceLevel && (
														<Tooltip>
															<TooltipTrigger>
																<Badge
																	variant={
																		supplement.evidenceLevel === "STRONG" ? "default" :
																		supplement.evidenceLevel === "MODERATE" ? "secondary" : "outline"
																	}
																	className="text-xs cursor-help"
																>
																	<Star className="h-3 w-3 mr-1" />
																	{supplement.evidenceLevel}
																</Badge>
															</TooltipTrigger>
															<TooltipContent>
																<p className="max-w-xs">
																	{isPolish
																		? `Poziom wiarygodności: ${supplement.evidenceLevel}`
																		: `Evidence level: ${supplement.evidenceLevel}`}
																</p>
															</TooltipContent>
														</Tooltip>
													)}
												</div>
											</div>
											<Button
												size="sm"
												variant={isSelected ? "destructive" : "default"}
												onClick={() => isSelected
													? removeSupplement(supplement.id)
													: addSupplement(supplement)
												}
												className="ml-2 transition-all duration-200"
											>
												{isSelected ? (
													<>
														<X className="h-4 w-4 mr-1" />
														{isPolish ? "Usuń" : "Remove"}
													</>
												) : (
													<>
														<Plus className="h-4 w-4 mr-1" />
														{isPolish ? "Dodaj" : "Add"}
													</>
												)}
											</Button>
										</div>

										{supplement.dosageGuidelines && (
											<div className="bg-muted/50 p-3 rounded-lg">
												<div className="flex items-center gap-2 text-sm">
													<TrendingUp className="h-4 w-4 text-muted-foreground" />
													<span className="text-muted-foreground">
														{isPolish ? "Dawka:" : "Dosage:"}
													</span>
													<span className="font-medium">
														{supplement.dosageGuidelines.therapeuticRange.min}-{supplement.dosageGuidelines.therapeuticRange.max} {supplement.dosageGuidelines.therapeuticRange.unit}
													</span>
												</div>
											</div>
										)}

										{supplement.sideEffects && supplement.sideEffects.length > 0 && (
											<Alert className="py-2">
												<AlertTriangle className="h-3 w-3" />
												<AlertDescription className="text-xs">
													{isPolish ? "Możliwe efekty uboczne" : "Possible side effects"}
												</AlertDescription>
											</Alert>
										)}
									</div>
								);
							})}
						</div>
					) : (
						<div className="text-center py-12">
							<div className="bg-muted/50 w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center">
								<Pill className="h-10 w-10 text-muted-foreground opacity-50" />
							</div>
							<p className="text-muted-foreground">
								{isLoading
									? (isPolish ? "Ładowanie suplementów..." : "Loading supplements...")
									: (isPolish ? "Nie znaleziono suplementów" : "No supplements found")
								}
							</p>
							{!isLoading && (
								<p className="text-sm text-muted-foreground mt-2">
									{isPolish
										? "Spróbuj zmienić kryteria wyszukiwania"
										: "Try adjusting your search criteria"}
								</p>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Selected Supplements */}
			{supplements.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CheckCircle className="h-5 w-5 text-green-600" />
							{isPolish ? "Wybrane suplementy" : "Selected Supplements"}
							<Badge variant="secondary">{supplements.length}</Badge>
						</CardTitle>
						<CardDescription>
							{isPolish
								? "Dostosuj ustawienia dla wybranych suplementów"
								: "Customize settings for selected supplements"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{supplements.map((supplementInput, index) => {
							const supplement = getSupplementById(supplementInput.supplementId);
							if (!supplement) return null;

							return (
								<Card key={supplement.id} className="p-4">
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div>
												<h4 className="font-medium">
													{isPolish ? supplement.polishName : supplement.name}
												</h4>
												<p className="text-sm text-muted-foreground">
													{supplement.category.replace("_", " ")}
												</p>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => removeSupplement(supplement.id)}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											{/* Desired Effect */}
											<div className="space-y-2">
												<Label className="text-sm">
													{isPolish ? "Efekt" : "Effect"}
												</Label>
												<Select
													value={supplementInput.desiredEffect}
													onValueChange={(value) =>
														updateSupplement(supplement.id, { desiredEffect: value as any })
													}
												>
													<SelectTrigger className="h-9">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{DESIRED_EFFECTS.map((effect) => (
															<SelectItem key={effect.value} value={effect.value}>
																{isPolish ? effect.label : effect.englishLabel}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>

											{/* Timing */}
											<div className="space-y-2">
												<Label className="text-sm">
													{isPolish ? "Pora dnia" : "Timing"}
												</Label>
												<Select
													value={supplementInput.timingPreference?.[0] || ""}
													onValueChange={(value) =>
														updateSupplement(supplement.id, { timingPreference: [value as "morning" | "afternoon" | "evening" | "night"] })
													}
												>
													<SelectTrigger className="h-9">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{TIMING_OPTIONS.map((timing) => (
															<SelectItem key={timing.value} value={timing.value}>
																{isPolish ? timing.label : timing.englishLabel}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>

											{/* With Food */}
											<div className="space-y-2">
												<Label className="text-sm">
													{isPolish ? "Z jedzeniem" : "With Food"}
												</Label>
												<div className="flex items-center gap-2 mt-2">
													<Button
														variant={supplementInput.withFood ? "default" : "outline"}
														size="sm"
														onClick={() => updateSupplement(supplement.id, { withFood: true })}
													>
														{isPolish ? "Tak" : "Yes"}
													</Button>
													<Button
														variant={!supplementInput.withFood ? "default" : "outline"}
														size="sm"
														onClick={() => updateSupplement(supplement.id, { withFood: false })}
													>
														{isPolish ? "Nie" : "No"}
													</Button>
												</div>
											</div>
										</div>

										{/* Custom Dosage */}
										<div className="space-y-2">
											<Label className="text-sm">
												{isPolish ? "Niestandardowa dawka (opcjonalne)" : "Custom Dosage (optional)"}
											</Label>
											<div className="flex gap-2">
												<Input
													type="number"
													value={supplementInput.customDosage || ""}
													onChange={(e) =>
														updateSupplement(supplement.id, {
															customDosage: parseFloat(e.target.value) || undefined
														})
													}
													placeholder={isPolish ? "np. 500" : "e.g. 500"}
													className="flex-1"
												/>
												<Select defaultValue="mg">
													<SelectTrigger className="w-20">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="mg">mg</SelectItem>
														<SelectItem value="mcg">mcg</SelectItem>
														<SelectItem value="g">g</SelectItem>
														<SelectItem value="iu">IU</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
									</div>
								</Card>
							);
						})}
					</CardContent>
				</Card>
			)}

			{supplements.length === 0 && (
				<Card>
					<CardContent className="text-center py-8">
						<Pill className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
						<h3 className="font-medium mb-2">
							{isPolish ? "Nie wybrano suplementów" : "No supplements selected"}
						</h3>
						<p className="text-sm text-muted-foreground">
							{isPolish
								? "Użyj wyszukiwarki powyżej, aby znaleźć i dodać suplementy do kalkulacji"
								: "Use the search above to find and add supplements to your calculation"}
						</p>
					</CardContent>
				</Card>
			)}
			</div>
		</TooltipProvider>
	);
}