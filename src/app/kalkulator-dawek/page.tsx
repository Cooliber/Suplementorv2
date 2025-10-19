/**
 * Dosage Calculator Page
 * Main page for the enhanced dosage calculator system
 */

import { DosageCalculator } from "@/components/dosage-calculator/DosageCalculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Kalkulator dawek suplementów | Suplementor",
	description:
		"Oblicz bezpieczne i skuteczne dawki suplementów dostosowane do Twojego profilu zdrowotnego. Zaawansowany kalkulator wykorzystujący farmakokinetykę i analizę bezpieczeństwa.",
	keywords: [
		"kalkulator dawek",
		"suplementy",
		"bezpieczeństwo",
		"farmakokinetyka",
		"interakcje",
	],
	openGraph: {
		title: "Kalkulator dawek suplementów",
		description:
			"Spersonalizowany kalkulator dawek suplementów z analizą bezpieczeństwa",
		type: "website",
	},
};

export default function DosageCalculatorPage() {
	return (
		<main className="min-h-screen bg-background">
			<div className="container mx-auto py-8">
				<DosageCalculator />
			</div>
		</main>
	);
}
