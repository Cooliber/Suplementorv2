"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAnalytics } from "@/lib/monitoring/analytics";
import { BarChart3, Cookie, Settings, Shield } from "lucide-react";
import { useEffect, useState } from "react";

interface GDPRConsentBannerProps {
	onConsentChange?: (granted: boolean) => void;
}

export function GDPRConsentBanner({ onConsentChange }: GDPRConsentBannerProps) {
	const [showBanner, setShowBanner] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const [consentGiven, setConsentGiven] = useState(false);
	const [preferences, setPreferences] = useState({
		essential: true, // Always true, cannot be disabled
		analytics: false,
		performance: false,
		medical: false,
		localization: false,
	});

	const analytics = useAnalytics();

	useEffect(() => {
		// Check if user has already made a choice
		const savedConsent = localStorage.getItem("analytics-consent");
		const savedPreferences = localStorage.getItem("analytics-preferences");

		if (savedConsent) {
			setConsentGiven(savedConsent === "true");
			if (savedPreferences) {
				setPreferences(JSON.parse(savedPreferences));
			}
			return;
		}

		// Show banner after a short delay for better UX
		const timer = setTimeout(() => {
			setShowBanner(true);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	const handleAcceptAll = () => {
		const newPreferences = {
			essential: true,
			analytics: true,
			performance: true,
			medical: true,
			localization: true,
		};

		setPreferences(newPreferences);
		setConsentGiven(true);
		setShowBanner(false);

		localStorage.setItem("analytics-consent", "true");
		localStorage.setItem(
			"analytics-preferences",
			JSON.stringify(newPreferences),
		);

		analytics.setConsent(true);
		analytics.track("gdpr_consent_given", {
			consent_type: "all_accepted",
			preferences: newPreferences,
		});

		onConsentChange?.(true);
	};

	const handleRejectAll = () => {
		const newPreferences = {
			essential: true,
			analytics: false,
			performance: false,
			medical: false,
			localization: false,
		};

		setPreferences(newPreferences);
		setConsentGiven(true);
		setShowBanner(false);

		localStorage.setItem("analytics-consent", "false");
		localStorage.setItem(
			"analytics-preferences",
			JSON.stringify(newPreferences),
		);

		analytics.setConsent(false);
		analytics.track("gdpr_consent_rejected", {
			consent_type: "all_rejected",
		});

		onConsentChange?.(false);
	};

	const handleCustomConsent = () => {
		const hasOptionalConsent = Object.entries(preferences).some(
			([key, value]) => key !== "essential" && value,
		);

		setConsentGiven(true);
		setShowBanner(false);

		localStorage.setItem("analytics-consent", hasOptionalConsent.toString());
		localStorage.setItem("analytics-preferences", JSON.stringify(preferences));

		analytics.setConsent(hasOptionalConsent);
		analytics.track("gdpr_consent_custom", {
			preferences,
			has_analytics: preferences.analytics,
			has_performance: preferences.performance,
			has_medical: preferences.medical,
			has_localization: preferences.localization,
		});

		onConsentChange?.(hasOptionalConsent);
	};

	const updatePreference = (key: keyof typeof preferences, value: boolean) => {
		setPreferences((prev) => ({ ...prev, [key]: value }));
	};

	if (!showBanner) {
		return null;
	}

	return (
		<div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-background/95 p-4 backdrop-blur-sm">
			<Card className="mx-auto max-w-4xl">
				<CardHeader className="pb-3">
					<div className="flex items-center gap-2">
						<Cookie className="h-5 w-5 text-primary" />
						<CardTitle className="text-lg">
							Zgoda na pliki cookie i analitykę
						</CardTitle>
					</div>
					<CardDescription>
						Szanujemy Twoją prywatność. Wybierz, jakie dane chcesz udostępnić
						dla poprawy działania platformy edukacyjnej.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{!showDetails ? (
						<>
							<div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
								<div className="flex items-center gap-2">
									<Shield className="h-4 w-4 text-green-600" />
									<span>
										<strong>Niezbędne:</strong> Funkcjonowanie strony
									</span>
								</div>
								<div className="flex items-center gap-2">
									<BarChart3 className="h-4 w-4 text-blue-600" />
									<span>
										<strong>Analityka:</strong> Poprawa treści edukacyjnych
									</span>
								</div>
							</div>

							<div className="flex flex-wrap gap-2">
								<Button
									onClick={handleAcceptAll}
									className="min-w-[120px] flex-1"
								>
									Akceptuj wszystkie
								</Button>
								<Button
									variant="outline"
									onClick={handleRejectAll}
									className="min-w-[120px] flex-1"
								>
									Odrzuć wszystkie
								</Button>
								<Button
									variant="ghost"
									onClick={() => setShowDetails(true)}
									className="flex items-center gap-2"
								>
									<Settings className="h-4 w-4" />
									Ustawienia szczegółowe
								</Button>
							</div>
						</>
					) : (
						<div className="space-y-4">
							<div className="space-y-3">
								<div className="flex items-center justify-between rounded-lg border p-3">
									<div>
										<div className="font-medium">Niezbędne pliki cookie</div>
										<div className="text-muted-foreground text-sm">
											Wymagane do prawidłowego działania strony
										</div>
									</div>
									<Switch checked={preferences.essential} disabled />
								</div>

								<div className="flex items-center justify-between rounded-lg border p-3">
									<div>
										<div className="font-medium">Analityka użytkowania</div>
										<div className="text-muted-foreground text-sm">
											Pomaga nam zrozumieć, jak korzystasz z treści edukacyjnych
										</div>
									</div>
									<Switch
										checked={preferences.analytics}
										onCheckedChange={(value) =>
											updatePreference("analytics", value)
										}
									/>
								</div>

								<div className="flex items-center justify-between rounded-lg border p-3">
									<div>
										<div className="font-medium">Monitorowanie wydajności</div>
										<div className="text-muted-foreground text-sm">
											Śledzi szybkość ładowania i wydajność wizualizacji 3D
										</div>
									</div>
									<Switch
										checked={preferences.performance}
										onCheckedChange={(value) =>
											updatePreference("performance", value)
										}
									/>
								</div>

								<div className="flex items-center justify-between rounded-lg border p-3">
									<div>
										<div className="font-medium">
											Analityka treści medycznych
										</div>
										<div className="text-muted-foreground text-sm">
											Analizuje interakcje z suplementami i treściami
											edukacyjnymi
										</div>
									</div>
									<Switch
										checked={preferences.medical}
										onCheckedChange={(value) =>
											updatePreference("medical", value)
										}
									/>
								</div>

								<div className="flex items-center justify-between rounded-lg border p-3">
									<div>
										<div className="font-medium">Lokalizacja i język</div>
										<div className="text-muted-foreground text-sm">
											Pomaga dostosować treści do polskiego rynku i języka
										</div>
									</div>
									<Switch
										checked={preferences.localization}
										onCheckedChange={(value) =>
											updatePreference("localization", value)
										}
									/>
								</div>
							</div>

							<div className="flex gap-2">
								<Button onClick={handleCustomConsent} className="flex-1">
									Zapisz ustawienia
								</Button>
								<Button
									variant="ghost"
									onClick={() => setShowDetails(false)}
									className="flex-1"
								>
									Wstecz
								</Button>
							</div>
						</div>
					)}

					<div className="border-t pt-2 text-muted-foreground text-xs">
						<p>
							Więcej informacji znajdziesz w naszej{" "}
							<a
								href="/polityka-prywatnosci"
								className="text-primary hover:underline"
							>
								Polityce Prywatności
							</a>{" "}
							i{" "}
							<a href="/rodo" className="text-primary hover:underline">
								Informacji o RODO
							</a>
							.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
