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
import { cn } from "@/lib/utils";
import {
	Bookmark,
	BookmarkCheck,
	Clock,
	ExternalLink,
	Filter,
	Folder,
	FolderPlus,
	Grid3X3,
	List,
	Plus,
	Search,
	Share2,
	Star,
	Tag,
	Trash2,
} from "lucide-react";

interface BookmarkItem {
	id: string;
	title: string;
	description?: string;
	url?: string;
	content?: string; // For bookmarking text content
	type: "page" | "section" | "concept" | "module" | "research";
	category: string;
	tags: string[];
	color: string;
	isFavorite: boolean;
	createdAt: Date;
	updatedAt: Date;
	accessCount: number;
	lastAccessed: Date;
	metadata?: {
		author?: string;
		source?: string;
		difficulty?: "beginner" | "intermediate" | "advanced";
		estimatedTime?: number;
	};
}

interface BookmarkCollection {
	id: string;
	name: string;
	description?: string;
	color: string;
	bookmarks: string[]; // Bookmark IDs
	createdAt: Date;
	isShared: boolean;
}

interface BookmarkingSystemProps {
	currentUrl?: string;
	currentTitle?: string;
	currentContent?: string;
	onBookmark?: (
		bookmark: Omit<
			BookmarkItem,
			"id" | "createdAt" | "updatedAt" | "accessCount" | "lastAccessed"
		>,
	) => void;
	className?: string;
}

