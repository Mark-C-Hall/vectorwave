import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const messageRouter = createTRPCRouter({
  // Query for fetching messages by conversation ID
  getMessagesByConversationId: privateProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        return await ctx.db.message.findMany({
          where: {
            conversationId: input.conversationId,
          },
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to fetch messages",
        });
      }
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
      try {
        return await ctx.db.message.create({
          data: {
            content: input.content,
            isFromUser: input.isFromUser,
            conversationId: input.conversationId,
          },
        });
      } catch (error) {
        console.error("Error creating message:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to create message",
        });
      }
    }),
});
