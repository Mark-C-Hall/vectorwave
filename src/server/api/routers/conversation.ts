import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const conversationRouter = createTRPCRouter({
  // Query to get all conversations by user
  getConversationsByUser: privateProcedure.query(async ({ ctx }) => {
    try {
      const conversations = await ctx.db.conversation.findMany({
        where: {
          userId: ctx.userId,
        },
      });
      return conversations;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to fetch conversations",
      });
    }
  }),

  // Query to get a conversation by user id
  getConversationById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const conversation = await ctx.db.conversation.findUnique({
          where: {
            id: input.id,
          },
        });
        if (!conversation) {
          throw new Error("Conversation not found");
        }
        return conversation;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Unable to find the conversation",
        });
      }
    }),

  // Mutation to create a new conversation
  createConversation: privateProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const newConversation = await ctx.db.conversation.create({
          data: {
            userId: ctx.userId,
            title: input.title,
          },
        });
        return newConversation;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to create conversation",
        });
      }
    }),

  // Mutation to edit a conversation
  editConversation: privateProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const updatedConversation = await ctx.db.conversation.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
          },
        });
        return updatedConversation;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to edit conversation",
        });
      }
    }),

  // Mutation to delete a conversation
  deleteConversation: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.message.deleteMany({
          where: {
            conversationId: input.id,
          },
        });

        const deletedConversation = await ctx.db.conversation.delete({
          where: {
            id: input.id,
          },
        });

        return deletedConversation;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to delete conversation",
        });
      }
    }),
});
