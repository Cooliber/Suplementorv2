/**
 * Intelligent Supplement Stack Analysis Engine
 *
 * Provides real-time analysis of supplement interactions, synergies, and optimization suggestions
 */

export interface Supplement {
	id: string;
	name: string;
	polishName: string;
	category: string;
	dosage: number;
	unit: string;
	timing: string;
	activeIngredients: string[];
	neuroEffects: string[];
	warnings: string[];
	interactions: SupplementInteraction[];
}

export interface SupplementInteraction {
	targetSupplement: string;
	type: 'synergistic' | 'antagonistic' | 'caution' | 'contraindicated';
	description: string;
	polishDescription: string;
	severity: 'low' | 'medium' | 'high';
	evidence: string;
}

export interface StackAnalysis {
	interactions: SupplementInteraction[];
	synergyScore: number;
	riskScore: number;
	optimizationSuggestions: OptimizationSuggestion[];
	timingConflicts: TimingConflict[];
	dosageWarnings: DosageWarning[];
}

export interface OptimizationSuggestion {
	type: 'add' | 'remove' | 'adjust_dosage' | 'change_timing';
	supplement?: string;
	description: string;
	polishDescription: string;
	priority: 'low' | 'medium' | 'high';
	potentialBenefit: number; // percentage improvement
}

export interface TimingConflict {
	supplements: string[];
	conflictType: 'empty_stomach_required' | 'with_food_required' | 'spacing_required';
	description: string;
	polishDescription: string;
}

export interface DosageWarning {
	supplement: string;
	currentDosage: number;
	recommendedMax: number;
	warningType: 'exceeds_recommended' | 'too_low' | 'interaction_multiplier';
}

// Known supplement interactions database
const INTERACTIONS_DB: Record<string, SupplementInteraction[]> = {
	'L-Theanine': [
		{
			targetSupplement: 'Caffeine',
			type: 'synergistic',
			description: 'Reduces jitters and anxiety from caffeine while maintaining cognitive benefits',
			polishDescription: 'Zmniejsza drżenie i lęk wywołany kofeiną przy jednoczesnym zachowaniu korzyści poznawczych',
			severity: 'low',
			evidence: 'Multiple studies show L-theanine modulates caffeine effects'
		},
		{
			targetSupplement: 'Omega-3',
			type: 'synergistic',
			description: 'Combined cognitive enhancement for memory and focus',
			polishDescription: 'Połączone wzmocnienie poznawcze dla pamięci i koncentracji',
			severity: 'medium',
			evidence: 'Clinical trials demonstrate additive effects on cognitive function'
		}
	],
	'Caffeine': [
		{
			targetSupplement: 'L-Theanine',
			type: 'synergistic',
			description: 'L-theanine reduces caffeine jitters while maintaining alertness',
			polishDescription: 'L-teanina zmniejsza drżenie wywołane kofeiną przy zachowaniu czujności',
			severity: 'low',
			evidence: 'Well-established combination in nootropic stacks'
		},
		{
			targetSupplement: 'Ashwagandha',
			type: 'caution',
			description: 'May increase anxiety if taken together',
			polishDescription: 'Może zwiększyć lęk przy jednoczesnym przyjmowaniu',
			severity: 'medium',
			evidence: 'Some users report increased anxiety with this combination'
		},
		{
			targetSupplement: 'Magnesium Glycinate',
			type: 'antagonistic',
			description: 'Magnesium may reduce caffeine absorption',
			polishDescription: 'Magnez może zmniejszyć wchłanianie kofeiny',
			severity: 'low',
			evidence: 'Magnesium can interfere with stimulant absorption'
		}
	],
	'Omega-3': [
		{
			targetSupplement: 'Vitamin D3',
			type: 'synergistic',
			description: 'Enhanced brain health and neuroprotection',
			polishDescription: 'Zwiększona ochrona zdrowia mózgu i neuroprotekcja',
			severity: 'medium',
			evidence: 'Vitamin D enhances omega-3 utilization in brain tissue'
		}
	],
	'Magnesium Glycinate': [
		{
			targetSupplement: 'Ashwagandha',
			type: 'synergistic',
			description: 'Enhanced stress reduction and sleep quality',
			polishDescription: 'Zwiększona redukcja stresu i jakość snu',
			severity: 'medium',
			evidence: 'Magnesium enhances adaptogen effectiveness'
		}
	]
};

const DOSAGE_LIMITS: Record<string, number> = {
	'Caffeine': 400, // mg/day
	'L-Theanine': 1200, // mg/day
	'Omega-3': 3000, // mg/day EPA+DHA
	'Magnesium Glycinate': 400, // mg/day elemental magnesium
	'Vitamin D3': 4000, // IU/day
	'Ashwagandha': 600, // mg/day
	'Rhodiola Rosea': 400, // mg/day
	'Bacopa Monnieri': 450 // mg/day
};

