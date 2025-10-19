"use client";
import React from "react";

import { useLoadingState } from "@/components/ui/loading-error";
import { useErrorHandler } from "@/hooks/use-error-handler";

export interface ReviewData {
	id?: string;
	supplementId: string;
	supplementName: string;
	userId?: string;
	rating: number; // 1-5 stars
	title: string;
	content: string;
	pros?: string[];
	cons?: string[];
	usageDuration?: string;
	effectiveness:
		| "very_effective"
		| "effective"
		| "neutral"
		| "ineffective"
		| "very_ineffective";
	sideEffects?: string[];
	wouldRecommend: boolean;
	verifiedPurchase?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface ReviewSubmissionResult {
	success: boolean;
	reviewId?: string;
	message: string;
	requiresModeration?: boolean;
}

export interface ReviewDisplayData extends ReviewData {
	displayName?: string;
	avatar?: string;
	helpful: number;
	notHelpful: number;
	userVote?: "helpful" | "not_helpful";
	responses?: ReviewResponse[];
}

export interface ReviewResponse {
	id: string;
	reviewId: string;
	userId: string;
	content: string;
	isOfficial: boolean;
	createdAt: string;
}

class ReviewService {
	private static instance: ReviewService;
	private readonly API_BASE = "/api/reviews";
	private readonly SUBMISSION_TIMEOUT = 10000; // 10 seconds

	static getInstance(): ReviewService {
		if (!ReviewService.instance) {
			ReviewService.instance = new ReviewService();
		}
		return ReviewService.instance;
	}

	// Validate review data
	validateReview(review: ReviewData): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];

		if (!review.supplementId || review.supplementId.trim() === "") {
			errors.push("ID suplementu jest wymagane");
		}

		if (!review.supplementName || review.supplementName.trim() === "") {
			errors.push("Nazwa suplementu jest wymagana");
		}

		if (!review.rating || review.rating < 1 || review.rating > 5) {
			errors.push("Ocena musi być między 1 a 5 gwiazdkami");
		}

		if (!review.title || review.title.trim().length < 5) {
			errors.push("Tytuł musi mieć przynajmniej 5 znaków");
		}

		if (!review.content || review.content.trim().length < 10) {
			errors.push("Treść opinii musi mieć przynajmniej 10 znaków");
		}

		if (!review.effectiveness) {
			errors.push("Ocena skuteczności jest wymagana");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	// Submit review with error handling simulation
	async submitReview(review: ReviewData): Promise<ReviewSubmissionResult> {
		return new Promise((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				reject(new Error("Przekroczono limit czasu wysyłania opinii"));
			}, this.SUBMISSION_TIMEOUT);

			// Simulate API delay
			setTimeout(
				() => {
					clearTimeout(timeoutId);

					try {
						// Validate review
						const validation = this.validateReview(review);
						if (!validation.isValid) {
							throw new Error(
								`Błędy walidacji: ${validation.errors.join(", ")}`,
							);
						}

						// Simulate potential submission errors (for testing)
						if (Math.random() < 0.15) {
							// 15% chance of submission error
							throw new Error("Błąd serwera podczas wysyłania opinii");
						}

						// Generate mock response
						const result: ReviewSubmissionResult = {
							success: true,
							reviewId: `review_${Date.now()}`,
							message:
								"Opinia została wysłana pomyślnie i oczekuje na moderację",
							requiresModeration: true,
						};

						resolve(result);
					} catch (error) {
						reject(error);
					}
				},
				1500 + Math.random() * 1000,
			); // 1.5-2.5 second delay
		});
	}

	// Get reviews for a supplement
	async getSupplementReviews(
		supplementId: string,
		limit = 10,
		offset = 0,
	): Promise<ReviewDisplayData[]> {
		try {
			// Simulate API call
			await new Promise((resolve) =>
				setTimeout(resolve, 500 + Math.random() * 1000),
			);

			// Generate mock reviews
			const mockReviews: ReviewDisplayData[] = [
				{
					id: "review_1",
					supplementId,
					supplementName: "Test Supplement",
					rating: 5,
					title: "Świetny suplement",
					content:
						"Bardzo polecam ten suplement. Działa zgodnie z oczekiwaniami i nie powoduje skutków ubocznych.",
					effectiveness: "very_effective",
					wouldRecommend: true,
					helpful: 12,
					notHelpful: 2,
					createdAt: new Date(
						Date.now() - 7 * 24 * 60 * 60 * 1000,
					).toISOString(),
				},
				{
					id: "review_2",
					supplementId,
					supplementName: "Test Supplement",
					rating: 3,
					title: "Przeciętny efekt",
					content:
						"Suplement działa, ale efekty nie są tak spektakularne jak się spodziewałem.",
					effectiveness: "neutral",
					wouldRecommend: true,
					helpful: 5,
					notHelpful: 1,
					createdAt: new Date(
						Date.now() - 14 * 24 * 60 * 60 * 1000,
					).toISOString(),
				},
			];

			return mockReviews.slice(offset, offset + limit);
		} catch (error) {
			console.error("Error fetching reviews:", error);
			throw new Error(
				`Nie udało się pobrać opinii: ${error instanceof Error ? error.message : "Nieznany błąd"}`,
			);
		}
	}

	// Delete review
	async deleteReview(reviewId: string): Promise<boolean> {
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Simulate potential deletion errors
			if (Math.random() < 0.05) {
				// 5% chance of deletion error
				throw new Error("Nie udało się usunąć opinii");
			}

			return true;
		} catch (error) {
			console.error("Error deleting review:", error);
			throw new Error(
				`Nie udało się usunąć opinii: ${error instanceof Error ? error.message : "Nieznany błąd"}`,
			);
		}
	}

	// Report review
	async reportReview(reviewId: string, reason: string): Promise<boolean> {
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 300));

			return true;
		} catch (error) {
			console.error("Error reporting review:", error);
			throw new Error(
				`Nie udało się zgłosić opinii: ${error instanceof Error ? error.message : "Nieznany błąd"}`,
			);
		}
	}
}

