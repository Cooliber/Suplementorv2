/**
 * SAM-e Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * Methylation and Mood Support with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const samEProfile: SupplementWithRelations = {
	id: "sam-e",
	name: "SAM-e (S-Adenosylmethionine)",
	polishName: "SAM-e (S-Adenozylometionina)",
	scientificName: "S-Adenosyl-L-methionine",
	commonNames: ["S-Adenosyl-L-methionine", "AdoMet", "S-Adenosylmetionina"],
	polishCommonNames: ["S-Adenozylometionina", "AdoMet", "SAM-e"],
	category: "AMINO_ACID",
	description:
		"S-Adenosylmethionine (SAM-e) is a naturally occurring molecule that serves as a primary methyl donor in numerous biochemical reactions. It plays crucial roles in neurotransmitter synthesis, methylation processes, joint health, and liver function. SAM-e is particularly well-studied for its mood-enhancing properties and is used for depression, osteoarthritis, and liver support.",
	polishDescription:
		"S-Adenozylometionina (SAM-e) to naturalnie występująca cząsteczka, która pełni rolę głównego donora metylowego w licznych reakcjach biochemicznych. Odgrywa kluczowe role w syntezie neuroprzekaźników, procesach metylacji, zdrowiu stawów i funkcji wątroby. SAM-e jest szczególnie dobrze przebadana pod kątem właściwości wzmocniających nastrój i jest stosowana w depresji, chorobie zwyrodnieniowej stawów i wsparciu wątroby.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "S-Adenosylmethionine",
			polishName: "S-Adenozylometionina",
			concentration: "200mg",
			bioavailability: 5,
			halfLife: "1-2 hours",
			metabolicPathway: [
				"Methylation",
				"Neurotransmitter synthesis",
				"Antioxidant production",
			],
			targetReceptors: [
				"Methyltransferases",
				"Transsulfuration pathway",
				"Glutathione system",
			],
		},
		{
			name: "S-Adenosylmethionine disulfate tosylate",
			polishName: "Dwusiarczan tosylany S-adenozylometioniny",
			concentration: "400mg",
			bioavailability: 10,
			halfLife: "1-2 hours",
			metabolicPathway: ["Methylation", "Sulfur metabolism", "Detoxification"],
			targetReceptors: ["Methyltransferases", "Sulfur transferases"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Depression and mood disorders",
			polishCondition: "Depresja i zaburzenia nastroju",
			indication:
				"Treatment for depression, particularly in mild to moderate cases",
			polishIndication:
				"Leczenie depresji, szczególnie w przypadkach łagodnych do umiarkowanych",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "400-1600mg daily",
			duration: "4-8 weeks",
			effectSize: 0.55,
			studyCount: 6,
			participantCount: 500,
			recommendationGrade: "A",
		},
		{
			condition: "Osteoarthritis and joint pain",
			polishCondition: "Choroba zwyrodnieniowa stawów",
			indication: "Pain relief and cartilage support for osteoarthritis",
			polishIndication:
				"Ulga od bólu i wsparcie chrząstki w chorobie zwyrodnieniowej stawów",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "600-1200mg daily",
			duration: "4-12 weeks",
			effectSize: 0.4,
			studyCount: 7,
			participantCount: 600,
			recommendationGrade: "B",
		},
		{
			condition: "Liver disease support",
			polishCondition: "Wsparcie w chorobach wątroby",
			indication:
				"Support for liver function and protection against hepatotoxicity",
			polishIndication:
				"Wsparcie funkcji wątroby i ochrona przed hepatotoksycznością",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "800-1600mg daily",
			duration: "8-16 weeks",
			effectSize: 0.35,
			studyCount: 4,
			participantCount: 300,
			recommendationGrade: "B",
		},
		{
			condition: "Fibromyalgia",
			polishCondition: "Fibromialgia",
			indication: "Pain management and mood support for fibromyalgia patients",
			polishIndication:
				"Zarządzanie bólem i wsparcie nastroju u pacjentów z fibromialgią",
			efficacy: "low",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "800mg daily",
			duration: "8-12 weeks",
			effectSize: 0.25,
			studyCount: 2,
			participantCount: 100,
			recommendationGrade: "C",
		},
		{
			condition: "Cognitive function in elderly",
			polishCondition: "Funkcje poznawcze u osób starszych",
			indication: "Potential support for age-related cognitive decline",
			polishIndication: "Potencjalne wsparcie dla wiekowego spadku poznawczego",
			efficacy: "low",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "400mg daily",
			duration: "12-16 weeks",
			effectSize: 0.15,
			studyCount: 2,
			participantCount: 120,
			recommendationGrade: "C",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "methylation-neurotransmitter",
			name: "Methylation and neurotransmitter synthesis",
			polishName: "Metylacja i synteza neuroprzekaźników",
			pathway: "Methylation and neurotransmitter synthesis",
			polishPathway: "Methylation and neurotransmitter synthesis",
			description:
				"Provides methyl groups for synthesis of neurotransmitters including serotonin, dopamine, and norepinephrine. This is the primary mechanism for SAM-e's mood-enhancing properties.",
			polishDescription:
				"Dostarcza grupy metylowe do syntezy neuroprzekaźników w tym serotoniny, dopaminy i noradrenaliny. To jest główny mechanizm właściwości wzmocniających nastrój SAM-e.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Serotonin system",
				"Dopamine system",
				"Norepinephrine system",
			],
			timeToEffect: "1-2 weeks",
			duration: "Continuous methylation support",
		},
		{
			id: "homocysteine-metabolism",
			name: "Homocysteine metabolism",
			polishName: "Metabolizm homocysteiny",
			pathway: "Homocysteine metabolism",
			polishPathway: "Homocysteine metabolism",
			description:
				"Supports homocysteine metabolism, reducing cardiovascular risk and supporting brain health. SAM-e converts homocysteine to methionine through transmethylation.",
			polishDescription:
				"Wsparcie metabolizmu homocysteiny, redukcja ryzyka sercowo-naczyniowego i wspieranie zdrowia mózgu. SAM-e przekształca homocysteinę w metioninę poprzez transmetylację.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Cardiovascular system",
				"Brain health",
				"Methylation cycle",
			],
			timeToEffect: "2-4 weeks",
			duration: "Continuous metabolic support",
		},
		{
			id: "glutathione-synthesis",
			name: "Glutathione synthesis and antioxidant defense",
			polishName: "Synteza glutationu i obrona antyoksydacyjna",
			pathway: "Glutathione synthesis and antioxidant defense",
			polishPathway: "Glutathione synthesis and antioxidant defense",
			description:
				"Supports glutathione production, enhancing antioxidant capacity and reducing oxidative stress. SAM-e contributes to the synthesis of this important cellular antioxidant.",
			polishDescription:
				"Wsparcie produkcji glutationu, wzmacnianie pojemności antyoksydacyjnej i redukcja stresu oksydacyjnego. SAM-e przyczynia się do syntezy tego ważnego komórkowego antyoksydantu.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Antioxidant system",
				"Cellular protection",
				"Detoxification",
			],
			timeToEffect: "2-4 weeks",
			duration: "Continuous antioxidant support",
		},
		{
			id: "joint-liver-health",
			name: "Joint and liver health",
			polishName: "Zdrowie stawów i wątroby",
			pathway: "Joint and liver health",
			polishPathway: "Joint and liver health",
			description:
				"Supports cartilage repair and liver function through enhanced proteoglycan synthesis and hepatoprotective mechanisms. SAM-e promotes regeneration of joint tissues.",
			polishDescription:
				"Wsparcie naprawy chrząstki i funkcji wątroby poprzez wzmocnienie syntezy proteoglikanów i mechanizmy hepatoprotekcyjne. SAM-e promuje regenerację tkanek stawowych.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Joint function", "Cartilage repair", "Liver protection"],
			timeToEffect: "4-8 weeks",
			duration: "Continuous tissue support",
		},
		{
			id: "anti-inflammatory",
			name: "Anti-inflammatory effects",
			polishName: "Efekty przeciwzapalne",
			pathway: "Anti-inflammatory effects",
			polishPathway: "Anti-inflammatory effects",
			description:
				"Reduces inflammation through modulation of pro-inflammatory cytokines and gene expression. SAM-e affects inflammatory pathways at the molecular level.",
			polishDescription:
				"Redukuje zapalenie poprzez modulację prozapalnych cytokin i ekspresję genów. SAM-e wpływa na ścieżki zapalne na poziomie molekularnym.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Inflammatory system",
				"Cytokine regulation",
				"Gene expression",
			],
			timeToEffect: "2-4 weeks",
			duration: "Continuous anti-inflammatory action",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 400,
			max: 1600,
			unit: "mg",
		},
		timing: ["morning", "afternoon"],
		withFood: false,
		contraindications: ["Bipolar disorder", "Pregnancy", "Breastfeeding"],
		polishContraindications: [
			"Zaburzenie afektywne dwubiegunowe",
			"Ciąża",
			"Karmienie piersią",
		],
		interactions: [
			{
				substance: "Antidepressants (SSRIs, MAOIs)",
				polishSubstance: "Antydepresanty (SSRI, IZMO)",
				type: "synergistic",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Enhanced serotonergic effects",
				polishMechanism: "Wzmocnione efekty serotonergiczne",
				recommendation:
					"Monitor for excessive serotonergic effects and serotonin syndrome",
				polishRecommendation:
					"Monitoruj nadmierne efekty serotonergiczne i zespół serotoniny",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Gastrointestinal discomfort",
			polishEffect: "Niewygodę jelitową",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take on empty stomach, reduce dose if needed",
			polishManagement:
				"Przyjmuj na pusty żołądek, zmniejsz dawkę jeśli potrzeba",
		},
		{
			effect: "Insomnia",
			polishEffect: "Bezsenność",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Hours after consumption",
			management: "Avoid evening doses, take earlier in day",
			polishManagement:
				"Unikaj dawek wieczorowych, przyjmuj wcześniej w ciągu dnia",
		},
		{
			effect: "Anxiety",
			polishEffect: "Lęk",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "Days to weeks",
			management: "Reduce dose, monitor response",
			polishManagement: "Zmniejsz dawkę, monitoruj odpowiedź",
		},
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-2 hours",
			management: "Reduce dose, ensure adequate hydration",
			polishManagement: "Zmniejsz dawkę, zapewnij odpowiednie nawodnienie",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Antidepressants (SSRIs, MAOIs)",
			polishSubstance: "Antydepresanty (SSRI, IZMO)",
			type: "synergistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism:
				"Enhanced serotonergic effects with potential for serotonin syndrome",
			polishMechanism:
				"Wzmocnione efekty serotonergiczne z potencjałem zespołu serotoniny",
			recommendation:
				"Monitor for excessive serotonergic effects and serotonin syndrome",
			polishRecommendation:
				"Monitoruj nadmierne efekty serotonergiczne i zespół serotoniny",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Levodopa",
			polishSubstance: "Levodopa",
			type: "antagonistic",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism:
				"Reduced levodopa efficacy through competing amino acid transport",
			polishMechanism:
				"Zmniejszona skuteczność lewodopy poprzez konkurencję transportu aminokwasów",
			description: "May reduce levodopa efficacy",
			polishDescription: "Może zmniejszyć skuteczność lewodopy",
			recommendation: "Separate administration by at least 2 hours",
			polishRecommendation: "Oddzielone podanie o przynajmniej 2 godziny",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Pemoline",
			polishSubstance: "Pemolina",
			type: "antagonistic",
			clinicalSignificance: "High clinical significance - avoid combination",
			polishClinicalSignificance:
				"Wysokie znaczenie kliniczne - unikać kombinacji",
			severity: "severe",
			mechanism: "Risk of hepatotoxicity",
			polishMechanism: "Ryzyko hepatotoksyczności",
			description:
				"May increase risk of liver toxicity when combined with pemoline",
			polishDescription:
				"Może zwiększyć ryzyko toksyczności wątroby przy łączeniu z pemoliną",
			recommendation: "Avoid combination due to hepatotoxicity risk",
			polishRecommendation:
				"Unikaj połączenia ze względu na ryzyko hepatotoksyczności",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "sarris-2015",
			title:
				"S-Adenosyl methionine (SAMe) versus escitalopram and placebo in major depression: efficacy and effects of histamine and carnitine as moderators of response",
			polishTitle:
				"S-Adenozylometionina (SAM-e) versus escitalopram i placebo w głównym zaburzeniu depresyjnym: skuteczność i efekty histaminy i karnityny jako moderatorów odpowiedzi",
			authors: ["Sarris J", "Price LH", "Carpenter LL"],
			journal: "Journal of Affective Disorders",
			year: 2015,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Depression treatment",
			polishPrimaryOutcome: "Leczenie depresji",
			findings: "SAMe was as effective as escitalopram for major depression",
			polishFindings:
				"SAM-e była tak skuteczna jak escitalopram w głównym zaburzeniu depresyjnym",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "25497473",
			doi: "10.1016/j.jad.2014.11.016",
			sampleSize: 189,
			duration: "12 weeks",
			dosage: "800-1600mg daily",
			qualityScore: 8.0,
		},
		{
			id: "mischoulon-2002",
			title: "S-Adenosylmethionine in the treatment of depression",
			polishTitle: "S-Adenozylometionina w leczeniu depresji",
			authors: ["Mischoulon D", "Fava M"],
			journal: "Alternative Medicine Review",
			year: 2002,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Depression treatment",
			polishPrimaryOutcome: "Leczenie depresji",
			findings: "SAMe is effective for depression with rapid onset of action",
			polishFindings:
				"SAM-e jest skuteczna w leczeniu depresji z szybkim onsetem działania",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "12410619",
			sampleSize: 0,
			qualityScore: 7.5,
		},
		{
			id: "hardy-2003",
			title:
				"S-Adenosyl-L-methionine for treatment of depression, osteoarthritis, and liver disease",
			polishTitle:
				"S-Adenozyl-L-metionina do leczenia depresji, choroby zwyrodnieniowej stawów i choroby wątroby",
			authors: ["Hardy ML", "Coulter I", "Morton SC"],
			journal: "Evidence Report/Technology Assessment",
			year: 2003,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Multiple conditions",
			polishPrimaryOutcome: "Wiele warunków",
			findings:
				"SAMe is effective for depression, osteoarthritis, and liver disease",
			polishFindings:
				"SAM-e jest skuteczna w depresji, chorobie zwyrodnieniowej stawów i chorobie wątroby",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "12804252",
			sampleSize: 0,
			qualityScore: 7.0,
		},
		{
			id: "rutjes-2009",
			title: "S-Adenosylmethionine and osteoarthritis: a systematic review",
			polishTitle:
				"S-Adenozylometionina i choroba zwyrodnieniowa stawów: przegląd systematyczny",
			authors: ["Rutjes AW", "Nüesch E", "Reichenbach S"],
			journal: "Arthritis Care & Research",
			year: 2009,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Osteoarthritis treatment",
			polishPrimaryOutcome: "Leczenie choroby zwyrodnieniowej stawów",
			findings:
				"SAMe is as effective as NSAIDs for osteoarthritis with better tolerability",
			polishFindings:
				"SAM-e jest tak skuteczna jak niesteroidowe leki przeciwzapalne w chorobie zwyrodnieniowej stawów z lepszą tolerowalnością",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "19877004",
			doi: "10.1002/acr.20011",
			sampleSize: 0,
			qualityScore: 7.5,
		},
		{
			id: "anstee-2012",
			title: "S-Adenosylmethionine in liver health and disease",
			polishTitle: "S-Adenozylometionina w zdrowiu i chorobie wątroby",
			authors: ["Anstee QM", "Day CP"],
			journal: "Journal of Hepatology",
			year: 2012,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Liver function",
			polishPrimaryOutcome: "Funkcja wątroby",
			findings: "SAMe supports liver function and may benefit liver disease",
			polishFindings:
				"SAM-e wspiera funkcję wątroby i może korzystnie wpływać na chorobę wątroby",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "22245888",
			doi: "10.1016/j.jhep.2011.12.008",
			sampleSize: 0,
			qualityScore: 7.0,
		},
	],

	// Metadata
	tags: [
		"amino acid",
		"mood enhancement",
		"depression",
		"methylation",
		"osteoporosis",
		"liver support",
		"neurotransmitter",
		"antioxidant",
		"joint health",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default samEProfile;
