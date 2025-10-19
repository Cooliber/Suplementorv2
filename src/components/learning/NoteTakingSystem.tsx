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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
	BookOpen,
	Edit3,
	Highlighter,
	Lightbulb,
	MessageSquare,
	Palette,
	Plus,
	Search,
	Star,
	StickyNote,
	Tag,
	Trash2,
	Type,
} from "lucide-react";

interface Highlight {
	id: string;
	text: string;
	color: string;
	note?: string;
	timestamp: Date;
	context: string; // Surrounding text for context
}

interface Annotation {
	id: string;
	type: "note" | "question" | "summary" | "connection";
	content: string;
	position: { x: number; y: number };
	color: string;
	tags: string[];
	timestamp: Date;
}

interface Note {
	id: string;
	title: string;
	content: string;
	category: string;
	tags: string[];
	color: string;
	isFavorite: boolean;
	createdAt: Date;
	updatedAt: Date;
	highlights?: Highlight[];
	annotations?: Annotation[];
	sourceUrl?: string;
	sourceTitle?: string;
}

interface NoteTakingSystemProps {
	content: string;
	contentTitle?: string;
	contentId?: string;
	onSave?: (notes: Note[]) => void;
	className?: string;
}

export function NoteTakingSystem({
	content,
	contentTitle = "Treść",
	contentId,
	onSave,
	className,
}: NoteTakingSystemProps) {
	const [notes, setNotes] = React.useState<Note[]>([]);
	const [currentNote, setCurrentNote] = React.useState<Note | null>(null);
	const [isCreatingNote, setIsCreatingNote] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
	const [highlights, setHighlights] = React.useState<Highlight[]>([]);
	const [annotations, setAnnotations] = React.useState<Annotation[]>([]);

	// Highlight colors
	const highlightColors = [
		{ name: "Żółty", value: "#fef08a" },
		{ name: "Zielony", value: "#86efac" },
		{ name: "Niebieski", value: "#93c5fd" },
		{ name: "Różowy", value: "#f9a8d4" },
		{ name: "Fioletowy", value: "#c4b5fd" },
	];

	// Note categories
	const categories = [
		{ value: "summary", label: "Podsumowanie" },
		{ value: "key-points", label: "Kluczowe punkty" },
		{ value: "questions", label: "Pytania" },
		{ value: "connections", label: "Połączenia" },
		{ value: "applications", label: "Zastosowania" },
		{ value: "research", label: "Badania" },
	];

	// Create new note
	const createNote = () => {
		const newNote: Note = {
			id: Date.now().toString(),
			title: "",
			content: "",
			category: "summary",
			tags: [],
			color: highlightColors[0].value,
			isFavorite: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		setCurrentNote(newNote);
		setIsCreatingNote(true);
	};

	// Save note
	const saveNote = () => {
		if (!currentNote) return;

		const updatedNote = {
			...currentNote,
			updatedAt: new Date(),
		};

		setNotes((prev) => {
			const existingIndex = prev.findIndex((n) => n.id === currentNote.id);
			if (existingIndex >= 0) {
				const updated = [...prev];
				updated[existingIndex] = updatedNote;
				return updated;
			}
			return [...prev, updatedNote];
		});

		setCurrentNote(null);
		setIsCreatingNote(false);
		onSave?.(notes);
	};

	// Delete note
	const deleteNote = (noteId: string) => {
		setNotes((prev) => prev.filter((n) => n.id !== noteId));
	};

	// Add highlight
	const addHighlight = (text: string, color: string) => {
		const newHighlight: Highlight = {
			id: Date.now().toString(),
			text,
			color,
			timestamp: new Date(),
			context: getTextContext(text),
		};
		setHighlights((prev) => [...prev, newHighlight]);
	};

	// Add annotation
	const addAnnotation = (
		type: Annotation["type"],
		content: string,
		position: { x: number; y: number },
	) => {
		const newAnnotation: Annotation = {
			id: Date.now().toString(),
			type,
			content,
			position,
			color: highlightColors[0].value,
			tags: [],
			timestamp: new Date(),
		};
		setAnnotations((prev) => [...prev, newAnnotation]);
	};

	// Get text context for highlights
	const getTextContext = (highlightedText: string): string => {
		const index = content.indexOf(highlightedText);
		if (index === -1) return "";

		const start = Math.max(0, index - 50);
		const end = Math.min(content.length, index + highlightedText.length + 50);
		return content.substring(start, end);
	};

	// Filter notes
	const filteredNotes = React.useMemo(() => {
		return notes.filter((note) => {
			const matchesSearch =
				searchQuery === "" ||
				note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
				note.tags.some((tag) =>
					tag.toLowerCase().includes(searchQuery.toLowerCase()),
				);

			const matchesCategory =
				selectedCategory === "all" || note.category === selectedCategory;

			return matchesSearch && matchesCategory;
		});
	}, [notes, searchQuery, selectedCategory]);

	// Render content with highlights
	const renderHighlightedContent = () => {
		let renderedContent = content;

		// Sort highlights by position (longest first to avoid conflicts)
		const sortedHighlights = [...highlights].sort(
			(a, b) => b.text.length - a.text.length,
		);

		sortedHighlights.forEach((highlight) => {
			const regex = new RegExp(
				`(${highlight.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
				"gi",
			);
			renderedContent = renderedContent.replace(
				regex,
				`<mark style="background-color: ${highlight.color}; padding: 2px 4px; border-radius: 3px;" data-highlight-id="${highlight.id}">$1</mark>`,
			);
		});

		return renderedContent;
	};

	return (
		<div className={cn("w-full space-y-6", className)}>
			{/* Toolbar */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Edit3 className="h-5 w-5" />
						System Notatek
					</CardTitle>
					<CardDescription>
						Zaznaczaj, anotuj i organizuj treści edukacyjne
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-2">
						<Button onClick={createNote} className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							Nowa notatka
						</Button>

						{/* Highlight Colors */}
						<div className="flex items-center gap-1">
							<span className="mr-2 text-muted-foreground text-sm">
								Zaznacz:
							</span>
							{highlightColors.map((color) => (
								<Button
									key={color.value}
									variant="outline"
									size="sm"
									className="h-8 w-8 p-0"
									style={{ backgroundColor: color.value }}
									onClick={() => {
										// In a real implementation, this would trigger text selection
										const selectedText = window.getSelection()?.toString();
										if (selectedText) {
											addHighlight(selectedText, color.value);
										}
									}}
									title={`Zaznacz ${color.name.toLowerCase()}`}
								/>
							))}
						</div>

						<Button variant="outline" className="flex items-center gap-2">
							<MessageSquare className="h-4 w-4" />
							Dodaj anotację
						</Button>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Content with Highlights */}
				<Card>
					<CardHeader>
						<CardTitle>{contentTitle}</CardTitle>
						<CardDescription>
							Zaznaczaj ważne fragmenty różnymi kolorami
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div
							className="prose prose-sm max-w-none rounded-lg border bg-muted/20 p-4"
							dangerouslySetInnerHTML={{ __html: renderHighlightedContent() }}
						/>
					</CardContent>
				</Card>

				{/* Notes Management */}
				<Card>
					<CardHeader>
						<CardTitle>Notatki ({filteredNotes.length})</CardTitle>
						<CardDescription>
							Zarządzaj swoimi notatkami i anotacjami
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Filters */}
						<div className="flex gap-2">
							<Input
								placeholder="Szukaj w notatkach..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="flex-1"
							/>
							<Select
								value={selectedCategory}
								onValueChange={setSelectedCategory}
							>
								<SelectTrigger className="w-40">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Wszystkie</SelectItem>
									{categories.map((cat) => (
										<SelectItem key={cat.value} value={cat.value}>
											{cat.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Notes List */}
						<div className="max-h-96 space-y-2 overflow-y-auto">
							{filteredNotes.map((note) => (
								<Card
									key={note.id}
									className={cn(
										"cursor-pointer transition-colors hover:bg-muted/50",
										currentNote?.id === note.id && "ring-2 ring-primary",
									)}
									onClick={() => setCurrentNote(note)}
								>
									<CardContent className="p-3">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<h4 className="font-medium text-sm">
													{note.title || "Notatka bez tytułu"}
												</h4>
												<p className="mt-1 line-clamp-2 text-muted-foreground text-xs">
													{note.content}
												</p>
												<div className="mt-2 flex items-center gap-2">
													<Badge variant="outline" className="text-xs">
														{
															categories.find((c) => c.value === note.category)
																?.label
														}
													</Badge>
													{note.isFavorite && (
														<Star className="h-3 w-3 fill-current text-yellow-500" />
													)}
												</div>
											</div>
											<Button
												variant="ghost"
												size="sm"
												className="h-6 w-6 p-0"
												onClick={(e) => {
													e.stopPropagation();
													deleteNote(note.id);
												}}
											>
												<Trash2 className="h-3 w-3" />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}

							{filteredNotes.length === 0 && (
								<div className="py-8 text-center text-muted-foreground">
									<StickyNote className="mx-auto mb-2 h-8 w-8 opacity-50" />
									<p>Brak notatek</p>
									<p className="text-xs">
										Utwórz pierwszą notatkę, aby zacząć organizować treści
									</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Note Editor Dialog */}
			<Dialog
				open={isCreatingNote || !!currentNote}
				onOpenChange={(open) => {
					if (!open) {
						setCurrentNote(null);
						setIsCreatingNote(false);
					}
				}}
			>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>
							{isCreatingNote ? "Nowa notatka" : "Edytuj notatkę"}
						</DialogTitle>
						<DialogDescription>
							Utwórz szczegółową notatkę z zaznaczonymi fragmentami
						</DialogDescription>
					</DialogHeader>

					{currentNote && (
						<div className="space-y-4">
							<Input
								placeholder="Tytuł notatki"
								value={currentNote.title}
								onChange={(e) =>
									setCurrentNote({ ...currentNote, title: e.target.value })
								}
							/>

							<div className="grid grid-cols-2 gap-4">
								<Select
									value={currentNote.category}
									onValueChange={(value) =>
										setCurrentNote({ ...currentNote, category: value })
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{categories.map((cat) => (
											<SelectItem key={cat.value} value={cat.value}>
												{cat.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<div className="flex items-center gap-2">
									<span className="text-sm">Kolor:</span>
									{highlightColors.map((color) => (
										<button
											key={color.value}
											className={cn(
												"h-6 w-6 rounded-full border-2",
												currentNote.color === color.value
													? "border-primary"
													: "border-muted",
											)}
											style={{ backgroundColor: color.value }}
											onClick={() =>
												setCurrentNote({ ...currentNote, color: color.value })
											}
											title={`Wybierz kolor ${color.name.toLowerCase()}`}
										/>
									))}
								</div>
							</div>

							<Textarea
								placeholder="Treść notatki..."
								value={currentNote.content}
								onChange={(e) =>
									setCurrentNote({ ...currentNote, content: e.target.value })
								}
								className="min-h-32"
							/>

							{/* Highlights in this note */}
							{currentNote.highlights && currentNote.highlights.length > 0 && (
								<div>
									<h4 className="mb-2 font-medium">Zaznaczone fragmenty</h4>
									<div className="space-y-2">
										{currentNote.highlights.map((highlight) => (
											<div
												key={highlight.id}
												className="rounded border p-2"
												style={{ backgroundColor: `${highlight.color}20` }}
											>
												<p className="text-sm">{highlight.text}</p>
												{highlight.note && (
													<p className="mt-1 text-muted-foreground text-xs">
														Notatka: {highlight.note}
													</p>
												)}
											</div>
										))}
									</div>
								</div>
							)}

							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									onClick={() => {
										setCurrentNote(null);
										setIsCreatingNote(false);
									}}
								>
									Anuluj
								</Button>
								<Button onClick={saveNote}>Zapisz notatkę</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
