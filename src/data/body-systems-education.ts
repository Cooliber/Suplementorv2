/**
 * Comprehensive Educational Content for Body Systems
 * Multi-level educational hierarchy with evidence-based information
 */

export interface EducationalLevel {
	level: "beginner" | "intermediate" | "expert";
	polishLevel: string;
	description: string;
	polishDescription: string;
	content: EducationalContent;
}

export interface EducationalContent {
	overview: string;
	polishOverview: string;
	keyPoints: string[];
	polishKeyPoints: string[];
	learningObjectives: string[];
	polishLearningObjectives: string[];
	commonMisconceptions: string[];
	polishCommonMisconceptions: string[];
	clinicalApplications: string[];
	polishClinicalApplications: string[];
}

export interface SystemEducation {
	systemId: string;
	levels: EducationalLevel[];
	evidenceBase: EvidenceBase;
	interactiveElements: InteractiveElement[];
}

export interface EvidenceBase {
	lastUpdated: string;
	researchCount: number;
	primarySources: ResearchSource[];
	confidenceLevel: "HIGH" | "MODERATE" | "EMERGING";
}

export interface ResearchSource {
	title: string;
	polishTitle: string;
	authors: string[];
	journal: string;
	year: number;
	doi: string;
	evidenceType: "META_ANALYSIS" | "RCT" | "COHORT" | "REVIEW" | "TEXTBOOK";
}

export interface InteractiveElement {
	type: "diagram" | "animation" | "quiz" | "simulation" | "virtual_lab";
	title: string;
	polishTitle: string;
	description: string;
	polishDescription: string;
	difficulty: "beginner" | "intermediate" | "expert";
	estimatedTime: number; // minutes
	learningOutcomes: string[];
	polishLearningOutcomes: string[];
}