export function analyzeStack(supplements: Supplement[]): StackAnalysis {
	const interactions: SupplementInteraction[] = [];
	let synergyScore = 0;
	let riskScore = 0;
	const optimizationSuggestions: OptimizationSuggestion[] = [];
	const timingConflicts: TimingConflict[] = [];
	const dosageWarnings: DosageWarning[] = [];

	// Analyze interactions between supplements
	for (let i = 0; i < supplements.length; i++) {
		for (let j = i + 1; j < supplements.length; j++) {
			const supp1 = supplements[i];
			const supp2 = supplements[j];

			// Check for known interactions
			const interactions1 = INTERACTIONS_DB[supp1.name] || [];
			const interaction = interactions1.find(int => int.targetSupplement === supp2.name);

			if (interaction) {
				interactions.push({
					...interaction,
					targetSupplement: supp2.name
				});

				// Update scores based on interaction type
				switch (interaction.type) {
					case 'synergistic':
						synergyScore += interaction.severity === 'high' ? 30 : interaction.severity === 'medium' ? 20 : 10;
						break;
					case 'antagonistic':
						riskScore += interaction.severity === 'high' ? 40 : interaction.severity === 'medium' ? 25 : 10;
						break;
					case 'caution':
						riskScore += interaction.severity === 'high' ? 20 : interaction.severity === 'medium' ? 15 : 5;
						break;
					case 'contraindicated':
						riskScore += 50;
						break;
				}
			}
		}
	}

	// Check dosages
	supplements.forEach(supplement => {
		const maxDosage = DOSAGE_LIMITS[supplement.name];
		if (maxDosage && supplement.dosage > maxDosage) {
			dosageWarnings.push({
				supplement: supplement.name,
				currentDosage: supplement.dosage,
				recommendedMax: maxDosage,
				warningType: 'exceeds_recommended'
			});
			riskScore += 15;
		}
	});

	// Check timing conflicts
	const morningSupps = supplements.filter(s => s.timing === 'morning');
	const eveningSupps = supplements.filter(s => s.timing === 'evening');

	// Suggest improvements
	if (synergyScore < 30 && supplements.length >= 2) {
		optimizationSuggestions.push({
			type: 'add',
			description: 'Consider adding L-Theanine to reduce caffeine jitters',
			polishDescription: 'Rozważ dodanie L-Teaniny aby zmniejszyć drżenie z kofeiny',
			priority: 'medium',
			potentialBenefit: 25
		});
	}

	if (supplements.some(s => s.category === 'Stimulants') &&
		!supplements.some(s => s.category === 'Adaptogens')) {
		optimizationSuggestions.push({
			type: 'add',
			supplement: 'Ashwagandha',
			description: 'Add adaptogen to balance stimulant effects',
			polishDescription: 'Dodaj adaptogen aby zrównoważyć efekty stymulantów',
			priority: 'high',
			potentialBenefit: 30
		});
	}

	return {
		interactions,
		synergyScore: Math.min(synergyScore, 100),
		riskScore: Math.min(riskScore, 100),
		optimizationSuggestions,
		timingConflicts,
		dosageWarnings
	};
}

export function generateSmartSuggestions(currentStack: Supplement[], allSupplements: Supplement[]): OptimizationSuggestion[] {
	const suggestions: OptimizationSuggestion[] = [];
	const analysis = analyzeStack(currentStack);

	// Suggest synergistic combinations
	const availableSynergies = allSupplements.filter(supp =>
		!currentStack.some(current => current.id === supp.id) &&
		currentStack.some(current =>
			INTERACTIONS_DB[current.name]?.some(int =>
				int.targetSupplement === supp.name && int.type === 'synergistic'
			)
		)
	);

	availableSynergies.slice(0, 3).forEach(supp => {
		suggestions.push({
			type: 'add',
			supplement: supp.name,
			description: `Add ${supp.name} for synergistic effects with your current stack`,
			polishDescription: `Dodaj ${supp.polishName} dla synergicznych efektów z Twoim obecnym stosem`,
			priority: 'high',
			potentialBenefit: 25
		});
	});

	// Suggest removing antagonistic combinations
	const antagonisticPairs = analysis.interactions.filter(int => int.type === 'antagonistic');
	antagonisticPairs.forEach(interaction => {
		const supplementToRemove = currentStack.find(s => s.name === interaction.targetSupplement);
		if (supplementToRemove) {
			suggestions.push({
				type: 'remove',
				supplement: supplementToRemove.name,
				description: `Consider removing ${supplementToRemove.name} due to antagonistic interaction`,
				polishDescription: `Rozważ usunięcie ${supplementToRemove.polishName} ze względu na antagonistyczną interakcję`,
				priority: 'high',
				potentialBenefit: 20
			});
		}
	});

	return suggestions;
}
