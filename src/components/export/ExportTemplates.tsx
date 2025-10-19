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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
	Activity,
	Award,
	BookOpen,
	Calendar,
	Database,
	FileText,
	Plus,
	Star,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import type { ExportConfiguration } from "./ExportDialog";

export interface ExportTemplate {
	id: string;
	name: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	category: "supplements" | "analytics" | "research" | "clinical";
	polishName: string;
	polishDescription: string;
	configuration: Partial<ExportConfiguration>;
	recommendedColumns?: string[];
	useCase: string;
}

export interface ExportTemplatesProps {
	dataType: "supplements" | "analytics" | "visualization" | "generic";
	availableColumns?: Array<{
		key: string;
		label: string;
		polishLabel?: string;
		type?: string;
		category?: string;
	}>;
	onSelectTemplate?: (template: ExportTemplate) => void;
	className?: string;
}

const SUPPLEMENT_TEMPLATES: ExportTemplate[] = [
	{
		id: "basic-supplement-list",
		name: "Basic Supplement List",
		description: "Essential supplement information for quick reference",
		icon: FileText,
		category: "supplements",
		polishName: "Podstawowa lista suplementów",
		polishDescription:
			"Podstawowe informacje o suplementach do szybkiego podglądu",
		configuration: {
			format: "csv",
			filename: "podstawowe-suplementy",
			includeAllColumns: false,
		},
		recommendedColumns: [
			"name",
			"polishName",
			"category",
			"evidenceLevel",
			"dosage",
		],
		useCase: "Szybki przegląd suplementów",
	},
	{
		id: "detailed-supplement-analysis",
		name: "Detailed Supplement Analysis",
		description:
			"Comprehensive supplement data with research and clinical information",
		icon: Database,
		category: "supplements",
		polishName: "Szczegółowa analiza suplementów",
		polishDescription:
			"Kompletne dane suplementów z informacjami badawczymi i klinicznymi",
		configuration: {
			format: "excel",
			filename: "analiza-suplementow",
			includeAllColumns: true,
		},
		useCase: "Pełna analiza suplementów",
	},
	{
		id: "clinical-applications",
		name: "Clinical Applications",
		description: "Supplement applications for specific health conditions",
		icon: Target,
		category: "clinical",
		polishName: "Zastosowania kliniczne",
		polishDescription: "Zastosowania suplementów w konkretnych schorzeniach",
		configuration: {
			format: "pdf",
			filename: "zastosowania-kliniczne",
			includeAllColumns: false,
		},
		recommendedColumns: [
			"name",
			"clinicalApplications",
			"evidenceLevel",
			"contraindications",
		],
		useCase: "Zastosowania terapeutyczne",
	},
	{
		id: "safety-profile",
		name: "Safety Profile",
		description: "Safety information including side effects and interactions",
		icon: Award,
		category: "supplements",
		polishName: "Profil bezpieczeństwa",
		polishDescription:
			"Informacje o bezpieczeństwie, efektach ubocznych i interakcjach",
		configuration: {
			format: "pdf",
			filename: "profil-bezpieczenstwa",
			includeAllColumns: false,
		},
		recommendedColumns: [
			"name",
			"sideEffects",
			"interactions",
			"contraindications",
			"warnings",
		],
		useCase: "Ocena bezpieczeństwa",
	},
];

const ANALYTICS_TEMPLATES: ExportTemplate[] = [
	{
		id: "usage-statistics",
		name: "Usage Statistics",
		description: "Supplement usage patterns and frequency analysis",
		icon: TrendingUp,
		category: "analytics",
		polishName: "Statystyki użytkowania",
		polishDescription:
			"Wzorce użytkowania suplementów i analiza częstotliwości",
		configuration: {
			format: "csv",
			filename: "statystyki-uzytkowania",
			includeAllColumns: false,
		},
		recommendedColumns: ["name", "usageCount", "averageRating", "reviewCount"],
		useCase: "Analiza trendów",
	},
	{
		id: "effectiveness-report",
		name: "Effectiveness Report",
		description: "Supplement effectiveness based on user reviews and ratings",
		icon: Star,
		category: "analytics",
		polishName: "Raport skuteczności",
		polishDescription:
			"Skuteczność suplementów na podstawie opinii i ocen użytkowników",
		configuration: {
			format: "excel",
			filename: "raport-skutecznosci",
			includeAllColumns: false,
		},
		recommendedColumns: [
			"name",
			"averageRating",
			"reviewCount",
			"effectivenessScore",
		],
		useCase: "Ocena efektywności",
	},
];

