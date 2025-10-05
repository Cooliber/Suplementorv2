/**
 * Bacopa Monnieri Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * Ayurvedic Cognitive Enhancer with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const bacopaProfile: SupplementWithRelations = {
	id: "bacopa",
	name: "Bacopa Monnieri",
	polishName: "Bacopa Monnieri",
	scientificName: "Bacopa monnieri",
	commonNames: ["Brahmi", "Water Hyssop", "Herb of Grace", "Herb of Grace"],
	polishCommonNames: ["Brahmi", "Wodna Hyssopa", "Zioło Łaski", "Bacopa"],
	category: "HERB",
	description:
		"Bacopa Monnieri, known as Brahmi in Ayurvedic medicine, is a traditional herb renowned for its cognitive-enhancing properties. Rich in bacosides, it improves memory, learning, and concentration while providing neuroprotective benefits and reducing anxiety.",
	polishDescription:
		"Bacopa Monnieri, znana jako Brahmi w medycynie ajurwedyjskiej, to tradycyjne zioło cenione za jej właściwości wzmacniające poznawcze. Bogata w bakosydy, poprawia pamięć, uczenie się i koncentrację, zapewniając jednocześnie właściwości neuroprotektorskie i redukując lęk.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Bacosides A and B",
			polishName: "Bakosydy A i B",
			concentration: "55% bacosides",
			bioavailability: 40,
			halfLife: "4-6 hours",
			metabolicPathway: ["Cholinergic system", "Neuroprotection"],
			targetReceptors: ["Acetylcholine receptors", "BDNF receptors"],
		},
		{
			name: "Bacopasaponins",
			polishName: "Bakopasaponiny",
			concentration: "20-25%",
			bioavailability: 35,
			halfLife: "6-8 hours",
			metabolicPathway: ["Antioxidant pathways", "Neuroinflammation"],
			targetReceptors: [],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Cognitive enhancement and memory improvement",
			polishCondition: "Poprawa funkcji poznawczych i pamięci",
			indication:
				"Support for memory formation, learning, and cognitive performance",
			polishIndication:
				"Wsparcie dla tworzenia pamięci, uczenia się i wydajności poznawczej",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "300-450mg standardized extract daily",
			duration: "8-12 weeks",
			effectSize: 0.6,
			studyCount: 12,
			participantCount: 800,
			recommendationGrade: "A",
		},
		{
			condition: "Age-related cognitive decline",
			polishCondition: "Spadek funkcji poznawczych związanych z wiekiem",
			indication:
				"Support for age-related memory and cognitive function decline",
			polishIndication:
				"Wsparcie dla wiekowego spadku pamięci i funkcji poznawczych",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "300mg daily for 3-6 months",
			duration: "3-6 months",
			effectSize: 0.4,
			studyCount: 6,
			participantCount: 450,
			recommendationGrade: "B",
		},
		{
			condition: "ADHD and attention disorders",
			polishCondition: "ADHD i zaburzenia uwagi",
			indication:
				"Support for attention, focus, and concentration in children and adults",
			polishIndication:
				"Wsparcie dla uwagi, koncentracji i skupienia u dzieci i dorosłych",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "300mg daily",
			duration: "12-16 weeks",
			effectSize: 0.35,
			studyCount: 4,
			participantCount: 250,
			recommendationGrade: "C",
		},
		{
			condition: "Anxiety and stress reduction",
			polishCondition: "Lęk i redukcja stresu",
			indication: "Anxiolytic effects and stress management",
			polishIndication: "Efekty przeciwlękowe i zarządzanie stresem",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "300-450mg daily",
			duration: "4-8 weeks",
			effectSize: 0.3,
			studyCount: 8,
			participantCount: 500,
			recommendationGrade: "B",
		},
		{
			condition: "Depression support",
			polishCondition: "Wsparcie w depresji",
			indication: "Mood support and mild mood enhancement",
			polishIndication: "Wsparcie nastroju i łagodne wzmocnienie nastroju",
			efficacy: "low",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "300mg daily",
			duration: "8-12 weeks",
			effectSize: 0.2,
			studyCount: 3,
			participantCount: 150,
			recommendationGrade: "D",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "cholinergic-enhancement",
			name: "Cholinergic system enhancement",
			polishName: "Wzmocnienie systemu cholinergicznego",
			pathway: "Cholinergic system enhancement",
			polishPathway: "Cholinergic system enhancement",
			description:
				"Increases acetylcholine levels and improves cholinergic transmission in the brain. This enhances cognitive function, particularly memory and learning.",
			polishDescription:
				"Zwiększa poziomy acetylocholiny i poprawia transmisję cholinergiczną w mózgu. Wzmacnia funkcję poznawczą, szczególnie pamięć i uczenie się.",
			evidenceLevel: "STRONG",
			targetSystems: ["Cholinergic system", "Memory formation", "Learning"],
			timeToEffect: "4-6 weeks",
			duration: "Chronic supplementation required",
		},
		{
			id: "bdnf-upregulation",
			name: "BDNF upregulation and neuroprotection",
			polishName: "Wzmocnienie BDNF i neuroprotekcja",
			pathway: "BDNF upregulation and neuroprotection",
			polishPathway: "BDNF upregulation and neuroprotection",
			description:
				"Stimulates brain-derived neurotrophic factor (BDNF) expression, promoting neurogenesis and synaptic plasticity. This provides long-term neuroprotective benefits.",
			polishDescription:
				"Stymuluje ekspresję czynnika neurotroficznego pochodnego z mózgu (BDNF), promując neurogenezę i plastyczność synaptyczną. Zapewnia to długoterminowe korzyści neuroprotektorskie.",
			evidenceLevel: "STRONG",
			targetSystems: ["Neurotrophins", "Neurogenesis", "Synaptic plasticity"],
			timeToEffect: "6-8 weeks",
			duration: "Long-term benefits",
		},
		{
			id: "antioxidant-effects",
			name: "Antioxidant and anti-inflammatory effects",
			polishName: "Efekty antyoksydacyjne i przeciwzapalne",
			pathway: "Antioxidant and anti-inflammatory effects",
			polishPathway: "Antioxidant and anti-inflammatory effects",
			description:
				"Reduces oxidative stress and neuroinflammation through modulation of antioxidant enzymes and cytokine production. Protects neurons from damage.",
			polishDescription:
				"Redukuje stres oksydacyjny i neurozapalenie poprzez modulację enzymów antyoksydacyjnych i produkcji cytokin. Chroni neurony przed uszkodzeniami.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Antioxidant system",
				"Neuroinflammation",
				"Neuroprotection",
			],
			timeToEffect: "2-4 weeks",
			duration: "Continuous protection",
		},
		{
			id: "amyloid-reduction",
			name: "Amyloid-beta reduction",
			polishName: "Redukcja amyloidu-beta",
			pathway: "Amyloid-beta reduction",
			polishPathway: "Amyloid-beta reduction",
			description:
				"Reduces amyloid-beta accumulation and tau protein phosphorylation, potentially protective against neurodegeneration. May have disease-modifying effects.",
			polishDescription:
				"Redukuje akumulację amyloidu-beta i fosforylację białka tau, potencjalnie chroniąc przed neurodegeneracją. Może mieć efekty modyfikujące chorobę.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Amyloid clearance",
				"Tau pathology",
				"Neurodegeneration",
			],
			timeToEffect: "Months to years",
			duration: "Long-term neuroprotection",
		},
		{
			id: "serotonin-gaba-modulation",
			name: "Serotonin and GABA modulation",
			polishName: "Modulacja serotoniny i GABA",
			pathway: "Serotonin and GABA modulation",
			polishPathway: "Serotonin and GABA modulation",
			description:
				"Influences serotonin and GABA systems, contributing to anxiolytic and mood-stabilizing effects. Provides calming effects.",
			polishDescription:
				"Wpływa na systemy serotoniny i GABA, przyczyniając się do efektów przeciwlękowych i stabilizujących nastrój. Zapewnia efekty uspokajające.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Serotonin system", "GABA system", "Anxiety pathways"],
			timeToEffect: "2-4 weeks",
			duration: "Continuous effect",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 300,
			max: 450,
			unit: "mg",
		},
		timing: ["morning", "afternoon"],
		withFood: true,
		contraindications: ["Pregnancy", "Breastfeeding", "Thyroid disorders"],
		polishContraindications: [
			"Ciąża",
			"Karmienie piersią",
			"Zaburzenia tarczycy",
		],
		interactions: [
			{
				substance: "Thyroid medications",
				polishSubstance: "Leki na tarczycę",
				type: "antagonistic",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Interference with hormone absorption",
				polishMechanism: "Interferencja z wchłanianiem hormonów",
				recommendation:
					"Separate administration by 4 hours, monitor thyroid levels",
				polishRecommendation:
					"Oddzielne podanie o 4 godziny, monitoruj poziomy tarczycy",
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
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę",
		},
		{
			effect: "Dry mouth",
			polishEffect: "Suchość w ustach",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "1-2 hours",
			management: "Increase fluid intake",
			polishManagement: "Zwiększ spożycie płynów",
		},
		{
			effect: "Fatigue",
			polishEffect: "Zmęczenie",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "2-4 hours",
			management: "Reduce dose, take earlier in day",
			polishManagement: "Zmniejsz dawkę, przyjmuj wcześniej w ciągu dnia",
		},
		{
			effect: "Nausea",
			polishEffect: "Nudności",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, reduce dose",
			polishManagement: "Przyjmuj z jedzeniem, zmniejsz dawkę",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Thyroid medications",
			polishSubstance: "Leki na tarczycę",
			type: "antagonistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Interference with hormone absorption and metabolism",
			polishMechanism: "Interferencja z wchłanianiem i metabolizmem hormonów",
			recommendation:
				"Separate administration by 4 hours, monitor thyroid levels",
			polishRecommendation:
				"Oddzielne podanie o 4 godziny, monitoruj poziomy tarczycy",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Sedatives and anti-anxiety medications",
			polishSubstance: "Środki uspokajające i leki przeciwlękowe",
			type: "synergistic",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism: "Enhanced sedative and anxiolytic effects",
			polishMechanism: "Wzmocnione efekty uspokajające i przeciwlękowe",
			description: "May enhance effects of sedating medications",
			polishDescription: "Może wzmocnić efekty leków uspokajających",
			recommendation: "Monitor for excessive sedation when combining",
			polishRecommendation: "Monitoruj nadmierne uspokojenie przy łączeniu",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "calabrese-2008",
			title:
				"Effects of a standardized Bacopa monnieri extract on cognitive performance, anxiety, and depression in the elderly: a randomized, double-blind, placebo-controlled trial",
			polishTitle:
				"Efekty standaryzowanego ekstraktu Bacopa monnieri na wydajność poznawczą, lęk i depresję u osób starszych: badanie randomizowane, podwójnie ślepe, kontrolowane placebo",
			authors: ["Calabrese C", "Gregory WL", "Leo M"],
			journal: "Journal of Alternative and Complementary Medicine",
			year: 2008,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Cognitive function and mood",
			polishPrimaryOutcome: "Funkcja poznawcza i nastrój",
			findings:
				"Bacopa significantly improved memory acquisition and retention compared to placebo",
			polishFindings:
				"Bacopa znacząco poprawiła nabywanie i zachowanie pamięci w porównaniu do placebo",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "18611150",
			doi: "10.1089/acm.2007.7202",
			sampleSize: 54,
			duration: "12 weeks",
			dosage: "300mg daily",
			qualityScore: 8.5,
		},
		{
			id: "roodenrys-2002",
			title: "Chronic effects of Brahmi (Bacopa monnieri) on human memory",
			polishTitle:
				"Długoterminowe efekty Brahmi (Bacopa monnieri) na ludzką pamięć",
			authors: ["Roodenrys S", "Booth D", "Bulzomi S"],
			journal: "Neuropsychopharmacology",
			year: 2002,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Memory performance",
			polishPrimaryOutcome: "Wydajność pamięciowa",
			findings:
				"Significant improvement in memory consolidation and verbal learning",
			polishFindings:
				"Znacząca poprawa w konsolidacji pamięci i nauce werbalnej",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "12093601",
			doi: "10.1038/sj.npp.1300037",
			sampleSize: 46,
			duration: "12 weeks",
			dosage: "300mg daily",
			qualityScore: 8.0,
		},
		{
			id: "shin-2018",
			title:
				"Bacopa monnieri as an antioxidant therapy to reduce oxidative stress in the aging brain",
			polishTitle:
				"Bacopa monnieri jako terapia antyoksydacyjna do redukcji stresu oksydacyjnego w starzejącym się mózgu",
			authors: ["Shin J", "Appaix F", "Kim SH"],
			journal: "Evidence-Based Complementary and Alternative Medicine",
			year: 2018,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Antioxidant effects",
			polishPrimaryOutcome: "Efekty antyoksydacyjne",
			findings:
				"Bacopa demonstrates significant antioxidant and neuroprotective effects",
			polishFindings:
				"Bacopa wykazuje znaczące efekty antyoksydacyjne i neuroprotektorskie",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "29552033",
			doi: "10.1155/2018/6437908",
			sampleSize: 0,
			qualityScore: 7.5,
		},
		{
			id: "benson-2014",
			title:
				"An acute, double-blind, placebo-controlled cross-over study of 320 mg and 640 mg doses of Bacopa monnieri (CDRI 08) on multitasking stress reactivity and mood",
			polishTitle:
				"Ostre, podwójnie ślepe, kontrolowane placebo badanie krzyżowe dawek 320 mg i 640 mg Bacopa monnieri (CDRI 08) na reaktywność stresową przy wielozadaniowości i nastrój",
			authors: ["Benson S", "Barnett A", "Heine J"],
			journal: "Phytotherapy Research",
			year: 2014,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Stress reactivity and mood",
			polishPrimaryOutcome: "Reaktywność na stres i nastrój",
			findings: "Bacopa reduces cortisol response to stress and improves mood",
			polishFindings:
				"Bacopa zmniejsza odpowiedź kortyzolową na stres i poprawia nastrój",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "23788517",
			doi: "10.1002/ptr.5156",
			sampleSize: 17,
			duration: "Acute study",
			dosage: "320mg and 640mg",
			qualityScore: 7.0,
		},
		{
			id: "russo-2005",
			title: "Bacopa monnieri, a reputed nootropic plant: an overview",
			polishTitle: "Bacopa monnieri, podejrzewane zioło nootropowe: przegląd",
			authors: ["Russo A", "Borrelli F"],
			journal: "Phytomedicine",
			year: 2005,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Nootropic effects",
			polishPrimaryOutcome: "Efekty nootropowe",
			findings:
				"Bacopa has significant nootropic and neuroprotective properties",
			polishFindings:
				"Bacopa ma znaczące właściwości nootropowe i neuroprotektorskie",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "16008095",
			doi: "10.1016/j.phymed.2004.12.006",
			sampleSize: 0,
			qualityScore: 7.0,
		},
	],

	// Metadata
	tags: [
		"herb",
		"cognitive enhancement",
		"memory",
		"anxiety reduction",
		"neuroprotection",
		"ayurvedic",
		"cholinergic",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export const bacopa = bacopaProfile;
export default bacopaProfile;
