/**
 * Probiotics Supplement Profile
 * Comprehensive scientific data for gut health and microbiome support
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const probioticsProfile: SupplementWithRelations = {
	id: "probiotics",
	name: "Probiotics",
	polishName: "Probiotyki",
	scientificName: "Live microorganisms",
	commonNames: ["Probiotic bacteria", "Beneficial bacteria", "Microbiome support"],
	polishCommonNames: ["Bakterie probiotyczne", "Bakterie korzystne", "Wsparcie mikrobiomu"],
	category: "PROBIOTIC",
	description:
		"Probiotics are live microorganisms that, when administered in adequate amounts, confer health benefits to the host. They primarily support gut health, immune function, and may influence various physiological processes through the gut-brain axis.",
	polishDescription:
		"Probiotyki to żywe mikroorganizmy, które podane w odpowiednich ilościach, przynoszą korzyści zdrowotne gospodarzowi. Głównie wspierają zdrowie jelit, funkcję immunologiczną i mogą wpływać na różne procesy fizjologiczne poprzez oś jelitowo-mózgową.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Lactobacillus acidophilus",
			polishName: "Lactobacillus acidophilus",
			concentration: "10^9 CFU",
			bioavailability: 40,
			halfLife: "Transient colonization",
			metabolicPathway: ["Lactic acid production", "Gut barrier maintenance", "Immune modulation"],
			targetReceptors: ["Toll-like receptors", "Intestinal epithelial cells"],
		},
		{
			name: "Bifidobacterium longum",
			polishName: "Bifidobacterium longum",
			concentration: "10^9 CFU",
			bioavailability: 35,
			halfLife: "Transient colonization",
			metabolicPathway: ["Short-chain fatty acid production", "Gut-brain axis signaling"],
			targetReceptors: ["Vagal nerve receptors", "Enteric nervous system"],
		},
		{
			name: "Lactobacillus rhamnosus",
			polishName: "Lactobacillus rhamnosus",
			concentration: "10^9 CFU",
			bioavailability: 45,
			halfLife: "Transient colonization",
			metabolicPathway: ["Immune system modulation", "Pathogen inhibition"],
			targetReceptors: ["Immune cell receptors", "Mucin production"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Digestive health and IBS",
			polishCondition: "Zdrowie trawienne i IBS",
			indication: "Management of irritable bowel syndrome and digestive disorders",
			polishIndication: "Zarządzanie zespołem jelita drażliwego i zaburzeniami trawiennymi",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "10^9-10^10 CFU daily",
			duration: "4-8 weeks",
			effectSize: 0.4,
			studyCount: 40,
			participantCount: 4000,
			recommendationGrade: "B",
		},
		{
			condition: "Immune system support",
			polishCondition: "Wsparcie układu odpornościowego",
			indication: "Enhancement of immune function and infection prevention",
			polishIndication: "Wzmocnienie funkcji immunologicznej i zapobieganie infekcjom",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "10^9 CFU daily",
			duration: "Ongoing",
			effectSize: 0.3,
			studyCount: 35,
			participantCount: 5000,
			recommendationGrade: "B",
		},
		{
			condition: "Mental health and mood",
			polishCondition: "Zdrowie psychiczne i nastrój",
			indication: "Support for anxiety, depression, and stress management",
			polishIndication: "Wsparcie dla lęku, depresji i zarządzania stresem",
			efficacy: "low",
			effectivenessRating: 5,
			evidenceLevel: "WEAK",
			recommendedDose: "10^9-10^10 CFU daily",
			duration: "8-12 weeks",
			effectSize: 0.2,
			studyCount: 20,
			participantCount: 2000,
			recommendationGrade: "C",
		},
		{
			condition: "Antibiotic-associated diarrhea",
			polishCondition: "Biegunka związana z antybiotykami",
			indication: "Prevention and treatment of antibiotic-induced digestive issues",
			polishIndication: "Zapobieganie i leczenie problemów trawiennych wywołanych antybiotykami",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "10^9-10^10 CFU daily",
			duration: "During antibiotic treatment",
			effectSize: 0.6,
			studyCount: 30,
			participantCount: 3000,
			recommendationGrade: "A",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "gut-barrier-function",
			name: "Gut barrier maintenance and immune modulation",
			polishName: "Utrzymanie bariery jelitowej i modulacja odporności",
			pathway: "Intestinal barrier function",
			polishPathway: "Funkcja bariery jelitowej",
			description:
				"Probiotics enhance gut barrier function by increasing mucin production, tightening tight junctions, and modulating immune responses through interaction with gut-associated lymphoid tissue.",
			polishDescription:
				"Probiotyki wzmacniają funkcję bariery jelitowej poprzez zwiększenie produkcji mucyny, wzmacnianie połączeń ścisłych i modulację odpowiedzi immunologicznych poprzez interakcję z tkanką limfoidalną związaną z jelitami.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Intestinal epithelium",
				"Mucin production",
				"Tight junctions",
				"Immune modulation",
			],
			timeToEffect: "2-4 weeks",
			duration: "Continuous effect during supplementation",
		},
		{
			id: "microbiome-modulation",
			name: "Microbiome composition and diversity",
			polishName: "Skład i różnorodność mikrobiomu",
			pathway: "Microbial ecology",
			polishPathway: "Ekologia mikrobiologiczna",
			description:
				"Probiotics can modulate gut microbiome composition by competitive exclusion of pathogens, production of antimicrobial substances, and supporting beneficial microbial populations.",
			polishDescription:
				"Probiotyki mogą modulować skład mikrobiomu jelitowego poprzez konkurencyjne wykluczanie patogenów, produkcję substancji przeciwbakteryjnych i wspieranie korzystnych populacji mikrobiologicznych.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Microbial diversity",
				"Pathogen inhibition",
				"Short-chain fatty acid production",
				"Gut-brain axis",
			],
			timeToEffect: "4-8 weeks",
			duration: "Continuous effect during supplementation",
		},
		{
			id: "immune-system-support",
			name: "Immune system activation and regulation",
			polishName: "Aktywacja i regulacja układu odpornościowego",
			pathway: "Immune modulation",
			polishPathway: "Modulacja odporności",
			description:
				"Probiotics interact with immune cells through pattern recognition receptors, modulating cytokine production and supporting both innate and adaptive immune responses.",
			polishDescription:
				"Probiotyki interagują z komórkami immunologicznymi poprzez receptory rozpoznawania wzorców, modulując produkcję cytokin i wspierając zarówno wrodzone, jak i adaptacyjne odpowiedzi immunologiczne.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Innate immunity",
				"Adaptive immunity",
				"Cytokine balance",
				"Inflammatory response",
			],
			timeToEffect: "1-2 weeks",
			duration: "Continuous effect during supplementation",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 1000000000,
			max: 100000000000,
			unit: "CFU",
		},
		timing: ["with_meal"],
		withFood: true,
		contraindications: ["Immunocompromised state", "Critical illness", "Central venous catheters"],
		polishContraindications: ["Stan immunosupresji", "Choroba krytyczna", "Cewniki centralne"],
		interactions: [
			{
				substance: "Antibiotics",
				polishSubstance: "Antybiotyki",
				type: "antagonistic",
				severity: "moderate",
				description: "Antibiotics may kill probiotic bacteria",
				polishDescription: "Antybiotyki mogą zabijać bakterie probiotyczne",
				clinicalSignificance: "Reduced probiotic effectiveness",
				polishClinicalSignificance: "Zmniejszona skuteczność probiotyków",
				mechanism: "Direct antimicrobial action against bacteria",
				polishMechanism: "Bezpośrednie działanie przeciwbakteryjne przeciwko bakteriom",
				recommendation: "Take probiotics 2-3 hours apart from antibiotics",
				polishRecommendation: "Przyjmuj probiotyki 2-3 godziny po antybiotykach",
				evidenceLevel: "STRONG",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Mild gastrointestinal discomfort",
			polishEffect: "Łagodny dyskomfort żołądkowo-jelitowy",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-3 days",
			management: "Start with lower dose, gradual increase",
			polishManagement: "Zacznij od niższej dawki, stopniowe zwiększanie",
		},
		{
			effect: "Gas and bloating",
			polishEffect: "Gazy i wzdęcia",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-7 days",
			management: "Reduce dose, take with food",
			polishManagement: "Zmniejsz dawkę, przyjmuj z jedzeniem",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Prebiotics",
			polishSubstance: "Prebiotyki",
			type: "synergistic",
			severity: "beneficial",
			description: "Prebiotics support probiotic growth and activity",
			polishDescription: "Prebiotyki wspierają wzrost i aktywność probiotyków",
			clinicalSignificance: "Enhanced probiotic effectiveness",
			polishClinicalSignificance: "Wzmocniona skuteczność probiotyków",
			mechanism: "Substrate provision for probiotic metabolism",
			polishMechanism: "Dostarczanie substratów dla metabolizmu probiotyków",
			recommendation: "Often beneficial in synbiotic combinations",
			polishRecommendation: "Często korzystne w kombinacjach synbiotycznych",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Immunosuppressants",
			polishSubstance: "Leki immunosupresyjne",
			type: "antagonistic",
			severity: "moderate",
			description: "Immunosuppressants may reduce probiotic effectiveness",
			polishDescription: "Leki immunosupresyjne mogą zmniejszać skuteczność probiotyków",
			clinicalSignificance: "Potential infection risk in immunocompromised",
			polishClinicalSignificance: "Potencjalne ryzyko infekcji u osób z immunosupresją",
			mechanism: "Suppressed immune response to probiotic colonization",
			polishMechanism: "Stłumiona odpowiedź immunologiczna na kolonizację probiotyków",
			recommendation: "Use caution in immunocompromised individuals",
			polishRecommendation: "Ostrożność u osób z immunosupresją",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "ford-2014",
			title: "Efficacy of probiotics in irritable bowel syndrome: systematic review and meta-analysis",
			polishTitle: "Skuteczność probiotyków w zespole jelita drażliwego: przegląd systematyczny i meta-analiza",
			authors: ["Ford AC", "Quigley EM", "Lacy BE"],
			journal: "American Journal of Gastroenterology",
			year: 2014,
			studyType: "META_ANALYSIS",
			primaryOutcome: "IBS symptom improvement",
			polishPrimaryOutcome: "Poprawa objawów IBS",
			findings: "Probiotics significantly improve IBS symptoms",
			polishFindings: "Probiotyki znacząco poprawiają objawy IBS",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "25070051",
			doi: "10.1038/ajg.2014.202",
			sampleSize: 0,
			qualityScore: 9.0,
		},
		{
			id: "ritchie-2012",
			title: "The gut-brain axis and the microbiome: mechanisms and clinical implications",
			polishTitle: "Oś jelitowo-mózgowa i mikrobiom: mechanizmy i implikacje kliniczne",
			authors: ["Ritchie ML", "Romanuk TN"],
			journal: "Critical Care Medicine",
			year: 2012,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Gut-brain axis mechanisms",
			polishPrimaryOutcome: "Mechanizmy osi jelitowo-mózgowej",
			findings: "Microbiome influences brain function through multiple pathways",
			polishFindings: "Mikrobiom wpływa na funkcję mózgu poprzez wiele ścieżek",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "22301518",
			doi: "10.1097/CCM.0b013e318237e8d1",
			sampleSize: 0,
			qualityScore: 8.5,
		},
	],

	// Metadata
	tags: [
		"probiotics",
		"gut health",
		"microbiome",
		"immune support",
		"digestive health",
		"gut-brain axis",
		"beneficial bacteria",
		"IBS",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default probioticsProfile;