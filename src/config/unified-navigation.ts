/**
 * Unified Navigation Configuration
 * Single source of truth for all navigation components
 * Consolidates navigation.ts and simplified-navigation.ts
 */

export interface UnifiedNavigationItem {
	id: string;
	name: string;
	href: string;
	iconName: string;
	description: string;
	badge?: string;
	isPro?: boolean;
	isNew?: boolean;
	category: "main" | "educational" | "tools" | "admin";
	level: 1 | 2 | 3; // Progressive disclosure level
	order: number;
	requiresAuth?: boolean;
	children?: UnifiedNavigationItem[];
	keywords?: string[]; // For search functionality
}

/**
 * Master unified navigation configuration
 * All routes verified to have corresponding page.tsx files
 */
export const unifiedNavigationItems: UnifiedNavigationItem[] = [
	// Level 1: Main Navigation (Always visible)
	{
		id: "home",
		name: "Główna",
		href: "/",
		iconName: "Home",
		description: "Strona główna i dashboard",
		category: "main",
		level: 1,
		order: 1,
		keywords: ["home", "główna", "dashboard"],
	},
	{
		id: "dashboard",
		name: "Dashboard",
		href: "/dashboard",
		iconName: "Activity",
		description: "Osobisty panel postępu",
		category: "main",
		level: 1,
		order: 2,
		keywords: ["dashboard", "panel", "postęp", "progress"],
	},

	// Level 1: Core Educational Content
	{
		id: "adhd",
		name: "ADHD",
		href: "/adhd",
		iconName: "Brain",
		description: "Przewodnik po ADHD",
		badge: "Popularne",
		category: "educational",
		level: 1,
		order: 10,
		keywords: ["adhd", "uwaga", "koncentracja"],
	},
	{
		id: "neurobiologia",
		name: "Neurobiologia",
		href: "/neurobiologia",
		iconName: "Microscope",
		description: "Zaawansowane mechanizmy mózgu",
		category: "educational",
		level: 1,
		order: 11,
		keywords: ["neurobiologia", "mózg", "neurony"],
	},
	{
		id: "neurotransmitery",
		name: "Neurotransmitery",
		href: "/neurotransmitery",
		iconName: "Brain",
		description: "Podstawy chemii mózgu",
		category: "educational",
		level: 1,
		order: 12,
		keywords: ["neurotransmitery", "chemia", "mózg", "dopamina", "serotonina"],
	},
	{
		id: "neuroregulacja",
		name: "Neuroregulacja",
		href: "/neuroregulacja",
		iconName: "Heart",
		description: "Mechanizmy optymalizacji",
		category: "educational",
		level: 1,
		order: 13,
		keywords: ["neuroregulacja", "optymalizacja", "regulacja"],
	},
	{
		id: "cialo-instrukcja",
		name: "Instrukcja do Ciała",
		href: "/cialo-instrukcja",
		iconName: "Activity",
		description: "Jak działa fabryka ludzkiego ciała",
		badge: "Nowy",
		isNew: true,
		category: "educational",
		level: 1,
		order: 14,
		keywords: [
			"ciało",
			"instrukcja",
			"fabryka",
			"organizm",
			"wydajność",
			"starzenie",
		],
	},
	{
		id: "mitochondria-energia",
		name: "Mitochondria i Energia",
		href: "/mitochondria-energia",
		iconName: "Zap",
		description: "Elektrownie komórek i produkcja energii",
		badge: "Nowy",
		isNew: true,
		category: "educational",
		level: 1,
		order: 15,
		keywords: [
			"mitochondria",
			"energia",
			"ATP",
			"elektrownie",
			"komórki",
			"optymalizacja",
		],
	},
	{
		id: "hormony-optymalizacja",
		name: "Hormony i Optymalizacja",
		href: "/hormony-optymalizacja",
		iconName: "Activity",
		description: "System komunikacji chemicznej organizmu",
		badge: "Nowy",
		isNew: true,
		category: "educational",
		level: 1,
		order: 16,
		keywords: [
			"hormony",
			"optymalizacja",
			"testosteron",
			"kortyzol",
			"tarczyca",
			"HGH",
		],
	},

	// Level 2: Advanced Educational Content (Contextual)
	{
		id: "neurobiologia-zaawansowana",
		name: "Neurobiologia Pro",
		href: "/neurobiologia-zaawansowana",
		iconName: "Network",
		description: "Sieci neuronalne i plastyczność molekularna",
		badge: "Ekspert",
		isNew: true,
		category: "educational",
		level: 2,
		order: 15,
		keywords: ["neurobiologia", "zaawansowana", "sieci", "plastyczność"],
	},
	{
		id: "zaawansowana-neuroregulacja",
		name: "Protokoły Pro",
		href: "/zaawansowana-neuroregulacja",
		iconName: "Target",
		description: "Precyzyjne dawkowanie",
		isPro: true,
		category: "educational",
		level: 2,
		order: 16,
		keywords: ["protokoły", "dawkowanie", "precyzyjne", "pro"],
	},
	{
		id: "zaawansowana-wiedza",
		name: "Zaawansowana Wiedza",
		href: "/zaawansowana-wiedza",
		iconName: "Network",
		description: "Graf wiedzy i kolumny korowe",
		isNew: true,
		category: "educational",
		level: 2,
		order: 17,
		keywords: ["wiedza", "graf", "kolumny", "korowe"],
	},
	{
		id: "zaawansowana-wiedza-enhanced",
		name: "Wiedza Enhanced",
		href: "/zaawansowana-wiedza-enhanced",
		iconName: "Network",
		description: "Rozszerzona baza wiedzy",
		category: "educational",
		level: 2,
		order: 18,
		keywords: ["wiedza", "enhanced", "rozszerzona", "baza"],
	},

	// Level 2: Specialized Content
	{
		id: "wittgenstein-filozofia",
		name: "Filozofia Wittgensteina",
		href: "/wittgenstein-filozofia",
		iconName: "BookOpen",
		description: "Spory filozoficzne i neuroregulacja",
		badge: "Nowy",
		isNew: true,
		category: "educational",
		level: 2,
		order: 19,
		keywords: ["wittgenstein", "filozofia", "spory"],
	},
	{
		id: "cognitive-biases",
		name: "Błędy Poznawcze",
		href: "/cognitive-biases",
		iconName: "Brain",
		description: "Zrozumienie i przezwyciężanie błędów myślowych",
		badge: "Nowy",
		isNew: true,
		category: "educational",
		level: 2,
		order: 20,
		keywords: ["błędy", "poznawcze", "myślenie", "biases"],
	},
	{
		id: "swiadomosc",
		name: "Świadomość",
		href: "/swiadomosc",
		iconName: "Brain",
		description: "Badania nad świadomością",
		category: "educational",
		level: 2,
		order: 21,
		keywords: ["świadomość", "badania", "consciousness"],
	},

	// Level 1: Tools and Resources
	{
		id: "nootropics",
		name: "Suplementy",
		href: "/nootropics",
		iconName: "Target",
		description: "Baza suplementów",
		category: "tools",
		level: 1,
		order: 30,
		keywords: ["suplementy", "nootropics", "baza"],
	},
	{
		id: "knowledge",
		name: "Wiedza",
		href: "/knowledge",
		iconName: "BookOpen",
		description: "System wiedzy",
		category: "tools",
		level: 1,
		order: 31,
		keywords: ["wiedza", "system", "knowledge"],
	},
	{
		id: "badania",
		name: "Badania",
		href: "/badania",
		iconName: "Users",
		description: "Najnowsze badania naukowe",
		category: "tools",
		level: 1,
		order: 32,
		keywords: ["badania", "naukowe", "research"],
	},

	// Level 2: Advanced Tools
	{
		id: "chad",
		name: "CHAD",
		href: "/chad",
		iconName: "Target",
		description: "Comprehensive Health Assessment Dashboard",
		badge: "Nowy",
		isNew: true,
		category: "tools",
		level: 2,
		order: 33,
		keywords: ["chad", "health", "assessment", "dashboard"],
	},
	{
		id: "advanced-visualization",
		name: "Wizualizacje",
		href: "/advanced-visualization",
		iconName: "Activity",
		description: "Zaawansowane wizualizacje",
		category: "tools",
		level: 2,
		order: 34,
		keywords: ["wizualizacje", "advanced", "visualization"],
	},

	// Level 3: Documentation and Development
	{
		id: "components",
		name: "Komponenty",
		href: "/components",
		iconName: "FileText",
		description: "Biblioteka komponentów",
		category: "tools",
		level: 3,
		order: 40,
		keywords: ["komponenty", "biblioteka", "components"],
	},
	{
		id: "docs",
		name: "Dokumentacja",
		href: "/docs",
		iconName: "HelpCircle",
		description: "Przewodniki i pomoc",
		category: "tools",
		level: 3,
		order: 41,
		keywords: ["dokumentacja", "przewodniki", "pomoc", "docs"],
	},
	{
		id: "sparkline-documentation",
		name: "Sparkline Docs",
		href: "/sparkline-documentation",
		iconName: "Activity",
		description: "Dokumentacja wykresów",
		category: "tools",
		level: 3,
		order: 42,
		keywords: ["sparkline", "wykresy", "dokumentacja"],
	},

	// Admin (Level 3, requires authentication)
	{
		id: "admin-knowledge-dashboard",
		name: "Panel Wiedzy",
		href: "/admin/knowledge-dashboard",
		iconName: "Settings",
		description: "Panel administracyjny wiedzy",
		category: "admin",
		level: 3,
		order: 50,
		requiresAuth: true,
		keywords: ["admin", "panel", "wiedza", "dashboard"],
	},
	{
		id: "admin-integrity-dashboard",
		name: "Panel Integralności",
		href: "/admin/integrity-dashboard",
		iconName: "Award",
		description: "Monitoring integralności systemu",
		category: "admin",
		level: 3,
		order: 51,
		requiresAuth: true,
		keywords: ["admin", "integralność", "monitoring"],
	},
];

