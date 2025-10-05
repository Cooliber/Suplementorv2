"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
	Activity,
	Beaker,
	Brain,
	ChevronDown,
	ChevronRight,
	Circle,
	Filter,
	Network,
	Search,
	Target,
	Zap,
} from "lucide-react";
import React, { useMemo, useState, useCallback } from "react";

import type {
	EvidenceLevel,
	KnowledgeNode,
	NodeType,
} from "@/types/knowledge-graph";

interface VirtualizedNodeListProps {
	nodes: KnowledgeNode[];
	selectedNodeIds: string[];
	onNodeSelect: (nodeId: string) => void;
	onNodeHover?: (nodeId: string | null) => void;
	className?: string;
	maxHeight?: number;
}

// Node type icons and colors for Polish interface
const nodeTypeConfig = {
	SUPPLEMENT: {
		icon: Beaker,
		color: "text-green-600 bg-green-100",
		label: "Suplement",
	},
	NEUROTRANSMITTER: {
		icon: Zap,
		color: "text-blue-600 bg-blue-100",
		label: "Neuroprzekaźnik",
	},
	BRAIN_REGION: {
		icon: Brain,
		color: "text-purple-600 bg-purple-100",
		label: "Region mózgu",
	},
	COGNITIVE_FUNCTION: {
		icon: Target,
		color: "text-orange-600 bg-orange-100",
		label: "Funkcja poznawcza",
	},
	PATHWAY: {
		icon: Network,
		color: "text-indigo-600 bg-indigo-100",
		label: "Szlak",
	},
	MECHANISM: {
		icon: Activity,
		color: "text-pink-600 bg-pink-100",
		label: "Mechanizm",
	},
};

// Evidence level colors for Polish interface
const evidenceLevelConfig = {
	STRONG: { color: "bg-green-500", label: "Silne" },
	MODERATE: { color: "bg-yellow-500", label: "Umiarkowane" },
	WEAK: { color: "bg-orange-500", label: "Słabe" },
	INSUFFICIENT: { color: "bg-red-500", label: "Niewystarczające" },
	CONFLICTING: { color: "bg-gray-500", label: "Sprzeczne" },
};

// Virtual node item component optimized for performance
const VirtualNodeItem: React.FC<{
	node: KnowledgeNode;
	isSelected: boolean;
	onSelect: () => void;
	onHover: (hover: boolean) => void;
	style: React.CSSProperties;
}> = React.memo(({ node, isSelected, onSelect, onHover, style }) => {
	const typeConfig = nodeTypeConfig[node.type];
	const evidenceConfig = evidenceLevelConfig[node.evidenceLevel];
	const Icon = typeConfig.icon;

	return (
		<div
			style={style}
			className={`cursor-pointer border-gray-100 border-b p-3 transition-colors hover:bg-gray-50 ${
				isSelected ? "border-blue-200 bg-blue-50" : ""
			}`}
			onClick={onSelect}
			onMouseEnter={() => onHover(true)}
			onMouseLeave={() => onHover(false)}
		>
			<div className="flex items-center gap-3">
				{/* Node Type Icon */}
				<div className={`rounded-lg p-2 ${typeConfig.color}`}>
					<Icon className="h-4 w-4" />
				</div>

				{/* Node Information */}
				<div className="min-w-0 flex-1">
					<div className="mb-1 flex items-center gap-2">
						<h4 className="truncate font-medium text-sm">
							{node.polishName || node.name}
						</h4>
						<div className={`h-2 w-2 rounded-full ${evidenceConfig.color}`} />
					</div>

					<p className="truncate text-gray-600 text-xs">
						{node.polishDescription || node.description}
					</p>

					<div className="mt-2 flex items-center gap-2">
						<Badge variant="outline" className="text-xs">
							{typeConfig.label}
						</Badge>
						<Badge variant="outline" className="text-xs">
							{evidenceConfig.label}
						</Badge>
						{(node.importance || 0) > 0.8 && (
							<Badge variant="secondary" className="text-xs">
								Ważny
							</Badge>
						)}
					</div>
				</div>

				{/* Selection Indicator */}
				<div className="flex-shrink-0">
					<Circle
						className={`h-5 w-5 ${
							isSelected ? "fill-blue-600 text-blue-600" : "text-gray-300"
						}`}
					/>
				</div>
			</div>
		</div>
	);
});

