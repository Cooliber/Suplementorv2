"use client";

import {
	BodySystemCard,
	BodySystemCrossReference,
	BodySystemSearch,
} from "@/components/features/body-systems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type BodySystem, bodySystems } from "@/data/body-systems";
import { Filter, Grid, List, Search } from "lucide-react";
import { useMemo, useState } from "react";

type ViewMode = "grid" | "list";
type SortOption = "name" | "organs" | "supplements";

export default function BodySystemsPage() {
	const [filteredSystems, setFilteredSystems] =
		useState<BodySystem[]>(bodySystems);
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [showSupplements, setShowSupplements] = useState(true);
	const [selectedSystemId, setSelectedSystemId] = useState<
		string | undefined
	>();

	const handleFilteredResults = (filtered: BodySystem[]) => {
		setFilteredSystems(filtered);
	};

	const handleSupplementClick = (supplementId: string) => {
		// Navigate to supplement detail page or open modal
		console.log("Navigate to supplement:", supplementId);
	};

	const handleSystemSelect = (systemId: string) => {
		setSelectedSystemId(systemId);
		// Scroll to cross-reference section
		document
			.getElementById("cross-reference-section")
			?.scrollIntoView({ behavior: "smooth" });
	};
	return (
		<div className="container mx-auto py-8">
			<div className="mb-8">
				<h1 className="mb-3 font-bold text-2xl md:mb-4 md:text-3xl">
					Układy Ciała Człowieka
				</h1>
				<p className="mb-4 text-base text-gray-700 md:mb-6 md:text-lg">
					Poznaj {bodySystems.length} układów ciała człowieka, ich funkcje oraz
					suplementy, które mogą wspierać ich zdrowie.
				</p>

				{/* Enhanced Search Component */}
				<BodySystemSearch
					systems={bodySystems}
					onFilteredResults={handleFilteredResults}
				/>

				{/* View Controls */}
				<Card className="mb-6">
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<Button
									variant={showSupplements ? "default" : "outline"}
									size="sm"
									onClick={() => setShowSupplements(!showSupplements)}
								>
									{showSupplements ? "Ukryj suplementy" : "Pokaż suplementy"}
								</Button>

								<div className="flex gap-2">
									<Badge variant="secondary">
										Znalezione: {filteredSystems.length}
									</Badge>
									<Badge variant="outline">
										Wszystkie: {bodySystems.length}
									</Badge>
								</div>
							</div>

							<div className="flex rounded-lg border">
								<Button
									variant={viewMode === "grid" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("grid")}
									className="rounded-r-none"
								>
									<Grid className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "list" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("list")}
									className="rounded-l-none"
								>
									<List className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Body Systems Display */}
			<div className="mb-12">
				{filteredSystems.length === 0 ? (
					<Card>
						<CardContent className="py-12 pt-6 text-center">
							<p className="mb-4 text-gray-500">
								Nie znaleziono układów ciała spełniających kryteria
								wyszukiwania.
							</p>
							<Button
								variant="outline"
								onClick={() => {
									setFilteredSystems(bodySystems);
								}}
							>
								Wyczyść filtry
							</Button>
						</CardContent>
					</Card>
				) : (
					<div
						className={
							viewMode === "grid"
								? "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3"
								: "space-y-3 md:space-y-4"
						}
					>
						{filteredSystems.map((system) => (
							<BodySystemCard
								key={system.id}
								system={system}
								onSupplementClick={handleSupplementClick}
								compact={viewMode === "list"}
								showRelatedSupplements={showSupplements}
							/>
						))}
					</div>
				)}
			</div>

			{/* Cross-Reference Section */}
			<div id="cross-reference-section" className="mb-12">
				<BodySystemCrossReference
					systems={bodySystems}
					selectedSystemId={selectedSystemId}
					onSystemSelect={handleSystemSelect}
				/>
			</div>
		</div>
	);
}
