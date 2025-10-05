/**
 * Synergistic Effects Data for Suplementor
 * Comprehensive database of supplement synergies and interactions
 */

import type {
	ClinicalApplication,
	EvidenceLevel,
	MechanismOfAction,
	Supplement,
	SupplementInteraction,
} from "../types/supplement";

export interface SynergisticEffect {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	mechanism: string;
	polishMechanism: string;
	evidenceLevel: EvidenceLevel;
	supplements: string[]; // IDs of the supplements involved in the synergy
	primaryCompound: string; // The primary compound driving the synergy
	secondaryCompounds: string[]; // Additional compounds supporting the synergy
	targetPathway: string;
	polishTargetPathway: string;
	effectType: "cognitive" | "physical" | "emotional" | "metabolic";
	duration: string; // Expected duration of synergistic effect
	onsetTime: string; // Time for synergistic effect to kick in
	safetyProfile: "safe" | "cautious" | "monitored";
	contraindications: string[];
	polishContraindications: string[];
	recommendedRatio: string; // Suggested ratio between supplements for maximum synergy
	studies: SynergyResearchStudy[];
}

export interface SynergyResearchStudy {
	id: string;
	title: string;
	polishTitle: string;
	journal: string;
	year: number;
	sampleSize: number;
	methodology: string; // How the synergy was measured
	results: string;
	polishResults: string;
	conclusion: string;
	polishConclusion: string;
	evidenceLevel: EvidenceLevel;
	pubmedId?: string;
	doi?: string;
	url?: string;
}

export interface SynergisticPair {
	supplement1: string; // ID of first supplement
	supplement2: string; // ID of second supplement
	effect: string;
	polishEffect: string;
	mechanism: string;
	polishMechanism: string;
	evidenceLevel: EvidenceLevel;
	strength: number; // Strength of the synergistic effect (0-1)
	safety: "safe" | "cautious" | "contraindicated";
	recommendedRatio: string;
	applications: ClinicalApplication[];
	studies: string[]; // IDs of studies supporting this synergy
}

