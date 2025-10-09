"use client";

import * as React from "react";
import {
	Shield,
	CheckCircle,
	XCircle,
	Flag,
	AlertTriangle,
	Eye,
	Search,
	Filter,
	MoreHorizontal,
	Clock,
	User,
	MessageSquare,
	ThumbsUp,
	ThumbsDown,
	Calendar,
	ExternalLink
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ReviewWithUser, ReviewStatus, ReviewModerationItem } from "@/types/review";

interface ReviewModerationPanelProps {
	reviews: ReviewModerationItem[];
	onModerateReview: (reviewId: string, status: ReviewStatus, reason?: string) => Promise<void>;
	onBulkModerate: (reviewIds: string[], status: ReviewStatus, reason?: string) => Promise<void>;
	isLoading?: boolean;
	className?: string;
}

export function ReviewModerationPanel({
	reviews,
	onModerateReview,
	onBulkModerate,
	isLoading = false,
	className,
}: ReviewModerationPanelProps) {
	const [searchTerm, setSearchTerm] = React.useState("");
	const [statusFilter, setStatusFilter] = React.useState<ReviewStatus | "all">("all");
	const [priorityFilter, setPriorityFilter] = React.useState<"all" | "low" | "medium" | "high">("all");
	const [selectedReviews, setSelectedReviews] = React.useState<string[]>([]);
	const [moderationReason, setModerationReason] = React.useState("");
	const [activeTab, setActiveTab] = React.useState("pending");

	// Filter reviews based on current filters
	const filteredReviews = React.useMemo(() => {
		return reviews.filter(review => {
			const matchesSearch = searchTerm === "" ||
				review.review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				review.review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
				review.review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus = statusFilter === "all" || review.review.status === statusFilter;
			const matchesPriority = priorityFilter === "all" || review.priority === priorityFilter;

			return matchesSearch && matchesStatus && matchesPriority;
		});
	}, [reviews, searchTerm, statusFilter, priorityFilter]);

	// Handle individual review moderation
	const handleModerateReview = async (reviewId: string, status: ReviewStatus) => {
		try {
			await onModerateReview(reviewId, status, moderationReason || undefined);
			setModerationReason("");
		} catch (error) {
			console.error("Error moderating review:", error);
		}
	};

	// Handle bulk moderation
	const handleBulkModerate = async (status: ReviewStatus) => {
		if (selectedReviews.length === 0) return;

		try {
			await onBulkModerate(selectedReviews, status, moderationReason || undefined);
			setSelectedReviews([]);
			setModerationReason("");
		} catch (error) {
			console.error("Error bulk moderating reviews:", error);
		}
	};

	// Toggle review selection
	const toggleReviewSelection = (reviewId: string) => {
		setSelectedReviews(prev =>
			prev.includes(reviewId)
				? prev.filter(id => id !== reviewId)
				: [...prev, reviewId]
		);
	};

	// Select all visible reviews
	const selectAllReviews = () => {
		setSelectedReviews(filteredReviews.map(r => r.review.id));
	};

	// Clear selection
	const clearSelection = () => {
		setSelectedReviews([]);
	};

	// Render moderation reason dialog
	const renderModerationDialog = (review: ReviewWithUser, onConfirm: (status: ReviewStatus) => void) => (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					Moderuj
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Moderacja opinii</DialogTitle>
					<DialogDescription>
						Podaj powód moderacji (opcjonalne)
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<Textarea
						placeholder="Powód moderacji..."
						value={moderationReason}
						onChange={(e) => setModerationReason(e.target.value)}
						rows={3}
					/>

					<div className="flex gap-2">
						<Button
							onClick={() => onConfirm("approved")}
							className="flex-1 bg-green-600 hover:bg-green-700"
						>
							<CheckCircle className="w-4 h-4 mr-2" />
							Zatwierdź
						</Button>
						<Button
							onClick={() => onConfirm("rejected")}
							variant="destructive"
							className="flex-1"
						>
							<XCircle className="w-4 h-4 mr-2" />
							Odrzuć
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);

	// Render review item
	const renderReviewItem = (item: ReviewModerationItem) => {
		const { review } = item;
		const isSelected = selectedReviews.includes(review.id);

		return (
			<Card key={review.id} className={cn(
				"transition-all duration-200",
				isSelected && "ring-2 ring-primary",
				item.priority === "high" && "border-red-200 bg-red-50/50",
				item.priority === "medium" && "border-yellow-200 bg-yellow-50/50"
			)}>
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex items-start gap-3 flex-1">
							<Checkbox
								checked={isSelected}
								onCheckedChange={() => toggleReviewSelection(review.id)}
								className="mt-1"
							/>

							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-2">
									<Badge variant={
										item.priority === "high" ? "destructive" :
										item.priority === "medium" ? "default" : "secondary"
									} className="text-xs">
										{item.priority} priorytet
									</Badge>

									<Badge variant={
										review.status === "pending" ? "outline" :
										review.status === "approved" ? "default" : "destructive"
									} className="text-xs">
										{review.status}
									</Badge>

									{review.verifiedPurchase && (
										<Badge variant="secondary" className="text-xs">
											Zakup potwierdzony
										</Badge>
									)}
								</div>

								<div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
									<User className="w-3 h-3" />
									<span>{review.user?.name || "Nieznany użytkownik"}</span>
									<Separator orientation="vertical" className="h-3" />
									<Calendar className="w-3 h-3" />
									<span>{new Date(review.createdAt).toLocaleDateString("pl-PL")}</span>
								</div>

								<h3 className="font-semibold text-base mb-2">{review.title}</h3>
							</div>
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<MoreHorizontal className="w-4 h-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>
									<Eye className="w-4 h-4 mr-2" />
									Podgląd
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => handleModerateReview(review.id, "approved")}
									className="text-green-600"
								>
									<CheckCircle className="w-4 h-4 mr-2" />
									Zatwierdź
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleModerateReview(review.id, "rejected")}
									className="text-red-600"
								>
									<XCircle className="w-4 h-4 mr-2" />
									Odrzuć
								</DropdownMenuItem>
								<DropdownMenuItem className="text-orange-600">
									<Flag className="w-4 h-4 mr-2" />
									Oznacz jako spam
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</CardHeader>

				<CardContent className="pt-0">
					<p className="text-sm text-muted-foreground mb-4 line-clamp-3">
						{review.content}
					</p>

					{/* Moderation reasons */}
					{item.reasons.length > 0 && (
						<div className="mb-4">
							<div className="flex items-center gap-2 mb-2">
								<AlertTriangle className="w-4 h-4 text-orange-600" />
								<span className="text-sm font-medium">Powody do moderacji:</span>
							</div>
							<div className="flex flex-wrap gap-1">
								{item.reasons.map((reason, index) => (
									<Badge key={index} variant="outline" className="text-xs text-orange-700">
										{reason}
									</Badge>
								))}
							</div>
						</div>
					)}

					{/* Review stats */}
					<div className="flex items-center justify-between text-xs text-muted-foreground">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-1">
								<ThumbsUp className="w-3 h-3" />
								{review.helpful}
							</div>
							<div className="flex items-center gap-1">
								<ThumbsDown className="w-3 h-3" />
								{review.notHelpful}
							</div>
							<div className="flex items-center gap-1">
								<MessageSquare className="w-3 h-3" />
								{review.pros.length + review.cons.length} punktów
							</div>
						</div>

						<div className="flex gap-2">
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleModerateReview(review.id, "approved")}
								className="text-green-600 border-green-200 hover:bg-green-50"
							>
								<CheckCircle className="w-3 h-3 mr-1" />
								Zatwierdź
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleModerateReview(review.id, "rejected")}
								className="text-red-600 border-red-200 hover:bg-red-50"
							>
								<XCircle className="w-3 h-3 mr-1" />
								Odrzuć
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	};

	// Render bulk actions
	const renderBulkActions = () => {
		if (selectedReviews.length === 0) return null;

		return (
			<Card className="border-primary bg-primary/5">
				<CardContent className="py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="font-medium">
								Wybrano {selectedReviews.length} opin{selectedReviews.length === 1 ? "ię" : "ii"}
							</span>
							<Button variant="ghost" size="sm" onClick={clearSelection}>
								Wyczyść wybór
							</Button>
						</div>

						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleBulkModerate("approved")}
								className="text-green-600 border-green-200 hover:bg-green-50"
							>
								<CheckCircle className="w-4 h-4 mr-2" />
								Zatwierdź wszystkie
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleBulkModerate("rejected")}
								className="text-red-600 border-red-200 hover:bg-red-50"
							>
								<XCircle className="w-4 h-4 mr-2" />
								Odrzuć wszystkie
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	};

	// Render moderation stats
	const renderModerationStats = () => {
		const stats = {
			pending: reviews.filter(r => r.review.status === "pending").length,
			approved: reviews.filter(r => r.review.status === "approved").length,
			rejected: reviews.filter(r => r.review.status === "rejected").length,
			flagged: reviews.filter(r => r.review.status === "flagged").length,
			highPriority: reviews.filter(r => r.priority === "high").length,
		};

		return (
			<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
				<div className="text-center p-3 border rounded-lg">
					<div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
					<div className="text-xs text-muted-foreground">Oczekujące</div>
				</div>
				<div className="text-center p-3 border rounded-lg">
					<div className="text-2xl font-bold text-green-600">{stats.approved}</div>
					<div className="text-xs text-muted-foreground">Zatwierdzone</div>
				</div>
				<div className="text-center p-3 border rounded-lg">
					<div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
					<div className="text-xs text-muted-foreground">Odrzucone</div>
				</div>
				<div className="text-center p-3 border rounded-lg">
					<div className="text-2xl font-bold text-yellow-600">{stats.flagged}</div>
					<div className="text-xs text-muted-foreground">Oznaczone</div>
				</div>
				<div className="text-center p-3 border rounded-lg">
					<div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
					<div className="text-xs text-muted-foreground">Wysoki priorytet</div>
				</div>
			</div>
		);
	};

	return (
		<div className={cn("w-full space-y-6", className)}>
			{/* Header */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="w-6 h-6 text-primary" />
						Panel moderacji opinii
					</CardTitle>
				</CardHeader>
				<CardContent>
					{renderModerationStats()}
				</CardContent>
			</Card>

			{/* Filters */}
			<Card>
				<CardContent className="py-4">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input
									placeholder="Szukaj opinii..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						<div className="flex gap-2">
							<Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReviewStatus | "all")}>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Wszystkie</SelectItem>
									<SelectItem value="pending">Oczekujące</SelectItem>
									<SelectItem value="approved">Zatwierdzone</SelectItem>
									<SelectItem value="rejected">Odrzucone</SelectItem>
									<SelectItem value="flagged">Oznaczone</SelectItem>
								</SelectContent>
							</Select>

							<Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as any)}>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Priorytet" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Wszystkie</SelectItem>
									<SelectItem value="high">Wysoki</SelectItem>
									<SelectItem value="medium">Średni</SelectItem>
									<SelectItem value="low">Niski</SelectItem>
								</SelectContent>
							</Select>

							<Button variant="outline" onClick={selectAllReviews}>
								Zaznacz wszystkie
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Bulk Actions */}
			{renderBulkActions()}

			{/* Reviews List */}
			<div className="space-y-4">
				{isLoading ? (
					// Loading skeletons
					Array.from({ length: 3 }, (_, i) => (
						<Card key={i}>
							<CardHeader>
								<div className="animate-pulse space-y-2">
									<div className="h-4 bg-gray-200 rounded w-1/4"></div>
									<div className="h-3 bg-gray-200 rounded w-1/2"></div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="animate-pulse space-y-2">
									<div className="h-3 bg-gray-200 rounded"></div>
									<div className="h-3 bg-gray-200 rounded w-3/4"></div>
								</div>
							</CardContent>
						</Card>
					))
				) : filteredReviews.length > 0 ? (
					filteredReviews.map(renderReviewItem)
				) : (
					<Card>
						<CardContent className="py-8 text-center">
							<MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
							<p className="text-muted-foreground">
								Brak opinii spełniających kryteria wyszukiwania
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}