"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
	BookOpen,
	Flask,
	Microscope,
	Play,
	Users,
	Video,
	Volume2,
} from "lucide-react";

export interface ContentTab {
	id: string;
	title: string;
	description?: string;
	icon?: React.ComponentType<{ className?: string }>;
	badge?: string | number;
	content: React.ReactNode;
	type: "theory" | "visualization" | "clinical" | "interactive" | "discussion";
	difficulty?: "beginner" | "intermediate" | "advanced";
	estimatedTime?: string;
}

interface ContentTabsProps {
	tabs: ContentTab[];
	defaultTab?: string;
	onTabChange?: (tabId: string) => void;
	showMetadata?: boolean;
	showProgress?: boolean;
	className?: string;
}

export function ContentTabs({
	tabs,
	defaultTab,
	onTabChange,
	showMetadata = true,
	showProgress = false,
	className,
}: ContentTabsProps) {
	const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id);

	const handleTabChange = (tabId: string) => {
		setActiveTab(tabId);
		onTabChange?.(tabId);
	};

	const getTypeIcon = (type: ContentTab["type"]) => {
		switch (type) {
			case "theory":
				return BookOpen;
			case "visualization":
				return Video;
			case "clinical":
				return Microscope;
			case "interactive":
				return Play;
			case "discussion":
				return Users;
			default:
				return BookOpen;
		}
	};

	const getDifficultyColor = (difficulty?: ContentTab["difficulty"]) => {
		switch (difficulty) {
			case "beginner":
				return "bg-green-100 text-green-800 border-green-200";
			case "intermediate":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "advanced":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	return (
		<div className={cn("w-full", className)}>
			<Tabs value={activeTab} onValueChange={handleTabChange}>
				<TabsList className="mb-6 grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
					{tabs.map((tab) => {
						const IconComponent = tab.icon || getTypeIcon(tab.type);
						return (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className="flex items-center gap-2 p-3 text-sm"
							>
								<IconComponent className="h-4 w-4" />
								<span className="hidden sm:inline">{tab.title}</span>
								{tab.badge && (
									<Badge
										variant="secondary"
										className="ml-1 h-5 px-1.5 text-xs"
									>
										{tab.badge}
									</Badge>
								)}
							</TabsTrigger>
						);
					})}
				</TabsList>

				{tabs.map((tab) => (
					<TabsContent key={tab.id} value={tab.id} className="mt-6">
						{/* Tab Header */}
						<Card className="mb-6">
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-3">
										{tab.icon && <tab.icon className="h-6 w-6 text-primary" />}
										<div>
											<CardTitle className="text-xl">{tab.title}</CardTitle>
											{tab.description && (
												<CardDescription className="mt-1">
													{tab.description}
												</CardDescription>
											)}
										</div>
									</div>

									{showMetadata && (
										<div className="flex items-center gap-2">
											<Badge
												variant="outline"
												className={cn(
													"flex items-center gap-1",
													getDifficultyColor(tab.difficulty),
												)}
											>
												{tab.difficulty || "Podstawowy"}
											</Badge>
											{tab.estimatedTime && (
												<Badge
													variant="outline"
													className="flex items-center gap-1"
												>
													<Volume2 className="h-3 w-3" />
													{tab.estimatedTime}
												</Badge>
											)}
										</div>
									)}
								</div>

								{showProgress && (
									<div className="mt-4">
										<div className="mb-2 flex items-center justify-between text-muted-foreground text-sm">
											<span>Postęp</span>
											<span>75%</span>
										</div>
										<div className="h-2 w-full rounded-full bg-secondary">
											<div
												className="h-2 rounded-full bg-primary transition-all duration-300"
												style={{ width: "75%" }}
											/>
										</div>
									</div>
								)}
							</CardHeader>
						</Card>

						{/* Tab Content */}
						<Card>
							<CardContent className="p-6">{tab.content}</CardContent>
						</Card>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}

// Predefined tab configurations for common use cases
export const createTheoryVisualizationTabs = (
	theoryContent: React.ReactNode,
	visualizationContent: React.ReactNode,
	interactiveContent?: React.ReactNode,
): ContentTab[] => [
	{
		id: "theory",
		title: "Teoria",
		description: "Podstawy teoretyczne i wyjaśnienia naukowe",
		icon: BookOpen,
		content: theoryContent,
		type: "theory",
		difficulty: "intermediate",
		estimatedTime: "15 min",
	},
	{
		id: "visualization",
		title: "Wizualizacja",
		description: "Interaktywne wykresy i animacje",
		icon: Video,
		content: visualizationContent,
		type: "visualization",
		difficulty: "beginner",
		estimatedTime: "10 min",
	},
	{
		id: "interactive",
		title: "Interaktywne",
		description: "Ćwiczenia praktyczne i symulacje",
		icon: Play,
		content: interactiveContent || <div>Brak zawartości interaktywnej</div>,
		type: "interactive",
		difficulty: "intermediate",
		estimatedTime: "20 min",
	},
];

export const createClinicalResearchTabs = (
	researchContent: React.ReactNode,
	clinicalContent: React.ReactNode,
	caseStudiesContent?: React.ReactNode,
): ContentTab[] => [
	{
		id: "research",
		title: "Badania",
		description: "Najnowsze publikacje naukowe",
		icon: Microscope,
		content: researchContent,
		type: "clinical",
		difficulty: "advanced",
		estimatedTime: "25 min",
	},
	{
		id: "clinical",
		title: "Zastosowania kliniczne",
		description: "Praktyczne zastosowania w medycynie",
		icon: Flask,
		content: clinicalContent,
		type: "clinical",
		difficulty: "intermediate",
		estimatedTime: "20 min",
	},
	{
		id: "cases",
		title: "Studia przypadków",
		description: "Analizy rzeczywistych przypadków",
		icon: Users,
		content: caseStudiesContent || <div>Brak studiów przypadków</div>,
		type: "discussion",
		difficulty: "intermediate",
		estimatedTime: "30 min",
	},
];
