/**
 * Magnesium Glycinate Supplement Profile
 * Highly bioavailable form of magnesium for muscle relaxation, sleep, and neurological support
 * Comprehensive profile with Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const magnesiumGlycinateProfile: SupplementWithRelations = {
	id: "magnesium-glycinate",
	name: "Magnesium Glycinate",
	polishName: "Magnez glicynian",
	scientificName: "Magnesium bisglycinate",
	commonNames: [
		"Magnesium glycinate",
		"Magnesium bisglycinate",
		"Glycine magnesium salt",
		"Albion magnesium",
	],
	polishCommonNames: [
		"Magnez glicynian",
		"Magnez bisglicynian",
		"Sól magnezowa glicyny",
		"Magnez Albion",
	],
	category: "MINERAL",
	description:
		"Magnesium glycinate is a highly bioavailable form of magnesium chelated with glycine, offering excellent absorption and tolerability. It supports muscle relaxation, neurological function, sleep quality, and bone health with minimal gastrointestinal side effects.",
	polishDescription:
		"Glicynian magnezu to wysoce biodostępna forma magnezu schelatowanego z glicyną, oferująca doskonałe wchłanianie i tolerancję. Wspiera relaksację mięśni, funkcję neurologiczną, jakość snu i zdrowie kości przy minimalnych skutkach ubocznych ze strony przewodu pokarmowego.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Magnesium glycinate",
			polishName: "Glicynian magnezu",
			concentration: "400mg",
			bioavailability: 85,
			halfLife: "4-6 hours",
			metabolicPathway: ["Amino acid transport", "Mineral absorption pathways"],
			targetReceptors: ["NMDA receptors", "Magnesium channels"],
		},
		{
			name: "Elemental magnesium",
			polishName: "Magnez pierwiastkowy",
			concentration: "80mg",
			bioavailability: 90,
			halfLife: "4-6 hours",
			metabolicPathway: ["Ion channels", "Enzyme cofactor"],
			targetReceptors: ["Magnesium-dependent enzymes"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Muscle relaxation and cramps",
			polishCondition: "Relaksacja mięśni i skurcze",
			indication: "Prevention and treatment of muscle cramps and spasms",
			polishIndication: "Zapobieganie i leczenie skurczów oraz spazmów mięśni",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "300-600mg daily",
			duration: "2-4 weeks for noticeable effects",
			effectSize: 0.6,
			studyCount: 20,
			participantCount: 1500,
			recommendationGrade: "A",
		},
		{
			condition: "Sleep quality improvement",
			polishCondition: "Poprawa jakości snu",
			indication: "Insomnia and sleep disorder support",
			polishIndication: "Wsparcie przy bezsenności i zaburzeniach snu",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "400-600mg before bedtime",
			duration: "4-8 weeks for optimal effects",
			effectSize: 0.4,
			studyCount: 15,
			participantCount: 1000,
			recommendationGrade: "B",
		},
		{
			condition: "Anxiety and stress reduction",
			polishCondition: "Redukcja lęku i stresu",
			indication: "Anxiety disorders and stress management",
			polishIndication: "Zaburzenia lękowe i zarządzanie stresem",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "300-500mg daily",
			duration: "4-6 weeks for effects",
			effectSize: 0.35,
			studyCount: 12,
			participantCount: 800,
			recommendationGrade: "B",
		},
		{
			condition: "Bone health support",
			polishCondition: "Wsparcie zdrowia kości",
			indication: "Osteoporosis prevention and bone density",
			polishIndication: "Zapobieganie osteoporozie i gęstość kości",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "300-400mg daily",
			duration: "6-12 months for bone effects",
			effectSize: 0.3,
			studyCount: 10,
			participantCount: 1200,
			recommendationGrade: "B",
		},
		{
			condition: "Cardiovascular health",
			polishCondition: "Zdrowie sercowo-naczyniowe",
			indication: "Blood pressure and heart rhythm support",
			polishIndication: "Wsparcie ciśnienia krwi i rytmu serca",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "350-500mg daily",
			duration: "8-12 weeks for cardiovascular effects",
			effectSize: 0.25,
			studyCount: 18,
			participantCount: 2000,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "muscle-relaxation",
			name: "Muscle relaxation and cramp prevention",
			polishName: "Relaksacja mięśni i zapobieganie skurczom",
			pathway: "Calcium channel regulation",
			polishPathway: "Regulacja kanałów wapniowych",
			description:
				"Magnesium acts as a natural calcium channel blocker, reducing calcium influx into muscle cells and promoting relaxation. It regulates muscle contraction and prevents cramps.",
			polishDescription:
				"Magnez działa jako naturalny bloker kanałów wapniowych, zmniejszając napływ wapnia do komórek mięśniowych i promując relaksację. Reguluje skurcz mięśni i zapobiega skurczom.",
			evidenceLevel: "STRONG",
			targetSystems: ["Skeletal muscle", "Smooth muscle", "Nervous system"],
			timeToEffect: "30-60 minutes",
			duration: "4-6 hours",
		},
		{
			id: "nmda-modulation",
			name: "NMDA receptor modulation",
			polishName: "Modulacja receptorów NMDA",
			pathway: "Glutamatergic neurotransmission",
			polishPathway: "Neurotransmisja glutaminergiczna",
			description:
				"Magnesium modulates NMDA receptors, reducing excitotoxicity and supporting neurological function. The glycine component may enhance this effect.",
			polishDescription:
				"Magnez moduluje receptory NMDA, zmniejszając egzotoksyczność i wspierając funkcję neurologiczną. Komponent glicynowy może wzmacniać ten efekt.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Central nervous system", "Glutamatergic system"],
			timeToEffect: "1-2 hours",
			duration: "4-8 hours",
		},
		{
			id: "sleep-regulation",
			name: "Sleep regulation and quality improvement",
			polishName: "Regulacja snu i poprawa jakości",
			pathway: "GABAergic neurotransmission",
			polishPathway: "Neurotransmisja GABAergiczna",
			description:
				"Magnesium supports GABA activity and melatonin regulation, promoting relaxation and better sleep quality. Glycine may enhance these effects.",
			polishDescription:
				"Magnez wspiera aktywność GABA i regulację melatoniny, promując relaksację i lepszą jakość snu. Glicyna może wzmacniać te efekty.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Sleep regulation centers", "GABA system"],
			timeToEffect: "1-2 hours",
			duration: "6-8 hours",
		},
		{
			id: "bone-metabolism",
			name: "Bone metabolism and density support",
			polishName: "Metabolizm kości i wsparcie gęstości",
			pathway: "Bone mineralization",
			polishPathway: "Mineralizacja kości",
			description:
				"Magnesium is essential for bone formation, acting as a cofactor for alkaline phosphatase and supporting calcium integration into bone matrix.",
			polishDescription:
				"Magnez jest niezbędny do tworzenia kości, działając jako kofaktor dla fosfatazy alkalicznej i wspierając integrację wapnia z macierzą kostną.",
			evidenceLevel: "MODERATE",
			targetSystems: ["Skeletal system", "Bone metabolism"],
			timeToEffect: "2-4 weeks",
			duration: "Chronic supplementation required",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 200,
			max: 600,
			unit: "mg",
		},
		timing: ["evening", "before bedtime", "with meals"],
		withFood: true,
		contraindications: [
			"Severe kidney disease",
			"Myasthenia gravis",
			"Heart block",
		],
		polishContraindications: [
			"Ciężka choroba nerek",
			"Myasthenia gravis",
			"Blok serca",
		],
		interactions: [
			{
				substance: "Calcium supplements",
				polishSubstance: "Suplementy wapnia",
				type: "antagonistic",
				severity: "minor",
				description: "May compete for absorption",
				clinicalSignificance: "May reduce absorption of both minerals",
				polishClinicalSignificance: "Może zmniejszyć wchłanianie obu minerałów",
				polishDescription: "Może konkurować o wchłanianie",
				recommendation: "Take at different times or 2 hours apart",
				polishRecommendation: "Przyjmuj w różnych porach lub 2 godziny odstępu",
				evidenceLevel: "MODERATE",
			},
			{
				substance: "Tetracycline antibiotics",
				polishSubstance: "Antybiotyki tetracyklinowe",
				type: "antagonistic",
				severity: "moderate",
				description: "Magnesium may reduce antibiotic absorption",
				clinicalSignificance: "May decrease antibiotic effectiveness",
				polishClinicalSignificance: "Może zmniejszyć skuteczność antybiotyku",
				polishDescription: "Magnez może zmniejszyć wchłanianie antybiotyku",
				recommendation:
					"Take antibiotics 2 hours before or 4-6 hours after magnesium",
				polishRecommendation:
					"Przyjmuj antybiotyki 2 godziny przed lub 4-6 godzin po magnezie",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Loose stools",
			polishEffect: "Luźne stolce",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "2-6 hours",
			management: "Reduce dose or take with food",
			polishManagement: "Zmniejsz dawkę lub przyjmuj z jedzeniem",
		},
		{
			effect: "Gastrointestinal discomfort",
			polishEffect: "Dyskomfort żołądkowo-jelitowy",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-4 hours",
			management: "Take with meals, reduce dose",
			polishManagement: "Przyjmuj z posiłkami, zmniejsz dawkę",
		},
		{
			effect: "Drowsiness",
			polishEffect: "Senność",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-3 hours",
			management: "Take in evening or reduce dose",
			polishManagement: "Przyjmuj wieczorem lub zmniejsz dawkę",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Vitamin D",
			polishSubstance: "Witamina D",
			type: "synergistic",
			severity: "beneficial",
			description: "Complementary roles in bone health and calcium metabolism",
			polishDescription:
				"Komplementarne role w zdrowiu kości i metabolizmie wapnia",
			clinicalSignificance: "Enhanced bone mineralization and health",
			polishClinicalSignificance: "Wzmocniona mineralizacja i zdrowie kości",
			mechanism: "Vitamin D enhances magnesium absorption",
			polishMechanism: "Witamina D wzmacnia wchłanianie magnezu",
			recommendation: "Beneficial combination for bone and muscle health",
			polishRecommendation: "Korzystne połączenie dla zdrowia kości i mięśni",
			evidenceLevel: "MODERATE",
		},
		{
			substance: "Glycine",
			polishSubstance: "Glicyna",
			type: "synergistic",
			clinicalSignificance: "Enhanced bioavailability and neurological effects",
			polishClinicalSignificance:
				"Wzmocniona biodostępność i efekty neurologiczne",
			severity: "beneficial",
			mechanism: "Improved absorption and NMDA receptor modulation",
			polishMechanism: "Poprawione wchłanianie i modulacja receptorów NMDA",
			description:
				"The glycine component enhances magnesium absorption and provides additional neurological benefits",
			polishDescription:
				"Komponent glicynowy wzmacnia wchłanianie magnezu i zapewnia dodatkowe korzyści neurologiczne",
			recommendation: "Inherent synergy in glycinate form",
			polishRecommendation: "Wrodzona synergia w formie glicynianu",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "boyle-2017",
			title: "The effects of magnesium supplementation on subjective anxiety",
			polishTitle: "Wpływ suplementacji magnezu na subiektywny lęk",
			authors: ["Boyle NB", "Lawton C", "Dye L"],
			journal: "Nutrients",
			year: 2017,
			studyType: "META_ANALYSIS",
			primaryOutcome: "Anxiety reduction with magnesium supplementation",
			polishPrimaryOutcome: "Redukcja lęku poprzez suplementację magnezu",
			findings:
				"Magnesium supplementation may reduce subjective measures of anxiety in individuals with low magnesium status",
			polishFindings:
				"Suplementacja magnezu może zmniejszyć subiektywne miary lęku u osób z niskim statusem magnezu",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "28684605",
			doi: "10.3390/nu9060605",
			qualityScore: 8.5,
		},
		{
			id: "abbasi-2012",
			title: "The effect of magnesium supplementation on primary insomnia",
			polishTitle: "Wpływ suplementacji magnezu na bezsenność pierwotną",
			authors: ["Abbasi B", "Kimiagar M", "Sadeghniiat K"],
			journal: "Journal of Research in Medical Sciences",
			year: 2012,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Sleep quality improvement with magnesium",
			polishPrimaryOutcome: "Poprawa jakości snu poprzez magnez",
			findings:
				"Magnesium supplementation improved sleep quality and reduced insomnia symptoms",
			polishFindings:
				"Suplementacja magnezu poprawiła jakość snu i zmniejszyła objawy bezsenności",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "23264833",
			doi: "10.4103/1735-1995.104915",
			qualityScore: 8.0,
		},
		{
			id: "veronese-2016",
			title: "Oral magnesium supplementation and bone turnover",
			polishTitle: "Doustna suplementacja magnezu a obrót kostny",
			authors: ["Veronese N", "Stubbs B", "Solmi M"],
			journal: "Nutrients",
			year: 2016,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Bone health effects of magnesium supplementation",
			polishPrimaryOutcome: "Wpływ suplementacji magnezu na zdrowie kości",
			findings:
				"Oral magnesium supplementation may have beneficial effects on bone health",
			polishFindings:
				"Doustna suplementacja magnezu może mieć korzystne efekty na zdrowie kości",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "27973411",
			doi: "10.3390/nu8120752",
			qualityScore: 8.0,
		},
	],

	// Metadata
	tags: [
		"mineral",
		"essential mineral",
		"muscle relaxation",
		"sleep support",
		"anxiety reduction",
		"bone health",
		"cardiovascular health",
		"neurological function",
		"highly bioavailable",
		"glycinate form",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default magnesiumGlycinateProfile;
