import { z } from "zod";

import { randomUUID } from "crypto";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	create: protectedProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			try {
				const userId = ctx.session.user.id;
				const post = await ctx.db.post.create({
					id: randomUUID(),
					name: input.name,
					userId,
					createdAt: new Date(),
				});
				return {
					id: post.id,
					name: post.name,
					createdAt: post.createdAt,
				};
			} catch (err) {
				throw new Error("Failed to create post");
			}
		}),

	getLatest: protectedProcedure.query(
		async ({ ctx }): Promise<{ id: string; name: string; createdAt: Date } | null> => {
			const userId = ctx.session.user.id;
			const latest = await ctx.db.post
				.findOne({ userId })
				.sort({ createdAt: -1 })
				.lean();
			return latest
				? { id: latest.id, name: latest.name, createdAt: latest.createdAt }
				: null;
		},
	),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});
