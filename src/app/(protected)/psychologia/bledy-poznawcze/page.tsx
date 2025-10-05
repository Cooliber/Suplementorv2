"use client";

import CognitiveBiasDetector from "@/components/psychology/CognitiveBiasDetector";
import React from "react";

// Import the BiasScenario type
interface BiasScenario {
	id: string;
	title: string;
	polishTitle: string;
	description: string;
	polishDescription: string;
	scenario: string;
	polishScenario: string;
	biasType: string;
	polishBiasType: string;
	severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
	polishSeverity: string;
	questions: Array<{
		id: string;
		question: string;
		polishQuestion: string;
		type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "REFLECTION";
		options?: Array<{
			id: string;
			text: string;
			polishText: string;
			isCorrect: boolean;
			explanation: string;
			polishExplanation: string;
		}>;
		correctAnswer?: string;
		points: number;
	}>;
	mitigation: {
		strategy: string;
		polishStrategy: string;
		steps: string[];
		polishSteps: string[];
		practicalTips: string[];
		polishPracticalTips: string[];
	};
	supplementContext: {
		relevance: string;
		polishRelevance: string;
		examples: string[];
		polishExamples: string[];
		preventionTips: string[];
		polishPreventionTips: string[];
	};
}

// Mock scenarios for cognitive bias detection
const mockScenarios: BiasScenario[] = [
	{
		id: "confirmation-bias-scenario-1",
		title: "Supplement Research Scenario",
		polishTitle: "Scenariusz badania suplementów",
		description: "Testing for confirmation bias in supplement research",
		polishDescription: "Test na błąd konfirmacji w badaniu suplementów",
		scenario: `You've been taking omega-3 supplements for 6 months and believe they significantly improve your cognitive function. You decide to research the scientific evidence to validate your experience.

While searching online, you find:
- 3 studies showing positive cognitive effects of omega-3
- 2 studies showing no significant effects
- 1 study showing potential negative interactions with certain medications

You have limited time to read all the research.`,
		polishScenario: `Przyjmujesz suplementy omega-3 od 6 miesięcy i wierzysz, że znacząco poprawiają twoją funkcję poznawczą. Postanawiasz zbadać dowody naukowe, aby potwierdzić swoje doświadczenie.

Podczas wyszukiwania w internecie znajdujesz:
- 3 badania pokazujące pozytywne efekty poznawcze omega-3
- 2 badania nie wykazujące znaczących efektów
- 1 badanie pokazujące potencjalne negatywne interakcje z niektórymi lekami

Masz ograniczony czas na przeczytanie wszystkich badań.`,
		biasType: "CONFIRMATION_BIAS",
		polishBiasType: "Błąd konfirmacji",
		severity: "HIGH",
		polishSeverity: "Wysokie",

		questions: [
			{
				id: "q1",
				question: "Which studies would you be most likely to read first?",
				polishQuestion:
					"Które badania prawdopodobnie przeczytałbyś jako pierwsze?",
				type: "MULTIPLE_CHOICE",
				options: [
					{
						id: "a",
						text: "The 3 studies showing positive effects",
						polishText: "3 badania pokazujące pozytywne efekty",
						isCorrect: false,
						explanation:
							"This demonstrates confirmation bias - seeking information that confirms existing beliefs",
						polishExplanation:
							"To pokazuje błąd konfirmacji - poszukiwanie informacji potwierdzających istniejące przekonania",
					},
					{
						id: "b",
						text: "The 2 studies showing no effects",
						polishText: "2 badania nie wykazujące efektów",
						isCorrect: false,
						explanation:
							"While this shows openness to contradictory evidence, it's not the most balanced approach",
						polishExplanation:
							"Choć pokazuje to otwartość na sprzeczne dowody, nie jest to najbardziej zrównoważone podejście",
					},
					{
						id: "c",
						text: "Read all studies systematically, starting with the most recent",
						polishText:
							"Przeczytać wszystkie badania systematycznie, zaczynając od najnowszych",
						isCorrect: true,
						explanation:
							"This is the most objective approach, avoiding bias in study selection",
						polishExplanation:
							"To najbardziej obiektywne podejście, unikające stronniczości w wyborze badań",
					},
					{
						id: "d",
						text: "Focus on the study about negative interactions",
						polishText: "Skupić się na badaniu o negatywnych interakcjach",
						isCorrect: false,
						explanation:
							"While safety is important, this could lead to negativity bias",
						polishExplanation:
							"Choć bezpieczeństwo jest ważne, może to prowadzić do błędu negatywności",
					},
				],
				points: 10,
			},
			{
				id: "q2",
				question: "How would you evaluate conflicting research results?",
				polishQuestion: "Jak oceniłbyś sprzeczne wyniki badań?",
				type: "MULTIPLE_CHOICE",
				options: [
					{
						id: "a",
						text: "Trust the studies that align with my personal experience",
						polishText:
							"Zaufać badaniom zgodnym z moim osobistym doświadczeniem",
						isCorrect: false,
						explanation: "This is a classic example of confirmation bias",
						polishExplanation: "To klasyczny przykład błędu konfirmacji",
					},
					{
						id: "b",
						text: "Look for methodological differences and study quality",
						polishText: "Szukać różnic metodologicznych i jakości badań",
						isCorrect: true,
						explanation:
							"This is the correct scientific approach to evaluating conflicting evidence",
						polishExplanation:
							"To właściwe naukowe podejście do oceny sprzecznych dowodów",
					},
					{
						id: "c",
						text: "Dismiss studies that contradict each other as unreliable",
						polishText:
							"Odrzucić badania, które sobie przeczą jako niewiarygodne",
						isCorrect: false,
						explanation:
							"This oversimplifies the complexity of scientific research",
						polishExplanation:
							"To nadmiernie upraszcza złożoność badań naukowych",
					},
					{
						id: "d",
						text: "Only consider studies with the largest sample sizes",
						polishText: "Rozważać tylko badania z największymi próbami",
						isCorrect: false,
						explanation:
							"While sample size matters, it's not the only factor determining study quality",
						polishExplanation:
							"Choć wielkość próby ma znaczenie, nie jest jedynym czynnikiem określającym jakość badania",
					},
				],
				points: 10,
			},
		],

		mitigation: {
			strategy: "Structured Evidence Review",
			polishStrategy: "Ustrukturyzowany Przegląd Dowodów",
			steps: [
				"Create a systematic search strategy",
				"Read abstracts of all relevant studies first",
				"Evaluate study methodology and quality",
				"Look for systematic reviews and meta-analyses",
				"Consider both positive and negative evidence equally",
			],
			polishSteps: [
				"Stwórz systematyczną strategię wyszukiwania",
				"Najpierw przeczytaj abstrakty wszystkich istotnych badań",
				"Oceń metodologię i jakość badań",
				"Szukaj przeglądów systematycznych i meta-analiz",
				"Rozważ równo zarówno pozytywne, jak i negatywne dowody",
			],
			practicalTips: [
				"Set aside dedicated time for thorough research",
				"Use multiple databases and sources",
				"Keep a research log with pros and cons",
				"Seek expert opinions when in doubt",
			],
			polishPracticalTips: [
				"Wyznacz dedykowany czas na dokładne badania",
				"Używaj wielu baz danych i źródeł",
				"Prowadź dziennik badań z argumentami za i przeciw",
				"Szukaj opinii ekspertów w razie wątpliwości",
			],
		},

		supplementContext: {
			relevance:
				"Confirmation bias significantly affects supplement choices, leading people to cherry-pick studies that support their preferred supplements while ignoring contradictory evidence.",
			polishRelevance:
				"Błąd konfirmacji znacząco wpływa na wybór suplementów, prowadząc ludzi do wybierania badań wspierających ich preferowane suplementy, ignorując sprzeczne dowody.",
			examples: [
				"Reading only positive reviews of a supplement",
				'Dismissing negative studies as "industry-funded"',
				"Interpreting ambiguous results as positive",
			],
			polishExamples: [
				"Czytanie tylko pozytywnych recenzji suplementu",
				'Odrzucanie negatywnych badań jako "finansowanych przez przemysł"',
				"Interpretowanie niejednoznacznych wyników jako pozytywnych",
			],
			preventionTips: [
				"Always look for systematic reviews first",
				"Set a rule to read equal numbers of positive and negative studies",
				"Use evidence-based databases like Cochrane Library",
				"Consult with healthcare professionals before making decisions",
			],
			polishPreventionTips: [
				"Zawsze najpierw szukaj przeglądów systematycznych",
				"Ustaw zasadę czytania równej liczby pozytywnych i negatywnych badań",
				"Używaj baz danych opartych na dowodach jak Cochrane Library",
				"Skonsultuj się z profesjonalistami zdrowotnymi przed podjęciem decyzji",
			],
		},
	},

	{
		id: "availability-heuristic-scenario-1",
		title: "Side Effects Assessment",
		polishTitle: "Ocena skutków ubocznych",
		description:
			"Testing for availability heuristic in supplement safety assessment",
		polishDescription:
			"Test na heurystykę dostępności w ocenie bezpieczeństwa suplementów",
		scenario: `You're considering starting a new nootropic supplement. Recently, you read a detailed news article about someone who experienced severe side effects from a different nootropic. The article was very vivid and included personal testimonials.

When researching your chosen supplement, you find:
- Clinical studies showing it's generally safe for most people
- Rare side effects reported in less than 1% of users
- The news story keeps coming to mind as you read the research`,
		polishScenario: `Rozważasz rozpoczęcie przyjmowania nowego suplementu nootropowego. Niedawno przeczytałeś szczegółowy artykuł o kimś, kto doświadczył poważnych skutków ubocznych od innego nootropiku. Artykuł był bardzo obrazowy i zawierał osobiste świadectwa.

Podczas badania wybranego suplementu znajdujesz:
- Badania kliniczne pokazujące, że jest ogólnie bezpieczny dla większości ludzi
- Rzadkie skutki uboczne zgłaszane u mniej niż 1% użytkowników
- Historia z wiadomości ciągle przychodzi ci do głowy podczas czytania badań`,
		biasType: "AVAILABILITY_HEURISTIC",
		polishBiasType: "Heurystyka dostępności",
		severity: "MODERATE",
		polishSeverity: "Umiarkowane",

		questions: [
			{
				id: "q1",
				question: "How much should the news story influence your decision?",
				polishQuestion:
					"Jak bardzo historia z wiadomości powinna wpłynąć na twoją decyzję?",
				type: "MULTIPLE_CHOICE",
				options: [
					{
						id: "a",
						text: "Significantly - vivid stories often reveal hidden risks",
						polishText:
							"Znacząco - obrazowe historie często ujawniają ukryte ryzyko",
						isCorrect: false,
						explanation:
							"This demonstrates availability heuristic - overweighting vivid, memorable information",
						polishExplanation:
							"To pokazuje heurystykę dostępności - nadmierne ważenie żywych, zapadających w pamięć informacji",
					},
					{
						id: "b",
						text: "Minimally - focus on statistical evidence from studies",
						polishText:
							"Minimalnie - skup się na dowodach statystycznych z badań",
						isCorrect: true,
						explanation:
							"Correct approach - base decisions on systematic evidence rather than anecdotes",
						polishExplanation:
							"Właściwe podejście - opieraj decyzje na systematycznych dowodach, a nie anegdotach",
					},
					{
						id: "c",
						text: "Moderately - it provides valuable real-world perspective",
						polishText:
							"Umiarkowanie - dostarcza cennej perspektywy z prawdziwego świata",
						isCorrect: false,
						explanation:
							"While real experiences matter, single cases shouldn't outweigh systematic data",
						polishExplanation:
							"Choć prawdziwe doświadczenia mają znaczenie, pojedyncze przypadki nie powinny przeważać nad systematycznymi danymi",
					},
					{
						id: "d",
						text: "Not at all - news stories are always biased",
						polishText: "Wcale - historie w wiadomościach są zawsze stronnicze",
						isCorrect: false,
						explanation:
							"This is too extreme - individual cases can provide context, just not statistical weight",
						polishExplanation:
							"To zbyt skrajne - pojedyncze przypadki mogą dostarczyć kontekstu, ale nie wagi statystycznej",
					},
				],
				points: 10,
			},
		],

		mitigation: {
			strategy: "Statistical Thinking Framework",
			polishStrategy: "Ramy Myślenia Statystycznego",
			steps: [
				"Always ask for base rates and frequencies",
				"Distinguish between anecdotal and systematic evidence",
				"Consider the representativeness of individual cases",
				"Look for large-scale studies and meta-analyses",
			],
			polishSteps: [
				"Zawsze pytaj o wskaźniki bazowe i częstotliwości",
				"Rozróżniaj między dowodami anegdotycznymi a systematycznymi",
				"Rozważ reprezentatywność pojedynczych przypadków",
				"Szukaj badań na dużą skalę i meta-analiz",
			],
			practicalTips: [
				"Write down actual statistics before making decisions",
				"Actively seek out contradictory evidence",
				"Use decision-making frameworks that emphasize data",
			],
			polishPracticalTips: [
				"Zapisz rzeczywiste statystyki przed podjęciem decyzji",
				"Aktywnie szukaj sprzecznych dowodów",
				"Używaj ram decyzyjnych, które podkreślają dane",
			],
		},

		supplementContext: {
			relevance:
				"Availability heuristic causes people to overestimate risks of supplements based on memorable news stories while underestimating more common but less publicized risks.",
			polishRelevance:
				"Heurystyka dostępności powoduje, że ludzie przeceniają ryzyko suplementów na podstawie zapadających w pamięć historii z wiadomości, jednocześnie niedoceniając częstsze, ale mniej nagłaśniane ryzyko.",
			examples: [
				"Avoiding all supplements after reading one negative story",
				"Overestimating rare but dramatic side effects",
				"Underestimating common mild side effects",
			],
			polishExamples: [
				"Unikanie wszystkich suplementów po przeczytaniu jednej negatywnej historii",
				"Przecenianie rzadkich, ale dramatycznych skutków ubocznych",
				"Niedocenianie częstych łagodnych skutków ubocznych",
			],
			preventionTips: [
				"Always check official adverse event databases",
				"Look for systematic reviews of safety data",
				"Consider both frequency and severity of side effects",
				"Consult healthcare providers for personalized risk assessment",
			],
			polishPreventionTips: [
				"Zawsze sprawdzaj oficjalne bazy danych zdarzeń niepożądanych",
				"Szukaj systematycznych przeglądów danych bezpieczeństwa",
				"Rozważ zarówno częstotliwość, jak i nasilenie skutków ubocznych",
				"Skonsultuj się z dostawcami opieki zdrowotnej w sprawie spersonalizowanej oceny ryzyka",
			],
		},
	},
];

const CognitiveBiasDetectorPage = () => {
	const handleScenarioComplete = (
		scenarioId: string,
		responses: any[],
		score: number,
	) => {
		console.log("Scenario completed:", { scenarioId, responses, score });
		// In real app, this would save progress to database
	};

	const handleBiasDetected = (biasType: string, severity: string) => {
		console.log("Bias detected:", { biasType, severity });
		// In real app, this would track bias patterns for user insights
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<CognitiveBiasDetector
				scenarios={mockScenarios}
				onScenarioComplete={handleScenarioComplete}
				onBiasDetected={handleBiasDetected}
			/>
		</div>
	);
};

export default CognitiveBiasDetectorPage;
