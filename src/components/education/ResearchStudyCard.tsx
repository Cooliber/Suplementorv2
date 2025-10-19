"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
	ResearchStudyCard as ResearchStudyCardType,
	StudyQuality,
} from "@/types/education";
import {
	AlertCircle,
	BookOpen,
	Calendar,
	CheckCircle,
	ExternalLink,
	Filter,
	Info,
	Search,
	Star,
	TrendingDown,
	TrendingUp,
	Users,
} from "lucide-react";
import React, { useState } from "react";

interface ResearchStudyCardProps {
	study: ResearchStudyCardType;
	compact?: boolean;
	showAbstract?: boolean;
	onSave?: (studyId: string) => void;
	onShare?: (studyId: string) => void;
	isSaved?: boolean;
}

export default function ResearchStudyCard({
	study,
	compact = false,
	showAbstract = true,
	onSave,
	onShare,
	isSaved = false,
}: ResearchStudyCardProps) {
	const [isExpanded, setIsExpanded] = useState(!compact);

	const getQualityColor = (quality: StudyQuality) => {
		switch (quality.rating) {
			case "excellent":
				return "bg-green-100 text-green-800 border-green-200";
			case "good":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "fair":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "poor":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getEvidenceLevelColor = (level: string) => {
		switch (level) {
			case "strong":
				return "bg-green-100 text-green-800";
			case "moderate":
				return "bg-blue-100 text-blue-800";
			case "weak":
				return "bg-yellow-100 text-yellow-800";
			case "insufficient":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getBiasRiskIcon = (risk: string) => {
		switch (risk) {
			case "low":
				return <CheckCircle className="h-4 w-4 text-green-600" />;
			case "moderate":
				return <Info className="h-4 w-4 text-yellow-600" />;
			case "high":
				return <AlertCircle className="h-4 w-4 text-red-600" />;
			default:
				return <Info className="h-4 w-4 text-gray-600" />;
		}
	};

	if (compact) {
		return (
			<Card
				className="cursor-pointer transition-all duration-200 hover:shadow-md"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<CardTitle className="line-clamp-2 font-medium text-sm">
								{study.title}
							</CardTitle>
							<CardDescription className="mt-1 text-xs">
								{study.authors.join(", ")} • {study.journal} • {study.year}
							</CardDescription>
						</div>
						<div className="ml-2 flex gap-1">
							<Badge
								className={`text-xs ${getEvidenceLevelColor(study.relevance.evidenceLevel)}`}
							>
								{study.relevance.evidenceLevel}
							</Badge>
						</div>
					</div>
				</CardHeader>
				{isExpanded && (
					<CardContent className="pt-0">
						<div className="space-y-3">
							<p className="line-clamp-3 text-muted-foreground text-sm">
								{study.abstract}
							</p>
							<div className="flex items-center justify-between">
								<div className="flex gap-2">
									<Badge variant="outline" className="text-xs">
										{study.methodology.type}
									</Badge>
									<Badge variant="outline" className="text-xs">
										n = {study.methodology.sampleSize}
									</Badge>
								</div>
								<div className="flex gap-1">
									{onSave && (
										<Button
											size="sm"
											variant="ghost"
											onClick={(e) => {
												e.stopPropagation();
												onSave(study.id);
											}}
										>
											<Star
												className={`h-3 w-3 ${isSaved ? "fill-yellow-400 text-yellow-400" : ""}`}
											/>
										</Button>
									)}
									{onShare && (
										<Button
											size="sm"
											variant="ghost"
											onClick={(e) => {
												e.stopPropagation();
												onShare(study.id);
											}}
										>
											<ExternalLink className="h-3 w-3" />
										</Button>
									)}
								</div>
							</div>
						</div>
					</CardContent>
				)}
			</Card>
		);
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="mb-2 flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="mb-2 text-lg leading-tight">
							{study.title}
						</CardTitle>
						<CardDescription className="text-sm">
							{study.authors.join(", ")}
						</CardDescription>
					</div>
					<div className="ml-4 flex gap-2">
						<Badge
							className={`${getEvidenceLevelColor(study.relevance.evidenceLevel)}`}
						>
							{study.relevance.evidenceLevel}
						</Badge>
						<Badge className={`${getQualityColor(study.quality)}`}>
							{study.quality.rating}
						</Badge>
					</div>
				</div>

				<div className="flex items-center gap-4 text-muted-foreground text-sm">
					<div className="flex items-center gap-1">
						<BookOpen className="h-4 w-4" />
						{study.journal}
					</div>
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						{study.year}
					</div>
					<div className="flex items-center gap-1">
						<Users className="h-4 w-4" />n = {study.methodology.sampleSize}
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<Tabs defaultValue="abstract" className="w-full">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="abstract">Abstract</TabsTrigger>
						<TabsTrigger value="methodology">Methodology</TabsTrigger>
						<TabsTrigger value="results">Results</TabsTrigger>
						<TabsTrigger value="analysis">Analysis</TabsTrigger>
					</TabsList>

					<TabsContent value="abstract" className="space-y-4">
						<div>
							<h4 className="mb-2 font-medium">Abstract</h4>
							<p className="text-muted-foreground text-sm leading-relaxed">
								{study.abstract}
							</p>
						</div>

						{study.doi && (
							<div className="flex items-center gap-2">
								<span className="font-medium text-sm">DOI:</span>
								<Button variant="link" className="h-auto p-0 text-sm" asChild>
									<a
										href={`https://doi.org/${study.doi}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										{study.doi}
										<ExternalLink className="ml-1 h-3 w-3" />
									</a>
								</Button>
							</div>
						)}
					</TabsContent>

					<TabsContent value="methodology" className="space-y-4">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<h4 className="mb-2 font-medium">Study Design</h4>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Type:</span>
										<Badge variant="outline">{study.methodology.type}</Badge>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Duration:</span>
										<span>{study.methodology.duration}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Sample Size:</span>
										<span>{study.methodology.sampleSize}</span>
									</div>
									{study.methodology.blinding && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">Blinding:</span>
											<span className="capitalize">
												{study.methodology.blinding}
											</span>
										</div>
									)}
								</div>
							</div>

							<div>
								<h4 className="mb-2 font-medium">Intervention & Control</h4>
								<div className="space-y-2 text-sm">
									<div>
										<span className="text-muted-foreground">Intervention:</span>
										<p className="mt-1">
											{study.methodology.interventions.join(", ")}
										</p>
									</div>
									<div>
										<span className="text-muted-foreground">Control:</span>
										<p className="mt-1">
											{study.methodology.controls.join(", ")}
										</p>
									</div>
								</div>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="results" className="space-y-4">
						<div className="space-y-4">
							<div>
								<h4 className="mb-2 font-medium">Primary Outcome</h4>
								<p className="text-sm">{study.results.primaryOutcome}</p>
							</div>

							{study.results.secondaryOutcomes &&
								study.results.secondaryOutcomes.length > 0 && (
									<div>
										<h4 className="mb-2 font-medium">Secondary Outcomes</h4>
										<ul className="space-y-1 text-sm">
											{study.results.secondaryOutcomes.map((outcome, index) => (
												<li key={index} className="flex items-start gap-2">
													<span className="text-muted-foreground">•</span>
													<span>{outcome}</span>
												</li>
											))}
										</ul>
									</div>
								)}

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<h4 className="font-medium">Statistical Significance</h4>
									<p className="text-sm">
										{study.results.statisticalSignificance}
									</p>
								</div>
								<div className="space-y-2">
									<h4 className="font-medium">Clinical Significance</h4>
									<p className="text-sm">
										{study.results.clinicalSignificance}
									</p>
								</div>
							</div>

							{study.results.effectSize && (
								<div className="rounded-lg bg-muted p-3">
									<div className="mb-2 flex items-center gap-2">
										<TrendingUp className="h-4 w-4" />
										<span className="font-medium text-sm">Effect Size</span>
									</div>
									<p className="font-bold text-lg">
										{study.results.effectSize}
									</p>
								</div>
							)}
						</div>
					</TabsContent>

					<TabsContent value="analysis" className="space-y-4">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<h4 className="mb-3 flex items-center gap-2 font-medium">
									{getBiasRiskIcon(study.quality.biasRisk)}
									Quality Assessment
								</h4>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Quality Score:
										</span>
										<div className="flex items-center gap-2">
											<span className="font-medium">
												{study.quality.score}/10
											</span>
											<div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
												<div
													className="h-full bg-primary transition-all duration-300"
													style={{
														width: `${(study.quality.score / 10) * 100}%`,
													}}
												/>
											</div>
										</div>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Bias Risk:
										</span>
										<span className="capitalize">{study.quality.biasRisk}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">
											Confidence:
										</span>
										<span className="capitalize">
											{study.quality.confidence}
										</span>
									</div>
								</div>
							</div>

							<div>
								<h4 className="mb-3 font-medium">Study Relevance</h4>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-muted-foreground text-sm">
											Category:
										</span>
										<Badge variant="outline" className="text-xs">
											{study.relevance.supplementCategory.replace("_", " ")}
										</Badge>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground text-sm">
											Generalizability:
										</span>
										<span className="capitalize">
											{study.applicability.generalizability}
										</span>
									</div>
								</div>
							</div>
						</div>

						<Accordion type="single" collapsible className="w-full">
							<AccordionItem value="conclusions">
								<AccordionTrigger>Conclusions</AccordionTrigger>
								<AccordionContent>
									<p className="text-sm">{study.conclusions}</p>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="limitations">
								<AccordionTrigger>Limitations</AccordionTrigger>
								<AccordionContent>
									<ul className="space-y-1 text-sm">
										{study.limitations.map((limitation, index) => (
											<li key={index} className="flex items-start gap-2">
												<span className="text-muted-foreground">•</span>
												<span>{limitation}</span>
											</li>
										))}
									</ul>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="strengths">
								<AccordionTrigger>Strengths</AccordionTrigger>
								<AccordionContent>
									<ul className="space-y-1 text-sm">
										{study.strengths.map((strength, index) => (
											<li key={index} className="flex items-start gap-2">
												<span className="text-muted-foreground">•</span>
												<span>{strength}</span>
											</li>
										))}
									</ul>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="applicability">
								<AccordionTrigger>Practical Implications</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-2">
										<p className="font-medium text-sm">
											Population: {study.applicability.population}
										</p>
										<p className="font-medium text-sm">
											Setting: {study.applicability.setting}
										</p>
										<ul className="mt-2 space-y-1 text-sm">
											{study.applicability.practicalImplications.map(
												(implication, index) => (
													<li key={index} className="flex items-start gap-2">
														<span className="text-muted-foreground">•</span>
														<span>{implication}</span>
													</li>
												),
											)}
										</ul>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</TabsContent>
				</Tabs>

				<Separator className="my-4" />

				<div className="flex items-center justify-between">
					<div className="flex gap-2">
						{study.tags.slice(0, 3).map((tag) => (
							<Badge key={tag} variant="secondary" className="text-xs">
								{tag}
							</Badge>
						))}
						{study.tags.length > 3 && (
							<Badge variant="secondary" className="text-xs">
								+{study.tags.length - 3} more
							</Badge>
						)}
					</div>

					<div className="flex gap-2">
						{onSave && (
							<Button
								size="sm"
								variant="outline"
								onClick={() => onSave(study.id)}
							>
								<Star
									className={`mr-1 h-3 w-3 ${isSaved ? "fill-yellow-400 text-yellow-400" : ""}`}
								/>
								{isSaved ? "Saved" : "Save"}
							</Button>
						)}
						{onShare && (
							<Button
								size="sm"
								variant="outline"
								onClick={() => onShare(study.id)}
							>
								<ExternalLink className="mr-1 h-3 w-3" />
								Share
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
