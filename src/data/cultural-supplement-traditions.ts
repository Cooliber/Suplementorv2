// Cultural Supplement Traditions and Practices in Polish Context
// Traditional Polish herbal medicine and modern supplement practices

export interface CulturalSupplementTradition {
	id: string;
	name: string;
	polishName: string;
	category:
		| "HERBAL_MEDICINE"
		| "FOLK_REMEDIES"
		| "SEASONAL_PRACTICES"
		| "LIFE_STAGE_TRADITIONS"
		| "OCCUPATIONAL_PRACTICES";
	description: string;
	polishDescription: string;
	historicalOrigin: string;
	polishHistoricalOrigin: string;
	currentPractice: string;
	polishCurrentPractice: string;
	regionalVariations: RegionalVariation[];
	modernAdaptations: ModernAdaptation[];
	supplementConnections: SupplementConnection[];
	evidenceLevel: "TRADITIONAL" | "EMERGING" | "SCIENTIFIC";
}

export interface RegionalVariation {
	region: string;
	practice: string;
	polishPractice: string;
	uniqueAspects: string[];
	polishUniqueAspects: string[];
}

export interface ModernAdaptation {
	adaptation: string;
	polishAdaptation: string;
	benefit: string;
	polishBenefit: string;
	implementation: string;
	polishImplementation: string;
}

export interface SupplementConnection {
	supplementId: string;
	supplementName: string;
	polishSupplementName: string;
	traditionalUse: string;
	polishTraditionalUse: string;
	modernApplication: string;
	polishModernApplication: string;
	dosageEvolution: string;
	polishDosageEvolution: string;
}

