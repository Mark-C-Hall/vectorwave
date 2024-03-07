import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const messageRouter = createTRPCRouter({
  // Query for fetching messages by conversation ID
  getMessagesByConversationId: privateProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.message.findMany({
        where: {
          conversationId: input.conversationId,
        },
      });
    }),
});
