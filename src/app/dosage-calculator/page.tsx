/**
 * Dosage Calculator Page (English)
 * Main page for the enhanced dosage calculator system
 */

import { Metadata } from "next";
import { DosageCalculator } from "@/components/dosage-calculator/DosageCalculator";

export const metadata: Metadata = {
	title: "Supplement Dosage Calculator | Suplementor",
	description: "Calculate safe and effective supplement dosages tailored to your health profile. Advanced calculator using pharmacokinetics and safety analysis.",
	keywords: ["dosage calculator", "supplements", "safety", "pharmacokinetics", "interactions"],
	openGraph: {
		title: "Supplement Dosage Calculator",
		description: "Personalized supplement dosage calculator with safety analysis",
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