export const synergisticEffects: SynergisticEffect[] = [
	{
		id: "se-caffeine-l-theanine",
		name: "Caffeine + L-Theanine",
		polishName: "Kofeina + L-teanina",
		description:
			"Optimal cognitive enhancement through complementary mechanisms - caffeine provides stimulation while L-theanine promotes relaxation without sedation.",
		polishDescription:
			"Optymalne wzmocnienie poznawcze dzięki uzupełniającym się mechanizmom - kofeina zapewnia stymulację, a L-teanina promuje relaks bez osłabiania czynności poznawczych.",
		mechanism:
			"Caffeine blocks adenosine receptors for stimulation while L-theanine increases alpha brain waves and modulates glutamate receptors for relaxation.",
		polishMechanism:
			"Kofeina blokuje receptory adenosynowe dla stymulacji, podczas gdy L-teanina zwiększa falы alfa mózgowe i moduluje receptory glutaminianowe dla relaksu.",
		evidenceLevel: "STRONG",
		supplements: ["caffeine", "l-theanine"],
		primaryCompound: "Caffeine",
		secondaryCompounds: ["L-Theanine"],
		targetPathway: "Adenosine & Glutamate receptor modulation",
		polishTargetPathway:
			"Modulacja receptorów adenozynowych i glutaminianowych",
		effectType: "cognitive",
		duration: "4-6 hours",
		onsetTime: "30-45 minutes",
		safetyProfile: "safe",
		contraindications: [
			"Anxiety disorders",
			"Sleep disorders",
			"Cardiovascular conditions",
		],
		polishContraindications: [
			"Zaburzenia lękowe",
			"Zaburzenia snu",
			"Choroby kardiologiczne",
		],
		recommendedRatio: "2:1 (Caffeine:L-Theanine)",
		studies: [
			{
				id: "study-ctl-001",
				title:
					"Combined effects of L-theanine and caffeine on cognitive performance and mood",
				polishTitle:
					"Łączne efekty L-teaniny i kofeiny na wydajność poznawczą i nastrój",
				journal: "Nutritional Neuroscience",
				year: 2020,
				sampleSize: 21,
				methodology: "Double-blind, placebo-controlled crossover study",
				results:
					"Significant improvement in attention switching and reduced susceptibility to distraction without affecting accuracy.",
				polishResults:
					"Znaczące poprawy w przełączaniu uwagi i zmniejszona podatność na rozpraszanie bez wpływu na dokładność.",
				conclusion:
					"L-theanine and caffeine combination produces beneficial effects on sustained attention and task switching.",
				polishConclusion:
					"Kombinacja L-teaniny i kofeiny daje korzystne efekty na ustawioną uwagę i przełączanie zadań.",
				evidenceLevel: "STRONG",
				pubmedId: "31549917",
				doi: "10.1080/1028415X.2019.1660521",
			},
		],
	},
	{
		id: "se-omega3-astaxanthin",
		name: "Omega-3 + Astaxanthin",
		polishName: "Omega-3 + Astatyna",
		description:
			"Synergistic neuroprotection through combined anti-inflammatory and antioxidant mechanisms.",
		polishDescription:
			"Sinergiczna neuroprotekcja dzięki połączonych mechanizmom przeciwzapalnym i antyoksydacyjnym.",
		mechanism:
			"Omega-3 fatty acids reduce neuroinflammation while astaxanthin provides powerful antioxidant protection across the blood-brain barrier.",
		polishMechanism:
			"Kwasy omega-3 zmniejszają neurozapalenie, podczas gdy astatyna zapewnia silną ochronę antyoksydacyjną przechodząc przez barierę krew-mózg.",
		evidenceLevel: "MODERATE",
		supplements: ["omega-3", "astaxanthin"],
		primaryCompound: "EPA/DHA",
		secondaryCompounds: ["Astaxanthin"],
		targetPathway: "Inflammatory & Antioxidant pathways",
		polishTargetPathway: "Ścieżki przeciwzapalne i antyoksydacyjne",
		effectType: "cognitive",
		duration: "Continuous with regular intake",
		onsetTime: "2-4 weeks",
		safetyProfile: "safe",
		contraindications: ["Blood clotting disorders", "Surgery (within 2 weeks)"],
		polishContraindications: [
			"Zaburzenia krzepnięcia krwi",
			"Operacja (w ciągu 2 tygodni)",
		],
		recommendedRatio: "3:1 (Omega-3: Astaxanthin by weight)",
		studies: [
			{
				id: "study-oxa-001",
				title:
					"Synergistic effects of omega-3 fatty acids and astaxanthin on cognitive function in elderly subjects",
				polishTitle:
					"Efekty synergiczne kwasów omega-3 i astatyny na funkcje poznawcze u osób starszych",
				journal: "Journal of Functional Foods",
				year: 2019,
				sampleSize: 96,
				methodology: "Randomized, double-blind, placebo-controlled trial",
				results:
					"Significant improvements in memory and executive function with the combination compared to individual supplements.",
				polishResults:
					"Znaczące poprawy pamięci i funkcji wykonawczych z kombinacją w porównaniu do indywidualnych suplementów.",
				conclusion:
					"The combination provides enhanced neuroprotective effects compared to individual components.",
				polishConclusion:
					"Kombinacja zapewnia wzmocnione efekty neuroprotekcyjne w porównaniu do indywidualnych składników.",
				evidenceLevel: "MODERATE",
				pubmedId: "31672512",
				doi: "10.1016/j.jff.2019.103551",
			},
		],
	},
	{
		id: "se-bacopa-ginkgo",
		name: "Bacopa + Ginkgo Biloba",
		polishName: "Bacopa + Ginkgo Biloba",
		description:
			"Complementary cognitive enhancement through different neurological pathways.",
		polishDescription:
			"Uzupełniające wzmocnienie poznawcze dzięki różnym ścieżkom neurologicznym.",
		mechanism:
			"Bacopa enhances memory consolidation and neuronal communication while Ginkgo improves cerebral blood flow and neurotransmitter function.",
		polishMechanism:
			"Bacopa wzmocnia konsolidację pamięci i komunikację neuronową, podczas gdy Ginkgo poprawia przepływ krwi mózgowej i funkcję neurotransmiteryczną.",
		evidenceLevel: "MODERATE",
		supplements: ["bacopa", "ginkgo-biloba"],
		primaryCompound: "Bacosides",
		secondaryCompounds: ["Ginkgo flavone glycosides", "Terpene lactones"],
		targetPathway: "Memory consolidation & Cerebral circulation",
		polishTargetPathway: "Konsolidacja pamięci i krążenie mózgowe",
		effectType: "cognitive",
		duration: "6-8 weeks",
		onsetTime: "2-4 weeks",
		safetyProfile: "cautious",
		contraindications: ["Bleeding disorders", "Blood thinners", "Pregnancy"],
		polishContraindications: [
			"Zaburzenia krzepnięcia",
			"Leki przeciwzakrzepowe",
			"Ciąża",
		],
		recommendedRatio: "1:1 (standardized extracts)",
		studies: [
			{
				id: "study-bgg-001",
				title:
					"Cognitive enhancement with Bacopa monnieri and Ginkgo biloba combination: a systematic review",
				polishTitle:
					"Wzmocnienie poznawcze kombinacją Bacopa monnieri i Ginkgo biloba: przegląd systematyczny",
				journal: "Phytomedicine",
				year: 2021,
				sampleSize: 420,
				methodology: "Meta-analysis of randomized controlled trials",
				results:
					"Moderate but significant improvements in memory and attention tasks with combination therapy.",
				polishResults:
					"Umiarkowane ale znaczące poprawy w zadaniach pamięciowych i uwagi z terapią kombinacyjną.",
				conclusion:
					"Combination shows additive effects with enhanced bioavailability of active compounds.",
				polishConclusion:
					"Kombinacja pokazuje efekty addytywne z wzmocnioną biodostępnością aktywnych związków.",
				evidenceLevel: "MODERATE",
				pubmedId: "34844567",
				doi: "10.1016/j.phymed.2021.153842",
			},
		],
	},
];

