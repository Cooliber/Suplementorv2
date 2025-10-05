/**
 * Migration Script: Brain Regions Data
 * Migrates brain region data for 3D visualization with Polish translations
 */

import { BrainRegion } from "../models";
import connectToDatabase from "../mongodb";

// Sample brain regions data with Polish translations
const brainRegionsData = [
	{
		id: "frontal-cortex",
		name: "Frontal Cortex",
		polishName: "Kora Czołowa",
		category: "CORTEX",
		hemisphere: "BILATERAL",
		functions: [
			"Executive function",
			"Decision making",
			"Working memory",
			"Attention",
		],
		polishFunctions: [
			"Funkcje wykonawcze",
			"Podejmowanie decyzji",
			"Pamięć robocza",
			"Uwaga",
		],
		description:
			"The frontal cortex is responsible for executive functions, decision-making, and personality.",
		polishDescription:
			"Kora czołowa odpowiada za funkcje wykonawcze, podejmowanie decyzji i osobowość.",
		anatomicalInfo: {
			volume: 180.5,
			coordinates: { x: 0, y: 0.2, z: 0.3 },
			connections: ["Parietal cortex", "Temporal cortex", "Limbic system"],
			polishConnections: [
				"Kora ciemieniowa",
				"Kora skroniowa",
				"Układ limbiczny",
			],
			cytoarchitecture:
				"Six-layered neocortex with prominent pyramidal neurons",
			polishCytoarchitecture:
				"Sześciowarstwowa neokora z wyraźnymi neuronami piramidalnymi",
			bloodSupply: ["Anterior cerebral artery", "Middle cerebral artery"],
			polishBloodSupply: [
				"Tętnica mózgowa przednia",
				"Tętnica mózgowa środkowa",
			],
			clinicalRelevance:
				"Damage leads to executive dysfunction and personality changes",
			polishClinicalRelevance:
				"Uszkodzenie prowadzi do zaburzeń funkcji wykonawczych i zmian osobowości",
		},
		neurotransmitterActivity: [
			{
				neurotransmitter: "Dopamine",
				polishNeurotransmitter: "Dopamina",
				receptorTypes: ["D1", "D2"],
				polishReceptorTypes: ["D1", "D2"],
				activity: "HIGH",
				function: "Motivation and reward processing",
				polishFunction: "Motywacja i przetwarzanie nagród",
				pathways: ["Mesocortical pathway"],
				polishPathways: ["Szlak mezokortykalny"],
			},
			{
				neurotransmitter: "Norepinephrine",
				polishNeurotransmitter: "Noradrenalina",
				receptorTypes: ["Alpha-1", "Alpha-2", "Beta"],
				polishReceptorTypes: ["Alfa-1", "Alfa-2", "Beta"],
				activity: "MODERATE",
				function: "Attention and arousal",
				polishFunction: "Uwaga i pobudzenie",
				pathways: ["Locus coeruleus projections"],
				polishPathways: ["Projekcje z locus coeruleus"],
			},
		],
		functionalNetworks: [
			{
				networkName: "Central Executive Network",
				polishNetworkName: "Centralna Sieć Wykonawcza",
				role: "Primary hub for cognitive control",
				polishRole: "Główny węzeł kontroli poznawczej",
				connectivity: 0.85,
				hubStatus: true,
				associatedDisorders: ["ADHD", "Depression", "Schizophrenia"],
				polishAssociatedDisorders: ["ADHD", "Depresja", "Schizofrenia"],
			},
		],
		supplementEffects: [
			{
				supplementId: "l-tyrosine",
				supplementName: "L-Tyrosine",
				polishSupplementName: "L-Tyrozyna",
				effectType: "ENHANCES",
				intensity: 0.7,
				mechanism: "Increases dopamine synthesis in prefrontal cortex",
				polishMechanism: "Zwiększa syntezę dopaminy w korze przedczołowej",
				evidenceLevel: "MODERATE",
				visualEffect: {
					color: "#4CAF50",
					pulseSpeed: 1.2,
					glowIntensity: 0.6,
				},
				timeToEffect: "30-60 minutes",
				polishTimeToEffect: "30-60 minut",
				duration: "4-6 hours",
				polishDuration: "4-6 godzin",
			},
		],
		educationalContent: {
			beginnerDescription:
				"The frontal lobe is like the CEO of your brain - it makes decisions and controls behavior.",
			polishBeginnerDescription:
				"Płat czołowy jest jak dyrektor generalny mózgu - podejmuje decyzje i kontroluje zachowanie.",
			intermediateDescription:
				"The frontal cortex integrates information from other brain regions to execute complex cognitive tasks.",
			polishIntermediateDescription:
				"Kora czołowa integruje informacje z innych regionów mózgu, aby wykonywać złożone zadania poznawcze.",
			expertDescription:
				"The prefrontal cortex exhibits extensive reciprocal connections with subcortical structures, enabling top-down cognitive control.",
			polishExpertDescription:
				"Kora przedczołowa wykazuje rozległe wzajemne połączenia ze strukturami podkorowymi, umożliwiając odgórną kontrolę poznawczą.",
			keyFacts: [
				"Contains 25% of all cortical neurons",
				"Fully matures around age 25",
				"Critical for working memory",
			],
			polishKeyFacts: [
				"Zawiera 25% wszystkich neuronów korowych",
				"Dojrzewa w pełni około 25 roku życia",
				"Kluczowa dla pamięci roboczej",
			],
			interactiveTips: [
				"Click to see dopamine pathways",
				"Hover to view supplement effects",
			],
			polishInteractiveTips: [
				"Kliknij, aby zobaczyć szlaki dopaminowe",
				"Najedź, aby zobaczyć efekty suplementów",
			],
			relatedConcepts: [
				"Executive function",
				"Working memory",
				"Cognitive control",
			],
			polishRelatedConcepts: [
				"Funkcje wykonawcze",
				"Pamięć robocza",
				"Kontrola poznawcza",
			],
		},
		visualizationProperties: {
			position: { x: 0, y: 0.2, z: 0.3 },
			size: 1.2,
			color: "#FF6B6B",
			opacity: 0.8,
			shape: "IRREGULAR",
			animationProperties: {
				rotationSpeed: 0.005,
				pulseEnabled: true,
				pulseSpeed: 1.0,
				hoverEffect: true,
			},
			labelPosition: { x: 0, y: 0.4, z: 0 },
		},
		clinicalSignificance: "Critical for executive function and personality",
		polishClinicalSignificance:
			"Kluczowa dla funkcji wykonawczych i osobowości",
		associatedDisorders: ["ADHD", "Depression", "Dementia"],
		polishAssociatedDisorders: ["ADHD", "Depresja", "Demencja"],
		researchAreas: ["Cognitive neuroscience", "Neuroplasticity", "Aging"],
		polishResearchAreas: [
			"Neuronauki poznawcze",
			"Neuroplastyczność",
			"Starzenie",
		],
		tags: ["executive", "cognition", "decision-making"],
		polishTags: ["wykonawcze", "poznanie", "podejmowanie-decyzji"],
		difficultyLevel: "INTERMEDIATE",
	},
	{
		id: "hippocampus",
		name: "Hippocampus",
		polishName: "Hipokamp",
		category: "LIMBIC",
		hemisphere: "BILATERAL",
		functions: ["Memory formation", "Spatial navigation", "Learning"],
		polishFunctions: [
			"Tworzenie pamięci",
			"Nawigacja przestrzenna",
			"Uczenie się",
		],
		description:
			"The hippocampus is crucial for forming new memories and spatial navigation.",
		polishDescription:
			"Hipokamp jest kluczowy dla tworzenia nowych wspomnień i nawigacji przestrzennej.",
		anatomicalInfo: {
			volume: 4.2,
			coordinates: { x: 0.15, y: -0.1, z: -0.2 },
			connections: ["Entorhinal cortex", "Fornix", "Mammillary bodies"],
			polishConnections: ["Kora śródwęchowa", "Sklepienie", "Ciała sutkowate"],
			cytoarchitecture: "Archicortex with distinct CA fields and dentate gyrus",
			polishCytoarchitecture:
				"Archikora z odrębnymi polami CA i zakrętem zębatym",
			bloodSupply: ["Posterior cerebral artery"],
			polishBloodSupply: ["Tętnica mózgowa tylna"],
			clinicalRelevance: "First affected in Alzheimer's disease",
			polishClinicalRelevance:
				"Pierwsza struktura dotknięta chorobą Alzheimera",
		},
		neurotransmitterActivity: [
			{
				neurotransmitter: "Acetylcholine",
				polishNeurotransmitter: "Acetylocholina",
				receptorTypes: ["Nicotinic", "Muscarinic"],
				polishReceptorTypes: ["Nikotynowe", "Muskarynowe"],
				activity: "HIGH",
				function: "Memory consolidation and attention",
				polishFunction: "Konsolidacja pamięci i uwaga",
				pathways: ["Septohippocampal pathway"],
				polishPathways: ["Szlak przegrodowo-hipokampalny"],
			},
		],
		functionalNetworks: [
			{
				networkName: "Default Mode Network",
				polishNetworkName: "Domyślna Sieć Mózgu",
				role: "Memory retrieval and self-referential thinking",
				polishRole: "Odzyskiwanie pamięci i myślenie autoreferencyjne",
				connectivity: 0.75,
				hubStatus: false,
				associatedDisorders: ["Alzheimer's disease", "Depression"],
				polishAssociatedDisorders: ["Choroba Alzheimera", "Depresja"],
			},
		],
		supplementEffects: [
			{
				supplementId: "bacopa-monnieri",
				supplementName: "Bacopa Monnieri",
				polishSupplementName: "Bakopa Drobnolistna",
				effectType: "ENHANCES",
				intensity: 0.8,
				mechanism: "Enhances dendritic branching and synaptic transmission",
				polishMechanism:
					"Wzmacnia rozgałęzianie dendrytów i transmisję synaptyczną",
				evidenceLevel: "STRONG",
				visualEffect: {
					color: "#2196F3",
					pulseSpeed: 0.8,
					glowIntensity: 0.7,
				},
				timeToEffect: "4-6 weeks",
				polishTimeToEffect: "4-6 tygodni",
				duration: "Long-term",
				polishDuration: "Długoterminowy",
			},
		],
		educationalContent: {
			beginnerDescription:
				"The hippocampus is your brain's memory center - it helps you remember new things.",
			polishBeginnerDescription:
				"Hipokamp to centrum pamięci mózgu - pomaga zapamiętywać nowe rzeczy.",
			intermediateDescription:
				"The hippocampus converts short-term memories into long-term memories through a process called consolidation.",
			polishIntermediateDescription:
				"Hipokamp przekształca pamięć krótkotrwałą w długotrwałą poprzez proces zwany konsolidacją.",
			expertDescription:
				"The hippocampus exhibits theta oscillations during active exploration and sharp-wave ripples during memory consolidation.",
			polishExpertDescription:
				"Hipokamp wykazuje oscylacje theta podczas aktywnej eksploracji i ostre fale ripple podczas konsolidacji pamięci.",
			keyFacts: [
				"Named after its seahorse-like shape",
				"Generates new neurons throughout life",
				"Essential for episodic memory",
			],
			polishKeyFacts: [
				"Nazwany od kształtu przypominającego konika morskiego",
				"Generuje nowe neurony przez całe życie",
				"Niezbędny dla pamięci epizodycznej",
			],
			interactiveTips: [
				"Explore memory pathways",
				"See neurogenesis in action",
			],
			polishInteractiveTips: [
				"Poznaj szlaki pamięci",
				"Zobacz neurogenezę w działaniu",
			],
			relatedConcepts: [
				"Memory consolidation",
				"Neurogenesis",
				"Spatial memory",
			],
			polishRelatedConcepts: [
				"Konsolidacja pamięci",
				"Neurogeneza",
				"Pamięć przestrzenna",
			],
		},
		visualizationProperties: {
			position: { x: 0.15, y: -0.1, z: -0.2 },
			size: 0.8,
			color: "#9C27B0",
			opacity: 0.9,
			shape: "ELLIPSOID",
			animationProperties: {
				rotationSpeed: 0.003,
				pulseEnabled: true,
				pulseSpeed: 0.8,
				hoverEffect: true,
			},
			labelPosition: { x: 0.2, y: 0.1, z: 0 },
		},
		clinicalSignificance:
			"First affected in Alzheimer's disease and memory disorders",
		polishClinicalSignificance:
			"Pierwsza struktura dotknięta chorobą Alzheimera i zaburzeniami pamięci",
		associatedDisorders: ["Alzheimer's disease", "Amnesia", "PTSD"],
		polishAssociatedDisorders: ["Choroba Alzheimera", "Amnezja", "PTSD"],
		researchAreas: ["Memory research", "Neurogenesis", "Alzheimer's disease"],
		polishResearchAreas: [
			"Badania pamięci",
			"Neurogeneza",
			"Choroba Alzheimera",
		],
		tags: ["memory", "learning", "spatial"],
		polishTags: ["pamięć", "uczenie", "przestrzenne"],
		difficultyLevel: "INTERMEDIATE",
	},
];