/**
 * Navigation filtering and utility functions
 */

// Get navigation items by level (progressive disclosure)
export const getNavigationByLevel = (
	level: 1 | 2 | 3,
	showAll = false,
): UnifiedNavigationItem[] => {
	if (showAll) {
		return unifiedNavigationItems
			.filter((item) => item.level <= level)
			.sort((a, b) => a.order - b.order);
	}

	return unifiedNavigationItems
		.filter((item) => item.level === level)
		.sort((a, b) => a.order - b.order);
};

// Get navigation items by category
export const getNavigationByCategory = (
	category: UnifiedNavigationItem["category"],
): UnifiedNavigationItem[] =>
	unifiedNavigationItems
		.filter((item) => item.category === category)
		.sort((a, b) => a.order - b.order);

// Get main navigation (Level 1 + popular Level 2)
export const getMainNavigation = (): UnifiedNavigationItem[] =>
	unifiedNavigationItems
		.filter(
			(item) =>
				item.level === 1 ||
				(item.level === 2 &&
					(item.badge === "Popularne" || item.isNew === true)),
		)
		.sort((a, b) => a.order - b.order);

// Get public navigation (no auth required)
export const getPublicNavigation = (): UnifiedNavigationItem[] =>
	unifiedNavigationItems
		.filter((item) => item.requiresAuth !== true)
		.sort((a, b) => a.order - b.order);

