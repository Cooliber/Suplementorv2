import Link from "next/link";
import { usePathname } from "next/navigation";
// Enhanced Sidebar Navigation Component with Search
import * as React from "react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
	Activity,
	BarChart3,
	Bell,
	BookOpen,
	Brain,
	Calendar,
	FileText,
	Globe,
	Heart,
	HelpCircle,
	Home,
	Lightbulb,
	Menu,
	MessageSquare,
	Pill,
	Search,
	Settings,
	Shield,
	Star,
	Target,
	Trophy,
	User,
	Users,
	Zap,
} from "lucide-react";

// Navigation items organized by category
const navigationItems = [
	{
		title: "Główna",
		icon: Home,
		items: [
			{ title: "Strona główna", href: "/", icon: Home },
			{ title: "Graf wiedzy", href: "/graf-wiedzy", icon: Brain },
			{ title: "Baza suplementów", href: "/suplementy", icon: Pill },
		],
	},
	{
		title: "Nauka",
		icon: BookOpen,
		items: [
			{ title: "Wiedza", href: "/wiedza", icon: BookOpen },
			{ title: "Badania naukowe", href: "/badania", icon: FileText },
			{ title: "Mechanizmy działania", href: "/mechanizmy", icon: Activity },
			{ title: "Neuroprzekaźniki", href: "/neuroprzekazniki", icon: Zap },
			{ title: "Obszary mózgu", href: "/obszary-mozgu", icon: Brain },
		],
	},
	{
		title: "Narzędzia",
		icon: Settings,
		items: [
			{ title: "Śledzenie", href: "/sledzenie", icon: Target },
			{ title: "Kalendarz", href: "/kalendarz", icon: Calendar },
			{ title: "Statystyki", href: "/statystyki", icon: BarChart3 },
			{ title: "Rekomendacje", href: "/rekomendacje", icon: Lightbulb },
			{ title: "Odkrywanie", href: "/odkrywanie", icon: Search },
			{ title: "Interakcje", href: "/interakcje", icon: Activity },
		],
	},
	{
		title: "Społeczność",
		icon: Users,
		items: [
			{ title: "Forum", href: "/forum", icon: MessageSquare },
			{ title: "Rankingi", href: "/rankingi", icon: Trophy },
			{ title: "Społeczność", href: "/spolecznosc", icon: Users },
		],
	},
	{
		title: "Konto",
		icon: User,
		items: [
			{ title: "Profil", href: "/profil", icon: User },
			{ title: "Ustawienia", href: "/ustawienia", icon: Settings },
			{ title: "Powiadomienia", href: "/powiadomienia", icon: Bell },
			{ title: "Pomoc", href: "/pomoc", icon: HelpCircle },
			{ title: "Prywatność", href: "/prywatnosc", icon: Shield },
		],
	},
];

// Quick access items for frequently used functions
const quickAccessItems = [
	{ title: "Kalkulator dawek", href: "/kalkulator-dawek", icon: Pill },
	{ title: "Notatki", href: "/notatki", icon: FileText },
	{ title: "Zakładki", href: "/zakladki", icon: Star },
	{ title: "Historia", href: "/historia", icon: Calendar },
	{ title: "Postęp nauki", href: "/postep", icon: Target },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
	onItemClick?: () => void;
}

export function SidebarNav({
	className,
	onItemClick,
	...props
}: SidebarNavProps) {
	const pathname = usePathname();
	const [searchQuery, setSearchQuery] = React.useState("");

	// Flatten all navigation items for search
	const allNavItems = React.useMemo(() => {
		return navigationItems.flatMap((category) =>
			category.items.map((item) => ({
				...item,
				category: category.title,
			})),
		);
	}, []);

	// Filter items based on search query
	const filteredNavItems = React.useMemo(() => {
		if (!searchQuery.trim()) return navigationItems;

		const filtered = navigationItems
			.map((category) => ({
				...category,
				items: category.items.filter((item) =>
					item.title.toLowerCase().includes(searchQuery.toLowerCase()),
				),
			}))
			.filter((category) => category.items.length > 0);

		return filtered;
	}, [searchQuery]);

	// Filter quick access items based on search
	const filteredQuickAccess = React.useMemo(() => {
		if (!searchQuery.trim()) return quickAccessItems;
		return quickAccessItems.filter((item) =>
			item.title.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [searchQuery]);

	return (
		<div className={cn("pb-12", className)} {...props}>
			<div className="space-y-4 py-4">
				<div className="px-3 py-2">
					<h2 className="mb-2 px-4 font-semibold text-lg tracking-tight">
						Suplementor
					</h2>

					{/* Search Input */}
					<div className="mb-4 px-1">
						<div className="relative">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Szukaj w nawigacji..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="h-9 bg-background pl-9"
							/>
						</div>
					</div>

					{/* Quick Access Section */}
					{(!searchQuery.trim() || filteredQuickAccess.length > 0) && (
						<div className="mb-4">
							<h3 className="mb-2 px-3 font-medium text-muted-foreground text-sm">
								Szybki dostęp
							</h3>
							<div className="space-y-1">
								{filteredQuickAccess.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										onClick={onItemClick}
										className={cn(
											"group flex items-center gap-3 rounded-md px-3 py-2 font-medium text-sm hover:bg-accent hover:text-accent-foreground",
											pathname === item.href
												? "bg-accent text-accent-foreground"
												: "text-muted-foreground",
										)}
									>
										<item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
										{item.title}
									</Link>
								))}
							</div>
						</div>
					)}

					{/* Main Navigation */}
					<div className="space-y-1">
						{filteredNavItems.map((category) => (
							<Accordion key={category.title} type="single" collapsible>
								<AccordionItem value={category.title} className="border-b-0">
									<AccordionTrigger className="py-2 font-medium text-sm transition-colors hover:text-primary data-[state=open]:text-primary">
										<div className="flex items-center gap-2">
											<category.icon className="h-4 w-4" />
											{category.title}
											{searchQuery.trim() && (
												<span className="ml-auto text-muted-foreground text-xs">
													{category.items.length}
												</span>
											)}
										</div>
									</AccordionTrigger>
									<AccordionContent className="pb-2 pl-6">
										<div className="space-y-1">
											{category.items.map((item) => (
												<Link
													key={item.href}
													href={item.href}
													onClick={onItemClick}
													className={cn(
														"group flex items-center gap-3 rounded-md px-3 py-2 font-medium text-sm hover:bg-accent hover:text-accent-foreground",
														pathname === item.href
															? "bg-accent text-accent-foreground"
															: "text-muted-foreground",
													)}
												>
													<item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
													{item.title}
												</Link>
											))}
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

interface MobileSidebarProps {
	children: React.ReactNode;
}

export function MobileSidebar({ children }: MobileSidebarProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
				>
					<Menu className="h-6 w-6" />
					<span className="sr-only">Przełącz nawigację</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="pr-0">
				<Link href="/" className="flex items-center pl-2">
					<Brain className="mr-2 h-6 w-6 text-blue-600" />
					<span className="font-bold">Suplementor</span>
				</Link>
				<ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
					<div className="pl-1">
						<SidebarNav onItemClick={() => setOpen(false)} />
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
