"use client";

import { Color, type Vector3 } from "three";
import type { AdvancedParticle } from "./advanced-particle-physics";

// Polish scientific terminology and translations
export interface PolishScientificTerms {
	// Cellular structures
	cell: "komórka";
	nucleus: "jądro";
	mitochondria: "mitochondrium";
	ribosome: "rybosom";
	endoplasmicReticulum: "retikulum endoplazmatyczne";
	golgiApparatus: "aparat Golgiego";
	lysosome: "lizosom";
	peroxisome: "peroksysom";
	cytoskeleton: "cytoszkielet";
	cellMembrane: "błona komórkowa";

	// Molecular components
	protein: "białko";
	lipid: "lipid";
	carbohydrate: "węglowodan";
	nucleicAcid: "kwas nukleinowy";
	dna: "DNA";
	rna: "RNA";
	aminoAcid: "aminokwas";
	nucleotide: "nukleotyd";

	// Ions and molecules
	sodium: "sód";
	potassium: "potas";
	calcium: "wapń";
	chloride: "chlor";
	magnesium: "magnez";
	iron: "żelazo";
	zinc: "cynk";
	copper: "miedź";

	// Neurotransmitters
	acetylcholine: "acetylocholina";
	dopamine: "dopamina";
	serotonin: "serotonina";
	norepinephrine: "norepinefryna";
	gaba: "GABA";
	glutamate: "glutaminian";

	// Hormones
	insulin: "insulina";
	glucagon: "glukagon";
	adrenaline: "adrenalina";
	cortisol: "kortyzol";
	testosterone: "testosteron";
	estrogen: "estrogen";
	thyroidHormone: "hormon tarczycy";

	// Blood cells
	redBloodCell: "erytrocyty";
	whiteBloodCell: "leukocyty";
	platelet: "płytki krwi";
	plasma: "osocze";

	// Organs and systems
	heart: "serce";
	lung: "płuco";
	kidney: "nerka";
	liver: "wątroba";
	brain: "mózg";
	muscle: "mięsień";
	intestine: "jelito";
	bloodVessel: "naczynie krwionośne";

	// Processes
	diffusion: "dyfuzja";
	osmosis: "osmoza";
	activeTransport: "transport aktywny";
	passiveTransport: "transport pasywny";
	endocytosis: "endocytoza";
	exocytosis: "egzocytoza";
	phagocytosis: "fagocytoza";
	pinocytosis: "pinocytoza";

	// Biological processes
	cellularRespiration: "oddychanie komórkowe";
	photosynthesis: "fotosynteza";
	proteinSynthesis: "synteza białka";
	dnaReplication: "replikacja DNA";
	transcription: "transkrypcja";
	translation: "translacja";
	mitosis: "mitoza";
	meiosis: "mejoza";

	// Supplement categories
	vitamin: "witamina";
	mineral: "minerał";
	aminoAcid: "aminokwas";
	herb: "zioło";
	probiotic: "probiotyk";
	enzyme: "enzym";
	antioxidant: "antyoksydant";
	adaptogen: "adaptogen";
}

// Educational annotation interface
export interface EducationalAnnotation {
	id: string;
	position: Vector3;
	title: string;
	polishTitle: string;
	description: string;
	polishDescription: string;
	type: "structure" | "process" | "interaction" | "supplement";
	importance: "low" | "medium" | "high";
	interactive: boolean;
	audioFile?: string;
	polishAudioFile?: string;
}

// Polish language integration manager
export class PolishLanguageManager {
	private scientificTerms: PolishScientificTerms;
	private annotations: Map<string, EducationalAnnotation> = new Map();
	private currentLanguage: "pl" | "en" = "pl";
	private voiceOvers: Map<string, string> = new Map();
	private culturalContext: Map<string, string> = new Map();

	constructor() {
		this.scientificTerms = this.initializeScientificTerms();
		this.initializeCulturalContext();
		this.initializeVoiceOvers();
	}

