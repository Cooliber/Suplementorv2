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
	Activity,
	ArrowRight,
	BookOpen,
	Brain,
	FlaskConical,
	Zap,
} from "lucide-react";
import Link from "next/link";

export type ContentType =
	| "educational"
	| "research"
	| "mechanism"
	| "neurotransmitter"
	| "brain-region"
	| "history";

export interface RelatedContentItem {
	id: string;
	title: string;
	polishTitle: string;
	description?: string;
	polishDescription?: string;
	type: ContentType;
	url: string;
	tags?: string[];
	polishTags?: string[];
	metadata?: {
		difficulty?: "beginner" | "intermediate" | "expert";
		evidenceLevel?:
			| "STRONG"
			| "MODERATE"
			| "WEAK"
			| "INSUFFICIENT"
			| "CONFLICTING";
		readTime?: string; // e.g., "5 min"
		lastUpdated?: Date;
	};
}

export interface RelatedContentProps {
	items: RelatedContentItem[];
	title?: string;
	description?: string;
	maxItems?: number;
	showViewAll?: boolean;
	viewAllUrl?: string;
	className?: string;
}

const CONTENT_TYPE_CONFIG: Record<
	ContentType,
	{
		icon: React.ComponentType<{ className?: string }>;
		label: string;
		color: string;
		bgColor: string;
	}
> = {
	educational: {
		icon: BookOpen,
		label: "Edukacja",
		color: "text-blue-600",
		bgColor: "bg-blue-50",
	},
	research: {
		icon: FlaskConical,
		label: "Badania",
		color: "text-green-600",
		bgColor: "bg-green-50",
	},
	mechanism: {
		icon: Activity,
		label: "Mechanizm",
		color: "text-purple-600",
		bgColor: "bg-purple-50",
	},
	neurotransmitter: {
		icon: Zap,
		label: "Neuroprzekaźnik",
		color: "text-orange-600",
		bgColor: "bg-orange-50",
	},
	"brain-region": {
		icon: Brain,
		label: "Obszar Mózgu",
		color: "text-indigo-600",
		bgColor: "bg-indigo-50",
	},
	history: {
		icon: BookOpen,
		label: "Historia",
		color: "text-amber-600",
		bgColor: "bg-amber-50",
	},
};

const DIFFICULTY_LABELS = {
	beginner: { label: "Początkujący", color: "bg-green-100 text-green-800" },
	intermediate: {
		label: "Średniozaawansowany",
		color: "bg-blue-100 text-blue-800",
	},
	expert: { label: "Ekspert", color: "bg-purple-100 text-purple-800" },
};

const EVIDENCE_LABELS = {
	STRONG: { label: "Silne", color: "bg-green-100 text-green-800" },
	MODERATE: { label: "Umiarkowane", color: "bg-blue-100 text-blue-800" },
	WEAK: { label: "Słabe", color: "bg-yellow-100 text-yellow-800" },
	INSUFFICIENT: {
		label: "Niewystarczające",
		color: "bg-gray-100 text-gray-800",
	},
	CONFLICTING: { label: "Sprzeczne", color: "bg-orange-100 text-orange-800" },
};

export function RelatedContent({
	items,
	title = "Powiązane Treści",
	description,
	maxItems,
	showViewAll = false,
	viewAllUrl,
	className = "",
}: RelatedContentProps) {
	const displayItems = maxItems ? items.slice(0, maxItems) : items;
	const hasMore = maxItems && items.length > maxItems;

	if (items.length === 0) {
		return (
			<Card className={className}>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					{description && <CardDescription>{description}</CardDescription>}
				</CardHeader>
				<CardContent>
					<p className="text-center text-muted-foreground text-sm">
						Brak powiązanych treści.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{displayItems.map((item) => {
						const config = CONTENT_TYPE_CONFIG[item.type];
						const Icon = config.icon;

						return (
							<Link key={item.id} href={item.url}>
								<Card className="h-full cursor-pointer border-2 transition-shadow hover:border-primary hover:shadow-md">
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1">
												<div className="mb-2 flex items-center gap-2">
													<div className={`rounded p-1.5 ${config.bgColor}`}>
														<Icon className={`h-4 w-4 ${config.color}`} />
													</div>
													<Badge variant="secondary" className="text-xs">
														{config.label}
													</Badge>
												</div>
												<CardTitle className="text-base leading-tight">
													{item.polishTitle}
												</CardTitle>
											</div>
										</div>
									</CardHeader>
									<CardContent className="space-y-3">
										{/* Description */}
										{item.polishDescription && (
											<p className="line-clamp-2 text-muted-foreground text-sm">
												{item.polishDescription}
											</p>
										)}

										{/* Metadata Badges */}
										<div className="flex flex-wrap gap-2">
											{item.metadata?.difficulty && (
												<Badge
													variant="outline"
													className={`text-xs ${DIFFICULTY_LABELS[item.metadata.difficulty].color}`}
												>
													{DIFFICULTY_LABELS[item.metadata.difficulty].label}
												</Badge>
											)}
											{item.metadata?.evidenceLevel && (
												<Badge
													variant="outline"
													className={`text-xs ${EVIDENCE_LABELS[item.metadata.evidenceLevel].color}`}
												>
													{EVIDENCE_LABELS[item.metadata.evidenceLevel].label}
												</Badge>
											)}
											{item.metadata?.readTime && (
												<Badge variant="outline" className="text-xs">
													{item.metadata.readTime}
												</Badge>
											)}
										</div>

										{/* Tags */}
										{item.polishTags && item.polishTags.length > 0 && (
											<div className="flex flex-wrap gap-1">
												{item.polishTags.slice(0, 3).map((tag, idx) => (
													<Badge
														key={idx}
														variant="secondary"
														className="text-xs"
													>
														{tag}
													</Badge>
												))}
												{item.polishTags.length > 3 && (
													<Badge variant="secondary" className="text-xs">
														+{item.polishTags.length - 3}
													</Badge>
												)}
											</div>
										)}

										{/* Read More Link */}
										<div className="flex items-center gap-1 pt-2 font-medium text-primary text-xs">
											Czytaj więcej
											<ArrowRight className="h-3 w-3" />
										</div>
									</CardContent>
								</Card>
							</Link>
						);
					})}
				</div>

				{/* View All Button */}
				{(hasMore || showViewAll) && viewAllUrl && (
					<div className="flex justify-center border-t pt-4">
						<Link href={viewAllUrl}>
							<Button variant="outline">
								Zobacz wszystkie ({items.length})
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

// Helper function to create related content items from different data sources
export function createRelatedContentItem(
	data: {
		id: string;
		title: string;
		polishTitle: string;
		description?: string;
		polishDescription?: string;
		tags?: string[];
		polishTags?: string[];
	},
	type: ContentType,
	url: string,
	metadata?: RelatedContentItem["metadata"],
): RelatedContentItem {
	return {
		id: data.id,
		title: data.title,
		polishTitle: data.polishTitle,
		description: data.description,
		polishDescription: data.polishDescription,
		type,
		url,
		tags: data.tags,
		polishTags: data.polishTags,
		metadata,
	};
}
