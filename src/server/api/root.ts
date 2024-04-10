import { createTRPCRouter } from "~/server/api/trpc";
import { conversationRouter } from "~/server/api/routers/conversation";
import { messageRouter } from "~/server/api/routers/message";
import { openaiRouter } from "~/server/api/routers/openai";
import { documentRouter } from "~/server/api/routers/document";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  conversation: conversationRouter,
  message: messageRouter,
  openai: openaiRouter,
  document: documentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
