/**
 * Ginkgo Biloba Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * Ancient Brain Herb with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const ginkgoBilobaProfile: SupplementWithRelations = {
	id: "ginkgo-biloba",
	name: "Ginkgo Biloba",
	polishName: "Miłorząb dwuklapowy",
	scientificName: "Ginkgo biloba",
	commonNames: ["Ginkgo", "Maidenhair Tree", "Ginkgo Leaf Extract"],
	polishCommonNames: [
		"Miłorząb",
		"Drzewo Jaworzynowe",
		"Ekstrakt z Liści Miłorzębu",
	],
	category: "HERB",
	description:
		"Ginkgo Biloba is one of the oldest living tree species and a widely studied herb for cognitive and circulatory health. Rich in flavonoids and terpene lactones, it supports brain function, memory, and peripheral circulation while providing potent antioxidant protection.",
	polishDescription:
		"Miłorząb dwuklapowy to jedna z najstarszych żyjących gatunków drzew i szeroko badane zioło dla zdrowia poznawczego i krążenia. Bogaty w flawonoidy i laktony terpenowe, wspiera funkcję mózgu, pamięć i krążenie obwodowe, zapewniając jednocześnie silną ochronę antyoksydacyjną.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Flavonoid glycosides",
			polishName: "Glikozydy flawonoidowe",
			concentration: "24%",
			bioavailability: 30,
			halfLife: "2-3 hours",
			metabolicPathway: ["Antioxidant pathways", "Vasodilation"],
			targetReceptors: ["Nitric oxide synthase", "Free radical sites"],
		},
		{
			name: "Terpene lactones",
			polishName: "Laktony terpenowe",
			concentration: "6%",
			bioavailability: 25,
			halfLife: "3-4 hours",
			metabolicPathway: ["Platelet aggregation", "Neuroprotection"],
			targetReceptors: ["Platelet-activating factor"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Cognitive function and memory",
			polishCondition: "Funkcje poznawcze i pamięć",
			indication:
				"Support for memory, focus, and cognitive performance in elderly",
			polishIndication:
				"Wsparcie dla pamięci, skupienia i wydajności poznawczej u osób starszych",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "120-240mg daily",
			duration: "4-12 weeks",
			effectSize: 0.25,
			studyCount: 12,
			participantCount: 2400,
			recommendationGrade: "B",
		},
		{
			condition: "Circulation and vascular health",
			polishCondition: "Krążenie i zdrowie naczyń",
			indication: "Improved peripheral circulation and vascular function",
			polishIndication: "Poprawione krążenie obwodowe i funkcja naczyń",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "120mg daily",
			duration: "8-16 weeks",
			effectSize: 0.3,
			studyCount: 8,
			participantCount: 1200,
			recommendationGrade: "B",
		},
		{
			condition: "Age-related macular degeneration",
			polishCondition: "Zwrotna zwyrodnienie plamki",
			indication: "Potential protection against age-related vision decline",
			polishIndication: "Potencjalna ochrona przed wiekowym spadkiem wzroku",
			efficacy: "low",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "120-160mg daily",
			duration: "6-12 months",
			effectSize: 0.15,
			studyCount: 4,
			participantCount: 300,
			recommendationGrade: "C",
		},
		{
			condition: "Dizziness and vertigo",
			polishCondition: "Zawroty głowy i zawroty",
			indication: "Reduction in episodic dizziness and balance issues",
			polishIndication:
				"Redukcja odczynów zawrotów głowy i problemów z równowagą",
			efficacy: "moderate",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "160mg daily",
			duration: "4-8 weeks",
			effectSize: 0.2,
			studyCount: 5,
			participantCount: 400,
			recommendationGrade: "C",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "vasodilation-circulation",
			name: "Vasodilation and circulation",
			polishName: "Wazodylacja i krążenie",
			pathway: "Vasodilation and circulation",
			polishPathway: "Vasodilation and circulation",
			description:
				"Improves blood flow through nitric oxide modulation and platelet-activating factor inhibition. This enhances microcirculation in the brain and peripheral tissues.",
			polishDescription:
				"Poprawia przepływ krwi przez modulację tlenku azotu i inhibicję czynnika aktywującego płytki. Wzmacnia to mikrokrążenie w mózgu i tkankach obwodowych.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Vascular system",
				"Cerebral circulation",
				"Peripheral circulation",
			],
			timeToEffect: "2-4 weeks",
			duration: "Continuous supplementation required",
		},
		{
			id: "antioxidant-protection",
			name: "Antioxidant protection",
			polishName: "Ochrona antyoksydacyjna",
			pathway: "Antioxidant protection",
			polishPathway: "Antioxidant protection",
			description:
				"Free radical scavenging and protection against oxidative stress. Ginkgo provides potent antioxidant effects that protect cellular membranes and DNA.",
			polishDescription:
				"Sczepianie wolnych rodników i ochrona przed stresem oksydacyjnym. Miłorząb zapewnia silne efekty antyoksydacyjne, które chronią błony komórkowe i DNA.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Antioxidant system",
				"Cellular protection",
				"DNA protection",
			],
			timeToEffect: "Days to weeks",
			duration: "Continuous protection",
		},
		{
			id: "anti-inflammatory",
			name: "Anti-inflammatory effects",
			polishName: "Efekty przeciwzapalne",
			pathway: "Anti-inflammatory effects",
			polishPathway: "Anti-inflammatory effects",
			description:
				"Reduces neuroinflammation through cytokine modulation. This may help protect against neurodegenerative processes.",
			polishDescription:
				"Redukuje neurozapalenie poprzez modulację cytokin. Może to pomóc w ochronie przed procesami neurodegeneracyjnymi.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Inflammatory system",
				"Neuroprotection",
				"Cytokine pathways",
			],
			timeToEffect: "4-8 weeks",
			duration: "Continuous effect",
		},
		{
			id: "neuroprotection",
			name: "Neuroprotection",
			polishName: "Neuroprotekcja",
			pathway: "Neuroprotection",
			polishPathway: "Neuroprotection",
			description:
				"Protects neurons from ischemic damage and supports cognitive function. Ginkgo may help preserve neural function in aging.",
			polishDescription:
				"Chroni neurony przed uszkodzeniami niedokrwiennymi i wspiera funkcję poznawczą. Miłorząb może pomóc w zachowaniu funkcji nerwowych w starzeniu się.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Neural protection",
				"Cognitive function",
				"Ischemia protection",
			],
			timeToEffect: "4-12 weeks",
			duration: "Long-term protection",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 120,
			max: 240,
			unit: "mg",
		},
		timing: ["morning", "afternoon"],
		withFood: false,
		contraindications: ["Pregnancy", "Bleeding disorders"],
		polishContraindications: ["Ciąża", "Zaburzenia krzepnięcia"],
		interactions: [
			{
				substance: "Anticoagulants",
				polishSubstance: "Leki przeciwzakrzepowe",
				type: "synergistic",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Increased bleeding risk",
				polishMechanism: "Zwiększone ryzyko krwawienia",
				recommendation: "Monitor coagulation parameters if combining",
				polishRecommendation: "Monitoruj parametry krzepnięcia przy łączeniu",
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
			substance: "Anticoagulants",
			polishSubstance: "Leki przeciwzakrzepowe",
			type: "synergistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism:
				"Increased bleeding risk through platelet aggregation inhibition",
			polishMechanism:
				"Zwiększone ryzyko krwawienia poprzez inhibicję agregacji płytek",
			recommendation: "Monitor coagulation parameters if combining",
			polishRecommendation: "Monitoruj parametry krzepnięcia przy łączeniu",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Antiplatelet agents",
			polishSubstance: "Środki antypłytkowe",
			type: "synergistic",
			clinicalSignificance: "Moderate clinical significance - monitor closely",
			polishClinicalSignificance:
				"Umiarkowane znaczenie kliniczne - ścisłe monitorowanie",
			severity: "moderate",
			mechanism: "Increased bleeding risk through synergistic platelet effects",
			polishMechanism:
				"Zwiększone ryzyko krwawienia poprzez synergistyczne efekty płytkowe",
			description:
				"May increase bleeding risk when combined with antiplatelet agents",
			polishDescription:
				"Może zwiększyć ryzyko krwawienia przy łączeniu ze środkami antypłytkowymi",
			recommendation: "Use with caution and monitor bleeding risk",
			polishRecommendation: "Używaj ostrożnie i monitoruj ryzyko krwawienia",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "birks-2009",
			title: "Ginkgo biloba for cognitive impairment and dementia",
			polishTitle: "Miłorząb dwuklapowy w zaburzeniach poznawczych i demencji",
			authors: ["Birks J", "Grimley Evans J"],
			journal: "Cochrane Database of Systematic Reviews",
			year: 2009,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Cognitive function",
			polishPrimaryOutcome: "Funkcja poznawcza",
			findings: "Ginkgo may provide modest benefits for cognitive function",
			polishFindings:
				"Miłorząb może zapewnić umiarkowane korzyści dla funkcji poznawczych",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "19160216",
			doi: "10.1002/14651858.CD003120.pub3",
			sampleSize: 0,
			qualityScore: 8.0,
		},
		{
			id: "lechat-2000",
			title:
				"Effects of Ginkgo biloba extract EGb 761 on cognitive performance in elderly volunteers",
			polishTitle:
				"Efekty ekstraktu z miłorzębu EGb 761 na wydajność poznawczą u osób starszych",
			authors: ["Lechat P", "Dartigues JF", "Barberger-Gateau P"],
			journal: "Neuroscience & Biobehavioral Reviews",
			year: 2000,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Cognitive performance",
			polishPrimaryOutcome: "Wydajność poznawcza",
			findings:
				"Ginkgo showed significant improvement in attention and vigilance tasks",
			polishFindings:
				"Miłorząb wykazał znaczącą poprawę w zadaniach uwagi i czujności",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "10732989",
			doi: "10.1016/S0149-7634(99)00047-1",
			sampleSize: 50,
			duration: "6 months",
			dosage: "120mg twice daily",
			qualityScore: 7.5,
		},
		{
			id: "dodge-2000",
			title: "Use of Ginkgo for mild-to-moderate Alzheimer's disease",
			polishTitle:
				"Zastosowanie miłorzębu w łagodnej do umiarkowanej chorobie Alzheimera",
			authors: ["Dodge HH", "Shadlen MF", "Wang L"],
			journal: "Archives of Neurology",
			year: 2000,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Cognitive decline in Alzheimer's disease",
			polishPrimaryOutcome:
				"Pogorszenie funkcji poznawczych w chorobie Alzheimera",
			findings:
				"Ginkgo showed comparable effectiveness to donepezil for cognitive stabilization",
			polishFindings:
				"Miłorząb wykazał porównywalną skuteczność z donepezylem dla stabilizacji poznawczej",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "10636094",
			doi: "10.1001/archneur.57.12.1605",
			sampleSize: 220,
			duration: "24 weeks",
			dosage: "120mg three times daily",
			qualityScore: 8.0,
		},
	],

	// Metadata
	tags: [
		"herb",
		"cognitive enhancement",
		"memory",
		"circulation",
		"antioxidant",
		"neuroprotection",
		"vascular health",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export const ginkgoBiloba = ginkgoBilobaProfile;
export default ginkgoBilobaProfile;
