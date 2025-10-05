/**
 * Knowledge Base Integration Example
 * Demonstrates how to integrate graph visualization components into the Suplementor knowledge base
 */

"use client";

import ConnectionVisualization from "@/components/graph/ConnectionVisualization";
import GraphDashboard from "@/components/graph/GraphDashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGraphData } from "@/hooks/useGraphData";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import type { KnowledgeNode } from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";
import {
	BookOpen,
	Brain,
	Download,
	Eye,
	EyeOff,
	Filter,
	Network,
	Search,
	Upload,
	Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

const KnowledgeBaseGraphIntegration: React.FC = () => {
	const [activeTab, setActiveTab] = useState("explorer");
	const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	const { nodes, relationships, supplements, isLoading, error, refetch } =
		useGraphData({ autoFetch: true });

	const {
		filters,
		setFilters,
		layout,
		setLayout,
		showLabels,
		toggleShowLabels,
		isPlaying,
		togglePlay,
	} = useKnowledgeGraphStore();

	// Filter nodes based on search term
	const filteredNodes = searchTerm
		? nodes.filter(
				(node) =>
					node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					node.polishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					node.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					node.polishDescription
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()),
			)
		: nodes;

	// Get connections for the selected node
	const connectedNodes = selectedNode
		? nodes.filter((node) =>
				relationships.some(
					(rel) =>
						(rel.sourceId === selectedNode.id && rel.targetId === node.id) ||
						(rel.targetId === selectedNode.id && rel.sourceId === node.id),
				),
			)
		: [];

	// Get related supplements for the selected node
	const relatedSupplements = selectedNode
		? supplements.filter((supp) => supp.knowledgeNodeId === selectedNode.id)
		: [];

	// Export graph data functionality
	const handleExportData = () => {
		const graphData = { nodes, relationships, supplements };
		const dataStr = JSON.stringify(graphData, null, 2);
		const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

		const exportFileDefaultName = `knowledge-base-graph-${new Date().toISOString().split("T")[0]}.json`;

		const linkElement = document.createElement("a");
		linkElement.setAttribute("href", dataUri);
		linkElement.setAttribute("download", exportFileDefaultName);
		linkElement.click();
	};

	// Import graph data functionality
	const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const importedData = JSON.parse(e.target?.result as string);
				// In a real implementation, you'd update the graph data
				console.log("Imported knowledge base graph data:", importedData);
				refetch(); // Refresh the data after import
			} catch (error) {
				console.error("Error parsing imported data:", error);
			}
		};
		reader.readAsText(file);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="mb-2 flex items-center gap-2 font-bold text-3xl text-gray-900">
					<Network className="h-8 w-8 text-blue-600" />
					Baza Wiedzy o Suplementach
				</h1>
				<p className="text-gray-600">
					Eksploruj powiązania między suplementami, neuroprzekaźnikami,
					obszarami mózgu i funkcjami poznawczymi
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
				{/* Sidebar with filters and search */}
				<div className="space-y-6 lg:col-span-1">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg">
								<Search className="h-5 w-5" />
								Wyszukiwanie i Filtry
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center space-x-2">
									<Search className="h-4 w-4 text-gray-500" />
									<Input
										placeholder="Szukaj węzłów..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="flex-1"
									/>
								</div>

								<div className="grid grid-cols-2 gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={handleExportData}
										className="flex items-center justify-center"
									>
										<Download className="mr-1 h-4 w-4" />
										Eksport
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="flex items-center justify-center"
									>
										<label className="flex cursor-pointer items-center">
											<Upload className="mr-1 h-4 w-4" />
											Import
											<Input
												type="file"
												accept=".json"
												onChange={handleImportData}
												className="hidden"
											/>
										</label>
									</Button>
								</div>

								<div className="space-y-2">
									<Label className="font-medium text-sm">Typy węzłów</Label>
									<div className="flex flex-wrap gap-2">
										{(
											[
												"SUPPLEMENT",
												"NEUROTRANSMITTER",
												"BRAIN_REGION",
												"COGNITIVE_FUNCTION",
											] as const
										).map((type) => (
											<Badge
												key={type}
												variant={
													filters.nodeTypes.includes(type as any)
														? "default"
														: "secondary"
												}
												className="cursor-pointer hover:bg-gray-200"
												onClick={() => {
													const newTypes = filters.nodeTypes.includes(
														type as any,
													)
														? filters.nodeTypes.filter((t) => t !== type)
														: [...filters.nodeTypes, type as any];
													setFilters({ ...filters, nodeTypes: newTypes });
												}}
											>
												{type}
											</Badge>
										))}
									</div>
								</div>

								<div className="space-y-2">
									<Label className="font-medium text-sm">Poziom dowodów</Label>
									<div className="flex flex-wrap gap-2">
										{(["STRONG", "MODERATE", "WEAK"] as const).map((level) => (
											<Badge
												key={level}
												variant={
													filters.evidenceLevels.includes(level as any)
														? "default"
														: "outline"
												}
												className="cursor-pointer hover:bg-gray-200"
												onClick={() => {
													const newLevels = filters.evidenceLevels.includes(
														level as any,
													)
														? filters.evidenceLevels.filter((l) => l !== level)
														: [...filters.evidenceLevels, level as any];
													setFilters({ ...filters, evidenceLevels: newLevels });
												}}
											>
												{level}
											</Badge>
										))}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{selectedNode && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<div
										className="mr-2 h-3 w-3 rounded-full"
										style={{ backgroundColor: "#3B82F6" }}
									/>
									{selectedNode.polishName || selectedNode.name}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<p className="text-gray-600 text-sm">
										{selectedNode.polishDescription || selectedNode.description}
									</p>

									<div>
										<span className="font-medium text-xs">Typ: </span>
										<Badge variant="secondary">{selectedNode.type}</Badge>
									</div>

									<div>
										<span className="font-medium text-xs">
											Poziom dowodów:{" "}
										</span>
										<Badge
											variant={
												selectedNode.evidenceLevel === "STRONG"
													? "default"
													: selectedNode.evidenceLevel === "MODERATE"
														? "secondary"
														: "outline"
											}
										>
											{selectedNode.evidenceLevel}
										</Badge>
									</div>

									{relatedSupplements.length > 0 && (
										<div>
											<h4 className="mb-2 font-medium text-sm">
												Powiązane suplementy:
											</h4>
											{relatedSupplements.map((supp) => (
												<div key={supp.id} className="border-t pt-2">
													<div className="font-medium text-sm">
														{supp.polishName || supp.name}
													</div>
													<Badge variant="outline" className="mt-1 text-xs">
														{supp.category}
													</Badge>
												</div>
											))}
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg">
								<Eye className="h-5 w-5" />
								Statystyki
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span>Węzły:</span>
									<span className="font-medium">{nodes.length}</span>
								</div>
								<div className="flex justify-between">
									<span>Połączenia:</span>
									<span className="font-medium">{relationships.length}</span>
								</div>
								<div className="flex justify-between">
									<span>Suplementy:</span>
									<span className="font-medium">{supplements.length}</span>
								</div>
								<div className="flex justify-between">
									<span>Wybrane:</span>
									<span className="font-medium">{selectedNode ? 1 : 0}</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main content area with tabs */}
				<div className="lg:col-span-3">
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="explorer" className="flex items-center gap-2">
								<Network className="h-4 w-4" />
								Eksplorator
							</TabsTrigger>
							<TabsTrigger
								value="connections"
								className="flex items-center gap-2"
							>
								<Zap className="h-4 w-4" />
								Połączenia
							</TabsTrigger>
							<TabsTrigger
								value="knowledge"
								className="flex items-center gap-2"
							>
								<BookOpen className="h-4 w-4" />
								Wiedza
							</TabsTrigger>
						</TabsList>

						<TabsContent value="explorer" className="mt-4">
							<GraphDashboard
								nodes={filteredNodes}
								relationships={relationships}
								supplements={supplements}
								isLoading={isLoading}
								error={error ? String(error) : null}
								onNodeSelect={setSelectedNode}
								className="h-[600px]"
							/>
						</TabsContent>

						<TabsContent value="connections" className="mt-4">
							{selectedNode ? (
								<ConnectionVisualization
									nodes={nodes}
									relationships={relationships}
									sourceNodeId={selectedNode.id}
									className="h-[600px]"
								/>
							) : (
								<Card>
									<CardContent className="flex h-96 items-center justify-center">
										<div className="text-center">
											<Network className="mx-auto mb-4 h-12 w-12 text-gray-400" />
											<p className="mb-2 text-gray-500">
												Wybierz węzeł z grafu, aby zobaczyć jego powiązania
											</p>
											<p className="text-gray-400 text-sm">
												Kliknij na dowolny węzeł w eksploratorze grafu, aby
												wyświetlić jego połączenia
											</p>
										</div>
									</CardContent>
								</Card>
							)}
						</TabsContent>

						<TabsContent value="knowledge" className="mt-4">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Brain className="h-5 w-5" />
										Baza Wiedzy o Suplementach
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="prose max-w-none">
										<h3 className="mb-3 font-semibold text-lg">
											O Grafie Wiedzy
										</h3>
										<p className="mb-4">
											Graf wiedzy o suplementach to interaktywna wizualizacja
											powiązań między różnymi składnikami aktywnymi,
											neuroprzekaźnikami, obszarami mózgu i funkcjami
											poznawczymi. Pozwala zrozumieć, jak suplementy oddziałują
											na organizm na poziomie molekularnym i systemowym.
										</p>

										<h4 className="mb-2 font-semibold text-md">
											Jak korzystać z grafu
										</h4>
										<ul className="mb-4 list-disc space-y-1 pl-5">
											<li>
												Użyj filtra wyszukiwania, aby znaleźć interesujące Cię
												węzły
											</li>
											<li>
												Kliknij na węzeł, aby wyświetlić szczegóły i powiązania
											</li>
											<li>
												Zmieniaj układ grafu za pomocą przycisków kontroli
											</li>
											<li>Eksportuj dane grafu do dalszej analizy</li>
											<li>Filtruj według typów węzłów i poziomu dowodów</li>
										</ul>

										<h4 className="mb-2 font-semibold text-md">Legenda</h4>
										<div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
											<div className="flex items-center gap-2">
												<div className="h-4 w-4 rounded-full bg-blue-500" />
												<span className="text-sm">Suplement</span>
											</div>
											<div className="flex items-center gap-2">
												<div className="h-4 w-4 rounded-full bg-green-500" />
												<span className="text-sm">Neuroprzekaźnik</span>
											</div>
											<div className="flex items-center gap-2">
												<div className="h-4 w-4 rounded-full bg-purple-500" />
												<span className="text-sm">Obszar mózgu</span>
											</div>
											<div className="flex items-center gap-2">
												<div className="h-4 w-4 rounded-full bg-yellow-500" />
												<span className="text-sm">Funkcja poznawcza</span>
											</div>
											<div className="flex items-center gap-2">
												<div className="h-4 w-4 rounded-full bg-red-500" />
												<span className="text-sm">Szlak metaboliczny</span>
											</div>
											<div className="flex items-center gap-2">
												<div className="h-4 w-4 rounded-full bg-pink-500" />
												<span className="text-sm">Mechanizm działania</span>
											</div>
										</div>

										<div className="rounded-lg bg-blue-50 p-4">
											<h4 className="mb-2 font-semibold text-blue-800">
												Porada
											</h4>
											<p className="text-blue-700 text-sm">
												Rozpocznij eksplorację od popularnych nootropików jak
												Alfa-GPC lub Lions Mane, a następnie śledź ich
												powiązania z neuroprzekaźnikami i obszarami mózgu.
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default KnowledgeBaseGraphIntegration;
