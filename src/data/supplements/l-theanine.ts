/**
 * L-Theanine Supplement Profile
 * Migrated from nextjs-roocode-template with enhanced T3 Stack compatibility
 * The Calming Amino Acid with comprehensive Polish medical compliance
 */

import type { SupplementWithRelations } from "../../types/supplement";

export const lTheanineProfile: SupplementWithRelations = {
	id: "l-theanine",
	name: "L-Theanine",
	polishName: "L-Teanina",
	scientificName: "γ-glutamyletyloamina",
	commonNames: ["Theanine", "N-ethyl-L-glutamine", "5-N-ethylglutamine"],
	polishCommonNames: ["Teanina", "N-etylo-L-glutamina", "5-N-etyloglutamina"],
	category: "AMINO_ACID",
	description:
		"L-Theanine is an amino acid found naturally in tea leaves that promotes relaxation without drowsiness. It crosses the blood-brain barrier and increases GABA, dopamine, and serotonin levels while reducing cortisol and promoting alpha brain waves for a calm, focused state.",
	polishDescription:
		"L-Teanina to aminokwas występujący naturalnie w liściach herbaty, który promuje relaks bez osowienia. Przekracza barierę krew-mózg i zwiększa poziomy GABA, dopaminy i serotoniny, podczas gdy zmniejsza kortyzol i promuje fale mózgowe alfa dla spokojnego, skoncentrowanego stanu.",

	// Active compounds with detailed bioavailability data
	activeCompounds: [
		{
			name: "L-Theanine",
			polishName: "L-Teanina",
			concentration: "200mg",
			bioavailability: 95,
			halfLife: "4-5 hours",
			metabolicPathway: ["GABAergic system", "Glutamatergic system"],
			targetReceptors: [
				"GABA receptors",
				"Glutamate receptors",
				"Dopamine receptors",
			],
		},
	],

	// Clinical applications with Polish translations
	clinicalApplications: [
		{
			condition: "Anxiety and stress",
			polishCondition: "Lęk i stres",
			indication: "Reduction in anxiety symptoms and stress response",
			polishIndication: "Redukcja objawów lęku i odpowiedzi na stres",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-400mg daily",
			duration: "Days to weeks",
			effectSize: 0.6,
			studyCount: 10,
			participantCount: 750,
			recommendationGrade: "A",
		},
		{
			condition: "Cognitive enhancement with relaxation",
			polishCondition: "Wzmocnienie poznawcze z relaksem",
			indication: "Improved focus and concentration without stimulant effects",
			polishIndication:
				"Poprawione skupienie i koncentracja bez efektów stymulujących",
			efficacy: "high",
			effectivenessRating: 8,
			evidenceLevel: "STRONG",
			recommendedDose: "100-200mg as needed",
			duration: "1-4 hours",
			effectSize: 0.4,
			studyCount: 8,
			participantCount: 500,
			recommendationGrade: "A",
		},
		{
			condition: "Sleep quality improvement",
			polishCondition: "Poprawa jakości snu",
			indication: "Better sleep quality without drowsiness during the day",
			polishIndication: "Lepsza jakość snu bez osowienia w ciągu dnia",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "200mg evening",
			duration: "2-4 weeks",
			effectSize: 0.3,
			studyCount: 6,
			participantCount: 400,
			recommendationGrade: "B",
		},
		{
			condition: "Attention and focus",
			polishCondition: "Uwaga i skupienie",
			indication: "Enhanced attention and sustained focus",
			polishIndication: "Wzmocniona uwaga i utrzymywane skupienie",
			efficacy: "moderate",
			effectivenessRating: 6,
			evidenceLevel: "MODERATE",
			recommendedDose: "100-200mg daily",
			duration: "Days to weeks",
			effectSize: 0.35,
			studyCount: 7,
			participantCount: 450,
			recommendationGrade: "B",
		},
	],

	// Mechanisms of action with detailed pathways
	mechanisms: [
		{
			id: "gaba-glutamate",
			name: "GABAergic and glutamatergic systems",
			polishName: "Systemy GABAergiczne i glutaminergiczne",
			pathway: "GABAergic and glutamatergic systems",
			polishPathway: "GABAergic and glutamatergic systems",
			description:
				"L-Theanine increases GABA, dopamine, and serotonin levels while reducing cortisol and promoting alpha brain waves. This creates a calm, focused state without sedation.",
			polishDescription:
				"L-Teanina zwiększa poziomy GABA, dopaminy i serotoniny, podczas gdy zmniejsza kortyzol i promuje fale mózgowe alfa. Tworzy to spokojny, skoncentrowany stan bez osowienia.",
			evidenceLevel: "STRONG",
			targetSystems: [
				"GABA system",
				"Dopamine system",
				"Serotonin system",
				"Stress response",
			],
			timeToEffect: "30-60 minutes",
			duration: "4-6 hours",
		},
		{
			id: "brain-wave-modulation",
			name: "Brain wave modulation",
			polishName: "Modulacja fal mózgowych",
			pathway: "Brain wave modulation",
			polishPathway: "Brain wave modulation",
			description:
				"L-Theanine promotes alpha brain waves associated with relaxed alertness, enhancing the ability to maintain focus while being calm.",
			polishDescription:
				"L-Teanina promuje fale mózgowe alfa związane z relaksowaną czujnością, wzmacniając zdolność do utrzymania skupienia przy jednoczesnym spokoju.",
			evidenceLevel: "STRONG",
			targetSystems: ["Brain wave patterns", "Attention", "Relaxation"],
			timeToEffect: "30-60 minutes",
			duration: "3-4 hours",
		},
		{
			id: "cortisol-reduction",
			name: "Cortisol reduction and stress modulation",
			polishName: "Redukcja kortyzolu i modulacja stresu",
			pathway: "Cortisol reduction and stress modulation",
			polishPathway: "Cortisol reduction and stress modulation",
			description:
				"L-Theanine directly reduces cortisol levels and modulates the HPA axis response to stress, providing anxiolytic effects.",
			polishDescription:
				"L-Teanina bezpośrednio zmniejsza poziomy kortyzolu i moduluje odpowiedź osi HPA na stres, zapewniając efekty przeciwlękowe.",
			evidenceLevel: "STRONG",
			targetSystems: ["HPA axis", "Stress hormones", "Anxiety pathways"],
			timeToEffect: "30-60 minutes",
			duration: "4-6 hours",
		},
	],

	// Comprehensive dosage guidelines
	dosageGuidelines: {
		therapeuticRange: {
			min: 100,
			max: 400,
			unit: "mg",
		},
		timing: ["morning", "evening"],
		withFood: false,
		contraindications: ["Pregnancy", "Breastfeeding"],
		polishContraindications: ["Ciąża", "Karmienie piersią"],
		interactions: [
			{
				substance: "Antihypertensive medications",
				polishSubstance: "Leki przeciw nadciśnieniu",
				type: "synergistic",
				severity: "minor",
				description: "Interaction between supplements",
				polishDescription: "Interakcja między suplementami",
				clinicalSignificance: "Monitor for effects",
				polishClinicalSignificance: "Monitorować efekty",
				mechanism: "Potential blood pressure reduction",
				polishMechanism: "Potencjalne obniżenie ciśnienia krwi",
				recommendation: "Monitor blood pressure when combining",
				polishRecommendation: "Monitoruj ciśnienie krwi przy łączeniu",
				evidenceLevel: "WEAK",
			},
		],
	},

	// Side effects with frequency and management
	sideEffects: [
		{
			effect: "Drowsiness",
			polishEffect: "Ozdrowsienie",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: true,
			timeToOnset: "30-60 minutes",
			management: "Reduce dose, take earlier in day",
			polishManagement: "Zmniejsz dawkę, przyjmuj wcześniej w ciągu dnia",
		},
		{
			effect: "Headache",
			polishEffect: "Ból głowy",
			frequency: "rare",
			severity: "mild",
			reversible: true,
			dosageDependent: false,
			timeToOnset: "30-60 minutes",
			management: "Ensure adequate hydration",
			polishManagement: "Zapewnij odpowiednie nawodnienie",
		},
	],

	// Supplement interactions
	interactions: [
		{
			substance: "Caffeine",
			polishSubstance: "Kofeina",
			type: "synergistic",
			severity: "beneficial",
			description: "Interaction between supplements",
			polishDescription: "Interakcja między suplementami",
			clinicalSignificance: "Monitor for effects",
			polishClinicalSignificance: "Monitorować efekty",
			mechanism: "Enhanced cognitive effects with reduced caffeine jitters",
			polishMechanism:
				"Wzmocnione efekty poznawcze z zmniejszonymi skutkami kofeiny",
			recommendation:
				"Common and beneficial combination for cognitive enhancement",
			polishRecommendation:
				"Powszechne i korzystne połączenie do wzmocnienia poznawczego",
			evidenceLevel: "STRONG",
		},
		{
			substance: "Antihypertensive medications",
			polishSubstance: "Leki przeciw nadciśnieniu",
			type: "synergistic",
			clinicalSignificance:
				"Minor clinical significance - generally safe with monitoring",
			polishClinicalSignificance:
				"Niewielkie znaczenie kliniczne - ogólnie bezpieczne z monitorowaniem",
			severity: "minor",
			mechanism: "Potential additive blood pressure reduction",
			polishMechanism: "Potencjalne addytywne obniżenie ciśnienia krwi",
			description: "May enhance blood pressure lowering effects",
			polishDescription: "Może wzmocnić efekty obniżania ciśnienia krwi",
			recommendation: "Monitor blood pressure when combining",
			polishRecommendation: "Monitoruj ciśnienie krwi przy łączeniu",
			evidenceLevel: "WEAK",
		},
	],

	// Evidence level and research studies
	evidenceLevel: "STRONG",
	researchStudies: [
		{
			id: "kimura-2007",
			title:
				"L-theanine reduces psychological and physiological stress responses",
			polishTitle:
				"L-teanina zmniejsza psychiczne i fizjologiczne odpowiedzi na stres",
			authors: ["Kimura K", "Ozeki M", "Juneja LR", "Ohira H"],
			journal: "Biological Psychology",
			year: 2007,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Stress reduction",
			polishPrimaryOutcome: "Redukcja stresu",
			findings:
				"L-theanine significantly reduced stress responses and promoted relaxation",
			polishFindings:
				"L-teanina znacząco zmniejszyła odpowiedzi na stres i promowała relaks",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "17182165",
			doi: "10.1016/j.biopsycho.2006.06.006",
			sampleSize: 12,
			duration: "Single dose study",
			dosage: "200mg",
			qualityScore: 8.5,
		},
		{
			id: "haskell-2008",
			title:
				"The effects of L-theanine, caffeine and their combination on cognition and mood",
			polishTitle:
				"Efekty L-teaniny, kofeiny i ich kombinacji na poznawczość i nastrój",
			authors: [
				"Haskell CF",
				"Kennedy DO",
				"Milne AL",
				"Scholey AB",
				"Wesnes KA",
			],
			journal: "Biological Psychology",
			year: 2008,
			studyType: "RANDOMIZED_CONTROLLED_TRIAL",
			primaryOutcome: "Cognitive performance and mood",
			polishPrimaryOutcome: "Wydajność poznawcza i nastrój",
			findings:
				"L-theanine combined with caffeine improved attention and reduced anxiety",
			polishFindings:
				"L-teanina w połączeniu z kofeiną poprawiła uwagę i zmniejszyła lęk",
			evidenceLevel: "STRONG",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "18291590",
			doi: "10.1016/j.biopsycho.2008.02.006",
			sampleSize: 44,
			duration: "Single dose study",
			dosage: "50mg L-theanine + 100mg caffeine",
			qualityScore: 8.0,
		},
		{
			id: "kakuda-2002",
			title:
				"Neuroprotective effects of theanine and its preventive effects on cognitive dysfunction",
			polishTitle:
				"Efekty neuroprotektorskie teaniny i jej zapobiegające efekty na dysfunkcję poznawczą",
			authors: [
				"Kakuda T",
				"Nochi H",
				"Sawada H",
				"Amano I",
				"Maruyama N",
				"Kuroyanagi A",
			],
			journal: "Bioscience, Biotechnology, and Biochemistry",
			year: 2002,
			studyType: "IN_VITRO",
			primaryOutcome: "Neuroprotective effects",
			polishPrimaryOutcome: "Efekty neuroprotektorskie",
			findings:
				"L-theanine shows neuroprotective effects against glutamate neurotoxicity",
			polishFindings:
				"L-teanina wykazuje efekty neuroprotektorskie przeciw neurotoksyczności glutaminianu",
			evidenceLevel: "WEAK",
			lastUpdated: "2024-01-15T00:00:00Z",
			pubmedId: "12523634",
			doi: "10.1271/bbb.66.2876",
			sampleSize: 0,
			qualityScore: 6.0,
		},
	],

	// Metadata
	tags: [
		"amino acid",
		"anxiety reduction",
		"stress relief",
		"cognitive enhancement",
		"relaxation",
		"gabaergic",
		"sleep",
	],
	lastUpdated: "2024-01-15T00:00:00Z",
	createdAt: "2024-01-15T00:00:00Z",

	// Additional fields for Prisma compatibility
	knowledgeNodeId: null,
};

export const lTheanineData = lTheanineProfile;
export default lTheanineProfile;