interface MigrationResult {
	success: boolean;
	created: number;
	updated: number;
	errors: string[];
	duration: number;
}

/**
 * Migrate brain regions data to MongoDB
 */
export async function migrateBrainRegions(): Promise<MigrationResult> {
	const startTime = Date.now();
	const result: MigrationResult = {
		success: false,
		created: 0,
		updated: 0,
		errors: [],
		duration: 0,
	};

	try {
		console.log("🔄 Starting brain regions migration...");

		await connectToDatabase();

		for (const regionData of brainRegionsData) {
			try {
				const existingRegion = await BrainRegion.findOne({ id: regionData.id });

				if (existingRegion) {
					await BrainRegion.findOneAndUpdate(
						{ id: regionData.id },
						{
							...regionData,
							lastUpdated: new Date(),
							version: "1.0.0",
						},
						{ upsert: true, new: true },
					);
					result.updated++;
					console.log(`✅ Updated brain region: ${regionData.polishName}`);
				} else {
					const newRegion = new BrainRegion({
						...regionData,
						lastUpdated: new Date(),
						version: "1.0.0",
						isActive: true,
					});

					await newRegion.save();
					result.created++;
					console.log(`✨ Created brain region: ${regionData.polishName}`);
				}
			} catch (error) {
				const errorMessage = `Failed to process brain region ${regionData.id}: ${error}`;
				result.errors.push(errorMessage);
				console.error(`❌ ${errorMessage}`);
			}
		}

		result.success = result.errors.length === 0;
		result.duration = Date.now() - startTime;

		console.log("🎉 Brain regions migration completed:");
		console.log(`   Created: ${result.created}`);
		console.log(`   Updated: ${result.updated}`);
		console.log(`   Errors: ${result.errors.length}`);
		console.log(`   Duration: ${result.duration}ms`);

		return result;
	} catch (error) {
		result.errors.push(`Migration failed: ${error}`);
		result.duration = Date.now() - startTime;
		console.error(`❌ Brain regions migration failed: ${error}`);
		return result;
	}
}

