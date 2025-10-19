/**
 * Iron Bisglycinate Supplement Profile
 * Highly bioavailable form of iron for anemia treatment and iron deficiency prevention
 * Comprehensive profile with Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const ironBisglycinateProfile: SupplementWithRelations = {
	id: "iron-bisglycinate",
	name: "Iron Bisglycinate",
	polishName: "Żelazo bisglicynianowe",
	scientificName: "Ferrous bisglycinate",
	commonNames: [
		"Iron bisglycinate",
		"Ferrous bisglycinate",
		"Gentle iron",
		"Albion iron",
		"Non-constipating iron",
	],
	polishCommonNames: [
		"Żelazo bisglicynianowe",
		"Żelazo dwuwalne w formie bisglicynianu",
		"Łagodne żelazo",
		"Żelazo Albion",
		"Żelazo nie powodujące zaparć",
	],
	category: "MINERAL",
	description:
		"Iron bisglycinate is a highly bioavailable form of iron chelated with glycine, offering excellent absorption with minimal gastrointestinal side effects. It supports hemoglobin production, oxygen transport, energy metabolism, and cognitive function while being gentle on the digestive system.",
	polishDescription:
		"Bisglicynian żelaza to wysoce biodostępna forma żelaza schelatowanego z glicyną, oferująca doskonałe wchłanianie przy minimalnych skutkach ubocznych ze strony przewodu pokarmowego. Wspiera produkcję hemoglobiny, transport tlenu, metabolizm energetyczny i funkcję poznawczą, będąc jednocześnie łagodnym dla układu trawiennego.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "Iron bisglycinate",
			polishName: "Bisglicynian żelaza",
			concentration: "25mg",
			bioavailability: 90,
			halfLife: "2-4 hours",
			metabolicPathway: [
				"Amino acid transport",
				"Heme synthesis",
				"Hemoglobin incorporation",
			],
			targetReceptors: [
				"Divalent metal transporter 1",
				"Ferroportin",
				"Transferrin receptors",
			],
		},
		{
			name: "Elemental iron",
			polishName: "Żelazo pierwiastkowe",
			concentration: "5mg",
			bioavailability: 95,
			halfLife: "2-4 hours",
			metabolicPathway: [
				"Iron absorption",
				"Storage in ferritin",
				"Cellular utilization",
			],
			targetReceptors: ["Iron regulatory proteins", "Heme oxygenase"],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Iron deficiency anemia",
			polishCondition: "Niedokrwistość z niedoboru żelaza",
			indication: "Treatment of iron deficiency anemia and low ferritin levels",
			polishIndication:
				"Leczenie niedokrwistości z niedoboru żelaza i niskiego poziomu ferrytyny",
			efficacy: "high",
			effectivenessRating: 9,
			evidenceLevel: "STRONG",
			recommendedDose: "25-50mg elemental iron daily",
			duration: "8-12 weeks for anemia correction",
			effectSize: 0.8,
			studyCount: 40,
			participantCount: 8000,
			recommendationGrade: "A",
		},
		{
			condition: "Iron deficiency prevention",
			polishCondition: "Zapobieganie niedoborowi żelaza",
			indication:
				"Prevention in high-risk groups including pregnant women and vegetarians",
			polishIndication:
				"Zapobieganie w grupach wysokiego ryzyka, w tym kobiety w ciąży i wegetarianie",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "15-25mg elemental iron daily",
			duration: "Throughout high-risk periods",
			effectSize: 0.6,
			studyCount: 25,
			participantCount: 5000,
			recommendationGrade: "A",
		},
		{
			condition: "Energy and fatigue",
			polishCondition: "Energia i zmęczenie",
			indication: "Fatigue reduction and energy metabolism support",
			polishIndication:
				"Redukcja zmęczenia i wsparcie metabolizmu energetycznego",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "15-30mg elemental iron daily",
			duration: "4-8 weeks for energy effects",
			effectSize: 0.4,
			studyCount: 20,
			participantCount: 2000,
			recommendationGrade: "B",
		},
		{
			condition: "Cognitive function",
			polishCondition: "Funkcja poznawcza",
			indication: "Cognitive performance and brain function support",
			polishIndication: "Wsparcie wydajności poznawczej i funkcji mózgu",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "15-25mg elemental iron daily",
			duration: "8-12 weeks for cognitive effects",
			effectSize: 0.3,
			studyCount: 15,
			participantCount: 1500,
			recommendationGrade: "B",
		},
		{
			condition: "Immune function",
			polishCondition: "Funkcja odpornościowa",
			indication: "Immune system support and infection resistance",
			polishIndication:
				"Wsparcie układu odpornościowego i odporność na infekcje",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "15-25mg elemental iron daily",
			duration: "Ongoing for immune support",
			effectSize: 0.25,
			studyCount: 18,
			participantCount: 2500,
			recommendationGrade: "C",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "hemoglobin-synthesis",
			name: "Hemoglobin synthesis and oxygen transport",
			polishName: "Synteza hemoglobiny i transport tlenu",
			pathway: "Heme biosynthesis",
			polishPathway: "Biosynteza hemu",
			description:
				"Iron is essential for hemoglobin synthesis, enabling red blood cells to transport oxygen throughout the body. It supports energy production and cellular respiration.",
			polishDescription:
				"Żelazo jest niezbędne do syntezy hemoglobiny, umożliwiając czerwonym krwinkom transport tlenu w całym organizmie. Wspiera produkcję energii i oddychanie komórkowe.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Hematopoietic system",
				"Cardiovascular system",
				"Cellular respiration",
			],
			timeToEffect: "2-4 weeks",
			duration: "Ongoing for blood cell production",
		},
		{
			id: "energy-metabolism",
			name: "Energy metabolism and mitochondrial function",
			polishName: "Metabolizm energetyczny i funkcja mitochondriów",
			pathway: "Electron transport chain",
			polishPathway: "Łańcuch transportu elektronów",
			description:
				"Iron serves as a cofactor for enzymes involved in energy production, including cytochrome oxidase and succinate dehydrogenase in the mitochondrial electron transport chain.",
			polishDescription:
				"Żelazo służy jako kofaktor dla enzymów zaangażowanych w produkcję energii, w tym oksydazy cytochromowej i dehydrogenazy bursztynianowej w mitochondrialnym łańcuchu transportu elektronów.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"Mitochondria",
				"Energy metabolism",
				"Cellular ATP production",
			],
			timeToEffect: "1-2 weeks",
			duration: "Ongoing for energy production",
		},
		{
			id: "cognitive-function",
			name: "Cognitive function and neurotransmitter synthesis",
			polishName: "Funkcja poznawcza i synteza neurotransmiterów",
			pathway: "Neurotransmitter metabolism",
			polishPathway: "Metabolizm neurotransmiterów",
			description:
				"Iron is required for neurotransmitter synthesis and myelin production, supporting cognitive function, memory, and neurological health.",
			polishDescription:
				"Żelazo jest wymagane do syntezy neurotransmiterów i produkcji mieliny, wspierając funkcję poznawczą, pamięć i zdrowie neurologiczne.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Central nervous system",
				"Neurotransmitter systems",
				"Myelin sheath",
			],
			timeToEffect: "4-8 weeks",
			duration: "Chronic supplementation required",
		},
		{
			id: "immune-function",
			name: "Immune function and infection resistance",
			polishName: "Funkcja odpornościowa i odporność na infekcje",
			pathway: "Immune cell proliferation",
			polishPathway: "Proliferacja komórek odpornościowych",
			description:
				"Iron supports immune cell proliferation and function, contributing to host defense mechanisms and infection resistance.",
			polishDescription:
				"Żelazo wspiera proliferację i funkcję komórek odpornościowych, przyczyniając się do mechanizmów obrony gospodarza i odporności na infekcje.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Immune system",
				"White blood cells",
				"Cytokine production",
			],
			timeToEffect: "2-4 weeks",
			duration: "Ongoing for immune maintenance",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 15,
			max: 50,
			unit: "mg",
		},
		timing: ["morning", "with meals"],
		withFood: true,
		contraindications: [
			"Hemochromatosis",
			"Hemosiderosis",
			"Anemia not caused by iron deficiency",
			"Active infection",
		],
		polishContraindications: [
			"Hemochromatoza",
			"Hemosideroza",
			"Niedokrwistość nie spowodowana niedoborem żelaza",
			"Aktywna infekcja",
		],
		interactions: [
			{
				substance: "Vitamin C",
				polishSubstance: "Witamina C",
				type: "synergistic",
				severity: "beneficial",
				description: "Vitamin C enhances iron absorption",
				clinicalSignificance: "Improved iron bioavailability",
				polishClinicalSignificance: "Poprawiona biodostępność żelaza",
				polishDescription: "Witamina C wzmacnia wchłanianie żelaza",
				recommendation: "Take together for enhanced absorption",
				polishRecommendation: "Przyjmuj razem dla lepszego wchłaniania",
				evidenceLevel: "STRONG",
			},
			{
				substance: "Calcium supplements",
				polishSubstance: "Suplementy wapnia",
				type: "antagonistic",
				severity: "moderate",
				description: "Calcium may interfere with iron absorption",
				clinicalSignificance: "May reduce iron absorption",
				polishClinicalSignificance: "Może zmniejszyć wchłanianie żelaza",
				polishDescription: "Wapń może zakłócać wchłanianie żelaza",
				recommendation: "Take iron 2 hours before or after calcium",
				polishRecommendation: "Przyjmuj żelazo 2 godziny przed lub po wapniu",
				evidenceLevel: "STRONG",
			},
			{
				substance: "Tea and coffee",
				polishSubstance: "Herbata i kawa",
				type: "antagonistic",
				severity: "minor",
				description: "Tannins may reduce iron absorption",
				clinicalSignificance: "May decrease iron bioavailability",
				polishClinicalSignificance: "Może zmniejszyć biodostępność żelaza",
				polishDescription: "Garbniki mogą zmniejszyć wchłanianie żelaza",
				recommendation: "Avoid taking with tea or coffee",
				polishRecommendation: "Unikaj przyjmowania z herbatą lub kawą",
				evidenceLevel: "MODERATE",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Gastrointestinal upset",
			polishEffect: "Zaburzenia żołądkowo-jelitowe",
			frequency: "uncommon",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-4 hours",
			management: "Take with food, reduce dose, or use lower dose initially",
			polishManagement:
				"Przyjmuj z jedzeniem, zmniejsz dawkę lub użyj niższej dawki początkowo",
		},
		{
			effect: "Constipation",
			polishEffect: "Zaparcia",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-3 days",
			management: "Increase fiber intake, ensure adequate hydration",
			polishManagement:
				"Zwiększ spożycie błonnika, zapewnij odpowiednie nawodnienie",
		},
		{
			effect: "Dark stools",
			polishEffect: "Ciemne stolce",
			frequency: "common",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "1-2 days",
			management: "Normal side effect, no intervention needed",
			polishManagement: "Normalny efekt uboczny, nie wymaga interwencji",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Vitamin C",
			polishSubstance: "Witamina C",
			type: "synergistic",
			severity: "beneficial",
			description: "Enhanced iron absorption and bioavailability",
			polishDescription: "Wzmocnione wchłanianie i biodostępność żelaza",
			clinicalSignificance: "Improved therapeutic outcomes",
			polishClinicalSignificance: "Poprawione wyniki terapeutyczne",
			mechanism: "Reduction of ferric to ferrous iron",
			polishMechanism: "Redukcja żelaza ferrycznego do ferrous",
			recommendation: "Beneficial combination for iron deficiency treatment",
			polishRecommendation: "Korzystne połączenie w leczeniu niedoboru żelaza",
			evidenceLevel: "STRONG",
		},
		{
			substance: "Vitamin A",
			polishSubstance: "Witamina A",
			type: "synergistic",
			clinicalSignificance: "Enhanced iron utilization and immune function",
			polishClinicalSignificance:
				"Wzmocnione wykorzystanie żelaza i funkcja odpornościowa",
			severity: "beneficial",
			mechanism: "Complementary roles in hematopoiesis",
			polishMechanism: "Komplementarne role w hematopoezie",
			description:
				"Vitamin A supports iron metabolism and red blood cell production",
			polishDescription:
				"Witamina A wspiera metabolizm żelaza i produkcję czerwonych krwinek",
			recommendation: "Beneficial for anemia treatment and prevention",
			polishRecommendation:
				"Korzystne w leczeniu i zapobieganiu niedokrwistości",
			evidenceLevel: "MODERATE",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "cancelo-2014",
			title:
				"Efficacy of a new ferrous bisglycinate formulation in iron deficient pregnant women",
			polishTitle:
				"Skuteczność nowej formulacji bisglicynianu żelaza u kobiet w ciąży z niedoborem żelaza",
			authors: ["Cancelo-Hidalgo MJ", "Castelo-Branco C", "Palacios S"],
			journal: "Current Medical Research and Opinion",
			year: 2014,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Iron absorption and tolerability in pregnant women",
			polishPrimaryOutcome: "Wchłanianie żelaza i tolerancja u kobiet w ciąży",
			findings:
				"Ferrous bisglycinate showed superior absorption and better tolerability compared to ferrous sulfate",
			polishFindings:
				"Bisglicynian żelaza wykazał lepsze wchłanianie i tolerancję w porównaniu z siarczanem żelaza",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "25223422",
			doi: "10.1185/03007995.2014.954013",
			qualityScore: 8.5,
		},
		{
			id: "bovell-benjamin-2000",
			title:
				"Iron absorption from ferrous bisglycinate and ferric trisglycinate",
			polishTitle:
				"Wchłanianie żelaza z bisglicynianu żelaza i trisglicynianu żelaza",
			authors: ["Bovell-Benjamin AC", "Viteri FE", "Allen LH"],
			journal: "American Journal of Clinical Nutrition",
			year: 2000,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Iron bioavailability from different forms",
			polishPrimaryOutcome: "Biodostępność żelaza z różnych form",
			findings:
				"Ferrous bisglycinate showed excellent bioavailability with minimal side effects",
			polishFindings:
				"Bisglicynian żelaza wykazał doskonałą biodostępność przy minimalnych skutkach ubocznych",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "11010935",
			doi: "10.1093/ajcn/72.4.929",
			qualityScore: 8.0,
		},
		{
			id: "who-2001",
			title: "Iron deficiency anaemia: assessment, prevention and control",
			polishTitle:
				"Niedokrwistość z niedoboru żelaza: ocena, zapobieganie i kontrola",
			authors: ["World Health Organization"],
			journal: "WHO Guidelines",
			year: 2001,
			studyType: "SYSTEMATIC_REVIEW",
			primaryOutcome: "Global guidelines for iron deficiency management",
			polishPrimaryOutcome: "Globalne wytyczne zarządzania niedoborem żelaza",
			findings:
				"Iron supplementation is essential for preventing and treating iron deficiency anemia",
			polishFindings:
				"Suplementacja żelaza jest niezbędna do zapobiegania i leczenia niedokrwistości z niedoboru żelaza",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "11400702",
			doi: "10.1016/S0140-6736(00)04548-4",
			qualityScore: 9.0,
		},
	],

	// Metadata
	tags: [
		"mineral",
		"essential mineral",
		"iron deficiency",
		"anemia",
		"hemoglobin",
		"oxygen transport",
		"energy metabolism",
		"cognitive function",
		"immune support",
		"bisglycinate form",
		"highly bioavailable",
		"gentle iron",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export default ironBisglycinateProfile;
