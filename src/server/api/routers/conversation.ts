import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const conversationRouter = createTRPCRouter({
  // Query to get all conversations by user
  getConversationsByUser: privateProcedure.query(async ({ ctx }) => {
    return ctx.db.conversation.findMany({
      where: {
        userId: ctx.userId,
      },
    });
  }),

  // Mutation to create a new conversation
  createConversation: privateProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.conversation.create({
        data: {
          userId: ctx.userId,
          title: input.title,
        },
      });
    }),

  // Mutation to edit a conversation
  editConversation: privateProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.conversation.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
        },
      });
    }),
});
