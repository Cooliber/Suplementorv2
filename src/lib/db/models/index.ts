/**
 * MongoDB Models Index
 * Centralized export for all Mongoose models for Polish Supplement Education Platform
 */

import ComprehensiveSupplement from "./ComprehensiveSupplement";
import KnowledgeNode from "./KnowledgeNode";
import KnowledgeRelationship from "./KnowledgeRelationship";
// Core supplement and knowledge models
import Supplement from "./Supplement";

import Post from "./Post";
import SupplementHistory from "./SupplementHistory";

// Brain and neuroscience models
import BrainRegion from "./BrainRegion";
import NeurotransmitterSystem from "./NeurotransmitterSystem";

// Research and evidence models
import ResearchStudy from "./ResearchEvidence";

// User tracking models
import {
	EffectMeasurement,
	ProgressInsight,
	SupplementIntakeLog,
	SupplementSchedule,
} from "./UserTracking";

// AI recommendation models
import { AIRecommendation, UserHealthProfile } from "./AIRecommendations";

// Drug interaction models
import { DrugSupplementInteraction } from "./DrugInteractions";

// Circadian rhythm models
import CircadianSupplementTiming from "./CircadianSupplementTiming";

export {
	// Core models
	Supplement,
	ComprehensiveSupplement,
	KnowledgeNode,
	KnowledgeRelationship,
	Post,
		SupplementHistory,

	// Brain and neuroscience models


	BrainRegion,
	NeurotransmitterSystem,
	// Research models
	ResearchStudy,
	// User tracking models
	SupplementIntakeLog,
	EffectMeasurement,
	SupplementSchedule,
	ProgressInsight,
	// AI recommendation models
	UserHealthProfile,
	AIRecommendation,
	// Drug interaction models
	DrugSupplementInteraction,
	// Circadian rhythm models
	CircadianSupplementTiming,
	// Aliases for backward compatibility
	UserHealthProfile as UserHealthProfileModel,
	AIRecommendation as AIRecommendationModel,
};

// Type exports
export type {
	ISupplementDocument,
	ISupplementModel,
} from "./Supplement";

export type {
	IKnowledgeNodeDocument,
	IKnowledgeNodeModel,
} from "./KnowledgeNode";

export type {
	IKnowledgeRelationshipDocument,
	IKnowledgeRelationshipModel,
} from "./KnowledgeRelationship";

export type { IComprehensiveSupplement } from "./ComprehensiveSupplement";
export type { ISupplementHistory } from "./SupplementHistory";

export type { IBrainRegion } from "./BrainRegion";
export type { INeurotransmitterSystem } from "./NeurotransmitterSystem";
export type { IResearchStudy } from "./ResearchEvidence";
export type {
	ISupplementIntakeLog,
	IEffectMeasurement,
	ISupplementSchedule,
	IProgressInsight,
} from "./UserTracking";

export type { ICircadianSupplementTiming } from "./CircadianSupplementTiming";

// Re-export for convenience
export default {
	// Core models
	Supplement,
	ComprehensiveSupplement,
	KnowledgeNode,
		SupplementHistory,

	KnowledgeRelationship,
	Post,

	// Brain and neuroscience models
	BrainRegion,
	NeurotransmitterSystem,

	// Research models
	ResearchStudy,

	// User tracking models
	SupplementIntakeLog,
	EffectMeasurement,
	SupplementSchedule,
	ProgressInsight,

	// AI recommendation models
	UserHealthProfile,
	AIRecommendation,

	// Circadian rhythm models
	CircadianSupplementTiming,
};
