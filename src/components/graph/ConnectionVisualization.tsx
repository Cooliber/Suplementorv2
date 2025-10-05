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
	AlertTriangle,
	ArrowLeft,
	ArrowRight,
	CheckCircle,
	Eye,
	EyeOff,
	Filter,
	Network,
	RotateCw,
	TrendingDown,
	TrendingUp,
	XCircle,
	Zap,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

export interface ConnectionVisualizationProps {
	nodes: KnowledgeNode[];
	relationships: KnowledgeRelationship[];
	supplements?: SupplementWithRelations[];
	selectedNodeIds?: string[];
	sourceNodeId?: string;
	onNodeSelect?: (nodeId: string) => void;
	onRelationshipSelect?: (relationship: KnowledgeRelationship) => void;
	className?: string;
}

interface ConnectionMatrix {
	sourceId: string;
	targetId: string;
	relationship: KnowledgeRelationship;
	sourceNode: KnowledgeNode;
	targetNode: KnowledgeNode;
	strength: number;
	type: string;
	evidenceLevel: string;
	mechanism: string;
	polishMechanism: string;
}

const ConnectionVisualization: React.FC<ConnectionVisualizationProps> = ({
	nodes,
	relationships,
	supplements = [],
	selectedNodeIds = [],
	sourceNodeId,
	onNodeSelect,
	onRelationshipSelect,
	className = "",
}) => {
	const [viewMode, setViewMode] = useState<"matrix" | "network" | "strength">(
		"matrix",
	);
	const [filterType, setFilterType] = useState<
		"all" | "strong" | "synergistic" | "antagonistic"
	>("all");
	const [showDetails, setShowDetails] = useState(true);
	const [sortBy, setSortBy] = useState<"strength" | "evidence" | "type">(
		"strength",
	);

	// Create connection matrix
	const connectionMatrix = useMemo(() => {
		const matrix: ConnectionMatrix[] = [];

		relationships.forEach((rel) => {
			const sourceNode = nodes.find((n) => n.id === rel.sourceId);
			const targetNode = nodes.find((n) => n.id === rel.targetId);

			if (sourceNode && targetNode) {
				matrix.push({
					sourceId: rel.sourceId,
					targetId: rel.targetId,
					relationship: rel,
					sourceNode,
					targetNode,
					strength: rel.strength,
					type: rel.type,
					evidenceLevel: rel.evidenceLevel,
					mechanism: rel.mechanism,
					polishMechanism: rel.polishMechanism || rel.mechanism,
				});
			}
		});

		// Apply filters
		let filteredMatrix = matrix;

		switch (filterType) {
			case "strong":
				filteredMatrix = matrix.filter((conn) => conn.strength >= 0.7);
				break;
			case "synergistic":
				filteredMatrix = matrix.filter((conn) =>
					["ENHANCES", "SYNERGIZES", "PRODUCES"].includes(conn.type),
				);
				break;
			case "antagonistic":
				filteredMatrix = matrix.filter((conn) =>
					["INHIBITS", "ANTAGONIZES"].includes(conn.type),
				);
				break;
		}

		// Apply sorting
		filteredMatrix.sort((a, b) => {
			switch (sortBy) {
				case "strength":
					return b.strength - a.strength;
				case "evidence": {
					const evidenceOrder = {
						STRONG: 4,
						MODERATE: 3,
						WEAK: 2,
						INSUFFICIENT: 1,
						CONFLICTING: 0,
					};
					return (
						(evidenceOrder[b.evidenceLevel as keyof typeof evidenceOrder] ||
							0) -
						(evidenceOrder[a.evidenceLevel as keyof typeof evidenceOrder] || 0)
					);
				}
				case "type":
					return a.type.localeCompare(b.type);
				default:
					return 0;
			}
		});

		return filteredMatrix;
	}, [nodes, relationships, filterType, sortBy]);

	// Filter connections based on sourceNodeId if provided
	const filteredConnectionsBySource = useMemo(() => {
		if (!sourceNodeId) return connectionMatrix;

		return connectionMatrix.filter(
			(conn) =>
				conn.sourceId === sourceNodeId || conn.targetId === sourceNodeId,
		);
	}, [connectionMatrix, sourceNodeId]);

	// Get connection statistics
	const connectionStats = useMemo(() => {
		const stats = {
			total: filteredConnectionsBySource.length,
			strong: filteredConnectionsBySource.filter((c) => c.strength >= 0.7)
				.length,
			moderate: filteredConnectionsBySource.filter(
				(c) => c.strength >= 0.4 && c.strength < 0.7,
			).length,
			weak: filteredConnectionsBySource.filter((c) => c.strength < 0.4).length,
			synergistic: filteredConnectionsBySource.filter((c) =>
				["ENHANCES", "SYNERGIZES", "PRODUCES"].includes(c.type),
			).length,
			antagonistic: filteredConnectionsBySource.filter((c) =>
				["INHIBITS", "ANTAGONIZES"].includes(c.type),
			).length,
			byEvidence: {
				STRONG: filteredConnectionsBySource.filter(
					(c) => c.evidenceLevel === "STRONG",
				).length,
				MODERATE: filteredConnectionsBySource.filter(
					(c) => c.evidenceLevel === "MODERATE",
				).length,
				WEAK: filteredConnectionsBySource.filter(
					(c) => c.evidenceLevel === "WEAK",
				).length,
				INSUFFICIENT: filteredConnectionsBySource.filter(
					(c) => c.evidenceLevel === "INSUFFICIENT",
				).length,
				CONFLICTING: filteredConnectionsBySource.filter(
					(c) => c.evidenceLevel === "CONFLICTING",
				).length,
			},
		};
		return stats;
	}, [filteredConnectionsBySource]);

	const getConnectionTypeIcon = (type: string) => {
		switch (type) {
			case "ENHANCES":
			case "SYNERGIZES":
				return <TrendingUp className="h-4 w-4 text-green-600" />;
			case "INHIBITS":
			case "ANTAGONIZES":
				return <TrendingDown className="h-4 w-4 text-red-600" />;
			case "MODULATES":
				return <RotateCw className="h-4 w-4 text-blue-600" />;
			default:
				return <ArrowRight className="h-4 w-4 text-gray-600" />;
		}
	};

	const getConnectionTypeColor = (type: string) => {
		switch (type) {
			case "ENHANCES":
			case "SYNERGIZES":
				return "text-green-600 bg-green-100";
			case "INHIBITS":
			case "ANTAGONIZES":
				return "text-red-600 bg-red-100";
			case "MODULATES":
				return "text-blue-600 bg-blue-100";
			case "REQUIRES":
				return "text-purple-600 bg-purple-100";
			case "PRODUCES":
				return "text-orange-600 bg-orange-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const getEvidenceIcon = (level: string) => {
		switch (level) {
			case "STRONG":
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case "MODERATE":
				return <CheckCircle className="h-4 w-4 text-yellow-600" />;
			case "WEAK":
				return <AlertTriangle className="h-4 w-4 text-orange-600" />;
			case "INSUFFICIENT":
				return <XCircle className="h-4 w-4 text-gray-600" />;
			case "CONFLICTING":
				return <XCircle className="h-4 w-4 text-red-600" />;
			default:
				return <AlertTriangle className="h-4 w-4 text-gray-600" />;
		}
	};

	const getStrengthBar = (strength: number) => {
		const percentage = Math.round(strength * 100);
		const color =
			strength >= 0.7
				? "bg-green-500"
				: strength >= 0.4
					? "bg-yellow-500"
					: "bg-red-500";

		return (
			<div className="h-2 w-full rounded-full bg-gray-200">
				<div
					className={`h-2 rounded-full transition-all duration-300 ${color}`}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		);
	};

	return (
		<TooltipProvider>
			<Card className={`${className}`}>
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2 text-lg">
							<Network className="h-5 w-5" />
							Analiza połączeń
						</CardTitle>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowDetails(!showDetails)}
						>
							{showDetails ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</div>

					<div className="flex flex-wrap items-center justify-between gap-2">
						{/* View Mode */}
						<div className="flex gap-1">
							<Button
								variant={viewMode === "matrix" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("matrix")}
							>
								Macierz
							</Button>
							<Button
								variant={viewMode === "strength" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("strength")}
							>
								Siła
							</Button>
						</div>

						{/* Filters */}
						<div className="flex gap-1">
							<Button
								variant={filterType === "all" ? "default" : "outline"}
								size="sm"
								onClick={() => setFilterType("all")}
							>
								Wszystkie
							</Button>
							<Button
								variant={filterType === "strong" ? "default" : "outline"}
								size="sm"
								onClick={() => setFilterType("strong")}
							>
								Silne
							</Button>
							<Button
								variant={filterType === "synergistic" ? "default" : "outline"}
								size="sm"
								onClick={() => setFilterType("synergistic")}
							>
								Synergiczne
							</Button>
							<Button
								variant={filterType === "antagonistic" ? "default" : "outline"}
								size="sm"
								onClick={() => setFilterType("antagonistic")}
							>
								Antagonistyczne
							</Button>
						</div>

						{/* Sort */}
						<div className="flex gap-1">
							<Button
								variant={sortBy === "strength" ? "default" : "outline"}
								size="sm"
								onClick={() => setSortBy("strength")}
							>
								Siła
							</Button>
							<Button
								variant={sortBy === "evidence" ? "default" : "outline"}
								size="sm"
								onClick={() => setSortBy("evidence")}
							>
								Dowody
							</Button>
							<Button
								variant={sortBy === "type" ? "default" : "outline"}
								size="sm"
								onClick={() => setSortBy("type")}
							>
								Typ
							</Button>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Statistics */}
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						<div className="rounded-lg bg-blue-50 p-3 text-center">
							<div className="font-bold text-blue-600 text-lg">
								{connectionStats.total}
							</div>
							<div className="text-blue-800 text-xs">Wszystkie</div>
						</div>
						<div className="rounded-lg bg-green-50 p-3 text-center">
							<div className="font-bold text-green-600 text-lg">
								{connectionStats.synergistic}
							</div>
							<div className="text-green-800 text-xs">Synergiczne</div>
						</div>
						<div className="rounded-lg bg-red-50 p-3 text-center">
							<div className="font-bold text-lg text-red-600">
								{connectionStats.antagonistic}
							</div>
							<div className="text-red-800 text-xs">Antagonistyczne</div>
						</div>
						<div className="rounded-lg bg-yellow-50 p-3 text-center">
							<div className="font-bold text-lg text-yellow-600">
								{connectionStats.strong}
							</div>
							<div className="text-xs text-yellow-800">Silne (≥70%)</div>
						</div>
					</div>

					{/* Evidence Level Distribution */}
					<div className="space-y-2">
						<h4 className="font-medium text-sm">Rozkład poziomów dowodów:</h4>
						<div className="grid grid-cols-5 gap-2">
							{Object.entries(connectionStats.byEvidence).map(
								([level, count]) => (
									<div
										key={level}
										className="rounded bg-gray-50 p-2 text-center"
									>
										<div className="font-bold text-sm">{count}</div>
										<div className="text-gray-600 text-xs">
											{level === "STRONG"
												? "Silne"
												: level === "MODERATE"
													? "Umiarkowane"
													: level === "WEAK"
														? "Słabe"
														: level === "INSUFFICIENT"
															? "Niewystarczające"
															: "Sprzeczne"}
										</div>
									</div>
								),
							)}
						</div>
					</div>

					{/* Connection Matrix */}
					{viewMode === "matrix" && (
						<div className="space-y-2">
							<h4 className="font-medium text-sm">Macierz połączeń:</h4>
							<div className="max-h-96 space-y-2 overflow-y-auto">
								{filteredConnectionsBySource
									.slice(0, 20)
									.map((connection, index) => (
										<div
											key={index}
											className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50"
										>
											<div className="flex flex-1 items-center gap-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => onNodeSelect?.(connection.sourceId)}
													className="h-auto justify-start p-1 text-left"
												>
													<span className="font-medium text-sm">
														{connection.sourceNode.polishName}
													</span>
												</Button>

												<div className="flex items-center gap-1">
													{getConnectionTypeIcon(connection.type)}
													<ArrowRight className="h-3 w-3 text-gray-400" />
												</div>

												<Button
													variant="ghost"
													size="sm"
													onClick={() => onNodeSelect?.(connection.targetId)}
													className="h-auto justify-start p-1 text-left"
												>
													<span className="font-medium text-sm">
														{connection.targetNode.polishName}
													</span>
												</Button>
											</div>

											<div className="flex items-center gap-2">
												<Badge
													className={`text-xs ${getConnectionTypeColor(connection.type)}`}
												>
													{connection.type}
												</Badge>

												<Tooltip>
													<TooltipTrigger>
														{getEvidenceIcon(connection.evidenceLevel)}
													</TooltipTrigger>
													<TooltipContent>
														Poziom dowodów: {connection.evidenceLevel}
													</TooltipContent>
												</Tooltip>

												<div className="w-16">
													{getStrengthBar(connection.strength)}
												</div>

												<span className="w-8 text-right text-gray-600 text-xs">
													{Math.round(connection.strength * 100)}%
												</span>
											</div>
										</div>
									))}

								{filteredConnectionsBySource.length > 20 && (
									<div className="py-2 text-center">
										<Badge variant="secondary" className="text-xs">
											+{filteredConnectionsBySource.length - 20} więcej połączeń
										</Badge>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Strength Analysis */}
					{viewMode === "strength" && (
						<div className="space-y-4">
							<h4 className="font-medium text-sm">Analiza siły połączeń:</h4>

							{/* Strength Distribution */}
							<div className="space-y-3">
								<div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
									<div className="flex items-center gap-2">
										<Zap className="h-4 w-4 text-green-600" />
										<span className="font-medium text-sm">
											Silne połączenia (70-100%)
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-bold text-green-600 text-lg">
											{connectionStats.strong}
										</span>
										<div className="h-2 w-20 rounded-full bg-gray-200">
											<div
												className="h-2 rounded-full bg-green-500"
												style={{
													width: `${(connectionStats.strong / Math.max(connectionStats.total, 1)) * 100}%`,
												}}
											/>
										</div>
									</div>
								</div>

								<div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3">
									<div className="flex items-center gap-2">
										<Zap className="h-4 w-4 text-yellow-600" />
										<span className="font-medium text-sm">
											Umiarkowane połączenia (40-70%)
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-bold text-lg text-yellow-600">
											{connectionStats.moderate}
										</span>
										<div className="h-2 w-20 rounded-full bg-gray-200">
											<div
												className="h-2 rounded-full bg-yellow-500"
												style={{
													width: `${(connectionStats.moderate / Math.max(connectionStats.total, 1)) * 100}%`,
												}}
											/>
										</div>
									</div>
								</div>

								<div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
									<div className="flex items-center gap-2">
										<Zap className="h-4 w-4 text-red-600" />
										<span className="font-medium text-sm">
											Słabe połączenia (0-40%)
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-bold text-lg text-red-600">
											{connectionStats.weak}
										</span>
										<div className="h-2 w-20 rounded-full bg-gray-200">
											<div
												className="h-2 rounded-full bg-red-500"
												style={{
													width: `${(connectionStats.weak / Math.max(connectionStats.total, 1)) * 100}%`,
												}}
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Top Strongest Connections */}
							<div className="space-y-2">
								<h5 className="font-medium text-sm">
									Najsilniejsze połączenia:
								</h5>
								<div className="space-y-2">
									{filteredConnectionsBySource
										.slice(0, 5)
										.map((connection, index) => (
											<div
												key={index}
												className="flex items-center gap-3 rounded-lg bg-gray-50 p-2"
											>
												<div className="flex flex-1 items-center gap-2">
													<span className="text-sm">
														{connection.sourceNode.polishName}
													</span>
													<ArrowRight className="h-3 w-3 text-gray-400" />
													<span className="text-sm">
														{connection.targetNode.polishName}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<div className="w-12">
														{getStrengthBar(connection.strength)}
													</div>
													<span className="font-bold text-green-600 text-sm">
														{Math.round(connection.strength * 100)}%
													</span>
												</div>
											</div>
										))}
								</div>
							</div>
						</div>
					)}

					{filteredConnectionsBySource.length === 0 && (
						<div className="py-8 text-center text-gray-500">
							<Network className="mx-auto mb-2 h-12 w-12 opacity-50" />
							<p>Brak połączeń spełniających kryteria filtrowania</p>
						</div>
					)}
				</CardContent>
			</Card>
		</TooltipProvider>
	);
};

export default ConnectionVisualization;