	private initializeScientificTerms(): PolishScientificTerms {
		return {
			// Cellular structures
			cell: "komórka",
			nucleus: "jądro",
			mitochondria: "mitochondrium",
			ribosome: "rybosom",
			endoplasmicReticulum: "retikulum endoplazmatyczne",
			golgiApparatus: "aparat Golgiego",
			lysosome: "lizosom",
			peroxisome: "peroksysom",
			cytoskeleton: "cytoszkielet",
			cellMembrane: "błona komórkowa",

			// Molecular components
			protein: "białko",
			lipid: "lipid",
			carbohydrate: "węglowodan",
			nucleicAcid: "kwas nukleinowy",
			dna: "DNA",
			rna: "RNA",
			nucleotide: "nukleotyd",

			// Ions and molecules
			sodium: "sód",
			potassium: "potas",
			calcium: "wapń",
			chloride: "chlor",
			magnesium: "magnez",
			iron: "żelazo",
			zinc: "cynk",
			copper: "miedź",

			// Neurotransmitters
			acetylcholine: "acetylocholina",
			dopamine: "dopamina",
			serotonin: "serotonina",
			norepinephrine: "norepinefryna",
			gaba: "GABA",
			glutamate: "glutaminian",

			// Hormones
			insulin: "insulina",
			glucagon: "glukagon",
			adrenaline: "adrenalina",
			cortisol: "kortyzol",
			testosterone: "testosteron",
			estrogen: "estrogen",
			thyroidHormone: "hormon tarczycy",

			// Blood cells
			redBloodCell: "erytrocyty",
			whiteBloodCell: "leukocyty",
			platelet: "płytki krwi",
			plasma: "osocze",

			// Organs and systems
			heart: "serce",
			lung: "płuco",
			kidney: "nerka",
			liver: "wątroba",
			brain: "mózg",
			muscle: "mięsień",
			intestine: "jelito",
			bloodVessel: "naczynie krwionośne",

			// Processes
			diffusion: "dyfuzja",
			osmosis: "osmoza",
			activeTransport: "transport aktywny",
			passiveTransport: "transport pasywny",
			endocytosis: "endocytoza",
			exocytosis: "egzocytoza",
			phagocytosis: "fagocytoza",
			pinocytosis: "pinocytoza",

			// Biological processes
			cellularRespiration: "oddychanie komórkowe",
			photosynthesis: "fotosynteza",
			proteinSynthesis: "synteza białka",
			dnaReplication: "replikacja DNA",
			transcription: "transkrypcja",
			translation: "translacja",
			mitosis: "mitoza",
			meiosis: "mejoza",

			// Supplement categories
			vitamin: "witamina",
			mineral: "minerał",
			aminoAcid: "aminokwas",
			herb: "zioło",
			probiotic: "probiotyk",
			enzyme: "enzym",
			antioxidant: "antyoksydant",
			adaptogen: "adaptogen",
		};
	}

	private initializeCulturalContext(): void {
		// Add culturally relevant scientific context for Polish users
		this.culturalContext.set(
			"traditional-medicine",
			"Polska medycyna tradycyjna często wykorzystuje zioła i naturalne suplementy",
		);
		this.culturalContext.set(
			"research-heritage",
			"Polscy naukowcy jak Maria Skłodowska-Curie przyczynili się do rozwoju nauki",
		);
		this.culturalContext.set(
			"supplement-awareness",
			"Polacy tradycyjnie cenią naturalne metody wspierania zdrowia",
		);
		this.culturalContext.set(
			"educational-emphasis",
			"Polski system edukacyjny kładzie nacisk na nauki przyrodnicze",
		);
	}

	private initializeVoiceOvers(): void {
		// Initialize voice-over explanations for key processes
		this.voiceOvers.set(
			"mitochondria-function",
			"Mitochondria to elektrownie komórki, produkujące energię w postaci ATP",
		);
		this.voiceOvers.set(
			"blood-flow",
			"Krew transportuje tlen i składniki odżywcze do wszystkich komórek organizmu",
		);
		this.voiceOvers.set(
			"neural-transmission",
			"Sygnały nerwowe przenoszą informacje między neuronami za pomocą neuroprzekaźników",
		);
		this.voiceOvers.set(
			"immune-response",
			"Układ odpornościowy chroni organizm przed patogenami i chorobami",
		);
		this.voiceOvers.set(
			"hormone-action",
			"Hormony regulują procesy życiowe i utrzymują homeostazę",
		);
	}

