/**
 * Polish Meta Tags Component
 * SEO-optimized meta tags for Polish content
 */

import type { Metadata } from "next";

interface PolishMetaTagsProps {
	title: string;
	description: string;
	keywords?: string[];
	ogImage?: string;
	canonical?: string;
}

export function generatePolishMetadata({
	title,
	description,
	keywords = [],
	ogImage = "/og-image.png",
	canonical,
}: PolishMetaTagsProps): Metadata {
	const siteName = "Suplementor";
	const fullTitle = `${title} | ${siteName}`;

	const defaultKeywords = [
		"suplementy",
		"nootropiki",
		"zdrowie",
		"mózg",
		"koncentracja",
		"pamięć",
		"wydajność poznawcza",
		"adaptogeny",
		"witaminy",
		"minerały",
	];

	const allKeywords = [...defaultKeywords, ...keywords].join(", ");

	return {
		title: fullTitle,
		description,
		keywords: allKeywords,
		authors: [{ name: siteName }],
		creator: siteName,
		publisher: siteName,
		formatDetection: {
			email: false,
			address: false,
			telephone: false,
		},
		openGraph: {
			title: fullTitle,
			description,
			url: canonical,
			siteName,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
			locale: "pl_PL",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: fullTitle,
			description,
			images: [ogImage],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		alternates: {
			canonical,
			languages: {
				"pl-PL": canonical,
			},
		},
	};
}

// Pre-defined metadata for common pages
export const polishMetadata = {
	home: generatePolishMetadata({
		title: "Strona Główna",
		description:
			"Kompleksowa platforma edukacyjna o nootropikach i wzmacnianiu funkcji poznawczych. Odkryj moc suplementów opartych na dowodach naukowych.",
		keywords: ["strona główna", "platforma edukacyjna", "nootropiki"],
	}),

	search: generatePolishMetadata({
		title: "Wyszukiwanie Suplementów",
		description:
			"Przeszukuj bazę 200+ suplementów z polskimi tłumaczeniami. Filtry według kategorii, poziomu dowodów i efektów.",
		keywords: ["wyszukiwanie", "filtry", "kategorie", "baza suplementów"],
	}),

	stackBuilder: generatePolishMetadata({
		title: "Kreator Stosu Suplementów",
		description:
			"Zbuduj i optymalizuj swój stos suplementów. Sprawdź interakcje, synergie i przeciwwskazania.",
		keywords: ["kreator stosu", "interakcje", "synergie", "optymalizacja"],
	}),

	tcm: generatePolishMetadata({
		title: "Tradycyjna Medycyna Chińska",
		description:
			"Odkryj starożytną mądrość TCM z nowoczesnym podejściem naukowym. Pięć Elementów, zioła i klasyczne formuły.",
		keywords: ["TCM", "medycyna chińska", "pięć elementów", "zioła", "formuły"],
	}),

	brain: generatePolishMetadata({
		title: "Interaktywny Model Mózgu 3D",
		description:
			"Eksploruj regiony mózgu i ich funkcje w interaktywnym modelu 3D. Dowiedz się, jak suplementy wpływają na mózg.",
		keywords: ["mózg 3D", "regiony mózgu", "neurologia", "funkcje poznawcze"],
	}),
};