export function BookmarkingSystem({
	currentUrl,
	currentTitle,
	currentContent,
	onBookmark,
	className,
}: BookmarkingSystemProps) {
	const [bookmarks, setBookmarks] = React.useState<BookmarkItem[]>([
		{
			id: "1",
			title: "Neuroprzekaźniki w mózgu",
			description: "Kompletny przewodnik po neurotransmitterach",
			url: "/neuroprzekazniki",
			type: "module",
			category: "Neurobiologia",
			tags: ["neuroprzekaźniki", "mózg", "nauka"],
			color: "#93c5fd",
			isFavorite: true,
			createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
			updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
			accessCount: 5,
			lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
			metadata: {
				difficulty: "intermediate",
				estimatedTime: 45,
			},
		},
		{
			id: "2",
			title: "Serotonina i nastrój",
			description: "Jak serotonina wpływa na samopoczucie",
			content:
				"Serotonina jest kluczowym neuroprzekaźnikiem regulującym nastrój...",
			type: "concept",
			category: "Neuroprzekaźniki",
			tags: ["serotonina", "nastrój", "depresja"],
			color: "#86efac",
			isFavorite: false,
			createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
			updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
			accessCount: 2,
			lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
			metadata: {
				difficulty: "beginner",
				estimatedTime: 15,
			},
		},
	]);

	const [collections, setCollections] = React.useState<BookmarkCollection[]>([
		{
			id: "1",
			name: "Neurobiologia",
			description: "Podstawy neurobiologii i neuroprzekaźników",
			color: "#93c5fd",
			bookmarks: ["1", "2"],
			createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
			isShared: false,
		},
	]);

	const [isCreatingBookmark, setIsCreatingBookmark] = React.useState(false);
	const [isCreatingCollection, setIsCreatingCollection] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
	const [selectedType, setSelectedType] = React.useState<string>("all");
	const [viewMode, setViewMode] = React.useState<"list" | "grid">("grid");
	const [showOnlyFavorites, setShowOnlyFavorites] = React.useState(false);

	// Categories for bookmarks
	const categories = [
		{ value: "all", label: "Wszystkie" },
		{ value: "Neurobiologia", label: "Neurobiologia" },
		{ value: "Suplementacja", label: "Suplementacja" },
		{ value: "Psychologia", label: "Psychologia" },
		{ value: "Badania", label: "Badania" },
	];

	const types = [
		{ value: "all", label: "Wszystkie typy" },
		{ value: "module", label: "Moduły" },
		{ value: "concept", label: "Koncepcje" },
		{ value: "research", label: "Badania" },
		{ value: "section", label: "Sekcje" },
	];

	// Filter bookmarks
	const filteredBookmarks = React.useMemo(() => {
		return bookmarks.filter((bookmark) => {
			const matchesSearch =
				searchQuery === "" ||
				bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				bookmark.description
					?.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				bookmark.tags.some((tag) =>
					tag.toLowerCase().includes(searchQuery.toLowerCase()),
				);

			const matchesCategory =
				selectedCategory === "all" || bookmark.category === selectedCategory;
			const matchesType =
				selectedType === "all" || bookmark.type === selectedType;
			const matchesFavorite = !showOnlyFavorites || bookmark.isFavorite;

			return matchesSearch && matchesCategory && matchesType && matchesFavorite;
		});
	}, [
		bookmarks,
		searchQuery,
		selectedCategory,
		selectedType,
		showOnlyFavorites,
	]);

	// Create new bookmark
	const createBookmark = () => {
		setIsCreatingBookmark(true);
	};

	// Save bookmark
	const saveBookmark = (
		bookmarkData: Omit<
			BookmarkItem,
			"id" | "createdAt" | "updatedAt" | "accessCount" | "lastAccessed"
		>,
	) => {
		const newBookmark: BookmarkItem = {
			...bookmarkData,
			id: Date.now().toString(),
			createdAt: new Date(),
			updatedAt: new Date(),
			accessCount: 0,
			lastAccessed: new Date(),
		};

		setBookmarks((prev) => [...prev, newBookmark]);
		setIsCreatingBookmark(false);
		onBookmark?.(bookmarkData);
	};

	// Delete bookmark
	const deleteBookmark = (bookmarkId: string) => {
		setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
	};

	// Toggle favorite
	const toggleFavorite = (bookmarkId: string) => {
		setBookmarks((prev) =>
			prev.map((b) =>
				b.id === bookmarkId ? { ...b, isFavorite: !b.isFavorite } : b,
			),
		);
	};

	// Access bookmark (update access count and last accessed)
	const accessBookmark = (bookmarkId: string) => {
		setBookmarks((prev) =>
			prev.map((b) =>
				b.id === bookmarkId
					? {
							...b,
							accessCount: b.accessCount + 1,
							lastAccessed: new Date(),
						}
					: b,
			),
		);
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "module":
				return BookOpen;
			case "concept":
				return Lightbulb;
			case "research":
				return Search;
			case "section":
				return FileText;
			default:
				return Bookmark;
		}
	};

	const getDifficultyColor = (difficulty?: string) => {
		switch (difficulty) {
			case "beginner":
				return "bg-green-100 text-green-800";
			case "intermediate":
				return "bg-yellow-100 text-yellow-800";
			case "advanced":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("pl-PL", {
			day: "numeric",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className={cn("w-full space-y-6", className)}>
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bookmark className="h-5 w-5" />
						System Zakładek
					</CardTitle>
					<CardDescription>
						Zapisuj i organizuj ważne koncepcje, moduły i sekcje
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-2">
						<Button
							onClick={createBookmark}
							className="flex items-center gap-2"
						>
							<Plus className="h-4 w-4" />
							Dodaj zakładkę
						</Button>

						<Button
							variant="outline"
							onClick={() => setIsCreatingCollection(true)}
							className="flex items-center gap-2"
						>
							<FolderPlus className="h-4 w-4" />
							Nowa kolekcja
						</Button>

						{/* Quick bookmark current page */}
						{currentUrl && (
							<Button
								variant="outline"
								onClick={() => {
									saveBookmark({
										title: currentTitle || "Aktualna strona",
										description: `${currentContent?.substring(0, 100)}...`,
										url: currentUrl,
										type: "page",
										category: "Aktualne",
										tags: [],
										color: "#93c5fd",
										isFavorite: false,
									});
								}}
								className="flex items-center gap-2"
							>
								<Bookmark className="h-4 w-4" />
								Zakładka aktualna
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Filters and View Controls */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-wrap items-center gap-4">
						<Input
							placeholder="Szukaj w zakładkach..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="min-w-48 flex-1"
						/>

						<Select
							value={selectedCategory}
							onValueChange={setSelectedCategory}
						>
							<SelectTrigger className="w-40">
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

						<Select value={selectedType} onValueChange={setSelectedType}>
							<SelectTrigger className="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{types.map((type) => (
									<SelectItem key={type.value} value={type.value}>
										{type.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button
							variant={showOnlyFavorites ? "default" : "outline"}
							size="sm"
							onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
							className="flex items-center gap-2"
						>
							<Star className="h-4 w-4" />
							Tylko ulubione
						</Button>

						<div className="flex items-center rounded-lg border">
							<Button
								variant={viewMode === "grid" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("grid")}
								className="rounded-r-none"
							>
								<Grid3X3 className="h-4 w-4" />
							</Button>
							<Button
								variant={viewMode === "list" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("list")}
								className="rounded-l-none"
							>
								<List className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Bookmarks Display */}
			<div
				className={cn(
					viewMode === "grid"
						? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
						: "space-y-4",
				)}
			>
				{filteredBookmarks.map((bookmark) => {
					const TypeIcon = getTypeIcon(bookmark.type);

					if (viewMode === "grid") {
						return (
							<Card key={bookmark.id} className="group relative">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-2">
											<TypeIcon className="h-4 w-4 text-muted-foreground" />
											<Badge variant="outline" className="text-xs">
												{bookmark.type}
											</Badge>
										</div>
										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="sm"
												className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
												onClick={() => toggleFavorite(bookmark.id)}
											>
												<Star
													className={cn(
														"h-3 w-3",
														bookmark.isFavorite
															? "fill-current text-yellow-500"
															: "",
													)}
												/>
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
												onClick={() => deleteBookmark(bookmark.id)}
											>
												<Trash2 className="h-3 w-3" />
											</Button>
										</div>
									</div>
									<CardTitle className="line-clamp-2 text-base">
										{bookmark.title}
									</CardTitle>
									{bookmark.description && (
										<CardDescription className="line-clamp-2">
											{bookmark.description}
										</CardDescription>
									)}
								</CardHeader>
								<CardContent className="pt-0">
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<Badge
												className={getDifficultyColor(
													bookmark.metadata?.difficulty,
												)}
											>
												{bookmark.metadata?.difficulty || "Podstawowy"}
											</Badge>
											<span className="text-muted-foreground text-xs">
												{bookmark.category}
											</span>
										</div>

										{bookmark.tags.length > 0 && (
											<div className="flex flex-wrap gap-1">
												{bookmark.tags.slice(0, 3).map((tag) => (
													<Badge
														key={tag}
														variant="secondary"
														className="text-xs"
													>
														{tag}
													</Badge>
												))}
											</div>
										)}

										<div className="flex items-center justify-between text-muted-foreground text-xs">
											<span>Dostępów: {bookmark.accessCount}</span>
											<span>{formatDate(bookmark.lastAccessed)}</span>
										</div>

										<div className="flex gap-2">
											{bookmark.url && (
												<Button
													size="sm"
													className="flex-1"
													onClick={() => accessBookmark(bookmark.id)}
													asChild
												>
													<a
														href={bookmark.url}
														target="_blank"
														rel="noopener noreferrer"
													>
														<ExternalLink className="mr-1 h-3 w-3" />
														Otwórz
													</a>
												</Button>
											)}
											<Button variant="outline" size="sm">
												<Share2 className="h-3 w-3" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					}
					// List view
					return (
						<Card key={bookmark.id}>
							<CardContent className="p-4">
								<div className="flex items-center gap-4">
									<div className="flex-shrink-0">
										<TypeIcon className="h-8 w-8 text-muted-foreground" />
									</div>

									<div className="min-w-0 flex-1">
										<h3 className="truncate font-medium">{bookmark.title}</h3>
										{bookmark.description && (
											<p className="line-clamp-1 text-muted-foreground text-sm">
												{bookmark.description}
											</p>
										)}
										<div className="mt-1 flex items-center gap-2">
											<Badge variant="outline" className="text-xs">
												{bookmark.category}
											</Badge>
											<Badge
												className={getDifficultyColor(
													bookmark.metadata?.difficulty,
												)}
											>
												{bookmark.metadata?.difficulty || "Podstawowy"}
											</Badge>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => toggleFavorite(bookmark.id)}
										>
											<Star
												className={cn(
													"h-4 w-4",
													bookmark.isFavorite
														? "fill-current text-yellow-500"
														: "",
												)}
											/>
										</Button>
										{bookmark.url && (
											<Button
												variant="outline"
												size="sm"
												onClick={() => accessBookmark(bookmark.id)}
												asChild
											>
												<a
													href={bookmark.url}
													target="_blank"
													rel="noopener noreferrer"
												>
													<ExternalLink className="h-4 w-4" />
												</a>
											</Button>
										)}
										<Button
											variant="ghost"
											size="sm"
											onClick={() => deleteBookmark(bookmark.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{filteredBookmarks.length === 0 && (
				<Card>
					<CardContent className="p-8 text-center">
						<Bookmark className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
						<h3 className="mb-2 font-medium">Brak zakładek</h3>
						<p className="mb-4 text-muted-foreground text-sm">
							Zacznij dodawać zakładki, aby organizować ważne treści
						</p>
						<Button onClick={createBookmark}>
							<Plus className="mr-2 h-4 w-4" />
							Dodaj pierwszą zakładkę
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Create Bookmark Dialog */}
			<Dialog open={isCreatingBookmark} onOpenChange={setIsCreatingBookmark}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Dodaj zakładkę</DialogTitle>
						<DialogDescription>
							Zapisz tę stronę lub koncepcję do późniejszego dostępu
						</DialogDescription>
					</DialogHeader>

					{/* This would contain a form for creating bookmarks */}
					<div className="py-4 text-center">
						<p className="text-muted-foreground text-sm">
							Formularz tworzenia zakładki zostanie zaimplementowany w następnym
							kroku
						</p>
						<Button
							className="mt-4"
							onClick={() => setIsCreatingBookmark(false)}
						>
							Zamknij
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
