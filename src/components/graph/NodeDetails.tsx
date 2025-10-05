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
import type {
	KnowledgeNode,
	KnowledgeRelationship,
} from "@/types/knowledge-graph";
import type { SupplementWithRelations } from "@/types/supplement";
import {
	Activity,
	AlertTriangle,
	BookOpen,
	Brain,
	ChevronDown,
	ChevronUp,
	Clock,
	ExternalLink,
	FlaskConical,
	Link as LinkIcon,
	Pill,
	Star,
	Target,
	TrendingUp,
	X,
	Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

interface NodeDetailsProps {
	node: KnowledgeNode | null;
	supplement?: SupplementWithRelations | null;
	relationships?: KnowledgeRelationship[];
	connectedNodes?: KnowledgeNode[];
	onClose?: () => void;
	onNodeClick?: (nodeId: string) => void;
	className?: string;
}

const NodeDetails: React.FC<NodeDetailsProps> = ({
	node,
	supplement,
	relationships = [],
	connectedNodes = [],
	onClose,
	onNodeClick,
	className = "",
}) => {
	const [activeTab, setActiveTab] = useState<
		"overview" | "connections" | "research" | "details"
	>("overview");
	const [expandedSections, setExpandedSections] = useState<Set<string>>(
		new Set(["basic"]),
	);

	if (!node) {
		return (
			<Card className={`${className}`}>
				<CardContent className="p-6 text-center text-gray-500">
					<Brain className="mx-auto mb-2 h-12 w-12 opacity-50" />
					<p>Wybierz węzeł, aby zobaczyć szczegóły</p>
				</CardContent>
			</Card>
		);
	}

	const toggleSection = (section: string) => {
		const newExpanded = new Set(expandedSections);
		if (newExpanded.has(section)) {
			newExpanded.delete(section);
		} else {
			newExpanded.add(section);
		}
		setExpandedSections(newExpanded);
	};

	const getNodeIcon = (type: string) => {
		switch (type) {
			case "SUPPLEMENT":
				return Pill;
			case "NEUROTRANSMITTER":
				return Activity;
			case "BRAIN_REGION":
				return Brain;
			case "COGNITIVE_FUNCTION":
				return Zap;
			case "PATHWAY":
				return FlaskConical;
			case "MECHANISM":
				return FlaskConical;
			default:
				return Brain;
		}
	};

	const getEvidenceColor = (level: string) => {
		switch (level) {
			case "STRONG":
				return "text-green-600 bg-green-100";
			case "MODERATE":
				return "text-yellow-600 bg-yellow-100";
			case "WEAK":
				return "text-orange-600 bg-orange-100";
			case "INSUFFICIENT":
				return "text-gray-600 bg-gray-100";
			case "CONFLICTING":
				return "text-red-600 bg-red-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const NodeIcon = getNodeIcon(node.type);

	// Filter relationships for this node
	const incomingRelationships = relationships.filter(
		(rel) => rel.targetId === node.id,
	);
	const outgoingRelationships = relationships.filter(
		(rel) => rel.sourceId === node.id,
	);

	return (
		<TooltipProvider>
			<Card className={`${className}`}>
				<CardHeader className="pb-2">
					<div className="flex items-start justify-between">
						<div className="flex items-start gap-3">
							<div className="rounded-lg bg-blue-50 p-2">
								<NodeIcon className="h-6 w-6 text-blue-600" />
							</div>
							<div className="flex-1">
								<CardTitle className="text-lg leading-tight">
									{node.polishName}
								</CardTitle>
								<div className="mt-1 flex items-center gap-2">
									<Badge variant="secondary" className="text-xs">
										{node.type}
									</Badge>
									<Badge
										className={`text-xs ${getEvidenceColor(node.evidenceLevel)}`}
									>
										{node.evidenceLevel}
									</Badge>
								</div>
							</div>
						</div>
						{onClose && (
							<Button variant="ghost" size="sm" onClick={onClose}>
								<X className="h-4 w-4" />
							</Button>
						)}
					</div>

					<div className="mt-3 flex gap-1">
						<Button
							variant={activeTab === "overview" ? "default" : "outline"}
							size="sm"
							onClick={() => setActiveTab("overview")}
						>
							Przegląd
						</Button>
						<Button
							variant={activeTab === "connections" ? "default" : "outline"}
							size="sm"
							onClick={() => setActiveTab("connections")}
						>
							Połączenia (
							{incomingRelationships.length + outgoingRelationships.length})
						</Button>
						{supplement && (
							<>
								<Button
									variant={activeTab === "research" ? "default" : "outline"}
									size="sm"
									onClick={() => setActiveTab("research")}
								>
									Badania ({supplement.researchStudies.length})
								</Button>
								<Button
									variant={activeTab === "details" ? "default" : "outline"}
									size="sm"
									onClick={() => setActiveTab("details")}
								>
									Szczegóły
								</Button>
							</>
						)}
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Overview Tab */}
					{activeTab === "overview" && (
						<div className="space-y-4">
							{/* Basic Information */}
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<h4 className="flex items-center gap-2 font-medium text-sm">
										<BookOpen className="h-4 w-4" />
										Podstawowe informacje
									</h4>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => toggleSection("basic")}
									>
										{expandedSections.has("basic") ? (
											<ChevronUp className="h-4 w-4" />
										) : (
											<ChevronDown className="h-4 w-4" />
										)}
									</Button>
								</div>

								{expandedSections.has("basic") && (
									<div className="space-y-3 rounded-lg bg-gray-50 p-3">
										<div>
											<span className="font-medium text-sm">
												Nazwa angielska:
											</span>
											<p className="text-gray-600 text-sm">{node.name}</p>
										</div>
										<div>
											<span className="font-medium text-sm">Opis:</span>
											<p className="text-gray-600 text-sm">
												{node.polishDescription || node.description}
											</p>
										</div>
										{node.category && (
											<div>
												<span className="font-medium text-sm">Kategoria:</span>
												<Badge variant="outline" className="ml-2 text-xs">
													{node.category}
												</Badge>
											</div>
										)}
									</div>
								)}
							</div>

							{/* Supplement Overview */}
							{supplement && (
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<h4 className="flex items-center gap-2 font-medium text-sm">
											<Pill className="h-4 w-4" />
											Informacje o suplemencie
										</h4>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => toggleSection("supplement")}
										>
											{expandedSections.has("supplement") ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
										</Button>
									</div>

									{expandedSections.has("supplement") && (
										<div className="space-y-3 rounded-lg bg-blue-50 p-3">
											<div>
												<span className="font-medium text-sm">Kategoria:</span>
												<Badge variant="supplement" className="ml-2 text-xs">
													{supplement.category}
												</Badge>
											</div>

											{supplement.scientificName && (
												<div>
													<span className="font-medium text-sm">
														Nazwa naukowa:
													</span>
													<p className="text-gray-600 text-sm italic">
														{supplement.scientificName}
													</p>
												</div>
											)}

											<div>
												<span className="font-medium text-sm">Inne nazwy:</span>
												<div className="mt-1 flex flex-wrap gap-1">
													{supplement.polishCommonNames
														.slice(0, 3)
														.map((name, index) => (
															<Badge
																key={index}
																variant="outline"
																className="text-xs"
															>
																{name}
															</Badge>
														))}
													{supplement.polishCommonNames.length > 3 && (
														<Badge variant="outline" className="text-xs">
															+{supplement.polishCommonNames.length - 3} więcej
														</Badge>
													)}
												</div>
											</div>

											<div>
												<span className="font-medium text-sm">
													Główne zastosowania:
												</span>
												<div className="mt-1 flex flex-wrap gap-1">
													{supplement.clinicalApplications
														.slice(0, 3)
														.map((app, index) => (
															<Badge
																key={index}
																variant="secondary"
																className="text-xs"
															>
																{app.polishCondition}
															</Badge>
														))}
													{supplement.clinicalApplications.length > 3 && (
														<Badge variant="secondary" className="text-xs">
															+{supplement.clinicalApplications.length - 3}{" "}
															więcej
														</Badge>
													)}
												</div>
											</div>
										</div>
									)}
								</div>
							)}

							{/* Quick Stats */}
							<div className="grid grid-cols-2 gap-4">
								<div className="rounded-lg bg-gray-50 p-3 text-center">
									<div className="font-bold text-blue-600 text-lg">
										{incomingRelationships.length +
											outgoingRelationships.length}
									</div>
									<div className="text-gray-600 text-xs">Połączenia</div>
								</div>
								<div className="rounded-lg bg-gray-50 p-3 text-center">
									<div className="font-bold text-green-600 text-lg">
										{supplement?.researchStudies.length || 0}
									</div>
									<div className="text-gray-600 text-xs">Badania</div>
								</div>
							</div>
						</div>
					)}

					{/* Connections Tab */}
					{activeTab === "connections" && (
						<div className="space-y-4">
							{/* Outgoing Relationships */}
							{outgoingRelationships.length > 0 && (
								<div className="space-y-2">
									<h4 className="flex items-center gap-2 font-medium text-sm">
										<TrendingUp className="h-4 w-4" />
										Wpływa na ({outgoingRelationships.length})
									</h4>
									<div className="space-y-2">
										{outgoingRelationships.slice(0, 5).map((rel) => {
											const targetNode = connectedNodes.find(
												(n) => n.id === rel.targetId,
											);
											return (
												<div
													key={rel.id}
													className="flex items-center gap-3 rounded-lg bg-gray-50 p-2"
												>
													<div className="flex flex-1 items-center gap-2">
														<Badge variant="outline" className="text-xs">
															{rel.type}
														</Badge>
														<span className="text-sm">
															{targetNode?.polishName || rel.targetId}
														</span>
													</div>
													<div className="flex items-center gap-1">
														<div className="text-gray-500 text-xs">
															{Math.round(rel.strength * 100)}%
														</div>
														{onNodeClick && targetNode && (
															<Button
																variant="ghost"
																size="sm"
																onClick={() => onNodeClick(targetNode.id)}
															>
																<LinkIcon className="h-3 w-3" />
															</Button>
														)}
													</div>
												</div>
											);
										})}
										{outgoingRelationships.length > 5 && (
											<div className="text-center">
												<Badge variant="secondary" className="text-xs">
													+{outgoingRelationships.length - 5} więcej
												</Badge>
											</div>
										)}
									</div>
								</div>
							)}

							{/* Incoming Relationships */}
							{incomingRelationships.length > 0 && (
								<div className="space-y-2">
									<h4 className="flex items-center gap-2 font-medium text-sm">
										<Target className="h-4 w-4" />
										Wpływają na ten węzeł ({incomingRelationships.length})
									</h4>
									<div className="space-y-2">
										{incomingRelationships.slice(0, 5).map((rel) => {
											const sourceNode = connectedNodes.find(
												(n) => n.id === rel.sourceId,
											);
											return (
												<div
													key={rel.id}
													className="flex items-center gap-3 rounded-lg bg-gray-50 p-2"
												>
													<div className="flex flex-1 items-center gap-2">
														<Badge variant="outline" className="text-xs">
															{rel.type}
														</Badge>
														<span className="text-sm">
															{sourceNode?.polishName || rel.sourceId}
														</span>
													</div>
													<div className="flex items-center gap-1">
														<div className="text-gray-500 text-xs">
															{Math.round(rel.strength * 100)}%
														</div>
														{onNodeClick && sourceNode && (
															<Button
																variant="ghost"
																size="sm"
																onClick={() => onNodeClick(sourceNode.id)}
															>
																<LinkIcon className="h-3 w-3" />
															</Button>
														)}
													</div>
												</div>
											);
										})}
										{incomingRelationships.length > 5 && (
											<div className="text-center">
												<Badge variant="secondary" className="text-xs">
													+{incomingRelationships.length - 5} więcej
												</Badge>
											</div>
										)}
									</div>
								</div>
							)}

							{incomingRelationships.length === 0 &&
								outgoingRelationships.length === 0 && (
									<div className="py-8 text-center text-gray-500">
										<LinkIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
										<p>Brak połączeń z innymi węzłami</p>
									</div>
								)}
						</div>
					)}

					{/* Research Tab */}
					{activeTab === "research" && supplement && (
						<div className="space-y-4">
							{supplement.researchStudies.length > 0 ? (
								<div className="space-y-3">
									{supplement.researchStudies
										.slice(0, 3)
										.map((study, index) => (
											<div
												key={study.id || index}
												className="rounded-lg border p-3"
											>
												<div className="mb-2 flex items-start justify-between">
													<h5 className="font-medium text-sm leading-tight">
														{study.polishTitle || study.title}
													</h5>
													<Badge
														className={`ml-2 text-xs ${getEvidenceColor(study.evidenceLevel)}`}
													>
														{study.evidenceLevel}
													</Badge>
												</div>
												<div className="space-y-1 text-gray-600 text-xs">
													<div>
														{study.journal} ({study.year})
													</div>
													<div>Typ: {study.studyType}</div>
													{study.sampleSize && (
														<div>Próba: {study.sampleSize} osób</div>
													)}
												</div>
												<p className="mt-2 text-gray-700 text-sm">
													{study.polishFindings || study.findings}
												</p>
												{study.pubmedId && (
													<div className="mt-2">
														<Button
															variant="outline"
															size="sm"
															className="text-xs"
														>
															<ExternalLink className="mr-1 h-3 w-3" />
															PubMed: {study.pubmedId}
														</Button>
													</div>
												)}
											</div>
										))}
									{supplement.researchStudies.length > 3 && (
										<div className="text-center">
											<Badge variant="secondary" className="text-xs">
												+{supplement.researchStudies.length - 3} więcej badań
											</Badge>
										</div>
									)}
								</div>
							) : (
								<div className="py-8 text-center text-gray-500">
									<BookOpen className="mx-auto mb-2 h-12 w-12 opacity-50" />
									<p>Brak dostępnych badań</p>
								</div>
							)}
						</div>
					)}

					{/* Details Tab */}
					{activeTab === "details" && supplement && (
						<div className="space-y-4">
							{/* Active Compounds */}
							{supplement.activeCompounds.length > 0 && (
								<div className="space-y-2">
									<h4 className="font-medium text-sm">Składniki aktywne:</h4>
									<div className="space-y-2">
										{supplement.activeCompounds.map((compound, index) => (
											<div key={index} className="rounded-lg bg-gray-50 p-2">
												<div className="font-medium text-sm">
													{compound.polishName || compound.name}
												</div>
												{compound.concentration && (
													<div className="text-gray-600 text-xs">
														Stężenie: {compound.concentration}
													</div>
												)}
												{compound.bioavailability && (
													<div className="text-gray-600 text-xs">
														Biodostępność: {compound.bioavailability}%
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							)}

							{/* Dosage Guidelines */}
							<div className="space-y-2">
								<h4 className="flex items-center gap-2 font-medium text-sm">
									<Clock className="h-4 w-4" />
									Dawkowanie:
								</h4>
								<div className="rounded-lg bg-blue-50 p-3">
									<div className="text-sm">
										<strong>Zakres terapeutyczny:</strong>{" "}
										{supplement.dosageGuidelines.therapeuticRange.min}-
										{supplement.dosageGuidelines.therapeuticRange.max}{" "}
										{supplement.dosageGuidelines.therapeuticRange.unit}
									</div>
									<div className="mt-1 text-sm">
										<strong>Timing:</strong>{" "}
										{supplement.dosageGuidelines.timing.join(", ")}
									</div>
									<div className="mt-1 text-sm">
										<strong>Z jedzeniem:</strong>{" "}
										{supplement.dosageGuidelines.withFood ? "Tak" : "Nie"}
									</div>
								</div>
							</div>

							{/* Side Effects */}
							{supplement.sideEffects.length > 0 && (
								<div className="space-y-2">
									<h4 className="flex items-center gap-2 font-medium text-sm">
										<AlertTriangle className="h-4 w-4" />
										Efekty uboczne:
									</h4>
									<div className="space-y-1">
										{supplement.sideEffects.slice(0, 3).map((effect, index) => (
											<div
												key={index}
												className="flex items-center gap-2 text-sm"
											>
												<Badge
													variant={
														effect.severity === "mild"
															? "secondary"
															: effect.severity === "moderate"
																? "outline"
																: "destructive"
													}
													className="text-xs"
												>
													{effect.frequency}
												</Badge>
												<span>{effect.polishEffect}</span>
											</div>
										))}
										{supplement.sideEffects.length > 3 && (
											<Badge variant="secondary" className="text-xs">
												+{supplement.sideEffects.length - 3} więcej
											</Badge>
										)}
									</div>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</TooltipProvider>
	);
};

export default NodeDetails;
