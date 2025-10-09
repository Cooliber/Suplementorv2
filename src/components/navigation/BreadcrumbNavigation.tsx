"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// Breadcrumb Navigation Component
import * as React from "react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import {
	Activity,
	BarChart3,
	Bell,
	BookOpen,
	Brain,
	Calendar,
	ChevronRight,
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
	Shield,
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
	"/wiedza/integracja-grafu": { title: "Integracja grafu", icon: Network },
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
};

interface BreadcrumbNavProps {
	className?: string;
}

export function BreadcrumbNavigation({ className }: BreadcrumbNavProps) {
	const pathname = usePathname();
	const pathParts = pathname.split("/").filter(Boolean);

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
		<Breadcrumb className={cn("hidden md:flex", className)}>
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
	);
}
