"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type HistoryEntry = {
	id: string;
	title: string;
	polishTitle: string;
	era: string;
	eraStartYear: number;
	eraEndYear: number;
	medicineSystem:
		| "TCM"
		| "AYURVEDA"
		| "GREEK_ROMAN"
		| "EUROPEAN_HERBALISM"
		| "MODERN_SCIENCE"
		| "OTHER";
	geographicRegion?: string;
	polishDescription: string;
	keyDiscoveries?: string[];
	notablePractitioners?: { name: string; role?: string; era?: string }[];
	sources?: { title: string; author?: string; year?: number; url?: string }[];
	tags?: string[];
};

export function HistoryEntryCard({ entry }: { entry: HistoryEntry }) {
	const dateRange = `${formatYear(entry.eraStartYear)} – ${formatYear(entry.eraEndYear)}`;
	return (
		<Card className="h-full">
			<CardHeader>
				<div className="mb-2 flex flex-wrap items-center gap-2">
					<Badge variant="secondary">{entry.medicineSystem}</Badge>
					<Badge variant="outline">{entry.era}</Badge>
					<span className="text-muted-foreground text-sm">{dateRange}</span>
				</div>
				<CardTitle className="leading-snug">
					<span className="block text-base text-muted-foreground">
						{entry.title}
					</span>
					<span className="block text-xl">{entry.polishTitle}</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{entry.polishDescription && (
					<p className="text-muted-foreground text-sm leading-relaxed">
						{entry.polishDescription}
					</p>
				)}

				{entry.keyDiscoveries && entry.keyDiscoveries.length > 0 && (
					<div>
						<div className="mb-1 font-medium text-sm">Kluczowe odkrycia</div>
						<ul className="list-disc space-y-1 pl-5 text-sm">
							{entry.keyDiscoveries.map((k, i) => (
								<li key={i}>{k}</li>
							))}
						</ul>
					</div>
				)}

				{entry.notablePractitioners &&
					entry.notablePractitioners.length > 0 && (
						<div>
							<div className="mb-1 font-medium text-sm">Wybitni praktycy</div>
							<ul className="space-y-1 text-sm">
								{entry.notablePractitioners.map((p, i) => (
									<li key={i}>
										<span className="font-medium">{p.name}</span>
										{p.role ? (
											<span className="text-muted-foreground"> — {p.role}</span>
										) : null}
										{p.era ? (
											<span className="text-muted-foreground"> ({p.era})</span>
										) : null}
									</li>
								))}
							</ul>
						</div>
					)}

				{entry.sources && entry.sources.length > 0 && (
					<div>
						<div className="mb-1 font-medium text-sm">Źródła</div>
						<ul className="space-y-1 text-sm">
							{entry.sources.map((s, i) => (
								<li key={i}>
									{s.url ? (
										<a
											href={s.url}
											target="_blank"
											rel="noreferrer"
											className="text-blue-600 underline"
										>
											{s.title}
										</a>
									) : (
										<span>{s.title}</span>
									)}
									{s.author ? (
										<span className="text-muted-foreground"> — {s.author}</span>
									) : null}
									{s.year ? (
										<span className="text-muted-foreground"> ({s.year})</span>
									) : null}
								</li>
							))}
						</ul>
					</div>
				)}

				{entry.tags && entry.tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{entry.tags.map((t, i) => (
							<Badge key={i} variant="outline">
								{t}
							</Badge>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function formatYear(y: number) {
	// BCE indicated by negative year
	return y < 0 ? `${Math.abs(y)} p.n.e.` : `${y} n.e.`;
}
