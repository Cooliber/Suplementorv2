import type { Metadata } from "next";
import { api, HydrateClient } from "@/trpc/server";
import { type MedicineSystem } from "@/components/history/MedicineSystemFilter";
import { type HistoryEntry } from "@/components/history/HistoryEntryCard";
import { HistoryPageClient } from "./HistoryPageClient";

export const metadata: Metadata = {
  title: "Historia suplementów | SUPLEMENTOR",
  description: "Oś czasu tradycyjnych systemów medycznych (TCM, Ajurweda i inne) – przegląd kluczowych wydarzeń i źródeł.",
};

export default async function Page({ searchParams }: { searchParams?: { system?: MedicineSystem | "ALL" } }) {
  const system = (searchParams?.system ?? "ALL") as MedicineSystem | "ALL";
  const all = await api.supplementHistory.getTimeline(system === "ALL" ? undefined : { system });
  const entries = all.map((e): HistoryEntry => ({
    id: e.id,
    title: e.title,
    polishTitle: e.polishTitle,
    era: e.era,
    eraStartYear: e.eraStartYear,
    eraEndYear: e.eraEndYear,
    medicineSystem: e.medicineSystem as any,
    polishDescription: e.polishDescription,
    keyDiscoveries: e.keyDiscoveries,
    notablePractitioners: e.notablePractitioners as any,
    sources: e.sources as any,
    tags: e.tags,
  })).sort((a,b)=> a.eraStartYear - b.eraStartYear);

  return (
    <HydrateClient>
      <div className="container mx-auto space-y-6 px-4 py-8">
        <header className="space-y-2">
          <h1 className="font-bold text-3xl">Historia suplementów</h1>
          <p className="text-muted-foreground">Przegląd rozwoju tradycyjnych systemów medycznych i farmakologii roślinnej.</p>
        </header>

        <HistoryPageClient initialEntries={entries} />
      </div>
    </HydrateClient>
  );
}

