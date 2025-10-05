/**
 * Complete Graph Dashboard Example
 * Demonstrates how to use all UI components together in a real application
 */

"use client";

import ConnectionVisualization from "@/components/graph/ConnectionVisualization";
import GraphControls from "@/components/graph/GraphControls";
import GraphDashboard from "@/components/graph/GraphDashboard";
import GraphLegend from "@/components/graph/GraphLegend";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGraphData } from "@/hooks/useGraphData";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import {
	Activity,
	BookOpen,
	Download,
	Eye,
	EyeOff,
	Filter,
	FlaskConical,
	HelpCircle,
	Info,
	Maximize2,
	Network,
	Pause,
	Pill,
	Play,
	RefreshCw,
	RotateCcw,
	Search,
	Settings,
	Upload,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

export default function CompleteGraphDashboard() {
	const [activeTab, setActiveTab] = useState("dashboard");
	const [searchTerm, setSearchTerm] = useState("");
	const [showLabels, setShowLabels] = useState(true);
	const [isPlaying, setIsPlaying] = useState(true);
	const [zoomLevel, setZoomLevel] = useState(100);

	const { nodes, relationships, supplements, isLoading, error, refetch } =
		useGraphData({ autoFetch: true });

	const { filters, setFilters, layout, setLayout, maxRenderNodes } =
		useKnowledgeGraphStore();

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

	// Handle search input change
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setFilters({ ...filters, searchTerm: e.target.value });
	};

	// Handle layout change
	const handleLayoutChange = (newLayout: string) => {
		setLayout(newLayout as any);
	};

	// Handle export data
	const handleExportData = () => {
		const dataStr = JSON.stringify(
			{ nodes, relationships, supplements },
			null,
			2,
		);
		const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

		const exportFileDefaultName = `suplementor-graph-data-${new Date().toISOString().split("T")[0]}.json`;

		const linkElement = document.createElement("a");
		linkElement.setAttribute("href", dataUri);
		linkElement.setAttribute("download", exportFileDefaultName);
		linkElement.click();
	};

	// Handle import data
	const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const importedData = JSON.parse(e.target?.result as string);
				console.log("Imported graph data:", importedData);
				// In a real implementation, you would update the store with this data
			} catch (error) {
				console.error("Error parsing imported data:", error);
			}
		};
		reader.readAsText(file);
	};

	return (
		<div className="flex h-full flex-col">
			{/* Header with title and controls */}
			<div className="flex items-center justify-between border-b bg-white p-4">
				<div className="flex items-center gap-4">
					<h1 className="flex items-center gap-2 font-bold text-2xl">
						<Network className="h-6 w-6 text-blue-600" />
						Graf wiedzy o suplementach
					</h1>
					<div className="flex items-center gap-2">
						<Button
							variant={layout === "force" ? "default" : "outline"}
							size="sm"
							onClick={() => handleLayoutChange("force")}
						>
							D3.js
						</Button>
						<Button
							variant={layout === "hierarchical" ? "default" : "outline"}
							size="sm"
							onClick={() => handleLayoutChange("hierarchical")}
						>
							Hierarchical
						</Button>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" onClick={() => refetch()}>
						<RefreshCw className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="sm" onClick={handleExportData}>
						<Download className="h-4 w-4" />
					</Button>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline" size="sm">
								<Upload className="h-4 w-4" />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Importuj dane grafu</DialogTitle>
								<DialogDescription>
									Zaimportuj dane grafu z pliku JSON
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<Label htmlFor="import-file">Wybierz plik</Label>
								<Input
									id="import-file"
									type="file"
									accept=".json"
									onChange={handleImportData}
								/>
							</div>
						</DialogContent>
					</Dialog>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<Settings className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>
								<Maximize2 className="mr-2 h-4 w-4" />
								Pełny ekran
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Eye className="mr-2 h-4 w-4" />
								Widoczność etykiet
								<Switch
									className="ml-auto"
									checked={showLabels}
									onCheckedChange={setShowLabels}
								/>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Info className="mr-2 h-4 w-4" />
								Informacje
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Main content with tabs */}
			<div className="flex flex-1 overflow-hidden">
				<div className="flex flex-1 flex-col">
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="flex flex-1 flex-col"
					>
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="dashboard">Panel główny</TabsTrigger>
							<TabsTrigger value="connections">Połączenia</TabsTrigger>
							<TabsTrigger value="details">Szczegóły</TabsTrigger>
						</TabsList>

						<div className="mb-4 flex flex-wrap items-center justify-between gap-2 p-4">
							<div className="flex items-center gap-2">
								<div className="relative">
									<Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Szukaj węzłów..."
										className="pl-8"
										value={searchTerm}
										onChange={handleSearchChange}
									/>
								</div>
								<Button variant="outline" size="sm">
									<Filter className="mr-2 h-4 w-4" />
									Filtry
								</Button>
							</div>

							<div className="flex items-center gap-2">
								<Badge variant="secondary">Węzły: {nodes.length}</Badge>
								<Badge variant="secondary">
									Połączenia: {relationships.length}
								</Badge>
								<Badge variant="secondary">Zoom: {zoomLevel}%</Badge>
							</div>
						</div>

						<TabsContent value="dashboard" className="mt-0 flex-1">
							<div className="flex h-full flex-col">
								<GraphDashboard
									nodes={filteredNodes}
									relationships={relationships}
									supplements={supplements}
									isLoading={isLoading}
									error={error ? String(error) : null}
									className="flex-1"
								/>
							</div>
						</TabsContent>

						<TabsContent value="connections" className="mt-0 flex-1">
							<div className="flex h-full flex-col">
								<ConnectionVisualization
									nodes={nodes}
									relationships={relationships}
									sourceNodeId={nodes[0]?.id || ""}
									className="flex-1"
								/>
							</div>
						</TabsContent>

						<TabsContent value="details" className="mt-0 flex-1">
							<div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
								<Card className="lg:col-span-2">
									<CardHeader>
										<CardTitle>Szczegóły węzła</CardTitle>
										<CardDescription>
											Informacje szczegółowe o wybranym węźle
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex items-center gap-4">
												<div className="rounded-lg bg-blue-50 p-2">
													<Pill className="h-6 w-6 text-blue-600" />
												</div>
												<div>
													<h3 className="font-semibold">Alfa-GPC</h3>
													<p className="text-muted-foreground text-sm">
														Suplement cholinowy
													</p>
												</div>
											</div>

											<div className="space-y-2">
												<h4 className="flex items-center gap-2 font-medium text-sm">
													<BookOpen className="h-4 w-4" />
													Opis
												</h4>
												<p className="text-gray-600 text-sm">
													Alfa-GPC to wysoce biodostępna forma choliny, która
													skutecznie przekracza barierę krew-mózg. Wspiera
													syntezę acetylocholiny i może poprawiać funkcje
													poznawcze.
												</p>
											</div>

											<div className="space-y-2">
												<h4 className="flex items-center gap-2 font-medium text-sm">
													<Activity className="h-4 w-4" />
													Mechanizmy działania
												</h4>
												<div className="space-y-2">
													<Badge variant="secondary">Cholinergiczny</Badge>
													<Badge variant="secondary">Neuroprotekcja</Badge>
													<Badge variant="secondary">Poprawa pamięci</Badge>
												</div>
											</div>

											<div className="space-y-2">
												<h4 className="flex items-center gap-2 font-medium text-sm">
													<FlaskConical className="h-4 w-4" />
													Badania naukowe
												</h4>
												<div className="space-y-2 text-sm">
													<div className="rounded bg-gray-50 p-2">
														<div className="font-medium">
															Ziegenfuss et al. 2008
														</div>
														<div className="text-muted-foreground">
															Journal of the International Society of Sports
															Nutrition
														</div>
														<div className="mt-1">
															Alfa-GPC zwiększyła moc wyjściową i odpowiedź
															hormonu wzrostu u zdrowych młodych mężczyzn
														</div>
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								<div className="space-y-4">
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">Statystyki</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-3">
												<div className="flex justify-between">
													<span className="text-sm">Poziom dowodów</span>
													<Badge variant="outline">STRONG</Badge>
												</div>
												<div className="flex justify-between">
													<span className="text-sm">Kategoria</span>
													<Badge variant="outline">NOOTROPIC</Badge>
												</div>
												<div className="flex justify-between">
													<span className="text-sm">Dawkowanie</span>
													<span className="font-medium text-sm">
														300-600mg dziennie
													</span>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle className="text-lg">Kontrolki</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<Label htmlFor="physics-toggle">Fizyka</Label>
													<Switch id="physics-toggle" defaultChecked />
												</div>
												<div className="flex items-center justify-between">
													<Label htmlFor="labels-toggle">Etykiety</Label>
													<Switch
														id="labels-toggle"
														checked={showLabels}
														onCheckedChange={setShowLabels}
													/>
												</div>
												<div className="flex items-center justify-between">
													<Label htmlFor="animation-toggle">Animacja</Label>
													<Switch
														id="animation-toggle"
														checked={isPlaying}
														onCheckedChange={setIsPlaying}
													/>
												</div>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle className="text-lg">Legenda</CardTitle>
										</CardHeader>
										<CardContent>
											<GraphLegend />
										</CardContent>
									</Card>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>

			{/* Footer with status information */}
			<div className="border-t bg-gray-50 px-4 py-2 text-gray-600 text-sm">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<span>Węzły: {nodes.length}</span>
						<span>Połączenia: {relationships.length}</span>
						<span>Wybrane: 0</span>
					</div>
					<div className="flex items-center gap-4">
						<span>Układ: {layout}</span>
						<span>Wizualizacja: {activeTab}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
