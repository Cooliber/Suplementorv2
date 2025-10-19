"use client";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calculator, Clock, Info, Shield } from "lucide-react";

interface CalculationOptionsStepProps {
	options: {
		calculationType: "individual" | "stack";
		includeInteractions: boolean;
		includeContraindications: boolean;
	};
	onOptionsChange: (options: any) => void;
	isPolish: boolean;
}

const CALCULATION_TYPES = [
	{
		value: "individual",
		label: "Indywidualne obliczenia",
		englishLabel: "Individual Calculations",
		description: "Oblicz dawki dla każdego suplementu osobno",
		englishDescription: "Calculate dosages for each supplement individually",
	},
	{
		value: "stack",
		label: "Obliczenia dla stosu",
		englishLabel: "Stack Calculations",
		description: "Uwzględnij interakcje między suplementami",
		englishDescription: "Consider interactions between supplements",
	},
];

export function CalculationOptionsStep({
	options,
	onOptionsChange,
	isPolish,
}: CalculationOptionsStepProps) {
	const updateOption = (key: string, value: any) => {
		onOptionsChange({ ...options, [key]: value });
	};

	return (
		<div className="space-y-6">
			{/* Calculation Type */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calculator className="h-5 w-5" />
						{isPolish ? "Typ obliczeń" : "Calculation Type"}
					</CardTitle>
					<CardDescription>
						{isPolish
							? "Wybierz sposób obliczania dawek suplementów"
							: "Choose how to calculate supplement dosages"}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Select
						value={options.calculationType}
						onValueChange={(value) => updateOption("calculationType", value)}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{CALCULATION_TYPES.map((type) => (
								<SelectItem key={type.value} value={type.value}>
									<div className="space-y-1">
										<div className="font-medium">
											{isPolish ? type.label : type.englishLabel}
										</div>
										<div className="text-muted-foreground text-sm">
											{isPolish ? type.description : type.englishDescription}
										</div>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
						<div className="space-y-1">
							<div className="font-medium">
								{isPolish ? "Obecnie wybrany:" : "Currently selected:"}
							</div>
							<div className="text-muted-foreground text-sm">
								{
									CALCULATION_TYPES.find(
										(t) => t.value === options.calculationType,
									)?.description
								}
							</div>
						</div>
						<Badge
							variant={
								options.calculationType === "stack" ? "default" : "secondary"
							}
						>
							{
								CALCULATION_TYPES.find(
									(t) => t.value === options.calculationType,
								)?.label
							}
						</Badge>
					</div>
				</CardContent>
			</Card>

			{/* Safety Options */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5" />
						{isPolish ? "Opcje bezpieczeństwa" : "Safety Options"}
					</CardTitle>
					<CardDescription>
						{isPolish
							? "Wybierz jakie analizy bezpieczeństwa mają być uwzględnione"
							: "Choose which safety analyses should be included"}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Include Interactions */}
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<Label className="text-base">
								{isPolish ? "Analiza interakcji" : "Interaction Analysis"}
							</Label>
							<p className="text-muted-foreground text-sm">
								{isPolish
									? "Sprawdź interakcje między suplementami i lekami"
									: "Check interactions between supplements and medications"}
							</p>
						</div>
						<Switch
							checked={options.includeInteractions}
							onCheckedChange={(checked) =>
								updateOption("includeInteractions", checked)
							}
						/>
					</div>

					{/* Include Contraindications */}
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<Label className="text-base">
								{isPolish
									? "Sprawdzenie przeciwwskazań"
									: "Contraindication Check"}
							</Label>
							<p className="text-muted-foreground text-sm">
								{isPolish
									? "Sprawdź przeciwwskazania dla Twojego profilu zdrowotnego"
									: "Check contraindications for your health profile"}
							</p>
						</div>
						<Switch
							checked={options.includeContraindications}
							onCheckedChange={(checked) =>
								updateOption("includeContraindications", checked)
							}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Information Cards */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-lg">
							<Info className="h-5 w-5 text-blue-600" />
							{isPolish ? "Jak to działa?" : "How it works?"}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-muted-foreground text-sm">
						<p>
							{isPolish
								? "• Analizujemy Twój profil zdrowotny i wiek"
								: "• We analyze your health profile and age"}
						</p>
						<p>
							{isPolish
								? "• Uwzględniamy interakcje między suplementami"
								: "• We consider interactions between supplements"}
						</p>
						<p>
							{isPolish
								? "• Dostosowujemy dawki do Twoich potrzeb"
								: "• We adjust dosages to your specific needs"}
						</p>
						<p>
							{isPolish
								? "• Sprawdzamy bezpieczeństwo i przeciwwskazania"
								: "• We check safety and contraindications"}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-lg">
							<Clock className="h-5 w-5 text-green-600" />
							{isPolish ? "Czas trwania" : "Duration"}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-muted-foreground text-sm">
						<p>
							{isPolish
								? "• Obliczenia zajmują zazwyczaj 10-30 sekund"
								: "• Calculations typically take 10-30 seconds"}
						</p>
						<p>
							{isPolish
								? "• Wyniki zawierają szczegółowe rekomendacje"
								: "• Results include detailed recommendations"}
						</p>
						<p>
							{isPolish
								? "• Otrzymasz informacje o bezpieczeństwie"
								: "• You'll receive safety information"}
						</p>
						<p>
							{isPolish
								? "• Możesz zapisać wyniki dla przyszłego użytku"
								: "• You can save results for future reference"}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Safety Notice */}
			<Card className="border-amber-200 bg-amber-50">
				<CardContent className="pt-6">
					<div className="flex items-start gap-3">
						<Shield className="mt-0.5 h-5 w-5 text-amber-600" />
						<div className="space-y-2">
							<h4 className="font-medium text-amber-800">
								{isPolish ? "Ważna informacja" : "Important Notice"}
							</h4>
							<p className="text-amber-700 text-sm">
								{isPolish
									? "Ten kalkulator nie zastępuje profesjonalnej porady medycznej. Zawsze konsultuj się z lekarzem lub farmaceutą przed rozpoczęciem suplementacji, szczególnie jeśli masz problemy zdrowotne lub przyjmujesz leki."
									: "This calculator does not replace professional medical advice. Always consult with a doctor or pharmacist before starting supplementation, especially if you have health conditions or are taking medications."}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
