import Link from "next/link";
// Footer Navigation Component
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
	Target,
	Trophy,
	User,
	Users,
	X,
	Zap,
} from "lucide-react";

// Footer navigation items
const footerNavigationItems = [
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

export function FooterNavigation() {
	const [open, setOpen] = React.useState(false);

	return (
		<footer className="border-t bg-background">
			<div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<nav className="hidden items-center gap-4 md:flex md:gap-6">
						<Link
							href="/o-nas"
							className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
						>
							O nas
						</Link>
						<Link
							href="/kontakt"
							className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
						>
							Kontakt
						</Link>
						<Link
							href="/polityka-prywatnosci"
							className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
						>
							Prywatność
						</Link>
						<Link
							href="/regulamin"
							className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
						>
							Regulamin
						</Link>
					</nav>

					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Otwórz menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="bottom" className="h-[80vh]">
							<div className="flex h-full flex-col">
								<div className="flex items-center justify-between border-b pb-4">
									<h2 className="font-semibold text-lg">Nawigacja</h2>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setOpen(false)}
									>
										<X className="h-5 w-5" />
										<span className="sr-only">Zamknij</span>
									</Button>
								</div>

								<div className="flex-1 overflow-auto py-4">
									<div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
										{footerNavigationItems.map((category) => (
											<div key={category.title}>
												<h3 className="mb-3 flex items-center gap-2 font-semibold text-sm">
													<category.icon className="h-4 w-4" />
													{category.title}
												</h3>
												<ul className="space-y-2">
													{category.items.map((item) => (
														<li key={item.href}>
															<Link
																href={item.href}
																onClick={() => setOpen(false)}
																className="flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
															>
																<item.icon className="h-4 w-4" />
																{item.title}
															</Link>
														</li>
													))}
												</ul>
											</div>
										))}
									</div>
								</div>

								<div className="border-t py-4">
									<div className="flex flex-col gap-2">
										<Link
											href="/o-nas"
											className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
										>
											O nas
										</Link>
										<Link
											href="/kontakt"
											className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
										>
											Kontakt
										</Link>
										<Link
											href="/polityka-prywatnosci"
											className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
										>
											Polityka prywatności
										</Link>
										<Link
											href="/regulamin"
											className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
										>
											Regulamin
										</Link>
									</div>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</footer>
	);
}
