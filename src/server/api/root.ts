import { advancedSearchRouter } from "@/server/api/routers/advanced-search";
import { knowledgeRouter } from "@/server/api/routers/knowledge";
import { postRouter } from "@/server/api/routers/post";
import { recommendationsRouter } from "@/server/api/routers/recommendations";
import { supplementRouter } from "@/server/api/routers/supplement";
import { supplementHistoryRouter } from "@/server/api/routers/supplementHistory";

import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	post: postRouter,
	supplement: supplementRouter,
	knowledge: knowledgeRouter,
		supplementHistory: supplementHistoryRouter,

	advancedSearch: advancedSearchRouter,
	recommendations: recommendationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
