"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// Enhanced Breadcrumb Navigation Component with History Tracking
import * as React from "react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
	Activity,
	ArrowLeft,
	BarChart3,
	Bell,
	BookOpen,
	Brain,
	Calendar,
	ChevronRight,
	Clock,
	FileText,
	Globe,
	Heart,
	HelpCircle,
	Home,
	Lightbulb,
	MessageSquare,
	Pill,
	Search,
	Settings,
	Share2,
	Shield,
	Star,
	Target,
	Trophy,
	User,
	Users,
	Zap,
} from "lucide-react";

// Map paths to breadcrumb titles and icons
const pathMap: Record<
	string,
	{ title: string; icon?: React.ComponentType<any> }
> = {
	"/": { title: "Strona główna", icon: Home },
	"/graf-wiedzy": { title: "Graf wiedzy", icon: Brain },
	"/suplementy": { title: "Suplementy", icon: Pill },
	"/sledzenie": { title: "Śledzenie", icon: Target },
	"/wiedza": { title: "Wiedza", icon: BookOpen },
	"/wiedza/graf-wiedzy": { title: "Graf wiedzy", icon: Brain },
	"/wiedza/integracja-grafu": { title: "Integracja grafu", icon: Share2 },
	"/badania": { title: "Badania naukowe", icon: FileText },
	"/mechanizmy": { title: "Mechanizmy działania", icon: Activity },
	"/neuroprzekazniki": { title: "Neuroprzekaźniki", icon: Zap },
	"/obszary-mozgu": { title: "Obszary mózgu", icon: Brain },
	"/kalendarz": { title: "Kalendarz", icon: Calendar },
	"/statystyki": { title: "Statystyki", icon: BarChart3 },
	"/rekomendacje": { title: "Rekomendacje", icon: Lightbulb },
	"/odkrywanie": { title: "Odkrywanie", icon: Search },
	"/interakcje": { title: "Interakcje", icon: Activity },
	"/forum": { title: "Forum", icon: MessageSquare },
	"/rankingi": { title: "Rankingi", icon: Trophy },
	"/spolecznosc": { title: "Społeczność", icon: Users },
	"/profil": { title: "Profil", icon: User },
	"/ustawienia": { title: "Ustawienia", icon: Settings },
	"/powiadomienia": { title: "Powiadomienia", icon: Bell },
	"/pomoc": { title: "Pomoc", icon: HelpCircle },
	"/prywatnosc": { title: "Prywatność", icon: Shield },
	"/uklad-ciala": { title: "Układy ciała", icon: Activity },
};

interface BreadcrumbNavProps {
	className?: string;
}

interface NavigationHistoryItem {
	path: string;
	title: string;
	timestamp: number;
	icon?: React.ComponentType<any>;
}