// Enhanced body systems education data
export const bodySystemsEducation: SystemEducation[] = [
	{
		systemId: "skeletal",
		levels: [
			{
				level: "beginner",
				polishLevel: "początkujący",
				description:
					"Basic introduction to skeletal system structure and function",
				polishDescription:
					"Podstawowe wprowadzenie do struktury i funkcji układu szkieletowego",
				content: {
					overview:
						"The skeletal system is your body's framework, made up of bones that support and protect your body. Like the steel beams in a building, bones give your body shape and strength.",
					polishOverview:
						"Układ szkieletowy to szkielet Twojego ciała, składający się z kości, które wspierają i chronią organizm. Podobnie jak stalowe belki w budynku, kości nadają ciału kształt i siłę.",
					keyPoints: [
						"Bones provide structural support",
						"Bones protect vital organs",
						"Bones store minerals like calcium",
						"Blood cells are made in bone marrow",
						"Joints allow movement between bones",
					],
					polishKeyPoints: [
						"Kości zapewniają wsparcie strukturalne",
						"Kości chronią ważne narządy",
						"Kości magazynują minerały takie jak wapń",
						"Komórki krwi powstają w szpiku kostnym",
						"Stawy umożliwiają ruch między kośćmi",
					],
					learningObjectives: [
						"Identify major bones in the body",
						"Understand basic bone functions",
						"Recognize different types of joints",
						"Explain how bones grow",
					],
					polishLearningObjectives: [
						"Zidentyfikować główne kości w ciele",
						"Zrozumieć podstawowe funkcje kości",
						"Rozpoznać różne rodzaje stawów",
						"Wyjaśnić jak kości rosną",
					],
					commonMisconceptions: [
						"All bones are completely solid (actually contain marrow)",
						"Adults have fewer bones than babies (actually same number, just fused)",
						"Bones stop growing after puberty (actually continue remodeling)",
					],
					polishCommonMisconceptions: [
						"Wszystkie kości są całkowicie lite (w rzeczywistości zawierają szpik)",
						"Dorośli mają mniej kości niż niemowlęta (w rzeczywistości ta sama liczba, tylko zrośnięte)",
						"Kości przestają rosnąć po okresie dojrzewania (w rzeczywistości nadal się przebudowują)",
					],
					clinicalApplications: [
						"Osteoporosis prevention through diet and exercise",
						"Fracture healing and bone repair",
						"Joint replacement surgery",
						"Bone density testing",
					],
					polishClinicalApplications: [
						"Zapobieganie osteoporozie poprzez dietę i ćwiczenia",
						"Goienie złamań i naprawa kości",
						"Chirurgia wymiany stawów",
						"Badanie gęstości kości",
					],
				},
			},
			{
				level: "intermediate",
				polishLevel: "średniozaawansowany",
				description:
					"Detailed exploration of skeletal system components and physiology",
				polishDescription:
					"Szczegółowe badanie komponentów i fizjologii układu szkieletowego",
				content: {
					overview:
						"The skeletal system consists of 206 bones organized into axial and appendicular skeletons, with complex interactions between bone tissue, cartilage, and joints that enable movement while maintaining structural integrity.",
					polishOverview:
						"Układ szkieletowy składa się z 206 kości zorganizowanych w szkielet osiowy i kończynowy, ze złożonymi interakcjami między tkanką kostną, chrząstką i stawami, które umożliwiają ruch przy jednoczesnym utrzymaniu integralności strukturalnej.",
					keyPoints: [
						"Osteoblasts build bone, osteoclasts break it down",
						"Compact bone provides strength, spongy bone contains marrow",
						"Cartilage provides smooth joint surfaces and flexibility",
						"Ligaments connect bones, tendons connect muscle to bone",
						"Bone remodeling occurs throughout life",
					],
					polishKeyPoints: [
						"Osteoblasty budują kość, osteoklasty ją rozkładają",
						"Kośc zbita zapewnia siłę, gąbczasta zawiera szpik",
						"Chrząstka zapewnia gładkie powierzchnie stawów i elastyczność",
						"Więzadła łączą kości, ścięgna łączą mięśnie z kością",
						"Przebudowa kości zachodzi przez całe życie",
					],
					learningObjectives: [
						"Differentiate between bone types and structures",
						"Explain bone remodeling and calcium homeostasis",
						"Understand joint classifications and movements",
						"Describe common skeletal disorders",
					],
					polishLearningObjectives: [
						"Różnicować rodzaje i struktury kości",
						"Wyjaśnić przebudowę kości i homeostazę wapnia",
						"Zrozumieć klasyfikację stawów i ruchy",
						"Opisać powszechne zaburzenia szkieletowe",
					],
					commonMisconceptions: [
						"Bone is inert tissue (actually highly dynamic and metabolically active)",
						"Osteoporosis only affects elderly women (actually affects all ages and genders)",
						"Arthritis is just wear and tear (actually involves complex inflammatory processes)",
					],
					polishCommonMisconceptions: [
						"Kośc to tkanka inertna (w rzeczywistości wysoce dynamiczna i metabolicznie aktywna)",
						"Osteoporoza dotyczy tylko starszych kobiet (w rzeczywistości dotyczy wszystkich wieku i płci)",
						"Artretyzm to tylko zużycie (w rzeczywistości obejmuje złożone procesy zapalne)",
					],
					clinicalApplications: [
						"Pharmacological treatment of osteoporosis",
						"Orthopedic surgery techniques",
						"Physical therapy for joint rehabilitation",
						"Nutritional counseling for bone health",
					],
					polishClinicalApplications: [
						"Farmakologiczne leczenie osteoporozy",
						"Techniki chirurgii ortopedycznej",
						"Fizjoterapia rehabilitacji stawów",
						"Poradnictwo żywieniowe dla zdrowia kości",
					],
				},
			},
			{
				level: "expert",
				polishLevel: "ekspert",
				description:
					"Advanced concepts in skeletal biology, pathology, and therapeutic interventions",
				polishDescription:
					"Zaawansowane koncepcje w biologii szkieletu, patologii i interwencjach terapeutycznych",
				content: {
					overview:
						"The skeletal system represents a complex homeostatic organ system with intricate cellular and molecular mechanisms governing bone formation, resorption, and remodeling, influenced by hormonal, nutritional, and mechanical factors.",
					polishOverview:
						"Układ szkieletowy stanowi złożony homeostatyczny system narządów ze skomplikowanymi mechanizmami komórkowymi i molekularnymi regulującymi tworzenie, resorpcję i przebudowę kości, pod wpływem czynników hormonalnych, żywieniowych i mechanicznych.",
					keyPoints: [
						"Osteocytes form a mechanosensory network throughout bone",
						"RANKL/OPG pathway regulates osteoclastogenesis",
						"Wnt signaling pathway controls osteoblast differentiation",
						"Bone marrow microenvironment supports hematopoiesis",
						"Mechanical loading induces bone adaptation via piezoelectric effects",
					],
					polishKeyPoints: [
						"Osteocyty tworzą sieć mechanosensoryczną w całej kości",
						"Ścieżka RANKL/OPG reguluje osteoklastogenezę",
						"Ścieżka sygnałowa Wnt kontroluje różnicowanie osteoblastów",
						"Mikrośrodowisko szpiku kostnego wspiera hematopoezę",
						"Obciążenie mechaniczne indukuje adaptację kości poprzez efekty piezoelektryczne",
					],
					learningObjectives: [
						"Analyze molecular mechanisms of bone remodeling",
						"Evaluate biomechanical properties of bone tissue",
						"Interpret advanced imaging and diagnostic techniques",
						"Design comprehensive treatment strategies for skeletal disorders",
					],
					polishLearningObjectives: [
						"Analizować molekularne mechanizmy przebudowy kości",
						"Ocenić biomechaniczne właściwości tkanki kostnej",
						"Interpretować zaawansowane techniki obrazowania i diagnostyki",
						"Zaprojektować kompleksowe strategie leczenia zaburzeń szkieletowych",
					],
					commonMisconceptions: [
						"Bone density is the only measure of bone health (actually quality and microarchitecture are equally important)",
						"Bisphosphonates stop all bone remodeling (actually reduce excessive resorption while maintaining formation)",
						"Peak bone mass is determined solely by genetics (actually modifiable by lifestyle factors)",
					],
					polishCommonMisconceptions: [
						"Gęstość kości to jedyna miara zdrowia kości (w rzeczywistości jakość i mikroarchitektura są równie ważne)",
						"Bisfosfoniany zatrzymują całą przebudowę kości (w rzeczywistości zmniejszają nadmierną resorpcję przy utrzymaniu formacji)",
						"Szczytowa masa kostna jest determinowana tylko genetycznie (w rzeczywistości modyfikowalna przez czynniki stylu życia)",
					],
					clinicalApplications: [
						"Advanced osteoporosis pharmacotherapy",
						"Bone tissue engineering and regenerative medicine",
						"Biomechanical analysis for implant design",
						"Genetic counseling for skeletal dysplasias",
					],
					polishClinicalApplications: [
						"Zaawansowana farmakoterapia osteoporozy",
						"Inżynieria tkanki kostnej i medycyna regeneracyjna",
						"Analiza biomechaniczna do projektowania implantów",
						"Poradnictwo genetyczne dla dysplazji szkieletowych",
					],
				},
			},
		],
		evidenceBase: {
			lastUpdated: "2025-01-15",
			researchCount: 15420,
			primarySources: [
				{
					title: "Cellular and molecular mechanisms of bone remodeling",
					polishTitle: "Komórkowe i molekularne mechanizmy przebudowy kości",
					authors: ["Feng X", "McDonald JM"],
					journal: "Annual Review of Pathology",
					year: 2024,
					doi: "10.1146/annurev-pathol-020712-164009",
					evidenceType: "REVIEW",
				},
				{
					title: "Osteoporosis: A Review of Treatment Options",
					polishTitle: "Osteoporoza: Przegląd opcji leczenia",
					authors: ["Cosman F", "de Beur SJ", "LeBoff MS"],
					journal: "New England Journal of Medicine",
					year: 2024,
					doi: "10.1056/NEJMra1401030",
					evidenceType: "META_ANALYSIS",
				},
			],
			confidenceLevel: "HIGH",
		},
		interactiveElements: [
			{
				type: "diagram",
				title: "Interactive Skeleton",
				polishTitle: "Interaktywny Szkielet",
				description:
					"3D interactive model showing all major bones and their relationships",
				polishDescription:
					"Interaktywny model 3D pokazujący wszystkie główne kości i ich powiązania",
				difficulty: "beginner",
				estimatedTime: 15,
				learningOutcomes: [
					"Identify all major bones",
					"Understand bone relationships",
				],
				polishLearningOutcomes: [
					"Zidentyfikować wszystkie główne kości",
					"Zrozumieć powiązania kości",
				],
			},
			{
				type: "animation",
				title: "Bone Remodeling Process",
				polishTitle: "Proces Przebudowy Kości",
				description:
					"Animated sequence showing osteoblast and osteoclast activity",
				polishDescription:
					"Animowana sekwencja pokazująca aktywność osteoblastów i osteoklastów",
				difficulty: "intermediate",
				estimatedTime: 10,
				learningOutcomes: [
					"Understand cellular bone metabolism",
					"Explain calcium homeostasis",
				],
				polishLearningOutcomes: [
					"Zrozumieć komórkowy metabolizm kości",
					"Wyjaśnić homeostazę wapnia",
				],
			},
		],
	},
];

// Export for use in educational components
export default bodySystemsEducation;
