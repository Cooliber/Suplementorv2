/**
 * Language Switcher Component
 * Allows users to switch between Polish and English (future feature)
 */

"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useState } from "react";

type Language = "pl" | "en";

export function LanguageSwitcher() {
	const [language, setLanguage] = useState<Language>("pl");

	const languages = [
		{ code: "pl" as const, name: "Polski", flag: "🇵🇱" },
		{ code: "en" as const, name: "English", flag: "🇬🇧" },
	];

	const currentLanguage = languages.find((lang) => lang.code === language);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="gap-2">
					<Globe className="h-4 w-4" />
					<span className="hidden sm:inline">
						{currentLanguage?.flag} {currentLanguage?.name}
					</span>
					<span className="sm:hidden">{currentLanguage?.flag}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{languages.map((lang) => (
					<DropdownMenuItem
						key={lang.code}
						onClick={() => setLanguage(lang.code)}
						className={
							language === lang.code ? "bg-gray-100 dark:bg-gray-800" : ""
						}
					>
						<span className="mr-2">{lang.flag}</span>
						{lang.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
