import Link from "next/link";
import { usePathname } from "next/navigation";
// Main Navigation Component
import * as React from "react";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const components: { title: string; href: string; description: string }[] = [
	{
		title: "Graf Wiedzy",
		href: "/graf-wiedzy",
		description:
			"Interaktywna wizualizacja powiązań między suplementami, neuroprzekaźnikami i funkcjami poznawczymi.",
	},
	{
		title: "Suplementy",
		href: "/suplementy",
		description:
			"Kompleksowa baza danych suplementów z informacjami o dawkowaniu, mechanizmach działania i bezpieczeństwie.",
	},
	{
		title: "Śledzenie",
		href: "/sledzenie",
		description:
			"Monitoruj swoje suplementy, postępy i efekty za pomocą intuicyjnego dashboardu.",
	},
	{
		title: "Edukacja",
		href: "/edukacja",
		description:
			"Zdobądź wiedzę o neurobiologii, neuroprzekaźnikach i mechanizmach działania suplementów.",
	},
	{
		title: "Rekomendacje",
		href: "/rekomendacje",
		description:
			"Personalizowane rekomendacje suplementów oparte na sztucznej inteligencji.",
	},
	{
		title: "Odkrywanie",
		href: "/odkrywanie",
		description:
			"Odkryj nowe suplementy i badania naukowe z naszej rozbudowanej bazy danych.",
	},
];

export function MainNavigation() {
	const pathname = usePathname();

	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Platforma</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li className="row-span-3">
								<NavigationMenuLink asChild>
									<Link
										className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
										href="/"
									>
										<div className="mt-4 mb-2 font-medium text-lg">
											Suplementor
										</div>
										<p className="text-muted-foreground text-sm leading-tight">
											Kompleksowa platforma edukacyjna o nootropikach i
											suplementach
										</p>
									</Link>
								</NavigationMenuLink>
							</li>
							<ListItem href="/graf-wiedzy" title="Graf Wiedzy">
								Interaktywna wizualizacja powiązań między suplementami
							</ListItem>
							<ListItem href="/suplementy" title="Suplementy">
								Szczegółowa baza danych suplementów
							</ListItem>
							<ListItem href="/historia-suplementow" title="Historia Suplementów">
								Oś czasu TCM, Ajurweda i inne systemy medyczne
							</ListItem>
							<ListItem href="/sledzenie" title="Śledzenie">
								Monitoruj swoje suplementy i postępy
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Narzędzia</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
							{components.map((component) => (
								<ListItem
									key={component.title}
									title={component.title}
									href={component.href}
								>
									{component.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<Link href="/wiedza" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							Wiedza
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<Link href="/profil" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							Profil
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a"> & { href: string }
>(({ className, title, children, href, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<Link
					ref={ref}
					href={href}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="font-medium text-sm leading-none">{title}</div>
					<p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
