"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	ArrowRight,
	ChevronDown,
	ChevronUp,
	Circle,
	Info,
	Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
	evidenceLevelOptions,
	nodeTypeOptions,
	relationshipTypeOptions,
} from "./GraphControls";

interface GraphLegendProps {
	className?: string;
	showNodeTypes?: boolean;
	showRelationshipTypes?: boolean;
	showEvidenceLevels?: boolean;
	showInteractionStrength?: boolean;
}

const GraphLegend: React.FC<GraphLegendProps> = ({
	className = "",
	showNodeTypes = true,
	showRelationshipTypes = true,
	showEvidenceLevels = true,
	showInteractionStrength = true,
}) => {
	const [isExpanded, setIsExpanded] = useState(true);
	const [activeSection, setActiveSection] = useState<
		"nodes" | "relationships" | "evidence" | "strength"
	>("nodes");

	return (
		<TooltipProvider>
			<Card className={`${className}`}>
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2 text-lg">
							<Info className="h-5 w-5" />
							Legenda grafu
						</CardTitle>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsExpanded(!isExpanded)}
						>
							{isExpanded ? (
								<ChevronUp className="h-4 w-4" />
							) : (
								<ChevronDown className="h-4 w-4" />
							)}
						</Button>
					</div>

					{isExpanded && (
						<div className="mt-2 flex flex-wrap gap-1">
							{showNodeTypes && (
								<Button
									variant={activeSection === "nodes" ? "default" : "outline"}
									size="sm"
									onClick={() => setActiveSection("nodes")}
								>
									Węzły
								</Button>
							)}
							{showRelationshipTypes && (
								<Button
									variant={
										activeSection === "relationships" ? "default" : "outline"
									}
									size="sm"
									onClick={() => setActiveSection("relationships")}
								>
									Relacje
								</Button>
							)}
							{showEvidenceLevels && (
								<Button
									variant={activeSection === "evidence" ? "default" : "outline"}
									size="sm"
									onClick={() => setActiveSection("evidence")}
								>
									Dowody
								</Button>
							)}
							{showInteractionStrength && (
								<Button
									variant={activeSection === "strength" ? "default" : "outline"}
									size="sm"
									onClick={() => setActiveSection("strength")}
								>
									Siła
								</Button>
							)}
						</div>
					)}
				</CardHeader>

				{isExpanded && (
					<CardContent className="space-y-4">
						{/* Node Types Section */}
						{activeSection === "nodes" && showNodeTypes && (
							<div className="space-y-3">
								<h4 className="font-medium text-sm">Typy węzłów:</h4>
								<div className="grid grid-cols-1 gap-2">
									{nodeTypeOptions.map((option) => {
										const Icon = option.icon;
										return (
											<Tooltip key={option.value}>
												<TooltipTrigger asChild>
													<div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50">
														<div className="flex items-center gap-2">
															<div
																className="h-4 w-4 rounded-full border-2 border-white shadow-sm"
																style={{ backgroundColor: option.color }}
															/>
															<Icon className="h-4 w-4 text-gray-600" />
														</div>
														<span className="font-medium text-sm">
															{option.label}
														</span>
													</div>
												</TooltipTrigger>
												<TooltipContent>
													<div className="text-center">
														<div className="font-medium">{option.label}</div>
														<div className="text-gray-500 text-xs">
															{option.value === "SUPPLEMENT" &&
																"Suplementy diety i nootropiki"}
															{option.value === "NEUROTRANSMITTER" &&
																"Neuroprzekaźniki i hormony"}
															{option.value === "BRAIN_REGION" &&
																"Obszary i struktury mózgu"}
															{option.value === "COGNITIVE_FUNCTION" &&
																"Funkcje poznawcze i mentalne"}
															{option.value === "PATHWAY" &&
																"Ścieżki biochemiczne"}
															{option.value === "MECHANISM" &&
																"Mechanizmy działania"}
														</div>
													</div>
												</TooltipContent>
											</Tooltip>
										);
									})}
								</div>
							</div>
						)}

						{/* Relationship Types Section */}
						{activeSection === "relationships" && showRelationshipTypes && (
							<div className="space-y-3">
								<h4 className="font-medium text-sm">Typy relacji:</h4>
								<div className="grid grid-cols-1 gap-2">
									{relationshipTypeOptions.map((option) => (
										<Tooltip key={option.value}>
											<TooltipTrigger asChild>
												<div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50">
													<div className="flex items-center gap-2">
														<div className="flex items-center">
															<Circle
																className="h-2 w-2"
																style={{ color: option.color }}
															/>
															<ArrowRight
																className="mx-1 h-4 w-4"
																style={{ color: option.color }}
																strokeWidth={3}
															/>
															<Circle
																className="h-2 w-2"
																style={{ color: option.color }}
															/>
														</div>
													</div>
													<span className="font-medium text-sm">
														{option.label}
													</span>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<div className="text-center">
													<div className="font-medium">{option.label}</div>
													<div className="text-gray-500 text-xs">
														{option.value === "ENHANCES" &&
															"Wzmacnia działanie lub efekt"}
														{option.value === "INHIBITS" &&
															"Hamuje lub blokuje działanie"}
														{option.value === "MODULATES" &&
															"Moduluje lub reguluje"}
														{option.value === "SYNERGIZES" &&
															"Działa synergistycznie"}
														{option.value === "ANTAGONIZES" &&
															"Działa antagonistycznie"}
														{option.value === "REQUIRES" &&
															"Wymaga do prawidłowego działania"}
														{option.value === "PRODUCES" &&
															"Produkuje lub wytwarza"}
														{option.value === "METABOLIZES" &&
															"Metabolizuje lub przetwarza"}
													</div>
												</div>
											</TooltipContent>
										</Tooltip>
									))}
								</div>
							</div>
						)}

						{/* Evidence Levels Section */}
						{activeSection === "evidence" && showEvidenceLevels && (
							<div className="space-y-3">
								<h4 className="font-medium text-sm">
									Poziomy dowodów naukowych:
								</h4>
								<div className="grid grid-cols-1 gap-2">
									{evidenceLevelOptions.map((option) => (
										<Tooltip key={option.value}>
											<TooltipTrigger asChild>
												<div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50">
													<div className="flex items-center gap-2">
														<Badge
															variant="secondary"
															className="text-xs"
															style={{
																backgroundColor: `${option.color}20`,
																color: option.color,
																borderColor: option.color,
															}}
														>
															{option.label}
														</Badge>
													</div>
													<div className="flex-1">
														<div className="h-2 w-full rounded-full bg-gray-200">
															<div
																className="h-2 rounded-full transition-all duration-300"
																style={{
																	backgroundColor: option.color,
																	width:
																		option.value === "STRONG"
																			? "100%"
																			: option.value === "MODERATE"
																				? "75%"
																				: option.value === "WEAK"
																					? "50%"
																					: option.value === "INSUFFICIENT"
																						? "25%"
																						: "15%",
																}}
															/>
														</div>
													</div>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<div className="text-center">
													<div className="font-medium">{option.label}</div>
													<div className="text-gray-500 text-xs">
														{option.value === "STRONG" &&
															"Silne dowody z wielu badań RCT"}
														{option.value === "MODERATE" &&
															"Umiarkowane dowody z niektórych badań"}
														{option.value === "WEAK" &&
															"Słabe dowody, ograniczone badania"}
														{option.value === "INSUFFICIENT" &&
															"Niewystarczające dane naukowe"}
														{option.value === "CONFLICTING" &&
															"Sprzeczne wyniki badań"}
													</div>
												</div>
											</TooltipContent>
										</Tooltip>
									))}
								</div>
							</div>
						)}

						{/* Interaction Strength Section */}
						{activeSection === "strength" && showInteractionStrength && (
							<div className="space-y-3">
								<h4 className="font-medium text-sm">Siła interakcji:</h4>
								<div className="space-y-3">
									<div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50">
										<div className="flex items-center gap-2">
											<Zap className="h-4 w-4 text-red-500" />
											<div className="h-1 w-8 rounded-full bg-red-500" />
										</div>
										<span className="font-medium text-sm">Silna (0.8-1.0)</span>
									</div>

									<div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50">
										<div className="flex items-center gap-2">
											<Zap className="h-4 w-4 text-orange-500" />
											<div className="h-1 w-6 rounded-full bg-orange-500" />
										</div>
										<span className="font-medium text-sm">
											Umiarkowana (0.5-0.8)
										</span>
									</div>

									<div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50">
										<div className="flex items-center gap-2">
											<Zap className="h-4 w-4 text-yellow-500" />
											<div className="h-1 w-4 rounded-full bg-yellow-500" />
										</div>
										<span className="font-medium text-sm">Słaba (0.2-0.5)</span>
									</div>

									<div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50">
										<div className="flex items-center gap-2">
											<Zap className="h-4 w-4 text-gray-400" />
											<div className="h-1 w-2 rounded-full bg-gray-400" />
										</div>
										<span className="font-medium text-sm">
											Minimalna (0.0-0.2)
										</span>
									</div>
								</div>

								<div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
									<div className="flex items-start gap-2">
										<Info className="mt-0.5 h-4 w-4 text-blue-600" />
										<div className="text-blue-800 text-xs">
											<div className="mb-1 font-medium">
												Interpretacja siły:
											</div>
											<ul className="space-y-1">
												<li>• Grubość linii odpowiada sile interakcji</li>
												<li>• Przezroczystość wskazuje poziom dowodów</li>
												<li>• Kolor określa typ relacji</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				)}
			</Card>
		</TooltipProvider>
	);
};

export default GraphLegend;
