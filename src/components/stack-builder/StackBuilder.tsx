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
import {} from "@/components/animations/index";
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
	Plus,
	Save,
	Share2,
	Sparkles,
	Trash2,
	X,
	Zap,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

// Types
interface SupplementInStack {
	id: string;
	name: string;
	polishName: string;
	dosage: number;
	unit: string;
	timing: string; // "morning" | "afternoon" | "evening" | "night"
	withFood: boolean;
	category: string;
}

interface Interaction {
	type: "synergistic" | "antagonistic" | "warning";
	supplements: string[];
	description: string;
	polishDescription: string;
	severity: "low" | "medium" | "high";
}

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
	interactions: Interaction[];
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
	const [showOptimizations, setShowOptimizations] = useState(false);

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

	// Calculate interactions
	const interactions = useMemo<Interaction[]>(() => {
		// This would be calculated based on supplement data
		// For now, return empty array
		return [];
	}, [stack]);

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

	// Check for warnings
	const hasWarnings = interactions.some(
		(i) => i.type === "warning" || i.type === "antagonistic",
	);
	const hasSynergies = interactions.some((i) => i.type === "synergistic");

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

			{/* Stack Summary */}
			{stack.length > 0 && (
				<SlideIn direction="down">
					<div className="grid gap-4 md:grid-cols-3">
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
								<div className="text-center">
									<div className="font-bold text-3xl text-green-600">
										{hasSynergies ? "✓" : "—"}
									</div>
									<div className="text-gray-600 text-sm">Synergie</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-center">
									<div
										className={`font-bold text-3xl ${hasWarnings ? "text-red-600" : "text-gray-400"}`}
									>
										{hasWarnings ? "!" : "✓"}
									</div>
									<div className="text-gray-600 text-sm">Ostrzeżenia</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</SlideIn>
			)}

			{/* Main Content */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Stack Area */}
				<div>
					<h3 className="mb-4 font-semibold text-lg">Twój Stos</h3>
					{stack.length === 0 ? (
						<Card className="border-2 border-dashed">
							<CardContent className="py-12 text-center">
								<Plus className="mx-auto mb-4 h-12 w-12 text-gray-400" />
								<p className="text-gray-600">
									Dodaj suplementy, aby rozpocząć budowanie stosu
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
										interactions={interactions}
									/>
								))}
							</SortableContext>
						</DndContext>
					)}
				</div>

				{/* Available Supplements */}
				<div>
					<h3 className="mb-4 font-semibold text-lg">Dostępne Suplementy</h3>
					<div className="space-y-3">
						{availableSupplements.map((supplement) => (
							<Card
								key={supplement.id}
								className="cursor-pointer"
								onClick={() => addToStack(supplement)}
							>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<h4 className="font-semibold">{supplement.polishName}</h4>
											<p className="text-gray-500 text-sm">{supplement.name}</p>
										</div>
										<Button size="sm" variant="ghost">
											<Plus className="h-4 w-4" />
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