	// Get Polish translation for scientific term
	public translateTerm(term: string): string {
		const key = term as keyof PolishScientificTerms;
		return this.scientificTerms[key] || term;
	}

	// Add educational annotation
	public addAnnotation(annotation: EducationalAnnotation): void {
		this.annotations.set(annotation.id, annotation);
	}

	// Get annotation by ID
	public getAnnotation(id: string): EducationalAnnotation | undefined {
		return this.annotations.get(id);
	}

	// Get all annotations for a specific type
	public getAnnotationsByType(
		type: EducationalAnnotation["type"],
	): EducationalAnnotation[] {
		return Array.from(this.annotations.values()).filter(
			(annotation) => annotation.type === type,
		);
	}

	// Get annotations near a position
	public getNearbyAnnotations(
		position: Vector3,
		radius = 2,
	): EducationalAnnotation[] {
		return Array.from(this.annotations.values()).filter((annotation) => {
			return annotation.position.distanceTo(position) <= radius;
		});
	}

	// Set current language
	public setLanguage(language: "pl" | "en"): void {
		this.currentLanguage = language;
	}

	// Get current language
	public getCurrentLanguage(): "pl" | "en" {
		return this.currentLanguage;
	}

	// Get localized text based on current language
	public getLocalizedText(text: { pl: string; en: string }): string {
		return this.currentLanguage === "pl" ? text.pl : text.en;
	}

	// Generate educational tooltip for particle
	public generateParticleTooltip(particle: AdvancedParticle): {
		title: string;
		description: string;
		culturalNote?: string;
	} {
		const biologicalType = particle.config.biologicalType;
		const polishType = this.translateTerm(biologicalType);

		let title = "";
		let description = "";
		let culturalNote = "";

		switch (biologicalType) {
			case "blood-cell":
				title = `Komórki krwi - ${polishType}`;
				description =
					"Erytrocyty transportują tlen, leukocyty bronią organizm przed infekcjami";
				culturalNote =
					"W polskiej medycynie ludowej krew uważana jest za źródło siły życiowej";
				break;

			case "hormone":
				title = `Hormony - ${polishType}`;
				description =
					"Hormony regulują procesy metaboliczne i utrzymują równowagę organizmu";
				break;

			case "neurotransmitter":
				title = `Neuroprzekaźniki - ${polishType}`;
				description =
					"Przekazują sygnały między neuronami, wpływając na nastrój i funkcje poznawcze";
				break;

			case "ion":
				title = `Jony - ${polishType}`;
				description =
					"Jony są niezbędne dla przewodzenia sygnałów elektrycznych w organizmie";
				break;

			case "supplement-molecule":
				title = "Cząsteczka suplementu";
				description =
					"Suplementy diety mogą wpływać na procesy biologiczne na poziomie molekularnym";
				culturalNote =
					"Polacy tradycyjnie cenią naturalne suplementy i ziołolecznictwo";
				break;

			default:
				title = this.translateTerm(biologicalType);
				description = `Proces biologiczny związany z ${polishType}`;
		}

		return { title, description, culturalNote };
	}

	// Generate voice-over explanation for process
	public generateVoiceOver(processId: string): string {
		return (
			this.voiceOvers.get(processId) || "Brak dostępnego wyjaśnienia głosowego"
		);
	}

	// Create educational annotation for cellular structure
	public createStructureAnnotation(
		id: string,
		position: Vector3,
		structureType: string,
		importance: "low" | "medium" | "high" = "medium",
	): EducationalAnnotation {
		const polishStructure = this.translateTerm(
			structureType as keyof PolishScientificTerms,
		);

		const annotations: Record<string, { title: string; description: string }> =
			{
				mitochondria: {
					title: "Mitochondria - elektrownie komórki",
					description:
						"Mitochondria produkują energię w postaci ATP poprzez oddychanie komórkowe",
				},
				nucleus: {
					title: "Jądro komórkowe - centrum kontroli",
					description:
						"Jądro zawiera DNA i kontroluje wszystkie procesy życiowe komórki",
				},
				ribosome: {
					title: "Rybosomy - fabryki białek",
					description:
						"Rybosomy syntetyzują białka według instrukcji zawartych w RNA",
				},
				cellMembrane: {
					title: "Błona komórkowa - selektywna bariera",
					description:
						"Błona komórkowa kontroluje przepływ substancji do i z komórki",
				},
			};

		const annotation = annotations[structureType] || {
			title: `${polishStructure} - struktura komórkowa`,
			description: `${polishStructure} pełni ważne funkcje w procesach życiowych komórki`,
		};

		return {
			id,
			position,
			title: annotation.title,
			polishTitle: annotation.title,
			description: annotation.description,
			polishDescription: annotation.description,
			type: "structure",
			importance,
			interactive: true,
		};
	}

