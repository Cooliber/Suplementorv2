/**
 * PQQ (Pyrroloquinoline Quinone) Supplement Profile
 * Comprehensive scientific data for mitochondrial support and neuroprotection
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const pqqProfile: SupplementWithRelations = {
	id: "pqq",
	name: "PQQ",
	polishName: "PQQ",
	scientificName: "Pyrroloquinoline quinone",
	commonNames: ["Pyrroloquinoline quinone", "Methoxatin"],
	polishCommonNames: ["Pirrolokinolina chinon", "Metoksatyna"],
	category: "OTHER",
	description:
		"PQQ is a redox cofactor and antioxidant that supports mitochondrial biogenesis, neuroprotection, and cellular energy metabolism. It promotes the growth of new mitochondria and protects existing ones from oxidative damage.",
	polishDescription:
		"PQQ to kofaktor redoks i antyoksydant, który wspiera biogenezę mitochondrialną, neuroprotekcję i metabolizm energetyczny komórek. Promuje wzrost nowych mitochondriów i chroni istniejące przed uszkodzeniami oksydacyjnymi.",

	activeCompounds: [
		{
			name: "Pyrroloquinoline quinone",
			polishName: "Pirrolokinolina chinon",
			concentration: "10-20mg",
			bioavailability: 85,
			halfLife: "3-6 hours",
			metabolicPathway: [
				"Direct absorption",
				"Cellular uptake",
				"Mitochondrial targeting",
			],
			targetReceptors: ["Mitochondrial membranes", "NRF-1/NRF-2 pathways"],
		},
	],

	clinicalApplications: [
		{
			condition: "Mitochondrial function and energy metabolism",
			polishCondition: "Funkcja mitochondrialna i metabolizm energetyczny",
			indication:
				"Support for mitochondrial biogenesis and cellular energy production",
			polishIndication:
				"Wsparcie biogenezy mitochondrialnej i produkcji energii komórkowej",
			efficacy: "moderate",
			effectivenessRating: 7,
			evidenceLevel: "MODERATE",
			recommendedDose: "10-20mg daily",
			duration: "8-12 weeks",
			effectSize: 0.4,
			studyCount: 15,
			participantCount: 800,
			recommendationGrade: "B",
		},
		{
			condition: "Cognitive function and neuroprotection",
			polishCondition: "Funkcja poznawcza i neuroprotekcja",
			indication:
				"Support for cognitive performance and protection against neurodegeneration",
			polishIndication:
				"Wsparcie wydajności poznawczej i ochrona przed neurodegeneracją",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "WEAK",
			recommendedDose: "10-20mg daily",
			duration: "12-16 weeks",
			effectSize: 0.3,
			studyCount: 10,
			participantCount: 500,
			recommendationGrade: "C",
		},
	],

	mechanisms: [
		{
			id: "mitochondrial-biogenesis",
			name: "Mitochondrial biogenesis and function",
			polishName: "Biogeneza i funkcja mitochondrialna",
			pathway: "Mitochondrial biogenesis",
			polishPathway: "Biogeneza mitochondrialna",
			description:
				"PQQ activates NRF-1 and NRF-2 pathways, promoting mitochondrial biogenesis and enhancing cellular energy production through increased mitochondrial density and function.",
			polishDescription:
				"PQQ aktywuje ścieżki NRF-1 i NRF-2, promując biogenezę mitochondrialną i wzmacniając produkcję energii komórkowej poprzez zwiększoną gęstość i funkcję mitochondriów.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"NRF-1/NRF-2 pathways",
				"Mitochondrial biogenesis",
				"Energy metabolism",
				"Cellular respiration",
			],
			timeToEffect: "2-4 weeks",
			duration: "Continuous effect during supplementation",
		},
		{
			id: "antioxidant-protection",
			name: "Antioxidant and neuroprotective effects",
			polishName: "Efekty antyoksydacyjne i neuroprotekcyjne",
			pathway: "Oxidative stress protection",
			polishPathway: "Ochrona przed stresem oksydacyjnym",
			description:
				"PQQ acts as a potent antioxidant and redox cofactor, protecting mitochondria and neurons from oxidative damage while supporting cellular defense mechanisms.",
			polishDescription:
				"PQQ działa jako silny antyoksydant i kofaktor redoks, chroniąc mitochondria i neurony przed uszkodzeniami oksydacyjnymi, jednocześnie wspierając mechanizmy obronne komórek.",
			evidenceLevel: "MODERATE",
			targetSystems: [
				"Mitochondrial protection",
				"Neuronal protection",
				"Antioxidant defense",
				"Cellular redox balance",
			],
			timeToEffect: "1-2 weeks",
			duration: "Continuous effect during supplementation",
		},
	],

	dosageGuidelines: {
		therapeuticRange: {
			min: 10,
			max: 20,
			unit: "mg",
		},
		timing: ["morning"],
		withFood: false,
		contraindications: ["None known"],
		polishContraindications: ["Brak znanych"],
		interactions: [],
	},

	sideEffects: [
		{
			effect: "Mild gastrointestinal discomfort",
			polishEffect: "Łagodny dyskomfort żołądkowo-jelitowy",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "1-2 hours",
			management: "Take with food if needed",
			polishManagement: "Przyjmuj z jedzeniem jeśli potrzeba",
		},
	],

	interactions: [
		{
			substance: "Coenzyme Q10",
			polishSubstance: "Koenzym Q10",
			type: "synergistic",
			severity: "beneficial",
			description: "Enhanced mitochondrial support and energy production",
			polishDescription:
				"Wzmocnione wsparcie mitochondrialne i produkcja energii",
			clinicalSignificance: "Improved cellular energy metabolism",
			polishClinicalSignificance: "Poprawiony metabolizm energetyczny komórek",
			mechanism: "Complementary mitochondrial targeting",
			polishMechanism: "Komplementarne celowanie mitochondrialne",
			recommendation: "Often beneficial in combination",
			polishRecommendation: "Często korzystne w połączeniu",
			evidenceLevel: "WEAK",
		},
	],

	evidenceLevel: "MODERATE",
	researchStudies: [
		{
			id: "chowanadisai-2010",
			title: "Pyrroloquinoline quinone stimulates mitochondrial biogenesis",
			polishTitle: "Pirrolokinolina chinon stymuluje biogenezę mitochondrialną",
			authors: ["Chowanadisai W", "Bauerly KA"],
			journal: "Biochimica et Biophysica Acta",
			year: 2010,
			studyType: "EXPERIMENTAL_STUDY",
			primaryOutcome: "Mitochondrial biogenesis activation",
			polishPrimaryOutcome: "Aktywacja biogenezy mitochondrialnej",
			findings: "PQQ significantly increases mitochondrial biogenesis",
			polishFindings: "PQQ znacząco zwiększa biogenezę mitochondrialną",
			evidenceLevel: "MODERATE",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "19854239",
			doi: "10.1016/j.bbamcr.2009.10.003",
			sampleSize: 0,
			qualityScore: 8.0,
		},
	],

	tags: [
		"pqq",
		"mitochondrial",
		"energy",
		"neuroprotection",
		"antioxidant",
		"biogenesis",
		"cellular energy",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",
	knowledgeNodeId: null,
};

export default pqqProfile;
