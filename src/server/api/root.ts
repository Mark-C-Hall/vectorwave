import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { conversationRouter } from "./routers/conversation";
import { messageRouter } from "~/server/api/routers/message";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  conversation: conversationRouter,
  message: messageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
