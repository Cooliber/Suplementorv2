"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Play,
	Pause,
	RotateCcw,
	ZoomIn,
	ZoomOut,
	Info,
	ExternalLink,
	BookOpen,
	Microscope,
	Atom,
	ArrowRight,
	CheckCircle,
	AlertTriangle,
	Lightbulb,
	Users,
	Calendar,
	Star,
	Share
} from 'lucide-react';
import { MechanismExplanation as MechanismExplanationType, EvidenceSupport } from '@/types/education';

interface MechanismExplanationProps {
	mechanism: MechanismExplanationType;
	showVisualization?: boolean;
	showEvidence?: boolean;
	compact?: boolean;
}

export default function MechanismExplanation({
	mechanism,
	showVisualization = true,
	showEvidence = true,
	compact = false
}: MechanismExplanationProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [showDetailedEvidence, setShowDetailedEvidence] = useState(false);

	const getEvidenceLevelColor = (level: string) => {
		switch (level) {
			case 'strong': return 'bg-green-100 text-green-800 border-green-200';
			case 'moderate': return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'weak': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'insufficient': return 'bg-red-100 text-red-800 border-red-200';
			default: return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const getInteractionIcon = (type: string) => {
		switch (type) {
			case 'synergistic': return <CheckCircle className="h-4 w-4 text-green-600" />;
			case 'antagonistic': return <AlertTriangle className="h-4 w-4 text-red-600" />;
			case 'additive': return <ArrowRight className="h-4 w-4 text-blue-600" />;
			default: return <Info className="h-4 w-4 text-gray-600" />;
		}
	};

	if (compact) {
		return (
			<Card className="hover:shadow-md transition-all duration-200">
				<CardHeader className="pb-3">
					<div className="flex justify-between items-start">
						<div className="flex-1">
							<CardTitle className="text-sm font-medium line-clamp-2">
								{mechanism.title}
							</CardTitle>
							<CardDescription className="text-xs mt-1">
								{mechanism.summary}
							</CardDescription>
						</div>
						<Badge className={`text-xs ${getEvidenceLevelColor(mechanism.evidence.level)}`}>
							{mechanism.evidence.level}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="space-y-3">
						<p className="text-xs text-muted-foreground line-clamp-3">
							{mechanism.detailedExplanation}
						</p>
						{mechanism.interactions.length > 0 && (
							<div className="space-y-1">
								<p className="text-xs font-medium">Interactions:</p>
								<div className="flex flex-wrap gap-1">
									{mechanism.interactions.slice(0, 2).map((interaction, index) => (
										<div key={index} className="flex items-center gap-1 text-xs">
											{getInteractionIcon(interaction.type)}
											<span>{interaction.with}</span>
										</div>
									))}
									{mechanism.interactions.length > 2 && (
										<span className="text-xs text-muted-foreground">
											+{mechanism.interactions.length - 2} more
										</span>
									)}
								</div>
							</div>
						)}
						<div className="flex gap-2">
							<Button size="sm" variant="outline" className="text-xs">
								<Info className="h-3 w-3 mr-1" />
								Learn More
							</Button>
							<Button size="sm" variant="ghost" className="text-xs">
								<ExternalLink className="h-3 w-3" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex justify-between items-start mb-2">
					<div className="flex-1">
						<CardTitle className="text-xl leading-tight mb-2">
							{mechanism.title}
						</CardTitle>
						<CardDescription className="text-base">
							{mechanism.summary}
						</CardDescription>
					</div>
					<div className="flex flex-col gap-2 items-end">
						<Badge className={`${getEvidenceLevelColor(mechanism.evidence.level)}`}>
							{mechanism.evidence.level} evidence
						</Badge>
						<div className="text-xs text-muted-foreground">
							{mechanism.evidence.confidence}/10 confidence
						</div>
					</div>
				</div>

				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-1">
						<Users className="h-4 w-4" />
						{mechanism.evidence.studies.length} studies
					</div>
					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						Updated {new Date(mechanism.evidence.lastReviewed).toLocaleDateString()}
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<Tabs defaultValue="mechanism" className="w-full">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="mechanism">Mechanism</TabsTrigger>
						<TabsTrigger value="evidence">Evidence</TabsTrigger>
						<TabsTrigger value="interactions">Interactions</TabsTrigger>
						<TabsTrigger value="applications">Applications</TabsTrigger>
					</TabsList>

					<TabsContent value="mechanism" className="space-y-6">
						{/* Detailed Explanation */}
						<div>
							<h3 className="font-medium mb-3 flex items-center gap-2">
								<Atom className="h-5 w-5" />
								How It Works
							</h3>
							<div className="prose prose-sm max-w-none">
								<p className="text-muted-foreground leading-relaxed">
									{mechanism.detailedExplanation}
								</p>
							</div>
						</div>

						{/* Mechanism Visualization Placeholder */}
						{showVisualization && mechanism.visualization && (
							<div>
								<h3 className="font-medium mb-3 flex items-center gap-2">
									<Microscope className="h-5 w-5" />
									Mechanism Visualization
								</h3>
								<Card className="border-dashed">
									<CardContent className="py-8 text-center">
										<div className="space-y-4">
											<div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
												<Atom className="h-8 w-8 text-muted-foreground" />
											</div>
											<div>
												<h4 className="font-medium">Interactive Visualization</h4>
												<p className="text-sm text-muted-foreground">
													{mechanism.visualization.description}
												</p>
											</div>
											<div className="flex justify-center gap-2">
												<Button size="sm" variant="outline">
													<Play className="h-4 w-4 mr-2" />
													Play Animation
												</Button>
												<Button size="sm" variant="outline">
													<ZoomIn className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						)}

						{/* Related Mechanisms */}
						{mechanism.relatedMechanisms.length > 0 && (
							<div>
								<h3 className="font-medium mb-3">Related Mechanisms</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{mechanism.relatedMechanisms.map((relatedMechanism, index) => (
										<div key={index} className="p-3 border rounded-lg">
											<div className="flex items-center gap-2">
												<ArrowRight className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm">{relatedMechanism}</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</TabsContent>

					<TabsContent value="evidence" className="space-y-6">
						{/* Evidence Summary */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-sm">Evidence Level</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-center">
										<div className={`text-lg font-bold capitalize ${mechanism.evidence.level === 'strong' ? 'text-green-600' : mechanism.evidence.level === 'moderate' ? 'text-blue-600' : mechanism.evidence.level === 'weak' ? 'text-yellow-600' : 'text-red-600'}`}>
											{mechanism.evidence.level}
										</div>
										<p className="text-xs text-muted-foreground mt-1">
											Scientific confidence
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-sm">Study Count</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-center">
										<div className="text-lg font-bold">
											{mechanism.evidence.studies.length}
										</div>
										<p className="text-xs text-muted-foreground mt-1">
											Supporting studies
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-sm">Confidence Score</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-center">
										<div className="text-lg font-bold">
											{mechanism.evidence.confidence}/10
										</div>
										<p className="text-xs text-muted-foreground mt-1">
											Research confidence
										</p>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Study References */}
						<div>
							<h3 className="font-medium mb-3">Supporting Studies</h3>
							<div className="space-y-2">
								{mechanism.evidence.studies.slice(0, 5).map((studyId, index) => (
									<div key={index} className="flex items-center justify-between p-2 border rounded">
										<div className="flex items-center gap-2">
											<BookOpen className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm font-mono">{studyId}</span>
										</div>
										<Button size="sm" variant="ghost" asChild>
											<a href={`https://pubmed.ncbi.nlm.nih.gov/${studyId}`} target="_blank" rel="noopener noreferrer">
												<ExternalLink className="h-3 w-3" />
											</a>
										</Button>
									</div>
								))}
								{mechanism.evidence.studies.length > 5 && (
									<p className="text-xs text-muted-foreground text-center">
										+{mechanism.evidence.studies.length - 5} more studies available
									</p>
								)}
							</div>
						</div>

						{/* Review Information */}
						<Card className="bg-muted/50">
							<CardContent className="pt-4">
								<div className="flex justify-between items-center text-sm">
									<div>
										<span className="text-muted-foreground">Last reviewed:</span>
										<span className="ml-2 font-medium">
											{new Date(mechanism.evidence.lastReviewed).toLocaleDateString()}
										</span>
									</div>
									<div>
										<span className="text-muted-foreground">Next review:</span>
										<span className="ml-2 font-medium">
											{new Date(mechanism.evidence.nextReview).toLocaleDateString()}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="interactions" className="space-y-6">
						{/* Supplement Interactions */}
						<div>
							<h3 className="font-medium mb-3">Supplement Interactions</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{mechanism.interactions.map((interaction, index) => (
									<Card key={index}>
										<CardContent className="pt-4">
											<div className="flex items-center gap-3 mb-2">
												{getInteractionIcon(interaction.type)}
												<span className="font-medium">{interaction.with}</span>
												<Badge variant="outline" className="text-xs capitalize">
													{interaction.type}
												</Badge>
											</div>
											<p className="text-sm text-muted-foreground mb-2">
												{interaction.description}
											</p>
											<div className="text-xs text-muted-foreground">
												Strength: {Math.round(interaction.strength * 100)}%
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>

						{/* Interaction Network Visualization Placeholder */}
						<Card className="border-dashed">
							<CardContent className="py-8 text-center">
								<div className="space-y-4">
									<div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
										<Atom className="h-8 w-8 text-muted-foreground" />
									</div>
									<div>
										<h4 className="font-medium">Interaction Network</h4>
										<p className="text-sm text-muted-foreground">
											Visual representation of molecular interactions
										</p>
									</div>
									<Button variant="outline">
										<ZoomIn className="h-4 w-4 mr-2" />
										View Network
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="applications" className="space-y-6">
						{/* Practical Applications */}
						<div>
							<h3 className="font-medium mb-3">Practical Applications</h3>
							<div className="space-y-3">
								{mechanism.practicalImplications.map((implication, index) => (
									<div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
										<CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
										<span className="text-sm">{implication}</span>
									</div>
								))}
							</div>
						</div>

						{/* Clinical Considerations */}
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Clinical Considerations</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<h4 className="font-medium text-sm mb-2">Dosage Considerations</h4>
									<p className="text-sm text-muted-foreground">
										Optimal dosing may vary based on individual factors including age, health status, and concurrent medications.
									</p>
								</div>
								<div>
									<h4 className="font-medium text-sm mb-2">Timing</h4>
									<p className="text-sm text-muted-foreground">
										Consider circadian rhythms and meal timing for optimal efficacy.
									</p>
								</div>
								<div>
									<h4 className="font-medium text-sm mb-2">Monitoring</h4>
									<p className="text-sm text-muted-foreground">
										Regular assessment of biomarkers and clinical outcomes is recommended.
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Research Gaps */}
						<Card className="border-yellow-200 bg-yellow-50">
							<CardHeader>
								<CardTitle className="text-base text-yellow-800 flex items-center gap-2">
									<Lightbulb className="h-5 w-5" />
									Research Gaps & Future Directions
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2 text-sm text-yellow-700">
									<p>• Long-term safety studies in diverse populations</p>
									<p>• Optimal dosing strategies for different age groups</p>
									<p>• Interaction studies with commonly prescribed medications</p>
									<p>• Mechanistic studies in human models</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Action Buttons */}
				<div className="flex justify-between items-center pt-6 border-t">
					<div className="flex gap-2">
						<Button variant="outline" size="sm">
							<Star className="h-4 w-4 mr-2" />
							Save for Later
						</Button>
						<Button variant="outline" size="sm">
							<Share className="h-4 w-4 mr-2" />
							Share
						</Button>
					</div>

					<Dialog open={showDetailedEvidence} onOpenChange={setShowDetailedEvidence}>
						<DialogTrigger asChild>
							<Button variant="outline" size="sm">
								<BookOpen className="h-4 w-4 mr-2" />
								View All Evidence
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
							<DialogHeader>
								<DialogTitle>Detailed Evidence Summary</DialogTitle>
								<DialogDescription>
									Comprehensive review of all supporting studies and evidence
								</DialogDescription>
							</DialogHeader>

							<div className="space-y-6">
								{/* Evidence Quality Assessment */}
								<div>
									<h3 className="font-medium mb-3">Evidence Quality Assessment</h3>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										<div className="text-center p-3 border rounded">
											<div className="text-2xl font-bold text-green-600">
												{mechanism.evidence.level}
											</div>
											<div className="text-xs text-muted-foreground">Evidence Level</div>
										</div>
										<div className="text-center p-3 border rounded">
											<div className="text-2xl font-bold">
												{mechanism.evidence.confidence}/10
											</div>
											<div className="text-xs text-muted-foreground">Confidence</div>
										</div>
										<div className="text-center p-3 border rounded">
											<div className="text-2xl font-bold">
												{mechanism.evidence.studies.length}
											</div>
											<div className="text-xs text-muted-foreground">Studies</div>
										</div>
										<div className="text-center p-3 border rounded">
											<div className="text-2xl font-bold text-blue-600">
												{new Date(mechanism.evidence.nextReview).getFullYear()}
											</div>
											<div className="text-xs text-muted-foreground">Next Review</div>
										</div>
									</div>
								</div>

								{/* All Study References */}
								<div>
									<h3 className="font-medium mb-3">Complete Study References</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										{mechanism.evidence.studies.map((studyId, index) => (
											<div key={index} className="flex items-center justify-between p-3 border rounded">
												<div className="flex items-center gap-2">
													<BookOpen className="h-4 w-4 text-muted-foreground" />
													<span className="text-sm font-mono">{studyId}</span>
												</div>
												<Button size="sm" variant="ghost" asChild>
													<a href={`https://pubmed.ncbi.nlm.nih.gov/${studyId}`} target="_blank" rel="noopener noreferrer">
														<ExternalLink className="h-3 w-3" />
													</a>
												</Button>
											</div>
										))}
									</div>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</CardContent>
		</Card>
	);
}