"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
	BookOpen,
	Calculator,
	Heart,
	Home,
	Lightbulb,
	Notebook,
	Search,
	Settings,
	Star,
	Target,
	Users,
} from "lucide-react";

interface QuickAccessToolbarProps {
	className?: string;
	orientation?: "horizontal" | "vertical";
	position?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
}

const quickAccessActions = [
	{
		title: "Strona główna",
		href: "/",
		icon: Home,
		shortcut: "Alt+H",
		category: "navigation",
	},
	{
		title: "Szukaj",
		href: "/wyszukiwanie",
		icon: Search,
		shortcut: "Ctrl+K",
		category: "search",
	},
	{
		title: "Kalkulator dawek",
		href: "/kalkulator-dawek",
		icon: Calculator,
		shortcut: "Alt+C",
		category: "tools",
	},
	{
		title: "Notatki",
		href: "/notatki",
		icon: Notebook,
		shortcut: "Alt+N",
		category: "learning",
	},
	{
		title: "Zakładki",
		href: "/zakladki",
		icon: Star,
		shortcut: "Alt+B",
		category: "learning",
	},
	{
		title: "Śledzenie",
		href: "/sledzenie",
		icon: Target,
		shortcut: "Alt+T",
		category: "tracking",
	},
	{
		title: "Rekomendacje",
		href: "/rekomendacje",
		icon: Lightbulb,
		shortcut: "Alt+R",
		category: "ai",
	},
	{
		title: "Ustawienia",
		href: "/ustawienia",
		icon: Settings,
		shortcut: "Alt+S",
		category: "account",
	},
];

export function QuickAccessToolbar({
	className,
	orientation = "vertical",
	position = "top-right",
}: QuickAccessToolbarProps) {
	const pathname = usePathname();

	const positionClasses = {
		"top-right": "top-4 right-4",
		"bottom-right": "bottom-4 right-4",
		"top-left": "top-4 left-4",
		"bottom-left": "bottom-4 left-4",
	};

	const orientationClasses = {
		horizontal: "flex-row gap-2",
		vertical: "flex-col gap-2",
	};

	return (
		<TooltipProvider>
			<div
				className={cn(
					"fixed z-50 flex transition-all duration-200 ease-in-out",
					positionClasses[position],
					orientationClasses[orientation],
					className,
				)}
			>
				{quickAccessActions.map((action) => {
					const IconComponent = action.icon;
					const isActive = pathname === action.href;

					return (
						<Tooltip key={action.href}>
							<TooltipTrigger asChild>
								<Button
									asChild
									variant={isActive ? "default" : "outline"}
									size="sm"
									className={cn(
										"h-10 w-10 p-0 shadow-lg backdrop-blur-sm",
										isActive && "ring-2 ring-primary/20",
									)}
								>
									<Link
										href={action.href}
										title={`${action.title} (${action.shortcut})`}
									>
										<IconComponent className="h-4 w-4" />
										<span className="sr-only">{action.title}</span>
									</Link>
								</Button>
							</TooltipTrigger>
							<TooltipContent
								side={orientation === "vertical" ? "left" : "bottom"}
							>
								<div className="text-center">
									<div className="font-medium">{action.title}</div>
									<div className="text-muted-foreground text-xs">
										{action.shortcut}
									</div>
								</div>
							</TooltipContent>
						</Tooltip>
					);
				})}
			</div>
		</TooltipProvider>
	);
}

// Floating Action Button version for mobile
export function QuickAccessFAB({ className }: { className?: string }) {
	const [isOpen, setIsOpen] = React.useState(false);
	const pathname = usePathname();

	const activeActions = quickAccessActions.filter(
		(action) => action.href !== pathname,
	);

	return (
		<TooltipProvider>
			<div className={cn("fixed right-4 bottom-4 z-50", className)}>
				{/* Expanded actions */}
				{isOpen && (
					<div className="mb-4 flex flex-col gap-2">
						{activeActions.slice(0, 6).map((action) => {
							const IconComponent = action.icon;
							return (
								<Tooltip key={action.href}>
									<TooltipTrigger asChild>
										<Button
											asChild
											variant="outline"
											size="sm"
											className="h-10 w-10 shadow-lg backdrop-blur-sm"
										>
											<Link href={action.href}>
												<IconComponent className="h-4 w-4" />
												<span className="sr-only">{action.title}</span>
											</Link>
										</Button>
									</TooltipTrigger>
									<TooltipContent side="left">
										<div className="text-center">
											<div className="font-medium">{action.title}</div>
											<div className="text-muted-foreground text-xs">
												{action.shortcut}
											</div>
										</div>
									</TooltipContent>
								</Tooltip>
							);
						})}
					</div>
				)}

				{/* Main FAB */}
				<Button
					onClick={() => setIsOpen(!isOpen)}
					size="lg"
					className="h-14 w-14 rounded-full shadow-lg"
				>
					<BookOpen
						className={cn(
							"h-6 w-6 transition-transform",
							isOpen && "rotate-45",
						)}
					/>
					<span className="sr-only">Szybki dostęp</span>
				</Button>
			</div>
		</TooltipProvider>
	);
}
