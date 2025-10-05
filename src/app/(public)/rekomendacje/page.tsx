"use client";

/**
 * AI Recommendations Page
 * Personalized supplement recommendations based on user profile
 */

import { RecommendationResults } from "@/components/features/recommendations/RecommendationResults";
import { RecommendationWizard } from "@/components/features/recommendations/RecommendationWizard";
import { Button } from "@/components/ui/button";
import { Brain, Shield, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function RecommendationsPage() {
	const [recommendations, setRecommendations] = useState<any>(null);
	const [showWizard, setShowWizard] = useState(true);

	const handleComplete = (data: any) => {
		setRecommendations(data);
		setShowWizard(false);
	};

	const handleReset = () => {
		setRecommendations(null);
		setShowWizard(true);
	};

	return (
		<div className="container mx-auto max-w-7xl px-4 py-8">
			{/* Header */}
			<div className="mb-8 text-center">
				<div className="mb-4 flex items-center justify-center gap-3">
					<Sparkles className="h-10 w-10 text-primary" />
					<h1 className="font-bold text-4xl">Rekomendacje AI</h1>
				</div>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
					Otrzymaj spersonalizowane rekomendacje suplementów oparte na sztucznej
					inteligencji, Twoim profilu zdrowotnym i celach, które chcesz
					osiągnąć.
				</p>
			</div>

			{/* Features Banner */}
			{showWizard && !recommendations && (
				<div className="mb-8 grid gap-4 md:grid-cols-3">
					<div className="rounded-lg border bg-card p-4">
						<div className="mb-2 flex items-center gap-3">
							<Brain className="h-5 w-5 text-primary" />
							<h4 className="font-semibold">Inteligentny Algorytm</h4>
						</div>
						<p className="text-muted-foreground text-sm">
							Zaawansowany system AI analizuje Twój profil i cele, aby znaleźć
							idealne dopasowanie.
						</p>
					</div>
					<div className="rounded-lg border bg-card p-4">
						<div className="mb-2 flex items-center gap-3">
							<Shield className="h-5 w-5 text-primary" />
							<h4 className="font-semibold">Bezpieczeństwo</h4>
						</div>
						<p className="text-muted-foreground text-sm">
							Sprawdzamy interakcje z lekami i przeciwwskazania, aby zapewnić
							bezpieczne rekomendacje.
						</p>
					</div>
					<div className="rounded-lg border bg-card p-4">
						<div className="mb-2 flex items-center gap-3">
							<TrendingUp className="h-5 w-5 text-primary" />
							<h4 className="font-semibold">Oparte na Dowodach</h4>
						</div>
						<p className="text-muted-foreground text-sm">
							Wszystkie rekomendacje oparte są na badaniach naukowych i poziomie
							dowodów klinicznych.
						</p>
					</div>
				</div>
			)}

			{/* Wizard or Results */}
			{showWizard && !recommendations ? (
				<RecommendationWizard onComplete={handleComplete} language="pl" />
			) : recommendations ? (
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="font-bold text-2xl">Twoje Rekomendacje</h2>
							<p className="text-muted-foreground">
								Przeanalizowano {recommendations.totalSupplementsAnalyzed}{" "}
								suplementów
							</p>
						</div>
						<Button variant="outline" onClick={handleReset}>
							Rozpocznij od nowa
						</Button>
					</div>
					<RecommendationResults
						recommendations={recommendations.recommendations}
						language="pl"
					/>
				</div>
			) : null}

			{/* How It Works */}
			{showWizard && !recommendations && (
				<div className="mt-16 rounded-lg border bg-muted/50 p-8">
					<h3 className="mb-6 text-center font-bold text-2xl">
						Jak to działa?
					</h3>
					<div className="grid gap-6 md:grid-cols-4">
						<div className="text-center">
							<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xl">
								1
							</div>
							<h4 className="mb-2 font-semibold">Profil</h4>
							<p className="text-muted-foreground text-sm">
								Podaj podstawowe informacje o sobie (wiek, płeć, poziom
								doświadczenia)
							</p>
						</div>
						<div className="text-center">
							<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xl">
								2
							</div>
							<h4 className="mb-2 font-semibold">Cele</h4>
							<p className="text-muted-foreground text-sm">
								Wybierz 1-5 celów zdrowotnych, które chcesz osiągnąć
							</p>
						</div>
						<div className="text-center">
							<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xl">
								3
							</div>
							<h4 className="mb-2 font-semibold">Bezpieczeństwo</h4>
							<p className="text-muted-foreground text-sm">
								Podaj informacje o lekach, alergiach i schorzeniach
								(opcjonalnie)
							</p>
						</div>
						<div className="text-center">
							<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xl">
								4
							</div>
							<h4 className="mb-2 font-semibold">Rekomendacje</h4>
							<p className="text-muted-foreground text-sm">
								Otrzymaj spersonalizowane rekomendacje z uzasadnieniem i
								dawkowaniem
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Disclaimer */}
			<div className="mt-8 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
				<p className="text-muted-foreground text-sm">
					<strong>Ważne:</strong> Rekomendacje AI są wyłącznie informacyjne i
					nie zastępują porady lekarskiej. Zawsze skonsultuj się z lekarzem
					przed rozpoczęciem suplementacji, szczególnie jeśli przyjmujesz leki
					lub masz schorzenia przewlekłe.
				</p>
			</div>
		</div>
	);
}
