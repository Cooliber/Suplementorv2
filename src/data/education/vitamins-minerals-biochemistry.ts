import {
	type LearningModule,
	QuizQuestion,
	type SupplementCategory,
} from "@/types/education";

/**
 * Comprehensive Vitamin and Mineral Biochemistry Learning Module
 * Covers essential nutrients, their biochemical roles, and clinical applications
 */
export const vitaminsMineralsBiochemistryModule: LearningModule = {
	id: "vitamins_minerals_biochemistry_fundamentals",
	title: "Vitamin and Mineral Biochemistry Fundamentals",
	polishTitle: "Podstawy biochemii witamin i minerałów",
	description:
		"Comprehensive introduction to vitamins and minerals, their biochemical roles, absorption, metabolism, and clinical significance.",
	polishDescription:
		"Kompleksowe wprowadzenie do witamin i minerałów, ich roli biochemicznej, wchłaniania, metabolizmu i znaczenia klinicznego.",
	difficulty: "beginner",
	estimatedDuration: 180, // 3 hours
	category: "vitamins_minerals" as SupplementCategory,
	prerequisites: [],
	objectives: ["knowledge", "comprehension", "application"],
	content: [
		{
			id: "vitamin_classification",
			type: "text",
			title: "Vitamin Classification and Structure",
			content: `
# Vitamin Classification and Structure

Vitamins are organic compounds essential for normal physiological function, required in small amounts, and cannot be synthesized by the body in sufficient quantities.

## Fat-Soluble Vitamins

### Vitamin A (Retinoids and Carotenoids)
- **Structure**: Retinol, retinal, retinoic acid; beta-carotene (provitamin A)
- **Biochemical Forms**: Retinol (alcohol), Retinal (aldehyde), Retinoic acid (acid)
- **Storage**: Primarily in liver as retinyl esters
- **Function**: Vision (rhodopsin synthesis), cell differentiation, immune function, reproduction

### Vitamin D (Calciferol)
- **Structure**: Cholecalciferol (D3), Ergocalciferol (D2)
- **Synthesis**: D3 produced from 7-dehydrocholesterol in skin (UVB exposure)
- **Active Form**: 1,25-dihydroxyvitamin D3 (calcitriol)
- **Function**: Calcium homeostasis, bone mineralization, immune modulation

### Vitamin E (Tocopherols and Tocotrienols)
- **Structure**: 8 naturally occurring forms (4 tocopherols, 4 tocotrienols)
- **Active Form**: α-tocopherol
- **Function**: Lipid peroxidation chain breaker, membrane stabilizer
- **Regeneration**: Vitamin C regenerates oxidized vitamin E

### Vitamin K (Quinones)
- **Structure**: Phylloquinone (K1), Menaquinones (K2)
- **Function**: Coenzyme for gamma-carboxylation of glutamate residues
- **Clinical**: Essential for blood coagulation factors, bone metabolism

## Water-Soluble Vitamins

### B-Complex Vitamins

**Vitamin B1 (Thiamine)**
- **Structure**: Thiamine pyrophosphate (TPP) - active coenzyme form
- **Function**: Oxidative decarboxylation, transketolase reactions
- **Deficiency**: Beriberi, Wernicke-Korsakoff syndrome

**Vitamin B2 (Riboflavin)**
- **Structure**: Flavin mononucleotide (FMN), Flavin adenine dinucleotide (FAD)
- **Function**: Electron transport chain (Complex I and II)
- **Deficiency**: Angular cheilitis, photophobia, magenta tongue

**Vitamin B3 (Niacin)**
- **Structure**: Nicotinic acid, Nicotinamide
- **Active Forms**: NAD+, NADP+
- **Function**: Redox reactions, energy metabolism
- **Synthesis**: From tryptophan (60:1 ratio)

**Vitamin B5 (Pantothenic Acid)**
- **Structure**: Component of Coenzyme A (CoA)
- **Function**: Fatty acid synthesis, acetylation reactions
- **Ubiquitous**: Present in all foods, deficiency extremely rare

**Vitamin B6 (Pyridoxine)**
- **Structure**: Pyridoxal phosphate (PLP) - active form
- **Function**: Amino acid metabolism, neurotransmitter synthesis
- **Clinical**: Required for >100 enzymatic reactions

**Vitamin B7 (Biotin)**
- **Structure**: Biocytin (protein-bound form)
- **Function**: Carboxylation reactions (acetyl-CoA carboxylase, pyruvate carboxylase)
- **Sources**: Intestinal bacteria, dietary intake

**Vitamin B9 (Folate)**
- **Structure**: Tetrahydrofolate (THF) - active form
- **Function**: One-carbon metabolism, DNA synthesis
- **Clinical**: Neural tube defect prevention, homocysteine metabolism

**Vitamin B12 (Cobalamin)**
- **Structure**: Complex with cobalt atom
- **Function**: Methylation reactions, red blood cell formation
- **Absorption**: Requires intrinsic factor, R-protein, ileal receptors

### Vitamin C (Ascorbic Acid)
- **Structure**: Six-carbon lactone with enediol structure
- **Function**: Collagen synthesis, antioxidant, iron absorption enhancer
- **Synthesis**: Humans lack L-gulonolactone oxidase enzyme

## Essential Minerals

### Macrominerals (>100mg/day required)

**Calcium**
- **Function**: Bone structure, muscle contraction, neurotransmission
- **Absorption**: Vitamin D-dependent, parathyroid hormone regulated
- **Forms**: Hydroxyapatite in bone, free ions in solution

**Phosphorus**
- **Function**: ATP, DNA/RNA, phospholipids, bone mineralization
- **Ratio**: 1:1 with calcium in bone
- **Absorption**: Passive and active transport mechanisms

**Magnesium**
- **Function**: >300 enzymatic reactions, ATP stabilization, neuromuscular function
- **Chelation**: Forms complexes with ATP, nucleotides

**Sodium**
- **Function**: Membrane potential, fluid balance, nerve conduction
- **Regulation**: Aldosterone, antidiuretic hormone

**Potassium**
- **Function**: Intracellular cation, membrane potential, acid-base balance
- **Gradient**: Maintained by Na+/K+ ATPase

**Chloride**
- **Function**: Gastric acid formation, anion balance
- **Transport**: Follows sodium passively

**Sulfur**
- **Function**: Component of methionine, cysteine, glutathione, vitamins

### Microminerals (Trace Elements)

**Iron**
- **Forms**: Heme iron, non-heme iron
- **Function**: Oxygen transport, electron transport chain
- **Absorption**: DMT1 transporter, hepcidin regulation

**Zinc**
- **Function**: >2000 transcription factors, immune function, antioxidant enzymes
- **Structure**: Zinc fingers in DNA-binding proteins

**Copper**
- **Function**: Electron transport (cytochrome c oxidase), iron metabolism
- **Deficiency**: Menkes disease, Wilson disease (toxicity)

**Manganese**
- **Function**: Mitochondrial superoxide dismutase, bone formation
- **Toxicity**: Rare, but neurological symptoms

**Selenium**
- **Function**: Glutathione peroxidase, thyroid hormone metabolism
- **Forms**: Selenocysteine in proteins

**Iodine**
- **Function**: Thyroid hormone synthesis (T3, T4)
- **Deficiency**: Goiter, cretinism

**Molybdenum**
- **Function**: Cofactor for xanthine oxidase, sulfite oxidase
- **Deficiency**: Extremely rare

## Biochemical Interactions

### Cofactor Roles
- **Enzyme Activation**: Minerals often serve as enzyme cofactors
- **Structural Components**: Some minerals are integral to protein structure
- **Electrolyte Balance**: Maintain cellular membrane potentials

### Nutrient Interrelationships
- **Vitamin D and Calcium**: Essential for calcium absorption
- **Vitamin C and Iron**: Enhances non-heme iron absorption
- **Vitamin B6, B9, B12**: Interdependent in homocysteine metabolism
- **Zinc and Copper**: Competitive absorption relationship

### Metabolic Pathways
- **Energy Metabolism**: B vitamins essential for ATP production
- **Antioxidant Systems**: Vitamin C, E, selenium form redox network
- **Bone Metabolism**: Vitamin D, K, calcium, phosphorus, magnesium interplay
			`,
			order: 1,
			estimatedTime: 45,
			required: true,
		},
		{
			id: "mineral_metabolism",
			type: "text",
			title: "Mineral Absorption, Transport, and Metabolism",
			content: `
# Mineral Absorption, Transport, and Metabolism

Understanding how minerals are absorbed, transported, and utilized in the body is crucial for optimal supplementation strategies.

## Absorption Mechanisms

### Passive Diffusion
- **Simple Diffusion**: Movement down concentration gradient
- **Paracellular Transport**: Between epithelial cells
- **Examples**: Magnesium, calcium (minor pathway)

### Active Transport
- **Primary Active Transport**: ATP-dependent pumps
- **Secondary Active Transport**: Ion gradients drive transport
- **Examples**: Iron (DMT1), calcium (TRPV6), zinc (ZIP4)

### Facilitated Diffusion
- **Carrier Proteins**: Specific transporters
- **Examples**: Glucose transporters (GLUT family)

## Regulatory Factors

### Hormonal Regulation
- **Vitamin D**: Upregulates calcium absorption proteins
- **Parathyroid Hormone**: Increases calcium absorption, decreases phosphate reabsorption
- **Hepcidin**: Iron regulatory hormone, decreases iron absorption

### Dietary Factors
- **Enhancers**:
  - Vitamin C: Reduces iron to Fe²⁺ form
  - Citric acid: Chelates minerals
  - Amino acids: Form absorbable complexes
- **Inhibitors**:
  - Phytates: Bind minerals in insoluble complexes
  - Oxalates: Calcium binding
  - Tannins: Iron chelation
  - High fiber: Reduces transit time

## Transport and Storage

### Blood Transport
- **Free Ions**: Some minerals circulate as free ions (sodium, potassium)
- **Protein-Bound**: Albumin, transferrin, ceruloplasmin
- **Complexed Forms**: Calcium-citrate, magnesium-ATP

### Cellular Uptake
- **Ion Channels**: Voltage-gated, ligand-gated
- **Transporters**: Specific carrier proteins
- **Endocytosis**: For larger mineral complexes

### Storage Forms
- **Bone**: Calcium hydroxyapatite, phosphorus
- **Liver**: Iron (ferritin), vitamin A, copper
- **Muscle**: Magnesium, potassium
- **Adipose Tissue**: Vitamin D, some minerals

## Excretion Pathways

### Renal Excretion
- **Glomerular Filtration**: Free ions filtered
- **Tubular Reabsorption**: Regulated reabsorption
- **Examples**: Sodium (aldosterone-regulated), calcium (PTH-regulated)

### Biliary Excretion
- **Copper**: Excreted in bile
- **Manganese**: Hepatobiliary elimination

### Intestinal Excretion
- **Unabsorbed Minerals**: Direct excretion
- **Enterohepatic Circulation**: Some minerals recycled

## Bioavailability Factors

### Chemical Form
- **Organic vs Inorganic**: Organic forms often more bioavailable
- **Chelated Forms**: Amino acid chelates may enhance absorption
- **Oxidation State**: Fe²⁺ vs Fe³⁺ for iron

### Dietary Composition
- **Meal Timing**: With or without food affects absorption
- **Food Matrix**: Complex meals may reduce bioavailability
- **Processing**: Cooking can liberate or destroy nutrients

### Individual Factors
- **Age**: Absorption efficiency decreases with age
- **Health Status**: Disease states affect absorption
- **Genetic Factors**: Polymorphisms in transporters
- **Medication Interactions**: Many drugs affect mineral absorption

## Clinical Assessment

### Biomarkers
- **Serum Levels**: Immediate status indicator
- **Urinary Excretion**: Long-term intake assessment
- **Hair Analysis**: Long-term exposure (controversial)
- **Functional Tests**: Enzyme activity, physiological response

### Deficiency States
- **Subclinical**: Reduced reserves, no overt symptoms
- **Clinical**: Overt deficiency symptoms
- **Severe**: Life-threatening complications

### Toxicity Assessment
- **Upper Limits**: Tolerable upper intake levels
- **Toxicity Symptoms**: Specific to each mineral
- **Risk Groups**: Genetic disorders, organ dysfunction
			`,
			order: 2,
			estimatedTime: 40,
			required: true,
		},
		{
			id: "biochemical_functions",
			type: "interactive",
			title: "Interactive Biochemical Functions Explorer",
			content: {
				type: "interactive_diagram",
				data: {
					nutrients: [
						{
							id: "vitamin_a",
							name: "Vitamin A",
							category: "fat_solubile",
							functions: [
								"Vision",
								"Cell Differentiation",
								"Immune Function",
								"Reproduction",
							],
							pathways: [
								"Rhodopsin Cycle",
								"Retinoic Acid Signaling",
								"Immune Cell Development",
							],
							deficiency: [
								"Night Blindness",
								"Xerophthalmia",
								"Immune Deficiency",
							],
							toxicity: ["Hypervitaminosis A", "Birth Defects", "Liver Damage"],
						},
						{
							id: "vitamin_d",
							name: "Vitamin D",
							category: "fat_solubile",
							functions: [
								"Calcium Absorption",
								"Bone Mineralization",
								"Immune Modulation",
							],
							pathways: [
								"Vitamin D Receptor Signaling",
								"Calcium Transport",
								"Immune Cell Regulation",
							],
							deficiency: ["Rickets", "Osteomalacia", "Immune Disorders"],
							toxicity: [
								"Hypercalcemia",
								"Kidney Stones",
								"Soft Tissue Calcification",
							],
						},
						{
							id: "calcium",
							name: "Calcium",
							category: "macromineral",
							functions: [
								"Bone Structure",
								"Muscle Contraction",
								"Neurotransmission",
							],
							pathways: [
								"Hydroxyapatite Formation",
								"Actin-Myosin Coupling",
								"Synaptic Transmission",
							],
							deficiency: ["Osteoporosis", "Muscle Cramps", "Tetany"],
							toxicity: ["Hypercalcemia", "Kidney Stones", "Constipation"],
						},
						{
							id: "iron",
							name: "Iron",
							category: "micromineral",
							functions: [
								"Oxygen Transport",
								"Energy Production",
								"DNA Synthesis",
							],
							pathways: [
								"Hemoglobin Formation",
								"Electron Transport Chain",
								"Ribonucleotide Reductase",
							],
							deficiency: ["Anemia", "Fatigue", "Immune Deficiency"],
							toxicity: ["Hemochromatosis", "Organ Damage", "Oxidative Stress"],
						},
					],
					interactions: [
						{ from: "vitamin_d", to: "calcium", type: "enhances_absorption" },
						{ from: "vitamin_c", to: "iron", type: "enhances_absorption" },
						{ from: "calcium", to: "iron", type: "inhibits_absorption" },
						{ from: "zinc", to: "copper", type: "competitive_inhibition" },
					],
				},
				instructions:
					"Explore the interactive diagram to understand how vitamins and minerals interact in various biochemical pathways. Click on each nutrient to see detailed information about its functions, deficiency symptoms, and interactions.",
				polishInstructions:
					"Przeglądaj interaktywny diagram, aby zrozumieć, jak witaminy i minerały oddziałują w różnych szlakach biochemicznych. Kliknij na każdy składnik odżywczy, aby zobaczyć szczegółowe informacje o jego funkcjach, objawach niedoboru i interakcjach.",
			},
			order: 3,
			estimatedTime: 30,
			required: true,
		},
		{
			id: "clinical_applications",
			type: "text",
			title: "Clinical Applications and Case Studies",
			content: `
# Clinical Applications and Case Studies

Real-world applications of vitamin and mineral biochemistry in clinical practice.

## Common Clinical Scenarios

### Anemia Management
**Case Study: Iron Deficiency Anemia**
- **Patient**: 28-year-old female, vegetarian, heavy menstrual bleeding
- **Symptoms**: Fatigue, pallor, dyspnea on exertion
- **Laboratory**: Low ferritin (<12 ng/mL), low hemoglobin (10.2 g/dL)
- **Treatment**: Iron supplementation with vitamin C for enhanced absorption
- **Monitoring**: Reticulocyte count, ferritin levels
- **Outcome**: Resolution of symptoms, normalization of iron stores

**Biochemical Considerations**:
- Iron absorption enhanced by vitamin C, inhibited by calcium
- Copper required for iron utilization (ceruloplasmin)
- Vitamin B12/folate needed for erythropoiesis

### Bone Health Optimization
**Case Study: Osteoporosis Prevention**
- **Patient**: 55-year-old postmenopausal woman
- **Risk Factors**: Family history, low calcium intake, vitamin D deficiency
- **Laboratory**: Low 25(OH)D (<20 ng/mL), normal calcium
- **Treatment**: Vitamin D3 + calcium supplementation
- **Additional**: Vitamin K2 for osteocalcin carboxylation
- **Monitoring**: Bone density (DXA), 25(OH)D levels

**Biochemical Considerations**:
- Vitamin D → 1,25(OH)2D3 → increased calcium absorption
- Vitamin K2 → carboxylated osteocalcin → improved bone mineralization
- Magnesium required for vitamin D activation

### Athletic Performance Enhancement
**Case Study: Endurance Athlete**
- **Patient**: 32-year-old marathon runner
- **Goals**: Improve performance, prevent cramps, enhance recovery
- **Assessment**: Low magnesium, suboptimal iron stores
- **Supplementation**: Magnesium glycinate, iron bisglycinate
- **Additional**: B-complex for energy metabolism
- **Monitoring**: Performance metrics, blood biomarkers

**Biochemical Considerations**:
- Magnesium: ATP production, muscle contraction, lactate clearance
- Iron: Oxygen delivery, mitochondrial function
- B-vitamins: Energy metabolism, red blood cell formation

## Evidence-Based Supplementation Protocols

### General Population Guidelines

**Daily Recommended Intakes (DRI)**
- **Calcium**: 1000-1200 mg/day (age-dependent)
- **Vitamin D**: 600-2000 IU/day (depending on baseline levels)
- **Magnesium**: 310-420 mg/day (gender-dependent)
- **Iron**: 8-18 mg/day (gender and age-dependent)

**Upper Tolerable Limits (UL)**
- **Vitamin D**: 4000 IU/day
- **Calcium**: 2000-2500 mg/day
- **Iron**: 45 mg/day
- **Magnesium**: 350 mg/day (supplemental)

### Special Populations

**Pregnancy and Lactation**
- **Increased Needs**: Iron, folate, calcium, vitamin D
- **Supplementation**: Prenatal vitamins with adequate amounts
- **Monitoring**: Hemoglobin, ferritin, 25(OH)D

**Elderly Population**
- **Common Deficiencies**: Vitamin D, B12, calcium
- **Considerations**: Reduced absorption, polypharmacy
- **Supplementation**: Lower doses, frequent monitoring

**Athletes**
- **Increased Needs**: B-vitamins, iron, magnesium, calcium
- **Considerations**: Training intensity, sweat losses
- **Supplementation**: Based on individual assessment

## Monitoring and Assessment

### Laboratory Biomarkers

**Iron Status**
- **Ferritin**: Storage iron (<30 ng/mL indicates deficiency)
- **Transferrin Saturation**: Transport iron (16-50% normal)
- **Hemoglobin**: Functional iron status

**Vitamin D Status**
- **25(OH)D**: Best marker of vitamin D status (30-50 ng/mL optimal)
- **1,25(OH)2D3**: Active form, regulated by PTH and calcium

**Bone Health**
- **Calcium**: Total and ionized (8.5-10.5 mg/dL)
- **PTH**: Parathyroid hormone (10-65 pg/mL)
- **Osteocalcin**: Bone formation marker

**Antioxidant Status**
- **Vitamin E**: Alpha-tocopherol (5-18 μg/mL)
- **Selenium**: Glutathione peroxidase activity
- **Vitamin C**: Plasma ascorbic acid (>0.4 mg/dL adequate)

### Functional Assessment Tests

**Vitamin/Mineral Challenge Tests**
- **Loading Tests**: Assess absorption and utilization
- **Urinary Excretion**: Measure retention vs. excretion
- **Enzyme Activity**: Functional nutrient status

**Clinical Assessment**
- **Symptoms**: Specific deficiency manifestations
- **Physical Signs**: Dermatological, neurological, musculoskeletal
- **Dietary Analysis**: Intake vs. requirements

## Safety Considerations

### Drug-Nutrient Interactions

**Common Interactions**:
- **Antibiotics and Minerals**: Tetracycline + calcium/magnesium/iron
- **Thyroid Medication and Iron**: Levothyroxine absorption inhibition
- **Blood Pressure Medication and Potassium**: ACE inhibitors + potassium supplements

### Toxicity Syndromes

**Acute Toxicity**
- **Iron**: Gastrointestinal distress, systemic toxicity
- **Vitamin D**: Hypercalcemia, renal failure
- **Selenium**: Garlic breath, hair loss, nail changes

**Chronic Toxicity**
- **Vitamin A**: Liver damage, birth defects
- **Copper**: Wilson disease-like symptoms
- **Fluoride**: Dental fluorosis, skeletal changes

### Risk Stratification

**High-Risk Groups**:
- **Genetic Disorders**: Hemochromatosis, Wilson disease
- **Organ Dysfunction**: Renal failure, liver disease
- **Medication Users**: Multiple drug interactions
- **Pregnant Women**: Specific contraindications

## Quality and Formulation Considerations

### Supplement Quality

**Third-Party Testing**
- **USP Verified**: United States Pharmacopeia standards
- **NSF Certified**: Sport nutrition standards
- **ConsumerLab**: Independent testing and verification

**Bioavailability Comparison**
- **Iron Forms**: Ferrous bisglycinate > ferrous sulfate > ferric forms
- **Magnesium Forms**: Glycinate/citrate > oxide
- **Calcium Forms**: Citrate/malate > carbonate

### Formulation Strategies

**Enhanced Absorption**
- **Chelation**: Amino acid chelates
- **Liposomal Delivery**: Phospholipid encapsulation
- **Micronization**: Particle size reduction

**Sustained Release**
- **Benefits**: Reduced gastrointestinal distress, sustained blood levels
- **Drawbacks**: Potentially reduced absorption, higher cost

**Synergistic Combinations**
- **Vitamin D + Calcium**: Enhanced absorption and utilization
- **Vitamin C + Iron**: Improved iron absorption
- **Magnesium + B6**: Enhanced cellular uptake
			`,
			order: 4,
			estimatedTime: 45,
			required: true,
		},
		{
			id: "assessment_quiz",
			type: "quiz",
			title: "Vitamin and Mineral Biochemistry Assessment",
			content: {
				questions: [
					{
						id: "q1",
						type: "multiple_choice",
						question:
							"Which vitamin is essential for the gamma-carboxylation of clotting factors?",
						options: ["Vitamin A", "Vitamin D", "Vitamin E", "Vitamin K"],
						correctAnswer: ["Vitamin K"],
						explanation:
							"Vitamin K is required for the gamma-carboxylation of glutamate residues in clotting factors II, VII, IX, and X, as well as proteins C and S.",
						difficulty: "beginner",
						points: 1,
						tags: ["vitamins", "blood_clotting"],
					},
					{
						id: "q2",
						type: "multiple_choice",
						question:
							"What is the active form of vitamin D that regulates calcium absorption?",
						options: [
							"Cholecalciferol",
							"25-hydroxyvitamin D",
							"1,25-dihydroxyvitamin D",
							"Ergocalciferol",
						],
						correctAnswer: ["1,25-dihydroxyvitamin D"],
						explanation:
							"1,25-dihydroxyvitamin D3 (calcitriol) is the hormonally active form of vitamin D that binds to vitamin D receptors and increases intestinal calcium absorption.",
						difficulty: "intermediate",
						points: 2,
						tags: ["vitamin_d", "calcium_metabolism"],
					},
					{
						id: "q3",
						type: "multiple_choice",
						question:
							"Which mineral serves as a cofactor for over 300 enzymatic reactions?",
						options: ["Calcium", "Iron", "Magnesium", "Zinc"],
						correctAnswer: ["Magnesium"],
						explanation:
							"Magnesium is involved in over 300 enzymatic reactions including ATP-dependent phosphorylation, DNA replication, and muscle contraction.",
						difficulty: "beginner",
						points: 1,
						tags: ["minerals", "enzyme_cofactors"],
					},
					{
						id: "q4",
						type: "true_false",
						question: "Vitamin C enhances the absorption of non-heme iron.",
						options: ["True", "False"],
						correctAnswer: ["True"],
						explanation:
							"Vitamin C reduces ferric iron (Fe³⁺) to ferrous iron (Fe²⁺), which is the form that can be absorbed by the DMT1 transporter in the duodenum.",
						difficulty: "beginner",
						points: 1,
						tags: ["vitamin_c", "iron_absorption"],
					},
					{
						id: "q5",
						type: "multiple_choice",
						question:
							"Which B-vitamin is required for the conversion of homocysteine to methionine?",
						options: [
							"Vitamin B6",
							"Vitamin B9 (Folate)",
							"Vitamin B12",
							"Vitamin B2",
						],
						correctAnswer: ["Vitamin B12"],
						explanation:
							"Vitamin B12 serves as a cofactor for methionine synthase, which catalyzes the methylation of homocysteine to methionine using methyltetrahydrofolate as the methyl donor.",
						difficulty: "intermediate",
						points: 2,
						tags: ["b_vitamins", "methylation"],
					},
					{
						id: "q6",
						type: "multiple_choice",
						question: "What is the primary storage form of iron in the body?",
						options: ["Transferrin", "Ferritin", "Hemosiderin", "Hemoglobin"],
						correctAnswer: ["Ferritin"],
						explanation:
							"Ferritin is the primary iron storage protein, found mainly in the liver, spleen, and bone marrow. It can store up to 4500 iron atoms per molecule.",
						difficulty: "intermediate",
						points: 2,
						tags: ["iron_metabolism", "storage"],
					},
					{
						id: "q7",
						type: "multiple_choice",
						question:
							"Which mineral competes with copper for absorption in the small intestine?",
						options: ["Iron", "Calcium", "Zinc", "Magnesium"],
						correctAnswer: ["Zinc"],
						explanation:
							"Zinc and copper compete for the same absorption mechanism (metallothionein binding) in the small intestine, leading to potential copper deficiency with high zinc supplementation.",
						difficulty: "advanced",
						points: 3,
						tags: ["mineral_interactions", "absorption"],
					},
					{
						id: "q8",
						type: "fill_blank",
						question: "The active coenzyme form of vitamin B6 is __________.",
						options: [],
						correctAnswer: ["pyridoxal phosphate", "PLP"],
						explanation:
							"Pyridoxal phosphate (PLP) is the active coenzyme form of vitamin B6, serving as a cofactor for over 100 enzymatic reactions including transamination and decarboxylation.",
						difficulty: "intermediate",
						points: 2,
						tags: ["b_vitamins", "coenzymes"],
					},
				],
				passingScore: 70,
				timeLimit: 20,
				randomizeOrder: true,
				showResults: true,
			},
			order: 5,
			estimatedTime: 20,
			required: true,
		},
	],
	assessment: {
		type: "quiz",
		questions: [], // Will be populated with comprehensive assessment questions
		passingScore: 80,
		timeLimit: 45,
		instructions:
			"Complete this comprehensive assessment to demonstrate your understanding of vitamin and mineral biochemistry.",
		polishInstructions:
			"Ukończ tę kompleksową ocenę, aby wykazać zrozumienie biochemii witamin i minerałów.",
	},
	resources: [
		{
			id: " Linus_Pauling_Institute",
			title: "Linus Pauling Institute Micronutrient Information Center",
			type: "website",
			url: "https://lpi.oregonstate.edu/mic",
			description:
				"Comprehensive, evidence-based information on vitamins, minerals, and other micronutrients.",
			category: "vitamins_minerals",
			tags: ["research", "evidence_based", "comprehensive"],
			difficulty: "intermediate",
			quality: "high",
			evidenceLevel: "strong",
			author: "Linus Pauling Institute",
			lastVerified: "2024-09-27",
		},
		{
			id: "ods_nih",
			title: "Office of Dietary Supplements - NIH",
			type: "website",
			url: "https://ods.od.nih.gov",
			description:
				"Official government resource for dietary supplement information and research.",
			category: "vitamins_minerals",
			tags: ["government", "research", "guidelines"],
			difficulty: "beginner",
			quality: "high",
			evidenceLevel: "strong",
			author: "National Institutes of Health",
			lastVerified: "2024-09-27",
		},
	],
	metadata: {
		version: "1.0.0",
		lastUpdated: "2024-09-27",
		author: "Suplementor Education Team",
		reviewers: ["Dr. Maria Kowalski", "Prof. Jan Nowak"],
		tags: [
			"vitamins",
			"minerals",
			"biochemistry",
			"nutrition",
			"supplementation",
		],
		evidenceLevel: "high",
		citations: [
			"Institute of Medicine. Dietary Reference Intakes for Calcium and Vitamin D. 2011",
			"World Health Organization. Vitamin and Mineral Requirements in Human Nutrition. 2004",
			"Linus Pauling Institute Micronutrient Research for Optimum Health",
		],
		confidence: 9,
	},
};
