import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IPost extends Document {
	id: string;
	name: string;
	userId: string;
	createdAt: Date;
}

const PostSchema = new Schema<IPost>(
	{
		id: { type: String, required: true, unique: true, index: true },
		name: { type: String, required: true, trim: true, maxlength: 200 },
		userId: { type: String, required: true, index: true },
		createdAt: { type: Date, default: Date.now, index: true },
	},
	{
		timestamps: true,
		collection: "posts",
	},
);

PostSchema.index({ userId: 1, createdAt: -1 });

export const Post: Model<IPost> =
	mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