VirtualNodeItem.displayName = "VirtualNodeItem";

const VirtualizedNodeList: React.FC<VirtualizedNodeListProps> = ({
	nodes,
	selectedNodeIds,
	onNodeSelect,
	onNodeHover,
	className = "",
	maxHeight = 600,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState<NodeType | "ALL">("ALL");
	const [filterEvidence, setFilterEvidence] = useState<EvidenceLevel | "ALL">(
		"ALL",
	);
	const [groupByType, setGroupByType] = useState(false);
	const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

	// Filter and search nodes with Polish text support
	const filteredNodes = useMemo(() => {
		let filtered = nodes;

		// Search filter with Polish diacritics normalization
		if (searchTerm) {
			const normalizedSearch = searchTerm.toLowerCase().normalize("NFD");
			filtered = filtered.filter((node) => {
				const normalizedName = (node.polishName || node.name)
					.toLowerCase()
					.normalize("NFD");
				const normalizedDesc = (
					node.polishDescription ||
					node.description ||
					""
				)
					.toLowerCase()
					.normalize("NFD");
				return (
					normalizedName.includes(normalizedSearch) ||
					normalizedDesc.includes(normalizedSearch)
				);
			});
		}

		// Type filter
		if (filterType !== "ALL") {
			filtered = filtered.filter((node) => node.type === filterType);
		}

		// Evidence filter
		if (filterEvidence !== "ALL") {
			filtered = filtered.filter(
				(node) => node.evidenceLevel === filterEvidence,
			);
		}

		// Sort by importance and then alphabetically by Polish name
		filtered.sort((a, b) => {
			if (a.importance !== b.importance) {
				return (b.importance || 0) - (a.importance || 0);
			}
			const nameA = a.polishName || a.name;
			const nameB = b.polishName || b.name;
			return nameA.localeCompare(nameB, "pl", { sensitivity: "base" });
		});

		return filtered;
	}, [nodes, searchTerm, filterType, filterEvidence]);

	// Group nodes by type if enabled
	const groupedNodes = useMemo(() => {
		if (!groupByType) {
			return [{ type: "ALL", nodes: filteredNodes }];
		}

		const groups = filteredNodes.reduce(
			(acc, node) => {
				if (!acc[node.type]) {
					acc[node.type] = [];
				}
				acc[node.type].push(node);
				return acc;
			},
			{} as Record<NodeType, KnowledgeNode[]>,
		);

		return Object.entries(groups).map(([type, nodes]) => ({
			type: type as NodeType,
			nodes,
		}));
	}, [filteredNodes, groupByType]);

	// Flatten grouped nodes for virtualization
	const virtualItems = useMemo(() => {
		const items: Array<{ type: "group" | "node"; data: any; id: string }> = [];

		groupedNodes.forEach((group) => {
			if (groupByType && group.type !== "ALL") {
				// Add group header
				items.push({
					type: "group",
					data: { type: group.type, count: group.nodes.length },
					id: `group-${group.type}`,
				});

				// Add nodes if group is expanded
				if (expandedGroups.has(group.type)) {
					group.nodes.forEach((node) => {
						items.push({
							type: "node",
							data: node,
							id: node.id,
						});
					});
				}
			} else {
				// Add all nodes without grouping
				group.nodes.forEach((node) => {
					items.push({
						type: "node",
						data: node,
						id: node.id,
					});
				});
			}
		});

		return items;
	}, [groupedNodes, groupByType, expandedGroups]);

	// Virtual scrolling setup
	const parentRef = React.useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: virtualItems.length,
		getScrollElement: () => parentRef.current,
		estimateSize: useCallback(
			(index: number) => {
				const item = virtualItems[index];
				return item?.type === "group" ? 40 : 80; // Group headers are smaller
			},
			[virtualItems],
		),
		overscan: 10, // Render 10 extra items for smooth scrolling
	});

	// Handle group toggle
	const toggleGroup = useCallback((groupType: NodeType) => {
		setExpandedGroups((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(groupType)) {
				newSet.delete(groupType);
			} else {
				newSet.add(groupType);
			}
			return newSet;
		});
	}, []);

	// Handle node selection
	const handleNodeSelect = useCallback(
		(nodeId: string) => {
			onNodeSelect(nodeId);
		},
		[onNodeSelect],
	);

	// Handle node hover
	const handleNodeHover = useCallback(
		(nodeId: string, hover: boolean) => {
			if (onNodeHover) {
				onNodeHover(hover ? nodeId : null);
			}
		},
		[onNodeHover],
	);

	// Get node type options for filter
	const nodeTypeOptions = useMemo(() => {
		const types = Array.from(new Set(nodes.map((n) => n.type)));
		return types.map((type) => ({
			value: type,
			label: nodeTypeConfig[type]?.label || type,
		}));
	}, [nodes]);

	// Get evidence level options for filter
	const evidenceLevelOptions = useMemo(() => {
		const levels = Array.from(new Set(nodes.map((n) => n.evidenceLevel)));
		return levels.map((level) => ({
			value: level,
			label: evidenceLevelConfig[level]?.label || level,
		}));
	}, [nodes]);

	return (
		<Card className={className}>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center justify-between text-lg">
					<span>Lista węzłów ({filteredNodes.length})</span>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setGroupByType(!groupByType)}
					>
						{groupByType ? "Rozgrupuj" : "Grupuj"}
					</Button>
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Search and Filters */}
				<div className="space-y-3">
					{/* Search Input */}
					<div className="relative">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
						<Input
							placeholder="Szukaj węzłów (obsługuje polskie znaki)..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>

					{/* Filters */}
					<div className="flex gap-2">
						<select
							value={filterType}
							onChange={(e) =>
								setFilterType(e.target.value as NodeType | "ALL")
							}
							className="rounded border px-3 py-1 text-sm"
						>
							<option value="ALL">Wszystkie typy</option>
							{nodeTypeOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>

						<select
							value={filterEvidence}
							onChange={(e) =>
								setFilterEvidence(e.target.value as EvidenceLevel | "ALL")
							}
							className="rounded border px-3 py-1 text-sm"
						>
							<option value="ALL">Wszystkie dowody</option>
							{evidenceLevelOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</div>

				<Separator />

				{/* Virtualized List */}
				<div
					ref={parentRef}
					className="overflow-auto rounded-lg border"
					style={{
						height: `${Math.min(maxHeight, virtualItems.length * 80)}px`,
					}}
				>
					<div
						style={{
							height: `${virtualizer.getTotalSize()}px`,
							width: "100%",
							position: "relative",
						}}
					>
						{virtualizer.getVirtualItems().map((virtualItem) => {
							const item = virtualItems[virtualItem.index];

							if (!item) return null;

							if (item.type === "group") {
								const groupData = item.data;
								const typeConfig = nodeTypeConfig[groupData.type as NodeType];
								const Icon = typeConfig.icon;
								const isExpanded = expandedGroups.has(groupData.type);

								return (
									<div
										key={virtualItem.key}
										style={{
											position: "absolute",
											top: 0,
											left: 0,
											width: "100%",
											height: `${virtualItem.size}px`,
											transform: `translateY(${virtualItem.start}px)`,
										}}
									>
										<div
											className="flex cursor-pointer items-center gap-2 bg-gray-100 p-2 hover:bg-gray-200"
											onClick={() => toggleGroup(groupData.type)}
										>
											{isExpanded ? (
												<ChevronDown className="h-4 w-4" />
											) : (
												<ChevronRight className="h-4 w-4" />
											)}
											<Icon className="h-4 w-4" />
											<span className="font-medium text-sm">
												{typeConfig.label} ({groupData.count})
											</span>
										</div>
									</div>
								);
							}
							const node = item.data;
							const isSelected = selectedNodeIds.includes(node.id);

							return (
								<VirtualNodeItem
									key={virtualItem.key}
									node={node}
									isSelected={isSelected}
									onSelect={() => handleNodeSelect(node.id)}
									onHover={(hover) => handleNodeHover(node.id, hover)}
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: "100%",
										height: `${virtualItem.size}px`,
										transform: `translateY(${virtualItem.start}px)`,
									}}
								/>
							);
						})}
					</div>
				</div>

				{/* Summary */}
				<div className="text-center text-gray-500 text-xs">
					Wyświetlono {filteredNodes.length} z {nodes.length} węzłów
					{selectedNodeIds.length > 0 &&
						` • ${selectedNodeIds.length} wybranych`}
				</div>
			</CardContent>
		</Card>
	);
};

export default VirtualizedNodeList;