/**
 * Create indexes for brain regions
 */
export async function createBrainRegionIndexes(): Promise<void> {
	try {
		console.log("🔄 Creating brain region indexes...");

		await connectToDatabase();

		// Text search indexes
		await BrainRegion.collection.createIndex(
			{
				name: "text",
				polishName: "text",
				description: "text",
				polishDescription: "text",
				polishFunctions: "text",
			},
			{
				name: "brain_region_text_search",
				weights: {
					polishName: 10,
					name: 8,
					polishFunctions: 6,
					polishDescription: 4,
				},
			},
		);

		// Category and hemisphere index
		await BrainRegion.collection.createIndex(
			{
				category: 1,
				hemisphere: 1,
				isActive: 1,
			},
			{ name: "category_hemisphere_active" },
		);

		// Supplement effects index
		await BrainRegion.collection.createIndex(
			{
				"supplementEffects.supplementId": 1,
				"supplementEffects.effectType": 1,
			},
			{ name: "supplement_effects" },
		);

		// Spatial coordinates index for 3D visualization
		await BrainRegion.collection.createIndex(
			{
				"visualizationProperties.position.x": 1,
				"visualizationProperties.position.y": 1,
				"visualizationProperties.position.z": 1,
			},
			{ name: "spatial_coordinates" },
		);

		console.log("✅ Brain region indexes created successfully");
	} catch (error) {
		console.error("❌ Failed to create brain region indexes:", error);
		throw error;
	}
}

/**
 * Run the complete brain regions migration
 */
export async function runBrainRegionMigration(): Promise<void> {
	try {
		console.log("🚀 Starting complete brain regions migration process...");

		const migrationResult = await migrateBrainRegions();

		if (!migrationResult.success) {
			throw new Error(
				`Migration failed with ${migrationResult.errors.length} errors`,
			);
		}

		await createBrainRegionIndexes();

		console.log(
			"🎉 Complete brain regions migration process finished successfully!",
		);
	} catch (error) {
		console.error("❌ Complete brain regions migration process failed:", error);
		throw error;
	}
}

export default {
	migrateBrainRegions,
	createBrainRegionIndexes,
	runBrainRegionMigration,
};
