/**
 * Extended Nootropics Database
 * Comprehensive profiles for cognitive enhancement supplements
 */

import type { SupplementWithRelations } from "@/types/supplement";

export const extendedNootropics: SupplementWithRelations[] = [
	{
		id: "lion-s-mane-mushroom",
		name: "Lion's Mane Mushroom",
		polishName: "Grzyb Soplówka Jeżowata",
		scientificName: "Hericium erinaceus",
		commonNames: ["Lion's Mane", "Bearded Tooth Mushroom", "Pom Pom Mushroom"],
		polishCommonNames: ["Soplówka jeżowata", "Grzyb lwie grzywy", "Hericium"],
		category: "NOOTROPIC",
		description:
			"Medicinal mushroom known for promoting nerve growth factor and cognitive enhancement",
		polishDescription:
			"Grzyb leczniczy znany z promowania czynnika wzrostu nerwów i poprawy funkcji poznawczych",

		activeCompounds: [
			{
				name: "Hericenones",
				polishName: "Hericenony",
				concentration: "0.5-2%",
				bioavailability: 75,
				halfLife: "6-8 hours",
				metabolicPathway: ["NGF synthesis", "Neuroprotection"],
				targetReceptors: ["NGF receptors", "Neurotrophic factors"],
			},
			{
				name: "Erinacines",
				polishName: "Erinacyny",
				concentration: "0.1-0.5%",
				bioavailability: 60,
				halfLife: "4-6 hours",
				metabolicPathway: ["Brain-derived neurotrophic factor"],
				targetReceptors: ["BDNF receptors"],
			},
		],

		clinicalApplications: [
			{
				condition: "Cognitive enhancement",
				polishCondition: "Poprawa funkcji poznawczych",
				indication: "Memory and cognitive function support",
				polishIndication: "Wsparcie pamięci i funkcji poznawczych",
				efficacy: "moderate",
				effectivenessRating: 7,
				evidenceLevel: "MODERATE",
				recommendedDose: "500-3000mg daily",
				duration: "8-12 weeks",
				effectSize: 0.5,
				studyCount: 12,
				participantCount: 450,
				recommendationGrade: "B",
			},
			{
				condition: "Neuroprotection",
				polishCondition: "Neuroprotekcja",
				indication: "Nerve growth factor stimulation",
				polishIndication: "Stymulacja czynnika wzrostu nerwów",
				efficacy: "moderate",
				effectivenessRating: 6,
				evidenceLevel: "MODERATE",
				recommendedDose: "1000-2000mg daily",
				duration: "12+ weeks",
				effectSize: 0.4,
				studyCount: 8,
				participantCount: 300,
				recommendationGrade: "B",
			},
		],

		mechanisms: [
			{
				id: "ngf-stimulation",
				name: "Nerve Growth Factor stimulation",
				polishName: "Stymulacja czynnika wzrostu nerwów",
				pathway: "NGF synthesis and release",
				polishPathway: "Synteza i uwalnianie NGF",
				description:
					"Lion's Mane stimulates the production of nerve growth factor (NGF), which supports neuron growth, maintenance, and cognitive function",
				polishDescription:
					"Soplówka jeżowata stymuluje produkcję czynnika wzrostu nerwów (NGF), który wspiera wzrost, utrzymanie i funkcję poznawczą neuronów",
				evidenceLevel: "STRONG",
				targetSystems: [
					"Nervous system",
					"Cognitive function",
					"Neuroplasticity",
				],
				timeToEffect: "2-4 weeks",
				duration: "Long-term with continued use",
			},
		],

		dosageGuidelines: {
			therapeuticRange: {
				min: 500,
				max: 3000,
				unit: "mg",
			},
			timing: ["with meals", "morning", "evening"],
			withFood: true,
			contraindications: ["mushroom allergies"],
			polishContraindications: ["alergie na grzyby"],
			interactions: [
				{
					substance: "Anticoagulants",
					polishSubstance: "Antykoagulanty",
					type: "antagonistic",
					severity: "moderate",
					mechanism: "Potential blood thinning effects",
					polishMechanism: "Potencjalne działanie rozrzedzające krew",
					description: "May enhance anticoagulant effects",
					polishDescription: "Może wzmacniać działanie antykoagulantów",
					clinicalSignificance: "Monitor bleeding time and consult physician",
					polishClinicalSignificance:
						"Monitorować czas krwawienia i skonsultować z lekarzem",
					recommendation: "Use with caution, monitor coagulation parameters",
					polishRecommendation:
						"Stosować ostrożnie, monitorować parametry krzepnięcia",
					evidenceLevel: "MODERATE",
				},
			],
		},

		sideEffects: [
			{
				effect: "Mild digestive discomfort",
				polishEffect: "Łagodne dolegliwości trawienne",
				frequency: "uncommon",
				severity: "mild",
				reversible: true,
				dosageDependent: true,
				timeToOnset: "1-2 hours",
				management: "Take with food, reduce dose if needed",
				polishManagement:
					"Przyjmować z jedzeniem, zmniejszyć dawkę w razie potrzeby",
			},
		],

		interactions: [
			{
				substance: "Anticoagulants",
				polishSubstance: "Antykoagulanty",
				type: "antagonistic",
				severity: "moderate",
				mechanism: "Potential blood thinning effects",
				polishMechanism: "Potencjalne działanie rozrzedzające krew",
				description: "May enhance anticoagulant effects",
				polishDescription: "Może wzmacniać działanie antykoagulantów",
				clinicalSignificance: "Monitor bleeding time and consult physician",
				polishClinicalSignificance:
					"Monitorować czas krwawienia i skonsultować z lekarzem",
				recommendation: "Use with caution, monitor coagulation parameters",
				polishRecommendation:
					"Stosować ostrożnie, monitorować parametry krzepnięcia",
				evidenceLevel: "MODERATE",
			},
			{
				substance: "Reishi Mushroom",
				polishSubstance: "Grzyb Reishi",
				type: "synergistic",
				severity: "beneficial",
				mechanism: "Complementary immune-modulating effects",
				polishMechanism: "Komplementarne działanie immunomodulujące",
				description: "May enhance immune benefits when taken together",
				polishDescription:
					"Może wzmacniać korzyści immunologiczne przy wspólnym przyjmowaniu",
				clinicalSignificance: "Can be taken together for enhanced effects",
				polishClinicalSignificance:
					"Można przyjmować razem dla wzmocnionych efektów",
				recommendation: "Safe to combine, monitor for enhanced benefits",
				polishRecommendation:
					"Bezpieczne do łączenia, monitorować wzmocnione korzyści",
				evidenceLevel: "MODERATE",
			},
		],

		evidenceLevel: "MODERATE",
		researchStudies: [
			{
				id: "mori-2009",
				title:
					"Improving effects of the mushroom Yamabushitake on mild cognitive impairment",
				polishTitle:
					"Wpływ grzyba Yamabushitake na poprawę łagodnych zaburzeń poznawczych",
				authors: ["Mori K", "Inatomi S", "Ouchi K", "Azumi Y", "Tuchida T"],
				journal: "Phytotherapy Research",
				year: 2009,
				studyType: "RANDOMIZED_CONTROLLED_TRIAL",
				primaryOutcome: "Cognitive function improvement",
				polishPrimaryOutcome: "Poprawa funkcji poznawczych",
				findings:
					"Significant improvement in cognitive function scores compared to placebo",
				polishFindings:
					"Znacząca poprawa wyników funkcji poznawczych w porównaniu z placebo",
				evidenceLevel: "MODERATE",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "18844328",
				doi: "10.1002/ptr.2634",
				sampleSize: 30,
				duration: "16 weeks",
				dosage: "1000mg daily",
				qualityScore: 8,
			},
		],

		tags: [
			"nootropic",
			"neuroprotection",
			"memory",
			"natural",
			"mushroom",
			"nerve-growth-factor",
			"cognitive-enhancement",
			"brain-health",
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},

	{
		id: "rhodiola-rosea",
		name: "Rhodiola Rosea",
		polishName: "Różeniec Górski",
		scientificName: "Rhodiola rosea",
		commonNames: ["Arctic Root", "Golden Root", "Rose Root"],
		polishCommonNames: ["Korzeń arktyczny", "Złoty korzeń", "Korzeń różany"],
		category: "ADAPTOGEN",
		description:
			"Arctic root herb known for stress adaptation and cognitive enhancement under fatigue",
		polishDescription:
			"Arktyczne zioło korzeniowe znane z adaptacji do stresu i poprawy funkcji poznawczych w zmęczeniu",

		activeCompounds: [
			{
				name: "Rosavins",
				polishName: "Rozawiny",
				concentration: "3%",
				bioavailability: 80,
				halfLife: "4-6 hours",
				metabolicPathway: ["HPA axis modulation", "Stress response"],
				targetReceptors: ["Cortisol receptors", "Stress pathways"],
			},
			{
				name: "Salidroside",
				polishName: "Salidrozyd",
				concentration: "1%",
				bioavailability: 75,
				halfLife: "3-5 hours",
				metabolicPathway: ["Antioxidant protection"],
				targetReceptors: ["Oxidative stress pathways"],
			},
		],

		clinicalApplications: [
			{
				condition: "Stress adaptation",
				polishCondition: "Adaptacja do stresu",
				indication: "Reduction of stress-related symptoms and fatigue",
				polishIndication: "Redukcja objawów związanych ze stresem i zmęczeniem",
				efficacy: "high",
				effectivenessRating: 8,
				evidenceLevel: "STRONG",
				recommendedDose: "200-600mg daily",
				duration: "4-8 weeks",
				effectSize: 0.7,
				studyCount: 45,
				participantCount: 1200,
				recommendationGrade: "A",
			},
			{
				condition: "Cognitive performance under stress",
				polishCondition: "Wydajność poznawcza pod wpływem stresu",
				indication: "Improved mental performance during stressful conditions",
				polishIndication: "Poprawa wydajności umysłowej w warunkach stresowych",
				efficacy: "moderate",
				effectivenessRating: 6,
				evidenceLevel: "MODERATE",
				recommendedDose: "300-400mg daily",
				duration: "2-4 weeks",
				effectSize: 0.5,
				studyCount: 15,
				participantCount: 600,
				recommendationGrade: "B",
			},
		],

		mechanisms: [
			{
				id: "hpa-modulation",
				name: "HPA axis modulation",
				polishName: "Modulacja osi HPA",
				pathway: "Hypothalamic-pituitary-adrenal axis regulation",
				polishPathway: "Regulacja osi podwzgórze-przysadka-nadnercza",
				description:
					"Rhodiola modulates the HPA axis to reduce cortisol response to stress while maintaining optimal cognitive function",
				polishDescription:
					"Różeniec moduluje oś HPA, aby zmniejszyć odpowiedź kortyzolu na stres, jednocześnie utrzymując optymalną funkcję poznawczą",
				evidenceLevel: "STRONG",
				targetSystems: [
					"Stress response system",
					"Cognitive function",
					"Endocrine system",
				],
				timeToEffect: "1-2 weeks",
				duration: "Chronic supplementation required",
			},
		],

		dosageGuidelines: {
			therapeuticRange: {
				min: 200,
				max: 600,
				unit: "mg",
			},
			timing: ["morning", "empty stomach"],
			withFood: false,
			contraindications: ["bipolar disorder", "sleep disorders"],
			polishContraindications: [
				"choroba afektywna dwubiegunowa",
				"zaburzenia snu",
			],
			interactions: [
				{
					substance: "Antidepressants (SSRIs, MAOIs)",
					polishSubstance: "Antydepresanty (SSRI, MAOI)",
					type: "antagonistic",
					severity: "moderate",
					mechanism: "Potential serotonin system interactions",
					polishMechanism: "Potencjalne interakcje z układem serotoninowym",
					description: "May interact with antidepressant medications",
					polishDescription:
						"Może wchodzić w interakcje z lekami antydepresyjnymi",
					clinicalSignificance:
						"Monitor for serotonin syndrome, consult physician",
					polishClinicalSignificance:
						"Monitorować zespół serotoninowy, skonsultować z lekarzem",
					recommendation: "Use with caution under medical supervision",
					polishRecommendation: "Stosować ostrożnie pod nadzorem lekarza",
					evidenceLevel: "MODERATE",
				},
			],
		},

		sideEffects: [
			{
				effect: "Insomnia if taken late",
				polishEffect: "Bezsenność przy późnym przyjmowaniu",
				frequency: "uncommon",
				severity: "mild",
				reversible: true,
				dosageDependent: true,
				timeToOnset: "4-6 hours",
				management: "Take only in morning, avoid evening doses",
				polishManagement: "Przyjmować tylko rano, unikać dawek wieczornych",
			},
			{
				effect: "Mild digestive discomfort",
				polishEffect: "Łagodne dolegliwości trawienne",
				frequency: "rare",
				severity: "mild",
				reversible: true,
				dosageDependent: true,
				timeToOnset: "30-60 minutes",
				management: "Take with small amount of food if needed",
				polishManagement: "Przyjmować z małą ilością jedzenia w razie potrzeby",
			},
		],

		interactions: [
			{
				substance: "Antidepressants (SSRIs, MAOIs)",
				polishSubstance: "Antydepresanty (SSRI, MAOI)",
				type: "antagonistic",
				severity: "moderate",
				mechanism: "Potential serotonin system interactions",
				polishMechanism: "Potencjalne interakcje z układem serotoninowym",
				description: "May interact with antidepressant medications",
				polishDescription:
					"Może wchodzić w interakcje z lekami antydepresyjnymi",
				clinicalSignificance:
					"Monitor for serotonin syndrome, consult physician",
				polishClinicalSignificance:
					"Monitorować zespół serotoninowy, skonsultować z lekarzem",
				recommendation: "Use with caution under medical supervision",
				polishRecommendation: "Stosować ostrożnie pod nadzorem lekarza",
				evidenceLevel: "MODERATE",
			},
			{
				substance: "Ashwagandha",
				polishSubstance: "Ashwagandha",
				type: "synergistic",
				severity: "beneficial",
				mechanism: "Complementary adaptogenic effects",
				polishMechanism: "Komplementarne działanie adaptogenne",
				description: "May enhance stress-reducing benefits when combined",
				polishDescription:
					"Może wzmacniać korzyści redukujące stres przy łączeniu",
				clinicalSignificance:
					"Take at different times to avoid overstimulation",
				polishClinicalSignificance:
					"Przyjmować o różnych porach, aby uniknąć nadmiernej stymulacji",
				recommendation: "Safe to combine but monitor stimulation levels",
				polishRecommendation:
					"Bezpieczne do łączenia, ale monitorować poziom stymulacji",
				evidenceLevel: "MODERATE",
			},
		],

		evidenceLevel: "STRONG",
		researchStudies: [
			{
				id: "spasov-2000",
				title:
					"A randomized trial of two different doses of a SHR-5 Rhodiola rosea extract versus placebo and control of capacity for mental work",
				polishTitle:
					"Randomizowane badanie dwóch różnych dawek ekstraktu SHR-5 Rhodiola rosea versus placebo i kontrola zdolności do pracy umysłowej",
				authors: [
					"Spasov AA",
					"Wikman GK",
					"Mandrikov VB",
					"Mironova IA",
					"Neumoin VV",
				],
				journal: "Phytomedicine",
				year: 2000,
				studyType: "RANDOMIZED_CONTROLLED_TRIAL",
				primaryOutcome: "Mental fatigue and cognitive performance",
				polishPrimaryOutcome: "Zmęczenie umysłowe i wydajność poznawcza",
				findings:
					"Significant improvement in mental fatigue and cognitive performance",
				polishFindings:
					"Znacząca poprawa zmęczenia umysłowego i wydajności poznawczej",
				evidenceLevel: "STRONG",
				lastUpdated: "2024-01-15T00:00:00Z",
				pubmedId: "11081987",
				doi: "10.1016/S0944-7113(00)80078-0",
				sampleSize: 161,
				duration: "20 days",
				dosage: "170mg daily",
				qualityScore: 8,
			},
		],

		tags: [
			"adaptogen",
			"stress",
			"fatigue",
			"energy",
			"mood",
			"endurance",
			"cognitive-performance",
			"arctic-root",
			"salidroside",
			"rosavins",
		],
		lastUpdated: "2024-01-15T00:00:00Z",
		createdAt: "2024-01-15T00:00:00Z",
	},
];

export default extendedNootropics;