	// Create educational annotation for biological process
	public createProcessAnnotation(
		id: string,
		position: Vector3,
		processType: string,
		processName: string,
	): EducationalAnnotation {
		const polishProcess = this.translateTerm(
			processType as keyof PolishScientificTerms,
		);

		const processDescriptions: Record<
			string,
			{ description: string; culturalNote?: string }
		> = {
			"cellular-respiration": {
				description:
					"Oddychanie komórkowe to proces, w którym mitochondria przetwarzają glukozę na energię ATP",
				culturalNote:
					"W polskiej kulturze energia życiowa jest często porównywana do ognia",
			},
			"protein-synthesis": {
				description:
					"Synteza białek to proces tłumaczenia informacji genetycznej na funkcjonalne białka",
				culturalNote:
					"Białka są budulcem życia - jak cegły w polskim budownictwie tradycyjnym",
			},
			"dna-transcription": {
				description:
					"Transkrypcja DNA to proces kopiowania informacji genetycznej na RNA",
				culturalNote:
					"Podobnie jak polscy kronikarze zapisywali historię dla przyszłych pokoleń",
			},
		};

		const processInfo = processDescriptions[processType] || {
			description: `${polishProcess} to ważny proces biologiczny w organizmie`,
		};

		return {
			id,
			position,
			title: `${processName} - ${polishProcess}`,
			polishTitle: `${processName} - ${polishProcess}`,
			description: processInfo.description,
			polishDescription: processInfo.description,
			type: "process",
			importance: "high",
			interactive: true,
			audioFile: `${processType}-process`,
		};
	}

	// Create supplement-specific annotation
	public createSupplementAnnotation(
		id: string,
		position: Vector3,
		supplementName: string,
		mechanism: string,
		polishMechanism: string,
	): EducationalAnnotation {
		return {
			id,
			position,
			title: `Suplement: ${supplementName}`,
			polishTitle: `Suplement: ${supplementName}`,
			description: mechanism,
			polishDescription: polishMechanism,
			type: "supplement",
			importance: "medium",
			interactive: true,
		};
	}

	// Get cultural context for scientific concept
	public getCulturalContext(concept: string): string {
		return this.culturalContext.get(concept) || "";
	}

	// Generate comprehensive educational content
	public generateEducationalContent(particle: AdvancedParticle): {
		tooltip: { title: string; description: string; culturalNote?: string };
		annotations: EducationalAnnotation[];
		voiceOver: string;
		relatedTerms: string[];
	} {
		const tooltip = this.generateParticleTooltip(particle);
		const nearbyAnnotations = this.getNearbyAnnotations(particle.position);
		const voiceOver = this.generateVoiceOver(particle.config.biologicalType);

		// Generate related scientific terms
		const relatedTerms = this.getRelatedTerms(particle.config.biologicalType);

		return {
			tooltip,
			annotations: nearbyAnnotations,
			voiceOver,
			relatedTerms,
		};
	}

	private getRelatedTerms(biologicalType: string): string[] {
		const relatedTermsMap: Record<string, string[]> = {
			mitochondria: ["atp", "cellular-respiration", "energy-production"],
			"blood-cell": ["oxygen-transport", "immune-system", "circulatory-system"],
			neurotransmitter: ["synapse", "nervous-system", "signal-transmission"],
			hormone: ["endocrine-system", "glands", "regulation"],
			ion: ["membrane-potential", "nerve-impulse", "muscle-contraction"],
			"supplement-molecule": ["nutrition", "health", "traditional-medicine"],
		};

		return relatedTermsMap[biologicalType] || [];
	}

