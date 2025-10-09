"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// Extend Window interface for Speech Recognition API
declare global {
	interface Window {
		webkitSpeechRecognition: any;
		SpeechRecognition: any;
	}
}

interface VoiceSearchOptions {
	language?: string;
	continuous?: boolean;
	interimResults?: boolean;
	maxAlternatives?: number;
}

interface VoiceSearchResult {
	transcript: string;
	confidence: number;
	isFinal: boolean;
}

interface UseVoiceSearchReturn {
	isListening: boolean;
	isSupported: boolean;
	startListening: () => Promise<void>;
	stopListening: () => void;
	transcript: string;
	error: string | null;
	results: VoiceSearchResult[];
}

export function useVoiceSearch(options: VoiceSearchOptions = {}): UseVoiceSearchReturn {
	const [isListening, setIsListening] = useState(false);
	const [transcript, setTranscript] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [results, setResults] = useState<VoiceSearchResult[]>([]);

	const recognitionRef = useRef<any>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const {
		language = "pl-PL",
		continuous = false,
		interimResults = true,
		maxAlternatives = 1,
	} = options;

	// Check if browser supports speech recognition
	const isSupported = typeof window !== "undefined" && (
		'webkitSpeechRecognition' in window ||
		'SpeechRecognition' in window
	);

	// Get speech recognition constructor
	const getRecognition = useCallback(() => {
		if (typeof window === "undefined") return null;

		const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
		if (!SpeechRecognition) return null;

		const recognition = new SpeechRecognition();

		recognition.continuous = continuous;
		recognition.interimResults = interimResults;
		recognition.lang = language;
		recognition.maxAlternatives = maxAlternatives;

		return recognition;
	}, [continuous, interimResults, language, maxAlternatives]);

	// Process speech recognition results
	const processResults = useCallback((event: any) => {
		let finalTranscript = "";
		let interimTranscript = "";
		const newResults: VoiceSearchResult[] = [];

		for (let i = 0; i < event.results.length; i++) {
			const result = event.results[i];
			const text = result[0].transcript;
			const confidence = result[0].confidence || 0;

			newResults.push({
				transcript: text,
				confidence,
				isFinal: result.isFinal,
			});

			if (result.isFinal) {
				finalTranscript += text;
			} else {
				interimTranscript += text;
			}
		}

		setResults(newResults);

		if (finalTranscript) {
			setTranscript(prev => prev + finalTranscript);
		}
	}, []);

	// Handle speech recognition errors
	const handleError = useCallback((event: any) => {
		setError(`Błąd rozpoznawania mowy: ${event.error}`);
		setIsListening(false);

		// Auto-retry for certain errors
		if (event.error === 'no-speech' || event.error === 'audio-capture') {
			setTimeout(() => {
				if (recognitionRef.current && !isListening) {
					try {
						recognitionRef.current.start();
					} catch (e) {
						console.warn("Failed to restart recognition:", e);
					}
				}
			}, 1000);
		}
	}, [isListening]);

	// Handle recognition end
	const handleEnd = useCallback(() => {
		setIsListening(false);

		// Auto-restart if continuous mode is enabled
		if (continuous && recognitionRef.current) {
			timeoutRef.current = setTimeout(() => {
				try {
					recognitionRef.current.start();
				} catch (e) {
					console.warn("Failed to restart recognition:", e);
				}
			}, 100);
		}
	}, [continuous]);

	// Initialize recognition
	useEffect(() => {
		if (!isSupported) return;

		const recognition = getRecognition();
		if (!recognition) return;

		recognition.onresult = processResults;
		recognition.onerror = handleError;
		recognition.onend = handleEnd;

		recognitionRef.current = recognition;

		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.abort();
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [isSupported, getRecognition, processResults, handleError, handleEnd]);

	// Start listening
	const startListening = useCallback(async () => {
		if (!isSupported) {
			setError("Rozpoznawanie mowy nie jest obsługiwane w tej przeglądarce");
			return;
		}

		if (isListening) {
			setError("Rozpoznawanie mowy jest już aktywne");
			return;
		}

		try {
			setError(null);
			setTranscript("");
			setResults([]);

			if (recognitionRef.current) {
				recognitionRef.current.start();
				setIsListening(true);
			}
		} catch (err) {
			setError(`Nie udało się uruchomić rozpoznawania mowy: ${err}`);
			setIsListening(false);
		}
	}, [isSupported, isListening]);

	// Stop listening
	const stopListening = useCallback(() => {
		if (recognitionRef.current && isListening) {
			recognitionRef.current.stop();
			setIsListening(false);
		}
	}, [isListening]);

	return {
		isListening,
		isSupported,
		startListening,
		stopListening,
		transcript,
		error,
		results,
	};
}

// Natural Language Processing utilities for supplement search
export interface NLPAnalysis {
	keywords: string[];
	intents: string[];
	entities: {
		supplements: string[];
		benefits: string[];
		conditions: string[];
		compounds: string[];
	};
	sentiment: "positive" | "negative" | "neutral";
	urgency: "low" | "medium" | "high";
	queryType: "informational" | "navigational" | "transactional";
}

export function useNLPSearch() {
	// Simple NLP analysis for supplement queries
	const analyzeQuery = useCallback((query: string): NLPAnalysis => {
		const text = query.toLowerCase();
		const analysis: NLPAnalysis = {
			keywords: [],
			intents: [],
			entities: {
				supplements: [],
				benefits: [],
				conditions: [],
				compounds: [],
			},
			sentiment: "neutral",
			urgency: "low",
			queryType: "informational",
		};

		// Extract keywords (simple word tokenization)
		const words = text.split(/\s+/).filter(word => word.length > 2);
		analysis.keywords = words;

		// Identify supplement names
		const supplementKeywords = [
			"witamina", "vitamin", "mineral", "aminokwas", "amino acid", "zioło", "herb",
			"nootropik", "nootropic", "adaptogen", "koenzym", "coenzyme", "probiotyk", "probiotic",
			"enzym", "enzyme", "kwasy tłuszczowe", "fatty acid", "omega", "b-complex"
		];

		words.forEach(word => {
			if (supplementKeywords.some(keyword => word.includes(keyword))) {
				analysis.entities.supplements.push(word);
			}
		});

		// Identify benefits
		const benefitKeywords = [
			"pamięć", "memory", "koncentracja", "focus", "energia", "energy", "sen", "sleep",
			"stres", "stress", "nastrój", "mood", "odporność", "immune", "trawienie", "digestion",
			"stawy", "joints", "skóra", "skin", "włosy", "hair", "oczy", "eyes"
		];

		words.forEach(word => {
			if (benefitKeywords.some(keyword => word.includes(keyword))) {
				analysis.entities.benefits.push(word);
			}
		});

		// Identify conditions
		const conditionKeywords = [
			"bezsenność", "insomnia", "depresja", "depression", "lęk", "anxiety", "ból", "pain",
			"przeziębienie", "cold", "alergia", "allergy", "cukrzyca", "diabetes", "nadciśnienie", "hypertension"
		];

		words.forEach(word => {
			if (conditionKeywords.some(keyword => word.includes(keyword))) {
				analysis.entities.conditions.push(word);
			}
		});

		// Identify active compounds
		const compoundKeywords = [
			"kofeina", "caffeine", "teanina", "theanine", "kurkumina", "curcumin", "kwercetyna", "quercetin",
			"resweratrol", "resveratrol", "koenzym q10", "coenzyme q10", "magnez", "magnesium", "cynk", "zinc"
		];

		words.forEach(word => {
			if (compoundKeywords.some(keyword => word.includes(keyword))) {
				analysis.entities.compounds.push(word);
			}
		});

		// Determine intent
		if (text.includes("kupić") || text.includes("kup") || text.includes("cena") || text.includes("price")) {
			analysis.intents.push("purchase");
			analysis.queryType = "transactional";
		} else if (text.includes("gdzie") || text.includes("jak") || text.includes("where") || text.includes("how")) {
			analysis.intents.push("location");
			analysis.queryType = "navigational";
		} else {
			analysis.intents.push("information");
			analysis.queryType = "informational";
		}

		// Determine sentiment
		const positiveWords = ["dobry", "lepszy", "świetny", "pomaga", "działa", "polecam"];
		const negativeWords = ["zły", "gorszy", "nie działa", "skutki uboczne", "problem"];

		const positiveCount = words.filter(word => positiveWords.some(pw => word.includes(pw))).length;
		const negativeCount = words.filter(word => negativeWords.some(nw => word.includes(nw))).length;

		if (positiveCount > negativeCount) {
			analysis.sentiment = "positive";
		} else if (negativeCount > positiveCount) {
			analysis.sentiment = "negative";
		}

		// Determine urgency
		if (text.includes("pilnie") || text.includes("szybko") || text.includes("teraz") || text.includes("urgent")) {
			analysis.urgency = "high";
		} else if (text.includes("wkrótce") || text.includes("planuje") || text.includes("soon")) {
			analysis.urgency = "medium";
		}

		return analysis;
	}, []);

	// Generate search suggestions based on NLP analysis
	const generateSuggestions = useCallback((analysis: NLPAnalysis): string[] => {
		const suggestions: string[] = [];

		// Suggest based on identified supplements
		analysis.entities.supplements.forEach(supplement => {
			suggestions.push(supplement);
		});

		// Suggest based on benefits
		analysis.entities.benefits.forEach(benefit => {
			suggestions.push(`suplementy na ${benefit}`);
			suggestions.push(`${benefit} suplementy`);
		});

		// Suggest based on conditions
		analysis.entities.conditions.forEach(condition => {
			suggestions.push(`suplementy na ${condition}`);
			suggestions.push(`${condition} naturalne leczenie`);
		});

		// Suggest based on compounds
		analysis.entities.compounds.forEach(compound => {
			suggestions.push(`suplementy z ${compound}`);
			suggestions.push(`${compound} dawkowanie`);
		});

		// Remove duplicates and return top suggestions
		return [...new Set(suggestions)].slice(0, 5);
	}, []);

	// Enhanced search query based on NLP analysis
	const enhanceQuery = useCallback((originalQuery: string, analysis: NLPAnalysis): string => {
		let enhanced = originalQuery;

		// Add benefit-related terms
		if (analysis.entities.benefits.length > 0) {
			enhanced += ` ${analysis.entities.benefits.join(" ")}`;
		}

		// Add compound-related terms
		if (analysis.entities.compounds.length > 0) {
			enhanced += ` ${analysis.entities.compounds.join(" ")}`;
		}

		// Add category hints based on intent
		if (analysis.intents.includes("purchase") && !enhanced.includes("kupić")) {
			enhanced += " kupić cena";
		}

		return enhanced.trim();
	}, []);

	return {
		analyzeQuery,
		generateSuggestions,
		enhanceQuery,
	};
}