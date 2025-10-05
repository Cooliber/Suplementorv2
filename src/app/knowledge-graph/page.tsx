"use client";

import {
	GraphControls,
	GraphDashboard,
	GraphExportImport,
	GraphLegend,
} from "@/components/graph";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getKnowledgeGraphData } from "@/data/knowledge-graph-mock";
import { useGraphData } from "@/hooks/useGraphData";
import { useKnowledgeGraphStore } from "@/lib/stores/knowledge-graph-store";
import {
	BarChart3,
	BrainCircuit,
	Download,
	Filter,
	Info,
	Network,
	Pause,
	Play,
	RotateCcw,
	Search,
	Upload,
} from "lucide-react";
import React, { useState } from "react";

export default function KnowledgeGraphPage() {
	const { nodes, relationships, supplements, isLoading, error, refetch } =
		useGraphData({ autoFetch: true });

	const { isPlaying, togglePlay, resetFilters, clearSelectedNodes } =
		useKnowledgeGraphStore();

	// Fallback to mock data if the hook is not working
	const graphData =
		nodes.length > 0
			? { nodes, relationships, supplements }
			: getKnowledgeGraphData();

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="mb-2 flex items-center gap-3 font-bold text-3xl">
					<Network className="text-blue-500" />
					Suplementor - Graf Wiedzy Neuroregulacji
				</h1>
				<p className="text-lg text-muted-foreground">
					Wizualizacja powiązań między suplementami, obszarami mózgu, funkcjami
					poznawczymi i mechanizmami działania
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
				{/* Controls Panel */}
				<div className="space-y-6 lg:col-span-1">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BarChart3 className="h-5 w-5" />
								Sterowanie
							</CardTitle>
							<CardDescription>
								Sterowanie wizualizacją grafu wiedzy
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<Button
								onClick={togglePlay}
								variant={isPlaying ? "default" : "outline"}
								className="w-full"
							>
								{isPlaying ? (
									<>
										<Pause className="mr-2 h-4 w-4" />
										Wstrzymaj fizykę
									</>
								) : (
									<>
										<Play className="mr-2 h-4 w-4" />
										Rozpocznij fizykę
									</>
								)}
							</Button>

							<Button
								onClick={resetFilters}
								variant="outline"
								className="w-full"
							>
								<RotateCcw className="mr-2 h-4 w-4" />
								Resetuj filtry
							</Button>

							<Button
								onClick={clearSelectedNodes}
								variant="outline"
								className="w-full"
							>
								<Info className="mr-2 h-4 w-4" />
								Wyczyść zaznaczenia
							</Button>

							<Button
								onClick={() => refetch()}
								variant="outline"
								className="w-full"
							>
								<RotateCcw className="mr-2 h-4 w-4" />
								Odśwież dane
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BrainCircuit className="h-5 w-5" />
								Statystyki Grafu
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span>Węzły:</span>
									<Badge variant="secondary">{graphData.nodes.length}</Badge>
								</div>
								<div className="flex justify-between">
									<span>Powiązania:</span>
									<Badge variant="secondary">
										{graphData.relationships.length}
									</Badge>
								</div>
								<div className="flex justify-between">
									<span>Typy węzłów:</span>
									<Badge variant="outline">
										{new Set(graphData.nodes.map((n) => n.type)).size}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Typy Węzłów</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{Array.from(new Set(graphData.nodes.map((n) => n.type))).map(
									(type) => (
										<div key={type} className="flex items-center gap-2">
											<div
												className="h-3 w-3 rounded-full"
												style={{
													backgroundColor:
														type === "SUPPLEMENT"
															? "#3B82F6"
															: type === "NEUROTRANSMITTER"
																? "#10B981"
																: type === "BRAIN_REGION"
																	? "#8B5CF6"
																	: type === "COGNITIVE_FUNCTION"
																		? "#F59E0B"
																		: type === "PATHWAY"
																			? "#EF4444"
																			: "#EC4899",
												}}
											/>
											<span className="text-sm">{type}</span>
										</div>
									),
								)}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Download className="h-5 w-5" />
								Eksport/Import
							</CardTitle>
						</CardHeader>
						<CardContent>
							<GraphExportImport
								nodes={graphData.nodes}
								relationships={graphData.relationships}
								supplements={
									"supplements" in graphData ? graphData.supplements : []
								}
								onImport={(data) => console.log("Imported data:", data)}
								onExport={() => console.log("Exporting data")}
							/>
						</CardContent>
					</Card>
				</div>

				{/* Graph Visualization */}
				<div className="lg:col-span-3">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Network className="h-5 w-5" />
								Interaktywny Graf Wiedzy
							</CardTitle>
							<CardDescription>
								Kliknij węzły, aby zobaczyć szczegóły. Użyj paska przesuwającego
								lub przycisków do przybliżania/oddalania.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="h-[600px] rounded-lg border bg-white p-4">
								<GraphDashboard
									nodes={graphData.nodes}
									relationships={graphData.relationships}
									supplements={
										"supplements" in graphData ? graphData.supplements : []
									}
									isLoading={isLoading}
									error={error ? String(error) : null}
									className="h-full"
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Opis Typów Węzłów</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							<li className="flex items-start gap-2">
								<div className="mt-1.5 h-3 w-3 rounded-full bg-blue-500" />
								<div>
									<span className="font-medium">SUPPLEMENT</span> - Suplementy
									diety i ich składniki
								</div>
							</li>
							<li className="flex items-start gap-2">
								<div className="mt-1.5 h-3 w-3 rounded-full bg-emerald-500" />
								<div>
									<span className="font-medium">NEUROTRANSMITTER</span> -
									Neuroprzekaźniki i neurotrofiny
								</div>
							</li>
							<li className="flex items-start gap-2">
								<div className="mt-1.5 h-3 w-3 rounded-full bg-violet-500" />
								<div>
									<span className="font-medium">BRAIN_REGION</span> - Obszary
									mózgu i ich funkcje
								</div>
							</li>
							<li className="flex items-start gap-2">
								<div className="mt-1.5 h-3 w-3 rounded-full bg-amber-500" />
								<div>
									<span className="font-medium">COGNITIVE_FUNCTION</span> -
									Funkcje poznawcze i ich mechanizmy
								</div>
							</li>
							<li className="flex items-start gap-2">
								<div className="mt-1.5 h-3 w-3 rounded-full bg-red-500" />
								<div>
									<span className="font-medium">PATHWAY</span> - Ścieżki
									molekularne i biochemiczne
								</div>
							</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Opis Typów Relacji</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							<li className="flex items-start gap-2">
								<div className="mt-2 h-0.5 w-3 bg-emerald-500" />
								<div>
									<span className="font-medium">ENHANCES</span> - Wzmacnia lub
									poprawia funkcję
								</div>
							</li>
							<li className="flex items-start gap-2">
								<div className="mt-2 h-0.5 w-3 bg-red-500" />
								<div>
									<span className="font-medium">INHIBITS</span> - Hamuje lub
									ogranicza funkcję
								</div>
							</li>
							<li className="flex items-start gap-2">
								<div className="mt-2 h-0.5 w-3 bg-violet-500" />
								<div>
									<span className="font-medium">MODULATES</span> - Moduluje
									funkcję (wzmacnia lub osłabia)
								</div>
							</li>
							<li className="flex items-start gap-2">
								<div className="mt-2 h-0.5 w-3 bg-amber-500" />
								<div>
									<span className="font-medium">SYNERGIZES</span> - Działa
									synergistycznie z innym elementem
								</div>
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
