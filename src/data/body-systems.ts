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
		description: "The endocannabinoid system (ECS) is a complex cell-signaling system identified in the early 1990s. It plays a crucial role in regulating a range of functions and processes, including sleep, mood, appetite, memory, reproduction, and pain sensation.",
		polishDescription: "Układ endokannabinoidowy (ECS) to złożony system sygnalizacji komórkowej zidentyfikowany na początku lat 90. Odgrywa kluczową rolę w regulacji wielu funkcji i procesów, w tym snu, nastroju, apetytu, pamięci, rozmnażania i odczuwania bólu.",
		organs: [
			{
				id: "brain",
				name: "Brain",
				polishName: "Mózg",
				description: "The brain contains high concentrations of CB1 receptors, particularly in regions responsible for cognition, memory, anxiety, pain perception, and motor coordination.",
				polishDescription: "Mózg zawiera wysokie stężenia receptorów CB1, szczególnie w regionach odpowiedzialnych za poznanie, pamięć, lęk, percepcję bólu i koordynację ruchową.",
				functions: ["Cognitive processing", "Memory formation", "Emotional regulation", "Pain modulation"],
				polishFunctions: ["Przetwarzanie poznawcze", "Tworzenie wspomnień", "Regulacja emocjonalna", "Modulacja bólu"]
			},
			{
				id: "immune_cells",
				name: "Immune Cells",
				polishName: "Komórki odpornościowe",
				description: "Immune cells express primarily CB2 receptors, which when activated help regulate inflammation and immune response throughout the body.",
				polishDescription: "Komórki odpornościowe wyrażają głównie receptory CB2, które po aktywacji pomagają regulować stan zapalny i odpowiedź immunologiczną w całym organizmie.",
				functions: ["Inflammation regulation", "Immune response modulation", "Cytokine production control"],
				polishFunctions: ["Regulacja stanu zapalnego", "Modulacja odpowiedzi immunologicznej", "Kontrola produkcji cytokin"]
			},
			{
				id: "peripheral_nervous_system",
				name: "Peripheral Nervous System",
				polishName: "Obwodowy układ nerwowy",
				description: "The peripheral nervous system contains both CB1 and CB2 receptors that help regulate pain sensation, muscle control, and autonomic functions.",
				polishDescription: "Obwodowy układ nerwowy zawiera zarówno receptory CB1, jak i CB2, które pomagają regulować odczuwanie bólu, kontrolę mięśni i funkcje autonomiczne.",
				functions: ["Pain signal transmission", "Muscle tone regulation", "Autonomic function control"],
				polishFunctions: ["Transmisja sygnałów bólu", "Regulacja napięcia mięśniowego", "Kontrola funkcji autonomicznych"]
			}
		],
		functions: [
			"Homeostasis maintenance",
			"Stress response regulation",
			"Appetite and metabolism control",
			"Pain perception modulation",
			"Immune system regulation",
			"Mood and emotional processing",
			"Sleep regulation",
			"Memory and learning modulation"
		],
		polishFunctions: [
			"Utrzymanie homeostazy",
			"Regulacja odpowiedzi na stres",
			"Kontrola apetytu i metabolizmu",
			"Modulacja percepcji bólu",
			"Regulacja układu odpornościowego",
			"Przetwarzanie nastroju i emocji",
			"Regulacja snu",
			"Modulacja pamięci i uczenia się"
		],
		relatedSupplements: [
			{
				supplementId: "cbd-oil",
				supplementName: "CBD Oil",
				polishSupplementName: "Olej CBD",
				effectType: "REGULATES",
				intensity: 0.8,
				mechanism: "Interacts with endocannabinoid receptors without direct binding, modulating receptor signaling and enhancing endocannabinoid tone",
				polishMechanism: "Oddziałuje z receptorami endokannabinoidowymi bez bezpośredniego wiązania, modulując sygnalizację receptorową i wzmacniając ton endokannabinoidowy",
				evidenceLevel: "MODERATE"
			},
			{
				supplementId: "omega-3",
				supplementName: "Omega-3 Fatty Acids",
				polishSupplementName: "Kwasy tłuszczowe Omega-3",
				effectType: "SUPPORTS",
				intensity: 0.7,
				mechanism: "Serves as precursors for endocannabinoid synthesis and enhances receptor sensitivity",
				polishMechanism: "Służy jako prekursor do syntezy endokannabinoidów i zwiększa wrażliwość receptorów",
				evidenceLevel: "MODERATE"
			},
			{
				supplementId: "palmitoylethanolamide",
				supplementName: "Palmitoylethanolamide (PEA)",
				polishSupplementName: "Palmitoiloetanolamid (PEA)",
				effectType: "ENHANCES",
				intensity: 0.75,
				mechanism: "Enhances endocannabinoid activity through the 'entourage effect' and reduces endocannabinoid degradation",
				polishMechanism: "Wzmacnia aktywność endokannabinoidową poprzez 'efekt otoczenia' i zmniejsza degradację endokannabinoidów",
				evidenceLevel: "MODERATE"
			}
		],
		anatomicalInfo: {
			location: "Throughout the central and peripheral nervous systems, immune system, and various organs",
			polishLocation: "W całym ośrodkowym i obwodowym układzie nerwowym, układzie odpornościowym i różnych narządach",
			connections: ["Nervous System", "Immune System", "Digestive System", "Endocrine System"],
			polishConnections: ["Układ nerwowy", "Układ odpornościowy", "Układ pokarmowy", "Układ hormonalny"],
			clinicalRelevance: "Dysregulation of the endocannabinoid system has been linked to various conditions including chronic pain, inflammation, anxiety, depression, neurodegenerative disorders, and metabolic syndromes",
			polishClinicalRelevance: "Zaburzenia regulacji układu endokannabinoidowego są powiązane z różnymi schorzeniami, w tym przewlekłym bólem, stanem zapalnym, lękiem, depresją, chorobami neurodegeneracyjnymi i zespołami metabolicznymi"
		}
	},
	{
		id: "cardiovascular",
		name: "Cardiovascular System",
		polishName: "Układ sercowo-naczyniowy",
		description: "The cardiovascular system consists of the heart, blood vessels, and blood. It transports oxygen, nutrients, hormones, and cellular waste throughout the body.",
		polishDescription: "Układ sercowo-naczyniowy składa się z serca, naczyń krwionośnych i krwi. Transportuje tlen, składniki odżywcze, hormony i odpady komórkowe po całym organizmie.",
		organs: [
			{
				id: "heart",
				name: "Heart",
				polishName: "Serce",
				description: "A muscular organ that pumps blood through the circulatory system by rhythmic contraction and dilation.",
				polishDescription: "Narząd mięśniowy, który pompuje krew przez układ krążenia poprzez rytmiczne skurcze i rozszerzanie.",
				functions: ["Pumps blood", "Maintains blood pressure", "Regulates circulation"],
				polishFunctions: ["Pompuje krew", "Utrzymuje ciśnienie krwi", "Reguluje krążenie"]
			},
			{
				id: "arteries",
				name: "Arteries",
				polishName: "Tętnice",
				description: "Blood vessels that carry oxygenated blood away from the heart to the body's tissues.",
				polishDescription: "Naczynia krwionośne, które transportują natlenioną krew z serca do tkanek organizmu.",
				functions: ["Transport oxygenated blood", "Regulate blood pressure", "Distribute nutrients"],
				polishFunctions: ["Transport natlenionej krwi", "Regulacja ciśnienia krwi", "Dystrybucja składników odżywczych"]
			},
			{
				id: "veins",
				name: "Veins",
				polishName: "Żyły",
				description: "Blood vessels that carry deoxygenated blood from the tissues back to the heart.",
				polishDescription: "Naczynia krwionośne, które transportują odtlenioną krew z tkanek z powrotem do serca.",
				functions: ["Return blood to heart", "Store blood volume", "Regulate body temperature"],
				polishFunctions: ["Powrót krwi do serca", "Przechowywanie objętości krwi", "Regulacja temperatury ciała"]
			}
		],
		functions: [
			"Blood circulation",
			"Oxygen and nutrient delivery",
			"Waste removal",
			"Hormone transport",
			"Temperature regulation"
		],
		polishFunctions: [
			"Krążenie krwi",
			"Dostarczanie tlenu i składników odżywczych",
			"Usuwanie odpadów",
			"Transport hormonów",
			"Regulacja temperatury"
		],
		relatedSupplements: [
			{
				supplementId: "coenzyme-q10",
				supplementName: "Coenzyme Q10",
				polishSupplementName: "Koenzym Q10",
				effectType: "SUPPORTS",
				intensity: 0.8,
				mechanism: "Supports cellular energy production in heart muscle",
				polishMechanism: "Wspiera produkcję energii komórkowej w mięśniu sercowym",
				evidenceLevel: "MODERATE"
			},
			{
				supplementId: "omega-3",
				supplementName: "Omega-3 Fatty Acids",
				polishSupplementName: "Kwasy tłuszczowe Omega-3",
				effectType: "PROTECTS",
				intensity: 0.9,
				mechanism: "Reduces inflammation and improves endothelial function",
				polishMechanism: "Zmniejsza stan zapalny i poprawia funkcję śródbłonka",
				evidenceLevel: "STRONG"
			}
		],
		anatomicalInfo: {
			location: "Thoracic cavity and throughout the body",
			polishLocation: "Jama klatki piersiowej i całe ciało",
			connections: ["Respiratory System", "Lymphatic System", "Digestive System"],
			polishConnections: ["Układ oddechowy", "Układ limfatyczny", "Układ pokarmowy"],
			clinicalRelevance: "Critical for overall health; dysfunction leads to cardiovascular diseases",
			polishClinicalRelevance: "Kluczowy dla ogólnego zdrowia; dysfunkcja prowadzi do chorób sercowo-naczyniowych"
		}
	},
	{
		id: "digestive",
		name: "Digestive System",
		polishName: "Układ pokarmowy",
		description: "The digestive system breaks down food into nutrients that can be absorbed and used by the body, while eliminating waste products.",
		polishDescription: "Układ pokarmowy rozkłada pokarm na składniki odżywcze, które mogą być wchłaniane i wykorzystywane przez organizm, jednocześnie eliminując produkty odpadowe.",
		organs: [
			{
				id: "stomach",
				name: "Stomach",
				polishName: "Żołądek",
				description: "A muscular, hollow organ that is part of the digestive system where initial protein digestion occurs.",
				polishDescription: "Mięśniowy, pusty narząd, który jest częścią układu pokarmowego, gdzie zachodzi wstępne trawienie białek.",
				functions: ["Food storage", "Initial digestion", "Acid secretion", "Protein breakdown"],
				polishFunctions: ["Przechowywanie pokarmu", "Wstępne trawienie", "Wydzielanie kwasu", "Rozkład białek"]
			},
			{
				id: "liver",
				name: "Liver",
				polishName: "Wątroba",
				description: "The largest internal organ that performs hundreds of essential functions including detoxification and metabolism.",
				polishDescription: "Największy narząd wewnętrzny, który wykonuje setki niezbędnych funkcji, w tym detoksykację i metabolizm.",
				functions: ["Detoxification", "Protein synthesis", "Bile production", "Glycogen storage"],
				polishFunctions: ["Detoksykacja", "Synteza białek", "Produkcja żółci", "Magazynowanie glikogenu"]
			},
			{
				id: "intestines",
				name: "Intestines",
				polishName: "Jelita",
				description: "Long, coiled tube where most nutrient absorption occurs (small intestine) and where waste is processed (large intestine).",
				polishDescription: "Długa, zwinięta rura, gdzie zachodzi większość wchłaniania składników odżywczych (jelito cienkie) i gdzie przetwarzane są odpady (jelito grube).",
				functions: ["Nutrient absorption", "Water absorption", "Waste processing", "Hosting gut microbiome"],
				polishFunctions: ["Wchłanianie składników odżywczych", "Wchłanianie wody", "Przetwarzanie odpadów", "Utrzymywanie mikrobioty jelitowej"]
			}
		],
		functions: [
			"Food breakdown",
			"Nutrient absorption",
			"Waste elimination",
			"Detoxification",
			"Microbiome maintenance"
		],
		polishFunctions: [
			"Rozkład pokarmu",
			"Wchłanianie składników odżywczych",
			"Eliminacja odpadów",
			"Detoksykacja",
			"Utrzymanie mikrobioty"
		],
		relatedSupplements: [
			{
				supplementId: "probiotics",
				supplementName: "Probiotics",
				polishSupplementName: "Probiotyki",
				effectType: "SUPPORTS",
				intensity: 0.8,
				mechanism: "Supports healthy gut microbiome and digestive function",
				polishMechanism: "Wspiera zdrową mikrobiotę jelitową i funkcję trawienną",
				evidenceLevel: "MODERATE"
			},
			{
				supplementId: "digestive-enzymes",
				supplementName: "Digestive Enzymes",
				polishSupplementName: "Enzymy trawienne",
				effectType: "ENHANCES",
				intensity: 0.7,
				mechanism: "Enhances breakdown of macronutrients for better absorption",
				polishMechanism: "Wzmacnia rozkład makroskładników dla lepszego wchłaniania",
				evidenceLevel: "MODERATE"
			}
		],
		anatomicalInfo: {
			location: "Abdominal and pelvic cavities",
			polishLocation: "Jama brzuszna i miedniczna",
			connections: ["Cardiovascular System", "Endocrine System", "Nervous System"],
			polishConnections: ["Układ sercowo-naczyniowy", "Układ endokrynny", "Układ nerwowy"],
			clinicalRelevance: "Essential for nutrient processing; dysfunction leads to digestive disorders",
			polishClinicalRelevance: "Niezbędny do przetwarzania składników odżywczych; dysfunkcja prowadzi do zaburzeń trawiennych"
		}
	},
	{
		id: "immune",
		name: "Immune System",
		polishName: "Układ odpornościowy",
		description: "The immune system is a complex network of cells, tissues, and organs that defends the body against pathogens and maintains overall health.",
		polishDescription: "Układ odpornościowy to złożona sieć komórek, tkanek i narządów, która broni organizm przed patogenami i utrzymuje ogólne zdrowie.",
		organs: [
			{
				id: "thymus",
				name: "Thymus",
				polishName: "Grasica",
				description: "A specialized primary lymphoid organ where T cells mature and develop self-tolerance.",
				polishDescription: "Wyspecjalizowany pierwotny narząd limfatyczny, w którym dojrzewają limfocyty T i rozwija się tolerancja na własne antygeny.",
				functions: ["T cell maturation", "Self-tolerance development", "Immune education"],
				polishFunctions: ["Dojrzewanie limfocytów T", "Rozwój tolerancji na własne antygeny", "Edukacja immunologiczna"]
			},
			{
				id: "spleen",
				name: "Spleen",
				polishName: "Śledziona",
				description: "The largest secondary lymphoid organ that filters blood and houses various immune cells.",
				polishDescription: "Największy wtórny narząd limfatyczny, który filtruje krew i zawiera różne komórki odpornościowe.",
				functions: ["Blood filtration", "Immune cell storage", "Antibody production", "Old red blood cell removal"],
				polishFunctions: ["Filtracja krwi", "Przechowywanie komórek odpornościowych", "Produkcja przeciwciał", "Usuwanie starych czerwonych krwinek"]
			},
			{
				id: "lymph-nodes",
				name: "Lymph Nodes",
				polishName: "Węzły chłonne",
				description: "Small, bean-shaped structures that filter lymph fluid and contain immune cells that fight infection.",
				polishDescription: "Małe, fasolowate struktury, które filtrują płyn limfatyczny i zawierają komórki odpornościowe zwalczające infekcje.",
				functions: ["Lymph filtration", "Pathogen trapping", "Immune cell activation", "Antibody production"],
				polishFunctions: ["Filtracja limfy", "Wyłapywanie patogenów", "Aktywacja komórek odpornościowych", "Produkcja przeciwciał"]
			}
		],
		functions: [
			"Pathogen defense",
			"Immune surveillance",
			"Inflammation regulation",
			"Tissue repair",
			"Tolerance maintenance"
		],
		polishFunctions: [
			"Obrona przed patogenami",
			"Nadzór immunologiczny",
			"Regulacja stanu zapalnego",
			"Naprawa tkanek",
			"Utrzymanie tolerancji"
		],
		relatedSupplements: [
			{
				supplementId: "vitamin-c",
				supplementName: "Vitamin C",
				polishSupplementName: "Witamina C",
				effectType: "SUPPORTS",
				intensity: 0.8,
				mechanism: "Supports immune cell function and antioxidant defense",
				polishMechanism: "Wspiera funkcję komórek odpornościowych i obronę antyoksydacyjną",
				evidenceLevel: "STRONG"
			},
			{
				supplementId: "zinc",
				supplementName: "Zinc",
				polishSupplementName: "Cynk",
				effectType: "ENHANCES",
				intensity: 0.7,
				mechanism: "Enhances immune cell development and function",
				polishMechanism: "Wzmacnia rozwój i funkcję komórek odpornościowych",
				evidenceLevel: "STRONG"
			}
		],
		anatomicalInfo: {
			location: "Distributed throughout the body",
			polishLocation: "Rozmieszczony w całym organizmie",
			connections: ["Lymphatic System", "Cardiovascular System", "Nervous System"],
			polishConnections: ["Układ limfatyczny", "Układ sercowo-naczyniowy", "Układ nerwowy"],
			clinicalRelevance: "Critical for defense against pathogens; dysfunction leads to immunodeficiency or autoimmunity",
			polishClinicalRelevance: "Kluczowy dla obrony przed patogenami; dysfunkcja prowadzi do niedoboru odporności lub autoimmunizacji"
		}
	}
];