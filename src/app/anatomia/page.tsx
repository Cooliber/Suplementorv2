"use client";

import {
	AccessibilityControls,
	DiagramViewer,
	MobileControls,
} from "@/components/body-systems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WheelchairIcon } from "@/components/ui/custom-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Activity,
	Bone,
	BookOpen,
	Heart,
	Info,
	Settings,
	Shield,
	Smartphone,
	Users,
	Wind,
	Zap,
} from "lucide-react";
import { useState } from "react";

export default function AnatomiaPage() {
	const [currentSystem, setCurrentSystem] = useState("skeletal");
	const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
	const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
	const [showMobileControls, setShowMobileControls] = useState(false);
	const [showAccessibilityControls, setShowAccessibilityControls] =
		useState(false);

	// Animation and interaction settings
	const [animationSpeed, setAnimationSpeed] = useState(1);
	const [isPlaying, setIsPlaying] = useState(true);
	const [showAnatomyLabels, setShowAnatomyLabels] = useState(true);
	const [showPhysiologyAnimations, setShowPhysiologyAnimations] =
		useState(true);
	const [enableAudio, setEnableAudio] = useState(false);

	// Accessibility settings
	const [highContrast, setHighContrast] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [largeText, setLargeText] = useState(false);
	const [screenReaderSupport, setScreenReaderSupport] = useState(false);
	const [keyboardNavigation, setKeyboardNavigation] = useState(false);

	const handleSystemChange = (systemId: string) => {
		setCurrentSystem(systemId);
		setSelectedOrgan(null);
	};

	const handleOrganSelect = (organId: string) => {
		setSelectedOrgan(organId);
	};

	// Mock supplement data for demonstration
	const mockSupplements = [
		{ id: "calcium", name: "Calcium", polishName: "Wapń" },
		{ id: "vitamin-d", name: "Vitamin D", polishName: "Witamina D" },
		{ id: "magnesium", name: "Magnesium", polishName: "Magnez" },
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			{/* Header */}
			<div className="border-b bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="font-bold text-3xl text-gray-900">
								Interaktywne diagramy anatomii
							</h1>
							<p className="mt-1 text-gray-600">
								Poznaj budowę i funkcje układów ciała w sposób interaktywny
							</p>
						</div>

						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowMobileControls(!showMobileControls)}
							>
								<Smartphone className="mr-2 h-4 w-4" />
								Kontrole mobilne
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setShowAccessibilityControls(!showAccessibilityControls)
								}
							>
								<WheelchairIcon className="mr-2 h-4 w-4" />
								Dostępność
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-6">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
					{/* Main diagram viewer */}
					<div className="lg:col-span-3">
						<Card className="h-[700px]">
							<CardContent className="h-full p-0">
								<DiagramViewer
									selectedSupplements={selectedSupplements}
									currentSystem={currentSystem}
									showAnatomyLabels={showAnatomyLabels}
									showPhysiologyAnimations={showPhysiologyAnimations}
									enableAudio={enableAudio}
									onSystemChange={handleSystemChange}
									onOrganSelect={handleOrganSelect}
									className="h-full"
								/>
							</CardContent>
						</Card>
					</div>

					{/* Side panel with information and controls */}
					<div className="space-y-6">
						{/* System information */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Info className="h-5 w-5" />
									Informacje o układzie
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center gap-2">
									<Badge variant="outline" className="capitalize">
										{currentSystem}
									</Badge>
									<span className="text-gray-600 text-sm">Układ aktywny</span>
								</div>

								<p className="text-gray-700 text-sm">
									{currentSystem === "skeletal" &&
										"Układ szkieletowy zapewnia strukturę, wsparcie i ochronę dla organizmu. Składa się z kości, stawów i chrząstki."}
									{currentSystem === "muscular" &&
										"Układ mięśniowy umożliwia ruch i utrzymuje postawę. Składa się z mięśni szkieletowych, gładkich i serca."}
									{currentSystem === "respiratory" &&
										"Układ oddechowy umożliwia wymianę gazową między krwią a powietrzem. Składa się z płuc, tchawicy i przepony."}
									{currentSystem === "nervous" &&
										"Układ nerwowy kontroluje funkcje organizmu i przetwarza informacje. Składa się z mózgu, rdzenia kręgowego i nerwów."}
									{currentSystem === "endocrine" &&
										"Układ hormonalny reguluje hormony i procesy metaboliczne. Składa się z gruczołów dokrewnych."}
									{currentSystem === "reproductive" &&
										"Układ rozrodczy umożliwia reprodukcję i produkcję hormonów. Różni się u kobiet i mężczyzn."}
									{currentSystem === "integumentary" &&
										"Układ powłokowy chroni organizm przed środowiskiem zewnętrznym. Składa się ze skóry i przydatków."}
								</p>

								{/* Quick facts */}
								<div className="grid grid-cols-2 gap-2 text-xs">
									<div className="rounded bg-blue-50 p-2">
										<div className="font-medium">Organy główne</div>
										<div className="text-gray-600">
											{currentSystem === "skeletal" && "206 kości"}
											{currentSystem === "muscular" && "650 mięśni"}
											{currentSystem === "respiratory" && "Płuca, tchawica"}
											{currentSystem === "nervous" && "Mózg, nerwy"}
											{currentSystem === "endocrine" && "Gruczoły"}
											{currentSystem === "reproductive" && "Gonady"}
											{currentSystem === "integumentary" && "Skóra"}
										</div>
									</div>
									<div className="rounded bg-green-50 p-2">
										<div className="font-medium">Funkcja</div>
										<div className="text-gray-600">
											{currentSystem === "skeletal" && "Wsparcie"}
											{currentSystem === "muscular" && "Ruch"}
											{currentSystem === "respiratory" && "Oddychanie"}
											{currentSystem === "nervous" && "Kontrola"}
											{currentSystem === "endocrine" && "Regulacja"}
											{currentSystem === "reproductive" && "Rozród"}
											{currentSystem === "integumentary" && "Ochrona"}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Selected organ details */}
						{selectedOrgan && (
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Wybrany organ</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="font-medium">
											{selectedOrgan === "skull" && "Czaszka"}
											{selectedOrgan === "spine" && "Kręgosłup"}
											{selectedOrgan === "biceps" && "Mięsień dwugłowy"}
											{selectedOrgan === "lungs" && "Płuca"}
											{selectedOrgan === "brain" && "Mózg"}
											{selectedOrgan === "heart" && "Serce"}
											{selectedOrgan === "skin" && "Skóra"}
										</div>

										<p className="text-gray-600 text-sm">
											{selectedOrgan === "skull" &&
												"Chroni mózg i narządy zmysłów. Składa się z 22 kości."}
											{selectedOrgan === "spine" &&
												"Podtrzymuje ciało i chroni rdzeń kręgowy. Składa się z 33 kręgów."}
											{selectedOrgan === "biceps" &&
												"Mięsień zginacz ramienia. Umożliwia zginanie przedramienia."}
											{selectedOrgan === "lungs" &&
												"Główne narządy oddychania. Wymieniają tlen i dwutlenek węgla."}
											{selectedOrgan === "brain" &&
												"Środek kontroli układu nerwowego. Przetwarza informacje i kontroluje funkcje."}
											{selectedOrgan === "heart" &&
												"Pompuje krew przez organizm. Uderza około 100 000 razy dziennie."}
											{selectedOrgan === "skin" &&
												"Największy organ ciała. Chroni przed czynnikami zewnętrznymi."}
										</p>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Supplement integration */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<Heart className="h-5 w-5" />
									Integracja suplementów
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<p className="text-gray-600 text-sm">
										Wybierz suplementy, aby zobaczyć ich wpływ na układy ciała:
									</p>

									<div className="flex flex-wrap gap-1">
										{mockSupplements.map((supplement) => (
											<Badge
												key={supplement.id}
												variant={
													selectedSupplements.includes(supplement.id)
														? "default"
														: "outline"
												}
												className="cursor-pointer text-xs"
												onClick={() => {
													setSelectedSupplements((prev) =>
														prev.includes(supplement.id)
															? prev.filter((id) => id !== supplement.id)
															: [...prev, supplement.id],
													);
												}}
											>
												{supplement.polishName}
											</Badge>
										))}
									</div>

									{selectedSupplements.length > 0 && (
										<div className="text-gray-600 text-xs">
											<div className="font-medium">Aktywne suplementy:</div>
											<div>
												{selectedSupplements
													.map((id) => {
														const supplement = mockSupplements.find(
															(s) => s.id === id,
														);
														return supplement?.polishName;
													})
													.join(", ")}
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Educational content */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-lg">
									<BookOpen className="h-5 w-5" />
									Materiały edukacyjne
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button
									variant="outline"
									className="w-full justify-start"
									size="sm"
								>
									<Activity className="mr-2 h-4 w-4" />
									Animacje procesów fizjologicznych
								</Button>

								<Button
									variant="outline"
									className="w-full justify-start"
									size="sm"
								>
									<Users className="mr-2 h-4 w-4" />
									Przypadki kliniczne
								</Button>

								<Button
									variant="outline"
									className="w-full justify-start"
									size="sm"
								>
									<Settings className="mr-2 h-4 w-4" />
									Test wiedzy
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Mobile controls overlay */}
			<MobileControls
				isVisible={showMobileControls}
				animationSpeed={animationSpeed}
				isPlaying={isPlaying}
				showLabels={showAnatomyLabels}
				enableAudio={enableAudio}
				onAnimationSpeedChange={setAnimationSpeed}
				onPlayPause={() => setIsPlaying(!isPlaying)}
				onToggleLabels={() => setShowAnatomyLabels(!showAnatomyLabels)}
				onToggleAudio={() => setEnableAudio(!enableAudio)}
				onResetView={() => {
					/* TODO: Implement reset view */
				}}
				onFullscreenToggle={() => {
					/* TODO: Implement fullscreen */
				}}
			/>

			{/* Accessibility controls overlay */}
			<AccessibilityControls
				isVisible={showAccessibilityControls}
				highContrast={highContrast}
				reducedMotion={reducedMotion}
				largeText={largeText}
				screenReaderSupport={screenReaderSupport}
				keyboardNavigation={keyboardNavigation}
				onHighContrastToggle={setHighContrast}
				onReducedMotionToggle={setReducedMotion}
				onLargeTextToggle={setLargeText}
				onScreenReaderToggle={setScreenReaderSupport}
				onKeyboardNavigationToggle={setKeyboardNavigation}
			/>
		</div>
	);
}
