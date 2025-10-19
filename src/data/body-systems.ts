// Data structure for human body systems
export interface BodySystem {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	organs: Organ[];
	functions: string[];
	polishFunctions: string[];
	relatedSupplements: RelatedSupplement[];
	anatomicalInfo: AnatomicalInfo;
}

export interface Organ {
	id: string;
	name: string;
	polishName: string;
	description: string;
	polishDescription: string;
	functions: string[];
	polishFunctions: string[];
}

export interface RelatedSupplement {
	supplementId: string;
	supplementName: string;
	polishSupplementName: string;
	effectType: "SUPPORTS" | "ENHANCES" | "PROTECTS" | "REGULATES";
	intensity: number; // 0.0 to 1.0
	mechanism: string;
	polishMechanism: string;
	evidenceLevel: "STRONG" | "MODERATE" | "WEAK" | "INSUFFICIENT";
}

export interface AnatomicalInfo {
	location: string;
	polishLocation: string;
	connections: string[];
	polishConnections: string[];
	clinicalRelevance: string;
	polishClinicalRelevance: string;
}

// Body systems data
export const bodySystems: BodySystem[] = [
	{
		id: "endocannabinoid",
		name: "Endocannabinoid System",
		polishName: "Układ endokannabinoidowy",
		description:
			"The endocannabinoid system (ECS) is a complex cell-signaling system identified in the early 1990s. It plays a crucial role in regulating a range of functions and processes, including sleep, mood, appetite, memory, reproduction, and pain sensation.",
		polishDescription:
			"Układ endokannabinoidowy (ECS) to złożony system sygnalizacji komórkowej zidentyfikowany na początku lat 90. Odgrywa kluczową rolę w regulacji wielu funkcji i procesów, w tym snu, nastroju, apetytu, pamięci, rozmnażania i odczuwania bólu.",
		organs: [
			{
				id: "brain",
				name: "Brain",
				polishName: "Mózg",
				description:
					"The brain contains high concentrations of CB1 receptors, particularly in regions responsible for cognition, memory, anxiety, pain perception, and motor coordination.",
				polishDescription:
					"Mózg zawiera wysokie stężenia receptorów CB1, szczególnie w regionach odpowiedzialnych za poznanie, pamięć, lęk, percepcję bólu i koordynację ruchową.",
				functions: [
					"Cognitive processing",
					"Memory formation",
					"Emotional regulation",
					"Pain modulation",
				],
				polishFunctions: [
					"Przetwarzanie poznawcze",
					"Tworzenie wspomnień",
					"Regulacja emocjonalna",
					"Modulacja bólu",
				],
			},
			{
				id: "immune_cells",
				name: "Immune Cells",
				polishName: "Komórki odpornościowe",
				description:
					"Immune cells express primarily CB2 receptors, which when activated help regulate inflammation and immune response throughout the body.",
				polishDescription:
					"Komórki odpornościowe wyrażają głównie receptory CB2, które po aktywacji pomagają regulować stan zapalny i odpowiedź immunologiczną w całym organizmie.",
				functions: [
					"Inflammation regulation",
					"Immune response modulation",
					"Cytokine production control",
				],
				polishFunctions: [
					"Regulacja stanu zapalnego",
					"Modulacja odpowiedzi immunologicznej",
					"Kontrola produkcji cytokin",
				],
			},
			{
				id: "peripheral_nervous_system",
				name: "Peripheral Nervous System",
				polishName: "Obwodowy układ nerwowy",
				description:
					"The peripheral nervous system contains both CB1 and CB2 receptors that help regulate pain sensation, muscle control, and autonomic functions.",
				polishDescription:
					"Obwodowy układ nerwowy zawiera zarówno receptory CB1, jak i CB2, które pomagają regulować odczuwanie bólu, kontrolę mięśni i funkcje autonomiczne.",
				functions: [
					"Pain signal transmission",
					"Muscle tone regulation",
					"Autonomic function control",
				],
				polishFunctions: [
					"Transmisja sygnałów bólu",
					"Regulacja napięcia mięśniowego",
					"Kontrola funkcji autonomicznych",
				],
			},
		],
		functions: [
			"Homeostasis maintenance",
			"Stress response regulation",
			"Appetite and metabolism control",
			"Pain perception modulation",
			"Immune system regulation",
			"Mood and emotional processing",
			"Sleep regulation",
			"Memory and learning modulation",
		],
		polishFunctions: [
			"Utrzymanie homeostazy",
			"Regulacja odpowiedzi na stres",
			"Kontrola apetytu i metabolizmu",
			"Modulacja percepcji bólu",
			"Regulacja układu odpornościowego",
			"Przetwarzanie nastroju i emocji",
			"Regulacja snu",
			"Modulacja pamięci i uczenia się",
		],
		relatedSupplements: [
			{
				supplementId: "cbd-oil",
				supplementName: "CBD Oil",
				polishSupplementName: "Olej CBD",
				effectType: "REGULATES",
				intensity: 0.8,
				mechanism:
					"Interacts with endocannabinoid receptors without direct binding, modulating receptor signaling and enhancing endocannabinoid tone",
				polishMechanism:
					"Oddziałuje z receptorami endokannabinoidowymi bez bezpośredniego wiązania, modulując sygnalizację receptorową i wzmacniając ton endokannabinoidowy",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "omega-3",
				supplementName: "Omega-3 Fatty Acids",
				polishSupplementName: "Kwasy tłuszczowe Omega-3",
				effectType: "SUPPORTS",
				intensity: 0.7,
				mechanism:
					"Serves as precursors for endocannabinoid synthesis and enhances receptor sensitivity",
				polishMechanism:
					"Służy jako prekursor do syntezy endokannabinoidów i zwiększa wrażliwość receptorów",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "palmitoylethanolamide",
				supplementName: "Palmitoylethanolamide (PEA)",
				polishSupplementName: "Palmitoiloetanolamid (PEA)",
				effectType: "ENHANCES",
				intensity: 0.75,
				mechanism:
					"Enhances endocannabinoid activity through the 'entourage effect' and reduces endocannabinoid degradation",
				polishMechanism:
					"Wzmacnia aktywność endokannabinoidową poprzez 'efekt otoczenia' i zmniejsza degradację endokannabinoidów",
				evidenceLevel: "MODERATE",
			},
		],
		anatomicalInfo: {
			location:
				"Throughout the central and peripheral nervous systems, immune system, and various organs",
			polishLocation:
				"W całym ośrodkowym i obwodowym układzie nerwowym, układzie odpornościowym i różnych narządach",
			connections: [
				"Nervous System",
				"Immune System",
				"Digestive System",
				"Endocrine System",
			],
			polishConnections: [
				"Układ nerwowy",
				"Układ odpornościowy",
				"Układ pokarmowy",
				"Układ hormonalny",
			],
			clinicalRelevance:
				"Dysregulation of the endocannabinoid system has been linked to various conditions including chronic pain, inflammation, anxiety, depression, neurodegenerative disorders, and metabolic syndromes",
			polishClinicalRelevance:
				"Zaburzenia regulacji układu endokannabinoidowego są powiązane z różnymi schorzeniami, w tym przewlekłym bólem, stanem zapalnym, lękiem, depresją, chorobami neurodegeneracyjnymi i zespołami metabolicznymi",
		},
	},
	{
		id: "cardiovascular",
		name: "Cardiovascular System",
		polishName: "Układ sercowo-naczyniowy",
		description:
			"The cardiovascular system consists of the heart, blood vessels, and blood. It transports oxygen, nutrients, hormones, and cellular waste throughout the body.",
		polishDescription:
			"Układ sercowo-naczyniowy składa się z serca, naczyń krwionośnych i krwi. Transportuje tlen, składniki odżywcze, hormony i odpady komórkowe po całym organizmie.",
		organs: [
			{
				id: "heart",
				name: "Heart",
				polishName: "Serce",
				description:
					"A muscular organ that pumps blood through the circulatory system by rhythmic contraction and dilation.",
				polishDescription:
					"Narząd mięśniowy, który pompuje krew przez układ krążenia poprzez rytmiczne skurcze i rozszerzanie.",
				functions: [
					"Pumps blood",
					"Maintains blood pressure",
					"Regulates circulation",
				],
				polishFunctions: [
					"Pompuje krew",
					"Utrzymuje ciśnienie krwi",
					"Reguluje krążenie",
				],
			},
			{
				id: "arteries",
				name: "Arteries",
				polishName: "Tętnice",
				description:
					"Blood vessels that carry oxygenated blood away from the heart to the body's tissues.",
				polishDescription:
					"Naczynia krwionośne, które transportują natlenioną krew z serca do tkanek organizmu.",
				functions: [
					"Transport oxygenated blood",
					"Regulate blood pressure",
					"Distribute nutrients",
				],
				polishFunctions: [
					"Transport natlenionej krwi",
					"Regulacja ciśnienia krwi",
					"Dystrybucja składników odżywczych",
				],
			},
			{
				id: "veins",
				name: "Veins",
				polishName: "Żyły",
				description:
					"Blood vessels that carry deoxygenated blood from the tissues back to the heart.",
				polishDescription:
					"Naczynia krwionośne, które transportują odtlenioną krew z tkanek z powrotem do serca.",
				functions: [
					"Return blood to heart",
					"Store blood volume",
					"Regulate body temperature",
				],
				polishFunctions: [
					"Powrót krwi do serca",
					"Przechowywanie objętości krwi",
					"Regulacja temperatury ciała",
				],
			},
		],
		functions: [
			"Blood circulation",
			"Oxygen and nutrient delivery",
			"Waste removal",
			"Hormone transport",
			"Temperature regulation",
		],
		polishFunctions: [
			"Krążenie krwi",
			"Dostarczanie tlenu i składników odżywczych",
			"Usuwanie odpadów",
			"Transport hormonów",
			"Regulacja temperatury",
		],
		relatedSupplements: [
			{
				supplementId: "coenzyme-q10",
				supplementName: "Coenzyme Q10",
				polishSupplementName: "Koenzym Q10",
				effectType: "SUPPORTS",
				intensity: 0.8,
				mechanism: "Supports cellular energy production in heart muscle",
				polishMechanism:
					"Wspiera produkcję energii komórkowej w mięśniu sercowym",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "omega-3",
				supplementName: "Omega-3 Fatty Acids",
				polishSupplementName: "Kwasy tłuszczowe Omega-3",
				effectType: "PROTECTS",
				intensity: 0.9,
				mechanism: "Reduces inflammation and improves endothelial function",
				polishMechanism: "Zmniejsza stan zapalny i poprawia funkcję śródbłonka",
				evidenceLevel: "STRONG",
			},
		],
		anatomicalInfo: {
			location: "Thoracic cavity and throughout the body",
			polishLocation: "Jama klatki piersiowej i całe ciało",
			connections: [
				"Respiratory System",
				"Lymphatic System",
				"Digestive System",
			],
			polishConnections: [
				"Układ oddechowy",
				"Układ limfatyczny",
				"Układ pokarmowy",
			],
			clinicalRelevance:
				"Critical for overall health; dysfunction leads to cardiovascular diseases",
			polishClinicalRelevance:
				"Kluczowy dla ogólnego zdrowia; dysfunkcja prowadzi do chorób sercowo-naczyniowych",
		},
	},
	{
		id: "digestive",
		name: "Digestive System",
		polishName: "Układ pokarmowy",
		description:
			"The digestive system breaks down food into nutrients that can be absorbed and used by the body, while eliminating waste products.",
		polishDescription:
			"Układ pokarmowy rozkłada pokarm na składniki odżywcze, które mogą być wchłaniane i wykorzystywane przez organizm, jednocześnie eliminując produkty odpadowe.",
		organs: [
			{
				id: "stomach",
				name: "Stomach",
				polishName: "Żołądek",
				description:
					"A muscular, hollow organ that is part of the digestive system where initial protein digestion occurs.",
				polishDescription:
					"Mięśniowy, pusty narząd, który jest częścią układu pokarmowego, gdzie zachodzi wstępne trawienie białek.",
				functions: [
					"Food storage",
					"Initial digestion",
					"Acid secretion",
					"Protein breakdown",
				],
				polishFunctions: [
					"Przechowywanie pokarmu",
					"Wstępne trawienie",
					"Wydzielanie kwasu",
					"Rozkład białek",
				],
			},
			{
				id: "liver",
				name: "Liver",
				polishName: "Wątroba",
				description:
					"The largest internal organ that performs hundreds of essential functions including detoxification and metabolism.",
				polishDescription:
					"Największy narząd wewnętrzny, który wykonuje setki niezbędnych funkcji, w tym detoksykację i metabolizm.",
				functions: [
					"Detoxification",
					"Protein synthesis",
					"Bile production",
					"Glycogen storage",
				],
				polishFunctions: [
					"Detoksykacja",
					"Synteza białek",
					"Produkcja żółci",
					"Magazynowanie glikogenu",
				],
			},
			{
				id: "intestines",
				name: "Intestines",
				polishName: "Jelita",
				description:
					"Long, coiled tube where most nutrient absorption occurs (small intestine) and where waste is processed (large intestine).",
				polishDescription:
					"Długa, zwinięta rura, gdzie zachodzi większość wchłaniania składników odżywczych (jelito cienkie) i gdzie przetwarzane są odpady (jelito grube).",
				functions: [
					"Nutrient absorption",
					"Water absorption",
					"Waste processing",
					"Hosting gut microbiome",
				],
				polishFunctions: [
					"Wchłanianie składników odżywczych",
					"Wchłanianie wody",
					"Przetwarzanie odpadów",
					"Utrzymywanie mikrobioty jelitowej",
				],
			},
		],
		functions: [
			"Food breakdown",
			"Nutrient absorption",
			"Waste elimination",
			"Detoxification",
			"Microbiome maintenance",
		],
		polishFunctions: [
			"Rozkład pokarmu",
			"Wchłanianie składników odżywczych",
			"Eliminacja odpadów",
			"Detoksykacja",
			"Utrzymanie mikrobioty",
		],
		relatedSupplements: [
			{
				supplementId: "probiotics",
				supplementName: "Probiotics",
				polishSupplementName: "Probiotyki",
				effectType: "SUPPORTS",
				intensity: 0.8,
				mechanism: "Supports healthy gut microbiome and digestive function",
				polishMechanism:
					"Wspiera zdrową mikrobiotę jelitową i funkcję trawienną",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "digestive-enzymes",
				supplementName: "Digestive Enzymes",
				polishSupplementName: "Enzymy trawienne",
				effectType: "ENHANCES",
				intensity: 0.7,
				mechanism: "Enhances breakdown of macronutrients for better absorption",
				polishMechanism:
					"Wzmacnia rozkład makroskładników dla lepszego wchłaniania",
				evidenceLevel: "MODERATE",
			},
		],
		anatomicalInfo: {
			location: "Abdominal and pelvic cavities",
			polishLocation: "Jama brzuszna i miedniczna",
			connections: [
				"Cardiovascular System",
				"Endocrine System",
				"Nervous System",
			],
			polishConnections: [
				"Układ sercowo-naczyniowy",
				"Układ endokrynny",
				"Układ nerwowy",
			],
			clinicalRelevance:
				"Essential for nutrient processing; dysfunction leads to digestive disorders",
			polishClinicalRelevance:
				"Niezbędny do przetwarzania składników odżywczych; dysfunkcja prowadzi do zaburzeń trawiennych",
		},
	},
	{
		id: "immune",
		name: "Immune System",
		polishName: "Układ odpornościowy",
		description:
			"The immune system is a complex network of cells, tissues, and organs that defends the body against pathogens and maintains overall health.",
		polishDescription:
			"Układ odpornościowy to złożona sieć komórek, tkanek i narządów, która broni organizm przed patogenami i utrzymuje ogólne zdrowie.",
		organs: [
			{
				id: "thymus",
				name: "Thymus",
				polishName: "Grasica",
				description:
					"A specialized primary lymphoid organ where T cells mature and develop self-tolerance.",
				polishDescription:
					"Wyspecjalizowany pierwotny narząd limfatyczny, w którym dojrzewają limfocyty T i rozwija się tolerancja na własne antygeny.",
				functions: [
					"T cell maturation",
					"Self-tolerance development",
					"Immune education",
				],
				polishFunctions: [
					"Dojrzewanie limfocytów T",
					"Rozwój tolerancji na własne antygeny",
					"Edukacja immunologiczna",
				],
			},
			{
				id: "spleen",
				name: "Spleen",
				polishName: "Śledziona",
				description:
					"The largest secondary lymphoid organ that filters blood and houses various immune cells.",
				polishDescription:
					"Największy wtórny narząd limfatyczny, który filtruje krew i zawiera różne komórki odpornościowe.",
				functions: [
					"Blood filtration",
					"Immune cell storage",
					"Antibody production",
					"Old red blood cell removal",
				],
				polishFunctions: [
					"Filtracja krwi",
					"Przechowywanie komórek odpornościowych",
					"Produkcja przeciwciał",
					"Usuwanie starych czerwonych krwinek",
				],
			},
			{
				id: "lymph-nodes",
				name: "Lymph Nodes",
				polishName: "Węzły chłonne",
				description:
					"Small, bean-shaped structures that filter lymph fluid and contain immune cells that fight infection.",
				polishDescription:
					"Małe, fasolowate struktury, które filtrują płyn limfatyczny i zawierają komórki odpornościowe zwalczające infekcje.",
				functions: [
					"Lymph filtration",
					"Pathogen trapping",
					"Immune cell activation",
					"Antibody production",
				],
				polishFunctions: [
					"Filtracja limfy",
					"Wyłapywanie patogenów",
					"Aktywacja komórek odpornościowych",
					"Produkcja przeciwciał",
				],
			},
		],
		functions: [
			"Pathogen defense",
			"Immune surveillance",
			"Inflammation regulation",
			"Tissue repair",
			"Tolerance maintenance",
		],
		polishFunctions: [
			"Obrona przed patogenami",
			"Nadzór immunologiczny",
			"Regulacja stanu zapalnego",
			"Naprawa tkanek",
			"Utrzymanie tolerancji",
		],
		relatedSupplements: [
			{
				supplementId: "vitamin-c",
				supplementName: "Vitamin C",
				polishSupplementName: "Witamina C",
				effectType: "SUPPORTS",
				intensity: 0.8,
				mechanism: "Supports immune cell function and antioxidant defense",
				polishMechanism:
					"Wspiera funkcję komórek odpornościowych i obronę antyoksydacyjną",
				evidenceLevel: "STRONG",
			},
			{
				supplementId: "zinc",
				supplementName: "Zinc",
				polishSupplementName: "Cynk",
				effectType: "ENHANCES",
				intensity: 0.7,
				mechanism: "Enhances immune cell development and function",
				polishMechanism: "Wzmacnia rozwój i funkcję komórek odpornościowych",
				evidenceLevel: "STRONG",
			},
		],
		anatomicalInfo: {
			location: "Distributed throughout the body",
			polishLocation: "Rozmieszczony w całym organizmie",
			connections: [
				"Lymphatic System",
				"Cardiovascular System",
				"Nervous System",
			],
			polishConnections: [
				"Układ limfatyczny",
				"Układ sercowo-naczyniowy",
				"Układ nerwowy",
			],
			clinicalRelevance:
				"Critical for defense against pathogens; dysfunction leads to immunodeficiency or autoimmunity",
			polishClinicalRelevance:
				"Kluczowy dla obrony przed patogenami; dysfunkcja prowadzi do niedoboru odporności lub autoimmunizacji",
		},
	},
	{
		id: "skeletal",
		name: "Skeletal System",
		polishName: "Układ szkieletowy",
		description:
			"The skeletal system provides structural support, protects internal organs, facilitates movement, stores minerals, and produces blood cells. It consists of bones, cartilage, ligaments, and joints.",
		polishDescription:
			"Układ szkieletowy zapewnia wsparcie strukturalne, chroni narządy wewnętrzne, umożliwia ruch, magazynuje minerały i produkuje komórki krwi. Składa się z kości, chrząstki, więzadeł i stawów.",
		organs: [
			{
				id: "bones",
				name: "Bones",
				polishName: "Kości",
				description:
					"Rigid organs that form the skeleton, providing support, protection, and serving as attachment points for muscles.",
				polishDescription:
					"Sztywne narządy tworzące szkielet, zapewniające wsparcie, ochronę i służące jako punkty przyczepu dla mięśni.",
				functions: [
					"Structural support",
					"Organ protection",
					"Movement facilitation",
					"Mineral storage",
					"Blood cell production",
				],
				polishFunctions: [
					"Wsparcie strukturalne",
					"Ochrona narządów",
					"Umożliwienie ruchu",
					"Magazynowanie minerałów",
					"Produkcja komórek krwi",
				],
			},
			{
				id: "joints",
				name: "Joints",
				polishName: "Stawy",
				description:
					"Connections between bones that allow for movement and flexibility while maintaining stability.",
				polishDescription:
					"Połączenia między kośćmi, które umożliwiają ruch i elastyczność przy jednoczesnym utrzymaniu stabilności.",
				functions: [
					"Movement articulation",
					"Load transmission",
					"Shock absorption",
					"Stability maintenance",
				],
				polishFunctions: [
					"Artykulacja ruchu",
					"Transmisja obciążenia",
					"Absorpcja wstrząsów",
					"Utrzymanie stabilności",
				],
			},
			{
				id: "cartilage",
				name: "Cartilage",
				polishName: "Chrząstka",
				description:
					"Flexible connective tissue that covers bone ends, provides cushioning, and supports structures like the nose and ears.",
				polishDescription:
					"Elastyczna tkanka łączna, która pokrywa końce kości, zapewnia amortyzację i wspiera struktury takie jak nos i uszy.",
				functions: [
					"Joint cushioning",
					"Bone growth support",
					"Structural flexibility",
					"Shock absorption",
				],
				polishFunctions: [
					"Amortyzacja stawów",
					"Wsparcie wzrostu kości",
					"Elastyczność strukturalna",
					"Absorpcja wstrząsów",
				],
			},
		],
		functions: [
			"Structural support",
			"Organ protection",
			"Movement facilitation",
			"Mineral storage",
			"Blood cell production",
			"Calcium homeostasis",
		],
		polishFunctions: [
			"Wsparcie strukturalne",
			"Ochrona narządów",
			"Umożliwienie ruchu",
			"Magazynowanie minerałów",
			"Produkcja komórek krwi",
			"Homeostaza wapnia",
		],
		relatedSupplements: [
			{
				supplementId: "calcium",
				supplementName: "Calcium",
				polishSupplementName: "Wapń",
				effectType: "SUPPORTS",
				intensity: 0.9,
				mechanism: "Essential mineral for bone formation and maintenance",
				polishMechanism: "Nieodzowny minerał do tworzenia i utrzymania kości",
				evidenceLevel: "STRONG",
			},
			{
				supplementId: "vitamin-d3",
				supplementName: "Vitamin D3",
				polishSupplementName: "Witamina D3",
				effectType: "ENHANCES",
				intensity: 0.8,
				mechanism: "Promotes calcium absorption and bone mineralization",
				polishMechanism: "Promuje wchłanianie wapnia i mineralizację kości",
				evidenceLevel: "STRONG",
			},
			{
				supplementId: "magnesium",
				supplementName: "Magnesium",
				polishSupplementName: "Magnez",
				effectType: "SUPPORTS",
				intensity: 0.7,
				mechanism: "Required for bone density and calcium metabolism",
				polishMechanism: "Wymagany do gęstości kości i metabolizmu wapnia",
				evidenceLevel: "MODERATE",
			},
		],
		anatomicalInfo: {
			location: "Throughout the entire body",
			polishLocation: "W całym organizmie",
			connections: [
				"Muscular System",
				"Nervous System",
				"Cardiovascular System",
			],
			polishConnections: [
				"Układ mięśniowy",
				"Układ nerwowy",
				"Układ sercowo-naczyniowy",
			],
			clinicalRelevance:
				"Essential for structural integrity; disorders affect mobility and organ protection",
			polishClinicalRelevance:
				"Niezbędny dla integralności strukturalnej; zaburzenia wpływają na mobilność i ochronę narządów",
		},
	},
	{
		id: "muscular",
		name: "Muscular System",
		polishName: "Układ mięśniowy",
		description:
			"The muscular system enables movement, maintains posture, generates heat, and supports circulation. It consists of skeletal, smooth, and cardiac muscle tissue.",
		polishDescription:
			"Układ mięśniowy umożliwia ruch, utrzymuje postawę, generuje ciepło i wspiera krążenie. Składa się z tkanki mięśniowej szkieletowej, gładkiej i sercowej.",
		organs: [
			{
				id: "skeletal-muscles",
				name: "Skeletal Muscles",
				polishName: "Mięśnie szkieletowe",
				description:
					"Voluntary muscles attached to bones that enable conscious movement and maintain posture.",
				polishDescription:
					"Mięśnie dowolne przyczepione do kości, które umożliwiają świadomy ruch i utrzymują postawę.",
				functions: [
					"Voluntary movement",
					"Posture maintenance",
					"Heat generation",
					"Joint stability",
				],
				polishFunctions: [
					"Ruch dowolny",
					"Utrzymanie postawy",
					"Generowanie ciepła",
					"Stabilność stawów",
				],
			},
			{
				id: "smooth-muscles",
				name: "Smooth Muscles",
				polishName: "Mięśnie gładkie",
				description:
					"Involuntary muscles found in organs and blood vessels that control automatic functions.",
				polishDescription:
					"Mięśnie mimowolne występujące w narządach i naczyniach krwionośnych, kontrolujące funkcje automatyczne.",
				functions: [
					"Organ function regulation",
					"Blood vessel control",
					"Digestive motility",
					"Pupil adjustment",
				],
				polishFunctions: [
					"Regulacja funkcji narządów",
					"Kontrola naczyń krwionośnych",
					"Ruchliwość trawienna",
					"Dostosowanie źrenicy",
				],
			},
			{
				id: "cardiac-muscle",
				name: "Cardiac Muscle",
				polishName: "Mięsień sercowy",
				description:
					"Specialized muscle tissue that forms the heart and contracts rhythmically to pump blood.",
				polishDescription:
					"Wyspecjalizowana tkanka mięśniowa tworząca serce, która kurczy się rytmicznie, aby pompować krew.",
				functions: [
					"Blood pumping",
					"Cardiac conduction",
					"Automaticity maintenance",
					"Contractile force regulation",
				],
				polishFunctions: [
					"Pompownie krwi",
					"Przewodzenie sercowe",
					"Utrzymanie automatyzmu",
					"Regulacja siły skurczu",
				],
			},
		],
		functions: [
			"Body movement",
			"Posture maintenance",
			"Heat production",
			"Organ function support",
			"Circulation assistance",
		],
		polishFunctions: [
			"Ruch ciała",
			"Utrzymanie postawy",
			"Produkcja ciepła",
			"Wsparcie funkcji narządów",
			"Pomoc w krążeniu",
		],
		relatedSupplements: [
			{
				supplementId: "protein",
				supplementName: "Protein",
				polishSupplementName: "Białko",
				effectType: "SUPPORTS",
				intensity: 0.8,
				mechanism:
					"Provides amino acids essential for muscle repair and growth",
				polishMechanism:
					"Dostarcza aminokwasów niezbędnych do naprawy i wzrostu mięśni",
				evidenceLevel: "STRONG",
			},
			{
				supplementId: "creatine",
				supplementName: "Creatine",
				polishSupplementName: "Kreatyna",
				effectType: "ENHANCES",
				intensity: 0.8,
				mechanism: "Increases muscle energy production and performance",
				polishMechanism: "Zwiększa produkcję energii mięśniowej i wydolność",
				evidenceLevel: "STRONG",
			},
			{
				supplementId: "beta-alanine",
				supplementName: "Beta-Alanine",
				polishSupplementName: "Beta-Alanina",
				effectType: "ENHANCES",
				intensity: 0.7,
				mechanism: "Buffers acid in muscles, delaying fatigue",
				polishMechanism: "Buforuje kwas w mięśniach, opóźniając zmęczenie",
				evidenceLevel: "MODERATE",
			},
		],
		anatomicalInfo: {
			location: "Attached to skeletal system throughout the body",
			polishLocation: "Przyczepione do układu szkieletowego w całym ciele",
			connections: [
				"Skeletal System",
				"Nervous System",
				"Cardiovascular System",
			],
			polishConnections: [
				"Układ szkieletowy",
				"Układ nerwowy",
				"Układ sercowo-naczyniowy",
			],
			clinicalRelevance:
				"Critical for movement and metabolism; dysfunction affects mobility and organ function",
			polishClinicalRelevance:
				"Kluczowy dla ruchu i metabolizmu; dysfunkcja wpływa na mobilność i funkcję narządów",
		},
	},
	{
		id: "respiratory",
		name: "Respiratory System",
		polishName: "Układ oddechowy",
		description:
			"The respiratory system facilitates gas exchange between the body and environment, maintains acid-base balance, and supports vocalization. It includes the lungs, airways, and respiratory muscles.",
		polishDescription:
			"Układ oddechowy ułatwia wymianę gazową między organizmem a środowiskiem, utrzymuje równowagę kwasowo-zasadową i wspiera wokalizację. Obejmuje płuca, drogi oddechowe i mięśnie oddechowe.",
		organs: [
			{
				id: "lungs",
				name: "Lungs",
				polishName: "Płuca",
				description:
					"Paired organs responsible for gas exchange, oxygenating blood and removing carbon dioxide.",
				polishDescription:
					"Sparowane narządy odpowiedzialne za wymianę gazową, natlenianie krwi i usuwanie dwutlenku węgla.",
				functions: [
					"Gas exchange",
					"Oxygen delivery",
					"Carbon dioxide removal",
					"Acid-base regulation",
				],
				polishFunctions: [
					"Wymiana gazowa",
					"Dostarczanie tlenu",
					"Usuwanie dwutlenku węgla",
					"Regulacja równowagi kwasowo-zasadowej",
				],
			},
			{
				id: "airways",
				name: "Airways",
				polishName: "Drogi oddechowe",
				description:
					"Passageways that conduct air from the nose/mouth to the lungs, including trachea, bronchi, and bronchioles.",
				polishDescription:
					"Przejścia prowadzące powietrze z nosa/ust do płuc, w tym tchawica, oskrzela i oskrzeliki.",
				functions: [
					"Air conduction",
					"Particle filtration",
					"Air humidification",
					"Temperature regulation",
				],
				polishFunctions: [
					"Przewodzenie powietrza",
					"Filtrowanie cząstek",
					"Nawilżanie powietrza",
					"Regulacja temperatury",
				],
			},
			{
				id: "respiratory-muscles",
				name: "Respiratory Muscles",
				polishName: "Mięśnie oddechowe",
				description:
					"Muscles including the diaphragm and intercostal muscles that facilitate breathing movements.",
				polishDescription:
					"Mięśnie, w tym przepona i mięśnie międzyżebrowe, które ułatwiają ruchy oddechowe.",
				functions: [
					"Inhalation facilitation",
					"Exhalation assistance",
					"Breathing regulation",
					"Cough generation",
				],
				polishFunctions: [
					"Ułatwienie wdechu",
					"Pomoc w wydechu",
					"Regulacja oddychania",
					"Generowanie kaszlu",
				],
			},
		],
		functions: [
			"Gas exchange",
			"Oxygen delivery",
			"Carbon dioxide removal",
			"Acid-base balance",
			"Vocalization support",
		],
		polishFunctions: [
			"Wymiana gazowa",
			"Dostarczanie tlenu",
			"Usuwanie dwutlenku węgla",
			"Równowaga kwasowo-zasadowa",
			"Wsparcie wokalizacji",
		],
		relatedSupplements: [
			{
				supplementId: "vitamin-c",
				supplementName: "Vitamin C",
				polishSupplementName: "Witamina C",
				effectType: "SUPPORTS",
				intensity: 0.7,
				mechanism: "Supports lung tissue integrity and immune function",
				polishMechanism:
					"Wspiera integralność tkanki płucnej i funkcję odpornościową",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "n-acetylcysteine",
				supplementName: "N-Acetylcysteine",
				polishSupplementName: "N-Acetylocysteina",
				effectType: "PROTECTS",
				intensity: 0.8,
				mechanism: "Mucolytic agent that supports respiratory mucus clearance",
				polishMechanism:
					"Środek mukolityczny wspierający oczyszczanie śluzu oddechowego",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "magnesium",
				supplementName: "Magnesium",
				polishSupplementName: "Magnez",
				effectType: "SUPPORTS",
				intensity: 0.6,
				mechanism:
					"Relaxes bronchial smooth muscle and supports respiratory function",
				polishMechanism:
					"Rozluźnia gładkie mięśnie oskrzeli i wspiera funkcję oddechową",
				evidenceLevel: "MODERATE",
			},
		],
		anatomicalInfo: {
			location: "Thoracic cavity",
			polishLocation: "Jama klatki piersiowej",
			connections: ["Cardiovascular System", "Immune System", "Nervous System"],
			polishConnections: [
				"Układ sercowo-naczyniowy",
				"Układ odpornościowy",
				"Układ nerwowy",
			],
			clinicalRelevance:
				"Essential for oxygenation; dysfunction leads to respiratory failure",
			polishClinicalRelevance:
				"Niezbędny do natleniania; dysfunkcja prowadzi do niewydolności oddechowej",
		},
	},
	{
		id: "nervous",
		name: "Nervous System",
		polishName: "Układ nerwowy",
		description:
			"The nervous system coordinates body activities, processes sensory information, and enables cognition, emotion, and behavior. It consists of the central and peripheral nervous systems.",
		polishDescription:
			"Układ nerwowy koordynuje aktywności organizmu, przetwarza informacje sensoryczne i umożliwia poznanie, emocje i zachowanie. Składa się z ośrodkowego i obwodowego układu nerwowego.",
		organs: [
			{
				id: "brain",
				name: "Brain",
				polishName: "Mózg",
				description:
					"The central processing unit of the nervous system responsible for cognition, emotion, and motor control.",
				polishDescription:
					"Centralna jednostka przetwarzająca układu nerwowego odpowiedzialna za poznanie, emocje i kontrolę ruchową.",
				functions: [
					"Cognitive processing",
					"Emotional regulation",
					"Motor control",
					"Sensory integration",
				],
				polishFunctions: [
					"Przetwarzanie poznawcze",
					"Regulacja emocjonalna",
					"Kontrola ruchowa",
					"Integracja sensoryczna",
				],
			},
			{
				id: "spinal-cord",
				name: "Spinal Cord",
				polishName: "Rdzeń kręgowy",
				description:
					"The main pathway for information connecting the brain to the peripheral nervous system.",
				polishDescription:
					"Główna droga informacji łącząca mózg z obwodowym układem nerwowym.",
				functions: [
					"Reflex coordination",
					"Signal transmission",
					"Motor control",
					"Sensory relay",
				],
				polishFunctions: [
					"Koordynacja odruchów",
					"Transmisja sygnałów",
					"Kontrola ruchowa",
					"Przekaźnik sensoryczny",
				],
			},
			{
				id: "peripheral-nerves",
				name: "Peripheral Nerves",
				polishName: "Nerwy obwodowe",
				description:
					"Nerves extending from the central nervous system to all parts of the body, carrying sensory and motor signals.",
				polishDescription:
					"Nerwy rozciągające się od ośrodkowego układu nerwowego do wszystkich części ciała, przenoszące sygnały sensoryczne i ruchowe.",
				functions: [
					"Sensory transmission",
					"Motor innervation",
					"Autonomic regulation",
					"Reflex mediation",
				],
				polishFunctions: [
					"Transmisja sensoryczna",
					"Unerwienie ruchowe",
					"Regulacja autonomiczna",
					"Mediacja odruchów",
				],
			},
		],
		functions: [
			"Sensory processing",
			"Motor control",
			"Cognitive function",
			"Emotional regulation",
			"Homeostasis maintenance",
		],
		polishFunctions: [
			"Przetwarzanie sensoryczne",
			"Kontrola ruchowa",
			"Funkcja poznawcza",
			"Regulacja emocjonalna",
			"Utrzymanie homeostazy",
		],
		relatedSupplements: [
			{
				supplementId: "omega-3-fatty-acids",
				supplementName: "Omega-3 Fatty Acids",
				polishSupplementName: "Kwasy tłuszczowe Omega-3",
				effectType: "SUPPORTS",
				intensity: 0.8,
				mechanism:
					"Supports neuronal membrane integrity and reduces neuroinflammation",
				polishMechanism:
					"Wspiera integralność błony neuronalnej i zmniejsza neurozapalenie",
				evidenceLevel: "STRONG",
			},
			{
				supplementId: "b-vitamins",
				supplementName: "B Vitamins",
				polishSupplementName: "Witaminy z grupy B",
				effectType: "ENHANCES",
				intensity: 0.7,
				mechanism:
					"Essential for neurotransmitter synthesis and nervous system function",
				polishMechanism:
					"Niezbędne do syntezy neuroprzekaźników i funkcji układu nerwowego",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "magnesium",
				supplementName: "Magnesium",
				polishSupplementName: "Magnez",
				effectType: "SUPPORTS",
				intensity: 0.7,
				mechanism: "Regulates NMDA receptors and supports nerve transmission",
				polishMechanism: "Reguluje receptory NMDA i wspiera transmisję nerwową",
				evidenceLevel: "MODERATE",
			},
		],
		anatomicalInfo: {
			location: "Central nervous system in cranial cavity and spinal canal",
			polishLocation:
				"Ośrodkowy układ nerwowy w jamie czaszki i kanale kręgowym",
			connections: ["All body systems", "Endocrine System", "Immune System"],
			polishConnections: [
				"Wszystkie układy organizmu",
				"Układ hormonalny",
				"Układ odpornościowy",
			],
			clinicalRelevance:
				"Master control system; dysfunction affects all bodily functions",
			polishClinicalRelevance:
				"Główny system kontrolny; dysfunkcja wpływa na wszystkie funkcje organizmu",
		},
	},
	{
		id: "endocrine",
		name: "Endocrine System",
		polishName: "Układ hormonalny",
		description:
			"The endocrine system regulates bodily functions through hormone secretion, controlling metabolism, growth, reproduction, and homeostasis. It consists of glands that produce and release hormones.",
		polishDescription:
			"Układ hormonalny reguluje funkcje organizmu poprzez wydzielanie hormonów, kontrolując metabolizm, wzrost, reprodukcję i homeostazę. Składa się z gruczołów produkujących i uwalniających hormony.",
		organs: [
			{
				id: "pituitary-gland",
				name: "Pituitary Gland",
				polishName: "Przysadka mózgowa",
				description:
					"The master endocrine gland that controls other endocrine glands and regulates various bodily functions.",
				polishDescription:
					"Główny gruczoł dokrewny kontrolujący inne gruczoły dokrewne i regulujący różne funkcje organizmu.",
				functions: [
					"Hormone regulation",
					"Growth control",
					"Metabolism regulation",
					"Reproductive function",
				],
				polishFunctions: [
					"Regulacja hormonów",
					"Kontrola wzrostu",
					"Regulacja metabolizmu",
					"Funkcja rozrodcza",
				],
			},
			{
				id: "thyroid-gland",
				name: "Thyroid Gland",
				polishName: "Tarczyca",
				description:
					"Gland in the neck that regulates metabolism, growth, and development through thyroid hormones.",
				polishDescription:
					"Gruczoł w szyi regulujący metabolizm, wzrost i rozwój poprzez hormony tarczycy.",
				functions: [
					"Metabolic regulation",
					"Growth support",
					"Development control",
					"Calcium homeostasis",
				],
				polishFunctions: [
					"Regulacja metaboliczna",
					"Wsparcie wzrostu",
					"Kontrola rozwoju",
					"Homeostaza wapnia",
				],
			},
			{
				id: "adrenal-glands",
				name: "Adrenal Glands",
				polishName: "Nadnercza",
				description:
					"Glands that produce stress hormones, regulate metabolism, and maintain salt/water balance.",
				polishDescription:
					"Gruczoły produkujące hormony stresu, regulujące metabolizm i utrzymujące równowagę soli/wody.",
				functions: [
					"Stress response",
					"Metabolic regulation",
					"Immune modulation",
					"Blood pressure control",
				],
				polishFunctions: [
					"Odpowiedź na stres",
					"Regulacja metaboliczna",
					"Modulacja odporności",
					"Kontrola ciśnienia krwi",
				],
			},
		],
		functions: [
			"Metabolic regulation",
			"Growth and development",
			"Reproductive control",
			"Stress response",
			"Homeostasis maintenance",
		],
		polishFunctions: [
			"Regulacja metaboliczna",
			"Wzrost i rozwój",
			"Kontrola rozrodcza",
			"Odpowiedź na stres",
			"Utrzymanie homeostazy",
		],
		relatedSupplements: [
			{
				supplementId: "iodine",
				supplementName: "Iodine",
				polishSupplementName: "Jod",
				effectType: "SUPPORTS",
				intensity: 0.9,
				mechanism: "Essential for thyroid hormone production",
				polishMechanism: "Niezbędny do produkcji hormonów tarczycy",
				evidenceLevel: "STRONG",
			},
			{
				supplementId: "vitamin-d",
				supplementName: "Vitamin D",
				polishSupplementName: "Witamina D",
				effectType: "SUPPORTS",
				intensity: 0.7,
				mechanism: "Regulates endocrine function and hormone production",
				polishMechanism: "Reguluje funkcję endokrynną i produkcję hormonów",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "zinc",
				supplementName: "Zinc",
				polishSupplementName: "Cynk",
				effectType: "SUPPORTS",
				intensity: 0.6,
				mechanism: "Essential for hormone production and endocrine function",
				polishMechanism:
					"Niezbędny do produkcji hormonów i funkcji endokrynnej",
				evidenceLevel: "MODERATE",
			},
		],
		anatomicalInfo: {
			location: "Endocrine glands distributed throughout the body",
			polishLocation: "Gruczoły dokrewne rozmieszczone w całym organizmie",
			connections: [
				"Nervous System",
				"Reproductive System",
				"Metabolic Systems",
			],
			polishConnections: [
				"Układ nerwowy",
				"Układ rozrodczy",
				"Układy metaboliczne",
			],
			clinicalRelevance:
				"Hormonal regulation affects all bodily functions; imbalance causes endocrine disorders",
			polishClinicalRelevance:
				"Regulacja hormonalna wpływa na wszystkie funkcje organizmu; brak równowagi powoduje zaburzenia endokrynne",
		},
	},
	{
		id: "reproductive",
		name: "Reproductive System",
		polishName: "Układ rozrodczy",
		description:
			"The reproductive system enables sexual reproduction, hormone production, and genetic diversity. It differs significantly between males and females but shares common functions.",
		polishDescription:
			"Układ rozrodczy umożliwia reprodukcję płciową, produkcję hormonów i różnorodność genetyczną. Różni się znacznie między mężczyznami i kobietami, ale ma wspólne funkcje.",
		organs: [
			{
				id: "gonads",
				name: "Gonads",
				polishName: "Gonady",
				description:
					"Primary reproductive organs (testes in males, ovaries in females) that produce gametes and hormones.",
				polishDescription:
					"Pierwotne narządy rozrodcze (jądra u mężczyzn, jajniki u kobiet) produkujące gamety i hormony.",
				functions: [
					"Gamete production",
					"Hormone secretion",
					"Sexual maturation",
					"Fertility maintenance",
				],
				polishFunctions: [
					"Produkcja gamet",
					"Wydzielanie hormonów",
					"Dojrzewanie płciowe",
					"Utrzymanie płodności",
				],
			},
			{
				id: "genitals",
				name: "Genitals",
				polishName: "Narządy płciowe",
				description:
					"External and internal reproductive structures that facilitate reproduction and sexual function.",
				polishDescription:
					"Zewnętrzne i wewnętrzne struktury rozrodcze ułatwiające reprodukcję i funkcję seksualną.",
				functions: [
					"Sexual intercourse",
					"Fertilization facilitation",
					"Hormone production",
					"Urinary function",
				],
				polishFunctions: [
					"Stosunek płciowy",
					"Ułatwienie zapłodnienia",
					"Produkcja hormonów",
					"Funkcja moczowa",
				],
			},
			{
				id: "accessory-glands",
				name: "Accessory Glands",
				polishName: "Gruczoły dodatkowe",
				description:
					"Glands that support reproduction (prostate, seminal vesicles in males; mammary glands in females).",
				polishDescription:
					"Gruczoły wspierające reprodukcję (prostata, pęcherzyki nasienne u mężczyzn; gruczoły sutkowe u kobiet).",
				functions: [
					"Seminal fluid production",
					"Lactation support",
					"Hormone regulation",
					"Sperm maturation",
				],
				polishFunctions: [
					"Produkcja płynu nasiennego",
					"Wsparcie laktacji",
					"Regulacja hormonów",
					"Dojrzewanie plemników",
				],
			},
		],
		functions: [
			"Gamete production",
			"Hormone regulation",
			"Sexual reproduction",
			"Genetic diversity",
			"Species continuation",
		],
		polishFunctions: [
			"Produkcja gamet",
			"Regulacja hormonów",
			"Reprodukcja płciowa",
			"Różnorodność genetyczna",
			"Kontynuacja gatunku",
		],
		relatedSupplements: [
			{
				supplementId: "zinc",
				supplementName: "Zinc",
				polishSupplementName: "Cynk",
				effectType: "SUPPORTS",
				intensity: 0.8,
				mechanism:
					"Essential for reproductive hormone production and fertility",
				polishMechanism:
					"Niezbędny do produkcji hormonów rozrodczych i płodności",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "vitamin-e",
				supplementName: "Vitamin E",
				polishSupplementName: "Witamina E",
				effectType: "PROTECTS",
				intensity: 0.6,
				mechanism: "Antioxidant protection for reproductive tissues",
				polishMechanism: "Ochrona antyoksydacyjna tkanek rozrodczych",
				evidenceLevel: "WEAK",
			},
			{
				supplementId: "selenium",
				supplementName: "Selenium",
				polishSupplementName: "Selen",
				effectType: "SUPPORTS",
				intensity: 0.6,
				mechanism: "Supports sperm production and reproductive health",
				polishMechanism: "Wspiera produkcję plemników i zdrowie rozrodcze",
				evidenceLevel: "MODERATE",
			},
		],
		anatomicalInfo: {
			location: "Pelvic region and external genitalia",
			polishLocation: "Region miedniczny i zewnętrzne narządy płciowe",
			connections: ["Endocrine System", "Nervous System", "Urinary System"],
			polishConnections: ["Układ hormonalny", "Układ nerwowy", "Układ moczowy"],
			clinicalRelevance:
				"Essential for reproduction; dysfunction affects fertility and sexual function",
			polishClinicalRelevance:
				"Niezbędny do reprodukcji; dysfunkcja wpływa na płodność i funkcję seksualną",
		},
	},
	{
		id: "integumentary",
		name: "Integumentary System",
		polishName: "Układ powłokowy",
		description:
			"The integumentary system forms the body's outer covering, providing protection, temperature regulation, and sensory information. It includes the skin and its accessory structures.",
		polishDescription:
			"Układ powłokowy tworzy zewnętrzną powłokę organizmu, zapewniając ochronę, regulację temperatury i informacje sensoryczne. Obejmuje skórę i jej struktury dodatkowe.",
		organs: [
			{
				id: "skin",
				name: "Skin",
				polishName: "Skóra",
				description:
					"The largest organ of the body that provides protection, regulates temperature, and contains sensory receptors.",
				polishDescription:
					"Największy narząd organizmu zapewniający ochronę, regulujący temperaturę i zawierający receptory sensoryczne.",
				functions: [
					"Physical barrier",
					"Temperature regulation",
					"Sensory perception",
					"Vitamin D synthesis",
				],
				polishFunctions: [
					"Bariera fizyczna",
					"Regulacja temperatury",
					"Percepcja sensoryczna",
					"Synteza witaminy D",
				],
			},
			{
				id: "hair",
				name: "Hair",
				polishName: "Włosy",
				description:
					"Filamentous structures that provide protection, insulation, and sensory functions across the body.",
				polishDescription:
					"Struktury nitkowate zapewniające ochronę, izolację i funkcje sensoryczne w całym ciele.",
				functions: [
					"Physical protection",
					"Thermal insulation",
					"Sensory detection",
					"Social signaling",
				],
				polishFunctions: [
					"Ochrona fizyczna",
					"Izolacja termiczna",
					"Wykrywanie sensoryczne",
					"Sygnalizacja społeczna",
				],
			},
			{
				id: "nails",
				name: "Nails",
				polishName: "Paznokcie",
				description:
					"Protective coverings on the ends of fingers and toes that assist with grasping and manipulation.",
				polishDescription:
					"Ochronne pokrycia na końcach palców rąk i nóg pomagające w chwytaniu i manipulacji.",
				functions: [
					"Finger protection",
					"Grasping assistance",
					"Tool manipulation",
					"Health indicator",
				],
				polishFunctions: [
					"Ochrona palców",
					"Pomoc w chwytaniu",
					"Manipulacja narzędziami",
					"Wskaźnik zdrowia",
				],
			},
		],
		functions: [
			"Physical protection",
			"Temperature regulation",
			"Sensory perception",
			"Vitamin D synthesis",
			"Immune defense",
		],
		polishFunctions: [
			"Ochrona fizyczna",
			"Regulacja temperatury",
			"Percepcja sensoryczna",
			"Synteza witaminy D",
			"Obrona immunologiczna",
		],
		relatedSupplements: [
			{
				supplementId: "collagen",
				supplementName: "Collagen",
				polishSupplementName: "Kolagen",
				effectType: "SUPPORTS",
				intensity: 0.8,
				mechanism: "Major structural protein in skin, hair, and nails",
				polishMechanism:
					"Główne białko strukturalne w skórze, włosach i paznokciach",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "vitamin-c",
				supplementName: "Vitamin C",
				polishSupplementName: "Witamina C",
				effectType: "ENHANCES",
				intensity: 0.7,
				mechanism: "Essential for collagen synthesis and skin health",
				polishMechanism: "Niezbędna do syntezy kolagenu i zdrowia skóry",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "biotin",
				supplementName: "Biotin",
				polishSupplementName: "Biotyna",
				effectType: "SUPPORTS",
				intensity: 0.7,
				mechanism: "Supports hair and nail growth and strength",
				polishMechanism: "Wspiera wzrost i siłę włosów oraz paznokci",
				evidenceLevel: "MODERATE",
			},
		],
		anatomicalInfo: {
			location: "External covering of the entire body",
			polishLocation: "Zewnętrzna powłoka całego ciała",
			connections: ["Immune System", "Nervous System", "Endocrine System"],
			polishConnections: [
				"Układ odpornościowy",
				"Układ nerwowy",
				"Układ hormonalny",
			],
			clinicalRelevance:
				"First line of defense; reflects overall health and provides diagnostic information",
			polishClinicalRelevance:
				"Pierwsza linia obrony; odzwierciedla ogólny stan zdrowia i dostarcza informacji diagnostycznych",
		},
	},
	{
		id: "lymphatic",
		name: "Lymphatic System",
		polishName: "Układ limfatyczny",
		description:
			"The lymphatic system is a network of tissues, vessels and organs that work together to move lymph fluid back into the bloodstream and fight infections. It plays a crucial role in immune function and fluid balance.",
		polishDescription:
			"Układ limfatyczny to sieć tkanek, naczyń i narządów, które współpracują, aby przemieszczać płyn limfatyczny z powrotem do krwiobiegu i zwalczać infekcje. Odgrywa kluczową rolę w funkcji odpornościowej i równowadze płynów.",
		organs: [
			{
				id: "lymph-nodes",
				name: "Lymph Nodes",
				polishName: "Węzły chłonne",
				description:
					"Small, bean-shaped structures that filter lymph fluid and contain immune cells that fight infection.",
				polishDescription:
					"Małe, fasolowate struktury, które filtrują płyn limfatyczny i zawierają komórki odpornościowe zwalczające infekcje.",
				functions: [
					"Lymph filtration",
					"Pathogen trapping",
					"Immune cell activation",
					"Antibody production",
				],
				polishFunctions: [
					"Filtracja limfy",
					"Wyłapywanie patogenów",
					"Aktywacja komórek odpornościowych",
					"Produkcja przeciwciał",
				],
			},
			{
				id: "spleen",
				name: "Spleen",
				polishName: "Śledziona",
				description:
					"The largest lymphatic organ that filters blood, stores blood cells, and produces lymphocytes.",
				polishDescription:
					"Największy narząd limfatyczny, który filtruje krew, magazynuje komórki krwi i produkuje limfocyty.",
				functions: [
					"Blood filtration",
					"Immune cell storage",
					"Red blood cell processing",
					"Platelet storage",
				],
				polishFunctions: [
					"Filtracja krwi",
					"Magazynowanie komórek odpornościowych",
					"Przetwarzanie czerwonych krwinek",
					"Magazynowanie płytek krwi",
				],
			},
			{
				id: "thymus",
				name: "Thymus",
				polishName: "Grasica",
				description:
					"A specialized organ where T lymphocytes mature and develop immunological competence.",
				polishDescription:
					"Wyspecjalizowany narząd, w którym limfocyty T dojrzewają i rozwijają kompetencje immunologiczne.",
				functions: [
					"T cell maturation",
					"Immune education",
					"Hormone production",
					"Self-tolerance development",
				],
				polishFunctions: [
					"Dojrzewanie limfocytów T",
					"Edukacja immunologiczna",
					"Produkcja hormonów",
					"Rozwój tolerancji na własne antygeny",
				],
			},
		],
		functions: [
			"Immune defense",
			"Fluid balance maintenance",
			"Fat absorption",
			"Pathogen filtration",
			"Immune cell circulation",
		],
		polishFunctions: [
			"Obrona immunologiczna",
			"Utrzymanie równowagi płynów",
			"Wchłanianie tłuszczów",
			"Filtrowanie patogenów",
			"Krążenie komórek odpornościowych",
		],
		relatedSupplements: [
			{
				supplementId: "vitamin-c",
				supplementName: "Vitamin C",
				polishSupplementName: "Witamina C",
				effectType: "SUPPORTS",
				intensity: 0.7,
				mechanism: "Enhances immune cell function and lymphatic circulation",
				polishMechanism:
					"Wzmacnia funkcję komórek odpornościowych i krążenie limfatyczne",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "zinc",
				supplementName: "Zinc",
				polishSupplementName: "Cynk",
				effectType: "ENHANCES",
				intensity: 0.8,
				mechanism: "Essential for lymphocyte development and immune response",
				polishMechanism:
					"Niezbędny do rozwoju limfocytów i odpowiedzi immunologicznej",
				evidenceLevel: "STRONG",
			},
		],
		anatomicalInfo: {
			location: "Throughout the body, parallel to the circulatory system",
			polishLocation: "W całym organizmie, równolegle do układu krążenia",
			connections: [
				"Immune System",
				"Cardiovascular System",
				"Digestive System",
			],
			polishConnections: [
				"Układ odpornościowy",
				"Układ sercowo-naczyniowy",
				"Układ pokarmowy",
			],
			clinicalRelevance:
				"Critical for immune function and fluid balance; dysfunction leads to edema and immunodeficiency",
			polishClinicalRelevance:
				"Kluczowy dla funkcji odpornościowej i równowagi płynów; dysfunkcja prowadzi do obrzęków i niedoboru odporności",
		},
	},
	{
		id: "urinary",
		name: "Urinary System",
		polishName: "Układ moczowy",
		description:
			"The urinary system filters blood, removes waste products, and maintains fluid and electrolyte balance. It consists of the kidneys, ureters, bladder, and urethra.",
		polishDescription:
			"Układ moczowy filtruje krew, usuwa produkty odpadowe i utrzymuje równowagę płynów i elektrolitów. Składa się z nerek, moczowodów, pęcherza moczowego i cewki moczowej.",
		organs: [
			{
				id: "kidneys",
				name: "Kidneys",
				polishName: "Nerki",
				description:
					"Bean-shaped organs that filter blood, regulate fluid balance, and produce urine.",
				polishDescription:
					"Narządy w kształcie fasoli, które filtrują krew, regulują równowagę płynów i produkują mocz.",
				functions: [
					"Blood filtration",
					"Waste removal",
					"Fluid balance regulation",
					"Hormone production",
				],
				polishFunctions: [
					"Filtracja krwi",
					"Usuwanie odpadów",
					"Regulacja równowagi płynów",
					"Produkcja hormonów",
				],
			},
			{
				id: "ureters",
				name: "Ureters",
				polishName: "Moczowody",
				description:
					"Tubes that transport urine from the kidneys to the bladder.",
				polishDescription:
					"Rurki transportujące mocz z nerek do pęcherza moczowego.",
				functions: [
					"Urine transport",
					"Peristaltic movement",
					"Pressure regulation",
					"Infection prevention",
				],
				polishFunctions: [
					"Transport moczu",
					"Ruch perystaltyczny",
					"Regulacja ciśnienia",
					"Zapobieganie infekcjom",
				],
			},
			{
				id: "bladder",
				name: "Bladder",
				polishName: "Pęcherz moczowy",
				description:
					"A hollow muscular organ that stores urine until it can be excreted.",
				polishDescription:
					"Pusty narząd mięśniowy, który magazynuje mocz do czasu wydalenia.",
				functions: [
					"Urine storage",
					"Pressure sensation",
					"Voluntary control",
					"Emptying coordination",
				],
				polishFunctions: [
					"Magazynowanie moczu",
					"Odczuwanie ciśnienia",
					"Kontrola dobrowolna",
					"Koordynacja opróżniania",
				],
			},
		],
		functions: [
			"Blood filtration",
			"Waste elimination",
			"Fluid balance regulation",
			"Electrolyte homeostasis",
			"Blood pressure control",
		],
		polishFunctions: [
			"Filtracja krwi",
			"Eliminacja odpadów",
			"Regulacja równowagi płynów",
			"Homeostaza elektrolitów",
			"Kontrola ciśnienia krwi",
		],
		relatedSupplements: [
			{
				supplementId: "cranberry",
				supplementName: "Cranberry Extract",
				polishSupplementName: "Ekstrakt z żurawiny",
				effectType: "PROTECTS",
				intensity: 0.7,
				mechanism: "Prevents bacterial adhesion to urinary tract walls",
				polishMechanism: "Zapobiega adhezji bakterii do ścian dróg moczowych",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "d-mannose",
				supplementName: "D-Mannose",
				polishSupplementName: "D-Mannoza",
				effectType: "SUPPORTS",
				intensity: 0.8,
				mechanism: "Helps flush bacteria from the urinary tract",
				polishMechanism: "Pomaga usuwać bakterie z dróg moczowych",
				evidenceLevel: "MODERATE",
			},
		],
		anatomicalInfo: {
			location: "Retroperitoneal space in the abdominal cavity",
			polishLocation: "Przestrzeń zaotrzewnowa w jamie brzusznej",
			connections: [
				"Cardiovascular System",
				"Endocrine System",
				"Digestive System",
			],
			polishConnections: [
				"Układ sercowo-naczyniowy",
				"Układ hormonalny",
				"Układ pokarmowy",
			],
			clinicalRelevance:
				"Essential for waste removal and homeostasis; dysfunction leads to kidney failure and fluid imbalance",
			polishClinicalRelevance:
				"Niezbędny do usuwania odpadów i homeostazy; dysfunkcja prowadzi do niewydolności nerek i braku równowagi płynów",
		},
	},
	{
		id: "sensory",
		name: "Sensory System",
		polishName: "Układ zmysłowy",
		description:
			"The sensory system detects environmental stimuli and converts them into neural signals that the brain can interpret. It includes vision, hearing, taste, smell, and touch receptors.",
		polishDescription:
			"Układ zmysłowy wykrywa bodźce środowiskowe i przekształca je w sygnały neuronalne, które mózg może interpretować. Obejmuje receptory wzroku, słuchu, smaku, węchu i dotyku.",
		organs: [
			{
				id: "eyes",
				name: "Eyes",
				polishName: "Oczy",
				description:
					"Complex organs that detect light and convert it into electrical signals for vision.",
				polishDescription:
					"Złożone narządy, które wykrywają światło i przekształcają je w sygnały elektryczne dla wzroku.",
				functions: [
					"Light detection",
					"Image formation",
					"Color perception",
					"Depth perception",
				],
				polishFunctions: [
					"Wykrywanie światła",
					"Tworzenie obrazów",
					"Percepcja kolorów",
					"Percepcja głębi",
				],
			},
			{
				id: "ears",
				name: "Ears",
				polishName: "Uszy",
				description:
					"Organs responsible for hearing and balance, converting sound waves and head movements into neural signals.",
				polishDescription:
					"Narządy odpowiedzialne za słuch i równowagę, przekształcające fale dźwiękowe i ruchy głowy w sygnały neuronalne.",
				functions: [
					"Sound detection",
					"Balance maintenance",
					"Spatial orientation",
					"Frequency discrimination",
				],
				polishFunctions: [
					"Wykrywanie dźwięków",
					"Utrzymanie równowagi",
					"Orientacja przestrzenna",
					"Rozróżnianie częstotliwości",
				],
			},
			{
				id: "nose-tongue",
				name: "Nose and Tongue",
				polishName: "Nos i język",
				description:
					"Organs containing chemoreceptors for smell and taste detection.",
				polishDescription:
					"Narządy zawierające chemoreceptory do wykrywania zapachów i smaków.",
				functions: [
					"Odor detection",
					"Taste perception",
					"Chemical sensing",
					"Flavor discrimination",
				],
				polishFunctions: [
					"Wykrywanie zapachów",
					"Percepcja smaków",
					"Wykrywanie chemiczne",
					"Rozróżnianie smaków",
				],
			},
		],
		functions: [
			"Environmental monitoring",
			"Stimulus detection",
			"Neural signal conversion",
			"Perceptual integration",
			"Survival adaptation",
		],
		polishFunctions: [
			"Monitorowanie środowiska",
			"Wykrywanie bodźców",
			"Konwersja sygnałów neuronalnych",
			"Integracja percepcyjna",
			"Adaptacja do przetrwania",
		],
		relatedSupplements: [
			{
				supplementId: "lutein",
				supplementName: "Lutein",
				polishSupplementName: "Luteina",
				effectType: "PROTECTS",
				intensity: 0.8,
				mechanism: "Protects eyes from oxidative damage and blue light",
				polishMechanism:
					"Chroni oczy przed uszkodzeniami oksydacyjnymi i niebieskim światłem",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "zeaxanthin",
				supplementName: "Zeaxanthin",
				polishSupplementName: "Zeaksantyna",
				effectType: "SUPPORTS",
				intensity: 0.7,
				mechanism: "Supports visual acuity and macular health",
				polishMechanism: "Wspiera ostrość wzroku i zdrowie plamki żółtej",
				evidenceLevel: "MODERATE",
			},
		],
		anatomicalInfo: {
			location: "Head and throughout the body surface",
			polishLocation: "Głowa i powierzchnia całego ciała",
			connections: ["Nervous System", "Brain", "Peripheral receptors"],
			polishConnections: ["Układ nerwowy", "Mózg", "Receptory obwodowe"],
			clinicalRelevance:
				"Essential for environmental interaction; dysfunction affects quality of life and safety",
			polishClinicalRelevance:
				"Niezbędny do interakcji ze środowiskiem; dysfunkcja wpływa na jakość życia i bezpieczeństwo",
		},
	},
	{
		id: "vestibular",
		name: "Vestibular System",
		polishName: "Układ przedsionkowy",
		description:
			"The vestibular system provides the sense of balance and spatial orientation. It detects head movements and positions, helping maintain posture and coordinate eye movements.",
		polishDescription:
			"Układ przedsionkowy zapewnia poczucie równowagi i orientacji przestrzennej. Wykrywa ruchy i pozycje głowy, pomagając utrzymać postawę i koordynować ruchy oczu.",
		organs: [
			{
				id: "inner-ear",
				name: "Inner Ear",
				polishName: "Ucho wewnętrzne",
				description:
					"Contains the vestibular apparatus with semicircular canals and otolith organs.",
				polishDescription:
					"Zawiera aparat przedsionkowy z kanałami półkolistymi i narządami otolitowymi.",
				functions: [
					"Angular acceleration detection",
					"Linear acceleration sensing",
					"Head position monitoring",
					"Eye movement coordination",
				],
				polishFunctions: [
					"Wykrywanie przyspieszenia kątowego",
					"Wykrywanie przyspieszenia liniowego",
					"Monitorowanie pozycji głowy",
					"Koordynacja ruchów oczu",
				],
			},
			{
				id: "vestibular-nerve",
				name: "Vestibular Nerve",
				polishName: "Nerw przedsionkowy",
				description:
					"Transmits balance and spatial orientation information to the brain.",
				polishDescription:
					"Przekazuje informacje o równowadze i orientacji przestrzennej do mózgu.",
				functions: [
					"Signal transmission",
					"Balance information relay",
					"Coordination with visual system",
					"Posture adjustment",
				],
				polishFunctions: [
					"Transmisja sygnałów",
					"Przekaźnik informacji o równowadze",
					"Koordynacja z układem wzrokowym",
					"Dostosowanie postawy",
				],
			},
			{
				id: "cerebellum",
				name: "Cerebellum",
				polishName: "Móżdżek",
				description:
					"Processes vestibular information and coordinates balance and movement.",
				polishDescription:
					"Przetwarza informacje przedsionkowe i koordynuje równowagę i ruch.",
				functions: [
					"Balance coordination",
					"Movement smoothness",
					"Posture maintenance",
					"Spatial awareness",
				],
				polishFunctions: [
					"Koordynacja równowagi",
					"Płynność ruchu",
					"Utrzymanie postawy",
					"Świadomość przestrzenna",
				],
			},
		],
		functions: [
			"Balance maintenance",
			"Spatial orientation",
			"Posture control",
			"Eye-head coordination",
			"Motion sickness prevention",
		],
		polishFunctions: [
			"Utrzymanie równowagi",
			"Orientacja przestrzenna",
			"Kontrola postawy",
			"Koordynacja oczu-głowy",
			"Zapobieganie chorobie lokomocyjnej",
		],
		relatedSupplements: [
			{
				supplementId: "ginger",
				supplementName: "Ginger",
				polishSupplementName: "Imbir",
				effectType: "SUPPORTS",
				intensity: 0.7,
				mechanism: "Reduces nausea and supports vestibular function",
				polishMechanism: "Zmniejsza nudności i wspiera funkcję przedsionkową",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "magnesium",
				supplementName: "Magnesium",
				polishSupplementName: "Magnez",
				effectType: "SUPPORTS",
				intensity: 0.6,
				mechanism: "Supports nerve function and reduces vestibular symptoms",
				polishMechanism:
					"Wspiera funkcję nerwów i zmniejsza objawy przedsionkowe",
				evidenceLevel: "WEAK",
			},
		],
		anatomicalInfo: {
			location: "Inner ear and brainstem connections",
			polishLocation: "Ucho wewnętrzne i połączenia z pniem mózgu",
			connections: ["Nervous System", "Muscular System", "Visual System"],
			polishConnections: ["Układ nerwowy", "Układ mięśniowy", "Układ wzrokowy"],
			clinicalRelevance:
				"Essential for balance and coordination; dysfunction causes vertigo and imbalance",
			polishClinicalRelevance:
				"Niezbędny dla równowagi i koordynacji; dysfunkcja powoduje zawroty głowy i brak równowagi",
		},
	},
	{
		id: "hematopoietic",
		name: "Hematopoietic System",
		polishName: "Układ krwiotwórczy",
		description:
			"The hematopoietic system is responsible for blood cell production, maturation, and regulation. It includes bone marrow and other organs involved in hematopoiesis.",
		polishDescription:
			"Układ krwiotwórczy odpowiada za produkcję, dojrzewanie i regulację komórek krwi. Obejmuje szpik kostny i inne narządy zaangażowane w krwiotworzenie.",
		organs: [
			{
				id: "bone-marrow",
				name: "Bone Marrow",
				polishName: "Szpik kostny",
				description:
					"Soft tissue inside bones where blood cells are produced and matured.",
				polishDescription:
					"Miękka tkanka wewnątrz kości, gdzie produkowane i dojrzewają komórki krwi.",
				functions: [
					"Red blood cell production",
					"White blood cell formation",
					"Platelet creation",
					"Stem cell reservoir",
				],
				polishFunctions: [
					"Produkcja czerwonych krwinek",
					"Tworzenie białych krwinek",
					"Tworzenie płytek krwi",
					"Rezerwuar komórek macierzystych",
				],
			},
			{
				id: "liver-hematopoietic",
				name: "Liver",
				polishName: "Wątroba",
				description:
					"Involved in blood cell breakdown and iron recycling for new cell production.",
				polishDescription:
					"Zaangażowana w rozkład komórek krwi i recykling żelaza dla nowej produkcji komórek.",
				functions: [
					"Iron recycling",
					"Blood cell breakdown",
					"Clotting factor production",
					"Immune protein synthesis",
				],
				polishFunctions: [
					"Recykling żelaza",
					"Rozkład komórek krwi",
					"Produkcja czynników krzepnięcia",
					"Synteza białek odpornościowych",
				],
			},
			{
				id: "spleen-hematopoietic",
				name: "Spleen",
				polishName: "Śledziona",
				description:
					"Filters and removes old blood cells while storing platelets and immune cells.",
				polishDescription:
					"Filtruje i usuwa stare komórki krwi, jednocześnie magazynując płytki krwi i komórki odpornościowe.",
				functions: [
					"Old cell removal",
					"Platelet storage",
					"Immune cell reservoir",
					"Blood filtration",
				],
				polishFunctions: [
					"Usuwanie starych komórek",
					"Magazynowanie płytek krwi",
					"Rezerwuar komórek odpornościowych",
					"Filtracja krwi",
				],
			},
		],
		functions: [
			"Blood cell production",
			"Cell maturation",
			"Immune cell development",
			"Iron metabolism",
			"Oxygen transport support",
		],
		polishFunctions: [
			"Produkcja komórek krwi",
			"Dojrzewanie komórek",
			"Rozwój komórek odpornościowych",
			"Metabolizm żelaza",
			"Wsparcie transportu tlenu",
		],
		relatedSupplements: [
			{
				supplementId: "iron",
				supplementName: "Iron",
				polishSupplementName: "Żelazo",
				effectType: "SUPPORTS",
				intensity: 0.9,
				mechanism:
					"Essential for hemoglobin production and red blood cell formation",
				polishMechanism:
					"Niezbędne do produkcji hemoglobiny i tworzenia czerwonych krwinek",
				evidenceLevel: "STRONG",
			},
			{
				supplementId: "vitamin-b12",
				supplementName: "Vitamin B12",
				polishSupplementName: "Witamina B12",
				effectType: "ENHANCES",
				intensity: 0.8,
				mechanism:
					"Critical for red blood cell maturation and neurological function",
				polishMechanism:
					"Kluczowa dla dojrzewania czerwonych krwinek i funkcji neurologicznych",
				evidenceLevel: "STRONG",
			},
			{
				supplementId: "folic-acid",
				supplementName: "Folic Acid",
				polishSupplementName: "Kwas foliowy",
				effectType: "SUPPORTS",
				intensity: 0.8,
				mechanism: "Essential for DNA synthesis in blood cell production",
				polishMechanism: "Niezbędny do syntezy DNA w produkcji komórek krwi",
				evidenceLevel: "STRONG",
			},
		],
		anatomicalInfo: {
			location: "Bone marrow throughout the skeletal system",
			polishLocation: "Szpik kostny w całym układzie szkieletowym",
			connections: [
				"Skeletal System",
				"Immune System",
				"Cardiovascular System",
			],
			polishConnections: [
				"Układ szkieletowy",
				"Układ odpornościowy",
				"Układ sercowo-naczyniowy",
			],
			clinicalRelevance:
				"Essential for oxygen transport and immune function; dysfunction leads to anemia and immunodeficiency",
			polishClinicalRelevance:
				"Niezbędny dla transportu tlenu i funkcji odpornościowej; dysfunkcja prowadzi do anemii i niedoboru odporności",
		},
	},
	{
		id: "thermoregulatory",
		name: "Thermoregulatory System",
		polishName: "Układ termoregulacyjny",
		description:
			"The thermoregulatory system maintains body temperature within a narrow range optimal for cellular function. It coordinates heat production, conservation, and dissipation.",
		polishDescription:
			"Układ termoregulacyjny utrzymuje temperaturę ciała w wąskim zakresie optymalnym dla funkcji komórkowych. Koordynuje produkcję, konserwację i rozpraszanie ciepła.",
		organs: [
			{
				id: "hypothalamus",
				name: "Hypothalamus",
				polishName: "Podwzgórze",
				description:
					"Brain region that acts as the body's thermostat, regulating temperature set point.",
				polishDescription:
					"Region mózgu, który działa jako termostat organizmu, regulując punkt nastawy temperatury.",
				functions: [
					"Temperature regulation",
					"Set point control",
					"Hormone release",
					"Behavioral thermoregulation",
				],
				polishFunctions: [
					"Regulacja temperatury",
					"Kontrola punktu nastawy",
					"Uwalnianie hormonów",
					"Behawioralna termoregulacja",
				],
			},
			{
				id: "skin-thermoregulation",
				name: "Skin",
				polishName: "Skóra",
				description:
					"Contains blood vessels and sweat glands that help regulate body temperature.",
				polishDescription:
					"Zawiera naczynia krwionośne i gruczoły potowe, które pomagają regulować temperaturę ciała.",
				functions: [
					"Heat dissipation",
					"Insulation",
					"Sweat production",
					"Vasodilation/constriction",
				],
				polishFunctions: [
					"Rozpraszanie ciepła",
					"Izolacja",
					"Produkcja potu",
					"Rozszerzanie/zwązanie naczyń",
				],
			},
			{
				id: "muscles-thermoregulation",
				name: "Muscles",
				polishName: "Mięśnie",
				description:
					"Generate heat through metabolic activity and shivering thermogenesis.",
				polishDescription:
					"Generują ciepło poprzez aktywność metaboliczną i termogenezę dreszczy.",
				functions: [
					"Heat production",
					"Shivering thermogenesis",
					"Metabolic heat generation",
					"Temperature maintenance",
				],
				polishFunctions: [
					"Produkcja ciepła",
					"Termogeneza dreszczy",
					"Generowanie ciepła metabolicznego",
					"Utrzymanie temperatury",
				],
			},
		],
		functions: [
			"Core temperature maintenance",
			"Heat production regulation",
			"Heat dissipation control",
			"Thermoregulatory behavior",
			"Metabolic adaptation",
		],
		polishFunctions: [
			"Utrzymanie temperatury rdzenia",
			"Regulacja produkcji ciepła",
			"Kontrola rozpraszania ciepła",
			"Zachowanie termoregulacyjne",
			"Adaptacja metaboliczna",
		],
		relatedSupplements: [
			{
				supplementId: "iodine",
				supplementName: "Iodine",
				polishSupplementName: "Jod",
				effectType: "SUPPORTS",
				intensity: 0.7,
				mechanism:
					"Essential for thyroid function and metabolic heat production",
				polishMechanism:
					"Niezbędny dla funkcji tarczycy i metabolicznej produkcji ciepła",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "brown-fat-activators",
				supplementName: "Brown Fat Activators",
				polishSupplementName: "Aktywatory tłuszczu brunatnego",
				effectType: "ENHANCES",
				intensity: 0.6,
				mechanism:
					"Increases thermogenic capacity through brown adipose tissue",
				polishMechanism:
					"Zwiększa zdolność termogeniczną poprzez brunatną tkankę tłuszczową",
				evidenceLevel: "WEAK",
			},
		],
		anatomicalInfo: {
			location: "Central nervous system and peripheral tissues",
			polishLocation: "Ośrodkowy układ nerwowy i tkanki obwodowe",
			connections: [
				"Nervous System",
				"Endocrine System",
				"Cardiovascular System",
				"Integumentary System",
			],
			polishConnections: [
				"Układ nerwowy",
				"Układ hormonalny",
				"Układ sercowo-naczyniowy",
				"Układ powłokowy",
			],
			clinicalRelevance:
				"Critical for cellular function; dysfunction leads to hypothermia or hyperthermia",
			polishClinicalRelevance:
				"Kluczowy dla funkcji komórkowych; dysfunkcja prowadzi do hipotermii lub hipertermii",
		},
	},
	{
		id: "excretory",
		name: "Excretory System",
		polishName: "Układ wydalniczy",
		description:
			"The excretory system removes metabolic waste products and toxins from the body, maintaining chemical homeostasis. It works closely with the urinary system but focuses on waste elimination.",
		polishDescription:
			"Układ wydalniczy usuwa produkty odpadowe metabolizmu i toksyny z organizmu, utrzymując homeostazę chemiczną. Współpracuje ściśle z układem moczowym, ale skupia się na eliminacji odpadów.",
		organs: [
			{
				id: "kidneys-excretory",
				name: "Kidneys",
				polishName: "Nerki",
				description:
					"Filter blood to remove waste products, excess water, and electrolytes.",
				polishDescription:
					"Filtrują krew, aby usunąć produkty odpadowe, nadmiar wody i elektrolitów.",
				functions: [
					"Waste filtration",
					"Toxin removal",
					"pH regulation",
					"Electrolyte balance",
				],
				polishFunctions: [
					"Filtracja odpadów",
					"Usuwanie toksyn",
					"Regulacja pH",
					"Równowaga elektrolitów",
				],
			},
			{
				id: "liver-excretory",
				name: "Liver",
				polishName: "Wątroba",
				description:
					"Processes and detoxifies metabolic waste products before excretion.",
				polishDescription:
					"Przetwarza i detoksykuje produkty odpadowe metabolizmu przed wydaleniem.",
				functions: [
					"Detoxification",
					"Bile production",
					"Waste processing",
					"Nutrient recycling",
				],
				polishFunctions: [
					"Detoksykacja",
					"Produkcja żółci",
					"Przetwarzanie odpadów",
					"Recykling składników odżywczych",
				],
			},
			{
				id: "large-intestine",
				name: "Large Intestine",
				polishName: "Jelito grube",
				description:
					"Eliminates solid waste and absorbs remaining water and electrolytes.",
				polishDescription:
					"Eliminuje stałe odpady i wchłania pozostałą wodę i elektrolity.",
				functions: [
					"Water absorption",
					"Waste compaction",
					"Bacterial fermentation",
					"Electrolyte recovery",
				],
				polishFunctions: [
					"Wchłanianie wody",
					"Zagęszczanie odpadów",
					"Fermentacja bakteryjna",
					"Odzyskiwanie elektrolitów",
				],
			},
		],
		functions: [
			"Waste elimination",
			"Toxin removal",
			"Chemical homeostasis",
			"pH balance maintenance",
			"Metabolic byproduct disposal",
		],
		polishFunctions: [
			"Eliminacja odpadów",
			"Usuwanie toksyn",
			"Homeostaza chemiczna",
			"Utrzymanie równowagi pH",
			"Usuwanie produktów ubocznych metabolizmu",
		],
		relatedSupplements: [
			{
				supplementId: "milk-thistle",
				supplementName: "Milk Thistle",
				polishSupplementName: "Ostropest plamisty",
				effectType: "PROTECTS",
				intensity: 0.8,
				mechanism: "Supports liver detoxification and waste processing",
				polishMechanism: "Wspiera detoksykację wątroby i przetwarzanie odpadów",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "n-acetylcysteine",
				supplementName: "N-Acetylcysteine",
				polishSupplementName: "N-Acetylocysteina",
				effectType: "SUPPORTS",
				intensity: 0.7,
				mechanism: "Enhances glutathione production for detoxification",
				polishMechanism: "Wzmacnia produkcję glutationu dla detoksykacji",
				evidenceLevel: "MODERATE",
			},
			{
				supplementId: "fiber",
				supplementName: "Dietary Fiber",
				polishSupplementName: "Błonnik pokarmowy",
				effectType: "ENHANCES",
				intensity: 0.8,
				mechanism: "Promotes regular bowel movements and waste elimination",
				polishMechanism: "Promuje regularne wypróżnienia i eliminację odpadów",
				evidenceLevel: "STRONG",
			},
		],
		anatomicalInfo: {
			location: "Kidneys, liver, and digestive tract",
			polishLocation: "Nerki, wątroba i przewód pokarmowy",
			connections: [
				"Digestive System",
				"Urinary System",
				"Cardiovascular System",
			],
			polishConnections: [
				"Układ pokarmowy",
				"Układ moczowy",
				"Układ sercowo-naczyniowy",
			],
			clinicalRelevance:
				"Essential for removing harmful substances; dysfunction leads to toxin accumulation",
			polishClinicalRelevance:
				"Niezbędny do usuwania szkodliwych substancji; dysfunkcja prowadzi do gromadzenia się toksyn",
		},
	},
];
