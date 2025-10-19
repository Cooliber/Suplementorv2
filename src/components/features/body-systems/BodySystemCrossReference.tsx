"use client";

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
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BodySystem } from "@/data/body-systems";
import {
	Activity,
	ArrowRight,
	Brain,
	ChevronDown,
	ChevronRight,
	Droplets,
	Eye,
	Heart,
	Link as LinkIcon,
	Network,
	Shield,
	Thermometer,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

interface BodySystemCrossReferenceProps {
	systems: BodySystem[];
	selectedSystemId?: string;
	onSystemSelect?: (systemId: string) => void;
}

interface SystemConnection {
	source: BodySystem;
	target: BodySystem;
	connectionType: "direct" | "indirect";
	strength: number;
	description: string;
	polishDescription: string;
}

const systemIcons: Record<string, React.ReactNode> = {
	cardiovascular: <Heart className="h-4 w-4" />,
	digestive: <Activity className="h-4 w-4" />,
	immune: <Shield className="h-4 w-4" />,
	skeletal: <Activity className="h-4 w-4" />,
	muscular: <Activity className="h-4 w-4" />,
	respiratory: <Activity className="h-4 w-4" />,
	nervous: <Brain className="h-4 w-4" />,
	endocrine: <Activity className="h-4 w-4" />,
	reproductive: <Activity className="h-4 w-4" />,
	integumentary: <Shield className="h-4 w-4" />,
	endocannabinoid: <Brain className="h-4 w-4" />,
	lymphatic: <Shield className="h-4 w-4" />,
	urinary: <Droplets className="h-4 w-4" />,
	sensory: <Eye className="h-4 w-4" />,
	vestibular: <Brain className="h-4 w-4" />,
	hematopoietic: <Heart className="h-4 w-4" />,
	thermoregulatory: <Thermometer className="h-4 w-4" />,
	excretory: <Activity className="h-4 w-4" />,
};

const systemColors: Record<string, string> = {
	cardiovascular: "bg-red-100 text-red-800 border-red-200",
	digestive: "bg-amber-100 text-amber-800 border-amber-200",
	immune: "bg-blue-100 text-blue-800 border-blue-200",
	skeletal: "bg-gray-100 text-gray-800 border-gray-200",
	muscular: "bg-orange-100 text-orange-800 border-orange-200",
	respiratory: "bg-cyan-100 text-cyan-800 border-cyan-200",
	nervous: "bg-purple-100 text-purple-800 border-purple-200",
	endocrine: "bg-pink-100 text-pink-800 border-pink-200",
	reproductive: "bg-rose-100 text-rose-800 border-rose-200",
	integumentary: "bg-green-100 text-green-800 border-green-200",
	endocannabinoid: "bg-indigo-100 text-indigo-800 border-indigo-200",
	lymphatic: "bg-teal-100 text-teal-800 border-teal-200",
	urinary: "bg-blue-100 text-blue-800 border-blue-200",
	sensory: "bg-violet-100 text-violet-800 border-violet-200",
	vestibular: "bg-slate-100 text-slate-800 border-slate-200",
	hematopoietic: "bg-red-100 text-red-800 border-red-200",
	thermoregulatory: "bg-orange-100 text-orange-800 border-orange-200",
	excretory: "bg-lime-100 text-lime-800 border-lime-200",
};

export function BodySystemCrossReference({
	systems,
	selectedSystemId,
	onSystemSelect,
}: BodySystemCrossReferenceProps) {
	const [viewMode, setViewMode] = useState<"connections" | "matrix" | "graph">(
		"connections",
	);
	const [showDetails, setShowDetails] = useState(false);

	// Generate system connections based on anatomical connections and shared supplements
	const systemConnections = useMemo((): SystemConnection[] => {
		const connections: SystemConnection[] = [];

		systems.forEach((sourceSystem) => {
			systems.forEach((targetSystem) => {
				if (sourceSystem.id === targetSystem.id) return;

				// Check for direct anatomical connections
				const hasDirectConnection =
					sourceSystem.anatomicalInfo.connections.some(
						(conn) =>
							targetSystem.name.includes(conn) ||
							targetSystem.polishName.includes(conn),
					) ||
					targetSystem.anatomicalInfo.connections.some(
						(conn) =>
							sourceSystem.name.includes(conn) ||
							sourceSystem.polishName.includes(conn),
					);

				// Check for shared supplements (indicates functional relationship)
				const sourceSupplementIds = new Set(
					sourceSystem.relatedSupplements.map((s) => s.supplementId),
				);
				const targetSupplementIds = new Set(
					targetSystem.relatedSupplements.map((s) => s.supplementId),
				);
				const sharedSupplements = [...sourceSupplementIds].filter((id) =>
					targetSupplementIds.has(id),
				);

				if (hasDirectConnection || sharedSupplements.length > 0) {
					const strength = Math.min(
						(hasDirectConnection ? 0.8 : 0) + sharedSupplements.length * 0.1,
						1.0,
					);

					connections.push({
						source: sourceSystem,
						target: targetSystem,
						connectionType: hasDirectConnection ? "direct" : "indirect",
						strength,
						description: generateConnectionDescription(
							sourceSystem,
							targetSystem,
							sharedSupplements,
						),
						polishDescription: generateConnectionDescription(
							sourceSystem,
							targetSystem,
							sharedSupplements,
							true,
						),
					});
				}
			});
		});

		return connections.sort((a, b) => b.strength - a.strength);
	}, [systems]);

	const selectedSystem = systems.find((s) => s.id === selectedSystemId);

	function generateConnectionDescription(
		source: BodySystem,
		target: BodySystem,
		sharedSupplements: string[] = [],
		polish = false,
	): string {
		const sourceName = polish ? source.polishName : source.name;
		const targetName = polish ? target.polishName : target.name;

		if (sharedSupplements.length > 0) {
			return `${sourceName} and ${targetName} share common supplements indicating functional relationships`;
		}

		return `${sourceName} has anatomical connections with ${targetName}`;
	}

	const getConnectionBadgeColor = (strength: number) => {
		if (strength >= 0.8) return "bg-green-100 text-green-800 border-green-200";
		if (strength >= 0.6) return "bg-blue-100 text-blue-800 border-blue-200";
		if (strength >= 0.4)
			return "bg-yellow-100 text-yellow-800 border-yellow-200";
		return "bg-gray-100 text-gray-800 border-gray-200";
	};

	if (!selectedSystem) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Network className="h-5 w-5" />
						Przegląd Połączeń Międzysystemowych
					</CardTitle>
					<CardDescription>
						Wybierz układ ciała, aby zobaczyć jego połączenia z innymi układami
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-3 lg:grid-cols-5">
						{systems.map((system) => (
							<Button
								key={system.id}
								variant="outline"
								className="flex h-auto flex-col items-center gap-2 p-3"
								onClick={() => onSystemSelect?.(system.id)}
							>
								<div className="rounded-lg bg-gray-100 p-2">
									{systemIcons[system.id] || <Activity className="h-4 w-4" />}
								</div>
								<span className="text-center text-xs">{system.polishName}</span>
							</Button>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Network className="h-5 w-5" />
					Połączenia: {selectedSystem.polishName}
				</CardTitle>
				<CardDescription>
					Interakcje anatomiczne i funkcjonalne z innymi układami ciała
				</CardDescription>
			</CardHeader>

			<CardContent>
				<Tabs
					value={viewMode}
					onValueChange={(value: any) => setViewMode(value)}
				>
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="connections">Połączenia</TabsTrigger>
						<TabsTrigger value="matrix">Macierz</TabsTrigger>
						<TabsTrigger value="graph">Graf</TabsTrigger>
					</TabsList>

					<TabsContent value="connections" className="mt-6 space-y-4">
						<div className="grid gap-4">
							{systemConnections
								.filter(
									(conn) =>
										conn.source.id === selectedSystemId ||
										conn.target.id === selectedSystemId,
								)
								.slice(0, 10)
								.map((connection, index) => {
									const isSourceSelected =
										connection.source.id === selectedSystemId;
									const connectedSystem = isSourceSelected
										? connection.target
										: connection.source;

									return (
										<div
											key={index}
											className="flex items-center gap-4 rounded-lg border p-4"
										>
											<div className="flex items-center gap-3">
												<div
													className={`rounded-lg p-2 ${systemColors[selectedSystem.id]}`}
												>
													{systemIcons[selectedSystem.id] || (
														<Activity className="h-4 w-4" />
													)}
												</div>
												<ArrowRight className="h-4 w-4 text-gray-400" />
												<div
													className={`rounded-lg p-2 ${systemColors[connectedSystem.id]}`}
												>
													{systemIcons[connectedSystem.id] || (
														<Activity className="h-4 w-4" />
													)}
												</div>
											</div>

											<div className="flex-1">
												<div className="mb-1 flex items-center gap-2">
													<span className="font-medium">
														{isSourceSelected
															? selectedSystem.polishName
															: connectedSystem.polishName}
													</span>
													<ArrowRight className="h-3 w-3" />
													<span className="font-medium">
														{isSourceSelected
															? connectedSystem.polishName
															: selectedSystem.polishName}
													</span>
													<Badge
														className={`text-xs ${getConnectionBadgeColor(connection.strength)}`}
													>
														{Math.round(connection.strength * 100)}%
													</Badge>
												</div>
												<p className="text-gray-600 text-sm">
													{connection.polishDescription}
												</p>
											</div>

											<Button
												variant="outline"
												size="sm"
												onClick={() => onSystemSelect?.(connectedSystem.id)}
											>
												Zobacz
											</Button>
										</div>
									);
								})}
						</div>
					</TabsContent>

					<TabsContent value="matrix" className="mt-6">
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-2 border-b pb-2 font-medium text-gray-600 text-xs">
								<div>Układ</div>
								<div className="grid grid-cols-4 gap-1 text-center">
									{systems.slice(0, 4).map((system) => (
										<div key={system.id} className="truncate">
											{system.polishName}
										</div>
									))}
								</div>
							</div>

							{systems.slice(0, 5).map((sourceSystem) => (
								<div
									key={sourceSystem.id}
									className="grid grid-cols-2 items-center gap-2 text-xs"
								>
									<div className="truncate font-medium">
										{sourceSystem.polishName}
									</div>
									<div className="grid grid-cols-4 gap-1">
										{systems.slice(0, 4).map((targetSystem) => {
											if (sourceSystem.id === targetSystem.id) {
												return (
													<div
														key={targetSystem.id}
														className="h-6 rounded bg-gray-100"
													/>
												);
											}

											const connection = systemConnections.find(
												(conn) =>
													(conn.source.id === sourceSystem.id &&
														conn.target.id === targetSystem.id) ||
													(conn.source.id === targetSystem.id &&
														conn.target.id === sourceSystem.id),
											);

											return (
												<div
													key={targetSystem.id}
													className={`h-6 cursor-pointer rounded transition-colors ${
														connection
															? getConnectionBadgeColor(connection.strength)
															: "bg-gray-50"
													}`}
													onClick={() =>
														connection && onSystemSelect?.(targetSystem.id)
													}
													title={
														connection
															? `${Math.round(connection.strength * 100)}% connection`
															: "No connection"
													}
												/>
											);
										})}
									</div>
								</div>
							))}
						</div>
					</TabsContent>

					<TabsContent value="graph" className="mt-6">
						<div className="py-8 text-center text-gray-500">
							<Network className="mx-auto mb-4 h-12 w-12 opacity-50" />
							<p>Wizualizacja grafu połączeń</p>
							<p className="text-sm">
								Funkcjonalność graficzna zostanie dodana w przyszłej wersji
							</p>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