export function BreadcrumbNavigation({ className }: BreadcrumbNavProps) {
	const pathname = usePathname();
	const router = useRouter();
	const pathParts = pathname.split("/").filter(Boolean);

	// Navigation history state
	const [history, setHistory] = React.useState<NavigationHistoryItem[]>([]);

	// Add current page to history when pathname changes
	React.useEffect(() => {
		if (pathname && pathname !== "/") {
			const currentPage = pathMap[pathname];
			if (currentPage) {
				const historyItem: NavigationHistoryItem = {
					path: pathname,
					title: currentPage.title,
					timestamp: Date.now(),
					icon: currentPage.icon,
				};

				setHistory((prev) => {
					const filtered = prev.filter((item) => item.path !== pathname);
					return [historyItem, ...filtered].slice(0, 10); // Keep last 10 items
				});
			}
		}
	}, [pathname]);

	// Get recent pages (excluding current)
	const recentPages = history
		.filter((item) => item.path !== pathname)
		.slice(0, 5);

	// Quick access favorites
	const favoritePages = [
		{ title: "Graf wiedzy", href: "/graf-wiedzy", icon: Brain },
		{ title: "Suplementy", href: "/suplementy", icon: Pill },
		{ title: "Śledzenie", href: "/sledzenie", icon: Target },
		{ title: "Rekomendacje", href: "/rekomendacje", icon: Lightbulb },
	];

	// Special handling for dynamic routes
	const getBreadcrumbTitle = (path: string, index: number) => {
		// Check if it's a dynamic route parameter
		if (path.startsWith("[") && path.endsWith("]")) {
			// Try to get the actual value from the URL
			const previousPart = pathParts[index - 1];
			if (previousPart === "suplementy" || previousPart === "supplement") {
				return "Szczegóły suplementu";
			}
			if (previousPart === "profil") {
				return "Profil użytkownika";
			}
			return "Szczegóły";
		}

		// Check if it's a UUID-like parameter
		if (
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
				path,
			)
		) {
			return "Szczegóły";
		}

		// Return mapped title or the path itself
		return (
			pathMap[`/${pathParts.slice(0, index + 1).join("/")}`]?.title ||
			pathMap[`/${path}`]?.title ||
			path.charAt(0).toUpperCase() + path.slice(1)
		);
	};

	const getBreadcrumbIcon = (path: string) => {
		return pathMap[`/${path}`]?.icon;
	};

	return (
		<div className={cn("hidden items-center gap-2 md:flex", className)}>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/">
								<Home className="h-4 w-4" />
								<span className="sr-only">Strona główna</span>
							</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>

					{pathParts.length > 0 && (
						<BreadcrumbSeparator>
							<ChevronRight className="h-4 w-4" />
						</BreadcrumbSeparator>
					)}

					{pathParts.map((path, index) => {
						const isLast = index === pathParts.length - 1;
						const fullPath = `/${pathParts.slice(0, index + 1).join("/")}`;
						const IconComponent = getBreadcrumbIcon(path);

						return (
							<React.Fragment key={fullPath}>
								<BreadcrumbItem>
									{isLast ? (
										<BreadcrumbPage className="flex items-center gap-2">
											{IconComponent && <IconComponent className="h-4 w-4" />}
											{getBreadcrumbTitle(path, index)}
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink asChild>
											<Link href={fullPath} className="flex items-center gap-2">
												{IconComponent && <IconComponent className="h-4 w-4" />}
												{getBreadcrumbTitle(path, index)}
											</Link>
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>

								{!isLast && (
									<BreadcrumbSeparator>
										<ChevronRight className="h-4 w-4" />
									</BreadcrumbSeparator>
								)}
							</React.Fragment>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>

			{/* Quick Access Dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
						<Star className="h-4 w-4" />
						<span className="sr-only">Szybki dostęp</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-56">
					<div className="px-2 py-1.5 font-medium text-muted-foreground text-sm">
						Ulubione strony
					</div>
					<DropdownMenuSeparator />
					{favoritePages.map((page) => (
						<DropdownMenuItem key={page.href} asChild>
							<Link href={page.href} className="flex items-center gap-2">
								<page.icon className="h-4 w-4" />
								{page.title}
							</Link>
						</DropdownMenuItem>
					))}

					{recentPages.length > 0 && (
						<>
							<DropdownMenuSeparator />
							<div className="px-2 py-1.5 font-medium text-muted-foreground text-sm">
								Ostatnie strony
							</div>
							{recentPages.map((page) => (
								<DropdownMenuItem key={page.path} asChild>
									<Link href={page.path} className="flex items-center gap-2">
										<Clock className="h-3 w-3" />
										<div className="flex-1">
											<div className="font-medium">{page.title}</div>
											<div className="text-muted-foreground text-xs">
												{new Date(page.timestamp).toLocaleTimeString("pl-PL", {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</div>
										</div>
									</Link>
								</DropdownMenuItem>
							))}
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Back Button for History */}
			{history.length > 1 && (
				<Button
					variant="ghost"
					size="sm"
					className="h-8 w-8 p-0"
					onClick={() => {
						const previousPage = history.find((item) => item.path !== pathname);
						if (previousPage) {
							router.push(previousPage.path);
						}
					}}
				>
					<ArrowLeft className="h-4 w-4" />
					<span className="sr-only">Wstecz</span>
				</Button>
			)}
		</div>
	);
}
