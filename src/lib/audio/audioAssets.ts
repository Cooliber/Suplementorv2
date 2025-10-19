/**
 * Audio Assets Configuration for Suplementor
 * Defines all audio assets, their properties, and Polish language support
 */

import type {
	AudioAsset,
	BrainRegionAudioData,
	NeurotransmitterAudioData,
	SupplementAudioData,
} from "./types";

/**
 * Audio assets for brain region interactions
 */
export const brainRegionAudioAssets: AudioAsset[] = [
	{
		id: "brain-region-select-soft",
		url: "/audio/sfx/brain/region-select-soft.mp3",
		type: "sfx",
		category: "brain-interaction",
		polishCategory: "interakcja-region-mózgu",
		metadata: {
			duration: 0.4,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["brain", "region", "select", "soft", "subtle"],
		polishTags: ["mózg", "region", "wybór", "miękki", "subtelny"],
	},
	{
		id: "brain-region-select-strong",
		url: "/audio/sfx/brain/region-select-strong.mp3",
		type: "sfx",
		category: "brain-interaction",
		polishCategory: "interakcja-region-mózgu",
		metadata: {
			duration: 0.6,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["brain", "region", "select", "strong", "emphasis"],
		polishTags: ["mózg", "region", "wybór", "mocny", "akcent"],
	},
	{
		id: "brain-region-hover",
		url: "/audio/sfx/brain/region-hover.mp3",
		type: "sfx",
		category: "brain-interaction",
		polishCategory: "interakcja-region-mózgu",
		metadata: {
			duration: 0.2,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["brain", "region", "hover", "subtle"],
		polishTags: ["mózg", "region", "najechanie", "subtelny"],
	},
	{
		id: "brain-ambient-neural",
		url: "/audio/ambient/brain/neural-activity.mp3",
		type: "ambient",
		category: "brain-atmosphere",
		polishCategory: "atmosfera-mózgu",
		metadata: {
			duration: 45.0,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["brain", "ambient", "neural", "activity", "physiological"],
		polishTags: [
			"mózg",
			"otoczenie",
			"neuronalny",
			"aktywność",
			"fizjologiczny",
		],
	},
	{
		id: "brain-ambient-cerebral",
		url: "/audio/ambient/brain/cerebral-rhythm.mp3",
		type: "ambient",
		category: "brain-atmosphere",
		polishCategory: "atmosfera-mózgu",
		metadata: {
			duration: 60.0,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["brain", "ambient", "cerebral", "rhythm", "calm"],
		polishTags: ["mózg", "otoczenie", "mózgowy", "rytm", "spokojny"],
	},
];

/**
 * Audio assets for neurotransmitter interactions
 */
export const neurotransmitterAudioAssets: AudioAsset[] = [
	{
		id: "neurotransmitter-dopamine-activate",
		url: "/audio/sfx/neurotransmitters/dopamine-activate.mp3",
		type: "sfx",
		category: "neurotransmitter",
		polishCategory: "neuroprzekaźnik",
		metadata: {
			duration: 0.8,
			sampleRate: 44100,
			channels: 2,
		},
		tags: [
			"neurotransmitter",
			"dopamine",
			"activation",
			"reward",
			"motivation",
		],
		polishTags: [
			"neuroprzekaźnik",
			"dopamina",
			"aktywacja",
			"nagroda",
			"motywacja",
		],
	},
	{
		id: "neurotransmitter-acetylcholine-activate",
		url: "/audio/sfx/neurotransmitters/acetylcholine-activate.mp3",
		type: "sfx",
		category: "neurotransmitter",
		polishCategory: "neuroprzekaźnik",
		metadata: {
			duration: 0.7,
			sampleRate: 44100,
			channels: 2,
		},
		tags: [
			"neurotransmitter",
			"acetylcholine",
			"activation",
			"memory",
			"learning",
		],
		polishTags: [
			"neuroprzekaźnik",
			"acetylocholina",
			"aktywacja",
			"pamięć",
			"uczenie",
		],
	},
	{
		id: "neurotransmitter-serotonin-activate",
		url: "/audio/sfx/neurotransmitters/serotonin-activate.mp3",
		type: "sfx",
		category: "neurotransmitter",
		polishCategory: "neuroprzekaźnik",
		metadata: {
			duration: 0.9,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["neurotransmitter", "serotonin", "activation", "mood", "calm"],
		polishTags: [
			"neuroprzekaźnik",
			"serotonina",
			"aktywacja",
			"nastrój",
			"spokój",
		],
	},
	{
		id: "neurotransmitter-gaba-activate",
		url: "/audio/sfx/neurotransmitters/gaba-activate.mp3",
		type: "sfx",
		category: "neurotransmitter",
		polishCategory: "neuroprzekaźnik",
		metadata: {
			duration: 0.6,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["neurotransmitter", "gaba", "activation", "inhibition", "calm"],
		polishTags: ["neuroprzekaźnik", "gaba", "aktywacja", "hamowanie", "spokój"],
	},
	{
		id: "neurotransmitter-glutamate-activate",
		url: "/audio/sfx/neurotransmitters/glutamate-activate.mp3",
		type: "sfx",
		category: "neurotransmitter",
		polishCategory: "neuroprzekaźnik",
		metadata: {
			duration: 0.5,
			sampleRate: 44100,
			channels: 2,
		},
		tags: [
			"neurotransmitter",
			"glutamate",
			"activation",
			"excitation",
			"learning",
		],
		polishTags: [
			"neuroprzekaźnik",
			"glutaminian",
			"aktywacja",
			"pobudzenie",
			"uczenie",
		],
	},
];

/**
 * Audio assets for supplement interactions
 */
export const supplementAudioAssets: AudioAsset[] = [
	{
		id: "supplement-enhance-light",
		url: "/audio/sfx/supplements/enhance-light.mp3",
		type: "sfx",
		category: "supplement-interaction",
		polishCategory: "interakcja-suplement",
		metadata: {
			duration: 0.8,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["supplement", "enhancement", "light", "subtle"],
		polishTags: ["suplement", "wzmacnianie", "lekki", "subtelny"],
	},
	{
		id: "supplement-enhance-strong",
		url: "/audio/sfx/supplements/enhance-strong.mp3",
		type: "sfx",
		category: "supplement-interaction",
		polishCategory: "interakcja-suplement",
		metadata: {
			duration: 1.2,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["supplement", "enhancement", "strong", "intense"],
		polishTags: ["suplement", "wzmacnianie", "mocny", "intensywny"],
	},
	{
		id: "supplement-protect",
		url: "/audio/sfx/supplements/protect.mp3",
		type: "sfx",
		category: "supplement-interaction",
		polishCategory: "interakcja-suplement",
		metadata: {
			duration: 0.9,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["supplement", "protection", "shield", "defense"],
		polishTags: ["suplement", "ochrona", "tarcza", "obrona"],
	},
	{
		id: "supplement-stimulate",
		url: "/audio/sfx/supplements/stimulate.mp3",
		type: "sfx",
		category: "supplement-interaction",
		polishCategory: "interakcja-suplement",
		metadata: {
			duration: 0.7,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["supplement", "stimulation", "energy", "activation"],
		polishTags: ["suplement", "stymulacja", "energia", "aktywacja"],
	},
];

/**
 * Audio assets for user interface feedback
 */
export const uiAudioAssets: AudioAsset[] = [
	{
		id: "ui-success-chime",
		url: "/audio/sfx/ui/success-chime.mp3",
		type: "sfx",
		category: "ui-feedback",
		polishCategory: "informacja-zwrotna-interfejsu",
		metadata: {
			duration: 0.5,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["ui", "success", "positive", "achievement"],
		polishTags: ["interfejs", "sukces", "pozytywne", "osiągnięcie"],
	},
	{
		id: "ui-error-boop",
		url: "/audio/sfx/ui/error-boop.mp3",
		type: "sfx",
		category: "ui-feedback",
		polishCategory: "informacja-zwrotna-interfejsu",
		metadata: {
			duration: 0.3,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["ui", "error", "negative", "warning"],
		polishTags: ["interfejs", "błąd", "negatywne", "ostrzeżenie"],
	},
	{
		id: "ui-navigation-click",
		url: "/audio/sfx/ui/navigation-click.mp3",
		type: "sfx",
		category: "ui-feedback",
		polishCategory: "informacja-zwrotna-interfejsu",
		metadata: {
			duration: 0.1,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["ui", "navigation", "click", "transition"],
		polishTags: ["interfejs", "nawigacja", "kliknięcie", "przejście"],
	},
	{
		id: "ui-button-hover",
		url: "/audio/sfx/ui/button-hover.mp3",
		type: "sfx",
		category: "ui-feedback",
		polishCategory: "informacja-zwrotna-interfejsu",
		metadata: {
			duration: 0.15,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["ui", "hover", "subtle", "interaction"],
		polishTags: ["interfejs", "najechanie", "subtelny", "interakcja"],
	},
];

/**
 * Audio assets for educational content and tutorials
 */
export const educationalAudioAssets: AudioAsset[] = [
	{
		id: "tutorial-welcome",
		url: "/audio/voice/tutorial-welcome.mp3",
		type: "voice",
		category: "educational",
		polishCategory: "edukacyjny",
		metadata: {
			duration: 8.5,
			sampleRate: 22050,
			channels: 1,
		},
		tags: ["tutorial", "welcome", "introduction", "polish"],
		polishTags: ["tutorial", "powitanie", "wprowadzenie", "polski"],
	},
	{
		id: "brain-region-tutorial",
		url: "/audio/voice/brain-region-tutorial.mp3",
		type: "voice",
		category: "educational",
		polishCategory: "edukacyjny",
		metadata: {
			duration: 12.3,
			sampleRate: 22050,
			channels: 1,
		},
		tags: ["tutorial", "brain", "region", "education", "polish"],
		polishTags: ["tutorial", "mózg", "region", "edukacja", "polski"],
	},
	{
		id: "neurotransmitter-tutorial",
		url: "/audio/voice/neurotransmitter-tutorial.mp3",
		type: "voice",
		category: "educational",
		polishCategory: "edukacyjny",
		metadata: {
			duration: 15.7,
			sampleRate: 22050,
			channels: 1,
		},
		tags: ["tutorial", "neurotransmitter", "education", "polish"],
		polishTags: ["tutorial", "neuroprzekaźnik", "edukacja", "polski"],
	},
	{
		id: "supplement-tutorial",
		url: "/audio/voice/supplement-tutorial.mp3",
		type: "voice",
		category: "educational",
		polishCategory: "edukacyjny",
		metadata: {
			duration: 18.2,
			sampleRate: 22050,
			channels: 1,
		},
		tags: ["tutorial", "supplement", "education", "polish"],
		polishTags: ["tutorial", "suplement", "edukacja", "polski"],
	},
];

/**
 * Background music assets
 */
export const musicAudioAssets: AudioAsset[] = [
	{
		id: "bg-calm-educational",
		url: "/audio/music/bg-calm-educational.mp3",
		type: "music",
		category: "background-music",
		polishCategory: "muzyka-tła",
		metadata: {
			duration: 180.0,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["music", "background", "calm", "educational", "ambient"],
		polishTags: ["muzyka", "tło", "spokojna", "edukacyjna", "otoczenie"],
	},
	{
		id: "bg-focused-study",
		url: "/audio/music/bg-focused-study.mp3",
		type: "music",
		category: "background-music",
		polishCategory: "muzyka-tła",
		metadata: {
			duration: 240.0,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["music", "background", "focus", "study", "concentration"],
		polishTags: ["muzyka", "tło", "koncentracja", "nauka", "skupienie"],
	},
	{
		id: "bg-relaxation",
		url: "/audio/music/bg-relaxation.mp3",
		type: "music",
		category: "background-music",
		polishCategory: "muzyka-tła",
		metadata: {
			duration: 300.0,
			sampleRate: 44100,
			channels: 2,
		},
		tags: ["music", "background", "relaxation", "calm", "meditation"],
		polishTags: ["muzyka", "tło", "relaksacja", "spokój", "medytacja"],
	},
];

/**
 * Combine all audio assets
 */
export const allAudioAssets: AudioAsset[] = [
	...brainRegionAudioAssets,
	...neurotransmitterAudioAssets,
	...supplementAudioAssets,
	...uiAudioAssets,
	...educationalAudioAssets,
	...musicAudioAssets,
];

/**
 * Brain region specific audio data
 */
export const brainRegionAudioData: Record<string, BrainRegionAudioData> = {
	"prefrontal-cortex": {
		regionId: "prefrontal-cortex",
		entrySound: "brain-region-select-strong",
		exitSound: "brain-region-hover",
		ambientSound: "brain-ambient-cerebral",
		selectionSound: "brain-region-select-soft",
		neurotransmitterSounds: {
			dopamine: "neurotransmitter-dopamine-activate",
			norepinephrine: "neurotransmitter-dopamine-activate",
			acetylcholine: "neurotransmitter-acetylcholine-activate",
		},
		supplementEffectSounds: {
			"omega-3-epa-dha": "supplement-enhance-light",
			"magnesium-l-threonate": "supplement-enhance-strong",
		},
	},
	hippocampus: {
		regionId: "hippocampus",
		entrySound: "brain-region-select-strong",
		exitSound: "brain-region-hover",
		ambientSound: "brain-ambient-neural",
		selectionSound: "brain-region-select-soft",
		neurotransmitterSounds: {
			acetylcholine: "neurotransmitter-acetylcholine-activate",
			gaba: "neurotransmitter-gaba-activate",
			glutamate: "neurotransmitter-glutamate-activate",
		},
		supplementEffectSounds: {
			"lions-mane-mushroom": "supplement-enhance-strong",
		},
	},
	amygdala: {
		regionId: "amygdala",
		entrySound: "brain-region-select-strong",
		exitSound: "brain-region-hover",
		selectionSound: "brain-region-select-soft",
		neurotransmitterSounds: {
			gaba: "neurotransmitter-gaba-activate",
			serotonin: "neurotransmitter-serotonin-activate",
			norepinephrine: "neurotransmitter-dopamine-activate",
		},
		supplementEffectSounds: {},
	},
};

/**
 * Neurotransmitter specific audio data
 */
export const neurotransmitterAudioData: Record<
	string,
	NeurotransmitterAudioData
> = {
	dopamine: {
		id: "dopamine",
		activationSound: "neurotransmitter-dopamine-activate",
		pathwaySound: "neurotransmitter-dopamine-activate",
		educationalNarration: "tutorial-neurotransmitter-tutorial",
		polishEducationalNarration:
			"Neuroprzekaźnik dopamina odpowiada za motywację, nagrodę i kontrolę ruchową. Jest kluczowy dla układu nagrody w mózgu.",
	},
	acetylcholine: {
		id: "acetylcholine",
		activationSound: "neurotransmitter-acetylcholine-activate",
		pathwaySound: "neurotransmitter-acetylcholine-activate",
		educationalNarration: "tutorial-neurotransmitter-tutorial",
		polishEducationalNarration:
			"Acetylocholina jest głównym neuroprzekaźnikiem dla pamięci i uczenia się. Wpływa na uwagę i funkcje poznawcze.",
	},
	serotonin: {
		id: "serotonin",
		activationSound: "neurotransmitter-serotonin-activate",
		pathwaySound: "neurotransmitter-serotonin-activate",
		educationalNarration: "tutorial-neurotransmitter-tutorial",
		polishEducationalNarration:
			"Serotonina reguluje nastrój, apetyt i sen. Jest ważna dla stabilności emocjonalnej i dobrego samopoczucia.",
	},
	gaba: {
		id: "gaba",
		activationSound: "neurotransmitter-gaba-activate",
		pathwaySound: "neurotransmitter-gaba-activate",
		educationalNarration: "tutorial-neurotransmitter-tutorial",
		polishEducationalNarration:
			"GABA jest głównym neuroprzekaźnikiem hamującym w mózgu. Pomaga w relaksacji i redukcji lęku.",
	},
	glutamate: {
		id: "glutamate",
		activationSound: "neurotransmitter-glutamate-activate",
		pathwaySound: "neurotransmitter-glutamate-activate",
		educationalNarration: "tutorial-neurotransmitter-tutorial",
		polishEducationalNarration:
			"Glutaminian jest głównym neuroprzekaźnikiem pobudzającym. Kluczowy dla uczenia się i pamięci.",
	},
};

/**
 * Supplement specific audio data
 */
export const supplementAudioData: Record<string, SupplementAudioData> = {
	"omega-3-epa-dha": {
		supplementId: "omega-3-epa-dha",
		activationSound: "supplement-enhance-light",
		effectSound: "supplement-enhance-light",
		educationalDescription: "tutorial-supplement-tutorial",
		polishEducationalDescription:
			"Kwasy Omega-3 EPA i DHA poprawiają płynność błon komórkowych i wspierają neuroplastyczność mózgu.",
	},
	"magnesium-l-threonate": {
		supplementId: "magnesium-l-threonate",
		activationSound: "supplement-enhance-strong",
		effectSound: "supplement-enhance-strong",
		educationalDescription: "tutorial-supplement-tutorial",
		polishEducationalDescription:
			"L-treonian magnezu wzmacnia funkcję receptorów NMDA i plastyczność synaptyczną w mózgu.",
	},
	"lions-mane-mushroom": {
		supplementId: "lions-mane-mushroom",
		activationSound: "supplement-enhance-strong",
		effectSound: "supplement-enhance-strong",
		educationalDescription: "tutorial-supplement-tutorial",
		polishEducationalDescription:
			"Soplówka jeżowata stymuluje produkcję czynnika wzrostu nerwów NGF i wspiera neurogenezę.",
	},
};

/**
 * Audio asset categories for easy filtering
 */
export const audioCategories = {
	BRAIN_INTERACTION: "brain-interaction",
	NEUROTRANSMITTER: "neurotransmitter",
	SUPPLEMENT_INTERACTION: "supplement-interaction",
	UI_FEEDBACK: "ui-feedback",
	EDUCATIONAL: "educational",
	BACKGROUND_MUSIC: "background-music",
	AMBIENT: "ambient",
} as const;

/**
 * Audio asset tags for advanced filtering
 */
export const audioTags = {
	// Interaction types
	SELECT: "select",
	HOVER: "hover",
	ACTIVATE: "activate",
	APPLY: "apply",

	// Intensity levels
	LIGHT: "light",
	STRONG: "strong",
	SUBTLE: "subtle",
	INTENSE: "intense",

	// Content types
	EDUCATIONAL: "educational",
	FEEDBACK: "feedback",
	NAVIGATION: "navigation",
	AMBIENT: "ambient",

	// Languages
	POLISH: "polish",
	ENGLISH: "english",

	// Brain specific
	NEURAL: "neural",
	CEREBRAL: "cerebral",
	PHYSIOLOGICAL: "physiological",
} as const;
