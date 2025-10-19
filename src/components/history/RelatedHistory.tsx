import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/server";
import { Suspense } from "react";
import { HistoryEntryCard } from "./HistoryEntryCard";

async function RelatedHistoryContent({
	supplementMongoId,
}: { supplementMongoId: string }) {
	const entries = await api.supplementHistory.getRelatedHistory({
		supplementMongoId,
	});

	if (!entries || entries.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Powiązany kontekst historyczny</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-center text-muted-foreground text-sm">
						Brak powiązanych wpisów historycznych dla tego suplementu.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Powiązany kontekst historyczny</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{entries.map((e) => (
					<HistoryEntryCard
						key={e.id}
						entry={{
							id: e.id,
							title: e.title,
							polishTitle: e.polishTitle,
							era: e.era,
							eraStartYear: e.eraStartYear,
							eraEndYear: e.eraEndYear,
							medicineSystem: e.medicineSystem,
							polishDescription: e.polishDescription,
							keyDiscoveries: e.keyDiscoveries,
							notablePractitioners: e.notablePractitioners,
							sources: e.sources,
							tags: e.tags,
						}}
					/>
				))}
			</CardContent>
		</Card>
	);
}

function RelatedHistoryLoading() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Powiązany kontekst historyczny</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{Array.from({ length: 2 }).map((_, i) => (
					<div key={i} className="space-y-3">
						<Skeleton className="h-6 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-full" />
					</div>
				))}
			</CardContent>
		</Card>
	);
}

export default function RelatedHistory({
	supplementMongoId,
}: { supplementMongoId?: string }) {
	if (!supplementMongoId) return null;

	return (
		<Suspense fallback={<RelatedHistoryLoading />}>
			<RelatedHistoryContent supplementMongoId={supplementMongoId} />
		</Suspense>
	);
}