	// Create interactive quiz question for particle system
	public generateQuizQuestion(particles: AdvancedParticle[]): {
		question: string;
		polishQuestion: string;
		options: string[];
		correctAnswer: number;
		explanation: string;
		polishExplanation: string;
	} | null {
		if (particles.length === 0) return null;

		const particle = particles[Math.floor(Math.random() * particles.length)];
		const biologicalType = particle.config.biologicalType;

		switch (biologicalType) {
			case "blood-cell":
				return {
					question: "What is the primary function of red blood cells?",
					polishQuestion: "Jaka jest główna funkcja erytrocytów?",
					options: [
						"Transport tlenu",
						"Produkcja hormonów",
						"Trawienie pokarmu",
						"Filtrowanie krwi",
					],
					correctAnswer: 0,
					explanation: "Erytrocyty transportują tlen z płuc do tkanek",
					polishExplanation: "Erytrocyty transportują tlen z płuc do tkanek",
				};

			case "mitochondria":
				return {
					question: "What do mitochondria produce?",
					polishQuestion: "Co produkują mitochondria?",
					options: ["ATP (energia)", "Białka", "Hormony", "Przeciwciała"],
					correctAnswer: 0,
					explanation:
						"Mitochondria są elektrowniami komórki, produkującymi ATP",
					polishExplanation:
						"Mitochondria są elektrowniami komórki, produkującymi ATP",
				};

			case "neurotransmitter":
				return {
					question: "How do neurotransmitters work?",
					polishQuestion: "Jak działają neuroprzekaźniki?",
					options: [
						"Przenoszą sygnały między neuronami",
						"Transportują tlen",
						"Produkują energię",
						"Trawią pokarm",
					],
					correctAnswer: 0,
					explanation:
						"Neuroprzekaźniki przenoszą sygnały chemiczne między neuronami",
					polishExplanation:
						"Neuroprzekaźniki przenoszą sygnały chemiczne między neuronami",
				};

			default:
				return null;
		}
	}

	// Get supplement mechanism explanation in Polish
	public getSupplementExplanation(
		supplementName: string,
		mechanism: string,
	): {
		mechanism: string;
		polishMechanism: string;
		educationalNote: string;
		culturalContext: string;
	} {
		const polishSupplement = this.translateTerm(
			supplementName.toLowerCase() as keyof PolishScientificTerms,
		);

		return {
			mechanism,
			polishMechanism: `Suplement ${polishSupplement} ${mechanism.toLowerCase()}`,
			educationalNote: `Ten suplement może wpływać na procesy biologiczne na poziomie ${polishSupplement}`,
			culturalContext: this.getCulturalContext("supplement-awareness"),
		};
	}

	// Generate progress tracking data in Polish
	public generateProgressData(
		correctAnswers: number,
		totalQuestions: number,
	): {
		score: number;
		polishFeedback: string;
		encouragement: string;
		nextSteps: string;
	} {
		const score = (correctAnswers / totalQuestions) * 100;

		let polishFeedback = "";
		let encouragement = "";
		let nextSteps = "";

		if (score >= 90) {
			polishFeedback =
				"Doskonały wynik! Świetnie rozumiesz procesy biologiczne.";
			encouragement = "Kontynuuj naukę na zaawansowanym poziomie.";
			nextSteps = "Spróbuj bardziej skomplikowanych symulacji molekularnych.";
		} else if (score >= 70) {
			polishFeedback = "Dobry wynik! Większość procesów jest dla Ciebie jasna.";
			encouragement =
				"Jesteś na dobrej drodze do zrozumienia biologii molekularnej.";
			nextSteps = "Przejrzyj jeszcze raz trudniejsze procesy komórkowe.";
		} else if (score >= 50) {
			polishFeedback = "Nieźle! Podstawy masz opanowane.";
			encouragement = "Ćwicz więcej, aby lepiej zrozumieć procesy biologiczne.";
			nextSteps = "Skoncentruj się na podstawowych procesach komórkowych.";
		} else {
			polishFeedback = "Nie przejmuj się! Nauka biologii wymaga czasu.";
			encouragement =
				"Zacznij od podstaw i stopniowo przechodź do procesów złożonych.";
			nextSteps = "Rozpocznij od prostych procesów jak dyfuzja i osmoza.";
		}

		return {
			score,
			polishFeedback,
			encouragement,
			nextSteps,
		};
	}

