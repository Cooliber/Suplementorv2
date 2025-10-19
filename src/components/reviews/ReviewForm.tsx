"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertCircle,
	Award,
	CheckCircle,
	Info,
	Pill,
	Plus,
	ShoppingCart,
	Star,
	TrendingUp,
	X,
} from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	EnhancedInput,
	EnhancedTextarea,
	ValidationSummary,
} from "@/components/ui/enhanced-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
	type CreateReview,
	CreateReviewSchema,
	type ReviewFormData,
} from "@/types/review";

// Form schema that matches ReviewFormData interface
const ReviewFormSchema = CreateReviewSchema.omit({
	supplementId: true,
	userId: true,
	source: true,
	language: true,
});

interface ReviewFormProps {
	supplementId: string;
	userId: string;
	supplementName?: string;
	onSubmit: (data: CreateReview) => Promise<void>;
	onCancel?: () => void;
	isLoading?: boolean;
	className?: string;
}

export function ReviewForm({
	supplementId,
	userId,
	supplementName,
	onSubmit,
	onCancel,
	isLoading = false,
	className,
}: ReviewFormProps) {
	const [pros, setPros] = React.useState<string[]>([]);
	const [cons, setCons] = React.useState<string[]>([]);
	const [newPro, setNewPro] = React.useState("");
	const [newCon, setNewCon] = React.useState("");
	const [polishPros, setPolishPros] = React.useState<string[]>([]);
	const [polishCons, setPolishCons] = React.useState<string[]>([]);
	const [newPolishPro, setNewPolishPro] = React.useState("");
	const [newPolishCon, setNewPolishCon] = React.useState("");

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		control,
		formState: { errors, isSubmitting },
	} = useForm<ReviewFormData>({
		resolver: zodResolver(
			CreateReviewSchema.omit({
				supplementId: true,
				userId: true,
				source: true,
				language: true,
			}),
		) as any,
		defaultValues: {
			rating: 5,
			verifiedPurchase: false,
		},
	});

	const rating = watch("rating");

	// Handle form submission
	const handleFormSubmit = async (data: any) => {
		try {
			const reviewData: CreateReview = {
				supplementId,
				userId,
				...data,
				pros,
				cons,
				polishPros,
				polishCons,
				source: "web",
				language: "pl",
			};

			await onSubmit(reviewData);
		} catch (error) {
			console.error("Error submitting review:", error);
		}
	};

	// Add pro/con handlers
	const addPro = () => {
		if (newPro.trim()) {
			setPros([...pros, newPro.trim()]);
			setNewPro("");
		}
	};

	const removePro = (index: number) => {
		setPros(pros.filter((_, i) => i !== index));
	};

	const addCon = () => {
		if (newCon.trim()) {
			setCons([...cons, newCon.trim()]);
			setNewCon("");
		}
	};

	const removeCon = (index: number) => {
		setCons(cons.filter((_, i) => i !== index));
	};

	const addPolishPro = () => {
		if (newPolishPro.trim()) {
			setPolishPros([...polishPros, newPolishPro.trim()]);
			setNewPolishPro("");
		}
	};

	const removePolishPro = (index: number) => {
		setPolishPros(polishPros.filter((_, i) => i !== index));
	};

	const addPolishCon = () => {
		if (newPolishCon.trim()) {
			setPolishCons([...polishCons, newPolishCon.trim()]);
			setNewPolishCon("");
		}
	};

	const removePolishCon = (index: number) => {
		setPolishCons(polishCons.filter((_, i) => i !== index));
	};

	// Render enhanced star rating input
	const renderStarRating = () => {
		return (
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<Label className="font-semibold text-base">Ocena ogólna *</Label>
					<Badge variant="outline" className="text-xs">
						Wymagane
					</Badge>
				</div>

				<div className="space-y-3">
					<div className="flex items-center gap-2">
						{Array.from({ length: 5 }, (_, i) => (
							<button
								key={i}
								type="button"
								onClick={() => setValue("rating", i + 1)}
								className="group rounded-lg p-1 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
								title={`${i + 1} gwiazdek`}
							>
								<Star
									className={cn(
										"h-10 w-10 transition-all duration-200",
										i < rating
											? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
											: "text-gray-300 group-hover:scale-105 group-hover:text-yellow-200",
									)}
								/>
							</button>
						))}
					</div>

					<div className="flex items-center gap-3">
						<div className="h-3 flex-1 rounded-full bg-gray-200">
							<div
								className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
								style={{ width: `${(rating / 5) * 100}%` }}
							/>
						</div>
						<span className="min-w-[3rem] font-bold text-primary text-xl">
							{rating}/5
						</span>
					</div>
				</div>

				{errors.rating && (
					<Alert variant="destructive" className="py-2">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription className="text-sm">
							{errors.rating.message}
						</AlertDescription>
					</Alert>
				)}
			</div>
		);
	};

	// Render enhanced detailed ratings with sliders
	const renderDetailedRatings = () => {
		const ratings = [
			{
				name: "effectiveness",
				label: "Skuteczność",
				value: watch("effectiveness"),
				icon: Award,
				description: "Jak bardzo suplement spełnia swoje zadanie?",
			},
			{
				name: "valueForMoney",
				label: "Stosunek jakość/cena",
				value: watch("valueForMoney"),
				icon: ShoppingCart,
				description: "Czy suplement jest wart swojej ceny?",
			},
			{
				name: "easeOfUse",
				label: "Łatwość stosowania",
				value: watch("easeOfUse"),
				icon: Pill,
				description: "Jak łatwo jest stosować suplement?",
			},
		];

		return (
			<div className="space-y-6">
				<div className="flex items-center gap-2">
					<Label className="font-semibold text-base">Oceny szczegółowe</Label>
					<Badge variant="secondary" className="text-xs">
						Opcjonalne
					</Badge>
				</div>

				<Alert className="border-blue-200 bg-blue-50">
					<Info className="h-4 w-4 text-blue-600" />
					<AlertDescription className="text-blue-800">
						Szczegółowe oceny pomagają innym użytkownikom lepiej zrozumieć
						działanie suplementu.
					</AlertDescription>
				</Alert>

				<div className="grid gap-6">
					{ratings.map((rating) => {
						const Icon = rating.icon;
						const currentValue = rating.value || 3;

						return (
							<div
								key={rating.name}
								className="space-y-3 rounded-lg border bg-gradient-to-r from-gray-50 to-white p-4"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
										<Icon className="h-5 w-5 text-primary" />
									</div>
									<div className="flex-1">
										<Label className="font-medium text-sm">
											{rating.label}
										</Label>
										<p className="mt-1 text-muted-foreground text-xs">
											{rating.description}
										</p>
									</div>
									<div className="text-right">
										<span className="font-bold text-lg text-primary">
											{currentValue}
										</span>
										<span className="text-muted-foreground text-sm">/5</span>
									</div>
								</div>

								<div className="space-y-2">
									<Slider
										value={[currentValue]}
										onValueChange={(value) =>
											setValue(rating.name as any, value[0])
										}
										max={5}
										min={1}
										step={1}
										className="w-full"
									/>
									<div className="flex justify-between text-muted-foreground text-xs">
										<span>Słaba</span>
										<span>Doskonała</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<Card className={cn("mx-auto w-full max-w-4xl shadow-lg", className)}>
			<CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
				<CardTitle className="flex items-center gap-2 text-xl">
					<Award className="h-6 w-6 text-primary" />
					Napisz opinię{supplementName && ` - ${supplementName}`}
				</CardTitle>
				<p className="mt-2 text-muted-foreground text-sm">
					Twoja opinia pomoże innym użytkownikom w wyborze odpowiedniego
					suplementu
				</p>
			</CardHeader>

			<CardContent className="p-6">
				<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
					{/* Basic review info */}
					<div className="space-y-6">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<FormField
								control={control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2 font-medium text-sm">
											Tytuł opinii *
											<Badge variant="outline" className="text-xs">
												Wymagane
											</Badge>
										</FormLabel>
										<FormControl>
											<EnhancedInput
												placeholder="Podsumuj swoją opinię w kilku słowach"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="space-y-2">
								<Label htmlFor="polishTitle" className="font-medium text-sm">
									Tytuł w języku polskim
								</Label>
								<Input
									id="polishTitle"
									{...register("polishTitle")}
									placeholder="Opcjonalny tytuł w języku polskim"
									className="focus:border-primary"
								/>
							</div>
						</div>

						{/* Rating */}
						{renderStarRating()}

						{/* Review content */}
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							<FormField
								control={control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2 font-medium text-sm">
											Treść opinii *
											<Badge variant="outline" className="text-xs">
												Wymagane
											</Badge>
										</FormLabel>
										<FormControl>
											<EnhancedTextarea
												placeholder="Opisz swoje doświadczenia z suplementem, efekty, sposób działania..."
												rows={5}
												className="resize-none"
												charLimit={2000}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name="polishContent"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="font-medium text-sm">
											Treść w języku polskim
										</FormLabel>
										<FormControl>
											<EnhancedTextarea
												placeholder="Opcjonalna treść w języku polskim dla lepszej dostępności"
												rows={5}
												className="resize-none"
												charLimit={2000}
												showValidationIndicator={false}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					{/* Enhanced Pros and Cons */}
					<div className="space-y-6">
						<div className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-primary" />
							<Label className="font-semibold text-base">Zalety i wady</Label>
						</div>

						<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
							{/* Pros */}
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 rounded-full bg-green-500" />
									<Label className="font-medium text-green-700 text-sm">
										Zalety
									</Label>
									<Badge variant="secondary" className="text-xs">
										Max 5
									</Badge>
								</div>

								<div className="flex gap-2">
									<Input
										value={newPro}
										onChange={(e) => setNewPro(e.target.value)}
										placeholder="Dodaj zaletę (np. poprawia koncentrację)"
										onKeyPress={(e) =>
											e.key === "Enter" && (e.preventDefault(), addPro())
										}
										className="flex-1"
									/>
									<Button
										type="button"
										onClick={addPro}
										size="sm"
										disabled={!newPro.trim() || pros.length >= 5}
										className="px-3"
									>
										<Plus className="h-4 w-4" />
									</Button>
								</div>

								<div className="flex min-h-[2.5rem] flex-wrap gap-2 rounded-lg border bg-green-50/50 p-3">
									{pros.map((pro, index) => (
										<Badge
											key={index}
											variant="secondary"
											className="bg-green-100 text-green-700 transition-colors hover:bg-green-200"
										>
											{pro}
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removePro(index)}
												className="ml-2 h-4 w-4 p-0 hover:bg-red-100"
											>
												<X className="h-3 w-3" />
											</Button>
										</Badge>
									))}
									{pros.length === 0 && (
										<p className="w-full py-2 text-center text-green-600/70 text-sm">
											Dodaj zalety suplementu
										</p>
									)}
								</div>

								{/* Polish Pros */}
								<div className="space-y-2">
									<Label className="text-muted-foreground text-xs">
										Wersja polska (opcjonalna)
									</Label>
									<div className="flex gap-2">
										<Input
											value={newPolishPro}
											onChange={(e) => setNewPolishPro(e.target.value)}
											placeholder="Zaleta po polsku"
											onKeyPress={(e) =>
												e.key === "Enter" &&
												(e.preventDefault(), addPolishPro())
											}
											className="flex-1"
										/>
										<Button
											type="button"
											onClick={addPolishPro}
											size="sm"
											disabled={!newPolishPro.trim() || polishPros.length >= 5}
											className="px-3"
										>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
									<div className="flex min-h-[2rem] flex-wrap gap-2 rounded border border-dashed p-2">
										{polishPros.map((pro, index) => (
											<Badge
												key={index}
												variant="outline"
												className="text-green-600"
											>
												{pro}
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removePolishPro(index)}
													className="ml-2 h-4 w-4 p-0"
												>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										))}
									</div>
								</div>
							</div>

							{/* Cons */}
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 rounded-full bg-red-500" />
									<Label className="font-medium text-red-700 text-sm">
										Wady
									</Label>
									<Badge variant="secondary" className="text-xs">
										Max 5
									</Badge>
								</div>

								<div className="flex gap-2">
									<Input
										value={newCon}
										onChange={(e) => setNewCon(e.target.value)}
										placeholder="Dodaj wadę (np. powoduje senność)"
										onKeyPress={(e) =>
											e.key === "Enter" && (e.preventDefault(), addCon())
										}
										className="flex-1"
									/>
									<Button
										type="button"
										onClick={addCon}
										size="sm"
										disabled={!newCon.trim() || cons.length >= 5}
										className="px-3"
									>
										<Plus className="h-4 w-4" />
									</Button>
								</div>

								<div className="flex min-h-[2.5rem] flex-wrap gap-2 rounded-lg border bg-red-50/50 p-3">
									{cons.map((con, index) => (
										<Badge
											key={index}
											variant="secondary"
											className="bg-red-100 text-red-700 transition-colors hover:bg-red-200"
										>
											{con}
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeCon(index)}
												className="ml-2 h-4 w-4 p-0 hover:bg-red-100"
											>
												<X className="h-3 w-3" />
											</Button>
										</Badge>
									))}
									{cons.length === 0 && (
										<p className="w-full py-2 text-center text-red-600/70 text-sm">
											Dodaj wady suplementu (jeśli występują)
										</p>
									)}
								</div>

								{/* Polish Cons */}
								<div className="space-y-2">
									<Label className="text-muted-foreground text-xs">
										Wersja polska (opcjonalna)
									</Label>
									<div className="flex gap-2">
										<Input
											value={newPolishCon}
											onChange={(e) => setNewPolishCon(e.target.value)}
											placeholder="Wada po polsku"
											onKeyPress={(e) =>
												e.key === "Enter" &&
												(e.preventDefault(), addPolishCon())
											}
											className="flex-1"
										/>
										<Button
											type="button"
											onClick={addPolishCon}
											size="sm"
											disabled={!newPolishCon.trim() || polishCons.length >= 5}
											className="px-3"
										>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
									<div className="flex min-h-[2rem] flex-wrap gap-2 rounded border border-dashed p-2">
										{polishCons.map((con, index) => (
											<Badge
												key={index}
												variant="outline"
												className="text-red-600"
											>
												{con}
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removePolishCon(index)}
													className="ml-2 h-4 w-4 p-0"
												>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Enhanced Usage Details */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Pill className="h-5 w-5 text-primary" />
							<Label className="font-semibold text-base">
								Szczegóły stosowania
							</Label>
							<Badge variant="secondary" className="text-xs">
								Opcjonalne
							</Badge>
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<div className="space-y-2">
								<Label htmlFor="dosage" className="font-medium text-sm">
									Dawka
								</Label>
								<Input
									id="dosage"
									{...register("dosage")}
									placeholder="np. 500mg dziennie"
									className="focus:border-primary"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="duration" className="font-medium text-sm">
									Czas stosowania
								</Label>
								<Input
									id="duration"
									{...register("duration")}
									placeholder="np. 3 miesiące"
									className="focus:border-primary"
								/>
							</div>

							<div className="space-y-2">
								<Label className="font-medium text-sm">Częstotliwość</Label>
								<Select
									onValueChange={(value) => setValue("frequency", value as any)}
								>
									<SelectTrigger className="focus:border-primary">
										<SelectValue placeholder="Wybierz" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="once">Jednorazowo</SelectItem>
										<SelectItem value="daily">Codziennie</SelectItem>
										<SelectItem value="weekly">Cotygodniowo</SelectItem>
										<SelectItem value="monthly">Comiesięcznie</SelectItem>
										<SelectItem value="as_needed">W razie potrzeby</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{/* Detailed ratings */}
					{renderDetailedRatings()}

					{/* Enhanced Verification */}
					<div className="space-y-4">
						<Separator />
						<div className="flex items-start space-x-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
							<Checkbox
								id="verifiedPurchase"
								checked={watch("verifiedPurchase")}
								onCheckedChange={(checked) =>
									setValue("verifiedPurchase", !!checked)
								}
								className="mt-1"
							/>
							<div className="space-y-1">
								<Label
									htmlFor="verifiedPurchase"
									className="font-medium text-blue-900 text-sm"
								>
									Potwierdzam zakup tego suplementu
								</Label>
								<p className="text-blue-700 text-xs">
									Zaznaczenie tej opcji zwiększa wiarygodność Twojej opinii i
									pomaga innym użytkownikom.
								</p>
							</div>
						</div>
					</div>

					{/* Validation Summary */}
					<ValidationSummary />

					{/* Enhanced Form Actions */}
					<Separator />
					<div className="flex gap-4 pt-6">
						<Button
							type="submit"
							disabled={isSubmitting || isLoading}
							className="h-12 flex-1 font-semibold text-base"
						>
							{isSubmitting || isLoading ? (
								<>
									<div className="mr-2 h-4 w-4 animate-spin rounded-full border-white border-b-2" />
									Wysyłanie opinii...
								</>
							) : (
								<>
									<CheckCircle className="mr-2 h-5 w-5" />
									Opublikuj opinię
								</>
							)}
						</Button>

						{onCancel && (
							<Button
								type="button"
								variant="outline"
								onClick={onCancel}
								disabled={isSubmitting || isLoading}
								className="h-12 px-6"
							>
								Anuluj
							</Button>
						)}
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