const RESEARCH_TEMPLATES: ExportTemplate[] = [
	{
		id: "research-summary",
		name: "Research Summary",
		description: "Research findings and evidence levels for supplements",
		icon: BookOpen,
		category: "research",
		polishName: "Podsumowanie badań",
		polishDescription: "Wyniki badań i poziomy dowodów dla suplementów",
		configuration: {
			format: "pdf",
			filename: "podsumowanie-badan",
			includeAllColumns: false,
		},
		recommendedColumns: [
			"name",
			"researchCount",
			"evidenceLevel",
			"keyFindings",
		],
		useCase: "Przegląd badań naukowych",
	},
	{
		id: "evidence-matrix",
		name: "Evidence Matrix",
		description: "Evidence levels and research quality assessment",
		icon: Activity,
		category: "research",
		polishName: "Macierz dowodów",
		polishDescription: "Poziomy dowodów i ocena jakości badań",
		configuration: {
			format: "excel",
			filename: "macierz-dowodow",
			includeAllColumns: false,
		},
		recommendedColumns: [
			"name",
			"evidenceLevel",
			"researchCount",
			"studyTypes",
			"methodologyQuality",
		],
		useCase: "Ocena jakości dowodów",
	},
];

export const ExportTemplates: React.FC<ExportTemplatesProps> = ({
	dataType,
	availableColumns = [],
	onSelectTemplate,
	className,
}) => {
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

	// Get templates based on data type
	const templates = useMemo(() => {
		switch (dataType) {
			case "supplements":
				return SUPPLEMENT_TEMPLATES;
			case "analytics":
				return ANALYTICS_TEMPLATES;
			case "visualization":
				return [...SUPPLEMENT_TEMPLATES, ...ANALYTICS_TEMPLATES];
			default:
				return SUPPLEMENT_TEMPLATES;
		}
	}, [dataType]);

	// Filter templates by category
	const filteredTemplates = useMemo(() => {
		if (selectedCategory === "all") return templates;
		return templates.filter(
			(template) => template.category === selectedCategory,
		);
	}, [templates, selectedCategory]);

	// Get available columns for template
	const getTemplateColumns = (template: ExportTemplate) => {
		if (!template.recommendedColumns) return availableColumns;

		return availableColumns.filter((col) =>
			template.recommendedColumns?.includes(col.key),
		);
	};

	const categories = [
		{ id: "all", label: "Wszystkie", icon: FileText },
		{ id: "supplements", label: "Suplementy", icon: Database },
		{ id: "analytics", label: "Analityka", icon: TrendingUp },
		{ id: "research", label: "Badania", icon: BookOpen },
		{ id: "clinical", label: "Kliniczne", icon: Target },
	];

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileText className="h-5 w-5" />
					Szablony eksportu
				</CardTitle>
				<CardDescription>
					Wybierz gotowy szablon dla typowych przypadków użycia
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* Category filters */}
				<div className="flex flex-wrap gap-2">
					{categories.map((category) => {
						const Icon = category.icon;
						return (
							<Button
								key={category.id}
								variant={
									selectedCategory === category.id ? "default" : "outline"
								}
								size="sm"
								onClick={() => setSelectedCategory(category.id)}
								className="flex items-center gap-2"
							>
								<Icon className="h-4 w-4" />
								{category.label}
							</Button>
						);
					})}
				</div>

				<Separator />

				{/* Templates grid */}
				<ScrollArea className="h-96">
					<div className="grid gap-4 md:grid-cols-2">
						{filteredTemplates.map((template) => {
							const Icon = template.icon;
							const templateColumns = getTemplateColumns(template);

							return (
								<Card
									key={template.id}
									className="cursor-pointer transition-shadow hover:shadow-md"
									onClick={() => onSelectTemplate?.(template)}
								>
									<CardHeader className="pb-3">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Icon className="h-5 w-5 text-primary" />
												<CardTitle className="text-base">
													{template.polishName}
												</CardTitle>
											</div>
											<Badge variant="secondary">
												{template.configuration.format?.toUpperCase()}
											</Badge>
										</div>
										<CardDescription className="text-sm">
											{template.polishDescription}
										</CardDescription>
									</CardHeader>

									<CardContent className="pt-0">
										<div className="space-y-3">
											<div>
												<div className="mb-1 font-medium text-muted-foreground text-sm">
													Zastosowanie:
												</div>
												<div className="text-sm">{template.useCase}</div>
											</div>

											{templateColumns.length > 0 && (
												<div>
													<div className="mb-2 font-medium text-muted-foreground text-sm">
														Uwzględnione kolumny:
													</div>
													<div className="flex flex-wrap gap-1">
														{templateColumns.slice(0, 4).map((column) => (
															<Badge
																key={column.key}
																variant="outline"
																className="text-xs"
															>
																{column.polishLabel || column.label}
															</Badge>
														))}
														{templateColumns.length > 4 && (
															<Badge variant="outline" className="text-xs">
																+{templateColumns.length - 4} więcej
															</Badge>
														)}
													</div>
												</div>
											)}

											<div className="flex items-center justify-between pt-2">
												<div className="text-muted-foreground text-xs">
													{templateColumns.length} kolumn
												</div>
												<Button size="sm" variant="outline">
													Użyj szablonu
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</ScrollArea>

				{filteredTemplates.length === 0 && (
					<div className="py-8 text-center text-muted-foreground">
						<FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
						<p>Brak szablonów dla wybranej kategorii</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default ExportTemplates;
