"use client";

/**
 * Stack Builder - Interactive Drag & Drop Supplement Stack Creator
 *
 * Features:
 * - Drag and drop supplements to build stacks
 * - Real-time interaction checking
 * - Synergy indicators
 * - Contraindication warnings
 * - Automatic dosage calculation
 * - Stack optimization suggestions
 * - Save, share, and export functionality
 * - Visual timeline for supplement timing
 */

import { FadeIn, SlideIn } from "@/components/animations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
DndContext,
type DragEndEvent,
KeyboardSensor,
PointerSensor,
closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
SortableContext,
arrayMove,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
AlertTriangle,
CheckCircle2,
Clock,
GripVertical,
Lightbulb,
Plus,
Save,
Share2,
Sparkles,
	Target,
	Trash2,
	TrendingUp,
	X,
	Zap,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { analyzeStack, generateSmartSuggestions, type Supplement } from "@/lib/stack-analysis";

// Types (now using the shared Supplement type from stack-analysis.ts)
type SupplementInStack = Supplement;

interface StackBuilderProps {
	availableSupplements?: SupplementInStack[];
	onSaveStack?: (stack: SupplementInStack[]) => void;
	onShareStack?: (stack: SupplementInStack[]) => void;
}

// Sortable Item Component
function SortableSupplementItem({
supplement,
onRemove,
interactions,
}: {
supplement: SupplementInStack;
onRemove: () => void;
interactions: any[]; // Will be updated with proper typing
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: supplement.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	// Get interactions for this supplement
	const supplementInteractions = interactions.filter((i) =>
		i.supplements.includes(supplement.id),
	);

	const hasSynergy = supplementInteractions.some(
		(i) => i.type === "synergistic",
	);
	const hasWarning = supplementInteractions.some((i) => i.type === "warning");
	const hasAntagonistic = supplementInteractions.some(
		(i) => i.type === "antagonistic",
	);

	return (
		<div ref={setNodeRef} style={style} className="mb-3">
			<Card className={`${isDragging ? "shadow-lg" : ""}`}>
				<CardContent className="p-4">
					<div className="flex items-start gap-3">
						{/* Drag Handle */}
						<div
							{...attributes}
							{...listeners}
							className="mt-1 cursor-grab active:cursor-grabbing"
						>
							<GripVertical className="h-5 w-5 text-gray-400" />
						</div>

						{/* Supplement Info */}
						<div className="flex-1">
							<div className="flex items-start justify-between">
								<div>
									<h4 className="font-semibold text-gray-900 dark:text-white">
										{supplement.polishName}
									</h4>
									<p className="text-gray-500 text-sm">{supplement.name}</p>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={onRemove}
									className="text-red-500 hover:text-red-700"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>

							{/* Dosage & Timing */}
							<div className="mt-2 flex flex-wrap gap-2">
								<Badge variant="outline">
									{supplement.dosage} {supplement.unit}
								</Badge>
								<Badge variant="outline" className="gap-1">
									<Clock className="h-3 w-3" />
									{supplement.timing}
								</Badge>
								{supplement.withFood && (
									<Badge variant="outline">Z jedzeniem</Badge>
								)}
							</div>

							{/* Interaction Indicators */}
							{supplementInteractions.length > 0 && (
								<div className="mt-3 space-y-2">
									{hasSynergy && (
										<div className="flex items-center gap-2 text-green-600 text-sm">
											<Zap className="h-4 w-4" />
											<span>Synergia z innymi suplementami</span>
										</div>
									)}
									{hasWarning && (
										<div className="flex items-center gap-2 text-sm text-yellow-600">
											<AlertTriangle className="h-4 w-4" />
											<span>Ostrzeżenie o interakcji</span>
										</div>
									)}
									{hasAntagonistic && (
										<div className="flex items-center gap-2 text-red-600 text-sm">
											<AlertTriangle className="h-4 w-4" />
											<span>Antagonistyczna interakcja</span>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export function StackBuilder({
availableSupplements = [],
onSaveStack,
onShareStack,
}: StackBuilderProps) {
const [stack, setStack] = useState<SupplementInStack[]>([]);
const [activeTab, setActiveTab] = useState("stack");

	// Drag and drop sensors
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	// Handle drag end
	const handleDragEnd = useCallback((event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setStack((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	}, []);

	// Add supplement to stack
	const addToStack = useCallback((supplement: SupplementInStack) => {
		setStack((prev) => [...prev, supplement]);
	}, []);

	// Remove supplement from stack
	const removeFromStack = useCallback((id: string) => {
		setStack((prev) => prev.filter((item) => item.id !== id));
	}, []);

	// Calculate stack analysis
	const stackAnalysis = useMemo(() => analyzeStack(stack), [stack]);

	// Generate smart suggestions
	const smartSuggestions = useMemo(() =>
	 generateSmartSuggestions(stack, availableSupplements),
		[stack, availableSupplements]
	);

	// Calculate total daily dosages
	const totalDosages = useMemo(() => {
		const totals: Record<string, { amount: number; unit: string }> = {};
		stack.forEach((supplement) => {
			if (!totals[supplement.category]) {
				totals[supplement.category] = { amount: 0, unit: supplement.unit };
			}
			totals[supplement.category]!.amount += supplement.dosage;
		});
		return totals;
	}, [stack]);

	// Check for warnings and synergies from analysis
	const hasWarnings = stackAnalysis.interactions.some(
	(i) => i.type === "antagonistic" || i.type === "caution" || i.type === "contraindicated",
	);
	const hasSynergies = stackAnalysis.interactions.some((i) => i.type === "synergistic");
	const hasOptimizations = smartSuggestions.length > 0;

	return (
		<div className="space-y-6">
			{/* Header */}
			<FadeIn>
				<div className="flex items-center justify-between">
					<div>
						<h2 className="font-bold text-2xl text-gray-900 dark:text-white">
							Kreator Stosu Suplementów
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Przeciągnij i upuść suplementy, aby stworzyć swój idealny stos
						</p>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => onShareStack?.(stack)}>
							<Share2 className="mr-2 h-4 w-4" />
							Udostępnij
						</Button>
						<Button onClick={() => onSaveStack?.(stack)}>
							<Save className="mr-2 h-4 w-4" />
							Zapisz Stos
						</Button>
					</div>
				</div>
			</FadeIn>

			{/* Enhanced Stack Analysis */}
			{stack.length > 0 && (
			<SlideIn direction="down">
			<div className="grid gap-4 md:grid-cols-4 mb-6">
			<Card>
			<CardContent className="pt-6">
			<div className="text-center">
			<div className="font-bold text-3xl text-blue-600">
			{stack.length}
			</div>
			<div className="text-gray-600 text-sm">Suplementów</div>
			</div>
			</CardContent>
			</Card>
			<Card>
			<CardContent className="pt-6">
			<div className="text-center space-y-2">
			<div className="font-bold text-2xl text-green-600 flex items-center justify-center gap-1">
			{hasSynergies ? <Sparkles className="h-5 w-5" /> : "—"}
			 {stackAnalysis.synergyScore}%
			</div>
			 <div className="text-gray-600 text-sm">Synergia</div>
			  <Progress value={stackAnalysis.synergyScore} className="h-2" />
			  </div>
			 </CardContent>
			</Card>
			<Card>
			<CardContent className="pt-6">
			<div className="text-center space-y-2">
			<div className={`font-bold text-2xl flex items-center justify-center gap-1 ${stackAnalysis.riskScore > 50 ? "text-red-600" : stackAnalysis.riskScore > 25 ? "text-yellow-600" : "text-gray-400"}`}>
			{stackAnalysis.riskScore > 25 ? <AlertTriangle className="h-5 w-5" /> : "✓"}
			 {stackAnalysis.riskScore}%
			</div>
			 <div className="text-gray-600 text-sm">Ryzyko</div>
			  <Progress value={stackAnalysis.riskScore} className="h-2" />
			  </div>
			  </CardContent>
			  </Card>
			   <Card>
							<CardContent className="pt-6">
								<div className="text-center space-y-2">
									<div className="font-bold text-2xl text-purple-600 flex items-center justify-center gap-1">
										{hasOptimizations ? <Lightbulb className="h-5 w-5" /> : "—"}
										{smartSuggestions.length}
									</div>
									<div className="text-gray-600 text-sm">Optymalizacje</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</SlideIn>
			)}

			{/* Main Content with Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
			<TabsList className="grid w-full grid-cols-4">
			 <TabsTrigger value="stack">Stos</TabsTrigger>
			<TabsTrigger value="analysis">Analiza</TabsTrigger>
			<TabsTrigger value="suggestions">Sugestie</TabsTrigger>
			<TabsTrigger value="supplements">Suplementy</TabsTrigger>
			</TabsList>

			<TabsContent value="stack" className="space-y-4">
			<h3 className="font-semibold text-lg">Twój Stos Suplementów</h3>
			{stack.length === 0 ? (
			<Card className="border-2 border-dashed">
			 <CardContent className="py-12 text-center">
			   <Plus className="mx-auto mb-4 h-12 w-12 text-gray-400" />
			  <p className="text-gray-600">
			  Dodaj suplementy z zakładki "Suplementy", aby rozpocząć budowanie stosu
			 </p>
			</CardContent>
			</Card>
			) : (
			<DndContext
			sensors={sensors}
			 collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			>
			<SortableContext
			items={stack.map((s) => s.id)}
			strategy={verticalListSortingStrategy}
			>
			{stack.map((supplement) => (
			  <SortableSupplementItem
			    key={supplement.id}
			     supplement={supplement}
			      onRemove={() => removeFromStack(supplement.id)}
			       interactions={stackAnalysis.interactions}
										/>
			     ))}
			    </SortableContext>
			  </DndContext>
			)}
			</TabsContent>

			<TabsContent value="analysis" className="space-y-4">
			<h3 className="font-semibold text-lg">Analiza Interakcji</h3>
			{stackAnalysis.interactions.length === 0 ? (
			<Card>
			<CardContent className="py-8 text-center">
			<CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-500" />
			<p className="text-gray-600">Brak wykrytych interakcji w Twoim stosie</p>
			</CardContent>
			</Card>
			) : (
			<div className="space-y-3">
			{stackAnalysis.interactions.map((interaction, index) => (
			<Alert key={`interaction-${index}`} variant={interaction.type === 'synergistic' ? 'default' : 'destructive'}>
			{interaction.type === 'synergistic' ? (
			  <Sparkles className="h-4 w-4" />
			  ) : (
			    <AlertTriangle className="h-4 w-4" />
			    )}
			     <AlertDescription>
			       <strong>{interaction.targetSupplement}:</strong> {interaction.polishDescription}
									</AlertDescription>
								</Alert>
							))}
						</div>
					)}

					{stackAnalysis.dosageWarnings.length > 0 && (
						<div className="mt-6 space-y-3">
							<h4 className="font-medium text-lg">Ostrzeżenia dotyczące dawkowania</h4>
							{stackAnalysis.dosageWarnings.map((warning, index) => (
								<Alert key={`dosage-${index}`} variant="destructive">
									<AlertTriangle className="h-4 w-4" />
									<AlertDescription>
										<strong>{warning.supplement}:</strong> Dawka {warning.currentDosage}mg przekracza zalecane maximum {warning.recommendedMax}mg
									</AlertDescription>
								</Alert>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent value="suggestions" className="space-y-4">
					<h3 className="font-semibold text-lg">Inteligentne Sugestie</h3>
					{smartSuggestions.length === 0 ? (
						<Card>
							<CardContent className="py-8 text-center">
								<Lightbulb className="mx-auto mb-4 h-12 w-12 text-gray-400" />
								<p className="text-gray-600">Brak dodatkowych sugestii dla Twojego stosu</p>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-3">
							{smartSuggestions.map((suggestion, index) => (
								<Card key={`suggestion-${index}`} className="border-l-4 border-l-purple-500">
									<CardContent className="pt-4">
										<div className="flex items-start gap-3">
											<Lightbulb className="h-5 w-5 text-purple-500 mt-0.5" />
											<div className="flex-1">
												<p className="font-medium">{suggestion.polishDescription}</p>
												<div className="flex items-center gap-2 mt-2">
													<Badge variant={suggestion.priority === 'high' ? 'destructive' : suggestion.priority === 'medium' ? 'default' : 'secondary'}>
														{suggestion.priority === 'high' ? 'Wysoki' : suggestion.priority === 'medium' ? 'Średni' : 'Niski'} priorytet
													</Badge>
													<span className="text-sm text-green-600 flex items-center gap-1">
														<TrendingUp className="h-3 w-3" />
														+{suggestion.potentialBenefit}% efektywność
													</span>
												</div>
												{suggestion.type === 'add' && suggestion.supplement && (
													<Button
														size="sm"
														className="mt-2"
														onClick={() => {
															const supplement = availableSupplements.find(s => s.name === suggestion.supplement);
															if (supplement) addToStack(supplement);
														}}
													>
														Dodaj {suggestion.supplement}
													</Button>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>

				<TabsContent value="supplements" className="space-y-4">
					<h3 className="font-semibold text-lg">Dostępne Suplementy</h3>
					<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
						{availableSupplements.map((supplement) => (
							<Card
									key={supplement.id}
									className="cursor-pointer hover:shadow-md transition-shadow"
									onClick={() => addToStack(supplement)}
								>
									<CardContent className="p-4">
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<h4 className="font-semibold">{supplement.polishName}</h4>
												<Button size="sm" variant="ghost" className="h-8 w-8 p-0">
													<Plus className="h-4 w-4" />
												</Button>
											</div>
											<p className="text-gray-500 text-sm">{supplement.name}</p>
											<div className="flex items-center gap-2 text-xs text-gray-600">
												<Clock className="h-3 w-3" />
												{supplement.timing}
												<span>•</span>
												{supplement.dosage}{supplement.unit}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
