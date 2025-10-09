import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bodySystems } from "@/data/body-systems";

export const metadata: Metadata = {
	title: "Układy Ciała | Suplementor",
	description: "Poznaj anatomię i funkcje różnych układów ciała oraz wpływ suplementów",
};

export default function BodySystemsPage() {
	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6">Układy Ciała Człowieka</h1>
			<p className="text-lg mb-8">
				Poznaj główne układy ciała człowieka, ich funkcje oraz suplementy, które mogą wspierać ich zdrowie.
			</p>

			{/* Body Systems Grid */}
			<div className="mb-12">
				<h2 className="text-2xl font-semibold mb-4">Główne Układy Ciała</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{bodySystems.map((system) => (
						<Card key={system.id} className="overflow-hidden">
							<CardHeader className={`bg-gradient-to-r from-${getSystemColor(system.id)}-100 to-${getSystemColor(system.id)}-50`}>
								<CardTitle>{system.polishName}</CardTitle>
								<CardDescription>{system.name}</CardDescription>
							</CardHeader>
							<CardContent className="pt-6">
								<p className="mb-4">{system.polishDescription}</p>
								
								<h3 className="font-semibold mb-2">Główne Narządy:</h3>
								<ul className="list-disc pl-5 mb-4">
									{system.organs.map((organ) => (
										<li key={organ.id}>
											<span className="font-medium">{organ.polishName}</span> ({organ.name})
										</li>
									))}
								</ul>
								
								<h3 className="font-semibold mb-2">Funkcje:</h3>
								<ul className="list-disc pl-5 mb-4">
									{system.polishFunctions.map((func, index) => (
										<li key={index}>{func}</li>
									))}
								</ul>
								
								<h3 className="font-semibold mb-2">Powiązane Suplementy:</h3>
								<div className="space-y-2">
									{system.relatedSupplements.map((supplement) => (
										<div key={supplement.supplementId} className="p-2 rounded bg-gray-50">
											<div className="font-medium">{supplement.polishSupplementName}</div>
											<div className="text-sm text-gray-600">{supplement.polishMechanism}</div>
											<div className="text-xs mt-1">
												Poziom dowodów: {translateEvidenceLevel(supplement.evidenceLevel)}
											</div>
										</div>
									))}
								</div>
								
								<div className="mt-6 pt-4 border-t">
									<h3 className="font-semibold mb-2">Znaczenie Kliniczne:</h3>
									<p className="text-sm text-gray-700">
										{system.anatomicalInfo.polishClinicalRelevance}
									</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Educational Tabs */}
			<Card>
				<CardHeader>
					<CardTitle>Poziomy Wiedzy</CardTitle>
					<CardDescription>
						Wybierz poziom szczegółowości wyjaśnień
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="beginner">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="beginner">Początkujący</TabsTrigger>
							<TabsTrigger value="intermediate">Średniozaawansowany</TabsTrigger>
							<TabsTrigger value="expert">Ekspert</TabsTrigger>
						</TabsList>

						<TabsContent value="beginner" className="space-y-4 mt-4">
							<div className="bg-green-50 p-4 rounded-lg border border-green-200">
								<h4 className="font-semibold mb-2 text-green-800">Podstawy Anatomii Człowieka</h4>
								<p className="text-sm text-green-700 leading-relaxed">
									Ciało człowieka składa się z różnych układów, z których każdy pełni określone funkcje. 
									Układ sercowo-naczyniowy transportuje krew i składniki odżywcze, układ pokarmowy przetwarza 
									pożywienie, a układ odpornościowy chroni przed infekcjami. Suplementy mogą wspierać 
									prawidłowe funkcjonowanie tych układów, dostarczając niezbędnych składników odżywczych.
								</p>
							</div>
						</TabsContent>

						<TabsContent value="intermediate" className="space-y-4 mt-4">
							<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
								<h4 className="font-semibold mb-2 text-blue-800">Funkcjonalna Organizacja Ciała</h4>
								<p className="text-sm text-blue-700 leading-relaxed">
									Układy ciała człowieka współpracują ze sobą, tworząc zintegrowaną całość. Układ sercowo-naczyniowy 
									dostarcza tlen i składniki odżywcze do wszystkich tkanek, układ pokarmowy przetwarza pożywienie 
									na użyteczne substancje, a układ odpornościowy zapewnia ochronę przed patogenami. Suplementy 
									mogą wpływać na te układy poprzez modulację procesów metabolicznych, wsparcie funkcji narządów 
									i dostarczanie kofaktorów dla enzymów.
								</p>
							</div>
						</TabsContent>

						<TabsContent value="expert" className="space-y-4 mt-4">
							<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
								<h4 className="font-semibold mb-2 text-purple-800">Fizjologia Molekularna</h4>
								<p className="text-sm text-purple-700 leading-relaxed">
									Funkcjonowanie układów ciała opiera się na precyzyjnych mechanizmach molekularnych i szlakach 
									sygnałowych. Układ sercowo-naczyniowy regulowany jest przez mechanizmy neurohormonalne i 
									śródbłonkowe czynniki wazoaktywne. Układ pokarmowy wykorzystuje złożone procesy enzymatyczne 
									i transportery błonowe. Układ odpornościowy działa poprzez rozpoznawanie wzorców molekularnych, 
									prezentację antygenów i kaskady sygnałowe. Suplementy mogą modulować te procesy poprzez 
									wpływ na ekspresję genów, aktywność enzymów i funkcje receptorów.
								</p>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}

// Helper functions
function getSystemColor(systemId: string): string {
	switch (systemId) {
		case "cardiovascular":
			return "red";
		case "digestive":
			return "amber";
		case "immune":
			return "blue";
		default:
			return "gray";
	}
}

function translateEvidenceLevel(level: string): string {
	switch (level) {
		case "STRONG":
			return "Silny";
		case "MODERATE":
			return "Umiarkowany";
		case "WEAK":
			return "Słaby";
		case "INSUFFICIENT":
			return "Niewystarczający";
		default:
			return "Nieznany";
	}
}