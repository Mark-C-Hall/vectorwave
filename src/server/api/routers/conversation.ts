import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const conversationRouter = createTRPCRouter({
  // Query to get all conversations by user
  getConversationsByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.conversation.findMany({
        where: {
          userId: input.userId,
        },
      });
    }),
});
