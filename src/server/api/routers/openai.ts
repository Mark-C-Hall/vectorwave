import { z } from "zod";
import { OpenAI } from "openai";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const openaiRouter = createTRPCRouter({
  /**
   * Endpoint to generate a response from the Large Language Model (LLM) based on a conversation's context.
   * @param conversationId - The unique identifier for the conversation.
   * @returns An object containing the LLM's generated response.
   */
  generateLLMResponse: privateProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Retrieve the full conversation history from the database.
        const messages = await ctx.db.message.findMany({
          where: { conversationId: input.conversationId },
          orderBy: { createdAt: "asc" },
        });

        // Concatenate all messages to form a single prompt, labeled by sender.
        const prompt = messages.reduce((acc, message) => {
          const prefix = message.isFromUser ? "User:" : "";
          return acc + `${prefix} ${message.content}\n`;
        }, "");

        // Create an instance of the OpenAI API client.
        const openai = new OpenAI();

        // Query the OpenAI API with the assembled conversation history as the prompt.
        const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: prompt }],
          model: "gpt-3.5-turbo",
        });

        // Extract the response, ensuring it's a string and without the 'Bot:' prefix.
        let response = completion.choices[0]?.message?.content ?? "";
        if (response.startsWith("Bot:")) {
          response = response.substring(4).trimStart();
        }

        // Send back the LLM's response.
        return { response };
      } catch (error) {
        console.error("Error generating LLM response: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to generate response from OpenAI",
        });
      }
    }),

  // Get all documents by user
  getDocumentsByUser: privateProcedure.query(async ({ ctx }) => {
    try {
      const documents = await ctx.db.document.findMany({
        where: {
          userId: ctx.userId,
        },
      });
      return documents;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to fetch documents",
      });
    }
  }),

  // Upload a file
  uploadFile: privateProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.db.document.create({
          data: {
            userId: ctx.userId,
            title: input.title,
            content: input.content,
          },
        });
      } catch (error) {
        console.error("Error uploading file: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to upload file",
        });
      }
    }),

  // Edit Document Title
  editDocument: privateProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.db.document.update({
          where: { id: input.id },
          data: { title: input.title },
        });
      } catch (error) {
        console.error("Error editing document: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to edit document",
        });
      }
    }),

  // Delete Document
  deleteDocument: privateProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.db.document.delete({ where: { id: input } });
      } catch (error) {
        console.error("Error deleting document: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to delete document",
        });
      }
    }),
});
