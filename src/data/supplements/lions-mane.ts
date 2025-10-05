/**
 * Lion's Mane Supplement Profile
 * Medicinal mushroom with neurotrophic and cognitive enhancing properties
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const lionsManeProfile: SupplementWithRelations = {
	id: "lions-mane",
	name: "Lion's Mane",
	polishName: "Grzyb lewkonosy",
	scientificName: "Hericium erinaceus",
	commonNames: ["Hericium erinaceus", "Yamabushitake", "Houma"],
	polishCommonNames: ["Herikium erinaceus", "Yamabushitake", "Houma"],
	category: "NOOTROPIC",
	description:
		"Lion's Mane is a medicinal mushroom rich in bioactive compounds called hericenones and erinacines that stimulate nerve growth factor (NGF) production. It has been used in traditional Chinese medicine for centuries and is known for its neurotrophic, cognitive-enhancing, and neuroprotective properties.",
	polishDescription:
		"Grzyb lewkonosy to leczniczy grzyb bogaty w bioaktywne związki zwane hericenonami i erinacynami, które stymulują produkcję czynnika wzrostu nerwu (NGF). Był stosowany w tradycyjnej medycynie chińskiej od wieków i jest znany z jego właściwości neurotroficznych, wzmocniających poznawczo i neuroprotekcyjnych.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Hericenones",
			polishName: "Hericenony",
			concentration: "0.5-2%",
			bioavailability: 75,
			halfLife: "2-4 hours",
			metabolicPathway: ["NGF stimulation", "Neurogenesis", "Neuroplasticity"],
			targetReceptors: ["Nerve growth factor receptors", "TrkA receptors"],
		},
		{
			name: "Erinacines",
			polishName: "Erinacyny",
			concentration: "0.1-0.5%",
			bioavailability: 80,
			halfLife: "4-6 hours",
			metabolicPathway: ["NGF stimulation", "Myelination", "Neuroprotection"],
			targetReceptors: ["Nerve growth factor receptors", "BDNF receptors"],
		},
		{
			name: "Beta-glucans",
			polishName: "Beta-glukany",
			concentration: "10-25%",
			bioavailability: 60,
			halfLife: "6-8 hours",
			metabolicPathway: ["Immune modulation", "Anti-inflammatory"],
			targetReceptors: ["Immune cells", "Complement system"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Cognitive decline and mild cognitive impairment",
			polishCondition:
				"Spadek funkcji poznawczych i lekkie zaburzenia poznawcze",
			indication:
				"Supports cognitive function and may slow decline in elderly individuals",
			polishIndication:
				"Wspiera funkcję poznawczą i może spowalniać spadek u osób starszych",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "STRONG",
			recommendedDose: "1000-3000mg daily standardized extract",
			duration: "3-6 months",
			effectSize: 0.45,
			studyCount: 8,
			participantCount: 500,
			recommendationGrade: "A",
		},
		{
			condition: "Anxiety and depression",
			polishCondition: "Lęk i depresja",
			indication:
				"May support mood and reduce anxiety through neurotrophic effects",
			polishIndication:
				"Może wspierać nastrój i zmniejszać lęk dzięki efektom neurotroficznym",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "750-1500mg daily",
			duration: "4-8 weeks",
			effectSize: 0.35,
			studyCount: 6,
			participantCount: 300,
			recommendationGrade: "B",
		},
		{
			condition: "Neurodegenerative diseases",
			polishCondition: "Choroby neurodegeneracyjne",
			indication:
				"Potential neuroprotective effects in Parkinson's and Alzheimer's disease",
			polishIndication:
				"Potencjalne efekty neuroprotekcyjne w chorobie Parkinsona i Alzheimera",
			efficacy: "moderate",
			effectivenessRating: 4,
			evidenceLevel: "WEAK",
			recommendedDose: "2000-3000mg daily",
			duration: "6-12 months",
			effectSize: 0.25,
			studyCount: 4,
			participantCount: 200,
			recommendationGrade: "C",
		},
		{
			condition: "Peripheral neuropathy",
			polishCondition: "Neuropatia obwodowa",
			indication: "May support nerve regeneration and reduce neuropathic pain",
			polishIndication:
				"Może wspierać regenerację nerwów i zmniejszać ból neuropatyczny",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "1000-2000mg daily",
			duration: "2-6 months",
			effectSize: 0.4,
			studyCount: 5,
			participantCount: 250,
			recommendationGrade: "B",
		},
		{
			condition: "Gastrointestinal health",
			polishCondition: "Zdrowie przewodu pokarmowego",
			indication:
				"Anti-inflammatory and regenerative effects in the digestive system",
			polishIndication:
				"Efekty przeciwzapalne i regeneracyjne w układzie pokarmowym",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "1000-2000mg daily",
			duration: "1-3 months",
			effectSize: 0.3,
			studyCount: 7,
			participantCount: 400,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "ngf-stimulation",
			name: "Nerve Growth Factor (NGF) stimulation",
			polishName: "Stymulacja czynnika wzrostu nerwu (NGF)",
			pathway: "NGF and BDNF upregulation",
			polishPathway: "NGF and BDNF upregulation",
			description:
				"Hericenones and erinacines cross the blood-brain barrier and stimulate NGF production, promoting nerve regeneration, growth, and survival. This supports cognitive function and neuroplasticity.",
			polishDescription:
				"Hericenony i erinacyny przechodzą przez barierę krew-mózg i stymulują produkcję NGF, promując regenerację, wzrost i przeżycie nerwów. Wspiera to funkcję poznawczą i neuroplastyczność.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Neurotrophins",
				"Nerve regeneration",
				"Cognitive function",
			],
			timeToEffect: "4-6 weeks",
			duration: "Ongoing neurotrophic support",
		},
		{
			id: "neuroplasticity",
			name: "Neuroplasticity and synaptic formation",
			polishName: "Neuroplastyczność i tworzenie synaps",
			pathway: "Synaptic plasticity enhancement",
			polishPathway: "Synaptic plasticity enhancement",
			description:
				"Stimulates the growth of new neurons and synapses, improving learning capacity, memory formation, and cognitive flexibility.",
			polishDescription:
				"Stymuluje wzrost nowych neuronów i synaps, poprawiając pojemność uczenia się, tworzenie pamięci i elastyczność poznawczą.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Synaptic formation", "Learning", "Memory"],
			timeToEffect: "6-8 weeks",
			duration: "Long-term brain plasticity",
		},
		{
			id: "neuroprotection",
			name: "Neuroprotection against toxins",
			polishName: "Neuroprotekcja przed toksynami",
			pathway: "Cellular protection and detoxification",
			polishPathway: "Cellular protection and detoxification",
			description:
				"Protects neurons from oxidative stress, beta-amyloid toxicity, and other neurotoxic compounds through antioxidant and anti-inflammatory mechanisms.",
			polishDescription:
				"Chroni neurony przed stresem oksydacyjnym, toksycznością beta-amyloidu i innymi neurotoksynami poprzez mechanizmy antyoksydacyjne i przeciwzapalne.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Oxidative stress",
				"Neurotoxicity",
				"Cellular protection",
			],
			timeToEffect: "2-4 weeks",
			duration: "Continuous neuroprotection",
		},
		{
			id: "myelination",
			name: "Myelination and nerve conduction",
			polishName: "Mielinizacja i przewodnictwo nerwowe",
			pathway: "Myelin formation and regeneration",
			polishPathway: "Myelin formation and regeneration",
			description:
				"Supports myelin sheath formation and repair, improving nerve signal transmission and conduction velocity.",
			polishDescription:
				"Wspiera tworzenie i naprawę osłonki mielinowej, poprawiając transmisję i prędkość przewodnictwa sygnału nerwowego.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Myelin", "Nerve conduction", "Signal transmission"],
			timeToEffect: "1-3 months",
			duration: "Nerve repair and maintenance",
		},
		{
			id: "gut-brain",
			name: "Gut-brain axis modulation",
			polishName: "Modulacja osi jelito-mózg",
			pathway: "Neuroimmune communication",
			polishPathway: "Neuroimmune communication",
			description:
				"Lion's Mane may influence gut microbiota and the gut-brain axis, affecting mood, cognition, and neuroinflammation.",
			polishDescription:
				"Grzyb lewkonosy może wpływać na mikrobiotę jelitową i oś jelito-mózg, wpływając na nastrój, poznawczość i neurozapalenie.",
			evidenceLevel: "WEAK",
			targetSystems: ["Gut microbiome", "Neuroimmune", "Mood regulation"],
			timeToEffect: "2-4 weeks",
			duration: "Gut-brain communication",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 750,
			max: 3000,
			unit: "mg",
		},
		timing: ["with meals", "divided doses for better absorption"],
		withFood: true,
		contraindications: [
			"Allergy to mushrooms",
			"Autoimmune conditions (theoretical)",
		],
		polishContraindications: [
			"Alergia na grzyby",
			"Zaburzenia autoimmunologiczne (teoretycznie)",
		],
		interactions: [
			{
				substance: "Immunosuppressants",
				polishSubstance: "Leki immunosupresyjne",
				type: "antagonistic",
				severity: "moderate",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Immune system stimulation",
				polishMechanism: "Stymulacja układu odpornościowego",
				recommendation: "Avoid while on immunosuppressant therapy",
				polishRecommendation: "Unikaj podczas terapii immunosupresyjnej",
				evidenceLevel: "WEAK",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Mild gastrointestinal upset",
			polishEffect: "Lekka niewygodę przewodu pokarmowego",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Take with food, start with lower doses",
			polishManagement: "Przyjmuj z posiłkiem, zacznij od niższych dawek",
		},
		{
			effect: "Skin rash (allergic)",
			polishEffect: "Wysypka skórna (alergiczna)",
			frequency: "rare",
			severity: "moderate",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "Hours to days",
			management: "Discontinue use, seek medical attention if severe",
			polishManagement:
				"Przerwij stosowanie, poszukaj pomocy medycznej przy silnych objawach",
		},
		{
			effect: "Change in taste",
			polishEffect: "Zmiana smaku",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "Days to weeks",
			management: "Usually resolves after discontinuation",
			polishManagement: "Zwykle ustępuje po przerwaniu",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Immunosuppressants",
			polishSubstance: "Leki immunosupresyjne",
			type: "antagonistic",
			severity: "moderate",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism:
				"Immune system stimulation may counteract immunosuppressant effects",
			polishMechanism:
				"Stymulacja układu odpornościowego może przeciwdziałać działaniu immunosupresantów",
			recommendation: "Avoid while on immunosuppressant therapy",
			polishRecommendation: "Unikaj podczas terapii immunosupresyjnej",
			evidenceLevel: "WEAK",
		},
		{
			substance: "Antidiabetic medications",
			polishSubstance: "Leki na cukrzycę",
			type: "synergistic",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "May enhance glucose-lowering effects",
			polishMechanism: "Może wzmocnić efekty obniżania glukozy",
			description: "May potentiate the effects of diabetes medications",
			polishDescription: "Może wzmocnić efekty leków na cukrzycę",
			recommendation: "Monitor blood glucose closely when combining",
			polishRecommendation:
				"Ściśle monitoruj poziom glukozy we krwi przy łączeniu",
			evidenceLevel: "WEAK",
		},
		{
			substance: "Blood thinners",
			polishSubstance: "Leki rozrzedzające krew",
			type: "additive",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "Potential antiplatelet effects",
			polishMechanism: "Potencjalne efekty przeciwplateletkowe",
			description: "May have mild additive effects on blood thinning",
			polishDescription:
				"Może mieć łagodne efekty addytywne na rozrzedzanie krwi",
			recommendation: "Monitor if combining with anticoagulants",
			polishRecommendation:
				"Monitoruj przy łączeniu z lekami przeciwzakrzepowymi",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "wang-2022",
			title:
				"Neuropharmacological actions and therapeutic potential of Hericium erinaceus in neurodegenerative diseases",
			polishTitle:
				"Działania neurofarmakologiczne i potencjał terapeutyczny Hericium erinaceus w chorobach neurodegeneracyjnych",
			authors: [
				"Wang H",
				"Kang U",
				"Kim Y",
				"Cho J",
				"Park J",
				"Lee S",
				"Choi H",
			],
			journal: "International Journal of Molecular Sciences",
			year: 2022,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Neurotrophic and neuroprotective effects",
			polishPrimaryOutcome: "Efekty neurotroficzne i neuroprotekcyjne",
			findings:
				"Hericium erinaceus shows significant potential for cognitive and neuroprotective benefits",
			polishFindings:
				"Hericium erinaceus wykazuje znaczny potencjał dla korzyści poznawczych i neuroprotekcyjnych",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "35615842",
			doi: "10.3390/ijms23105290",
			sampleSize: 0,
			qualityScore: 8.5,
		},
		{
			id: "sa-ngam-2020",
			title:
				"Neurotrophic properties of Hericium erinaceus in the treatment of Alzheimer's disease-like pathology",
			polishTitle:
				"Właściwości neurotroficzne Hericium erinaceus w leczeniu patologii podobnej do choroby Alzheimera",
			authors: ["Sa-Ngam A", "Ngamniyom C"],
			journal: "Journal of Medicinal Food",
			year: 2020,
			studyType: "EXPERIMENTAL_STUDY",
			primaryOutcome: "Cognitive improvement",
			polishPrimaryOutcome: "Poprawa poznawcza",
			findings:
				"Improved cognitive function in animal models of Alzheimer's disease",
			polishFindings:
				"Poprawa funkcji poznawczych w modelach zwierzęcych choroby Alzheimera",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "32342795",
			doi: "10.1089/jmf.2019.4574",
			sampleSize: 0,
			qualityScore: 7.5,
		},
		{
			id: "mori-2011",
			title:
				"Improving effects of the mushroom Yamabushitake (Hericium erinaceus) on mild cognitive impairment: a double-blind placebo-controlled clinical trial",
			polishTitle:
				"Poprawiające efekty grzyba Yamabushitake (Hericium erinaceus) na lekkie zaburzenia poznawcze: badanie kliniczne metodą podwójnie ślepej próby kontrolnej",
			authors: ["Mori K", "Inatomi S", "Ouchi K", "Azumi Y", "Tuchida T"],
			journal: "Phytotherapy Research",
			year: 2011,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Cognitive improvement",
			polishPrimaryOutcome: "Poprawa poznawcza",
			findings:
				"Significant improvement in cognitive function scores compared to placebo",
			polishFindings:
				"Znacząca poprawa wyników funkcji poznawczych w porównaniu z placebo",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "21870326",
			doi: "10.1002/ptr.3604",
			sampleSize: 30,
			participantCount: 30,
			qualityScore: 8.0,
		},
		{
			id: "lai-2013",
			title:
				"Neuroregenerative potential of Lion's Mane Mushroom in treating peripheral nerve injury",
			polishTitle:
				"Potencjał neuroregeneracyjny grzyba lewkonosego w leczeniu urazów nerwu obwodowego",
			authors: [
				"Lai P",
				"Naidu M",
				"Sabaratnam V",
				"Rosma A",
				"Hassan K",
				"Faseeah S",
				"Zakaria N",
			],
			journal: "International Journal of Molecular Sciences",
			year: 2013,
			studyType: "EXPERIMENTAL_STUDY",
			primaryOutcome: "Nerve regeneration",
			polishPrimaryOutcome: "Regeneracja nerwu",
			findings:
				"Enhanced nerve regeneration and functional recovery in animal models",
			polishFindings:
				"Wzmacniona regeneracja nerwu i odzyskiwanie funkcji w modelach zwierzęcych",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "23857136",
			doi: "10.3390/ijms140713326",
			sampleSize: 0,
			qualityScore: 7.5,
		},
	],

	// Metadata
	tags: [
		"medicinal mushroom",
		"neurotrophic",
		"cognition",
		"ngf",
		"neuroplasticity",
		"nerve repair",
		"anxiety",
		"depression",
		"alzheimer",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export const lionsMane = lionsManeProfile;
export default lionsManeProfile;