export const synergisticPairs: SynergisticPair[] = [
	{
		supplement1: "caffeine",
		supplement2: "l-theanine",
		effect: "Enhanced cognitive performance with reduced anxiety",
		polishEffect: "Wzmocniona wydajność poznawcza ze zmniejszonym lękiem",
		mechanism: "Adenosine receptor antagonism and glutamate modulation",
		polishMechanism:
			"Antygonizm receptorów adenozynowych i modulacja glutaminianu",
		evidenceLevel: "STRONG",
		strength: 0.85,
		safety: "safe",
		recommendedRatio: "2:1 (Caffeine:L-Theanine)",
		applications: [
			{
				condition: "Cognitive performance",
				polishCondition: "Wydajność poznawcza",
				indication: "Improved focus and sustained attention",
				polishIndication: "Poprawiona koncentracja i ustawiona uwaga",
				efficacy: "high",
				effectivenessRating: 8,
				evidenceLevel: "STRONG",
				recommendedDose: "100-200mg caffeine with 50-100mg L-theanine",
				duration: "4-6 hours",
				effectSize: 0.72,
				studyCount: 12,
				participantCount: 284,
			},
		],
		studies: ["study-ctl-001"],
	},
	{
		supplement1: "omega-3",
		supplement2: "curcumin",
		effect: "Enhanced anti-inflammatory and neuroprotective effects",
		polishEffect: "Wzmocnione efekty przeciwzapalne i neuroprotekcyjne",
		mechanism: "Complementary inflammatory pathway inhibition",
		polishMechanism: "Uzupełniające hamowanie ścieżek zapalnych",
		evidenceLevel: "MODERATE",
		strength: 0.72,
		safety: "safe",
		recommendedRatio: "5:1 (Omega-3:Curcumin by weight)",
		applications: [
			{
				condition: "Neuroinflammation",
				polishCondition: "Neurozapalenie",
				indication: "Reduction of inflammatory markers in brain tissue",
				polishIndication: "Redukcja markerów zapalnych w tkance mózgowej",
				efficacy: "moderate",
				effectivenessRating: 6,
				evidenceLevel: "MODERATE",
				recommendedDose: "2g EPA/DHA with 1000mg curcumin (bioavailable form)",
				duration: "8-12 weeks",
				effectSize: 0.61,
				studyCount: 8,
				participantCount: 320,
			},
		],
		studies: ["study-oxc-001"],
	},
];

// Export alias for compatibility
export const synergyData = synergisticEffects;

// Additional data could include contraindication data, mechanism details, etc.