// React hook for review submission with error handling
export function useReviewSubmission() {
	const errorHandler = useErrorHandler();
	const loadingState = useLoadingState();

	const submitReview = async (
		review: ReviewData,
	): Promise<ReviewSubmissionResult | null> => {
		loadingState.startLoading();

		try {
			const service = ReviewService.getInstance();
			const result = await service.submitReview(review);
			loadingState.stopLoading();
			return result;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Nie udało się wysłać opinii";

			// Handle specific error types
			if (errorMessage.includes("walidacji")) {
				errorHandler.handleValidationError(
					errorMessage,
					"Sprawdź poprawność wprowadzonych danych",
				);
			} else if (errorMessage.includes("czas")) {
				errorHandler.handleReviewError(
					"Przekroczono limit czasu. Spróbuj ponownie.",
				);
			} else {
				errorHandler.handleReviewError(errorMessage);
			}

			loadingState.setLoadingError(errorMessage);
			return null;
		}
	};

	const retrySubmission = async (review: ReviewData) => {
		errorHandler.clearErrors();
		return submitReview(review);
	};

	return {
		submitReview,
		retrySubmission,
		isSubmitting: loadingState.isLoading,
		error: loadingState.error,
		clearError: () => {
			loadingState.reset();
			errorHandler.clearErrors();
		},
	};
}

// Hook for fetching reviews
export function useSupplementReviews(supplementId: string) {
	const errorHandler = useErrorHandler();
	const loadingState = useLoadingState();
	const [reviews, setReviews] = React.useState<ReviewDisplayData[]>([]);

	const fetchReviews = async (limit = 10, offset = 0) => {
		if (!supplementId) return;

		loadingState.startLoading();

		try {
			const service = ReviewService.getInstance();
			const data = await service.getSupplementReviews(
				supplementId,
				limit,
				offset,
			);
			setReviews(data);
			loadingState.stopLoading();
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Nie udało się pobrać opinii";
			errorHandler.handleReviewError(errorMessage);
			loadingState.setLoadingError(errorMessage);
		}
	};

	const refetch = () => {
		errorHandler.clearErrors();
		return fetchReviews();
	};

	React.useEffect(() => {
		fetchReviews();
	}, [supplementId]);

	return {
		reviews,
		isLoading: loadingState.isLoading,
		error: loadingState.error,
		refetch,
	};
}

export default ReviewService;
