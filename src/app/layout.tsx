import "@/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Geist, Inter } from "next/font/google";

import { GDPRConsentBanner } from "@/components/analytics/GDPRConsentBanner";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TRPCReactProvider } from "@/trpc/react";

// Enhanced metadata for Polish educational platform
export const metadata: Metadata = {
	title: {
		default: "Suplementor - Polska Platforma Edukacyjna o Nootropikach",
		template: "%s | Suplementor",
	},
	description:
		"Kompleksowa polska platforma edukacyjna o nootropikach i wzmacnianiu funkcji poznawczych. Interaktywne wizualizacje 3D mózgu, baza suplementów z polskimi tłumaczeniami i dowodami naukowymi.",
	keywords: [
		"nootropiki",
		"suplementy",
		"funkcje poznawcze",
		"mózg",
		"neuroplastyczność",
		"edukacja medyczna",
		"polska platforma",
		"wzmacnianie pamięci",
		"koncentracja",
		"neurobiologia",
	],
	authors: [{ name: "Suplementor Team" }],
	creator: "Suplementor",
	publisher: "Suplementor",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://suplementor.pl"),
	alternates: {
		canonical: "/",
		languages: {
			"pl-PL": "/",
			"en-US": "/en",
		},
	},
	openGraph: {
		type: "website",
		locale: "pl_PL",
		url: "https://suplementor.pl",
		title: "Suplementor - Polska Platforma Edukacyjna o Nootropikach",
		description:
			"Kompleksowa polska platforma edukacyjna o nootropikach i wzmacnianiu funkcji poznawczych.",
		siteName: "Suplementor",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Suplementor - Edukacja o Nootropikach",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Suplementor - Polska Platforma Edukacyjna o Nootropikach",
		description:
			"Kompleksowa polska platforma edukacyjna o nootropikach i wzmacnianiu funkcji poznawczych.",
		images: ["/twitter-image.png"],
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
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/icon.svg", type: "image/svg+xml" },
		],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
	},
	manifest: "/manifest.json",
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
};

// Font configuration with Polish character support
const geist = Geist({
	subsets: ["latin", "latin-ext"], // Added latin-ext for Polish characters
	variable: "--font-geist-sans",
	display: "swap",
});

const inter = Inter({
	subsets: ["latin", "latin-ext"], // Added latin-ext for Polish characters
	variable: "--font-inter",
	display: "swap",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="pl"
			className={`${geist.variable} ${inter.variable}`}
			suppressHydrationWarning
		>
			<head>
				{/* Polish language meta tags */}
				<meta httpEquiv="Content-Language" content="pl" />
				<meta name="language" content="Polish" />
				<meta name="geo.region" content="PL" />
				<meta name="geo.country" content="Poland" />

				{/* Medical disclaimer for Polish users */}
				<meta
					name="medical-disclaimer"
					content="Informacje zawarte w tej aplikacji mają charakter edukacyjny i nie zastępują konsultacji z lekarzem."
				/>

				{/* Preload critical resources */}
				<link
					rel="preload"
					href="/fonts/geist-sans.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/models/brain-model.glb"
					as="fetch"
					crossOrigin="anonymous"
				/>
			</head>
			<body className="min-h-screen bg-background font-sans antialiased">
				<ErrorBoundary>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<TRPCReactProvider>
							<div className="relative flex min-h-screen flex-col">
								<div className="flex-1">{children}</div>
							</div>
							<Toaster />
							<Sonner />
						</TRPCReactProvider>
					</ThemeProvider>
				</ErrorBoundary>
				<Analytics />
				<SpeedInsights />
				<GDPRConsentBanner />
			</body>
		</html>
	);
}