export const culturalSupplementTraditions: CulturalSupplementTradition[] = [
	{
		id: "zimowe-zdrowie",
		name: "Winter Health Preservation",
		polishName: "Zachowanie zdrowia zimą",
		category: "SEASONAL_PRACTICES",
		description:
			"Traditional Polish practices for maintaining health and immunity during harsh winter months, combining dietary strategies with herbal remedies.",
		polishDescription:
			"Tradycyjne polskie praktyki utrzymywania zdrowia i odporności podczas surowych miesięcy zimowych, łączące strategie żywieniowe z ziołowymi środkami.",
		historicalOrigin:
			"Developed during centuries of harsh continental winters when fresh food was scarce and infectious diseases were common. Rooted in Slavic folk medicine and Catholic traditions of seasonal observance.",
		polishHistoricalOrigin:
			"Rozwijane podczas wieków surowych zim kontynentalnych, gdy świeża żywność była rzadka, a choroby zakaźne były powszechne. Zakorzenione w medycynie ludowej Słowian i katolickich tradycjach obserwancji sezonowej.",
		currentPractice:
			"Modern Poles continue winter health practices through increased consumption of fermented foods, herbal teas, and targeted supplementation, especially vitamin D and immune-supporting nutrients.",
		polishCurrentPractice:
			"Współcześni Polacy kontynuują zimowe praktyki zdrowotne poprzez zwiększone spożycie produktów fermentowanych, herbatek ziołowych i celowanej suplementacji, szczególnie witaminy D i składników odżywczych wspierających odporność.",
		regionalVariations: [
			{
				region: "Northern Poland (Pomerania)",
				practice:
					"Fish-based winter nutrition with traditional herring preparations",
				polishPractice:
					"Żywienie zimowe oparte na rybach z tradycyjnymi preparatami śledziowymi",
				uniqueAspects: [
					"Baltic herring consumption",
					"Sea buckthorn berries",
					"Pine needle teas",
				],
				polishUniqueAspects: [
					"Spożycie śledzia bałtyckiego",
					"Jagody rokitnika",
					"Herbatki z igieł sosnowych",
				],
			},
			{
				region: "Southern Poland (Mountains)",
				practice: "Highland herbal traditions with coniferous plant remedies",
				polishPractice:
					"Tradycje ziołowe wyżynne z środkami z roślin iglastych",
				uniqueAspects: [
					"Spruce shoot syrup",
					"Mountain herb liqueurs",
					"Wool fat ointments",
				],
				polishUniqueAspects: [
					"Syrop z pędów świerka",
					"Nalewki z górskich ziół",
					"Maści z tłuszczu owczego",
				],
			},
			{
				region: "Central Poland (Mazovia)",
				practice:
					"Agricultural winter preservation with root vegetable ferments",
				polishPractice:
					"Zimowa konserwacja rolnicza z fermentacją warzyw korzeniowych",
				uniqueAspects: [
					"Beet kvass tradition",
					"Apple cider vinegar remedies",
					"Honey-based preparations",
				],
				polishUniqueAspects: [
					"Tradycja buraczanego kwasu",
					"Środki z octu jabłkowego",
					"Preparaty na bazie miodu",
				],
			},
		],
		modernAdaptations: [
			{
				adaptation: "Scientific validation of traditional fermented foods",
				polishAdaptation:
					"Walidacja naukowa tradycyjnych produktów fermentowanych",
				benefit: "Combines cultural heritage with evidence-based nutrition",
				polishBenefit:
					"Łączy dziedzictwo kulturowe z żywieniem opartym na dowodach",
				implementation:
					"Regular consumption of sauerkraut, kefir, and pickles with probiotic supplementation",
				polishImplementation:
					"Regularne spożycie kiszonej kapusty, kefiru i ogórków kiszonych z suplementacją probiotyków",
			},
			{
				adaptation:
					"Integration of vitamin D supplementation with traditional winter practices",
				polishAdaptation:
					"Integracja suplementacji witaminą D z tradycyjnymi praktykami zimowymi",
				benefit:
					"Addresses modern lifestyle limitations while honoring traditions",
				polishBenefit:
					"Adresuje ograniczenia nowoczesnego stylu życia, honorując tradycje",
				implementation:
					"Vitamin D supplementation during winter months alongside traditional cod liver oil",
				polishImplementation:
					"Suplementacja witaminą D w miesiącach zimowych wraz z tradycyjnym tranem",
			},
		],
		supplementConnections: [
			{
				supplementId: "vitamin-d3",
				supplementName: "Vitamin D3",
				polishSupplementName: "Witamina D3",
				traditionalUse:
					"Cod liver oil during winter months for bone health and immunity",
				polishTraditionalUse:
					"Tran w miesiącach zimowych dla zdrowia kości i odporności",
				modernApplication:
					"Standardized vitamin D3 supplementation with dosage based on blood levels",
				polishModernApplication:
					"Standaryzowana suplementacja witaminą D3 z dawkowaniem opartym na poziomach krwi",
				dosageEvolution:
					"From daily teaspoon of cod liver oil to 2000-4000 IU vitamin D3 based on individual needs",
				polishDosageEvolution:
					"Z codziennej łyżeczki tranu do 2000-4000 IU witaminy D3 w zależności od indywidualnych potrzeb",
			},
			{
				supplementId: "probiotics",
				supplementName: "Probiotics",
				polishSupplementName: "Probiotyki",
				traditionalUse:
					"Daily consumption of fermented foods as natural probiotics",
				polishTraditionalUse:
					"Codzienne spożycie produktów fermentowanych jako naturalne probiotyki",
				modernApplication:
					"Targeted probiotic supplementation to enhance traditional fermented food benefits",
				polishModernApplication:
					"Celowana suplementacja probiotykami w celu zwiększenia korzyści tradycyjnych produktów fermentowanych",
				dosageEvolution:
					"From seasonal fermented food consumption to year-round probiotic supplementation",
				polishDosageEvolution:
					"Z sezonowego spożycia produktów fermentowanych do całorocznej suplementacji probiotykami",
			},
		],
		evidenceLevel: "SCIENTIFIC",
	},
	{
		id: "stres-i-adaptogeny",
		name: "Stress and Adaptogens",
		polishName: "Stres i adaptogeny",
		category: "OCCUPATIONAL_PRACTICES",
		description:
			"Traditional approaches to stress management in demanding work environments, reflecting Poland's history of physically and mentally challenging occupations.",
		polishDescription:
			"Tradycyjne podejścia do zarządzania stresem w wymagających środowiskach pracy, odzwierciedlające historię Polski w fizycznie i psychicznie wymagających zawodach.",
		historicalOrigin:
			"Developed through generations of agricultural work, mining, and industrial labor. Slavic herbal traditions provided natural solutions for work-related fatigue and stress.",
		polishHistoricalOrigin:
			"Rozwijane przez pokolenia pracy rolniczej, górniczej i przemysłowej. Tradycje ziołowe Słowian dostarczały naturalnych rozwiązań na zmęczenie i stres związany z pracą.",
		currentPractice:
			"Modern Polish workers, especially in high-stress professions like healthcare, IT, and finance, combine traditional herbal remedies with modern adaptogenic supplements.",
		polishCurrentPractice:
			"Współcześni polscy pracownicy, szczególnie w zawodach o wysokim stresie jak służba zdrowia, IT i finanse, łączą tradycyjne ziołowe środki z nowoczesnymi suplementami adaptogennymi.",
		regionalVariations: [
			{
				region: "Silesia (Mining regions)",
				practice: "Traditional miner remedies for physical and mental stress",
				polishPractice:
					"Tradycyjne środki górników na stres fizyczny i psychiczny",
				uniqueAspects: [
					"Schisandra chinensis use",
					"Eleuthero root preparations",
					"Mineral-rich spring waters",
				],
				polishUniqueAspects: [
					"Stosowanie Schisandra chinensis",
					"Preparaty z korzenia Eleuthero",
					"Wody mineralne bogate w minerały",
				],
			},
			{
				region: "Masuria (Agricultural regions)",
				practice: "Farmer stress management with local herb traditions",
				polishPractice:
					"Zarządzanie stresem rolników z lokalnymi tradycjami ziołowymi",
				uniqueAspects: [
					"Nettle and dandelion preparations",
					"Honey-based adaptogen formulations",
					"Rhythm of nature connection",
				],
				polishUniqueAspects: [
					"Preparaty z pokrzywy i mniszka lekarskiego",
					"Formulacje adaptogenów na bazie miodu",
					"Połączenie z rytmem natury",
				],
			},
		],
		modernAdaptations: [
			{
				adaptation:
					"Evidence-based adaptogen protocols for modern workplace stress",
				polishAdaptation:
					"Protokoły adaptogenów oparte na dowodach dla stresu w nowoczesnym miejscu pracy",
				benefit: "Validates traditional practices with scientific research",
				polishBenefit: "Weryfikuje tradycyjne praktyki badaniami naukowymi",
				implementation:
					"Standardized Rhodiola and Ashwagandha supplementation with traditional herbal tea rituals",
				polishImplementation:
					"Standaryzowana suplementacja Rhodioli i Ashwagandhy z tradycyjnymi rytuałami herbacianymi",
			},
		],
		supplementConnections: [
			{
				supplementId: "rhodiola-rosea",
				supplementName: "Rhodiola Rosea",
				polishSupplementName: "Rhodiola Rosea",
				traditionalUse:
					"Traditional Siberian herb adopted for stress management in demanding physical work",
				polishTraditionalUse:
					"Tradycyjne syberyjskie zioło adoptowane do zarządzania stresem w wymagającej pracy fizycznej",
				modernApplication:
					"Standardized extract for mental performance and stress adaptation",
				polishModernApplication:
					"Standaryzowany ekstrakt dla wydajności psychicznej i adaptacji do stresu",
				dosageEvolution:
					"From traditional tea infusions to 200-400mg standardized extract",
				polishDosageEvolution:
					"Z tradycyjnych naparów herbacianych do 200-400mg standaryzowanego ekstraktu",
			},
			{
				supplementId: "ashwagandha",
				supplementName: "Ashwagandha",
				polishSupplementName: "Ashwagandha",
				traditionalUse:
					"Ayurvedic herb integrated into Polish stress management practices",
				polishTraditionalUse:
					"Zioło ajurwedyjskie zintegrowane z polskimi praktykami zarządzania stresem",
				modernApplication:
					"KSM-66 standardized extract for cortisol regulation and sleep quality",
				polishModernApplication:
					"Standaryzowany ekstrakt KSM-66 dla regulacji kortyzolu i jakości snu",
				dosageEvolution:
					"From occasional use to daily 300-600mg for chronic stress management",
				polishDosageEvolution:
					"Z okazjonalnego stosowania do codziennych 300-600mg dla zarządzania chronicznym stresem",
			},
		],
		evidenceLevel: "EMERGING",
	},
	{
		id: "tradycyjne-ziololecznictwo",
		name: "Traditional Herbal Medicine",
		polishName: "Tradycyjne ziołolecznictwo",
		category: "HERBAL_MEDICINE",
		description:
			"Deep-rooted Polish herbal medicine traditions passed down through generations, combining Slavic folk knowledge with Catholic monastic herbal practices.",
		polishDescription:
			"Głęboko zakorzenione polskie tradycje ziołolecznictwa przekazywane przez pokolenia, łączące słowiańską wiedzę ludową z katolickimi klasztornymi praktykami ziołowymi.",
		historicalOrigin:
			"Slavic herbal traditions date back over 1000 years, enriched by medieval monastic medicine from Benedictine and Cistercian monasteries. Folk healers (znachor) preserved and developed this knowledge through oral traditions.",
		polishHistoricalOrigin:
			"Tradycje ziołowe Słowian sięgają ponad 1000 lat wstecz, wzbogacone średniowieczną medycyną klasztorną z klasztorów benedyktyńskich i cysterskich. Ludowi uzdrowiciele (znachor) zachowali i rozwijali tę wiedzę poprzez tradycje ustne.",
		currentPractice:
			"Contemporary Poles maintain herbal traditions through home gardens, herbal teas, and integration of traditional remedies with modern healthcare, especially for digestive and stress-related issues.",
		polishCurrentPractice:
			"Współcześni Polacy utrzymują tradycje ziołowe poprzez domowe ogrody, herbatki ziołowe i integrację tradycyjnych środków z nowoczesną opieką zdrowotną, szczególnie w przypadku problemów trawiennych i związanych ze stresem.",
		regionalVariations: [
			{
				region: "Podlasie (Eastern Poland)",
				practice: "Forest herb gathering and traditional remedy preparation",
				polishPractice:
					"Zbieranie leśnych ziół i przygotowywanie tradycyjnych środków",
				uniqueAspects: [
					"Wild herb foraging traditions",
					"Honey and propolis use",
					"Birch bark applications",
				],
				polishUniqueAspects: [
					"Tradycje poszukiwania dzikich ziół",
					"Stosowanie miodu i propolisu",
					"Zastosowania kory brzozowej",
				],
			},
			{
				region: "Kashubia (Northern Poland)",
				practice: "Baltic herbal traditions with Nordic influences",
				polishPractice: "Tradycje ziołowe bałtyckie z wpływami nordyckimi",
				uniqueAspects: [
					"Seaweed and coastal plant use",
					"Amber-infused preparations",
					"Fishing community remedies",
				],
				polishUniqueAspects: [
					"Stosowanie wodorostów i roślin nadmorskich",
					"Preparaty z infuzją bursztynu",
					"Środki społeczności rybackich",
				],
			},
		],
		modernAdaptations: [
			{
				adaptation: "Scientific validation of traditional herbal remedies",
				polishAdaptation: "Walidacja naukowa tradycyjnych ziołowych środków",
				benefit:
					"Preserves cultural heritage while ensuring safety and efficacy",
				polishBenefit:
					"Zachowuje dziedzictwo kulturowe, zapewniając bezpieczeństwo i skuteczność",
				implementation:
					"Standardized herbal extracts combined with traditional preparation methods",
				polishImplementation:
					"Standaryzowane ekstrakty ziołowe łączone z tradycyjnymi metodami przygotowania",
			},
		],
		supplementConnections: [
			{
				supplementId: "nettle",
				supplementName: "Stinging Nettle",
				polishSupplementName: "Pokrzywa zwyczajna",
				traditionalUse: "Spring tonic for blood purification and joint health",
				polishTraditionalUse:
					"Wiosenny tonik do oczyszczania krwi i zdrowia stawów",
				modernApplication:
					"Standardized extract for seasonal allergy relief and mineral supplementation",
				polishModernApplication:
					"Standaryzowany ekstrakt na ulgę w sezonowych alergiach i suplementację minerałów",
				dosageEvolution: "From spring nettle soup to 500-1000mg daily extract",
				polishDosageEvolution:
					"Z wiosennej zupy z pokrzywy do 500-1000mg dziennego ekstraktu",
			},
			{
				supplementId: "chamomile",
				supplementName: "Chamomile",
				polishSupplementName: "Rumianek",
				traditionalUse: "Digestive tea for stomach complaints and relaxation",
				polishTraditionalUse:
					"Herbatka trawienna na dolegliwości żołądkowe i relaksację",
				modernApplication:
					"Standardized apigenin extract for sleep and digestive support",
				polishModernApplication:
					"Standaryzowany ekstrakt apigeniny dla snu i wsparcia trawiennego",
				dosageEvolution:
					"From traditional tea infusions to 200-400mg standardized extract",
				polishDosageEvolution:
					"Z tradycyjnych naparów herbacianych do 200-400mg standaryzowanego ekstraktu",
			},
		],
		evidenceLevel: "TRADITIONAL",
	},
	{
		id: "cykl-zycia-suplementacja",
		name: "Life Cycle Supplementation",
		polishName: "Suplementacja w cyklu życia",
		category: "LIFE_STAGE_TRADITIONS",
		description:
			"Traditional Polish practices of using specific supplements and herbs during different life stages, from childhood through elder years.",
		polishDescription:
			"Tradycyjne polskie praktyki używania specyficznych suplementów i ziół podczas różnych etapów życia, od dzieciństwa po lata starsze.",
		historicalOrigin:
			"Based on traditional Slavic life wisdom and Catholic traditions of caring for different age groups. Folk medicine provided specific remedies for each life stage's unique needs.",
		polishHistoricalOrigin:
			"Oparte na tradycyjnej słowiańskiej mądrości życiowej i katolickich tradycjach opieki nad różnymi grupami wiekowymi. Medycyna ludowa dostarczała specyficznych środków dla unikalnych potrzeb każdego etapu życia.",
		currentPractice:
			"Modern Poles integrate traditional life-stage remedies with contemporary nutritional science, particularly for pregnancy, child development, and healthy aging.",
		polishCurrentPractice:
			"Współcześni Polacy integrują tradycyjne środki etapów życia z nowoczesną nauką żywieniową, szczególnie dla ciąży, rozwoju dziecka i zdrowego starzenia się.",
		regionalVariations: [
			{
				region: "Wielkopolska (Western Poland)",
				practice:
					"Structured approach to life-stage nutrition with local food traditions",
				polishPractice:
					"Strukturalne podejście do żywienia etapów życia z lokalnymi tradycjami żywnościowymi",
				uniqueAspects: [
					"Goose fat for child development",
					"Elderberry preparations for immune support",
					"Regional honey varieties",
				],
				polishUniqueAspects: [
					"Tłuszcz gęsi dla rozwoju dziecka",
					"Preparaty z bzu czarnego dla wsparcia odporności",
					"Regionalne odmiany miodu",
				],
			},
		],
		modernAdaptations: [
			{
				adaptation:
					"Integration of traditional remedies with modern prenatal and geriatric care",
				polishAdaptation:
					"Integracja tradycyjnych środków z nowoczesną opieką prenatalną i geriatryczną",
				benefit:
					"Holistic approach combining cultural wisdom with medical science",
				polishBenefit:
					"Holistyczne podejście łączące mądrość kulturową z nauką medyczną",
				implementation:
					"Traditional herbs alongside evidence-based supplementation protocols",
				polishImplementation:
					"Tradycyjne zioła wraz z protokołami suplementacji opartymi na dowodach",
			},
		],
		supplementConnections: [
			{
				supplementId: "elderberry",
				supplementName: "Elderberry",
				polishSupplementName: "Bez czarny",
				traditionalUse:
					"Winter immune support and fever reduction across all ages",
				polishTraditionalUse:
					"Wsparcie odporności zimowej i redukcja gorączki w każdym wieku",
				modernApplication:
					"Standardized extract for immune system modulation and cold prevention",
				polishModernApplication:
					"Standaryzowany ekstrakt do modulacji układu odpornościowego i zapobiegania przeziębieniom",
				dosageEvolution:
					"From traditional syrup preparations to 300-600mg standardized extract",
				polishDosageEvolution:
					"Z tradycyjnych syropów do 300-600mg standaryzowanego ekstraktu",
			},
			{
				supplementId: "calcium",
				supplementName: "Calcium",
				polishSupplementName: "Wapń",
				traditionalUse:
					"Bone health support for growing children and aging adults",
				polishTraditionalUse:
					"Wsparcie zdrowia kości dla rosnących dzieci i starzejących się dorosłych",
				modernApplication:
					"Age-specific formulations with vitamin D for optimal absorption",
				polishModernApplication:
					"Formulacje specyficzne dla wieku z witaminą D dla optymalnego wchłaniania",
				dosageEvolution:
					"From traditional bone broth to 500-1000mg calcium with 1000-2000 IU vitamin D",
				polishDosageEvolution:
					"Z tradycyjnego wywaru z kości do 500-1000mg wapnia z 1000-2000 IU witaminy D",
			},
		],
		evidenceLevel: "EMERGING",
	},
];

export const getTraditionsByCategory = (category: string) => {
	return culturalSupplementTraditions.filter(
		(tradition) => tradition.category === category,
	);
};

export const getTraditionsByRegion = (region: string) => {
	return culturalSupplementTraditions.filter((tradition) =>
		tradition.regionalVariations.some((variation) =>
			variation.region.includes(region),
		),
	);
};

export const getSupplementConnections = (supplementId: string) => {
	return culturalSupplementTraditions.flatMap((tradition) =>
		tradition.supplementConnections.filter(
			(connection) => connection.supplementId === supplementId,
		),
	);
};