// Find navigation item by href
export const findNavigationItem = (
	href: string,
): UnifiedNavigationItem | undefined =>
	unifiedNavigationItems.find((item) => item.href === href);

// Enhanced active state detection
export const isNavigationItemActive = (
	itemHref: string,
	currentPath: string,
): boolean => {
	// Exact match
	if (itemHref === currentPath) return true;

	// Root path special case
	if (itemHref === "/" && currentPath === "/") return true;
	if (itemHref === "/" && currentPath !== "/") return false;

	// Nested path matching (e.g., /admin/knowledge-dashboard matches /admin)
	if (currentPath.startsWith(`${itemHref}/`)) return true;

	return false;
};

// Get breadcrumbs for current path
export const getBreadcrumbs = (
	pathname: string,
): Array<{ name: string; href: string }> => {
	const breadcrumbs = [{ name: "Główna", href: "/" }];

	const currentItem = findNavigationItem(pathname);
	if (currentItem && pathname !== "/") {
		breadcrumbs.push({ name: currentItem.name, href: currentItem.href });
	}

	return breadcrumbs;
};

// Search navigation items
export const searchNavigationItems = (
	query: string,
): UnifiedNavigationItem[] => {
	if (!query.trim()) return [];

	const searchTerm = query.toLowerCase();

	return unifiedNavigationItems
		.filter((item) => {
			const searchableText = [
				item.name,
				item.description,
				...(item.keywords || []),
			]
				.join(" ")
				.toLowerCase();

			return searchableText.includes(searchTerm);
		})
		.sort((a, b) => a.order - b.order);
};

export default unifiedNavigationItems;
