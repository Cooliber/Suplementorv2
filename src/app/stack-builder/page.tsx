"use client";

/**
 * Stack Builder Page
 *
 * Interactive drag-and-drop interface for creating supplement stacks
 * with real-time interaction checking and optimization suggestions
 */

import { StackBuilder } from "@/components/stack-builder/StackBuilder";

// Mock data - in production this would come from the database
const mockSupplements = [
	{
		id: "1",
		name: "L-Theanine",
		polishName: "L-Teanina",
		dosage: 200,
		unit: "mg",
		timing: "morning",
		withFood: false,
		category: "Amino Acids",
	},
	{
		id: "2",
		name: "Caffeine",
		polishName: "Kofeina",
		dosage: 100,
		unit: "mg",
		timing: "morning",
		withFood: false,
		category: "Stimulants",
	},
	{
		id: "3",
		name: "Omega-3",
		polishName: "Omega-3",
		dosage: 1000,
		unit: "mg",
		timing: "morning",
		withFood: true,
		category: "Fatty Acids",
	},
	{
		id: "4",
		name: "Magnesium Glycinate",
		polishName: "Glicynian Magnezu",
		dosage: 400,
		unit: "mg",
		timing: "evening",
		withFood: false,
		category: "Minerals",
	},
	{
		id: "5",
		name: "Vitamin D3",
		polishName: "Witamina D3",
		dosage: 4000,
		unit: "IU",
		timing: "morning",
		withFood: true,
		category: "Vitamins",
	},
	{
		id: "6",
		name: "Ashwagandha",
		polishName: "Ashwagandha",
		dosage: 300,
		unit: "mg",
		timing: "evening",
		withFood: false,
		category: "Adaptogens",
	},
	{
		id: "7",
		name: "Rhodiola Rosea",
		polishName: "Różeniec Górski",
		dosage: 250,
		unit: "mg",
		timing: "morning",
		withFood: false,
		category: "Adaptogens",
	},
	{
		id: "8",
		name: "Bacopa Monnieri",
		polishName: "Bakopa Drobnolistna",
		dosage: 300,
		unit: "mg",
		timing: "morning",
		withFood: true,
		category: "Nootropics",
	},
];

export default function StackBuilderPage() {
	const handleSaveStack = (stack: typeof mockSupplements) => {
		console.log("Saving stack:", stack);
		// In production: save to database
	};

	const handleShareStack = (stack: typeof mockSupplements) => {
		console.log("Sharing stack:", stack);
		// In production: generate shareable link
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<h1 className="font-bold text-2xl text-gray-900 dark:text-white">
							Suplementor
						</h1>
						<nav className="flex gap-4">
							<a
								href="/"
								className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
							>
								Strona Główna
							</a>
							<a
								href="/wyszukiwanie"
								className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
							>
								Wyszukiwanie
							</a>
							<a
								href="/rekomendacje"
								className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
							>
								Rekomendacje
							</a>
						</nav>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<StackBuilder
					availableSupplements={mockSupplements}
					onSaveStack={handleSaveStack}
					onShareStack={handleShareStack}
				/>
			</main>
		</div>
	);
}
