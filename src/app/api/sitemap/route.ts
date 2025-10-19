import { NextResponse } from "next/server";

// Static routes that don't change often
const staticRoutes = [
	"",
	"/wiedza",
	"/suplementy",
	"/kalkulator-dawek",
	"/stack-builder",
	"/graf-wiedzy",
	"/obszary-mozgu",
	"/neuroprzekazniki",
	"/mechanizmy",
	"/system-endokannabinoidowy",
	"/tcm",
	"/psychology",
	"/edukacja",
	"/badania",
	"/historia-suplementow",
	"/uklad-ciala",
];

// Dynamic supplement routes (would be fetched from database in real implementation)
const supplementCategories = [
	"nootropiki",
	"witaminy",
	"mineraly",
	"aminokwasy",
	"ziola-adaptogeny",
	"grzyby",
	"kwasy-tluszczowe",
];

function generateSitemapUrls(baseUrl: string) {
	const currentDate = new Date().toISOString();

	const urls = [
		// Homepage - highest priority
		{
			url: baseUrl,
			lastModified: currentDate,
			changeFrequency: "daily",
			priority: 1.0,
		},

		// Main sections - high priority
		{
			url: `${baseUrl}/wiedza`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/suplementy`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/kalkulator-dawek`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/stack-builder`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.8,
		},

		// Educational sections - medium priority
		...staticRoutes.slice(4).map((route) => ({
			url: `${baseUrl}${route}`,
			lastModified: currentDate,
			changeFrequency: "monthly" as const,
			priority: 0.7,
		})),

		// Supplement categories - medium priority
		...supplementCategories.map((category) => ({
			url: `${baseUrl}/suplementy/${category}`,
			lastModified: currentDate,
			changeFrequency: "weekly" as const,
			priority: 0.6,
		})),
	];

	return urls;
}

export async function GET() {
	const baseUrl =
		process.env.NEXT_PUBLIC_SITE_URL || "https://suplementor.vercel.app";

	const sitemapUrls = generateSitemapUrls(baseUrl);

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
	.map(
		({ url, lastModified, changeFrequency, priority }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`,
	)
	.join("\n")}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 24 hours
		},
	});
}
