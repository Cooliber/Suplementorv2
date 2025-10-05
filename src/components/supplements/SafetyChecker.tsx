"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Shield, XCircle } from "lucide-react";
import React from "react";

export interface SafetyCheckerProps {
	supplements?: any[];
	onSafetyIssue?: (issue: unknown) => void;
	className?: string;
}

// Mock safety data
const mockSafetyChecks = [
	{
		type: "interaction",
		level: "safe",
		title: "Brak niebezpiecznych interakcji",
		description:
			"Wybrane suplementy nie wykazują szkodliwych interakcji między sobą.",
		icon: CheckCircle,
		color: "text-green-600",
	},
	{
		type: "dosage",
		level: "warning",
		title: "Sprawdź dawkowanie",
		description:
			"Upewnij się, że nie przekraczasz maksymalnych dziennych dawek dla wybranych suplementów.",
		icon: AlertTriangle,
		color: "text-yellow-600",
	},
	{
		type: "timing",
		level: "info",
		title: "Optymalne godziny przyjmowania",
		description:
			"Niektóre suplementy najlepiej przyjmować o określonych porach dnia.",
		icon: Shield,
		color: "text-blue-600",
	},
];

const mockContraindications = [
	{
		supplement: "Alpha-GPC",
		polishSupplement: "Alfa-GPC",
		conditions: ["Ciąża", "Karmienie piersią", "Choroby wątroby"],
		severity: "moderate",
	},
	{
		supplement: "Ashwagandha",
		polishSupplement: "Ashwagandha",
		conditions: [
			"Choroby autoimmunologiczne",
			"Ciąża",
			"Operacje chirurgiczne",
		],
		severity: "high",
	},
];

const getSeverityColor = (severity: string) => {
	switch (severity) {
		case "high":
			return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
		case "moderate":
			return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
		case "low":
			return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
		default:
			return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
	}
};

export default function SafetyChecker({ className }: SafetyCheckerProps) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Shield className="h-5 w-5" />
					Kontrola Bezpieczeństwa
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* Safety Checks */}
					<div className="space-y-3">
						<h4 className="font-medium">Sprawdzenia bezpieczeństwa</h4>
						{mockSafetyChecks.map((check, index) => {
							const IconComponent = check.icon;
							return (
								<div
									key={index}
									className="flex items-start gap-3 rounded-lg border p-3"
								>
									<IconComponent
										className={`h-5 w-5 ${check.color} mt-0.5 flex-shrink-0`}
									/>
									<div className="flex-1">
										<h5 className="font-medium">{check.title}</h5>
										<p className="text-muted-foreground text-sm">
											{check.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>

					{/* Contraindications */}
					<div className="space-y-3">
						<h4 className="font-medium">Przeciwwskazania</h4>
						{mockContraindications.map((item, index) => (
							<Alert key={index}>
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="font-medium">
												{item.polishSupplement}
											</span>
											<Badge
												variant="secondary"
												className={getSeverityColor(item.severity)}
											>
												{item.severity === "high"
													? "Wysokie ryzyko"
													: item.severity === "moderate"
														? "Umiarkowane ryzyko"
														: "Niskie ryzyko"}
											</Badge>
										</div>
										<div>
											<span className="font-medium text-sm">
												Przeciwwskazania:{" "}
											</span>
											<span className="text-sm">
												{item.conditions.join(", ")}
											</span>
										</div>
									</div>
								</AlertDescription>
							</Alert>
						))}
					</div>

					{/* Safety Summary */}
					<div className="border-t pt-4">
						<div className="mb-2 flex items-center gap-2">
							<CheckCircle className="h-5 w-5 text-green-600" />
							<span className="font-medium text-green-600">
								Ogólna ocena bezpieczeństwa: Dobra
							</span>
						</div>
						<p className="text-muted-foreground text-sm">
							Wybrane suplementy są ogólnie bezpieczne przy przestrzeganiu
							zalecanego dawkowania. Zawsze skonsultuj się z lekarzem przed
							rozpoczęciem suplementacji.
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
