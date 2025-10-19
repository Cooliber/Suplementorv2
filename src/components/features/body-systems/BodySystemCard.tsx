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
import { type BodySystem, RelatedSupplement } from "@/data/body-systems";
import {
	Activity,
	Brain,
	ChevronDown,
	ChevronRight,
	Droplets,
	Eye,
	Heart,
	Shield,
	Thermometer,
} from "lucide-react";
import React from "react";

interface BodySystemCardProps {
	system: BodySystem;
	onSupplementClick?: (supplementId: string) => void;
	compact?: boolean;
	showRelatedSupplements?: boolean;
}

const systemIcons: Record<string, React.ReactNode> = {
	cardiovascular: <Heart className="h-6 w-6" />,
	digestive: <Activity className="h-6 w-6" />,
	immune: <Shield className="h-6 w-6" />,
	skeletal: <Activity className="h-6 w-6" />,
	muscular: <Activity className="h-6 w-6" />,
	respiratory: <Activity className="h-6 w-6" />,
	nervous: <Brain className="h-6 w-6" />,
	endocrine: <Activity className="h-6 w-6" />,
	reproductive: <Activity className="h-6 w-6" />,
	integumentary: <Shield className="h-6 w-6" />,
	endocannabinoid: <Brain className="h-6 w-6" />,
	lymphatic: <Shield className="h-6 w-6" />,
	urinary: <Droplets className="h-6 w-6" />,
	sensory: <Eye className="h-6 w-6" />,
	vestibular: <Brain className="h-6 w-6" />,
	hematopoietic: <Heart className="h-6 w-6" />,
	thermoregulatory: <Thermometer className="h-6 w-6" />,
	excretory: <Activity className="h-6 w-6" />,
};

const systemColors: Record<string, string> = {
	cardiovascular: "from-red-100 to-red-50 border-red-200",
	digestive: "from-amber-100 to-amber-50 border-amber-200",
	immune: "from-blue-100 to-blue-50 border-blue-200",
	skeletal: "from-gray-100 to-gray-50 border-gray-200",
	muscular: "from-orange-100 to-orange-50 border-orange-200",
	respiratory: "from-cyan-100 to-cyan-50 border-cyan-200",
	nervous: "from-purple-100 to-purple-50 border-purple-200",
	endocrine: "from-pink-100 to-pink-50 border-pink-200",
	reproductive: "from-rose-100 to-rose-50 border-rose-200",
	integumentary: "from-green-100 to-green-50 border-green-200",
	endocannabinoid: "from-indigo-100 to-indigo-50 border-indigo-200",
	lymphatic: "from-teal-100 to-teal-50 border-teal-200",
	urinary: "from-blue-100 to-blue-50 border-blue-200",
	sensory: "from-violet-100 to-violet-50 border-violet-200",
	vestibular: "from-slate-100 to-slate-50 border-slate-200",
	hematopoietic: "from-red-100 to-red-50 border-red-200",
	thermoregulatory: "from-orange-100 to-orange-50 border-orange-200",
	excretory: "from-lime-100 to-lime-50 border-lime-200",
};