	// Get all available annotations
	public getAllAnnotations(): EducationalAnnotation[] {
		return Array.from(this.annotations.values());
	}

	// Remove annotation
	public removeAnnotation(id: string): void {
		this.annotations.delete(id);
	}

	// Clear all annotations
	public clearAnnotations(): void {
		this.annotations.clear();
	}

	// Export educational content for external use
	public exportEducationalContent(): {
		terms: PolishScientificTerms;
		annotations: EducationalAnnotation[];
		voiceOvers: Record<string, string>;
		culturalContext: Record<string, string>;
	} {
		return {
			terms: this.scientificTerms,
			annotations: this.getAllAnnotations(),
			voiceOvers: Object.fromEntries(this.voiceOvers),
			culturalContext: Object.fromEntries(this.culturalContext),
		};
	}
}

// Predefined educational annotations for common cellular structures
export const CELLULAR_STRUCTURE_ANNOTATIONS: Omit<
	EducationalAnnotation,
	"id" | "position"
>[] = [
	{
		title: "Mitochondria - Cellular Powerhouse",
		polishTitle: "Mitochondria - elektrownia komórki",
		description:
			"Mitochondria are organelles responsible for cellular respiration and ATP production",
		polishDescription:
			"Mitochondria to organelle odpowiedzialne za oddychanie komórkowe i produkcję ATP",
		type: "structure",
		importance: "high",
		interactive: true,
		audioFile: "mitochondria-function",
	},
	{
		title: "Cell Membrane - Selective Barrier",
		polishTitle: "Błona komórkowa - selektywna bariera",
		description:
			"The cell membrane controls the movement of substances in and out of the cell",
		polishDescription:
			"Błona komórkowa kontroluje przepływ substancji do i z komórki",
		type: "structure",
		importance: "high",
		interactive: true,
	},
	{
		title: "Nucleus - Control Center",
		polishTitle: "Jądro - centrum kontroli",
		description:
			"The nucleus contains DNA and controls all cellular activities",
		polishDescription:
			"Jądro zawiera DNA i kontroluje wszystkie aktywności komórki",
		type: "structure",
		importance: "high",
		interactive: true,
	},
	{
		title: "Ribosomes - Protein Factories",
		polishTitle: "Rybosomy - fabryki białek",
		description:
			"Ribosomes synthesize proteins according to genetic instructions",
		polishDescription:
			"Rybosomy syntetyzują białka zgodnie z instrukcjami genetycznymi",
		type: "structure",
		importance: "medium",
		interactive: true,
	},
];

// Predefined process annotations
export const BIOLOGICAL_PROCESS_ANNOTATIONS: Omit<
	EducationalAnnotation,
	"id" | "position"
>[] = [
	{
		title: "ATP Synthesis - Energy Production",
		polishTitle: "Synteza ATP - produkcja energii",
		description:
			"ATP synthesis occurs in mitochondria through oxidative phosphorylation",
		polishDescription:
			"Synteza ATP zachodzi w mitochondriach poprzez fosforylację oksydacyjną",
		type: "process",
		importance: "high",
		interactive: true,
		audioFile: "atp-synthesis",
	},
	{
		title: "Protein Synthesis - Translation Process",
		polishTitle: "Synteza białek - proces translacji",
		description:
			"Protein synthesis involves translation of mRNA into amino acid chains",
		polishDescription:
			"Synteza białek obejmuje tłumaczenie mRNA na łańcuchy aminokwasów",
		type: "process",
		importance: "high",
		interactive: true,
	},
	{
		title: "Ion Transport - Membrane Potential",
		polishTitle: "Transport jonów - potencjał błonowy",
		description:
			"Ion transport maintains membrane potential essential for nerve signaling",
		polishDescription:
			"Transport jonów utrzymuje potencjał błonowy niezbędny dla sygnalizacji nerwowej",
		type: "process",
		importance: "medium",
		interactive: true,
	},
];

export default PolishLanguageManager;
