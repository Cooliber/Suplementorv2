import mongoose, {
	Schema,
	type Document,
	type Model,
	type Types,
} from "mongoose";

export type MedicineSystem =
	| "TCM"
	| "AYURVEDA"
	| "GREEK_ROMAN"
	| "EUROPEAN_HERBALISM"
	| "MODERN_SCIENCE"
	| "OTHER";

export interface INotablePractitioner {
	name: string;
	role?: string;
	era?: string;
}

export interface IHistorySource {
	title: string;
	author?: string;
	year?: number;
	url?: string;
}

export interface ISupplementHistory extends Document {
	id: string;
	title: string;
	polishTitle: string;
	era: string;
	eraStartYear: number; // negative for BCE
	eraEndYear: number; // negative for BCE
	medicineSystem: MedicineSystem;
	geographicRegion: string;
	description: string;
	polishDescription: string;
	keyDiscoveries: string[];
	notablePractitioners: INotablePractitioner[];
	relatedSupplements: Types.ObjectId[]; // refs ComprehensiveSupplement
	culturalContext?: string;
	sources: IHistorySource[];
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

const NotablePractitionerSchema = new Schema<INotablePractitioner>(
	{
		name: { type: String, required: true },
		role: { type: String },
		era: { type: String },
	},
	{ _id: false },
);

const HistorySourceSchema = new Schema<IHistorySource>(
	{
		title: { type: String, required: true },
		author: { type: String },
		year: { type: Number },
		url: { type: String },
	},
	{ _id: false },
);

const SupplementHistorySchema = new Schema<ISupplementHistory>(
	{
		id: { type: String, required: true, unique: true, index: true },
		title: { type: String, required: true, index: true },
		polishTitle: { type: String, required: true, index: true },
		era: { type: String, required: true },
		eraStartYear: { type: Number, required: true },
		eraEndYear: { type: Number, required: true },
		medicineSystem: {
			type: String,
			enum: [
				"TCM",
				"AYURVEDA",
				"GREEK_ROMAN",
				"EUROPEAN_HERBALISM",
				"MODERN_SCIENCE",
				"OTHER",
			],
			required: true,
			index: true,
		},
		geographicRegion: { type: String, required: true },
		description: { type: String, required: true },
		polishDescription: { type: String, required: true },
		keyDiscoveries: [{ type: String }],
		notablePractitioners: [NotablePractitionerSchema],
		relatedSupplements: [
			{
				type: Schema.Types.ObjectId,
				ref: "ComprehensiveSupplement",
				index: true,
			},
		],
		culturalContext: { type: String },
		sources: [HistorySourceSchema],
		tags: [{ type: String, index: true }],
	},
	{
		timestamps: true,
		collection: "supplement_history",
	},
);

// Text index for search in PL/EN titles and descriptions
SupplementHistorySchema.index({
	title: "text",
	polishTitle: "text",
	description: "text",
	polishDescription: "text",
});
// Timeline queries by medicine system and start year
SupplementHistorySchema.index({ medicineSystem: 1, eraStartYear: 1 });

const SupplementHistory: Model<ISupplementHistory> =
	mongoose.models.SupplementHistory ||
	mongoose.model<ISupplementHistory>(
		"SupplementHistory",
		SupplementHistorySchema,
	);

export default SupplementHistory;
export { SupplementHistorySchema };
