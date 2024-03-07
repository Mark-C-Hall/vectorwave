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

  // Mutation to create a new message by conversation ID
  createMessage: privateProcedure
    .input(
      z.object({
        content: z.string(),
        isFromUser: z.boolean(),
        conversationId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.message.create({
        data: {
          content: input.content,
          isFromUser: input.isFromUser,
          conversationId: input.conversationId,
        },
      });
    }),
});