export function BodySystemCard({
	system,
	onSupplementClick,
	compact = false,
	showRelatedSupplements = true,
}: BodySystemCardProps) {
	const [isExpanded, setIsExpanded] = React.useState(!compact);
	const [showSupplements, setShowSupplements] = React.useState(false);

	const icon = systemIcons[system.id] || <Activity className="h-6 w-6" />;
	const colorClass =
		systemColors[system.id] || "from-gray-100 to-gray-50 border-gray-200";

	const getEvidenceBadgeColor = (level: string) => {
		switch (level) {
			case "STRONG":
				return "bg-green-100 text-green-800 border-green-200";
			case "MODERATE":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "WEAK":
				return "bg-orange-100 text-orange-800 border-orange-200";
			case "INSUFFICIENT":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const translateEvidenceLevel = (level: string): string => {
		switch (level) {
			case "STRONG":
				return "Silny";
			case "MODERATE":
				return "Umiarkowany";
			case "WEAK":
				return "Słaby";
			case "INSUFFICIENT":
				return "Niewystarczający";
			default:
				return "Nieznany";
		}
	};

	if (compact) {
		return (
			<Card
				className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${colorClass}`}
			>
				<CardHeader className="pb-3">
					<div className="flex items-center gap-3">
						<div className="rounded-lg bg-white/50 p-2">{icon}</div>
						<div className="flex-1">
							<CardTitle className="text-lg">{system.polishName}</CardTitle>
							<CardDescription className="text-sm">
								{system.name}
							</CardDescription>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsExpanded(!isExpanded)}
							className="p-2"
						>
							{isExpanded ? (
								<ChevronDown className="h-4 w-4" />
							) : (
								<ChevronRight className="h-4 w-4" />
							)}
						</Button>
					</div>
				</CardHeader>

				{isExpanded && (
					<CardContent className="pt-0">
						<p className="mb-4 text-gray-700 text-sm">
							{system.polishDescription}
						</p>

						<div className="space-y-3">
							<div>
								<h4 className="mb-2 font-semibold text-sm">Główne narządy:</h4>
								<div className="flex flex-wrap gap-1">
									{system.organs.slice(0, 3).map((organ) => (
										<Badge
											key={organ.id}
											variant="secondary"
											className="text-xs"
										>
											{organ.polishName}
										</Badge>
									))}
									{system.organs.length > 3 && (
										<Badge variant="outline" className="text-xs">
											+{system.organs.length - 3} więcej
										</Badge>
									)}
								</div>
							</div>

							{showRelatedSupplements &&
								system.relatedSupplements.length > 0 && (
									<div>
										<h4 className="mb-2 font-semibold text-sm">Suplementy:</h4>
										<div className="space-y-2">
											{system.relatedSupplements
												.slice(0, 2)
												.map((supplement) => (
													<div
														key={supplement.supplementId}
														className="flex items-center justify-between rounded bg-gray-50 p-2"
													>
														<div>
															<div className="font-medium text-sm">
																{supplement.polishSupplementName}
															</div>
															<div className="text-gray-600 text-xs">
																{supplement.polishMechanism}
															</div>
														</div>
														<Badge
															className={`text-xs ${getEvidenceBadgeColor(supplement.evidenceLevel)}`}
														>
															{translateEvidenceLevel(supplement.evidenceLevel)}
														</Badge>
													</div>
												))}
											{system.relatedSupplements.length > 2 && (
												<Button
													variant="outline"
													size="sm"
													onClick={() => setShowSupplements(!showSupplements)}
													className="w-full text-xs"
												>
													{showSupplements
														? "Ukryj"
														: "Pokaż wszystkie suplementy"}
												</Button>
											)}
										</div>
									</div>
								)}
						</div>
					</CardContent>
				)}
			</Card>
		);
	}

	return (
		<Card
			className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${colorClass}`}
		>
			<CardHeader>
				<div className="flex items-center gap-3 md:gap-4">
					<div className="rounded-lg bg-white/50 p-2 md:p-3">{icon}</div>
					<div className="min-w-0 flex-1">
						<CardTitle className="truncate text-lg md:text-xl">
							{system.polishName}
						</CardTitle>
						<CardDescription className="truncate text-sm md:text-base">
							{system.name}
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4 md:space-y-6">
				<p className="text-gray-700 text-sm leading-relaxed md:text-base">
					{system.polishDescription}
				</p>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
					<div>
						<h3 className="mb-3 flex items-center gap-2 font-semibold">
							<Activity className="h-4 w-4" />
							Główne Narządy
						</h3>
						<div className="space-y-3">
							{system.organs.map((organ) => (
								<div key={organ.id} className="rounded-lg bg-white/50 p-3">
									<div className="font-medium">{organ.polishName}</div>
									<div className="text-gray-600 text-sm">{organ.name}</div>
									<div className="mt-1 text-gray-500 text-xs">
										{organ.polishFunctions.join(", ")}
									</div>
								</div>
							))}
						</div>
					</div>

					<div>
						<h3 className="mb-3 font-semibold">Główne Funkcje</h3>
						<ul className="space-y-2">
							{system.polishFunctions.map((func, index) => (
								<li key={index} className="flex items-start gap-2">
									<div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />
									<span className="text-sm">{func}</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				{showRelatedSupplements && system.relatedSupplements.length > 0 && (
					<div>
						<h3 className="mb-3 flex items-center gap-2 font-semibold">
							<Heart className="h-4 w-4" />
							Powiązane Suplementy
						</h3>
						<div className="grid gap-3">
							{system.relatedSupplements.map((supplement) => (
								<div
									key={supplement.supplementId}
									className="rounded-lg border bg-white/50 p-4"
								>
									<div className="mb-2 flex items-start justify-between">
										<div className="flex-1">
											<div className="font-medium">
												{supplement.polishSupplementName}
											</div>
											<div className="mt-1 text-gray-600 text-sm">
												{supplement.polishMechanism}
											</div>
										</div>
										<div className="flex flex-col items-end gap-2">
											<Badge
												className={`${getEvidenceBadgeColor(supplement.evidenceLevel)}`}
											>
												{translateEvidenceLevel(supplement.evidenceLevel)}
											</Badge>
											<div className="text-gray-500 text-xs capitalize">
												{supplement.effectType === "SUPPORTS" && "Wspiera"}
												{supplement.effectType === "ENHANCES" && "Wzmacnia"}
												{supplement.effectType === "PROTECTS" && "Chroni"}
												{supplement.effectType === "REGULATES" && "Reguluje"}
											</div>
										</div>
									</div>
									{supplement.intensity && (
										<div className="mt-2">
											<div className="mb-1 flex items-center gap-2">
												<span className="text-gray-600 text-xs">
													Siła działania:
												</span>
												<div className="h-2 flex-1 rounded-full bg-gray-200">
													<div
														className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
														style={{ width: `${supplement.intensity * 100}%` }}
													/>
												</div>
												<span className="w-8 text-gray-600 text-xs">
													{Math.round(supplement.intensity * 100)}%
												</span>
											</div>
										</div>
									)}
									{onSupplementClick && (
										<Button
											variant="outline"
											size="sm"
											className="mt-3"
											onClick={() => onSupplementClick(supplement.supplementId)}
										>
											Zobacz suplement
										</Button>
									)}
								</div>
							))}
						</div>
					</div>
				)}

				<div className="border-t pt-4">
					<h3 className="mb-2 font-semibold">Znaczenie Kliniczne</h3>
					<p className="text-gray-700 text-sm leading-relaxed">
						{system.anatomicalInfo.polishClinicalRelevance}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
