"use client";
import {
	type HistoryEntry,
	HistoryEntryCard,
} from "@/components/history/HistoryEntryCard";
import {
	type MedicineSystem,
	MedicineSystemFilter,
} from "@/components/history/MedicineSystemFilter";
import { SupplementTimeline } from "@/components/history/SupplementTimeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

export function HistoryPageClient({
	initialEntries,
}: { initialEntries: HistoryEntry[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = React.useState("");
	const [filteredEntries, setFilteredEntries] = React.useState(initialEntries);

	const currentSystem = (searchParams.get("system") ?? "ALL") as
		| MedicineSystem
		| "ALL";

	const handleSystemChange = React.useCallback(
		(system: MedicineSystem | "ALL") => {
			const params = new URLSearchParams(searchParams.toString());
			if (system === "ALL") {
				params.delete("system");
			} else {
				params.set("system", system);
			}
			router.push(`/historia-suplementow?${params.toString()}`, {
				scroll: false,
			});
		},
		[router, searchParams],
	);

	React.useEffect(() => {
		if (!searchQuery.trim()) {
			setFilteredEntries(initialEntries);
			return;
		}
		const q = searchQuery.toLowerCase();
		const filtered = initialEntries.filter(
			(e) =>
				e.title.toLowerCase().includes(q) ||
				e.polishTitle.toLowerCase().includes(q) ||
				e.polishDescription.toLowerCase().includes(q) ||
				e.tags?.some((t) => t.toLowerCase().includes(q)),
		);
		setFilteredEntries(filtered);
	}, [searchQuery, initialEntries]);

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<MedicineSystemFilter
					value={currentSystem}
					onChange={handleSystemChange}
				/>

				<div className="relative flex-1 md:max-w-md">
					<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Szukaj w historii..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pr-9 pl-9"
					/>
					{searchQuery && (
						<Button
							variant="ghost"
							size="sm"
							className="-translate-y-1/2 absolute top-1/2 right-1 h-7 w-7 p-0"
							onClick={() => setSearchQuery("")}
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>

				<div className="text-muted-foreground text-sm">
					Liczba wpisów: {filteredEntries.length}
					{searchQuery && ` (z ${initialEntries.length})`}
				</div>
			</div>

			<SupplementTimeline entries={filteredEntries} />

			<section className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{filteredEntries.length === 0 ? (
					<div className="col-span-full py-12 text-center text-muted-foreground">
						Nie znaleziono wpisów pasujących do kryteriów wyszukiwania.
					</div>
				) : (
					filteredEntries.map((e) => <HistoryEntryCard key={e.id} entry={e} />)
				)}
			</section>
		</div>
	);
}
